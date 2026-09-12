export type PasswordCheckResult = {
  status: "exposed_signal" | "not_found_in_checked_source" | "unavailable";
  matchCount: number;
  providerName: string;
};

export async function checkPwnedPasswordHash(prefix: string, suffix: string): Promise<PasswordCheckResult> {
  const endpoint = `https://api.pwnedpasswords.com/range/${prefix}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(endpoint, {
      headers: { "add-padding": "true", "user-agent": "TRACE-Digital-Exposure-Scanner" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) return { status: "unavailable", matchCount: 0, providerName: "Pwned Passwords range API" };
    const text = await response.text();
    const match = text.split(/\r?\n/).find((line) => line.toUpperCase().startsWith(suffix.toUpperCase()));
    const count = match ? Number.parseInt(match.split(":")[1] ?? "0", 10) || 0 : 0;
    return {
      status: count > 0 ? "exposed_signal" : "not_found_in_checked_source",
      matchCount: count,
      providerName: "Pwned Passwords range API",
    };
  } catch {
    return { status: "unavailable", matchCount: 0, providerName: "Pwned Passwords range API" };
  } finally {
    clearTimeout(timeout);
  }
}
