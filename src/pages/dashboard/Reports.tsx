import { useState } from 'react';
import { Download } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { useToast } from '@/hooks/useToast';
import { analyticsService } from '@/services/analyticsService';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AsyncView } from '@/components/common/AsyncView';
import { ChartSkeleton } from '@/components/common/Skeleton';
import { Button } from '@/components/common/Button';
import {
  ActivityChart,
  ChartCard,
  FunnelChart,
  ProjectsByMonthChart,
  RevenueChart,
} from '@/components/dashboard/Charts';

export default function Reports() {
  usePageTitle('Reports');
  const state = useAsync(() => analyticsService.overview(), []);
  const toast = useToast();
  const [exporting, setExporting] = useState(false);

  const exportReport = () => {
    setExporting(true);
    window.setTimeout(() => {
      setExporting(false);
      toast.success('Report export queued. Connect the API to generate a real file.');
    }, 700);
  };

  return (
    <>
      <PageHeader
        title="Reports"
        description="Every chart in one place, ready to share with the faculty mentor or TBI."
        actions={
          <Button variant="secondary" icon={<Download className="h-4 w-4" aria-hidden />} onClick={exportReport} loading={exporting}>
            Export report
          </Button>
        }
      />
      <AsyncView
        state={state}
        skeleton={
          <div className="grid gap-4 xl:grid-cols-2">
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        }
      >
        {(d) => (
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
        )}
      </AsyncView>
    </>
  );
}
