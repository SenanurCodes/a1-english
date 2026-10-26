/**
 * @fileoverview Genişletilebilir Plugin Mimarisi (Lifecycle: init / destroy + Hook Sistemi)
 */
export class PluginSystem {
  constructor() {
    /** @type {Map<string, any>} */
    this._plugins = new Map();
  }

  /**
   * Yeni bir eklentiyi kaydeder ve init() yaşam döngüsünü başlatır.
   * @param {{ name: string, init?: Function, destroy?: Function, hooks?: Record<string, Function> }} plugin
   */
  register(plugin) {
    if (!plugin || typeof plugin.name !== 'string' || !plugin.name.trim()) {
      throw new Error('Plugin geçerli bir "name" alanına sahip olmalıdır.');
    }
    if (this._plugins.has(plugin.name)) {
      this.unregister(plugin.name);
    }
    this._plugins.set(plugin.name, plugin);
    if (typeof plugin.init === 'function') {
      plugin.init(this);
    }
    return this;
  }

  /**
   * Eklentiyi kaldırır ve destroy() metodunu çağırır.
   * @param {string} name
   */
  unregister(name) {
    const plugin = this._plugins.get(name);
    if (!plugin) return false;
    if (typeof plugin.destroy === 'function') {
      try { plugin.destroy(); } catch (e) { console.error(`[PluginSystem] ${name} destroy hatası:`, e); }
    }
    this._plugins.delete(name);
    return true;
  }

  /**
   * İsme göre eklentiyi döndürür.
   * @param {string} name
   */
  getPlugin(name) {
    return this._plugins.get(name) || null;
  }

  /**
   * Tüm kayıtlı eklentilerde ilgili hook'u çalıştırır.
   * @param {string} hookName
   * @param {*} data
   */
  executeHook(hookName, data) {
    const results = [];
    this._plugins.forEach(plugin => {
      const hookFn = plugin.hooks?.[hookName];
      if (typeof hookFn === 'function') {
        try {
          results.push(hookFn(data));
        } catch (err) {
          console.error(`[PluginSystem] "${plugin.name}" eklentisinde "${hookName}" hatası:`, err);
        }
      }
    });
    return results;
  }
}

export const pluginSystem = new PluginSystem();
export default pluginSystem;
