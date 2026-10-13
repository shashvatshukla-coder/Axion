import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { startupService } from '@/services/startupService';
import { PageHero } from '@/components/layout/PageHero';
import { AsyncView } from '@/components/common/AsyncView';
import { CardGridSkeleton } from '@/components/common/Skeleton';
import { StartupCard } from '@/components/common/StartupCard';
import { ButtonLink } from '@/components/common/Button';

export default function Startups() {
  usePageTitle('Startups');
  const state = useAsync(() => startupService.list(), []);

  return (
    <>
      <PageHero
        eyebrow="Startups"
        title="Companies that started as problems on a whiteboard."
        description="Every startup here went through validation, design and an MVP with the club. Some are still with us. Some have graduated."
        actions={
          <ButtonLink to="/join?type=idea" size="lg">
            Submit your idea
          </ButtonLink>
        }
      />
      <section className="container-x py-12 sm:py-16">
        <AsyncView state={state} skeleton={<CardGridSkeleton />} isEmpty={(d) => d.length === 0}>
          {(startups) => (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {startups.map((s) => (
                <StartupCard key={s.id} startup={s} />
              ))}
            </div>
          )}
        </AsyncView>
      </section>
    </>
  );
}
