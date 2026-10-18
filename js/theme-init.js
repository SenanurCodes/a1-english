(function() {
  try {
    var raw = localStorage.getItem('a1english_v2') || localStorage.getItem('a1_state_v2') || localStorage.getItem('a1_state') || '{}';
    var s = JSON.parse(raw);
    var t = localStorage.getItem('a1_theme_id') || s.theme || 'nordic';
    document.documentElement.setAttribute('data-theme', t);

    // Tek kaynak: ThemeService.apply() tarafından kaydedilen 'a1_data_mode' okunur
    var mode = localStorage.getItem('a1_data_mode') || 'light';
    document.documentElement.setAttribute('data-mode', mode);

    var fbCfg = localStorage.getItem('a1_firebase_config');
    if (fbCfg) {
      try {
        var p = JSON.parse(fbCfg);
        if (!p || !p.apiKey) localStorage.removeItem('a1_firebase_config');
      } catch(e) {
        localStorage.removeItem('a1_firebase_config');
      }
    }
  } catch(e) {}

  var isTestRunner = typeof navigator !== 'undefined' && (navigator.webdriver || location.search.indexOf('test=') !== -1 || window.__TEST__);
  if (isTestRunner && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(regs) {
      for (var i = 0; i < regs.length; i++) regs[i].unregister();
    });
    if (typeof caches !== 'undefined') {
      caches.keys().then(function(names) {
        for (var i = 0; i < names.length; i++) caches.delete(names[i]);
      });
    }
  } else if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    // Yeni sürüm bekliyorsa ekranın altında "Güncelle" bandı göster
    var showUpdateBanner = function(worker) {
      if (!worker || document.getElementById('sw-update-banner')) return;
      var bar = document.createElement('div');
      bar.id = 'sw-update-banner';
      bar.className = 'sw-update-banner';
      bar.setAttribute('role', 'status');
      bar.innerHTML = '<span>✨ PatiLingo\'nun yeni sürümü hazır.</span>' +
        '<button type="button" class="btn btn-primary sm" id="sw-update-btn">Güncelle</button>';
      document.body.appendChild(bar);
      document.getElementById('sw-update-btn').onclick = function() {
        this.disabled = true;
        this.textContent = 'Güncelleniyor...';
        worker.postMessage({ type: 'SKIP_WAITING' });
      };
    };

    // Yeni SW kontrolü aldığında bir kez yenile (ilerleme localStorage'da güvende)
    var hadController = !!navigator.serviceWorker.controller;
    var reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (!hadController || reloading) return;
      reloading = true;
      location.reload();
    });

    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').then(function(reg) {
        if (reg.waiting && navigator.serviceWorker.controller) showUpdateBanner(reg.waiting);
        reg.addEventListener('updatefound', function() {
          var nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', function() {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(nw);
          });
        });
        // Uygulama uzun süre açık kalırsa saatte bir güncelleme kontrolü
        setInterval(function() { reg.update().catch(function() {}); }, 60 * 60 * 1000);
      }).catch(function(e) { console.warn('SW kaydı başarısız:', e); });
    });
  }
})();
