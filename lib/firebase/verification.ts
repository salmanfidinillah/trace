import { sendEmailVerification, type User } from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase/client";

const VERIFICATION_COOLDOWN_MS = 60_000;
const VERIFICATION_LAST_SENT_KEY = "trace:verification-last-sent";

export async function sendTraceVerificationEmail(user: User) {
  const firebase = getFirebaseClient();
  if (!firebase) throw new Error("FIREBASE_NOT_CONFIGURED");

  firebase.auth.languageCode = "id";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.tracee.web.id";
  await sendEmailVerification(user, {
    url: `${origin}/verify-email`,
    handleCodeInApp: false,
  });
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(VERIFICATION_LAST_SENT_KEY, String(Date.now()));
  } catch {
    // Email delivery succeeded; local cooldown is only a client-side UX guard.
  }
}

export function getVerificationCooldownSeconds() {
  if (typeof window === "undefined") return 0;
  try {
    const lastSent = Number(window.localStorage.getItem(VERIFICATION_LAST_SENT_KEY) ?? 0);
    return Math.max(0, Math.ceil((VERIFICATION_COOLDOWN_MS - (Date.now() - lastSent)) / 1000));
  } catch {
    return 0;
  }
}
