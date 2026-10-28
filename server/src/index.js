import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';

mongoose.connect(env.mongoUri).then(() => console.log('MongoDB connected')).catch(err => console.error('MongoDB unavailable:', err.message));
mongoose.connection.on('error', err => console.error('MongoDB connection error:', err.message));
app.listen(env.port, () => console.log(`AI Mystery Room API listening on port ${env.port}`));
