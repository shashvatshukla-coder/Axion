import { http, patch, post } from "@/lib/api";
import type { FormValues, Idea, StageKey, ValidationStatus } from "@/types";
export const ideaService = {
  list: () => http<Idea[]>("/ideas"),
  setValidation: (id: string, validation: ValidationStatus) =>
    patch<Idea>(`/ideas/${encodeURIComponent(id)}`, { validation }),
  moveStage: (id: string, stage: StageKey) =>
    patch<Idea>(`/ideas/${encodeURIComponent(id)}`, { stage }),
  async assign(id: string, member: string) {
    const idea = await http<Idea>(`/ideas/${encodeURIComponent(id)}`);
    return patch<Idea>(`/ideas/${encodeURIComponent(id)}`, {
      team: Array.from(new Set([...idea.team, member])),
    });
  },
  submit: (values: FormValues) => post<{ id: string }>("/public/ideas", values),
};
