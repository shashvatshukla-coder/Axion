import pg from "pg";
import { createApp } from "./app";

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
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

const db = createPool();
await db.query("SELECT version FROM schema_migrations LIMIT 1");

const server = createApp(db).listen(
  Number(process.env.PORT || 3001),
  "0.0.0.0",
  () => console.log("Foundry API ready"),
);

async function shutdown() {
  server.close(async () => {
    await db.end();
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
