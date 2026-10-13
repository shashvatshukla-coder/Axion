import { http, patch } from "@/lib/api";
import type { AppNotification, Collaboration, Task, TaskStatus } from "@/types";
export const operationsService = {
  tasks: () => http<Task[]>("/tasks"),
  moveTask: (id: string, status: TaskStatus) =>
    patch<Task>(`/tasks/${encodeURIComponent(id)}`, { status }),
  collaborations: () => http<Collaboration[]>("/public/collaborations"),
  notifications: () => http<AppNotification[]>("/notifications"),
};
