import { useRef } from "react";
import { useInView } from "framer-motion";
import { useAsync } from "@/hooks/useAsync";
import { http } from "@/lib/api";
import type { ImpactStat } from "@/data/analytics";
import { useCountUp } from "@/hooks/useCountUp";
import { SectionHeader } from "@/components/common/SectionHeader";

function Counter({ stat }: { stat: ImpactStat }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const value = useCountUp(stat.value, inView);

  return (
    <div ref={ref} className="bg-surface p-6 sm:p-8">
      <p className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
        {value}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm text-muted">{stat.label}</p>
    </div>
  );
}

export function ImpactNumbers() {
  const {
    data: impact,
    error,
    loading,
  } = useAsync(() => http<ImpactStat[]>("/public/impact"), []);
  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeader eyebrow="Impact" title="Our progress" align="center" />
      {(loading || error) && (
        <p className="mt-6 text-center text-muted">
          {loading ? "Loading progress…" : "Progress is currently unavailable."}
        </p>
      )}
      <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
        {(impact ?? []).map((s) => (
          <Counter key={s.id} stat={s} />
        ))}
      </div>
    </section>
  );
}
