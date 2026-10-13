import type { Invoice, Payout } from '@/types';

export const invoices: Invoice[] = [
  { id: 'INV-2026-041', client: 'Sunrise Textiles', project: 'Sunrise Inventory', amount: 120000, status: 'Paid', issued: '2026-08-02', due: '2026-08-16' },
  { id: 'INV-2026-042', client: 'CityClinic', project: 'CityClinic Booking', amount: 95000, status: 'Paid', issued: '2026-08-20', due: '2026-09-03' },
  { id: 'INV-2026-043', client: 'RouteMate Logistics', project: 'RouteMate Dashboard', amount: 60000, status: 'Pending', issued: '2026-09-18', due: '2026-10-02' },
  { id: 'INV-2026-044', client: 'AgroMart', project: 'AgroMart Assistant', amount: 75000, status: 'Paid', issued: '2026-09-01', due: '2026-09-15' },
  { id: 'INV-2026-045', client: 'Sunrise Textiles', project: 'Sunrise Inventory', amount: 90000, status: 'Overdue', issued: '2026-09-05', due: '2026-09-19' },
  { id: 'INV-2026-046', client: 'Greenleaf Organics', project: 'Storefront refresh', amount: 48000, status: 'Pending', issued: '2026-10-01', due: '2026-10-15' },
  { id: 'INV-2026-047', client: 'CityClinic', project: 'CityClinic Booking', amount: 110000, status: 'Pending', issued: '2026-10-06', due: '2026-10-20' },
  { id: 'INV-2026-048', client: 'Campus Research Cell', project: 'Survey portal', amount: 42000, status: 'Paid', issued: '2026-09-22', due: '2026-10-06' },
];

export const payouts: Payout[] = [
  { id: 'PAY-0198', member: 'Arjun Reddy', project: 'CityClinic Booking', amount: 18000, status: 'Paid', date: '2026-09-30' },
  { id: 'PAY-0199', member: 'Tanvi Joshi', project: 'Sunrise Inventory', amount: 22000, status: 'Paid', date: '2026-09-30' },
  { id: 'PAY-0200', member: 'Zoya Khan', project: 'CityClinic Booking', amount: 12000, status: 'Paid', date: '2026-09-30' },
  { id: 'PAY-0201', member: 'Neel Shah', project: 'RouteMate Dashboard', amount: 15000, status: 'Processing', date: '2026-10-14' },
  { id: 'PAY-0202', member: 'Pooja Nambiar', project: 'CityClinic Booking', amount: 8000, status: 'Scheduled', date: '2026-10-31' },
  { id: 'PAY-0203', member: 'Siddharth Rao', project: 'Sunrise Inventory', amount: 9000, status: 'Scheduled', date: '2026-10-31' },
  { id: 'PAY-0204', member: 'Nisha Patel', project: 'AgroMart Assistant', amount: 14000, status: 'Paid', date: '2026-09-30' },
  { id: 'PAY-0205', member: 'Vikram Singh', project: 'Brew & Co Ordering', amount: 16000, status: 'Processing', date: '2026-10-14' },
];

export const financeSummary = {
  availableBalance: 412000,
};
