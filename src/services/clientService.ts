import { clients } from '@/data/clients';
import { deliveries, leads as seedLeads } from '@/data/operations';
import { mockRequest } from '@/lib/api';
import type { Client, Delivery, FormValues, Lead, LeadStage } from '@/types';

let leadStore: Lead[] = seedLeads.map((l) => ({ ...l }));

export const clientService = {
  clients(): Promise<Client[]> {
    return mockRequest(clients);
  },

  deliveries(): Promise<Delivery[]> {
    return mockRequest(deliveries);
  },

  leads(): Promise<Lead[]> {
    return mockRequest(leadStore);
  },

  async moveLead(id: string, stage: LeadStage): Promise<Lead> {
    leadStore = leadStore.map((l) => (l.id === id ? { ...l, stage } : l));
    return mockRequest(leadStore.find((l) => l.id === id) as Lead, 200);
  },

  /** "Request a project" form on the Agency page. */
  async submitRequest(values: FormValues): Promise<{ reference: string }> {
    const lead: Lead = {
      id: `ld-${Date.now()}`,
      contact: values.name || 'Unknown',
      organization: values.organization || 'Unknown',
      type: values.projectType || 'Other',
      value: 0,
      stage: 'New Lead',
      owner: 'Unassigned',
      date: new Date().toISOString().slice(0, 10),
    };
    leadStore = [lead, ...leadStore];
    return mockRequest({ reference: `REQ-${Math.floor(1000 + Math.random() * 9000)}` }, 900);
  },

  async sendMessage(values: FormValues): Promise<{ ok: true }> {
    void values;
    return mockRequest({ ok: true as const }, 700);
  },
};
