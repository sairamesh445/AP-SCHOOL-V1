import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { readDb } from '../db.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const db = readDb();
  const user = db.users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const school = user.schoolId
    ? db.schools.find((s) => s.id === user.schoolId)
    : null;

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
    schoolId: user.schoolId || null,
    name: user.name,
    quizSeed: Math.floor(Math.random() * 1_000_000_000)
  });

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      schoolId: user.schoolId || null,
      schoolName: school?.name || null
    }
  });
});

export default router;
