/* Latihan 2 · Tangga Nada: dengarkan dua nada, ketuk yang lebih tinggi.
   Adaptif: 3 benar beruntun -> jarak nada makin dekat; 2 salah beruntun -> jarak dilebarkan dan batang bantuan muncul.
   Soal yang salah diulang sekali di akhir (tidak dihitung ke bintang). */
(function () {
  var $ = G.$, A = G.audio, T = STR.l2;
  var JARAK = [7, 5, 4, 3, 2];

  function mulai() {
    var POKOK = 5, nomor = 0, benar = 0, salah = 0, tingkat = 0, runBenar = 0, runSalah = 0, bantu = false, ulangan = [], tambahan = 0;

    function soal() {
      var ulang = nomor >= POKOK, m1, m2;
      if (ulang) { var u = ulangan.shift(); m1 = u[0]; m2 = u[1]; }
      else { var iv = JARAK[tingkat]; m1 = 60 + (Math.random() * 8 | 0); m2 = m1 + (Math.random() < 0.5 ? iv : -iv); }
      var jawab = m2 > m1 ? 2 : 1, sudah = false, total = POKOK + tambahan;
      nomor++;
      var tinggi = function (m) { return 18 + (m - 52) * 5; };
      G.layar(G.hud(1, Math.min(nomor - 1, POKOK), POKOK) +
        '<div class="main">' + G.nuri('p', 240) +
          '<div class="kolom">' +
            '<div class="label-soal">' + (ulang ? 'Ulangan · ' : '') + STR.soalKe(nomor, total) + '</div>' +
            G.balon(T.tanya) +
            '<div class="pilihan nada-pilihan' + (bantu || G.O.as ? ' tampak' : '') + '">' +
              [1, 2].map(function (k) {
                var m = k === 1 ? m1 : m2;
                return '<button class="kartu kartu-nada" data-a="jawab" data-k="' + k + '" disabled aria-label="' + T.nada + ' ' + k + ' lebih tinggi">' +
                  '<span class="nada-atas">' + G.ikon('snd', 30) + '<b>' + T.nada + ' ' + k + '</b></span>' +
                  '<span class="nada-bar"><i style="height:' + tinggi(m) + 'px"></i></span>' +
                  '<span class="nada-label" data-m="' + m + '"></span></button>';
              }).join('') +
            '</div>' +
            '<button class="btn btn-teal" data-a="dengar">' + G.ikon('telinga', 28) + '<span>' + T.dengar + '</span></button>' +
          '</div></div>', 'latar');

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
        var wadah = $('.nada-pilihan'); wadah.classList.add('tampak', 'ungkap');
        G.$$('.nada-label').forEach(function (s) { var m = +s.getAttribute('data-m'); s.textContent = m === Math.max(m1, m2) ? T.tinggi : T.rendah; });
        if (k === jawab) {
          if (!ulang) { benar++; runBenar++; runSalah = 0; if (runBenar >= 3 && tingkat < JARAK.length - 1) { tingkat++; runBenar = 0; } }
          bantu = false;
          el.classList.add('benar'); A.benar(); G.sorak(); G.partikel(el); G.kata(G.pilih(T.benar));
        } else {
          salah++;
          if (!ulang) { runSalah++; runBenar = 0; ulangan.push([m1, m2]); tambahan++; if (runSalah >= 2) { tingkat = Math.max(0, tingkat - 1); bantu = true; runSalah = 0; } }
          el.classList.add('salah'); A.salah(); G.goyang(el); G.bingung();
          G.kata(bantu ? T.salah2 : T.salah);
          $('.kartu-nada[data-k="' + jawab + '"]').classList.add('sorot');
          /* dengarkan ulang pasangan nada sambil melihat batang */
          G.tunda(function () { A.nyanyi(m1, 0.5, 0.16); }, 500); G.tunda(function () { A.nyanyi(m2, 0.5, 0.16); }, 1100);
        }
        G.tunda(function () {
          if (nomor < POKOK || ulangan.length) soal();
          else G.hasil(1, benar >= 4 ? 3 : benar >= 3 ? 2 : 1, T.selesai, salah);
        }, k === jawab ? 1500 : 2400);
      };
      G.test.selesaikan = function () {
        var b = $('.kartu-nada[data-k="' + jawab + '"]'); b.disabled = false; G.aksi.jawab(b);
      };
    }
    soal();
  }
  mulai.namaLayar = 'l2';
  G.LEVEL[1] = mulai;
})();
