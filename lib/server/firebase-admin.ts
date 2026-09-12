import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";
import type { AppCheck } from "firebase-admin/app-check";
import type { Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedApp: App | null | undefined;

export function getAdminApp(): App | null {
  if (cachedApp !== undefined) return cachedApp;
  try {
    if (getApps().length > 0) {
      cachedApp = getApps()[0];
      return cachedApp;
    }
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const hasServiceAccount = Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey);
    const hasCloudIdentity = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT);
    if (!hasServiceAccount && !hasCloudIdentity) {
      cachedApp = null;
      return null;
    }
    const app = hasServiceAccount
      ? initializeApp({ credential: cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: privateKey as string }) })
      : initializeApp({ credential: applicationDefault(), projectId: process.env.GOOGLE_CLOUD_PROJECT ?? process.env.GCLOUD_PROJECT });
    cachedApp = app;
    return app;
  } catch {
    cachedApp = null;
    return null;
  }
}

export async function getAdminAuth(): Promise<Auth | null> {
  const app = getAdminApp();
  if (!app) return null;
  try {
    // Keep Auth external to the Next bundle and load it through Node's native
    // CommonJS resolver. This avoids the ESM interop failure on Vercel.
    const { getAuth } = require("firebase-admin/auth") as typeof import("firebase-admin/auth");
    return getAuth(app);
  } catch (error) {
    const details = error instanceof Error
      ? { name: error.name, message: error.message.slice(0, 240) }
      : { name: "UnknownError", message: String(error).slice(0, 240) };
    console.error("TRACE_ADMIN_AUTH_MODULE_FAILED", details);
    return null;
  }
}

export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export async function getAdminAppCheck(): Promise<AppCheck | null> {
  const app = getAdminApp();
  if (!app) return null;
  try {
    const { getAppCheck } = await import("firebase-admin/app-check");
    return getAppCheck(app);
  } catch {
    return null;
  }
}

export async function verifyIdToken(token: string) {
  const auth = await getAdminAuth();
  if (!auth) return null;
  return auth.verifyIdToken(token);
}

export async function verifyAppCheckToken(token: string) {
  const appCheck = await getAdminAppCheck();
  if (!appCheck) throw new Error("Firebase App Check belum dikonfigurasi.");
  await appCheck.verifyToken(token);
  return true;
}
