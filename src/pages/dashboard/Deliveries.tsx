import { CreateRecord } from "@/components/common/CreateRecord";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAsync } from "@/hooks/useAsync";
import { clientService } from "@/services/clientService";
import { formatDate } from "@/lib/utils";
import type { Delivery } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AsyncView } from "@/components/common/AsyncView";
import { TableSkeleton } from "@/components/common/Skeleton";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Progress } from "@/components/common/Progress";

const columns: Column<Delivery>[] = [
  {
    key: "project",
    header: "Project",
    render: (d) => (
      <div className="min-w-[10rem]">
        <p className="font-medium">{d.project}</p>
        <p className="text-xs text-muted">{d.client}</p>
      </div>
    ),
  },
  {
    key: "milestone",
    header: "Milestone",
    hideBelow: "md",
    render: (d) => <span>{d.milestone}</span>,
  },
  {
    key: "due",
    header: "Due",
    render: (d) => (
      <span className="whitespace-nowrap text-xs text-muted">
        {formatDate(d.due)}
      </span>
    ),
  },
  { key: "qa", header: "QA", render: (d) => <StatusBadge status={d.qa} /> },
  {
    key: "progress",
    header: "Progress",
    hideBelow: "sm",
    className: "w-44",
    render: (d) => <Progress value={d.progress} tone="agency" showLabel />,
  },
];

export default function Deliveries() {
  usePageTitle("Deliveries");
  const state = useAsync(() => clientService.deliveries(), []);

  return (
    <>
      <CreateRecord resource="deliveries" onCreated={state.reload} />
      <PageHeader
        title="Deliveries"
        description="Upcoming and finished milestones with their QA status."
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
            rowKey={(d) => d.id}
            searchText={(d) => `${d.project} ${d.client} ${d.milestone}`}
            searchPlaceholder="Search deliveries"
          />
        )}
      </AsyncView>
    </>
  );
}
