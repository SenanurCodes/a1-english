/**
 * @fileoverview Repository Pattern - StorageRepository (localStorage / Bellek Soyutlaması)
 */
export class StorageRepository {
  /**
   * @param {string} key
   * @param {Storage} [storageDriver]
   */
  constructor(key = 'a1english_v2', storageDriver = null) {
    this.key = key;
    this._memoryFallback = new Map();
    this._driver = storageDriver || (typeof localStorage !== 'undefined' ? localStorage : null);
  }

  save(data) {
    try {
      const serialized = JSON.stringify(data);
      if (this._driver && typeof this._driver.setItem === 'function') {
        this._driver.setItem(this.key, serialized);
      } else {
        this._memoryFallback.set(this.key, serialized);
      }
      return true;
    } catch (e) {
      console.error('[StorageRepository] save failed:', e);
      return false;
    }
  }

  load() {
    try {
      const raw = (this._driver && typeof this._driver.getItem === 'function')
        ? this._driver.getItem(this.key)
        : this._memoryFallback.get(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('[StorageRepository] load failed:', e);
      return null;
    }
  }

  clear() {
    if (this._driver && typeof this._driver.removeItem === 'function') {
      this._driver.removeItem(this.key);
    }
    this._memoryFallback.delete(this.key);
  }
}

export default StorageRepository;
