import { CreateRecord } from "@/components/common/CreateRecord";
import { useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAsync } from "@/hooks/useAsync";
import { memberService } from "@/services/memberService";
import type { Member } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AsyncView } from "@/components/common/AsyncView";
import { CardGridSkeleton, TableSkeleton } from "@/components/common/Skeleton";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Tabs } from "@/components/common/Tabs";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { MemberCard } from "@/components/common/MemberCard";

const columns: Column<Member>[] = [
  {
    key: "name",
    header: "Name",
    render: (m) => (
      <div className="flex min-w-[10rem] items-center gap-3">
        <Avatar name={m.name} hue={m.hue} size="sm" />
        <span className="font-medium">{m.name}</span>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    hideBelow: "sm",
    render: (m) => <span>{m.role}</span>,
  },
  {
    key: "department",
    header: "Department",
    hideBelow: "md",
    render: (m) => (
      <Badge
        tone={
          m.department === "Agency"
            ? "agency"
            : m.department === "Incubator"
              ? "accent"
              : "neutral"
        }
      >
        {m.department}
      </Badge>
    ),
  },
  {
    key: "team",
    header: "Team",
    hideBelow: "lg",
    render: (m) => (
      <span className="whitespace-nowrap text-muted">{m.team}</span>
    ),
  },
  {
    key: "skills",
    header: "Skills",
    hideBelow: "lg",
    render: (m) => (
      <span className="text-xs text-muted">{m.skills.join(", ")}</span>
    ),
  },
  {
    key: "project",
    header: "Current project",
    hideBelow: "md",
    render: (m) => <span>{m.currentProject}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (m) => <StatusBadge status={m.status} />,
  },
];

export default function Members() {
  usePageTitle("Members");
  const state = useAsync(() => memberService.list(), []);
  const [view, setView] = useState<"table" | "cards">("table");

  return (
    <>
      <CreateRecord resource="members" onCreated={state.reload} />
      <PageHeader
        title="Members"
        description="Everyone in the club, their team and what they are working on."
      />
      <Tabs
        className="mb-5"
        tabs={[
          { id: "table", label: "Table", count: state.data?.length },
          { id: "cards", label: "Cards" },
        ]}
        value={view}
        onChange={(id) => setView(id as "table" | "cards")}
      />
      <AsyncView
        state={state}
        skeleton={
          view === "table" ? <TableSkeleton rows={8} /> : <CardGridSkeleton />
        }
        isEmpty={(d) => d.length === 0}
      >
        {(rows) =>
          view === "table" ? (
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(m) => m.id}
              pageSize={10}
              searchText={(m) =>
                `${m.name} ${m.role} ${m.team} ${m.department} ${m.skills.join(" ")} ${m.currentProject}`
              }
              searchPlaceholder="Search members"
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {rows.map((m) => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
          )
        }
      </AsyncView>
    </>
  );
}
