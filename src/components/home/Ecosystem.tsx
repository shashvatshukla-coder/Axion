import { useState } from 'react';
import { ECOSYSTEM_INPUTS, ECOSYSTEM_OUTPUTS } from '@/data/site';
import type { EcosystemNode } from '@/data/site';
import { cn } from '@/lib/utils';

const W = 960;
const H = 520;
const NODE_W = 208;
const NODE_H = 56;
const LEFT_X = 24;
const RIGHT_X = 728;
const CENTER = { x: 376, y: 190, w: 208, h: 140 };
const CENTER_CY = CENTER.y + CENTER.h / 2;

const leftY = (i: number) => 20 + i * 88;
const rightY = [96, 232, 368];

/** Network diagram: partners feed the club, the club feeds its divisions and teams. */
export function Ecosystem() {
  const [selected, setSelected] = useState<EcosystemNode | null>(ECOSYSTEM_INPUTS[0]);

  const select = (node: EcosystemNode) => setSelected(node);

  return (
    <div>
      <div className="card overflow-x-auto p-3 sm:p-6">
        <div className="min-w-[720px]">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Ecosystem diagram: students, E-Cell, TBI, other clubs, industries and MSMEs feed the club, which runs the incubator, agency and core teams.">
            {ECOSYSTEM_INPUTS.map((n, i) => {
              const y1 = leftY(i) + NODE_H / 2;
              const x1 = LEFT_X + NODE_W;
              return (
                <path
                  key={`in-${n.id}`}
                  d={`M${x1} ${y1} C ${x1 + 90} ${y1}, ${CENTER.x - 90} ${CENTER_CY}, ${CENTER.x} ${CENTER_CY}`}
                  className={cn('flow-line fill-none', selected?.id === n.id ? 'stroke-accent' : 'stroke-line')}
                  strokeWidth={selected?.id === n.id ? 2 : 1.5}
                />
              );
            })}
            {ECOSYSTEM_OUTPUTS.map((n, i) => {
              const cy = rightY[i] + NODE_H / 2;
              const x0 = CENTER.x + CENTER.w;
              return (
                <path
                  key={`out-${n.id}`}
                  d={`M${x0} ${CENTER_CY} C ${x0 + 90} ${CENTER_CY}, ${RIGHT_X - 90} ${cy}, ${RIGHT_X} ${cy}`}
                  className={cn('flow-line fill-none', selected?.id === n.id ? 'stroke-agency' : 'stroke-line')}
                  strokeWidth={selected?.id === n.id ? 2 : 1.5}
                />
              );
            })}

            {ECOSYSTEM_INPUTS.map((n, i) => (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-label={`${n.label}: ${n.gives}`}
                className="cursor-pointer outline-none"
                onMouseEnter={() => select(n)}
                onFocus={() => select(n)}
                onClick={() => select(n)}
              >
                <rect
                  x={LEFT_X}
                  y={leftY(i)}
                  width={NODE_W}
                  height={NODE_H}
                  rx={14}
                  className={cn('fill-surface', selected?.id === n.id ? 'stroke-accent' : 'stroke-line')}
                  strokeWidth={selected?.id === n.id ? 2 : 1}
                />
                <text x={LEFT_X + 18} y={leftY(i) + 24} className="fill-fg text-[15px] font-semibold">
                  {n.label}
                </text>
                <text x={LEFT_X + 18} y={leftY(i) + 42} className="fill-muted text-[12px]">
                  {n.gives}
                </text>
              </g>
            ))}

            <g>
              <rect x={CENTER.x} y={CENTER.y} width={CENTER.w} height={CENTER.h} rx={22} className="fill-fg" />
              <text x={CENTER.x + CENTER.w / 2} y={CENTER_CY - 4} textAnchor="middle" className="fill-bg text-[22px] font-bold tracking-tight">
                THE CLUB
              </text>
              <text x={CENTER.x + CENTER.w / 2} y={CENTER_CY + 20} textAnchor="middle" className="fill-bg text-[12px] opacity-70">
                Ideas, work and people
              </text>
            </g>

            {ECOSYSTEM_OUTPUTS.map((n, i) => (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-label={`${n.label}: ${n.gives}`}
                className="cursor-pointer outline-none"
                onMouseEnter={() => select(n)}
                onFocus={() => select(n)}
                onClick={() => select(n)}
              >
                <rect
                  x={RIGHT_X}
                  y={rightY[i]}
                  width={NODE_W}
                  height={NODE_H}
                  rx={14}
                  className={cn('fill-surface', selected?.id === n.id ? 'stroke-agency' : 'stroke-line')}
                  strokeWidth={selected?.id === n.id ? 2 : 1}
                />
                <text x={RIGHT_X + 18} y={rightY[i] + 24} className="fill-fg text-[15px] font-semibold">
                  {n.label}
                </text>
                <text x={RIGHT_X + 18} y={rightY[i] + 42} className="fill-muted text-[12px]">
                  {n.gives}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <p className="mt-4 min-h-[3rem] rounded-xl border border-line bg-surface px-4 py-3 text-sm" aria-live="polite">
        {selected ? (
          <>
            <span className="font-semibold">{selected.label}.</span> <span className="text-muted">{selected.detail}</span>
          </>
        ) : (
          <span className="text-muted">Hover or tap a box to see how it connects to the club.</span>
        )}
      </p>
    </div>
  );
}
