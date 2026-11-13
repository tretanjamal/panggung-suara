/* Audio: nada sintesis WebAudio + berkas mp3 (musik, tepuk tangan, pengiring).
   Musik menu hanya di Beranda/Menu; di dalam latihan musik berhenti agar telinga fokus. */
(function () {
  var AC = null, master = null, berkas = {}, musikTarget = 0, fadeId = 0;
  var SUMBER = {
    bgm: 'assets/audio/musik-latar.mp3', kon: 'assets/audio/musik-konser.mp3', nina: 'assets/audio/nina-bobo.mp3',
    peng: 'assets/audio/pengiring-gundul.mp3', tep: 'assets/audio/tepuk-tangan.mp3'
  };
  var A = G.audio = {};

  A.hz = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };

  /* Dipanggil dari gerakan pengguna pertama agar browser mengizinkan suara. */
  A.buka = function () {
    try {
      if (!AC) {
        AC = new (window.AudioContext || window.webkitAudioContext)();
        master = AC.createGain(); master.gain.value = 0.9; master.connect(AC.destination);
      }
      if (AC.state === 'suspended') AC.resume();
    } catch (e) { AC = null; }
    if (musikTarget > 0) A.musik(musikTarget);
    return AC;
  };
  A.waktu = function () { return AC ? AC.currentTime : 0; };

  /* Nada tunggal. f = frekuensi, d = durasi (detik), v = volume, at = mulai (detik dari sekarang). */
  A.nada = function (f, d, v, tipe, at) {
    if (!G.O.snd || !AC) return;
    d = d || 0.4; v = v == null ? 0.2 : v; at = at || 0;
    try {
      var o = AC.createOscillator(), g = AC.createGain(), n = AC.currentTime + at;
      o.type = tipe || 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, n); g.gain.linearRampToValueAtTime(v, n + 0.02); g.gain.exponentialRampToValueAtTime(0.001, n + d);
      o.connect(g); g.connect(master); o.start(n); o.stop(n + d + 0.05);
    } catch (e) { }
  };
  /* Nada "bernyanyi" yang lebih hangat: dua osilator sedikit berbeda + vibrato kecil. */
  A.nyanyi = function (midi, d, v, at) {
    if (!G.O.snd || !AC) return;
    var f = A.hz(midi); v = v == null ? 0.16 : v; at = at || 0;
    try {
      var n = AC.currentTime + at, g = AC.createGain(), lfo = AC.createOscillator(), lg = AC.createGain();
      lfo.frequency.value = 5.2; lg.gain.value = f * 0.006; lfo.connect(lg);
      g.gain.setValueAtTime(0.0001, n); g.gain.linearRampToValueAtTime(v, n + 0.05); g.gain.setValueAtTime(v, n + Math.max(0.06, d - 0.12)); g.gain.exponentialRampToValueAtTime(0.001, n + d);
      [['triangle', 0], ['sine', 4]].forEach(function (t) {
        var o = AC.createOscillator(); o.type = t[0]; o.frequency.value = f; o.detune.value = t[1];
        lg.connect(o.frequency); o.connect(g); o.start(n); o.stop(n + d + 0.05);
      });
      lfo.start(n); lfo.stop(n + d + 0.05); g.connect(master);
    } catch (e) { }
  };
  /* Desis "sss" untuk latihan buang napas. */
  A.desis = function (d, v) {
    if (!G.O.snd || !AC) return;
    try {
      var len = AC.sampleRate * d, buf = AC.createBuffer(1, len, AC.sampleRate), x = buf.getChannelData(0);
      for (var i = 0; i < len; i++) x[i] = Math.random() * 2 - 1;
      var s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(), n = AC.currentTime;
      s.buffer = buf; f.type = 'highpass'; f.frequency.value = 4200;
      g.gain.setValueAtTime(0.0001, n); g.gain.linearRampToValueAtTime(v || 0.05, n + 0.3); g.gain.linearRampToValueAtTime(0.0001, n + d);
      s.connect(f); f.connect(g); g.connect(master); s.start(n);
    } catch (e) { }
  };
  A.drum = function (v) { A.nada(A.hz(45), 0.22, v == null ? 0.35 : v, 'sine'); A.nada(A.hz(57), 0.06, 0.08, 'square'); };
  A.tik = function (aksen) { A.nada(A.hz(aksen ? 84 : 79), 0.05, aksen ? 0.12 : 0.07, 'square'); };
  A.klik = function () { A.nada(A.hz(88), 0.04, 0.05, 'sine'); };
  A.benar = function () { [72, 76, 79].forEach(function (m, i) { A.nada(A.hz(m), 0.3, 0.16, 'triangle', i * 0.08); }); };
  A.salah = function () { A.nada(A.hz(57), 0.28, 0.09, 'sine'); A.nada(A.hz(53), 0.32, 0.07, 'sine', 0.12); };
  A.bintang = function (k) { A.nada(A.hz(76 + k * 3), 0.35, 0.14, 'triangle'); A.nada(A.hz(88 + k * 3), 0.2, 0.05, 'sine', 0.05); };

  /* ---------- Berkas audio ---------- */
  A.putar = function (k, v, loop) {
    if (!G.O.snd) return null;
    try {
      var a = berkas[k] || (berkas[k] = new Audio(SUMBER[k]));
      a.loop = !!loop; a.volume = v == null ? 0.6 : v; a.currentTime = 0;
      var p = a.play(); if (p && p.catch) p.catch(function () { });
      return a;
    } catch (e) { return null; }
  };
  A.henti = function (k) { var ks = k ? [k] : ['nina', 'peng', 'kon', 'tep']; ks.forEach(function (x) { try { berkas[x] && berkas[x].pause(); } catch (e) { } }); };

  /* Musik latar dengan fade halus. v = target volume (0 = berhenti). */
  A.musik = function (v) {
    musikTarget = v;
    if (!G.O.snd || !G.O.mus) v = 0;
    var a = berkas.bgm;
    if (!a && v > 0) { try { a = berkas.bgm = new Audio(SUMBER.bgm); a.loop = true; a.volume = 0; } catch (e) { return; } }
    if (!a) return;
    if (v > 0 && a.paused) { var p = a.play(); if (p && p.catch) p.catch(function () { }); }
    var id = ++fadeId;
    (function langkah() {
      if (id !== fadeId) return;
      var d = v - a.volume;
      if (Math.abs(d) < 0.02) { a.volume = v; if (!v) a.pause(); return; }
      a.volume = Math.max(0, Math.min(1, a.volume + (d > 0 ? 0.02 : -0.04)));
      setTimeout(langkah, 50);
    })();
  };
  /* Ducking: musik turun saat contoh suara diputar. */
  A.redam = function (aktif) { var a = berkas.bgm; if (a && !a.paused) a.volume = aktif ? Math.min(a.volume, 0.04) : musikTarget; };

  /* Jeda otomatis saat tab disembunyikan. */
  document.addEventListener('visibilitychange', function () {
    if (AC) { if (document.hidden) AC.suspend(); else AC.resume(); }
    Object.keys(berkas).forEach(function (k) {
      var a = berkas[k];
      if (document.hidden) { a._jalan = !a.paused; a.pause(); }
      else if (a._jalan) { var p = a.play(); if (p && p.catch) p.catch(function () { }); }
    });
  });

  A.semuaDiam = function () { Object.keys(berkas).forEach(function (k) { try { berkas[k].pause(); } catch (e) { } }); };
})();
