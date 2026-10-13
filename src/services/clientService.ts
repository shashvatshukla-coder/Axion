import { http, patch, post } from "@/lib/api";
import type { Client, Delivery, FormValues, Lead, LeadStage } from "@/types";
export const clientService = {
  clients: () => http<Client[]>("/clients"),
  deliveries: () => http<Delivery[]>("/deliveries"),
  leads: () => http<Lead[]>("/leads"),
  moveLead: (id: string, stage: LeadStage) =>
    patch<Lead>(`/leads/${encodeURIComponent(id)}`, { stage }),
  submitRequest: (values: FormValues) =>
    post<{ reference: string }>("/public/requests", values),
  sendMessage: (values: FormValues) =>
    post<{ ok: true }>("/public/messages", values),
};
