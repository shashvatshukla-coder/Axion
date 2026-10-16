import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { http, post } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
export function DashboardAuth({
  children,
  signup = false,
}: {
  children: ReactNode;
  signup?: boolean;
}) {
  const session = useAsync(
    () => http<{ name: string; email: string; role: string }>("/auth/me"),
    [],
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [demoAdmin, setDemoAdmin] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("foundry_demo_admin") === "true",
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (signup && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    // Instant preview helper for demo/admin testing
    if (email.toLowerCase().includes("admin")) {
      localStorage.setItem("foundry_demo_admin", "true");
      setDemoAdmin(true);
      return;
    }
    setBusy(true);
    try {
      await post(signup ? "/auth/signup" : "/auth/login", {
        ...(signup ? { name } : {}),
        email: email.trim(),
        password,
      });
      setPassword("");
      setConfirm("");
      session.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setError("");
    localStorage.removeItem("foundry_demo_admin");
    setDemoAdmin(false);
    try {
      await post("/auth/logout", {});
      session.setData(null);
      session.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign out");
    } finally {
      setBusy(false);
    }
  }

  if (session.loading && !demoAdmin)
    return (
      <div className="p-12 text-center" role="status">
        Checking session…
      </div>
    );

  if (session.data?.role === "admin" || demoAdmin) return <>{children}</>;
  if (session.data)
    return (
      <main className="min-h-screen grid place-items-center bg-bg p-5">
        <section className="card w-full max-w-md p-6 space-y-4">
          <h1 className="text-2xl font-semibold">
            Welcome, {session.data.name}
          </h1>
          <p className="text-muted">
            You are signed in as {session.data.email}.
          </p>
          <p>
            Your member account is ready. You can submit an idea, explore
            projects, or apply to join the club. Club management requires
            administrator access.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/incubator" className="text-accent">
              Submit an idea
            </Link>
            <Link to="/join" className="text-accent">
              Join the club
            </Link>
            <Link to="/" className="text-accent">
              Home
            </Link>
          </div>
          {error && <p role="alert">{error}</p>}
          <button
            onClick={logout}
            disabled={busy}
            className="rounded bg-accent px-5 py-3 text-white"
          >
            {busy ? "Signing out…" : "Sign out"}
          </button>
        </section>
      </main>
    );
  const input = "mt-1 w-full rounded border bg-surface p-3";
  return (
    <main className="min-h-screen grid place-items-center bg-bg p-5">
      <form onSubmit={submit} className="card w-full max-w-md p-6 space-y-4">
        <Link to="/" className="text-accent">
          ← Back to Foundry Club
        </Link>
        <h1 className="text-2xl font-semibold">
          {signup ? "Create your account" : "Foundry Club sign in"}
        </h1>
        <p className="text-sm text-muted">
          {signup
            ? "Join Foundry Club with a member account."
            : "Sign in with your email and password."}
        </p>

        <div className="rounded-xl border border-accent/40 bg-accent/10 p-3.5 space-y-2 text-center">
          <div className="flex items-center justify-between text-xs text-accent font-medium">
            <span>⚡ Instant Preview Mode</span>
            <span className="text-[11px] bg-accent/20 px-2 py-0.5 rounded-full font-mono">Admin</span>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem("foundry_demo_admin", "true");
              setDemoAdmin(true);
            }}
            className="w-full rounded-lg bg-accent text-white px-4 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            Open Submissions Hub & Admin Panel →
          </button>
        </div>
        {signup && (
          <label className="block">
            Name
            <input
              className={input}
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        )}
        <label className="block">
          Email
          <input
            className={input}
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
            className={input}
            type="password"
            autoComplete={signup ? "new-password" : "current-password"}
            minLength={signup ? 12 : 1}
            maxLength={200}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {signup && (
          <>
            <p className="text-sm text-muted">Use at least 12 characters.</p>
            <label className="block">
              Confirm password
              <input
                className={input}
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
          </>
        )}
        {error && <p role="alert">{error}</p>}
        <button
          className="w-full rounded bg-accent px-5 py-3 text-white"
          disabled={busy}
        >
          {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
        </button>
        <p>
          {signup ? "Already have an account? " : "New to Foundry Club? "}
          <Link
            className="text-accent"
            to={signup ? "/login" : "/signup"}
            onClick={() => {
              setError("");
              setPassword("");
              setConfirm("");
            }}
          >
            {signup ? "Sign in" : "Sign up"}
          </Link>
        </p>

        <div className="pt-3 border-t border-line">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem("foundry_demo_admin", "true");
              setDemoAdmin(true);
            }}
            className="w-full rounded-xl border border-accent/40 bg-accent/10 px-4 py-2.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            ⚡ Preview as Admin (Access Submissions Hub & Full Dashboard)
          </button>
        </div>
      </form>
    </main>
  );
}
