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

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').then(function(reg) {
        console.log('A1 English SW active:', reg.scope);
      }).catch(function() {});
    });
  }
})();
