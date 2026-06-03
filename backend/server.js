import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import schoolsRoutes from './routes/schools.js';
import usersRoutes from './routes/users.js';
import contentRoutes from './routes/content.js';
import hierarchyRoutes from './routes/hierarchy.js';
import quizRoutes from './routes/quiz.js';
import uploadRoutes from './routes/upload.js';
import governanceRoutes from './routes/governance.js';
import courtRoutes from './routes/court.js';
import civicRoutes, { migrateCivicData } from './routes/civic.js';
import { authMiddleware } from './middleware/auth.js';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/hierarchy', hierarchyRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/court', courtRoutes);
app.use('/api/civic', civicRoutes);

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Production: serve built React app from same origin (Render, VPS, etc.)
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const distIndex = path.join(distPath, 'index.html');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distIndex)) {
  app.use(express.static(distPath, { index: false, maxAge: '1h' }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    if (req.path.includes('.')) return next();
    res.sendFile(distIndex);
  });
}

// Merge legacy hyphenated civic keys into camelCase on startup
migrateCivicData();

app.listen(PORT, () => {
  console.log(`AP School API running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(distPath, 'index.html'))) {
    console.log('Serving frontend from frontend/dist');
  }
});
