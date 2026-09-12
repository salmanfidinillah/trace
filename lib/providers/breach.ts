import type { BreachLookupResult, Exposure, Severity } from "@/lib/domain/types";

export interface BreachProvider {
  lookup(email: string): Promise<BreachLookupResult>;
}

const demoExposures: Exposure[] = [
  {
    id: "demo-social-2024",
    serviceName: "Media Sosial Demo",
    year: 2024,
    dataTypes: ["email", "username"],
    severity: "high",
    summary: "Dataset demo untuk memvalidasi alur TRACE.",
  },
  {
    id: "demo-market-2023",
    serviceName: "Perdagangan Daring Demo",
    year: 2023,
    dataTypes: ["email", "phone"],
    severity: "high",
    summary: "Dataset demo untuk memvalidasi alur TRACE.",
  },
  {
    id: "demo-forum-2022",
    serviceName: "Forum Demo",
    year: 2022,
    dataTypes: ["email", "username"],
    severity: "medium",
    summary: "Dataset demo untuk memvalidasi alur TRACE.",
  },
];

class DemoBreachProvider implements BreachProvider {
  async lookup(email: string): Promise<BreachLookupResult> {
    const isDemoExposure = email === "terpapar@trace.test" || email === "demo@trace.test";
    return { providerName: "TRACE Demo Dataset", isDemoData: true, exposures: isDemoExposure ? demoExposures : [] };
  }
}

type HibpBreach = {
  Name?: string;
  Title?: string;
  Domain?: string;
  BreachDate?: string;
  DataClasses?: string[];
  IsVerified?: boolean;
  IsSensitive?: boolean;
  IsSpamList?: boolean;
};

class HaveIBeenPwnedProvider implements BreachProvider {
  private readonly endpoint = "https://haveibeenpwned.com/api/v3/breachedaccount";

  constructor(private readonly apiKey: string) {}

  async lookup(email: string): Promise<BreachLookupResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const url = `${this.endpoint}/${encodeURIComponent(email)}?truncateResponse=false&IncludeUnverified=true`;
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          "hibp-api-key": this.apiKey,
          "user-agent": "TRACE-Digital-Exposure-MVP",
        },
        cache: "no-store",
        signal: controller.signal,
      });
      if (response.status === 404) return { providerName: "Have I Been Pwned", isDemoData: false, exposures: [] };
      if (!response.ok) throw new Error(`HIBP returned ${response.status}`);
      const breaches = (await response.json()) as unknown;
      const exposures = Array.isArray(breaches) ? breaches.flatMap((breach, index) => normalizeHibpBreach(breach, index)) : [];
      return { providerName: "Have I Been Pwned", isDemoData: false, exposures };
    } finally {
      clearTimeout(timeout);
    }
  }
}

class HttpBreachProvider implements BreachProvider {
  constructor(private readonly endpoint: string, private readonly apiKey?: string) {}

  async lookup(email: string): Promise<BreachLookupResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {}) },
        body: JSON.stringify({ email }),
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Breach provider returned ${response.status}`);
      const payload = (await response.json()) as { exposures?: unknown };
      return { providerName: "Configured breach provider", isDemoData: false, exposures: normalizeProviderExposures(payload.exposures) };
    } finally {
      clearTimeout(timeout);
    }
  }
}

class UnavailableBreachProvider implements BreachProvider {
  async lookup(): Promise<BreachLookupResult> {
    throw new Error("Breach provider belum dikonfigurasi.");
  }
}

function normalizeHibpBreach(value: unknown, index: number): Exposure[] {
  if (!value || typeof value !== "object") return [];
  const breach = value as HibpBreach;
  const serviceName = typeof breach.Title === "string" && breach.Title.trim() ? breach.Title.trim() : breach.Name?.trim();
  if (!serviceName) return [];
  const dataTypes = (breach.DataClasses ?? []).filter((type): type is string => typeof type === "string").map(normalizeDataType).filter(Boolean);
  const yearMatch = typeof breach.BreachDate === "string" ? /^\d{4}/.exec(breach.BreachDate) : null;
  const year = yearMatch ? Number(yearMatch[0]) : null;
  const severity = getHibpSeverity(dataTypes, breach);
  return [{
    id: `hibp-${index}-${serviceName.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
    serviceName: serviceName.slice(0, 120),
    year,
    dataTypes: dataTypes.length ? dataTypes : ["email"],
    severity,
    summary: "Paparan tercatat pada katalog breach Have I Been Pwned.",
    sourceReference: "https://haveibeenpwned.com/",
  }];
}

function normalizeDataType(value: string): string {
  const normalized = value.toLowerCase();
  if (normalized.includes("email")) return "email";
  if (normalized.includes("password")) return "password";
  if (normalized.includes("phone")) return "phone";
  if (normalized.includes("username")) return "username";
  if (normalized.includes("address")) return "address";
  if (normalized.includes("security question")) return "security questions";
  if (normalized.includes("credit card") || normalized.includes("bank")) return "financial data";
  return normalized.slice(0, 80);
}

function getHibpSeverity(dataTypes: string[], breach: HibpBreach): Severity {
  if (dataTypes.some((type) => ["password", "security questions", "financial data"].includes(type))) return "critical";
  if (breach.IsSensitive || dataTypes.some((type) => ["phone", "address"].includes(type))) return "high";
  if (dataTypes.includes("email") || dataTypes.includes("username")) return "medium";
  return "low";
}

function normalizeProviderExposures(value: unknown): Exposure[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const serviceName = typeof record.serviceName === "string" ? record.serviceName.slice(0, 120) : null;
    const dataTypes = Array.isArray(record.dataTypes) ? record.dataTypes.filter((type): type is string => typeof type === "string").slice(0, 20) : [];
    const year = typeof record.year === "number" && Number.isInteger(record.year) ? record.year : null;
    const severity = record.severity === "critical" || record.severity === "high" || record.severity === "medium" ? record.severity : "low";
    if (!serviceName) return [];
    return [{ id: `provider-${index}-${serviceName.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`, serviceName, year, dataTypes, severity, summary: typeof record.summary === "string" ? record.summary.slice(0, 300) : undefined }];
  });
}

export function createBreachProvider(): BreachProvider {
  const provider = process.env.TRACE_BREACH_PROVIDER ?? (process.env.TRACE_BREACH_API_KEY ? "hibp" : "unavailable");
  if (provider === "demo") return new DemoBreachProvider();
  if (provider === "hibp" && process.env.TRACE_BREACH_API_KEY) return new HaveIBeenPwnedProvider(process.env.TRACE_BREACH_API_KEY);
  if (provider === "http" && process.env.TRACE_BREACH_ENDPOINT) return new HttpBreachProvider(process.env.TRACE_BREACH_ENDPOINT, process.env.TRACE_BREACH_API_KEY);
  return new UnavailableBreachProvider();
}
