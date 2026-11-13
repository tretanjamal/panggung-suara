/* UI: ikon SVG, pindah layar bertirai, HUD, Nuri, balon kata, modal, partikel, tangan penunjuk. */
(function () {
  var $ = G.$, A = G.audio;

  /* ---------- Gambar ---------- */
  var IMG = 'assets/img/';
  G.IM = {
    nuri: { s: IMG + 'nuri-senang.webp', p: IMG + 'nuri-berpikir.webp', b: IMG + 'nuri-bangga.webp', n: IMG + 'nuri-ngantuk.webp' },
    latar: IMG + 'latar-panggung.webp', malam: IMG + 'latar-malam.webp', key: IMG + 'key-art.webp',
    penonton: IMG + 'penonton.webp', piala: IMG + 'piala-bintang.webp', bingkai: IMG + 'sertifikat-bingkai.webp',
    gulungan: IMG + 'gulungan-lirik.webp', poster: IMG + 'poster-konser.webp', mik: IMG + 'props-mikrofon.webp',
    jam: IMG + 'foto-jamaluddin.webp', ig: IMG + 'ikon-instagram.webp', sri: IMG + 'foto-sri-anita.webp',
    ikon: function (i) { return IMG + 'ikon-level-' + (i + 1) + '.webp'; },
    lencana: function (i) { return IMG + 'lencana-' + (i + 1) + '.webp'; },
    mulut: function (v) { return IMG + 'mulut-' + v + '.webp'; },
    suasana: function (g) { return IMG + 'suasana-' + g + '.webp'; }
  };
  /* Pramuat agar pergantian ekspresi Nuri tidak berkedip. */
  G.pramuat = function () {
    var L = [G.IM.latar, G.IM.malam, G.IM.penonton, G.IM.piala, G.IM.nuri.s, G.IM.nuri.p, G.IM.nuri.b, G.IM.nuri.n];
    for (var i = 0; i < 5; i++) L.push(G.IM.ikon(i), G.IM.lencana(i));
    L.forEach(function (u) { var im = new Image(); im.src = u; });
  };

  /* ---------- Ikon garis (stroke) ---------- */
  var IK = {
    mail: '<path d="M3 6h18v12H3zM3 7l9 7 9-7"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
    sch: '<path d="M3 10l9-6 9 6v10H3zM9 20v-6h6v6"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    tr: '<path d="M7 4h10v5a5 5 0 01-10 0zM7 6H3v2a4 4 0 004 4M17 6h4v2a4 4 0 01-4 4M12 14v4M8 20h8"/>',
    ai: '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
    bk: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19a2 2 0 012-2h13"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    kiri: '<path d="M15 5l-7 7 7 7"/>', kanan: '<path d="M9 5l7 7-7 7"/>',
    ok: '<path d="M5 13l4 4L19 7"/>',
    us: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    play: '<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1A1.7 1.7 0 009 19.4a1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    snd: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/>',
    mute: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
    ulang: '<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4.5h4.5"/>',
    home: '<path d="M3 11l9-7 9 7M5 9.5V20h5v-6h4v6h5V9.5"/>',
    print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
    img: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-6-6-9 9"/>',
    papan: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.5h6V4M8.5 10h7M8.5 14h7M8.5 18h4"/>',
    telinga: '<path d="M7 9a5 5 0 0110 0c0 3-3 4-3 7a3 3 0 01-5 1"/><path d="M10 9a2 2 0 014 0"/>',
    not: '<path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    medal: '<circle cx="12" cy="14" r="6"/><path d="M8.5 9L6 3h4l2 4 2-4h4l-2.5 6"/>'
  };
  G.ikon = function (n, w, warna) {
    return '<svg class="ik" width="' + (w || 28) + '" height="' + (w || 28) + '" viewBox="0 0 24 24" fill="none" stroke="' + (warna || 'currentColor') +
      '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IK[n] + '</svg>';
  };
  G.bintang = function (on, w) {
    return '<svg class="bt' + (on ? ' on' : '') + '" width="' + (w || 30) + '" height="' + (w || 30) + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.5l-6 3.3 1.3-6.7-5-4.7 6.8-.8z"/></svg>';
  };
  G.bintang3 = function (n, w) { var s = ''; for (var i = 1; i <= 3; i++) s += G.bintang(n >= i, w); return '<span class="bt3" aria-label="' + n + ' dari 3 bintang">' + s + '</span>'; };

  /* ---------- Aksi tombol (delegasi) ---------- */
  G.aksi = {};
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-a]');
    if (!el || el.disabled) return;
    var fn = G.aksi[el.getAttribute('data-a')];
    if (fn) fn(el, e);
  });
  document.addEventListener('pointerdown', function (e) {
    A.buka();
    var b = e.target.closest('.btn');
    if (b && !b.disabled && !b.hasAttribute('data-senyap')) A.klik();
  });

  /* Keyboard: Esc menutup modal, aksi khusus layar lewat G.onKey. */
  G.onKey = null; G.onKeyUp = null;
  document.addEventListener('keydown', function (e) {
    A.buka();
    if (e.key === 'Escape' && $('#m').classList.contains('on')) { G.tutupModal(); return; }
    if (G.onKey && !$('#m').classList.contains('on')) G.onKey(e);
  });
  document.addEventListener('keyup', function (e) { if (G.onKeyUp) G.onKeyUp(e); });

  /* ---------- Pindah layar ---------- */
  var sibuk = 0;
  G.ke = function (fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    G.bersihkanTimer(); G.tutupModal(); G.petunjuk(null);
    G.onKey = G.onKeyUp = null;
    var jalan = function () {
      G.aksi = {}; G.test.selesaikan = null;
      fn.apply(null, args);
      G.layarAktif = fn.namaLayar || '';
      $('#v').scrollTop = 0;
      var f = $('#v [autofocus]') || $('#v .btn:not([disabled])');
      if (f && G.pakaiKeyboard) f.focus({ preventScroll: true });
    };
    if (G.O.ro || G.TEST || !G.siap) { jalan(); return; }
    var t = $('#tirai'), id = ++sibuk;
    t.className = 'tutup';
    setTimeout(function () { if (id !== sibuk) return; jalan(); t.className = 'buka'; }, 190);
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Tab') G.pakaiKeyboard = true; });
  document.addEventListener('pointerdown', function () { G.pakaiKeyboard = false; });

  /* Tulis isi layar. latar: 'latar' | 'malam' | 'key'. */
  G.layar = function (html, latar) {
    var g = $('#g');
    g.setAttribute('data-latar', latar || 'latar');
    $('#v').innerHTML = html;
  };

  /* HUD atas untuk latihan: tombol kembali, judul, titik kemajuan, bintang terbaik, tombol suara. */
  G.hud = function (lv, langkah, total) {
    var dots = '';
    if (total) for (var i = 0; i < total; i++) dots += '<i class="' + (i < langkah ? 'ok' : i === langkah ? 'kini' : '') + '"></i>';
    G.aksi.keMenu = function () { G.ke(G.layarMenu); };
    return '<header class="hud">' +
      '<button class="btn btn-teal btn-kecil" data-a="keMenu" aria-label="Kembali ke menu latihan">' + G.ikon('kiri', 26) + '<span>' + STR.menu + '</span></button>' +
      '<div class="hud-judul"><img src="' + G.IM.ikon(lv) + '" alt=""><span>' + (lv + 1) + ' · ' + STR.level[lv].nama + '</span></div>' +
      '<div class="hud-dot" aria-label="Kemajuan">' + dots + '</div>' +
      '<div class="hud-bt">' + G.bintang3(G.P.s[lv], 28) + '</div>' +
      G.tombolSuara() + '</header>';
  };
  G.tombolSuara = function () {
    G.aksi.suara = function (el) {
      G.O.snd = G.O.snd ? 0 : 1; G.simpan();
      if (!G.O.snd) A.semuaDiam(); else A.musik(G.dalamMenu ? 0.22 : 0);
      el.innerHTML = G.ikon(G.O.snd ? 'snd' : 'mute', 30); el.setAttribute('aria-pressed', !G.O.snd);
    };
    return '<button class="btn btn-ikon" data-a="suara" aria-label="Bunyi nyala/mati" aria-pressed="' + !G.O.snd + '">' + G.ikon(G.O.snd ? 'snd' : 'mute', 30) + '</button>';
  };

  /* ---------- Nuri ---------- */
  var moodAsal = 's', moodId = 0;
  G.nuri = function (m, lebar, kelas) {
    moodAsal = m || 's';
    return '<div class="nuri ' + (kelas || '') + '" id="nuri" style="width:' + (lebar || 250) + 'px"><img src="' + G.IM.nuri[moodAsal] + '" alt="Nuri si burung nuri" draggable="false"></div>';
  };
  G.nuriEkspresi = function (m, lama, kelas) {
    var n = $('#nuri'); if (!n) return;
    var im = n.querySelector('img'), id = ++moodId;
    im.src = G.IM.nuri[m];
    n.classList.remove('sorak', 'bingung'); void n.offsetWidth;
    if (kelas) n.classList.add(kelas);
    if (lama) setTimeout(function () { if (id !== moodId || !$('#nuri')) return; im.src = G.IM.nuri[moodAsal]; n.classList.remove('sorak', 'bingung'); }, lama);
  };
  G.sorak = function () { G.nuriEkspresi('b', 1300, 'sorak'); };
  G.bingung = function () { G.nuriEkspresi('p', 1500, 'bingung'); };

  /* Balon kata Nuri (dibacakan pembaca layar lewat aria-live). */
  G.balon = function (t, ekor) { return '<div class="bub' + (ekor === false ? ' tanpa-ekor' : '') + '" id="bub" role="status" aria-live="polite">' + t + '</div>'; };
  G.kata = function (t) {
    var b = $('#bub'); if (!b) return;
    b.textContent = t; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  };

  /* ---------- Umpan balik ---------- */
  G.goyang = function (el) { if (!el) return; el.classList.remove('goyang'); void el.offsetWidth; el.classList.add('goyang'); };
  G.partikel = function (el, n) {
    if (!el || G.O.ro) return;
    var g = $('#g').getBoundingClientRect(), r = el.getBoundingClientRect(), f = G.skala || 1;
    var cx = (r.left + r.width / 2 - g.left) / f, cy = (r.top + r.height / 2 - g.top) / f;
    var warna = ['#f6c344', '#2fa36b', '#1d9bb0', '#f08a24', '#c23a52', '#b6ea72'];
    for (var i = 0; i < (n || 14); i++) {
      var p = document.createElement('i'), a = Math.PI * 2 * i / (n || 14) + Math.random() * 0.5, d = 70 + Math.random() * 70;
      p.className = 'pt' + (i % 3 === 0 ? ' pt-not' : '');
      p.style.cssText = 'left:' + cx + 'px;top:' + cy + 'px;--dx:' + Math.cos(a) * d + 'px;--dy:' + (Math.sin(a) * d - 30) + 'px;--w:' + warna[i % warna.length];
      $('#fx').appendChild(p);
      setTimeout(function (x) { x.remove(); }.bind(null, p), 900);
    }
  };
  G.konfeti = function () {
    if (G.O.ro) return;
    var warna = ['#f6c344', '#2fa36b', '#1d9bb0', '#f08a24', '#c23a52', '#fff4dc'];
    for (var i = 0; i < 46; i++) {
      var p = document.createElement('i');
      p.className = 'kf';
      p.style.cssText = 'left:' + (Math.random() * 1280) + 'px;--w:' + warna[i % warna.length] + ';--t:' + (1.6 + Math.random() * 1.4) + 's;--d:' + (Math.random() * 0.6) + 's;--r:' + (Math.random() * 720 - 360) + 'deg';
      $('#fx').appendChild(p);
      setTimeout(function (x) { x.remove(); }.bind(null, p), 3800);
    }
  };

  /* ---------- Tangan penunjuk: muncul bila 8 detik tanpa aksi ---------- */
  var target = null, idleId = 0;
  function jadwal() {
    clearTimeout(idleId); $('#tangan').classList.remove('on');
    if (target && !G.TEST) idleId = setTimeout(tunjuk, 8000);
  }
  function tunjuk() {
    if (!target || !document.body.contains(target) || target.disabled || $('#m').classList.contains('on')) return;
    var g = $('#g').getBoundingClientRect(), r = target.getBoundingClientRect(), f = G.skala || 1, h = $('#tangan');
    h.style.left = ((r.left + r.width * 0.6 - g.left) / f) + 'px';
    h.style.top = ((r.top + r.height * 0.55 - g.top) / f) + 'px';
    h.classList.add('on');
  }
  G.petunjuk = function (el) { target = el; jadwal(); };
  G.tunjukSekarang = function (el) { target = el; clearTimeout(idleId); tunjuk(); };
  ['pointerdown', 'keydown'].forEach(function (t) { document.addEventListener(t, jadwal, true); });

  /* ---------- Modal ---------- */
  var fokusLama = null;
  G.modal = function (judul, ikon, isi, lebar) {
    fokusLama = document.activeElement;
    G.aksi.tutup = G.tutupModal;
    var m = $('#m');
    m.innerHTML = '<div class="card" role="dialog" aria-modal="true" aria-label="' + G.esc(judul) + '" style="width:' + (lebar || 980) + 'px">' +
      '<div class="ch">' + G.ikon(ikon, 34, '#fff') + '<h2>' + judul + '</h2><button class="btn btn-ikon btn-tutup" data-a="tutup" aria-label="' + STR.tutup + '">' + G.ikon('x', 30) + '</button></div>' +
      '<div class="bd">' + isi + '</div></div>';
    m.classList.add('on');
    var b = m.querySelector('.btn-tutup'); b && b.focus({ preventScroll: true });
  };
  G.tutupModal = function () {
    var m = $('#m'); if (!m || !m.classList.contains('on')) return;
    m.classList.remove('on'); m.innerHTML = '';
    if (fokusLama && document.body.contains(fokusLama)) fokusLama.focus({ preventScroll: true });
  };
  /* Klik di luar kartu menutup modal; Tab tetap di dalam modal. */
  document.addEventListener('click', function (e) { if (e.target.id === 'm') G.tutupModal(); });
  document.addEventListener('keydown', function (e) {
    var m = $('#m'); if (e.key !== 'Tab' || !m.classList.contains('on')) return;
    var f = G.$$('button,input,[tabindex]', m).filter(function (x) { return !x.disabled; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  /* Kait uji untuk bot QA (hanya aktif dengan ?test=1). */
  G.test = { selesaikan: null };
})();
