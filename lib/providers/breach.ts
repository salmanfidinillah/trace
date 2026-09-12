import type { BreachLookupResult, Exposure } from "@/lib/domain/types";

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
    return {
      providerName: "TRACE Demo Dataset",
      isDemoData: true,
      exposures: isDemoExposure ? demoExposures : [],
    };
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
        headers: {
          "content-type": "application/json",
          ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Breach provider returned ${response.status}`);
      const payload = (await response.json()) as { exposures?: unknown };
      const exposures = normalizeProviderExposures(payload.exposures);
      return { providerName: "Configured breach provider", isDemoData: false, exposures };
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
  const provider = process.env.TRACE_BREACH_PROVIDER ?? (process.env.TRACE_RUNTIME_ENV === "production" ? "unavailable" : "demo");
  if (provider === "demo") return new DemoBreachProvider();
  if (provider === "http" && process.env.TRACE_BREACH_ENDPOINT) return new HttpBreachProvider(process.env.TRACE_BREACH_ENDPOINT, process.env.TRACE_BREACH_API_KEY);
  return new UnavailableBreachProvider();
}
