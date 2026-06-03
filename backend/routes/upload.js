import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = Router();

router.post(
  '/',
  authMiddleware,
  requireRole('platform_admin'),
  (req, res, next) => {
    uploadImage.single('image')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: 'No image file provided' });
      res.json({ url: `/uploads/${req.file.filename}` });
    });
  }
);

export default router;
