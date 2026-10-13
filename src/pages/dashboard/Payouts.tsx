import { CreateRecord } from "@/components/common/CreateRecord";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAsync } from "@/hooks/useAsync";
import { financeService } from "@/services/financeService";
import { formatDate, formatINR } from "@/lib/utils";
import type { Payout } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AsyncView } from "@/components/common/AsyncView";
import { TableSkeleton } from "@/components/common/Skeleton";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Avatar } from "@/components/common/Avatar";

const columns: Column<Payout>[] = [
  {
    key: "member",
    header: "Member",
    render: (p) => (
      <div className="flex min-w-[9rem] items-center gap-3">
        <Avatar name={p.member} size="sm" />
        <span className="font-medium">{p.member}</span>
      </div>
    ),
  },
  {
    key: "project",
    header: "Project",
    hideBelow: "sm",
    render: (p) => <span className="text-muted">{p.project}</span>,
  },
  {
    key: "amount",
    header: "Amount",
    render: (p) => <span className="font-mono">{formatINR(p.amount)}</span>,
  },
  {
    key: "date",
    header: "Date",
    hideBelow: "md",
    render: (p) => (
      <span className="whitespace-nowrap text-xs text-muted">
        {formatDate(p.date)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (p) => <StatusBadge status={p.status} />,
  },
];

export default function Payouts() {
  usePageTitle("Payouts");
  const state = useAsync(() => financeService.payouts(), []);

  return (
    <>
      <CreateRecord resource="payouts" onCreated={state.reload} />
      <PageHeader
        title="Payouts"
        description="Money shared with members for client work they delivered."
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
            rowKey={(p) => p.id}
            searchText={(p) => `${p.member} ${p.project}`}
            searchPlaceholder="Search payouts"
          />
        )}
      </AsyncView>
    </>
  );
}
