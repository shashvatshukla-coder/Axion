import { test, after } from "node:test";
import assert from "node:assert/strict";
import { PGlite } from "@electric-sql/pglite";
import request from "supertest";
import { migrate, type Database } from "../db";
import { createApp, bootstrapAdmin } from "../app";
import { hashPassword } from "../auth";
const engines: PGlite[] = [];
after(async () => {
  for (const engine of engines) await engine.close();
});
async function fixture() {
  const memory = new PGlite();
  engines.push(memory);
  const query = async (sql: string, values?: any[]) => {
    if (!values) {
      const results = await memory.exec(sql);
      return results.at(-1) || { rows: [] };
    }
    return memory.query(sql, values);
  };
  const db = {
    query,
    connect: async () => ({ query, release() {} }),
  } as unknown as Database;
  await migrate(db);
  await migrate(db);
  await bootstrapAdmin(db, "admin@club.test", "a-strong-test-password");
  const app = createApp(db);
  const admin = request.agent(app);
  await admin
    .post("/api/auth/login")
    .send({ email: "admin@club.test", password: "a-strong-test-password" })
    .expect(200);
  return { db, app, admin };
}
test("public submission persists across API instances and retains complete form", async () => {
  const { db, app, admin } = await fixture();
  const submission = {
    name: "Shashvat",
    email: "shashvat@example.com",
    title: "Campus tools",
    category: "Campus",
    problem: "Students need shared tools",
    solution: "Shared equipment",
    consent: "yes",
  };
  const created = await request(app)
    .post("/api/public/ideas")
    .send(submission)
    .expect(201);
  const list = await admin.get("/api/ideas").expect(200);
  assert.equal(list.body[0].submission.solution, submission.solution);
  await admin
    .patch(`/api/ideas/${created.body.id}`)
    .send({ validation: "Validated" })
    .expect(200);
  const restart = request.agent(createApp(db));
  await restart
    .post("/api/auth/login")
    .send({ email: "admin@club.test", password: "a-strong-test-password" })
    .expect(200);
  const persisted = await restart.get("/api/ideas").expect(200);
  assert.equal(persisted.body[0].validation, "Validated");
  const report = await restart.post("/api/reports/export").send({}).expect(201);
  assert.equal(
    report.body.summary.stats.find((s: any) => s.id === "validated").value,
    "1",
  );
  assert.equal((await db.query("SELECT * FROM reports")).rows.length, 1);
});
test("private data, validation, CSRF origin, missing IDs, logout", async () => {
  const { app, admin } = await fixture();
  await request(app).get("/api/clients").expect(401);
  await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@club.test", password: "bad" })
    .expect(401);
  await admin
    .post("/api/tasks")
    .send({
      title: "Task",
      assignee: "Me",
      project: "Project",
      due: "2026-10-20",
      status: "Todo",
      priority: "High",
    })
    .expect(201);
  await admin.patch("/api/tasks/missing").send({ status: "Done" }).expect(404);
  const tasks = await admin.get("/api/tasks");
  await admin
    .patch(`/api/tasks/${tasks.body[0].id}`)
    .send({ status: "Invalid" })
    .expect(400);
  await admin
    .patch(`/api/tasks/${tasks.body[0].id}`)
    .send({ role: "admin" })
    .expect(400);
  await admin
    .post("/api/tasks")
    .set("Origin", "https://evil.example")
    .send({})
    .expect(403);
  await request(app)
    .post("/api/public/ideas")
    .send({ name: "", email: "bad" })
    .expect(400);
  await admin.post("/api/auth/logout").send({}).expect(200);
  await admin.get("/api/auth/me").expect(401);
});
test("finance arithmetic, settings persistence, role protection and document references", async () => {
  const { db, app, admin } = await fixture();
  await admin
    .post("/api/invoices")
    .send({
      client: "Client",
      project: "Web",
      amount: 1000,
      status: "Paid",
      issued: "2026-10-01",
      due: "2026-10-20",
    })
    .expect(201);
  await admin
    .post("/api/payouts")
    .send({
      member: "Member",
      project: "Web",
      amount: 200,
      status: "Scheduled",
      date: "2026-10-13",
    })
    .expect(201);
  await admin
    .post("/api/transactions")
    .send({
      amount: 50,
      type: "expense",
      date: "2026-10-13",
      description: "Hosting",
    })
    .expect(201);
  const finance = await admin.get("/api/finance/overview").expect(200);
  assert.equal(finance.body.availableBalance, 950);
  await admin
    .patch("/api/auth/me")
    .send({
      name: "Admin",
      email: "admin@club.test",
      preferences: { ideas: true },
    })
    .expect(200);
  assert.equal((await admin.get("/api/auth/me")).body.preferences.ideas, true);
  await admin
    .post("/api/documents")
    .send({
      projectId: "does-not-exist",
      fileName: "deck.pdf",
      driveFileId: "file123",
      driveUrl: "https://drive.google.com/file/d/file123/view",
    })
    .expect(409);
  await db.query(
    "INSERT INTO users(id,email,name,password_hash,role) VALUES($1,$2,$3,$4,$5)",
    [
      "member1",
      "member@club.test",
      "Member",
      hashPassword("a-strong-member-password"),
      "member",
    ],
  );
  const member = request.agent(app);
  await member
    .post("/api/auth/login")
    .send({ email: "member@club.test", password: "a-strong-member-password" })
    .expect(200);
  await member.get("/api/invoices").expect(403);
});

test("disk-backed PostgreSQL records survive database close and reopen", async () => {
  const { mkdtemp, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const path = await mkdtemp(join(tmpdir(), "foundry-db-test-"));
  try {
    const first = new PGlite(path);
    await first.exec(
      "CREATE TABLE durability(id text PRIMARY KEY, value jsonb NOT NULL)",
    );
    await first.query("INSERT INTO durability VALUES($1,$2)", [
      "idea1",
      JSON.stringify({ title: "Persistent idea" }),
    ]);
    await first.close();
    const reopened = new PGlite(path);
    const rows = await reopened.query<{ value: { title: string } }>(
      "SELECT value FROM durability",
    );
    assert.equal(rows.rows[0].value.title, "Persistent idea");
    await reopened.close();
  } finally {
    await rm(path, { recursive: true, force: true });
  }
});

test("signup creates only members, persists login, rejects duplicates and revokes logout", async () => {
  const { db, app } = await fixture();
  const user = request.agent(app);
  const body = {
    name: "New Member",
    email: " New.Member@club.test ",
    password: "a-new-member-password",
  };
  await user
    .post("/api/auth/signup")
    .send({ ...body, password: "short" })
    .expect(400);
  await user
    .post("/api/auth/signup")
    .send({ ...body, role: "admin" })
    .expect(400);
  const signedUp = await user.post("/api/auth/signup").send(body).expect(201);
  assert.equal(signedUp.body.role, "member");
  assert.equal(signedUp.body.email, "new.member@club.test");
  assert.equal(signedUp.body.password_hash, undefined);
  assert.match(signedUp.headers["set-cookie"][0], /HttpOnly/);
  await user.get("/api/auth/me").expect(200);
  await user.get("/api/clients").expect(403);
  await request(app).post("/api/auth/signup").send(body).expect(409);
  const stored = (
    await db.query("SELECT password_hash FROM users WHERE email=$1", [
      "new.member@club.test",
    ])
  ).rows[0];
  assert.notEqual(stored.password_hash, body.password);
  await user.post("/api/auth/logout").send({}).expect(200);
  await user.get("/api/auth/me").expect(401);
  const restarted = request.agent(createApp(db));
  await restarted
    .post("/api/auth/login")
    .send({ email: body.email, password: "wrong" })
    .expect(401);
  await restarted
    .post("/api/auth/login")
    .send({ email: body.email, password: body.password })
    .expect(200);
  await restarted.get("/api/auth/me").expect(200);
});
