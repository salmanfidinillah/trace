"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function EmailScanForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/scans/email", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "Pemeriksaan gagal.");
      sessionStorage.setItem("trace:last-scan", JSON.stringify(payload.data));
      router.push("/scan/email/hasil");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Pemeriksaan gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="form-row">
        <input className={`input ${error ? "input-error" : ""}`} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@contoh.com" aria-label="Alamat email" required maxLength={254} />
        <button className="button button-primary" type="submit" disabled={loading}>{loading ? "Memeriksa…" : compact ? "Cek →" : "Cek Sekarang →"}</button>
      </div>
      {loading && <p className="loading-state" aria-live="polite"><span className="pulse" /> Memvalidasi, menganalisis, dan menghitung risiko…</p>}
      {error && <p className="error-text" role="alert">{error}</p>}
      <p className="privacy-note"><strong>PRIVASI</strong> Email dipakai untuk pemeriksaan. Jangan masukkan password.</p>
    </form>
  );
}
