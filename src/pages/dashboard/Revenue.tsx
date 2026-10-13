import { Banknote, Clock, HandCoins, Landmark } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { analyticsService } from '@/services/analyticsService';
import { financeService } from '@/services/financeService';
import { formatDate, formatINR } from '@/lib/utils';
import type { Invoice } from '@/types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { AsyncView } from '@/components/common/AsyncView';
import { ChartSkeleton, StatGridSkeleton, TableSkeleton } from '@/components/common/Skeleton';
import { StatCard } from '@/components/common/StatCard';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/DataTable';
import { ChartCard, RevenueChart } from '@/components/dashboard/Charts';

const columns: Column<Invoice>[] = [
  {
    key: 'client',
    header: 'Client',
    render: (i) => (
      <div className="min-w-[10rem]">
        <p className="font-medium">{i.client}</p>
        <p className="text-xs text-muted">{i.project}</p>
      </div>
    ),
  },
  { key: 'amount', header: 'Amount', render: (i) => <span className="font-mono">{formatINR(i.amount)}</span> },
  { key: 'paid', header: 'Paid on', hideBelow: 'sm', render: (i) => <span className="whitespace-nowrap text-xs text-muted">{formatDate(i.due)}</span> },
  { key: 'status', header: 'Status', render: (i) => <StatusBadge status={i.status} /> },
];

export default function Revenue() {
  usePageTitle('Revenue');
  const overview = useAsync(() => financeService.overview(), []);
  const analytics = useAsync(() => analyticsService.overview(), []);
  const invoices = useAsync(() => financeService.invoices(), []);

  return (
    <>
      <PageHeader title="Revenue" description="Money coming in from agency work, and what has gone back out to members." />

      <div className="space-y-6">
        <AsyncView state={overview} skeleton={<StatGridSkeleton count={4} />}>
          {(o) => (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total revenue" value={formatINR(o.totalRevenue)} icon={Banknote} />
              <StatCard label="Pending payments" value={formatINR(o.pendingPayments)} icon={Clock} />
              <StatCard label="Member payouts" value={formatINR(o.memberPayouts)} icon={HandCoins} />
              <StatCard label="Available balance" value={formatINR(o.availableBalance)} icon={Landmark} />
            </div>
          )}
        </AsyncView>

        <AsyncView state={analytics} skeleton={<ChartSkeleton />}>
          {(d) => (
            <ChartCard title="Revenue and expenses" subtitle="Monthly, in rupees">
              <RevenueChart data={d.revenueByMonth} />
            </ChartCard>
          )}
        </AsyncView>

        <section>
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Client payments</h2>
          <AsyncView state={invoices} skeleton={<TableSkeleton rows={5} />}>
            {(all) => (
              <DataTable
                columns={columns}
                rows={all.filter((i) => i.status === 'Paid')}
                rowKey={(i) => i.id}
                pageSize={6}
                searchText={(i) => `${i.client} ${i.project}`}
                searchPlaceholder="Search payments"
              />
            )}
          </AsyncView>
        </section>
      </div>
    </>
  );
}
