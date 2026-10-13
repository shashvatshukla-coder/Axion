import "dotenv/config";
import pg from "pg";
import { readFile } from "node:fs/promises";
export const resources = [
  "ideas",
  "startups",
  "clients",
  "projects",
  "tasks",
  "milestones",
  "transactions",
  "reports",
  "members",
  "leads",
  "deliveries",
  "collaborations",
  "invoices",
  "payouts",
  "notifications",
  "applications",
  "messages",
] as const;
export type Resource = (typeof resources)[number];
export type Database = Pick<pg.Pool, "query" | "connect">;
export function createPool() {
  if (!process.env.DATABASE_URL)
    throw new Error(
      "DATABASE_URL is required. Configure PostgreSQL before starting the API.",
    );
  return new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    options: "-c search_path=foundry,public",
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: true }
        : undefined,
  });
}
export async function migrate(db: Database) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      await readFile(
        new URL("./migrations/001_initial.sql", import.meta.url),
        "utf8",
      ),
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
