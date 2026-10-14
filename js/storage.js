/* ============================================================
   A1 English v2.0 - OOP Durum Yönetimi & Servisler
   Store (Kapsüllenmiş Durum), ThemeService, MascotService, ProgressionManager
   ============================================================ */

const STORE_KEY = 'a1english_v2';
const LEGACY_STORE_KEY = 'a1english_v1';
const SRS_INTERVALS = [0, 1, 2, 4, 7, 15, 30]; // gün (Leitner kutuları)

function defaultState() {
  return {
    userId: 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    onboarded: false,
    name: 'Öğrenci',
    mascot: 'cat',         // 'cat', 'dog', 'owl', 'panda', 'squirrel'
    theme: 'nordic',       // 'nordic', 'cyber', 'sunset', 'ocean'
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
    words: {},            // { key: { box, due, right, wrong } }
    mistakes: [],         // son hatalar
    chat: [],             // AI sohbet geçmişi
    aiReport: null,       // { text, at }
    friends: [],          // Kod ile eklenen gerçek arkadaşlar
    leagueRoomId: null,   // Canlı senkronize lig oda ID'si
    leagueMembers: {},    // Canlı lig üyeleri { userId: { id, name, xp, streak, unitsDone, avatar, mascot, lastActive } }
    settings: { apiKey: '', model: 'gemini-2.5-flash', rate: 0.9, sound: true }
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
  }

  save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this._state));
      this._notify('SAVE', this._state);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
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

      const s = JSON.parse(raw);
      const d = defaultState();
      const cleanFriends = (s.friends || []).filter(f => !f.isBot);
      const userId = s.userId || d.userId;
      const mascot = s.mascot || 'cat';
      const theme = s.theme || 'nordic';

      return {
        ...d,
        ...s,
        userId,
        mascot,
        theme,
        auth: { ...d.auth, ...(s.auth || {}) },
        leagueRoomId: s.leagueRoomId || null,
        leagueMembers: s.leagueMembers || {},
        settings: { ...d.settings, ...(s.settings || {}) },
        streak: { ...d.streak, ...(s.streak || {}) },
        friends: cleanFriends
      };
    } catch (e) {
      return defaultState();
    }
  }

  // Mutasyon / Eylem Metotları (Action Methods)
  setAuth(user, isGuest = false, provider = 'guest') {
    this._state.auth = {
      isGuest,
      user,
      provider
    };
    if (user && user.displayName && (!this._state.name || this._state.name === 'Öğrenci')) {
      this._state.name = user.displayName;
    }
    this.save();
    this._notify('AUTH_CHANGE', this._state.auth);
  }

  setMascot(mascotId) {
    if (MASCOT_BY_ID && MASCOT_BY_ID[mascotId]) {
      this._state.mascot = mascotId;
      this._state.avatar = MASCOT_BY_ID[mascotId].icon;
      this.save();
      this._notify('MASCOT_CHANGE', mascotId);
    }
  }

  setTheme(themeId) {
    if (PALETTE_BY_ID && PALETTE_BY_ID[themeId]) {
      this._state.theme = themeId;
      this.save();
      this._notify('THEME_CHANGE', themeId);
    }
  }

  gainXP(amount) {
    this._state.xp += amount;
    const t = todayStr();
    this._state.daily[t] = (this._state.daily[t] || 0) + amount;
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
    this._state.a1BossPassed = true;
    this._state.a2Unlocked = true;
    this.gainXP(200); // Boss tamamlama ödülü
    this.save();
    this._notify('A1_BOSS_PASSED', null);
  }
}

// Global Store Instance
const store = new AppStore();
let state = store.state;

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
    root.setAttribute('data-mode', palette.isDark ? 'dark' : 'light');
    root.style.setProperty('--bg', palette.colors.bg);
    root.style.setProperty('--card', palette.colors.cardBg);
    root.style.setProperty('--card-bg', palette.colors.cardBg);
    root.style.setProperty('--text', palette.colors.text);
    root.style.setProperty('--muted', palette.colors.muted);
    root.style.setProperty('--line', palette.colors.line);
    root.style.setProperty('--accent', palette.colors.accent);
    root.style.setProperty('--accent-d', palette.colors.accentD);
    root.style.setProperty('--primary', palette.colors.primary);
    root.style.setProperty('--primary-d', palette.colors.primaryD);

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
    const id = this.store.state.mascot || 'cat';
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

  select(id) {
    this.store.setMascot(id);
  }
}

const mascotService = new MascotService(store);

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
  state = store.state;
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
  state = store.state;
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
  const s = { ...unitStats(unitId) };
  const pct = Math.round((correct / total) * 100);
  s.attempts += 1;
  s.correct += correct;
  s.total += total;
  s.best = Math.max(s.best, pct);
  s.lastAt = Date.now();
  if (pct >= 70) {
    s.done = true;
    const u = UNIT_BY_ID[unitId];
    if (u) {
      state.unlockedUpTo = Math.max(state.unlockedUpTo, Math.min(u.index + 1, UNITS.length - 1));
    }
  }
  state.units[unitId] = s;
  saveState();
  return pct;
}

function doneCount() {
  return UNITS.filter(u => unitStats(u.id).done).length;
}

function levelInfo() {
  const done = doneCount();
  const pct = done / UNITS.length;
  let label, desc;
  if (done === 0) { label = 'A1 · Yolculuk Başlıyor'; desc = 'Adım adım temelleri atıyoruz! 🚀'; }
  else if (pct < 0.25) { label = 'A1.1 · İlk Kelimeler'; desc = 'Harika bir başlangıç yaptın.'; }
  else if (pct < 0.5) { label = 'A1.2 · Günlük Diyaloglar'; desc = 'Basit cümlelerle iletişim kurabiliyorsun.'; }
  else if (pct < 0.75) { label = 'A1.3 · Kendini Anlatma'; desc = 'İngilizceyi rahatça kavramaya başladın.'; }
  else if (pct < 1) { label = 'A1.4 · Zirveye Yakın'; desc = 'Az kaldı, A1 Final Sınavı kapıda!'; }
  else { label = 'A1 Tamamlandı 🏆'; desc = 'Final sınavını geçip A2 Macera Dünyası\'nı açabilirsin!'; }
  return { label, desc, pct: Math.round(pct * 100), done };
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

function recordMistake(m) {
  state.mistakes.unshift({ ...m, at: Date.now() });
  state.mistakes = state.mistakes.slice(0, 60);
}

/* ============================================================
   Arkadaş Rekabeti & Skor Kodu Güvenliği
   ============================================================ */
function myLeagueProfile() {
  const m = mascotService.getActive();
  return {
    id: state.userId,
    name: state.name || 'Öğrenci',
    mascot: m.id,
    mascotName: m.name,
    avatar: m.icon,
    xp: state.xp,
    streak: currentStreak(),
    unitsDone: doneCount(),
    lastActive: Date.now()
  };
}

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
    s: currentStreak(),
    u: doneCount(),
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
      xp: data.x,
      streak: data.s || 0,
      unitsDone: data.u || 0,
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

function getLeaderboardList() {
  const me = myLeagueProfile();
  me.isMe = true;

  if (state.leagueRoomId && state.leagueMembers && Object.keys(state.leagueMembers).length > 0) {
    const list = Object.values(state.leagueMembers).map(m => ({
      ...m,
      isMe: m.id === state.userId
    }));
    if (!list.some(x => x.isMe)) list.push(me);
    return list.sort((a, b) => b.xp - a.xp);
  }

  return [me, ...(state.friends || [])].sort((a, b) => b.xp - a.xp);
}

// Bulut Ligi Servis Fonksiyonları (Firebase Realtime Database & Fallback)
function getFirebaseDatabase() {
  try {
    if (window.firebase && firebase.apps && firebase.apps.length && typeof firebase.database === 'function') {
      return firebase.database();
    }
  } catch (e) {}
  return null;
}

const CLOUD_API = 'https://api.restful-api.dev/objects';

async function createCloudLeague() {
  const me = myLeagueProfile();
  const db = getFirebaseDatabase();
  if (db) {
    try {
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
      return roomId;
    } catch (err) {
      console.warn('Firebase create fallback:', err.message);
    }
  }

  const res = await fetch(CLOUD_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'A1_LEAGUE_' + (state.name || 'Room'),
      data: {
        createdAt: Date.now(),
        members: {
          [state.userId]: me
        }
      }
    })
  });
  if (!res.ok) {
    if (res.status === 405 || res.status === 429) {
      throw new Error('Ücretsiz demo sunucunun günlük istek limiti doldu. Firebase kurulumu ile kalıcı çözüme geçilecek.');
    }
    throw new Error('Bulut ligi oluşturulamadı.');
  }
  const obj = await res.json();
  state.leagueRoomId = obj.id;
  state.leagueMembers = { [state.userId]: me };
  saveState();
  return obj.id;
}

async function joinCloudLeague(roomId) {
  const id = (roomId || '').trim();
  if (!id) throw new Error('Geçersiz lig kodu.');
  const me = myLeagueProfile();
  const db = getFirebaseDatabase();

  if (db) {
    try {
      const snap = await db.ref('leagues/' + id).once('value');
      const val = snap.val();
      if (!val) throw new Error('Lig odası bulunamadı. Kodu kontrol et.');
      await db.ref('leagues/' + id + '/members/' + state.userId).set(me);
      state.leagueRoomId = id;
      state.leagueMembers = { ...(val.members || {}), [state.userId]: me };
      saveState();
      return Object.values(state.leagueMembers);
    } catch (err) {
      if (err.message && err.message.includes('bulunamadı')) throw err;
      console.warn('Firebase join fallback:', err.message);
    }
  }

  const res = await fetch(CLOUD_API + '/' + id);
  if (!res.ok) throw new Error('Lig odası bulunamadı. Kodu kontrol et.');
  const obj = await res.json();
  if (!obj.data || !obj.data.members) throw new Error('Geçersiz lig verisi.');
  
  obj.data.members[state.userId] = me;
  obj.data.updatedAt = Date.now();

  await fetch(CLOUD_API + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: obj.name || 'A1_LEAGUE', data: obj.data })
  });

  state.leagueRoomId = id;
  state.leagueMembers = obj.data.members;
  saveState();
  return Object.values(obj.data.members);
}

let isSyncInProgress = false;
let pendingSyncAgain = false;

async function syncCloudLeague() {
  if (!state.leagueRoomId) return null;
  const me = myLeagueProfile();
  const db = getFirebaseDatabase();

  if (db) {
    try {
      await db.ref('leagues/' + state.leagueRoomId + '/members/' + state.userId).set(me);
      const snap = await db.ref('leagues/' + state.leagueRoomId + '/members').once('value');
      const members = snap.val() || { [state.userId]: me };
      state.leagueMembers = members;
      saveState();
      return Object.values(members);
    } catch (e) {
      console.warn('Firebase sync fallback:', e.message);
    }
  }

  if (isSyncInProgress) {
    pendingSyncAgain = true;
    return Object.values(state.leagueMembers || {});
  }
  isSyncInProgress = true;
  try {
    const res = await fetch(CLOUD_API + '/' + state.leagueRoomId);
    if (!res.ok) return null;
    const obj = await res.json();
    if (!obj.data || !obj.data.members) return null;

    const mergedMembers = { ...obj.data.members };
    Object.keys(state.leagueMembers || {}).forEach(uid => {
      if (uid !== state.userId && state.leagueMembers[uid]) {
        const localM = state.leagueMembers[uid];
        const serverM = mergedMembers[uid];
        if (!serverM || (localM.lastActive && localM.lastActive > (serverM.lastActive || 0))) {
          mergedMembers[uid] = localM;
        }
      }
    });
    mergedMembers[state.userId] = me;
    obj.data.members = mergedMembers;
    obj.data.updatedAt = Date.now();

    await fetch(CLOUD_API + '/' + state.leagueRoomId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: obj.name || 'A1_LEAGUE', data: obj.data })
    });

    state.leagueMembers = mergedMembers;
    saveState();
    return Object.values(mergedMembers);
  } catch (e) {
    return null;
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
    } else {
      try {
        const res = await fetch(CLOUD_API + '/' + state.leagueRoomId);
        if (res.ok) {
          const obj = await res.json();
          if (obj.data && obj.data.members) {
            delete obj.data.members[state.userId];
            fetch(CLOUD_API + '/' + state.leagueRoomId, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: obj.name, data: obj.data })
            }).catch(() => {});
          }
        }
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
    if (window.firebase && firebase.apps && firebase.apps.length && curState.auth && curState.auth.uid) {
      try {
        const db = firebase.database();
        const done = typeof doneCount === 'function' ? doneCount() : 0;
        await db.ref('users/' + curState.auth.uid).update({
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

    if ((didSync || this.hasPendingOfflineChanges) && showToastOnSuccess) {
      this.hasPendingOfflineChanges = false;
      if (typeof toast === 'function') {
        toast('⚡ İnternet bağlantısı sağlandı. Çevrimdışı kazandığın XP ve ilerlemeler başarıyla senkronize edildi! ☁️');
      }
    }
  }
}

const syncManager = new OfflineSyncManager(store);

