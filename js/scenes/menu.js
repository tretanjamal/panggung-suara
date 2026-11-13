/* Layar judul, pengaturan, informasi, referensi, pengembang, menu latihan, hasil, sertifikat, catatan guru. */
(function () {
  var $ = G.$, A = G.audio;

  /* ---------- Layar judul ---------- */
  G.layarJudul = function () {
    G.dalamMenu = true; A.henti(); A.musik(0.22);
    var adaProgres = G.totalBintang() > 0;
    G.layar(
      '<div class="judul">' +
        '<div class="judul-kiri">' +
          '<span class="chip">' + G.ikon('not', 22) + STR.label + '</span>' +
          '<h1 class="logo">Panggung<br>Suara</h1>' +
          '<p class="tagline">' + STR.subjudul + '</p>' +
          '<button class="btn btn-emas btn-besar" data-a="mulai" autofocus>' + G.ikon('play', 30) + '<span>' + (adaProgres ? STR.lanjutMain : STR.mulai) + '</span></button>' +
          '<div class="baris-tombol">' +
            '<button class="btn btn-teal" data-a="info">' + G.ikon('info', 26) + '<span>' + STR.informasi + '</span></button>' +
            '<button class="btn btn-teal" data-a="ref">' + G.ikon('bk', 26) + '<span>' + STR.referensi + '</span></button>' +
            '<button class="btn btn-teal" data-a="dev">' + G.ikon('us', 26) + '<span>' + STR.pengembang + '</span></button>' +
          '</div>' +
        '</div>' +
        '<div class="pojok">' + '<button class="btn btn-ikon" data-a="set" aria-label="' + STR.pengaturan + '">' + G.ikon('gear', 30) + '</button>' + G.tombolSuara() + '</div>' +
      '</div>', 'key');
    G.aksi.mulai = function () { A.buka(); G.ke(G.layarMenu); };
    G.aksi.info = G.info; G.aksi.ref = G.referensi; G.aksi.dev = function () { G.pengembang(0); }; G.aksi.set = G.pengaturan;
    G.petunjuk($('[data-a="mulai"]'));
  };
  G.layarJudul.namaLayar = 'judul';

  /* ---------- Pengaturan (sakelar) ---------- */
  var konfirmasiHapus = false;
  G.pengaturan = function () {
    var isi = '<div class="set-list">' + Object.keys(STR.set).map(function (k) {
      return '<button class="set-item" role="switch" aria-checked="' + !!G.O[k] + '" data-a="sakelar" data-k="' + k + '">' +
        '<span><b>' + STR.set[k][0] + '</b><small>' + STR.set[k][1] + '</small></span><i class="sakelar' + (G.O[k] ? ' on' : '') + '"></i></button>';
    }).join('') + '</div>' +
      '<div class="set-bawah"><button class="btn btn-merah btn-kecil" data-a="hapus">' + G.ikon('ulang', 24) + '<span>' + STR.hapusProgres + '</span></button><span id="hapus-info"></span></div>';
    G.modal(STR.pengaturan, 'gear', isi, 760);
    konfirmasiHapus = false;
    G.aksi.sakelar = function (el) {
      var k = el.getAttribute('data-k');
      G.O[k] = G.O[k] ? 0 : 1; G.simpan();
      el.setAttribute('aria-checked', !!G.O[k]); el.querySelector('.sakelar').classList.toggle('on', !!G.O[k]);
      if (k === 'ro') document.documentElement.classList.toggle('ro', !!G.O.ro);
      if (k === 'snd' || k === 'mus') { if (!G.O.snd) A.semuaDiam(); A.musik(G.dalamMenu ? 0.22 : 0); var t = $('[data-a="suara"]'); if (t) t.innerHTML = G.ikon(G.O.snd ? 'snd' : 'mute', 30); }
    };
    G.aksi.hapus = function () {
      if (!konfirmasiHapus) { konfirmasiHapus = true; $('#hapus-info').textContent = STR.yakinHapus; return; }
      G.reset(); $('#hapus-info').textContent = STR.progresDihapus; konfirmasiHapus = false;
      var m = $('[data-a="mulai"] span'); if (m) m.textContent = STR.mulai;
    };
  };

  /* ---------- Informasi ---------- */
  var kotak = function (l, v, i) { return '<div class="it">' + G.ikon(i, 30) + '<div><small>' + l + '</small><b>' + v + '</b></div></div>'; };
  G.info = function () {
    G.modal(STR.informasi, 'info',
      '<div class="tj"><small>Tujuan Pembelajaran</small>' + INFO.tujuan + '</div>' +
      '<div class="g2">' + kotak('Mata Pelajaran', INFO.mapel, 'bk') + kotak('Topik', INFO.topik, 'mic') + '</div>' +
      '<h3>' + G.ikon('not', 28) + 'Panduan Bermain</h3>' +
      '<div class="g2 rapat">' + INFO.langkah.map(function (x, i) {
        return '<div class="sp"><i>' + (i + 1) + '</i><div><b>' + x[0] + '</b><span>' + x[1] + '</span></div></div>';
      }).join('') + '</div>' +
      '<div class="note"><b>Salah itu tidak apa-apa.</b> Nuri memberi petunjuk bertahap dan tidak ada game over.<br><b>Catatan untuk Guru:</b> ' + INFO.catatan + '</div>' +
      '<p class="versi">' + VERSI.nama + ' · versi ' + VERSI.versi + ' · ' + VERSI.tahun + '</p>');
  };

  /* ---------- Referensi ---------- */
  G.referensi = function () {
    G.modal(STR.referensi, 'bk',
      '<h3 class="atas">' + G.ikon('bk', 28) + 'Sumber Materi</h3>' + INFO.sumber.map(function (s) { return '<div class="rf">' + s + '</div>'; }).join('') +
      '<div class="rf">Lagu daerah: <i>' + LAGU.judul + '</i> (' + LAGU.asal + '), versi sederhana untuk latihan.</div>' +
      '<h3>' + G.ikon('ai', 28) + 'Keterangan Penggunaan AI</h3><div class="ai">' + G.ikon('ai', 36) + '<div>' + INFO.ai + '</div></div>' +
      '<div class="rf"><b>Rujukan pemanfaatan AI:</b> ' + INFO.rujukanAI + '</div>');
  };

  /* ---------- Pengembang ---------- */
  G.pengembang = function (i) {
    var d = INFO.pengembang[i], n = INFO.pengembang.length;
    G.modal(STR.pengembang, 'us',
      '<div class="dp"><div class="dpl"><img class="av" src="' + G.IM[d.foto] + '" alt="Foto ' + d.nama + '"><h3>' + d.nama + '</h3><span class="peran">' + d.peran + '</span>' +
      d.baris.map(function (b) {
        if (b[0] === 'ig') return '<div class="ln ln-ig"><img src="' + G.IM.ig + '" alt="Instagram"><span>' + b[1] + '</span></div>';
        return '<div class="ln">' + G.ikon(b[0], 24) + '<span>' + b[1] + '</span></div>';
      }).join('') + '</div>' +
      '<div><h3 class="atas">' + G.ikon('tr', 28) + (i === 0 ? 'Prestasi dan Pengalaman' : 'Peran') + '</h3>' +
      d.prestasi.map(function (a) { return '<div class="pr">' + G.ikon('ok', 24, '#2fa36b') + '<span>' + a + '</span></div>'; }).join('') + '</div></div>' +
      '<div class="nv"><button class="btn btn-teal btn-ikon" data-a="devKiri" aria-label="Sebelumnya">' + G.ikon('kiri', 30) + '</button>' +
      INFO.pengembang.map(function (_, k) { return '<span class="' + (k === i ? 'on' : '') + '"></span>'; }).join('') +
      '<button class="btn btn-teal btn-ikon" data-a="devKanan" aria-label="Berikutnya">' + G.ikon('kanan', 30) + '</button></div>', 1000);
    G.aksi.devKiri = function () { G.pengembang((i + n - 1) % n); };
    G.aksi.devKanan = function () { G.pengembang((i + 1) % n); };
  };

  /* ---------- Menu latihan ---------- */
  G.LEVEL = [];   /* diisi oleh berkas level */
  G.layarMenu = function () {
    G.dalamMenu = true; A.henti(); A.musik(0.22);
    var tot = G.totalBintang(), selesai = G.semuaSelesai(), berikut = -1;
    for (var i = 0; i < 5; i++) if (G.terbuka(i) && !G.P.s[i]) { berikut = i; break; }
    var ajak = selesai ? STR.hub.ajakSelesai : tot ? STR.hub.ajakLagi : STR.hub.ajak;
    var kartu = STR.level.map(function (L, i) {
      var buka = G.terbuka(i);
      return '<button class="lv' + (buka ? '' : ' kunci') + (i === berikut ? ' berikut' : '') + (G.P.s[i] ? ' tuntas' : '') + '" data-a="lv" data-i="' + i + '"' + (buka ? '' : ' disabled aria-disabled="true"') +
        ' aria-label="Latihan ' + (i + 1) + ': ' + L.nama + (buka ? '' : ', ' + STR.hub.terkunci) + '">' +
        '<span class="lv-no">' + (i + 1) + '</span>' +
        '<img src="' + G.IM.ikon(i) + '" alt="">' +
        '<b>' + L.nama + '</b>' +
        (buka ? G.bintang3(G.P.s[i], 26) : '<span class="lv-kunci">' + G.ikon('lock', 22) + STR.hub.terkunci + '</span>') +
        '</button>';
    }).join('');
    G.layar(
      '<img class="penonton" src="' + G.IM.penonton + '" alt="">' +
      '<header class="hud">' +
        '<button class="btn btn-teal btn-kecil" data-a="beranda" aria-label="Kembali ke beranda">' + G.ikon('home', 26) + '<span>' + STR.beranda + '</span></button>' +
        '<div class="hud-judul polos"><span>' + STR.hub.judul + '</span></div>' +
        '<div class="hud-skor">' + G.bintang(1, 30) + '<b>' + tot + '</b>/15</div>' +
        '<button class="btn btn-ikon" data-a="guru" aria-label="' + STR.catatanGuru + '">' + G.ikon('papan', 30) + '</button>' +
        G.tombolSuara() +
      '</header>' +
      '<div class="menu-isi">' +
        '<div class="menu-nuri">' + G.nuri(selesai ? 'b' : 's', 210) + G.balon(ajak) + '</div>' +
        '<div class="lv-baris">' + kartu + '</div>' +
        '<div class="menu-bawah">' +
          '<button class="btn btn-emas" data-a="cert"' + (selesai ? '' : ' disabled') + '>' + G.ikon(selesai ? 'medal' : 'lock', 28) + '<span>' + STR.hub.sertifikat + '</span></button>' +
          '<button class="btn btn-teal" data-a="poster"' + (selesai ? '' : ' disabled') + '>' + G.ikon(selesai ? 'img' : 'lock', 28) + '<span>' + STR.hub.poster + '</span></button>' +
          (selesai ? '' : '<span class="menu-catatan">' + STR.hub.kunciSertifikat + '</span>') +
        '</div>' +
      '</div>', 'latar');
    G.aksi.beranda = function () { G.ke(G.layarJudul); };
    G.aksi.lv = function (el) { var i = +el.getAttribute('data-i'); if (G.terbuka(i)) G.mulaiLevel(i); };
    G.aksi.cert = function () { G.ke(G.layarSertifikat); };
    G.aksi.poster = G.poster;
    G.aksi.guru = G.catatanGuru;
    if (berikut >= 0) G.petunjuk($('.lv[data-i="' + berikut + '"]'));
  };
  G.layarMenu.namaLayar = 'menu';

  G.mulaiLevel = function (i) {
    G.dalamMenu = false; A.musik(0); A.henti();
    G.P.main[i]++; G.simpan();
    G.ke(G.LEVEL[i]);
  };

  /* ---------- Layar hasil latihan ---------- */
  G.hasil = function (i, s, judul, salah) {
    var lama = G.P.s[i];
    G.P.s[i] = Math.max(G.P.s[i], s); G.P.salah[i] = salah || 0; G.simpan();
    G.ke(function () {
      G.dalamMenu = false;
      var akhir = i === 4;
      G.layar(
        '<img class="penonton" src="' + G.IM.penonton + '" alt="">' +
        '<div class="hasil">' +
          '<div class="sinar" aria-hidden="true"></div>' +
          '<h1 class="hasil-judul">' + judul + '</h1>' +
          '<img class="hasil-lencana" src="' + (akhir ? G.IM.piala : G.IM.lencana(i)) + '" alt="' + (akhir ? 'Piala' : 'Lencana') + '">' +
          '<div class="hasil-bt">' + [1, 2, 3].map(function (k) { return '<span class="bt-pop" style="animation-delay:' + (0.35 + k * 0.4) + 's">' + G.bintang(s >= k, 76) + '</span>'; }).join('') + '</div>' +
          '<div class="hasil-bisa"><small>' + STR.hasil.kamuBisa + '</small>' + STR.level[i].bisa + '</div>' +
          '<div class="baris-tombol tengah">' +
            '<button class="btn btn-teal" data-a="ulang">' + G.ikon('ulang', 26) + '<span>' + STR.hasil.ulangi + '</span></button>' +
            '<button class="btn btn-emas" data-a="lanjut" autofocus>' + G.ikon('kanan', 26) + '<span>' + (akhir ? STR.hasil.keMenu : STR.hasil.lanjut) + '</span></button>' +
          '</div>' +
        '</div>', 'latar');
      A.benar();
      if (akhir) { A.putar('tep', 0.55); A.putar('kon', 0.35); }
      [1, 2, 3].forEach(function (k) { if (s >= k) G.tunda(function () { A.bintang(k); }, 350 + k * 400); });
      G.tunda(G.konfeti, 300);
      G.aksi.ulang = function () { G.mulaiLevel(i); };
      G.aksi.lanjut = function () {
        if (!akhir && G.terbuka(i + 1)) G.mulaiLevel(i + 1); else G.ke(G.layarMenu);
      };
      G.petunjuk($('[data-a="lanjut"]'));
      G.test.hasil = { i: i, s: s, naik: s > lama };
    });
  };

  /* ---------- Sertifikat ---------- */
  G.layarSertifikat = function () {
    G.dalamMenu = false; A.musik(0); A.putar('kon', 0.35);
    var tgl = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    G.layar(
      '<div class="sertifikat-layar">' +
        '<div class="cf" id="cf" style="background-image:url(' + G.IM.bingkai + ')">' +
          '<h1>' + STR.sertifikat.judul + '</h1>' +
          '<p>' + STR.sertifikat.diberikan + '</p>' +
          '<p class="nm" id="cn">' + G.esc(G.P.n || STR.sertifikat.namaDefault) + '</p>' +
          '<p>' + STR.sertifikat.isi(G.totalBintang()) + '</p>' +
          '<ul>' + STR.level.map(function (L) { return '<li>' + L.bisa + '</li>'; }).join('') + '</ul>' +
          '<div class="cf-lencana">' + [0, 1, 2, 3, 4].map(function (k) { return '<img src="' + G.IM.lencana(k) + '" alt="">'; }).join('') + '</div>' +
          '<p class="kecil">' + tgl + ' · ' + STR.sertifikat.pengembang + '</p>' +
        '</div>' +
        '<div class="baris-tombol tengah">' +
          '<input id="ni" maxlength="24" autocomplete="off" aria-label="' + STR.sertifikat.tulisNama + '" placeholder="' + STR.sertifikat.tulisNama + '" value="' + G.esc(G.P.n) + '">' +
          '<button class="btn btn-emas" data-a="cetak">' + G.ikon('print', 26) + '<span>' + STR.sertifikat.cetak + '</span></button>' +
          '<button class="btn btn-teal" data-a="menu">' + G.ikon('kiri', 26) + '<span>' + STR.menu + '</span></button>' +
        '</div>' +
      '</div>', 'latar');
    $('#ni').addEventListener('input', function (e) { G.P.n = e.target.value.trim(); G.simpan(); $('#cn').textContent = G.P.n || STR.sertifikat.namaDefault; });
    G.aksi.cetak = function () { window.print(); };
    G.aksi.menu = function () { A.henti(); G.ke(G.layarMenu); };
  };
  G.layarSertifikat.namaLayar = 'sertifikat';

  G.poster = function () {
    G.modal('Poster Konser', 'img', '<div class="poster"><img src="' + G.IM.poster + '" alt="Poster Konser Kelas bersama Nuri"></div>', 640);
  };

  /* ---------- Catatan untuk Guru ---------- */
  G.catatanGuru = function () {
    var baris = STR.level.map(function (L, i) {
      var main = G.P.main[i];
      return '<tr><td><b>' + (i + 1) + '. ' + L.nama + '</b></td><td>' + L.guru + '</td><td class="c">' +
        (G.P.s[i] ? G.bintang3(G.P.s[i], 22) : '<span class="redup">' + STR.guru.belum + '</span>') + '</td><td class="c">' + main + '</td><td class="c">' + (main ? G.P.salah[i] : '-') + '</td></tr>';
    }).join('');
    G.modal(STR.guru.judul, 'papan',
      '<p class="pengantar">' + STR.guru.pengantar + '</p>' +
      '<table class="tabel"><thead><tr>' + STR.guru.kolom.map(function (k) { return '<th>' + k + '</th>'; }).join('') + '</tr></thead><tbody>' + baris + '</tbody></table>' +
      '<h3>' + G.ikon('ok', 28) + STR.guru.saran + '</h3>' + STR.guru.saranIsi.map(function (s) { return '<div class="pr">' + G.ikon('kanan', 22) + '<span>' + s + '</span></div>'; }).join(''), 1060);
  };
})();
