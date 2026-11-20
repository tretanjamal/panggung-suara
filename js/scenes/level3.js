/* Percobaan 3 · Ketukan
   Tebak -> Coba (metronom 3 tempo; tiap tempo menghasilkan satu baris titik ketukan dalam 4 detik) -> Simpulkan
   -> Uji: ketuk drum mengikuti "Gun-dul gun-dul pa-cul cul", lalu grafik ketukan menunjukkan terlalu cepat / pas / terlambat.
   Gagal -> tempo diperlambat; gagal 2x -> contoh dari Nuri. */
(function () {
  var $ = G.$, A = G.audio, T = STR.l3, SUKU = LAGU.irama.suku, NADA = LAGU.irama.nada;
  var salah = 0;

  function mulai() {
    salah = 0;
    var o = T.tebak.opsi;
    G.tebak(2, 0, { tanya: T.tebak.tanya, benar: T.tebak.benar, opsi: [
      [o[0][0], G.ikonKetukan(9)], [o[1][0], G.ikon('snd', 92).replace('class="ik"', 'class="ik ik-besar"')], [o[2][0], G.ikonKetukan(5)]] }, coba);
  }
  mulai.namaLayar = 'l3';
  G.LEVEL[2] = mulai;

  /* timer nyata (tidak dipercepat di mode uji) yang tetap dibatalkan saat pindah layar */
  function tundaNyata(fn, ms) { var c = G.cepat; G.cepat = 1; G.tunda(fn, ms); G.cepat = c; }

  function metronom() {
    return '<svg class="metronom" viewBox="0 0 160 220" width="170" height="234" aria-hidden="true">' +
      '<path d="M40 206 L64 20 H96 L120 206 Z" fill="#a3203c" stroke="#3b1f4a" stroke-width="6" stroke-linejoin="round"/>' +
      '<path d="M58 190 L72 40 H88 L102 190 Z" fill="#fff4dc" stroke="#3b1f4a" stroke-width="4"/>' +
      '<g class="bandul" id="bandul"><path d="M80 182 V52" stroke="#3b1f4a" stroke-width="6" stroke-linecap="round"/><rect x="66" y="80" width="28" height="22" rx="5" fill="#f6c344" stroke="#3b1f4a" stroke-width="4"/></g>' +
      '<circle cx="80" cy="182" r="9" fill="#3b1f4a"/><rect x="30" y="200" width="100" height="14" rx="7" fill="#3b1f4a"/></svg>';
  }

  /* ---------- Coba ---------- */
  function coba() {
    var pilih = 0, dicoba = {}, jalan = false;
    G.layarLab(2, 1, 's', T.coba, G.konsol(STR.lab.alat.metronom,
      '<div class="ketuk-lab">' +
        '<div class="metro-kiri">' + metronom() + '</div>' +
        '<div class="metro-kanan">' +
          '<div class="segmen" role="radiogroup" aria-label="Tempo">' + T.tempo.map(function (t, i) {
            return '<button class="seg" role="radio" data-a="tempo" data-i="' + i + '" aria-checked="' + (i === 0) + '">' + t[0] + '<small>' + t[1] + ' ' + T.perMenit + '</small></button>';
          }).join('') + '</div>' +
          '<div class="strip-wadah" id="strips">' + T.tempo.map(function (t, i) {
            return '<div class="strip" id="strip' + i + '"><span class="strip-nama">' + t[0] + '</span><div class="strip-jalur"></div><span class="strip-n" id="sn' + i + '">?</span></div>';
          }).join('') + '<div class="strip-skala"><span>0</span><span>1</span><span>2</span><span>3</span><span>4 detik</span></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="konsol-bawah"><span class="info-coba" id="infoCoba">' + T.perlu + '</span>' +
        '<button class="btn btn-emas" data-a="putar" id="putar">' + G.ikon('play', 26) + '<span>' + T.putar + '</span></button>' +
        '<button class="btn btn-teal" data-a="keSimpul" id="keSimpul" disabled>' + G.ikon('ok', 26) + '<span>' + STR.lab.simpulkan + '</span></button></div>'));
    G.aksi.tempo = function (el) {
      if (jalan) return;
      pilih = +el.getAttribute('data-i');
      G.$$('.seg').forEach(function (b) { b.setAttribute('aria-checked', +b.getAttribute('data-i') === pilih); });
      G.petunjuk($('#putar'));
    };
    G.aksi.putar = function () {
      if (jalan) return; jalan = true;
      var bpm = T.tempo[pilih][1], ms = 60000 / bpm, n = Math.ceil(4000 / ms), jalur = $('#strip' + pilih + ' .strip-jalur');
      jalur.innerHTML = ''; $('#sn' + pilih).textContent = '?';
      G.$$('.seg, #putar').forEach(function (b) { b.disabled = true; });
      var band = $('#bandul'); band.style.animationDuration = (ms * 2 / 1000) + 's'; band.classList.add('ayun');
      for (var k = 0; k < n; k++) (function (k) {
        tundaNyata(function () {
          A.tik(k % 4 === 0); if (k < NADA.length) A.nyanyi(NADA[k], ms * 0.8 / 1000, 0.08);
          var d = document.createElement('i'); d.style.left = (k * ms / 4000 * 100) + '%'; jalur.appendChild(d);
          $('#sn' + pilih).textContent = k + 1;
        }, 200 + k * ms);
      })(k);
      tundaNyata(function () {
        jalan = false; band.classList.remove('ayun');
        G.$$('.seg, #putar').forEach(function (b) { b.disabled = false; });
        $('#strip' + pilih).classList.add('isi'); dicoba[pilih] = n;
        G.kata(T.dalam(n, T.tempo[pilih][0]));
        if (dicoba[0] && dicoba[2]) {
          var ks = $('#keSimpul');
          $('#infoCoba').textContent = '';
          if (ks.disabled) { ks.disabled = false; G.sorak(); G.tunda(function () { G.kata(T.cukup); }, 1600); G.petunjuk(ks); }
          catatData(dicoba);
        } else {
          var lain = dicoba[0] ? 2 : 0; G.aksi.tempo($('.seg[data-i="' + lain + '"]'));
        }
      }, 200 + n * ms + 300);
    };
    G.aksi.keSimpul = simpulkan;
    G.petunjuk($('#putar'));
    G.test.selesaikan = function () { catatData({ 0: 5, 2: 9 }); simpulkan(); };
  }
  function catatData(d) {
    G.catat(2, 'data', T.tempo.map(function (t, i) { return d[i] ? t[0] + ' ' + d[i] : null; }).filter(Boolean).join(', ') + ' ketukan dalam 4 detik.');
  }

  function simpulkan() {
    G.simpulkan(2, 2, Object.assign({ data: '<div class="data-dua">' + G.ikonKetukan(5) + '<span>Lambat</span>' + G.ikonKetukan(9) + '<span>Cepat</span></div>' }, T.simpul),
      function (c) { salah += c; uji(); });
  }

  /* ---------- Uji: ketuk drum + grafik ketukan ---------- */
  function uji() {
    var bpm = G.O.calm ? 72 : 88, gagal = 0, jalan = false, target = [], kena = [], ketukan = [], tol = 0, msK = 0;
    G.layarLab(2, 3, 's', T.tanya, G.konsol(STR.lab.alat.ujiKetuk,
      '<div class="suku" id="suku">' + SUKU.map(function (s, k) { return '<span id="y' + k + '">' + s + '</span>'; }).join('') +
        '<span class="tahan" id="y7">' + T.tahan + '</span></div>' +
      '<div class="irama-baris">' +
        '<button class="drum" id="drum" data-senyap aria-label="' + T.ketuk + '">' +
          '<svg viewBox="0 0 220 170" width="210" height="162" aria-hidden="true">' +
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
      '<div class="grafik-ketuk" id="grafik" aria-label="' + T.grafik + '"><span class="gk-judul">' + T.grafik + '</span><div class="gk-jalur" id="gkJalur"></div>' +
        '<div class="gk-ket"><i class="gk-c"></i>' + T.ket[0] + '<i class="gk-p"></i>' + T.ket[1] + '<i class="gk-l"></i>' + T.ket[2] + '</div></div>'));

    var drum = $('#drum'), cnt = $('#cnt');
    function pukul(manual) { drum.classList.remove('pukul'); void drum.offsetWidth; drum.classList.add('pukul'); A.drum(manual ? 0.35 : 0.25); }
    function ketuk() {
      pukul(true);
      if (!jalan) return;
      var n = performance.now(); ketukan.push(n);
      for (var k = 0; k < target.length; k++) {
        if (!kena[k] && Math.abs(n - target[k]) <= tol) {
          kena[k] = 1; var y = $('#y' + k); y.classList.add('kena');
          A.nada(A.hz(NADA[k] + 12), 0.15, 0.06, 'sine');
          var p = document.createElement('em'); p.className = 'pas'; p.textContent = T.pas; y.appendChild(p);
          setTimeout(function () { p.remove(); }, 650);
          break;
        }
      }
    }
    drum.addEventListener('pointerdown', function (e) { e.preventDefault(); ketuk(); });
    G.onKey = function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat && document.activeElement === drum) { e.preventDefault(); ketuk(); } };
    drum.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') e.preventDefault(); });

    function putaran(contoh) {
      var ms = 60000 / bpm, mulaiT = performance.now() + 500;
      msK = ms; tol = (G.O.calm ? 260 : 190) + (gagal ? 40 : 0);
      jalan = !contoh; kena = []; target = []; ketukan = [];
      $('#go').disabled = true; $('#contohBtn').hidden = true; G.petunjuk(null); $('#gkJalur').innerHTML = '';
      G.$$('#suku span').forEach(function (s) { s.classList.remove('kena', 'on', 'lewat'); });
      for (var k = 0; k < SUKU.length; k++) target[k] = mulaiT + (k + 4) * ms;
      for (var i = 0; i < 12; i++) (function (i) {
        tundaNyata(function () {
          if (i < 4) { A.tik(i === 0); cnt.textContent = i + 1; cnt.classList.remove('pop'); void cnt.offsetWidth; cnt.classList.add('pop'); return; }
          cnt.textContent = '';
          var k = i - 4, y = $('#y' + k);
          G.$$('#suku span.on').forEach(function (s) { s.classList.remove('on'); s.classList.add('lewat'); });
          if (y) y.classList.add('on');
          A.tik(k % 4 === 0);
          if (k < SUKU.length) A.nyanyi(NADA[k], k === 6 ? ms * 1.9 / 1000 : ms * 0.85 / 1000, 0.08);
          if (contoh && k < SUKU.length) { pukul(false); y.classList.add('kena'); ketukan.push(target[k]); }
          if (i === 4 && !contoh) drum.focus({ preventScroll: true });
        }, 500 + i * ms);
      })(i);
      tundaNyata(function () { selesai(contoh); }, 500 + 12 * ms + tol);
    }

    /* Grafik: garis = ketukan lagu, titik = ketukanmu. Mengembalikan arah kesalahan terbanyak. */
    function grafik() {
      var j = $('#gkJalur'), awal = target[0] - msK * 0.6, rentang = target[6] - target[0] + msK * 1.2, cepat = 0, lambat = 0;
      var x = function (t) { return Math.max(0, Math.min(100, (t - awal) / rentang * 100)); };
      j.innerHTML = target.map(function (t, k) { return '<b style="left:' + x(t) + '%"><small>' + SUKU[k] + '</small></b>'; }).join('');
      ketukan.forEach(function (t) {
        var k = 0; for (var i = 1; i < target.length; i++) if (Math.abs(t - target[i]) < Math.abs(t - target[k])) k = i;
        var e = t - target[k], jenis = Math.abs(e) <= tol ? 'p' : e < 0 ? 'c' : 'l';
        if (jenis === 'c') cepat++; if (jenis === 'l') lambat++;
        var d = document.createElement('i'); d.className = 'gk-' + jenis; d.style.left = x(t) + '%'; j.appendChild(d);
      });
      return cepat > lambat ? 'c' : lambat > cepat ? 'l' : '';
    }

    function selesai(contoh) {
      jalan = false; G.$$('#suku span').forEach(function (s) { s.classList.remove('on'); });
      var arah = grafik(), go = $('#go'); go.disabled = false;
      if (contoh) { G.kata(T.tanya); go.querySelector('span').textContent = T.lagi; G.petunjuk(go); return; }
      var h = kena.filter(Boolean).length, n = SUKU.length;
      if (h >= 5) {
        A.benar(); G.sorak(); G.kata(T.hasil(h, n)); G.catat(2, 'uji', T.hasil(h, n));
        G.tunda(function () { G.hasil(2, h >= 7 ? 3 : h >= 6 ? 2 : 1, T.selesai, salah); }, 2200);
        return;
      }
      gagal++; salah += n - h; A.salah(); G.bingung();
      bpm = Math.max(60, bpm - 10);
      go.querySelector('span').textContent = T.lagi;
      var saran = arah === 'c' ? T.cepat : arah === 'l' ? T.lambat : '';
      if (gagal >= 2) { G.kata(T.hasil(h, n) + ' ' + (saran || T.kurang2)); var c = $('#contohBtn'); c.hidden = false; G.petunjuk(c); }
      else { G.kata(T.hasil(h, n) + ' ' + (saran || T.kurang)); G.petunjuk(go); }
    }

    G.aksi.go = function () { G.kata(T.siap); putaran(false); };
    G.aksi.contoh = function () { G.kata(T.contohJalan); putaran(true); };
    G.petunjuk($('#go'));
    G.test.selesaikan = function () {
      var ms = 60000 / bpm, t0 = performance.now(); G.bersihkanTimer(); msK = ms; tol = 190;
      target = SUKU.map(function (_, k) { return t0 + k * ms; }); ketukan = target.slice(); kena = SUKU.map(function () { return 1; });
      jalan = false; selesai(false);
    };
  }
})();
