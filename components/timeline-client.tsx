"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase/client";

type TimelineItem = { id: string; createdAt?: string | null; exposureCount?: number; score?: number; exposureSummary?: Array<{ serviceName?: string; year?: number | null; dataTypes?: string[] }> };

export function TimelineClient() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<TimelineItem[]>([]);
  const firebase = getFirebaseClient();
  useEffect(() => firebase ? onAuthStateChanged(firebase.auth, async (nextUser) => { setUser(nextUser); if (nextUser) { const response = await fetch("/api/me/dashboard", { headers: { authorization: `Bearer ${await nextUser.getIdToken()}` } }); const payload = await response.json(); if (response.ok) setItems(payload.data.scans); } }) : undefined, [firebase]);
  if (!firebase || !user) return <main className="dashboard-page"><div className="container"><div className="panel empty-state"><div><span className="eyebrow">LINIMASA EXPOSURE</span><h1>Masuk untuk melihat linimasa.</h1><Link className="button button-primary" href="/login">Masuk →</Link></div></div></div></main>;
  return <main className="dashboard-page"><div className="container"><div className="panel"><span className="eyebrow">LINIMASA EXPOSURE</span><h1>PERJALANAN EXPOSURE.</h1><p className="muted">Riwayat ini berasal dari pemeriksaan yang kamu simpan di workspace personal.</p>{items.length === 0 ? <p className="muted">Belum ada pemeriksaan tersimpan.</p> : items.map((item) => <article className="recommendation" key={item.id}><h3>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : "Tanggal tidak tersedia"} · {item.exposureCount ?? 0} exposure · skor {item.score ?? 0}</h3>{item.exposureSummary?.map((exposure, index) => <p key={`${item.id}-${index}`}>{exposure.year ?? "Tahun tidak tersedia"} — {exposure.serviceName} — {exposure.dataTypes?.join(", ")}</p>)}</article>)}</div></div></main>;
}
