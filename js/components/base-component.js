/**
 * @fileoverview BaseComponent - Yaşam Döngüsü (mount, update, unmount) ve Event Temizliği
 */
export class BaseComponent {
  /**
   * @param {HTMLElement|null} [container]
   */
  constructor(container = null) {
    this.container = container;
    this._cleanups = [];
    this.isMounted = false;
  }

  /**
   * Bileşen unmount edildiğinde otomatik temizlenecek abonelik/dinleyici ekler.
   * @param {Function} cleanupFn
   */
  addCleanup(cleanupFn) {
    if (typeof cleanupFn === 'function') {
      this._cleanups.push(cleanupFn);
    }
  }

  /**
   * DOM elemanı üzerinde olay dinleyicisi başlatır ve unmount sırasında otomatik kaldırır.
   */
  listen(target, event, handler, options) {
    if (!target || typeof target.addEventListener !== 'function') return;
    target.addEventListener(event, handler, options);
    this.addCleanup(() => target.removeEventListener(event, handler, options));
  }

  render() {
    return '';
  }

  mount(container = this.container) {
    if (container) this.container = container;
    if (this.container) {
      const output = this.render();
      if (typeof output === 'string') {
        this.container.innerHTML = output;
      } else if (output instanceof HTMLElement) {
        this.container.innerHTML = '';
        this.container.appendChild(output);
      }
    }
    this.isMounted = true;
    this.onMount();
    return this;
  }

  update(nextProps = {}) {
    this.props = { ...(this.props || {}), ...nextProps };
    if (this.isMounted && this.container) {
      this.mount(this.container);
    }
    return this;
  }

  unmount() {
    while (this._cleanups.length > 0) {
      const fn = this._cleanups.pop();
      try { fn(); } catch (_) {}
    }
    this.isMounted = false;
    this.onUnmount();
  }

  onMount() {}
  onUnmount() {}
}

export default BaseComponent;
