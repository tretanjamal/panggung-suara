/* Percobaan 1 · Napas & Vokal
   Tebak -> Coba (sikap membungkuk vs tegak, ukur lama buang napas) -> Simpulkan -> Vokal (coba 5 bentuk mulut, lalu uji 3 bunyi).
   Model sederhana: membungkuk menekan paru-paru sehingga hanya terisi setengah; lama buang napas sebanding isi paru-paru. */
(function () {
  var $ = G.$, A = G.audio, T = STR.l1;
  var DETIK = [3, 6];            /* lama buang napas: membungkuk, tegak */
  var salah = 0, data = [null, null];

  function mulai() {
    salah = 0; data = [null, null];
    var o = T.tebak.opsi, ik = function (h) { return '<span class="anak-ikon">' + h + '</span>'; };
    G.tebak(0, 0, { tanya: T.tebak.tanya, benar: T.tebak.benar, opsi: [
      [o[0][0], ik(anak(0, 92))], [o[1][0], ik(anak(1, 92))], [o[2][0], ik(anak(0, 64) + '<b>=</b>' + anak(1, 64))]] }, coba);
  }
  mulai.namaLayar = 'l1';
  G.LEVEL[0] = mulai;

  /* Gambar anak: 0 = membungkuk, 1 = tegak. */
  function anak(j, w) {
    var badan = j === 0 ? 'rotate(18 70 128)' : '', kepala = j === 0 ? 'rotate(16 70 66)' : '';
    return '<svg viewBox="0 0 140 182" width="' + w + '" height="' + Math.round(w * 1.3) + '" aria-hidden="true">' +
      '<ellipse cx="70" cy="172" rx="40" ry="7" fill="#3b1f4a22"/>' +
      '<path d="M62 128 L58 166 M78 128 L82 166" stroke="#3b1f4a" stroke-width="11" stroke-linecap="round"/>' +
      '<ellipse cx="55" cy="168" rx="11" ry="6" fill="#c23a52"/><ellipse cx="85" cy="168" rx="11" ry="6" fill="#c23a52"/>' +
      '<g transform="' + badan + '">' +
        '<path d="M54 80 Q44 96 46 118 M86 80 Q96 96 94 118" stroke="#f0b27a" stroke-width="9" fill="none" stroke-linecap="round"/>' +
        '<rect x="50" y="70" width="40" height="62" rx="16" fill="#1d9bb0" stroke="#3b1f4a" stroke-width="4"/>' +
        '<path d="M60 74 L70 84 L80 74" stroke="#fff4dc" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<g transform="' + kepala + '">' +
          '<circle cx="70" cy="44" r="23" fill="#f0b27a" stroke="#3b1f4a" stroke-width="4"/>' +
          '<path d="M47 40 Q50 18 70 18 Q92 18 94 40 Q84 28 70 30 Q56 28 47 40z" fill="#3b1f4a"/>' +
          '<circle cx="62" cy="44" r="3.2" fill="#3b1f4a"/><circle cx="79" cy="44" r="3.2" fill="#3b1f4a"/><ellipse cx="70" cy="56" rx="4.5" ry="5.5" fill="#7a2236"/>' +
        '</g>' +
      '</g>' +
      (j === 1 ? '<path d="M112 30v120" stroke="#2fa36b" stroke-width="4" stroke-dasharray="8 7" stroke-linecap="round"/>' : '<path d="M104 40q22 50 0 110" stroke="#c23a52" stroke-width="4" stroke-dasharray="8 7" fill="none" stroke-linecap="round"/>') +
      '</svg>';
  }

  /* Paru-paru dengan isi yang naik-turun (clip path). */
  var PARU = 'M88 46 Q60 40 44 70 Q26 106 30 156 Q34 196 66 198 Q92 198 94 170 L94 70 Q94 52 88 46z M112 46 Q140 40 156 70 Q174 106 170 156 Q166 196 134 198 Q108 198 106 170 L106 70 Q106 52 112 46z';
  function paruSVG() {
    return '<svg class="paru" viewBox="0 0 200 214" width="230" height="246" aria-hidden="true">' +
      '<defs><clipPath id="klipParu"><path d="' + PARU + '"/></clipPath></defs>' +
      '<path d="M100 6V60 M100 52 Q96 62 88 66 M100 52 Q104 62 112 66" stroke="#3b1f4a" stroke-width="12" fill="none" stroke-linecap="round"/>' +
      '<path d="M100 6V60" stroke="#f9c7cf" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="' + PARU + '" fill="#fbe3e6"/>' +
      '<g clip-path="url(#klipParu)"><rect id="paruIsi" x="0" y="200" width="200" height="200" fill="#f0788c"/>' +
      '<rect id="paruKilau" x="0" y="200" width="200" height="8" fill="#ffb3c0"/></g>' +
      '<path id="garisBatas" d="M18 124H182" stroke="#c23a52" stroke-width="4" stroke-dasharray="10 8" opacity="0"/>' +
      '<path d="' + PARU + '" fill="none" stroke="#3b1f4a" stroke-width="6" stroke-linejoin="round"/>' +
      '</svg>';
  }

  function grafik() {
    var maks = 6;
    return '<div class="grafik-napas"><b>' + T.tabel + '</b>' + [0, 1].map(function (j) {
      var d = data[j];
      return '<div class="gn-baris"><span class="gn-label">' + T.sikap[j] + '</span><span class="gn-batang"><i class="gn-' + j + '" style="width:' + (d ? d / maks * 100 : 0) + '%"></i></span>' +
        '<span class="gn-nilai">' + (d ? d + ' ' + T.detik : '?') + '</span></div>';
    }).join('') + '</div>';
  }

  /* ---------- Coba: ukur napas dengan dua sikap ---------- */
  function coba() {
    var sikap = 0, isi = 0, fase = 'siap', tahan = false, otomatis = false, t0 = 0, terakhir = 0, nadaJeda = 0;
    G.layarLab(0, 1, 's', T.pilihSikap, G.konsol(STR.lab.alat.napas,
      '<div class="napas-lab">' +
        '<div class="sikap-pilih">' + [0, 1].map(function (j) {
          return '<button class="kartu kartu-sikap" data-a="sikap" data-j="' + j + '" aria-pressed="false">' + anak(j, 96) + '<b>' + T.sikap[j] + '</b><span class="cek" id="cek' + j + '"></span></button>';
        }).join('') + '</div>' +
        '<div class="paru-wadah" id="paruWadah">' + paruSVG() + '<div class="detik" id="detik" aria-live="polite"></div></div>' +
        '<div class="napas-kanan">' + G.layarSuara('ls', 372, 150) + '<div id="grafik">' + grafik() + '</div></div>' +
      '</div>' +
      '<div class="konsol-bawah">' +
        '<button class="btn btn-emas btn-besar" id="tahan" data-senyap>' + G.ikon('play', 28) + '<span>' + T.tombol + '</span></button>' +
        '<button class="btn btn-teal" data-a="keSimpul" id="keSimpul" disabled>' + G.ikon('ok', 26) + '<span>' + STR.lab.simpulkan + '</span></button>' +
      '</div>'));
    G.scope.pasang('ls', { gain: 4 });
    var tombol = $('#tahan'), isiEl = $('#paruIsi'), kilau = $('#paruKilau');

    function pilihSikap(j) {
      sikap = j;
      G.$$('.kartu-sikap').forEach(function (b) { var on = +b.getAttribute('data-j') === j; b.classList.toggle('dipilih', on); b.setAttribute('aria-pressed', on); });
      $('#garisBatas').setAttribute('opacity', j === 0 ? 1 : 0);
    }
    pilihSikap(0);
    function gambar() { var y = 200 - isi * 156; isiEl.setAttribute('y', y); kilau.setAttribute('y', y); }
    G.aksi.sikap = function (el) { if (fase === 'siap') { pilihSikap(+el.getAttribute('data-j')); G.petunjuk(tombol); } };

    function loop(t) {
      if (!document.body.contains(tombol)) return;
      var dt = Math.min(0.05, (t - (terakhir || t)) / 1000); terakhir = t;
      if (fase === 'tarik' && (tahan || otomatis)) {
        var batas = sikap === 0 ? 0.5 : 1;
        isi = Math.min(batas, isi + dt / (G.O.calm ? 3 : 2.2));
        gambar();
        if (isi >= batas) {
          fase = 'penuh';
          if (sikap === 0) { G.kata(T.mentok); G.goyang($('#paruWadah')); G.bingung(); G.tunda(buang, 1300); }
          else G.tunda(buang, 350);
        }
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    function tekan() {
      if (fase === 'siap') { fase = 'tarik'; otomatis = false; G.$$('.kartu-sikap').forEach(function (b) { b.disabled = true; }); G.kata(T.tarik); G.petunjuk(null); }
      if (fase !== 'tarik') return;
      tahan = true; t0 = performance.now(); tombol.classList.add('ditekan');
    }
    function lepas() {
      if (!tahan) return; tahan = false; tombol.classList.remove('ditekan');
      if (performance.now() - t0 < 260) otomatis = true;    /* ketuk sekali = jalan otomatis */
    }
    tombol.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      try { tombol.setPointerCapture(e.pointerId); } catch (x) { /* penunjuk sudah lepas: tidak apa-apa */ }
      tekan();
    });
    tombol.addEventListener('pointerup', lepas);
    tombol.addEventListener('pointercancel', lepas);
    G.onKey = function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat && document.activeElement === tombol) { e.preventDefault(); tekan(); } };
    G.onKeyUp = function (e) { if (e.key === ' ' || e.key === 'Enter') lepas(); };
    tombol.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') e.preventDefault(); });

    function buang() {
      fase = 'buang'; tombol.disabled = true; tahan = false; tombol.classList.remove('ditekan');
      G.kata(T.buang);
      var n = DETIK[sikap], k = 0, h = $('#detik'), awal = isi;
      A.desis(n * G.cepat, 0.06);
      (function hitung() {
        k++; h.textContent = k; h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop');
        isi = awal * (1 - k / n); gambar();
        if (k < n) { G.tunda(hitung, 1000); return; }
        G.tunda(function () { catatHasil(n); }, 700);
      })();
    }
    function catatHasil(n) {
      data[sikap] = n; $('#grafik').innerHTML = grafik(); $('#cek' + sikap).innerHTML = G.ikon('ok', 22);
      A.benar(); G.partikel($('#grafik'), 8); $('#detik').textContent = '';
      isi = 0; gambar(); fase = 'siap'; tombol.disabled = false;
      G.$$('.kartu-sikap').forEach(function (b) { b.disabled = false; });
      if (data[0] != null && data[1] != null) {
        G.sorak(); G.kata(T.cukup);
        var ks = $('#keSimpul'); ks.disabled = false; G.petunjuk(ks);
        G.catat(0, 'data', T.data(data[0], data[1]));
      } else { G.kata(T.cobaLain); pilihSikap(data[0] == null ? 0 : 1); G.petunjuk(tombol); }
    }
    G.aksi.keSimpul = function () { simpulkan(); };
    G.petunjuk(tombol);
    G.test.selesaikan = function () { data = [DETIK[0], DETIK[1]]; G.catat(0, 'data', T.data(data[0], data[1])); simpulkan(); };
  }

  /* ---------- Simpulkan ---------- */
  function simpulkan() {
    var s = Object.assign({ data: grafik() }, T.simpul);
    G.simpulkan(0, 2, s, function (c) { salah += c; perut(); });
  }
  /* Napas penyanyi: napas perut, bahu rileks (tidak dicatat sebagai temuan utama). */
  function perut() {
    G.simpulkan(0, 2, T.perut, function (c) { salah += c; vokalCoba(); });
  }

  /* ---------- Vokal: coba lima bentuk mulut ---------- */
  var V = ['a', 'i', 'u', 'e', 'o'];
  function vokalCoba() {
    var dicoba = {};
    G.layarLab(0, 3, 's', T.vokalCoba, G.konsol(STR.lab.alat.vokal,
      G.layarSuara('lsv', 830, 150) +
      '<div class="mulut-baris">' + V.map(function (v) {
        return '<button class="kartu kartu-mulut-kecil" data-a="vok" data-v="' + v + '" aria-label="' + T.bunyi + ' ' + v.toUpperCase() + '">' + G.mulutSVG(v, 120) + '<b>' + v.toUpperCase() + '</b><span class="cek" id="cv' + v + '"></span></button>';
      }).join('') + '</div>' +
      '<div class="konsol-bawah"><button class="btn btn-emas" data-a="keUji" id="keUji" disabled>' + G.ikon('kanan', 26) + '<span>' + STR.lab.lanjutUji + '</span></button></div>'));
    G.scope.pasang('lsv', { gain: 2.2, sampel: 900 });
    G.aksi.vok = function (el) {
      var v = el.getAttribute('data-v');
      A.vokal(v, 1.0); el.classList.remove('bunyi'); void el.offsetWidth; el.classList.add('bunyi');
      G.nuriEkspresi('b', 900);
      if (!dicoba[v]) { dicoba[v] = 1; $('#cv' + v).innerHTML = G.ikon('ok', 20); }
      if (Object.keys(dicoba).length >= 3) { var u = $('#keUji'); if (u.disabled) { u.disabled = false; G.kata(T.vokalCukup); G.petunjuk(u); } }
      else G.petunjuk($('.kartu-mulut-kecil:not(.bunyi)'));
    };
    G.aksi.keUji = vokalUji;
    G.petunjuk($('.kartu-mulut-kecil'));
    G.test.selesaikan = vokalUji;
  }

  /* ---------- Vokal: uji tiga bunyi (yang salah diulang di akhir) ---------- */
  function vokalUji() {
    var antre = G.acak(V).slice(0, 3), total = 3, nomor = 0, diulang = {};
    function soal() {
      var v = antre[0], coba = 0;
      var op = G.acak([v].concat(G.acak(V.filter(function (x) { return x !== v; })).slice(0, 2)));
      nomor++;
      G.layarLab(0, 3, 'p', T.vokalTanya, G.konsol(STR.soalKe(Math.min(nomor, total), total),
        '<div class="vokal-uji">' +
          '<div class="vokal-kiri"><div class="vokal-besar tersembunyi" id="hurufV" aria-hidden="true">' + v.toUpperCase() + '</div>' +
          '<button class="btn btn-teal btn-kecil" data-a="dengarV">' + G.ikon('telinga', 24) + '<span>' + T.dengar + '</span></button></div>' +
          '<div class="pilihan">' + op.map(function (x) {
            return '<button class="kartu kartu-mulut" data-a="mulut" data-v="' + x + '" aria-label="Bentuk mulut ' + (op.indexOf(x) + 1) + '">' + G.mulutSVG(x, 170) + '</button>';
          }).join('') + '</div>' +
        '</div>' + G.layarSuara('lsu', 830, 100)));
      G.scope.pasang('lsu', { gain: 2.2, sampel: 900 });
      G.tunda(function () { A.vokal(v, 1.0); }, 350);
      G.aksi.dengarV = function () { A.vokal(v, 1.0); };
      G.aksi.mulut = function (el) {
        var x = el.getAttribute('data-v');
        if (x === v) {
          G.$$('.kartu-mulut').forEach(function (b) { b.disabled = true; });
          el.classList.add('benar'); A.benar(); G.sorak(); G.partikel(el); G.kata(G.pilih(T.benar));
          $('#hurufV').classList.remove('tersembunyi');
          antre.shift();
          G.tunda(function () {
            if (antre.length) soal();
            else G.hasil(0, salah === 0 ? 3 : salah <= 2 ? 2 : 1, T.selesai, salah);
          }, 1200);
          return;
        }
        coba++; salah++; A.salah(); G.goyang(el); G.bingung(); el.disabled = true;
        /* petunjuk ke-1: tampilkan hurufnya; ke-2: jelaskan bentuk mulut + sorot */
        G.kata(coba === 1 ? T.vokalHuruf(v.toUpperCase()) : T.vokalPetunjuk(v.toUpperCase(), T.bentuk[v]));
        $('#hurufV').classList.remove('tersembunyi');
        G.tunda(function () { A.vokal(v, 1.0); }, 500);
        if (coba >= 2) $('.kartu-mulut[data-v="' + v + '"]').classList.add('sorot');
        if (!diulang[v]) { diulang[v] = 1; antre.push(v); total++; }
      };
      G.petunjuk($('.kartu-mulut'));
      G.test.selesaikan = function () { G.aksi.mulut($('.kartu-mulut[data-v="' + v + '"]')); };
    }
    soal();
  }
})();
