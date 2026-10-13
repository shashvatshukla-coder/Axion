import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { INCUBATOR_AREAS, PIPELINE } from '@/data/site';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ServiceCard } from '@/components/common/ServiceCard';
import { Reveal } from '@/components/common/Reveal';
import { ButtonLink, Button } from '@/components/common/Button';
import { StageCard } from '@/components/incubator/StageCard';

export default function Incubator() {
  usePageTitle('Incubator');
  const [openId, setOpenId] = useState<string | null>(PIPELINE[0].id);
  const [expandAll, setExpandAll] = useState(false);

  const isOpen = (id: string) => expandAll || openId === id;

  return (
    <>
      <PageHero
        eyebrow="Incubator · Idea to product"
        title="We turn problems and ideas into products."
        description="A structured path with eight stages. Each one has a clear purpose, a responsible team and things that must be delivered before an idea moves on."
        actions={
          <>
            <ButtonLink to="/join?type=idea" size="lg">
              Submit an idea <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink to="/startups" size="lg" variant="secondary">
              See incubated startups
            </ButtonLink>
          </>
        }
      />

      <section className="container-x py-20 sm:py-24">
        <SectionHeader
          eyebrow="The pipeline"
          title="Eight stages, one path"
          description="Open a stage to see what happens in it."
          action={
            <Button variant="secondary" onClick={() => setExpandAll((v) => !v)}>
              {expandAll ? 'Collapse all' : 'Expand all'}
            </Button>
          }
        />
        <div className="mt-10 space-y-3">
          {PIPELINE.map((s) => (
            <StageCard
              key={s.id}
              stage={s}
              open={isOpen(s.id)}
              onToggle={() => {
                setExpandAll(false);
                setOpenId((cur) => (cur === s.id ? null : s.id));
              }}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="container-x py-20 sm:py-24">
          <SectionHeader
            eyebrow="Focus areas"
            title="What the incubator covers"
            description="Four areas of work, from scouting problems to making a product last."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {INCUBATOR_AREAS.map((a, i) => (
              <Reveal key={a.title} delay={(i % 2) * 0.07}>
                <ServiceCard icon={a.icon} title={a.title} description={a.description} points={a.points} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
