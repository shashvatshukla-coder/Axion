import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { JOIN_OPTIONS } from '@/data/site';
import type { JoinOption } from '@/data/site';
import { PageHero } from '@/components/layout/PageHero';
import { Modal } from '@/components/common/Modal';
import { Reveal } from '@/components/common/Reveal';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { IdeaForm } from '@/components/forms/IdeaForm';

export default function Join() {
  usePageTitle('Join');
  const [params, setParams] = useSearchParams();
  const [active, setActive] = useState<JoinOption | null>(null);

  const type = params.get('type');
  useEffect(() => {
    if (type) {
      const match = JOIN_OPTIONS.find((o) => o.id === type);
      if (match) setActive(match);
    }
  }, [type]);

  const close = () => {
    setActive(null);
    if (params.has('type')) {
      const next = new URLSearchParams(params);
      next.delete('type');
      setParams(next, { replace: true });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Join"
        title="Pick the way you want to take part."
        description="Every application is read by a person. Most people hear back within a week."
      />

      <section className="container-x py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {JOIN_OPTIONS.map((o, i) => {
            const Icon = o.icon;
            return (
              <Reveal key={o.id} delay={(i % 3) * 0.06} className="h-full">
                <button
                  onClick={() => setActive(o)}
                  className="card group flex h-full w-full flex-col items-start gap-4 p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-glow"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold tracking-tight">{o.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{o.description}</span>
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    {o.kind === 'idea' ? 'Start the form' : 'Apply'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Modal
        open={active !== null}
        onClose={close}
        size="lg"
        title={active?.title}
        description={active?.kind === 'idea' ? 'Seven short steps. You can go back at any point.' : 'Tell us a little about you.'}
      >
        {active && (active.kind === 'idea' ? <IdeaForm onDone={close} /> : <ApplicationForm key={active.id} kind={active.title} onDone={close} />)}
      </Modal>
    </>
  );
}
