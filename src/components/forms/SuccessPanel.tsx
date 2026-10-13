import type { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function SuccessPanel({
  title,
  message,
  reference,
  actions,
}: {
  title: string;
  message: string;
  reference?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-2 py-8 text-center" role="status">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ok/10 text-ok">
        <CheckCircle2 className="h-7 w-7" aria-hidden />
      </span>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-muted">{message}</p>
      {reference && (
        <p className="rounded-lg bg-surface2 px-3 py-1.5 font-mono text-xs">
          Reference: <span className="font-semibold">{reference}</span>
        </p>
      )}
      {actions && <div className="mt-2 flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  );
}
