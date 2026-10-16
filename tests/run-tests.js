#!/usr/bin/env node
/* ============================================================
   PatiLingo - Kütüphanesiz otomatik testler
   Kullanım:  node tests/run-tests.js
   Her test, data.js + logic.js + storage.js dosyalarını tarayıcıdaki
   sırayla temiz bir sanal ortama (vm) yükler; sahte localStorage kullanır.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const FILES = ['js/data.js', 'js/logic.js', 'js/storage.js', 'js/ai.js'];
const SOURCES = FILES.map(f => [f, fs.readFileSync(path.join(ROOT, f), 'utf8')]);

/* ---------- Sahte tarayıcı ortamı ---------- */
function makeEnv(initialStorage = {}) {
  const store = { ...initialStorage };
  const warnings = [];
  const localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
    clear: () => { for (const k of Object.keys(store)) delete store[k]; },
    _raw: store
  };
  const attrs = {};
  const ctx = {
    console: {
      log() {}, info() {}, error: (...a) => warnings.push(['error', a.join(' ')]),
      warn: (...a) => warnings.push(['warn', a.join(' ')])
    },
    localStorage,
    navigator: { onLine: false },
    location: { hash: '#/', pathname: '/', origin: 'http://test' },
    document: {
      documentElement: { setAttribute: (k, v) => { attrs[k] = v; }, style: { setProperty() {} } },
      querySelector: () => null
    },
    setTimeout, clearTimeout, Date, Math, JSON, Promise,
    btoa: s => Buffer.from(s, 'binary').toString('base64'),
    atob: s => Buffer.from(s, 'base64').toString('binary'),
    escape, unescape, encodeURIComponent, decodeURIComponent
  };
  ctx.window = ctx;
  ctx.addEventListener = () => {};
  vm.createContext(ctx);
  for (const [file, src] of SOURCES) vm.runInContext(src, ctx, { filename: file });
  const run = code => vm.runInContext(code, ctx);
  return { run, localStorage, warnings, attrs };
}

/* ---------- Mini test çatısı ---------- */
const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}
function eq(actual, expected, msg) {
  const a = JSON.stringify(actual), b = JSON.stringify(expected);
  if (a !== b) throw new Error(`${msg || 'eşit değil'}: beklenen ${b}, gelen ${a}`);
}
function ok(cond, msg) { if (!cond) throw new Error(msg || 'koşul sağlanmadı'); }

/* ---------- Gerçek ünite kimlikleriyle eski (v0) kullanıcı verisi ---------- */
const env0 = makeEnv();
const UNIT_IDS = env0.run('UNITS.map(u => u.id)');
const FIRST_WORDS = env0.run(`UNITS.find(u => u.id === '${UNIT_IDS[0]}').words.map(w => w.key)`);

function legacy480() {
  return {
    // schemaVersion yok -> v0
    userId: 'u_legacy_480',
    name: 'Senanur',
    onboarded: true,
    mascot: 'dog',
    theme: 'cyber',
    xp: 480,
    streak: { count: 4, last: '2026-10-14' },
    daily: { '2026-10-14': 120 },
    units: {
      [UNIT_IDS[0]]: { best: 95, attempts: 2, correct: 19, total: 20, done: true },
      [UNIT_IDS[1]]: { best: 80, attempts: 1, correct: 8, total: 10, done: true },
      [UNIT_IDS[2]]: { best: 50, attempts: 1, correct: 5, total: 10, done: false }
    },
    unlockedUpTo: 2,
    words: { [FIRST_WORDS[0]]: { box: 4, due: 0, right: 6, wrong: 1 } },
    friends: [{ id: 'f1', name: 'Kenan', xp: 110 }, { id: 'b1', name: 'Bot', isBot: true }],
    settings: { apiKey: 'KEY123', rate: 1 }
  };
}

/* ================== TESTLER ================== */

test('Yeni kullanıcı: schemaVersion 1, XP 0, onboarded false', () => {
  const { run } = makeEnv();
  eq(run('store.state.schemaVersion'), 1);
  eq(run('state.xp'), 0);
  eq(run('state.onboarded'), false);
});

test('Script sırası: storage.js yüklenirken UNITS tanımlı, uyarı yok', () => {
  const { warnings } = makeEnv({ a1english_v2: JSON.stringify(legacy480()) });
  const unitsWarn = warnings.filter(w => w[1].includes('UNITS tanımlı değil'));
  eq(unitsWarn.length, 0, 'UNITS uyarısı');
});

test('Göç v0 -> v1: 480 XP, seri, ünite ve ayarlar korunur', () => {
  const { run, localStorage } = makeEnv({ a1english_v2: JSON.stringify(legacy480()) });
  eq(run('state.schemaVersion'), 1);
  eq(run('state.xp'), 480);
  eq(run('state.streak.count'), 4);
  eq(run('state.name'), 'Senanur');
  eq(run('doneCount()'), 2, 'tamamlanan ünite');
  eq(run('state.settings.apiKey'), 'KEY123');
  eq(run('state.settings.reviewLimit'), 25, 'yeni ayar varsayılanla eklenmeli');
  eq(run('state.friends.map(f => f.name)'), ['Kenan'], 'bot arkadaş temizlenmeli');
  eq(JSON.parse(localStorage._raw.a1english_v2).schemaVersion, 1, 'göç kalıcı kaydedilmeli');
});

test('Göç: tamamlanan ünite kelimeleri Kutu 1+, yüksek kutu düşmez', () => {
  const { run } = makeEnv({ a1english_v2: JSON.stringify(legacy480()) });
  const boxes = run(`UNITS.find(u => u.id === '${UNIT_IDS[0]}').words.map(w => (state.words[w.key] || {}).box || 0)`);
  ok(boxes.every(b => b >= 1), 'tüm kelimeler en az Kutu 1 olmalı: ' + boxes);
  eq(run(`state.words['${FIRST_WORDS[0]}'].box`), 4, 'Kutu 4 korunmalı');
  const notDone = run(`UNITS.find(u => u.id === '${UNIT_IDS[2]}').words.filter(w => state.words[w.key]).length`);
  eq(notDone, 0, '%70 altı ünitenin kelimeleri eklenmemeli');
});

test('Eski anahtar (a1english_v1) okunur', () => {
  const { run } = makeEnv({ a1english_v1: JSON.stringify(legacy480()) });
  eq(run('state.xp'), 480);
});

test('Bozuk veri: uygulama çökmez, varsayılana döner ve uyarı loglar', () => {
  const { run, warnings } = makeEnv({ a1english_v2: '{bozuk json' });
  eq(run('state.xp'), 0);
  ok(warnings.some(w => w[1].includes('_load')), 'uyarı loglanmalı');
});

test('state Proxy: yazma store.state\'e gider, store değişince bayat kalmaz', () => {
  const { run } = makeEnv();
  run('state.xp = 77');
  eq(run('store.state.xp'), 77);
  run('store._state = { ...store._state, xp: 5 }');
  eq(run('state.xp'), 5, 'Proxy yeni nesneyi görmeli');
  eq(run('({ ...state }).xp'), 5, 'spread çalışmalı');
});

test('resetState: ilerleme sıfırlanır, ayarlar korunur, state bayat kalmaz', () => {
  const { run } = makeEnv({ a1english_v2: JSON.stringify(legacy480()) });
  run('resetState()');
  eq(run('state.xp'), 0);
  eq(run('state.settings.apiKey'), 'KEY123');
});

test('Dışa aktar -> içe aktar (boş cihaza): veri birebir gelir', () => {
  const src = makeEnv({ a1english_v2: JSON.stringify(legacy480()) });
  const exported = src.run('JSON.stringify({ ...state, settings: { ...state.settings, apiKey: "" } })');
  const dst = makeEnv();
  dst.run(`store.importState(${exported})`);
  eq(dst.run('state.xp'), 480);
  eq(dst.run('doneCount()'), 2);
  eq(dst.run('state.name'), 'Senanur');
  eq(JSON.parse(dst.localStorage._raw.a1english_v2).xp, 480, 'localStorage\'a yazılmalı');
});

test('İçe aktar (dolu cihaza): akıllı birleştirme, hiçbir ilerleme kaybolmaz', () => {
  const { run } = makeEnv({ a1english_v2: JSON.stringify({ ...legacy480(), xp: 600, units: { [UNIT_IDS[3]]: { best: 90, attempts: 1, correct: 9, total: 10, done: true } } }) });
  run(`store.importState(${JSON.stringify({ ...legacy480(), settings: { apiKey: '' } })})`);
  eq(run('state.xp'), 600, 'yüksek XP kalmalı');
  eq(run('doneCount()'), 3, 'iki cihazın üniteleri birleşmeli');
  eq(run('state.settings.apiKey'), 'KEY123', 'mevcut API anahtarı korunmalı');
});

test('Ünite sonucu: %70+ tamamlar ve sonrakini açar, altı açmaz', () => {
  const { run } = makeEnv();
  run(`recordUnitResult('${UNIT_IDS[0]}', 6, 10)`);
  eq(run(`unitStats('${UNIT_IDS[0]}').done`), false);
  eq(run('state.unlockedUpTo'), 0);
  run(`recordUnitResult('${UNIT_IDS[0]}', 8, 10)`);
  eq(run(`unitStats('${UNIT_IDS[0]}').done`), true);
  eq(run('state.unlockedUpTo'), 1);
  eq(run(`unitStats('${UNIT_IDS[0]}').best`), 80);
});

test('syncUnitWordsToBox1: yeni kelimeler Kutu 1, mevcut yüksek kutu asla düşmez', () => {
  const { run } = makeEnv();
  run(`state.words['${FIRST_WORDS[0]}'] = { box: 5, due: 0, right: 9, wrong: 0 }`);
  run(`syncUnitWordsToBox1('${UNIT_IDS[0]}')`);
  eq(run(`state.words['${FIRST_WORDS[0]}'].box`), 5);
  eq(run(`state.words['${FIRST_WORDS[1]}'].box`), 1);
});

test('recordWord (SRS): doğru kutu artırır ve tavanda durur, yanlış Kutu 1\'e indirir', () => {
  const { run } = makeEnv();
  const k = FIRST_WORDS[0];
  for (let i = 0; i < 10; i++) run(`recordWord('${k}', true)`);
  eq(run(`state.words['${k}'].box`), run('SRS_INTERVALS.length - 1'), 'tavan');
  run(`recordWord('${k}', false)`);
  eq(run(`state.words['${k}'].box`), 1);
  eq(run(`state.words['${k}'].wrong`), 1);
});

test('Cihaz Eşitle kodu: telefon -> bilgisayar birleştirme', () => {
  const phone = makeEnv({ a1english_v2: JSON.stringify(legacy480()) });
  const code = phone.run('generateSyncCode()');
  const pc = makeEnv({ a1english_v2: JSON.stringify({ ...legacy480(), xp: 50, units: {} }) });
  pc.run(`mergeSyncCode('${code}')`);
  eq(pc.run('state.xp'), 480);
  eq(pc.run('doneCount()'), 2);
});

test('Tema: karanlık/aydınlık bilgisi sadece PALETTES\'ten gelir ve kaydedilir', () => {
  const { run, localStorage, attrs } = makeEnv();
  const palettes = run('PALETTES.map(p => ({ id: p.id, dark: !!p.isDark }))');
  for (const p of palettes) {
    run(`themeService.apply('${p.id}')`);
    eq(localStorage._raw.a1_data_mode, p.dark ? 'dark' : 'light', p.id);
    eq(attrs['data-mode'], p.dark ? 'dark' : 'light', p.id + ' attr');
  }
});

test('Nezaket & Kültür kategorisi: phrases ve dinleme kalıpları eksiksiz tanımlı', () => {
  const { run } = makeEnv();
  const culture = run('LOGIC_GUIDES.find(g => g.category === "culture")');
  ok(culture, 'Nezaket ve kültür kategorisi bulunmalı');
  ok(Array.isArray(culture.phrases) && culture.phrases.length >= 3, 'En az 3 dinleme kalıbı içermeli');
  for (const p of culture.phrases) {
    ok(p.en && p.tr && p.tip, `Kalıp en/tr/tip alanlarına sahip olmalı: ${JSON.stringify(p)}`);
  }
});

test('Gemini API anahtarı: state, window ve env değişkenlerinden boşluksuz alınır', () => {
  const envWithState = makeEnv({ a1english_v2: JSON.stringify({ ...legacy480(), settings: { apiKey: '  AIzaCustomKey123  ' } }) });
  eq(envWithState.run('getApiKey()'), 'AIzaCustomKey123');
  ok(envWithState.run('hasAI()'), 'hasAI true olmalı');

  const envWithWindow = makeEnv({ a1english_v2: JSON.stringify({ ...legacy480(), settings: { apiKey: '' } }) });
  envWithWindow.run('window.GEMINI_API_KEY = "  AIzaFromWindow456  ";');
  eq(envWithWindow.run('getApiKey()'), 'AIzaFromWindow456');
  ok(envWithWindow.run('hasAI()'), 'window.GEMINI_API_KEY ile hasAI true olmalı');
});

test('Lokomotif Simülatörü: Örnek 1, 2 ve 3 eksiksiz vagon ve mapping verisine sahip', () => {
  const { run } = makeEnv();
  const examples = run('LOKOMOTIF_EXAMPLES');
  ok(Array.isArray(examples) && examples.length >= 3, 'En az 3 lokomotif örneği olmalı');
  examples.forEach((ex, idx) => {
    ok(ex.tr && ex.explanation && ex.fullEn, `Örnek ${idx + 1} temel alanları içermeli`);
    ok(Array.isArray(ex.cars) && ex.cars.length >= 4, `Örnek ${idx + 1} en az 4 vagon içermeli`);
    ex.cars.forEach(c => ok(c.role && c.en && c.tr && c.color, `Örnek ${idx + 1} vagon eksiksiz olmalı`));
  });
});

test('Gemini API: anahtar yoksa dürüstçe NO_KEY hatası fırlatır', async () => {
  const env = makeEnv({ a1english_v2: JSON.stringify({ ...legacy480(), settings: { apiKey: '' } }) });
  let threw = false;
  try {
    await env.run('aiTest()');
  } catch (err) {
    threw = true;
    ok(err.message.includes('API anahtarı yok'), 'Doğru hata mesajı verilmeli');
  }
  ok(threw, 'Anahtar yokken hata fırlatılmalı');
});

/* ---------- Sonuç ---------- */
(async () => {
  const results = [];
  for (const { name, fn } of tests) {
    try {
      await fn();
      results.push([true, name]);
    } catch (e) {
      results.push([false, name, e.message]);
    }
  }

  let failed = 0;
  for (const [pass, name, err] of results) {
    console.log(`${pass ? '✅' : '❌'} ${name}${pass ? '' : '\n     → ' + err}`);
    if (!pass) failed++;
  }
  console.log(`\n${results.length - failed}/${results.length} test geçti.`);
  process.exit(failed ? 1 : 0);
})();
