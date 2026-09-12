import { describe, expect, it } from "vitest";
import { buildSecurityAdvisorModel } from "../lib/domain/security-advisor";
import type { SafeScanResult } from "../lib/domain/types";

const baseResult: SafeScanResult = {
  scanId: null,
  status: "exposure_found",
  score: 58,
  level: "elevated",
  exposureCount: 1,
  exposures: [{ id: "demo", serviceName: "Demo Service", year: 2024, dataTypes: ["email", "phone"], severity: "high" }],
  factors: [{ key: "exposure", label: "Sensitivitas data", contribution: 25, explanation: "Jenis data menentukan dampak." }],
  recommendations: [{ id: "2fa", title: "Aktifkan 2FA", description: "Tambahkan lapisan perlindungan.", priority: "high", reason: "Mengurangi risiko.", status: "todo" }],
  aiExplanation: null,
  limitations: ["Hasil terbatas pada sumber yang diperiksa."],
  providerName: "TRACE Demo Dataset",
  isDemoData: true,
};

describe("security advisor", () => {
  it("derives a medium demo advisor without exposing credentials", () => {
    const advisor = buildSecurityAdvisorModel(baseResult);
    expect(advisor.riskBand).toBe("medium");
    expect(advisor.score).toBe(58);
    expect(advisor.risks.join(" ")).toContain("Phishing");
    expect(advisor.actions[0].title).toBe("Aktifkan 2FA");
    expect(advisor.whatHappened).toContain("Demo Service");
  });

  it("keeps an empty result calm and actionable", () => {
    const advisor = buildSecurityAdvisorModel({ ...baseResult, status: "no_exposure", score: 0, level: "low", exposureCount: 0, exposures: [], recommendations: [], isDemoData: false });
    expect(advisor.riskBand).toBe("low");
    expect(advisor.healthScore).toBe(100);
    expect(advisor.risks.join(" ")).toContain("Belum ada indikator");
    expect(advisor.actions.length).toBeGreaterThan(0);
  });
});
