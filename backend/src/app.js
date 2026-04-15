import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config.js';
import notesRouter from './routes/notes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/notes', notesRouter);

app.use(errorHandler);

export default app;
