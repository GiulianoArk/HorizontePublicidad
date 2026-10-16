# Horizonte Publicidad

Monorepo con landing page (Vite + React) y API de carteles para uso **local**.

## Requisitos

- [Node.js](https://nodejs.org/) (LTS recomendado)
- [pnpm](https://pnpm.io/) 9.x

## Comandos (desde la raíz)

```bash
pnpm install
pnpm dev          # client + API (admin local)
pnpm dev:client   # solo front (galería estática en build)
pnpm export:public # SQLite → client/public/data/carteles.json
pnpm build
pnpm lint
pnpm preview
```

## Estructura

- `client/` — sitio web (se despliega en Vercel)
- `server/` — API + panel admin (solo en tu PC)

Documentación de contenido: [client/INSTRUCCIONES.md](client/INSTRUCCIONES.md)

## Deploy en Vercel (solo sitio público)

1. Editá carteles en local (`pnpm dev` → `/admin/login`).
2. Exportá para producción: `pnpm export:public`.
3. Commit de `client/public/data/carteles.json` y fotos en `client/public/carteles/` si las hay.
4. Push a GitHub.
5. En [vercel.com](https://vercel.com): **Import Project** → tu repo.
6. **Root Directory:** `client`
7. Framework: Vite (build `pnpm build`, output `dist`).

En Vercel la galería lee `/data/carteles.json` (sin API). En local, con `pnpm dev`, usa la API (`client/.env.development` tiene `VITE_USE_API=true`).

El panel `/admin` no funciona en producción; usalo solo en local para preparar contenido.
