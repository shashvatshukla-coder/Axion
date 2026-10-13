import { http } from "@/lib/api";
import type { Startup } from "@/types";
export const startupService = {
  list: () => http<Startup[]>("/public/startups"),
};
