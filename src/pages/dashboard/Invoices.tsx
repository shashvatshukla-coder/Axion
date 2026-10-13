import { CreateRecord } from "@/components/common/CreateRecord";
import { useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAsync } from "@/hooks/useAsync";
import { financeService } from "@/services/financeService";
import { formatDate, formatINR } from "@/lib/utils";
import type { Invoice } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AsyncView } from "@/components/common/AsyncView";
import { TableSkeleton } from "@/components/common/Skeleton";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Tabs } from "@/components/common/Tabs";

type Filter = "all" | Invoice["status"];

const columns: Column<Invoice>[] = [
  {
    key: "id",
    header: "Invoice",
    hideBelow: "sm",
    render: (i) => <span className="font-mono text-xs">{i.id}</span>,
  },
  {
    key: "client",
    header: "Client",
    render: (i) => (
      <div className="min-w-[10rem]">
        <p className="font-medium">{i.client}</p>
        <p className="text-xs text-muted">{i.project}</p>
      </div>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    render: (i) => <span className="font-mono">{formatINR(i.amount)}</span>,
  },
  {
    key: "issued",
    header: "Issued",
    hideBelow: "md",
    render: (i) => (
      <span className="whitespace-nowrap text-xs text-muted">
        {formatDate(i.issued)}
      </span>
    ),
  },
  {
    key: "due",
    header: "Due",
    hideBelow: "sm",
    render: (i) => (
      <span className="whitespace-nowrap text-xs text-muted">
        {formatDate(i.due)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (i) => <StatusBadge status={i.status} />,
  },
];

export default function Invoices() {
  usePageTitle("Invoices");
  const state = useAsync(() => financeService.invoices(), []);
  const [filter, setFilter] = useState<Filter>("all");

  const count = (s: Invoice["status"]) =>
    state.data?.filter((i) => i.status === s).length;

  return (
    <>
      <CreateRecord resource="invoices" onCreated={state.reload} />
      <PageHeader
        title="Invoices"
        description="Everything billed to agency clients."
      />
      <Tabs
        className="mb-5"
        tabs={[
          { id: "all", label: "All", count: state.data?.length },
          { id: "Paid", label: "Paid", count: count("Paid") },
          { id: "Pending", label: "Pending", count: count("Pending") },
          { id: "Overdue", label: "Overdue", count: count("Overdue") },
        ]}
        value={filter}
        onChange={(id) => setFilter(id as Filter)}
      />
      <AsyncView
        state={state}
        skeleton={<TableSkeleton />}
        isEmpty={(d) => d.length === 0}
      >
        {(rows) => (
          <DataTable
            columns={columns}
            rows={
              filter === "all" ? rows : rows.filter((i) => i.status === filter)
            }
            rowKey={(i) => i.id}
            searchText={(i) => `${i.id} ${i.client} ${i.project}`}
            searchPlaceholder="Search invoices"
          />
        )}
      </AsyncView>
    </>
  );
}
