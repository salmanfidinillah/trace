# TRACE

> **Know your digital exposure.**

TRACE adalah functional prototype berbahasa Indonesia untuk membantu pengguna menemukan paparan data, memahami risiko, dan mengambil langkah perlindungan.

## Fitur utama

- Pemeriksaan email tanpa login.
- Pemeriksaan password dengan k-anonymity melalui Pwned Passwords range API.
- Risk score deterministik dengan faktor yang dapat dijelaskan.
- Rekomendasi perlindungan dan checklist personal.
- Firebase Authentication dan workspace berbasis Firestore.
- Analis Keamanan AI berbasis Vertex AI dengan fallback rule-based.
- Dataset email demo yang diberi label secara transparan.

## Stack

- Next.js 16, React 19, TypeScript, dan CSS custom.
- Firebase Authentication, Cloud Firestore, dan Firebase Admin SDK.
- Vertex AI melalui Google Gen AI SDK, hanya server-side.
- Vercel untuk deployment Next.js production.

## Arsitektur singkat

Browser mengirim request ke Next.js Route Handlers. Server memvalidasi input, menjalankan provider adapter, menghitung risk score, lalu mengembalikan safe result. Data private diturunkan dari Firebase `uid`; operasi server menggunakan Firebase Admin SDK.

## Demo dataset

Email scanner MVP menggunakan **TRACE Demo Dataset**, bukan katalog breach nyata. Data demo harus tetap ditampilkan sebagai simulasi saat presentasi. Provider breach nyata belum diintegrasikan pada MVP.

## Menjalankan lokal

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Environment dan Firebase

Isi `.env.local` dari `.env.example` dengan Firebase Web configuration. Untuk operasi server, gunakan Firebase Admin service account melalui environment/secret manager atau Application Default Credentials. Jangan commit `.env.local`, private key, atau service account JSON.

Firebase project yang digunakan TRACE adalah `trace-digital-exposure-2026`. Authentication, Firestore, dan rules perlu disiapkan sebelum menguji workspace personal.

## AI behavior

Vertex AI hanya menerima structured security state yang sudah disaring. Password, token, raw breach record, dan secret tidak dikirim ke AI. Jika Vertex AI tidak tersedia, hasil scan tetap berjalan dengan penjelasan rule-based.

## Security baseline

TRACE adalah MVP security baseline, bukan klaim production-grade security. Rate limit, validasi schema, server-side token verification, ownership rules, safe response, dan secret separation diterapkan sesuai scope kompetisi.

## Dokumentasi

- [Project concept](docs/PROJECT_CONCEPT.md)
- [Features](docs/FEATURES.md)
- [User flow](docs/USER-FLOW.md)
- [UI/UX](docs/UI-UX.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database](docs/DATABASE.md)
- [API](docs/API.md)
- [AI system](docs/AI-SYSTEM.md)
- [AI usage](docs/AI_USAGE.md)
- [Security](docs/SECURITY.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Competition readiness](docs/COMPETITION.md)
- [Test plan](docs/TEST-PLAN.md)
- [Firestore access policy](docs/FIRESTORE-RULES.md)
