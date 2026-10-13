import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { operationsService } from '@/services/operationsService';
import { formatDate } from '@/lib/utils';
import type { Collaboration } from '@/types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { AsyncView } from '@/components/common/AsyncView';
import { TableSkeleton } from '@/components/common/Skeleton';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';

const columns: Column<Collaboration>[] = [
  { key: 'partner', header: 'Partner', render: (c) => <span className="font-medium">{c.partner}</span> },
  { key: 'kind', header: 'Type', hideBelow: 'sm', render: (c) => <Badge>{c.kind}</Badge> },
  { key: 'summary', header: 'What we do together', hideBelow: 'md', render: (c) => <span className="text-muted">{c.summary}</span> },
  { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
  { key: 'since', header: 'Since', hideBelow: 'lg', render: (c) => <span className="whitespace-nowrap text-xs text-muted">{formatDate(c.since)}</span> },
];

export default function CollaborationsAdmin() {
  usePageTitle('Collaborations');
  const state = useAsync(() => operationsService.collaborations(), []);

  return (
    <>
      <PageHeader title="Collaborations" description="Clubs, E-Cell, TBI and businesses the club works with." />
      <AsyncView state={state} skeleton={<TableSkeleton />} isEmpty={(d) => d.length === 0}>
        {(rows) => (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(c) => c.id}
            searchText={(c) => `${c.partner} ${c.kind} ${c.summary}`}
            searchPlaceholder="Search collaborations"
          />
        )}
      </AsyncView>
    </>
  );
}
