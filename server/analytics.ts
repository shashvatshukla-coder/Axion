import type { Database } from "./db";
import { stages, leadStages } from "./schemas";
export async function analytics(db: Database) {
  const tables = [
    "members",
    "ideas",
    "startups",
    "leads",
    "projects",
    "clients",
    "invoices",
    "payouts",
    "tasks",
    "transactions",
  ];
  const rows: Record<string, any[]> = {};
  for (const table of tables)
    rows[table] = (await db.query(`SELECT data FROM ${table}`)).rows.map(
      (r) => r.data,
    );
  const revenue = rows.invoices
    .filter((i) => i.status === "Paid")
    .reduce((s, i) => s + i.amount, 0);
  const paidPayouts = rows.payouts
    .filter((i) => i.status === "Paid")
    .reduce((s, i) => s + i.amount, 0);
  const expenses = rows.transactions
    .filter((i) => i.type === "expense")
    .reduce((s, i) => s + i.amount, 0);
  const stats = [
    ["members", "Total Members", rows.members.length],
    ["submitted", "Ideas Submitted", rows.ideas.length],
    [
      "validated",
      "Ideas Validated",
      rows.ideas.filter((i) => i.validation === "Validated").length,
    ],
    [
      "mvps",
      "MVPs Building",
      rows.startups.filter((i) => i.stage === "mvp").length,
    ],
    ["startups", "Active Startups", rows.startups.length],
    ["leads", "Agency Leads", rows.leads.length],
    [
      "agencyProjects",
      "Agency Projects",
      rows.projects.filter((i) => i.division === "Agency").length,
    ],
    ["revenue", "Revenue", `₹${revenue.toLocaleString("en-IN")}`],
    [
      "csat",
      "Client Satisfaction",
      rows.clients.length
        ? (
            rows.clients.reduce((s, i) => s + i.satisfaction, 0) /
            rows.clients.length
          ).toFixed(1) + " / 5"
        : "—",
    ],
  ].map(([id, label, value]) => ({
    id,
    label,
    value: String(value),
    delta: "From stored records",
    trend: "flat",
  }));
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() - 11 + i);
    return {
      key: d.toISOString().slice(0, 7),
      month: d.toLocaleString("en", { month: "short", timeZone: "UTC" }),
    };
  });
  return {
    stats,
    projectsByMonth: months.map((m) => ({
      month: m.month,
      incubator: rows.projects.filter(
        (p) => p.startedAt?.startsWith(m.key) && p.division === "Incubator",
      ).length,
      agency: rows.projects.filter(
        (p) => p.startedAt?.startsWith(m.key) && p.division === "Agency",
      ).length,
    })),
    incubatorFunnel: stages.map((stage) => ({
      stage,
      count: rows.ideas.filter((i) => i.stage === stage).length,
    })),
    agencyPipeline: leadStages.map((stage) => ({
      stage,
      count: rows.leads.filter((i) => i.stage === stage).length,
    })),
    revenueByMonth: months.map((m) => ({
      month: m.month,
      revenue: rows.invoices
        .filter((i) => i.status === "Paid" && i.issued?.startsWith(m.key))
        .reduce((s, i) => s + i.amount, 0),
      expenses:
        rows.transactions
          .filter((i) => i.type === "expense" && i.date?.startsWith(m.key))
          .reduce((s, i) => s + i.amount, 0) +
        rows.payouts
          .filter((i) => i.status === "Paid" && i.date?.startsWith(m.key))
          .reduce((s, i) => s + i.amount, 0),
    })),
    memberActivity: [],
    finance: {
      totalRevenue: revenue,
      pendingPayments: rows.invoices
        .filter((i) => i.status !== "Paid")
        .reduce((s, i) => s + i.amount, 0),
      memberPayouts: paidPayouts,
      availableBalance: revenue - paidPayouts - expenses,
    },
  };
}
