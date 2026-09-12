"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, reload, signOut, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseClient } from "@/lib/firebase/client";
import { getVerificationCooldownSeconds, sendTraceVerificationEmail } from "@/lib/firebase/verification";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

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

  useEffect(() => {
    const refreshCooldown = () => setCooldownSeconds(getVerificationCooldownSeconds());
    const initialRefresh = window.setTimeout(refreshCooldown, 0);
    const interval = window.setInterval(() => setCooldownSeconds(getVerificationCooldownSeconds()), 1000);
    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(interval);
    };
  }, []);

  async function resendVerification() {
    if (!user) return;
    setLoading(true); setError(""); setNotice("");
    try {
      await sendTraceVerificationEmail(user);
      setNotice("Link verifikasi baru sudah dikirim ke email kamu.");
      setCooldownSeconds(getVerificationCooldownSeconds());
    } catch (caught) {
      const code = caught instanceof Error ? caught.message : "";
      setError(code.includes("too-many-requests") ? "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi." : "Email verifikasi belum dapat dikirim. Coba lagi beberapa saat.");
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
      const token = await user.getIdToken(true);
      const profileResponse = await fetch("/api/me/profile", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: user.email }),
      });
      if (!profileResponse.ok) throw new Error("PROFILE_SYNC_FAILED");
      router.push("/dashboard");
    } catch (caught) {
      setError(caught instanceof Error && caught.message === "PROFILE_SYNC_FAILED"
        ? "Email sudah terverifikasi, tetapi workspace belum siap. Coba lagi sebentar."
        : "Status verifikasi belum dapat diperiksa. Coba lagi.");
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
        <button className="button button-secondary" type="button" onClick={resendVerification} disabled={loading || cooldownSeconds > 0}>{cooldownSeconds > 0 ? `Kirim ulang (${cooldownSeconds}s)` : "Kirim ulang email"}</button>
        <button className="text-button" type="button" onClick={leaveVerification}>Gunakan akun lain</button>
      </div>
    </main>
  );
}
