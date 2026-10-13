import { z } from "zod";
const text = z.string().trim().min(1).max(4000);
const short = z.string().trim().min(1).max(200);
const names = z.array(short).max(100);
const amount = z.number().finite().nonnegative();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const progress = z.number().min(0).max(100);
export const stages = [
  "problem",
  "validation",
  "ideation",
  "mvp",
  "pmf",
  "traction",
  "scale",
] as const;
export const leadStages = [
  "New Lead",
  "Contacted",
  "Requirement Gathering",
  "Proposal",
  "Negotiation",
  "Active",
  "QA",
  "Delivered",
  "Closed",
] as const;
export const schemas: Record<string, z.ZodObject<any>> = {
  ideas: z.object({
    title: short,
    submittedBy: short,
    problem: text,
    category: short,
    validation: z.enum(["Pending", "In review", "Validated", "Rejected"]),
    stage: z.enum(stages),
    team: names,
    date,
    submission: z.record(z.string(), z.string().max(8000)).optional(),
  }),
  projects: z.object({
    name: short,
    division: z.enum(["Incubator", "Agency"]),
    type: short,
    status: z.enum(["Active", "Completed", "Paused"]),
    description: text,
    tech: names,
    members: names,
    progress,
    client: short.optional(),
    hue: z.number(),
    startedAt: date,
    driveFolderId: short.optional(),
  }),
  startups: z.object({
    name: short,
    problem: text,
    solution: text,
    stage: z.enum(stages),
    team: names,
    progress,
    website: z.string().max(2000),
    hue: z.number(),
    founded: z.string().max(100),
  }),
  tasks: z.object({
    title: short,
    assignee: short,
    project: short,
    due: date,
    status: z.enum(["Todo", "In progress", "Review", "Done"]),
    priority: z.enum(["Low", "Medium", "High"]),
  }),
  clients: z.object({
    name: short,
    organization: short,
    industry: short,
    email: z.email(),
    projects: z.number().int().nonnegative(),
    revenue: amount,
    satisfaction: z.number().min(0).max(5),
    since: z.string().max(100),
  }),
  leads: z.object({
    contact: short,
    organization: short,
    type: short,
    value: amount,
    stage: z.enum(leadStages),
    owner: short,
    date,
    submission: z.record(z.string(), z.string().max(8000)).optional(),
  }),
  invoices: z.object({
    client: short,
    project: short,
    amount,
    status: z.enum(["Paid", "Pending", "Overdue"]),
    issued: date,
    due: date,
  }),
  payouts: z.object({
    member: short,
    project: short,
    amount,
    status: z.enum(["Paid", "Scheduled", "Processing"]),
    date,
  }),
  members: z.object({
    name: short,
    role: short,
    department: z.enum(["Incubator", "Agency", "Shared"]),
    team: short,
    skills: names,
    currentProject: z.string().max(200),
    status: z.enum(["Active", "On leave", "Alumni"]),
    linkedin: z.string().max(2000),
    github: z.string().max(2000),
    hue: z.number(),
  }),
  deliveries: z.object({
    project: short,
    client: short,
    milestone: short,
    due: date,
    qa: z.enum(["Passed", "In QA", "Blocked"]),
    progress,
  }),
  collaborations: z.object({
    partner: short,
    kind: z.enum(["Club", "E-Cell", "TBI", "Industry", "MSME"]),
    summary: text,
    status: z.enum(["Active", "Proposed", "Completed"]),
    since: z.string().max(100),
  }),
  notifications: z.object({
    title: short,
    detail: text,
    time: short,
    unread: z.boolean(),
  }),
  milestones: z.object({
    projectId: short,
    title: short,
    due: date,
    status: z.enum(["Pending", "Done"]),
  }),
  transactions: z.object({
    amount,
    type: z.enum(["income", "expense"]),
    date,
    description: text,
  }),
};
export const form = z.record(z.string().max(100), z.string().max(8000));
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(200),
});
export const profileSchema = z.object({
  name: short,
  email: z.email(),
  preferences: z.record(z.string(), z.boolean()),
});

export const signupSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().toLowerCase().pipe(z.email()),
    password: z.string().min(12).max(200),
  })
  .strict();
