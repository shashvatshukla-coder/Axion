import { http, post } from "@/lib/api";
import type { FormValues, Member } from "@/types";
export const memberService = {
  list: () => http<Member[]>("/public/members"),
  apply: (kind: string, values: FormValues) =>
    post<{ reference: string }>("/public/applications", { kind, values }),
};
