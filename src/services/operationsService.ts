import { collaborations, notifications, tasks as seedTasks } from '@/data/operations';
import { mockRequest } from '@/lib/api';
import type { AppNotification, Collaboration, Task, TaskStatus } from '@/types';

let taskStore: Task[] = seedTasks.map((t) => ({ ...t }));

export const operationsService = {
  tasks(): Promise<Task[]> {
    return mockRequest(taskStore);
  },

  async moveTask(id: string, status: TaskStatus): Promise<Task> {
    taskStore = taskStore.map((t) => (t.id === id ? { ...t, status } : t));
    return mockRequest(taskStore.find((t) => t.id === id) as Task, 200);
  },

  collaborations(): Promise<Collaboration[]> {
    return mockRequest(collaborations);
  },

  notifications(): Promise<AppNotification[]> {
    return mockRequest(notifications, 300);
  },
};
