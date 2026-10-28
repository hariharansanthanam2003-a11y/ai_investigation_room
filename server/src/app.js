import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import Case from './models/Case.js';
import { createCaseSchema, accusationSchema } from './validators/case.js';
import { generateCase } from './services/caseService.js';
import { publicCase, resultCase } from './utils/serialization.js';

const app = express();
app.set('trust proxy', 1);
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '32kb' }));
app.use(session({ name: 'mystery.sid', secret: env.sessionSecret, resave: false, saveUninitialized: true, cookie: { httpOnly: true, sameSite: 'lax', secure: env.nodeEnv === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 } }));
app.use('/api/v1', (req, _res, next) => { if (!req.session.ownerId) req.session.ownerId = crypto.randomUUID(); next(); });
const api = express.Router();
api.get('/health', (_req, res) => res.json({ success: true, data: { live: true, database: mongoose.connection.readyState === 1 ? 'ready' : 'unavailable' }, error: null }));
api.post('/cases', rateLimit({ windowMs: 60_000, limit: 4, standardHeaders: true, legacyHeaders: false }), async (req, res, next) => {
  try {
    const input = createCaseSchema.parse(req.body);
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ success: false, data: null, error: { code: 'DATABASE_UNAVAILABLE', message: 'Case storage is unavailable. Please try again shortly.' } });
    const generated = await generateCase(input);
    const doc = await Case.create({ ...generated, scenario: input.scenario, difficulty: input.difficulty, setting: input.setting || generated.setting, sessionId: req.session.ownerId });
    res.status(201).json({ success: true, data: publicCase(doc), error: null });
  } catch (e) { next(e); }
});
api.get('/cases', async (req, res, next) => { try { if (mongoose.connection.readyState !== 1) return res.status(503).json({ success: false, data: null, error: { code: 'DATABASE_UNAVAILABLE', message: 'Case storage is unavailable.' } }); const docs = await Case.find({ sessionId: req.session.ownerId }).sort({ updatedAt: -1 }).limit(50); res.json({ success: true, data: docs.map(publicCase), error: null }); } catch (e) { next(e); } });
api.param('caseId', (req, res, next, id) => { if (!mongoose.isValidObjectId(id)) return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Case not found.' } }); next(); });
api.get('/cases/:caseId', async (req, res, next) => { try { const doc = await Case.findOne({ _id: req.params.caseId, sessionId: req.session.ownerId }); if (!doc) return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Case not found.' } }); res.json({ success: true, data: publicCase(doc), error: null }); } catch (e) { next(e); } });
api.get('/cases/:caseId/evidence/:evidenceId', async (req, res, next) => { try { const doc = await Case.findOne({ _id: req.params.caseId, sessionId: req.session.ownerId }); const item = doc?.evidence.find(e => e.id === req.params.evidenceId); if (!item) return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Evidence not found.' } }); const { isDecisive, ...data } = item.toObject(); res.json({ success: true, data, error: null }); } catch (e) { next(e); } });
api.post('/cases/:caseId/accusations', async (req, res, next) => { try { const { suspectId } = accusationSchema.parse(req.body); const doc = await Case.findOne({ _id: req.params.caseId, sessionId: req.session.ownerId }); if (!doc) return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Case not found.' } }); if (!doc.suspects.some(s => s.id === suspectId)) return res.status(422).json({ success: false, data: null, error: { code: 'INVALID_SUSPECT', message: 'Choose a suspect from this case.' } }); if (doc.accusation?.submittedAt) return res.status(409).json({ success: false, data: null, error: { code: 'ALREADY_SUBMITTED', message: 'An accusation has already been submitted.' } }); doc.accusation = { suspectId, correct: suspectId === doc.solution.culpritSuspectId, submittedAt: new Date() }; doc.status = 'solved'; await doc.save(); res.json({ success: true, data: resultCase(doc), error: null }); } catch (e) { next(e); } });
api.get('/cases/:caseId/result', async (req, res, next) => { try { const doc = await Case.findOne({ _id: req.params.caseId, sessionId: req.session.ownerId }); if (!doc) return res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Case not found.' } }); if (!doc.accusation?.submittedAt) return res.status(403).json({ success: false, data: null, error: { code: 'NOT_SOLVED', message: 'Submit an accusation before revealing the solution.' } }); res.json({ success: true, data: resultCase(doc), error: null }); } catch (e) { next(e); } });
app.use('/api/v1', api);
app.use((err, _req, res, _next) => { const status = err.status || (err.name === 'ZodError' ? 400 : 500); if (status >= 500) console.error('API error:', err.message); res.status(status).json({ success: false, data: null, error: { code: err.code || (status === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR'), message: status === 400 ? 'Please check your input and try again.' : err.status ? err.message : 'An unexpected error occurred.' } }); });
export default app;
