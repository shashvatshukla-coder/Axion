# Foundry Club

React 18 + TypeScript + Vite frontend, Express 5 API, and PostgreSQL database, compatible with Supabase PostgreSQL. The dashboard is restricted to club administrators. Public visitors can submit ideas, project requests, messages, and membership applications.

## Local setup

1. Run `npm ci` and copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD` (12+ characters).
3. For a local database, set `POSTGRES_PASSWORD` and run `docker compose up -d`. Match that password in `DATABASE_URL`.
4. Run `npm run db:setup` to apply the migration and create the first administrator. Remove `ADMIN_PASSWORD` afterward.
5. Run `npm run dev`; open http://localhost:5173 and sign in at `/dashboard`.

Database migrations are repeatable. No mock records are automatically imported: your live database starts empty. The fixtures in `src/data` are retained for reference, but operational services and public counters now call the API.

## Validation

```bash
npm run test:api
npm run typecheck:api
npm run build
```

Integration tests run the Express application against PGlite, an embedded PostgreSQL engine, and verify persistence, authentication, role checks, input validation, origin checks, finance totals, settings, report export, and reference integrity. An additional disk-backed test closes and reopens the database. Hosted deployment still requires a configured database and environment variables.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Supabase and hosting setup.
