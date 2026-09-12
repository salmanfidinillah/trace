import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import type { AiExplanation, SafeScanResult } from "@/lib/domain/types";

const aiOutputSchema = z.object({
  response: z.string().min(1).max(1200).optional(),
  summary: z.string().min(1).max(1200).optional(),
  topRisks: z.array(z.string().min(1).max(240)).max(5),
  actions: z.array(z.string().min(1).max(240)).max(6),
  limitations: z.array(z.string().min(1).max(300)).max(4),
}).refine((value) => Boolean(value.response ?? value.summary), { message: "Vertex AI response is missing response text" });

const vertexResponseSchema = {
  type: Type.OBJECT,
  properties: {
    response: { type: Type.STRING, description: "Ringkasan analisis keamanan dalam Bahasa Indonesia." },
    topRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
    actions: { type: Type.ARRAY, items: { type: Type.STRING } },
    limitations: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["response", "topRisks", "actions", "limitations"],
};

function extractJson(text: string): unknown {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  try { return JSON.parse(cleaned); } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    try { return JSON.parse(cleaned.slice(start, end + 1)); } catch { return null; }
  }
}

function buildPrompt(result: Pick<SafeScanResult, "score" | "level" | "exposures" | "recommendations">, question?: string): string {
  const context = {
    score: result.score,
    level: result.level,
    exposures: result.exposures.map(({ serviceName, year, dataTypes, severity }) => ({ serviceName, year, dataTypes, severity })),
    recommendations: result.recommendations.map(({ title, description, priority }) => ({ title, description, priority })),
  };
  return `Kamu adalah pendamping edukasi keamanan digital TRACE. Jawab dalam Bahasa Indonesia. Gunakan hanya context JSON berikut. Jangan mengarang provider, tahun, jenis data, atau fakta baru. Jangan meminta password. Jangan mengubah score. Jika pertanyaan tidak bisa dijawab dari context, katakan informasinya belum tersedia. Berikan output JSON persis dengan field response (string), topRisks (array string), actions (array string), limitations (array string). Pertanyaan pengguna: ${question ?? "Berikan ringkasan kondisi keamanan dan tindakan prioritas."}. Context: ${JSON.stringify(context)}`;
}

export async function generateVertexExplanation(result: Pick<SafeScanResult, "score" | "level" | "exposures" | "recommendations">, question?: string): Promise<AiExplanation | null> {
  const explicitlyDisabled = process.env.VERTEX_AI_ENABLED?.toLowerCase() === "false";
  const project = process.env.VERTEX_AI_PROJECT_ID ?? process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.VERTEX_AI_LOCATION ?? process.env.GOOGLE_CLOUD_LOCATION ?? "global";
  const model = process.env.VERTEX_AI_MODEL ?? "gemini-2.5-flash-lite";
  if (explicitlyDisabled) {
    console.warn("TRACE_VERTEX_DISABLED", { reason: "VERTEX_AI_ENABLED=false" });
    return null;
  }
  if (!project) {
    console.error("TRACE_VERTEX_CONFIG_MISSING", { missing: ["VERTEX_AI_PROJECT_ID or GOOGLE_CLOUD_PROJECT"] });
    return null;
  }
  const clientEmail = process.env.VERTEX_AI_CLIENT_EMAIL ?? process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.VERTEX_AI_PRIVATE_KEY ?? process.env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, "\n");
  const googleAuthOptions = clientEmail && privateKey
    ? { credentials: { client_email: clientEmail, private_key: privateKey }, projectId: project }
    : undefined;
  try {
    const vertex = new GoogleGenAI({ vertexai: true, project, location, apiVersion: "v1", googleAuthOptions });
    console.info("TRACE_VERTEX_REQUEST_START", { project, location, model });
    const response = await vertex.models.generateContent({
      model,
      contents: buildPrompt(result, question),
      config: {
        temperature: 0.2,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
        responseSchema: vertexResponseSchema,
        httpOptions: { timeout: 12_000 },
      },
    });
    const text = response.text ?? "";
    const parsed = aiOutputSchema.safeParse(extractJson(text));
    if (!parsed.success) {
      console.error("TRACE_VERTEX_RESPONSE_INVALID", { model, responseLength: text.length, issues: parsed.error.issues.map((issue) => issue.path.join(".") || issue.code) });
      return null;
    }
    const responseText = parsed.data.response ?? parsed.data.summary;
    if (!responseText) return null;
    console.info("TRACE_VERTEX_REQUEST_SUCCESS", { model, responseLength: responseText.length });
    return { ...parsed.data, response: responseText, summary: responseText, source: "vertex_ai" };
  } catch (error) {
    const details = error instanceof Error
      ? { name: error.name, message: error.message.slice(0, 500) }
      : { name: "UnknownError", message: String(error).slice(0, 500) };
    console.error("TRACE_VERTEX_REQUEST_FAILED", { project, location, model, ...details });
    return null;
  }
}

export async function analyzeSecurityQuestion(question: string, result: Pick<SafeScanResult, "score" | "level" | "exposures" | "recommendations">): Promise<AiExplanation | null> {
  return generateVertexExplanation(result, question);
}
