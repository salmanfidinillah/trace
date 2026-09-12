export type RiskLevel = "low" | "moderate" | "elevated" | "high" | "critical";
export type ScanStatus = "no_exposure" | "exposure_found" | "unavailable" | "failed";
export type Severity = "low" | "medium" | "high" | "critical";

export type Exposure = {
  id: string;
  serviceName: string;
  year: number | null;
  dataTypes: string[];
  severity: Severity;
  summary?: string;
  sourceReference?: string | null;
};

export type RiskFactor = {
  key: string;
  label: string;
  contribution: number;
  explanation: string;
};

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  priority: RiskLevel;
  reason: string;
  status: "todo" | "in_progress" | "done";
};

export type AiExplanation = {
  summary: string;
  topRisks: string[];
  actions: string[];
  limitations: string[];
  source: "vertex_ai" | "rule_based";
};

export type SafeScanResult = {
  scanId: string | null;
  status: ScanStatus;
  score: number;
  level: RiskLevel;
  exposureCount: number;
  exposures: Exposure[];
  factors: RiskFactor[];
  recommendations: Recommendation[];
  aiExplanation: AiExplanation | null;
  limitations: string[];
  providerName: string;
  isDemoData: boolean;
};

export type BreachLookupResult = {
  providerName: string;
  isDemoData: boolean;
  exposures: Exposure[];
};
