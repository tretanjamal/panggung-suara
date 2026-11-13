/* Semua teks antarmuka di satu tempat agar mudah ditinjau guru.
   Kalimat instruksi dibuat pendek (maks. 2 baris di layar). */
var STR = {
  judul: 'Panggung Suara',
  subjudul: 'Lab Bernyanyi bersama Nuri',
  label: 'Lab Maya · Seni Musik',
  mulai: 'Mulai',
  lanjutMain: 'Lanjut Main',
  informasi: 'Informasi',
  referensi: 'Referensi',
  pengembang: 'Pengembang',
  pengaturan: 'Pengaturan',
  catatanGuru: 'Catatan Guru',
  menu: 'Menu',
  beranda: 'Beranda',
  tutup: 'Tutup',
  putar: 'Putar perangkatmu ke posisi mendatar agar panggung terlihat penuh.',

  set: {
    snd: ['Efek bunyi', 'Bunyi nada, ketukan, dan tepuk tangan.'],
    mus: ['Musik menu', 'Musik lembut di Beranda dan Menu.'],
    ro: ['Kurangi animasi', 'Gerakan layar dibuat lebih sedikit.'],
    as: ['Bantuan visual', 'Tinggi nada ditampilkan sebagai batang.'],
    calm: ['Mode Santai', 'Tempo lebih pelan dan ketukan lebih longgar.']
  },
  ya: 'Ya', tidak: 'Tidak',
  hapusProgres: 'Mulai dari awal',
  yakinHapus: 'Ketuk sekali lagi untuk menghapus semua bintang.',
  progresDihapus: 'Progres sudah dikosongkan.',

  hub: {
    judul: 'Pilih Latihan',
    ajak: 'Selesaikan latihan berurutan, lalu tampil di Konser Kelas!',
    ajakLagi: 'Hebat! Lanjutkan ke latihan berikutnya.',
    ajakSelesai: 'Semua latihan selesai! Ambil sertifikatmu.',
    latihan: 'Latihan',
    terkunci: 'Terkunci',
    bintang: 'bintang',
    sertifikat: 'Sertifikat',
    poster: 'Poster',
    kunciSertifikat: 'Selesaikan kelima latihan untuk membuka sertifikat.'
  },

  level: [
    { nama: 'Pemanasan', ringkas: 'Napas, sikap berdiri, dan bentuk mulut.', bisa: 'Aku bisa bernapas dan berdiri dengan benar saat bernyanyi.', guru: 'Sikap tubuh, pernapasan, dan artikulasi vokal (a-i-u-e-o).' },
    { nama: 'Tangga Nada', ringkas: 'Dengarkan dua nada, pilih yang lebih tinggi.', bisa: 'Aku bisa membedakan nada tinggi dan nada rendah.', guru: 'Membedakan tinggi-rendah nada (diskriminasi nada).' },
    { nama: 'Ketuk Irama', ringkas: 'Ketuk drum saat suku kata menyala.', bisa: 'Aku bisa mengikuti ketukan lagu dengan tetap.', guru: 'Ketukan tetap (beat) dan pola irama suku kata lagu.' },
    { nama: 'Keras Lembut', ringkas: 'Pilih kekuatan suara yang cocok dengan suasana.', bisa: 'Aku tahu kapan bernyanyi lembut, sedang, atau keras.', guru: 'Dinamika (p, mf, f) sesuai suasana dan tempat.' },
    { nama: 'Konser Kelas', ringkas: 'Susun lagu, bernyanyi bersama, beri tanggapan.', bisa: 'Aku bisa menyanyikan lagu daerah bersama teman.', guru: 'Menyanyikan lagu daerah bersama dan menanggapi dengan istilah musik.' }
  ],

  soalKe: function (a, b) { return 'Soal ' + a + ' dari ' + b; },

  l1: {
    napas: 'Tahan tombol untuk tarik napas. Atau ketuk sekali.',
    tombolNapas: 'Tahan: Tarik Napas',
    menahan: 'Terus tarik... balonnya mengembang!',
    buang: 'Bagus! Sekarang buang pelan-pelan: sss...',
    hitung: 'hitungan',
    sikap: 'Napasmu bagus! Pilih sikap berdiri yang benar untuk bernyanyi.',
    sikapSalah: [
      'Punggungnya membungkuk. Cari yang punggungnya tegak.',
      'Dagunya mendongak dan bahunya naik. Cari yang dagunya sejajar.'
    ],
    sikapPetunjuk: 'Lihat yang bersinar: punggung tegak, bahu turun, dagu sejajar.',
    sikapBenar: 'Tepat! Berdiri tegak membuat napas lega.',
    vokal: function (v) { return 'Mulut Nuri yang mana saat bernyanyi “' + v + '”?'; },
    vokalSalah: 'Belum tepat. Lihat lagi bentuk paruhnya.',
    vokalPetunjuk: function (v, d) { return 'Petunjuk: saat “' + v + '”, ' + d + '.'; },
    vokalUlang: 'Ayo coba sekali lagi huruf ini.',
    bentuk: { a: 'mulut dibuka lebar', i: 'mulut tersenyum lebar', u: 'mulut bulat kecil dan maju', e: 'mulut setengah terbuka', o: 'mulut bulat dan terbuka' },
    selesai: 'Pemanasan selesai!'
  },

  l2: {
    tanya: 'Dengarkan dua nada. Mana yang lebih tinggi?',
    dengar: 'Dengar lagi',
    nada: 'Nada',
    tinggi: 'tinggi', rendah: 'rendah',
    benar: ['Tepat! Telingamu tajam.', 'Betul! Nada itu lebih tinggi.', 'Hebat, kamu mendengar dengan teliti!'],
    salah: 'Belum tepat. Nada tinggi terdengar lebih kecil dan nyaring.',
    salah2: 'Lihat batangnya: batang yang lebih tinggi = nada lebih tinggi.',
    selesai: 'Telingamu tajam!'
  },

  l3: {
    tanya: 'Ketuk drum tepat saat suku kata menyala. Ada 4 hitungan dulu.',
    ketuk: 'Ketuk!',
    mulai: 'Mulai',
    lagi: 'Coba lagi',
    contoh: 'Lihat contoh',
    siap: 'Siap...',
    tahan: 'tahan',
    hasil: function (h, n) { return h + ' dari ' + n + ' ketukan pas.'; },
    kurang: 'Hampir! Kita coba lebih pelan, ya.',
    kurang2: 'Lihat contoh Nuri dulu, lalu coba lagi.',
    contohJalan: 'Perhatikan: drum diketuk tepat saat kata menyala.',
    pas: 'Pas!',
    selesai: 'Irama yang pas!'
  },

  l4: {
    tanya: 'Suara seperti apa yang cocok?',
    pilihan: [['Lembut', 'p'], ['Sedang', 'mf'], ['Keras', 'f']],
    soal: [
      { t: 'Menyanyikan nina bobo untuk adik bayi yang akan tidur.', a: 0, malam: true, g: 'nina-bobo' },
      { t: 'Menyanyikan “Selamat Ulang Tahun” untuk teman di dalam kelas.', a: 1, g: 'ulang-tahun' },
      { t: 'Menyanyikan lagu kebangsaan saat upacara di lapangan.', a: 2, g: 'upacara' },
      { t: 'Bernyanyi di dekat nenek yang sedang beristirahat.', a: 0, malam: true, g: 'nenek' },
      { t: 'Menyemangati tim sekolah saat lomba di lapangan.', a: 2, g: 'lomba' }
    ],
    terlaluKeras: 'Terlalu keras untuk suasana itu. Coba yang lebih pelan.',
    terlaluPelan: 'Terlalu pelan, suaramu bisa tidak terdengar. Coba yang lebih kuat.',
    benar: 'Cocok sekali!',
    selesai: 'Suaramu pas suasana!'
  },

  l5: {
    susun: 'Ketuk baris lagu dari yang pertama sampai terakhir.',
    susunSalah: 'Coba lagi. Baris mana yang dinyanyikan lebih dulu?',
    susunPetunjuk: 'Petunjuk: lagu dimulai dari “Gundul-gundul pacul”.',
    nyanyi: 'Dengarkan dulu, lalu ayo bernyanyi bersama teman!',
    dengar: 'Dengar dulu',
    ayo: 'Ayo nyanyi!',
    lanjut: 'Lanjut',
    pujian: 'Bagus sekali! Kamu berani bernyanyi!',
    tanggap: 'Pilih tanggapan yang memakai kata-kata musik.',
    opsi: [
      ['Bagus.', 'Coba sebut tempo atau suaranya, ya.'],
      ['Temponya sedang dan suaranya lembut jernih, jadi enak didengar.', ''],
      ['Lagunya keras sekali.', 'Tadi suaramu lembut dan jernih. Pilih yang lain.']
    ],
    selesai: 'Konser selesai!'
  },

  hasil: {
    kamuBisa: 'Keterampilan baru',
    ulangi: 'Ulangi',
    lanjut: 'Lanjut',
    keMenu: 'Ke Menu',
    semangat: ['Keren!', 'Hebat!', 'Luar biasa!']
  },

  sertifikat: {
    judul: 'SERTIFIKAT',
    diberikan: 'Penyanyi Cilik Panggung Suara diberikan kepada',
    namaDefault: 'Penyanyi Cilik',
    isi: function (n) { return 'telah menyelesaikan Lab Maya Aktivitas Bernyanyi (Seni Musik) dengan ' + n + ' dari 15 bintang.'; },
    pengembang: 'Pengembang: Jamaluddin & Sri Anita',
    tulisNama: 'Tulis namamu',
    cetak: 'Cetak'
  },

  guru: {
    judul: 'Catatan untuk Guru',
    pengantar: 'Ringkasan ini hanya tersimpan di perangkat ini dan tidak memuat data pribadi.',
    kolom: ['Latihan', 'Keterampilan', 'Bintang', 'Main', 'Salah'],
    belum: 'belum',
    saran: 'Saran tindak lanjut',
    saranIsi: [
      'Bintang 1 di Tangga Nada: ajak murid menirukan nada tinggi-rendah dengan gerak tangan naik-turun.',
      'Bintang 1 di Ketuk Irama: latih tepuk tangan bersama sambil berhitung 1-2-3-4.',
      'Level 5 adalah ajakan bernyanyi nyata. Gim tidak merekam atau menilai suara murid.'
    ]
  }
};
