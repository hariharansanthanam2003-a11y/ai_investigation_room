import { describe, expect, it } from 'vitest';
import { validateGeneratedCase } from '../src/services/caseService.js';
import { publicCase } from '../src/utils/serialization.js';

const validCase = () => ({ title:'Test case', premise:'A mystery', incident:'An incident', setting:'A town', suspects:Array.from({length:3},(_,i)=>({id:`s${i}`,name:`Suspect ${i}`,occupation:'Artist',profile:'Profile',motive:'Motive',alibi:'Alibi',relevantFacts:[]})), timeline:[{id:'t1',timestamp:'2025-01-01T10:00:00Z',description:'Something happens',relatedSuspectIds:['s0'],relatedEvidenceIds:['e0']}], evidence:Array.from({length:8},(_,i)=>({id:`e${i}`,type:'document',title:`Evidence ${i}`,description:'Description',content:'Details',relatedSuspectIds:['s0'],relevance:'Relevant',isDecisive:i===0})), solution:{culpritSuspectId:'s0',motive:'A motive',explanation:'The explanation',sequenceOfEvents:['First','Then'],decisiveEvidenceIds:['e0'],redHerringExplanations:[]}});

describe('generated case validation',()=>{
  it('accepts valid references and a single existing culprit',()=>expect(validateGeneratedCase(validCase()).solution.culpritSuspectId).toBe('s0'));
  it('rejects a missing culprit',()=>{const c=validCase();c.solution.culpritSuspectId='missing';expect(()=>validateGeneratedCase(c)).toThrow();});
  it('rejects decisive evidence that is not playable',()=>{const c=validCase();c.solution.decisiveEvidenceIds=['missing'];expect(()=>validateGeneratedCase(c)).toThrow();});
  it('rejects invalid timeline timestamps',()=>{const c=validCase();c.timeline[0].timestamp='later';expect(()=>validateGeneratedCase(c)).toThrow();});
});

describe('public case serialization',()=>{
  it('removes culprit, solution, and private decisive flags',()=>{const c=validCase();const out=publicCase({_id:'case1',...c,toObject(){return {_id:'case1',...c}}});expect(out).not.toHaveProperty('solution');expect(out).not.toHaveProperty('culpritSuspectId');expect(out.evidence[0]).not.toHaveProperty('isDecisive');});
});
