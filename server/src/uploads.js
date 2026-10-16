import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import multer from 'multer';

export const uploadsDir = path.resolve(import.meta.dirname, '..', 'uploads');

const allowedMime = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = allowedMime.get(file.mimetype) ?? '';
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMime.has(file.mimetype)) {
      cb(new Error('La imagen debe ser JPEG, PNG o WebP'));
      return;
    }
    cb(null, true);
  },
});

export function removeUploadIfLocal(imagePath) {
  if (!imagePath?.startsWith('/uploads/')) return;
  const filename = path.basename(imagePath);
  const full = path.join(uploadsDir, filename);
  if (fs.existsSync(full)) fs.unlinkSync(full);
}

export function handleUploadError(err, _req, res, next) {
  if (!err) return next();
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'La imagen no puede superar 5 MB' });
  }
  if (err.message === 'La imagen debe ser JPEG, PNG o WebP') {
    return res.status(400).json({ error: err.message });
  }
  return next(err);
}
