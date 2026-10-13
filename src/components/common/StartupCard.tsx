import { ExternalLink } from 'lucide-react';
import type { Startup } from '@/types';
import { STAGE_LABEL } from '@/data/site';
import { Badge } from '@/components/common/Badge';
import { AvatarStack } from '@/components/common/Avatar';
import { Progress } from '@/components/common/Progress';
import { hueGradient, initials } from '@/lib/utils';

export function StartupCard({ startup }: { startup: Startup }) {
  return (
    <article className="card flex h-full flex-col gap-5 p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-center gap-3">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg font-bold text-white"
          style={{ backgroundImage: hueGradient(startup.hue) }}
          aria-hidden
        >
          {initials(startup.name).slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold tracking-tight">{startup.name}</h3>
          <p className="text-xs text-muted">Since {startup.founded}</p>
        </div>
        <Badge tone="accent">{STAGE_LABEL[startup.stage]}</Badge>
      </div>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="eyebrow mb-1">Problem</dt>
          <dd className="leading-relaxed text-muted">{startup.problem}</dd>
        </div>
        <div>
          <dt className="eyebrow mb-1">Solution</dt>
          <dd className="leading-relaxed">{startup.solution}</dd>
        </div>
      </dl>

      <div className="mt-auto space-y-3">
        <Progress value={startup.progress} showLabel />
        <div className="flex items-center justify-between gap-3">
          <AvatarStack names={startup.team} />
          <a
            href={startup.website}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent"
          >
            Website
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}
