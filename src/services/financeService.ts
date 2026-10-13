import { financeSummary, invoices, payouts } from '@/data/finance';
import { mockRequest } from '@/lib/api';
import type { Invoice, Payout } from '@/types';

export interface FinanceOverview {
  totalRevenue: number;
  pendingPayments: number;
  memberPayouts: number;
  availableBalance: number;
}

export const financeService = {
  invoices(): Promise<Invoice[]> {
    return mockRequest(invoices);
  },

  payouts(): Promise<Payout[]> {
    return mockRequest(payouts);
  },

  async overview(): Promise<FinanceOverview> {
    const totalRevenue = invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
    const pendingPayments = invoices.filter((i) => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0);
    const memberPayouts = payouts.reduce((sum, p) => sum + p.amount, 0);
    return mockRequest(
      { totalRevenue, pendingPayments, memberPayouts, availableBalance: financeSummary.availableBalance },
      400,
    );
  },
};
