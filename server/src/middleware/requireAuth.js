import { COOKIE_NAME, verifyToken } from '../auth.js';
import { getDb } from '../db.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const payload = verifyToken(token);
    const admin = getDb()
      .prepare('SELECT id, email FROM admins WHERE id = ?')
      .get(payload.sub);

    if (!admin) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    req.admin = admin;
    return next();
  } catch {
    return res.status(401).json({ error: 'No autorizado' });
  }
}
