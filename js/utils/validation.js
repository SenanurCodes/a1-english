/**
 * @fileoverview ES6 Veri Doğrulama (Validation) Yardımcıları
 */
export function isNonNegativeNumber(val) {
  return typeof val === 'number' && Number.isFinite(val) && val >= 0;
}

export function sanitizePositiveInt(val, fallback = 0) {
  const num = Number(val);
  if (!Number.isFinite(num) || num < 0) return Math.max(0, Math.floor(Number(fallback) || 0));
  return Math.floor(num);
}

export function validateUserPayload(payload) {
  if (!payload || typeof payload !== 'object') return false;
  if ('xp' in payload && !isNonNegativeNumber(payload.xp)) return false;
  if ('name' in payload && (typeof payload.name !== 'string' || !payload.name.trim())) return false;
  return true;
}
