import { Router } from 'express';
import { readDb, writeDb, generateId } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

function sortByOrder(items) {
  return items
    .filter((i) => i.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

router.get('/ministries', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().ministries || []));
});

router.get('/mps', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().mps || []));
});

router.get('/mlas', authMiddleware, (req, res) => {
  res.json(sortByOrder(readDb().mlas || []));
});

router.use(authMiddleware);
router.use(requireRole('platform_admin'));

// Ministries
router.get('/admin/ministries', (req, res) => res.json(readDb().ministries || []));

router.post('/admin/ministries', (req, res) => {
  const db = readDb();
  const item = {
    id: generateId(),
    name: req.body.name,
    ministerName: req.body.ministerName || '',
    department: req.body.department || '',
    responsibilities: req.body.responsibilities || '',
    photoUrl: req.body.photoUrl || '',
    order: req.body.order ?? (db.ministries?.length || 0),
    active: true,
    createdAt: new Date().toISOString()
  };
  db.ministries = db.ministries || [];
  db.ministries.push(item);
  writeDb(db);
  res.status(201).json(item);
});

router.put('/admin/ministries/:id', (req, res) => {
  const db = readDb();
  const idx = (db.ministries || []).findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.ministries[idx] = { ...db.ministries[idx], ...req.body };
  writeDb(db);
  res.json(db.ministries[idx]);
});

router.delete('/admin/ministries/:id', (req, res) => {
  const db = readDb();
  db.ministries = (db.ministries || []).filter((m) => m.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// MPs
router.get('/admin/mps', (req, res) => res.json(readDb().mps || []));

router.post('/admin/mps', (req, res) => {
  const db = readDb();
  const item = {
    id: generateId(),
    name: req.body.name,
    constituency: req.body.constituency,
    party: req.body.party || '',
    responsibilities: req.body.responsibilities || '',
    photoUrl: req.body.photoUrl || '',
    order: req.body.order ?? (db.mps?.length || 0),
    active: true,
    createdAt: new Date().toISOString()
  };
  db.mps = db.mps || [];
  db.mps.push(item);
  writeDb(db);
  res.status(201).json(item);
});

router.put('/admin/mps/:id', (req, res) => {
  const db = readDb();
  const idx = (db.mps || []).findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.mps[idx] = { ...db.mps[idx], ...req.body };
  writeDb(db);
  res.json(db.mps[idx]);
});

router.delete('/admin/mps/:id', (req, res) => {
  const db = readDb();
  db.mps = (db.mps || []).filter((m) => m.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// MLAs
router.get('/admin/mlas', (req, res) => res.json(readDb().mlas || []));

router.post('/admin/mlas', (req, res) => {
  const db = readDb();
  const item = {
    id: generateId(),
    name: req.body.name,
    constituency: req.body.constituency,
    party: req.body.party || '',
    order: req.body.order ?? (db.mlas?.length || 0),
    active: true,
    createdAt: new Date().toISOString()
  };
  db.mlas = db.mlas || [];
  db.mlas.push(item);
  writeDb(db);
  res.status(201).json(item);
});

router.put('/admin/mlas/:id', (req, res) => {
  const db = readDb();
  const idx = (db.mlas || []).findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.mlas[idx] = { ...db.mlas[idx], ...req.body };
  writeDb(db);
  res.json(db.mlas[idx]);
});

router.delete('/admin/mlas/:id', (req, res) => {
  const db = readDb();
  db.mlas = (db.mlas || []).filter((m) => m.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

export default router;
