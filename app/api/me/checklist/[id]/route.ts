import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/server/auth-context";
import { getAdminDb } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getAuthContext(request);
  if (!auth) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Silakan masuk." } }, { status: 401 });
  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: { code: "FIREBASE_NOT_CONFIGURED", message: "Firebase server belum dikonfigurasi." } }, { status: 503 });
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const status = body.status === "done" ? "done" : "todo";
  await db.collection("users").doc(auth.uid).collection("checklist").doc(id).update({ status, updatedAt: new Date() });
  return NextResponse.json({ data: { id, status } });
}
