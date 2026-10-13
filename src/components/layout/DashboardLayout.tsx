import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { NotificationsMenu } from '@/components/layout/NotificationsMenu';
import { PageTransition } from '@/components/layout/PageTransition';
import { dashboardLinks } from '@/components/layout/navConfig';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Avatar } from '@/components/common/Avatar';
import { useCommandPalette } from '@/components/common/SearchCommand';

export default function DashboardLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();
  const palette = useCommandPalette();
  const current = dashboardLinks.find((l) => (l.end ? pathname === l.to : pathname.startsWith(l.to)));

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-line px-4 glass sm:px-6 lg:px-8">
          <button
            onClick={() => setNavOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
          <p className="text-sm text-muted">
            Dashboard
            {current && current.to !== '/dashboard' && (
              <>
                <span className="mx-2 text-line">/</span>
                <span className="font-medium text-fg">{current.label}</span>
              </>
            )}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={palette.open}
              className="hidden h-9 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted transition-colors hover:bg-surface2 sm:flex"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" aria-hidden />
              Search
              <kbd className="rounded-md border border-line px-1.5 font-mono text-[10px]">Ctrl K</kbd>
            </button>
            <button
              onClick={palette.open}
              className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted sm:hidden"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </button>
            <NotificationsMenu />
            <ThemeToggle />
            <Avatar name="Kabir Nair" size="sm" />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <PageTransition key={pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
