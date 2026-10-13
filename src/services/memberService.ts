import { members } from '@/data/members';
import { mockRequest } from '@/lib/api';
import type { FormValues, Member } from '@/types';

export const memberService = {
  list(): Promise<Member[]> {
    return mockRequest(members);
  },

  /** Membership applications from the public Join page. */
  async apply(kind: string, values: FormValues): Promise<{ reference: string }> {
    void kind;
    void values;
    return mockRequest({ reference: `APP-${Math.floor(1000 + Math.random() * 9000)}` }, 800);
  },
};
