import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { seedCarteles } from './seedCarteles.js';

const dataDir = path.resolve(import.meta.dirname, '..', 'data');
const dbPath = path.join(dataDir, 'horizonte.sqlite');

let db;

export function getDb() {
  if (!db) {
    throw new Error('La base de datos no está inicializada');
  }
  return db;
}

export function initDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS carteles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      direccion TEXT NOT NULL,
      zona TEXT NOT NULL,
      destacado INTEGER NOT NULL DEFAULT 0,
      image_path TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedAdmin();
  seedCartelesIfEmpty();
  return db;
}

function seedAdmin() {
  const count = db.prepare('SELECT COUNT(*) AS total FROM admins').get().total;
  if (count > 0) return;

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL y ADMIN_PASSWORD son obligatorios para crear el admin inicial');
  }

  db.prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)').run(
    email,
    bcrypt.hashSync(password, 10),
  );
}

function seedCartelesIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS total FROM carteles').get().total;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO carteles (titulo, direccion, zona, destacado, image_path)
    VALUES (@titulo, @direccion, @zona, @destacado, @image)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(item);
  });

  insertMany(seedCarteles);
}

export function toCartel(row) {
  return {
    id: row.id,
    titulo: row.titulo,
    direccion: row.direccion,
    zona: row.zona,
    destacado: Boolean(row.destacado),
    image: row.image_path,
  };
}
