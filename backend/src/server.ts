import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { initTrashCleanup } from './services/trash.cleanup';

const app = express();

// Initialize 15-day trash cleanup worker
initTrashCleanup();

// CORS configuration matching .NET AllowAnyOrigin / AllowCredentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
app.use('/uploads', express.static(config.uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'bsnotes-backend', time: new Date() });
});

// API Routes
app.use('/api', apiRoutes);

// Root landing page
app.get('/', (req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>BsNotes API</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; }
    .card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); text-align: center; max-width: 420px; }
    h1 { margin: 0 0 0.5rem; color: #1e293b; font-size: 1.5rem; }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; background: #dcfce7; color: #15803d; border-radius: 9999px; font-weight: 600; font-size: 0.875rem; margin-bottom: 1rem; }
    p { color: #64748b; margin: 0.25rem 0; font-size: 0.95rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>BsNotes Node.js API</h1>
    <div class="badge">● Active &amp; Running</div>
    <p>Node.js + Express + Prisma (MySQL)</p>
    <p>Migrated successfully from BsNotesServices (.NET)</p>
  </div>
</body>
</html>`);
});

// Global Error Handler
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🚀 BsNotes Backend running on port ${PORT}`);
  console.log(`📦 Environment: ${config.nodeEnv}`);
  console.log(`===============================================`);
});

export default app;

