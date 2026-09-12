"use client";

import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirebaseClient } from "@/lib/firebase/client";

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const firebase = getFirebaseClient();
    return firebase ? onAuthStateChanged(firebase.auth, setUser) : undefined;
  }, []);

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/" aria-label="TRACE beranda">
          <Image className="brand-logo" src="/logo-revisi.png" alt="" width={40} height={40} priority />
          <span>TR<span className="brand-mark">A</span>CE.</span>
        </Link>
        <nav className="nav-links" aria-label="Navigasi utama">
          <Link href="/">Beranda</Link>
          <Link href="/#fitur">Fitur</Link>
          <Link href="/#cara-kerja">Cara Kerja</Link>
          <Link href="/tentang">Tentang</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/scan/email">Cek Email</Link>
          <Link href="/scan/password">Cek Password</Link>
        </nav>
        <div className="nav-actions">
          {user ? <><Link className="button button-secondary" href="/dashboard">Dashboard</Link><button className="button button-primary" type="button" onClick={() => { const firebase = getFirebaseClient(); if (firebase) void signOut(firebase.auth); }}>Keluar</button></> : <><Link className="button button-secondary" href="/login">Masuk</Link><Link className="button button-primary" href="/register">Daftar</Link></>}
        </div>
      </div>
    </header>
  );
}
