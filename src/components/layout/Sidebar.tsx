import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { dashboardNav } from '@/components/layout/navConfig';
import { Logo } from '@/components/common/Logo';
import { useEscape, useLockBodyScroll } from '@/hooks/useOverlay';
import { cn } from '@/lib/utils';

function SidebarContent({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
        <div className="flex items-center gap-2">
          <Logo to="/dashboard" />
          <span className="rounded-md bg-surface2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
            Admin
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-surface2" aria-label="Close navigation">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Dashboard">
        {dashboardNav.map((group, gi) => (
          <div key={group.label ?? `group-${gi}`}>
            {group.label && <p className="eyebrow mb-2 px-3">{group.label}</p>}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                          isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-surface2 hover:text-fg',
                        )
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-3">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-surface2 hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to website
        </NavLink>
      </div>
    </div>
  );
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  useLockBodyScroll(open);
  useEscape(open, onClose);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-line bg-surface lg:block">
        <SidebarContent />
      </aside>

      {createPortal(
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Dashboard navigation">
              <motion.div
                className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
              />
              <motion.aside
                className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-line bg-surface shadow-2xl"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.22 }}
              >
                <SidebarContent onNavigate={onClose} onClose={onClose} />
              </motion.aside>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
