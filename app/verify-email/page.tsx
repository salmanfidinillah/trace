"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, reload, sendEmailVerification, signOut, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseClient } from "@/lib/firebase/client";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const firebase = getFirebaseClient();
    if (!firebase) {
      router.replace("/login");
      return;
    }
    return onAuthStateChanged(firebase.auth, (currentUser) => {
      setUser(currentUser);
      setCheckingSession(false);
      if (!currentUser) router.replace("/login");
    });
  }, [router]);

  async function resendVerification() {
    if (!user) return;
    setLoading(true); setError(""); setNotice("");
    try {
      await sendEmailVerification(user);
      setNotice("Link verifikasi baru sudah dikirim ke email kamu.");
    } catch {
      setError("Email verifikasi belum dapat dikirim. Coba lagi beberapa saat.");
    } finally { setLoading(false); }
  }

  async function checkVerification() {
    if (!user) return;
    setLoading(true); setError(""); setNotice("");
    try {
      await reload(user);
      if (!user.emailVerified) {
        setError("Email belum terverifikasi. Buka link dari email lalu coba cek lagi.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Status verifikasi belum dapat diperiksa. Coba lagi.");
    } finally { setLoading(false); }
  }

  async function leaveVerification() {
    const firebase = getFirebaseClient();
    if (firebase) await signOut(firebase.auth);
    router.push("/login");
  }

  return (
    <main className="auth-page">
      <div className="panel auth-card verification-card">
        <span className="eyebrow">TRACE // VERIFIKASI EMAIL</span>
        <h1>CEK EMAIL KAMU</h1>
        <p className="muted">{checkingSession ? "Memulihkan sesi akun..." : "Kami mengirim link verifikasi ke:"}</p>
        <p className="verification-email">{user?.email ?? "email kamu"}</p>
        <p className="muted">Buka link tersebut untuk mengaktifkan akun, lalu kembali ke sini.</p>
        {error && <p className="error-text" role="alert">{error}</p>}
        {notice && <p className="success-text" role="status">{notice}</p>}
        <button className="button button-primary" type="button" onClick={checkVerification} disabled={loading}>{loading ? "Memeriksa..." : "Saya sudah verifikasi"}</button>
        <button className="button button-secondary" type="button" onClick={resendVerification} disabled={loading}>Kirim ulang email</button>
        <button className="text-button" type="button" onClick={leaveVerification}>Gunakan akun lain</button>
      </div>
    </main>
  );
}
