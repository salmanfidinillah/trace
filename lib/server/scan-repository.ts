import type { Firestore } from "firebase-admin/firestore";
import type { SafeScanResult } from "@/lib/domain/types";

export async function persistScan(db: Firestore, uid: string, result: SafeScanResult, email: string): Promise<string> {
  const userRef = db.collection("users").doc(uid);
  const scanRef = userRef.collection("scans").doc();
  const now = new Date();
  const batch = db.batch();
  batch.set(userRef, { uid, email, updatedAt: now }, { merge: true });
  batch.set(scanRef, {
    type: "email",
    status: result.status,
    maskedIdentifier: email.replace(/^(.{2}).*(@.*)$/, "$1***$2"),
    identifierFingerprint: null,
    score: result.score,
    level: result.level,
    exposureCount: result.exposureCount,
    providerName: result.providerName,
    providerVersion: null,
    createdAt: now,
    completedAt: now,
    expiresAt: null,
    factors: result.factors,
    limitations: result.limitations,
    isDemoData: result.isDemoData,
    exposureSummary: result.exposures,
  });
  for (const exposure of result.exposures) {
    batch.set(scanRef.collection("exposures").doc(exposure.id), exposure);
  }
  for (const recommendation of result.recommendations) {
    batch.set(userRef.collection("recommendations").doc(`${scanRef.id}-${recommendation.id}`), {
      ...recommendation,
      sourceScanId: scanRef.id,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    });
  }
  if (result.exposureCount > 0) {
    const alertRef = userRef.collection("alerts").doc(`${scanRef.id}-new-exposure`);
    batch.set(alertRef, {
      type: "new_exposure",
      title: "Exposure baru terdeteksi",
      message: `${result.exposureCount} exposure ditemukan pada pemeriksaan terakhir.`,
      severity: result.level === "critical" || result.level === "high" ? "high" : "warning",
      read: false,
      sourceScanId: scanRef.id,
      createdAt: now,
    });
  }
  await batch.commit();
  return scanRef.id;
}

export async function getDashboard(db: Firestore, uid: string) {
  const userRef = db.collection("users").doc(uid);
  const [userSnapshot, scansSnapshot, recommendationsSnapshot, alertsSnapshot, checklistSnapshot] = await Promise.all([
    userRef.get(),
    userRef.collection("scans").orderBy("createdAt", "desc").limit(10).get(),
    userRef.collection("recommendations").orderBy("createdAt", "desc").limit(20).get(),
    userRef.collection("alerts").orderBy("createdAt", "desc").limit(20).get(),
    userRef.collection("checklist").orderBy("order").get(),
  ]);

  const scans = scansSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null }));
  const latest = scans[0] as { score?: number; level?: string } | undefined;
  const checklist = checklistSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const recommendationItems = recommendationsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<{ id: string; status?: string }>;
  const alertItems = alertsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<{ id: string; read?: boolean }>;
  return {
    user: userSnapshot.exists ? { uid, ...userSnapshot.data() } : { uid },
    score: latest?.score ?? null,
    level: latest?.level ?? null,
    scans,
    recommendations: recommendationItems.filter((item) => item.status !== "done").slice(0, 5),
    alerts: alertItems.filter((item) => item.read !== true).slice(0, 10),
    checklist,
  };
}
