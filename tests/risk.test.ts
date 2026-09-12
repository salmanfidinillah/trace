import { describe, expect, it } from "vitest";
import { calculateRisk, riskLabel, riskLevelForScore } from "../lib/domain/risk";
import { buildRecommendations } from "../lib/domain/recommendations";
import type { Exposure } from "../lib/domain/types";

const exposure: Exposure = {
  id: "1",
  serviceName: "Demo",
  year: 2024,
  dataTypes: ["email", "phone"],
  severity: "high",
};

describe("risk engine", () => {
  it("uses the documented thresholds", () => {
    expect(riskLevelForScore(20)).toBe("low");
    expect(riskLevelForScore(21)).toBe("moderate");
    expect(riskLevelForScore(41)).toBe("elevated");
    expect(riskLevelForScore(61)).toBe("high");
    expect(riskLevelForScore(81)).toBe("critical");
    expect(riskLabel("critical")).toBe("Kritis");
  });

  it("returns a low score for an empty result", () => {
    const result = calculateRisk([], 2026);
    expect(result.score).toBe(0);
    expect(result.level).toBe("low");
  });

  it("returns explainable factors for exposure", () => {
    const result = calculateRisk([exposure], 2026);
    expect(result.score).toBeGreaterThan(0);
    expect(result.factors.map((factor) => factor.key)).toEqual([
      "data_sensitivity",
      "authentication_exposure",
      "exposure_count",
      "recency",
      "source_severity",
    ]);
  });
});

describe("recommendation engine", () => {
  it("prioritizes password exposure", () => {
    const result = buildRecommendations([{ ...exposure, dataTypes: ["email", "password"], severity: "critical" }], "critical");
    expect(result[0].priority).toBe("critical");
    expect(result[0].title).toContain("Ganti password");
  });

  it("gives maintenance guidance when no exposure exists", () => {
    const result = buildRecommendations([], "low");
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe("low");
  });
});
