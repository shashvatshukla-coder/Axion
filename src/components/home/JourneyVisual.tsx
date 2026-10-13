import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { label: 'Problem', title: 'A real problem is found', text: 'Flooded streets, long clinic queues, spreadsheets that break.', metric: '212 problems logged' },
  { label: 'Validate', title: 'Users confirm they care', text: 'Interviews and small tests decide what is worth building.', metric: '37 ideas validated' },
  { label: 'Build', title: 'A small team ships an MVP', text: 'Developers, designers and QA work in weekly sprints.', metric: '14 products built' },
  { label: 'Launch', title: 'First users start using it', text: 'Real feedback arrives and the product changes quickly.', metric: '6 startups live' },
  { label: 'Scale', title: 'The company stands on its own', text: 'Systems, funding paths and a team that can keep going.', metric: '2 graduated' },
];

/** Looping stepper that shows the path from problem to scaled product. Click a step to jump to it. */
export function JourneyVisual() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % STEPS.length), 2400);
    return () => window.clearInterval(id);
  }, [paused]);

  const current = STEPS[active];

  return (
    <div
      className="card relative overflow-hidden p-5 shadow-glow sm:p-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow">Live pipeline</span>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
          </span>
          {paused ? 'Paused' : 'Running'}
        </span>
      </div>

      <ol className="mt-5 space-y-1">
        {STEPS.map((s, i) => {
          const done = i < active;
          const isActive = i === active;
          return (
            <li key={s.label}>
              <button
                onClick={() => setActive(i)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors',
                  isActive ? 'bg-surface2' : 'hover:bg-surface2/60',
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-lg border font-mono text-xs transition-colors',
                    done || isActive ? 'border-accent bg-accent text-accent-fg' : 'border-line text-muted',
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                </span>
                <span className={cn('flex-1 text-sm font-medium', !isActive && !done && 'text-muted')}>{s.label}</span>
                <span className="h-1 w-16 overflow-hidden rounded-full bg-line sm:w-24" aria-hidden>
                  <motion.span
                    className="block h-full bg-accent"
                    initial={false}
                    animate={{ width: done ? '100%' : isActive ? '100%' : '0%' }}
                    transition={{ duration: isActive && !paused ? 2.2 : 0.3, ease: 'linear' }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 min-h-[7.5rem] rounded-xl border border-line bg-bg p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-semibold tracking-tight">{current.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{current.text}</p>
            <p className="mt-3 font-mono text-xs text-accent">{current.metric}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
