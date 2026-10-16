# Publicar en Vercel (GitHub)

## 1. Preparar contenido

```bash
pnpm dev
# Editá carteles en http://localhost:5173/admin/login

pnpm export:public
pnpm build
pnpm preview
```

Revisá `http://localhost:4173` (home, contacto, galería).

## 2. Subir a GitHub

Si todavía no tenés repo:

```bash
git init -b main
git add -A
git commit -m "Initial commit: Horizonte Publicidad"
```

En GitHub: **New repository** → sin README (si ya commiteaste local).

```bash
git remote add origin https://github.com/TU_USUARIO/horizonte-publicidad.git
git push -u origin main
```

## 3. Conectar Vercel

1. [vercel.com/new](https://vercel.com/new) → Import Git Repository.
2. Elegí el repo.
3. **Root Directory:** `client`
4. Build: `pnpm build` · Output: `dist` · Install: `pnpm install`
5. Deploy.

No hace falta variable de entorno para la galería en producción.

## 4. Después de cambiar carteles en local

```bash
pnpm export:public
git add client/public/data client/public/carteles
git commit -m "Actualizar carteles publicados"
git push
```

Vercel redeploya solo.
