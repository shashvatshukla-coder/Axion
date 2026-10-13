import type { Project } from '@/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Progress } from '@/components/common/Progress';
import { CoverArt } from '@/components/common/CoverArt';

/** Full project detail view, meant to sit inside a Drawer. */
export function ProjectDetails({ project }: { project: Project }) {
  const isAgency = project.division === 'Agency';
  return (
    <div className="space-y-6">
      <CoverArt hue={project.hue} label={project.name} className="h-40 rounded-xl" />
      <div className="flex flex-wrap gap-2">
        <Badge tone={isAgency ? 'agency' : 'accent'}>{project.division}</Badge>
        <Badge tone={project.status === 'Active' ? 'ok' : 'neutral'}>{project.status}</Badge>
        <Badge>{project.type}</Badge>
      </div>
      <p className="leading-relaxed text-muted">{project.description}</p>

      <div>
        <p className="eyebrow mb-2">Progress</p>
        <Progress value={project.progress} tone={isAgency ? 'agency' : 'accent'} showLabel />
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="eyebrow mb-1">Started</dt>
          <dd className="font-medium">{formatDate(project.startedAt)}</dd>
        </div>
        {project.client && (
          <div>
            <dt className="eyebrow mb-1">Client</dt>
            <dd className="font-medium">{project.client}</dd>
          </div>
        )}
      </dl>

      <div>
        <p className="eyebrow mb-2">Tech stack</p>
        <ul className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <li key={t} className="rounded-md bg-surface2 px-2 py-1 font-mono text-xs text-muted">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="eyebrow mb-3">Team</p>
        <ul className="space-y-2.5">
          {project.members.map((m) => (
            <li key={m} className="flex items-center gap-3 text-sm">
              <Avatar name={m} size="sm" />
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
