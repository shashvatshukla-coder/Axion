import { usePageTitle } from '@/hooks/usePageTitle';
import { ButtonLink } from '@/components/common/Button';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">This page does not exist.</h1>
      <p className="max-w-md text-muted">The link may be old or mistyped. Try the home page or the project list.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink to="/" size="lg">
          Back home
        </ButtonLink>
        <ButtonLink to="/projects" size="lg" variant="secondary">
          See projects
        </ButtonLink>
      </div>
    </section>
  );
}
