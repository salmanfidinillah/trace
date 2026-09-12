import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import type { AiExplanation, SafeScanResult } from "@/lib/domain/types";

const aiOutputSchema = z.object({
  summary: z.string().min(1).max(1200),
  topRisks: z.array(z.string().min(1).max(240)).max(5),
  actions: z.array(z.string().min(1).max(240)).max(6),
  limitations: z.array(z.string().min(1).max(300)).max(4),
});

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
  return `Kamu adalah pendamping edukasi keamanan digital TRACE. Jawab dalam Bahasa Indonesia. Gunakan hanya context JSON berikut. Jangan mengarang provider, tahun, jenis data, atau fakta baru. Jangan meminta password. Jangan mengubah score. Jika pertanyaan tidak bisa dijawab dari context, katakan informasinya belum tersedia. Berikan output JSON persis dengan field summary (string), topRisks (array string), actions (array string), limitations (array string). Pertanyaan pengguna: ${question ?? "Berikan ringkasan kondisi keamanan dan tindakan prioritas."}. Context: ${JSON.stringify(context)}`;
}

export async function generateVertexExplanation(result: Pick<SafeScanResult, "score" | "level" | "exposures" | "recommendations">, question?: string): Promise<AiExplanation | null> {
  const project = process.env.VERTEX_AI_PROJECT_ID;
  if (!project) return null;
  try {
    const vertex = new GoogleGenAI({ vertexai: true, project, location: process.env.VERTEX_AI_LOCATION ?? "global" });
    const response = await vertex.models.generateContent({
      model: process.env.VERTEX_AI_MODEL ?? "gemini-2.5-flash",
      contents: buildPrompt(result, question),
      config: {
        temperature: 0.2,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
        httpOptions: { timeout: 12_000 },
      },
    });
    const text = response.text ?? "";
    const parsed = aiOutputSchema.safeParse(extractJson(text));
    if (!parsed.success) return null;
    return { ...parsed.data, source: "vertex_ai" };
  } catch {
    return null;
  }
}

export async function analyzeSecurityQuestion(question: string, result: Pick<SafeScanResult, "score" | "level" | "exposures" | "recommendations">): Promise<AiExplanation | null> {
  return generateVertexExplanation(result, question);
}
