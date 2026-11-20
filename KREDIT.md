# Kredit: Panggung Suara (Lab Bernyanyi) · versi 4
Pengembang: Jamaluddin (UPTD SMPN 2 Robatal) dan Sri Anita (UPTD SDN Dharma Tanjung 1). Tahun 2026.
Instagram pengembang: tretanjamal

## Gambar dan musik
- Gambar (Nuri dan ekspresinya, bentuk mulut vokal, latar panggung dan latar malam, penonton, piala, bingkai sertifikat, ikon level, lencana keterampilan, gulungan lirik, mikrofon, poster konser, key art, lima kartu suasana Percobaan 4) dan musik/efek (musik latar, musik konser, nina bobo, tepuk tangan) dibuat dengan bantuan AI generatif, lalu dipilih dan diolah oleh pengembang. Alat dan tanggal pembuatan: [ISI sebelum dipublikasikan].
- Versi 3: tepi kotak-kotak pada latar panggung dan noda pada gambar penonton dibersihkan; tirai transisi digambar ulang dengan CSS.
- Ikon Instagram: logo resmi Instagram (merek dagang Meta), dipakai hanya untuk menandai akun pengembang.
- Foto pengembang: milik pengembang.

## Buatan sendiri di dalam kode (versi 4)
- Layar Suara (osiloskop): menggambar bunyi asli dari WebAudio AnalyserNode (js/engine/lab.js).
- Suara vokal a-i-u-e-o: sintesis formant (gelombang gigi gergaji + 3 pita frekuensi), js/engine/audio.js. Nilai formant adalah pendekatan.
- Pengiring Konser Kelas: sintesis bas, akor, dan tik yang mengikuti tempo pilihan murid (menggantikan pengiring mp3 yang tidak sinkron).
- Bunyi nada, desis napas, drum, dan metronom: sintesis WebAudio.
- Gambar anak (sikap tubuh), paru-paru, metronom, drum, tangga nada, meter, dan ikon garis: SVG/CSS buatan sendiri.
- Mikrofon (opsional): hanya ditampilkan langsung di Layar Suara. Tidak direkam, tidak disimpan, tidak dikirim, tidak dinilai.

## Font (dibundel di assets/fonts, lisensi SIL Open Font License 1.1)
- Baloo 2 (Ek Type), untuk judul dan tombol. Lisensi: assets/fonts/OFL-Baloo2.txt
- Andika (SIL International), untuk teks isi. Lisensi: assets/fonts/OFL-Andika.txt

## Lagu
- "Gundul-Gundul Pacul": lagu daerah tradisional (Jawa Tengah). Lirik dan melodi di gim adalah versi sederhana. VERIFIKASI ke sumber resmi sebelum dipakai di kelas.

## Teknologi
- HTML, CSS, JavaScript murni. Tanpa pustaka luar, tanpa CDN, jalan luring lewat file:// maupun http://.
- Kode dibantu Claude (Anthropic) dan ditinjau pengembang. Rujukan pemanfaatan AI: Purwarianti, A., dkk. (2025).
