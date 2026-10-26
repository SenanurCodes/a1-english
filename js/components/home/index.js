import { createHero } from './hero.js';
import { createDashboard } from './dashboard.js';

export { createHero, createDashboard };

export function renderHome({ store, router } = {}) {
  if (typeof globalThis.screenHome === 'function' && !store) {
    return globalThis.screenHome();
  }
  const container = document.getElementById('view');
  if (!container) return;
  container.innerHTML = '';
  const state = store?.state || { name: 'Öğrenci', xp: 0 };
  container.appendChild(createHero(state));
  container.appendChild(createDashboard({ completedUnits: Object.keys(state.units || {}).length, totalUnits: 97 }));
  const btn = document.getElementById('startLesson');
  if (btn && router) {
    btn.addEventListener('click', () => router.navigate('/lesson/u1'));
  }
}
