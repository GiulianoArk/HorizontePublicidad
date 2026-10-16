import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import cartelesRoutes from './routes/carteles.js';
import { uploadsDir } from './uploads.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET es obligatorio');
  process.exit(1);
}

initDb();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));
app.use('/api/auth', authRoutes);
app.use('/api/carteles', cartelesRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`API en http://localhost:${port}`);
});
