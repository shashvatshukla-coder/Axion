import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { CLUB, CLUB_TIMELINE, VALUES } from '@/data/site';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Reveal } from '@/components/common/Reveal';
import { ButtonLink } from '@/components/common/Button';

const CORE_DUTIES = [
  'Members and onboarding',
  'Projects and tasks',
  'Incubator ideas',
  'Agency clients',
  'Funding and partnerships',
  'Financial operations',
  'Progress tracking and reports',
];

export default function About() {
  usePageTitle('About');
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A club that treats campus problems as real work."
        description={`${CLUB.name} began as six students helping a local shop. Today it is an incubator, an agency and a team of about 150 people learning by shipping.`}
      />

      <section className="container-x grid gap-5 py-20 sm:py-24 md:grid-cols-2">
        <Reveal>
          <div className="card h-full p-7">
            <p className="eyebrow text-accent">Incubator</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Idea to product</h2>
            <p className="mt-3 leading-relaxed text-muted">
              We find real problems, check that people care, then design and build the first version with the founder. Ideas that do not hold up stop early, so effort goes to the ones that do.
            </p>
            <Link to="/incubator" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              How the incubator works <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="card h-full p-7">
            <p className="eyebrow text-agency">Agency</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Skills to solutions</h2>
            <p className="mt-3 leading-relaxed text-muted">
              We build websites, apps and automations for small businesses and industry. Clients get a reliable team, and members get paid practice on real briefs.
            </p>
            <Link to="/agency" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-agency">
              How the agency works <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-x py-20 sm:py-24">
          <SectionHeader eyebrow="How we work" title="Four habits that shape everything" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-line bg-bg p-6">
                  <h3 className="font-semibold tracking-tight">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-20 sm:py-24 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeader
            eyebrow="Core team"
            title="One team runs both divisions"
            description="A single core team keeps the incubator and agency consistent, so a member can work on a startup one month and a client project the next."
          />
          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {CORE_DUTIES.map((d) => (
              <li key={d} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {d}
              </li>
            ))}
          </ul>
          <ButtonLink to="/team" variant="secondary" className="mt-8">
            Meet the team
          </ButtonLink>
        </div>

        <div>
          <p className="eyebrow mb-6">Our history</p>
          <ol className="relative space-y-8 border-l border-line pl-6">
            {CLUB_TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[1.9rem] top-1 h-3 w-3 rounded-full border-2 border-accent bg-bg" aria-hidden />
                <p className="font-mono text-xs text-accent">{t.year}</p>
                <h3 className="mt-1 font-semibold tracking-tight">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
