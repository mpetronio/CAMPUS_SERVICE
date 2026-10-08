import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '32kb' }));
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/requests', requestRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
