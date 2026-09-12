import Link from "next/link";
import { EmailScanForm } from "@/components/email-scan-form";
import { Footer } from "@/components/footer";

export default function EmailScanPage() {
  return <><main className="scanner-page"><div className="container scanner-layout"><section className="panel"><span className="eyebrow">PEMERIKSAAN EMAIL</span><h1>CEK EMAIL KAMU.</h1><p className="hero-copy">Masukkan alamat email untuk mengetahui apakah pernah muncul pada kebocoran data yang tersedia.</p><EmailScanForm /><p className="small dim" style={{ marginTop: 22 }}>Tidak ditemukannya data bukan berarti akun pasti aman dan tidak mencakup seluruh internet.</p></section><aside className="panel"><span className="eyebrow">SEBELUM MULAI</span><h2 style={{ fontSize: 28 }}>Yang perlu kamu tahu</h2><ul className="info-list"><li>Jangan masukkan password atau kode verifikasi.</li><li>Hasil ditampilkan tanpa raw credential atau token.</li><li>Jika memakai data demo, label akan ditampilkan dengan jelas.</li><li>Login hanya diperlukan untuk menyimpan hasil dan mengelola tindakan.</li></ul><Link className="button button-secondary" href="/scan/password" style={{ marginTop: 22 }}>Cek Password →</Link></aside></div></main><Footer /></>;
}
