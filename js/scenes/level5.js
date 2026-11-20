/* Percobaan 5 · Konser Kelas
   Susun baris lagu -> Atur tempo dan kekuatan suara -> Tampil (pengiring sintesis mengikuti tempo, lirik berjalan)
   -> Tanggapi: pilih kalimat yang sesuai dengan penampilan yang benar-benar didengar (pilihan dibuat dari pengaturan murid). */
(function () {
  var $ = G.$, A = G.audio, T = STR.l5, B = LAGU.baris;
  var TEMPO = [72, 96, 132], VOL = [0.06, 0.13, 0.24];

  /* Pilihan tanggapan (fungsi murni, diuji di test/logic). Indeks 0 selalu yang sesuai penampilan.
     Pengecoh: tempo salah, kekuatan salah, dan pujian samar tanpa istilah musik. Tiap pengecoh punya umpan balik sendiri. */
  G.opsiTanggapan = function (t, d, rnd) {
    rnd = rnd || Math.random;
    var lainT = (t + 1 + (rnd() * 2 | 0)) % 3, lainD = (d + 1 + (rnd() * 2 | 0)) % 3;
    var kal = function (a, b) { return T.kalimat(T.tempoKata[a], T.dinamikaKata[b], T.kesan[a][b]); };
    return [[kal(t, d), ''], [kal(lainT, d), T.salahTempo(T.tempoKata[t])], [kal(t, lainD), T.salahDinamika(T.dinamikaKata[d])], [T.samar, T.samarSalah]];
  };

  function mulai() {
    var salah = 0, atur = { t: 1, d: 1 }, didengar = null;

    /* ---------- (a) Susun baris lagu ---------- */
    function susun() {
      var berikut = 0, coba = 0, urut = G.acak([0, 1, 2]);
      G.layarLab(4, 0, 's', T.susun, G.konsol(STR.lab.alat.susun,
        '<div class="slot-wadah">' + B.map(function (_, i) { return '<div class="slot" id="slot' + i + '"><i>' + (i + 1) + '</i><span></span></div>'; }).join('') + '</div>' +
        '<div class="baris-lagu">' + urut.map(function (i) {
          return '<button class="kartu kartu-baris" data-a="baris" data-i="' + i + '">' + G.ikon('not', 26) + '<span>' + B[i].teks + '</span></button>';
        }).join('') + '</div>'));
      G.aksi.baris = function (el) {
        var i = +el.getAttribute('data-i');
        if (i === berikut) {
          el.disabled = true; el.classList.add('terpakai');
          var s = $('#slot' + i); s.classList.add('isi'); s.querySelector('span').textContent = B[i].teks;
          B[i].nada.slice(0, 4).forEach(function (m, k) { A.nyanyi(m, 0.2, 0.12, k * 0.18); });
          G.partikel(s, 8); berikut++; coba = 0;
          G.$$('.kartu-baris').forEach(function (b) { b.classList.remove('sorot'); });
          if (berikut === 3) { A.benar(); G.sorak(); G.tunda(panel, 1200); }
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

    /* Akor sederhana per ketukan: fa/la -> F, re/si -> G, lainnya -> C. */
    function akorUntuk(m) { var n = m % 12; return n === 5 || n === 9 ? 65 : n === 2 || n === 11 ? 67 : 60; }

    /* Mainkan lagu dengan pengaturan murid. bersama = pakai pengiring dan melodi tipis (murid yang bernyanyi). */
    function mainkan(bersama, selesai) {
      var ketuk = 60 / TEMPO[atur.t], vol = VOL[atur.d], t = 0, akor = [];
      G.$$('.lirik span').forEach(function (s) { s.classList.remove('on', 'lewat'); });
      if (bersama) {   /* hitungan masuk 4 ketukan agar murid siap bernyanyi bersama */
        for (var h = 0; h < 4; h++) A.tik(h === 0, h * ketuk);
        G.kata(T.hitungMasuk); t = 4 * ketuk;
      }
      LAGU.urutan.forEach(function (bi, i) {
        var b = B[bi];
        b.suku.forEach(function (s, j) {
          var mulaiDetik = t, d = b.dur[j] * ketuk;
          A.nyanyi(b.nada[j], d * 0.92, bersama ? vol * 0.45 : vol, mulaiDetik);
          for (var k = 0; k < b.dur[j]; k++) akor.push(akorUntuk(b.nada[j]));
          G.tunda(function () {
            G.$$('.lirik span.on').forEach(function (e) { e.classList.remove('on'); e.classList.add('lewat'); });
            var el = $('#s' + i + '_' + j); el && el.classList.add('on');
          }, mulaiDetik * 1000);
          t += d;
        });
      });
      if (bersama) { var mulaiP = 4 * ketuk; G.tunda(function () { A.pengiring(akor, ketuk, vol / 0.13); G.kata(T.tampil); }, mulaiP * 1000); }
      G.tunda(function () {
        G.$$('.lirik span.on').forEach(function (e) { e.classList.remove('on'); e.classList.add('lewat'); });
        selesai();
      }, t * 1000 + 300);
    }

    /* ---------- (b) Atur dan tampil ---------- */
    function panel() {
      var main = false;
      var segmen = function (nama, kunci, label) {
        return '<div class="panel-baris"><span class="panel-label">' + nama + '</span><div class="segmen" role="radiogroup" aria-label="' + nama + '">' + label.map(function (l, i) {
          return '<button class="seg" role="radio" data-a="atur" data-k="' + kunci + '" data-i="' + i + '" aria-checked="' + (atur[kunci] === i) + '">' + l + '</button>';
        }).join('') + '</div></div>';
      };
      G.layarLab(4, 1, 'b', T.atur, G.konsol(STR.lab.alat.konser,
        '<div class="konser-lab">' +
          '<div class="panel-kiri">' + segmen(T.tempo, 't', T.tempoLabel) + segmen(T.kekuatan, 'd', T.dinamikaLabel) +
            G.layarSuara('ls', 300, 96) + '</div>' +
          '<div class="gulungan" style="background-image:url(' + G.IM.gulungan + ')"><div class="lirik">' +
            LAGU.urutan.map(function (bi, i) { return '<div class="lirik-baris">' + B[bi].suku.map(function (s, j) { return '<span id="s' + i + '_' + j + '">' + s + '</span>'; }).join('') + '</div>'; }).join('') +
          '</div></div>' +
        '</div>' +
        '<div class="konsol-bawah">' +
          '<button class="btn btn-teal" data-a="dengar">' + G.ikon('telinga', 26) + '<span>' + T.dengar + '</span></button>' +
          '<button class="btn btn-emas" data-a="ayo">' + G.ikon('mic', 26) + '<span>' + T.ayo + '</span></button>' +
          '<button class="btn btn-emas" data-a="lanjut" id="lanjut" disabled>' + G.ikon('kanan', 26) + '<span>' + T.lanjut + '</span></button>' +
        '</div>'));
      G.scope.pasang('ls', { gain: 3 });
      G.aksi.atur = function (el) {
        if (main) return;
        var k = el.getAttribute('data-k'), i = +el.getAttribute('data-i');
        atur[k] = i;
        G.$$('.seg[data-k="' + k + '"]').forEach(function (b) { b.setAttribute('aria-checked', +b.getAttribute('data-i') === i); });
        /* tempo: dua tik berjarak sesuai tempo; kekuatan: nada tetap dengan kekuatan berbeda (bukan tinggi nada) */
        if (k === 't') { A.tik(true); A.tik(false, 60 / TEMPO[i]); } else A.nada(A.hz(76), 0.1, [0.02, 0.05, 0.11][i], 'sine');
      };
      function putar(bersama) {
        if (main) return; main = true;
        G.$$('[data-a="dengar"],[data-a="ayo"],.seg').forEach(function (b) { b.disabled = true; });
        G.tahap(bersama ? 2 : 1);
        mainkan(bersama, function () {
          main = false; didengar = { t: atur.t, d: atur.d };
          G.$$('[data-a="dengar"],[data-a="ayo"],.seg').forEach(function (b) { b.disabled = false; });
          $('#lanjut').disabled = false;
          if (bersama) { A.putar('tep', 0.45); G.sorak(); G.kata(T.pujian); G.konfeti(); }
          G.petunjuk($('#lanjut'));
        });
      }
      G.aksi.dengar = function () { putar(false); };
      G.aksi.ayo = function () { putar(true); };
      G.aksi.lanjut = function () { if (didengar) tanggapan(); };
      G.petunjuk($('[data-a="ayo"]'));
      G.test.selesaikan = function () { didengar = { t: atur.t, d: atur.d }; G.bersihkanTimer(); main = false; tanggapan(); };
    }

    /* ---------- (c) Tanggapan sesuai yang didengar ---------- */
    function tanggapan() {
      var t = didengar.t, d = didengar.d, opsi = G.opsiTanggapan(t, d);
      var urut = G.acak([0, 1, 2, 3]), coba = 0;
      G.catat(4, 'data', 'Tempo ' + T.tempoKata[t] + ', suara ' + T.dinamikaKata[d] + '.');
      G.layarLab(4, 3, 'p', T.tanggap, G.konsol(STR.lab.alat.tanggap,
        '<div class="baris-lagu lebar">' + urut.map(function (i) {
          return '<button class="kartu kartu-baris" data-a="tanggap" data-i="' + i + '">' + G.ikon('mic', 26) + '<span>' + opsi[i][0] + '</span></button>';
        }).join('') + '</div>' +
        '<div class="konsol-bawah"><button class="btn btn-teal" data-a="ulangDengar">' + G.ikon('telinga', 26) + '<span>' + T.dengar + '</span></button></div>'));
      G.aksi.ulangDengar = function () {
        var ketuk = 60 / TEMPO[t], w = 0;
        B[0].suku.forEach(function (s, j) { A.nyanyi(B[0].nada[j], B[0].dur[j] * ketuk * 0.92, VOL[d], w); w += B[0].dur[j] * ketuk; });
      };
      G.aksi.tanggap = function (el) {
        var i = +el.getAttribute('data-i');
        if (i === 0) {
          G.$$('.kartu-baris').forEach(function (b) { b.disabled = true; });
          el.classList.add('benar'); A.benar(); G.sorak(); G.partikel(el);
          G.catat(4, 'temuan', opsi[0][0]);
          G.tunda(function () { G.hasil(4, salah < 2 ? 3 : salah < 4 ? 2 : 1, T.selesai, salah); }, 1300);
          return;
        }
        salah++; coba++; A.salah(); G.goyang(el); G.bingung(); el.disabled = true; G.kata(opsi[i][1]);
        if (coba >= 2) $('.kartu-baris[data-i="0"]').classList.add('sorot');
      };
      G.petunjuk($('.kartu-baris'));
      G.test.selesaikan = function () { G.aksi.tanggap($('.kartu-baris[data-i="0"]')); };
    }

    susun();
  }
  mulai.namaLayar = 'l5';
  G.LEVEL[4] = mulai;
})();
