import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { AGENCY_AREAS, AGENCY_PROCESS, AGENCY_SERVICES } from '@/data/site';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ServiceCard } from '@/components/common/ServiceCard';
import { Reveal } from '@/components/common/Reveal';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ProcessTimeline } from '@/components/agency/ProcessTimeline';
import { ClientProjectForm } from '@/components/forms/ClientProjectForm';

export default function Agency() {
  usePageTitle('Agency');
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(params.get('request') === '1');

  const close = () => {
    setOpen(false);
    if (params.has('request')) {
      const next = new URLSearchParams(params);
      next.delete('request');
      setParams(next, { replace: true });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Agency · Skills to solutions"
        title="Your Technical Team, On Demand."
        description="Web, mobile, AI and automation delivered by student teams with a dedicated QA owner, weekly demos and a named delivery lead."
        actions={
          <Button size="lg" variant="agency" onClick={() => setOpen(true)}>
            Request Project <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        }
      />

      <section className="container-x py-20 sm:py-24">
        <SectionHeader
          eyebrow="Services"
          title="What we build"
          description="Pick one service or combine several in a single project."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AGENCY_SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.07}>
              <ServiceCard icon={s.icon} title={s.title} description={s.description} tags={s.tags} tone="agency" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-x py-20 sm:py-24">
          <SectionHeader
            eyebrow="Process"
            title="From first call to support"
            description="Seven steps, the same every time, so you always know what happens next."
          />
          <div className="mt-12">
            <ProcessTimeline steps={AGENCY_PROCESS} />
          </div>
        </div>
      </section>

      <section className="container-x py-20 sm:py-24">
        <SectionHeader
          eyebrow="Behind the scenes"
          title="How the agency runs"
          description="Four functions keep work coming in and going out cleanly."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AGENCY_AREAS.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06}>
              <ServiceCard icon={a.icon} title={a.title} description={a.description} points={a.points} tone="agency" />
            </Reveal>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-surface p-7 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">Have a project in mind?</h3>
            <p className="mt-1 text-sm text-muted">Tell us what you need. You will hear back within two working days.</p>
          </div>
          <Button size="lg" variant="agency" onClick={() => setOpen(true)}>
            Request Project
          </Button>
        </div>
      </section>

      <Modal
        open={open}
        onClose={close}
        size="lg"
        title="Request a project"
        description="A delivery lead will read this and reply with questions or a proposal."
      >
        <ClientProjectForm onDone={close} />
      </Modal>
    </>
  );
}
