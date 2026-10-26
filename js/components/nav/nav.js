import { BaseComponent } from '../base-component.js';
import { esc } from '../../utils/format.js';

export class NavComponent extends BaseComponent {
  constructor(container, { store, eventBus } = {}) {
    super(container);
    this.store = store;
    this.eventBus = eventBus;
  }

  render() {
    const xp = this.store?.state?.xp ?? 0;
    const streak = this.store?.state?.streak?.count ?? 0;
    const name = this.store?.state?.name ?? 'Öğrenci';
    return `
      <div class="modular-nav-bar" data-component="nav">
        <span class="modular-nav-user">${esc(name)}</span>
        <span class="modular-nav-badge" id="navXpBadge">🌰 ${xp} XP</span>
        <span class="modular-nav-badge" id="navStreakBadge">🌿 ${streak}</span>
      </div>
    `;
  }

  onMount() {
    if (this.eventBus) {
      this.addCleanup(this.eventBus.on('xp:changed', ({ total }) => {
        const el = this.container?.querySelector('#navXpBadge');
        if (el) el.textContent = `🌰 ${total} XP`;
      }));
    }
  }
}
