import { LockKeyhole } from "lucide-react";
import { PasswordCheckForm } from "@/components/password-check-form";
import { Footer } from "@/components/footer";

export default function PasswordScanPage() {
  return <><main className="scanner-page"><div className="container scanner-layout"><section className="panel"><span className="eyebrow">PEMERIKSAAN PASSWORD</span><h1>CEK PASSWORD.</h1><p className="hero-copy">Periksa apakah password pernah muncul pada sumber password yang bocor tanpa mengirim password mentah ke TRACE.</p><PasswordCheckForm /></section><aside className="panel"><LockKeyhole color="var(--acid)" size={34} /><h2 style={{ fontSize: 28 }}>K-anonymity</h2><p className="muted">Browser membuat jejak SHA-1, lalu hanya mengirim sebagian prefix untuk lookup. TRACE tidak menyimpan password, tidak mengirimnya ke Vertex AI, dan tidak menulisnya ke riwayat.</p><div className="demo-banner" style={{ marginTop: 20 }}>HASIL “TIDAK DITEMUKAN” BUKAN JAMINAN PASSWORD AMAN.</div></aside></div></main><Footer /></>;
}
