"use client";

import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not sign in.");
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setLoading(false);
    }
  }

  return (
    <form className="admin-login-card" onSubmit={submit}>
      <div className="admin-login-mark">RM</div>
      <div>
        <p className="admin-eyebrow">Private workspace</p>
        <h1>Portfolio dashboard</h1>
        <p>Manage projects, creators, clients and feedback without editing code.</p>
      </div>
      <label className="admin-field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Enter dashboard password"
          required
        />
      </label>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <button className="admin-primary-button" type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Open dashboard"}
        <span aria-hidden="true">→</span>
      </button>
      <small>Only you can access this area after the Netlify environment variables are configured.</small>
    </form>
  );
}
