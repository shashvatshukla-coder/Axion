import { SectionHeader } from '@/components/common/SectionHeader';
import { Ecosystem } from '@/components/home/Ecosystem';
import { Reveal } from '@/components/common/Reveal';

export function EcosystemSection() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="container-x py-20 sm:py-28">
        <SectionHeader
          eyebrow="Ecosystem"
          title="A bridge between ideas, money and skills"
          description="Students, E-Cell, TBI, other clubs and local businesses each bring something different. The club turns it into products and projects."
        />
        <Reveal className="mt-12">
          <Ecosystem />
        </Reveal>
      </div>
    </section>
  );
}
