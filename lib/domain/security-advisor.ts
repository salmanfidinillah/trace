import type { Recommendation, RiskLevel, SafeScanResult } from "@/lib/domain/types";

export type AdvisorRiskBand = "low" | "medium" | "high" | "critical";

export type AdvisorAction = Pick<Recommendation, "id" | "title" | "description">;

export type SecurityAdvisorModel = {
  riskBand: AdvisorRiskBand;
  riskLabel: string;
  score: number;
  healthScore: number;
  healthLabel: string;
  healthDescription: string;
  whatHappened: string;
  risks: string[];
  reasons: Array<{ label: string; contribution: number; explanation: string }>;
  actions: AdvisorAction[];
  limitations: string[];
  aiSummary: string;
  isFallback: boolean;
  isDemoData: boolean;
};

const riskBandByLevel: Record<RiskLevel, AdvisorRiskBand> = {
  low: "low",
  moderate: "medium",
  elevated: "medium",
  high: "high",
  critical: "critical",
};

const riskLabelByBand: Record<AdvisorRiskBand, string> = {
  low: "Low / Rendah",
  medium: "Medium / Sedang",
  high: "High / Tinggi",
  critical: "Critical / Kritis",
};

function buildRisks(result: SafeScanResult): string[] {
  const types = new Set(result.exposures.flatMap((exposure) => exposure.dataTypes.map((type) => type.toLowerCase())));
  const risks: string[] = [];

  if (types.has("password") || types.has("credential")) {
    risks.push("Credential stuffing dan account takeover jika password digunakan kembali.");
    risks.push("Password reuse pada layanan lain dapat memperluas dampak exposure.");
  }
  if (types.has("email") || types.has("username")) {
    risks.push("Phishing atau spam/scam yang menyamar sebagai layanan yang dikenal.");
  }
  if (types.has("phone") || types.has("address")) {
    risks.push("Identity exposure dan rekayasa sosial dengan konteks kontak yang lebih lengkap.");
  }
  if (risks.length === 0) {
    risks.push("Belum ada indikator exposure pada sumber yang diperiksa.");
    risks.push("Phishing dan password reuse tetap perlu diwaspadai sebagai risiko umum.");
  }

  return Array.from(new Set(risks)).slice(0, 5);
}

function buildWhatHappened(result: SafeScanResult): string {
  if (result.exposures.length === 0) {
    return `TRACE tidak menemukan exposure pada ${result.providerName} untuk pemeriksaan ini. Ini bukan jaminan bahwa seluruh akun aman, karena hasil bergantung pada sumber yang diperiksa.`;
  }

  const services = result.exposures.slice(0, 3).map((exposure) => exposure.serviceName).join(", ");
  const suffix = result.exposures.length > 3 ? " dan sumber lainnya" : "";
  return `TRACE menemukan ${result.exposureCount} indikasi exposure pada ${services}${suffix}. Jenis data yang tersedia dipakai untuk menghitung skor, tanpa mengirim password ke advisor.`;
}

function healthForScore(score: number): Pick<SecurityAdvisorModel, "healthScore" | "healthLabel" | "healthDescription"> {
  const healthScore = Math.max(0, 100 - score);
  if (score <= 20) return { healthScore, healthLabel: "Sehat", healthDescription: "Belum ada sinyal besar dari sumber yang diperiksa. Pertahankan kebiasaan aman." };
  if (score <= 40) return { healthScore, healthLabel: "Perlu perhatian", healthDescription: "Ada beberapa sinyal yang perlu ditindaklanjuti agar tidak berkembang menjadi risiko lebih besar." };
  if (score <= 60) return { healthScore, healthLabel: "Perlindungan perlu ditingkatkan", healthDescription: "Beberapa langkah dasar akan membantu menurunkan peluang penyalahgunaan akun." };
  if (score <= 80) return { healthScore, healthLabel: "Rentan", healthDescription: "Prioritaskan tindakan keamanan utama dan periksa akun yang berkaitan." };
  return { healthScore, healthLabel: "Kritis", healthDescription: "Ambil tindakan segera, terutama jika temuan berkaitan dengan autentikasi." };
}

export function buildSecurityAdvisorModel(result: SafeScanResult): SecurityAdvisorModel {
  const health = healthForScore(result.score);
  const actions = result.recommendations.slice(0, 5).map(({ id, title, description }) => ({ id, title, description }));
  const fallbackActions: AdvisorAction[] = [
    { id: "unique-password", title: "Gunakan password unik", description: "Jangan gunakan password yang sama di layanan lain." },
    { id: "enable-mfa", title: "Aktifkan MFA/2FA", description: "Tambahkan lapisan verifikasi pada email utama dan akun penting." },
    { id: "review-login", title: "Periksa aktivitas login", description: "Keluarkan perangkat atau sesi yang tidak kamu kenali." },
  ];

  return {
    riskBand: riskBandByLevel[result.level],
    riskLabel: riskLabelByBand[riskBandByLevel[result.level]],
    score: result.score,
    ...health,
    whatHappened: buildWhatHappened(result),
    risks: buildRisks(result),
    reasons: result.factors.filter((factor) => factor.contribution > 0),
    actions: actions.length > 0 ? actions : fallbackActions,
    limitations: result.limitations,
    aiSummary: result.aiExplanation?.summary ?? "Advisor menerjemahkan hasil pemeriksaan menjadi langkah keamanan yang bisa dilakukan.",
    isFallback: result.aiExplanation?.source !== "vertex_ai",
    isDemoData: result.isDemoData,
  };
}
