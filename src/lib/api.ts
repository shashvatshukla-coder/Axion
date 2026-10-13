/**
 * Backend seam.
 *
 * Every service in src/services goes through this file. Today they call
 * `mockRequest`, which returns a copy of in-memory data after a short delay.
 * To connect a REST API, set VITE_API_URL and swap the `mockRequest` call in a
 * service for `http<T>('/ideas')` (or similar). Components never need to change.
 */

export const API_BASE: string = import.meta.env.VITE_API_URL ?? '';

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns a deep copy of `data` after `ms` milliseconds, like a network call would. */
export async function mockRequest<T>(data: T, ms = 450): Promise<T> {
  await delay(ms);
  return JSON.parse(JSON.stringify(data)) as T;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Minimal JSON fetch wrapper for when a real backend exists. */
export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw new ApiError(`Request failed (${res.status})`, res.status);
  }
  return (await res.json()) as T;
}
