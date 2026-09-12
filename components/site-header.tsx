import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/" aria-label="TRACE beranda">
          <Image className="brand-logo" src="/logo.png" alt="" width={40} height={40} priority />
          <span>TR<span className="brand-mark">A</span>CE.</span>
        </Link>
        <nav className="nav-links" aria-label="Navigasi utama">
          <Link href="/">Beranda</Link>
          <Link href="/#fitur">Fitur</Link>
          <Link href="/#cara-kerja">Cara Kerja</Link>
          <Link href="/scan/email">Cek Email</Link>
          <Link href="/scan/password">Cek Password</Link>
        </nav>
        <div className="nav-actions">
          <Link className="button button-secondary" href="/login">Masuk</Link>
          <Link className="button button-primary" href="/register">Daftar</Link>
        </div>
      </div>
    </header>
  );
}
