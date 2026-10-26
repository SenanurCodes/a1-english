/**
 * @fileoverview ES6 Metin Biçimlendirme & XSS Sanitization Yardımcıları
 */
export function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

export function formatXP(xp) {
  const safe = Math.max(0, Math.floor(Number(xp) || 0));
  return `${safe.toLocaleString('tr-TR')} XP`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
