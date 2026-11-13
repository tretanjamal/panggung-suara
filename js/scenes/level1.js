/* Latihan 1 · Pemanasan: (a) tarik dan buang napas, (b) sikap berdiri, (c) bentuk mulut vokal. */
(function () {
  var $ = G.$, A = G.audio, T = STR.l1;
  var salah = 0;

  function mulai() { salah = 0; napas(); }
  mulai.namaLayar = 'l1';
  G.LEVEL[0] = mulai;

  /* ---------- (a) Napas: balon mengembang saat tombol ditahan ---------- */
  function napas() {
    G.layar(G.hud(0, 0, 3) +
      '<div class="main">' + G.nuri('s', 250) +
        '<div class="kolom">' + G.balon(T.napas) +
          '<div class="balon-wadah"><svg class="balon" id="balon" viewBox="0 0 200 260" aria-hidden="true">' +
            '<path d="M100 214 Q92 240 104 258" stroke="#fff4dc" stroke-width="4" fill="none" stroke-linecap="round"/>' +
            '<g id="balonBadan"><ellipse cx="100" cy="112" rx="84" ry="100" fill="#1d9bb0" stroke="#3b1f4a" stroke-width="7"/>' +
            '<ellipse cx="68" cy="70" rx="18" ry="28" fill="#7fd8ee" opacity=".8"/><path d="M90 210h20l-6 12h-8z" fill="#11687a" stroke="#3b1f4a" stroke-width="5" stroke-linejoin="round"/></g></svg>' +
            '<div class="hitung" id="hitung" aria-live="polite"></div></div>' +
          '<button class="btn btn-emas btn-besar" id="tahan" data-senyap>' + G.ikon('play', 28) + '<span>' + T.tombolNapas + '</span></button>' +
        '</div></div>', 'latar');

    var isi = 0, tahan = false, t0 = 0, otomatis = false, selesai = false, terakhir = 0, raf = 0, nadaJeda = 0;
    var badan = $('#balonBadan'), tombol = $('#tahan');
    function gambar() { var k = 0.42 + isi * 0.58; badan.style.transform = 'scale(' + k + ')'; }
    gambar();
    function loop(t) {
      if (!document.body.contains(tombol)) return;
      var dt = Math.min(0.05, (t - (terakhir || t)) / 1000); terakhir = t;
      if ((tahan || otomatis) && !selesai) {
        isi = Math.min(1, isi + dt / (G.O.calm ? 3.2 : 2.4));
        nadaJeda -= dt; if (nadaJeda <= 0) { A.nada(A.hz(55 + isi * 12), 0.12, 0.04, 'sine'); nadaJeda = 0.18; }
        gambar();
        if (isi >= 1) { selesai = true; buang(); return; }
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    function tekan() { if (selesai) return; tahan = true; t0 = performance.now(); tombol.classList.add('ditekan'); G.kata(T.menahan); }
    function lepas() {
      if (!tahan) return; tahan = false; tombol.classList.remove('ditekan');
      if (performance.now() - t0 < 260) otomatis = true;    /* ketuk sekali = jalan otomatis */
    }
    tombol.addEventListener('pointerdown', function (e) { e.preventDefault(); tombol.setPointerCapture && tombol.setPointerCapture(e.pointerId); tekan(); });
    tombol.addEventListener('pointerup', lepas);
    tombol.addEventListener('pointercancel', lepas);
    G.onKey = function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); tekan(); } };
    G.onKeyUp = function (e) { if (e.key === ' ' || e.key === 'Enter') lepas(); };
    G.petunjuk(tombol);

    function buang() {
      cancelAnimationFrame(raf); tombol.disabled = true; G.petunjuk(null);
      A.benar(); G.sorak(); G.kata(T.buang);
      var n = G.O.calm ? 6 : 4, k = 0, h = $('#hitung');
      A.desis(n, 0.05);
      badan.style.transition = 'transform ' + (n * G.cepat) + 's linear';
      G.tunda(function () { isi = 0; gambar(); }, 60);
      (function hitung() {
        k++; h.textContent = k; h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop');
        if (k < n) G.tunda(hitung, 1000); else G.tunda(sikap, 1100);
      })();
    }
    G.test.selesaikan = function () { otomatis = true; };
  }

  /* ---------- (b) Sikap berdiri ---------- */
  /* Gambar anak sederhana: 0 = membungkuk, 1 = tegak (benar), 2 = mendongak dan bahu naik. */
  function anak(j) {
    var badan = j === 0 ? 'rotate(16 70 128)' : '', kepala = j === 0 ? 'rotate(14 70 66)' : j === 2 ? 'rotate(-22 70 66)' : '';
    var bahu = j === 2 ? -8 : 0, lengan = j === 2
      ? '<path d="M54 74 Q40 70 40 96 M86 74 Q100 70 100 96" stroke="#f0b27a" stroke-width="9" fill="none" stroke-linecap="round"/>'
      : '<path d="M54 80 Q44 96 46 118 M86 80 Q96 96 94 118" stroke="#f0b27a" stroke-width="9" fill="none" stroke-linecap="round"/>';
    var mulut = j === 2 ? '<ellipse cx="73" cy="56" rx="4" ry="5" fill="#7a2236"/>' : '<ellipse cx="70" cy="56" rx="4.5" ry="5.5" fill="#7a2236"/>';
    return '<svg viewBox="0 0 140 182" width="150" height="195" aria-hidden="true">' +
      '<ellipse cx="70" cy="172" rx="40" ry="7" fill="#3b1f4a22"/>' +
      '<path d="M62 128 L58 166 M78 128 L82 166" stroke="#3b1f4a" stroke-width="11" stroke-linecap="round"/>' +
      '<ellipse cx="55" cy="168" rx="11" ry="6" fill="#c23a52"/><ellipse cx="85" cy="168" rx="11" ry="6" fill="#c23a52"/>' +
      '<g transform="' + badan + '">' +
        '<g transform="translate(0 ' + bahu + ')">' + lengan + '</g>' +
        '<rect x="50" y="' + (70 + bahu) + '" width="40" height="' + (62 - bahu) + '" rx="16" fill="#1d9bb0" stroke="#3b1f4a" stroke-width="4"/>' +
        '<path d="M60 ' + (74 + bahu) + ' L70 ' + (84 + bahu) + ' L80 ' + (74 + bahu) + '" stroke="#fff4dc" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<g transform="' + kepala + '">' +
          '<circle cx="70" cy="44" r="23" fill="#f0b27a" stroke="#3b1f4a" stroke-width="4"/>' +
          '<path d="M47 40 Q50 18 70 18 Q92 18 94 40 Q84 28 70 30 Q56 28 47 40z" fill="#3b1f4a"/>' +
          '<circle cx="62" cy="44" r="3.2" fill="#3b1f4a"/><circle cx="79" cy="44" r="3.2" fill="#3b1f4a"/>' + mulut +
        '</g>' +
      '</g>' +
      (j === 2 ? '<path d="M30 60l6 6M26 72l8 2M110 60l-6 6M114 72l-8 2" stroke="#c23a52" stroke-width="3" stroke-linecap="round"/>' : '') +
      '</svg>';
  }

  function sikap() {
    var urut = G.acak([0, 1, 2]), coba = 0;
    G.onKey = G.onKeyUp = null;
    G.layar(G.hud(0, 1, 3) +
      '<div class="main">' + G.nuri('b', 250) +
        '<div class="kolom">' + G.balon(T.sikap) +
          '<div class="pilihan">' + urut.map(function (j, k) {
            return '<button class="kartu kartu-pose" data-a="pose" data-j="' + j + '" aria-label="Sikap ' + 'ABC'[k] + '">' + anak(j) + '<span class="kartu-huruf">' + 'ABC'[k] + '</span></button>';
          }).join('') + '</div></div></div>', 'latar');
    G.aksi.pose = function (el) {
      var j = +el.getAttribute('data-j');
      if (j === 1) {
        G.$$('.kartu-pose').forEach(function (b) { b.disabled = true; });
        el.classList.add('benar'); A.benar(); G.sorak(); G.partikel(el); G.kata(T.sikapBenar);
        G.tunda(function () { vokal(); }, 1300);
        return;
      }
      coba++; salah++; A.salah(); G.goyang(el); G.bingung(); el.disabled = true;
      G.kata(coba >= 2 ? T.sikapPetunjuk : T.sikapSalah[j === 0 ? 0 : 1]);
      if (coba >= 2) { var b = $('.kartu-pose[data-j="1"]'); b.classList.add('sorot'); G.tunjukSekarang(b); }
    };
    G.petunjuk($('.kartu-pose'));
    G.test.selesaikan = function () { G.aksi.pose($('.kartu-pose[data-j="1"]')); };
  }

  /* ---------- (c) Bentuk mulut vokal ---------- */
  function vokal() {
    var V = ['a', 'i', 'u', 'e', 'o'], antre = G.acak(V).slice(0, 3), total = 3, nomor = 0, diulang = {};
    function soal() {
      var v = antre[0], coba = 0;
      var op = G.acak([v].concat(G.acak(V.filter(function (x) { return x !== v; })).slice(0, 2)));
      nomor++;
      G.layar(G.hud(0, 2, 3) +
        '<div class="main">' + G.nuri('p', 240) +
          '<div class="kolom">' +
            '<div class="label-soal">' + STR.soalKe(Math.min(nomor, total), total) + '</div>' +
            G.balon(T.vokal(v.toUpperCase())) +
            '<div class="vokal-baris"><div class="vokal-besar" aria-hidden="true">' + v.toUpperCase() + '</div>' +
            '<div class="pilihan">' + op.map(function (x) {
              return '<button class="kartu kartu-mulut" data-a="mulut" data-v="' + x + '" aria-label="Bentuk mulut ' + x.toUpperCase() + '"><img src="' + G.IM.mulut(x) + '" alt=""></button>';
            }).join('') + '</div></div>' +
          '</div></div>', 'latar');
      A.nyanyi(67, 0.7, 0.12, 0.2);
      G.aksi.mulut = function (el) {
        var x = el.getAttribute('data-v');
        if (x === v) {
          G.$$('.kartu-mulut').forEach(function (b) { b.disabled = true; });
          el.classList.add('benar'); A.benar(); G.sorak(); G.partikel(el); G.kata(G.pilih(STR.l2.benar));
          antre.shift();
          G.tunda(function () { if (antre.length) soal(); else G.hasil(0, salah === 0 ? 3 : salah <= 2 ? 2 : 1, T.selesai, salah); }, 1100);
          return;
        }
        coba++; salah++; A.salah(); G.goyang(el); G.bingung(); el.disabled = true;
        G.kata(coba === 1 ? T.vokalSalah : T.vokalPetunjuk(v.toUpperCase(), T.bentuk[v]));
        if (coba >= 2) $('.kartu-mulut[data-v="' + v + '"]').classList.add('sorot');
        /* Soal yang salah muncul lagi di akhir (sekali saja). */
        if (!diulang[v]) { diulang[v] = 1; antre.push(v); total++; }
      };
      G.petunjuk($('.kartu-mulut'));
      G.test.selesaikan = function () { G.aksi.mulut($('.kartu-mulut[data-v="' + v + '"]')); };
    }
    soal();
  }
})();
