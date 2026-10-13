import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import Incubator from '@/pages/public/Incubator';
import Agency from '@/pages/public/Agency';
import Projects from '@/pages/public/Projects';
import Startups from '@/pages/public/Startups';
import Team from '@/pages/public/Team';
import Collaborations from '@/pages/public/Collaborations';
import Contact from '@/pages/public/Contact';
import Join from '@/pages/public/Join';
import NotFound from '@/pages/public/NotFound';

const Overview = lazy(() => import('@/pages/dashboard/Overview'));
const Ideas = lazy(() => import('@/pages/dashboard/Ideas'));
const Validation = lazy(() => import('@/pages/dashboard/Validation'));
const Mvps = lazy(() => import('@/pages/dashboard/Mvps'));
const StartupsAdmin = lazy(() => import('@/pages/dashboard/StartupsAdmin'));
const Leads = lazy(() => import('@/pages/dashboard/Leads'));
const Clients = lazy(() => import('@/pages/dashboard/Clients'));
const AgencyProjects = lazy(() => import('@/pages/dashboard/AgencyProjects'));
const Deliveries = lazy(() => import('@/pages/dashboard/Deliveries'));
const Members = lazy(() => import('@/pages/dashboard/Members'));
const Tasks = lazy(() => import('@/pages/dashboard/Tasks'));
const CollaborationsAdmin = lazy(() => import('@/pages/dashboard/CollaborationsAdmin'));
const Revenue = lazy(() => import('@/pages/dashboard/Revenue'));
const Invoices = lazy(() => import('@/pages/dashboard/Invoices'));
const Payouts = lazy(() => import('@/pages/dashboard/Payouts'));
const Reports = lazy(() => import('@/pages/dashboard/Reports'));
const Settings = lazy(() => import('@/pages/dashboard/Settings'));

function PageLoading() {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-muted" role="status">
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="incubator" element={<Incubator />} />
            <Route path="agency" element={<Agency />} />
            <Route path="projects" element={<Projects />} />
            <Route path="startups" element={<Startups />} />
            <Route path="team" element={<Team />} />
            <Route path="collaborations" element={<Collaborations />} />
            <Route path="contact" element={<Contact />} />
            <Route path="join" element={<Join />} />
          </Route>

          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="incubator/ideas" element={<Ideas />} />
            <Route path="incubator/validation" element={<Validation />} />
            <Route path="incubator/mvps" element={<Mvps />} />
            <Route path="incubator/startups" element={<StartupsAdmin />} />
            <Route path="agency/leads" element={<Leads />} />
            <Route path="agency/clients" element={<Clients />} />
            <Route path="agency/projects" element={<AgencyProjects />} />
            <Route path="agency/deliveries" element={<Deliveries />} />
            <Route path="teams/members" element={<Members />} />
            <Route path="teams/tasks" element={<Tasks />} />
            <Route path="collaborations" element={<CollaborationsAdmin />} />
            <Route path="finance/revenue" element={<Revenue />} />
            <Route path="finance/invoices" element={<Invoices />} />
            <Route path="finance/payouts" element={<Payouts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route element={<PublicLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
