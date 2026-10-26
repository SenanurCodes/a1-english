/* ============================================================
   A1 English v2.0 - OOP Durum Yönetimi & Servisler
   Store (Kapsüllenmiş Durum), ThemeService, MascotService, ProgressionManager
   ============================================================ */

let syncManager = null;
const STORE_KEY = 'a1english_v2';
const LEGACY_STORE_KEY = 'a1english_v1';
const SRS_INTERVALS = [0, 1, 2, 4, 7, 15, 30]; // gün (Leitner kutuları)

function defaultState() {
  return {
    schemaVersion: 1,
    userId: 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    onboarded: false,
    name: 'Öğrenci',
    mascot: 'squirrel',    // 'squirrel', 'cat', 'dog', 'owl', 'panda'
    theme: 'nordic',       // 'nordic', 'cyber', 'sunset', 'ocean'
    companion: {
      fedCount: 0,
      lastHintIdx: 0,
      lastGrammarIdx: 0
    },
    auth: {
      isGuest: true,
      user: null,          // { uid, email, displayName, photoURL }
      provider: 'guest'    // 'guest', 'google', 'password'
    },
    xp: 0,
    streak: { count: 0, last: null },
    daily: {},            // { '2026-10-14': xp }
    units: {},            // { unitId: { best, attempts, correct, total, done } }
    unlockedUpTo: 0,      // bu indekse kadar (dahil) üniteler açık
    a1BossPassed: false,  // Candy Crush Boss Sınavı tamamlandı mı?
    a2Unlocked: false,    // A2 dünyası açık mı?
    a2BossPassed: false,  // A2 Final tamamlandı mı?
    b1Unlocked: false,    // B1 dünyası açık mı?
    b1BossPassed: false,  // B1 Final tamamlandı mı?
    b2Unlocked: false,    // B2 dünyası açık mı?
    b2BossPassed: false,  // B2 Final tamamlandı mı?
    words: {},            // { key: { box, due, right, wrong } }
    mistakes: [],         // son hatalar
    chat: [],             // AI sohbet geçmişi
    aiReport: null,       // { text, at }
    friends: [],          // Kod ile eklenen gerçek arkadaşlar
    leagueRoomId: null,   // Canlı senkronize lig oda ID'si
    leagueMembers: {},    // Canlı lig üyeleri { userId: { id, name, xp, streak, unitsDone, avatar, mascot, lastActive } }
    settings: { apiKey: '', model: 'gemini-2.5-flash', rate: 0.9, sound: true, reviewLimit: 25, shimeji: true, isPro: false, proPlan: null }
  };
}

/* ============================================================
   OOP: AppStore Sınıfı (Encapsulated State Manager)
   ============================================================ */
class AppStore {
  constructor() {
    this._subscribers = new Set();
    this._state = this._load();
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
    if (!this._state.streak || typeof this._state.streak !== 'object') {
      this._state.streak = { count: 0, last: null };
    }
    return this._state.streak;
  }

  set streak(val) {
    if (val && typeof val === 'object') {
      this._state.streak = {
        count: Math.max(0, Math.floor(Number(val.count) || 0)),
        last: val.last || null
      };
      this._notify('STREAK_CHANGE', this._state.streak);
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

  _notify(action, payload) {
    this._subscribers.forEach(fn => {
      try { fn(this._state, action, payload); } catch (e) { console.error('Store subscriber error:', e); }
    });
    if (typeof window !== 'undefined' && window.PatiLingoArch && window.PatiLingoArch.eventBus) {
      const eventMap = {
        GAIN_XP: 'xp:changed',
        SET_XP: 'xp:changed',
        MASCOT_CHANGE: 'mascot:changed',
        THEME_CHANGE: 'theme:changed',
        STREAK_CHANGE: 'streak:updated',
        PRO_CHANGE: 'pro:changed'
      };
      const mapped = eventMap[action] || `store:${String(action).toLowerCase()}`;
      window.PatiLingoArch.eventBus.emit(mapped, payload);
    }
  }

  save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this._state));
      this._notify('SAVE', this._state);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  _migrate(data, fromVer, toVer) {
    let current = { ...data };
    console.info(`[Store Migration] Veri göçü uygulanıyor: v${fromVer} -> v${toVer}`);

    // v0 -> v1: schemaVersion ekleme, temel veri bütünlüğü garantisi
    if (fromVer < 1 && toVer >= 1) {
      current.schemaVersion = 1;
      if (!current.auth) current.auth = defaultState().auth;
      if (!current.daily) current.daily = {};
      if (!current.units) current.units = {};
      if (!current.words) current.words = {};
      if (!Array.isArray(current.friends)) current.friends = [];
      else current.friends = current.friends.filter(f => f && !f.isBot);
      if (!current.leagueMembers) current.leagueMembers = {};
      fromVer = 1;
    }

    current.schemaVersion = toVer;
    return current;
  }

  _load() {
    try {
      // 1. Önce v2 key'i kontrol et
      let raw = localStorage.getItem(STORE_KEY);
      // 2. Yoksa v1'den otomatik migrate et
      if (!raw) {
        raw = localStorage.getItem(LEGACY_STORE_KEY);
      }
      if (!raw) return defaultState();

      let s = JSON.parse(raw);
      const currentVersion = s.schemaVersion || 0;
      const targetVersion = 1;

      // Sıralı geçiş (Migration) mekanizması
      if (currentVersion < targetVersion) {
        s = this._migrate(s, currentVersion, targetVersion);
        try {
          localStorage.setItem(STORE_KEY, JSON.stringify(s));
        } catch (e) {}
      }

      const d = defaultState();
      const cleanFriends = (s.friends || []).filter(f => f && !f.isBot);
      const userId = s.userId || d.userId;
      const mascot = s.mascot || 'squirrel';
      const theme = s.theme || 'nordic';

      // Doğal Candy Crush / Duolingo kilit mekanizması:
      // Kullanıcının henüz tamamlamadığı üniteler kilitli (🔒) kalır.
      let highestDone = -1;
      if (s.units && typeof s.units === 'object') {
        Object.entries(s.units).forEach(([uid, ustat]) => {
          if (ustat && (ustat.done || (ustat.best >= 70))) {
            const u = (typeof UNIT_BY_ID !== 'undefined' && UNIT_BY_ID[uid]);
            if (u) highestDone = Math.max(highestDone, u.index);
          }
        });
      }
      const realUnlocked = Math.max(0, highestDone + 1);
      const a1BossPassed = Boolean(s.a1BossPassed);
      const a2Unlocked = Boolean(s.a2Unlocked || a1BossPassed);
      const a2BossPassed = Boolean(s.a2BossPassed);
      const b1Unlocked = Boolean(s.b1Unlocked || a2BossPassed);
      const b1BossPassed = Boolean(s.b1BossPassed);
      const b2Unlocked = Boolean(s.b2Unlocked || b1BossPassed);
      const b2BossPassed = Boolean(s.b2BossPassed);
      let unlockedUpTo = Math.min(s.unlockedUpTo ?? 0, realUnlocked);
      if (b2Unlocked) unlockedUpTo = Math.max(unlockedUpTo, 72);
      else if (b1Unlocked) unlockedUpTo = Math.max(unlockedUpTo, 52);
      else if (a2Unlocked) unlockedUpTo = Math.max(unlockedUpTo, 27);

      const safeXP = Number.isFinite(Number(s.xp)) ? Math.max(0, Math.floor(Number(s.xp))) : 0;
      return {
        ...d,
        ...s,
        xp: safeXP,
        a1BossPassed,
        a2Unlocked,
        a2BossPassed,
        b1Unlocked,
        b1BossPassed,
        b2Unlocked,
        b2BossPassed,
        unlockedUpTo,
        schemaVersion: targetVersion,
        userId,
        mascot,
        theme,
        companion: { ...d.companion, ...(s.companion || {}) },
        auth: { ...d.auth, ...(s.auth || {}) },
        leagueRoomId: s.leagueRoomId || null,
        leagueMembers: s.leagueMembers || {},
        settings: { ...d.settings, ...(s.settings || {}), reviewLimit: (s.settings && s.settings.reviewLimit) ? s.settings.reviewLimit : 25 },
        streak: { ...d.streak, ...(s.streak || {}) },
        friends: cleanFriends
      };
    } catch (e) {
      console.warn('[Store] _load hatası, defaultState yükleniyor:', e);
      try {
        const raw = localStorage.getItem(STORE_KEY) || localStorage.getItem(LEGACY_STORE_KEY);
        if (raw) {
          localStorage.setItem('a1english_v2_corrupt_' + Date.now(), raw);
        }
      } catch (errBackup) {}
      return defaultState();
    }
  }

  // Veri Doğrulama Yardımcıları (Setter Validation)
  static sanitizeXP(val, fallback = 0) {
    const num = Number(val);
    if (!Number.isFinite(num)) return Math.max(0, Math.floor(Number(fallback) || 0));
    return Math.max(0, Math.floor(num));
  }

  setXP(newXP) {
    const validXP = AppStore.sanitizeXP(newXP, this._state.xp);
    this._state.xp = validXP;
    this.save();
    this._notify('SET_XP', { total: this._state.xp });
    return this._state.xp;
  }

  setName(newName) {
    if (typeof newName !== 'string') return this._state.name;
    const cleaned = newName.trim().slice(0, 32);
    this._state.name = cleaned || 'Öğrenci';
    this.save();
    this._notify('NAME_CHANGE', this._state.name);
    return this._state.name;
  }

  setProStatus(isPro, plan = 'monthly') {
    if (!this._state.settings || typeof this._state.settings !== 'object') {
      this._state.settings = defaultState().settings;
    }
    this._state.settings.isPro = Boolean(isPro);
    this._state.settings.proPlan = isPro ? String(plan || 'monthly') : null;
    try {
      localStorage.setItem('patilingo_is_pro', isPro ? 'true' : 'false');
      if (isPro && plan) localStorage.setItem('patilingo_pro_plan', String(plan));
    } catch (_) {}
    this.save();
    this._notify('PRO_CHANGE', { isPro: this._state.settings.isPro, plan: this._state.settings.proPlan });
    return this._state.settings.isPro;
  }

  // Mutasyon / Eylem Metotları (Action Methods)
  setAuth(user, isGuest = false, provider = 'guest') {
    const safeUser = (user && typeof user === 'object') ? user : null;
    const safeProvider = typeof provider === 'string' && provider.trim() ? provider.trim() : 'guest';
    this._state.auth = {
      isGuest: Boolean(isGuest),
      user: safeUser,
      provider: safeProvider
    };
    if (safeUser && typeof safeUser.displayName === 'string' && safeUser.displayName.trim() && (!this._state.name || this._state.name === 'Öğrenci')) {
      this._state.name = safeUser.displayName.trim().slice(0, 32);
    }
    this.save();
    this._notify('AUTH_CHANGE', this._state.auth);
  }

  setMascot(mascotId) {
    if (typeof mascotId === 'string' && MASCOT_BY_ID && MASCOT_BY_ID[mascotId]) {
      this._state.mascot = mascotId;
      this._state.avatar = MASCOT_BY_ID[mascotId].icon;
      this.save();
      this._notify('MASCOT_CHANGE', mascotId);
    } else {
      console.warn('[AppStore] Geçersiz maskot ID reddedildi:', mascotId);
    }
  }

  setTheme(themeId) {
    if (typeof themeId === 'string' && PALETTE_BY_ID && PALETTE_BY_ID[themeId]) {
      this._state.theme = themeId;
      this.save();
      this._notify('THEME_CHANGE', themeId);
    } else {
      console.warn('[AppStore] Geçersiz tema ID reddedildi:', themeId);
    }
  }

  gainXP(amount) {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      console.warn('[AppStore] Geçersiz veya negatif XP artışı engellendi:', amount);
      this._state.xp = AppStore.sanitizeXP(this._state.xp, 0);
      return this._state.xp;
    }
    const safeDelta = Math.floor(parsed);
    this._state.xp = AppStore.sanitizeXP((Number(this._state.xp) || 0) + safeDelta, 0);
    const t = todayStr();
    const prevDaily = Number.isFinite(Number(this._state.daily[t])) ? Math.max(0, Number(this._state.daily[t])) : 0;
    this._state.daily[t] = prevDaily + safeDelta;
    if (this._state.streak.last !== t) {
      this._state.streak.count = this._state.streak.last === daysAgoStr(1) ? this._state.streak.count + 1 : 1;
      this._state.streak.last = t;
    }
    this.save();
    this._notify('GAIN_XP', { amount, total: this._state.xp });
    if (typeof syncManager !== 'undefined') {
      if (!navigator.onLine) {
        syncManager.markPending();
      } else {
        syncManager.syncNow(false);
      }
    } else if (this._state.leagueRoomId && typeof syncCloudLeague === 'function') {
      syncCloudLeague().catch(() => {});
    }
  }

  passA1Boss() {
    const isFirstTime = !this._state.a1BossPassed;
    this._state.a1BossPassed = true;
    this._state.a2Unlocked = true;
    this._state.unlockedUpTo = Math.max(this._state.unlockedUpTo, 27);
    this.gainXP(isFirstTime ? 200 : 25);
    this.save();
    this._notify('A1_BOSS_PASSED', null);
  }

  passA2Boss() {
    const isFirstTime = !this._state.a2BossPassed;
    this._state.a2BossPassed = true;
    this._state.b1Unlocked = true;
    this._state.unlockedUpTo = Math.max(this._state.unlockedUpTo, 52);
    this.gainXP(isFirstTime ? 300 : 30);
    this.save();
    this._notify('A2_BOSS_PASSED', null);
  }

  passB1Boss() {
    const isFirstTime = !this._state.b1BossPassed;
    this._state.b1BossPassed = true;
    this._state.b2Unlocked = true;
    this._state.unlockedUpTo = Math.max(this._state.unlockedUpTo, 72);
    this.gainXP(isFirstTime ? 400 : 40);
    this.save();
    this._notify('B1_BOSS_PASSED', null);
  }

  passB2Boss() {
    const isFirstTime = !this._state.b2BossPassed;
    this._state.b2BossPassed = true;
    this.gainXP(isFirstTime ? 500 : 50);
    this.save();
    this._notify('B2_BOSS_PASSED', null);
  }

  unlockA2() {
    this._state.a1BossPassed = true;
    this._state.a2Unlocked = true;
    const maxIdx = (typeof UNITS !== 'undefined' && Array.isArray(UNITS)) ? UNITS.length - 1 : 51;
    this._state.unlockedUpTo = Math.max(this._state.unlockedUpTo, maxIdx);
    this.save();
    this._notify('STATE_CHANGED', this._state);
  }

  lockA2() {
    this._state.a1BossPassed = false;
    this._state.a2Unlocked = false;
    this._state.unlockedUpTo = Math.min(this._state.unlockedUpTo, 26);
    this.save();
    this._notify('STATE_CHANGED', this._state);
  }

  importState(data) {
    if (!data || typeof data !== 'object') throw new Error('Geçersiz dosya verisi');
    const currentApiKey = this._state.settings?.apiKey || '';
    const cleanFriends = (data.friends || []).filter(f => !f.isBot);

    // Akıllı Birleştirme: Mevcut ve gelen veriler harmanlanır (hiçbir ilerleme kaybolmaz)
    const mergedUnits = { ...(this._state.units || {}) };
    if (data.units && typeof data.units === 'object') {
      for (const [uId, uVal] of Object.entries(data.units)) {
        if (!mergedUnits[uId]) {
          mergedUnits[uId] = uVal;
        } else {
          mergedUnits[uId] = {
            ...mergedUnits[uId],
            best: Math.max(mergedUnits[uId].best || 0, uVal.best || 0),
            done: mergedUnits[uId].done || uVal.done || ((uVal.best || 0) >= 70),
            attempts: Math.max(mergedUnits[uId].attempts || 1, uVal.attempts || 1),
            correct: Math.max(mergedUnits[uId].correct || 0, uVal.correct || 0),
            total: Math.max(mergedUnits[uId].total || 10, uVal.total || 10)
          };
        }
      }
    }

    const mergedWords = { ...(this._state.words || {}) };
    if (data.words && typeof data.words === 'object') {
      for (const [wKey, wVal] of Object.entries(data.words)) {
        if (!mergedWords[wKey]) {
          mergedWords[wKey] = wVal;
        } else {
          mergedWords[wKey] = {
            ...mergedWords[wKey],
            box: Math.max(mergedWords[wKey].box || 1, wVal.box || 1),
            right: Math.max(mergedWords[wKey].right || 0, wVal.right || 0),
            wrong: Math.max(mergedWords[wKey].wrong || 0, wVal.wrong || 0)
          };
        }
      }
    }

    const mergedDaily = { ...(this._state.daily || {}) };
    if (data.daily && typeof data.daily === 'object') {
      for (const [dKey, dVal] of Object.entries(data.daily)) {
        mergedDaily[dKey] = Math.max(mergedDaily[dKey] || 0, dVal || 0);
      }
    }

    const mergedXp = Math.max(this._state.xp || 0, data.xp || 0);
    const incStreak = typeof normalizeStreak === 'function' ? normalizeStreak(data.streak) : (data.streak?.count || 0);
    const myStreak = this._state.streak?.count || 0;
    const finalStreakCount = Math.max(myStreak, incStreak);
    const finalStreakLast = incStreak >= myStreak && data.streak?.last ? data.streak.last : this._state.streak?.last;

    this._state = {
      ...defaultState(),
      ...this._state,
      ...data,
      userId: (data.userId && data.userId !== 'Öğrenci') ? data.userId : this._state.userId,
      name: (data.name && data.name !== 'Öğrenci') ? data.name : (this._state.name || 'Öğrenci'),
      mascot: data.mascot || this._state.mascot || 'cat',
      theme: data.theme || this._state.theme || 'nordic',
      xp: mergedXp,
      streak: { count: finalStreakCount, last: finalStreakLast || todayStr() },
      daily: mergedDaily,
      units: mergedUnits,
      words: mergedWords,
      unlockedUpTo: Math.max(this._state.unlockedUpTo || 0, data.unlockedUpTo || 0),
      a1BossPassed: !!(this._state.a1BossPassed || data.a1BossPassed),
      a2Unlocked: !!(this._state.a2Unlocked || data.a2Unlocked),
      a2BossPassed: !!(this._state.a2BossPassed || data.a2BossPassed),
      b1Unlocked: !!(this._state.b1Unlocked || data.b1Unlocked),
      b1BossPassed: !!(this._state.b1BossPassed || data.b1BossPassed),
      b2Unlocked: !!(this._state.b2Unlocked || data.b2Unlocked),
      b2BossPassed: !!(this._state.b2BossPassed || data.b2BossPassed),
      auth: { ...defaultState().auth, ...(this._state.auth?.user ? this._state.auth : (data.auth || {})) },
      settings: {
        ...defaultState().settings,
        ...(data.settings || {}),
        apiKey: currentApiKey || data.settings?.apiKey || ''
      },
      friends: cleanFriends.length > 0 ? cleanFriends : (this._state.friends || [])
    };
    if (typeof themeService !== 'undefined' && this._state.theme) {
      themeService.apply(this._state.theme);
    }
    if (typeof migrateCompletedUnitsWords === 'function') {
      migrateCompletedUnitsWords();
    }
    this.save();
    if (typeof syncManager !== 'undefined') {
      if (!navigator.onLine) {
        syncManager.markPending();
      } else {
        syncManager.syncNow(false);
      }
    }
    this._notify('IMPORT', this._state);
    return this._state;
  }
}

// Global Store Instance
const store = new AppStore();

// İki veri kaynağını teke indiren dinamik Proxy köprüsü:
// 'state' üzerinden yapılan tüm okuma ve yazmalar anında 'store.state'e yönlendirilir.
// Bu sayede 'state' değişkeni hiçbir zaman bayat (stale) kalamaz.
const state = new Proxy({}, {
  get(target, prop) {
    return store.state[prop];
  },
  set(target, prop, value) {
    if (prop === 'xp') {
      store.state.xp = AppStore.sanitizeXP(value, store.state.xp);
      return true;
    }
    if (prop === 'unlockedUpTo') {
      const num = Number(value);
      store.state.unlockedUpTo = Number.isFinite(num) ? Math.max(0, Math.floor(num)) : (store.state.unlockedUpTo || 0);
      return true;
    }
    if (prop === 'name') {
      store.state.name = (typeof value === 'string' && value.trim()) ? value.trim().slice(0, 32) : 'Öğrenci';
      return true;
    }
    store.state[prop] = value;
    return true;
  },
  has(target, prop) {
    return prop in store.state;
  },
  ownKeys(target) {
    return Reflect.ownKeys(store.state);
  },
  getOwnPropertyDescriptor(target, prop) {
    return Object.getOwnPropertyDescriptor(store.state, prop);
  }
});

/* ============================================================
   OOP: ThemeService (Renk Paletleri & Tasarım Yönetimi)
   ============================================================ */
class ThemeService {
  constructor(appStore) {
    this.store = appStore;
  }

  init() {
    const current = this.store.state.theme || 'nordic';
    this.apply(current);
  }

  apply(themeId) {
    const palette = (PALETTE_BY_ID && PALETTE_BY_ID[themeId]) || PALETTES[0];
    if (!palette) return;

    const root = document.documentElement;
    root.setAttribute('data-theme', palette.id);
    const mode = palette.isDark ? 'dark' : 'light';
    root.setAttribute('data-mode', mode);

    try {
      localStorage.setItem('a1_data_mode', mode);
      localStorage.setItem('a1_theme_id', palette.id);
    } catch (e) {}
    root.style.setProperty('--bg', palette.colors.bg);
    root.style.setProperty('--background', palette.colors.bg);
    root.style.setProperty('--card', palette.colors.cardBg);
    root.style.setProperty('--card-bg', palette.colors.cardBg);
    root.style.setProperty('--surface', palette.colors.cardBg);
    root.style.setProperty('--card-hover', palette.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.05)');
    root.style.setProperty('--text', palette.colors.text);
    root.style.setProperty('--muted', palette.colors.muted);
    root.style.setProperty('--text-muted', palette.colors.muted);
    root.style.setProperty('--line', palette.colors.line);
    root.style.setProperty('--border', palette.colors.line);
    root.style.setProperty('--accent', palette.colors.accent);
    root.style.setProperty('--accent-d', palette.colors.accentD);
    root.style.setProperty('--primary', palette.colors.primary);
    root.style.setProperty('--primary-d', palette.colors.primaryD);
    root.style.setProperty('--primary-soft', palette.colors.primarySoft || 'rgba(99, 102, 241, 0.14)');
    if (palette.colors.catKelime) root.style.setProperty('--cat-kelime', palette.colors.catKelime);
    if (palette.colors.catGramer) root.style.setProperty('--cat-gramer', palette.colors.catGramer);
    if (palette.colors.catMantik) root.style.setProperty('--cat-mantik', palette.colors.catMantik);
    if (palette.colors.catRekabet) root.style.setProperty('--cat-rekabet', palette.colors.catRekabet);
    if (palette.colors.catAi) root.style.setProperty('--cat-ai', palette.colors.catAi);
    if (palette.colors.catTekrar) root.style.setProperty('--cat-tekrar', palette.colors.catTekrar);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', palette.colors.bg);

    if (this.store.state.theme !== palette.id) {
      this.store.setTheme(palette.id);
    }
  }

  getCurrentPalette() {
    const id = this.store.state.theme || 'nordic';
    return (PALETTE_BY_ID && PALETTE_BY_ID[id]) || PALETTES[0];
  }
}

const themeService = new ThemeService(store);
themeService.init();

/* ============================================================
   OOP: MascotService (Yoldaş Hayvan Yönetimi)
   ============================================================ */
class MascotService {
  constructor(appStore) {
    this.store = appStore;
  }

  getActive() {
    const id = this.store.state.mascot || 'squirrel';
    return (MASCOT_BY_ID && MASCOT_BY_ID[id]) || MASCOTS[0];
  }

  getEncouragements() {
    const m = this.getActive();
    return (m.encouragements && m.encouragements.length > 0) ? m.encouragements : [m.motto];
  }

  getRandomEncouragement() {
    const list = this.getEncouragements();
    return list[Math.floor(Math.random() * list.length)];
  }

  getSquirrelGrowth(customXP) {
    const xp = typeof customXP === 'number' ? Math.max(0, customXP) : Math.max(0, this.store.state.xp || 0);
    const wordsCount = Object.keys(this.store.state.words || {}).length;
    const acorns = wordsCount + Math.floor(xp / 15) + ((this.store.state.companion && this.store.state.companion.fedCount) || 0);
    const active = this.getActive();
    const stages = (active && Array.isArray(active.stages) && active.stages.length)
      ? active.stages
      : ((typeof SQUIRREL_STAGES !== 'undefined' && Array.isArray(SQUIRREL_STAGES)) ? SQUIRREL_STAGES : []);
    let current = stages[0] || { stage: 1, id: 'baby', title: 'Minik Yavru', badge: '🍼 Evre 1/5', minXP: 0, nextXP: 100, perkTitle: 'Kelime Fısıltısı', desc: '' };
    for (const st of stages) {
      if (xp >= st.minXP) current = st;
    }
    let stagePct = 100;
    let xpLeft = 0;
    if (current.nextXP !== null) {
      const span = Math.max(1, current.nextXP - current.minXP);
      stagePct = Math.min(100, Math.max(0, Math.round(((xp - current.minXP) / span) * 100)));
      xpLeft = Math.max(0, current.nextXP - xp);
    }
    return {
      ...current,
      xp,
      wordsCount,
      acorns,
      stagePct,
      xpLeft,
      totalStages: stages.length || 5
    };
  }

  select(id) {
    this.store.setMascot(id);
  }
}

const mascotService = new MascotService(store);
function getSquirrelGrowth(customXP) {
  return mascotService.getSquirrelGrowth(customXP);
}

/* ============================================================
   OOP: ProgressionManager (Candy Crush Harita & Kilit Motoru)
   ============================================================ */
class ProgressionManager {
  constructor(appStore) {
    this.store = appStore;
  }

  isA1Complete() {
    return doneCount() >= UNITS.length;
  }

  canTakeA1Boss() {
    return this.isA1Complete() && !this.store.state.a1BossPassed;
  }

  isA2Unlocked() {
    return !!this.store.state.a2Unlocked;
  }
}

const progressionManager = new ProgressionManager(store);

/* ============================================================
   Tarih & Genel Fonksiyonlar (Geriye Uyumluluk Köprüsü)
   ============================================================ */
function saveState() {
  store.save();
  if (typeof syncManager !== 'undefined') {
    if (!navigator.onLine) {
      syncManager.markPending();
    } else {
      syncManager.syncNow(false);
    }
  }
}

function resetState() {
  const settings = state.settings;
  const d = defaultState();
  d.settings = settings;
  store._state = d;
  saveState();
}

function todayStr(d = new Date()) {
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

function daysAgoStr(n) {
  const d = new Date(); d.setDate(d.getDate() - n); return todayStr(d);
}

function addXP(amount) {
  store.gainXP(amount);
}

function currentStreak() {
  const { count, last } = state.streak;
  if (last === todayStr() || last === daysAgoStr(1)) return count;
  return 0;
}

function xpLevel() {
  const per = 150;
  const level = Math.floor(state.xp / per) + 1;
  return { level, into: state.xp % per, per };
}

function unitStats(id) {
  // Eski tek 'numbers' id'si kaydedilmişse otomatik numbers_0_50'ye eşleştir
  if (id === 'numbers' && !state.units['numbers'] && state.units['numbers_0_50']) {
    return state.units['numbers_0_50'];
  }
  return state.units[id] || { best: 0, attempts: 0, correct: 0, total: 0, done: false };
}

function isUnlocked(index) {
  return index <= state.unlockedUpTo;
}

function recordUnitResult(unitId, correct, total) {
  const safeTotal = Number.isFinite(total) && total > 0 ? Math.floor(total) : 0;
  const safeCorrect = Number.isFinite(correct) && correct >= 0 ? Math.min(Math.floor(correct), safeTotal) : 0;
  const s = { ...unitStats(unitId) };
  const pct = safeTotal > 0 ? Math.round((safeCorrect / safeTotal) * 100) : 0;
  s.attempts += 1;
  s.correct += safeCorrect;
  s.total += safeTotal;
  s.best = Math.max(s.best || 0, pct);
  s.lastAt = Date.now();
  if (pct >= 70) {
    s.done = true;
    const u = UNIT_BY_ID[unitId];
    if (u) {
      state.unlockedUpTo = Math.max(state.unlockedUpTo, Math.min(u.index + 1, UNITS.length - 1));
    }
    syncUnitWordsToBox1(unitId);
  }
  state.units[unitId] = s;
  saveState();
  return pct;
}

function doneCount(level) {
  if (level) return UNITS.filter(u => u.level === level && unitStats(u.id).done).length;
  return UNITS.filter(u => unitStats(u.id).done).length;
}

function levelInfo() {
  const countA1 = (typeof UNITS !== 'undefined' ? UNITS.filter(u => u.level === 'A1').length : 27) || 27;
  const countA2 = (typeof UNITS !== 'undefined' ? UNITS.filter(u => u.level === 'A2').length : 25) || 25;
  const countB1 = (typeof UNITS !== 'undefined' ? UNITS.filter(u => u.level === 'B1').length : 22) || 22;
  const countB2 = (typeof UNITS !== 'undefined' ? UNITS.filter(u => u.level === 'B2').length : 23) || 23;

  const doneA1 = doneCount('A1');
  const doneA2 = doneCount('A2');
  const doneB1 = doneCount('B1');
  const doneB2 = doneCount('B2');
  const totalDone = doneA1 + doneA2 + doneB1 + doneB2;

  const pctA1 = Math.round((doneA1 / countA1) * 100);
  const pctA2 = Math.round((doneA2 / countA2) * 100);
  const pctB1 = Math.round((doneB1 / countB1) * 100);
  const pctB2 = Math.round((doneB2 / countB2) * 100);

  let label, desc, activePct = pctA1;
  if (state.b2Unlocked || state.b1BossPassed) {
    activePct = pctB2;
    if (pctB2 === 0) { label = 'B2 · Ustalık Başladı'; desc = 'İleri düzey kalıplar ve nüanslara hoş geldin! 👑'; }
    else if (pctB2 < 50) { label = 'B2.1 · İleri Yetkinlik'; desc = 'Karmaşık argümanları akıcı ifade ediyorsun.'; }
    else if (pctB2 < 100) { label = 'B2.2 · Zirve Ustalığı'; desc = 'B2 Büyük Finali çok yakında!'; }
    else { label = 'B2 İngilizce Ustası 🏆'; desc = 'Tebrikler! Dört seviyeyi de eksiksiz tamamladın!'; }
  } else if (state.b1Unlocked || state.a2BossPassed) {
    activePct = pctB1;
    if (pctB1 === 0) { label = 'B1 · Bağımsız İletişim'; desc = 'Edilgen çatı ve dolaylı anlatıma hoş geldin! ⚡'; }
    else if (pctB1 < 50) { label = 'B1.1 · Orta Seviye Akıcılık'; desc = 'İş ve günlük hayatta bağımsızca konuşabiliyorsun.'; }
    else if (pctB1 < 100) { label = 'B1.2 · İleri Yolculuk'; desc = 'B1 Final Sınavı kapıda!'; }
    else { label = 'B1 Tamamlandı 🌟'; desc = 'Harika! B2 İleri Düzey seviyesine hazırsın!'; }
  } else if (state.a2Unlocked || state.a1BossPassed) {
    activePct = pctA2;
    if (pctA2 === 0) { label = 'A2 · Macera Başladı'; desc = 'Geçmiş zaman ve seyahat kalıplarına hoş geldin! 🚀'; }
    else if (pctA2 < 50) { label = 'A2.1 · Akıcı İletişim'; desc = 'Geçmiş ve geleceği rahatça konuşabiliyorsun.'; }
    else if (pctA2 < 100) { label = 'A2.2 · Usta Gezgin'; desc = "A2 Final Sınavı'na çok yaklaştın!"; }
    else { label = 'A2 Ustası 👑'; desc = 'Tebrikler! Hem A1 hem A2 müfredatını fethettin!'; }
  } else {
    activePct = pctA1;
    if (doneA1 === 0) { label = 'A1 · Yolculuk Başlıyor'; desc = 'Adım adım temelleri atıyoruz! 🌱'; }
    else if (pctA1 < 25) { label = 'A1.1 · İlk Kelimeler'; desc = 'Harika bir başlangıç yaptın.'; }
    else if (pctA1 < 50) { label = 'A1.2 · Günlük Diyaloglar'; desc = 'Basit cümlelerle iletişim kurabiliyorsun.'; }
    else if (pctA1 < 75) { label = 'A1.3 · Kendini Anlatma'; desc = 'İngilizceyi rahatça kavramaya başladın.'; }
    else if (pctA1 < 100) { label = 'A1.4 · Zirveye Yakın'; desc = 'Az kaldı, A1 Final Sınavı kapıda!'; }
    else { label = 'A1 Tamamlandı 🏆'; desc = "Final sınavını geçip A2 Macera Dünyası'nı açabilirsin!"; }
  }

  return {
    label, desc,
    pct: activePct,
    totalPct: Math.round((totalDone / (typeof UNITS !== 'undefined' ? UNITS.length : 97)) * 100),
    done: totalDone,
    doneA1,
    doneA2,
    doneB1,
    doneB2
  };
}

function nextUnit() {
  return UNITS.find(u => isUnlocked(u.index) && !unitStats(u.id).done) || null;
}

/* ---------- Kelime Aralıklı Tekrar (SRS - Leitner) ---------- */
function recordWord(key, ok) {
  const w = state.words[key] || { box: 0, due: 0, right: 0, wrong: 0 };
  if (ok) { w.right++; w.box = Math.min(w.box + 1, SRS_INTERVALS.length - 1); }
  else { w.wrong++; w.box = 1; }
  w.due = Date.now() + SRS_INTERVALS[w.box] * 86400000;
  state.words[key] = w;
}

function dueWords() {
  const now = Date.now();
  return Object.entries(state.words)
    .filter(([k, w]) => w.due <= now && WORD_BY_KEY[k])
    .map(([k]) => WORD_BY_KEY[k]);
}

function weakWords(limit = 10) {
  return Object.entries(state.words)
    .filter(([k, w]) => w.wrong > 0 && WORD_BY_KEY[k])
    .sort((a, b) => (b[1].wrong / (b[1].right + b[1].wrong)) - (a[1].wrong / (a[1].right + a[1].wrong)) || b[1].wrong - a[1].wrong)
    .slice(0, limit)
    .map(([k, w]) => ({ ...WORD_BY_KEY[k], stats: w }));
}

function classifyTurkishTrap(m = {}) {
  const metaFor = (type, label, tip, icon = '🪤') => ({
    type,
    trap: type,
    label,
    trapTitle: label,
    tip,
    trapTip: tip,
    icon
  });

  if (m.trap && m.trapTitle) {
    return metaFor(m.trap, m.trapTitle, m.trapTip || '', m.icon || '🪤');
  }
  const given = String(m.given || '').trim().toLowerCase();
  const correct = String(m.correct || '').trim().toLowerCase();
  const qText = String(m.q || '').trim().toLowerCase();

  // 1. Lokomotif / Söz Dizimi (Özne + Fiil + Nesne) Tuzağı
  if (m.kind === 'order' || (given.includes(' ') && correct.includes(' ') && given.split(/\s+/).length >= 3)) {
    const gWords = given.split(/\s+/);
    const cWords = correct.split(/\s+/);
    if (gWords.length === cWords.length && gWords.slice().sort().join(' ') === cWords.slice().sort().join(' ')) {
      return metaFor(
        'word_order',
        '🚂 Lokomotif Söz Dizimi Tuzağı (Türkçe Sıralama)',
        'Türkçede yüklem en sonda durur ama İngilizcede Özne (Lokomotif) hemen arkasına Fiili (1. Vagonu) ister!',
        '🚂'
      );
    }
  }

  // 2. am / is / are + Yalın Fiil Fazlalığı ("I am agree", "She is go")
  if (/\b(am|is|are)\s+(agree|go|like|want|know|work|live|need|have|speak|drink|eat)\b/.test(given) ||
      (/\\b(am|is|are)\\b/.test(given) && !/\\b(am|is|are)\\b/.test(correct) && correct.length > 0)) {
    return metaFor(
      'extra_be',
      '🪤 Gereksiz am/is/are Fazlalığı',
      'Türkçedeki "-dir / -yim" ekini her cümleye "am/is/are" olarak koymaya çalışma; eylem (fiil) varsa "am/is/are" gelmez!',
      '🪤'
    );
  }

  // 3. Geniş Zaman 3. Tekil Şahıs (-s / does / is) Unutulması (He/She/It)
  if ((/\b(he|she|it)\b/.test(qText) || /\b(he|she|it)\b/.test(correct)) &&
      (/\b(is|does|has)\b/.test(correct) || /s\b/.test(correct))) {
    return metaFor(
      'he_she_it_s',
      '⚡ He / She / It "-s" & Yardımcı Fiil Tuzağı',
      'Türkçede "O gider / Ben giderim" derken fiil değişmez ama İngilizcede He/She/It tek başına kalınca fiil "-s" (is/does/has) ister!',
      '⚡'
    );
  }

  // 4. Edat (in / on / at / to) Birebir Çeviri Tuzağı
  if (/\b(in|on|at|to|for|from|with)\b/.test(correct) || /\b(in|on|at|to|for|from|with)\b/.test(given)) {
    return metaFor(
      'preposition_literal',
      '🧭 Edat (-de/-da/-e) Birebir Çeviri Tuzağı',
      'Türkçedeki tek bir "-de/-da" eki İngilizcede zamana ve mekana göre "in, on, at" olarak ayrılır.',
      '🧭'
    );
  }

  // 5. Kelime / Kavram Eşleştirme & Birebir Çeviri Tuzağı
  return metaFor(
    'vocab_recall',
    '🌰 Kelime & Birebir Düşünme Tuzağı',
    'Kelimeyi Türkçe karşılığıyla değil, Fındık\'ın palamut zulasındaki sesi ve resmiyle eşleştirerek hatırla!',
    '🌰'
  );
}

function getTopTurkishTraps() {
  const counts = {};
  const meta = {};
  (state.mistakes || []).forEach(m => {
    const info = classifyTurkishTrap(m);
    counts[info.trap] = (counts[info.trap] || 0) + 1;
    meta[info.trap] = info;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, count, ...meta[key] }));
}

function recordMistake(m) {
  const trapInfo = classifyTurkishTrap(m);
  state.mistakes.unshift({ ...m, ...trapInfo, at: Date.now() });
  state.mistakes = state.mistakes.slice(0, 60);
  store.save();
}

/* ============================================================
   Arkadaş Rekabeti, Veri Güvenliği & Tip Normalizasyonu
   ============================================================ */

/* ---------- Tip Dönüştürücüler & Güvenli Veri Normalizasyonu ---------- */
function normalizeStreak(val) {
  if (val == null) return 0;
  if (typeof val === 'number') return Math.max(0, Math.floor(val));
  if (typeof val === 'object' && val !== null) {
    return Math.max(0, Math.floor(val.count || val.streak || 0));
  }
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : Math.max(0, n);
}

function normalizeUnitsDone(val) {
  if (val == null) return 0;
  if (typeof val === 'number') return Math.max(0, Math.floor(val));
  if (typeof val === 'object' && val !== null) {
    return Math.max(0, Math.floor(val.count || val.unitsDone || val.completedUnits || 0));
  }
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : Math.max(0, n);
}

function normalizeLeagueMember(m, isMe = false) {
  if (!m || typeof m !== 'object') return null;
  const streak = normalizeStreak(m.streak);
  const unitsDone = normalizeUnitsDone(m.unitsDone ?? m.completedUnits);
  const xp = Math.min(2000000, Math.max(0, parseInt(m.xp, 10) || 0));

  let rawAvatar = String(m.avatar || '').trim();
  let cleanAvatar = '🧑';
  if (rawAvatar && !rawAvatar.includes('<') && !rawAvatar.includes('>') && rawAvatar.length <= 8) {
    cleanAvatar = rawAvatar;
  } else if (isMe) {
    cleanAvatar = (typeof mascotService !== 'undefined' && mascotService.getActive()) ? mascotService.getActive().icon : '🐾';
  }

  const rawName = String(m.name || (isMe ? (state.name || 'Öğrenci') : 'Arkadaş')).trim().slice(0, 32);
  const cleanName = rawName.replace(/[<>]/g, '') || 'Öğrenci';
  const rawMascot = String(m.mascot || 'squirrel').replace(/[^a-z0-9_-]/gi, '').slice(0, 20);

  return {
    id: String(m.id || (isMe ? state.userId : 'u_' + Math.random().toString(36).slice(2, 7))).replace(/[^a-z0-9_@-]/gi, '').slice(0, 48),
    name: cleanName,
    xp,
    streak,
    unitsDone,
    avatar: cleanAvatar,
    mascot: rawMascot,
    mascotName: String(m.mascotName || '').replace(/[<>]/g, '').slice(0, 32),
    lastActive: Number.isFinite(m.lastActive) ? m.lastActive : Date.now(),
    isMe: !!isMe
  };
}

/* ---------- Ünite Kelimelerini Aralıklı Tekrara Aktarma & Göç (Migration) ---------- */
function syncUnitWordsToBox1(unitId, shouldSave = true) {
  if (typeof UNITS === 'undefined') return 0;
  const u = UNITS.find(x => x.id === unitId);
  if (!u || !Array.isArray(u.words)) return 0;
  let count = 0;
  if (!state.words) state.words = {};
  u.words.forEach(w => {
    if (!w || !w.key) return;
    const existing = state.words[w.key];
    if (!existing) {
      state.words[w.key] = { box: 1, due: Date.now(), right: 1, wrong: 0 };
      count++;
    } else if (existing.box < 1) {
      existing.box = 1;
      existing.due = Math.min(existing.due || Date.now(), Date.now());
      count++;
    }
  });
  if (count > 0 && shouldSave) store.save();
  return count;
}

function migrateCompletedUnitsWords() {
  if (typeof UNITS === 'undefined' || !state || !state.units) {
    if (typeof UNITS === 'undefined') {
      console.warn('[Storage] UNITS tanımlı değil (data.js henüz yüklenmemiş olabilir), kelime göçü ertelendi.');
    }
    return 0;
  }
  let total = 0;
  UNITS.forEach(u => {
    const s = state.units[u.id];
    if (s && (s.done || s.best >= 70)) {
      total += syncUnitWordsToBox1(u.id, false);
    }
  });
  if (total > 0) {
    store.save();
  }
  return total;
}

// Otomatik Göç (Migration): Tamamlanmış ünitelerdeki kelimeleri Kutu 1'e al
try {
  migrateCompletedUnitsWords();
} catch (e) {
  console.warn('[Storage] migrateCompletedUnitsWords sırasında hata oluştu:', e);
}

function myLeagueProfile() {
  const m = typeof mascotService !== 'undefined' ? mascotService.getActive() : { id: 'cat', name: 'Pamuk', icon: '🐱' };
  return {
    id: state.userId,
    name: state.name || 'Öğrenci',
    mascot: m.id,
    mascotName: m.name,
    avatar: m.icon,
    xp: Math.max(0, parseInt(state.xp, 10) || 0),
    streak: normalizeStreak(currentStreak()),
    unitsDone: normalizeUnitsDone(doneCount()),
    lastActive: Date.now()
  };
}

// TODO: calcScoreChecksum istemci tarafında tuz (salt) içeriyor ve istemci tarafında çalışıyor; bu nedenle %100 güvenli değildir.
// Düello/rekabet ve liderlik tablosu puan doğrulaması ileride mutlaka sunucu tarafında (Firebase Cloud Functions / backend) yapılmalıdır.
function calcScoreChecksum(payload) {
  const str = `${payload.n}_${payload.x}_${payload.s}_${payload.u}_A1_SALT_2026`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function generateShareCode() {
  const payload = {
    n: state.name || 'Ben',
    x: state.xp,
    s: normalizeStreak(currentStreak()),
    u: normalizeUnitsDone(doneCount()),
    m: state.mascot || 'cat',
    t: Date.now()
  };
  payload.k = calcScoreChecksum(payload);
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

function importFriendFromCode(code) {
  try {
    const raw = decodeURIComponent(escape(atob(code.trim())));
    const data = JSON.parse(raw);
    if (!data.n || typeof data.x !== 'number') throw new Error('Geçersiz kod');
    if (data.k && data.k !== calcScoreChecksum(data)) {
      throw new Error('Skor kodu üzerinde oynanmış veya değiştirilmiş!');
    }
    const mascot = (MASCOT_BY_ID && MASCOT_BY_ID[data.m]) || MASCOTS[0];
    const existingIdx = state.friends.findIndex(f => f.name.toLowerCase() === data.n.toLowerCase());
    const friendObj = {
      id: existingIdx >= 0 ? state.friends[existingIdx].id : 'f_' + Date.now(),
      name: data.n,
      xp: Math.max(0, parseInt(data.x, 10) || 0),
      streak: normalizeStreak(data.s),
      unitsDone: normalizeUnitsDone(data.u),
      mascot: mascot.id,
      avatar: mascot.icon,
      updatedAt: data.t
    };
    if (existingIdx >= 0) {
      state.friends[existingIdx] = { ...state.friends[existingIdx], ...friendObj };
    } else {
      state.friends.push(friendObj);
    }
    saveState();
    return data.n;
  } catch (err) {
    throw new Error(err.message || 'Kod okunamadı. Geçerli bir arkadaş kodu girdiğinden emin ol!');
  }
}

function removeFriend(name) {
  state.friends = state.friends.filter(f => f.name.toLowerCase() !== name.toLowerCase());
  saveState();
}

function generateSyncCode() {
  const payload = {
    v: 2,
    uId: state.userId,
    name: state.name || 'Öğrenci',
    mascot: state.mascot || 'cat',
    theme: state.theme || 'nordic',
    xp: state.xp || 0,
    streak: normalizeStreak(currentStreak()),
    units: state.units || {},
    words: state.words || {},
    unlockedUpTo: state.unlockedUpTo || 0,
    a1BossPassed: !!state.a1BossPassed,
    daily: state.daily || {},
    t: Date.now()
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

function mergeSyncCode(codeStr) {
  try {
    const raw = decodeURIComponent(escape(atob(codeStr.trim())));
    const data = JSON.parse(raw);
    if (!data || typeof data.xp !== 'number') throw new Error('Geçersiz eşitleme kodu.');

    // 1. XP birleştirme: En yüksek değer kazanır
    state.xp = Math.max(state.xp || 0, data.xp || 0);

    // 2. Seri birleştirme
    const myStreak = normalizeStreak(currentStreak());
    const incStreak = normalizeStreak(data.streak);
    if (incStreak > myStreak) {
      state.streak.count = incStreak;
      state.streak.last = todayStr();
    }

    // 3. Ünite ilerlemelerini birleştir (hiçbir ünite kaybolmaz)
    if (data.units && typeof data.units === 'object') {
      if (!state.units) state.units = {};
      for (const [uId, uVal] of Object.entries(data.units)) {
        if (!state.units[uId]) {
          state.units[uId] = uVal;
        } else {
          state.units[uId] = {
            ...state.units[uId],
            best: Math.max(state.units[uId].best || 0, uVal.best || 0),
            done: state.units[uId].done || uVal.done || ((uVal.best || 0) >= 70),
            attempts: Math.max(state.units[uId].attempts || 1, uVal.attempts || 1),
            correct: Math.max(state.units[uId].correct || 0, uVal.correct || 0),
            total: state.units[uId].total || uVal.total || 10
          };
        }
      }
    }

    // 4. Kilitleri birleştir
    state.unlockedUpTo = Math.max(state.unlockedUpTo || 0, data.unlockedUpTo || 0);
    state.a1BossPassed = state.a1BossPassed || !!data.a1BossPassed;

    // 5. Kelimeleri birleştir (kutu seviyesi asla düşürülmez)
    if (data.words && typeof data.words === 'object') {
      if (!state.words) state.words = {};
      for (const [wKey, wVal] of Object.entries(data.words)) {
        if (!state.words[wKey]) {
          state.words[wKey] = wVal;
        } else {
          state.words[wKey] = {
            ...state.words[wKey],
            box: Math.max(state.words[wKey].box || 1, wVal.box || 1),
            right: Math.max(state.words[wKey].right || 0, wVal.right || 0),
            wrong: Math.max(state.words[wKey].wrong || 0, wVal.wrong || 0)
          };
        }
      }
    }

    // 6. Günlük skorları birleştir
    if (data.daily && typeof data.daily === 'object') {
      if (!state.daily) state.daily = {};
      for (const [dKey, dVal] of Object.entries(data.daily)) {
        state.daily[dKey] = Math.max(state.daily[dKey] || 0, dVal || 0);
      }
    }

    // 7. İsim ve yoldaşı güncelle (eğer gelen veri doluysa)
    if (data.name && data.name !== 'Öğrenci') {
      state.name = data.name;
    }

    // Tamamlanmış ünitelerin kelimelerini de senkronize et
    migrateCompletedUnitsWords();

    saveState();
    return {
      xp: state.xp,
      unitsDone: doneCount(),
      streak: currentStreak()
    };
  } catch (err) {
    throw new Error('Eşitleme kodu okunamadı. Lütfen kodu eksiksiz yapıştırdığından emin ol!');
  }
}

function getLeaderboardList() {
  const me = normalizeLeagueMember(myLeagueProfile(), true);

  if (state.leagueRoomId && state.leagueMembers && Object.keys(state.leagueMembers).length > 0) {
    let foundMe = false;
    const list = Object.values(state.leagueMembers).map(raw => {
      const isCurrent = raw && raw.id === state.userId;
      if (isCurrent) {
        foundMe = true;
        // Yerel ilerleme verisi ASLA sıfırlanmaz veya düşürülmez.
        // Sunucudaki değer yerelden düşükse yerel değer kazanır!
        const serverXp = parseInt(raw.xp, 10) || 0;
        const serverStreak = normalizeStreak(raw.streak);
        const serverUnits = normalizeUnitsDone(raw.unitsDone ?? raw.completedUnits);
        return {
          ...raw,
          ...me,
          xp: Math.max(serverXp, me.xp),
          streak: Math.max(serverStreak, me.streak),
          unitsDone: Math.max(serverUnits, me.unitsDone),
          isMe: true
        };
      }
      return normalizeLeagueMember(raw, false);
    }).filter(Boolean);

    if (!foundMe) {
      list.push(me);
    }
    return list.sort((a, b) => b.xp - a.xp);
  }

  return [me, ...(state.friends || []).map(f => normalizeLeagueMember(f, false))].sort((a, b) => b.xp - a.xp);
}

// Bulut Ligi Servis Fonksiyonları (Firebase Realtime Database)
function getFirebaseDatabase() {
  try {
    if (window.firebase && firebase.apps && firebase.apps.length && typeof firebase.database === 'function') {
      return firebase.database();
    }
  } catch (e) {}
  return null;
}

let leagueSyncStatus = {
  status: 'synced',
  text: '🟢 Skorlar Güncel',
  lastSync: Date.now()
};

function getLeagueSyncStatus() {
  if (!navigator.onLine) {
    return { status: 'offline', text: '📡 Çevrimdışı Mod (İnternete bağlanınca senkronize edilecek)', lastSync: leagueSyncStatus.lastSync };
  }
  return leagueSyncStatus;
}

async function createCloudLeague() {
  const me = normalizeLeagueMember(myLeagueProfile(), true);
  const db = getFirebaseDatabase();
  if (!db) {
    throw new Error('Canlı lig kurmak için Firebase bağlantısı gereklidir. Lütfen internet bağlantını veya Firebase ayarlarını kontrol et.');
  }

  const roomId = 'room_' + Math.random().toString(36).slice(2, 8);
  await db.ref('leagues/' + roomId).set({
    createdAt: Date.now(),
    members: {
      [state.userId]: me
    }
  });
  state.leagueRoomId = roomId;
  state.leagueMembers = { [state.userId]: me };
  saveState();
  leagueSyncStatus = { status: 'synced', text: '🟢 Canlı Lig Kuruldu & Senkronize', lastSync: Date.now() };
  return roomId;
}

async function joinCloudLeague(roomId) {
  const id = (roomId || '').trim();
  if (!id) throw new Error('Geçersiz lig kodu.');
  const me = normalizeLeagueMember(myLeagueProfile(), true);
  const db = getFirebaseDatabase();

  if (!db) {
    throw new Error('Canlı lige katılmak için Firebase bağlantısı gereklidir.');
  }

  const snap = await db.ref('leagues/' + id).once('value');
  const val = snap.val();
  if (!val) throw new Error('Lig odası bulunamadı. Kodu kontrol et.');
  await db.ref('leagues/' + id + '/members/' + state.userId).set(me);
  state.leagueRoomId = id;
  state.leagueMembers = { ...(val.members || {}), [state.userId]: me };
  saveState();
  leagueSyncStatus = { status: 'synced', text: '🟢 Lige Katıldın & Skorun Aktarıldı', lastSync: Date.now() };
  return getLeaderboardList();
}

let isSyncInProgress = false;
let pendingSyncAgain = false;

let syncRetryCount = 0;

async function syncCloudLeague() {
  if (!state.leagueRoomId) return null;
  if (isSyncInProgress) {
    pendingSyncAgain = true;
    return getLeaderboardList();
  }
  isSyncInProgress = true;

  try {
    const me = normalizeLeagueMember(myLeagueProfile(), true);

    if (!state.leagueMembers) state.leagueMembers = {};
    const curLocal = state.leagueMembers[state.userId] || {};
    state.leagueMembers[state.userId] = {
      ...curLocal,
      ...me,
      xp: Math.max(parseInt(curLocal.xp, 10) || 0, me.xp),
      streak: Math.max(normalizeStreak(curLocal.streak), me.streak),
      unitsDone: Math.max(normalizeUnitsDone(curLocal.unitsDone ?? curLocal.completedUnits), me.unitsDone)
    };
    store.save();

    if (!navigator.onLine) {
      leagueSyncStatus = {
        status: 'offline',
        text: '📡 Çevrimdışı Mod (Skorların güvende, internet gelince aktarılacak)',
        lastSync: leagueSyncStatus.lastSync
      };
      return getLeaderboardList();
    }

    const db = getFirebaseDatabase();
    if (!db) {
      leagueSyncStatus = {
        status: 'offline',
        text: '📡 Yerel Mod (Firebase bağlantısı bekleniyor)',
        lastSync: leagueSyncStatus.lastSync
      };
      return getLeaderboardList();
    }

    leagueSyncStatus = {
      status: 'syncing',
      text: '🔄 Senkronize ediliyor...',
      lastSync: leagueSyncStatus.lastSync
    };

    await db.ref('leagues/' + state.leagueRoomId + '/members/' + state.userId).set(state.leagueMembers[state.userId]);

    const snap = await db.ref('leagues/' + state.leagueRoomId + '/members').once('value');
    const rawRemoteMembers = snap.val() || {};
    const remoteMembers = {};
    for (const [uid, m] of Object.entries(rawRemoteMembers)) {
      const normalized = normalizeLeagueMember(m, uid === state.userId);
      if (normalized) remoteMembers[uid] = normalized;
    }

    const remoteMe = remoteMembers[state.userId] || {};
    remoteMembers[state.userId] = {
      ...remoteMe,
      ...state.leagueMembers[state.userId],
      xp: Math.max(parseInt(remoteMe.xp, 10) || 0, state.leagueMembers[state.userId].xp),
      streak: Math.max(normalizeStreak(remoteMe.streak), state.leagueMembers[state.userId].streak),
      unitsDone: Math.max(normalizeUnitsDone(remoteMe.unitsDone ?? remoteMe.completedUnits), state.leagueMembers[state.userId].unitsDone)
    };

    state.leagueMembers = remoteMembers;
    store.save();
    syncRetryCount = 0;
    leagueSyncStatus = {
      status: 'synced',
      text: '🟢 Tüm Skorlar Güncel (Bulutla Eşitlendi)',
      lastSync: Date.now()
    };
    return getLeaderboardList();
  } catch (e) {
    console.warn('Firebase league sync warning:', e.message);
    leagueSyncStatus = {
      status: 'error',
      text: '⚠️ Ağ Gecikmesi (Yerel skorlar güvende, tekrar deneniyor)',
      lastSync: leagueSyncStatus.lastSync
    };
    if (navigator.onLine && syncRetryCount < 3) {
      syncRetryCount++;
      setTimeout(syncCloudLeague, 3500 * syncRetryCount);
    }
    return getLeaderboardList();
  } finally {
    isSyncInProgress = false;
    if (pendingSyncAgain) {
      pendingSyncAgain = false;
      setTimeout(syncCloudLeague, 350);
    }
  }
}

async function leaveCloudLeague() {
  if (state.leagueRoomId) {
    const db = getFirebaseDatabase();
    if (db) {
      try {
        await db.ref('leagues/' + state.leagueRoomId + '/members/' + state.userId).remove();
      } catch (e) {}
    }
  }
  state.leagueRoomId = null;
  state.leagueMembers = {};
  saveState();
}

/* ============================================================
   OOP: OfflineSyncManager (Çevrimdışı Çalışma & Otomatik Bulut Senkronizasyonu)
   ============================================================ */
class OfflineSyncManager {
  constructor(appStore) {
    this.store = appStore;
    this.hasPendingOfflineChanges = false;
    this.init();
  }

  init() {
    window.addEventListener('online', () => {
      this.syncNow(true);
    });
    window.addEventListener('offline', () => {
      if (typeof toast === 'function') {
        toast('📡 Çevrimdışı mod: Tüm ilerlemelerin cihazında güvenle saklanır.');
      }
    });

    if (navigator.onLine) {
      setTimeout(() => this.syncNow(false), 2000);
    }
  }

  markPending() {
    this.hasPendingOfflineChanges = true;
  }

  async syncNow(showToastOnSuccess = false) {
    if (!navigator.onLine) {
      this.hasPendingOfflineChanges = true;
      return;
    }

    let didSync = false;
    const curState = this.store.getState();

    // 1. Canlı Bulut Ligi senkronizasyonu
    if (curState.leagueRoomId && typeof syncCloudLeague === 'function') {
      try {
        await syncCloudLeague();
        didSync = true;
      } catch (e) {}
    }

    // 2. Firebase Realtime Database senkronizasyonu
    const authUid = curState.auth?.user?.uid || curState.auth?.uid;
    if (window.firebase && firebase.apps && firebase.apps.length && authUid) {
      try {
        const db = firebase.database();
        const done = typeof doneCount === 'function' ? doneCount() : 0;
        await db.ref('users/' + authUid).update({
          name: curState.name || 'Öğrenci',
          xp: curState.xp || 0,
          streak: curState.streak || { count: 0 },
          unitsDone: done,
          mascot: curState.mascot || 'cat',
          lastSync: Date.now()
        });
        didSync = true;
      } catch (e) {}
    }

    if (didSync && showToastOnSuccess) {
      this.hasPendingOfflineChanges = false;
      if (typeof toast === 'function') {
        toast('⚡ İnternet bağlantısı sağlandı. Çevrimdışı kazandığın XP ve ilerlemeler başarıyla senkronize edildi! ☁️');
      }
    }
  }
}

syncManager = new OfflineSyncManager(store);


/* ============================================================
   Global Error Boundary (Play Store / TWA Crash Koruması)
   Uygulamanın beyaz ekranda çökmesini önler ve güvenli kurtarma sunar.
   ============================================================ */
function showCrashRecoveryBanner(message) {
  if (typeof document === 'undefined' || !document.body) return;
  if (document.getElementById('patilingo-error-boundary')) return;

  // Takılı kalmış yükleme ekranı veya bozuk modal varsa temizle
  try {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot && modalRoot.innerHTML.includes('loader')) modalRoot.innerHTML = '';
  } catch (_) {}

  const banner = document.createElement('div');
  banner.id = 'patilingo-error-boundary';
  banner.className = 'global-error-banner';
  banner.setAttribute('role', 'alert');
  banner.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;min-width:0;">
      <span style="font-size:1.3rem;flex-shrink:0;">🛡️</span>
      <div style="min-width:0;">
        <b style="display:block;font-size:0.86rem;color:#FBBF24;">Küçük bir aksaklık yakalandı</b>
        <span style="font-size:0.76rem;color:#CBD5E1;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">İlerlemen güvende, çalışmaya devam edebilirsin.</span>
      </div>
    </div>
    <div style="display:flex;gap:6px;flex-shrink:0;">
      <button type="button" id="errBoundaryDismissBtn" style="background:rgba(255,255,255,0.12);color:#fff;border:none;border-radius:10px;padding:6px 10px;font-weight:700;font-size:0.78rem;cursor:pointer;">Tamam</button>
    </div>
  `;
  document.body.appendChild(banner);

  const dismissBtn = document.getElementById('errBoundaryDismissBtn');
  if (dismissBtn) {
    dismissBtn.onclick = () => banner.remove();
  }
  const autoHide = setTimeout(() => {
    if (banner && banner.parentNode) banner.remove();
  }, 6000);
  if (autoHide && typeof autoHide.unref === 'function') autoHide.unref();
}

if (typeof window !== 'undefined') {
  window.onerror = function (message, source, lineno, colno, error) {
    console.error('[GlobalErrorBoundary] Yakalanan Hata:', { message, source, lineno, colno, error });
    try {
      if (store && store.state) {
        store.state.xp = AppStore.sanitizeXP(store.state.xp, 0);
      }
      showCrashRecoveryBanner(String(message || 'Bilinmeyen hata'));
    } catch (_) {}
    // true döndürerek tarayıcının/WebView'ın beyaz ekranda çökmesini engelle
    return true;
  };

  window.addEventListener('unhandledrejection', function (event) {
    const reason = event && event.reason;
    // AIError hataları kendi UI kutularında gösterildiği için sessizce logla
    if (reason && reason.name === 'AIError') return;
    console.error('[GlobalErrorBoundary] Yakalanan Promise Hatası:', reason);
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
  });
}
