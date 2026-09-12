# TRACE --- UI/UX Specification

> **TRACE — Kenali Paparan Data Digitalmu**
>
> Nama produk menggunakan bahasa Inggris **TRACE**, sedangkan seluruh
> interface, microcopy, UX writing, dan dokumentasi produk menggunakan
> **Bahasa Indonesia**.

------------------------------------------------------------------------

## 1. Product UI/UX Direction

TRACE adalah platform keamanan digital yang membantu pengguna:

1.  mengecek apakah email pernah muncul dalam kebocoran data,
2.  mengecek keamanan password,
3.  memahami tingkat risiko,
4.  mendapatkan penjelasan dari Analis Keamanan AI,
5.  melihat riwayat dan timeline exposure,
6.  mendapatkan langkah perlindungan yang konkret.

### Prinsip utama

-   **Serius, bukan menakut-nakuti**
-   **Informasi kompleks dibuat mudah dipahami**
-   **Setiap risiko harus punya tindakan**
-   **Privacy by design**
-   **Progressive disclosure**
-   **Tidak membuat klaim keamanan yang tidak dapat dibuktikan**
-   **UI harus tetap terasa seperti security product, bukan template
    SaaS**

------------------------------------------------------------------------

# 2. Visual Identity

## 2.1 Design Style

**Dark Neo-Brutalism Cybersecurity**

Karakter visual:

-   background hitam / hampir hitam,
-   panel gelap dengan border tegas,
-   acid green sebagai primary action,
-   merah hanya untuk alert dan risiko,
-   putih untuk informasi utama,
-   hard shadow,
-   grid dan technical texture,
-   typography monospace untuk heading/data,
-   sans-serif untuk body text,
-   icon sederhana dan geometris.

### Yang harus dihindari

-   glassmorphism,
-   blur berlebihan,
-   gradient ungu AI,
-   rounded card berlebihan,
-   neumorphism,
-   ilustrasi startup generik,
-   dashboard yang terlalu ramai,
-   animasi dekoratif yang tidak memiliki fungsi.

------------------------------------------------------------------------

# 3. Design Tokens

## 3.1 Color

``` text
Background Primary     #050708
Background Secondary   #090D0F
Surface                #0C1113
Surface Elevated       #101619
Border                 #263034
Text Primary           #F4F7F5
Text Secondary         #9BA6A2
Text Muted             #65716D

Accent Primary         #B7FF00
Accent Hover           #D0FF4D

Risk Critical          #FF3038
Risk High              #FF4A4F
Risk Medium            #FFD21A
Risk Low               #79D64B
Success                #8DFF2F
```

> Warna dapat disesuaikan saat implementation, tetapi hierarchy harus
> dipertahankan: **green = action/safe**, **red = danger**, **yellow =
> warning**, **white = information**.

## 3.2 Typography

### Display / Heading

``` text
Font: Monaco / JetBrains Mono / IBM Plex Mono
Weight: 700
```

Digunakan untuk:

-   hero heading,
-   page title,
-   score,
-   angka statistik,
-   label sistem,
-   technical metadata.

### Body

``` text
Font: Inter / system sans-serif
Weight: 400–600
```

Digunakan untuk:

-   deskripsi,
-   helper text,
-   form label,
-   recommendation,
-   navigation.

### Hierarchy

``` text
H1       48–64 px
H2       32–40 px
H3       20–24 px
Body     14–16 px
Caption  11–13 px
Data     24–48 px monospace
```

------------------------------------------------------------------------

# 4. Layout System

## 4.1 Desktop

Target utama:

``` text
1440 × 900
1366 × 768
```

Container:

``` text
max-width: 1440px
horizontal padding: 24–40px
```

Grid:

``` text
12 columns
gap: 16–24px
```

## 4.2 Tablet

``` text
768–1199px
```

-   sidebar dapat diperkecil,
-   dashboard berubah menjadi 2-column,
-   card tetap mempertahankan hierarchy.

## 4.3 Mobile

``` text
320–767px
```

-   sidebar menjadi bottom navigation / drawer,
-   semua card menjadi single column,
-   hero text lebih pendek,
-   table berubah menjadi stacked list,
-   CTA utama full width,
-   score tetap menjadi visual utama.

------------------------------------------------------------------------

# 5. Navigation

## Public Navigation

``` text
TRACE.
Beranda
Fitur
Tentang
FAQ

Masuk
Daftar
```

CTA:

``` text
[ Cek Sekarang → ]
```

## Authenticated Navigation

``` text
TRACE.

Dashboard
Cek Email
Cek Password
Rekomendasi
Pengaturan

[ Avatar ]
```

### Mobile

``` text
Dashboard
Cek
Riwayat
Rekomendasi
Profil
```

------------------------------------------------------------------------

# 6. Sitemap

``` text
PUBLIC
│
├── Beranda
├── Fitur
├── Tentang
├── FAQ
│
├── Cek Email
│   ├── Input
│   ├── Loading
│   ├── Tidak Ditemukan
│   └── Exposure Ditemukan
│
└── Cek Password
    ├── Input
    ├── Loading
    └── Result

AUTH
│
├── Masuk
├── Daftar
├── Lupa Password
└── Verifikasi Email

APP
│
├── Dashboard
├── Cek Email
├── Cek Password
├── Riwayat Pemeriksaan
├── Linimasa Exposure
├── Analis Keamanan AI
├── Rekomendasi
├── Checklist Keamanan
├── Notifikasi
└── Pengaturan
```

------------------------------------------------------------------------

# 7. Landing Page

## Tujuan

Landing page harus menjawab tiga hal dalam kurang dari 10 detik:

1.  TRACE itu apa?
2.  Apa yang bisa saya cek?
3.  Apa yang harus saya lakukan sekarang?

## Hero

``` text
PEMINDAI PAPARAN DATA DIGITAL

TAHU NGGAK
DATA KAMU
TERPAPAR?

Cari tahu sebelum terlambat.

[ Masukkan email kamu                ]
[ Cek Sekarang → ]

Email hanya digunakan untuk pemeriksaan sesuai kebijakan privasi.
```

### Supporting visual

Gunakan technical cyber visual:

-   scan lines,
-   grid,
-   abstract data fragments,
-   lock / warning marker,
-   exposure nodes.

Jangan menggunakan ilustrasi manusia generik.

## Social proof / statistics

``` text
CONTOH DATA DEMO
BUKAN STATISTIK PUBLIK

DATA UJI
DITANDAI JELAS

HASIL DEMO
DAPAT DIVERIFIKASI
```

Angka harus berasal dari data sistem nyata saat production. Untuk demo
kompetisi, data dummy harus diberi konteks internal dan tidak boleh
dipresentasikan sebagai statistik dunia nyata.

------------------------------------------------------------------------

# 8. Section "Tentang TRACE"

Headline:

``` text
Lebih dari sekadar
cek email.
```

Copy:

> TRACE membantu kamu memahami apakah data digitalmu pernah terekspos,
> seberapa besar risikonya, dan apa yang perlu dilakukan setelahnya.

Feature cards:

``` text
01  Pemeriksaan Exposure
Cek apakah email kamu muncul dalam kebocoran data.

02  Analisis Risiko
Pahami dampak exposure terhadap akunmu.

03  Linimasa Exposure
Lihat kapan dan dari layanan mana exposure terjadi.

04  Analis Keamanan AI
Dapatkan penjelasan dan langkah perlindungan.
```

------------------------------------------------------------------------

# 9. Pemeriksaan Email

## Input State

Headline:

``` text
CEK EMAIL KAMU.
```

Description:

> Masukkan email untuk mengetahui apakah pernah muncul dalam kebocoran
> data yang diketahui.

Input:

``` text
[ email@contoh.com                  ]
```

CTA:

``` text
[ Cek Sekarang → ]
```

Privacy notice:

``` text
LOCK
Email digunakan untuk proses pemeriksaan.
Jangan masukkan password.
```

### Security UX

-   validasi email di client dan server,
-   rate limiting,
-   abuse protection,
-   jangan mengungkap database internal,
-   jangan menampilkan raw breach data yang sensitif,
-   jangan menyimpan email secara default jika tidak diperlukan.

------------------------------------------------------------------------

# 10. Pemuatan Pemeriksaan

Jangan hanya menampilkan spinner.

Gunakan progress yang menjelaskan proses:

``` text
MEMULAI PEMERIKSAAN...

✓ Memvalidasi permintaan
✓ Menghubungkan ke sumber data
→ Menganalisis exposure
○ Menghitung risiko
```

Copy:

> Pemeriksaan sedang berlangsung. Ini mungkin membutuhkan beberapa
> detik.

------------------------------------------------------------------------

# 11. Hasil Email — Tidak Ada Exposure

Visual harus menenangkan tanpa mengatakan "100% aman".

``` text
TIDAK DITEMUKAN

Kami tidak menemukan exposure yang cocok
berdasarkan sumber data yang diperiksa.
```

Score:

``` text
LOW EXPOSURE
```

CTA:

``` text
[ Cek Password ]
[ Pelajari Cara Menjaga Akun ]
```

Important disclaimer:

> Tidak ditemukannya data bukan berarti akun pasti aman. Sumber data
> dapat berubah dan tidak mencakup seluruh internet.

------------------------------------------------------------------------

# 12. Hasil Email — Exposure Ditemukan

Ini adalah **golden screen** TRACE.

Hierarchy:

``` text
PERINGATAN

DATA KAMU TERDETEKSI

82 / 100
RISIKO KRITIS
```

Kemudian:

``` text
4 exposure ditemukan
```

Tampilkan ringkasan:

  Layanan             Tahun Data              Risiko
  ----------------- ------- ----------------- --------
  Media Sosial         2024 Email, Username   Tinggi
  Perdagangan Daring   2023 Email, Phone      Tinggi
  Forum                2022 Email, Username   Sedang
  Layanan Tidak Dikenal 2021 Email            Sedang

### Jangan tampilkan

-   password asli,
-   authentication token,
-   full sensitive records,
-   data korban lain,
-   data mentah yang tidak diperlukan.

------------------------------------------------------------------------

# 13. Skor Risiko

Score bukan sekadar dekorasi.

Formula dan faktor harus dapat dijelaskan.

Contoh faktor:

``` text
Exposure count
Recency
Data sensitivity
Password reuse risk
Account importance
```

Visual:

``` text
82
────────
RISIKO TINGGI
```

Color:

``` text
0–20    Rendah
21–40   Sedang
41–60   Meningkat
61–80   Tinggi
81–100  Kritis
```

> Threshold final harus ditentukan oleh Risk Scoring Engine dan tidak
> boleh hanya menjadi keputusan visual.

------------------------------------------------------------------------

# 14. Analis Keamanan AI

## Tujuan

AI harus membantu user **mengerti dan bertindak**, bukan hanya
menghasilkan paragraf panjang.

Layout:

``` text
ANALIS KEAMANAN AI

Ringkasan
────────────────────
Kami menemukan beberapa exposure
yang dapat meningkatkan risiko akunmu.

RISIKO UTAMA
────────────────────
Email dan nomor telepon muncul dalam
beberapa exposure dan dapat meningkatkan
risiko phishing atau pengambilalihan akun.

REKOMENDASI
────────────────────
○ Ganti password pada layanan terkait
○ Aktifkan autentikasi dua faktor
○ Periksa sesi login aktif
○ Waspadai email phishing
```

### Chat input

``` text
[ Tanya apa saja tentang risiko ini... ] [→]
```

AI harus:

-   menggunakan data yang tersedia,
-   tidak mengarang fakta,
-   membedakan fakta vs estimasi,
-   tidak memberikan kepastian palsu,
-   mengarahkan ke tindakan keamanan.

------------------------------------------------------------------------

# 15. Dasbor

Dashboard adalah pusat personal security.

Header:

``` text
Dashboard

Halo, pengguna!
Berikut ringkasan keamanan digital kamu.
```

Summary cards:

``` text
4
Exposure Terdeteksi

2
Aksi Tertunda

0
Alert Aktif
```

## Skor Paparan Data Digital

``` text
82 / 100
RISIKO TINGGI
```

Di bawah score:

``` text
+ Lihat alasan skor
```

## Status Keamanan

``` text
Email Breach       4 ditemukan
Password            2 perlu diperiksa
Dark Web            Tidak terdeteksi
Data Personal       Berisiko
```

## Tindakan Prioritas

Selalu tampilkan maksimal 3--5 tindakan utama.

``` text
01  Ganti password yang digunakan ulang
02  Aktifkan 2FA
03  Periksa akun yang terdampak
```

------------------------------------------------------------------------

# 16. Linimasa Exposure

Timeline harus membantu user memahami sejarah exposure.

Contoh:

``` text
2024
● Social Media
  Email, Username

2023
● E-commerce
  Email, Phone

2022
● Forum
  Email, Username

2021
● Unknown Service
  Email
```

Interaction:

-   klik item → detail,
-   filter tahun,
-   filter tipe data,
-   filter tingkat risiko.

------------------------------------------------------------------------

# 17. Pemeriksaan Password

Headline:

``` text
CEK PASSWORD
```

Description:

> Pastikan password kamu tidak mudah ditebak atau sudah diketahui dalam
> kebocoran data.

Input:

``` text
[ 🔒 Masukkan password kamu        ] [ Cek Password → ]
```

Security notice:

``` text
Password tidak disimpan.
```

Result:

``` text
PASSWORD LEMAH

Password ini berisiko digunakan
atau mudah ditebak.

[ Buat Password Lebih Kuat ]
```

### Critical security rule

Password checker **tidak boleh menyimpan password mentah**.

Jika menggunakan breach lookup:

-   gunakan metode privacy-preserving,
-   minimalkan data yang dikirim,
-   jangan log password,
-   jangan memasukkan password ke analytics,
-   jangan mengirim password ke LLM.

------------------------------------------------------------------------

# 18. Rekomendasi

Recommendation center menggunakan format:

``` text
REKOMENDASI KEAMANAN

[ KRITIS ]
Ganti password yang digunakan ulang
Risiko: Pengambilalihan akun

[ TINGGI ]
Aktifkan autentikasi dua faktor
Risiko: Akses tanpa izin

[ SEDANG ]
Periksa email phishing terbaru
Risiko: Rekayasa sosial
```

Setiap recommendation wajib memiliki:

``` text
Masalah
Dampak
Langkah
Status
```

------------------------------------------------------------------------

# 19. Checklist Keamanan

Checklist dibuat actionable.

``` text
KEAMANAN AKUN

□ Password unik
□ Password kuat
□ 2FA aktif
□ Recovery email aman
□ Sesi login diperiksa
□ Perangkat lama dihapus
```

Progress:

``` text
3 / 6 selesai
```

CTA:

``` text
[ Lanjutkan Checklist → ]
```

------------------------------------------------------------------------

# 20. UX Autentikasi

## Login

``` text
MASUK KE TRACE

Email
[                              ]

Password
[                              ]

[ Masuk → ]

Lupa password?

──────── atau ────────

[ Lanjutkan dengan Google ]
```

## Register

``` text
BUAT AKUN TRACE

Email
Password
Konfirmasi Password

□ Saya menyetujui ketentuan penggunaan

[ Daftar → ]
```

### UX rule

Jangan membuat login menjadi penghalang utama public scanner.

Pengguna dapat memperoleh **hasil dasar tanpa login**, lalu diberi alasan
jelas untuk membuat akun:

``` text
Simpan hasil scan
Lihat timeline
Dapatkan rekomendasi personal
Terima alert keamanan
```

------------------------------------------------------------------------

# 21. Conversion Flow

``` text
Landing
   ↓
Scan
   ↓
Result
   ↓
Understand Risk
   ↓
Action
   ↓
"Jadikan ini personal"
   ↓
Register
   ↓
Dashboard
```

CTA setelah result:

``` text
[ Simpan & Pantau Keamanan ]
```

bukan:

``` text
[ DAFTAR SEKARANG!!! ]
```

Conversion harus terasa sebagai manfaat, bukan pressure.

------------------------------------------------------------------------

# 22. Component System

## Buttons

Variants:

``` text
Primary
Secondary
Danger
Ghost
Icon
```

Primary:

``` text
[ Cek Sekarang → ]
```

Rules:

-   border tegas,
-   radius kecil,
-   high contrast,
-   hover mengubah visual secara jelas,
-   focus state terlihat.

## Cards

Variants:

``` text
Feature Card
Risk Card
Stat Card
Timeline Card
Recommendation Card
AI Card
```

## Status Badge

``` text
AMAN
RENDAH
SEDANG
TINGGI
KRITIS
```

## Inputs

States:

``` text
Default
Focus
Filled
Error
Disabled
Loading
```

Error harus spesifik:

``` text
Email tidak valid.
```

bukan:

``` text
Terjadi kesalahan.
```

------------------------------------------------------------------------

# 23. Iconography

Style:

-   outline,
-   simple,
-   geometric,
-   consistent stroke.

Recommended concepts:

``` text
Shield
Lock
Search
Alert
Mail
Key
User
Timeline
Check
Arrow
Settings
Bell
```

Hindari icon terlalu dekoratif.

------------------------------------------------------------------------

# 24. Tables

Desktop:

``` text
Layanan | Tahun | Data | Risiko | Detail
```

Mobile:

Setiap row menjadi card:

``` text
SOCIAL MEDIA
2024

Email
Username

RISIKO TINGGI

[ Lihat Detail → ]
```

------------------------------------------------------------------------

# 25. Motion

Animation digunakan untuk feedback, bukan dekorasi.

Allowed:

-   scan progress,
-   score counting,
-   hover,
-   button feedback,
-   timeline reveal,
-   success confirmation.

Duration:

``` text
100–180ms  micro interaction
200–300ms  component transition
300–500ms  page/state transition
```

Hindari:

-   continuous spinning decoration,
-   parallax berlebihan,
-   glitch terus-menerus,
-   flashing red,
-   motion yang mengganggu accessibility.

------------------------------------------------------------------------

# 26. Loading States

Setiap asynchronous action memiliki state:

``` text
Idle
Loading
Success
Empty
Error
Retry
```

Contoh:

``` text
MENGANALISIS EXPOSURE...

Jangan tutup halaman.
```

Skeleton digunakan untuk dashboard dan history.

------------------------------------------------------------------------

# 27. Error States

## Generic

``` text
PEMERIKSAAN GAGAL

Kami belum dapat menyelesaikan pemeriksaan.

[ Coba Lagi ]
```

## Rate Limit

``` text
TERLALU BANYAK PERMINTAAN

Coba lagi beberapa saat lagi.
```

Jangan memberikan detail internal rate limit.

## Service unavailable

``` text
LAYANAN SEMENTARA TIDAK TERSEDIA

Coba lagi nanti.
```

Jangan expose stack trace atau database error.

------------------------------------------------------------------------

# 28. Empty States

## No Scan History

``` text
BELUM ADA RIWAYAT

Mulai dengan melakukan pemeriksaan pertama.

[ Cek Email → ]
```

## No Recommendation

``` text
SEMUA TERKENDALI

Saat ini tidak ada tindakan keamanan prioritas.
```

## No Alert

``` text
TIDAK ADA ALERT

Belum ada aktivitas yang memerlukan perhatianmu.
```

------------------------------------------------------------------------

# 29. Accessibility

Minimum target:

-   keyboard navigation,
-   visible focus,
-   semantic HTML,
-   sufficient contrast,
-   screen reader labels,
-   tidak bergantung hanya pada warna,
-   form error terhubung ke input,
-   reduced motion support,
-   touch target minimum sekitar 44px.

Risk indicator harus menggunakan:

``` text
warna + label + icon
```

bukan warna saja.

------------------------------------------------------------------------

# 30. Privacy UX

TRACE menangani informasi yang sensitif sehingga privacy harus terlihat
dalam interface.

Selalu jelaskan:

``` text
Apa yang dikirim
Mengapa dibutuhkan
Apakah disimpan
Berapa lama disimpan
```

Jangan membuat privacy notice terlalu panjang.

Contoh:

``` text
PRIVASI

Email digunakan untuk pemeriksaan exposure.
Kami tidak membutuhkan password akunmu.
```

------------------------------------------------------------------------

# 31. Security UX

UI tidak boleh membantu attacker.

Jangan menampilkan:

-   raw leaked credentials,
-   password korban,
-   token,
-   session cookie,
-   full personal records,
-   data korban lain,
-   query internal,
-   database identifier yang sensitif.

Untuk breach detail, tampilkan:

``` text
Jenis layanan
Tahun
Jenis data
Tingkat risiko
Rekomendasi
```

------------------------------------------------------------------------

# 32. Responsive Priority

Pada mobile, urutan informasi:

``` text
1. Risk / Result
2. Apa artinya
3. Tindakan utama
4. Detail exposure
5. Informasi tambahan
```

Jangan memaksa user melakukan horizontal scrolling untuk membaca hasil
penting.

------------------------------------------------------------------------

# 33. Core User Journey

## Public

``` text
LANDING
   ↓
EMAIL INPUT
   ↓
SCAN
   ↓
RESULT
   ↓
RISK
   ↓
RECOMMENDATION
```

## Registered

``` text
LOGIN
   ↓
DASHBOARD
   ↓
EXPOSURE SCORE
   ↓
PRIORITY ACTION
   ↓
TIMELINE
   ↓
AI ANALYST
   ↓
CHECKLIST
```

------------------------------------------------------------------------

# 34. Competition Demo Flow

Demo ideal:

``` text
00:00
Landing TRACE

00:20
Masukkan email demo

00:40
Exposure ditemukan

01:00
Skor Risiko 82

01:20
Lihat exposure timeline

01:40
AI menjelaskan risiko

02:10
Rekomendasi

02:30
Pengguna membuat akun

02:50
Dashboard

03:20
Checklist Keamanan

03:40
Penutup:
"Temukan. Pahami. Lindungi."
```

Demo harus fokus pada **satu cerita user**, bukan memamerkan semua
halaman.

------------------------------------------------------------------------

# 35. Golden UI Rule

Setiap screen TRACE harus menjawab:

``` text
APA YANG TERJADI?
        ↓
SEBERAPA BERISIKO?
        ↓
KENAPA?
        ↓
APA YANG HARUS SAYA LAKUKAN?
```

Jika sebuah komponen tidak membantu salah satu dari empat pertanyaan
tersebut, pertimbangkan untuk menghapusnya.

------------------------------------------------------------------------

# 36. Final Product Personality

TRACE harus terasa:

``` text
TECHNICAL
SERIOUS
DIRECT
TRUSTWORTHY
MODERN
BRUTAL
HUMAN
```

Bukan:

``` text
CORPORATE
GENERIC
OVERLY FRIENDLY
AI-GIMMICK
FEAR-MONGERING
```

------------------------------------------------------------------------

# 37. UI/UX Definition of Done

UI/UX dianggap siap masuk architecture dan development ketika:

-   [ ] sitemap disepakati,
-   [ ] public flow selesai,
-   [ ] authentication flow selesai,
-   [ ] email scanner flow selesai,
-   [ ] password checker flow selesai,
-   [ ] result states selesai,
-   [ ] dashboard hierarchy selesai,
-   [ ] risk score presentation selesai,
-   [ ] AI analyst UX selesai,
-   [ ] recommendation UX selesai,
-   [ ] timeline selesai,
-   [ ] checklist selesai,
-   [ ] loading/error/empty states selesai,
-   [ ] responsive behavior selesai,
-   [ ] accessibility rules selesai,
-   [ ] privacy UX selesai,
-   [ ] security UX selesai,
-   [ ] design tokens selesai,
-   [ ] component system selesai.

------------------------------------------------------------------------

# 38. Next Phase

Setelah `UI-UX.md`, urutan pengembangan TRACE:

``` text
UI-UX.md
    ↓
ARCHITECTURE.md
    ↓
DATABASE.md
    ↓
API.md
    ↓
AI-SYSTEM.md
    ↓
SECURITY.md
    ↓
DEVELOPMENT
```

**TRACE bukan sekadar breach checker.**

Produk akhirnya diarahkan menjadi:

> **Platform Intelijen Paparan Data Digital**

dengan prinsip:

> **Temukan. Pahami. Lindungi.**
