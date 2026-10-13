import { ExternalLink } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { startupService } from '@/services/startupService';
import { STAGE_LABEL } from '@/data/site';
import { hueGradient } from '@/lib/utils';
import type { Startup } from '@/types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AsyncView } from '@/components/common/AsyncView';
import { TableSkeleton } from '@/components/common/Skeleton';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/DataTable';
import { Badge } from '@/components/common/Badge';
import { Progress } from '@/components/common/Progress';
import { AvatarStack } from '@/components/common/Avatar';

const columns: Column<Startup>[] = [
  {
    key: 'name',
    header: 'Startup',
    render: (s) => (
      <div className="flex min-w-[9rem] items-center gap-3">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold text-white"
          style={{ backgroundImage: hueGradient(s.hue) }}
          aria-hidden
        >
          {s.name.slice(0, 1)}
        </span>
        <div>
          <p className="font-medium">{s.name}</p>
          <p className="text-xs text-muted">Since {s.founded}</p>
        </div>
      </div>
    ),
  },
  { key: 'stage', header: 'Stage', render: (s) => <Badge tone="accent">{STAGE_LABEL[s.stage]}</Badge> },
  { key: 'team', header: 'Team', hideBelow: 'md', render: (s) => <AvatarStack names={s.team} /> },
  { key: 'progress', header: 'Progress', hideBelow: 'sm', className: 'w-48', render: (s) => <Progress value={s.progress} showLabel /> },
  {
    key: 'site',
    header: 'Website',
    hideBelow: 'lg',
    render: (s) => (
      <a href={s.website} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
        Visit <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </a>
    ),
  },
];

export default function StartupsAdmin() {
  usePageTitle('Startups');
  const state = useAsync(() => startupService.list(), []);

  return (
    <>
      <PageHeader title="Startups" description="Companies currently incubated or graduated from the club." />
      <AsyncView state={state} skeleton={<TableSkeleton />} isEmpty={(d) => d.length === 0}>
        {(rows) => <DataTable columns={columns} rows={rows} rowKey={(s) => s.id} searchText={(s) => `${s.name} ${s.problem} ${s.solution}`} searchPlaceholder="Search startups" />}
      </AsyncView>
    </>
  );
}
