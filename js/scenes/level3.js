/* Latihan 3 · Ketuk Irama: ketuk drum tepat saat suku kata "Gun-dul gun-dul pa-cul cul" menyala.
   4 ketukan hitungan, 7 ketukan target, 1 ketukan ditahan. Gagal -> tempo diperlambat; gagal 2x -> contoh dari Nuri. */
(function () {
  var $ = G.$, A = G.audio, T = STR.l3, SUKU = LAGU.irama.suku, NADA = LAGU.irama.nada;

  function mulai() {
    var bpm = G.O.calm ? 72 : 88, gagal = 0, salahTotal = 0, jalan = false, target = [], kena = [], tol = 0;

    G.layar(G.hud(2, 0, 0) +
      '<div class="main">' + G.nuri('s', 240) +
        '<div class="kolom">' + G.balon(T.tanya) +
          '<div class="suku" id="suku">' + SUKU.map(function (s, k) { return '<span id="y' + k + '">' + s + '</span>'; }).join('') +
            '<span class="tahan" id="y7">' + T.tahan + '</span></div>' +
          '<div class="irama-baris">' +
            '<button class="drum" id="drum" data-senyap aria-label="' + T.ketuk + '">' +
              '<svg viewBox="0 0 220 170" width="230" height="178" aria-hidden="true">' +
                '<ellipse cx="110" cy="138" rx="92" ry="22" fill="#00000033"/>' +
                '<path d="M22 58 V118 Q110 160 198 118 V58" fill="#c23a52" stroke="#3b1f4a" stroke-width="6"/>' +
                '<path d="M22 78 Q110 118 198 78 M22 100 Q110 140 198 100" stroke="#f6c344" stroke-width="6" fill="none"/>' +
                '<path d="M40 70 L62 128 M84 84 L96 138 M136 84 L124 138 M180 70 L158 128" stroke="#fff4dc" stroke-width="4"/>' +
                '<ellipse class="drum-kulit" cx="110" cy="58" rx="88" ry="30" fill="#fff4dc" stroke="#3b1f4a" stroke-width="6"/>' +
              '</svg><b>' + T.ketuk + '</b></button>' +
            '<div class="irama-kanan"><div class="hitung-besar" id="cnt" aria-live="polite"></div>' +
              '<button class="btn btn-emas" data-a="go" id="go">' + G.ikon('play', 26) + '<span>' + T.mulai + '</span></button>' +
              '<button class="btn btn-teal" data-a="contoh" id="contohBtn" hidden>' + G.ikon('telinga', 26) + '<span>' + T.contoh + '</span></button>' +
            '</div>' +
          '</div>' +
        '</div></div>', 'latar');

    var drum = $('#drum'), cnt = $('#cnt');
    function pukul(manual) {
      drum.classList.remove('pukul'); void drum.offsetWidth; drum.classList.add('pukul');
      A.drum(manual ? 0.35 : 0.25);
    }
    function ketuk() {
      pukul(true);
      if (!jalan) return;
      var n = performance.now();
      for (var k = 0; k < target.length; k++) {
        if (!kena[k] && Math.abs(n - target[k]) <= tol) {
          kena[k] = 1; var y = $('#y' + k); y.classList.add('kena');
          A.nada(A.hz(NADA[k] + 12), 0.15, 0.06, 'sine');
          tanda(y); break;
        }
      }
    }
    function tanda(y) {
      var p = document.createElement('em'); p.className = 'pas'; p.textContent = T.pas; y.appendChild(p);
      setTimeout(function () { p.remove(); }, 650);
    }
    drum.addEventListener('pointerdown', function (e) { e.preventDefault(); ketuk(); });
    G.onKey = function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat && document.activeElement === drum) { e.preventDefault(); ketuk(); } };
    drum.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') e.preventDefault(); });

    /* Satu putaran: 4 hitungan + 8 ketukan lagu. contoh = Nuri memukul drum sendiri. */
    function putaran(contoh) {
      var ms = 60000 / bpm, mulaiT = performance.now() + 500;
      tol = (G.O.calm ? 260 : 190) + (gagal ? 40 : 0);
      jalan = !contoh; kena = []; target = [];
      $('#go').disabled = true; $('#contohBtn').hidden = true; G.petunjuk(null);
      G.$$('#suku span').forEach(function (s) { s.classList.remove('kena', 'on', 'lewat'); });
      for (var k = 0; k < SUKU.length; k++) target[k] = mulaiT + (k + 4) * ms;
      for (var i = 0; i < 12; i++) (function (i) {
        setTimeoutT(function () {
          if (i < 4) { A.tik(i === 0); cnt.textContent = i + 1; cnt.classList.remove('pop'); void cnt.offsetWidth; cnt.classList.add('pop'); return; }
          cnt.textContent = '';
          var k = i - 4, y = $('#y' + k);
          G.$$('#suku span.on').forEach(function (s) { s.classList.remove('on'); s.classList.add('lewat'); });
          if (y) y.classList.add('on');
          A.tik(k % 4 === 0);
          if (k < SUKU.length) A.nyanyi(NADA[k], k === 6 ? ms * 1.9 / 1000 : ms * 0.85 / 1000, 0.08);
          if (contoh && k < SUKU.length) { pukul(false); y.classList.add('kena'); }
          if (i === 4 && !contoh) drum.focus({ preventScroll: true });
        }, 500 + i * ms);
      })(i);
      setTimeoutT(function () { selesai(contoh); }, 500 + 12 * ms + tol);
    }
    /* timer yang ikut dibatalkan saat pindah layar (tidak dipercepat di mode uji agar waktunya tetap nyata) */
    function setTimeoutT(fn, ms) { var c = G.cepat; G.cepat = 1; G.tunda(fn, ms); G.cepat = c; }

    function selesai(contoh) {
      jalan = false; G.$$('#suku span').forEach(function (s) { s.classList.remove('on'); });
      var go = $('#go'); go.disabled = false;
      if (contoh) { G.kata(T.tanya); go.querySelector('span').textContent = T.lagi; G.petunjuk(go); return; }
      var h = kena.filter(Boolean).length, n = SUKU.length;
      if (h >= 5) {
        A.benar(); G.sorak(); G.kata(T.hasil(h, n));
        G.tunda(function () { G.hasil(2, h >= 7 ? 3 : h >= 6 ? 2 : 1, T.selesai, salahTotal); }, 1300);
        return;
      }
      gagal++; salahTotal += n - h; A.salah(); G.bingung();
      bpm = Math.max(60, bpm - 10);
      go.querySelector('span').textContent = T.lagi;
      if (gagal >= 2) { G.kata(T.hasil(h, n) + ' ' + T.kurang2); var c = $('#contohBtn'); c.hidden = false; G.petunjuk(c); }
      else { G.kata(T.hasil(h, n) + ' ' + T.kurang); G.petunjuk(go); }
    }

    G.aksi.go = function () { G.kata(T.siap); putaran(false); };
    G.aksi.contoh = function () { G.kata(T.contohJalan); putaran(true); };
    G.petunjuk($('#go'));
    G.test.selesaikan = function () { kena = SUKU.map(function () { return 1; }); jalan = false; G.bersihkanTimer(); selesai(false); };
  }
  mulai.namaLayar = 'l3';
  G.LEVEL[2] = mulai;
})();
