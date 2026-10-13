export interface ImpactStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
}

export const impact: ImpactStat[] = [
  { id: 'members', label: 'Members', value: 148, suffix: '+' },
  { id: 'validated', label: 'Ideas Validated', value: 37 },
  { id: 'products', label: 'Products Built', value: 14 },
  { id: 'clients', label: 'Clients Served', value: 26 },
  { id: 'active', label: 'Active Projects', value: 19 },
  { id: 'collabs', label: 'Collaborations', value: 11 },
];

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
}

export const dashboardStats: DashboardStat[] = [
  { id: 'members', label: 'Total Members', value: '148', delta: '+9 this month', trend: 'up' },
  { id: 'submitted', label: 'Ideas Submitted', value: '212', delta: '+14 this month', trend: 'up' },
  { id: 'validated', label: 'Ideas Validated', value: '37', delta: '+3 this month', trend: 'up' },
  { id: 'mvps', label: 'MVPs Building', value: '9', delta: 'Same as last month', trend: 'flat' },
  { id: 'startups', label: 'Active Startups', value: '6', delta: '+1 this quarter', trend: 'up' },
  { id: 'leads', label: 'Agency Leads', value: '31', delta: '+6 this month', trend: 'up' },
  { id: 'agencyProjects', label: 'Agency Projects', value: '12', delta: '-1 this month', trend: 'down' },
  { id: 'revenue', label: 'Revenue', value: '₹18.4 L', delta: '+12% vs last quarter', trend: 'up' },
  { id: 'csat', label: 'Client Satisfaction', value: '4.7 / 5', delta: '+0.1 this quarter', trend: 'up' },
];

export const projectsByMonth = [
  { month: 'Nov', incubator: 2, agency: 1 },
  { month: 'Dec', incubator: 1, agency: 2 },
  { month: 'Jan', incubator: 3, agency: 2 },
  { month: 'Feb', incubator: 2, agency: 3 },
  { month: 'Mar', incubator: 4, agency: 2 },
  { month: 'Apr', incubator: 3, agency: 4 },
  { month: 'May', incubator: 2, agency: 3 },
  { month: 'Jun', incubator: 3, agency: 5 },
  { month: 'Jul', incubator: 4, agency: 4 },
  { month: 'Aug', incubator: 5, agency: 5 },
  { month: 'Sep', incubator: 4, agency: 6 },
  { month: 'Oct', incubator: 5, agency: 4 },
];

export const incubatorFunnel = [
  { stage: 'Problem', count: 212 },
  { stage: 'Validation', count: 96 },
  { stage: 'Ideation', count: 58 },
  { stage: 'MVP', count: 21 },
  { stage: 'PMF', count: 9 },
  { stage: 'Traction', count: 6 },
  { stage: 'Scale', count: 2 },
];

export const agencyPipeline = [
  { stage: 'New Lead', count: 31 },
  { stage: 'Contacted', count: 24 },
  { stage: 'Requirements', count: 17 },
  { stage: 'Proposal', count: 13 },
  { stage: 'Negotiation', count: 8 },
  { stage: 'Active', count: 12 },
  { stage: 'QA', count: 3 },
  { stage: 'Delivered', count: 26 },
];

export const revenueByMonth = [
  { month: 'Nov', revenue: 92000, expenses: 31000 },
  { month: 'Dec', revenue: 110000, expenses: 38000 },
  { month: 'Jan', revenue: 134000, expenses: 45000 },
  { month: 'Feb', revenue: 128000, expenses: 41000 },
  { month: 'Mar', revenue: 156000, expenses: 52000 },
  { month: 'Apr', revenue: 171000, expenses: 58000 },
  { month: 'May', revenue: 149000, expenses: 49000 },
  { month: 'Jun', revenue: 203000, expenses: 66000 },
  { month: 'Jul', revenue: 188000, expenses: 61000 },
  { month: 'Aug', revenue: 226000, expenses: 74000 },
  { month: 'Sep', revenue: 241000, expenses: 79000 },
  { month: 'Oct', revenue: 198000, expenses: 64000 },
];

export const memberActivity = [
  { week: 'W1', active: 96, tasksDone: 41 },
  { week: 'W2', active: 102, tasksDone: 48 },
  { week: 'W3', active: 99, tasksDone: 44 },
  { week: 'W4', active: 108, tasksDone: 53 },
  { week: 'W5', active: 112, tasksDone: 57 },
  { week: 'W6', active: 105, tasksDone: 50 },
  { week: 'W7', active: 118, tasksDone: 62 },
  { week: 'W8', active: 121, tasksDone: 66 },
  { week: 'W9', active: 117, tasksDone: 61 },
  { week: 'W10', active: 126, tasksDone: 70 },
  { week: 'W11', active: 130, tasksDone: 74 },
  { week: 'W12', active: 134, tasksDone: 79 },
];
