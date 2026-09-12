"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, CircleAlert, ShieldCheck } from "lucide-react";
import type { SafeScanResult } from "@/lib/domain/types";
import { buildSecurityAdvisorModel } from "@/lib/domain/security-advisor";

export function SecurityAdvisor({ result }: { result: SafeScanResult }) {
  const model = useMemo(() => buildSecurityAdvisorModel(result), [result]);
  const [loading, setLoading] = useState(true);
  const [planOpen, setPlanOpen] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, [result]);

  function toggleAction(id: string) {
    setCompleted((current) => ({ ...current, [id]: !current[id] }));
  }

  if (loading) {
    return (
      <section className="advisor-shell" aria-live="polite">
        <div className="advisor-loading">
          <span className="pulse" />
          <div><span className="eyebrow">TRACE AI</span><h2>Menyusun security plan...</h2><p className="muted">Menerjemahkan hasil pemeriksaan menjadi langkah yang mudah dipahami.</p></div>
        </div>
      </section>
    );
  }

  const completedCount = model.actions.filter((action) => completed[action.id]).length;

  return (
    <section className="advisor-shell" id="trace-ai">
      <div className="advisor-heading">
        <div>
          <span className="eyebrow">TRACE AI</span>
          <h2>SECURITY ADVISOR</h2>
          <p className="advisor-subtitle">Personalized intelligence for a safer digital life.</p>
          <p className="muted">AI membantu menerjemahkan hasil pemeriksaan teknis menjadi rekomendasi keamanan yang mudah dipahami, tanpa meminta password atau menyimpan credential.</p>
        </div>
        <div className="advisor-icon" aria-hidden="true"><ShieldCheck size={30} /></div>
      </div>

      {model.isDemoData && <div className="advisor-notice"><CircleAlert size={16} /> Analisis ini memakai TRACE Demo Dataset untuk demonstrasi.</div>}
      {model.isFallback && <div className="advisor-notice advisor-notice-muted"><CircleAlert size={16} /> AI eksternal belum tersedia; rekomendasi aman berbasis risk engine TRACE tetap ditampilkan.</div>}

      <div className="advisor-overview">
        <div className={`advisor-risk advisor-risk-${model.riskBand}`}>
          <span className="eyebrow">RISK LEVEL</span>
          <strong>{model.riskLabel}</strong>
          <p>{model.aiSummary}</p>
        </div>
        <div className="advisor-score">
          <span className="eyebrow">RISK SCORE</span>
          <strong>{model.score}<small>/100</small></strong>
          <span className="advisor-score-caption">Semakin rendah, semakin baik.</span>
        </div>
        <div className="advisor-health">
          <div className="advisor-health-top"><span className="eyebrow">SECURITY HEALTH</span><strong>{model.healthScore}%</strong></div>
          <div className="advisor-progress" role="progressbar" aria-label="Security Health" aria-valuemin={0} aria-valuemax={100} aria-valuenow={model.healthScore}><span style={{ width: `${model.healthScore}%` }} /></div>
          <strong className="advisor-health-label">{model.healthLabel}</strong>
          <p>{model.healthDescription}</p>
        </div>
      </div>

      <div className="advisor-grid">
        <section className="advisor-card"><span className="eyebrow">01 / KONTEKS</span><h3>Apa yang terjadi?</h3><p>{model.whatHappened}</p></section>
        <section className="advisor-card"><span className="eyebrow">02 / EXPOSURE</span><h3>Apa risikonya?</h3><ul className="advisor-list">{model.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></section>
        <section className="advisor-card"><span className="eyebrow">03 / WHY THIS SCORE</span><h3>Mengapa skor ini?</h3><div className="advisor-reasons">{model.reasons.length === 0 ? <p className="muted">Belum ada faktor exposure yang menambah skor.</p> : model.reasons.map((reason) => <div key={reason.label}><span>{reason.label}</span><strong>+{reason.contribution}</strong><small>{reason.explanation}</small></div>)}</div></section>
        <section className="advisor-card"><span className="eyebrow">04 / NEXT MOVES</span><h3>Apa yang harus saya lakukan?</h3><div className="advisor-actions">{model.actions.slice(0, 4).map((action, index) => <div className="advisor-action" key={action.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{action.title}</strong><p>{action.description}</p></div></div>)}</div></section>
      </div>

      <div className="advisor-plan">
        <div className="advisor-plan-head"><div><span className="eyebrow">PERSONALIZED SECURITY PLAN</span><h3>Mulai dari langkah yang paling berdampak.</h3><p className="muted">Checklist ini disusun dari hasil pemeriksaanmu dan hanya tersimpan di perangkat ini selama demo.</p></div><button className="button button-primary" type="button" onClick={() => setPlanOpen((current) => !current)} aria-expanded={planOpen}>{planOpen ? "Tutup plan" : "Improve My Security"}<ChevronDown size={17} className={planOpen ? "advisor-chevron-open" : ""} /></button></div>
        {planOpen && <div className="advisor-plan-body"><div className="advisor-plan-progress"><strong>{completedCount}/{model.actions.length}</strong><span> langkah selesai</span></div>{model.actions.map((action, index) => <button className={`advisor-check ${completed[action.id] ? "is-done" : ""}`} type="button" key={action.id} onClick={() => toggleAction(action.id)} aria-pressed={Boolean(completed[action.id])}><span className="advisor-check-icon">{completed[action.id] ? <Check size={15} /> : index + 1}</span><span><strong>{action.title}</strong><small>{action.description}</small></span></button>)}</div>}
      </div>

      <div className="advisor-community"><div><span className="eyebrow">COMMUNITY IMPACT</span><h3>Safer individuals create safer communities.</h3></div><p>Dengan mengubah temuan teknis menjadi edukasi dan rekomendasi yang mudah dipahami, TRACE membantu membangun masyarakat digital yang lebih sadar dan tangguh terhadap ancaman siber.</p></div>
      <p className="small dim advisor-footnote">{model.limitations.join(" ")} Advisor bukan pengganti penyedia layanan, tim keamanan, atau keputusan pengguna.</p>
    </section>
  );
}
