/* Percobaan 4 · Keras Lembut (dinamika)
   Tebak -> Coba (penggeser p/mf/f, meter, Layar Suara: makin keras makin tinggi gelombangnya) -> Simpulkan
   -> Uji: 4 suasana, atur penggeser lalu nyanyikan. Umpan balik sesuai arah salah; suasana yang salah diulang di akhir. */
(function () {
  var $ = G.$, A = G.audio, T = STR.l4, VOL = [0.05, 0.13, 0.28];
  var salah = 0;

  function mulai() { salah = 0; G.tebak(3, 0, T.tebak, coba); }
  mulai.namaLayar = 'l4';
  G.LEVEL[3] = mulai;

  function frasa(i) { [67, 69, 67, 64].forEach(function (m, k) { A.nyanyi(m, 0.34, VOL[i], k * 0.32); }); }
  function ikonVolume(i, w) {
    var gel = ['<path d="M15 9.5a3.5 3.5 0 010 5"/>', '<path d="M17.5 7a7 7 0 010 10"/>', '<path d="M20 4.5a10.5 10.5 0 010 15"/>'].slice(0, i + 1).join('');
    return '<svg width="' + (w || 40) + '" height="' + (w || 40) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor"/>' + gel + '</svg>';
  }
  /* Penggeser 3 posisi (input range: bisa diseret, diketuk, atau dipakai dengan panah keyboard) */
  function penggeser(awal) {
    return '<div class="geser"><input type="range" id="geser" min="0" max="2" step="1" value="' + awal + '" aria-label="' + T.kekuatan + '">' +
      '<div class="geser-label">' + T.pilihan.map(function (p, i) {
        return '<button class="gl d' + i + '" data-a="zona" data-i="' + i + '">' + ikonVolume(i, 34) + '<b>' + p[0] + '</b><i class="simbol">' + p[1] + '</i></button>';
      }).join('') + '</div></div>';
  }
  function meter() {
    return '<div class="meter" aria-hidden="true"><div class="meter-isi" id="meterIsi"></div><span class="mz mz2">f</span><span class="mz mz1">mf</span><span class="mz mz0">p</span></div>';
  }
  /* Meter mengikuti kekuatan bunyi sebenarnya (sintesis atau mikrofon). */
  function jalankanMeter() {
    var el = $('#meterIsi'), tampil = 0;
    (function f() {
      if (!document.body.contains(el)) return;
      var target = Math.min(1, G.scope.rms * (A.mikAktif() ? 12 : 4.6));
      tampil += (target - tampil) * (target > tampil ? 0.5 : 0.12);
      el.style.transform = 'scaleY(' + tampil.toFixed(3) + ')';
      el.className = 'meter-isi z' + (tampil > 0.55 ? 2 : tampil > 0.25 ? 1 : 0);
      requestAnimationFrame(f);
    })();
  }
  function pasangGeser(onUbah) {
    var g = $('#geser');
    var set = function (i) { g.value = i; G.$$('.gl').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-i') === i); }); onUbah(i); };
    g.addEventListener('change', function () { set(+g.value); });
    G.aksi.zona = function (el) { set(+el.getAttribute('data-i')); };
    G.$$('.gl').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-i') === +g.value); });
    return set;
  }

  /* ---------- Coba ---------- */
  function coba() {
    var dicoba = {};
    G.layarLab(3, 1, 's', T.coba, G.konsol(STR.lab.alat.kekuatan,
      '<div class="dinamika-lab"><div class="dl-atas">' + G.layarSuara('ls', 640, 180) + meter() + '</div>' + penggeser(1) + '</div>' +
      '<div class="konsol-bawah">' + G.tombolMik() +
        '<button class="btn btn-teal" data-a="keSimpul" id="keSimpul" disabled>' + G.ikon('ok', 26) + '<span>' + STR.lab.simpulkan + '</span></button></div>'));
    G.scope.pasang('ls', { gain: 3 }); jalankanMeter();
    pasangGeser(function (i) {
      frasa(i); G.nuriEkspresi(i === 2 ? 'b' : i === 0 ? 'n' : 's', 1300);
      dicoba[i] = 1;
      if (dicoba[0] && dicoba[2]) { var ks = $('#keSimpul'); if (ks.disabled) { ks.disabled = false; G.tunda(function () { G.kata(T.cukup); }, 1300); G.petunjuk(ks); G.catat(3, 'data', T.data); } }
      else G.petunjuk($('.gl[data-i="' + (dicoba[0] ? 2 : 0) + '"]'));
    });
    G.aksi.keSimpul = simpulkan;
    G.petunjuk($('.gl[data-i="0"]'));
    G.test.selesaikan = function () { G.catat(3, 'data', T.data); simpulkan(); };
  }

  function simpulkan() {
    G.simpulkan(3, 2, Object.assign({ data: '<div class="data-dua">' + G.ikonGelombang('rendah') + '<span>Lembut</span>' + G.ikonGelombang('tinggi') + '<span>Keras</span></div>' }, T.simpul),
      function (c) { salah += c; uji(); });
  }

  /* ---------- Uji: suasana ---------- */
  function uji() {
    var antre = G.acak([0, 1, 2, 3, 4]).slice(0, 4), POKOK = 4, nomor = 0, benar = 0, diulang = {}, tambahan = 0;
    function soal() {
      var qi = antre[0], Q = T.soal[qi], coba = 0, beres = false, pilih = 1;
      nomor++;
      G.layarLab(3, 3, Q.malam ? 'n' : 's', '<b>' + Q.t + '</b> ' + T.tanya, G.konsol(STR.soalKe(nomor, POKOK + tambahan),
        '<div class="suasana-lab">' +
          '<figure class="suasana"><img src="' + G.IM.suasana(Q.g) + '" alt="' + G.esc(Q.t) + '"></figure>' +
          '<div class="suasana-kanan"><div class="dl-atas">' + G.layarSuara('ls', 330, 120) + meter() + '</div></div>' +
        '</div>' +
        '<div class="geser-baris">' + penggeser(1) +
          '<button class="btn btn-emas" data-a="nyanyikan" id="nyanyikan">' + G.ikon('mic', 26) + '<span>' + T.nyanyikan + '</span></button></div>'),
        Q.malam ? 'malam' : 'latar');
      G.scope.pasang('ls', { gain: 3 }); jalankanMeter();
      /* bunyi geser: nada tetap, hanya kekuatannya yang berubah (nada tidak dipakai untuk menandai keras-lembut) */
      pasangGeser(function (i) { pilih = i; A.nada(A.hz(76), 0.1, [0.02, 0.05, 0.11][i], 'sine'); G.petunjuk($('#nyanyikan')); });
      G.aksi.nyanyikan = function () {
        if (beres) return;
        var i = pilih, btn = $('#nyanyikan');
        A.henti('nina'); frasa(i); btn.disabled = true;
        G.tunda(function () {
          btn.disabled = false;
          if (i === Q.a) {
            beres = true; if (coba === 0 && nomor <= POKOK) benar++;
            btn.disabled = true; G.$$('.gl').forEach(function (b) { b.disabled = true; }); $('#geser').disabled = true;
            G.partikel($('.suasana')); G.sorak(); G.kata(T.benar); A.benar();
            if (Q.a === 0) G.tunda(function () { A.putar('nina', 0.3); }, 500);
            antre.shift();
            G.tunda(function () {
              A.henti('nina');
              if (antre.length) soal();
              else G.hasil(3, benar >= 4 ? 3 : benar >= 3 ? 2 : 1, T.selesai, salah);
            }, Q.a === 0 ? 3000 : 1900);
            return;
          }
          coba++; salah++; G.goyang($('.suasana')); G.bingung(); A.salah();
          G.kata(i > Q.a ? T.terlaluKeras : T.terlaluPelan);
          if (coba >= 2) { var b = $('.gl[data-i="' + Q.a + '"]'); b.classList.add('sorot'); G.tunjukSekarang(b); }
          if (!diulang[qi]) { diulang[qi] = 1; antre.push(qi); tambahan++; }
        }, 1300);
      };
      G.petunjuk($('.gl[data-i="' + (Q.a === 1 ? 0 : 1) + '"]'));
      G.test.selesaikan = function () { G.aksi.zona($('.gl[data-i="' + Q.a + '"]')); G.aksi.nyanyikan(); };
    }
    soal();
  }
})();
