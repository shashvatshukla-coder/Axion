import { createPool, migrate } from "./db";
import { bootstrapAdmin } from "./app";
const db = createPool();
try {
  await migrate(db);
  if (process.argv.includes("--admin")) {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
    await bootstrapAdmin(
      db,
      process.env.ADMIN_EMAIL,
      process.env.ADMIN_PASSWORD,
    );
  }
  console.log("Database setup complete");
} finally {
  await db.end();
}
