/**
 * @fileoverview Dependency Injection (DI) ServiceContainer
 */
export class ServiceContainer {
  constructor() {
    /** @type {Map<string, { factory: Function, singleton: boolean, instance: any }>} */
    this._services = new Map();
  }

  /**
   * Servis fabrikasını kaydeder.
   * @param {string} name
   * @param {Function} factory
   * @param {{ singleton?: boolean }} [options]
   */
  register(name, factory, options = { singleton: true }) {
    if (!name || typeof factory !== 'function') {
      throw new Error('Geçerli bir servis adı ve factory fonksiyonu gereklidir.');
    }
    this._services.set(name, {
      factory,
      singleton: options.singleton !== false,
      instance: undefined
    });
    return this;
  }

  /**
   * Kayıtlı servisi çözümler ve döndürür.
   * @template T
   * @param {string} name
   * @returns {T}
   */
  get(name) {
    if (!this._services.has(name)) {
      throw new Error(`Service ${name} not registered`);
    }
    const entry = this._services.get(name);
    if (entry.singleton) {
      if (entry.instance === undefined) {
        entry.instance = entry.factory(this);
      }
      return entry.instance;
    }
    return entry.factory(this);
  }

  /**
   * Servisin kayıtlı olup olmadığını kontrol eder.
   * @param {string} name
   */
  has(name) {
    return this._services.has(name);
  }

  /**
   * Singleton örneklerini sıfırlar (unit test izolasyonu için).
   */
  resetInstances() {
    this._services.forEach(entry => {
      entry.instance = undefined;
    });
  }
}

export const container = new ServiceContainer();
export default container;
