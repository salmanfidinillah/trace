# TRACE — AI SYSTEM SPECIFICATION

## 1. Peran AI

Vertex AI digunakan secara opsional untuk:

- menerjemahkan hasil keamanan menjadi Bahasa Indonesia;
- menjelaskan faktor risiko;
- menyusun tindakan prioritas;
- memberi edukasi keamanan;
- menjawab pertanyaan lanjutan berdasarkan security state user.

Vertex AI bukan sumber data breach, bukan risk engine, dan tidak boleh melakukan tindakan akun tanpa persetujuan.

## 2. Arsitektur

```text
Verified provider data
        ↓
Normalized exposure
        ↓
Deterministic risk engine
        ↓
AI context builder
        ↓
Vertex AI server-side
        ↓
Schema validation
        ↓
Safe UI response
```

## 3. Context whitelist

Yang boleh dikirim:

- score dan level;
- faktor risiko;
- jumlah exposure;
- nama layanan yang aman untuk ditampilkan;
- tahun;
- jenis data;
- rekomendasi hasil rule engine;
- pertanyaan user yang sudah divalidasi.

Yang dilarang:

- password;
- token atau cookie;
- raw breach record;
- data user lain;
- secret environment;
- prompt internal yang tidak perlu;
- identifier lengkap jika tidak diperlukan.

## 4. Output contract

Vertex AI diminta menghasilkan struktur:

```text
summary: string
topRisks: string[]
actions: string[]
limitations: string[]
```

Output harus:

- berbahasa Indonesia;
- tidak mengubah score;
- tidak menambahkan nama breach yang tidak ada di context;
- tidak meminta password;
- tidak menyatakan akun pasti aman atau pasti diretas;
- membedakan fakta dari saran umum.

Jika format gagal divalidasi, gunakan fallback rule-based.

## 5. Prompt policy

Prompt versi awal harus memuat instruksi:

1. Kamu adalah pendamping edukasi keamanan digital TRACE.
2. Gunakan hanya data pada context.
3. Jangan mengarang provider, layanan, tahun, atau jenis data.
4. Jangan meminta atau memproses password.
5. Jangan mengubah skor yang diberikan risk engine.
6. Jawab ringkas, jelas, tidak menakut-nakuti, dan berorientasi tindakan.
7. Nyatakan keterbatasan jika context tidak cukup.

Simpan versi prompt, bukan secret atau data mentah, agar hasil dapat diaudit.

## 6. Prompt injection defense

- context dibangun dari field terpilih, bukan raw provider response;
- output dibatasi schema sebelum dikirim ke UI;
- pertanyaan dibatasi panjangnya dan React melakukan output escaping;
- fallback rule-based menjaga hasil tetap tersedia jika AI gagal.

Ini adalah baseline MVP. Pengujian prompt injection adversarial dan sanitasi markdown khusus belum menjadi fitur terpisah.

## 7. Privacy dan Vertex AI

Gunakan konfigurasi cloud yang sesuai untuk mengontrol logging, retention, region, dan akses. Jangan mengirim raw identifier atau password. Service account Vertex AI hanya memiliki permission minimum.

## 8. Fallback

Jika Vertex AI timeout, quota habis, output invalid, atau service unavailable:

- hasil scan tetap ditampilkan;
- risk score tetap berasal dari engine;
- rekomendasi rule-based ditampilkan;
- UI menyatakan analisis AI sementara tidak tersedia.

## 9. Status implementasi MVP

- Vertex AI menjadi provider utama jika `VERTEX_AI_PROJECT_ID` atau `GOOGLE_CLOUD_PROJECT` tersedia dan runtime memiliki permission yang sesuai. `VERTEX_AI_ENABLED=false` hanya untuk menonaktifkan secara eksplisit.
- Fallback rule-based selalu tersedia ketika Vertex AI tidak dikonfigurasi, timeout, quota habis, atau output gagal divalidasi.
- Demo competition tetap berjalan tanpa Vertex AI.

## 10. Dokumentasi penggunaan AI untuk lomba

Siapkan catatan:

- model/service Vertex AI yang digunakan;
- alasan pemilihan;
- tujuan setiap prompt;
- bagian UI atau arsitektur yang dibantu AI;
- bagian yang dibuat dan diperiksa manual;
- guardrail dan validasi;
- pengujian hallucination dan prompt injection.
