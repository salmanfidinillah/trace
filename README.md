# TRACE — Digital Security Advisor

> **Know your digital exposure. Understand the risk. Take the next safe step.**

## Tentang karya

Kebocoran data sering berhenti sebagai berita teknis yang sulit dipahami pengguna. TRACE menerjemahkan hasil pemeriksaan exposure menjadi risk score yang dapat dijelaskan, bahasa yang sederhana, dan langkah perlindungan yang bisa dikerjakan satu per satu.

TRACE dirancang dengan prinsip **Check → Understand → Protect → Monitor**. Pengunjung dapat melakukan pemeriksaan email dan password tanpa login. Akun Firebase membuka workspace personal untuk menyimpan hasil email scan, melihat rekomendasi, memantau timeline, dan mengelola checklist keamanan.

TRACE AI Security Advisor memperkuat pengalaman tersebut dengan menjelaskan apa yang terjadi, risiko yang relevan, alasan skor, Security Health, serta Personalized Security Plan. AI menerima structured security state yang sudah disanitasi; password, token, raw provider response, dan data pengguna lain tidak masuk ke context AI.


**Karya Cabang Vibe Code — Web Application Development**<br>
**Trunodjoyo Creative Competition (TCC) 2026 — UKM Triple-C, Universitas Trunojoyo Madura**<br>
**Tema:** *Shaping Tomorrow: Digital Innovation, Artificial Intelligence, and Sustainable Communities*

## Jelajahi TRACE
Website production: [https://www.tracee.web.id/](https://www.tracee.web.id/)

- 🌐 [Platform live](https://www.tracee.web.id/)
- 💻 [Source code](https://github.com/salmanfidinillah/trace)
- 🏷️ [Submission tag: `tcc-2026-final`](https://github.com/salmanfidinillah/trace/tree/tcc-2026-final)
- 📚 [Indeks dokumentasi](docs/)
- 📑 [Deskripsi karya PDF](docs/TRACE_TCC_2026_Deskripsi_Karya.pdf)
- 📄 [Panduan kesiapan kompetisi](docs/COMPETITION.md)


## Kesesuaian dengan tema

### Digital Innovation

TRACE menggabungkan public security scan, explainable risk engine, provider adapter, Firebase workspace, dan UI responsif dalam satu functional prototype yang dapat dicoba langsung.

### Artificial Intelligence

Vertex AI disiapkan sebagai lapisan penjelasan keamanan server-side. AI tidak menjadi sumber fakta breach dan tidak mengubah risk score. Jika Vertex AI belum tersedia atau tidak diaktifkan, TRACE tetap memberikan analisis rule-based yang transparan sehingga alur demo tidak berhenti.

### Sustainable Communities

TRACE membantu pengguna bergerak dari korban pasif menjadi individu yang memahami risiko dan mampu mengambil tindakan. Literasi keamanan yang lebih mudah dipahami membantu membangun komunitas digital kampus dan masyarakat yang lebih sadar, mandiri, dan tangguh.

## Modul utama

| Modul | Fungsi | Prinsip keamanan |
|---|---|---|
| 🔍 Email Exposure Scanner | Memeriksa apakah email cocok dengan exposure pada provider yang dikonfigurasi | Bisa digunakan tanpa login; input divalidasi, diberi rate limit, dan response provider disanitasi |
| 🔐 Password Safety Checker | Memeriksa sinyal password pada Pwned Passwords range API | Password mentah diproses lokal dengan SHA-1; TRACE hanya menerima bagian hash, bukan password asli |
| 🤖 TRACE AI Security Advisor | Menjelaskan score, faktor, risiko, dan tindakan prioritas | Context whitelist, output schema, fallback rule-based, dan AI server-side |
| 📊 Personal Workspace | Menyimpan safe scan result dan ringkasan rekomendasi untuk user terverifikasi | Semua query private dibatasi dengan Firebase `uid` |
| ✅ Security Checklist | Menandai tindakan keamanan sebagai `todo` atau `done` | Update dibatasi oleh ownership dan field whitelist Firestore |
| ⏱️ Exposure Timeline | Menyusun exposure berdasarkan layanan, tahun, jenis data, dan severity | Hanya metadata yang sudah dinormalisasi ditampilkan |

## Data demo dan HIBP

Untuk menjaga demo juri tetap stabil dan tidak bergantung pada kuota layanan komersial, deployment live saat ini menggunakan **TRACE Demo Dataset**. Dataset tersebut adalah data sintetis terkurasi untuk demonstrasi, bukan klaim kebocoran nyata dan bukan statistik dunia nyata. Label demo ditampilkan di hasil pemeriksaan.

Integrasi provider breach nyata tersedia melalui adapter di [`lib/providers/breach.ts`](lib/providers/breach.ts). HIBP dapat diaktifkan ketika API key berbayar dan kebijakan penggunaan sudah tersedia dengan konfigurasi server-side berikut:

```ini
TRACE_BREACH_PROVIDER=hibp
TRACE_BREACH_API_KEY=your_server_only_key
```

Tanpa konfigurasi tersebut, aplikasi tidak berpura-pura sedang memakai katalog breach produksi. Password checker tetap memakai Pwned Passwords range API dan hanya mengembalikan status untuk sumber yang diperiksa, bukan jaminan keamanan absolut.

## Alur AI yang aman

```mermaid
flowchart LR
  A[Email exposure / password signal] --> B[Safe normalized result]
  B --> C[Deterministic risk engine]
  C --> D[Structured AI context]
  D --> E{Vertex AI enabled?}
  E -->|Yes| F[Schema-validated explanation]
  E -->|No / failed| G[Rule-based fallback]
  F --> H[Advisor + recommendations + checklist]
  G --> H
```

AI hanya menerima field yang diperlukan, seperti score, level, faktor, jumlah exposure, metadata layanan, tahun, jenis data, dan rekomendasi. AI tidak menerima password, token, secret, raw email, raw breach dump, atau data user lain.

## Privacy-preserving password check

1. Password di-hash dengan SHA-1 di browser melalui Web Crypto API.
2. Browser mengirim prefix dan suffix hash ke route server; password mentah tidak pernah dikirim.
3. Server meminta range berdasarkan prefix ke Pwned Passwords API.
4. Server mencocokkan suffix pada response range lalu hanya mengembalikan status dan rekomendasi.
5. Password mentah tidak disimpan di Firestore, log, prompt AI, history, atau analytics.

## Akses fitur

| Fitur | Tanpa login | Dengan login |
|---|:---:|:---:|
| Landing page | ✅ | ✅ |
| Email scan dan hasil dasar | ✅ | ✅ |
| Password safety checker | ✅ | ✅ |
| TRACE AI Advisor pada hasil scan | ✅ | ✅ |
| Workspace personal | — | ✅ |
| Riwayat dan timeline | — | ✅ |
| Checklist tersimpan | — | ✅ |
| Analis AI berbasis dashboard | — | ✅ |

Prinsip produk TRACE: **Public = Check; Account = Protect + Monitor.**

## Struktur repository

```text
trace/
├── app/
│   ├── api/                  # Route handlers scan, auth workspace, dan AI analyst
│   ├── dashboard/            # Dashboard, timeline, dan analyst
│   └── scan/                 # Public email/password scan dan hasil
├── components/               # UI forms, result view, advisor, auth, dashboard
├── lib/
│   ├── ai/                   # Vertex AI adapter dan output validation
│   ├── domain/               # Risk engine, recommendations, advisor model
│   ├── providers/            # Breach dan password provider adapters
│   └── server/               # Auth context, rate limit, Firestore repository
├── docs/                     # Arsitektur, API, security, AI, dan competition notes
├── tests/                    # Unit tests domain, validation, dan auth policy
├── public/                   # Logo TRACE dan partner marks
├── firestore.rules           # Ownership dan field-level access policy
└── package.json              # Script dan dependency project
```

## Teknologi

- **Frontend:** Next.js 16 App Router, React 19, TypeScript strict mode, custom CSS design system.
- **Backend:** Next.js Route Handlers dengan Node.js runtime di Vercel.
- **Authentication:** Firebase Authentication, email/password, Google Sign-In, dan verifikasi email.
- **Database:** Cloud Firestore melalui Firebase Admin SDK untuk operasi server-side.
- **AI:** Google Gen AI SDK untuk Vertex AI secara optional dan server-side, dengan fallback rule-based.
- **Validation:** Zod untuk input dan output contract.
- **Testing:** Vitest, TypeScript, ESLint, dan production build verification.

## Menjalankan secara lokal

### Prasyarat

- Node.js 18 atau lebih baru.
- npm.
- Firebase configuration untuk fitur authentication/workspace.
- Firebase Admin credentials untuk operasi private server-side.

```bash
git clone https://github.com/salmanfidinillah/trace.git
cd trace
npm install
```

Salin environment template:

```powershell
Copy-Item .env.example .env.local
```

Untuk demo lokal, gunakan:

```ini
TRACE_BREACH_PROVIDER=demo
VERTEX_AI_ENABLED=true
VERTEX_AI_PROJECT_ID=your-google-cloud-project
VERTEX_AI_LOCATION=global
VERTEX_AI_MODEL=gemini-2.5-flash-lite
# Optional when ADC is unavailable; Firebase Admin credentials may be reused.
VERTEX_AI_CLIENT_EMAIL=your-service-account-email
VERTEX_AI_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Isi Firebase client dan Firebase Admin environment jika ingin menguji login serta workspace. Jangan pernah commit `.env.local`, private key, service account JSON, atau API key.

Jalankan aplikasi:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Demo email yang tersedia saat `TRACE_BREACH_PROVIDER=demo`:

```text
terpapar@trace.test
demo@trace.test
```

## Security baseline dan batasan

TRACE menerapkan validasi schema, rate limiting, optional App Check, token verification, ownership check, safe response, timeout provider, dan pemisahan secret server-side. Namun TRACE tetap merupakan functional prototype kompetisi, bukan klaim bahwa sistem aman untuk seluruh threat model produksi.

Beberapa batasan yang dinyatakan secara terbuka:

- Provider email live/HIBP belum diaktifkan pada deployment demo karena API berbayar.
- Vertex AI menjadi provider utama jika project dan kredensial cloud valid. `rule_based` hanya dipakai ketika Vertex AI gagal atau sengaja dinonaktifkan dengan `VERTEX_AI_ENABLED=false`.
- Rate limit fallback dapat memakai memory proses ketika Firestore tidak tersedia.
- Hasil “tidak ditemukan” tidak berarti akun pasti aman dan tidak mencakup seluruh internet.
- Password checker tidak menjamin password aman; hasil hanya berlaku untuk sumber yang diperiksa.

## Dokumentasi

- [Project concept](docs/PROJECT_CONCEPT.md)
- [Feature specification](docs/FEATURES.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API contract](docs/API.md)
- [Database design](docs/DATABASE.md)
- [Security and privacy](docs/SECURITY.md)
- [AI system specification](docs/AI-SYSTEM.md)
- [AI usage disclosure](docs/AI_USAGE.md)
- [User flow](docs/USER-FLOW.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Competition readiness](docs/COMPETITION.md)
- [Test plan](docs/TEST-PLAN.md)

## Developer and competition

**Developer    :** Salman Fidinillah<br>
**Institution  :** Universitas Sahid Surakarta<br>
**Organizer    :** UKM Triple-C (Creative Computer Club), Universitas Trunojoyo Madura<br>
**Competition  :** Trunodjoyo Creative Competition 2026 — Vibe Code<br>
**Copyright    :** © 2026 Salman Fidinillah

TRACE dibuat untuk membantu lebih banyak orang memahami exposure digital mereka dan mengambil tindakan yang masuk akal. **Safer individuals create safer communities.**
