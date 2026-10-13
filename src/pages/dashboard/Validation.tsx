import { Check, X } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { ideaService } from '@/services/ideaService';
import { formatDate } from '@/lib/utils';
import type { Idea, ValidationStatus } from '@/types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { AsyncView } from '@/components/common/AsyncView';
import { StatGridSkeleton } from '@/components/common/Skeleton';
import { StatCard } from '@/components/common/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

const STATUSES: ValidationStatus[] = ['Pending', 'In review', 'Validated', 'Rejected'];

export default function Validation() {
  usePageTitle('Validation');
  const state = useAsync(() => ideaService.list(), []);
  const toast = useToast();

  const decide = async (idea: Idea, v: ValidationStatus) => {
    try {
      const updated = await ideaService.setValidation(idea.id, v);
      state.setData((prev) => (prev ? prev.map((i) => (i.id === updated.id ? updated : i)) : prev));
      toast.success(`${idea.title} ${v === 'Validated' ? 'validated' : 'rejected'}.`);
    } catch {
      toast.error('Could not save that decision.');
    }
  };

  return (
    <>
      <PageHeader
        title="Validation"
        description="Ideas waiting for a decision. Validated ideas move on to ideation. Rejected ideas stop here."
      />
      <AsyncView state={state} skeleton={<StatGridSkeleton count={4} />}>
        {(ideas) => {
          const queue = ideas.filter((i) => i.validation === 'Pending' || i.validation === 'In review');
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {STATUSES.map((s) => (
                  <StatCard key={s} label={s} value={String(ideas.filter((i) => i.validation === s).length)} />
                ))}
              </div>

              <h2 className="text-lg font-semibold tracking-tight">Waiting for a decision ({queue.length})</h2>
              {queue.length === 0 ? (
                <EmptyState title="The queue is clear" description="New submissions will appear here for review." />
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {queue.map((i) => (
                    <article key={i.id} className="card flex flex-col gap-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs text-muted">{i.id}</p>
                          <h3 className="mt-0.5 text-lg font-semibold tracking-tight">{i.title}</h3>
                        </div>
                        <StatusBadge status={i.validation} />
                      </div>
                      <p className="text-sm leading-relaxed text-muted">{i.problem}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                        <Badge>{i.category}</Badge>
                        <span>by {i.submittedBy}</span>
                        <span aria-hidden>·</span>
                        <span>{formatDate(i.date)}</span>
                      </div>
                      <div className="mt-auto flex gap-2 border-t border-line pt-4">
                        <Button size="sm" icon={<Check className="h-4 w-4" />} onClick={() => void decide(i, 'Validated')}>
                          Validate
                        </Button>
                        <Button size="sm" variant="secondary" icon={<X className="h-4 w-4" />} onClick={() => void decide(i, 'Rejected')}>
                          Reject
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      </AsyncView>
    </>
  );
}
