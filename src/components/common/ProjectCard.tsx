import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';
import { Badge } from '@/components/common/Badge';
import type { BadgeTone } from '@/components/common/Badge';
import { AvatarStack } from '@/components/common/Avatar';
import { CoverArt } from '@/components/common/CoverArt';
import { Progress } from '@/components/common/Progress';

const statusTone: Record<Project['status'], BadgeTone> = {
  Active: 'ok',
  Completed: 'neutral',
  Paused: 'warn',
};

interface ProjectCardProps {
  project: Project;
  onOpen?: (project: Project) => void;
  cta?: string;
}

export function ProjectCard({ project, onOpen, cta = 'View Project' }: ProjectCardProps) {
  const isAgency = project.division === 'Agency';
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <CoverArt hue={project.hue} label={project.name} className="h-36" />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={isAgency ? 'agency' : 'accent'}>{project.division}</Badge>
          <Badge tone={statusTone[project.status]}>{project.status}</Badge>
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{project.name}</h3>
          <p className="mt-0.5 text-xs text-muted">{project.type}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.description}</p>
        </div>
        <ul className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <li key={t} className="rounded-md bg-surface2 px-2 py-0.5 font-mono text-[11px] text-muted">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto space-y-3">
          <Progress value={project.progress} tone={isAgency ? 'agency' : 'accent'} showLabel />
          <div className="flex items-center justify-between gap-3">
            <AvatarStack names={project.members} />
            <button
              onClick={() => onOpen?.(project)}
              className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent"
            >
              {cta}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
