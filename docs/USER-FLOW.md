# TRACE — USER FLOW

> Dokumen alur pengguna resmi. Seluruh teks antarmuka menggunakan Bahasa Indonesia.

## 1. Prinsip

```text
Check → Understand → Protect → Monitor
Temukan → Pahami → Lindungi → Pantau
```

Pengguna boleh mencoba fitur pemeriksaan tanpa login. Login ditawarkan setelah pengguna menerima nilai dari hasil scan.

## 2. Tipe pengguna

- **Pengunjung:** belum melakukan pemeriksaan.
- **Pengguna publik:** menggunakan email/password checker tanpa login.
- **Pengguna terdaftar:** memiliki workspace Firebase Authentication.
- **Pengguna kembali:** kembali melihat history, checklist, dan rekomendasi.

## 3. Navigasi

### Publik

Beranda, Fitur, Tentang, FAQ, Cek Email, Cek Password, Masuk, Daftar.

### Login

Dashboard, Cek Email, Cek Password, Riwayat, Timeline, AI Analyst, Rekomendasi, Checklist, Pengaturan, Keluar.

## 4. Alur utama publik

```text
Landing page
   ↓
Masukkan email
   ↓
Validasi lokal
   ↓
Rate limit dan abuse check
   ↓
Lookup provider
   ↓
Normalisasi hasil
   ↓
Risk engine
   ↓
AI explanation
   ↓
Result page
   ↓
Rekomendasi
   ↓
Daftar untuk menyimpan dan memantau
```

## 5. Email scan

### Input

Tampilkan:

> Masukkan email yang ingin diperiksa.

Privacy notice:

> Email digunakan untuk pemeriksaan exposure. Jangan masukkan password.

### Validasi

- trim whitespace;
- validasi format email;
- kirim ke server hanya jika valid;
- normalisasi di server;
- jangan menampilkan error yang membocorkan detail internal.

### Loading

Gunakan progress yang informatif:

```text
Memvalidasi permintaan
Menghubungkan ke sumber data
Menganalisis exposure
Menghitung risiko
```

### Tidak ditemukan

Tampilkan:

> Tidak ditemukan exposure pada sumber data yang diperiksa.

Tambahkan batasan:

> Hasil ini tidak berarti akun pasti aman dan tidak mencakup seluruh internet.

### Exposure ditemukan

Tampilkan status, score, level, jumlah exposure, layanan, tahun, jenis data, alasan score, AI explanation, dan prioritas tindakan.

## 6. Password scan

```text
Halaman cek password
   ↓
Penjelasan privasi
   ↓
Input password
   ↓
Proses lokal/privacy-preserving
   ↓
Hapus nilai rahasia dari memori proses
   ↓
Tampilkan sinyal hasil
```

Password:

- tidak dikirim ke Vertex AI;
- tidak disimpan di Firestore;
- tidak masuk history;
- tidak masuk log atau analytics;
- tidak ditampilkan lagi setelah proses selesai.

## 7. Konversi ke akun

Jangan gunakan “Login untuk melihat hasil”. Gunakan:

> Ingin menyimpan hasil dan memantau keamananmu?

Manfaat yang ditampilkan:

- riwayat scan;
- exposure timeline;
- dashboard personal;
- checklist;
- rekomendasi yang dapat ditandai selesai;
- alert internal.

## 8. Registrasi dan login

```text
Daftar
   ↓
Firebase Authentication
   ↓
Profil minimum dibuat di Firestore
   ↓
Onboarding singkat
   ↓
Dashboard
```

Data minimum: UID Firebase, email terverifikasi jika tersedia, display name opsional, timestamp, dan preferensi.

Login gagal menggunakan pesan generik:

> Email atau password tidak sesuai.

## 9. Dashboard

Urutan informasi:

1. sapaan dan waktu scan terakhir;
2. personal security score;
3. ringkasan exposure, aksi tertunda, dan alert;
4. tiga tindakan prioritas;
5. recent scan;
6. checklist progress;
7. timeline atau tautan detail.

Jika belum ada data, tampilkan onboarding:

> Mulai dengan pemeriksaan pertama untuk melihat kondisi keamanan digitalmu.

## 10. Analis Keamanan AI

```text
Dashboard
   ↓
AI Analyst
   ↓
Ambil security state milik user
   ↓
Bangun context terstruktur
   ↓
Vertex AI
   ↓
Validasi output
   ↓
Tampilkan ringkasan dan tindakan
```

Pertanyaan lanjutan harus dijawab hanya berdasarkan security state yang tersedia. Jika data tidak tersedia, AI harus mengatakan bahwa informasi tersebut belum diketahui.

## 11. Checklist dan rekomendasi

```text
Risk assessment
   ↓
Recommendation engine
   ↓
Prioritaskan
   ↓
User membuka tindakan
   ↓
Tandai selesai
   ↓
Perbarui progress dashboard
```

TRACE tidak mengganti password atau mengaktifkan 2FA secara otomatis.

## 12. Error flow

- Provider gagal: tampilkan layanan sementara tidak tersedia dan tombol coba lagi.
- Rate limit: minta pengguna mencoba beberapa saat lagi.
- AI gagal: tampilkan rekomendasi berbasis aturan.
- Belum login: arahkan ke login tanpa menghilangkan hasil publik.
- Tidak berwenang: tampilkan akses ditolak tanpa detail database.

## 13. Alur demo kompetisi

```text
Landing → Email scan → Exposure result → Risk score → AI explanation
→ Recommendation → Register → Dashboard → Checklist → Closing
```

Cerita demo harus memakai satu pengguna dan satu kasus yang konsisten. Jika memakai dataset demo, beri label “Demo data” secara terlihat.

## 14. Kriteria penerimaan

- pengguna dapat menyelesaikan email scan tanpa login;
- hasil menjawab apa, seberapa berisiko, mengapa, dan apa tindakan berikutnya;
- pengguna dapat membuat akun tanpa mengulang seluruh proses;
- dashboard hanya menampilkan data milik user aktif;
- password tidak pernah masuk persistence;
- semua state utama memiliki loading, empty, error, dan retry.
