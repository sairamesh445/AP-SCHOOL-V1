import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { readDb, writeDb, generateId } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);
router.use(requireRole('platform_admin'));

router.get('/', (req, res) => {
  const db = readDb();
  const schools = db.schools.map((school) => {
    const admin = db.users.find(
      (u) => u.schoolId === school.id && u.role === 'school_admin'
    );
    const studentCount = db.users.filter(
      (u) => u.schoolId === school.id && u.role === 'student'
    ).length;
    return { ...school, admin: admin ? { id: admin.id, username: admin.username, name: admin.name } : null, studentCount };
  });
  res.json(schools);
});

router.post('/', async (req, res) => {
  const { name, address, adminName, adminUsername, adminPassword } = req.body;
  if (!name || !adminUsername || !adminPassword) {
    return res.status(400).json({ error: 'School name and admin credentials required' });
  }

  const db = readDb();
  if (db.users.some((u) => u.username === adminUsername)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const schoolId = generateId();
  const school = {
    id: schoolId,
    name,
    address: address || '',
    createdAt: new Date().toISOString()
  };

  const admin = {
    id: generateId(),
    username: adminUsername,
    passwordHash: await bcrypt.hash(adminPassword, 10),
    role: 'school_admin',
    name: adminName || adminUsername,
    schoolId,
    createdAt: new Date().toISOString()
  };

  db.schools.push(school);
  db.users.push(admin);
  writeDb(db);

  res.status(201).json({ school, admin: { id: admin.id, username: admin.username, name: admin.name } });
});

router.put('/:id', async (req, res) => {
  const { name, address, adminName, adminUsername, adminPassword } = req.body;
  const db = readDb();
  const school = db.schools.find((s) => s.id === req.params.id);
  if (!school) return res.status(404).json({ error: 'School not found' });

  if (name) school.name = name;
  if (address !== undefined) school.address = address;

  const admin = db.users.find((u) => u.schoolId === school.id && u.role === 'school_admin');
  if (admin) {
    if (adminName) admin.name = adminName;
    if (adminUsername && adminUsername !== admin.username) {
      if (db.users.some((u) => u.username === adminUsername && u.id !== admin.id)) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      admin.username = adminUsername;
    }
    if (adminPassword) admin.passwordHash = await bcrypt.hash(adminPassword, 10);
  }

  writeDb(db);
  res.json({ success: true, school });
});

router.delete('/:id', (req, res) => {
  const db = readDb();
  const schoolId = req.params.id;
  db.schools = db.schools.filter((s) => s.id !== schoolId);
  db.users = db.users.filter((u) => u.schoolId !== schoolId);
  writeDb(db);
  res.json({ success: true });
});

export default router;
