import { NextResponse } from "next/server";
import { passwordHashSchema } from "@/lib/validation";
import { checkPwnedPasswordHash } from "@/lib/providers/password";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import { requestFingerprint } from "@/lib/server/auth-context";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = passwordHashSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "Permintaan pemeriksaan tidak valid." } }, { status: 400 });
  const allowed = await consumeRateLimit(`password-scan:${requestFingerprint(request)}`, 6);
  if (!allowed) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Terlalu banyak percobaan. Coba lagi beberapa saat lagi." } }, { status: 429 });
  const result = await checkPwnedPasswordHash(parsed.data.prefix.toUpperCase(), parsed.data.suffix.toUpperCase());
  return NextResponse.json({ data: { status: result.status, recommendation: result.status === "exposed_signal" ? "Gunakan password baru yang unik sekarang." : result.status === "unavailable" ? "Sumber pemeriksaan sedang tidak tersedia." : "Tidak ditemukan pada sumber yang diperiksa. Tetap gunakan password unik.", providerName: result.providerName } });
}
