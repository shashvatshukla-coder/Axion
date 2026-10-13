export const API_BASE: string = import.meta.env.VITE_API_URL ?? "/api";
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body) headers.set("Content-Type", "application/json");
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  const body = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      body?.error || `Request failed (${res.status})`,
      res.status,
    );
  return body as T;
}
export const post = <T>(path: string, body: unknown) =>
  http<T>(path, { method: "POST", body: JSON.stringify(body) });
export const patch = <T>(path: string, body: unknown) =>
  http<T>(path, { method: "PATCH", body: JSON.stringify(body) });
