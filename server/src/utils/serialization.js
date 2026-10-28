export function publicCase(doc) {
  const c = doc.toObject ? doc.toObject() : doc;
  return { id: String(c._id), title: c.title, premise: c.premise, incident: c.incident, setting: c.setting, difficulty: c.difficulty, status: c.status, suspects: c.suspects.map(({ id, name, occupation, profile, motive, alibi, relevantFacts }) => ({ id, name, occupation, profile, motive, alibi, relevantFacts })), evidence: c.evidence.map(({ isDecisive, ...e }) => e), timeline: c.timeline, createdAt: c.createdAt, updatedAt: c.updatedAt };
}
export function resultCase(doc) {
  const c = doc.toObject ? doc.toObject() : doc;
  return { correct: c.accusation.correct, selectedSuspectId: c.accusation.suspectId, culpritSuspectId: c.solution.culpritSuspectId, motive: c.solution.motive, explanation: c.solution.explanation, sequenceOfEvents: c.solution.sequenceOfEvents, decisiveEvidence: c.solution.decisiveEvidenceIds.map(id => c.evidence.find(e => e.id === id)).filter(Boolean).map(({ id, title, description }) => ({ id, title, description })), redHerringExplanations: c.solution.redHerringExplanations };
}
