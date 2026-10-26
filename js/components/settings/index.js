export function renderSettings() {
  if (typeof globalThis.screenSettings === 'function') return globalThis.screenSettings();
}
