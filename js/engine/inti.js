/* Inti: utilitas, skala kanvas 1280x720, simpan progres, dan pengaturan. */
var G = window.G = {};
(function () {
  var q = location.search;
  G.TEST = /[?&]test=1\b/.test(q);
  G.cepat = G.TEST ? 0.05 : 1;            /* bot QA: jeda dipercepat */

  G.$ = function (s, r) { return (r || document).querySelector(s); };
  G.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  G.acak = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.random() * (i + 1) | 0, t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  G.pilih = function (a) { return a[Math.random() * a.length | 0]; };
  G.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* Pengatur waktu yang dibatalkan otomatis saat pindah layar (mencegah sisa timer). */
  var timers = [];
  G.tunda = function (fn, ms) { var id = setTimeout(function () { timers.splice(timers.indexOf(id), 1); fn(); }, ms * G.cepat); timers.push(id); return id; };
  G.bersihkanTimer = function () { timers.forEach(clearTimeout); timers = []; };

  /* ---------- Skala letterbox ---------- */
  G.fit = function () {
    var f = Math.min(innerWidth / 1280, innerHeight / 720);
    G.$('#g').style.setProperty('--f', f);
    G.skala = f;
    G.$('#rot').classList.toggle('on', innerHeight > innerWidth && innerWidth < 900);
  };

  /* ---------- Simpan ---------- */
  var KUNCI = 'panggung-suara-v3', KUNCI_SET = 'panggung-suara-set';
  function baca(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  G.simpan = function () {
    try { localStorage.setItem(KUNCI, JSON.stringify(G.P)); localStorage.setItem(KUNCI_SET, JSON.stringify(G.O)); } catch (e) { /* penyimpanan diblokir: gim tetap jalan */ }
  };
  G.P = baca(KUNCI);
  if (!G.P) {
    var lama = baca('ps1');                 /* migrasi progres v2 */
    G.P = { s: (lama && lama.s) || [0, 0, 0, 0, 0], n: (lama && lama.n) || '' };
  }
  G.P.main = G.P.main || [0, 0, 0, 0, 0];   /* berapa kali tiap latihan dimainkan */
  G.P.salah = G.P.salah || [0, 0, 0, 0, 0]; /* jumlah salah pada percobaan terakhir */
  if (G.TEST) G.P = { s: [0, 0, 0, 0, 0], n: '', main: [0, 0, 0, 0, 0], salah: [0, 0, 0, 0, 0] };

  var pref = matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  G.O = Object.assign({ snd: 1, mus: 1, ro: pref ? 1 : 0, as: 0, calm: 0 }, (!G.TEST && baca(KUNCI_SET)) || {});

  G.reset = function () { G.P = { s: [0, 0, 0, 0, 0], n: '', main: [0, 0, 0, 0, 0], salah: [0, 0, 0, 0, 0] }; G.simpan(); };
  G.totalBintang = function () { return G.P.s.reduce(function (a, b) { return a + b; }, 0); };
  G.terbuka = function (i) { return i === 0 || G.P.s[i - 1] > 0 || G.P.s[i] > 0; };
  G.semuaSelesai = function () { return G.P.s.every(function (x) { return x > 0; }); };
})();
