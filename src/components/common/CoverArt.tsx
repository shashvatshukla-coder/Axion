import { cn, hueGradient } from '@/lib/utils';

/** Generated cover image so cards look finished without needing photo assets. */
export function CoverArt({ hue, label, className }: { hue: number; label: string; className?: string }) {
  return (
    <div
      className={cn('relative isolate overflow-hidden', className)}
      style={{ backgroundImage: hueGradient(hue) }}
      role="img"
      aria-label={`${label} cover`}
    >
      <svg className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
        <defs>
          <pattern id={`dots-${hue}`} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${hue})`} />
      </svg>
      <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/15" aria-hidden />
      <div className="absolute -bottom-12 left-6 h-32 w-32 rounded-full bg-black/15" aria-hidden />
      <span className="absolute bottom-3 left-4 text-3xl font-bold tracking-tight text-white/90 drop-shadow-sm">
        {label.slice(0, 1).toUpperCase()}
      </span>
    </div>
  );
}
