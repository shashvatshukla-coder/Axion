# Supabase + Foundry Club deployment

## 1. Database

The schema has been applied to Supabase project `axion database` (`ukycghuvhigkpmuqayvf`, Singapore). The `foundry` schema contains 24 tables with RLS enabled. A database write/read test succeeded and was rolled back, leaving no sample data. The runtime `DATABASE_URL` and the initial administrator account still need configuration. The Supabase connection for ChatGPT does not automatically configure the deployed application.

Use your Supabase project's PostgreSQL connection string from its Connect panel. Use a pooler connection suitable for your hosting network; session pooling is suitable for this API. Keep database credentials server-side.

The migration lives in `server/migrations/001_initial.sql`. Apply it through Supabase SQL Editor, or set `DATABASE_URL` locally and run `npm run db:migrate`. It creates the dedicated `foundry` schema, leaving existing `public` tables alone. RLS is enabled on application tables with no browser-access policies; the API connects using the database owner. Do not expose this schema through Supabase Data API.

Tables: users, sessions, teams, team_members, ideas, startups, clients, projects, tasks, milestones, documents, transactions, reports, activity_logs, members, leads, deliveries, collaborations, invoices, payouts, notifications, applications, messages. Core relations and document references have foreign keys. Domain records store validated JSONB payloads to preserve the current frontend contracts.

## 2. Administrator account

Set `DATABASE_URL`, `DATABASE_SSL=true`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` locally, then run `npm run db:setup`. Passwords are salted with scrypt; sessions store hashes of random tokens. The administrator password must be at least 12 characters. This command does not replace an existing account's password. Remove `ADMIN_PASSWORD` after setup. Club member login management is not yet exposed in the UI.

## 3. Vercel (existing Vite project)

The API is included at `api/index.ts`. `vercel.json` routes `/api/*` to Express and remaining routes to the React app. Configure:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`
- Node.js: 22 or later
- Server variables: `DATABASE_URL`, `DATABASE_SSL=true`, `NODE_ENV=production`, `APP_ORIGIN=https://your-exact-site-domain`
- Frontend: leave `VITE_API_URL` unset, or set it to `/api`.

Apply the schema and create the administrator **before** deploying. Do not put `DATABASE_URL`, an administrator password, or a Supabase service role key into a `VITE_*` variable. Set an exact `APP_ORIGIN` for each environment. Login uses same-origin HttpOnly cookies; cross-origin API deployments need a same-origin reverse proxy.

After deployment, verify `/api/health`, administrator login, public form submission, task movement, page refresh, and report download. No deployment is verified merely by committing this code.

## 4. Render alternative

`render.yaml` includes a web service that serves the compiled frontend and API together. Supply the same environment variables; run the administrator setup once. Its start command applies migrations before starting. No paid infrastructure is provisioned by this file.

## API

Public: GET `/api/public/projects`, `/startups`, `/members`, `/collaborations`, `/impact`; POST `/api/public/ideas`, `/requests`, `/messages`, `/applications`.

Authentication: POST `/api/auth/login`, `/logout`; GET/PATCH `/api/auth/me`.

Admin: list/detail/create/update/delete routes for domain resources, GET `/api/analytics`, `/finance/overview`, `/activity_logs`, `/documents`; POST `/api/reports/export`, `/documents`. Public applications and messages are readable only by admins. Notifications and applications are stored; email delivery and scheduled notifications are not implemented.

Google Drive: document metadata can record project IDs, filenames, Drive IDs and links. File upload and OAuth are a separate integration and are not claimed as connected by this change.

## Operating notes

Use Supabase backups for hosted data. Rotate credentials through environment settings. Rate limits currently apply per API instance; multi-instance production should use a shared limiter or platform rate limiting. The dashboard supports creating records and its existing workflow updates; generic update/delete APIs are also available. Public project/startup/member/collaboration records are a curated public directory and should contain only material intended for publication.
