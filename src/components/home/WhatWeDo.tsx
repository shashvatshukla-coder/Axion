import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Rocket } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Reveal } from '@/components/common/Reveal';

const DIVISIONS = [
  {
    to: '/incubator',
    icon: Rocket,
    name: 'Incubator',
    tagline: 'Ideas → Products',
    text: 'We find real problems, test whether people care, then design and build the first version with the founder.',
    points: ['Problem scouting and analysis', 'Market validation reports', 'Design, MVP and product-market fit'],
    tone: 'accent' as const,
  },
  {
    to: '/agency',
    icon: Briefcase,
    name: 'Agency',
    tagline: 'Skills → Solutions',
    text: 'Paid web, mobile and AI work for small businesses and industry. Members earn while learning on real briefs.',
    points: ['Web, mobile, AI and automation', 'QA and delivery tracking', 'Transparent invoices and payouts'],
    tone: 'agency' as const,
  },
];

export function WhatWeDo() {
  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeader
        eyebrow="What we do"
        title="Two divisions, one team"
        description="The incubator builds new products. The agency does paid client work. Both share the same people, tools and standards."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {DIVISIONS.map((d, i) => {
          const Icon = d.icon;
          const isAccent = d.tone === 'accent';
          return (
            <Reveal key={d.name} delay={i * 0.08}>
              <Link
                to={d.to}
                className="card group relative block h-full overflow-hidden p-7 transition-all hover:-translate-y-1 hover:shadow-glow sm:p-9"
              >
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl transition-opacity group-hover:opacity-100 ${
                    isAccent ? 'bg-accent/15' : 'bg-agency/15'
                  } opacity-60`}
                  aria-hidden
                />
                <div className="relative">
                  <span className={`grid h-12 w-12 place-items-center rounded-xl ${isAccent ? 'bg-accent/10 text-accent' : 'bg-agency/10 text-agency'}`}>
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="eyebrow mt-8">{d.name}</p>
                  <h3 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{d.tagline}</h3>
                  <p className="mt-4 max-w-md leading-relaxed text-muted">{d.text}</p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {d.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${isAccent ? 'bg-accent' : 'bg-agency'}`} aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <span className={`mt-8 inline-flex items-center gap-1.5 text-sm font-medium ${isAccent ? 'text-accent' : 'text-agency'}`}>
                    Learn about the {d.name.toLowerCase()}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
