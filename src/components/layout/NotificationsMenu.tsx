import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { operationsService } from '@/services/operationsService';
import { useAsync } from '@/hooks/useAsync';
import { Skeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [readAll, setReadAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const state = useAsync(() => operationsService.notifications(), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const items = state.data ?? [];
  const unread = readAll ? 0 : items.filter((n) => n.unread).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:bg-surface2 hover:text-fg"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <button onClick={() => setReadAll(true)} className="text-xs text-muted hover:text-fg">
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {state.loading && (
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}
            {state.error && <ErrorState title="Could not load" description="Notifications failed to load." onRetry={state.reload} />}
            {!state.loading && !state.error && items.length === 0 && (
              <p className="px-4 py-10 text-center text-sm text-muted">You are all caught up.</p>
            )}
            <ul className="divide-y divide-line">
              {items.map((n) => (
                <li key={n.id} className="flex gap-3 px-4 py-3">
                  <span
                    className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.unread && !readAll ? 'bg-accent' : 'bg-transparent')}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs leading-relaxed text-muted">{n.detail}</p>
                    <p className="mt-1 font-mono text-[10px] text-muted">{n.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
