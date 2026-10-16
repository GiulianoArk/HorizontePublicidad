import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { clearAuthCookie, setAuthCookie, signToken } from '../auth.js';
import { getDb } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.post('/login', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const admin = getDb()
    .prepare('SELECT id, email, password_hash FROM admins WHERE email = ?')
    .get(email);

  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  setAuthCookie(res, signToken(admin));
  return res.json({ email: admin.email });
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  return res.json({ email: req.admin.email });
});

export default router;
