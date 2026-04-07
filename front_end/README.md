# Frontend Salon (React + Vite)

## Requisitos

- Node.js 20+
- npm 10+

## Variables de entorno

Este frontend usa variables de Vite:

- `VITE_API_URL`: URL base del backend, por ejemplo `https://api.tu-dominio.com/api`
- `VITE_RECAPTCHA_SITE_KEY`: site key publica de reCAPTCHA

Usa `.env.example` como referencia para crear tus variables locales o de produccion.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build local

```bash
npm run build
npm run preview
```

## Despliegue en Vercel

Este proyecto esta preparado para Vercel con:

- Build command: `npm run build`
- Output directory: `dist`
- Fallback SPA en `vercel.json` para rutas de React Router

### Opcion A: importando el repositorio en Vercel

1. Crear un nuevo proyecto en Vercel y conectar el repositorio.
2. Configurar Root Directory en `front_end`.
3. Framework Preset: Vite.
4. Definir variables en Vercel Project Settings:
	- `VITE_API_URL`
	- `VITE_RECAPTCHA_SITE_KEY`
5. Deploy.

### Opcion B: CLI de Vercel

Desde la carpeta `front_end`:

```bash
vercel
```

Para produccion:

```bash
vercel --prod
```

## Nota sobre API

En local, Vite tiene proxy para `/api` hacia `http://localhost:5000` en `vite.config.js`.
En produccion no se usa ese proxy: el frontend consume `VITE_API_URL`.
