import { Link } from 'react-router-dom';
import { CLUB } from '@/data/site';

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label={`${CLUB.name} home`}>
      <span className="relative h-7 w-7" aria-hidden>
        <span className="absolute left-0 top-0 h-4 w-4 rounded-[4px] bg-accent" />
        <span className="absolute bottom-0 right-0 h-4 w-4 rounded-[4px] bg-agency/90 mix-blend-multiply dark:mix-blend-screen" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">{CLUB.short}</span>
    </Link>
  );
}
