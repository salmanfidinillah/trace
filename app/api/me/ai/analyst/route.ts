import { NextResponse } from "next/server";
import { aiQuestionSchema } from "@/lib/validation";
import { getAuthContext, isEmailVerified } from "@/lib/server/auth-context";
import { getAdminDb } from "@/lib/server/firebase-admin";
import { getDashboard } from "@/lib/server/scan-repository";
import { analyzeSecurityQuestion } from "@/lib/ai/vertex";
import { buildRuleBasedExplanation } from "@/lib/server/scan-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await getAuthContext(request);
  if (!auth) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Silakan masuk untuk memakai Analis Keamanan AI." } }, { status: 401 });
  if (!isEmailVerified(auth)) return NextResponse.json({ error: { code: "EMAIL_NOT_VERIFIED", message: "Verifikasi email terlebih dahulu untuk memakai Analis Keamanan AI." } }, { status: 403 });
  const parsed = aiQuestionSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "Pertanyaan tidak valid." } }, { status: 400 });
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: { code: "FIREBASE_NOT_CONFIGURED", message: "Firebase server belum dikonfigurasi." } }, { status: 503 });
  const dashboard = await getDashboard(db, auth.uid);
  const latest = dashboard.scans[0] as { score?: unknown; level?: unknown; exposureSummary?: Array<{ id?: string; serviceName?: string; year?: number | null; dataTypes?: string[]; severity?: "low" | "medium" | "high" | "critical" }> } | undefined;
  const recommendations = dashboard.recommendations as Array<{ id: string; title?: unknown; description?: unknown }>;
  const result = {
    score: typeof latest?.score === "number" ? latest.score : 0,
    level: (latest?.level ?? "low") as "low" | "moderate" | "elevated" | "high" | "critical",
    exposures: (latest?.exposureSummary ?? []).map((exposure, index) => ({ id: exposure.id ?? `dashboard-${index}`, serviceName: exposure.serviceName ?? "Layanan tidak diketahui", year: exposure.year ?? null, dataTypes: exposure.dataTypes ?? [], severity: exposure.severity ?? "low" })),
    recommendations: recommendations.map((item) => ({ id: item.id, title: String(item.title ?? "Tindakan keamanan"), description: String(item.description ?? ""), priority: "moderate" as const, reason: "Security state pengguna", status: "todo" as const })),
  };
  const explanation = parsed.data.question && process.env.VERTEX_AI_PROJECT_ID ? await analyzeSecurityQuestion(parsed.data.question, result) : null;
  return NextResponse.json({ data: explanation ?? buildRuleBasedExplanation(result) });
}
