import {
  Brain,
  Code2,
  FlaskConical,
  Globe,
  Hammer,
  Layers,
  PenTool,
  Palette,
  Search,
  Smartphone,
  Target,
  TrendingUp,
  Workflow,
  Briefcase,
  Lightbulb,
  Megaphone,
  ShieldCheck,
  Users,
  Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { StageKey } from '@/types';

export const CLUB = {
  name: 'Foundry Club',
  short: 'Foundry',
  email: 'hello@foundry.example',
  phone: '+91 98765 43210',
  address: 'Innovation Block, Room 214, University Campus',
  tagline: 'From Problems to Products.',
  blurb:
    'A student-powered innovation ecosystem where ideas become startups and technical talent solves real-world business problems.',
};

export const PUBLIC_LINKS = [
  { label: 'Incubator', to: '/incubator' },
  { label: 'Agency', to: '/agency' },
  { label: 'Projects', to: '/projects' },
  { label: 'Startups', to: '/startups' },
  { label: 'Team', to: '/team' },
  { label: 'About', to: '/about' },
];

export const ALL_PUBLIC_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Incubator', to: '/incubator' },
  { label: 'Agency', to: '/agency' },
  { label: 'Projects', to: '/projects' },
  { label: 'Startups', to: '/startups' },
  { label: 'Team', to: '/team' },
  { label: 'Collaborations', to: '/collaborations' },
  { label: 'Contact', to: '/contact' },
  { label: 'Join', to: '/join' },
];

/* ---------- Startup journey ---------- */

export interface JourneyStage {
  key: StageKey;
  label: string;
  question: string;
  description: string;
  owner: string;
  output: string;
}

export const JOURNEY: JourneyStage[] = [
  {
    key: 'problem',
    label: 'Problem',
    question: 'What is actually broken?',
    description:
      'Scouts spend time with students, shop owners, clinics and factories to find problems worth solving, then write each one down in plain language with evidence.',
    owner: 'Problem Scouting',
    output: 'Problem brief',
  },
  {
    key: 'validation',
    label: 'Validation',
    question: 'Do people care enough to act?',
    description:
      'We interview real users and test whether they will spend time, effort or money to fix the problem. Weak ideas stop here, which saves everyone months.',
    owner: 'Validation Team',
    output: 'Validation report',
  },
  {
    key: 'ideation',
    label: 'Ideation',
    question: 'What should we build first?',
    description:
      'Validated problems become a focused product frame: who it is for, the one job it does, how it makes money and what it looks like.',
    owner: 'Product & Design',
    output: 'Product frame and wireframes',
  },
  {
    key: 'mvp',
    label: 'MVP',
    question: 'Can we ship something real?',
    description:
      'A small cross-team squad builds the smallest working version and puts it in front of the first ten users within weeks, not semesters.',
    owner: 'Technical Team',
    output: 'Working MVP',
  },
  {
    key: 'pmf',
    label: 'PMF',
    question: 'Do users keep coming back?',
    description:
      'We watch retention, referrals and willingness to pay. The product changes until a clear group of users would be upset if it disappeared.',
    owner: 'Incubator Team',
    output: 'Retention and revenue proof',
  },
  {
    key: 'traction',
    label: 'Traction',
    question: 'Can it run without hand-holding?',
    description:
      'Operations get set up: support, analytics, billing, hiring plans. We introduce founders to E-Cell and TBI networks for funding conversations.',
    owner: 'Operations & Outreach',
    output: 'Operating playbook',
  },
  {
    key: 'scale',
    label: 'Scale',
    question: 'Will it hold up at ten times the size?',
    description:
      'System architecture, cost and team structure get reworked for growth, with a plan to stay sustainable once the club steps back.',
    owner: 'Core Team',
    output: 'Scale plan',
  },
];

export const STAGE_LABEL: Record<StageKey, string> = {
  problem: 'Problem',
  validation: 'Validation',
  ideation: 'Ideation',
  mvp: 'MVP',
  pmf: 'PMF',
  traction: 'Traction',
  scale: 'Scale',
};

export const STAGE_ORDER: StageKey[] = ['problem', 'validation', 'ideation', 'mvp', 'pmf', 'traction', 'scale'];

/* ---------- Incubator ---------- */

export interface InfoCard {
  icon: LucideIcon;
  title: string;
  description: string;
  points?: string[];
}

export const INCUBATOR_CARDS: InfoCard[] = [
  {
    icon: Search,
    title: 'Problem Scouting',
    description: 'Find real problems in society and in how businesses work, and analyse which ones are startup-sized.',
    points: ['Field visits', 'Workflow gap maps', 'Idea analysis'],
  },
  {
    icon: FlaskConical,
    title: 'Market Validation',
    description: 'Check that users face the problem and will give time, effort or money to solve it.',
    points: ['User interviews', 'Validation reports', 'Market sizing'],
  },
  {
    icon: Palette,
    title: 'Product Design',
    description: 'Turn a validated problem into a practical solution with clear user flows and a business model.',
    points: ['UI/UX design', 'Product framing', 'Business design'],
  },
  {
    icon: Hammer,
    title: 'MVP Development',
    description: 'Build the smallest version that proves the idea, with engineers and designers from across the club.',
    points: ['Rapid builds', 'Weekly demos', 'First ten users'],
  },
  {
    icon: Target,
    title: 'Product Market Fit',
    description: 'Measure growth, retention and willingness to pay, then keep improving until the fit is clear.',
    points: ['Growth experiments', 'Retention tracking', 'Pricing tests'],
  },
  {
    icon: TrendingUp,
    title: 'Scalability',
    description: 'Prepare systems, teams and costs so the startup can grow and sustain itself.',
    points: ['System architecture', 'Operations setup', 'Sustainability plan'],
  },
];

export const INCUBATOR_AREAS: InfoCard[] = [
  {
    icon: Search,
    title: 'Problem Scouting & Analysis',
    description: 'Identify real-world problems and judge which are worth pursuing.',
    points: ['Society problems', 'Workflow gaps', 'Startup opportunities', 'Idea analysis'],
  },
  {
    icon: FlaskConical,
    title: 'Market Validation',
    description: 'Prove demand before anything gets built.',
    points: ['User willingness to spend time, effort or money', 'Validation reports', 'Market analysis'],
  },
  {
    icon: Hammer,
    title: 'Ideation + Design + MVP',
    description: 'Convert validated problems into working products.',
    points: ['UI/UX', 'Product design', 'Business design', 'MVP development'],
  },
  {
    icon: TrendingUp,
    title: 'Product Market Fit & Scalability',
    description: 'Make the product last and grow.',
    points: ['Growth', 'Product-market fit', 'System architecture', 'Sustainability'],
  },
];

export interface PipelineStage {
  id: string;
  title: string;
  purpose: string;
  activities: string[];
  team: string;
  deliverables: string[];
}

export const PIPELINE: PipelineStage[] = [
  {
    id: '01',
    title: 'Discover',
    purpose: 'Find problems that are real, frequent and painful enough to be worth solving.',
    activities: ['Campus and market field visits', 'Interviews with MSME owners and students', 'Workflow gap mapping'],
    team: 'Problem Scouting squad with the Validation Team',
    deliverables: ['Problem brief', 'Evidence log', 'Opportunity shortlist'],
  },
  {
    id: '02',
    title: 'Validate',
    purpose: 'Learn whether users will spend time, effort or money to fix the problem.',
    activities: ['Structured user interviews', 'Landing page and pre-order tests', 'Competitor and alternative analysis'],
    team: 'Validation Team',
    deliverables: ['Validation report', 'Market analysis', 'Go / no-go decision'],
  },
  {
    id: '03',
    title: 'Ideate',
    purpose: 'Decide the single job the product will do and how it will make money.',
    activities: ['Solution workshops', 'Feature prioritisation', 'Business model sketching'],
    team: 'Incubator Team with the founder',
    deliverables: ['Product frame', 'Lean business canvas', 'MVP scope'],
  },
  {
    id: '04',
    title: 'Design',
    purpose: 'Make the product easy to understand before any code is written.',
    activities: ['User flows and wireframes', 'Clickable prototype', 'Usability tests with five users'],
    team: 'UI/UX Team',
    deliverables: ['Prototype', 'Design system starter', 'Usability findings'],
  },
  {
    id: '05',
    title: 'Build MVP',
    purpose: 'Ship the smallest working version to real users.',
    activities: ['Weekly build sprints', 'Demo every Friday', 'Analytics and feedback hooks'],
    team: 'Technical Team and QA Team',
    deliverables: ['Deployed MVP', 'Technical notes', 'First user cohort'],
  },
  {
    id: '06',
    title: 'Find PMF',
    purpose: 'Learn whether a clear group of users needs this product.',
    activities: ['Retention and referral tracking', 'Pricing experiments', 'Interview churned users'],
    team: 'Incubator Team and the founder',
    deliverables: ['PMF scorecard', 'Pricing model', 'Roadmap for the next quarter'],
  },
  {
    id: '07',
    title: 'Gain Traction',
    purpose: 'Build repeatable ways to find, win and support customers.',
    activities: ['Outreach and partnerships', 'Support and billing setup', 'Intros to E-Cell and TBI networks'],
    team: 'Outreach Team and Finance Team',
    deliverables: ['Operating playbook', 'Pipeline report', 'Funding readiness pack'],
  },
  {
    id: '08',
    title: 'Scale',
    purpose: 'Prepare the product, team and costs for much larger usage.',
    activities: ['Architecture review', 'Cost and infrastructure planning', 'Founder hand-over plan'],
    team: 'Core Team with senior mentors',
    deliverables: ['Scale plan', 'Architecture document', 'Graduation from the incubator'],
  },
];

/* ---------- Agency ---------- */

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
}

export const AGENCY_SERVICES: ServiceItem[] = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Fast, accessible websites and web apps for businesses that want to be found and trusted online.',
    tags: ['React', 'Next.js', 'CMS'],
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Android and iOS apps that work on real phones and patchy networks.',
    tags: ['React Native', 'Flutter', 'Offline-first'],
  },
  {
    icon: Brain,
    title: 'AI Solutions',
    description: 'Chatbots, document processing and forecasting built around a business problem, not a demo.',
    tags: ['LLMs', 'Python', 'Computer vision'],
  },
  {
    icon: PenTool,
    title: 'UI/UX',
    description: 'Research-led interface design with clickable prototypes before development starts.',
    tags: ['Figma', 'Design systems', 'Usability tests'],
  },
  {
    icon: Layers,
    title: 'Full Stack Development',
    description: 'End-to-end products from database to dashboard, with tests and deployment included.',
    tags: ['Node', 'Postgres', 'Cloud'],
  },
  {
    icon: Workflow,
    title: 'Automation',
    description: 'Replace repetitive spreadsheet and messaging work with reliable scripts and integrations.',
    tags: ['APIs', 'Workflows', 'Reporting'],
  },
];

export interface ProcessStep {
  title: string;
  description: string;
}

export const AGENCY_PROCESS: ProcessStep[] = [
  { title: 'Requirement', description: 'We listen, ask questions and write down what success looks like.' },
  { title: 'Proposal', description: 'A scoped plan with price, timeline and a named delivery lead.' },
  { title: 'Team Allocation', description: 'Developers, designers and a QA owner are matched to your project.' },
  { title: 'Development', description: 'Short sprints with a demo each week so you see progress early.' },
  { title: 'QA', description: 'Dedicated testing on devices and browsers before anything ships.' },
  { title: 'Delivery', description: 'Handover with documentation, training and access to everything built.' },
  { title: 'Support', description: 'A support window after launch for fixes and small changes.' },
];

export const AGENCY_AREAS: InfoCard[] = [
  {
    icon: Megaphone,
    title: 'Outreach & Acquisition',
    description: 'How new work reaches the club.',
    points: ['Lead generation', 'Freelance opportunities', 'Cold outreach', 'Client acquisition'],
  },
  {
    icon: Code2,
    title: 'Agency Build & Delivery',
    description: 'How the work gets built.',
    points: ['Web and full-stack', 'Mobile applications', 'AI development', 'Technical delivery'],
  },
  {
    icon: ShieldCheck,
    title: 'Client Success & QA',
    description: 'How clients stay confident.',
    points: ['Quality assurance', 'Client communication', 'Support', 'Delivery tracking'],
  },
  {
    icon: Briefcase,
    title: 'Finance & Payout Operations',
    description: 'How the money moves.',
    points: ['Invoices', 'Project payments', 'Member payouts', 'Financial records'],
  },
];

/* ---------- Ecosystem ---------- */

export interface EcosystemNode {
  id: string;
  label: string;
  gives: string;
  detail: string;
}

export const ECOSYSTEM_INPUTS: EcosystemNode[] = [
  { id: 'students', label: 'Students', gives: 'Unique ideas', detail: 'Students bring ideas and problems they see every day.' },
  { id: 'ecell', label: 'E-Cell', gives: 'Ideas / startup network', detail: 'E-Cell shares ideas and opens its startup network to our teams.' },
  { id: 'tbi', label: 'TBI', gives: 'Funding / incubation', detail: 'The technology business incubator offers funding paths and incubation support.' },
  { id: 'clubs', label: 'Other Clubs', gives: 'Technical collaboration', detail: 'Other university clubs join builds and share technical skills.' },
  { id: 'industries', label: 'Industries', gives: 'Paid projects / work', detail: 'Industries bring paid projects that keep the agency running.' },
  { id: 'msmes', label: 'MSMEs', gives: 'Paid projects / work', detail: 'Small businesses bring everyday workflow problems and paid work.' },
];

export const ECOSYSTEM_OUTPUTS: EcosystemNode[] = [
  { id: 'incubator', label: 'Incubator', gives: 'Idea to product', detail: 'Turns problems and ideas into products.' },
  { id: 'agency', label: 'Agency', gives: 'Paid client work', detail: 'Delivers paid services to external clients.' },
  { id: 'core', label: 'Core Teams', gives: 'Execute and manage', detail: 'Club teams execute and manage projects across both divisions.' },
];

/* ---------- Join ---------- */

export interface JoinOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  kind: 'application' | 'idea';
}

export const JOIN_OPTIONS: JoinOption[] = [
  { id: 'core', title: 'Join Core Team', description: 'Help run both divisions: members, projects, partnerships and operations.', icon: Users, kind: 'application' },
  { id: 'incubator', title: 'Join Incubator', description: 'Scout problems, run validations and shape early products.', icon: Rocket, kind: 'application' },
  { id: 'agency', title: 'Join Agency', description: 'Work on paid client projects and earn payouts for delivered work.', icon: Briefcase, kind: 'application' },
  { id: 'idea', title: 'Submit Startup Idea', description: 'Tell us the problem you want to solve. Takes about ten minutes.', icon: Lightbulb, kind: 'idea' },
  { id: 'developer', title: 'Apply as Developer', description: 'Build MVPs and client projects in web, mobile or AI.', icon: Code2, kind: 'application' },
  { id: 'designer', title: 'Apply as UI/UX Designer', description: 'Design products from research to a clickable prototype.', icon: PenTool, kind: 'application' },
  { id: 'outreach', title: 'Apply for Outreach', description: 'Find clients, partners and funding conversations for the club.', icon: Megaphone, kind: 'application' },
];

export const VALUES = [
  { title: 'Evidence before building', description: 'We talk to users first. Most ideas get better or get stopped before code is written.' },
  { title: 'Ship small, ship often', description: 'Every project has a demo each week. Progress you can see beats plans nobody reads.' },
  { title: 'Real work, fair pay', description: 'Agency work pays members for what they deliver. Learning and earning go together.' },
  { title: 'Open to the whole campus', description: 'Any branch, any year. Skills get taught on the job and ideas come from everywhere.' },
];

export const CLUB_TIMELINE = [
  { year: '2021', title: 'A shared room and six students', text: 'Six students started meeting weekly to help a local shop build an ordering page.' },
  { year: '2022', title: 'First paid client project', text: 'The agency division took its first paid project and paid out its first member fees.' },
  { year: '2023', title: 'Incubator launches', text: 'A formal validation process was set up and the first ideas went through it.' },
  { year: '2024', title: 'TBI and E-Cell partnerships', text: 'Joint programmes started with the technology business incubator and E-Cell.' },
  { year: '2025', title: 'First startups graduate', text: 'Two incubated products reached paying customers and left the club as independent teams.' },
];
