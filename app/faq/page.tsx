import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/footer";

const questions = [
  ["Apa itu TRACE?", "TRACE adalah platform keamanan digital yang membantu menemukan exposure email, menjelaskan risikonya, dan mengubah temuan menjadi rekomendasi serta checklist perlindungan."],
  ["Apakah hasil scan email saat ini pemeriksaan dunia nyata?", "Pada konfigurasi demo, belum. Hasilnya berasal dari TRACE Demo Dataset dan sengaja diberi label agar tidak disalahartikan sebagai statistik dunia nyata. TRACE memiliki adapter HIBP untuk provider produksi, tetapi pemeriksaan email nyata membutuhkan API key atau subscription HIBP."],
  ["Mengapa pemeriksaan email membutuhkan API key provider?", "Provider seperti HIBP mewajibkan autentikasi untuk pencarian email. API key harus disimpan di server-side environment dan tidak boleh ditaruh di NEXT_PUBLIC atau dikirim ke browser."],
  ["Apakah TRACE menyimpan password saya?", "Tidak. TRACE tidak menyimpan raw password, tidak mengirim password ke Vertex AI, dan menggunakan pendekatan privacy-preserving untuk pemeriksaan password. Hasil password juga tidak diperlakukan sebagai riwayat rahasia yang disimpan."],
  ["Apakah ‘tidak ditemukan’ berarti akun saya pasti aman?", "Tidak. Hasil hanya berlaku untuk sumber dan provider yang diperiksa. Bisa saja ada kebocoran yang belum diketahui, belum masuk dataset, atau menggunakan alamat email lain. Tetap gunakan password unik, MFA, dan waspadai phishing."],
  ["Kenapa saya bisa scan tanpa login?", "Prinsip TRACE adalah Public = Check. Pemeriksaan dasar dibuat mudah diakses tanpa login. Account = Protect: akun diperlukan untuk menyimpan scan history, timeline, rekomendasi, checklist, dan workspace personal."],
  ["Bagaimana risk score TRACE dihitung?", "Score dihasilkan oleh risk engine deterministic, bukan dibuat AI secara acak. Faktor resminya mencakup sensitivitas data, exposure password atau autentikasi, jumlah exposure, kebaruan, dan severity sumber. AI hanya membantu menjelaskan hasilnya."],
  ["Apa peran AI di TRACE?", "AI adalah lapisan penjelasan dan edukasi. Ia menerima security state terstruktur yang sudah disaring, lalu membantu menyusun ringkasan dan tindakan dalam Bahasa Indonesia. Fakta breach dan score utama tetap berasal dari provider serta risk engine."],
  ["Bagaimana data akun saya dilindungi?", "TRACE memakai Firebase Authentication dan Firestore. Data private diturunkan dari uid, akses user dibatasi ke dokumennya sendiri, token diverifikasi di server untuk operasi sensitif, dan Security Rules mencegah akses ke data user lain."],
  ["Apakah login email dan Google aman?", "TRACE mendukung email/password dengan alur verifikasi email. Login Google menggunakan Firebase Authentication ketika provider Google diaktifkan di project Firebase. Credential dikelola Firebase, bukan disimpan oleh komponen React."],
  ["Apakah TRACE memonitor email saya 24/7?", "Belum. Monitoring otomatis 24/7, browser extension, dan penggantian password otomatis berada di luar scope MVP. Fitur yang tersedia saat ini berfokus pada scan, penjelasan, rekomendasi, checklist, dan workspace personal."],
  ["Siapa yang sebaiknya memakai TRACE?", "TRACE ditujukan untuk mahasiswa, pengguna internet umum, pemilik banyak akun online, serta organisasi atau komunitas yang ingin meningkatkan literasi keamanan digital. TRACE bukan pengganti incident response profesional untuk kasus kritis."],
];

export default function FaqPage() {
  return <div className="site-shell">
    <main className="faq-page">
      <section className="info-hero">
        <div className="container">
          <span className="eyebrow">TRACE // PERTANYAAN UMUM</span>
          <h1>Jawaban yang jujur tentang keamanan digital.</h1>
          <p className="info-lead">Cari tahu cara kerja TRACE, batasan mode demo, perlindungan data, dan alasan di balik setiap fitur.</p>
        </div>
      </section>
      <section className="info-section faq-section">
        <div className="container">
          <div className="faq-list">{questions.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
          <div className="card faq-cta"><span className="eyebrow">MASIH PENASARAN?</span><h2>Mulai dengan pemeriksaan sederhana.</h2><p className="section-intro">Cek email kamu dan lihat bagaimana TRACE mengubah exposure menjadi langkah perlindungan.</p><Link className="button button-primary" href="/scan/email">Cek email <ArrowUpRight size={16} /></Link></div>
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}
