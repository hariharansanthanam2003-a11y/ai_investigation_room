import mongoose from 'mongoose';

const suspectSchema = new mongoose.Schema({ id: { type: String, required: true }, name: String, occupation: String, profile: String, motive: String, alibi: String, relevantFacts: [String] }, { _id: false });
const evidenceSchema = new mongoose.Schema({ id: { type: String, required: true }, type: String, title: String, description: String, content: mongoose.Schema.Types.Mixed, mediaUrl: String, fictionalTimestamp: String, relatedSuspectIds: [String], relevance: String, isDecisive: Boolean }, { _id: false });
const timelineSchema = new mongoose.Schema({ id: String, timestamp: String, description: String, relatedSuspectIds: [String], relatedEvidenceIds: [String] }, { _id: false });
const solutionSchema = new mongoose.Schema({ culpritSuspectId: String, motive: String, explanation: String, sequenceOfEvents: [String], decisiveEvidenceIds: [String], redHerringExplanations: [String] }, { _id: false });
const caseSchema = new mongoose.Schema({ title: { type: String, required: true }, scenario: String, premise: String, incident: String, setting: String, difficulty: String, status: { type: String, default: 'in_progress' }, suspects: [suspectSchema], evidence: [evidenceSchema], timeline: [timelineSchema], solution: solutionSchema, culpritSuspectId: String, sessionId: { type: String, required: true, index: true }, accusation: { suspectId: String, correct: Boolean, submittedAt: Date } }, { timestamps: true });
export default mongoose.model('Case', caseSchema);
