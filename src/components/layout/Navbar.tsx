import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Inbox, Menu, Search } from "lucide-react";
import { PUBLIC_LINKS } from "@/data/site";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ButtonLink } from "@/components/common/Button";
import { useCommandPalette } from "@/components/common/SearchCommand";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const palette = useCommandPalette();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line glass">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo />
            <nav
              className="hidden items-center gap-1 lg:flex"
              aria-label="Primary"
            >
              {PUBLIC_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-surface2 text-fg"
                        : "text-muted hover:text-fg",
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={palette.open}
              className="hidden h-9 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted transition-colors hover:bg-surface2 md:flex"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" aria-hidden />
              <span>Search</span>
              <kbd className="rounded-md border border-line px-1.5 font-mono text-[10px]">
                Ctrl K
              </kbd>
            </button>
            <button
              onClick={palette.open}
              className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted md:hidden"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <ButtonLink
              to="/dashboard/submissions"
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-1.5 border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 font-medium text-xs rounded-xl"
            >
              <Inbox className="h-3.5 w-3.5" />
              <span>Admin Submissions</span>
            </ButtonLink>
            <ButtonLink
              to="/login"
              variant="ghost"
              size="sm"
              className="hidden lg:inline-flex"
            >
              Sign in
            </ButtonLink>
            <ButtonLink to="/join" size="sm" className="hidden sm:inline-flex">
              Join the club
            </ButtonLink>
            <button
              onClick={() => setMenuOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
