import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAsync } from '@/hooks/useAsync';
import { projectService } from '@/services/projectService';
import type { Project } from '@/types';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { AsyncView } from '@/components/common/AsyncView';
import { CardGridSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ProjectCard } from '@/components/common/ProjectCard';
import { ProjectDetails } from '@/components/common/ProjectDetails';
import { Drawer } from '@/components/common/Drawer';

export default function Mvps() {
  usePageTitle('MVPs');
  const state = useAsync(() => projectService.list(), []);
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <PageHeader title="MVPs" description="Incubator products currently being built or tested with their first users." />
      <AsyncView state={state} skeleton={<CardGridSkeleton count={4} />}>
        {(projects) => {
          const mvps = projects.filter((p) => p.division === 'Incubator' && p.status === 'Active');
          if (mvps.length === 0) return <EmptyState title="No MVPs in progress" description="Validated ideas will show up here once building starts." />;
          return (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {mvps.map((p) => (
                <ProjectCard key={p.id} project={p} cta="Open" onOpen={setSelected} />
              ))}
            </div>
          );
        }}
      </AsyncView>

      <Drawer open={selected !== null} onClose={() => setSelected(null)} title={selected?.name} description={selected?.type}>
        {selected && <ProjectDetails project={selected} />}
      </Drawer>
    </>
  );
}
