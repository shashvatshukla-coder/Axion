import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { memberService } from '@/services/memberService';
import { teamOrder } from '@/data/members';
import { PageHero } from '@/components/layout/PageHero';
import { AsyncView } from '@/components/common/AsyncView';
import { CardGridSkeleton } from '@/components/common/Skeleton';
import { MemberCard } from '@/components/common/MemberCard';
import { Reveal } from '@/components/common/Reveal';
import { ButtonLink } from '@/components/common/Button';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function Team() {
  usePageTitle('Team');
  const state = useAsync(() => memberService.list(), []);

  return (
    <>
      <PageHero
        eyebrow="Team"
        title="The people who run it."
        description="Nine teams across the incubator and the agency. Everyone here is a student or recent graduate."
        actions={
          <ButtonLink to="/join" size="lg">
            Join a team
          </ButtonLink>
        }
      />

      <section className="container-x py-12 sm:py-16">
        <nav aria-label="Teams" className="scrollbar-none -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {teamOrder.map((t) => (
            <a
              key={t}
              href={`#team-${slug(t)}`}
              className="shrink-0 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-muted transition-colors hover:text-fg"
            >
              {t}
            </a>
          ))}
        </nav>

        <AsyncView state={state} skeleton={<CardGridSkeleton count={8} />} isEmpty={(d) => d.length === 0}>
          {(members) => (
            <div className="space-y-16">
              {teamOrder.map((team) => {
                const list = members.filter((m) => m.team === team);
                if (list.length === 0) return null;
                return (
                  <section key={team} id={`team-${slug(team)}`} className="scroll-mt-24">
                    <div className="mb-6 flex items-baseline gap-3">
                      <h2 className="text-2xl font-semibold tracking-tight">{team}</h2>
                      <span className="font-mono text-xs text-muted">{list.length}</span>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      {list.map((m, i) => (
                        <Reveal key={m.id} delay={(i % 4) * 0.05} className="h-full">
                          <MemberCard member={m} />
                        </Reveal>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </AsyncView>
      </section>
    </>
  );
}
