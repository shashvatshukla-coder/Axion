import type { Idea } from '@/types';

export const ideas: Idea[] = [
  { id: 'IDEA-212', title: 'Hostel laundry slot booking', submittedBy: 'Nikhil Arora', problem: 'Students queue for washing machines with no way to know when one is free.', category: 'Campus', validation: 'In review', stage: 'validation', team: ['Harsh Vardhan'], date: '2026-10-08' },
  { id: 'IDEA-211', title: 'Pharmacy stock alerts for rural clinics', submittedBy: 'Fatima Sheikh', problem: 'Small clinics run out of common medicines without warning.', category: 'HealthTech', validation: 'Pending', stage: 'problem', team: [], date: '2026-10-06' },
  { id: 'IDEA-208', title: 'Group buying for stationery shops', submittedBy: 'Omkar Patil', problem: 'Tiny shops pay more for supplies because they buy in small volumes.', category: 'Commerce', validation: 'Validated', stage: 'ideation', team: ['Meera Iyer', 'Priya Menon'], date: '2026-09-28' },
  { id: 'IDEA-205', title: 'Crop disease photo triage', submittedBy: 'Lakshmi Rajan', problem: 'Farmers wait days for an expert to look at a sick plant.', category: 'AgriTech', validation: 'Validated', stage: 'mvp', team: ['Nisha Patel', 'Vikram Singh'], date: '2026-09-14' },
  { id: 'IDEA-203', title: 'Exam notes marketplace', submittedBy: 'Dhruv Sethi', problem: 'Good notes are shared in chat groups and lost every semester.', category: 'EdTech', validation: 'Rejected', stage: 'problem', team: [], date: '2026-09-10' },
  { id: 'IDEA-199', title: 'Tailor order tracker', submittedBy: 'Aisha Khan', problem: 'Tailors track orders in notebooks, so delivery dates slip.', category: 'MSME', validation: 'Validated', stage: 'pmf', team: ['Arjun Reddy', 'Zoya Khan'], date: '2026-08-30' },
  { id: 'IDEA-196', title: 'Electricity bill splitter for flatmates', submittedBy: 'Rahul Dev', problem: 'Shared meters cause monthly arguments over who owes what.', category: 'FinTech', validation: 'In review', stage: 'validation', team: ['Anika Bose'], date: '2026-08-22' },
  { id: 'IDEA-190', title: 'Local tutor discovery', submittedBy: 'Sneha Kulkarni', problem: 'Parents find tutors by word of mouth and cannot compare quality.', category: 'EdTech', validation: 'Pending', stage: 'problem', team: [], date: '2026-08-11' },
  { id: 'IDEA-184', title: 'Warehouse pick-list optimiser', submittedBy: 'Imran Siddiqui', problem: 'Pickers walk the same aisles repeatedly because lists are unordered.', category: 'Logistics', validation: 'Validated', stage: 'traction', team: ['Neel Shah', 'Tanvi Joshi'], date: '2026-07-19' },
  { id: 'IDEA-178', title: 'Event volunteer rostering', submittedBy: 'Tara Menon', problem: 'Organisers manage volunteers in spreadsheets and chat threads.', category: 'Campus', validation: 'Validated', stage: 'scale', team: ['Kabir Nair'], date: '2026-06-30' },
  { id: 'IDEA-171', title: 'Bike-share for campus and nearby hostels', submittedBy: 'Gautam Rao', problem: 'The walk between hostels and academic blocks takes twenty minutes.', category: 'Mobility', validation: 'Rejected', stage: 'validation', team: [], date: '2026-06-12' },
];

export const INITIAL_IDEAS = ideas;
