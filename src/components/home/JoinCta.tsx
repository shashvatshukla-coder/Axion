import { ButtonLink } from '@/components/common/Button';

export function JoinCta() {
  return (
    <section className="container-x pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-fg px-6 py-14 text-bg sm:px-12 sm:py-20">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/40 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-agency/40 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-2xl">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Bring a problem, a skill or a project.</h2>
          <p className="mt-4 text-lg leading-relaxed opacity-75">
            Whether you have an idea, want to build with us, need a team for hire or want to collaborate, there is a door for you.
          </p>
        </div>
        <div className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ButtonLink to="/join?type=idea" size="lg" className="!bg-accent !text-accent-fg">
            Submit an Idea
          </ButtonLink>
          <ButtonLink to="/join" size="lg" className="!border !border-bg/25 !bg-transparent !text-bg hover:!bg-bg/10">
            Join the Club
          </ButtonLink>
          <ButtonLink to="/agency?request=1" size="lg" className="!border !border-bg/25 !bg-transparent !text-bg hover:!bg-bg/10">
            Hire the Agency
          </ButtonLink>
          <ButtonLink to="/collaborations" size="lg" className="!border !border-bg/25 !bg-transparent !text-bg hover:!bg-bg/10">
            Collaborate With Us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
