import { ArrowRight } from 'lucide-react';
import { INCUBATOR_CARDS } from '@/data/site';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ServiceCard } from '@/components/common/ServiceCard';
import { ButtonLink } from '@/components/common/Button';
import { Reveal } from '@/components/common/Reveal';

export function IncubatorSection() {
  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeader
        eyebrow="Incubator"
        title="Where ideas become products"
        description="Six capabilities that take a founder from a rough idea to a product with real users."
        action={
          <ButtonLink to="/incubator" variant="secondary">
            See the full pipeline <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        }
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {INCUBATOR_CARDS.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 0.07}>
            <ServiceCard icon={c.icon} title={c.title} description={c.description} points={c.points} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
