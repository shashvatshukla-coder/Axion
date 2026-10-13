import type { ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '@/hooks/useTheme';

interface ChartPalette {
  accent: string;
  agency: string;
  ok: string;
  grid: string;
  text: string;
  tooltipBg: string;
  tooltipBorder: string;
}

function usePalette(): ChartPalette {
  const { resolved } = useTheme();
  return resolved === 'dark'
    ? { accent: '#FF7A3D', agency: '#6096FF', ok: '#4ADE80', grid: '#27272E', text: '#A1A1AA', tooltipBg: '#111114', tooltipBorder: '#27272E' }
    : { accent: '#C2410C', agency: '#1D4ED8', ok: '#15803D', grid: '#E4E4E7', text: '#62626C', tooltipBg: '#FFFFFF', tooltipBorder: '#E4E4E7' };
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card p-5 ${className ?? ''}`}>
      <h3 className="font-semibold tracking-tight">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      <div className="mt-4 h-64 w-full">{children}</div>
    </section>
  );
}

function tooltipStyles(p: ChartPalette) {
  return {
    contentStyle: {
      background: p.tooltipBg,
      border: `1px solid ${p.tooltipBorder}`,
      borderRadius: 12,
      fontSize: 12,
    },
    labelStyle: { color: p.text },
  };
}

const axisTick = (p: ChartPalette) => ({ fill: p.text, fontSize: 12 });

/* ---------- Projects by month (stacked bars) ---------- */

interface MonthRow {
  month: string;
  incubator: number;
  agency: number;
}

export function ProjectsByMonthChart({ data }: { data: MonthRow[] }) {
  const p = usePalette();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={p.grid} vertical={false} />
        <XAxis dataKey="month" tick={axisTick(p)} axisLine={false} tickLine={false} />
        <YAxis tick={axisTick(p)} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip {...tooltipStyles(p)} cursor={{ fill: p.grid, opacity: 0.4 }} />
        <Legend wrapperStyle={{ fontSize: 12, color: p.text }} />
        <Bar dataKey="incubator" name="Incubator" stackId="a" fill={p.accent} />
        <Bar dataKey="agency" name="Agency" stackId="a" fill={p.agency} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- Horizontal bar (funnel) ---------- */

interface StageRow {
  stage: string;
  count: number;
}

export function FunnelChart({ data, tone = 'accent' }: { data: StageRow[]; tone?: 'accent' | 'agency' }) {
  const p = usePalette();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={p.grid} horizontal={false} />
        <XAxis type="number" tick={axisTick(p)} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="stage" width={92} tick={axisTick(p)} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyles(p)} cursor={{ fill: p.grid, opacity: 0.4 }} />
        <Bar dataKey="count" name="Count" fill={tone === 'accent' ? p.accent : p.agency} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- Revenue (area) ---------- */

interface RevenueRow {
  month: string;
  revenue: number;
  expenses: number;
}

export function RevenueChart({ data }: { data: RevenueRow[] }) {
  const p = usePalette();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.accent} stopOpacity={0.35} />
            <stop offset="100%" stopColor={p.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={p.grid} vertical={false} />
        <XAxis dataKey="month" tick={axisTick(p)} axisLine={false} tickLine={false} />
        <YAxis
          tick={axisTick(p)}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `₹${Math.round(v / 1000)}k`}
        />
        <Tooltip
          {...tooltipStyles(p)}
          formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: p.text }} />
        <Area type="monotone" dataKey="revenue" name="Revenue" stroke={p.accent} strokeWidth={2} fill="url(#revFill)" />
        <Area type="monotone" dataKey="expenses" name="Expenses" stroke={p.agency} strokeWidth={2} fill="none" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ---------- Member activity (lines) ---------- */

interface ActivityRow {
  week: string;
  active: number;
  tasksDone: number;
}

export function ActivityChart({ data }: { data: ActivityRow[] }) {
  const p = usePalette();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke={p.grid} vertical={false} />
        <XAxis dataKey="week" tick={axisTick(p)} axisLine={false} tickLine={false} />
        <YAxis tick={axisTick(p)} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyles(p)} />
        <Legend wrapperStyle={{ fontSize: 12, color: p.text }} />
        <Line type="monotone" dataKey="active" name="Active members" stroke={p.accent} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="tasksDone" name="Tasks done" stroke={p.ok} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
