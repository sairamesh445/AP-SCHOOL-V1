import { Router } from 'express';
import { readDb, writeDb, generateId } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  const db = readDb();
  const positions = db.hierarchyPositions
    .filter((p) => p.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(positions);
});

router.use(authMiddleware);
router.use(requireRole('platform_admin'));

router.get('/admin', (req, res) => {
  res.json(readDb().hierarchyPositions);
});

router.post('/admin', (req, res) => {
  const {
    title,
    designation,
    personName,
    personPhoto,
    responsibilities,
    x,
    y,
    width,
    height,
    order,
    level,
    slot
  } = req.body;

  const db = readDb();
  const position = {
    id: generateId(),
    title,
    designation: designation || title,
    personName: personName || '',
    personPhoto: personPhoto || '',
    responsibilities: responsibilities || '',
    slot: slot || 'other',
    x: x ?? 50,
    y: y ?? 50,
    width: width ?? 120,
    height: height ?? 60,
    order: order ?? db.hierarchyPositions.length,
    level: level || 'assembly',
    active: true,
    createdAt: new Date().toISOString()
  };

  db.hierarchyPositions.push(position);
  writeDb(db);
  res.status(201).json(position);
});

router.put('/admin/:id', (req, res) => {
  const db = readDb();
  const idx = db.hierarchyPositions.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.hierarchyPositions[idx] = { ...db.hierarchyPositions[idx], ...req.body };
  writeDb(db);
  res.json(db.hierarchyPositions[idx]);
});

router.delete('/admin/:id', (req, res) => {
  const db = readDb();
  db.hierarchyPositions = db.hierarchyPositions.filter((p) => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

export default router;
