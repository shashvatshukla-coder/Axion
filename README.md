# Foundry Club – frontend

Production-style frontend for a university entrepreneurship and technology club with two divisions
(Incubator: idea to product; Agency: paid client work) and a shared core team.

**Stack:** React 18, TypeScript (strict), Vite, Tailwind CSS, React Router, Framer Motion, Recharts, Lucide.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview
```

> Note: this project was written in an environment without npm access, so `npm install` and
> `npm run build` have **not** been run yet. If the build reports a type error, it is a small fix.

## Structure

```
src/
  components/   common/ (UI kit), dashboard/ (charts, kanban), layout/ (shells, nav)
  data/         mock data: projects, members, ideas, clients, startups, analytics, finance, operations
  hooks/        useAsync, useForm, useToast, useTheme, ...
  lib/          api.ts (mock + REST seam), utils.ts
  pages/        public/ (10 pages + 404), dashboard/ (17 pages)
  services/     one module per domain; the only place that touches data
  types/        shared domain types
```

Public routes: `/`, `/about`, `/incubator`, `/agency`, `/projects`, `/startups`, `/team`,
`/collaborations`, `/contact`, `/join`. Dashboard lives under `/dashboard/*`, lazy-loaded.
`Ctrl/Cmd+K` opens the command palette.

## Connecting a real backend

Services call `mockRequest(data)` from `src/lib/api.ts`. Set `VITE_API_URL` in `.env` and replace
each call with `http<T>('/ideas')` etc. Components never import mock data directly, so nothing else changes.
