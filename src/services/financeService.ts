import { http } from "@/lib/api";
import type { Invoice, Payout } from "@/types";
export interface FinanceOverview {
  totalRevenue: number;
  pendingPayments: number;
  memberPayouts: number;
  availableBalance: number;
}
export const financeService = {
  invoices: () => http<Invoice[]>("/invoices"),
  payouts: () => http<Payout[]>("/payouts"),
  overview: () => http<FinanceOverview>("/finance/overview"),
};
