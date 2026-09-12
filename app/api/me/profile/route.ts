import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/server/auth-context";
import { getAdminDb } from "@/lib/server/firebase-admin";
import { emailScanSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await getAuthContext(request);
  if (!auth) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Silakan masuk." } }, { status: 401 });
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: { code: "FIREBASE_NOT_CONFIGURED", message: "Firebase server belum dikonfigurasi." } }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  const parsedEmail = emailScanSchema.safeParse({ email: body.email ?? auth.email });
  const email = parsedEmail.success ? parsedEmail.data.email.toLowerCase() : auth.email ?? null;
  const userRef = db.collection("users").doc(auth.uid);
  const existing = await userRef.get();
  await userRef.set({ uid: auth.uid, email, emailVerified: Boolean(auth.email_verified), updatedAt: new Date(), ...(existing.exists ? {} : { createdAt: new Date() }) }, { merge: true });
  const checklist = await userRef.collection("checklist").limit(1).get();
  if (checklist.empty) {
    const defaults = [
      ["unique-password", "Gunakan password unik", "Gunakan password berbeda untuk akun penting.", 1],
      ["change-related-passwords", "Ganti password terkait", "Ganti password pada layanan yang terdampak.", 2],
      ["enable-2fa", "Aktifkan autentikasi dua faktor", "Tambahkan lapisan verifikasi pada akun penting.", 3],
      ["review-login-activity", "Periksa aktivitas login", "Tinjau sesi dan perangkat yang tidak dikenal.", 4],
      ["secure-recovery", "Perbarui recovery information", "Pastikan email dan nomor pemulihan masih aman.", 5],
      ["watch-phishing", "Waspadai phishing", "Jangan memberikan kode atau password melalui pesan mencurigakan.", 6],
    ] as const;
    const batch = db.batch();
    for (const [id, title, description, order] of defaults) batch.set(userRef.collection("checklist").doc(id), { key: id, title, description, status: "todo", order, updatedAt: new Date() });
    await batch.commit();
  }
  return NextResponse.json({ data: { uid: auth.uid } });
}
