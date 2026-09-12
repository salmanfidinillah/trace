import Link from "next/link";
import { ShieldCheck, ScanLine, Sparkles, ListChecks, LockKeyhole } from "lucide-react";
import { EmailScanForm } from "@/components/email-scan-form";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return <div className="site-shell">
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="eyebrow">PEMERIKSAAN EMAIL</span>
            <h1>APAKAH EMAIL<br />KAMU<br /><span>PERNAH TERPAPAR?</span></h1>
            <p className="hero-copy">Cek apakah alamat email kamu pernah muncul dalam kebocoran data yang diketahui.</p>
            <EmailScanForm />
            <div className="hero-actions">
              <Link className="button button-secondary" href="/scan/password">Cek Password</Link>
              <Link className="button button-secondary" href="#cara-kerja">Pelajari Cara Kerja</Link>
            </div>
          </div>
        </div>
        <div className="container stats-row">
          <div className="stat"><strong>01</strong><span className="muted">Temukan paparan</span></div>
          <div className="stat"><strong>02</strong><span className="muted">Pahami risikonya</span></div>
          <div className="stat"><strong>03</strong><span className="muted">Lindungi akunmu</span></div>
        </div>
      </section>
      <section className="section" id="fitur"><div className="container"><div className="section-head"><div><span className="eyebrow">LEBIH DARI SEKADAR CEK EMAIL</span><h2>Informasi keamanan yang berubah menjadi tindakan.</h2></div><p className="section-intro">Hasil teknis tidak cukup. TRACE menerjemahkan data exposure menjadi alasan risiko, penjelasan yang mudah dipahami, dan langkah berikutnya.</p></div><div className="grid-3"><Feature icon={<ScanLine />} number="01" title="Pemeriksaan exposure" text="Periksa apakah email muncul pada sumber kebocoran data yang tersedia." /><Feature icon={<Sparkles />} number="02" title="Analisis AI" text="Dapatkan penjelasan Bahasa Indonesia berdasarkan data yang sudah diverifikasi." /><Feature icon={<ListChecks />} number="03" title="Checklist perlindungan" text="Ubah rekomendasi keamanan menjadi tindakan yang dapat diselesaikan." /></div></div></section>
      <section className="section" id="cara-kerja"><div className="container"><div className="section-head"><div><span className="eyebrow">CARA KERJA</span><h2>Temukan. Pahami. Lindungi.</h2></div></div><div className="grid-3"><Step number="01" title="Masukkan email" text="TRACE memvalidasi input dan menghubungkan pemeriksaan ke sumber data yang dikonfigurasi." /><Step number="02" title="Pahami risiko" text="Risk engine menghitung score yang dapat dijelaskan berdasarkan faktor exposure." /><Step number="03" title="Ambil tindakan" text="Rekomendasi dan checklist membantu kamu mengamankan akun secara bertahap." /></div></div></section>
      <section className="section"><div className="container grid-2"><div className="card"><LockKeyhole color="var(--acid)" /><h3>Privasi sejak awal</h3><p>TRACE tidak meminta password akunmu. Pemeriksaan password menggunakan proses k-anonymity dan tidak mengirim password mentah ke server atau AI.</p></div><div className="card"><ShieldCheck color="var(--acid)" /><h3>AI yang jujur</h3><p>AI hanya menjelaskan structured security data. Jika AI tidak tersedia, hasil scan tetap memakai risk engine dan rekomendasi berbasis aturan.</p></div></div></section>
    </main><Footer />
  </div>;
}

function Feature({ icon, number, title, text }: { icon: React.ReactNode; number: string; title: string; text: string }) { return <article className="card"><div style={{ color: "var(--acid)" }}>{icon}</div><span className="card-number">{number}</span><h3>{title}</h3><p>{text}</p></article>; }
function Step({ number, title, text }: { number: string; title: string; text: string }) { return <article className="card how-card"><span className="card-number">{number}</span><h3>{title}</h3><p>{text}</p></article>; }
