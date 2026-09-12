import Link from "next/link";
import { ArrowUpRight, LockKeyhole, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { Footer } from "@/components/footer";

const layers = [
  {
    number: "01",
    icon: ScanLine,
    title: "Deteksi",
    text: "TRACE memeriksa apakah email muncul pada sumber kebocoran yang dikonfigurasi. Untuk pemeriksaan password, sistem menggunakan pendekatan privacy-preserving agar password mentah tidak perlu dikirim atau disimpan.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Pemahaman",
    text: "Temuan teknis diterjemahkan menjadi risk score yang dapat dijelaskan, faktor penyebab, timeline exposure, dan bahasa yang lebih mudah dipahami.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Perlindungan",
    text: "Setiap risiko diarahkan ke rekomendasi yang diprioritaskan dan checklist keamanan yang bisa dikerjakan satu per satu.",
  },
];

const principles = [
  "AI menjelaskan data terstruktur; AI bukan sumber fakta breach dan tidak mengubah score.",
  "Password, token, raw breach dump, dan data pengguna lain tidak masuk ke browser database atau prompt AI.",
  "Akun memberikan ruang kerja personal: riwayat scan, timeline, rekomendasi, checklist, dan alert internal.",
  "Fitur yang belum tersedia penuh ditampilkan sebagai roadmap, bukan diklaim sebagai kemampuan aktif.",
];

export default function AboutPage() {
  return <div className="site-shell">
    <main className="info-page">
      <section className="info-hero">
        <div className="container">
          <span className="eyebrow">TRACE // DIGITAL EXPOSURE SCANNER</span>
          <h1>Temukan. Pahami. Lindungi.</h1>
          <p className="info-lead">TRACE adalah platform keamanan digital yang membantu kamu mengetahui apakah email pernah muncul dalam kebocoran data, memahami dampaknya, lalu mengambil langkah nyata untuk mengurangi risiko.</p>
          <div className="info-actions">
            <Link className="button button-primary" href="/scan/email">Cek email sekarang <ArrowUpRight size={16} /></Link>
            <Link className="button button-secondary" href="/faq">Baca FAQ</Link>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="container info-two-column">
          <div>
            <span className="eyebrow">KENAPA TRACE ADA?</span>
            <h2>Kebocoran data bukan akhir dari cerita.</h2>
          </div>
          <div className="info-copy">
            <p>Banyak orang hanya menerima jawaban “pernah bocor” atau “tidak ditemukan”, tetapi tidak tahu layanan mana yang terdampak, jenis data apa yang berisiko, dan tindakan apa yang harus dilakukan setelahnya.</p>
            <p>TRACE menjembatani kesenjangan antara temuan teknis dan keputusan pengguna. Tujuannya bukan menakut-nakuti, melainkan membuat risiko digital lebih terlihat, masuk akal, dan bisa ditindaklanjuti.</p>
          </div>
        </div>
      </section>

      <section className="info-section info-section-alt">
        <div className="container">
          <div className="section-head"><div><span className="eyebrow">EMPAT LAPIS NILAI</span><h2>Dari data exposure menjadi tindakan.</h2></div><p className="section-intro">TRACE dirancang lebih dari sekadar breach checker. Setiap tahap punya keluaran yang membantu pengguna bergerak ke tahap berikutnya.</p></div>
          <div className="grid-3">{layers.map(({ number, icon: Icon, title, text }) => <article className="card info-card" key={number}><span className="card-number">{number}</span><Icon className="info-icon" size={28} /><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className="info-callout"><strong>Pemantauan</strong><span>Riwayat scan, alert internal, dan roadmap monitoring melengkapi workspace personal. Monitoring otomatis 24/7 belum diklaim sebagai fitur MVP aktif.</span></div>
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <div className="section-head"><div><span className="eyebrow">UNTUK JURI DAN PENGGUNA</span><h2>Apa yang terjadi di balik layar?</h2></div><p className="section-intro">TRACE menggunakan arsitektur modular monolith agar cepat dikembangkan, mudah diaudit, dan tetap punya batas keamanan yang jelas.</p></div>
          <div className="grid-2">
            <article className="card"><span className="card-number">REQUEST FLOW</span><h3>Scan yang terstruktur</h3><ol className="info-steps"><li>Input divalidasi dan email dinormalisasi.</li><li>Provider breach dipanggil melalui adapter, bukan langsung dari komponen UI.</li><li>Exposure dinormalisasi dan dideduplikasi.</li><li>Risk engine menghitung score 0-100 berdasarkan faktor yang dapat dijelaskan.</li><li>Recommendation engine menghasilkan tindakan prioritas dan hasil aman dikirim ke UI.</li></ol></article>
            <article className="card"><span className="card-number">TECH STACK</span><h3>Fondasi MVP TRACE</h3><ul className="info-list"><li>Next.js, React, TypeScript, dan CSS modular untuk web app.</li><li>Firebase Authentication untuk identitas dan Cloud Firestore untuk workspace personal.</li><li>Server-side route/service untuk operasi sensitif dan verifikasi token.</li><li>Provider adapter yang dapat diganti, risk engine deterministic, serta AI sebagai lapisan penjelasan opsional.</li><li>Ownership data dibatasi dengan uid pengguna dan Firestore Security Rules.</li></ul></article>
          </div>
        </div>
      </section>

      <section className="info-section info-section-alt">
        <div className="container info-two-column">
          <div><span className="eyebrow">PRIVASI DAN KEAMANAN</span><h2>Data sensitif tidak boleh menjadi harga sebuah insight.</h2></div>
          <div className="card info-security-card"><LockKeyhole className="info-icon" size={30} /><ul className="info-list">{principles.map((principle) => <li key={principle}>{principle}</li>)}</ul></div>
        </div>
      </section>

      <section className="info-section">
        <div className="container info-two-column">
          <div><span className="eyebrow">STATUS MVP</span><h2>Transparan tentang batasan.</h2></div>
          <div className="info-copy"><p>Konfigurasi demo TRACE yang sedang dipakai menggunakan TRACE Demo Dataset, sehingga hasil demo diberi label dengan jelas dan bukan statistik dunia nyata.</p><p>Kode aplikasi sudah memiliki adapter untuk provider HIBP. Pemeriksaan email nyata membutuhkan API key atau subscription HIBP yang disimpan server-side; secret tersebut tidak boleh diletakkan di browser atau dikirim ke chat.</p><p>Setelah provider produksi tersedia, roadmap berikutnya adalah monitoring terjadwal, alert email, App Check yang lebih ketat, dan observability cloud. Semua itu akan diaktifkan hanya setelah alur dan biaya operasionalnya siap.</p></div>
        </div>
      </section>

      <section className="info-section info-final-cta">
        <div className="container"><div className="card"><span className="eyebrow">JAGA DATA. JAGA MASA DEPAN.</span><h2>Mulai dari satu email.</h2><p className="section-intro">Cek exposure dasar tanpa login, lalu buat akun jika ingin menyimpan riwayat dan membangun workspace perlindungan personal.</p><Link className="button button-primary" href="/scan/email">Mulai pemeriksaan <ArrowUpRight size={16} /></Link></div></div>
      </section>
    </main>
    <Footer />
  </div>;
}
