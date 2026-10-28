import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { z } from 'zod';

const generatedSchema = z.object({ title: z.string(), premise: z.string(), incident: z.string(), setting: z.string(), suspects: z.array(z.object({ id: z.string(), name: z.string(), occupation: z.string(), profile: z.string(), motive: z.string(), alibi: z.string(), relevantFacts: z.array(z.string()).default([]) })).min(3).max(5), timeline: z.array(z.object({ id: z.string(), timestamp: z.string(), description: z.string(), relatedSuspectIds: z.array(z.string()).default([]), relatedEvidenceIds: z.array(z.string()).default([]) })), evidence: z.array(z.object({ id: z.string(), type: z.enum(['chat','image','cctv','document']), title: z.string(), description: z.string(), content: z.string(), fictionalTimestamp: z.string().optional(), relatedSuspectIds: z.array(z.string()).default([]), relevance: z.string(), isDecisive: z.boolean() })).min(8).max(12), solution: z.object({ culpritSuspectId: z.string(), motive: z.string(), explanation: z.string(), sequenceOfEvents: z.array(z.string()), decisiveEvidenceIds: z.array(z.string()).min(1), redHerringExplanations: z.array(z.string()).default([]) }) });

// Constrained JSON output prevents the model from inventing alternate field shapes.
const responseSchema = {
  type: 'OBJECT', required: ['title','premise','incident','setting','suspects','timeline','evidence','solution'],
  properties: {
    title:{type:'STRING'}, premise:{type:'STRING'}, incident:{type:'STRING'}, setting:{type:'STRING'},
    suspects:{type:'ARRAY',minItems:3,maxItems:5,items:{type:'OBJECT',required:['id','name','occupation','profile','motive','alibi','relevantFacts'],properties:{id:{type:'STRING'},name:{type:'STRING'},occupation:{type:'STRING'},profile:{type:'STRING'},motive:{type:'STRING'},alibi:{type:'STRING'},relevantFacts:{type:'ARRAY',items:{type:'STRING'}}}}},
    timeline:{type:'ARRAY',items:{type:'OBJECT',required:['id','timestamp','description','relatedSuspectIds','relatedEvidenceIds'],properties:{id:{type:'STRING'},timestamp:{type:'STRING'},description:{type:'STRING'},relatedSuspectIds:{type:'ARRAY',items:{type:'STRING'}},relatedEvidenceIds:{type:'ARRAY',items:{type:'STRING'}}}}},
    evidence:{type:'ARRAY',minItems:8,maxItems:12,items:{type:'OBJECT',required:['id','type','title','description','content','relatedSuspectIds','relevance','isDecisive'],properties:{id:{type:'STRING'},type:{type:'STRING',enum:['chat','image','cctv','document']},title:{type:'STRING'},description:{type:'STRING'},content:{type:'STRING'},fictionalTimestamp:{type:'STRING'},relatedSuspectIds:{type:'ARRAY',items:{type:'STRING'}},relevance:{type:'STRING'},isDecisive:{type:'BOOLEAN'}}}},
    solution:{type:'OBJECT',required:['culpritSuspectId','motive','explanation','sequenceOfEvents','decisiveEvidenceIds','redHerringExplanations'],properties:{culpritSuspectId:{type:'STRING'},motive:{type:'STRING'},explanation:{type:'STRING'},sequenceOfEvents:{type:'ARRAY',items:{type:'STRING'}},decisiveEvidenceIds:{type:'ARRAY',minItems:1,items:{type:'STRING'}},redHerringExplanations:{type:'ARRAY',items:{type:'STRING'}}}}
  }
};

export function validateGeneratedCase(raw) {
  const c = generatedSchema.parse(raw);
  const suspectIds = c.suspects.map(s => s.id), evidenceIds = c.evidence.map(e => e.id);
  if (new Set(suspectIds).size !== suspectIds.length || new Set(evidenceIds).size !== evidenceIds.length) throw new Error('AI returned duplicate identifiers');
  if (!suspectIds.includes(c.solution.culpritSuspectId)) throw new Error('Solution refers to a missing suspect');
  if (!c.solution.decisiveEvidenceIds.every(id => evidenceIds.includes(id))) throw new Error('Solution refers to missing evidence');
  for (const e of c.evidence) if (!e.relatedSuspectIds.every(id => suspectIds.includes(id))) throw new Error('Evidence refers to missing suspect');
  for (const t of c.timeline) if (!t.relatedSuspectIds.every(id => suspectIds.includes(id)) || !t.relatedEvidenceIds.every(id => evidenceIds.includes(id)) || Number.isNaN(Date.parse(t.timestamp))) throw new Error('Invalid timeline reference or timestamp');
  if (!c.evidence.some(e => c.solution.decisiveEvidenceIds.includes(e.id) && e.isDecisive)) throw new Error('Decisive evidence must be available to the player');
  return c;
}

export async function generateCase(input) {
  if (!env.geminiKey) throw Object.assign(new Error('Case generation needs a Gemini API key. You can still try the sample case.'), { status: 503, code: 'AI_UNAVAILABLE' });
  const ai = new GoogleGenAI({ apiKey: env.geminiKey });
  const prompt = `Create a fair, fictional ${input.difficulty} mystery investigation based on this scenario: ${input.scenario}\nSetting preference: ${input.setting || 'choose a fitting fictional setting'}. Category: ${input.category || 'any'}. Include these evidence types where practical: ${input.evidenceTypes?.join(', ') || 'choose a balanced mix'}. Return only JSON matching the response schema. Include 3-5 suspects and 8-12 evidence items. Each evidence content must be a plain string (for chats, format as a readable transcript). Ensure the mystery is logically solvable from player-visible evidence, exactly one culprit, unique IDs, references that all exist, and ISO timestamps. Set isDecisive true for every item named in solution.decisiveEvidenceIds. All people and communications are fictional. Never claim media is authentic.`;
  let lastError;
  let lastFailureType = 'validation';
  for (let attempt = 0; attempt < 2; attempt++) {
    let result;
    try {
      result = await ai.models.generateContent({ model: env.geminiModel, contents: attempt === 0 ? prompt : `${prompt}\n\nYour previous response failed validation: ${lastError.message}. Regenerate the complete case and correct that problem.`, config: { responseMimeType: 'application/json', responseSchema, maxOutputTokens: 8192 } });
    } catch (error) {
      lastError = error;
      lastFailureType = 'provider';
      console.error(`Gemini request ${attempt + 1} failed (${error.status || error.code || error.name || 'error'}): ${error.message}`);
      if (error.status === 401 || error.status === 403 || error.status === 404 || error.status === 429) break;
      continue;
    }
    try {
      const text = result.text?.trim();
      if (!text) throw new Error('Gemini returned an empty response');
      return validateGeneratedCase(JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '')));
    } catch (error) {
      lastError = error;
      lastFailureType = 'validation';
      const reason = error instanceof z.ZodError ? error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ') : error.message;
      console.error(`Gemini case attempt ${attempt + 1} failed (${error.status || error.code || error.name || 'error'}): ${reason}`);
    }
  }
  const providerFailure = lastFailureType === 'provider';
  throw Object.assign(new Error(providerFailure ? 'The case generator could not reach Gemini. Check the server Gemini key, model setting, network, and quota.' : 'Gemini returned case data that did not pass validation after two attempts. Please try again.'), { status: 502, code: providerFailure ? 'AI_PROVIDER_ERROR' : 'INVALID_AI_OUTPUT', cause: lastError });
}
