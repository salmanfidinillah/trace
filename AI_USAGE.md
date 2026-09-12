# TRACE — AI USAGE LOG

Dokumen ini disiapkan untuk memenuhi ketentuan lomba bahwa peserta harus memahami seluruh bagian yang dibuat dengan bantuan AI.

## 1. AI yang digunakan

Rencana penggunaan:

- AI coding assistant untuk membantu scaffolding, refactoring, test, dan dokumentasi;
- Vertex AI untuk fitur Analis Keamanan AI di dalam produk;
- alat AI desain bila digunakan, dengan aset dan lisensi yang dicatat.

Nama model, tanggal penggunaan, dan versi final dicatat ketika development dimulai.

## 2. Penggunaan AI pada proses development

Catat setiap pekerjaan dalam tabel berikut:

| Area | Tujuan AI | Output AI | Review/modifikasi manual |
|---|---|---|---|
| Discovery | merangkum masalah dan alternatif fitur | draft konsep | tim memilih scope dan target |
| UI/UX | membuat alternatif copy dan layout | draft wireframe/copy | tim menyesuaikan Bahasa Indonesia |
| Frontend | membantu komponen dan state | draft kode | tim memeriksa aksesibilitas dan logic |
| Backend | membantu validasi/service | draft kode | tim memeriksa security dan ownership |
| Testing | membuat kasus uji | draft test | tim menambah edge case dan security test |
| Dokumentasi | merapikan penjelasan | draft dokumen | tim memverifikasi seluruh klaim |

## 3. Prompt utama secara garis besar

- “Rancang alur aplikasi pemeriksaan exposure data yang dapat dipahami mahasiswa.”
- “Buat risk scoring yang explainable dan tidak menggunakan AI sebagai sumber kebenaran.”
- “Review rancangan Firebase/Firestore untuk ownership dan privacy.”
- “Buat strategi Vertex AI yang tidak mengirim password atau raw breach record.”
- “Buat test case untuk public scan, login, authorization, rate limit, dan prompt injection.”

Prompt final dan konteks sensitif tidak boleh berisi credential, token, atau data pengguna nyata.

## 4. Penggunaan Vertex AI dalam produk

Vertex AI hanya digunakan untuk:

- menjelaskan hasil scan;
- menyusun ringkasan;
- memprioritaskan bahasa rekomendasi berdasarkan rekomendasi sistem;
- menjawab pertanyaan yang masih berada dalam security state pengguna.

Vertex AI tidak menghitung fakta breach utama, tidak menerima password, dan tidak mengubah risk score.

## 5. Bagian yang harus dipahami tim

Sebelum presentasi, setiap anggota harus mampu menjelaskan:

- Firebase Authentication dan verifikasi token;
- struktur Firestore dan Security Rules;
- alur provider breach;
- risk engine dan bobotnya;
- context whitelist Vertex AI;
- fallback jika AI gagal;
- rate limiting dan privacy;
- alasan pemilihan arsitektur dan scalability path.

## 6. Bukti dan audit

Simpan:

- versi prompt;
- tanggal dan tujuan penggunaan AI;
- link commit yang dihasilkan atau dibantu AI;
- catatan modifikasi manual;
- hasil review dan test;
- keputusan yang ditolak dari saran AI beserta alasannya.
