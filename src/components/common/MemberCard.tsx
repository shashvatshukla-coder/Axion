import { Github, Linkedin } from 'lucide-react';
import type { Member } from '@/types';
import { Avatar } from '@/components/common/Avatar';

export function MemberCard({ member }: { member: Member }) {
  return (
    <article className="card flex h-full flex-col items-center gap-3 p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <Avatar name={member.name} hue={member.hue} size="lg" />
      <div>
        <h3 className="font-semibold tracking-tight">{member.name}</h3>
        <p className="text-sm text-muted">{member.role}</p>
      </div>
      <ul className="flex flex-wrap justify-center gap-1.5">
        {member.skills.map((s) => (
          <li key={s} className="rounded-md bg-surface2 px-2 py-0.5 text-[11px] text-muted">
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center gap-1 pt-1">
        <a
          href={member.linkedin}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${member.name} on LinkedIn`}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface2 hover:text-fg"
        >
          <Linkedin className="h-4 w-4" />
        </a>
        <a
          href={member.github}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${member.name} on GitHub`}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-surface2 hover:text-fg"
        >
          <Github className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
