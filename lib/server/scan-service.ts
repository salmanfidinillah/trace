import { createBreachProvider } from "@/lib/providers/breach";
import { buildRecommendations } from "@/lib/domain/recommendations";
import { calculateRisk } from "@/lib/domain/risk";
import type { AiExplanation, SafeScanResult } from "@/lib/domain/types";
import { generateVertexExplanation } from "@/lib/ai/vertex";

export function buildRuleBasedExplanation(result: Pick<SafeScanResult, "score" | "level" | "exposures" | "recommendations">): AiExplanation {
  const summary = result.exposures.length === 0
    ? "Tidak ada exposure yang ditemukan pada sumber data yang diperiksa. Tetap gunakan password unik dan aktifkan autentikasi dua faktor."
    : `Kami menemukan ${result.exposures.length} exposure. Tingkat risiko saat ini ${result.level === "critical" ? "kritis" : result.level === "high" ? "tinggi" : "perlu diperhatikan"}.`;
  return {
    response: summary,
    summary,
    topRisks: result.exposures.slice(0, 3).map((exposure) => `${exposure.serviceName}: ${exposure.dataTypes.join(", ")}`),
    actions: result.recommendations.slice(0, 4).map((recommendation) => recommendation.title),
    limitations: ["Analisis ini hanya menggunakan sumber data yang tersedia dan tidak menjamin keamanan seluruh akun."],
    source: "rule_based",
  };
}

export async function runEmailScan(email: string): Promise<SafeScanResult> {
  const provider = createBreachProvider();
  const lookup = await provider.lookup(email);
  const risk = calculateRisk(lookup.exposures);
  const recommendations = buildRecommendations(lookup.exposures, risk.level);
  const result: SafeScanResult = {
    scanId: null,
    status: lookup.exposures.length > 0 ? "exposure_found" : "no_exposure",
    score: risk.score,
    level: risk.level,
    exposureCount: lookup.exposures.length,
    exposures: lookup.exposures,
    factors: risk.factors,
    recommendations,
    aiExplanation: null,
    limitations: ["Tidak ditemukannya exposure bukan berarti akun pasti aman.", "Hasil bergantung pada sumber data yang diperiksa."],
    providerName: lookup.providerName,
    isDemoData: lookup.isDemoData,
  };
  const vertexExplanation = await generateVertexExplanation(result);
  result.aiExplanation = vertexExplanation ?? buildRuleBasedExplanation(result);
  if (!vertexExplanation) {
    console.warn("TRACE_AI_FALLBACK_USED", { surface: "email_scan", reason: "vertex_ai_unavailable" });
  }
  return result;
}
