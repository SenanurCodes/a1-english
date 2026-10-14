(function() {
  try {
    var raw = localStorage.getItem('a1english_v2') || localStorage.getItem('a1_state_v2') || localStorage.getItem('a1_state') || '{}';
    var s = JSON.parse(raw);
    var t = s.theme || 'nordic';
    document.documentElement.setAttribute('data-theme', t);
    if (t === 'cyber' || t === 'midnight') {
      document.documentElement.setAttribute('data-mode', 'dark');
    } else {
      document.documentElement.setAttribute('data-mode', 'light');
    }
  } catch(e) {}
})();
