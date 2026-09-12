"use client";

import { FormEvent, useState } from "react";

async function sha1(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-1", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function PasswordCheckForm() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<{ status: string; recommendation: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setResult(null); setLoading(true);
    try {
      const hash = await sha1(password);
      const response = await fetch("/api/scans/password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prefix: hash.slice(0, 5), suffix: hash.slice(5) }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "Pemeriksaan gagal.");
      setResult(payload.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Pemeriksaan gagal. Coba lagi.");
    } finally {
      setPassword(""); setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="form-row">
        <input className={`input ${error ? "input-error" : ""}`} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password untuk diperiksa" aria-label="Password yang ingin diperiksa" minLength={1} required />
        <button className="button button-primary" type="submit" disabled={loading || !password}>{loading ? "Memeriksa…" : "Cek Password →"}</button>
      </div>
      <p className="privacy-note"><strong>PRIVASI</strong> Password diproses dengan k-anonymity. Password mentah tidak disimpan atau dikirim ke TRACE.</p>
      {error && <p className="error-text" role="alert">{error}</p>}
      {result && <div className={`recommendation ${result.status === "exposed_signal" ? "" : ""}`} role="status"><h3>{result.status === "exposed_signal" ? "PASSWORD TERDETEKSI" : result.status === "unavailable" ? "SUMBER TIDAK TERSEDIA" : "TIDAK DITEMUKAN"}</h3><p>{result.recommendation}</p></div>}
    </form>
  );
}
