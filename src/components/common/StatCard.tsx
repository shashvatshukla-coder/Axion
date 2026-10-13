import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, delta, trend = 'flat', icon: Icon, className }: StatCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  return (
    <div className={cn('card p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-muted" aria-hidden />}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      {delta && (
        <p
          className={cn(
            'mt-2 flex items-center gap-1 text-xs',
            trend === 'up' && 'text-ok',
            trend === 'down' && 'text-bad',
            trend === 'flat' && 'text-muted',
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" aria-hidden />
          {delta}
        </p>
      )}
    </div>
  );
}
