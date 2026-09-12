import type { Exposure, Recommendation, RiskLevel } from "@/lib/domain/types";

const priorityRank: Record<RiskLevel, number> = { critical: 0, high: 1, elevated: 2, moderate: 3, low: 4 };

export function buildRecommendations(exposures: Exposure[], level: RiskLevel): Recommendation[] {
  const allTypes = new Set(exposures.flatMap((exposure) => exposure.dataTypes.map((type) => type.toLowerCase())));
  const recommendations: Recommendation[] = [];

  if (allTypes.has("password") || allTypes.has("credential")) {
    recommendations.push({
      id: "change-related-passwords",
      title: "Ganti password yang mungkin terdampak",
      description: "Gunakan password baru yang unik pada layanan terkait dan akun lain yang memakai password sama.",
      priority: "critical",
      reason: "Temuan memuat sinyal data autentikasi.",
      status: "todo",
    });
  }

  if (exposures.length > 0) {
    recommendations.push({
      id: "enable-two-factor",
      title: "Aktifkan autentikasi dua faktor",
      description: "Aktifkan 2FA pada email utama dan layanan penting untuk menambah lapisan perlindungan.",
      priority: level === "critical" || level === "high" ? "high" : "elevated",
      reason: "Email exposure dapat meningkatkan risiko phishing dan pengambilalihan akun.",
      status: "todo",
    });
    recommendations.push({
      id: "review-login-activity",
      title: "Periksa aktivitas login",
      description: "Tinjau perangkat dan sesi aktif, lalu keluarkan perangkat yang tidak dikenal.",
      priority: "elevated",
      reason: "Pemeriksaan aktivitas membantu menemukan akses yang tidak dikenal.",
      status: "todo",
    });
    recommendations.push({
      id: "watch-phishing",
      title: "Waspadai pesan phishing",
      description: "Jangan klik tautan atau memberikan kode verifikasi hanya karena pesan menyebut layanan terdampak.",
      priority: "moderate",
      reason: "Data kontak yang terekspos dapat dipakai untuk rekayasa sosial.",
      status: "todo",
    });
  } else {
    recommendations.push({
      id: "keep-unique-passwords",
      title: "Pertahankan password unik",
      description: "Gunakan password berbeda untuk akun penting dan aktifkan 2FA bila tersedia.",
      priority: "low",
      reason: "Tidak ada exposure ditemukan pada sumber yang diperiksa.",
      status: "todo",
    });
  }

  return recommendations.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
}
