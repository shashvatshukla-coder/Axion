import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { CLUB } from '@/data/site';
import { Logo } from '@/components/common/Logo';

const columns = [
  {
    title: 'Divisions',
    links: [
      { label: 'Incubator', to: '/incubator' },
      { label: 'Agency', to: '/agency' },
      { label: 'Startups', to: '/startups' },
      { label: 'Projects', to: '/projects' },
    ],
  },
  {
    title: 'Club',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Team', to: '/team' },
      { label: 'Collaborations', to: '/collaborations' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Get involved',
    links: [
      { label: 'Join the club', to: '/join' },
      { label: 'Submit an idea', to: '/join?type=idea' },
      { label: 'Hire the agency', to: '/agency?request=1' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">{CLUB.blurb}</p>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" aria-hidden /> {CLUB.email}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {CLUB.address}
            </li>
          </ul>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="eyebrow mb-4">{col.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-muted transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {CLUB.name}. Built by students.</p>
          <p>Demo content. Projects, people and figures are placeholders.</p>
        </div>
      </div>
    </footer>
  );
}
