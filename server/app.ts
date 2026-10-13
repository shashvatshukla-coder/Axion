import { existsSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { randomBytes, randomUUID } from "node:crypto";
import { z } from "zod";
import { resources, type Database, type Resource } from "./db";
import { hashPassword, verifyPassword, tokenHash } from "./auth";
import {
  schemas,
  form,
  loginSchema,
  profileSchema,
  signupSchema,
} from "./schemas";
import { analytics } from "./analytics";
const id = () => randomUUID();
const today = () => new Date().toISOString().slice(0, 10);
export async function bootstrapAdmin(
  db: Database,
  email: string,
  password: string,
) {
  if (password.length < 12)
    throw new Error("ADMIN_PASSWORD must have at least 12 characters");
  await db.query(
    "INSERT INTO users(id,email,name,password_hash,role) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (email) DO NOTHING",
    [
      id(),
      z.email().parse(email.toLowerCase()),
      "Club Admin",
      hashPassword(password),
      "admin",
    ],
  );
}
export function createApp(db: Database) {
  const app = express();
  const production = process.env.NODE_ENV === "production";
  if (process.env.VERCEL || process.env.RENDER) app.set("trust proxy", 1);
  app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });
  app.use(helmet());
  app.use(express.json({ limit: "256kb" }));
  app.use(cookieParser());
  // Same-origin API + HttpOnly cookies. No permissive cross-origin writes.
  app.use("/api", (req, res, next) => {
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      req.headers.origin
    ) {
      const allowed = (process.env.APP_ORIGIN || "http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim());
      if (!allowed.includes(req.headers.origin)) {
        res.status(403).json({ error: "Origin not allowed" });
        return;
      }
    }
    next();
  });
  const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.get("/api/health", async (_req, res) => {
    await db.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  });
  const startSession = async (
    user: { id: string; name: string; email: string; role: string },
    res: express.Response,
  ) => {
    const token = randomBytes(32).toString("hex");
    await db.query("DELETE FROM sessions WHERE expires_at < now()");
    await db.query(
      "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,$3)",
      [tokenHash(token), user.id, new Date(Date.now() + 7 * 86400000)],
    );
    res
      .cookie("foundry_session", token, {
        httpOnly: true,
        secure: production,
        sameSite: "strict",
        maxAge: 7 * 86400000,
        path: "/",
      })
      .json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
  };
  app.post("/api/auth/signup", publicLimiter, async (req, res) => {
    const { name, email, password } = signupSchema.parse(req.body);
    const result = await db.query(
      "INSERT INTO users(id,email,name,password_hash,role) VALUES($1,$2,$3,$4,'member') ON CONFLICT(email) DO NOTHING RETURNING id,email,name,role",
      [id(), email, name, hashPassword(password)],
    );
    if (!result.rows[0]) {
      res
        .status(409)
        .json({
          error: "An account with this email already exists. Please sign in.",
        });
      return;
    }
    res.status(201);
    await startSession(result.rows[0], res);
  });
  app.post("/api/auth/login", publicLimiter, async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = (
      await db.query("SELECT * FROM users WHERE email=$1", [
        email.toLowerCase(),
      ])
    ).rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    await startSession(user, res);
  });
  app.post("/api/auth/logout", async (req, res) => {
    await db.query("DELETE FROM sessions WHERE token_hash=$1", [
      tokenHash(req.cookies.foundry_session || ""),
    ]);
    res.clearCookie("foundry_session", { path: "/" }).json({ ok: true });
  });
  const save = async (table: Resource, data: unknown, actor?: string) => {
    const key = id();
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      await client.query(`INSERT INTO ${table}(id,data) VALUES($1,$2)`, [
        key,
        JSON.stringify(data),
      ]);
      await client.query(
        "INSERT INTO activity_logs(id,actor_id,action,resource,resource_id) VALUES($1,$2,$3,$4,$5)",
        [id(), actor || null, "create", table, key],
      );
      await client.query("COMMIT");
      return { id: key, ...(data as object) };
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  };
  const submit = (required: string[]) => (body: unknown) => {
    const data = form.parse(body);
    for (const key of required) z.string().trim().min(1).parse(data[key]);
    z.email().parse(data.email);
    return data;
  };
  app.post("/api/public/ideas", publicLimiter, async (req, res) => {
    const v = submit(["name", "title", "problem", "category", "email"])(
      req.body,
    );
    const row = await save("ideas", {
      title: v.title,
      submittedBy: v.name,
      problem: v.problem,
      category: v.category,
      validation: "Pending",
      stage: "problem",
      team: [],
      date: today(),
      submission: v,
    });
    res.status(201).json({ id: row.id });
  });
  app.post("/api/public/requests", publicLimiter, async (req, res) => {
    const v = submit(["name", "organization", "email", "description"])(
      req.body,
    );
    const row = await save("leads", {
      contact: v.name,
      organization: v.organization,
      type: v.projectType || "Other",
      value: 0,
      stage: "New Lead",
      owner: "Unassigned",
      date: today(),
      submission: v,
    });
    res.status(201).json({ reference: row.id });
  });
  app.post("/api/public/messages", publicLimiter, async (req, res) => {
    const v = submit(["name", "email", "message"])(req.body);
    await save("messages", v);
    res.status(201).json({ ok: true });
  });
  app.post("/api/public/applications", publicLimiter, async (req, res) => {
    const body = z
      .object({ kind: z.string().min(1).max(100), values: form })
      .parse(req.body);
    const v = submit(["name", "email"])(body.values);
    const row = await save("applications", { kind: body.kind, values: v });
    res.status(201).json({ reference: row.id });
  });
  app.get("/api/public/impact", async (_req, res) => {
    const count = async (table: string, filter?: (d: any) => boolean) => {
      const rows = (await db.query(`SELECT data FROM ${table}`)).rows;
      return filter ? rows.filter((r) => filter(r.data)).length : rows.length;
    };
    const values = await Promise.all([
      count("members"),
      count("ideas", (d) => d.validation === "Validated"),
      count("projects", (d) => d.status === "Completed"),
      count("clients"),
      count("projects", (d) => d.status === "Active"),
      count("collaborations"),
    ]);
    res.json(
      ["members", "validated", "products", "clients", "active", "collabs"].map(
        (id, i) => ({
          id,
          label: [
            "Members",
            "Ideas Validated",
            "Products Built",
            "Clients Served",
            "Active Projects",
            "Collaborations",
          ][i],
          value: values[i],
        }),
      ),
    );
  });
  const publicTables = ["projects", "startups", "members", "collaborations"];
  for (const table of publicTables)
    app.get(`/api/public/${table}`, async (_req, res) => {
      const rows = (
        await db.query(`SELECT id,data FROM ${table} ORDER BY created_at DESC`)
      ).rows;
      res.json(
        rows.map((r) => {
          const { submission, client, driveFolderId, ...data } = r.data;
          if (table === "members") return { id: r.id, ...data };
          return { id: r.id, ...data };
        }),
      );
    });
  app.use("/api", async (req, res, next) => {
    const token = req.cookies.foundry_session;
    if (!token) {
      res.status(401).json({ error: "Please sign in" });
      return;
    }
    const row = (
      await db.query(
        "SELECT u.id,u.name,u.email,u.role,u.preferences FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at > now()",
        [tokenHash(token)],
      )
    ).rows[0];
    if (!row) {
      res.status(401).json({ error: "Session expired. Please sign in" });
      return;
    }
    res.locals.user = row;
    next();
  });
  app.get("/api/auth/me", (_req, res) => res.json(res.locals.user));
  app.patch("/api/auth/me", async (req, res) => {
    const v = profileSchema.parse(req.body);
    await db.query(
      "UPDATE users SET name=$1,email=$2,preferences=$3 WHERE id=$4",
      [
        v.name,
        v.email.toLowerCase(),
        JSON.stringify(v.preferences),
        res.locals.user.id,
      ],
    );
    res.json({ ...res.locals.user, ...v });
  });
  app.use("/api", (_req, res, next) => {
    if (res.locals.user.role !== "admin" && !_req.path.startsWith("/auth/")) {
      res.status(403).json({ error: "Administrator access required" });
      return;
    }
    next();
  });
  app.get("/api/analytics", async (_req, res) => res.json(await analytics(db)));
  app.get("/api/finance/overview", async (_req, res) =>
    res.json((await analytics(db)).finance),
  );
  app.post("/api/reports/export", async (_req, res) => {
    const report = await save(
      "reports",
      { generatedAt: new Date().toISOString(), summary: await analytics(db) },
      res.locals.user.id,
    );
    res.status(201).json(report);
  });
  // Admin-only internal data and mutation routes.
  app.use("/api", (_req, res, next) => {
    if (res.locals.user.role !== "admin") {
      res.status(403).json({ error: "Administrator access required" });
      return;
    }
    next();
  });
  app.get("/api/activity_logs", async (_req, res) =>
    res.json(
      (
        await db.query(
          "SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 500",
        )
      ).rows,
    ),
  );
  app.get("/api/documents", async (req, res) => {
    res.json(
      (
        await db.query(
          "SELECT * FROM documents WHERE ($1::text IS NULL OR project_id=$1)",
          [req.query.projectId || null],
        )
      ).rows,
    );
  });
  app.post("/api/documents", async (req, res) => {
    const v = z
      .object({
        projectId: z.string().optional(),
        fileName: z.string().min(1).max(255),
        driveFileId: z.string().min(1).max(255),
        driveUrl: z
          .url()
          .refine((s) =>
            ["drive.google.com", "docs.google.com"].includes(
              new URL(s).hostname,
            ),
          ),
      })
      .parse(req.body);
    const key = id();
    await db.query(
      "INSERT INTO documents(id,project_id,file_name,drive_file_id,drive_url,uploaded_by) VALUES($1,$2,$3,$4,$5,$6)",
      [
        key,
        v.projectId || null,
        v.fileName,
        v.driveFileId,
        v.driveUrl,
        res.locals.user.id,
      ],
    );
    res.status(201).json({ id: key, ...v });
  });
  for (const table of resources) {
    app.get(`/api/${table}`, async (_req, res) =>
      res.json(
        (
          await db.query(
            `SELECT id,data FROM ${table} ORDER BY created_at DESC`,
          )
        ).rows.map((r) => ({ id: r.id, ...r.data })),
      ),
    );
    app.get(`/api/${table}/:id`, async (req, res) => {
      const row = (
        await db.query(`SELECT data FROM ${table} WHERE id=$1`, [req.params.id])
      ).rows[0];
      if (!row) {
        res.status(404).json({ error: "Record not found" });
        return;
      }
      res.json({ id: req.params.id, ...row.data });
    });
    if (!schemas[table]) continue;
    app.post(`/api/${table}`, async (req, res) => {
      const v = schemas[table].strict().parse(req.body);
      res.status(201).json(await save(table, v, res.locals.user.id));
    });
    app.patch(`/api/${table}/:id`, async (req, res) => {
      const patch = schemas[table].partial().strict().parse(req.body);
      const client = await db.connect();
      try {
        await client.query("BEGIN");
        const row = (
          await client.query(
            `SELECT data FROM ${table} WHERE id=$1 FOR UPDATE`,
            [req.params.id],
          )
        ).rows[0];
        if (!row) {
          await client.query("ROLLBACK");
          res.status(404).json({ error: "Record not found" });
          return;
        }
        const merged = schemas[table].parse({ ...row.data, ...patch });
        await client.query(
          `UPDATE ${table} SET data=$1,updated_at=now() WHERE id=$2`,
          [JSON.stringify(merged), req.params.id],
        );
        await client.query(
          "INSERT INTO activity_logs(id,actor_id,action,resource,resource_id) VALUES($1,$2,$3,$4,$5)",
          [id(), res.locals.user.id, "update", table, req.params.id],
        );
        await client.query("COMMIT");
        res.json({ id: req.params.id, ...merged });
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    });
    app.delete(`/api/${table}/:id`, async (req, res) => {
      const result = await db.query(
        `DELETE FROM ${table} WHERE id=$1 RETURNING id`,
        [req.params.id],
      );
      if (!result.rows.length) {
        res.status(404).json({ error: "Record not found" });
        return;
      }
      res.json({ ok: true });
    });
  }
  app.use("/api", (_req, res) =>
    res.status(404).json({ error: "Endpoint not found" }),
  );
  if (existsSync(resolve("dist/index.html"))) {
    app.use(express.static(resolve("dist")));
    app.get("/{*path}", (req, res, next) =>
      req.path.startsWith("/api")
        ? next()
        : res.sendFile(resolve("dist/index.html")),
    );
  }
  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: err.issues });
        return;
      }
      if (err.code === "23505" || err.code === "23503") {
        res
          .status(409)
          .json({ error: "Duplicate record or invalid reference" });
        return;
      }
      if (err.status === 400 || err.status === 413) {
        res.status(err.status).json({ error: "Invalid request body" });
        return;
      }
      console.error("API error:", err.message);
      res.status(500).json({ error: "Unable to complete request" });
    },
  );
  return app;
}
