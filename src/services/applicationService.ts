import { http } from "@/lib/api";
import type { ClubApplication } from "@/types";

export const applicationService = {
  list: () => http<ClubApplication[]>("/applications"),
  get: (id: string) => http<ClubApplication>(`/applications/${encodeURIComponent(id)}`),
};
