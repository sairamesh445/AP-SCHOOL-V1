import { Router } from 'express';
import { readDb, writeDb, generateId } from '../db.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

const SECTION_SLUGS = [
  'helpline',
  'fundamental_rights',
  'constitution_laws',
  'test_knowledge',
  'government_manifesto'
];

router.get('/categories', authMiddleware, (req, res) => {
  const db = readDb();
  const categories = db.categories
    .filter((c) => c.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(categories);
});

router.get('/items/:categoryId', authMiddleware, (req, res) => {
  const db = readDb();
  const items = db.contentItems
    .filter((i) => i.categoryId === req.params.categoryId && i.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(items);
});

router.get('/carousel', authMiddleware, (req, res) => {
  const db = readDb();
  const slides = db.carouselSlides
    .filter((s) => s.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(slides);
});

router.get('/sections', authMiddleware, (req, res) => {
  const db = readDb();
  const result = SECTION_SLUGS.map((slug) => {
    const category = db.categories.find((c) => c.slug === slug);
    const items = category
      ? db.contentItems
          .filter((i) => i.categoryId === category.id && i.active !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];
    return { slug, category, items };
  });
  res.json(result);
});

router.use(authMiddleware);
router.use(requireRole('platform_admin'));

router.get('/admin/categories', (req, res) => {
  res.json(readDb().categories);
});

router.post('/admin/categories', (req, res) => {
  const { name, slug, description, icon, order } = req.body;
  const db = readDb();
  const category = {
    id: generateId(),
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '_'),
    description: description || '',
    icon: icon || '📋',
    order: order || db.categories.length,
    active: true,
    createdAt: new Date().toISOString()
  };
  db.categories.push(category);
  writeDb(db);
  res.status(201).json(category);
});

router.put('/admin/categories/:id', (req, res) => {
  const db = readDb();
  const idx = db.categories.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.categories[idx] = { ...db.categories[idx], ...req.body };
  writeDb(db);
  res.json(db.categories[idx]);
});

router.delete('/admin/categories/:id', (req, res) => {
  const db = readDb();
  db.categories = db.categories.filter((c) => c.id !== req.params.id);
  db.contentItems = db.contentItems.filter((i) => i.categoryId !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

router.get('/admin/items', (req, res) => {
  const db = readDb();
  const { categoryId } = req.query;
  let items = db.contentItems;
  if (categoryId) items = items.filter((i) => i.categoryId === categoryId);
  res.json(items);
});

router.post('/admin/items', (req, res) => {
  const { categoryId, title, description, imageUrl, order, extra } = req.body;
  const db = readDb();
  const item = {
    id: generateId(),
    categoryId,
    title,
    description: description || '',
    imageUrl: imageUrl || '',
    order: order ?? db.contentItems.length,
    extra: extra || {},
    active: true,
    createdAt: new Date().toISOString()
  };
  db.contentItems.push(item);
  writeDb(db);
  res.status(201).json(item);
});

router.put('/admin/items/:id', (req, res) => {
  const db = readDb();
  const idx = db.contentItems.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.contentItems[idx] = { ...db.contentItems[idx], ...req.body };
  writeDb(db);
  res.json(db.contentItems[idx]);
});

router.delete('/admin/items/:id', (req, res) => {
  const db = readDb();
  db.contentItems = db.contentItems.filter((i) => i.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

router.get('/admin/carousel', (req, res) => {
  res.json(readDb().carouselSlides);
});

router.post('/admin/carousel', (req, res) => {
  const { imageUrl, caption, order } = req.body;
  const db = readDb();
  const slide = {
    id: generateId(),
    imageUrl,
    caption: caption || '',
    order: order ?? db.carouselSlides.length,
    active: true,
    createdAt: new Date().toISOString()
  };
  db.carouselSlides.push(slide);
  writeDb(db);
  res.status(201).json(slide);
});

router.put('/admin/carousel/:id', (req, res) => {
  const db = readDb();
  const idx = db.carouselSlides.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.carouselSlides[idx] = { ...db.carouselSlides[idx], ...req.body };
  writeDb(db);
  res.json(db.carouselSlides[idx]);
});

router.delete('/admin/carousel/:id', (req, res) => {
  const db = readDb();
  db.carouselSlides = db.carouselSlides.filter((s) => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

export default router;
