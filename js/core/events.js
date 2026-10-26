/**
 * @fileoverview Event-Driven Architecture - Merkezi EventBus
 * Desteklenen olaylar: xp:changed, lesson:completed, streak:updated, theme:changed, mascot:changed, route:changed, pro:changed
 */
export class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this._events = new Map();
  }

  /**
   * Bir olaya abone olur ve abonelikten çıkma fonksiyonu döndürür.
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} unsubscribe
   */
  on(event, callback) {
    if (typeof callback !== 'function') return () => {};
    if (!this._events.has(event)) {
      this._events.set(event, new Set());
    }
    this._events.get(event).add(callback);
    return () => this.off(event, callback);
  }

  /**
   * Bir olayı yalnızca tek seferlik dinler.
   * @param {string} event
   * @param {Function} callback
   */
  once(event, callback) {
    const wrapper = (data) => {
      this.off(event, wrapper);
      callback(data);
    };
    return this.on(event, wrapper);
  }

  /**
   * Olay aboneliğini kaldırır.
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    const listeners = this._events.get(event);
    if (!listeners) return;
    listeners.delete(callback);
    if (listeners.size === 0) {
      this._events.delete(event);
    }
  }

  /**
   * Olayı tüm abonelere yayınlar.
   * @param {string} event
   * @param {*} data
   */
  emit(event, data) {
    const listeners = this._events.get(event);
    if (!listeners) return;
    [...listeners].forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error(`[EventBus] "${event}" dinleyicisinde hata:`, err);
      }
    });
  }

  /**
   * Tüm abonelikleri temizler (test ve unmount için).
   */
  clear() {
    this._events.clear();
  }
}

export const eventBus = new EventBus();
export default eventBus;
