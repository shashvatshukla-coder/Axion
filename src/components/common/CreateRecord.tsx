import { useState, useId } from "react";
import type { FormEvent } from "react";
import { post } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { Button } from "./Button";
type Field = {
  key: string;
  label: string;
  type?: "number" | "date" | "email" | "array";
  options?: string[];
  optional?: boolean;
};
const field = (key: string, label: string, type?: Field["type"]): Field => ({
  key,
  label,
  type,
});
const choice = (key: string, label: string, options: string[]): Field => ({
  key,
  label,
  options,
});
const stages = [
  "problem",
  "validation",
  "ideation",
  "mvp",
  "pmf",
  "traction",
  "scale",
];
const configs: Record<
  string,
  { label: string; fields: Field[]; defaults: Record<string, unknown> }
> = {
  tasks: {
    label: "task",
    fields: [
      field("title", "Title"),
      field("assignee", "Assignee"),
      field("project", "Project"),
      field("due", "Due date", "date"),
      choice("priority", "Priority", ["Low", "Medium", "High"]),
    ],
    defaults: { status: "Todo" },
  },
  projects: {
    label: "project",
    fields: [
      field("name", "Name"),
      field("description", "Description"),
      field("type", "Project type"),
      choice("division", "Division", ["Agency", "Incubator"]),
      field("startedAt", "Start date", "date"),
      field("tech", "Technologies, separated by commas", "array"),
      field("members", "Members, separated by commas", "array"),
    ],
    defaults: { status: "Active", progress: 0, hue: 25 },
  },
  clients: {
    label: "client",
    fields: [
      field("name", "Contact name"),
      field("organization", "Organization"),
      field("industry", "Industry"),
      field("email", "Email", "email"),
      field("since", "Client since", "date"),
    ],
    defaults: { projects: 0, revenue: 0, satisfaction: 0 },
  },
  members: {
    label: "member",
    fields: [
      field("name", "Name"),
      field("role", "Role"),
      choice("department", "Department", ["Incubator", "Agency", "Shared"]),
      choice("team", "Team", [
        "Core Team",
        "Incubator Team",
        "Agency Team",
        "Technical Team",
        "UI/UX Team",
        "Validation Team",
        "Outreach Team",
        "QA Team",
        "Finance Team",
      ]),
      field("skills", "Skills, separated by commas", "array"),
    ],
    defaults: {
      currentProject: "",
      status: "Active",
      linkedin: "",
      github: "",
      hue: 25,
    },
  },
  startups: {
    label: "startup",
    fields: [
      field("name", "Name"),
      field("problem", "Problem"),
      field("solution", "Solution"),
      choice("stage", "Stage", stages),
      field("team", "Team members, separated by commas", "array"),
      field("founded", "Founded", "date"),
    ],
    defaults: { progress: 0, website: "", hue: 25 },
  },
  invoices: {
    label: "invoice",
    fields: [
      field("client", "Client"),
      field("project", "Project"),
      field("amount", "Amount in rupees", "number"),
      choice("status", "Status", ["Pending", "Paid", "Overdue"]),
      field("issued", "Issued date", "date"),
      field("due", "Due date", "date"),
    ],
    defaults: {},
  },
  payouts: {
    label: "payout",
    fields: [
      field("member", "Member"),
      field("project", "Project"),
      field("amount", "Amount in rupees", "number"),
      choice("status", "Status", ["Scheduled", "Processing", "Paid"]),
      field("date", "Date", "date"),
    ],
    defaults: {},
  },
  deliveries: {
    label: "delivery",
    fields: [
      field("project", "Project"),
      field("client", "Client"),
      field("milestone", "Milestone"),
      field("due", "Due date", "date"),
      choice("qa", "QA status", ["In QA", "Passed", "Blocked"]),
    ],
    defaults: { progress: 0 },
  },
  collaborations: {
    label: "collaboration",
    fields: [
      field("partner", "Partner"),
      choice("kind", "Kind", ["Club", "E-Cell", "TBI", "Industry", "MSME"]),
      field("summary", "Summary"),
      field("since", "Started", "date"),
    ],
    defaults: { status: "Proposed" },
  },
};
export function CreateRecord({
  resource,
  onCreated,
}: {
  resource: string;
  onCreated: () => void;
}) {
  const config = configs[resource];
  const prefix = useId();
  const toast = useToast();
  const [values, setValues] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const data: Record<string, unknown> = { ...config.defaults };
      for (const f of config.fields) {
        const value = values[f.key] ?? "";
        data[f.key] =
          f.type === "number"
            ? Number(value)
            : f.type === "array"
              ? value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : value;
      }
      await post(`/${resource}`, data);
      setValues({});
      setOpen(false);
      onCreated();
      toast.success(`${config.label} created.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="card mb-6 p-4">
      <Button
        type="button"
        variant="secondary"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Cancel" : `Add ${config.label}`}
      </Button>
      {open && (
        <form onSubmit={save} className="mt-4 grid gap-4 sm:grid-cols-2">
          {config.fields.map((f) => (
            <label
              key={f.key}
              htmlFor={`${prefix}-${f.key}`}
              className="text-sm"
            >
              {f.label}
              {f.options ? (
                <select
                  id={`${prefix}-${f.key}`}
                  required
                  value={values[f.key] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  className="mt-1 w-full rounded border bg-surface p-2"
                >
                  <option value="">Choose…</option>
                  {f.options.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={`${prefix}-${f.key}`}
                  required={f.type !== "array"}
                  type={f.type === "array" ? "text" : (f.type ?? "text")}
                  min={f.type === "number" ? 0 : undefined}
                  step={f.type === "number" ? "0.01" : undefined}
                  value={values[f.key] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  className="mt-1 w-full rounded border bg-surface p-2"
                />
              )}
            </label>
          ))}
          <div className="sm:col-span-2">
            <Button type="submit" loading={busy}>
              Save {config.label}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
