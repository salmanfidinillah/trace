import { z } from "zod";

export const emailScanSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const passwordHashSchema = z.object({
  prefix: z.string().regex(/^[A-Fa-f0-9]{5}$/),
  suffix: z.string().regex(/^[A-Fa-f0-9]{35}$/),
});

export const aiQuestionSchema = z.object({
  question: z.string().trim().min(1).max(500).optional(),
  contextScope: z.enum(["dashboard", "scan"]).default("dashboard"),
});

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "email disamarkan";
  const visible = local.length <= 2 ? local[0] : local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(1, local.length - visible.length))}@${domain}`;
}
