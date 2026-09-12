"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { SafeScanResult } from "@/lib/domain/types";
import { riskLabel } from "@/lib/domain/risk";
import { RiskBadge } from "@/components/risk-badge";
import { Footer } from "@/components/footer";
import { SecurityAdvisor } from "@/components/security-advisor";

export function ResultView() {
  const raw = useSyncExternalStore(
    (callback) => { window.addEventListener("storage", callback); return () => window.removeEventListener("storage", callback); },
    () => window.sessionStorage.getItem("trace:last-scan"),
    () => null,
  );
  const result = raw ? JSON.parse(raw) as SafeScanResult : null;
  if (!result) return <main className="scanner-page"><div className="container"><div className="panel empty-state"><div><span className="eyebrow">HASIL BELUM TERSEDIA</span><h1>Mulai pemeriksaan terlebih dahulu.</h1><Link className="button button-primary" href="/scan/email">Cek Email</Link></div></div></div></main>;

  return <>
    <main className="scanner-page"><div className="container">
      {result.isDemoData && <div className="demo-banner">DATA DEMO - Simulasi exposure untuk demonstrasi. Hasil ini bukan pemeriksaan breach nyata.</div>}
      <div className="result-header"><div><span className="eyebrow">{result.status === "exposure_found" ? "PERINGATAN" : "TIDAK DITEMUKAN"}</span><h1>{result.status === "exposure_found" ? "DATA TERDETEKSI" : "BELUM ADA EXPOSURE"}</h1><p className="muted">{result.exposureCount} exposure ditemukan pada sumber yang diperiksa.</p></div><div className="score-box"><div className="score">{result.score}</div><div className="score-label">/ 100 - RISIKO {riskLabel(result.level).toUpperCase()}</div></div></div>
      <p className="small dim source-attribution">Sumber data: {result.providerName}{result.providerName === "Have I Been Pwned" && <> | <a href="https://haveibeenpwned.com/" target="_blank" rel="noreferrer">Pelajari sumber breach</a></>}</p>
      <div className="result-grid">
        <section className="panel"><span className="eyebrow">APA YANG TERDETEKSI</span><h2>Ringkasan exposure</h2>{result.exposures.length === 0 ? <p className="muted">Tidak ada exposure yang cocok pada sumber data yang diperiksa.</p> : <div>{result.exposures.map((exposure) => <div className="exposure-row" key={exposure.id}><strong>{exposure.serviceName}</strong><span>{exposure.year ?? "-"}</span><span>{exposure.dataTypes.join(", ")}</span><RiskBadge level={exposure.severity === "critical" ? "critical" : exposure.severity === "high" ? "high" : exposure.severity === "medium" ? "moderate" : "low"} /></div>)}</div>}</section>
        <section className="panel"><span className="eyebrow">KENAPA</span><h2>Faktor risiko</h2>{result.factors.map((factor) => <div className="factor" key={factor.key}><span>{factor.label}</span><strong>+{factor.contribution}</strong><small className="dim" style={{ gridColumn: "1 / -1" }}>{factor.explanation}</small></div>)}</section>
      </div>
      <div className="result-grid">
        <section className="panel"><span className="eyebrow">ANALISIS KEAMANAN AI</span><h2>{result.aiExplanation?.source === "vertex_ai" ? "Penjelasan personal" : "Penjelasan berbasis aturan"}</h2><p className="muted">{result.aiExplanation?.summary}</p><ul className="info-list" style={{ marginTop: 18 }}>{(result.aiExplanation?.actions ?? []).map((action) => <li key={action}>{action}</li>)}</ul><p className="small dim" style={{ marginTop: 18 }}>AI tidak menjadi sumber fakta breach. Hasil mengikuti data yang tersedia dan memiliki keterbatasan.</p></section>
        <section className="panel"><span className="eyebrow">TINDAKAN</span><h2>Prioritas perlindungan</h2>{result.recommendations.slice(0, 4).map((item) => <div className="recommendation" key={item.id}><h3>{item.title}</h3><p>{item.description}</p></div>)}<Link className="button button-primary" href="/register" style={{ marginTop: 20 }}>Simpan dan Pantau</Link></section>
      </div>
      <SecurityAdvisor result={result} />
      <p className="small dim" style={{ marginTop: 18 }}>{result.limitations.join(" ")}</p>
    </div></main><Footer />
  </>;
}
