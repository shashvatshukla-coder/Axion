import { post } from "@/lib/api";
import { useState } from "react";
import { Download } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/hooks/useToast";
import { analyticsService } from "@/services/analyticsService";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AsyncView } from "@/components/common/AsyncView";
import { ChartSkeleton } from "@/components/common/Skeleton";
import { Button } from "@/components/common/Button";
import {
  ActivityChart,
  ChartCard,
  FunnelChart,
  ProjectsByMonthChart,
  RevenueChart,
} from "@/components/dashboard/Charts";

export default function Reports() {
  usePageTitle("Reports");
  const state = useAsync(() => analyticsService.overview(), []);
  const toast = useToast();
  const [exporting, setExporting] = useState(false);

  const exportReport = async () => {
    setExporting(true);
    try {
      const report = await post("/reports/export", {});
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(report, null, 2)], {
          type: "application/json",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "foundry-report.json";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded.");
    } catch {
      toast.error("Unable to export report.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Reports"
        description="Every chart in one place, ready to share with the faculty mentor or TBI."
        actions={
          <Button
            variant="secondary"
            icon={<Download className="h-4 w-4" aria-hidden />}
            onClick={exportReport}
            loading={exporting}
          >
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
            <ChartCard
              title="Projects by month"
              subtitle="New projects started in each division"
            >
              <ProjectsByMonthChart data={d.projectsByMonth} />
            </ChartCard>
            <ChartCard
              title="Incubator funnel"
              subtitle="Ideas reaching each stage"
            >
              <FunnelChart data={d.incubatorFunnel} />
            </ChartCard>
            <ChartCard
              title="Agency pipeline"
              subtitle="Leads and projects by stage"
            >
              <FunnelChart data={d.agencyPipeline} tone="agency" />
            </ChartCard>
            <ChartCard
              title="Revenue"
              subtitle="Monthly revenue and expenses in rupees"
            >
              <RevenueChart data={d.revenueByMonth} />
            </ChartCard>
            <ChartCard
              title="Member activity"
              subtitle="Active members and tasks completed per week"
              className="xl:col-span-2"
            >
              <ActivityChart data={d.memberActivity} />
            </ChartCard>
          </div>
        )}
      </AsyncView>
    </>
  );
}
