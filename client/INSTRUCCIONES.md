# Horizonte Publicidad - Landing Page

Landing page para empresa de alquiler de carteles publicitarios.

## Características

- Galería de carteles con filtros por zona, imágenes y ubicaciones
- Modal con consulta directa por WhatsApp por cartel
- Botón flotante de WhatsApp
- Diseño responsive (móvil y desktop)

## Personalización

### 1. Contacto y WhatsApp

Edita el archivo: `src/config/contact.js`

```javascript
export const phoneNumber = '5491112345678'; // CAMBIAR por el número real
export const contactPhoneDisplay = '+54 9 11 1234-5678';
export const contactEmail = 'contacto@horizontepub.com';
```

**Formato del número WhatsApp (Argentina):** `549` + código de área sin 0 + número.

### 2. Agregar / editar carteles

Con el proyecto corriendo (`pnpm dev`), entrá a `/admin/login`. Desde el panel se pueden crear, editar y eliminar carteles, con foto, título, dirección, zona y destacado.

En **local** (`pnpm dev`) la galería usa la API. Antes de subir a Vercel ejecutá `pnpm export:public` desde la raíz; en producción se sirve `public/data/carteles.json`. Credenciales del admin: `server/.env`.

### 3. Fotos

Las fotos se suben desde el panel (JPEG, PNG o WebP, hasta 5 MB). El servidor las guarda en `server/uploads/`.

### 4. Colores y tipografía

Variables globales en `src/index.css` (`--color-accent`, `--color-bg-dark`, etc.).

## Ejecutar el proyecto

Desde la raíz del monorepo:

```bash
pnpm install
pnpm dev
pnpm build
```

Solo el client:

```bash
pnpm --filter client dev
```

## Enlaces rápidos

- Carteles: panel `/admin`
- Contacto / WhatsApp: `src/config/contact.js`
- Estilos home: `src/css/mainhome.css`
- Header y navegación: `src/components/Header.jsx`

---

Los carteles de ejemplo se cargan la primera vez que arranca la API. Después se administran desde el panel.
