# TRACE — API CONTRACT

## 1. Prinsip API

- semua endpoint memakai HTTPS;
- request divalidasi di server;
- response tidak mengandung raw provider data;
- endpoint private membutuhkan Firebase ID token;
- error response tidak membocorkan stack trace atau detail database;
- password tidak pernah dikirim ke endpoint AI atau disimpan.

## 2. Format response umum

Success:

```text
{
  data: ..., 
  meta: { requestId: "..." }
}
```

Error:

```text
{
  error: {
    code: "SAFE_PUBLIC_CODE",
    message: "Pesan yang dapat dipahami pengguna",
    requestId: "..."
  }
}
```

## 3. Public endpoints

### POST /api/scans/email

Tujuan: melakukan email exposure scan.

Request:

```text
{ email: string }
```

Pipeline: schema validation, App Check, rate limit, abuse check, provider lookup, normalization, risk engine, recommendation, AI optional.

Response aman:

```text
{
  scanId: string | null,
  status: "no_exposure" | "exposure_found",
  score: number,
  level: string,
  exposureCount: number,
  exposures: [{ serviceName, year, dataTypes, severity }],
  factors: [...],
  recommendations: [...],
  aiExplanation: {...} | null,
  limitations: string[]
}
```

### POST /api/scans/password

Tujuan: password safety check privacy-preserving.

Nilai password hanya diproses sesuai mekanisme provider yang dipilih dan tidak diteruskan ke Firestore, log, analytics, atau Vertex AI.

Response:

```text
{
  status: "exposed_signal" | "not_found_in_checked_source" | "unavailable",
  recommendation: string
}
```

### GET /api/public/config

Hanya mengembalikan konfigurasi UI non-rahasia seperti feature availability. Tidak boleh mengembalikan key private.

## 4. Authenticated endpoints

Semua endpoint berikut memverifikasi Firebase ID token dan ownership:

```text
GET    /api/me
GET    /api/me/dashboard
GET    /api/me/scans
GET    /api/me/scans/{scanId}
POST   /api/me/scans/email
GET    /api/me/timeline
GET    /api/me/recommendations
PATCH  /api/me/recommendations/{id}
GET    /api/me/checklist
PATCH  /api/me/checklist/{id}
GET    /api/me/alerts
PATCH  /api/me/alerts/{id}/read
POST   /api/me/ai/analyst
DELETE /api/me/data
```

## 5. AI endpoint

### POST /api/me/ai/analyst

Request:

```text
{ question?: string, contextScope: "dashboard" | "scan" }
```

Server mengambil security state milik user, membangun context whitelist, memanggil Vertex AI, memvalidasi output, lalu mengembalikan:

```text
{
  summary: string,
  topRisks: string[],
  actions: string[],
  limitations: string[]
}
```

AI tidak boleh menerima password atau raw breach record.

## 6. Status HTTP

- `200`: berhasil;
- `201`: resource dibuat;
- `400`: input tidak valid;
- `401`: belum login atau token invalid;
- `403`: tidak memiliki akses;
- `404`: resource tidak ditemukan;
- `409`: konflik atau request duplikat;
- `429`: terlalu banyak request;
- `502`: provider eksternal gagal;
- `503`: layanan sementara tidak tersedia.

## 7. Rate limit awal

Nilai final dikonfigurasi setelah pengujian, tetapi minimal dibedakan antara:

- public email scan berdasarkan IP dan fingerprint aman;
- password check berdasarkan IP dan App Check;
- login berdasarkan IP/account;
- AI request berdasarkan uid;
- provider call berdasarkan service account.

Rate limit tidak boleh dijadikan alasan untuk mencatat password atau raw email.

## 8. Idempotency dan retry

Authenticated scan dapat memakai idempotency key untuk mencegah duplikasi akibat retry browser. External provider memiliki timeout dan retry terbatas. Vertex AI tidak dipanggil berulang tanpa batas.
