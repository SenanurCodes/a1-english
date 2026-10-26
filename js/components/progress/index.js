export function renderProgress() {
  if (typeof globalThis.screenProgress === 'function') return globalThis.screenProgress();
}
