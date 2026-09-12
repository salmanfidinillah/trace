"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase/client";
import { sendTraceVerificationEmail } from "@/lib/firebase/verification";

async function syncProfile(token: string, email: string) {
  const response = await fetch("/api/me/profile", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ email }) });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error?.code ?? "PROFILE_SYNC_FAILED");
  }
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

function getAuthErrorMessage(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (code === "UNAUTHORIZED") return "Akun berhasil dibuat, tetapi sesi Firebase belum diterima server. Coba masuk ulang.";
  if (code === "FIREBASE_NOT_CONFIGURED") return "Akun berhasil dibuat, tetapi Firebase server belum dikonfigurasi.";
  if (code === "PROFILE_SYNC_FAILED") return "Akun berhasil dibuat, tetapi workspace belum dapat disiapkan.";
  if (code.includes("auth/operation-not-allowed")) return "Login Google belum diaktifkan di Firebase.";
  if (code.includes("auth/popup-closed-by-user")) return "Jendela Google ditutup sebelum proses selesai.";
  if (code.includes("auth/popup-blocked")) return "Popup Google diblokir browser. Izinkan popup lalu coba lagi.";
  if (code.includes("auth/account-exists-with-different-credential")) return "Email ini sudah terdaftar dengan metode login lain.";
  if (code.includes("auth/too-many-requests")) return "Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi.";
  if (code.includes("auth/unauthorized-continue-uri")) return "Domain verifikasi belum diizinkan di Firebase. Tambahkan www.tracee.web.id ke Authorized domains.";
  if (code.includes("auth/invalid-continue-uri")) return "URL verifikasi belum dikonfigurasi dengan benar.";
  if (code.includes("auth/invalid-credential") || code.includes("auth/invalid-login-credentials")) return "Email atau password tidak sesuai.";
  return "Email atau password tidak sesuai. Periksa kembali lalu coba lagi.";
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  async function finishAuthentication(token: string, userEmail: string) {
    await syncProfile(token, userEmail);
    await syncPendingScan(token);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice(""); setLoading(true);
    const firebase = getFirebaseClient();
    if (!firebase) { setError("Firebase belum dikonfigurasi. Isi environment Firebase sebelum memakai akun."); setLoading(false); return; }
    try {
      const credential = isRegister ? await createUserWithEmailAndPassword(firebase.auth, email, password) : await signInWithEmailAndPassword(firebase.auth, email, password);
      const userEmail = credential.user.email ?? email;
      if (!isRegister && !credential.user.emailVerified) {
        await sendTraceVerificationEmail(credential.user);
        router.push("/verify-email");
        return;
      }
      const token = await credential.user.getIdToken();
      await finishAuthentication(token, userEmail);
      if (isRegister) {
        await sendTraceVerificationEmail(credential.user);
        router.push("/verify-email");
        return;
      }
      router.push("/dashboard");
    } catch (caught) {
      setError(getAuthErrorMessage(caught));
    } finally { setLoading(false); }
  }

  async function signInWithGoogle() {
    setError(""); setNotice(""); setLoading(true);
    const firebase = getFirebaseClient();
    if (!firebase) { setError("Firebase belum dikonfigurasi. Isi environment Firebase sebelum memakai akun."); setLoading(false); return; }
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credential = await signInWithPopup(firebase.auth, provider);
      await finishAuthentication(await credential.user.getIdToken(), credential.user.email ?? "");
      router.push("/dashboard");
    } catch (caught) {
      setError(getAuthErrorMessage(caught));
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
        <div className="field"><label htmlFor="email">Email</label><input id="email" className="input auth-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="nama@email.com" /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" className="input auth-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={isRegister ? "new-password" : "current-password"} placeholder="Minimal 8 karakter" /></div>
        {error && <p className="error-text" role="alert">{error}</p>}
        {notice && <p className="success-text" role="status">{notice}</p>}
        <button className="button button-primary" type="submit" disabled={loading}>{loading ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}</button>
        {!isRegister && <button className="button button-secondary" type="button" onClick={resetPassword} disabled={loading}>Lupa password?</button>}
      </form>
      <div className="auth-divider"><span>atau</span></div>
      <button className="button button-google" type="button" onClick={signInWithGoogle} disabled={loading}><GoogleMark />{isRegister ? "Daftar dengan Google" : "Lanjutkan dengan Google"}</button>
      <p className="small muted">{isRegister ? "Sudah punya akun? " : "Belum punya akun? "}<Link href={isRegister ? "/login" : "/register"} style={{ color: "var(--acid)" }}>{isRegister ? "Masuk" : "Daftar"}</Link></p>
    </div>
  );
}

function GoogleMark() {
  return <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z" />
    <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.04H3.29v2.53A9.75 9.75 0 0 0 12 21.75Z" />
    <path fill="#FBBC05" d="M6.53 13.82A5.86 5.86 0 0 1 6.22 12c0-.63.11-1.24.31-1.82V7.65H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.35l3.24-2.53Z" />
    <path fill="#EA4335" d="M12 6.14c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.13 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.4l3.24 2.53c.77-2.32 2.93-4.04 5.47-4.04Z" />
  </svg>;
}
