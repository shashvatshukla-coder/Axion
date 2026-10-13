import { CreateRecord } from "@/components/common/CreateRecord";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/hooks/useToast";
import { operationsService } from "@/services/operationsService";
import { formatDate } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AsyncView } from "@/components/common/AsyncView";
import { Skeleton } from "@/components/common/Skeleton";
import { Avatar } from "@/components/common/Avatar";

const STATUSES: TaskStatus[] = ["Todo", "In progress", "Review", "Done"];
const columns = STATUSES.map((s) => ({ id: s, title: s }));

export default function Tasks() {
  usePageTitle("Tasks");
  const state = useAsync(() => operationsService.tasks(), []);
  const toast = useToast();

  const move = async (task: Task, status: TaskStatus) => {
    try {
      const updated = await operationsService.moveTask(task.id, status);
      state.setData((prev) =>
        prev ? prev.map((t) => (t.id === updated.id ? updated : t)) : prev,
      );
      toast.success(`"${task.title}" is now ${status.toLowerCase()}.`);
    } catch {
      toast.error("Could not update that task.");
    }
  };

  return (
    <>
      <CreateRecord resource="tasks" onCreated={state.reload} />
      <PageHeader
        title="Tasks"
        description="Work in flight across both divisions. Drag a card or use the menu on it to change its status."
      />
      <AsyncView
        state={state}
        skeleton={
          <div className="grid gap-4 md:grid-cols-4">
            {STATUSES.map((s) => (
              <Skeleton key={s} className="h-64" />
            ))}
          </div>
        }
        isEmpty={(d) => d.length === 0}
      >
        {(tasks) => (
          <KanbanBoard
            columns={columns}
            items={tasks}
            columnWidth="w-72"
            getColumn={(t) => t.status}
            getTitle={(t) => t.title}
            onMove={(t, col) => void move(t, col as TaskStatus)}
            renderCard={(t) => (
              <div className="space-y-2">
                <p className="font-medium leading-snug">{t.title}</p>
                <p className="text-xs text-muted">{t.project}</p>
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={t.priority} />
                  <span className="font-mono text-[11px] text-muted">
                    Due {formatDate(t.due)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Avatar name={t.assignee} size="xs" /> {t.assignee}
                </div>
              </div>
            )}
          />
        )}
      </AsyncView>
    </>
  );
}
