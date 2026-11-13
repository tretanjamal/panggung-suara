/* Titik mulai gim. */
(function () {
  addEventListener('resize', G.fit);
  G.fit();
  document.documentElement.classList.toggle('ro', !!G.O.ro);
  G.pramuat();
  G.$('#rot p').textContent = STR.putar;
  G.layarJudul();
  G.siap = true;
  /* Layar muat disembunyikan setelah font dan gambar latar siap (maks. 1,5 detik). */
  var muat = G.$('#muat'), tutup = function () { muat && muat.classList.add('hilang'); };
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(function (r) { setTimeout(r, 1500); })]).then(tutup);

  /* Kait uji untuk bot QA: hanya ada dengan ?test=1 dan tidak terlihat oleh murid. */
  if (G.TEST) {
    window.__test = {
      layar: function () { return G.layarAktif; },
      progres: function () { return JSON.parse(JSON.stringify(G.P)); },
      selesaikan: function () { if (G.test.selesaikan) { G.test.selesaikan(); return true; } return false; },
      hasil: function () { return G.test.hasil || null; },
      klik: function (a) { var el = G.$('[data-a="' + a + '"]'); if (el && !el.disabled) { el.click(); return true; } return false; }
    };
  }
})();
