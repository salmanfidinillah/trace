import { NextResponse } from "next/server";
import { getAuthContext, isEmailVerified } from "@/lib/server/auth-context";
import { getAdminDb } from "@/lib/server/firebase-admin";
import { getDashboard } from "@/lib/server/scan-repository";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await getAuthContext(request);
  if (!auth) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Silakan masuk untuk melihat dasbor." } }, { status: 401 });
  if (!isEmailVerified(auth)) return NextResponse.json({ error: { code: "EMAIL_NOT_VERIFIED", message: "Verifikasi email terlebih dahulu untuk membuka dasbor." } }, { status: 403 });
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: { code: "FIREBASE_NOT_CONFIGURED", message: "Firebase server belum dikonfigurasi." } }, { status: 503 });
  try {
    return NextResponse.json({ data: await getDashboard(db, auth.uid) });
  } catch {
    return NextResponse.json({ error: { code: "DASHBOARD_UNAVAILABLE", message: "Dasbor belum dapat dimuat." } }, { status: 503 });
  }
}
