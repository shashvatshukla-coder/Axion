import {
  BarChart3,
  Briefcase,
  CheckSquare,
  FileText,
  FlaskConical,
  Handshake,
  Inbox,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Package,
  Receipt,
  Rocket,
  Settings,
  TrendingUp,
  Truck,
  UserCircle,
  Users,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface DashNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface DashNavGroup {
  label?: string;
  items: DashNavItem[];
}

export const dashboardNav: DashNavGroup[] = [
  {
    items: [
      { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
      { label: 'Submissions', to: '/dashboard/submissions', icon: Inbox },
    ],
  },
  {
    label: 'Incubator',
    items: [
      { label: 'Ideas', to: '/dashboard/incubator/ideas', icon: Lightbulb },
      { label: 'Validation', to: '/dashboard/incubator/validation', icon: FlaskConical },
      { label: 'MVPs', to: '/dashboard/incubator/mvps', icon: Layers },
      { label: 'Startups', to: '/dashboard/incubator/startups', icon: Rocket },
    ],
  },
  {
    label: 'Agency',
    items: [
      { label: 'Leads', to: '/dashboard/agency/leads', icon: TrendingUp },
      { label: 'Clients', to: '/dashboard/agency/clients', icon: UserCircle },
      { label: 'Projects', to: '/dashboard/agency/projects', icon: Briefcase },
      { label: 'Deliveries', to: '/dashboard/agency/deliveries', icon: Truck },
    ],
  },
  {
    label: 'Teams',
    items: [
      { label: 'Members', to: '/dashboard/teams/members', icon: Users },
      { label: 'Tasks', to: '/dashboard/teams/tasks', icon: CheckSquare },
    ],
  },
  {
    items: [{ label: 'Collaborations', to: '/dashboard/collaborations', icon: Handshake }],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Revenue', to: '/dashboard/finance/revenue', icon: Wallet },
      { label: 'Invoices', to: '/dashboard/finance/invoices', icon: Receipt },
      { label: 'Payouts', to: '/dashboard/finance/payouts', icon: Package },
    ],
  },
  {
    items: [
      { label: 'Reports', to: '/dashboard/reports', icon: BarChart3 },
      { label: 'Settings', to: '/dashboard/settings', icon: Settings },
    ],
  },
];

export const dashboardLinks: DashNavItem[] = dashboardNav.flatMap((g) => g.items);

export const reportsIcon = FileText;
