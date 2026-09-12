# TRACE — SECURITY AND PRIVACY SPECIFICATION

## 1. Threat model utama

| Ancaman | Dampak | Mitigasi |
|---|---|---|
| Email enumeration | Reconnaissance | Rate limit, App Check, abuse detection, safe response |
| Credential stuffing | Sangat tinggi | Jangan menerima/menyimpan raw password di server |
| Firestore data leakage | Kritis | Rules berbasis uid, server authorization, field whitelist |
| API abuse | Tinggi | Rate limit, quota, timeout, monitoring |
| AI hallucination | Tinggi | Structured context, schema validation, fallback |
| Prompt injection | Tinggi | Context separation dan output guardrail |
| Broken access control | Kritis | Verifikasi token dan ownership setiap query |
| XSS | Tinggi | Output encoding, sanitization, CSP |
| Injection | Kritis | Validasi schema dan query aman |
| Secret leakage | Kritis | Secret Manager/environment, tidak di client |
| Bot abuse | Sedang/Tinggi | App Check, rate limit, anomaly detection |

## 2. Authentication

- Firebase Authentication;
- verifikasi ID token di server;
- provider OAuth atau email/password sesuai keputusan produk;
- session dan cookie mengikuti konfigurasi framework;
- proteksi brute force dan rate limit;
- logout mengakhiri akses ke halaman private.

## 3. Authorization

Setiap operasi private harus memenuhi:

```text
request.auth.uid == resource owner uid
```

Jangan mengandalkan ID dokumen yang dikirim client. Security Rules dan server service layer harus sama-sama membatasi ownership.

## 4. Password handling

Password pemeriksaan:

- hanya diproses dengan mekanisme privacy-preserving;
- tidak disimpan;
- tidak dilog;
- tidak dikirim ke Vertex AI;
- tidak dikirim ke analytics;
- tidak pernah dikembalikan ke client.

Password akun Firebase dikelola Firebase Authentication dan tidak boleh masuk ke koleksi Firestore.

## 5. Data protection

- HTTPS wajib;
- data sensitif diminimalkan;
- secret disimpan di Secret Manager atau environment cloud;
- Firestore rules diuji di Emulator Suite;
- provider response dinormalisasi dan disaring;
- backup dan retention memiliki kebijakan tertulis.

## 6. Logging

Log boleh memuat requestId, latency, status, error code, service, dan versi engine. Log tidak boleh memuat raw password, token, raw email, raw provider response, prompt sensitif, atau data user lain.

## 7. Abuse protection

- Firebase App Check;
- rate limit per IP/uid/fingerprint aman;
- limit ukuran request;
- timeout external call;
- quota Vertex AI;
- audit event untuk operasi sensitif;
- generic authentication error;
- alert jika pola request tidak wajar.

## 8. Security headers

Rencanakan:

- Content-Security-Policy;
- Strict-Transport-Security;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- frame protection sesuai kebutuhan.

## 9. Privacy UX

Sebelum scan, jelaskan:

- data apa yang dikirim;
- tujuan pemeriksaan;
- apakah disimpan;
- bahwa password tidak diminta oleh TRACE;
- keterbatasan hasil.

## 10. Security testing

- Firestore rules test;
- ownership test;
- unauthenticated access test;
- rate-limit test;
- secret scan;
- dependency audit;
- XSS test;
- injection test;
- prompt injection test;
- log inspection untuk memastikan secret tidak bocor.
