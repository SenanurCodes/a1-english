/**
 * @fileoverview StorageService - Dışa Aktarma, İçe Aktarma ve Yedekleme Servisi
 */
export class StorageService {
  /**
   * @param {import('../infrastructure/repositories/storage-repository.js').StorageRepository} storageRepo
   */
  constructor(storageRepo) {
    this.repo = storageRepo;
  }

  exportJSON() {
    const data = this.repo.load() || {};
    return JSON.stringify(data, null, 2);
  }

  importJSON(rawJson) {
    const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Geçersiz yedek dosyası formatı.');
    }
    if (typeof parsed.xp === 'number' && parsed.xp < 0) {
      parsed.xp = 0;
    }
    this.repo.save(parsed);
    return parsed;
  }
}

export default StorageService;
