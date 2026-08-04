export const SRS_DOCUMENTATION = {
  title: "Software Requirement Specification (SRS)",
  subtitle: "Sistem Manajemen Keuangan & Bendahara Sekolah SMP NUHA MERGOSONO",
  version: "1.0.0 (Production Ready)",
  author: "Senior Software Architect & UI/UX Designer",
  date: "Agustus 2026",
  sections: [
    {
      id: "1",
      title: "1. Functional Requirements (Kebutuhan Fungsional)",
      items: [
        "**FR-1 Master Data Management:** Pengelolaan data Siswa, Kelas, Wali Kelas, Tahun Ajaran, dan Profil Pengguna (Bendahara, Kepala Sekolah, Admin).",
        "**FR-2 Jenis Pembayaran:** Pengaturan jenis tagihan (SPP Bulanan, Uang Gedung/Pangkal, Seragam, Ujian, Kegiatan) dengan nominal, sifat (wajib/sukarela), dan periode bayar.",
        "**FR-3 Entry Transaksi Pembayaran:** Pencatatan transaksi real-time dengan pemilihan Siswa (pencarian NIS/Nama), jenis tagihan, bulan SPP, nominal bayar, dan kanal bayar (Tunai, Transfer Bank, QRIS).",
        "**FR-4 Kuitansi & Bukti Bayar:** Cetak kuitansi resmi (format PDF / thermal print) dengan nomor kuitansi unik otomatis, stempel sekolah, dan nama bendahara penerima.",
        "**FR-5 Status Tunggakan & Tagihan:** Kalkulasi otomatis sisa tagihan/tunggakan siswa per kelas dan per bulan SPP.",
        "**FR-6 Laporan Keuangan:** Laporan Penerimaan Harian, Laporan Bulanan, Laporan Per Kelas, Rekapitulasi SPP, serta ekspor data ke Excel / CSV / PDF.",
        "**FR-7 Audit Log / Riwayat Pembayaran:** Pencatatan otomatis setiap perubahan nominal, pembatalan, atau update kuitansi pembayaran.",
        "**FR-8 Pengaturan Sekolah:** Pengubahan nama sekolah, NPSN, alamat, logo, serta nama & NIP Kepala Sekolah dan Bendahara untuk cetak dokumen."
      ]
    },
    {
      id: "2",
      title: "2. Non-Functional Requirements (Kebutuhan Non-Fungsional)",
      items: [
        "**NFR-1 Performa:** Waktu respon aplikasi < 1.5 detik untuk pencarian data siswa dan pembuatan kuitansi.",
        "**NFR-2 Keamanan:** Proteksi data berbasis Row Level Security (RLS) Supabase dan enkripsi token autentikasi JWT.",
        "**NFR-3 Keandalan & Ketersediaan:** Uptime 99.9% menggunakan infrastruktur Vercel Serverless Edge + Supabase Cloud PostgreSQL.",
        "**NFR-4 Usabilitas:** Antarmuka responsif (Desktop, Tablet, Mobile) berstandar modern AdminLTE & Tailwind UI dengan opsi Modus Gelap (Dark Mode).",
        "**NFR-5 Interoperabilitas:** Ekspor data laporan standar format CSV/Excel dan pembuatan cetak nota langsung browser (Print View)."
      ]
    },
    {
      id: "3",
      title: "3. User Roles & Access Control (Peran Pengguna)",
      items: [
        "**Bendahara (Treasurer):** Hak akses penuh untuk entri transaksi, pembuatan kuitansi, input master siswa/kelas, pengelolaan jenis tagihan, dan pembuatan laporan harian/bulanan.",
        "**Kepala Sekolah (Principal):** Hak akses Read-Only untuk eksekutif dashboard, pemantauan grafik penerimaan, rekapitulasi tunggakan kelas, dan verifikasi laporan bulanan.",
        "**Administrator (System Admin):** Hak akses penuh sistem termasuk manajemen akun pengguna, reset kata sandi, audit log, dan pengaturan konfigurasi database Supabase."
      ]
    },
    {
      id: "4",
      title: "4. User Stories",
      items: [
        "Sebagai **Bendahara**, saya ingin mencari nama/NIS siswa dalam < 2 detik agar transaksi SPP wali murid dapat dilayani dengan cepat tanpa antrean panjang.",
        "Sebagai **Bendahara**, saya ingin mencetak kuitansi pembayaran dengan nomor otomatis agar terdapat bukti tertulis sah bagi orang tua murid.",
        "Sebagai **Kepala Sekolah**, saya ingin melihat grafik pemasukan SPP bulan ini dan daftar kelas dengan tunggakan tertinggi agar dapat mengambil keputusan operasional sekolah.",
        "Sebagai **Orang Tua / Siswa**, saya ingin menerima bukti kuitansi rincian pembayaran SPP dan uang kegiatan secara transparan."
      ]
    },
    {
      id: "5",
      title: "5. Business Workflow (Alur Bisnis Utama)",
      items: [
        "**1. Inisialisasi Tahun Ajaran & Jenis Tagihan:** Admin/Bendahara menetapkan tahun ajaran aktif dan membuat daftar biaya (SPP, Gedung, Seragam).",
        "**2. Pendaftaran Data Siswa & Kelas:** Menempatkan siswa aktif ke dalam kelas masing-masing (contoh: 7-A, 8-B, 9-C).",
        "**3. Pelayanan Pembayaran:** Orang tua murid datang/transfer -> Bendahara memilih nama siswa -> Memilih jenis tagihan & bulan -> Memilih metode pembayaran (Tunai/Transfer/QRIS) -> Simpan Transaksi.",
        "**4. Generasi Kuitansi:** Sistem membuat nomor kuitansi unik (e.g. `KWT/2026/08/0001`) dan menampilkan cetakan nota resmi.",
        "**5. Rekapitulasi & Pelaporan:** Kepala Sekolah dan Bendahara mengunduh laporan penerimaan kas harian/bulanan."
      ]
    },
    {
      id: "6",
      title: "6. Navigation Structure (Struktur Navigasi)",
      items: [
        "**Dashboard Utama:** Metrics Ringkasan, Grafik Penerimaan, Stream Transaksi Hari Ini.",
        "**Transaksi Pembayaran:** Form Bayar SPP, Bayar Non-SPP, Riwayat & Cetak Kuitansi.",
        "**Master Data:** Data Siswa, Data Kelas, Tahun Ajaran, Jenis Pembayaran.",
        "**Laporan Keuangan:** Laporan Pemasukan Harian, Tunggakan SPP Kelas, Laporan Per Jenis Biaya.",
        "**Pengguna & Hak Akses:** Kelola Akun Bendahara, Kepala Sekolah, Admin.",
        "**Pengaturan Sekolah & Dokumen:** Profil Sekolah, DDL Skema Supabase, SRS Specification Viewer."
      ]
    },
    {
      id: "7",
      title: "7. Data Validation Rules (Aturan Validasi Data)",
      items: [
        "**NIS & NISN:** Harus unik dan berupa digit angka (NIS 4-10 digit, NISN 10 digit).",
        "**Nominal Bayar:** Minimal Rp 1, tidak boleh bernilai negatif atau melebihi sisa tagihan.",
        "**Nomor Kuitansi:** Auto-generated berpola `KWT/YYYY/MM/XXXX` dan dijamin unik oleh database sequence/UUID.",
        "**Telepon Ortu:** Format nomor Indonesia berawalan `08` atau `+62` dengan panjang 10-15 digit."
      ]
    },
    {
      id: "8",
      title: "8. Future Expansion Possibilities (Pengembangan Masa Depan)",
      items: [
        "**Integrasi Payment Gateway:** Pembayaran otomatis via Midtrans/Xendit untuk Virtual Account Bank dan QRIS Otomatis.",
        "**Notifikasi WhatsApp Gateway:** Pengiriman otomatis kuitansi PDF dan pengingat tunggakan SPP ke WhatsApp orang tua murid.",
        "**Portal Orang Tua (Parent Self-Service):** Akses wali murid untuk mengecek riwayat tagihan dan melakukan pembayaran mandiri."
      ]
    }
  ]
};
