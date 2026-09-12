# TRACE — PROJECT CONCEPT

> **TRACE — Digital Exposure Scanner**
>
> **Tagline:** Jaga data. Jaga masa depan.
>
> **Prinsip:** Temukan. Pahami. Lindungi.

## Status Dokumen

- Nama resmi produk: **TRACE**
- Bahasa produk: Bahasa Indonesia; istilah teknis bahasa Inggris hanya jika diperlukan
- Target: functional prototype untuk TCC Vibe Code Competition 2026
- Fase: product discovery sebelum development
- Dokumen ini adalah sumber kebenaran untuk konsep produk

## 1. Ringkasan

TRACE adalah platform keamanan digital yang membantu pengguna mengetahui apakah email mereka pernah muncul dalam kebocoran data, memahami dampaknya, dan memperoleh tindakan perlindungan yang dapat dilakukan.

TRACE tidak berhenti pada pertanyaan “apakah data saya bocor?”. Alur nilainya adalah:

```text
Data exposure
    ↓
Risk score yang dapat dijelaskan
    ↓
Penjelasan AI dalam Bahasa Indonesia
    ↓
Rekomendasi prioritas
    ↓
Checklist perlindungan
```

## 2. Masalah

Pengguna internet, terutama mahasiswa, memakai banyak layanan digital tetapi sering tidak mengetahui:

- apakah emailnya pernah ikut breach;
- layanan dan tahun yang terdampak;
- jenis data yang terekspos;
- seberapa serius risikonya;
- tindakan apa yang harus dilakukan setelah menemukan exposure;
- bagaimana mengurangi risiko phishing dan pengambilalihan akun.

Masalah utama bukan hanya kebocoran data, melainkan kesenjangan antara temuan teknis dan tindakan pengguna.

## 3. Solusi

TRACE menyediakan empat lapisan:

1. **Deteksi** — pemeriksaan email dan password dengan pendekatan privacy-preserving.
2. **Pemahaman** — risk score, faktor penyebab, timeline, dan penjelasan sederhana.
3. **Perlindungan** — rekomendasi yang diprioritaskan serta checklist.
4. **Pemantauan** — riwayat, alert internal, dan roadmap monitoring setelah MVP.

TRACE menggunakan AI melalui Vertex AI hanya sebagai lapisan penjelasan dan edukasi. Data breach dan skor utama tetap berasal dari provider serta risk engine milik sistem.

## 4. Target Pengguna

### Pengguna utama

- mahasiswa;
- pengguna internet umum;
- pengguna yang memiliki banyak akun online;
- pengguna yang pernah menerima email atau pesan mencurigakan.

### Konteks penggunaan

- email kampus;
- media sosial;
- marketplace;
- forum dan layanan gaming;
- layanan produktivitas;
- akun organisasi atau komunitas.

## 5. Kesesuaian dengan tema lomba

TRACE menjawab tema inovasi digital, AI, dan komunitas berkelanjutan melalui literasi keamanan digital. Komunitas yang lebih sadar exposure akan lebih mampu mencegah phishing, pengambilalihan akun, dan penyalahgunaan identitas digital.

Narasi utama:

> TRACE membantu masyarakat bergerak dari “saya tidak tahu kondisi data saya” menjadi “saya memahami risikonya dan tahu tindakan yang harus dilakukan”.

## 6. Nilai unik

TRACE berbeda dari breach checker biasa karena menghubungkan:

- hasil exposure;
- risk scoring yang explainable;
- analisis AI berbasis data terverifikasi;
- rekomendasi tindakan;
- checklist keamanan;
- personal dashboard.

## 7. Scope MVP kompetisi

### Public, tanpa login

- landing page;
- cek email exposure;
- cek password secara privacy-preserving;
- basic risk score;
- basic AI explanation;
- rekomendasi dasar;
- halaman privasi dan edukasi.

### Personal, dengan login Firebase Authentication

- dashboard;
- scan history;
- exposure timeline;
- personal security score;
- personalized AI analyst;
- security checklist;
- recommendation tracking;
- alert internal berdasarkan hasil scan baru;
- pengaturan akun dan privasi.

### Di luar scope kompetisi

- monitoring otomatis 24/7;
- browser extension;
- aplikasi mobile;
- family atau organization dashboard;
- phishing URL scanner;
- otomatis mengganti password;
- dark-web crawling sendiri.

Fitur di luar scope hanya boleh ditampilkan sebagai roadmap dan tidak boleh dipresentasikan sebagai fitur yang sudah tersedia.

## 8. Prinsip produk

1. **Public = Check.** Pengguna memperoleh hasil dasar tanpa dipaksa login.
2. **Account = Protect.** Login memberi history, checklist, rekomendasi, dan personalisasi.
3. **AI menjelaskan, bukan mengarang.** AI menerima structured security data.
4. **Password tidak pernah disimpan.** Password juga tidak dikirim ke Vertex AI.
5. **Setiap risiko harus memiliki tindakan.**
6. **Tidak menakut-nakuti.** Skor tinggi harus diikuti langkah konkret.
7. **Privasi terlihat.** Pengguna diberi tahu data apa yang dikirim dan disimpan.
8. **Bahasa utama Indonesia.** Istilah teknis boleh diberi padanan atau penjelasan.

## 9. Risk score

Gunakan satu skema resmi:

| Skor | Level | Makna |
|---:|---|---|
| 0–20 | Rendah | Sinyal exposure terbatas pada sumber yang diperiksa |
| 21–40 | Sedang | Ada exposure yang membutuhkan perhatian |
| 41–60 | Meningkat | Beberapa faktor meningkatkan risiko akun |
| 61–80 | Tinggi | Diperlukan tindakan perlindungan segera |
| 81–100 | Kritis | Prioritaskan remediasi dan pengamanan akun |

Faktor sistem:

- sensitivitas jenis data: 30%;
- password atau authentication exposure: 30%;
- jumlah exposure: 20%;
- recency: 10%;
- severity sumber: 10%.

Skor harus menyimpan faktor dan alasan yang membentuknya. Jika belum ada data cukup, dashboard menampilkan “Belum cukup data”, bukan skor 0.

## 10. Security dan privacy promise

TRACE:

- tidak menyimpan raw password;
- tidak mengirim password ke AI;
- tidak menampilkan credential atau token hasil breach;
- menggunakan rate limiting dan abuse protection;
- meminimalkan data yang disimpan;
- memberi kontrol penghapusan data kepada pengguna;
- menggunakan provider breach secara legal dan terdokumentasi.

## 11. One-line pitch

> TRACE adalah platform keamanan digital yang membantu pengguna menemukan exposure data, memahami risikonya dengan bantuan AI, dan mengambil langkah nyata untuk melindungi akun mereka.

## 12. Definition of success

Pengguna dapat:

1. memahami TRACE tanpa penjelasan panjang;
2. melakukan email scan tanpa login;
3. melihat hasil dan alasan risiko;
4. memperoleh tindakan prioritas;
5. melakukan password check tanpa membocorkan password;
6. membuat akun dan menyimpan security workspace;
7. melihat timeline, checklist, dan rekomendasi;
8. memahami batasan hasil dan AI.

## 13. Golden rule

> **UI boleh tegas. Logic harus serius. Data harus aman. AI harus jujur. Setiap risiko harus punya tindakan.**
