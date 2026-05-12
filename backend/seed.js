
// ================================================================
// BIKA Website - Seed Script
// Usage: node seed.js
// Make sure your backend server is running first!
// Edit CONFIG below to match your setup.
// ================================================================

const http = require('http');

const CONFIG = {
  host: 'localhost',
  port: 3001,           // change if your backend runs on a different port
  adminUsername: 'admin',
  adminPassword: 'admin123',
};

// ── HTTP helper ──────────────────────────────────────────────────
function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: CONFIG.host,
      port: CONFIG.port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ── Seed Data ────────────────────────────────────────────────────
const SEED_DATA = {

  // ── 10 Lowongan Kerja ─────────────────────────────────────────
  lowongan: [
    {
      kategori: 'lowongan',
      judul: 'Frontend Developer',
      perusahaan: 'Tokopedia',
      lokasi: 'Jakarta',
      tipe_pekerjaan: 'Full-Time',
      deskripsi: 'Membangun antarmuka pengguna modern menggunakan React dan Tailwind CSS untuk platform e-commerce terbesar di Indonesia.',
      link_eksternal: 'https://tokopedia.com/careers',
    },
    {
      kategori: 'lowongan',
      judul: 'Backend Engineer',
      perusahaan: 'Gojek',
      lokasi: 'Jakarta',
      tipe_pekerjaan: 'Full-Time',
      deskripsi: 'Mengembangkan dan memelihara REST API menggunakan Node.js dan PostgreSQL untuk layanan ride-hailing berskala besar.',
      link_eksternal: 'https://gojek.com/careers',
    },
    {
      kategori: 'lowongan',
      judul: 'UI/UX Designer',
      perusahaan: 'Shopee',
      lokasi: 'Jakarta',
      tipe_pekerjaan: 'Full-Time',
      deskripsi: 'Merancang pengalaman pengguna yang intuitif dan menarik untuk aplikasi mobile Shopee dengan jutaan pengguna aktif.',
      link_eksternal: 'https://shopee.co.id/careers',
    },
    {
      kategori: 'lowongan',
      judul: 'Data Analyst',
      perusahaan: 'Traveloka',
      lokasi: 'Bandung',
      tipe_pekerjaan: 'Full-Time',
      deskripsi: 'Menganalisis data pengguna dan tren perjalanan untuk mendukung keputusan bisnis strategis di platform travel terkemuka.',
      link_eksternal: 'https://traveloka.com/careers',
    },
    {
      kategori: 'lowongan',
      judul: 'Mobile Developer Android',
      perusahaan: 'Bukalapak',
      lokasi: 'Bandung',
      tipe_pekerjaan: 'Full-Time',
      deskripsi: 'Mengembangkan fitur-fitur baru pada aplikasi Android Bukalapak menggunakan Kotlin dan Jetpack Compose.',
      link_eksternal: 'https://bukalapak.com/careers',
    },
    {
      kategori: 'lowongan',
      judul: 'DevOps Engineer',
      perusahaan: 'Tiket.com',
      lokasi: 'Remote',
      tipe_pekerjaan: 'Full-Time',
      deskripsi: 'Mengelola infrastruktur cloud AWS dan membangun pipeline CI/CD untuk deployment yang cepat dan andal.',
      link_eksternal: 'https://tiket.com/careers',
    },
    {
      kategori: 'lowongan',
      judul: 'Graphic Designer',
      perusahaan: 'Kopi Kenangan',
      lokasi: 'Jakarta',
      tipe_pekerjaan: 'Part-Time',
      deskripsi: 'Membuat konten visual kreatif untuk media sosial, materi promosi, dan branding Kopi Kenangan.',
      link_eksternal: 'https://kopikenangan.com/careers',
    },
    {
      kategori: 'lowongan',
      judul: 'Content Writer',
      perusahaan: 'IDN Media',
      lokasi: 'Remote',
      tipe_pekerjaan: 'Freelance',
      deskripsi: 'Menulis artikel berkualitas tinggi tentang gaya hidup, teknologi, dan berita terkini untuk platform digital IDN Times.',
      link_eksternal: 'https://idntimes.com/careers',
    },
    {
      kategori: 'lowongan',
      judul: 'Network Technician',
      perusahaan: 'Telkom Indonesia',
      lokasi: 'Surabaya',
      tipe_pekerjaan: 'Full-Time',
      deskripsi: 'Instalasi, konfigurasi, dan pemeliharaan jaringan fiber optik dan infrastruktur telekomunikasi nasional.',
      link_eksternal: 'https://telkom.co.id/careers',
    },
    {
      kategori: 'lowongan',
      judul: 'Magang IT Support',
      perusahaan: 'Bank BRI',
      lokasi: 'Jakarta',
      tipe_pekerjaan: 'Magang',
      deskripsi: 'Mendukung operasional IT harian dan memberikan layanan helpdesk kepada karyawan Bank BRI di kantor pusat.',
      link_eksternal: 'https://bri.co.id/careers',
    },
  ],

  // ── 10 Tutorial Tips Wawancara ────────────────────────────────
  tutorial: [
    {
      kategori: 'tutorial',
      judul: 'Cara Menjawab "Ceritakan Tentang Diri Anda"',
      deskripsi: 'Panduan menjawab pertanyaan pembuka wawancara dengan percaya diri dan terstruktur.',
      isi_konten: `Pertanyaan ini hampir selalu menjadi pembuka wawancara. Gunakan formula Present-Past-Future:

1. PRESENT: Ceritakan posisi atau status kamu saat ini (pelajar SMK jurusan X, fresh graduate, dsb).
2. PAST: Sebutkan pengalaman atau pencapaian relevan yang mendukung posisi yang dilamar.
3. FUTURE: Jelaskan mengapa kamu tertarik dengan posisi ini dan apa yang ingin kamu capai.

Tips tambahan:
- Jaga durasi jawaban 1-2 menit, tidak lebih.
- Fokus pada hal yang relevan dengan pekerjaan, bukan cerita pribadi.
- Akhiri dengan antusias tentang peluang yang ada.
- Latih di depan cermin atau rekam video untuk evaluasi.`,
    },
    {
      kategori: 'tutorial',
      judul: 'Tips Lolos Seleksi Administrasi Lamaran Kerja',
      deskripsi: 'Pastikan berkas lamaranmu tidak langsung masuk tong sampah HRD.',
      isi_konten: `Seleksi administrasi adalah gerbang pertama yang harus dilewati. Banyak pelamar gugur di tahap ini bukan karena tidak kompeten, tapi karena berkas yang tidak rapi.

Checklist CV yang lolos ATS:
- Tidak melebihi 2 halaman untuk fresh graduate
- Gunakan format ATS-friendly: hindari tabel, kolom, dan gambar berlebihan
- Sesuaikan kata kunci dengan deskripsi pekerjaan
- Gunakan font standar: Calibri, Arial, atau Times New Roman ukuran 10-12pt
- Simpan dalam format PDF dengan nama file yang profesional

Surat Lamaran:
- Jangan gunakan template generik yang sama untuk semua perusahaan
- Sebutkan nama posisi dan dari mana kamu tahu lowongan ini
- Jelaskan secara singkat mengapa kamu cocok untuk posisi tersebut
- Tunjukkan pengetahuan tentang perusahaan yang kamu lamar`,
    },
    {
      kategori: 'tutorial',
      judul: 'Cara Negosiasi Gaji dengan Percaya Diri',
      deskripsi: 'Jangan langsung terima tawaran pertama — pelajari cara negosiasi yang tepat.',
      isi_konten: `Negosiasi gaji adalah keterampilan yang bisa dipelajari. Banyak fresh graduate melewatkan kesempatan ini karena takut atau tidak tahu caranya.

Persiapan sebelum negosiasi:
1. Riset kisaran gaji posisi tersebut di Glassdoor, LinkedIn Salary, atau ITSalary.id
2. Hitung kebutuhan hidupmu secara realistis
3. Ketahui nilai yang kamu tawarkan kepada perusahaan

Saat negosiasi:
- Berikan range, bukan angka pasti. Contoh: "Berdasarkan riset saya, kisaran untuk posisi ini adalah Rp 5-7 juta. Saya berharap di kisaran tersebut."
- Jangan sebutkan angka pertama jika bisa dihindari
- Pertimbangkan total kompensasi: tunjangan, asuransi, bonus, dan fasilitas lainnya
- Selalu profesional dan tidak emosional meski tawaran di bawah ekspektasi`,
    },
    {
      kategori: 'tutorial',
      judul: 'Persiapan Wawancara Teknis untuk Fresh Graduate',
      deskripsi: 'Wawancara teknis tidak harus menakutkan jika kamu tahu cara mempersiapkannya.',
      isi_konten: `Wawancara teknis menguji kemampuan spesifik yang dibutuhkan untuk pekerjaan. Persiapan yang tepat bisa membuat perbedaan besar.

Untuk bidang IT/Teknologi:
- Pelajari fundamental: algoritma, struktur data, dan konsep OOP
- Latih problem-solving di HackerRank atau LeetCode (level easy-medium)
- Siapkan 2-3 proyek yang bisa kamu jelaskan secara detail
- Pahami teknologi yang disebutkan di job description

Untuk bidang lainnya:
- Pelajari konsep dasar bidangmu (akuntansi, pemasaran, teknik, dsb)
- Siapkan contoh kasus nyata dari pengalaman magang atau proyek sekolah

Tips umum:
- Berpikir keras (think aloud) saat menjawab soal
- Jika tidak tahu, jujur dan tunjukkan cara kamu akan mencari solusinya
- Tanyakan klarifikasi jika soal tidak jelas`,
    },
    {
      kategori: 'tutorial',
      judul: 'Cara Membuat CV yang Menarik Perhatian HRD',
      deskripsi: 'CV adalah kesan pertama kamu — buat agar tidak terlupakan.',
      isi_konten: `CV yang baik bukan hanya soal desain, tapi soal konten yang relevan dan terstruktur.

Struktur CV yang efektif:
1. Header: Nama, kontak, LinkedIn, dan portofolio/GitHub
2. Ringkasan Profesional: 2-3 kalimat tentang siapa kamu dan apa yang kamu tawarkan
3. Pengalaman: Mulai dari yang terbaru, gunakan bullet points dengan kata kerja aksi
4. Pendidikan: Cantumkan IPK jika di atas 3.0
5. Keahlian: Pisahkan hard skills dan soft skills
6. Proyek/Portofolio: Sangat penting untuk fresh graduate

Formula bullet point yang kuat:
[Kata kerja aksi] + [apa yang dilakukan] + [hasil yang terukur]
Contoh: "Mengembangkan sistem kasir berbasis web yang mengurangi waktu transaksi 30%"

Hindari:
- Foto yang tidak profesional
- Informasi yang tidak relevan (hobi yang tidak berkaitan)
- Typo dan kesalahan grammar`,
    },
    {
      kategori: 'tutorial',
      judul: 'Etika Berpakaian saat Wawancara Kerja',
      deskripsi: 'Penampilan pertama sangat menentukan — jangan remehkan dress code.',
      isi_konten: `Penelitian menunjukkan bahwa kesan pertama terbentuk dalam 7 detik pertama. Penampilan yang tepat menunjukkan profesionalisme dan rasa hormat.

Panduan berpakaian berdasarkan jenis perusahaan:
- Korporat/Bank/BUMN: Formal — kemeja/blus, celana/rok bahan, sepatu formal
- Startup teknologi: Smart casual — kemeja polos atau polo shirt, celana chino
- Kreatif/Media: Business casual — lebih fleksibel tapi tetap rapi

Tips umum:
- Riset budaya perusahaan dari website atau media sosial mereka
- Pilih warna netral: navy, abu-abu, putih, atau hitam
- Pastikan pakaian bersih, disetrika, dan tidak terlalu ketat
- Hindari parfum atau cologne yang terlalu menyengat
- Datang 10-15 menit lebih awal untuk menyesuaikan diri dengan lingkungan`,
    },
    {
      kategori: 'tutorial',
      judul: 'Cara Menjawab Pertanyaan Kelemahan Diri',
      deskripsi: 'Pertanyaan jebakan yang bisa kamu ubah menjadi nilai plus.',
      isi_konten: `"Apa kelemahan terbesar kamu?" adalah pertanyaan yang sering membuat pelamar panik. Tapi dengan strategi yang tepat, ini bisa menjadi kesempatan untuk menunjukkan self-awareness.

Yang TIDAK boleh dilakukan:
- Menjawab "Saya terlalu perfeksionis" (klise dan tidak meyakinkan)
- Menyebutkan kelemahan yang kritis untuk pekerjaan tersebut
- Mengatakan tidak punya kelemahan

Strategi yang tepat:
1. Pilih kelemahan nyata yang sedang kamu perbaiki
2. Jelaskan langkah konkret yang sudah kamu ambil untuk mengatasinya
3. Tunjukkan progress yang sudah dicapai

Contoh jawaban yang baik:
"Saya dulu kesulitan berbicara di depan umum dan sering gugup saat presentasi. Untuk mengatasinya, saya aktif bergabung dengan komunitas public speaking di sekolah dan rutin berlatih. Sekarang saya sudah jauh lebih percaya diri dan bahkan menjadi MC di beberapa acara sekolah."`,
    },
    {
      kategori: 'tutorial',
      judul: 'Panduan Wawancara Online via Video Call',
      deskripsi: 'Wawancara virtual punya tantangan tersendiri — ini cara mengatasinya.',
      isi_konten: `Wawancara online semakin umum. Persiapan teknis sama pentingnya dengan persiapan konten.

Persiapan teknis (lakukan 30 menit sebelumnya):
- Test koneksi internet — gunakan kabel LAN jika memungkinkan
- Test kamera dan mikrofon
- Pastikan baterai laptop terisi penuh atau terhubung ke charger
- Siapkan backup: nomor HP untuk dihubungi jika koneksi putus

Lingkungan:
- Pilih ruangan yang tenang dan pencahayaan yang baik (cahaya dari depan, bukan belakang)
- Latar belakang yang bersih atau gunakan virtual background profesional
- Beritahu anggota keluarga untuk tidak mengganggu selama wawancara

Saat wawancara:
- Tatap kamera (bukan layar) saat berbicara untuk kesan eye contact
- Berpakaian formal dari atas hingga bawah
- Siapkan catatan kecil di luar frame kamera
- Matikan notifikasi HP dan komputer`,
    },
    {
      kategori: 'tutorial',
      judul: 'Cara Follow Up Setelah Wawancara Kerja',
      deskripsi: 'Langkah kecil yang sering dilupakan tapi bisa membedakan kamu dari kandidat lain.',
      isi_konten: `Follow up yang tepat menunjukkan profesionalisme dan minat yang tulus terhadap posisi tersebut.

Email ucapan terima kasih (kirim dalam 24 jam):
- Subject: "Terima Kasih - Wawancara [Posisi] - [Nama Kamu]"
- Ucapkan terima kasih atas waktu yang diberikan
- Sebutkan satu hal spesifik yang kamu diskusikan (menunjukkan kamu benar-benar hadir)
- Tegaskan kembali minat dan kesesuaianmu dengan posisi tersebut
- Tutup dengan sopan dan profesional

Jika belum ada kabar:
- Tunggu minimal 1 minggu setelah batas waktu yang disebutkan
- Kirim follow-up singkat yang sopan: "Saya ingin menanyakan perkembangan proses seleksi..."
- Maksimal 2 kali follow-up — jangan terlalu sering menghubungi

Yang perlu diingat:
- Jangan mengirim pesan di luar jam kerja
- Gunakan email, bukan WhatsApp kecuali diminta
- Tetap profesional meski hasilnya mengecewakan`,
    },
    {
      kategori: 'tutorial',
      judul: 'Membangun Personal Branding di LinkedIn untuk Pelajar',
      deskripsi: 'LinkedIn bukan sekadar CV online — ini cara memaksimalkannya sejak sekolah.',
      isi_konten: `LinkedIn adalah platform profesional terpenting saat ini. Membangunnya sejak sekolah memberikan keunggulan kompetitif yang besar.

Optimasi profil:
- Foto profesional dengan latar belakang netral (bukan selfie atau foto liburan)
- Headline yang spesifik: "SMK Jurusan RPL | Aspiring Web Developer | React & Node.js"
- Bagian About: cerita singkat tentang passion, keahlian, dan tujuan karir (150-200 kata)
- Cantumkan semua pengalaman: magang, proyek sekolah, organisasi, volunteer

Strategi konten:
- Posting minimal 2x seminggu tentang hal yang kamu pelajari
- Bagikan proyek yang sedang kamu kerjakan
- Komentari postingan profesional di bidangmu
- Tulis artikel tentang pengalaman atau insight yang kamu miliki

Networking:
- Connect dengan alumni sekolah yang sudah bekerja
- Ikuti perusahaan yang kamu minati
- Bergabung dengan grup komunitas profesional
- Jangan ragu mengirim pesan personal yang sopan ke profesional yang kamu kagumi`,
    },
  ],

  // ── 10 Tips Usaha ─────────────────────────────────────────────
  usaha: [
    {
      kategori: 'usaha',
      judul: 'Cara Memulai Usaha dengan Modal Minim',
      deskripsi: 'Tidak perlu modal besar untuk mulai berbisnis — ini strateginya.',
      isi_konten: `Banyak pengusaha sukses memulai dari nol. Kuncinya adalah memilih model bisnis yang tepat dan memvalidasi ide sebelum berinvestasi besar.

Bisnis modal minim yang cocok untuk pelajar SMK:
- Jasa desain grafis (modal: laptop dan Canva/Adobe)
- Jasa edit foto dan video (modal: smartphone dan aplikasi editing)
- Les privat mata pelajaran (modal: pengetahuan dan waktu)
- Social media management untuk UMKM lokal
- Dropship produk tanpa stok

Langkah memulai:
1. Identifikasi keahlian yang kamu miliki
2. Riset apakah ada yang mau membayar untuk keahlian tersebut
3. Validasi dengan menawarkan ke 3-5 orang pertama
4. Gunakan platform gratis: Instagram, WhatsApp Business, Canva
5. Reinvestasikan keuntungan pertama untuk mengembangkan bisnis

Ingat: mulai kecil, belajar cepat, dan berkembang secara bertahap.`,
    },
    {
      kategori: 'usaha',
      judul: 'Ide Bisnis Kreatif untuk Pelajar SMK',
      deskripsi: '10 ide bisnis yang bisa dimulai dari sekolah tanpa mengganggu belajar.',
      isi_konten: `Menjadi pengusaha muda bukan berarti harus mengorbankan pendidikan. Berikut ide bisnis yang bisa dijalankan sambil sekolah:

1. Jasa desain logo dan poster untuk UMKM lokal
2. Jualan makanan/minuman homemade di kantin atau online
3. Les privat mata pelajaran untuk adik kelas
4. Jasa edit foto dan video untuk acara keluarga atau sekolah
5. Dropship produk fashion atau aksesoris
6. Jasa ketik, print, dan jilid dokumen
7. Jualan pulsa, paket data, dan token listrik
8. Jasa pembuatan website sederhana untuk warung atau toko
9. Reseller produk skincare atau suplemen
10. Jasa dekorasi balon untuk ulang tahun dan wisuda

Tips sukses:
- Pilih bisnis yang sesuai dengan keahlian dan minatmu
- Mulai dari lingkaran terdekat: teman, keluarga, dan tetangga
- Manfaatkan media sosial untuk promosi gratis
- Jaga kualitas dan konsistensi pelayanan`,
    },
    {
      kategori: 'usaha',
      judul: 'Cara Membuat Rencana Bisnis Sederhana',
      deskripsi: 'Business plan tidak harus rumit — ini template sederhananya untuk pemula.',
      isi_konten: `Business plan adalah peta jalan bisnis kamu. Tidak perlu puluhan halaman — yang penting mencakup elemen kunci.

Template Business Plan 1 Halaman:

1. DESKRIPSI BISNIS
   - Apa yang dijual?
   - Kepada siapa?
   - Apa yang membedakan dari kompetitor?

2. ANALISIS PASAR
   - Siapa target pelanggan utama?
   - Berapa besar potensi pasarnya?
   - Siapa kompetitor dan apa kelemahannya?

3. STRATEGI PEMASARAN
   - Bagaimana cara menjangkau pelanggan?
   - Platform apa yang akan digunakan?
   - Berapa anggaran pemasaran?

4. PROYEKSI KEUANGAN (3 bulan pertama)
   - Estimasi pendapatan per bulan
   - Estimasi pengeluaran per bulan
   - Break-even point (kapan mulai untung?)

5. KEBUTUHAN MODAL
   - Berapa modal yang dibutuhkan?
   - Dari mana sumbernya?

Review dan update business plan setiap 3 bulan.`,
    },
    {
      kategori: 'usaha',
      judul: 'Strategi Pemasaran Digital untuk Bisnis Kecil',
      deskripsi: 'Cara memasarkan produk secara online tanpa biaya besar.',
      isi_konten: `Pemasaran digital membuka peluang yang sama bagi bisnis kecil dan besar. Kuncinya adalah konsistensi dan kreativitas.

Platform yang tepat untuk setiap jenis bisnis:
- Instagram: produk visual (makanan, fashion, kerajinan)
- TikTok: jangkauan organik luas, cocok untuk semua jenis bisnis
- WhatsApp Business: komunikasi personal dan layanan pelanggan
- Tokopedia/Shopee: produk fisik yang butuh marketplace
- LinkedIn: jasa B2B dan profesional

Strategi konten yang efektif:
1. Buat konten yang memberikan nilai (tips, tutorial, behind the scenes)
2. Jangan hanya posting promosi — ikuti aturan 80/20 (80% konten edukatif, 20% promosi)
3. Posting secara konsisten: minimal 3x seminggu
4. Gunakan hashtag yang relevan dan spesifik
5. Balas semua komentar dan DM dalam 24 jam

Kolaborasi:
- Micro-influencer lokal (1.000-10.000 followers) lebih efektif dan terjangkau
- Kolaborasi dengan bisnis komplementer untuk cross-promotion
- Minta testimoni dari pelanggan puas`,
    },
    {
      kategori: 'usaha',
      judul: 'Cara Mengelola Keuangan Bisnis Kecil',
      deskripsi: 'Pisahkan keuangan pribadi dan bisnis sejak hari pertama.',
      isi_konten: `Kegagalan mengelola keuangan adalah penyebab utama bisnis kecil bangkrut. Mulai dengan kebiasaan yang benar sejak awal.

Langkah dasar pengelolaan keuangan bisnis:

1. PISAHKAN REKENING
   - Buka rekening bank terpisah untuk bisnis
   - Jangan campur uang bisnis dan pribadi

2. CATAT SEMUA TRANSAKSI
   - Gunakan aplikasi gratis: BukuKas, BukuWarung, atau Wave
   - Catat setiap pemasukan dan pengeluaran, sekecil apapun
   - Simpan semua bukti transaksi

3. HITUNG HPP DENGAN BENAR
   - HPP = Biaya bahan baku + Biaya tenaga kerja + Biaya overhead
   - Harga jual minimal = HPP x 1.3 (margin 30%)

4. KELOLA ARUS KAS
   - Pantau cash flow mingguan
   - Sisihkan 20% keuntungan untuk modal cadangan
   - Jangan habiskan semua keuntungan untuk konsumsi pribadi

5. LAPORAN KEUANGAN BULANAN
   - Buat laporan laba rugi sederhana setiap bulan
   - Evaluasi mana produk/layanan yang paling menguntungkan`,
    },
    {
      kategori: 'usaha',
      judul: 'Cara Mendapatkan Pelanggan Pertama',
      deskripsi: 'Pelanggan pertama adalah yang paling sulit — ini cara mendapatkannya.',
      isi_konten: `Mendapatkan pelanggan pertama adalah tantangan terbesar setiap bisnis baru. Tanpa track record, kamu harus membangun kepercayaan dari nol.

Strategi mendapatkan pelanggan pertama:

1. MULAI DARI LINGKARAN TERDEKAT
   - Tawarkan ke keluarga, teman, dan tetangga
   - Minta mereka merekomendasikan ke orang lain
   - Bergabung dengan grup komunitas lokal

2. STRATEGI EARLY ADOPTER
   - Tawarkan harga spesial atau gratis untuk 3-5 pelanggan pertama
   - Syaratnya: mereka harus memberikan testimoni jujur
   - Gunakan testimoni ini sebagai social proof

3. KONTEN YANG MEMBANGUN KEPERCAYAAN
   - Tunjukkan proses pembuatan produk (behind the scenes)
   - Bagikan pengetahuan dan tips gratis di media sosial
   - Tampilkan sertifikat, penghargaan, atau portofolio

4. AKTIF DI KOMUNITAS ONLINE
   - Bergabung dengan grup Facebook atau forum yang relevan
   - Bantu menjawab pertanyaan tanpa langsung berjualan
   - Bangun reputasi sebagai ahli di bidangmu

5. KOLABORASI
   - Titipkan produk di toko atau warung yang sudah punya pelanggan
   - Ikuti bazar atau pameran lokal`,
    },
    {
      kategori: 'usaha',
      judul: 'Cara Menghadapi Persaingan Bisnis dengan Cerdas',
      deskripsi: 'Kompetitor bukan musuh — ini cara menyikapinya dengan strategi yang tepat.',
      isi_konten: `Persaingan adalah tanda bahwa ada pasar yang nyata. Pengusaha sukses melihat kompetitor sebagai motivasi, bukan ancaman.

Analisis kompetitor yang efektif:
1. Identifikasi 3-5 kompetitor utama
2. Pelajari kekuatan dan kelemahan mereka
3. Baca review pelanggan mereka untuk menemukan celah
4. Pantau harga, produk baru, dan strategi pemasaran mereka

Strategi diferensiasi:
- Jangan bersaing di harga — selalu ada yang lebih murah
- Fokus pada kualitas, pelayanan, atau pengalaman yang lebih baik
- Temukan niche yang belum dilayani dengan baik
- Bangun brand yang kuat dan personal

Membangun loyalitas pelanggan:
- Program loyalitas sederhana (poin, diskon untuk pelanggan setia)
- Pelayanan yang melampaui ekspektasi
- Komunikasi yang personal dan responsif
- Minta feedback dan tunjukkan bahwa kamu mendengarkan

Ingat: pasar cukup besar untuk semua orang jika kamu menemukan posisi yang tepat.`,
    },
    {
      kategori: 'usaha',
      judul: 'Cara Mendaftarkan Usaha Secara Legal',
      deskripsi: 'Legalitas bisnis penting untuk kepercayaan pelanggan dan akses permodalan.',
      isi_konten: `Banyak pengusaha muda menunda legalitas karena dianggap rumit dan mahal. Padahal, prosesnya kini jauh lebih mudah dan gratis.

Langkah mendaftarkan usaha:

1. NIB (Nomor Induk Berusaha)
   - Daftar di oss.go.id — gratis dan online
   - Proses bisa selesai dalam 1 hari
   - Berlaku untuk semua jenis usaha

2. Manfaat memiliki NIB:
   - Bisa membuka rekening bisnis di bank
   - Bisa mengikuti tender pemerintah
   - Akses KUR (Kredit Usaha Rakyat) dengan bunga rendah
   - Meningkatkan kepercayaan pelanggan dan mitra bisnis

3. Untuk usaha yang lebih besar:
   - CV (Commanditaire Vennootschap) untuk usaha bersama
   - PT (Perseroan Terbatas) untuk usaha yang butuh investasi
   - Konsultasikan dengan notaris untuk proses pendirian

4. Izin tambahan yang mungkin diperlukan:
   - PIRT untuk produk makanan rumahan
   - Izin edar BPOM untuk produk kosmetik
   - Sertifikat halal untuk produk makanan/minuman`,
    },
    {
      kategori: 'usaha',
      judul: 'Cara Menggunakan Media Sosial untuk Bisnis',
      deskripsi: 'Panduan lengkap membangun kehadiran online yang kuat dan konsisten.',
      isi_konten: `Media sosial adalah alat pemasaran paling powerful yang pernah ada — dan gratis. Tapi tanpa strategi, hasilnya tidak optimal.

Memilih platform yang tepat:
- Instagram: visual, cocok untuk produk fisik dan lifestyle
- TikTok: video pendek, jangkauan organik sangat luas
- Facebook: komunitas dan grup, cocok untuk target usia 25+
- WhatsApp Business: komunikasi langsung dan personal
- YouTube: konten edukasi panjang, membangun otoritas

Membuat konten yang engaging:
1. Kenali audiensmu: usia, minat, masalah yang mereka hadapi
2. Buat konten yang memecahkan masalah atau menghibur
3. Gunakan format yang beragam: foto, video, carousel, stories
4. Posting secara konsisten dengan jadwal yang teratur
5. Gunakan Canva untuk desain yang profesional

Mengukur keberhasilan:
- Pantau reach, engagement rate, dan konversi
- Konten apa yang paling banyak di-share dan di-save?
- Jam berapa audiensmu paling aktif?
- Evaluasi dan sesuaikan strategi setiap bulan`,
    },
    {
      kategori: 'usaha',
      judul: 'Cara Membuat Produk yang Laku di Pasaran',
      deskripsi: 'Jangan buat produk yang kamu suka — buat produk yang pasar butuhkan.',
      isi_konten: `Kesalahan terbesar pengusaha pemula adalah membuat produk berdasarkan asumsi, bukan data. Validasi ide sebelum berinvestasi.

Riset pasar yang efektif:
1. Survei calon pelanggan (minimal 20 orang)
2. Analisis tren di marketplace: produk apa yang laris?
3. Baca review negatif produk kompetitor — itu adalah peluang
4. Perhatikan pertanyaan yang sering muncul di forum dan grup komunitas

Proses pengembangan produk:
1. IDEASI: Kumpulkan sebanyak mungkin ide
2. VALIDASI: Tanya calon pelanggan apakah mereka mau membeli
3. MVP: Buat versi paling sederhana yang bisa dijual
4. FEEDBACK: Kumpulkan masukan dari pelanggan pertama
5. ITERASI: Perbaiki berdasarkan feedback nyata

Menentukan harga yang tepat:
- Hitung HPP dengan teliti
- Riset harga kompetitor
- Pertimbangkan nilai yang dirasakan pelanggan
- Jangan terlalu murah — bisa merusak persepsi kualitas

Ingat: produk yang baik adalah produk yang terjual, bukan produk yang sempurna.`,
    },
  ],

  // ── 10 Tips Keuangan ──────────────────────────────────────────
  keuangan: [
    {
      kategori: 'keuangan',
      judul: 'Cara Menabung dengan Gaji Pertama',
      deskripsi: 'Jangan habiskan gaji pertama untuk hal yang tidak perlu — ini panduannya.',
      isi_konten: `Gaji pertama adalah momen penting yang menentukan kebiasaan keuanganmu seumur hidup. Mulai dengan kebiasaan yang benar.

Rumus alokasi gaji yang terbukti efektif:

METODE 50-30-20:
- 50% untuk kebutuhan pokok: kos/kontrakan, transportasi, makan, tagihan
- 30% untuk keinginan: hiburan, nongkrong, belanja, hobi
- 20% untuk tabungan dan investasi

Tips menabung yang efektif:
1. Otomatiskan tabungan dengan auto-debit di hari gajian
2. Buat rekening tabungan terpisah yang tidak ada kartu ATM-nya
3. Bangun dana darurat minimal 3x pengeluaran bulanan sebelum investasi
4. Hindari cicilan konsumtif di awal karir

Yang harus diprioritaskan:
- Dana darurat (3-6 bulan pengeluaran)
- BPJS Kesehatan dan Ketenagakerjaan
- Pelunasan hutang berbunga tinggi
- Baru kemudian investasi

Ingat: bukan berapa banyak yang kamu hasilkan, tapi berapa banyak yang kamu simpan.`,
    },
    {
      kategori: 'keuangan',
      judul: 'Mengenal Reksa Dana untuk Pemula',
      deskripsi: 'Investasi tidak harus rumit — reksa dana adalah pilihan tepat untuk mulai.',
      isi_konten: `Reksa dana adalah instrumen investasi yang cocok untuk pemula karena dikelola oleh profesional dan bisa dimulai dengan modal kecil.

Jenis reksa dana dan risikonya:
1. Reksa Dana Pasar Uang: risiko rendah, return 4-6%/tahun, cocok untuk dana darurat
2. Reksa Dana Pendapatan Tetap: risiko sedang, return 6-8%/tahun, horizon 1-3 tahun
3. Reksa Dana Campuran: risiko sedang-tinggi, return 8-12%/tahun, horizon 3-5 tahun
4. Reksa Dana Saham: risiko tinggi, return 10-15%/tahun, horizon >5 tahun
5. Reksa Dana Indeks: mengikuti IHSG, biaya rendah, cocok untuk jangka panjang

Cara mulai berinvestasi:
1. Download aplikasi Bibit, Bareksa, atau Ajaib
2. Verifikasi identitas (KTP dan selfie)
3. Mulai dari Rp 10.000 untuk reksa dana pasar uang
4. Investasi rutin setiap bulan (dollar cost averaging)
5. Jangan panik saat pasar turun — ini normal

Tips penting:
- Diversifikasi ke beberapa jenis reksa dana
- Investasi sesuai tujuan dan horizon waktu
- Pahami bahwa investasi mengandung risiko`,
    },
    {
      kategori: 'keuangan',
      judul: 'Cara Menghindari Jebakan Pinjaman Online Ilegal',
      deskripsi: 'Pinjol ilegal merusak keuangan dan mental — kenali ciri-cirinya sebelum terlambat.',
      isi_konten: `Pinjaman online ilegal adalah salah satu ancaman keuangan terbesar saat ini. Ribuan orang terjebak setiap tahunnya.

Ciri-ciri pinjol ilegal:
- Tidak terdaftar di OJK (cek di ojk.go.id)
- Bunga dan biaya tidak transparan atau sangat tinggi
- Meminta akses kontak, galeri, dan kamera HP
- Proses persetujuan terlalu mudah tanpa verifikasi
- Penagihan dengan intimidasi, ancaman, dan penyebaran data pribadi

Cara melindungi diri:
1. Selalu cek daftar fintech legal di ojk.go.id sebelum meminjam
2. Baca syarat dan ketentuan dengan teliti, terutama bunga dan denda
3. Jangan berikan akses ke kontak dan galeri HP
4. Hitung total yang harus dibayar sebelum meminjam

Alternatif jika butuh dana darurat:
- Koperasi simpan pinjam dengan bunga rendah
- KUR (Kredit Usaha Rakyat) dari bank pemerintah
- Pinjam dari keluarga atau teman
- Jual aset yang tidak terlalu dibutuhkan

Jika sudah terlanjur terjebak:
- Laporkan ke OJK di 157 atau ojk.go.id
- Hubungi LBH (Lembaga Bantuan Hukum) untuk konsultasi gratis`,
    },
    {
      kategori: 'keuangan',
      judul: 'Cara Membuat Anggaran Bulanan yang Realistis',
      deskripsi: 'Anggaran bukan tentang membatasi diri — tapi tentang memberi setiap rupiah tujuan.',
      isi_konten: `Anggaran yang baik adalah anggaran yang realistis dan konsisten dijalankan. Bukan angka ideal yang tidak pernah tercapai.

Langkah membuat anggaran yang efektif:

MINGGU 1: CATAT PENGELUARAN AKTUAL
- Catat semua pengeluaran selama 1 bulan tanpa mengubah kebiasaan
- Gunakan aplikasi: Money Manager, Wallet, atau spreadsheet sederhana
- Jangan menghakimi diri sendiri — ini hanya data

MINGGU 2: ANALISIS DAN KATEGORIKAN
- Kebutuhan tetap: kos, transportasi, tagihan (tidak bisa dikurangi)
- Kebutuhan variabel: makan, belanja (bisa dioptimalkan)
- Keinginan: hiburan, nongkrong, belanja online (bisa dikurangi)
- Identifikasi "kebocoran" terbesar

MINGGU 3: BUAT ANGGARAN BERDASARKAN DATA
- Gunakan angka nyata dari pengeluaran aktual
- Tetapkan target realistis untuk setiap kategori
- Sisihkan untuk tabungan di awal, bukan sisa

MINGGU 4: EVALUASI DAN SESUAIKAN
- Bandingkan anggaran vs aktual
- Apa yang berhasil? Apa yang perlu disesuaikan?
- Anggaran yang baik terus berkembang seiring waktu`,
    },
    {
      kategori: 'keuangan',
      judul: 'Investasi Saham untuk Pemula: Panduan Lengkap',
      deskripsi: 'Saham bisa dimulai dari Rp 100.000 — ini cara memulainya dengan aman.',
      isi_konten: `Investasi saham adalah cara terbaik untuk membangun kekayaan jangka panjang. Tapi tanpa pengetahuan yang cukup, bisa menjadi judi.

Langkah memulai investasi saham:

1. BUKA REKENING SAHAM
   - Pilih sekuritas terpercaya: BCA Sekuritas, Mandiri Sekuritas, Ajaib, atau Stockbit
   - Siapkan KTP, NPWP, dan rekening bank
   - Proses verifikasi biasanya 1-3 hari kerja

2. PELAJARI DASAR-DASAR
   - Apa itu saham dan bagaimana cara kerjanya
   - Cara membaca grafik harga saham
   - Analisis fundamental dasar: PER, PBV, ROE, dan DER
   - Perbedaan trading dan investasi jangka panjang

3. MULAI DENGAN SAHAM BLUE CHIP
   - Saham LQ45 lebih stabil dan likuid
   - Contoh: BBCA, BBRI, TLKM, ASII, UNVR
   - Hindari saham gorengan yang mudah dimanipulasi

4. STRATEGI YANG TERBUKTI
   - Dollar Cost Averaging: beli rutin setiap bulan tanpa peduli harga
   - Diversifikasi ke minimal 5 saham berbeda sektor
   - Investasikan hanya uang yang tidak dibutuhkan dalam 5+ tahun
   - Jangan panik saat pasar turun — ini kesempatan beli lebih murah`,
    },
    {
      kategori: 'keuangan',
      judul: 'Cara Keluar dari Lingkaran Hutang',
      deskripsi: 'Terjebak hutang bukan akhir dunia — ini strategi melunasinya secara sistematis.',
      isi_konten: `Hutang yang tidak dikelola dengan baik bisa menjadi beban yang menghancurkan. Tapi dengan strategi yang tepat, kamu bisa bebas hutang.

Dua metode pelunasan hutang yang terbukti:

METODE DEBT SNOWBALL (untuk motivasi):
1. Daftar semua hutang dari yang terkecil ke terbesar
2. Bayar minimum untuk semua hutang
3. Fokuskan uang ekstra untuk melunasi hutang terkecil
4. Setelah lunas, gunakan uang tersebut untuk hutang berikutnya
5. Cocok untuk yang butuh motivasi dari "kemenangan kecil"

METODE DEBT AVALANCHE (untuk efisiensi):
1. Daftar semua hutang dari bunga tertinggi ke terendah
2. Bayar minimum untuk semua hutang
3. Fokuskan uang ekstra untuk hutang berbunga tertinggi
4. Menghemat lebih banyak uang dalam jangka panjang

Langkah tambahan:
- Hentikan penambahan hutang baru segera
- Cari penghasilan tambahan untuk mempercepat pelunasan
- Negosiasi restrukturisasi dengan kreditur jika perlu
- Jangan sembunyikan masalah hutang dari pasangan atau keluarga
- Pertimbangkan konsultasi dengan konsultan keuangan`,
    },
    {
      kategori: 'keuangan',
      judul: 'Mengenal Asuransi yang Wajib Dimiliki',
      deskripsi: 'Asuransi bukan pemborosan — ini proteksi finansial yang kamu butuhkan.',
      isi_konten: `Asuransi adalah fondasi perencanaan keuangan yang sering diabaikan. Satu kejadian tak terduga bisa menghancurkan keuangan yang sudah dibangun bertahun-tahun.

Prioritas asuransi berdasarkan kebutuhan:

1. BPJS KESEHATAN (WAJIB)
   - Biaya: Rp 42.000 - Rp 150.000/bulan tergantung kelas
   - Menanggung biaya rawat inap, operasi, dan penyakit kritis
   - Daftar di bpjs-kesehatan.go.id atau kantor BPJS terdekat

2. BPJS KETENAGAKERJAAN (untuk pekerja)
   - JHT (Jaminan Hari Tua): tabungan yang bisa dicairkan
   - JP (Jaminan Pensiun): penghasilan bulanan saat pensiun
   - JKK dan JKM: kecelakaan kerja dan kematian

3. ASURANSI JIWA TERM LIFE
   - Diperlukan jika kamu menanggung keluarga
   - Pilih term life (bukan unit link) untuk proteksi murni
   - Uang pertanggungan minimal 10x penghasilan tahunan

4. ASURANSI KENDARAAN
   - TLO (Total Loss Only) untuk kendaraan tua
   - All Risk untuk kendaraan baru atau mahal

Yang harus dihindari:
- Asuransi unit link yang menggabungkan investasi dan proteksi
- Asuransi dengan premi yang terlalu mahal relatif terhadap manfaat`,
    },
    {
      kategori: 'keuangan',
      judul: 'Cara Memanfaatkan Cashback dan Promo dengan Bijak',
      deskripsi: 'Promo bisa menghemat uang atau justru membuat kamu boros — ini cara membedakannya.',
      isi_konten: `Di era digital, promo dan cashback ada di mana-mana. Tapi tidak semua promo benar-benar menguntungkan.

Promo yang MENGUNTUNGKAN:
- Kamu memang butuh produknya dalam waktu dekat
- Harganya lebih murah dari harga normal yang kamu tahu
- Tidak memaksamu membeli lebih dari kebutuhan
- Cashback atau diskon signifikan (>20%)

Promo yang MERUGIKAN:
- Kamu membeli karena takut ketinggalan (FOMO)
- Minimum pembelian memaksamu beli lebih banyak dari kebutuhan
- Cashback kecil tapi total pengeluaran besar
- Produk yang dibeli akhirnya tidak terpakai

Strategi belanja cerdas:
1. Buat daftar belanja sebelum membuka aplikasi marketplace
2. Bandingkan harga di beberapa platform sebelum membeli
3. Gunakan fitur wishlist dan tunggu harbolnas jika tidak mendesak
4. Hitung total pengeluaran, bukan hanya besarnya diskon
5. Hindari belanja saat lapar, bosan, atau sedang emosi

Tools yang membantu:
- Ekstensi browser untuk cek harga historis
- Aplikasi price tracker untuk marketplace
- Kartu kredit dengan cashback yang sesuai kebiasaan belanjamu`,
    },
    {
      kategori: 'keuangan',
      judul: 'Cara Mempersiapkan Dana Pensiun Sejak Muda',
      deskripsi: 'Semakin muda mulai, semakin ringan bebannya — manfaatkan kekuatan compound interest.',
      isi_konten: `Pensiun mungkin terasa jauh, tapi waktu adalah aset terbesar dalam investasi. Mulai sekarang, sekecil apapun.

Kekuatan compound interest:
- Rp 500.000/bulan mulai usia 22, return 10%/tahun = Rp 3,2 miliar di usia 55
- Rp 500.000/bulan mulai usia 32, return 10%/tahun = Rp 1,1 miliar di usia 55
- Menunda 10 tahun mengurangi hasil hampir 3x lipat!

Instrumen untuk dana pensiun:

1. BPJS KETENAGAKERJAAN
   - JHT dan JP otomatis dipotong dari gaji
   - Manfaatkan sepenuhnya, jangan dicairkan sebelum pensiun

2. REKSA DANA SAHAM
   - Untuk horizon >10 tahun, reksa dana saham memberikan return terbaik
   - Investasi rutin setiap bulan tanpa peduli kondisi pasar

3. DPLK (Dana Pensiun Lembaga Keuangan)
   - Manfaat pajak: iuran bisa dikurangkan dari penghasilan kena pajak
   - Tersedia di bank dan perusahaan asuransi

4. PROPERTI
   - Investasi jangka panjang yang nilainya cenderung naik
   - Bisa menghasilkan passive income dari sewa

Berapa yang harus disiapkan?
- Estimasi pengeluaran bulanan saat pensiun x 12 bulan x 20 tahun
- Tambahkan inflasi rata-rata 5-7% per tahun
- Mulai dari 10-15% penghasilan untuk dana pensiun`,
    },
    {
      kategori: 'keuangan',
      judul: 'Cara Membaca Laporan Keuangan Sederhana',
      deskripsi: 'Kemampuan membaca laporan keuangan berguna untuk bisnis maupun investasi saham.',
      isi_konten: `Laporan keuangan adalah bahasa bisnis. Memahaminya membuka peluang untuk membuat keputusan investasi dan bisnis yang lebih baik.

Tiga laporan keuangan utama:

1. NERACA (BALANCE SHEET)
   - Menunjukkan kondisi keuangan pada satu titik waktu
   - Aset = Liabilitas + Ekuitas
   - Perhatikan: rasio hutang terhadap ekuitas (DER)
   - DER < 1 umumnya lebih aman

2. LAPORAN LABA RUGI (INCOME STATEMENT)
   - Menunjukkan kinerja selama periode tertentu
   - Pendapatan - Biaya = Laba/Rugi
   - Perhatikan: margin laba bersih dan tren pertumbuhannya
   - Bandingkan dengan periode sebelumnya dan kompetitor

3. LAPORAN ARUS KAS (CASH FLOW STATEMENT)
   - Menunjukkan pergerakan uang tunai
   - Arus kas operasi positif = bisnis menghasilkan uang nyata
   - Perusahaan bisa untung di atas kertas tapi bangkrut karena cash flow negatif

Rasio keuangan penting untuk investor saham:
- PER (Price to Earnings Ratio): harga saham relatif terhadap laba
- PBV (Price to Book Value): harga saham relatif terhadap nilai buku
- ROE (Return on Equity): seberapa efisien perusahaan menggunakan modal
- Dividend Yield: persentase dividen terhadap harga saham

Tips: selalu bandingkan dengan rata-rata industri, bukan angka absolut.`,
    },
  ],
};

// ── Main runner ──────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱  BIKA Seed Script');
  console.log('===================');
  console.log(`Target: http://${CONFIG.host}:${CONFIG.port}`);

  // 1. Login as admin
  console.log('\n[1/2] Logging in as admin...');
  let token;
  try {
    const res = await request('POST', '/api/admin/login', {
      username: CONFIG.adminUsername,
      password: CONFIG.adminPassword,
    });
    if (!res.body.token) {
      console.error('❌  Login failed:', res.body.message || JSON.stringify(res.body));
      console.error('    → Check CONFIG.adminUsername and CONFIG.adminPassword in seed.js');
      process.exit(1);
    }
    token = res.body.token;
    console.log(`✅  Logged in as: ${res.body.admin.username}`);
  } catch (e) {
    console.error(`❌  Cannot connect to server on port ${CONFIG.port}.`);
    console.error('    → Make sure the backend is running: cd backend && node app.js');
    process.exit(1);
  }

  // 2. POST all content
  console.log('\n[2/2] Seeding content...\n');
  let ok = 0;
  let fail = 0;

  for (const [kategori, items] of Object.entries(SEED_DATA)) {
    const label = kategori.padEnd(10);
    process.stdout.write(`  ${label} [`);
    for (const item of items) {
      const res = await request('POST', '/api/contents', item, token);
      if (res.status === 201 || res.status === 200) {
        process.stdout.write('█');
        ok++;
      } else {
        process.stdout.write('░');
        fail++;
      }
    }
    process.stdout.write(`]  ${items.length} items\n`);
  }

  console.log('\n===================');
  console.log(`✅  Done! ${ok} inserted, ${fail} failed.`);
  if (fail > 0) {
    console.log('   Tip: failed items may already exist or have validation errors.');
  }
  console.log('\nRefresh your admin panel to see the new content.\n');
}

seed();
