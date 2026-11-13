/* Latihan 4 · Keras Lembut (dinamika): pilih kekuatan suara yang cocok dengan suasana.
   Setiap pilihan langsung memperdengarkan contoh pada volume itu. Umpan balik sesuai arah kesalahan. */
(function () {
  var $ = G.$, A = G.audio, T = STR.l4, VOL = [0.05, 0.13, 0.28];

  function contoh(i) {
    [67, 69, 67, 64].forEach(function (m, k) { A.nyanyi(m, 0.32, VOL[i], k * 0.3); });
  }
  /* Ikon pengeras suara dengan 1-3 gelombang */
  function ikonVolume(i) {
    var gel = ['<path d="M15 9.5a3.5 3.5 0 010 5"/>', '<path d="M17.5 7a7 7 0 010 10"/>', '<path d="M20 4.5a10.5 10.5 0 010 15"/>'].slice(0, i + 1).join('');
    return '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor"/>' + gel + '</svg>';
  }

  function mulai() {
    var antre = G.acak([0, 1, 2, 3, 4]).slice(0, 4), POKOK = 4, nomor = 0, benar = 0, salah = 0, diulang = {}, tambahan = 0;
    function soal() {
      var qi = antre[0], Q = T.soal[qi], coba = 0, beres = false;
      nomor++;
      G.layar(G.hud(3, Math.min(nomor - 1, POKOK), POKOK) +
        '<div class="main">' + G.nuri(Q.malam ? 'n' : 's', 210) +
          '<div class="kolom">' +
            '<div class="label-soal">' + STR.soalKe(nomor, POKOK + tambahan) + '</div>' +
            '<div class="suasana-baris"><figure class="suasana"><img src="' + G.IM.suasana(Q.g) + '" alt="' + G.esc(Q.t) + '"></figure>' +
            G.balon('<b>' + Q.t + '</b><br>' + T.tanya) + '</div>' +
            '<div class="pilihan">' + T.pilihan.map(function (p, i) {
              return '<button class="kartu kartu-dinamika d' + i + '" data-a="pilih" data-i="' + i + '">' + ikonVolume(i) +
                '<b>' + p[0] + '</b><i class="simbol">' + p[1] + '</i></button>';
            }).join('') + '</div>' +
          '</div></div>', Q.malam ? 'malam' : 'latar');
      G.aksi.pilih = function (el) {
        if (beres) return;
        var i = +el.getAttribute('data-i');
        A.henti('nina'); contoh(i);
        if (i === Q.a) {
          beres = true; if (coba === 0 && nomor <= POKOK) benar++;
          G.$$('.kartu-dinamika').forEach(function (b) { b.disabled = true; });
          el.classList.add('benar'); G.partikel(el); G.sorak(); G.kata(T.benar);
          G.tunda(function () { A.benar(); }, 1250);
          if (Q.a === 0) G.tunda(function () { A.putar('nina', 0.3); }, 1300);
          antre.shift();
          G.tunda(function () {
            A.henti('nina');
            if (antre.length) soal(); else G.hasil(3, benar >= 4 ? 3 : benar >= 3 ? 2 : 1, T.selesai, salah);
          }, Q.a === 0 ? 3200 : 2000);
          return;
        }
        coba++; salah++; G.goyang(el); G.bingung(); el.disabled = true;
        G.tunda(A.salah, 1200);
        G.kata(i > Q.a ? T.terlaluKeras : T.terlaluPelan);
        if (coba >= 2) $('.kartu-dinamika[data-i="' + Q.a + '"]').classList.add('sorot');
        if (!diulang[qi]) { diulang[qi] = 1; antre.push(qi); tambahan++; }
      };
      G.petunjuk($('.kartu-dinamika'));
      G.test.selesaikan = function () { G.aksi.pilih($('.kartu-dinamika[data-i="' + Q.a + '"]')); };
    }
    soal();
  }
  mulai.namaLayar = 'l4';
  G.LEVEL[3] = mulai;
})();
