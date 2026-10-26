import { esc } from '../../utils/format.js';

export function createFeedbackBanner({ ok, message }) {
  const div = document.createElement('div');
  div.className = `feedback ${ok ? 'ok' : 'bad'}`;
  div.innerHTML = `<b>${ok ? '✅ Harika!' : '💡 Doğrusu:'}</b> <span>${esc(message || '')}</span>`;
  return div;
}
