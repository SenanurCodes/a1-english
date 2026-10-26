/**
 * @fileoverview ES6 Modüler AppStore - EventBus ve StorageRepository Entegreli Durum Yönetimi
 */
import { config } from './config.js';
import { eventBus } from './events.js';

export function createDefaultState() {
  return {
    schemaVersion: 1,
    userId: 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    onboarded: false,
    name: 'Öğrenci',
    mascot: config.ui.defaultMascot,
    theme: config.ui.defaultTheme,
    companion: { fedCount: 0, lastHintIdx: 0, lastGrammarIdx: 0 },
    auth: { isGuest: true, user: null, provider: 'guest' },
    xp: 0,
    streak: { count: 0, last: null },
    daily: {},
    units: {},
    unlockedUpTo: 0,
    a1BossPassed: false,
    a2Unlocked: false,
    a2BossPassed: false,
    b1Unlocked: false,
    b1BossPassed: false,
    b2Unlocked: false,
    b2BossPassed: false,
    words: {},
    mistakes: [],
    chat: [],
    aiReport: null,
    friends: [],
    leagueRoomId: null,
    leagueMembers: {},
    settings: {
      apiKey: '',
      model: config.ai.defaultModel,
      rate: 0.9,
      sound: true,
      reviewLimit: config.srs.defaultReviewLimit,
      shimeji: true,
      isPro: false,
      proPlan: null
    }
  };
}

export class AppStore {
  /**
   * @param {{ storageRepo?: any, eventBus?: any }} [deps]
   */
  constructor(deps = {}) {
    this._storageRepo = deps.storageRepo || null;
    this._eventBus = deps.eventBus || eventBus;
    this._subscribers = new Set();
    this._state = this._load();
  }

  static sanitizeXP(val, fallback = 0) {
    const num = Number(val);
    if (!Number.isFinite(num)) return Math.max(0, Math.floor(Number(fallback) || 0));
    return Math.max(0, Math.floor(num));
  }

  get state() {
    return this._state;
  }

  get xp() {
    return this._state.xp;
  }

  set xp(val) {
    this.setXP(val);
  }

  get streak() {
    return this._state.streak;
  }

  set streak(val) {
    if (val && typeof val === 'object') {
      this._state.streak = {
        count: Math.max(0, Math.floor(Number(val.count) || 0)),
        last: val.last || null
      };
      this._emit('streak:updated', this._state.streak);
    }
  }

  get name() {
    return this._state.name;
  }

  set name(val) {
    this.setName(val);
  }

  getState() {
    return this._state;
  }

  subscribe(listener) {
    this._subscribers.add(listener);
    return () => this._subscribers.delete(listener);
  }

  _emit(eventName, payload) {
    this._subscribers.forEach(fn => {
      try { fn(this._state, eventName, payload); } catch (e) {}
    });
    if (this._eventBus) {
      this._eventBus.emit(eventName, payload);
    }
  }

  save() {
    try {
      if (this._storageRepo) {
        this._storageRepo.save(this._state);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(config.app.storeKey, JSON.stringify(this._state));
      }
      this._emit('state:saved', this._state);
      return true;
    } catch (e) {
      return false;
    }
  }

  _load() {
    const d = createDefaultState();
    try {
      let loaded = null;
      if (this._storageRepo) {
        loaded = this._storageRepo.load();
      } else if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(config.app.storeKey) || localStorage.getItem(config.app.legacyStoreKey);
        if (raw) loaded = JSON.parse(raw);
      }
      if (!loaded || typeof loaded !== 'object') return d;
      return {
        ...d,
        ...loaded,
        xp: AppStore.sanitizeXP(loaded.xp, 0),
        settings: { ...d.settings, ...(loaded.settings || {}) },
        streak: { ...d.streak, ...(loaded.streak || {}) }
      };
    } catch (e) {
      return d;
    }
  }

  setXP(newXP) {
    const prev = this._state.xp;
    this._state.xp = AppStore.sanitizeXP(newXP, prev);
    this.save();
    this._emit('xp:changed', { amount: this._state.xp - prev, total: this._state.xp });
    return this._state.xp;
  }

  gainXP(amount) {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) return this._state.xp;
    const safeDelta = Math.floor(parsed);
    this._state.xp = AppStore.sanitizeXP(this._state.xp + safeDelta, 0);
    const today = new Date().toISOString().slice(0, 10);
    this._state.daily[today] = (this._state.daily[today] || 0) + safeDelta;
    if (this._state.streak.last !== today) {
      this._state.streak.count = (this._state.streak.count || 0) + 1;
      this._state.streak.last = today;
      this._emit('streak:updated', { ...this._state.streak });
    }
    this.save();
    this._emit('xp:changed', { amount: safeDelta, total: this._state.xp });
    return this._state.xp;
  }

  setName(newName) {
    if (typeof newName !== 'string') return this._state.name;
    this._state.name = newName.trim().slice(0, 32) || 'Öğrenci';
    this.save();
    return this._state.name;
  }

  setMascot(mascotId) {
    if (typeof mascotId !== 'string' || !mascotId.trim()) return;
    this._state.mascot = mascotId.trim();
    this.save();
    this._emit('mascot:changed', { mascot: this._state.mascot });
  }

  setTheme(themeId) {
    if (typeof themeId !== 'string' || !themeId.trim()) return;
    this._state.theme = themeId.trim();
    this.save();
    this._emit('theme:changed', { theme: this._state.theme });
  }
}

export const store = new AppStore();
export default store;
