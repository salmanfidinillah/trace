# TRACE — DEPLOYMENT AND OPERATIONS

## 1. Target deployment

TRACE menggunakan Vercel sebagai platform web/API utama dengan komponen terkelola:

```text
Web app/API        → Vercel Next.js runtime
Authentication     → Firebase Authentication
Database           → Cloud Firestore
Server operations  → Cloud Functions atau server runtime terproteksi
AI                 → Vertex AI
Monitoring         → Cloud Logging/Error Reporting
```

Vercel dipilih karena mendukung Next.js Route Handlers, HTTPS, custom domain, server-side environment variable, dan deployment versioned tanpa infrastructure tambahan.

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

- Firebase project TRACE `trace-digital-exposure-2026`;
- Vercel project `tracee`;
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
- [x] README deployment tersedia

## 8. Firebase Authentication notes

- TRACE menggunakan `signInWithPopup` dari Firebase Web SDK.
- `authDomain` tetap `trace-digital-exposure-2026.firebaseapp.com` karena aplikasi utama disajikan oleh Vercel. Firebase mendokumentasikan custom `authDomain` untuk domain yang dilayani Firebase Hosting; menggantinya ke `www.tracee.web.id` tanpa Firebase Hosting akan merusak endpoint `/__/auth/handler`.
- `www.tracee.web.id` sudah terdaftar sebagai Firebase Authorized Domain.
- Google Sign-In harus diaktifkan pada Firebase Console → Authentication → Sign-in method → Google. Provider ini tidak diaktifkan oleh source code Next.js.
- Email verification memakai `sendEmailVerification()` dengan continue URL `/verify-email`, reload/token refresh, dan cooldown resend.
- Template email verifikasi (subject, nama pengirim, dan copywriting TRACE) harus disesuaikan manual pada Firebase Console → Authentication → Templates. Custom email domain juga memerlukan verifikasi DNS dari Firebase.
