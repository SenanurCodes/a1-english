export function renderAI() {
  if (typeof globalThis.screenAI === 'function') return globalThis.screenAI();
}
