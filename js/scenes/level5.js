/* Latihan 5 · Konser Kelas: (a) susun baris lagu, (b) bernyanyi bersama dengan lirik berjalan, (c) beri tanggapan. */
(function () {
  var $ = G.$, A = G.audio, T = STR.l5, B = LAGU.baris;

  function mulai() {
    var salah = 0;

    /* ---------- (a) Susun baris lagu ---------- */
    function susun() {
      var berikut = 0, coba = 0, urut = G.acak([0, 1, 2]);
      G.layar(G.hud(4, 0, 3) +
        '<div class="main">' + G.nuri('s', 240) +
          '<div class="kolom lebar">' + G.balon(T.susun) +
            '<div class="slot-wadah">' + B.map(function (_, i) { return '<div class="slot" id="slot' + i + '"><i>' + (i + 1) + '</i><span></span></div>'; }).join('') + '</div>' +
            '<div class="baris-lagu">' + urut.map(function (i) {
              return '<button class="kartu kartu-baris" data-a="baris" data-i="' + i + '">' + G.ikon('not', 26) + '<span>' + B[i].teks + '</span></button>';
            }).join('') + '</div>' +
          '</div></div>', 'latar');
      G.aksi.baris = function (el) {
        var i = +el.getAttribute('data-i');
        if (i === berikut) {
          el.disabled = true; el.classList.add('terpakai');
          var s = $('#slot' + i); s.classList.add('isi'); s.querySelector('span').textContent = B[i].teks;
          B[i].nada.slice(0, 4).forEach(function (m, k) { A.nyanyi(m, 0.2, 0.12, k * 0.18); });
          G.partikel(s, 8); berikut++; coba = 0;
          G.$$('.kartu-baris').forEach(function (b) { b.classList.remove('sorot'); });
          if (berikut === 3) { A.benar(); G.sorak(); G.tunda(nyanyi, 1200); }
          else G.petunjuk($('.kartu-baris:not([disabled])'));
          return;
        }
        coba++; salah++; A.salah(); G.goyang(el); G.bingung();
        G.kata(berikut === 0 && coba >= 2 ? T.susunPetunjuk : T.susunSalah);
        if (coba >= 2) $('.kartu-baris[data-i="' + berikut + '"]').classList.add('sorot');
      };
      G.petunjuk($('.kartu-baris'));
      G.test.selesaikan = function () { G.aksi.baris($('.kartu-baris[data-i="' + berikut + '"]')); };
    }

    /* ---------- (b) Bernyanyi bersama ---------- */
    function nyanyi() {
      var sudahNyanyi = false, main = false;
      G.layar(G.hud(4, 1, 3) +
        '<div class="main">' +
          '<div class="nuri-mik">' + G.nuri('b', 230) + '<img class="mik" src="' + G.IM.mik + '" alt=""></div>' +
          '<div class="kolom lebar">' + G.balon(T.nyanyi) +
            '<div class="gulungan" style="background-image:url(' + G.IM.gulungan + ')"><div class="lirik">' +
              B.map(function (b, i) { return '<div class="lirik-baris">' + b.suku.map(function (s, j) { return '<span id="s' + i + '_' + j + '">' + s + '</span>'; }).join('') + '</div>'; }).join('') +
            '</div></div>' +
            '<div class="baris-tombol tengah">' +
              '<button class="btn btn-teal" data-a="dengar">' + G.ikon('telinga', 26) + '<span>' + T.dengar + '</span></button>' +
              '<button class="btn btn-emas" data-a="ayo">' + G.ikon('mic', 26) + '<span>' + T.ayo + '</span></button>' +
              '<button class="btn btn-emas" data-a="lanjut" id="lanjut" disabled>' + G.ikon('kanan', 26) + '<span>' + T.lanjut + '</span></button>' +
            '</div>' +
          '</div></div>', 'latar');
      function putar(bersama) {
        if (main) return; main = true;
        var ketuk = G.O.calm ? 0.62 : 0.5, t = 0;
        G.$$('[data-a="dengar"],[data-a="ayo"]').forEach(function (b) { b.disabled = true; });
        G.$$('.lirik span').forEach(function (s) { s.classList.remove('on', 'lewat'); });
        if (bersama) A.putar('peng', 0.45);
        B.forEach(function (b, i) {
          b.suku.forEach(function (s, j) {
            var mulaiDetik = t, d = b.dur[j] * ketuk;
            A.nyanyi(b.nada[j], d * 0.92, bersama ? 0.07 : 0.18, mulaiDetik);
            G.tunda(function () {
              G.$$('.lirik span.on').forEach(function (e) { e.classList.remove('on'); e.classList.add('lewat'); });
              var el = $('#s' + i + '_' + j); el && el.classList.add('on');
            }, mulaiDetik * 1000);
            t += d;
          });
        });
        G.tunda(function () {
          main = false; A.henti('peng');
          G.$$('.lirik span.on').forEach(function (e) { e.classList.remove('on'); e.classList.add('lewat'); });
          G.$$('[data-a="dengar"],[data-a="ayo"]').forEach(function (b) { b.disabled = false; });
          if (bersama) { sudahNyanyi = true; $('#lanjut').disabled = false; A.putar('tep', 0.45); G.sorak(); G.kata(T.pujian); G.konfeti(); G.petunjuk($('#lanjut')); }
          else G.petunjuk($('[data-a="ayo"]'));
        }, t * 1000 + 300);
      }
      G.aksi.dengar = function () { putar(false); };
      G.aksi.ayo = function () { putar(true); };
      G.aksi.lanjut = function () { if (sudahNyanyi) tanggapan(); };
      G.petunjuk($('[data-a="dengar"]'));
      G.test.selesaikan = function () { sudahNyanyi = true; G.bersihkanTimer(); main = false; tanggapan(); };
    }

    /* ---------- (c) Tanggapan dengan kata-kata musik ---------- */
    function tanggapan() {
      A.henti('peng');
      var urut = G.acak([0, 1, 2]);
      G.layar(G.hud(4, 2, 3) +
        '<div class="main">' + G.nuri('p', 240) +
          '<div class="kolom lebar">' + G.balon(T.tanggap) +
            '<div class="baris-lagu">' + urut.map(function (i) {
              return '<button class="kartu kartu-baris" data-a="tanggap" data-i="' + i + '">' + G.ikon('mic', 26) + '<span>' + T.opsi[i][0] + '</span></button>';
            }).join('') + '</div>' +
          '</div></div>', 'latar');
      G.aksi.tanggap = function (el) {
        var i = +el.getAttribute('data-i');
        if (i === 1) {
          G.$$('.kartu-baris').forEach(function (b) { b.disabled = true; });
          el.classList.add('benar'); A.benar(); G.sorak(); G.partikel(el);
          G.tunda(function () { G.hasil(4, salah < 2 ? 3 : salah < 4 ? 2 : 1, T.selesai, salah); }, 1100);
          return;
        }
        salah++; A.salah(); G.goyang(el); G.bingung(); el.disabled = true; G.kata(T.opsi[i][1]);
      };
      G.petunjuk($('.kartu-baris'));
      G.test.selesaikan = function () { G.aksi.tanggap($('.kartu-baris[data-i="1"]')); };
    }

    susun();
  }
  mulai.namaLayar = 'l5';
  G.LEVEL[4] = mulai;
})();
