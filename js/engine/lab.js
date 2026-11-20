/* Lab: komponen percobaan yang dipakai ulang di semua latihan.
   - Layar Suara: osiloskop yang menggambar bunyi asli dari WebAudio (atau mikrofon, bila murid menyalakannya).
   - Tahapan lab (Tebak, Coba, Simpulkan, Uji) di HUD.
   - Layar Tebak dan Simpulkan dengan petunjuk bertingkat.
   - Jurnal Lab: tebakan, data, dan temuan tiap latihan (tersimpan di perangkat, tanpa data pribadi). */
(function () {
  var $ = G.$, A = G.audio;

  /* ---------- Layar Suara ---------- */
  G.layarSuara = function (id, lebar, tinggi, label) {
    return '<figure class="layar-suara" style="width:' + lebar + 'px">' +
      '<div class="ls-kaca" style="height:' + tinggi + 'px"><canvas id="' + id + '" width="' + (lebar - 8) + '" height="' + (tinggi - 8) + '" aria-hidden="true"></canvas>' +
      '<span class="ls-mik" id="' + id + 'Mik" hidden>' + G.ikon('mic', 20) + STR.lab.mikAktif + '</span></div>' +
      '<figcaption>' + G.ikon('snd', 22) + '<span id="' + id + 'Ket">' + (label || STR.lab.layar) + '</span></figcaption></figure>';
  };

  var buf = new Float32Array(2048), aktif = null, rafId = 0;
  G.scope = {
    rms: 0,
    /* opsi: gain (perbesaran tinggi gelombang), sampel (lebar jendela waktu) */
    pasang: function (id, opsi) {
      var c = $('#' + id); if (!c) return;
      aktif = { c: c, x: c.getContext('2d'), gain: (opsi && opsi.gain) || 3, n: (opsi && opsi.sampel) || 640, id: id };
      cancelAnimationFrame(rafId); rafId = requestAnimationFrame(gambar);   /* satu loop saja */
    },
    /* Potret gelombang saat ini (untuk dibandingkan berdampingan). */
    potret: function () { var an = sumber(); if (!an) return null; an.getFloatTimeDomainData(buf); var i = picu(buf, aktif ? aktif.n : 640); return Array.prototype.slice.call(buf, i, i + (aktif ? aktif.n : 640)); },
    lepas: function () { aktif = null; }
  };
  function sumber() { return A.mikAktif() || A.penganalisis(); }
  /* Titik picu: awal gelombang naik melewati nol, supaya gambar diam dan mudah diamati. */
  function picu(d, n) { for (var i = 1; i < d.length - n; i++) if (d[i - 1] < 0 && d[i] >= 0) return i; return 0; }
  function garis(x, d, w, h, gain, warna, tebal) {
    x.beginPath();
    for (var i = 0; i < d.length; i++) {
      var px = i / (d.length - 1) * w, py = h / 2 - Math.max(-1, Math.min(1, d[i] * gain)) * (h / 2 - 6);
      if (i) x.lineTo(px, py); else x.moveTo(px, py);
    }
    x.strokeStyle = warna; x.lineWidth = tebal; x.lineJoin = 'round'; x.stroke();
  }
  function gambar() {
    var s = aktif; if (!s) return;
    if (!document.body.contains(s.c)) { aktif = null; return; }
    var w = s.c.width, h = s.c.height, x = s.x, an = sumber(), d;
    x.clearRect(0, 0, w, h);
    if (an) {
      an.getFloatTimeDomainData(buf);
      var i0 = picu(buf, s.n), sum = 0;
      d = buf.subarray(i0, i0 + s.n);
      for (var k = 0; k < d.length; k++) sum += d[k] * d[k];
      G.scope.rms = Math.sqrt(sum / d.length);
    } else { d = new Float32Array(s.n); G.scope.rms = 0; }
    var gain = A.mikAktif() ? s.gain * 2.5 : s.gain;
    garis(x, d, w, h, gain, '#7ff0d855', 9);
    garis(x, d, w, h, gain, '#c9fff2', 3.5);
    var m = $('#' + s.id + 'Mik'); if (m) m.hidden = !A.mikAktif();
    rafId = requestAnimationFrame(gambar);
  }
  /* Gambar gelombang beku pada kanvas kecil (perbandingan). */
  G.jejak = function (id, data, gain) {
    var c = $('#' + id); if (!c) return;
    var x = c.getContext('2d'); x.clearRect(0, 0, c.width, c.height);
    if (!data) return;
    garis(x, data, c.width, c.height, gain || 3, '#f6c34466', 8);
    garis(x, data, c.width, c.height, gain || 3, '#ffe9a8', 3);
  };

  /* Jejak nada yang pasti benar: sinus dengan frekuensi nada sebenarnya, pada jendela waktu yang sama dengan Layar Suara. */
  G.jejakNada = function (id, midi, gain) {
    var n = 640, f = A.hz(midi), sr = A.laju(), d = [];
    for (var i = 0; i < n; i++) d.push(0.3 * Math.sin(2 * Math.PI * f * i / sr));
    G.jejak(id, d, gain || 2.6);
  };

  /* Ikon gelombang kecil untuk kartu tebakan (tanpa membaca pun bisa dipahami). */
  G.ikonGelombang = function (jenis) {
    var p = { renggang: [3, 14], rapat: [8, 14], tinggi: [4, 26], rendah: [4, 7], sama: [4, 14], jarang: [3, 14] }[jenis] || [4, 14];
    var d = 'M4 40';
    for (var i = 1; i <= 96; i++) { var t = i / 96; d += ' L' + (4 + t * 152).toFixed(1) + ' ' + (40 - Math.sin(t * Math.PI * 2 * p[0]) * p[1]).toFixed(1); }
    return '<svg class="ik-gel" viewBox="0 0 160 80" width="160" height="80" aria-hidden="true"><rect x="1" y="1" width="158" height="78" rx="14" fill="#12202a"/>' +
      '<path d="M4 40H156" stroke="#1d9bb055" stroke-width="2"/><path d="' + d + '" fill="none" stroke="#7ff0d8" stroke-width="4" stroke-linejoin="round"/></svg>';
  };
  G.ikonKetukan = function (n) {
    var s = '<svg class="ik-gel" viewBox="0 0 160 80" width="160" height="80" aria-hidden="true"><rect x="1" y="1" width="158" height="78" rx="14" fill="#12202a"/><path d="M12 56H148" stroke="#1d9bb0" stroke-width="3"/>';
    for (var i = 0; i < n; i++) s += '<circle cx="' + (20 + i * (120 / Math.max(1, n - 1))) + '" cy="40" r="' + (n > 6 ? 7 : 9) + '" fill="#f6c344"/>';
    return s + '</svg>';
  };

  /* ---------- Tahapan lab di HUD ---------- */
  G.hudLab = function (lv, tahap) {
    var nama = STR.lab.tahap[lv];
    G.aksi.keMenu = function () { G.ke(G.layarMenu); };
    return '<header class="hud">' +
      '<button class="btn btn-teal btn-kecil" data-a="keMenu" aria-label="Kembali ke menu latihan">' + G.ikon('kiri', 26) + '<span>' + STR.menu + '</span></button>' +
      '<div class="hud-judul"><img src="' + G.IM.ikon(lv) + '" alt=""><span>' + STR.level[lv].nama + '</span></div>' +
      '<ol class="tahap" aria-label="Tahap percobaan">' + nama.map(function (t, i) {
        return '<li class="' + (i < tahap ? 'ok' : i === tahap ? 'kini' : '') + '"' + (i === tahap ? ' aria-current="step"' : '') + '>' +
          (i < tahap ? G.ikon('ok', 18) : '<i>' + (i + 1) + '</i>') + '<span>' + t + '</span></li>';
      }).join('') + '</ol>' +
      '<div class="hud-bt">' + G.bintang3(G.P.s[lv], 26) + '</div>' +
      G.tombolSuara() + '</header>';
  };

  /* Pindahkan penanda tahap tanpa menggambar ulang layar. */
  G.tahap = function (t) {
    G.$$('.tahap li').forEach(function (li, i) {
      li.className = i < t ? 'ok' : i === t ? 'kini' : '';
      if (i === t) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      var nomor = li.querySelector('i');
      if (i < t && nomor) nomor.outerHTML = G.ikon('ok', 18);
    });
  };

  /* Kerangka layar lab: Nuri di kiri, balon kata di atas, konsol di tengah. */
  G.layarLab = function (lv, tahap, mood, kata, isi, latar) {
    G.layar(G.hudLab(lv, tahap) +
      '<div class="lab">' +
        '<div class="lab-nuri">' + G.nuri(mood || 's', 200) + '</div>' +
        '<div class="lab-kanan"><div class="bub-baris">' + G.balon(kata) +
          '<button class="btn btn-ikon btn-baca" data-a="baca" aria-label="' + STR.lab.baca + '">' + G.ikon('snd', 28) + '</button></div>' + isi + '</div>' +
      '</div>', latar || 'latar');
    G.aksi.baca = G.bacakan;
  };
  G.konsol = function (judul, isi, kelas) {
    return '<section class="konsol ' + (kelas || '') + '"><span class="konsol-tab">' + G.ikon('not', 18) + judul + '</span>' + isi + '</section>';
  };

  /* ---------- Jurnal Lab ---------- */
  G.catat = function (lv, k, v) { G.P.jurnal[lv] = G.P.jurnal[lv] || {}; G.P.jurnal[lv][k] = v; G.simpan(); };

  function ikonOpsi(k) { return !k ? '' : k.charAt(0) === '<' ? k : G.ikonGelombang(k); }

  /* ---------- Tebak (hipotesis): semua jawaban diterima dan dicatat ---------- */
  G.tebak = function (lv, tahap, soal, lanjut) {
    var urut = G.acak(soal.opsi.map(function (_, i) { return i; }));
    G.layarLab(lv, tahap, 'p', '<b>' + STR.lab.tebakJudul + '</b> ' + soal.tanya,
      G.konsol(STR.lab.hipotesis, '<div class="opsi-lab">' + urut.map(function (i) {
        var o = soal.opsi[i];
        return '<button class="kartu kartu-lab" data-a="tebak" data-i="' + i + '">' + ikonOpsi(o[1]) + '<span>' + o[0] + '</span></button>';
      }).join('') + '</div>' + (soal.bawah || ''), 'ringkas'));
    G.aksi.tebak = function (el) {
      var i = +el.getAttribute('data-i');
      G.$$('.kartu-lab').forEach(function (b) { b.disabled = true; });
      el.classList.add('dipilih'); A.catat();
      G.catat(lv, 'tebak', soal.opsi[i][0]); G.catat(lv, 'tebakBenar', i === soal.benar);
      G.kata(STR.lab.tebakDicatat);
      G.tunda(lanjut, 1500);
    };
    G.petunjuk($('.kartu-lab'));
    G.test.selesaikan = function () { G.aksi.tebak($('.kartu-lab[data-i="' + soal.benar + '"]')); };
    if (soal.saatTampil) soal.saatTampil();
  };

  /* ---------- Simpulkan: harus tepat, dengan petunjuk bertingkat ---------- */
  G.simpulkan = function (lv, tahap, soal, lanjut) {
    var urut = G.acak(soal.opsi.map(function (_, i) { return i; })), coba = 0;
    G.layarLab(lv, tahap, 'p', '<b>' + STR.lab.simpulJudul + '</b> ' + soal.tanya,
      G.konsol(STR.lab.kesimpulan, (soal.data ? '<div class="data-lab" id="dataLab">' + soal.data + '</div>' : '') +
        '<div class="opsi-lab">' + urut.map(function (i) {
          var o = soal.opsi[i];
          return '<button class="kartu kartu-lab" data-a="simpul" data-i="' + i + '">' + ikonOpsi(o[1]) + '<span>' + o[0] + '</span></button>';
        }).join('') + '</div>', 'ringkas'));
    G.aksi.simpul = function (el) {
      var i = +el.getAttribute('data-i');
      if (i === soal.benar) {
        G.$$('.kartu-lab').forEach(function (b) { b.disabled = true; });
        el.classList.add('benar'); A.benar(); G.sorak(); G.partikel(el);
        var tb = G.P.jurnal[lv] && G.P.jurnal[lv].tebakBenar;
        if (soal.catat === false) G.kata(soal.pujian);
        else { G.kata(soal.pujian + ' ' + (tb ? STR.lab.tebakanCocok : STR.lab.tebakanBeda)); G.catat(lv, 'temuan', soal.opsi[i][0]); }
        G.tunda(function () { lanjut(coba); }, 2300);
        return;
      }
      coba++; A.salah(); G.goyang(el); G.bingung(); el.disabled = true;
      /* salah ke-1: alasan spesifik + sorot data; ke-2: sorot jawaban yang tepat */
      G.kata(soal.opsi[i][2] || STR.lab.lihatData);
      var d = $('#dataLab'); if (d) d.classList.add('sorot');
      if (coba >= 2) { var b = $('.kartu-lab[data-i="' + soal.benar + '"]'); b.classList.add('sorot'); G.tunjukSekarang(b); }
    };
    G.petunjuk($('.kartu-lab'));
    G.test.selesaikan = function () { G.aksi.simpul($('.kartu-lab[data-i="' + soal.benar + '"]')); };
  };

  /* ---------- Bacakan: suara bawaan perangkat berbahasa Indonesia (lokal saja, tanpa internet) ---------- */
  var suaraId = null;
  function cariSuara() {
    try {
      var v = speechSynthesis.getVoices().filter(function (x) { return /^id/i.test(x.lang) && x.localService; });
      suaraId = v[0] || null;
    } catch (e) { suaraId = null; }
    document.documentElement.classList.toggle('tts', !!suaraId);
  }
  if (window.speechSynthesis) { cariSuara(); try { speechSynthesis.addEventListener('voiceschanged', cariSuara); } catch (e) { } }
  G.bacakan = function () {
    if (!suaraId) return;
    try {
      speechSynthesis.cancel();
      var b = $('#bub'), teks = [b ? b.textContent : ''].concat(G.$$('.kartu-lab span, .kartu-baris span').map(function (e) { return e.textContent; }));
      var u = new SpeechSynthesisUtterance(teks.join('. ')); u.voice = suaraId; u.lang = suaraId.lang; u.rate = 0.9;
      speechSynthesis.speak(u);
    } catch (e) { }
  };
  G.diamBaca = function () { try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { } };

  /* ---------- Bentuk mulut manusia (SVG): bibir bulat-maju untuk u, lebar untuk i, dst. ---------- */
  var MULUT = { a: [44, 36, 0], i: [56, 10, 1], u: [17, 17, 0], e: [48, 20, 1], o: [30, 30, 0] };
  G.mulutSVG = function (v, w) {
    var m = MULUT[v], rx = m[0], ry = m[1], tebal = v === 'u' ? 16 : v === 'o' ? 12 : 10, id = 'km' + v + (w || 0);
    return '<svg class="mulut-svg" viewBox="0 0 160 120" width="' + (w || 150) + '" height="' + Math.round((w || 150) * 0.75) + '" aria-hidden="true">' +
      '<rect x="4" y="4" width="152" height="112" rx="26" fill="#f0b27a"/>' +
      '<ellipse cx="44" cy="20" rx="14" ry="5" fill="#e09a66" opacity=".5"/><ellipse cx="116" cy="20" rx="14" ry="5" fill="#e09a66" opacity=".5"/>' +
      (v === 'u' ? '<ellipse cx="80" cy="62" rx="' + (rx + tebal + 6) + '" ry="' + (ry + tebal + 6) + '" fill="#d77a5a" opacity=".45"/>' : '') +
      '<ellipse cx="80" cy="62" rx="' + (rx + tebal) + '" ry="' + (ry + tebal * 0.9) + '" fill="#c9525f" stroke="#3b1f4a" stroke-width="4"/>' +
      '<defs><clipPath id="' + id + '"><ellipse cx="80" cy="62" rx="' + rx + '" ry="' + ry + '"/></clipPath></defs>' +
      '<ellipse cx="80" cy="62" rx="' + rx + '" ry="' + ry + '" fill="#5a1f2b"/>' +
      '<g clip-path="url(#' + id + ')">' + (m[2] ? '<rect x="0" y="' + (62 - ry) + '" width="160" height="' + Math.max(6, ry * 0.7) + '" fill="#fff"/>' : '<rect x="0" y="' + (62 - ry) + '" width="160" height="' + Math.max(4, ry * 0.28) + '" fill="#fff"/>') +
        '<ellipse cx="80" cy="' + (62 + ry * 0.7) + '" rx="' + rx * 0.6 + '" ry="' + Math.max(4, ry * 0.45) + '" fill="#d9707e"/></g>' +
      '</svg>';
  };

  /* ---------- Tombol mikrofon opsional ---------- */
  G.tombolMik = function () {
    if (!A.adaMik()) return '';
    G.aksi.mik = function (el) {
      if (A.mikAktif()) { A.mikMati(); el.classList.remove('nyala'); el.querySelector('span').textContent = STR.lab.mikPakai; G.kata(STR.lab.mikMati); return; }
      el.disabled = true;
      A.mikNyala(function (an) {
        el.disabled = false;
        if (!an) { G.kata(STR.lab.mikGagal); return; }
        el.classList.add('nyala'); el.querySelector('span').textContent = STR.lab.mikStop; G.kata(STR.lab.mikAjak);
      });
    };
    return '<button class="btn btn-ungu btn-kecil" data-a="mik">' + G.ikon('mic', 24) + '<span>' + STR.lab.mikPakai + '</span></button>';
  };

  /* ---------- Jurnal Lab (modal) ---------- */
  G.jurnalModal = function () {
    var isi = STR.level.map(function (L, i) {
      var j = G.P.jurnal[i] || {};
      var baris = function (k, label) { return '<div class="jr-b"><small>' + label + '</small><span>' + (j[k] ? G.esc(j[k]) : '<i class="redup">' + STR.lab.belumAda + '</i>') + '</span></div>'; };
      return '<article class="jr' + (j.temuan ? ' isi' : '') + '"><h4><img src="' + G.IM.ikon(i) + '" alt="">' + (i + 1) + '. ' + L.nama + '</h4>' +
        (i < 4 ? baris('tebak', STR.lab.jTebak) : '') + baris('data', STR.lab.jData) + baris('temuan', STR.lab.jTemuan) + '</article>';
    }).join('');
    G.modal(STR.lab.jurnal, 'bk', '<p class="pengantar">' + STR.lab.jurnalPengantar + '</p><div class="jr-grid">' + isi + '</div>', 1120);
  };
})();
