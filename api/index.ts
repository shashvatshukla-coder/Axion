import type { Request, Response } from "express";
import { createApp } from "../server/app";
import { createPool } from "../server/db";
let app: ReturnType<typeof createApp> | undefined;
export default function handler(req: Request, res: Response) {
  try {
    app ??= createApp(createPool());
    // Rewrite carries the original path explicitly, avoiding framework rewrite differences.
    const parsed = new URL(req.url || "/", "http://localhost");
    const route = parsed.searchParams.get("__route");
    if (route !== null) {
      parsed.searchParams.delete("__route");
      req.url = `/api/${route}${parsed.search ? parsed.search : ""}`;
    }
    return app(req, res);
  } catch (error) {
    console.error(
      "Foundry API initialization failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    res
      .status(503)
      .json({
        error:
          "The database is not configured yet. Please contact the club administrator.",
      });
  }
}
