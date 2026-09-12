# TRACE — DEPLOYMENT AND OPERATIONS

## 1. Target deployment

TRACE dideploy ke cloud dengan komponen terkelola:

```text
Web app/API        → cloud runtime yang mendukung Next.js
Authentication     → Firebase Authentication
Database           → Cloud Firestore
Server operations  → Cloud Functions atau server runtime terproteksi
AI                 → Vertex AI
Monitoring         → Cloud Logging/Error Reporting
```

Untuk implementasi final, pilih satu platform web utama dan dokumentasikan alasannya. Jangan mencampur beberapa platform deployment tanpa kebutuhan.

## 2. Environment

### Development

- Firebase project development;
- Firebase Emulator Suite;
- Vertex AI project non-production atau mock yang eksplisit;
- data demo yang diberi label.

### Staging

- project Firebase terpisah;
- data uji terkontrol;
- provider sandbox/mock yang jelas;
- rules dan security test dijalankan sebelum release.

### Production/demo lomba

- project cloud terpisah dari development;
- service account minimum permission;
- secret tidak masuk repository;
- domain HTTPS;
- quota dan budget alert aktif;
- provider nyata atau demo mode yang diberi label transparan.

## 3. Secret management

Secret yang mungkin diperlukan:

- provider breach API key;
- Vertex AI configuration;
- Firebase Admin credentials;
- email provider credential;
- webhook atau monitoring secret.

Tidak boleh diletakkan di frontend bundle, GitHub, screenshot, README publik, atau Firestore.

## 4. Deployment pipeline

```text
Pull request
   ↓
Lint dan type check
   ↓
Unit/integration test
   ↓
Firestore rules test
   ↓
Security scan
   ↓
Build
   ↓
Deploy staging
   ↓
Smoke test
   ↓
Deploy production/demo
```

## 5. Observability

Pantau:

- error rate;
- latency email scan;
- provider unavailable;
- Vertex AI error/quota;
- Firestore permission denied;
- rate-limit hits;
- authentication failures;
- biaya cloud dan AI.

Dashboard monitoring tidak boleh menampilkan secret atau raw data pengguna.

## 6. Reliability dan rollback

- deploy versioned;
- simpan konfigurasi feature flag;
- siapkan rollback ke build sebelumnya;
- provider failure memiliki fallback;
- AI failure tidak boleh mematikan hasil scan;
- migrasi Firestore diuji di emulator/staging.

## 7. Checklist rilis

- [ ] Domain HTTPS aktif
- [ ] Firebase Auth production benar
- [ ] Firestore rules sudah diuji
- [ ] App Check aktif
- [ ] Secret hanya berada di secret manager/environment
- [ ] Vertex AI hanya dipanggil server-side
- [ ] Provider breach memiliki timeout
- [ ] Rate limit aktif
- [ ] Log bebas password dan token
- [ ] Error/empty/loading state diuji
- [ ] Mobile layout diuji
- [ ] Budget alert aktif
- [ ] README deployment tersedia
