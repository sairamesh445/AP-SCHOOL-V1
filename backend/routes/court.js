import { Router } from 'express';
import { readDb, writeDb, generateId } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

function sortActive(items) {
  return (items || [])
    .filter((i) => i.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

router.get('/positions', authMiddleware, (req, res) => {
  res.json(sortActive(readDb().courtPositions));
});

router.get('/authorities', authMiddleware, (req, res) => {
  res.json(sortActive(readDb().courtAuthorities));
});

router.use(authMiddleware);
router.use(requireRole('platform_admin'));

router.get('/admin/positions', (req, res) => res.json(readDb().courtPositions || []));
router.get('/admin/authorities', (req, res) => res.json(readDb().courtAuthorities || []));

router.post('/admin/positions', (req, res) => {
  const db = readDb();
  const item = {
    id: generateId(),
    title: req.body.title,
    designation: req.body.designation || req.body.title,
    personName: req.body.personName || '',
    personPhoto: req.body.personPhoto || '',
    responsibilities: req.body.responsibilities || '',
    slot: req.body.slot || 'other',
    order: req.body.order ?? (db.courtPositions?.length || 0),
    active: true,
    createdAt: new Date().toISOString()
  };
  db.courtPositions = db.courtPositions || [];
  db.courtPositions.push(item);
  writeDb(db);
  res.status(201).json(item);
});

router.put('/admin/positions/:id', (req, res) => {
  const db = readDb();
  const idx = (db.courtPositions || []).findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.courtPositions[idx] = { ...db.courtPositions[idx], ...req.body };
  writeDb(db);
  res.json(db.courtPositions[idx]);
});

router.delete('/admin/positions/:id', (req, res) => {
  const db = readDb();
  db.courtPositions = (db.courtPositions || []).filter((p) => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

router.post('/admin/authorities', (req, res) => {
  const db = readDb();
  const item = {
    id: generateId(),
    name: req.body.name,
    designation: req.body.designation || '',
    role: req.body.role || '',
    responsibilities: req.body.responsibilities || '',
    photoUrl: req.body.photoUrl || '',
    order: req.body.order ?? (db.courtAuthorities?.length || 0),
    active: true,
    createdAt: new Date().toISOString()
  };
  db.courtAuthorities = db.courtAuthorities || [];
  db.courtAuthorities.push(item);
  writeDb(db);
  res.status(201).json(item);
});

router.put('/admin/authorities/:id', (req, res) => {
  const db = readDb();
  const idx = (db.courtAuthorities || []).findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.courtAuthorities[idx] = { ...db.courtAuthorities[idx], ...req.body };
  writeDb(db);
  res.json(db.courtAuthorities[idx]);
});

router.delete('/admin/authorities/:id', (req, res) => {
  const db = readDb();
  db.courtAuthorities = (db.courtAuthorities || []).filter((a) => a.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

export default router;
