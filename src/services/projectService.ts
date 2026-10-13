import { projects } from '@/data/projects';
import { mockRequest } from '@/lib/api';
import type { Project } from '@/types';

export const projectService = {
  list(): Promise<Project[]> {
    return mockRequest(projects);
  },

  async featured(limit = 3): Promise<Project[]> {
    const picked = projects.filter((p) => p.status === 'Active').slice(0, limit);
    return mockRequest(picked, 350);
  },

  async get(id: string): Promise<Project | undefined> {
    return mockRequest(projects.find((p) => p.id === id), 250);
  },
};
