import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { operationsService } from '@/services/operationsService';
import { ECOSYSTEM_INPUTS } from '@/data/site';
import { formatDate } from '@/lib/utils';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Ecosystem } from '@/components/home/Ecosystem';
import { AsyncView } from '@/components/common/AsyncView';
import { CardGridSkeleton } from '@/components/common/Skeleton';
import { Badge } from '@/components/common/Badge';
import type { BadgeTone } from '@/components/common/Badge';
import { ButtonLink } from '@/components/common/Button';
import { Reveal } from '@/components/common/Reveal';
import type { Collaboration } from '@/types';

const kindTone: Record<Collaboration['kind'], BadgeTone> = {
  Club: 'accent',
  'E-Cell': 'accent',
  TBI: 'accent',
  Industry: 'agency',
  MSME: 'agency',
};

export default function Collaborations() {
  usePageTitle('Collaborations');
  const state = useAsync(() => operationsService.collaborations(), []);

  return (
    <>
      <PageHero
        eyebrow="Collaborations"
        title="The club works best when others bring something to it."
        description="Other clubs add technical skills. Businesses bring paid work. Students bring ideas. E-Cell and the TBI open doors to funding and incubation."
        actions={
          <ButtonLink to="/contact" size="lg">
            Collaborate with us
          </ButtonLink>
        }
      />

      <section className="container-x py-16 sm:py-20">
        <SectionHeader eyebrow="The model" title="Who gives what, and where it goes" />
        <div className="mt-10">
          <Ecosystem />
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM_INPUTS.map((n) => (
            <li key={n.id} className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">
              <span className="font-semibold">{n.label}</span>
              <span className="mx-2 text-muted" aria-hidden>
                →
              </span>
              <span className="text-muted">{n.gives}</span>
            </li>
          ))}
          <li className="rounded-xl border border-line bg-surface px-4 py-3 text-sm sm:col-span-2 lg:col-span-3">
            <span className="font-semibold">Club teams</span>
            <span className="mx-2 text-muted" aria-hidden>
              →
            </span>
            <span className="text-muted">Execute and manage projects</span>
          </li>
        </ul>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="container-x py-16 sm:py-20">
          <SectionHeader eyebrow="Partners" title="Current and upcoming collaborations" />
          <div className="mt-10">
            <AsyncView state={state} skeleton={<CardGridSkeleton count={6} />} isEmpty={(d) => d.length === 0}>
              {(items) => (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((c, i) => (
                    <Reveal key={c.id} delay={(i % 3) * 0.06} className="h-full">
                      <article className="h-full rounded-2xl border border-line bg-bg p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={kindTone[c.kind]}>{c.kind}</Badge>
                          <Badge tone={c.status === 'Active' ? 'ok' : 'neutral'}>{c.status}</Badge>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold tracking-tight">{c.partner}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.summary}</p>
                        <p className="mt-4 font-mono text-xs text-muted">Since {formatDate(c.since)}</p>
                      </article>
                    </Reveal>
                  ))}
                </div>
              )}
            </AsyncView>
          </div>
        </div>
      </section>
    </>
  );
}
