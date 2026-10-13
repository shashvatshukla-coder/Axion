import { cn, hueGradient, initials } from '@/lib/utils';

function hueFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-xl',
};

interface AvatarProps {
  name: string;
  hue?: number;
  size?: keyof typeof sizes;
  className?: string;
}

export function Avatar({ name, hue, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-semibold text-white ring-2 ring-surface',
        sizes[size],
        className,
      )}
      style={{ backgroundImage: hueGradient(hue ?? hueFromName(name)) }}
      title={name}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({ names, max = 4 }: { names: string[]; max?: number }) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((n, i) => (
        <Avatar key={n} name={n} size="xs" className={i > 0 ? '-ml-2' : ''} />
      ))}
      {extra > 0 && (
        <span className="-ml-2 inline-grid h-6 min-w-6 place-items-center rounded-full bg-surface2 px-1 text-[10px] font-medium text-muted ring-2 ring-surface">
          +{extra}
        </span>
      )}
    </div>
  );
}
