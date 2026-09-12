import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/server/firebase-admin";

type Bucket = { count: number; resetAt: number };
const memoryBuckets = new Map<string, Bucket>();

function fingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

export async function consumeRateLimit(key: string, limit = Number(process.env.TRACE_PUBLIC_SCAN_LIMIT ?? 10), windowMs = 60_000): Promise<boolean> {
  const now = Date.now();
  const safeKey = fingerprint(key);
  const db = getAdminDb();
  if (db) {
    const bucketId = `${safeKey}-${Math.floor(now / windowMs)}`;
    const ref = db.collection("systemRateLimits").doc(bucketId);
    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      const count = snapshot.exists ? Number(snapshot.data()?.count ?? 0) : 0;
      if (count >= limit) return false;
      transaction.set(ref, { count: FieldValue.increment(1), expiresAt: new Date(now + windowMs) }, { merge: true });
      return true;
    });
    return result;
  }

  const existing = memoryBuckets.get(safeKey);
  if (!existing || existing.resetAt <= now) {
    memoryBuckets.set(safeKey, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (existing.count >= limit) return false;
  existing.count += 1;
  return true;
}
