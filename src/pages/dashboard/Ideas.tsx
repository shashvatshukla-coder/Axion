import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowRightLeft, Check, Eye, UserPlus, X } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { ideaService } from '@/services/ideaService';
import { memberService } from '@/services/memberService';
import { STAGE_LABEL, STAGE_ORDER } from '@/data/site';
import { formatDate } from '@/lib/utils';
import type { Idea, StageKey, ValidationStatus } from '@/types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { AsyncView } from '@/components/common/AsyncView';
import { TableSkeleton } from '@/components/common/Skeleton';
import { DataTable } from '@/components/common/DataTable';
import type { Column } from '@/components/common/DataTable';
import { Tabs } from '@/components/common/Tabs';
import { Badge } from '@/components/common/Badge';
import { Drawer } from '@/components/common/Drawer';
import { Modal } from '@/components/common/Modal';
import { Select } from '@/components/common/FormInput';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';

const stageColumns = STAGE_ORDER.map((s) => ({ id: s, title: STAGE_LABEL[s] }));

export default function Ideas() {
  usePageTitle('Ideas');
  const state = useAsync(() => ideaService.list(), []);
  const members = useAsync(() => memberService.list(), []);
  const toast = useToast();

  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [viewing, setViewing] = useState<Idea | null>(null);
  const [assigning, setAssigning] = useState<Idea | null>(null);
  const [moving, setMoving] = useState<Idea | null>(null);
  const [assignee, setAssignee] = useState('');
  const [targetStage, setTargetStage] = useState<StageKey>('problem');
  const [saving, setSaving] = useState(false);

  const replace = (updated: Idea) => {
    state.setData((prev) => (prev ? prev.map((i) => (i.id === updated.id ? updated : i)) : prev));
    setViewing((v) => (v && v.id === updated.id ? updated : v));
  };

  const setValidation = async (idea: Idea, v: ValidationStatus) => {
    try {
      replace(await ideaService.setValidation(idea.id, v));
      toast.success(`${idea.id} ${v === 'Validated' ? 'approved' : 'rejected'}.`);
    } catch {
      toast.error('Could not update that idea. Try again.');
    }
  };

  const moveStage = async (idea: Idea, stage: StageKey) => {
    try {
      replace(await ideaService.moveStage(idea.id, stage));
      toast.success(`${idea.id} moved to ${STAGE_LABEL[stage]}.`);
    } catch {
      toast.error('Could not move that idea. Try again.');
    }
  };

  const saveAssign = async () => {
    if (!assigning || !assignee) return;
    setSaving(true);
    try {
      replace(await ideaService.assign(assigning.id, assignee));
      toast.success(`${assignee} assigned to ${assigning.id}.`);
      setAssigning(null);
      setAssignee('');
    } catch {
      toast.error('Could not assign that member.');
    } finally {
      setSaving(false);
    }
  };

  const saveMove = async () => {
    if (!moving) return;
    setSaving(true);
    await moveStage(moving, targetStage);
    setSaving(false);
    setMoving(null);
  };

  const columns: Column<Idea>[] = [
    { key: 'id', header: 'ID', render: (i) => <span className="font-mono text-xs text-muted">{i.id}</span> },
    {
      key: 'title',
      header: 'Title',
      render: (i) => (
        <div className="min-w-[10rem]">
          <p className="font-medium">{i.title}</p>
          <p className="text-xs text-muted">by {i.submittedBy}</p>
        </div>
      ),
    },
    {
      key: 'problem',
      header: 'Problem',
      hideBelow: 'lg',
      render: (i) => <p className="line-clamp-2 max-w-xs text-xs text-muted">{i.problem}</p>,
    },
    { key: 'category', header: 'Category', hideBelow: 'md', render: (i) => <Badge>{i.category}</Badge> },
    { key: 'validation', header: 'Validation', render: (i) => <StatusBadge status={i.validation} /> },
    { key: 'stage', header: 'Stage', hideBelow: 'md', render: (i) => <Badge tone="accent">{STAGE_LABEL[i.stage]}</Badge> },
    {
      key: 'team',
      header: 'Team',
      hideBelow: 'lg',
      render: (i) =>
        i.team.length === 0 ? (
          <span className="text-xs text-muted">Unassigned</span>
        ) : (
          <div className="flex -space-x-2">
            {i.team.slice(0, 3).map((m) => (
              <Avatar key={m} name={m} size="xs" />
            ))}
          </div>
        ),
    },
    { key: 'date', header: 'Date', hideBelow: 'lg', render: (i) => <span className="whitespace-nowrap text-xs text-muted">{formatDate(i.date)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (i) => (
        <div className="flex items-center gap-0.5">
          <ActionButton label="View" onClick={() => setViewing(i)} icon={<Eye className="h-4 w-4" />} />
          <ActionButton
            label="Assign"
            onClick={() => {
              setAssigning(i);
              setAssignee('');
            }}
            icon={<UserPlus className="h-4 w-4" />}
          />
          <ActionButton
            label="Approve"
            tone="ok"
            disabled={i.validation === 'Validated'}
            onClick={() => void setValidation(i, 'Validated')}
            icon={<Check className="h-4 w-4" />}
          />
          <ActionButton
            label="Reject"
            tone="bad"
            disabled={i.validation === 'Rejected'}
            onClick={() => void setValidation(i, 'Rejected')}
            icon={<X className="h-4 w-4" />}
          />
          <ActionButton
            label="Move Stage"
            onClick={() => {
              setMoving(i);
              setTargetStage(i.stage);
            }}
            icon={<ArrowRightLeft className="h-4 w-4" />}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Ideas"
        description="Every submitted idea, from first review to scale. Approve, assign or move ideas between stages."
      />
      <Tabs
        className="mb-5"
        tabs={[
          { id: 'table', label: 'Table', count: state.data?.length },
          { id: 'kanban', label: 'Kanban board' },
        ]}
        value={view}
        onChange={(id) => setView(id as 'table' | 'kanban')}
      />

      <AsyncView state={state} skeleton={<TableSkeleton />} isEmpty={(d) => d.length === 0}>
        {(ideas) =>
          view === 'table' ? (
            <DataTable
              columns={columns}
              rows={ideas}
              rowKey={(i) => i.id}
              searchText={(i) => `${i.id} ${i.title} ${i.submittedBy} ${i.category} ${i.problem}`}
              searchPlaceholder="Search ideas"
            />
          ) : (
            <KanbanBoard
              columns={stageColumns}
              items={ideas}
              getColumn={(i) => i.stage}
              getTitle={(i) => i.title}
              onMove={(i, col) => void moveStage(i, col as StageKey)}
              renderCard={(i) => (
                <div className="space-y-2">
                  <p className="font-medium leading-snug">{i.title}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] text-muted">{i.id}</span>
                    <Badge>{i.category}</Badge>
                  </div>
                  <StatusBadge status={i.validation} />
                </div>
              )}
            />
          )
        }
      </AsyncView>

      <Drawer open={viewing !== null} onClose={() => setViewing(null)} title={viewing?.title} description={viewing?.id}>
        {viewing && (
          <div className="space-y-5 text-sm">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={viewing.validation} />
              <Badge tone="accent">{STAGE_LABEL[viewing.stage]}</Badge>
              <Badge>{viewing.category}</Badge>
            </div>
            <div>
              <p className="eyebrow mb-1">Problem</p>
              <p className="leading-relaxed">{viewing.problem}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="eyebrow mb-1">Submitted by</p>
                <p className="font-medium">{viewing.submittedBy}</p>
              </div>
              <div>
                <p className="eyebrow mb-1">Date</p>
                <p className="font-medium">{formatDate(viewing.date)}</p>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-2">Team</p>
              {viewing.team.length === 0 ? (
                <p className="text-muted">Nobody assigned yet.</p>
              ) : (
                <ul className="space-y-2">
                  {viewing.team.map((m) => (
                    <li key={m} className="flex items-center gap-3">
                      <Avatar name={m} size="sm" /> {m}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              <Button size="sm" onClick={() => void setValidation(viewing, 'Validated')} disabled={viewing.validation === 'Validated'}>
                Approve
              </Button>
              <Button size="sm" variant="danger" onClick={() => void setValidation(viewing, 'Rejected')} disabled={viewing.validation === 'Rejected'}>
                Reject
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={assigning !== null}
        onClose={() => setAssigning(null)}
        size="sm"
        title="Assign a member"
        description={assigning?.title}
      >
        <div className="space-y-5">
          <AsyncView state={members} skeleton={<p className="text-sm text-muted">Loading members…</p>}>
            {(list) => (
              <Select
                label="Member"
                placeholder="Choose a member"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                options={list
                  .filter((m) => m.status === 'Active')
                  .map((m) => ({ value: m.name, label: `${m.name} · ${m.role}` }))}
              />
            )}
          </AsyncView>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAssigning(null)}>
              Cancel
            </Button>
            <Button onClick={() => void saveAssign()} disabled={!assignee} loading={saving}>
              Assign
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={moving !== null} onClose={() => setMoving(null)} size="sm" title="Move stage" description={moving?.title}>
        <div className="space-y-5">
          <Select
            label="New stage"
            value={targetStage}
            onChange={(e) => setTargetStage(e.target.value as StageKey)}
            options={STAGE_ORDER.map((s) => ({ value: s, label: STAGE_LABEL[s] }))}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setMoving(null)}>
              Cancel
            </Button>
            <Button onClick={() => void saveMove()} loading={saving}>
              Move
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  tone,
  disabled,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  tone?: 'ok' | 'bad';
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`rounded-lg p-1.5 text-muted transition-colors hover:bg-surface2 disabled:opacity-30 ${
        tone === 'ok' ? 'hover:text-ok' : tone === 'bad' ? 'hover:text-bad' : 'hover:text-fg'
      }`}
    >
      {icon}
    </button>
  );
}
