import Link from "next/link";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link className="footer-logo" href="/">TRACE<span>.</span></Link>
          <p>Cari tahu apakah email kamu pernah muncul dalam kebocoran data.</p>
          <Link className="footer-cta" href="/scan/email">Cek email kamu <ArrowUpRight size={16} /></Link>
        </div>
        <div className="footer-column">
          <h3>Layanan</h3>
          <Link href="/scan/email">Cek Email</Link>
          <Link href="/scan/password">Cek Password</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <div className="footer-column">
          <h3>Informasi</h3>
          <Link href="/#fitur">Fitur</Link>
          <Link href="/#cara-kerja">Cara Kerja</Link>
          <Link href="/">Tentang TRACE</Link>
        </div>
        <div className="footer-column footer-connect">
          <h3>Terhubung</h3>
          <p>Ikuti perkembangan TRACE dan proyek open-source kami.</p>
          <div className="footer-socials">
            <a href="https://github.com/salmanfidinillah/trace" target="_blank" rel="noreferrer" aria-label="TRACE di GitHub"><Github size={22} /></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="TRACE di LinkedIn"><Linkedin size={22} /></a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 TRACE. Semua hak dilindungi.</span>
        <span>Hasil pemeriksaan bukan jaminan keamanan absolut.</span>
      </div>
    </footer>
  );
}
