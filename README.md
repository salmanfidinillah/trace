# TRACE

> **Jaga data. Jaga masa depan.**

TRACE adalah platform keamanan digital berbahasa Indonesia untuk menemukan paparan data, memahami risiko, dan melakukan langkah perlindungan.

## Status

Project saat ini berada pada tahap perancangan. Source code belum mulai dibangun.

## Dokumen utama

1. [PROJECT_CONCEPT.md](PROJECT_CONCEPT.md) — konsep dan keputusan produk
2. [FEATURES(1).md](FEATURES(1).md) — fitur dan acceptance criteria
3. [USER-FLOW(1).md](USER-FLOW(1).md) — alur pengguna
4. [ui-ux.md](ui-ux.md) — sistem UI/UX
5. [ARCHITECTURE.md](ARCHITECTURE.md) — arsitektur aplikasi
6. [DATABASE.md](DATABASE.md) — desain Firestore
7. [API.md](API.md) — kontrak API
8. [AI-SYSTEM.md](AI-SYSTEM.md) — Vertex AI dan guardrail
9. [SECURITY.md](SECURITY.md) — keamanan dan privasi
10. [DEPLOYMENT.md](DEPLOYMENT.md) — cloud deployment dan operasi
11. [COMPETITION.md](COMPETITION.md) — kesiapan lomba
12. [AI_USAGE.md](AI_USAGE.md) — dokumentasi pemanfaatan AI

## Keputusan teknologi

- Web: Next.js, React, TypeScript
- Auth: Firebase Authentication
- Database: Cloud Firestore
- Backend operations: Cloud Functions atau server runtime terproteksi
- AI: Vertex AI, hanya server-side
- Deployment: cloud dengan HTTPS

## Prinsip penting

- bahasa antarmuka utama Bahasa Indonesia;
- public user dapat melakukan pemeriksaan dasar tanpa login;
- password tidak pernah disimpan atau dikirim ke AI;
- AI hanya menjelaskan structured data yang sudah diverifikasi;
- data private dibatasi berdasarkan Firebase `uid`;
- data demo harus diberi label;
- fitur roadmap tidak boleh diklaim sudah tersedia.

## Sebelum coding

- pilih provider breach yang legal dan tersedia;
- buat Firebase project development/staging/production;
- aktifkan Firebase Emulator Suite;
- salin `.firebaserc.example` menjadi `.firebaserc` dan isi project id lokal;
- finalisasi copy UI dan logo lomba;
- siapkan prompt dan catatan AI;
- siapkan test plan berdasarkan dokumen security.
