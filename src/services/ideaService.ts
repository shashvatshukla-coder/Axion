import { ideas as seed } from '@/data/ideas';
import { mockRequest } from '@/lib/api';
import type { FormValues, Idea, StageKey, ValidationStatus } from '@/types';

// In-memory store standing in for a database. Replace with `http<Idea[]>('/ideas')` etc.
let store: Idea[] = seed.map((i) => ({ ...i }));

export const ideaService = {
  list(): Promise<Idea[]> {
    return mockRequest(store);
  },

  async setValidation(id: string, validation: ValidationStatus): Promise<Idea> {
    store = store.map((i) => (i.id === id ? { ...i, validation } : i));
    return mockRequest(store.find((i) => i.id === id) as Idea, 250);
  },

  async moveStage(id: string, stage: StageKey): Promise<Idea> {
    store = store.map((i) => (i.id === id ? { ...i, stage } : i));
    return mockRequest(store.find((i) => i.id === id) as Idea, 250);
  },

  async assign(id: string, member: string): Promise<Idea> {
    store = store.map((i) => (i.id === id && !i.team.includes(member) ? { ...i, team: [...i.team, member] } : i));
    return mockRequest(store.find((i) => i.id === id) as Idea, 250);
  },

  /** Public "Submit an idea" form. */
  async submit(values: FormValues): Promise<{ id: string }> {
    const next = 213 + (store.length - seed.length);
    const idea: Idea = {
      id: `IDEA-${next}`,
      title: values.title || 'Untitled idea',
      submittedBy: values.name || 'Anonymous',
      problem: values.problem || '',
      category: values.category || 'Other',
      validation: 'Pending',
      stage: 'problem',
      team: [],
      date: new Date().toISOString().slice(0, 10),
    };
    store = [idea, ...store];
    return mockRequest({ id: idea.id }, 900);
  },
};
