import type { ProcessStep } from '@/data/site';
import { Reveal } from '@/components/common/Reveal';

/** Seven-step agency delivery process. Vertical list on phones, connected grid on wide screens. */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.title}>
          <Reveal delay={i * 0.05} className="h-full">
            <div className="card relative h-full p-5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-agency/10 font-mono text-xs text-agency">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.description}</p>
              {i < steps.length - 1 && (
                <span
                  className="absolute -bottom-4 left-9 hidden h-4 w-px bg-line sm:block lg:hidden"
                  aria-hidden
                />
              )}
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
