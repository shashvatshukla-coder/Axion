import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { http, post } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
export function DashboardAuth({ children }: { children: ReactNode }) {
  const session = useAsync(
    () => http<{ name: string; role: string }>("/auth/me"),
    [],
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function login(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await post("/auth/login", { email, password });
      setPassword("");
      session.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }
  if (session.loading)
    return (
      <div className="p-12 text-center" role="status">
        Checking session…
      </div>
    );
  if (session.data?.role === "admin") return <>{children}</>;
  return (
    <main className="min-h-screen grid place-items-center bg-bg p-5">
      <form onSubmit={login} className="card w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Foundry Club sign in</h1>
        <p className="text-sm text-muted">
          Sign in with your club administrator account.
        </p>
        <label className="block">
          Email
          <input
            className="mt-1 w-full rounded border bg-surface p-3"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          Password
          <input
            className="mt-1 w-full rounded border bg-surface p-3"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {(error || session.data) && (
          <p role="alert">{error || "Administrator access required."}</p>
        )}
        <button
          className="rounded bg-accent px-5 py-3 text-white"
          disabled={busy}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
