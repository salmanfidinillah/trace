import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAppCheck, type AppCheck } from "firebase-admin/app-check";
import { getAuth, type Auth } from "firebase-admin/auth";
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

export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export function getAdminAppCheck(): AppCheck | null {
  const app = getAdminApp();
  return app ? getAppCheck(app) : null;
}

export async function verifyIdToken(token: string) {
  const auth = getAdminAuth();
  if (!auth) return null;
  return auth.verifyIdToken(token);
}

export async function verifyAppCheckToken(token: string) {
  const appCheck = getAdminAppCheck();
  if (!appCheck) return false;
  await appCheck.verifyToken(token);
  return true;
}
