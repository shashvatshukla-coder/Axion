import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { clientService } from '@/services/clientService';
import { leadStages } from '@/data/operations';
import { formatCompactINR } from '@/lib/utils';
import type { Lead, LeadStage } from '@/types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { AsyncView } from '@/components/common/AsyncView';
import { Skeleton } from '@/components/common/Skeleton';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';

const columns = leadStages.map((s) => ({ id: s, title: s }));

function PipelineSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-72 shrink-0 space-y-3 rounded-2xl border border-line p-3">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function Leads() {
  usePageTitle('Leads');
  const state = useAsync(() => clientService.leads(), []);
  const toast = useToast();

  const move = async (lead: Lead, stage: LeadStage) => {
    try {
      const updated = await clientService.moveLead(lead.id, stage);
      state.setData((prev) => (prev ? prev.map((l) => (l.id === updated.id ? updated : l)) : prev));
      toast.success(`${lead.organization} moved to ${stage}.`);
    } catch {
      toast.error('Could not move that lead.');
    }
  };

  const open = (state.data ?? []).filter((l) => l.stage !== 'Closed' && l.stage !== 'Delivered');
  const openValue = open.reduce((sum, l) => sum + l.value, 0);

  return (
    <>
      <PageHeader
        title="Leads"
        description="Agency pipeline from first contact to a closed project. Drag a card, or use the menu on it to move it."
        actions={state.data && <Badge tone="agency">Open pipeline {formatCompactINR(openValue)}</Badge>}
      />
      <AsyncView state={state} skeleton={<PipelineSkeleton />} isEmpty={(d) => d.length === 0}>
        {(leads) => (
          <KanbanBoard
            columns={columns}
            items={leads}
            getColumn={(l) => l.stage}
            getTitle={(l) => l.organization}
            onMove={(l, col) => void move(l, col as LeadStage)}
            renderCard={(l) => (
              <div className="space-y-2">
                <p className="font-medium leading-snug">{l.organization}</p>
                <p className="text-xs text-muted">{l.contact}</p>
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="agency">{l.type}</Badge>
                  <span className="font-mono text-xs">{l.value > 0 ? formatCompactINR(l.value) : 'Value TBD'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Avatar name={l.owner} size="xs" /> {l.owner}
                </div>
              </div>
            )}
          />
        )}
      </AsyncView>
    </>
  );
}
