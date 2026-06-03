import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { readDb, writeDb, generateId } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/students', requireRole('school_admin'), (req, res) => {
  const db = readDb();
  const students = db.users
    .filter((u) => u.role === 'student' && u.schoolId === req.user.schoolId)
    .map(({ passwordHash, ...rest }) => rest);
  res.json(students);
});

router.post('/students', requireRole('school_admin'), async (req, res) => {
  const { username, password, name, className, rollNumber } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Username, password, and name required' });
  }

  const db = readDb();
  if (db.users.some((u) => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const student = {
    id: generateId(),
    username,
    passwordHash: await bcrypt.hash(password, 10),
    role: 'student',
    name,
    className: className || '',
    rollNumber: rollNumber || '',
    schoolId: req.user.schoolId,
    createdAt: new Date().toISOString()
  };

  db.users.push(student);
  writeDb(db);

  const { passwordHash, ...safe } = student;
  res.status(201).json(safe);
});

router.delete('/students/:id', requireRole('school_admin'), (req, res) => {
  const db = readDb();
  const student = db.users.find((u) => u.id === req.params.id);
  if (!student || student.role !== 'student' || student.schoolId !== req.user.schoolId) {
    return res.status(404).json({ error: 'Student not found' });
  }
  db.users = db.users.filter((u) => u.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

export default router;
