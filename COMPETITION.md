# TRACE — COMPETITION READINESS

## 1. Kepatuhan utama

TRACE harus dikumpulkan sebagai website functional prototype, menggunakan Bahasa Indonesia, memanfaatkan AI, dan menyertakan salah satu logo resmi TCC/Triple-C/JACK 2026.

Karya tidak boleh:

- pernah dipublikasikan sebelum pengumpulan;
- memakai template website jadi;
- memuat SARA, pornografi, promosi, atau konten negatif;
- mengklaim fitur yang belum dibangun.

## 2. Bukti penggunaan AI

Sediakan dokumen `AI_USAGE.md` atau bagian README yang menjelaskan:

- AI yang dipakai selama discovery, desain, coding, testing, dan dokumentasi;
- tujuan setiap penggunaan AI;
- prompt utama secara garis besar;
- bagian yang dihasilkan dengan bantuan AI;
- bagian yang direview, dimodifikasi, dan diputuskan manual;
- bagaimana scalability, keamanan, dan fungsionalitas dipahami oleh tim.

## 3. Bukti orisinalitas

- gunakan desain custom TRACE;
- hindari starter template yang terlihat generik;
- gunakan visual buatan sendiri atau aset berlisensi;
- tulis sumber aset pada source code saat development;
- sertakan pernyataan karya sendiri sesuai ketentuan finalis.

## 4. Rencana demo

```text
Landing
→ Email scan
→ Exposure result
→ Explainable score
→ Vertex AI explanation
→ Recommendation
→ Register
→ Dashboard
→ Checklist
```

Demo harus menjelaskan satu masalah dan satu perjalanan pengguna, bukan sekadar memamerkan banyak halaman.

## 5. Pemetaan rubric

### Inovasi dan solusi — 25%

Tunjukkan masalah nyata, target mahasiswa/masyarakat, dan hubungan detect–understand–protect.

### Teknologi dan AI — 30%

Tunjukkan Firebase, Firestore, Vertex AI, provider adapter, explainable risk engine, dan guardrail.

### Fungsionalitas — 30%

Pastikan alur email scan, password check, login, dashboard, history, rekomendasi, dan checklist dapat digunakan.

### UI/UX — 15%

Tunjukkan Bahasa Indonesia, responsive layout, konsistensi visual, accessibility, serta state loading/error/empty.

## 6. File pengumpulan

- link GitHub;
- PDF deskripsi singkat 150 kata;
- README instalasi dan deployment;
- dokumentasi AI;
- dokumentasi arsitektur dan keamanan;
- akun/demo credential jika diperlukan dan aman dibagikan;
- screenshot atau video demo bila diminta panitia.

## 7. Catatan demo data

Jika menggunakan dataset demo karena provider eksternal tidak stabil, tampilkan label **Demo data** secara jelas dan jelaskan pada presentasi. Jangan mempresentasikan angka contoh sebagai statistik dunia nyata.

## 8. One-minute pitch

> Banyak pengguna tidak tahu apakah data digitalnya pernah terekspos dan apa yang harus dilakukan setelahnya. TRACE membantu pengguna memeriksa exposure, memahami tingkat risiko dengan risk scoring yang transparan, lalu mendapatkan penjelasan AI dan rekomendasi perlindungan dalam Bahasa Indonesia. Dengan Firebase, Firestore, dan Vertex AI, TRACE dirancang sebagai functional prototype yang aman, mudah digunakan, dan dapat dikembangkan menjadi personal digital security center.
