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
const FILES = ['js/data.js', 'js/logic.js', 'js/storage.js', 'js/firebase.js', 'js/utils.js', 'js/exercises.js', 'js/ai.js'];
const SOURCES = FILES.map(f => [f, fs.readFileSync(path.join(ROOT, f), 'utf8')]);

/* ---------- Sahte tarayıcı ortamı ---------- */
function makeEnv(initialStorage = {}, options = {}) {
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
      querySelector: () => null,
      addEventListener: () => {}
    },
    setTimeout, clearTimeout, Date, Math, JSON, Promise,
    btoa: s => Buffer.from(s, 'binary').toString('base64'),
    atob: s => Buffer.from(s, 'base64').toString('binary'),
    escape, unescape, encodeURIComponent, decodeURIComponent
  };
  ctx.window = ctx;
  ctx.addEventListener = () => {};
  if (options.fetch) ctx.fetch = options.fetch;
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

test('Kategoriye Özel Simülatörler: Her kategori (mindset, culture, traps, survival) 3 örnek ve token haritasına sahip', () => {
  const { run } = makeEnv();
  const sims = run('LOGIC_SIMULATORS');
  ok(sims && sims.mindset && sims.culture && sims.traps && sims.survival, 'Tüm kategorilerin simülatörü olmalı');
  ['mindset', 'culture', 'traps', 'survival'].forEach(cat => {
    const s = sims[cat];
    ok(s.title && s.badge && s.desc, `${cat} simülatör başlık ve açıklamaları içermeli`);
    ok(Array.isArray(s.examples) && s.examples.length >= 3, `${cat} en az 3 simülatör örneği içermeli`);
    s.examples.forEach((ex, i) => {
      ok(ex.tr && ex.fullEn && ex.explanation, `${cat} Örnek ${i + 1} metin alanları eksiksiz olmalı`);
      ok(Array.isArray(ex.cars) && ex.cars.length >= 3, `${cat} Örnek ${i + 1} token/vagonları içermeli`);
    });
  });
  const cultSim = run('getSimulatorForCategory("culture")');
  ok(cultSim.id === 'culture' && cultSim.title.includes('Nezaket'), 'Nezaket kategorisi doğru simülatörü döndürmeli');
  const allSim = run('getSimulatorForCategory("all")');
  ok(allSim.id === 'mindset', 'Tümü seçeneği varsayılan Lokomotif simülatörünü döndürmeli');
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

/* Google Gemini API'si uygulama kodunda değil, burada (test tarafında) mock'lanır. */
function mockFetch(status, body) {
  const calls = [];
  const fn = async (url, opts) => {
    calls.push({ url, headers: (opts && opts.headers) || {} });
    return { status, ok: status >= 200 && status < 300, json: async () => body };
  };
  fn.calls = calls;
  return fn;
}
function envWithKey(key, fetchImpl, extraNavigator) {
  const env = makeEnv({ a1english_v2: JSON.stringify({ ...legacy480(), settings: { apiKey: key } }) }, { fetch: fetchImpl });
  if (extraNavigator) env.run(`globalThis.navigator = ${JSON.stringify(extraNavigator)};`);
  return env;
}

test('Gemini API: geçerli anahtar, Google yanıtı 200 dönünce aiTest başarılı olur ve anahtar istekle gönderilir', async () => {
  const f = mockFetch(200, { candidates: [{ content: { parts: [{ text: 'Hello! I am ready to help you learn English.' }] } }] });
  const env = envWithKey('AIzaSyValidKey1234567890', f);
  const res = await env.run('aiTest()');
  ok(res.includes('ready to help'), 'Geçerli anahtarla aiTest yanıt döndürmeli');
  ok(f.calls.length >= 1, 'Gerçekten ağ isteği yapılmalı');
  eq(f.calls[0].headers['x-goog-api-key'], 'AIzaSyValidKey1234567890', 'Anahtar x-goog-api-key başlığıyla gitmeli');
});

test('Gemini API: geçersiz anahtar (HTTP 400) BAD_KEY hatası verir, AIzaSy ile başlasa da sahte onay yok', async () => {
  const f = mockFetch(400, { error: { message: 'API key not valid.' } });
  const env = envWithKey('AIzaSyInvalidKey1234567890', f);
  let err = null;
  try { await env.run('aiTest()'); } catch (e) { err = e; }
  ok(err, 'Geçersiz anahtarda hata fırlatılmalı');
  eq(err.code, 'BAD_KEY', 'Hata kodu BAD_KEY olmalı');
});

test('Gemini API: yetkisiz anahtar (HTTP 403) BAD_KEY verir, ortam (webdriver/test) davranışı değiştirmez', async () => {
  const f = mockFetch(403, { error: { message: 'Permission denied.' } });
  const env = envWithKey('AIzaSyTEST_dummyKey1234567890', f, { webdriver: true });
  let err = null;
  try { await env.run('aiTest()'); } catch (e) { err = e; }
  ok(err, 'webdriver ve "test" içeren anahtarda da gerçek doğrulama yapılmalı');
  eq(err.code, 'BAD_KEY', 'Hata kodu BAD_KEY olmalı');
  ok(f.calls.length >= 1, 'Anahtar adı ne olursa olsun ağ isteği yapılmalı');
});

test('Landing dashboard bileşenleri: index.html Günlük, hedef, sonraki ders ve Genel Kurs İlerlemesi özeti içerir', () => {
  const fs = require('fs');
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  ok(html.includes('Günlük'), 'index.html "Günlük" kelimesini içermeli');
  ok(html.includes('hedef'), 'index.html "hedef" kelimesini içermeli');
  ok(html.includes('Sonraki ders') || html.includes('sonraki ders'), 'index.html "Sonraki ders" ibaresini içermeli');
  ok(html.includes('Kurs İlerlemesi'), 'index.html "Kurs İlerlemesi" progress card içermeli');
  ok(html.includes('Genel Kurs Tamamlama Özeti') || html.includes('Overall Completion'), 'index.html overall progress summary içermeli');
  ok(html.includes('href="#/lesson/u1"'), 'index.html derse başlama butonu doğrudan #/lesson/u1 rotasına gitmeli');
});

test('Firebase Auth fallback: operation-not-allowed veya çevrimdışıyken çökmeden yerel oturum açar', async () => {
  const env = makeEnv();
  const u = await env.run('authService.signInWithEmail("test@example.com", "pass123")');
  ok(u && u.email === 'test@example.com', 'Sağlayıcı yokken yerel hesapla giriş yapılabilmeli');
  ok(env.run('state.auth.isGuest === false'), 'Kullanıcı giriş yapmış sayılmalı');
});

test('A2 Müfredatı: 27 A1 + 25 A2 ünitesi ve toplam 52 ünite eksiksiz tanımlı', () => {
  const env = makeEnv();
  const total = env.run('UNITS.length');
  const a1 = env.run('UNITS.filter(u => u.level === "A1").length');
  const a2 = env.run('UNITS.filter(u => u.level === "A2").length');
  eq(total, 52, 'Toplam 52 ünite olmalı');
  eq(a1, 27, 'A1 seviyesinde 27 ünite olmalı');
  eq(a2, 25, 'A2 seviyesinde 25 ünite olmalı');
  ok(env.run('UNITS.some(u => u.id === "too_enough")'), 'too_enough ünitesi bulunmalı');
  ok(env.run('UNITS.some(u => u.id === "first_conditional")'), 'first_conditional ünitesi bulunmalı');
  ok(env.run('UNITS.some(u => u.id === "relative_pronouns")'), 'relative_pronouns ünitesi bulunmalı');
});

test('Büyük sayılar ve sıra sayıları: 100 - 1.000.000 ve 1st-20th eksiksiz tanımlı', () => {
  const env = makeEnv();
  const largeUnit = env.run('UNITS.find(u => u.id === "numbers_large")');
  ok(largeUnit, 'numbers_large ünitesi tanımlı olmalı');
  const enWords = largeUnit.words.map(w => w.en);
  ok(enWords.includes('one hundred'), 'one hundred bulunmalı');
  ok(enWords.includes('one thousand'), 'one thousand bulunmalı');
  ok(enWords.includes('one million'), 'one million bulunmalı');
  ok(enWords.includes('first'), 'first bulunmalı');
  ok(enWords.includes('second'), 'second bulunmalı');
  ok(enWords.includes('tenth'), 'tenth bulunmalı');
});

test('Boss testleri: buildA1BossTest ve buildA2BossTest 15\'er soru üretir', () => {
  const env = makeEnv();
  const a1Q = env.run('buildA1BossTest()');
  const a2Q = env.run('buildA2BossTest()');
  eq(a1Q.length, 15, 'A1 Boss testi 15 soru olmalı');
  eq(a2Q.length, 15, 'A2 Boss testi 15 soru olmalı');
});

test('Kelime kartları: A2 seviyesi açılmadıkça A2 kartları gizli kalır, açılınca listelenir', () => {
  const env = makeEnv();
  ok(!env.run('state.a2Unlocked'), 'Başlangıçta A2 kilitli olmalı');
  const a1VocabCount = env.run('UNITS.filter(x => x.type === "vocab" && x.level === "A1").length');
  const totalVocabCount = env.run('UNITS.filter(x => x.type === "vocab").length');
  ok(a1VocabCount > 0, 'A1 kelime üniteleri bulunmalı');
  ok(totalVocabCount > a1VocabCount, 'Toplam kelime üniteleri A1 den fazla olmalı (A2 dahil)');

  // store.unlockA2() çağrıldığında A2 kartları açılır
  env.run('store.unlockA2()');
  ok(env.run('state.a2Unlocked'), 'A2 kilidi açılmış olmalı');
});

test('Kelime tekrarı: vadesi gelen kelime yoksa dueWords boş döner (boş durum garantisi)', () => {
  const env = makeEnv();
  const due = env.run('dueWords()');
  eq(due.length, 0, 'Yeni kullanıcıda vadesi gelen kelime olmamalı');
});

test('Üretim kodu saflığı: js/ altında test ortamı algılama veya sahte anahtar bulunmaz', () => {
  const fs = require('fs');
  const forbidden = ['navigator.webdriver', '__TEST__', 'isTestSandboxKey', 'MockTestKey', 'MockUpdatedKey', 'SeededKeyForUpdateTest'];
  const jsDir = path.join(ROOT, 'js');
  for (const f of fs.readdirSync(jsDir).filter(n => n.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(jsDir, f), 'utf8');
    for (const token of forbidden) {
      ok(!src.includes(token), `js/${f} içinde yasaklı test hilesi var: ${token}`);
    }
  }
});

test('Ana sayfa kısayolları: AI Öğretmen kurulum butonu (#dashAiSetupBtn) ve Kelime Tekrarı kısayolu (#dashReviewBtn) tanımlı', () => {
  const fs = require('fs');
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
  const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  ok(appSrc.includes('id="dashReviewCard"') && appSrc.includes('id="dashReviewBtn"'), 'app.js içinde #dashReviewCard ve #dashReviewBtn bulunmalı');
  ok(appSrc.includes('id="dashAiCard"') && appSrc.includes('id="dashAiSetupBtn"') && appSrc.includes('id="dashAiHowtoBtn"'), 'app.js içinde #dashAiCard, #dashAiSetupBtn ve #dashAiHowtoBtn bulunmalı');
  ok(appSrc.includes('AI Öğretmeni Kur (Gemini API Ayarları)'), 'AI kartında doğrudan Gemini API kurulum butonu metni bulunmalı');
  ok(appSrc.includes('Akıllı Tekrar Sayfasına Git') && appSrc.includes('Kelime Tekrarı'), 'Tekrar kartında Akıllı Tekrar (Spaced Repetition) kısayolu bulunmalı');

  ok(htmlSrc.includes('id="dashReviewBtn"') && htmlSrc.includes('href="#/review"'), 'index.html içinde #/review kısayolu bulunmalı');
  ok(htmlSrc.includes('id="dashAiSetupBtn"') && htmlSrc.includes('href="#/ai"'), 'index.html içinde #/ai kurulum kısayolu bulunmalı');
});

test('Bölüm ilerlemesi, boş tekrar seansı ve AI kurulum kalıcılığı bileşenleri tanımlı', () => {
  const fs = require('fs');
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');

  ok(appSrc.includes('function renderUnitProgressionCard(u)') && appSrc.includes('id="chapterProgressionCard"'), 'Kilitli/açık ünitelerde Bölüm İlerlemesi (Chapter Progression) kartı bulunmalı');
  ok(appSrc.includes('Serbest Tekrar Seansı Başlat'), 'Boş tekrar durumunda doğrudan serbest tekrar seansı başlatma aksiyonu bulunmalı');
  ok(appSrc.includes('id="aiSetupSuccessBanner"') && appSrc.includes('id="aiPingBtn"'), 'AI kurulumunda kalıcı kayıt onayı ve ayrı bağlantı testi butonu bulunmalı');
});

test('Sincap Yoldaş (Fındık): Yavrudan Ustaya 5 büyüme evresi ve ders/kelime yardımcısı çalışır', () => {
  const env = makeEnv();
  eq(env.run('state.mascot'), 'squirrel', 'Varsayılan yoldaş sincap (squirrel) olmalı');
  eq(env.run('mascotService.getActive().name'), 'Fındık', 'Aktif yoldaş adı Fındık olmalı');

  const st1 = env.run('getSquirrelGrowth(0)');
  eq(st1.stage, 1, '0 XP de 1. evre (Minik Yavru Sincap) olmalı');
  eq(st1.id, 'baby');
  ok(st1.title.includes('Yavru Sincap'), '1. evre başlığı Yavru Sincap içermeli');

  const st2 = env.run('getSquirrelGrowth(150)');
  eq(st2.stage, 2, '150 XP de 2. evre (Meraklı Toplayıcı Sincap) olmalı');
  eq(st2.id, 'explorer');

  const st3 = env.run('getSquirrelGrowth(450)');
  eq(st3.stage, 3, '450 XP de 3. evre (Okullu Çırak Sincap) olmalı');
  eq(st3.id, 'student');

  const st4 = env.run('getSquirrelGrowth(900)');
  eq(st4.stage, 4, '900 XP de 4. evre (Bilgin Rehber Sincap) olmalı');
  eq(st4.id, 'scholar');

  const st5 = env.run('getSquirrelGrowth(1600)');
  eq(st5.stage, 5, '1600 XP de 5. evre (Usta Profesör Sincap) olmalı');
  eq(st5.id, 'master');
  eq(st5.xpLeft, 0, 'Son evrede kalan XP 0 olmalı');

  const clue = env.run('getSquirrelQuestionClue({ kind: "mc", prompt: "She ___ my sister.", answer: "is" })');
  ok(clue.includes('He / She / It'), 'Tekil özne sorusunda gramer ipucu vermeli');

  const fs = require('fs');
  const htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
  ok(htmlSrc.includes('id="shimeji-root"'), 'index.html içinde Shimeji ekran dostu katmanı (#shimeji-root) bulunmalı');
  ok(appSrc.includes('function initShimejiCompanion()') && appSrc.includes('id="shimejiPet"'), 'js/app.js içinde yürüyen Shimeji sincap kontrolcüsü (initShimejiCompanion) bulunmalı');
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
