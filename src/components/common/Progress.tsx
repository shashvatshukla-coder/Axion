import { cn, clamp } from '@/lib/utils';

export function Progress({
  value,
  tone = 'accent',
  showLabel = false,
  className,
}: {
  value: number;
  tone?: 'accent' | 'agency' | 'ok';
  showLabel?: boolean;
  className?: string;
}) {
  const pct = clamp(Math.round(value), 0, 100);
  const fill = tone === 'agency' ? 'bg-agency' : tone === 'ok' ? 'bg-ok' : 'bg-accent';
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface2"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={cn('h-full rounded-full transition-all duration-700', fill)} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="w-9 text-right font-mono text-xs text-muted">{pct}%</span>}
    </div>
  );
}
