/* Data isi: lagu, halaman Informasi, Referensi, dan Pengembang.
   Nada memakai nomor MIDI (60 = do/C4). Durasi dalam ketukan.
   PERLU DIVERIFIKASI GURU: melodi "Gundul-Gundul Pacul" di sini adalah versi sederhana. */
var LAGU = {
  judul: 'Gundul-Gundul Pacul',
  asal: 'Lagu daerah Jawa Tengah',
  baris: [
    { teks: 'Gundul-gundul pacul-cul, gembelengan',
      suku: ['Gun', 'dul', 'gun', 'dul', 'pa', 'cul', 'cul', 'gem', 'be', 'le', 'ngan'],
      nada: [60, 64, 60, 64, 65, 67, 67, 71, 72, 71, 67],
      dur: [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 4] },
    { teks: 'Nyunggi-nyunggi wakul-kul, gembelengan',
      suku: ['Nyung', 'gi', 'nyung', 'gi', 'wa', 'kul', 'kul', 'gem', 'be', 'le', 'ngan'],
      nada: [60, 64, 60, 64, 65, 67, 67, 71, 72, 71, 67],
      dur: [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 4] },
    { teks: 'Wakul ngglimpang, segane dadi sak latar',
      suku: ['Wa', 'kul', 'ngglim', 'pang', 'se', 'ga', 'ne', 'da', 'di', 'sak', 'la', 'tar'],
      nada: [65, 65, 67, 65, 64, 60, 65, 64, 60, 64, 62, 60],
      dur: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 4] }
  ],
  /* Urutan menyanyi: baris 3 diulang (versi umum). Tiap baris 16 ketukan = 4 birama 4/4. */
  urutan: [0, 1, 2, 2],
  /* Latihan Ketuk Irama: frasa pertama, 7 ketukan + 1 ketukan ditahan. */
  irama: { suku: ['Gun', 'dul', 'gun', 'dul', 'pa', 'cul', 'cul'], nada: [60, 64, 60, 64, 65, 67, 67] }
};

var INFO = {
  tujuan: 'Murid mampu mempraktikkan unsur bernyanyi (sikap dan napas, tinggi-rendah nada, ketukan, dan dinamika) lalu menyanyikan lagu daerah bersama teman.',
  mapel: 'Seni Musik',
  topik: 'Aktivitas Bernyanyi',
  langkah: [
    ['Napas & Vokal', 'Bandingkan napas saat membungkuk dan tegak, lalu dengarkan bentuk mulut a-i-u-e-o.'],
    ['Tinggi Rendah', 'Ketuk tangga nada dan lihat gelombangnya: nada tinggi, gelombang rapat.'],
    ['Ketukan', 'Ubah tempo metronom, lalu ketuk drum mengikuti lagu.'],
    ['Keras Lembut', 'Geser kekuatan suara: suara keras, gelombang tinggi. Cocokkan dengan suasana.'],
    ['Konser Kelas', 'Susun lagu, atur tempo dan kekuatan, bernyanyi bersama, lalu beri tanggapan.'],
    ['Jurnal Lab', 'Tiap percobaan: Tebak, Coba, Simpulkan, Uji. Semua tercatat di Jurnal Lab.']
  ],
  catatan: 'Lab memandu, bukan menggantikan bernyanyi. Ajak kelas bernyanyi nyata di Konser Kelas. Layar Suara menggambar bunyi asli; tombol mikrofon bersifat pilihan dan hanya menampilkan gelombang secara langsung, tanpa merekam, menyimpan, atau menilai suara. Gelombang vokal sintesis adalah pendekatan. Melodi lagu versi sederhana; verifikasi ke sumber resmi.',
  sumber: [
    'Badan Standar, Kurikulum, dan Asesmen Pendidikan (2025). <i>Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran.</i> Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.',
    'Dr. Rizki Taufik Rahman, S.Sm., M.Pd, dkk. (2025). <i>Panduan Mata Pelajaran Seni Rupa Fase A-F.</i> Badan Standar, Kurikulum, dan Asesmen Pendidikan, Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.'
  ],
  ai: 'Kecerdasan artifisial (AI) membantu menyusun kode gim, rancangan tampilan, serta aset gambar dan musik. Isi pembelajaran, pilihan lagu, dan hasil akhir ditinjau dan diputuskan oleh pengembang. AI hanya alat bantu.',
  rujukanAI: 'Purwarianti, A., dkk. (2025). <i>Panduan Pemanfaatan Kecerdasan Artifisial untuk Guru PAUD, Pendidikan Dasar, dan Pendidikan Menengah.</i> Jakarta: Pusat Kurikulum dan Pembelajaran &amp; Pusat Standar dan Kebijakan Pendidikan.',
  pengembang: [
    { nama: 'Jamaluddin', foto: 'jam', peran: 'Pengembang Utama',
      baris: [['sch', 'UPTD SMPN 2 Robatal'], ['mail', 'jamaluddin551@guru.smp.belajar.id'], ['ig', 'tretanjamal'], ['cal', 'Tahun pembuatan: 2026']],
      prestasi: ['Narasumber Digitalisasi Pembelajaran Kemendikdasmen', 'Guru Pejuang Digital', 'Juara 1 Lomba Inovasi Guru SMP Kabupaten Sampang 2026', 'Juara 1 Guru Inspiratif SMP Kabupaten Sampang 2026', 'Komunitas Belajar Terbaik BLPT Kemendikdasmen 2024'] },
    { nama: 'Sri Anita', foto: 'sri', peran: 'Pengembang Kedua',
      baris: [['sch', 'Guru UPTD SDN Dharma Tanjung 1'], ['cal', 'Tahun pembuatan: 2026']],
      prestasi: ['Pengembang bersama Jamaluddin.'] }
  ]
};
