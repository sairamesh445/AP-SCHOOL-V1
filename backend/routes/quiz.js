import { Router } from 'express';
import { readDb, writeDb, generateId } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace(arr, rnd) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildQuizSet({ questions, seed, count }) {
  const rnd = mulberry32(Number(seed) || Date.now());
  const picked = shuffleInPlace([...questions], rnd).slice(0, Math.max(1, Math.min(count, questions.length)));
  return picked.map((q) => ({
    ...q,
    options: shuffleInPlace([...(q.options || [])], rnd)
  }));
}

router.get('/', authMiddleware, (req, res) => {
  const db = readDb();
  const all = db.quizQuestions
    .filter((q) => q.active !== false)
    .map(({ correctAnswer, ...q }) => q);

  const count = Number(req.query.count) || 10;
  const seed = req.user?.quizSeed ?? Date.now();
  const questions = buildQuizSet({ questions: all, seed, count });
  res.json(questions);
});

router.post('/submit', authMiddleware, (req, res) => {
  const { answers, count } = req.body;
  const db = readDb();
  const active = db.quizQuestions.filter((q) => q.active !== false);
  const quizCount = Number(count) || 10;
  const seed = req.user?.quizSeed ?? Date.now();
  const questions = buildQuizSet({ questions: active, seed, count: quizCount });
  let score = 0;
  const results = questions.map((q) => {
    const userAnswer = answers?.[q.id];
    const correct = userAnswer === q.correctAnswer;
    if (correct) score++;
    return { id: q.id, correct, correctAnswer: q.correctAnswer };
  });
  res.json({ score, total: questions.length, results });
});

router.use(authMiddleware);
router.use(requireRole('platform_admin'));

router.get('/admin', (req, res) => {
  res.json(readDb().quizQuestions);
});

router.post('/admin', (req, res) => {
  const { question, options, correctAnswer, explanation } = req.body;
  const db = readDb();
  const q = {
    id: generateId(),
    question,
    options: options || [],
    correctAnswer,
    explanation: explanation || '',
    active: true,
    createdAt: new Date().toISOString()
  };
  db.quizQuestions.push(q);
  writeDb(db);
  res.status(201).json(q);
});

router.put('/admin/:id', (req, res) => {
  const db = readDb();
  const idx = db.quizQuestions.findIndex((q) => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.quizQuestions[idx] = { ...db.quizQuestions[idx], ...req.body };
  writeDb(db);
  res.json(db.quizQuestions[idx]);
});

router.delete('/admin/:id', (req, res) => {
  const db = readDb();
  db.quizQuestions = db.quizQuestions.filter((q) => q.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

export default router;
