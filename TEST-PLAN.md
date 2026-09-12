# TRACE — TEST PLAN

## 1. Tujuan

Memastikan TRACE fungsional, aman, dapat dipahami, dan siap didemokan tanpa membocorkan data sensitif.

## 2. Unit test

- normalisasi email;
- validasi request;
- deduplikasi exposure;
- risk score dan threshold;
- pembobotan faktor;
- recommendation priority;
- checklist progress;
- sanitasi output AI;
- fallback ketika AI gagal;
- normalisasi provider error.

## 3. Integration test

- Firebase Authentication dengan emulator;
- Firestore read/write dengan rules;
- user ownership;
- email provider adapter;
- password provider adapter;
- Vertex AI mock/contract;
- rate limit;
- App Check handling;
- audit event tanpa secret.

## 4. End-to-end test

### Skenario publik

1. Pengguna membuka landing page.
2. Email valid menghasilkan result.
3. Email tidak valid tidak memanggil backend.
4. No exposure menampilkan disclaimer.
5. Exposure found menampilkan score, faktor, dan tindakan.
6. Provider unavailable menampilkan retry.
7. Rate limit menampilkan pesan aman.

### Skenario password

1. Pengguna membaca privacy notice.
2. Password diproses dengan metode privacy-preserving.
3. Password tidak muncul pada network log aplikasi, Firestore, atau AI request.
4. Hasil hanya berupa sinyal dan rekomendasi.

### Skenario authenticated

1. User daftar melalui Firebase Authentication.
2. Profil minimum dibuat.
3. User melihat dashboard kosong.
4. User menjalankan scan.
5. History, timeline, score, rekomendasi, dan alert diperbarui.
6. User menandai checklist selesai.
7. User logout dan tidak dapat membuka data private.

## 5. Security test

- user A mencoba ID scan user B;
- request tanpa token;
- token expired atau invalid;
- manipulasi score dan owner uid;
- XSS pada hasil provider dan AI;
- prompt injection;
- credential/secret search di repository;
- brute force dan rate limit;
- error response dan log inspection.

## 6. Usability test

Uji minimal kepada beberapa target pengguna:

- apakah tujuan TRACE dipahami;
- apakah arti score dimengerti;
- apakah tindakan berikutnya jelas;
- apakah privacy notice dipahami;
- apakah dashboard dapat dinavigasi tanpa instruksi panjang;
- apakah tampilan mobile nyaman.

## 7. Acceptance gate

Build tidak boleh masuk demo apabila:

- password tersimpan atau muncul di log;
- user dapat membaca data user lain;
- AI mengarang fakta breach;
- score berubah tanpa input risk engine;
- alur utama hanya simulasi tanpa label;
- error menampilkan stack trace atau secret.
