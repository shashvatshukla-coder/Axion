import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CLUB } from "@/data/site";
import type { ImpactStat } from "@/data/analytics";
import { useAsync } from "@/hooks/useAsync";
import { http } from "@/lib/api";
import { ButtonLink } from "@/components/common/Button";
import { JourneyVisual } from "@/components/home/JourneyVisual";

export function Hero() {
  const { data: impact } = useAsync(
    () => http<ImpactStat[]>("/public/impact"),
    [],
  );
  const highlights = (impact ?? []).filter((i) =>
    ["products", "clients", "members"].includes(i.id),
  );

  return (
    <section className="relative overflow-hidden">
      <div
        className="grid-bg pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[-14rem] h-[30rem] w-[64rem] max-w-none -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div className="container-x relative grid items-center gap-14 pb-20 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Student-powered innovation ecosystem
          </p>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            From Problems to <span className="text-gradient">Products.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {CLUB.blurb}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/incubator" size="lg">
              Explore Incubator <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink to="/agency" size="lg" variant="secondary">
              Work With Our Agency
            </ButtonLink>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {highlights.map((h) => (
              <div key={h.id}>
                <dd className="text-2xl font-semibold tracking-tight">
                  {h.value}
                  {h.suffix}
                </dd>
                <dt className="mt-0.5 text-xs text-muted">{h.label}</dt>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <JourneyVisual />
        </motion.div>
      </div>
    </section>
  );
}
