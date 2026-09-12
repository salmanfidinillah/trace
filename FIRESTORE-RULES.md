# TRACE — FIRESTORE ACCESS POLICY

Dokumen ini mendefinisikan hak akses sebelum Security Rules ditulis.

## 1. Akses koleksi

| Koleksi | Pengunjung | User pemilik | Server/Admin |
|---|---|---|---|
| users/{uid} | Tidak | Baca data milik sendiri | Ya |
| users/{uid}/scans | Tidak | Baca; tulis terbatas sesuai schema | Ya |
| exposures subcollection | Tidak | Baca melalui scan milik sendiri | Ya |
| recommendations | Tidak | Baca/update status milik sendiri | Ya |
| checklist | Tidak | Baca/update item milik sendiri | Ya |
| alerts | Tidak | Baca/update read milik sendiri | Ya |
| aiAnalyses | Tidak | Baca milik sendiri | Ya |
| auditEvents | Tidak | Tidak | Ya |
| providerCache | Tidak | Tidak | Ya |
| systemConfigs | Tidak | Tidak | Ya |

## 2. Invariant keamanan

- request harus authenticated untuk seluruh data private;
- `request.auth.uid` harus sama dengan uid path;
- client tidak boleh memalsukan owner uid;
- client tidak boleh mengubah score, level, provider, engineVersion, atau audit metadata;
- client hanya boleh mengubah field yang memang diizinkan, misalnya status checklist atau `read` pada alert;
- field timestamp penting dibuat server-side;
- ukuran array, string, dan jumlah dokumen dibatasi;
- field yang tidak dikenal ditolak;
- dokumen private tidak dapat dicari melalui query lintas user.

## 3. Server-only operation

Operasi berikut tidak dilakukan langsung oleh client:

- email provider lookup;
- password breach lookup;
- risk calculation;
- recommendation generation;
- Vertex AI call;
- pembuatan scan result;
- penulisan audit event;
- akses provider cache;
- perubahan system configuration.

## 4. Pengujian rules

Wajib diuji dengan Firebase Emulator Suite:

- user A tidak dapat membaca data user B;
- user tanpa login tidak dapat membaca data private;
- client tidak dapat menaikkan score sendiri;
- client tidak dapat mengubah owner uid;
- client hanya dapat mengubah status checklist miliknya;
- client tidak dapat membaca providerCache;
- client tidak dapat menulis auditEvents;
- dokumen dengan field tambahan atau tipe salah ditolak.
