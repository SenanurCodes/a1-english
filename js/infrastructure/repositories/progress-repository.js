/**
 * @fileoverview Repository Pattern - ProgressRepository (Ünite ve Kelime İlerleme Takibi)
 */
export class ProgressRepository {
  /**
   * @param {import('./storage-repository.js').StorageRepository} storageRepo
   */
  constructor(storageRepo) {
    this.storage = storageRepo;
  }

  findByUser(userId) {
    const state = this.storage.load() || {};
    return {
      userId: state.userId || userId || 'u_guest',
      xp: Math.max(0, Math.floor(Number(state.xp) || 0)),
      unlockedUpTo: Math.max(0, Math.floor(Number(state.unlockedUpTo) || 0)),
      units: state.units || {},
      words: state.words || {}
    };
  }

  saveUnitResult(unitId, { score, correct, total, passed }) {
    const state = this.storage.load() || {};
    state.units = state.units || {};
    const prev = state.units[unitId] || { best: 0, attempts: 0, correct: 0, total: 0, done: false };
    state.units[unitId] = {
      best: Math.max(prev.best || 0, Math.round(score)),
      attempts: (prev.attempts || 0) + 1,
      correct: (prev.correct || 0) + (Number(correct) || 0),
      total: (prev.total || 0) + (Number(total) || 0),
      done: Boolean(prev.done || passed)
    };
    this.storage.save(state);
    return state.units[unitId];
  }
}

export default ProgressRepository;
