import { useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Search, X } from "lucide-react";
import { ALL_PUBLIC_LINKS } from "@/data/site";
import { useEscape, useLockBodyScroll } from "@/hooks/useOverlay";
import { useCommandPalette } from "@/components/common/SearchCommand";
import { ButtonLink } from "@/components/common/Button";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { cn } from "@/lib/utils";

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { pathname } = useLocation();
  const palette = useCommandPalette();
  useLockBodyScroll(open);
  useEscape(open, onClose);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-bg lg:hidden"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="container-x flex h-16 shrink-0 items-center justify-between">
            <Logo />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="container-x flex-1 py-4" aria-label="Mobile">
            <ul className="space-y-1">
              {ALL_PUBLIC_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-xl px-4 py-3 text-2xl font-semibold tracking-tight transition-colors",
                        isActive
                          ? "bg-surface2 text-accent"
                          : "text-fg hover:bg-surface2",
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="container-x grid shrink-0 gap-3 pb-8 pt-2">
            <button
              onClick={() => {
                onClose();
                palette.open();
              }}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-sm font-medium"
            >
              <Search className="h-4 w-4" aria-hidden /> Search
            </button>
            <ButtonLink to="/login" variant="secondary" size="lg">
              <LayoutDashboard className="h-4 w-4" aria-hidden /> Sign in
            </ButtonLink>
            <ButtonLink to="/join" size="lg">
              Join the club
            </ButtonLink>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
