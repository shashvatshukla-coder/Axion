import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, FileText, LayoutDashboard, Moon, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ALL_PUBLIC_LINKS } from '@/data/site';
import { dashboardLinks } from '@/components/layout/navConfig';
import { useTheme } from '@/hooks/useTheme';
import { useEscape } from '@/hooks/useOverlay';
import { cn } from '@/lib/utils';

interface PaletteContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const PaletteContext = createContext<PaletteContextValue | null>(null);

interface CommandItem {
  id: string;
  label: string;
  group: string;
  hint?: string;
  icon: LucideIcon;
  run: () => void;
}

/** Provides the command palette (Ctrl/Cmd + K) to the whole app and renders it. */
export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <PaletteContext.Provider value={value}>
      {children}
      <SearchCommand />
    </PaletteContext.Provider>
  );
}

export function useCommandPalette(): PaletteContextValue {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error('useCommandPalette must be used inside CommandPaletteProvider');
  return ctx;
}

function SearchCommand() {
  const { isOpen, close } = useCommandPalette();
  const navigate = useNavigate();
  const { toggle, resolved } = useTheme();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEscape(isOpen, close);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  const items = useMemo<CommandItem[]>(() => {
    const go = (to: string) => () => {
      navigate(to);
      close();
    };
    const pages: CommandItem[] = ALL_PUBLIC_LINKS.map((l) => ({
      id: `page-${l.to}`,
      label: l.label,
      group: 'Pages',
      hint: l.to,
      icon: FileText,
      run: go(l.to),
    }));
    const dash: CommandItem[] = dashboardLinks.map((l) => ({
      id: `dash-${l.to}`,
      label: l.label,
      group: 'Dashboard',
      hint: l.to,
      icon: LayoutDashboard,
      run: go(l.to),
    }));
    const actions: CommandItem[] = [
      {
        id: 'toggle-theme',
        label: resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        group: 'Actions',
        icon: Moon,
        run: () => {
          toggle();
          close();
        },
      },
    ];
    return [...pages, ...dash, ...actions];
  }, [navigate, close, toggle, resolved]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.group} ${i.hint ?? ''}`.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      results[active]?.run();
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search">
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 text-muted" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search pages and actions"
                aria-label="Search pages and actions"
                className="h-12 flex-1 bg-transparent text-sm placeholder:text-muted/70 focus:outline-none"
              />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">Esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
              {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No matches for "{query}"</li>}
              {results.map((r, i) => {
                const Icon = r.icon;
                return (
                  <li key={r.id} role="option" aria-selected={i === active}>
                    <button
                      onClick={r.run}
                      onMouseEnter={() => setActive(i)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm',
                        i === active ? 'bg-surface2' : '',
                      )}
                    >
                      <Icon className="h-4 w-4 text-muted" aria-hidden />
                      <span className="flex-1">{r.label}</span>
                      <span className="font-mono text-[11px] text-muted">{r.group}</span>
                      {i === active && <CornerDownLeft className="h-3.5 w-3.5 text-muted" aria-hidden />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
