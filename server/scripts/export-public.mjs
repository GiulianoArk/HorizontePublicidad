import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { seedCarteles } from '../src/seedCarteles.js';

const root = path.resolve(fileURLToPath(import.meta.url), '..', '..', '..');
const dbPath = path.join(root, 'server', 'data', 'horizonte.sqlite');
const uploadsDir = path.join(root, 'server', 'uploads');
const publicDataDir = path.join(root, 'client', 'public', 'data');
const publicCartelesDir = path.join(root, 'client', 'public', 'carteles');

function rowsFromDb() {
  if (!fs.existsSync(dbPath)) return null;
  const db = new Database(dbPath, { readonly: true });
  try {
    const rows = db
      .prepare('SELECT id, titulo, direccion, zona, destacado, image_path FROM carteles ORDER BY id')
      .all();
    return rows.length ? rows : null;
  } finally {
    db.close();
  }
}

function rowsFromSeed() {
  return seedCarteles.map((item, index) => ({
    id: index + 1,
    titulo: item.titulo,
    direccion: item.direccion,
    zona: item.zona,
    destacado: item.destacado,
    image_path: item.image,
  }));
}

function toPublicImage(imagePath) {
  if (imagePath.startsWith('/uploads/')) {
    const filename = path.basename(imagePath);
    const source = path.join(uploadsDir, filename);
    if (!fs.existsSync(source)) {
      throw new Error(`Falta el archivo subido: ${filename}`);
    }
    fs.copyFileSync(source, path.join(publicCartelesDir, filename));
    return `/carteles/${filename}`;
  }
  return imagePath;
}

fs.mkdirSync(publicDataDir, { recursive: true });
fs.mkdirSync(publicCartelesDir, { recursive: true });

for (const file of fs.readdirSync(publicCartelesDir)) {
  if (file === '.gitkeep') continue;
  fs.unlinkSync(path.join(publicCartelesDir, file));
}

const rows = rowsFromDb() ?? rowsFromSeed();
const exported = rows.map((row) => ({
  id: row.id,
  titulo: row.titulo,
  direccion: row.direccion,
  zona: row.zona,
  destacado: Boolean(row.destacado),
  image: toPublicImage(row.image_path),
}));

fs.writeFileSync(
  path.join(publicDataDir, 'carteles.json'),
  `${JSON.stringify(exported, null, 2)}\n`,
  'utf8',
);

console.log(`Exportados ${exported.length} carteles → client/public/data/carteles.json`);
