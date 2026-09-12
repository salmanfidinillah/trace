# TRACE — ARCHITECTURE

> Arsitektur resmi TRACE menggunakan Firebase/Firestore dan Vertex AI.

## 1. Keputusan arsitektur

TRACE menggunakan modular monolith berbasis Next.js dengan Firebase sebagai platform backend terkelola.

Tujuan:

- sederhana untuk tim kecil dan kompetisi;
- cepat dideploy ke cloud;
- memisahkan domain dengan jelas;
- aman secara default;
- dapat berkembang tanpa langsung memakai microservices.

## 2. Stack resmi

### Web

- Next.js;
- React;
- TypeScript;
- Tailwind CSS atau CSS modular;
- komponen UI custom TRACE.

### Firebase

- Firebase Authentication untuk akun dan identitas;
- Cloud Firestore untuk data aplikasi;
- Cloud Functions for Firebase atau server runtime terproteksi untuk operasi sensitif;
- Firebase App Check untuk mengurangi abuse dari client;
- Firebase Hosting atau cloud deployment yang mendukung Next.js;
- Firebase Emulator Suite untuk pengujian lokal.

### AI dan integrasi

- Vertex AI melalui server-side orchestration;
- provider breach melalui adapter;
- provider email opsional untuk verifikasi/alert;
- Cloud Logging dan Error Reporting untuk observability.

## 3. High-level system

```text
Browser
  ↓ HTTPS
Next.js Web App
  ↓
Server Actions / Route Handlers / Cloud Functions
  ├─ Firebase Auth token verification
  ├─ Input validation
  ├─ Rate limit and abuse checks
  ├─ Breach provider adapter
  ├─ Risk engine
  ├─ Vertex AI service
  └─ Firestore repository
       ├─ Firestore
       ├─ Firebase App Check
       └─ Cloud Logging
```

Secret API key dan service account tidak boleh berada di browser.

## 4. Domain modules

```text
auth
users
scans
exposure
risk
recommendations
checklist
alerts
ai
providers
audit
```

Setiap module memiliki service, schema, repository, type, dan test. Business logic tidak ditaruh langsung di komponen UI.

## 5. Request lifecycle public email scan

```text
POST scan request
   ↓
Validasi schema
   ↓
App Check / rate limit / abuse check
   ↓
Normalisasi email
   ↓
Provider adapter
   ↓
Normalisasi dan deduplikasi exposure
   ↓
Risk engine
   ↓
Recommendation engine
   ↓
Vertex AI optional explanation
   ↓
Safe response DTO
```

Browser tidak menerima raw response provider.

## 6. Request lifecycle authenticated scan

```text
Firebase ID token
   ↓
Verifikasi server
   ↓
Ambil uid
   ↓
Validasi ownership
   ↓
Scan pipeline
   ↓
Persist safe result ke user/{uid}
   ↓
Audit event minimal
   ↓
Dashboard refresh
```

## 7. Authentication dan authorization

Firebase Authentication mengelola kredensial. Backend tetap wajib memverifikasi ID token sebelum mengakses data private.

Semua query private harus memiliki batasan `uid` yang sudah diverifikasi. ID dokumen yang diketahui tidak cukup untuk memberikan akses.

Firebase Security Rules digunakan sebagai lapisan tambahan, bukan pengganti validasi server untuk operasi sensitif.

## 8. Firestore boundary

Data yang boleh berada di Firestore:

- profil minimum;
- scan metadata dan safe result;
- exposure yang sudah dinormalisasi;
- risk assessment;
- rekomendasi;
- checklist status;
- alert;
- AI summary yang sudah disaring;
- audit metadata minimal.

Data yang tidak boleh berada di Firestore:

- raw password;
- password hash dari password yang diperiksa;
- token provider;
- raw breach dump;
- service account key;
- prompt yang berisi secret;
- email publik pengguna lain.

## 9. Provider adapter

Provider breach harus dibungkus adapter agar dapat diganti:

```text
BreachProvider
  ├─ search(identifier)
  ├─ normalize(response)
  ├─ healthCheck()
  └─ sourceMetadata()
```

Adapter wajib memiliki timeout, retry terbatas, validasi response, circuit breaker sederhana, dan fallback error yang aman.

## 10. Risk engine

Risk engine adalah deterministic service yang menghasilkan:

- score 0–100;
- level;
- faktor;
- alasan;
- rekomendasi kandidat.

AI tidak boleh mengubah score.

## 11. Vertex AI boundary

Vertex AI dipanggil hanya dari server. Context yang dikirim berupa structured security state yang sudah disaring. Password, token, raw record, dan data user lain dilarang masuk prompt.

Output AI divalidasi terhadap schema. Jika gagal, sistem memakai template rekomendasi berbasis risk engine.

## 12. Scalability path

### Kompetisi

- satu aplikasi Next.js;
- Firebase Auth dan Firestore;
- satu provider breach;
- Vertex AI server-side;
- function/service terpisah secara logis.

### Setelah kompetisi

- background jobs untuk monitoring;
- Cloud Tasks atau scheduler;
- provider cache yang aman;
- pemisahan worker scan;
- observability dan budget alert;
- service extraction hanya jika beban dan ownership memerlukannya.

## 13. Reliability

- timeout semua external request;
- retry terbatas dan exponential backoff;
- fallback tanpa AI;
- state provider unavailable;
- idempotency untuk authenticated scan;
- health check tanpa membocorkan secret;
- backup/export sesuai kebijakan Firestore.

## 14. Testing architecture

- unit test untuk risk engine, normalization, recommendation, dan validator;
- integration test untuk Auth, Firestore emulator, dan provider adapter;
- AI contract test untuk schema dan guardrail;
- E2E test untuk public scan, login, dashboard, checklist, dan error state;
- security test untuk rules, ownership, rate limit, XSS, injection, dan secret leakage.

## 15. Arsitektur yang tidak dipilih

- microservices sejak awal;
- akses Firestore langsung untuk operasi yang membutuhkan secret;
- API key AI di client;
- database relasional sebagai sumber utama;
- penyimpanan password dengan alasan debugging;
- AI sebagai sumber fakta breach.
