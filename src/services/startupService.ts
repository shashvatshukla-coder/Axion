import { startups } from '@/data/startups';
import { mockRequest } from '@/lib/api';
import type { Startup } from '@/types';

export const startupService = {
  list(): Promise<Startup[]> {
    return mockRequest(startups);
  },
};
