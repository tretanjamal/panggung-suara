/* Audio: nada sintesis WebAudio + berkas mp3 (musik, tepuk tangan, pengiring).
   Musik menu hanya di Beranda/Menu; di dalam latihan musik berhenti agar telinga fokus. */
(function () {
  var AC = null, master = null, ana = null, berkas = {}, musikTarget = 0, fadeId = 0;
  var SUMBER = {
    bgm: 'assets/audio/musik-latar.mp3', kon: 'assets/audio/musik-konser.mp3', nina: 'assets/audio/nina-bobo.mp3',
    tep: 'assets/audio/tepuk-tangan.mp3'
  };
  var A = G.audio = {};

  A.hz = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };

  /* Dipanggil dari gerakan pengguna pertama agar browser mengizinkan suara. */
  A.buka = function () {
    try {
      if (!AC) {
        AC = new (window.AudioContext || window.webkitAudioContext)();
        master = AC.createGain(); master.gain.value = 0.9;
        /* Semua bunyi sintesis melewati penganalisis agar bisa digambar di Layar Suara. */
        ana = AC.createAnalyser(); ana.fftSize = 2048; ana.smoothingTimeConstant = 0;
        master.connect(ana); ana.connect(AC.destination);
      }
      if (AC.state === 'suspended') AC.resume();
    } catch (e) { AC = null; }
    if (musikTarget > 0) A.musik(musikTarget);
    return AC;
  };
  A.waktu = function () { return AC ? AC.currentTime : 0; };
  A.penganalisis = function () { return ana; };

  /* Bus per layar: semua bunyi yang dijadwalkan di satu layar ikut diputus saat pindah layar. */
  var bus = null;
  function tujuan() { return bus || master; }
  A.busBaru = function () {
    A.busPutus();
    if (!AC) return;
    try { bus = AC.createGain(); bus.connect(master); } catch (e) { bus = null; }
  };
  A.busPutus = function () {
    if (!bus) return;
    var b = bus; bus = null;
    try { b.gain.setTargetAtTime(0, AC.currentTime, 0.03); setTimeout(function () { try { b.disconnect(); } catch (e) { } }, 200); } catch (e) { }
  };

  /* Nada tunggal. f = frekuensi, d = durasi (detik), v = volume, at = mulai (detik dari sekarang). */
  A.nada = function (f, d, v, tipe, at) {
    if (!G.O.snd || !AC) return;
    d = d || 0.4; v = v == null ? 0.2 : v; at = at || 0;
    try {
      var o = AC.createOscillator(), g = AC.createGain(), n = AC.currentTime + at;
      o.type = tipe || 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, n); g.gain.linearRampToValueAtTime(v, n + 0.02); g.gain.exponentialRampToValueAtTime(0.001, n + d);
      o.connect(g); g.connect(tujuan()); o.start(n); o.stop(n + d + 0.05);
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
      lfo.start(n); lfo.stop(n + d + 0.05); g.connect(tujuan());
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
      s.connect(f); f.connect(g); g.connect(tujuan()); s.start(n);
    } catch (e) { }
  };
  A.drum = function (v) { A.nada(A.hz(45), 0.22, v == null ? 0.35 : v, 'sine'); A.nada(A.hz(57), 0.06, 0.08, 'square'); };
  A.tik = function (aksen, at) { A.nada(A.hz(aksen ? 84 : 79), 0.05, aksen ? 0.12 : 0.07, 'square', at); };
  A.klik = function () { A.nada(A.hz(88), 0.04, 0.05, 'sine'); };
  A.benar = function () { [72, 76, 79].forEach(function (m, i) { A.nada(A.hz(m), 0.3, 0.16, 'triangle', i * 0.08); }); };
  A.salah = function () { A.nada(A.hz(57), 0.28, 0.09, 'sine'); A.nada(A.hz(53), 0.32, 0.07, 'sine', 0.12); };
  /* Bunyi "tok-tok" netral (nada sama) saat tebakan dicatat: bukan bunyi benar/salah. */
  A.catat = function () { A.nada(A.hz(74), 0.08, 0.07, 'sine'); A.nada(A.hz(74), 0.08, 0.06, 'sine', 0.12); };
  A.laju = function () { return AC ? AC.sampleRate : 48000; };
  A.bintang = function (k) { A.nada(A.hz(76 + k * 3), 0.35, 0.14, 'triangle'); A.nada(A.hz(88 + k * 3), 0.2, 0.05, 'sine', 0.05); };

  /* Vokal sintesis (formant): sumber gigi gergaji disaring 3 pita frekuensi khas tiap vokal.
     Nilai formant pendekatan suara anak; cukup untuk membedakan a-i-u-e-o, bukan pengganti contoh guru. */
  var FORMAN = {
    a: [[850, 1], [1300, 0.55], [2700, 0.2]], i: [[320, 1], [2500, 0.45], [3200, 0.25]], u: [[340, 1], [850, 0.35], [2500, 0.08]],
    e: [[520, 1], [2000, 0.45], [2700, 0.2]], o: [[560, 1], [950, 0.5], [2600, 0.08]]
  };
  A.vokal = function (v, d, midi, at, vol) {
    if (!G.O.snd || !AC || !FORMAN[v]) return;
    d = d || 0.9; at = at || 0;
    try {
      var n = AC.currentTime + at, f0 = A.hz(midi || 62), src = AC.createOscillator(), lfo = AC.createOscillator(), lg = AC.createGain(), env = AC.createGain();
      src.type = 'sawtooth'; src.frequency.value = f0; lfo.frequency.value = 5; lg.gain.value = f0 * 0.012; lfo.connect(lg); lg.connect(src.frequency);
      FORMAN[v].forEach(function (fm) {
        var bp = AC.createBiquadFilter(), g = AC.createGain();
        bp.type = 'bandpass'; bp.frequency.value = fm[0]; bp.Q.value = fm[0] / 110; g.gain.value = fm[1] * 2.2;
        src.connect(bp); bp.connect(g); g.connect(env);
      });
      var V = vol == null ? 0.5 : vol;
      env.gain.setValueAtTime(0.0001, n); env.gain.linearRampToValueAtTime(V, n + 0.06); env.gain.setValueAtTime(V, n + d - 0.15); env.gain.exponentialRampToValueAtTime(0.001, n + d);
      env.connect(tujuan()); src.start(n); lfo.start(n); src.stop(n + d + 0.05); lfo.stop(n + d + 0.05);
    } catch (e) { }
  };

  /* Pengiring sintesis untuk konser: bas + akor tipis + tik, mengikuti tempo yang dipilih murid. */
  A.pengiring = function (akor, ketuk, vol) {
    if (!G.O.snd || !AC) return;
    akor.forEach(function (root, k) {
      var at = k * ketuk;
      A.nada(A.hz(root - 12), ketuk * 0.9, 0.16 * vol, 'sine', at);
      if (k % 2 === 0) [0, 4, 7].forEach(function (x) { A.nada(A.hz(root + x), ketuk * 1.8, 0.035 * vol, 'triangle', at); });
      A.nada(A.hz(k % 4 === 0 ? 84 : 79), 0.04, 0.05 * vol, 'square', at);
    });
  };

  /* ---------- Mikrofon opsional: hanya ditampilkan langsung, tidak direkam dan tidak disimpan ---------- */
  var mik = null;
  A.adaMik = function () { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.isSecureContext !== false); };
  A.mikNyala = function (cb) {
    if (!A.buka() || !A.adaMik()) { cb(null); return; }
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false } }).then(function (s) {
      var src = AC.createMediaStreamSource(s), an = AC.createAnalyser(), bisu = AC.createGain();
      an.fftSize = 2048; an.smoothingTimeConstant = 0; bisu.gain.value = 0;
      /* Penganalisis harus tersambung ke keluaran agar diproses browser; lewat penguat 0 supaya tidak berdengung. */
      src.connect(an); an.connect(bisu); bisu.connect(AC.destination);
      mik = { s: s, an: an, src: src, bisu: bisu }; cb(an);
    }).catch(function () { cb(null); });
  };
  A.mikMati = function () {
    if (!mik) return;
    mik.s.getTracks().forEach(function (t) { t.stop(); });
    try { mik.src.disconnect(); mik.bisu.disconnect(); } catch (e) { }
    mik = null;
  };
  A.mikAktif = function () { return mik ? mik.an : null; };

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
  A.henti = function (k) { var ks = k ? [k] : ['nina', 'kon', 'tep']; ks.forEach(function (x) { try { berkas[x] && berkas[x].pause(); } catch (e) { } }); };

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
