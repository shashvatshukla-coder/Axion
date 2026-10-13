import type { AppNotification, Collaboration, Delivery, Lead, LeadStage, Task } from '@/types';

export const leadStages: LeadStage[] = [
  'New Lead',
  'Contacted',
  'Requirement Gathering',
  'Proposal',
  'Negotiation',
  'Active',
  'QA',
  'Delivered',
  'Closed',
];

export const leads: Lead[] = [
  { id: 'ld-01', contact: 'Pankaj Gupta', organization: 'Gupta Hardware', type: 'Web', value: 65000, stage: 'New Lead', owner: 'Yash Kulkarni', date: '2026-10-10' },
  { id: 'ld-02', contact: 'Smita Rane', organization: 'Rane Dental', type: 'Web', value: 80000, stage: 'New Lead', owner: 'Riya Sharma', date: '2026-10-09' },
  { id: 'ld-03', contact: 'Imran Khan', organization: 'Khan Transport', type: 'Automation', value: 120000, stage: 'Contacted', owner: 'Yash Kulkarni', date: '2026-10-05' },
  { id: 'ld-04', contact: 'Latha Reddy', organization: 'Reddy Sweets', type: 'Mobile', value: 150000, stage: 'Contacted', owner: 'Riya Sharma', date: '2026-10-03' },
  { id: 'ld-05', contact: 'Jatin Oberoi', organization: 'Oberoi Printers', type: 'Web', value: 70000, stage: 'Requirement Gathering', owner: 'Yash Kulkarni', date: '2026-09-29' },
  { id: 'ld-06', contact: 'Shalini Verma', organization: 'Verma Coaching', type: 'Mobile', value: 190000, stage: 'Requirement Gathering', owner: 'Sana Qureshi', date: '2026-09-27' },
  { id: 'ld-07', contact: 'Neha Bansal', organization: 'Greenleaf Organics', type: 'Web', value: 48000, stage: 'Proposal', owner: 'Sana Qureshi', date: '2026-09-24' },
  { id: 'ld-08', contact: 'Ajay Nambiar', organization: 'Nambiar Spices', type: 'AI', value: 210000, stage: 'Proposal', owner: 'Riya Sharma', date: '2026-09-20' },
  { id: 'ld-09', contact: 'Preeti Saxena', organization: 'Saxena Pharma', type: 'Automation', value: 175000, stage: 'Negotiation', owner: 'Sana Qureshi', date: '2026-09-15' },
  { id: 'ld-10', contact: 'Dr. Anita Kapoor', organization: 'CityClinic', type: 'Full-stack', value: 310000, stage: 'Active', owner: 'Dev Malhotra', date: '2026-06-14' },
  { id: 'ld-11', contact: 'Ritu Agarwal', organization: 'Sunrise Textiles', type: 'Web', value: 385000, stage: 'Active', owner: 'Dev Malhotra', date: '2026-05-04' },
  { id: 'ld-12', contact: 'Farhan Ali', organization: 'RouteMate Logistics', type: 'Automation', value: 150000, stage: 'QA', owner: 'Siddharth Rao', date: '2026-08-05' },
  { id: 'ld-13', contact: 'Sandeep Joshi', organization: 'AgroMart', type: 'AI', value: 95000, stage: 'Delivered', owner: 'Dev Malhotra', date: '2026-04-12' },
  { id: 'ld-14', contact: 'Manoj Pillai', organization: 'Brew & Co', type: 'Mobile', value: 240000, stage: 'Closed', owner: 'Sana Qureshi', date: '2026-02-01' },
];

export const tasks: Task[] = [
  { id: 'tk-01', title: 'Set up Tidewater sensor firmware CI', assignee: 'Tanvi Joshi', project: 'Tidewater', due: '2026-10-16', status: 'In progress', priority: 'High' },
  { id: 'tk-02', title: 'Write validation report for laundry slots', assignee: 'Harsh Vardhan', project: 'Idea review', due: '2026-10-18', status: 'In progress', priority: 'Medium' },
  { id: 'tk-03', title: 'Design appointment reminders flow', assignee: 'Zoya Khan', project: 'CityClinic Booking', due: '2026-10-14', status: 'Review', priority: 'High' },
  { id: 'tk-04', title: 'Regression pass on inventory exports', assignee: 'Siddharth Rao', project: 'Sunrise Inventory', due: '2026-10-15', status: 'Review', priority: 'Medium' },
  { id: 'tk-05', title: 'Send October invoices', assignee: 'Aditya Verma', project: 'Finance', due: '2026-10-13', status: 'Todo', priority: 'High' },
  { id: 'tk-06', title: 'Prepare Demo Night slides', assignee: 'Ishita Rao', project: 'Events', due: '2026-10-14', status: 'In progress', priority: 'Medium' },
  { id: 'tk-07', title: 'Follow up with Nambiar Spices', assignee: 'Riya Sharma', project: 'Agency leads', due: '2026-10-17', status: 'Todo', priority: 'Medium' },
  { id: 'tk-08', title: 'Pilot test of soil strip reader', assignee: 'Nisha Patel', project: 'Kheti Kit', due: '2026-10-22', status: 'Todo', priority: 'Low' },
  { id: 'tk-09', title: 'Ship Slate offline sync fix', assignee: 'Vikram Singh', project: 'Slate', due: '2026-10-09', status: 'Done', priority: 'High' },
  { id: 'tk-10', title: 'Update member onboarding guide', assignee: 'Kabir Nair', project: 'Club operations', due: '2026-10-07', status: 'Done', priority: 'Low' },
];

export const deliveries: Delivery[] = [
  { id: 'dl-01', project: 'Sunrise Inventory', client: 'Sunrise Textiles', milestone: 'Warehouse transfer module', due: '2026-10-20', qa: 'In QA', progress: 72 },
  { id: 'dl-02', project: 'CityClinic Booking', client: 'CityClinic', milestone: 'Doctor schedule screens', due: '2026-10-28', qa: 'In QA', progress: 48 },
  { id: 'dl-03', project: 'RouteMate Dashboard', client: 'RouteMate Logistics', milestone: 'Morning report job', due: '2026-10-15', qa: 'Blocked', progress: 30 },
  { id: 'dl-04', project: 'AgroMart Assistant', client: 'AgroMart', milestone: 'Final handover', due: '2026-09-30', qa: 'Passed', progress: 100 },
  { id: 'dl-05', project: 'Brew & Co Ordering', client: 'Brew & Co', milestone: 'Loyalty points release', due: '2026-09-12', qa: 'Passed', progress: 100 },
  { id: 'dl-06', project: 'Storefront refresh', client: 'Greenleaf Organics', milestone: 'Design sign-off', due: '2026-11-05', qa: 'In QA', progress: 20 },
];

export const collaborations: Collaboration[] = [
  { id: 'co-01', partner: 'Campus E-Cell', kind: 'E-Cell', summary: 'Shared idea pipeline and joint demo nights.', status: 'Active', since: '2024-03-01' },
  { id: 'co-02', partner: 'University TBI', kind: 'TBI', summary: 'Incubation seats and funding conversations for graduating startups.', status: 'Active', since: '2024-09-15' },
  { id: 'co-03', partner: 'Robotics Club', kind: 'Club', summary: 'Hardware help for Tidewater sensors.', status: 'Active', since: '2025-10-04' },
  { id: 'co-04', partner: 'Design Society', kind: 'Club', summary: 'Joint design sprints and portfolio reviews.', status: 'Active', since: '2025-02-20' },
  { id: 'co-05', partner: 'Sunrise Textiles', kind: 'MSME', summary: 'Paid inventory system project.', status: 'Active', since: '2025-11-02' },
  { id: 'co-06', partner: 'RouteMate Logistics', kind: 'Industry', summary: 'Automation work for delivery reporting.', status: 'Active', since: '2026-08-05' },
  { id: 'co-07', partner: 'Data Science Club', kind: 'Club', summary: 'Model reviews for AI projects.', status: 'Proposed', since: '2026-10-01' },
  { id: 'co-08', partner: 'Regional MSME Association', kind: 'MSME', summary: 'Intro sessions for small businesses on working with the agency.', status: 'Proposed', since: '2026-09-25' },
];

export const notifications: AppNotification[] = [
  { id: 'nt-1', title: 'New idea submitted', detail: 'Hostel laundry slot booking is waiting for review.', time: '2h ago', unread: true },
  { id: 'nt-2', title: 'Invoice overdue', detail: 'INV-2026-045 from Sunrise Textiles is 23 days past due.', time: '5h ago', unread: true },
  { id: 'nt-3', title: 'QA blocked', detail: 'RouteMate Dashboard has a blocking issue on the morning report job.', time: 'Yesterday', unread: true },
  { id: 'nt-4', title: 'New lead', detail: 'Gupta Hardware asked about a website.', time: 'Yesterday', unread: false },
  { id: 'nt-5', title: 'Payout cycle', detail: 'Processing payouts for 2 members.', time: '2 days ago', unread: false },
];
