import { ArrowRight } from 'lucide-react';
import { AGENCY_SERVICES } from '@/data/site';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ServiceCard } from '@/components/common/ServiceCard';
import { ButtonLink } from '@/components/common/Button';
import { Reveal } from '@/components/common/Reveal';

export function AgencySection() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="container-x py-20 sm:py-28">
        <SectionHeader
          eyebrow="Agency services"
          title="Technical help for businesses that need it now"
          description="Student teams with senior review and a dedicated QA owner on every project."
          action={
            <ButtonLink to="/agency" variant="agency">
              Work with the agency <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          }
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AGENCY_SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.07}>
              <ServiceCard icon={s.icon} title={s.title} description={s.description} tags={s.tags} tone="agency" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
