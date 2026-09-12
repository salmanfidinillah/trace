"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseClient } from "@/lib/firebase/client";

type DashboardData = {
  user: { email?: string };
  score: number | null;
  level: "low" | "moderate" | "elevated" | "high" | "critical" | null;
  scans: Array<{ id: string; score?: number; exposureCount?: number; createdAt?: string | null }>;
  recommendations: Array<{ id: string; title?: string; description?: string }>;
  alerts: Array<{ id: string; title?: string; message?: string }>;
  checklist: Array<{ id: string; title?: string; status?: string }>;
};

export function DashboardClient() {
  const router = useRouter();
  const firebase = useMemo(() => getFirebaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(firebase));

  useEffect(() => {
    if (!firebase) return;
    return onAuthStateChanged(firebase.auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) { setLoading(false); return; }
      if (!nextUser.emailVerified) { setLoading(false); router.replace("/verify-email"); return; }
      try {
        const response = await fetch("/api/me/dashboard", { headers: { authorization: `Bearer ${await nextUser.getIdToken()}` } });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error?.message ?? "Dasbor tidak dapat dimuat.");
        setData(payload.data);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Dasbor tidak dapat dimuat.");
      } finally { setLoading(false); }
    });
  }, [firebase, router]);

  async function toggleChecklist(id: string, done: boolean) {
    if (!user) return;
    const response = await fetch(`/api/me/checklist/${id}`, { method: "PATCH", headers: { authorization: `Bearer ${await user.getIdToken()}`, "content-type": "application/json" }, body: JSON.stringify({ status: done ? "todo" : "done" }) });
    if (!response.ok) return;
    setData((current) => current ? { ...current, checklist: current.checklist.map((item) => item.id === id ? { ...item, status: done ? "todo" : "done" } : item) } : current);
  }

  if (!firebase) return <EmptyDashboard title="Firebase belum dikonfigurasi." text="Tambahkan konfigurasi Firebase pada environment untuk mengaktifkan workspace personal." />;
  if (loading) return <main className="dashboard-page"><div className="container"><div className="panel loading-state"><span className="pulse" /> Memuat dasbor…</div></div></main>;
  if (!user) return <EmptyDashboard title="Masuk untuk membuka dasbor." text="Hasil publik tetap dapat digunakan tanpa login. Buat akun untuk menyimpan riwayat dan checklist." />;
  if (error) return <EmptyDashboard title="Dasbor belum tersedia." text={error} />;

  const completed = data?.checklist.filter((item) => item.status === "done").length ?? 0;
  return <main className="dashboard-page"><div className="container dashboard-layout">
    <aside className="sidebar">
      <Link className="active" href="/dashboard">Dasbor</Link>
      <Link href="/scan/email">Cek Email</Link>
      <Link href="/scan/password">Cek Password</Link>
      <Link href="/dashboard/timeline">Linimasa</Link>
      <Link href="/dashboard/analyst">Analis AI</Link>
      <Link href="#rekomendasi">Rekomendasi</Link>
      <Link href="#checklist">Checklist</Link>
      <button className="button button-secondary" onClick={() => signOut(firebase.auth)}>Keluar</button>
    </aside>
    <section className="dashboard-main">
      <span className="eyebrow">WORKSPACE PERSONAL</span>
      <h1>Halo, {data?.user.email?.split("@")[0] ?? "pengguna"}.</h1>
      <p className="muted">Berikut ringkasan keamanan digitalmu.</p>
      <div className="metrics"><Metric label="Exposure" value={String(data?.scans.reduce((sum, item) => sum + Number(item.exposureCount ?? 0), 0) ?? 0)} /><Metric label="Aksi tertunda" value={String(data?.recommendations.length ?? 0)} /><Metric label="Alert aktif" value={String(data?.alerts.length ?? 0)} /></div>
      <div className="grid-2">
        <section className="panel"><span className="eyebrow">SKOR KEAMANAN PERSONAL</span><div className="score" style={{ color: data?.level === "critical" || data?.level === "high" ? "var(--danger)" : "var(--acid)", marginTop: 18 }}>{data?.score ?? "—"}</div><p className="muted">{data?.score === null ? "Belum cukup data untuk menghitung skor personal." : "Skor berasal dari pemeriksaan terakhir dan data keamanan yang tersedia."}</p></section>
        <section className="panel"><span className="eyebrow">PEMERIKSAAN TERBARU</span>{data?.scans.length ? data.scans.slice(0, 4).map((scan) => <div className="factor" key={scan.id}><span>{scan.exposureCount ?? 0} exposure · {scan.createdAt ? new Date(scan.createdAt).toLocaleDateString("id-ID") : "—"}</span><strong>{scan.score ?? 0}</strong></div>) : <p className="muted">Belum ada pemeriksaan.</p>}</section>
      </div>
      <section className="panel" id="rekomendasi" style={{ marginTop: 14 }}><span className="eyebrow">TINDAKAN PRIORITAS</span>{data?.recommendations.length ? data.recommendations.map((item) => <div className="recommendation" key={item.id}><h3>{item.title}</h3><p>{item.description}</p></div>) : <p className="muted">Tidak ada tindakan prioritas saat ini.</p>}</section>
      <section className="panel" id="checklist" style={{ marginTop: 14 }}><span className="eyebrow">CHECKLIST KEAMANAN · {completed}/{data?.checklist.length ?? 0} SELESAI</span>{data?.checklist.map((item) => <label className="factor" key={item.id} style={{ cursor: "pointer" }}><span><input type="checkbox" checked={item.status === "done"} onChange={() => toggleChecklist(item.id, item.status === "done")} /> {item.title}</span><small className="dim">{item.status === "done" ? "Selesai" : "Belum dilakukan"}</small></label>)}</section>
    </section>
  </div></main>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="card"><span className="label muted">{label}</span><strong className="metric-value">{value}</strong></div>; }
function EmptyDashboard({ title, text }: { title: string; text: string }) { return <main className="dashboard-page"><div className="container"><div className="panel empty-state"><div><span className="eyebrow">WORKSPACE PERSONAL</span><h1>{title}</h1><p className="muted">{text}</p><Link className="button button-primary" href="/login">Masuk →</Link></div></div></div></main>; }
