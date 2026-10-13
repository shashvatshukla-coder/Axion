import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { PipelineStage } from '@/data/site';
import { cn } from '@/lib/utils';

interface StageCardProps {
  stage: PipelineStage;
  open: boolean;
  onToggle: () => void;
}

export function StageCard({ stage, open, onToggle }: StageCardProps) {
  return (
    <div className={cn('card overflow-hidden transition-colors', open && 'border-accent/50')}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
      >
        <span
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-xl font-mono text-sm transition-colors',
            open ? 'bg-accent text-accent-fg' : 'bg-surface2 text-muted',
          )}
        >
          {stage.id}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-semibold tracking-tight">{stage.title}</span>
          <span className="block truncate text-sm text-muted">{stage.purpose}</span>
        </span>
        <ChevronDown
          className={cn('h-5 w-5 shrink-0 text-muted transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 border-t border-line p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="eyebrow mb-2">Purpose</p>
                <p className="text-sm leading-relaxed">{stage.purpose}</p>
              </div>
              <div>
                <p className="eyebrow mb-2">Activities</p>
                <ul className="space-y-1.5 text-sm">
                  {stage.activities.map((a) => (
                    <li key={a} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-2">Deliverables</p>
                <ul className="space-y-1.5 text-sm">
                  {stage.deliverables.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-agency" aria-hidden />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sm:col-span-2">
                <p className="eyebrow mb-2">Team responsible</p>
                <p className="text-sm">{stage.team}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
