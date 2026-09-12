import type { RiskLevel } from "@/lib/domain/types";
import { riskLabel } from "@/lib/domain/risk";

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <span className={`badge badge-${level}`}>{riskLabel(level)}</span>;
}
