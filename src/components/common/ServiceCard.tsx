import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tags?: string[];
  points?: string[];
  tone?: 'accent' | 'agency';
}

/** Used for incubator areas, agency services and any other icon + title + text card. */
export function ServiceCard({ icon: Icon, title, description, tags, points, tone = 'accent' }: ServiceCardProps) {
  return (
    <article className="card group h-full p-6 transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <span
        className={cn(
          'grid h-11 w-11 place-items-center rounded-xl',
          tone === 'accent' ? 'bg-accent/10 text-accent' : 'bg-agency/10 text-agency',
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      {points && (
        <ul className="mt-4 space-y-1.5 text-sm">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span className={cn('mt-2 h-1 w-1 shrink-0 rounded-full', tone === 'accent' ? 'bg-accent' : 'bg-agency')} aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
      {tags && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <li key={t} className="rounded-md bg-surface2 px-2 py-0.5 font-mono text-[11px] text-muted">
              {t}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
