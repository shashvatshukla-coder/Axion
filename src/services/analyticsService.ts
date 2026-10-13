import {
  agencyPipeline,
  dashboardStats,
  incubatorFunnel,
  memberActivity,
  projectsByMonth,
  revenueByMonth,
} from "@/data/analytics";
import { http } from "@/lib/api";

export interface AnalyticsBundle {
  stats: typeof dashboardStats;
  projectsByMonth: typeof projectsByMonth;
  incubatorFunnel: typeof incubatorFunnel;
  agencyPipeline: typeof agencyPipeline;
  revenueByMonth: typeof revenueByMonth;
  memberActivity: typeof memberActivity;
}

export const analyticsService = {
  overview(): Promise<AnalyticsBundle> {
    return http<AnalyticsBundle>("/analytics");
  },
};
