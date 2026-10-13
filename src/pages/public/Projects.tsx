import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { projectService } from '@/services/projectService';
import type { Project } from '@/types';
import { PageHero } from '@/components/layout/PageHero';
import { AsyncView } from '@/components/common/AsyncView';
import { CardGridSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ProjectCard } from '@/components/common/ProjectCard';
import { Tabs } from '@/components/common/Tabs';
import type { TabItem } from '@/components/common/Tabs';
import { Drawer } from '@/components/common/Drawer';
import { ProjectDetails } from '@/components/common/ProjectDetails';
import { ButtonLink } from '@/components/common/Button';

type Filter = 'all' | 'incubator' | 'agency' | 'completed' | 'active';

const FILTERS: Record<Filter, (p: Project) => boolean> = {
  all: () => true,
  incubator: (p) => p.division === 'Incubator',
  agency: (p) => p.division === 'Agency',
  completed: (p) => p.status === 'Completed',
  active: (p) => p.status === 'Active',
};

const LABELS: Record<Filter, string> = {
  all: 'All',
  incubator: 'Incubator',
  agency: 'Agency',
  completed: 'Completed',
  active: 'Active',
};

export default function Projects() {
  usePageTitle('Projects');
  const state = useAsync(() => projectService.list(), []);
  const [filter, setFilter] = useState<Filter>('all');
  const [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState<Project | null>(null);

  const openId = params.get('open');
  useEffect(() => {
    if (openId && state.data) {
      const found = state.data.find((p) => p.id === openId);
      if (found) setSelected(found);
    }
  }, [openId, state.data]);

  const tabs: TabItem[] = useMemo(() => {
    const all = state.data ?? [];
    return (Object.keys(FILTERS) as Filter[]).map((id) => ({
      id,
      label: LABELS[id],
      count: state.data ? all.filter(FILTERS[id]).length : undefined,
    }));
  }, [state.data]);

  const closeDrawer = () => {
    setSelected(null);
    if (params.has('open')) {
      const next = new URLSearchParams(params);
      next.delete('open');
      setParams(next, { replace: true });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Everything the club is building and has shipped."
        description="Incubator products and agency client work, side by side. Filter by division or status."
      />

      <section className="container-x py-12 sm:py-16">
        <Tabs tabs={tabs} value={filter} onChange={(id) => setFilter(id as Filter)} />
        <div className="mt-8">
          <AsyncView state={state} skeleton={<CardGridSkeleton />}>
            {(projects) => {
              const visible = projects.filter(FILTERS[filter]);
              if (visible.length === 0) {
                return <EmptyState title="No projects match" description="Try another filter." />;
              }
              return (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((p) => (
                    <ProjectCard key={p.id} project={p} cta="Details" onOpen={setSelected} />
                  ))}
                </div>
              );
            }}
          </AsyncView>
        </div>
      </section>

      <Drawer
        open={selected !== null}
        onClose={closeDrawer}
        title={selected?.name}
        description={selected?.type}
        footer={
          selected && (
            <ButtonLink to={selected.division === 'Agency' ? '/agency?request=1' : '/join'} variant={selected.division === 'Agency' ? 'agency' : 'primary'} className="w-full">
              {selected.division === 'Agency' ? 'Request something similar' : 'Join the club to contribute'}
            </ButtonLink>
          )
        }
      >
        {selected && <ProjectDetails project={selected} />}
      </Drawer>
    </>
  );
}
