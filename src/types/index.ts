export type Division = 'Incubator' | 'Agency';
export type ProjectStatus = 'Active' | 'Completed' | 'Paused';

export type StageKey = 'problem' | 'validation' | 'ideation' | 'mvp' | 'pmf' | 'traction' | 'scale';
export type ValidationStatus = 'Pending' | 'In review' | 'Validated' | 'Rejected';

export type TeamName =
  | 'Core Team'
  | 'Incubator Team'
  | 'Agency Team'
  | 'Technical Team'
  | 'UI/UX Team'
  | 'Validation Team'
  | 'Outreach Team'
  | 'QA Team'
  | 'Finance Team';

export type Department = 'Incubator' | 'Agency' | 'Shared';

export interface Project {
  id: string;
  name: string;
  division: Division;
  type: string;
  status: ProjectStatus;
  description: string;
  tech: string[];
  members: string[];
  progress: number;
  client?: string;
  hue: number;
  startedAt: string;
}

export interface Startup {
  id: string;
  name: string;
  problem: string;
  solution: string;
  stage: StageKey;
  team: string[];
  progress: number;
  website: string;
  hue: number;
  founded: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  department: Department;
  team: TeamName;
  skills: string[];
  currentProject: string;
  status: 'Active' | 'On leave' | 'Alumni';
  linkedin: string;
  github: string;
  hue: number;
}

export interface Idea {
  id: string;
  title: string;
  submittedBy: string;
  problem: string;
  category: string;
  validation: ValidationStatus;
  stage: StageKey;
  team: string[];
  date: string;
}

export type LeadStage =
  | 'New Lead'
  | 'Contacted'
  | 'Requirement Gathering'
  | 'Proposal'
  | 'Negotiation'
  | 'Active'
  | 'QA'
  | 'Delivered'
  | 'Closed';

export interface Lead {
  id: string;
  contact: string;
  organization: string;
  type: string;
  value: number;
  stage: LeadStage;
  owner: string;
  date: string;
}

export interface Client {
  id: string;
  name: string;
  organization: string;
  industry: string;
  email: string;
  projects: number;
  revenue: number;
  satisfaction: number;
  since: string;
}

export type TaskStatus = 'Todo' | 'In progress' | 'Review' | 'Done';

export interface Task {
  id: string;
  title: string;
  assignee: string;
  project: string;
  due: string;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High';
}

export interface Delivery {
  id: string;
  project: string;
  client: string;
  milestone: string;
  due: string;
  qa: 'Passed' | 'In QA' | 'Blocked';
  progress: number;
}

export interface Collaboration {
  id: string;
  partner: string;
  kind: 'Club' | 'E-Cell' | 'TBI' | 'Industry' | 'MSME';
  summary: string;
  status: 'Active' | 'Proposed' | 'Completed';
  since: string;
}

export interface Invoice {
  id: string;
  client: string;
  project: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  issued: string;
  due: string;
}

export interface Payout {
  id: string;
  member: string;
  project: string;
  amount: number;
  status: 'Paid' | 'Scheduled' | 'Processing';
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

export type FormValues = Record<string, string>;
