"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase/client";

async function syncProfile(token: string, email: string) {
  const response = await fetch("/api/me/profile", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ email }) });
  if (!response.ok) throw new Error("PROFILE_SYNC_FAILED");
}

async function syncPendingScan(token: string) {
  const email = window.sessionStorage.getItem("trace:last-scan-email");
  if (!email) return;
  const response = await fetch("/api/scans/email", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ email }) });
  if (response.ok) {
    window.sessionStorage.removeItem("trace:last-scan-email");
    window.sessionStorage.removeItem("trace:last-scan");
  }
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice(""); setLoading(true);
    const firebase = getFirebaseClient();
    if (!firebase) { setError("Firebase belum dikonfigurasi. Isi environment Firebase sebelum memakai akun."); setLoading(false); return; }
    try {
      const credential = isRegister ? await createUserWithEmailAndPassword(firebase.auth, email, password) : await signInWithEmailAndPassword(firebase.auth, email, password);
      const token = await credential.user.getIdToken();
      await syncProfile(token, credential.user.email ?? email);
      await syncPendingScan(token);
      if (isRegister) {
        await sendEmailVerification(credential.user);
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (caught) {
      setError(caught instanceof Error && caught.message === "PROFILE_SYNC_FAILED" ? "Akun berhasil dibuat, tetapi workspace belum dapat disiapkan." : "Email atau password tidak sesuai.");
    } finally { setLoading(false); }
  }

  async function resetPassword() {
    setError(""); setNotice("");
    const firebase = getFirebaseClient();
    if (!firebase) { setError("Firebase belum dikonfigurasi."); return; }
    if (!email) { setError("Masukkan email terlebih dahulu untuk menerima link reset password."); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(firebase.auth, email);
      setNotice("Link reset password sudah dikirim jika email tersebut terdaftar.");
    } catch {
      setNotice("Jika email tersebut terdaftar, link reset password akan dikirim.");
    } finally { setLoading(false); }
  }

  return (
    <div className="panel auth-card">
      <span className="eyebrow">TRACE // WORKSPACE PERSONAL</span>
      <h1>{isRegister ? "BUAT AKUN" : "MASUK"}</h1>
      <p className="muted">{isRegister ? "Simpan hasil pemeriksaan dan kelola tindakan keamananmu." : "Lanjutkan ke dasbor keamanan digitalmu."}</p>
      <form onSubmit={submit}>
        <div className="field"><label htmlFor="email">Email</label><input id="email" className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={isRegister ? "new-password" : "current-password"} /></div>
        {error && <p className="error-text" role="alert">{error}</p>}
        {notice && <p className="success-text" role="status">{notice}</p>}
        <button className="button button-primary" type="submit" disabled={loading}>{loading ? "Memproses…" : isRegister ? "Daftar →" : "Masuk →"}</button>
        {!isRegister && <button className="button button-secondary" type="button" onClick={resetPassword} disabled={loading}>Lupa password?</button>}
      </form>
      <p className="small muted">{isRegister ? "Sudah punya akun? " : "Belum punya akun? "}<Link href={isRegister ? "/login" : "/register"} style={{ color: "var(--acid)" }}>{isRegister ? "Masuk" : "Daftar"}</Link></p>
    </div>
  );
}
