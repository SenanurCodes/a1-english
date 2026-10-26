import { NavComponent } from './nav.js';
export { NavComponent };
export function renderNav(active = 'home') {
  if (typeof globalThis.renderNav === 'function') {
    return globalThis.renderNav(active);
  }
}
