# Deployment

## Local

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Vercel

This repository includes `vercel.json` so React Router routes such as `/incubator`, `/agency`, and `/dashboard/*` resolve to `index.html` on direct navigation.

Vercel settings:
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

If a backend is connected later, set `VITE_API_URL` in the Vercel environment variables.
