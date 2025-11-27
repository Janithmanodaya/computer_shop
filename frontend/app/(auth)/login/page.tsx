"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:4000/api/v1/auth/login", {
        email,
        password
      });

      const token = res.data?.data?.accessToken;
      if (token) {
        localStorage.setItem("wdc_access_token", token);
      }

      router.push("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-slate-300">Email</label>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-slate-400"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-300">Password</label>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-slate-400"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}