import { createApp } from "./app";
import { createPool } from "./db";
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
