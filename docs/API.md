# TRACE - API CONTRACT MVP

## Prinsip

- Semua request production memakai HTTPS.
- Input divalidasi di server.
- Response tidak mengandung raw provider data.
- Endpoint private memverifikasi Firebase ID token.
- Password mentah tidak dikirim ke server TRACE, Firestore, log, atau Vertex AI.

## Format response

Success umumnya menggunakan:

```json
{
  "data": {},
  "meta": { "requestId": "..." }
}
```

Error menggunakan:

```json
{
  "error": {
    "code": "SAFE_PUBLIC_CODE",
    "message": "Pesan yang dapat dipahami pengguna"
  }
}
```

## Public endpoints

### `POST /api/scans/email`

Melakukan email exposure scan. Endpoint dapat digunakan tanpa login. Jika request menyertakan Firebase ID token yang valid dan Admin SDK tersedia, hasil aman akan disimpan ke workspace user.

Request:

```json
{ "email": "user@example.com" }
```

Pipeline: validasi, optional App Check, rate limit, provider lookup, normalisasi, risk engine, recommendation engine, dan optional Vertex AI explanation.

Response `data`:

```json
{
  "scanId": "string | null",
  "status": "no_exposure | exposure_found",
  "score": 0,
  "level": "low | moderate | elevated | high | critical",
  "exposureCount": 0,
  "exposures": [],
  "factors": [],
  "recommendations": [],
  "aiExplanation": {},
  "limitations": [],
  "providerName": "TRACE Demo Dataset",
  "isDemoData": true
}
```

### `POST /api/scans/password`

Memeriksa password dengan pola k-anonymity. Browser hanya mengirim prefix dan suffix hash SHA-1; password mentah tidak dikirim ke TRACE.

Request:

```json
{ "prefix": "ABCDE", "suffix": "...35 hex characters..." }
```

Response `data` memiliki `status`, `recommendation`, dan `providerName`.

## Authenticated endpoints

Semua endpoint berikut memerlukan header:

```text
Authorization: Bearer <Firebase ID token>
```

### `POST /api/me/profile`

Menyinkronkan profil minimum user dan membuat checklist default jika belum ada.

### `GET /api/me/dashboard`

Mengembalikan profil minimum, score terbaru, scan history terbatas, rekomendasi terbuka, alert belum dibaca, dan checklist user.

### `PATCH /api/me/checklist/{id}`

Mengubah status item checklist menjadi `todo` atau `done`.

Request:

```json
{ "status": "done" }
```

### `POST /api/me/ai/analyst`

Menganalisis security state dashboard milik user. Vertex AI dipakai jika tersedia; jika tidak, endpoint mengembalikan fallback rule-based.

Request:

```json
{
  "question": "Kenapa risikoku tinggi?",
  "contextScope": "dashboard"
}
```

AI hanya menerima score, level, exposure yang sudah dinormalisasi, dan rekomendasi. Password, token, dan raw provider record dilarang masuk context.

## Status HTTP

- `200`: berhasil.
- `400`: input tidak valid.
- `401`: token tidak ada atau tidak valid.
- `403`: App Check atau akses ditolak.
- `404`: resource tidak ditemukan.
- `429`: rate limit terlampaui.
- `503`: provider atau konfigurasi server tidak tersedia.

Dokumen ini hanya mendeskripsikan endpoint yang saat ini diimplementasikan di `app/api/`.
