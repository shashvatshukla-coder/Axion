import { CreateRecord } from "@/components/common/CreateRecord";
import { Star } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAsync } from "@/hooks/useAsync";
import { clientService } from "@/services/clientService";
import { formatCompactINR, formatDate } from "@/lib/utils";
import type { Client } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AsyncView } from "@/components/common/AsyncView";
import { TableSkeleton } from "@/components/common/Skeleton";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";

const columns: Column<Client>[] = [
  {
    key: "name",
    header: "Client",
    render: (c) => (
      <div className="flex min-w-[11rem] items-center gap-3">
        <Avatar name={c.organization} size="sm" />
        <div>
          <p className="font-medium">{c.organization}</p>
          <p className="text-xs text-muted">{c.name}</p>
        </div>
      </div>
    ),
  },
  {
    key: "industry",
    header: "Industry",
    hideBelow: "md",
    render: (c) => <Badge>{c.industry}</Badge>,
  },
  {
    key: "email",
    header: "Email",
    hideBelow: "lg",
    render: (c) => <span className="text-xs text-muted">{c.email}</span>,
  },
  {
    key: "projects",
    header: "Projects",
    hideBelow: "sm",
    render: (c) => <span className="tabular-nums">{c.projects}</span>,
  },
  {
    key: "revenue",
    header: "Revenue",
    render: (c) => (
      <span className="font-mono text-xs">{formatCompactINR(c.revenue)}</span>
    ),
  },
  {
    key: "csat",
    header: "Satisfaction",
    hideBelow: "md",
    render: (c) => (
      <span className="inline-flex items-center gap-1 text-sm">
        <Star className="h-3.5 w-3.5 text-warn" aria-hidden />{" "}
        {c.satisfaction.toFixed(1)}
      </span>
    ),
  },
  {
    key: "since",
    header: "Client since",
    hideBelow: "lg",
    render: (c) => (
      <span className="whitespace-nowrap text-xs text-muted">
        {formatDate(c.since)}
      </span>
    ),
  },
];

export default function Clients() {
  usePageTitle("Clients");
  const state = useAsync(() => clientService.clients(), []);

  return (
    <>
      <CreateRecord resource="clients" onCreated={state.reload} />
      <PageHeader
        title="Clients"
        description="Organisations the agency has worked with, and what each relationship is worth."
      />
      <AsyncView
        state={state}
        skeleton={<TableSkeleton />}
        isEmpty={(d) => d.length === 0}
      >
        {(rows) => (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(c) => c.id}
            searchText={(c) =>
              `${c.name} ${c.organization} ${c.industry} ${c.email}`
            }
            searchPlaceholder="Search clients"
          />
        )}
      </AsyncView>
    </>
  );
}
