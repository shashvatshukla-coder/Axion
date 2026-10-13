import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projectService } from '@/services/projectService';
import { useAsync } from '@/hooks/useAsync';
import { AsyncView } from '@/components/common/AsyncView';
import { CardGridSkeleton } from '@/components/common/Skeleton';
import { ProjectCard } from '@/components/common/ProjectCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ButtonLink } from '@/components/common/Button';

export function FeaturedProjects() {
  const state = useAsync(() => projectService.featured(3), []);
  const navigate = useNavigate();

  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeader
        eyebrow="Featured projects"
        title="What the teams are building right now"
        action={
          <ButtonLink to="/projects" variant="secondary">
            All projects <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        }
      />
      <div className="mt-12">
        <AsyncView
          state={state}
          skeleton={<CardGridSkeleton count={3} />}
          isEmpty={(d) => d.length === 0}
        >
          {(projects) => (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} onOpen={() => navigate(`/projects?open=${p.id}`)} />
              ))}
            </div>
          )}
        </AsyncView>
      </div>
    </section>
  );
}
