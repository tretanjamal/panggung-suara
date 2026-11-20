/* Percobaan 2 · Tinggi Rendah
   Tebak -> Coba (tangga nada do-re-mi, Layar Suara + dua layar beku untuk dibandingkan) -> Simpulkan
   -> Uji: 4 soal bandingkan dua nada (adaptif) + 2 soal tiru nada.
   Adaptif: 3 benar beruntun -> jarak nada makin dekat; 2 salah beruntun -> jarak dilebarkan dan batang bantuan muncul. */
(function () {
  var $ = G.$, A = G.audio, T = STR.l2;
  var TANGGA = [60, 62, 64, 65, 67, 69, 71, 72], NAMA = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si', "do'"];
  var WARNA = ['#c23a52', '#f08a24', '#f6c344', '#b6ea72', '#2fa36b', '#1d9bb0', '#6c5bd4', '#a3388f'];
  var JARAK = [7, 5, 4, 3, 2];
  var salah = 0, benarUji = 0;

  /* Generator soal bandingkan (fungsi murni, diuji di test/logic): jarak nada sesuai tingkat adaptif,
     kedua nada selalu di rentang nyanyian anak (G3-G5). */
  G.JARAK_NADA = JARAK;
  G.pasanganNada = function (tingkat, rnd) {
    rnd = rnd || Math.random;
    var iv = JARAK[Math.max(0, Math.min(JARAK.length - 1, tingkat))], m1 = 60 + (rnd() * 6 | 0);
    return [m1, m1 + (rnd() < 0.5 ? iv : -iv)];
  };

  function mulai() { salah = 0; benarUji = 0; G.tebak(1, 0, T.tebak, coba); }
  mulai.namaLayar = 'l2';
  G.LEVEL[1] = mulai;

  function tangga(aksi) {
    return '<div class="tangga" role="group" aria-label="Tangga nada">' + TANGGA.map(function (m, i) {
      return '<button class="bilah" data-a="' + aksi + '" data-i="' + i + '" style="--h:' + (96 + i * 20) + 'px;--w:' + WARNA[i] + '" aria-label="Nada ' + NAMA[i] + '">' +
        '<i></i><b>' + NAMA[i] + '</b></button>';
    }).join('') + '</div>';
  }
  function bunyi(i) {
    A.nyanyi(TANGGA[i], 1.0, 0.18);
    var b = $('.bilah[data-i="' + i + '"]'); if (b) { b.classList.remove('bunyi'); void b.offsetWidth; b.classList.add('bunyi'); }
  }

  /* ---------- Coba ---------- */
  function coba() {
    var dicoba = {}, sebelum = null;
    G.layarLab(1, 1, 's', T.coba, G.konsol(STR.lab.alat.nada,
      '<div class="nada-lab">' + tangga('bilah') +
        '<div class="nada-kanan">' + G.layarSuara('ls', 400, 150) +
          '<div class="jejak-baris">' +
            '<figure class="jejak"><canvas id="jk1" width="186" height="76"></canvas><figcaption>' + T.sebelum + ': <b id="jn1">-</b></figcaption></figure>' +
            '<figure class="jejak"><canvas id="jk2" width="186" height="76"></canvas><figcaption>' + T.kini + ': <b id="jn2">-</b></figcaption></figure>' +
          '</div></div>' +
      '</div>' +
      '<div class="konsol-bawah"><span class="info-coba" id="infoCoba">' + T.sisa(4) + '</span>' + G.tombolMik() +
        '<button class="btn btn-teal" data-a="keSimpul" id="keSimpul" disabled>' + G.ikon('ok', 26) + '<span>' + STR.lab.simpulkan + '</span></button></div>'));
    G.scope.pasang('ls', { gain: 2.6 });
    var kini = -1;
    G.aksi.bilah = function (el) {
      var i = +el.getAttribute('data-i');
      bunyi(i); G.nuriEkspresi(i > 4 ? 'b' : 's', 700);
      /* dua layar beku: nada sebelumnya vs sekarang (digambar dari frekuensi nada, selalu stabil) */
      if (kini >= 0) { G.jejakNada('jk1', TANGGA[kini]); $('#jn1').textContent = NAMA[kini]; }
      kini = i; G.jejakNada('jk2', TANGGA[i]); $('#jn2').textContent = NAMA[i];
      dicoba[i] = 1;
      var n = Object.keys(dicoba).length, siap = n >= 4 && dicoba[0] && dicoba[7];
      var sisa = Math.max(4 - n, (dicoba[0] ? 0 : 1) + (dicoba[7] ? 0 : 1));
      $('#infoCoba').textContent = siap ? '' : T.sisa(sisa);
      var ks = $('#keSimpul');
      if (siap && ks.disabled) { ks.disabled = false; G.kata(T.cukup); G.petunjuk(ks); G.catat(1, 'data', T.data); }
      else if (!siap) G.petunjuk($(dicoba[0] ? '.bilah[data-i="7"]' : '.bilah[data-i="0"]'));
    };
    G.aksi.keSimpul = simpulkan;
    G.onKey = function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var b = G.$$('.bilah'), k = b.indexOf(document.activeElement); if (k < 0) return;
      e.preventDefault(); b[Math.max(0, Math.min(7, k + (e.key === 'ArrowRight' ? 1 : -1)))].focus();
    };
    G.petunjuk($('.bilah[data-i="0"]'));
    G.test.selesaikan = function () { G.catat(1, 'data', T.data); simpulkan(); };
  }

  function simpulkan() {
    G.simpulkan(1, 2, Object.assign({ data: '<div class="data-dua">' + G.ikonGelombang('renggang') + '<span>do</span>' + G.ikonGelombang('rapat') + "<span>do'</span></div>" }, T.simpul),
      function (c) { salah += c; banding(); });
  }

  /* ---------- Uji A: bandingkan dua nada ---------- */
  function banding() {
    var POKOK = 4, nomor = 0, tingkat = 0, runBenar = 0, runSalah = 0, bantu = false, ulangan = [], tambahan = 0;
    function soal() {
      var ulang = nomor >= POKOK, m1, m2;
      if (ulang) { var u = ulangan.shift(); m1 = u[0]; m2 = u[1]; }
      else { var ps = G.pasanganNada(tingkat); m1 = ps[0]; m2 = ps[1]; }
      var jawab = m2 > m1 ? 2 : 1, sudah = false, total = POKOK + tambahan;
      nomor++;
      var tinggi = function (m) { return 18 + (m - 52) * 5; };
      G.layarLab(1, 3, 'p', T.tanya, G.konsol((ulang ? STR.lab.alat.ulangan + ' · ' : '') + STR.soalKe(nomor, total),
        '<div class="pilihan nada-pilihan' + (bantu || G.O.as ? ' tampak' : '') + '">' +
          [1, 2].map(function (k) {
            var m = k === 1 ? m1 : m2;
            return '<button class="kartu kartu-nada" data-a="jawab" data-k="' + k + '" disabled aria-label="' + T.nada + ' ' + k + ' lebih tinggi">' +
              '<span class="nada-atas">' + G.ikon('snd', 30) + '<b>' + T.nada + ' ' + k + '</b></span>' +
              '<span class="nada-isi"><span class="nada-bar"><i style="height:' + tinggi(m) + 'px"></i></span><canvas class="nada-jejak" id="nj' + k + '" width="150" height="90"></canvas></span>' +
              '<span class="nada-label" data-m="' + m + '"></span></button>';
          }).join('') +
        '</div>' +
        '<div class="konsol-bawah">' + G.layarSuara('ls', 420, 84) +
        '<button class="btn btn-teal" data-a="dengar">' + G.ikon('telinga', 28) + '<span>' + T.dengar + '</span></button></div>'));
      G.scope.pasang('ls', { gain: 2.6 });
      function putarDua() {
        var k1 = $('.kartu-nada[data-k="1"]'), k2 = $('.kartu-nada[data-k="2"]');
        A.nyanyi(m1, 0.7, 0.2); k1.classList.add('bunyi');
        G.tunda(function () { k1.classList.remove('bunyi'); }, 700);
        G.tunda(function () { A.nyanyi(m2, 0.7, 0.2); k2.classList.add('bunyi'); }, 900);
        G.tunda(function () {
          k2.classList.remove('bunyi');
          if (!sudah) G.$$('.kartu-nada').forEach(function (b) { b.disabled = false; });
          G.petunjuk(k1);
        }, 1600);
      }
      G.tunda(putarDua, 450);
      G.aksi.dengar = function () { if (!sudah) putarDua(); };
      G.aksi.jawab = function (el) {
        if (sudah) return; sudah = true;
        var k = +el.getAttribute('data-k');
        G.$$('.kartu-nada').forEach(function (b) { b.disabled = true; });
        $('.nada-pilihan').classList.add('tampak', 'ungkap');
        G.jejakNada('nj1', m1); G.jejakNada('nj2', m2);
        G.$$('.nada-label').forEach(function (s) { var m = +s.getAttribute('data-m'); s.textContent = m === Math.max(m1, m2) ? T.tinggi : T.rendah; });
        if (k === jawab) {
          if (!ulang) { benarUji++; runBenar++; runSalah = 0; if (runBenar >= 3 && tingkat < JARAK.length - 1) { tingkat++; runBenar = 0; } }
          bantu = false;
          el.classList.add('benar'); A.benar(); G.sorak(); G.partikel(el); G.kata(G.pilih(T.benar));
        } else {
          salah++;
          if (!ulang) { runSalah++; runBenar = 0; ulangan.push([m1, m2]); tambahan++; if (runSalah >= 2) { tingkat = Math.max(0, tingkat - 1); bantu = true; runSalah = 0; } }
          el.classList.add('salah'); A.salah(); G.goyang(el); G.bingung();
          G.kata(bantu ? T.salah2 : T.salah);
          $('.kartu-nada[data-k="' + jawab + '"]').classList.add('sorot');
          G.tunda(function () { A.nyanyi(m1, 0.5, 0.16); }, 600); G.tunda(function () { A.nyanyi(m2, 0.5, 0.16); }, 1200);
        }
        G.tunda(function () { if (nomor < POKOK || ulangan.length) soal(); else tiru(); }, k === jawab ? 1700 : 2600);
      };
      G.test.selesaikan = function () { var b = $('.kartu-nada[data-k="' + jawab + '"]'); b.disabled = false; G.aksi.jawab(b); };
    }
    soal();
  }

  /* ---------- Uji B: tiru nada ---------- */
  function tiru() {
    var target = G.acak([1, 2, 3, 4, 5, 6]).slice(0, 2), nomor = 0;
    function soal() {
      var t = target[nomor], coba = 0, beres = false;
      nomor++;
      G.layarLab(1, 3, 's', T.tiru, G.konsol(STR.lab.alat.tiru + ' · ' + STR.soalKe(nomor, 2),
        '<div class="nada-lab">' + tangga('tiru') +
          '<div class="nada-kanan">' + G.layarSuara('ls', 400, 150) +
            '<div class="konsol-bawah"><button class="btn btn-emas" data-a="dengarT">' + G.ikon('telinga', 26) + '<span>' + T.tiruDengar + '</span></button>' + G.tombolMik() + '</div></div>' +
        '</div>'));
      G.scope.pasang('ls', { gain: 2.6 });
      var dengar = function () { A.nyanyi(TANGGA[t], 1.0, 0.18); G.nuriEkspresi('b', 900); };
      G.tunda(dengar, 400);
      G.aksi.dengarT = dengar;
      G.aksi.tiru = function (el) {
        if (beres) return;
        var i = +el.getAttribute('data-i');
        bunyi(i);
        if (i === t) {
          beres = true; if (coba === 0) benarUji++;
          el.classList.add('benar-bilah'); G.partikel(el); G.sorak(); G.kata(T.tiruBenar);
          G.tunda(A.benar, 700);
          /* gema: Nuri menyanyikan nadanya, lalu giliran murid bernyanyi (mikrofon opsional untuk melihat suaranya) */
          G.tunda(function () { G.kata(T.gema); A.nyanyi(TANGGA[t], 1.3, 0.18); G.nuriEkspresi('b', 1300); }, 1600);
          G.tunda(function () { G.kata(T.gemaSiap); $('.layar-suara').classList.add('giliran'); }, 3200);
          G.tunda(function () {
            if (nomor < 2) soal();
            else G.hasil(1, benarUji >= 5 ? 3 : benarUji >= 4 ? 2 : 1, T.selesai, salah);
          }, 6200);
          return;
        }
        coba++; salah++; G.goyang(el); G.bingung();
        G.kata(i < t ? T.tiruRendah : T.tiruTinggi);
        if (coba >= 3) { var b = $('.bilah[data-i="' + t + '"]'); b.classList.add('sorot'); G.tunjukSekarang(b); G.kata(T.tiruTunjuk); G.tunda(function () { bunyi(t); }, 900); }
        else G.tunda(dengar, 1100);
      };
      G.petunjuk($('[data-a="dengarT"]'));
      G.test.selesaikan = function () { G.aksi.tiru($('.bilah[data-i="' + t + '"]')); };
    }
    soal();
  }
})();
