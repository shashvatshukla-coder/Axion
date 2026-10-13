import { Briefcase, FlaskConical, Layers, Lightbulb, Rocket, Star, TrendingUp, Users, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { analyticsService } from '@/services/analyticsService';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AsyncView } from '@/components/common/AsyncView';
import { ChartSkeleton, StatGridSkeleton } from '@/components/common/Skeleton';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/common/Button';
import {
  ActivityChart,
  ChartCard,
  FunnelChart,
  ProjectsByMonthChart,
  RevenueChart,
} from '@/components/dashboard/Charts';

const statIcons: Record<string, LucideIcon> = {
  members: Users,
  submitted: Lightbulb,
  validated: FlaskConical,
  mvps: Layers,
  startups: Rocket,
  leads: TrendingUp,
  agencyProjects: Briefcase,
  revenue: Wallet,
  csat: Star,
};

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <StatGridSkeleton />
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

export default function Overview() {
  usePageTitle('Dashboard');
  const state = useAsync(() => analyticsService.overview(), []);

  return (
    <>
      <PageHeader
        title="Overview"
        description="How the incubator, agency and teams are doing across the last twelve months."
        actions={
          <Button variant="secondary" onClick={state.reload} loading={state.loading && state.data !== null}>
            Refresh
          </Button>
        }
      />
      <AsyncView state={state} skeleton={<OverviewSkeleton />}>
        {(d) => (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {d.stats.map((s) => (
                <StatCard key={s.id} label={s.label} value={s.value} delta={s.delta} trend={s.trend} icon={statIcons[s.id]} />
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <ChartCard title="Projects by month" subtitle="New projects started in each division">
                <ProjectsByMonthChart data={d.projectsByMonth} />
              </ChartCard>
              <ChartCard title="Incubator funnel" subtitle="Ideas reaching each stage">
                <FunnelChart data={d.incubatorFunnel} />
              </ChartCard>
              <ChartCard title="Agency pipeline" subtitle="Leads and projects by stage">
                <FunnelChart data={d.agencyPipeline} tone="agency" />
              </ChartCard>
              <ChartCard title="Revenue" subtitle="Monthly revenue and expenses in rupees">
                <RevenueChart data={d.revenueByMonth} />
              </ChartCard>
              <ChartCard title="Member activity" subtitle="Active members and tasks completed per week" className="xl:col-span-2">
                <ActivityChart data={d.memberActivity} />
              </ChartCard>
            </div>
          </div>
        )}
      </AsyncView>
    </>
  );
}
