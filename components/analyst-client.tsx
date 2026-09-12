"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseClient } from "@/lib/firebase/client";
import type { AiExplanation } from "@/lib/domain/types";

export function AnalystClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AiExplanation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const firebase = getFirebaseClient();

  useEffect(() => firebase ? onAuthStateChanged(firebase.auth, (nextUser) => {
    if (nextUser && !nextUser.emailVerified) {
      router.replace("/verify-email");
      return;
    }
    setUser(nextUser);
  }) : undefined, [firebase, router]);

  async function ask() {
    if (!user) return;
    setLoading(true); setError("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/me/ai/analyst", { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ question: question || undefined, contextScope: "dashboard" }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "Analisis belum tersedia.");
      setAnswer(payload.data);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Analisis belum tersedia."); }
    finally { setLoading(false); }
  }

  if (!firebase || !user) return <main className="dashboard-page"><div className="container"><div className="panel empty-state"><div><span className="eyebrow">ANALIS KEAMANAN AI</span><h1>Masuk untuk melanjutkan.</h1><p className="muted">Analisis personal membutuhkan security state milik akunmu.</p><Link className="button button-primary" href="/login">Masuk →</Link></div></div></div></main>;
  return <main className="dashboard-page"><div className="container"><div className="panel"><span className="eyebrow">ANALIS KEAMANAN AI</span><h1>PAHAMI RISIKOMU.</h1><p className="muted">Ajukan pertanyaan berdasarkan hasil pemeriksaan yang tersimpan. AI tidak meminta password dan tidak dapat mengubah akunmu.</p><div className="form-row"><input className="input" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Kenapa risikoku tinggi?" maxLength={500} /><button className="button button-primary" onClick={ask} disabled={loading}>{loading ? "Menganalisis…" : "Tanya →"}</button></div>{error && <p className="error-text" role="alert">{error}</p>}{answer && <div className="grid-2" style={{ marginTop: 22 }}><section className="card"><span className="eyebrow">RINGKASAN</span><p style={{ marginTop: 14 }}>{answer.summary}</p><p className="small dim" style={{ marginTop: 16 }}>{answer.source === "vertex_ai" ? "Dijelaskan oleh Vertex AI berdasarkan security state." : "Dijelaskan oleh fallback berbasis aturan karena Vertex AI belum tersedia."}</p></section><section className="card"><span className="eyebrow">TINDAKAN</span><ul className="info-list" style={{ marginTop: 14 }}>{answer.actions.map((action) => <li key={action}>{action}</li>)}</ul></section></div>}</div></div></main>;
}
