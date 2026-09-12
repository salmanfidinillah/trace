import { verifyIdToken } from "@/lib/server/firebase-admin";
export { isEmailVerified } from "@/lib/server/auth-policy";

export async function getAuthContext(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length).trim();
  if (!token) return null;
  try {
    return await verifyIdToken(token);
  } catch (error) {
    const code = error instanceof Error && "code" in error ? String((error as Error & { code?: unknown }).code) : "unknown";
    console.error("TRACE_AUTH_TOKEN_VERIFY_FAILED", { code });
    return null;
  }
}

export function requestFingerprint(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown-client";
}
