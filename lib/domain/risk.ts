import type { Exposure, RiskFactor, RiskLevel } from "@/lib/domain/types";

const severityWeight: Record<Exposure["severity"], number> = {
  low: 2,
  medium: 5,
  high: 8,
  critical: 10,
};

export function riskLevelForScore(score: number): RiskLevel {
  if (score <= 20) return "low";
  if (score <= 40) return "moderate";
  if (score <= 60) return "elevated";
  if (score <= 80) return "high";
  return "critical";
}

export function riskLabel(level: RiskLevel): string {
  return {
    low: "Rendah",
    moderate: "Sedang",
    elevated: "Meningkat",
    high: "Tinggi",
    critical: "Kritis",
  }[level];
}

export function calculateRisk(
  exposures: Exposure[],
  referenceYear = new Date().getUTCFullYear(),
): { score: number; level: RiskLevel; factors: RiskFactor[] } {
  if (exposures.length === 0) {
    return {
      score: 0,
      level: "low",
      factors: [
        {
          key: "no_exposure",
          label: "Temuan exposure",
          contribution: 0,
          explanation: "Tidak ada exposure pada sumber data yang diperiksa.",
        },
      ],
    };
  }

  const allTypes = new Set(exposures.flatMap((exposure) => exposure.dataTypes.map((type) => type.toLowerCase())));
  const sensitivity = allTypes.has("password") || allTypes.has("credential")
    ? 30
    : allTypes.has("phone") || allTypes.has("address")
      ? 25
      : allTypes.has("username")
        ? 18
        : 12;
  const authentication = allTypes.has("password") || allTypes.has("credential") || allTypes.has("security questions") ? 30 : 0;
  const count = Math.min(20, exposures.length * 5);
  const latestYear = exposures.reduce<number | null>((latest, exposure) => {
    if (!exposure.year) return latest;
    return latest === null ? exposure.year : Math.max(latest, exposure.year);
  }, null);
  const yearsAgo = latestYear === null ? 10 : Math.max(0, referenceYear - latestYear);
  const recency = yearsAgo <= 2 ? 10 : yearsAgo <= 5 ? 7 : yearsAgo <= 8 ? 4 : 2;
  const severity = Math.max(...exposures.map((exposure) => severityWeight[exposure.severity]));

  const factors: RiskFactor[] = [
    {
      key: "data_sensitivity",
      label: "Sensitivitas data",
      contribution: sensitivity,
      explanation: "Jenis data yang terekspos menentukan seberapa besar dampaknya.",
    },
    {
      key: "authentication_exposure",
      label: "Data autentikasi",
      contribution: authentication,
      explanation: authentication > 0 ? "Ditemukan indikasi data yang berkaitan dengan autentikasi." : "Tidak ada data autentikasi yang teridentifikasi.",
    },
    {
      key: "exposure_count",
      label: "Jumlah exposure",
      contribution: count,
      explanation: `${exposures.length} exposure ditemukan pada sumber yang diperiksa.`,
    },
    {
      key: "recency",
      label: "Kebaruan exposure",
      contribution: recency,
      explanation: latestYear ? `Exposure terbaru tercatat pada ${latestYear}.` : "Tahun exposure tidak tersedia.",
    },
    {
      key: "source_severity",
      label: "Tingkat keparahan sumber",
      contribution: severity,
      explanation: "Skor mempertimbangkan tingkat keparahan tertinggi dari temuan.",
    },
  ];

  const score = Math.min(100, factors.reduce((total, factor) => total + factor.contribution, 0));
  return { score, level: riskLevelForScore(score), factors };
}
