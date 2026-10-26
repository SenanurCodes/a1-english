/**
 * @fileoverview Repository Pattern - UserRepository (Kullanıcı Veri Erişimi)
 */
import { User } from '../../domain/entities/user.js';

export class UserRepository {
  /**
   * @param {import('./storage-repository.js').StorageRepository} storageRepo
   */
  constructor(storageRepo) {
    this.storage = storageRepo;
  }

  save(user) {
    const current = this.storage.load() || {};
    const nextState = {
      ...current,
      userId: user.id || current.userId || 'u_guest',
      name: user.name || current.name || 'Öğrenci',
      xp: Math.max(0, Math.floor(Number(user.xp) || 0)),
      mascot: user.mascot || current.mascot || 'squirrel',
      theme: user.theme || current.theme || 'nordic',
      unlockedUpTo: Math.max(0, Math.floor(Number(user.unlockedUpTo ?? current.unlockedUpTo) || 0))
    };
    return this.storage.save(nextState);
  }

  findById(userId) {
    const data = this.storage.load();
    if (!data) return null;
    if (data.users && Array.isArray(data.users)) {
      const found = data.users.find(u => u.id === userId);
      return found ? new User(found) : null;
    }
    if (!userId || data.userId === userId) {
      return new User({
        id: data.userId || userId || 'u_guest',
        name: data.name,
        xp: data.xp,
        streakCount: data.streak?.count || 0,
        mascot: data.mascot,
        theme: data.theme,
        isPro: Boolean(data.settings?.isPro),
        unlockedUpTo: data.unlockedUpTo || 0
      });
    }
    return null;
  }

  updateProgress(userId, progress = {}) {
    const data = this.storage.load() || {};
    if (Array.isArray(data.users)) {
      const idx = data.users.findIndex(u => u.id === userId);
      if (idx >= 0) {
        data.users[idx].progress = { ...(data.users[idx].progress || {}), ...progress };
        return this.storage.save(data);
      }
    }
    if (typeof progress.xp === 'number') {
      data.xp = Math.max(0, Math.floor(progress.xp));
    }
    if (typeof progress.unlockedUpTo === 'number') {
      data.unlockedUpTo = Math.max(data.unlockedUpTo || 0, Math.floor(progress.unlockedUpTo));
    }
    return this.storage.save(data);
  }
}

export default UserRepository;
