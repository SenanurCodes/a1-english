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
    settings: { apiKey: '', model: 'gemini-2.5-flash', rate: 0.9, sound: true, reviewLimit: 25 }
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
        settings: { ...d.settings, ...(s.settings || {}), reviewLimit: (s.settings && s.settings.reviewLimit) ? s.settings.reviewLimit : 25 },
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
    syncUnitWordsToBox1(unitId);
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
  if (!m) return null;
  const streak = normalizeStreak(m.streak);
  const unitsDone = normalizeUnitsDone(m.unitsDone ?? m.completedUnits);
  const xp = Math.max(0, parseInt(m.xp, 10) || 0);
  return {
    ...m,
    id: m.id || (isMe ? state.userId : 'unknown'),
    name: m.name || (isMe ? (state.name || 'Öğrenci') : 'Arkadaş'),
    xp,
    streak,
    unitsDone,
    avatar: m.avatar || (isMe ? ((typeof mascotService !== 'undefined' && mascotService.getActive()) ? mascotService.getActive().icon : '🐾') : '🧑'),
    isMe: !!isMe
  };
}

/* ---------- Ünite Kelimelerini Aralıklı Tekrara Aktarma & Göç (Migration) ---------- */
function syncUnitWordsToBox1(unitId) {
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
    // Kural: Mevcut kutusu 1'den yüksek olan kelimelerin kutusunu ASLA düşürme!
  });
  if (count > 0) saveState();
  return count;
}

function migrateCompletedUnitsWords() {
  if (typeof UNITS === 'undefined' || !state || !state.units) return 0;
  let total = 0;
  UNITS.forEach(u => {
    const s = state.units[u.id];
    if (s && (s.done || s.best >= 70)) {
      total += syncUnitWordsToBox1(u.id);
    }
  });
  return total;
}

// Otomatik Göç (Migration): Tamamlanmış ünitelerdeki kelimeleri Kutu 1'e al
try {
  migrateCompletedUnitsWords();
} catch (e) {}

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

async function syncCloudLeague() {
  if (!state.leagueRoomId) return null;
  const me = normalizeLeagueMember(myLeagueProfile(), true);

  // Yerel lig tablosundaki kendi satırını her zaman en güncel yerel verilerle koru
  if (!state.leagueMembers) state.leagueMembers = {};
  const curLocal = state.leagueMembers[state.userId] || {};
  state.leagueMembers[state.userId] = {
    ...curLocal,
    ...me,
    xp: Math.max(parseInt(curLocal.xp, 10) || 0, me.xp),
    streak: Math.max(normalizeStreak(curLocal.streak), me.streak),
    unitsDone: Math.max(normalizeUnitsDone(curLocal.unitsDone ?? curLocal.completedUnits), me.unitsDone)
  };
  saveState();

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

  if (isSyncInProgress) {
    pendingSyncAgain = true;
    return getLeaderboardList();
  }

  isSyncInProgress = true;
  leagueSyncStatus = {
    status: 'syncing',
    text: '🔄 Senkronize ediliyor...',
    lastSync: leagueSyncStatus.lastSync
  };

  try {
    // 1. Önce güncel yerel profilimizi Firebase'e aktar
    await db.ref('leagues/' + state.leagueRoomId + '/members/' + state.userId).set(state.leagueMembers[state.userId]);

    // 2. Odanın tüm üyelerini çek
    const snap = await db.ref('leagues/' + state.leagueRoomId + '/members').once('value');
    const remoteMembers = snap.val() || {};

    // 3. Sunucudan gelen verilerle birleştir; sunucudaki değer yerelden düşükse YEREL DEĞER KAZANSIN!
    const remoteMe = remoteMembers[state.userId] || {};
    remoteMembers[state.userId] = {
      ...remoteMe,
      ...state.leagueMembers[state.userId],
      xp: Math.max(parseInt(remoteMe.xp, 10) || 0, state.leagueMembers[state.userId].xp),
      streak: Math.max(normalizeStreak(remoteMe.streak), state.leagueMembers[state.userId].streak),
      unitsDone: Math.max(normalizeUnitsDone(remoteMe.unitsDone ?? remoteMe.completedUnits), state.leagueMembers[state.userId].unitsDone)
    };

    state.leagueMembers = remoteMembers;
    saveState();
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
    if (navigator.onLine) {
      setTimeout(syncCloudLeague, 3500);
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

