import { Router } from 'express';
import { getDb, toCartel } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { handleUploadError, removeUploadIfLocal, uploadImage } from '../uploads.js';

const router = Router();

function readFields(body) {
  const titulo = String(body?.titulo ?? '').trim();
  const direccion = String(body?.direccion ?? '').trim();
  const zona = String(body?.zona ?? '').trim();
  const destacado = ['true', '1', 'on'].includes(String(body?.destacado ?? '').toLowerCase())
    ? 1
    : 0;

  if (!titulo || !direccion || !zona) {
    return { error: 'Título, dirección y zona son obligatorios' };
  }
  if (titulo.length > 120 || direccion.length > 200 || zona.length > 60) {
    return { error: 'Uno de los campos supera el largo permitido' };
  }

  return { titulo, direccion, zona, destacado };
}

router.get('/', (_req, res) => {
  const rows = getDb()
    .prepare('SELECT * FROM carteles ORDER BY destacado DESC, id DESC')
    .all();
  return res.json(rows.map(toCartel));
});

router.post('/', requireAuth, uploadImage.single('image'), handleUploadError, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'La imagen es obligatoria' });
  }

  const fields = readFields(req.body);
  if (fields.error) {
    removeUploadIfLocal(`/uploads/${req.file.filename}`);
    return res.status(400).json({ error: fields.error });
  }

  const imagePath = `/uploads/${req.file.filename}`;
  const result = getDb()
    .prepare(`
      INSERT INTO carteles (titulo, direccion, zona, destacado, image_path)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(fields.titulo, fields.direccion, fields.zona, fields.destacado, imagePath);

  const row = getDb().prepare('SELECT * FROM carteles WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(toCartel(row));
});

router.put('/:id', requireAuth, uploadImage.single('image'), handleUploadError, (req, res) => {
  const id = Number(req.params.id);
  const existing = getDb().prepare('SELECT * FROM carteles WHERE id = ?').get(id);
  if (!existing) {
    if (req.file) removeUploadIfLocal(`/uploads/${req.file.filename}`);
    return res.status(404).json({ error: 'Cartel no encontrado' });
  }

  const fields = readFields(req.body);
  if (fields.error) {
    if (req.file) removeUploadIfLocal(`/uploads/${req.file.filename}`);
    return res.status(400).json({ error: fields.error });
  }

  let imagePath = existing.image_path;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
    removeUploadIfLocal(existing.image_path);
  }

  getDb()
    .prepare(`
      UPDATE carteles
      SET titulo = ?, direccion = ?, zona = ?, destacado = ?, image_path = ?, updated_at = datetime('now')
      WHERE id = ?
    `)
    .run(fields.titulo, fields.direccion, fields.zona, fields.destacado, imagePath, id);

  const row = getDb().prepare('SELECT * FROM carteles WHERE id = ?').get(id);
  return res.json(toCartel(row));
});

router.delete('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = getDb().prepare('SELECT * FROM carteles WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Cartel no encontrado' });
  }

  getDb().prepare('DELETE FROM carteles WHERE id = ?').run(id);
  removeUploadIfLocal(existing.image_path);
  return res.status(204).end();
});

export default router;
