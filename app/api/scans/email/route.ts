import { NextResponse } from "next/server";
import { emailScanSchema, normalizeEmail } from "@/lib/validation";
import { getAdminDb, verifyAppCheckToken } from "@/lib/server/firebase-admin";
import { getAuthContext, requestFingerprint } from "@/lib/server/auth-context";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import { persistScan } from "@/lib/server/scan-repository";
import { runEmailScan } from "@/lib/server/scan-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = emailScanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "INVALID_EMAIL", message: "Masukkan alamat email yang valid." } }, { status: 400 });
  }

  if (process.env.TRACE_REQUIRE_APP_CHECK === "true") {
    const appCheckToken = request.headers.get("X-Firebase-AppCheck");
    if (!appCheckToken) return NextResponse.json({ error: { code: "APP_CHECK_REQUIRED", message: "Permintaan tidak dapat diverifikasi." } }, { status: 403 });
    try {
      await verifyAppCheckToken(appCheckToken);
    } catch {
      return NextResponse.json({ error: { code: "APP_CHECK_INVALID", message: "Permintaan tidak dapat diverifikasi." } }, { status: 403 });
    }
  }

  const allowed = await consumeRateLimit(`email-scan:${requestFingerprint(request)}`);
  if (!allowed) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Terlalu banyak permintaan. Coba lagi beberapa saat lagi." } }, { status: 429 });

  try {
    const email = normalizeEmail(parsed.data.email);
    const result = await runEmailScan(email);
    const auth = await getAuthContext(request);
    const db = auth ? getAdminDb() : null;
    if (auth && db) result.scanId = await persistScan(db, auth.uid, result, email);
    return NextResponse.json({ data: result, meta: { requestId: crypto.randomUUID() } });
  } catch {
    return NextResponse.json({ error: { code: "PROVIDER_UNAVAILABLE", message: "Pemeriksaan sedang tidak tersedia. Coba lagi nanti." } }, { status: 503 });
  }
}
