# TRACE — FEATURE SPECIFICATION

> Dokumen otoritatif fitur TRACE untuk MVP kompetisi dan fondasi produk.

## 1. Model akses

| Fitur | Tanpa login | Dengan login |
|---|:---:|:---:|
| Landing page | Ya | Ya |
| Cek email exposure | Ya | Ya |
| Hasil dasar dan risk score | Ya | Ya |
| Cek password | Ya | Ya |
| Basic AI explanation | Ya | Ya |
| Dashboard personal | Tidak | Ya |
| Riwayat scan | Tidak | Ya |
| Exposure timeline | Tidak | Ya |
| Personal security score | Tidak | Ya |
| Analis Keamanan AI | Tidak | Ya |
| Checklist dan tracking rekomendasi | Tidak | Ya |
| Alert internal | Tidak | Ya |

Prinsipnya: **Public = Check; Account = Protect + Monitor.**

## 2. Prioritas

- **P0:** wajib berfungsi untuk demo dan penilaian.
- **P1:** wajib menjadi personal workspace jika waktu dan stabilitas memungkinkan.
- **P2:** roadmap setelah kompetisi.

## 3. P0 — fitur inti

### F01 — Landing page

Komponen: navbar, hero, email checker, CTA password checker, penjelasan manfaat, cara kerja, privasi, FAQ, logo panitia, dan footer.

Kriteria selesai:

- tujuan TRACE dipahami dalam beberapa detik;
- CTA menuju email scan berfungsi;
- Bahasa Indonesia dominan;
- responsive dan accessible;
- tidak ada klaim keamanan absolut.

### F02 — Email exposure scanner

Input hanya alamat email. Sistem melakukan validasi, normalisasi, rate limit, provider lookup, normalisasi hasil, risk scoring, dan safe response.

Output:

- status ditemukan/tidak ditemukan;
- jumlah exposure;
- layanan dan tahun;
- jenis data;
- severity;
- risk score dan level;
- rekomendasi;
- penjelasan AI jika tersedia.

Kriteria selesai:

- hasil berasal dari provider atau dataset demo yang diberi label jelas;
- raw provider response tidak dikirim ke browser;
- error dan provider unavailable memiliki state yang informatif;
- endpoint tidak dapat digunakan untuk unlimited enumeration.

### F03 — Result page

Urutan informasi:

```text
Status
  ↓
Risk score
  ↓
Apa yang terekspos
  ↓
Mengapa berisiko
  ↓
Apa yang harus dilakukan
```

Tidak boleh menampilkan password, token, credential, atau data korban lain.

### F04 — Explainable risk engine

Risk engine deterministik dan berjalan sebelum AI. Level resmi: Rendah, Sedang, Meningkat, Tinggi, Kritis. Setiap skor menyimpan faktor, bobot, dan alasan yang ditampilkan kepada pengguna dalam bahasa sederhana.

### F05 — Password safety checker

Raw password tidak boleh masuk database, log, analytics, prompt AI, atau history. Gunakan proses lokal atau privacy-preserving lookup. Hasil hanya berupa sinyal exposure, bukan klaim “password aman”.

### F06 — Basic AI explanation

Vertex AI menerima structured result yang sudah disaring, bukan email mentah, password, raw breach record, atau secret. Output divalidasi dan memiliki fallback berbasis template jika AI gagal.

## 4. P1 — personal workspace

### F07 — Firebase Authentication

Mendukung email/password atau provider OAuth yang dipilih. Session dikelola melalui Firebase Authentication dan token diverifikasi di server untuk operasi sensitif.

### F08 — Dashboard

Widget: personal score, jumlah exposure, aksi tertunda, alert, scan terakhir, rekomendasi prioritas, dan checklist progress.

### F09 — Scan history

Menyimpan tipe scan, timestamp, status, score, level, dan ringkasan aman. Raw password tidak pernah disimpan. Pengguna dapat melihat dan menghapus data yang tersedia untuk dihapus.

### F10 — Exposure timeline

Mengelompokkan exposure berdasarkan tahun dan layanan. Detail hanya menampilkan jenis data serta severity yang aman.

### F11 — Personal security score

Berbeda dari skor satu scan. Score personal dihitung dari exposure yang tersedia, password exposure signal, alert, dan progres tindakan. Jika data belum cukup, tampilkan status belum cukup data.

### F12 — Analis Keamanan AI

Menyediakan ringkasan, risiko utama, alasan, tindakan prioritas, edukasi, dan pertanyaan lanjutan. AI tidak melakukan perubahan akun atau tindakan keamanan otomatis.

### F13 — Checklist

Daftar tindakan default: password unik, ganti password terkait, aktifkan 2FA, periksa aktivitas login, perbarui recovery information, dan waspadai phishing. Status minimal TODO/DONE.

### F14 — Recommendations

Setiap rekomendasi berisi masalah, dampak, langkah, prioritas, sumber faktor, dan status. Maksimal 3–5 rekomendasi prioritas ditampilkan pada dashboard.

### F15 — Alert internal

MVP hanya membuat alert internal berdasarkan hasil scan baru atau perubahan status. Jangan menyebut continuous monitoring jika belum ada scheduler/provider monitoring.

## 5. State wajib

Setiap fitur asynchronous harus memiliki:

- idle;
- loading;
- success;
- empty;
- error;
- retry;
- rate limited;
- unauthorized/forbidden jika relevan.

## 6. Anti-pattern yang dilarang

- login wall sebelum hasil dasar;
- fake scan tanpa label;
- fake AI yang tidak menerima data hasil scan;
- klaim “100% aman”;
- fear-mongering;
- menampilkan raw leaked credential;
- mengklaim monitoring yang belum dibangun;
- menyimpan password untuk kemudahan demo.

## 7. Fitur roadmap P2

- continuous email monitoring;
- multiple email monitoring;
- phishing URL checker;
- suspicious email analyzer;
- security report PDF;
- score history;
- organization dan family workspace;
- browser extension;
- mobile application.

## 8. Definition of Done fitur MVP

- alur utama dapat dicoba dari browser;
- data provider dinormalisasi;
- risk score konsisten;
- AI memiliki guardrail dan fallback;
- Firebase Auth dan Firestore rules diuji;
- password tidak pernah disimpan;
- loading, error, empty, dan retry tersedia;
- mobile layout dapat digunakan;
- README dan dokumentasi AI tersedia;
- demo tidak bergantung pada data yang menyesatkan.
