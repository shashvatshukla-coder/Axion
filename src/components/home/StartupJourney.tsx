import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { JOURNEY } from '@/data/site';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

export function StartupJourney() {
  const [active, setActive] = useState(0);
  const stage = JOURNEY[active];

  return (
    <section className="border-y border-line bg-surface">
      <div className="container-x py-20 sm:py-28">
        <SectionHeader
          eyebrow="The startup journey"
          title="Seven stages from a problem to a company"
          description="Every idea moves through the same path. Pick a stage to see what happens, who owns it and what comes out."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[17rem_1fr]">
          <ol className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0" role="tablist" aria-label="Startup stages">
            {JOURNEY.map((s, i) => (
              <li key={s.key} className="shrink-0 lg:shrink">
                <button
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-colors',
                    i === active
                      ? 'border-accent/50 bg-accent/10 text-accent'
                      : 'border-line text-muted hover:bg-surface2 hover:text-fg',
                  )}
                >
                  <span className="font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="card flex flex-col p-6 sm:p-9"
              role="tabpanel"
            >
              <p className="eyebrow">
                Stage {active + 1} of {JOURNEY.length} · {stage.label}
              </p>
              <h3 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{stage.question}</h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{stage.description}</p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-surface2/60 p-4">
                  <dt className="eyebrow mb-1">Owned by</dt>
                  <dd className="font-medium">{stage.owner}</dd>
                </div>
                <div className="rounded-xl bg-surface2/60 p-4">
                  <dt className="eyebrow mb-1">Comes out</dt>
                  <dd className="font-medium">{stage.output}</dd>
                </div>
              </dl>
              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setActive((a) => Math.max(0, a - 1))}
                  disabled={active === 0}
                  icon={<ArrowLeft className="h-4 w-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setActive((a) => Math.min(JOURNEY.length - 1, a + 1))}
                  disabled={active === JOURNEY.length - 1}
                >
                  Next stage <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
