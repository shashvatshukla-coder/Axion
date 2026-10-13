import type { Member } from '@/types';

const li = (slug: string) => `https://www.linkedin.com/in/${slug}`;
const gh = (slug: string) => `https://github.com/${slug}`;

export const members: Member[] = [
  { id: 'm01', name: 'Aarav Mehta', role: 'President', department: 'Shared', team: 'Core Team', skills: ['Strategy', 'Partnerships', 'Product'], currentProject: 'Club operations', status: 'Active', linkedin: li('aarav-mehta'), github: gh('aaravmehta'), hue: 20 },
  { id: 'm02', name: 'Ishita Rao', role: 'Vice President', department: 'Shared', team: 'Core Team', skills: ['Program design', 'Mentoring', 'Events'], currentProject: 'Demo night', status: 'Active', linkedin: li('ishita-rao'), github: gh('ishitarao'), hue: 330 },
  { id: 'm03', name: 'Kabir Nair', role: 'Operations Lead', department: 'Shared', team: 'Core Team', skills: ['Process', 'Tooling', 'Reporting'], currentProject: 'Dashboard rollout', status: 'Active', linkedin: li('kabir-nair'), github: gh('kabirnair'), hue: 210 },
  { id: 'm04', name: 'Meera Iyer', role: 'Incubator Head', department: 'Incubator', team: 'Incubator Team', skills: ['Venture building', 'Mentoring', 'Pitching'], currentProject: 'Tidewater', status: 'Active', linkedin: li('meera-iyer'), github: gh('meeraiyer'), hue: 285 },
  { id: 'm05', name: 'Rohan Das', role: 'Incubation Associate', department: 'Incubator', team: 'Incubator Team', skills: ['Research', 'Roadmaps', 'Notion'], currentProject: 'Tidewater', status: 'Active', linkedin: li('rohan-das'), github: gh('rohandas'), hue: 160 },
  { id: 'm06', name: 'Sana Qureshi', role: 'Agency Head', department: 'Agency', team: 'Agency Team', skills: ['Client management', 'Scoping', 'Pricing'], currentProject: 'Sunrise Inventory', status: 'Active', linkedin: li('sana-qureshi'), github: gh('sanaqureshi'), hue: 12 },
  { id: 'm07', name: 'Dev Malhotra', role: 'Delivery Manager', department: 'Agency', team: 'Agency Team', skills: ['Planning', 'Scrum', 'Risk'], currentProject: 'CityClinic Booking', status: 'Active', linkedin: li('dev-malhotra'), github: gh('devmalhotra'), hue: 240 },
  { id: 'm08', name: 'Tanvi Joshi', role: 'Tech Lead', department: 'Shared', team: 'Technical Team', skills: ['System design', 'React', 'Node.js'], currentProject: 'Tidewater', status: 'Active', linkedin: li('tanvi-joshi'), github: gh('tanvijoshi'), hue: 195 },
  { id: 'm09', name: 'Arjun Reddy', role: 'Full-stack Developer', department: 'Shared', team: 'Technical Team', skills: ['TypeScript', 'PostgreSQL', 'Next.js'], currentProject: 'CityClinic Booking', status: 'Active', linkedin: li('arjun-reddy'), github: gh('arjunreddy'), hue: 260 },
  { id: 'm10', name: 'Nisha Patel', role: 'AI Engineer', department: 'Shared', team: 'Technical Team', skills: ['Python', 'LLMs', 'Computer vision'], currentProject: 'Kheti Kit', status: 'Active', linkedin: li('nisha-patel'), github: gh('nishapatel'), hue: 140 },
  { id: 'm11', name: 'Vikram Singh', role: 'Mobile Developer', department: 'Shared', team: 'Technical Team', skills: ['Flutter', 'React Native', 'Firebase'], currentProject: 'Slate', status: 'Active', linkedin: li('vikram-singh'), github: gh('vikramsingh'), hue: 35 },
  { id: 'm12', name: 'Neel Shah', role: 'Automation Engineer', department: 'Agency', team: 'Technical Team', skills: ['Python', 'FastAPI', 'Workflows'], currentProject: 'RouteMate Dashboard', status: 'Active', linkedin: li('neel-shah'), github: gh('neelshah'), hue: 305 },
  { id: 'm13', name: 'Priya Menon', role: 'Design Lead', department: 'Shared', team: 'UI/UX Team', skills: ['Figma', 'Design systems', 'Research'], currentProject: 'Marrow', status: 'Active', linkedin: li('priya-menon'), github: gh('priyamenon'), hue: 350 },
  { id: 'm14', name: 'Zoya Khan', role: 'Product Designer', department: 'Shared', team: 'UI/UX Team', skills: ['Prototyping', 'Usability tests', 'Motion'], currentProject: 'CityClinic Booking', status: 'Active', linkedin: li('zoya-khan'), github: gh('zoyakhan'), hue: 275 },
  { id: 'm15', name: 'Harsh Vardhan', role: 'Validation Lead', department: 'Incubator', team: 'Validation Team', skills: ['Interviews', 'Surveys', 'Analysis'], currentProject: 'Marrow', status: 'Active', linkedin: li('harsh-vardhan'), github: gh('harshvardhan'), hue: 85 },
  { id: 'm16', name: 'Anika Bose', role: 'Market Researcher', department: 'Incubator', team: 'Validation Team', skills: ['Market sizing', 'Competitor maps', 'Writing'], currentProject: 'Kheti Kit', status: 'On leave', linkedin: li('anika-bose'), github: gh('anikabose'), hue: 320 },
  { id: 'm17', name: 'Yash Kulkarni', role: 'Outreach Lead', department: 'Agency', team: 'Outreach Team', skills: ['Cold outreach', 'Negotiation', 'CRM'], currentProject: 'Lead pipeline', status: 'Active', linkedin: li('yash-kulkarni'), github: gh('yashkulkarni'), hue: 55 },
  { id: 'm18', name: 'Riya Sharma', role: 'Client Acquisition', department: 'Agency', team: 'Outreach Team', skills: ['Sales', 'Proposals', 'LinkedIn'], currentProject: 'Lead pipeline', status: 'Active', linkedin: li('riya-sharma'), github: gh('riyasharma'), hue: 15 },
  { id: 'm19', name: 'Siddharth Rao', role: 'QA Lead', department: 'Agency', team: 'QA Team', skills: ['Test plans', 'Playwright', 'Accessibility'], currentProject: 'Sunrise Inventory', status: 'Active', linkedin: li('siddharth-rao'), github: gh('siddharthrao'), hue: 180 },
  { id: 'm20', name: 'Pooja Nambiar', role: 'QA Engineer', department: 'Agency', team: 'QA Team', skills: ['Manual testing', 'Mobile QA', 'Bug triage'], currentProject: 'CityClinic Booking', status: 'Active', linkedin: li('pooja-nambiar'), github: gh('poojanambiar'), hue: 300 },
  { id: 'm21', name: 'Aditya Verma', role: 'Finance Lead', department: 'Shared', team: 'Finance Team', skills: ['Invoicing', 'Budgeting', 'Compliance'], currentProject: 'Payout cycle', status: 'Active', linkedin: li('aditya-verma'), github: gh('adityaverma'), hue: 225 },
  { id: 'm22', name: 'Kavya Pillai', role: 'Finance Associate', department: 'Shared', team: 'Finance Team', skills: ['Bookkeeping', 'Reconciliation', 'Spreadsheets'], currentProject: 'Payout cycle', status: 'Alumni', linkedin: li('kavya-pillai'), github: gh('kavyapillai'), hue: 105 },
];

export const teamOrder = [
  'Core Team',
  'Incubator Team',
  'Agency Team',
  'Technical Team',
  'UI/UX Team',
  'Validation Team',
  'Outreach Team',
  'QA Team',
  'Finance Team',
] as const;
