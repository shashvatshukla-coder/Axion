import { http } from "@/lib/api";
import type { Project } from "@/types";
export const projectService = {
  list: () =>
    http<Project[]>(
      window.location.pathname.startsWith("/dashboard")
        ? "/projects"
        : "/public/projects",
    ),
  async featured(limit = 3) {
    return (await this.list())
      .filter((p) => p.status === "Active")
      .slice(0, limit);
  },
  async get(id: string) {
    return (await this.list()).find((p) => p.id === id);
  },
};
