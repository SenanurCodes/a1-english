#!/usr/bin/env node
/* ============================================================
   PatiLingo - Automated Test Suite (JSDOM + Node.js)
   Tests: npm test / node tests/run-tests.js
   Loads scripts in index.html order via <script> elements.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SCRIPT_FILES = [
  'js/data.js',
  'js/logic.js',
  'js/storage.js',
  'js/firebase.js',
  'js/icons.js',
  'js/utils.js',
  'js/ai.js',
  'js/exercises.js',
  'js/games.js',
  'js/app.js'
];

const SCRIPT_SOURCES = SCRIPT_FILES.map(f => [f, fs.readFileSync(path.join(ROOT, f), 'utf8')]);

/* ---------- Test Suite Setup Helper ---------- */
function createEnv(options = {}) {
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  const dom = new JSDOM(indexHtml, {
    url: 'https://localhost/',
    runScripts: 'dangerously',
    pretendToBeVisual: true
  });

  const { window } = dom;

  // Prompt Stubs: HTMLCanvasElement.getContext, window.scrollTo, Element.prototype.scrollIntoView, fetch
  window.HTMLCanvasElement.prototype.getContext = () => ({
    fillRect() {}, clearRect() {}, getImageData() {}, putImageData() {},
    createImageData() {}, setTransform() {}, drawImage() {}, save() {},
    fillText() {}, restore() {}, beginPath() {}, moveTo() {}, lineTo() {},
    closePath() {}, stroke() {}, strokeRect() {}, arc() {}, fill() {}
  });
  // TextEncoder & TextDecoder stubs for jsdom environment
  if (!window.TextEncoder && typeof TextEncoder !== 'undefined') {
    window.TextEncoder = TextEncoder;
  }
  if (!window.TextDecoder && typeof TextDecoder !== 'undefined') {
    window.TextDecoder = TextDecoder;
  }

  window.scrollTo = () => {};
  window.Element.prototype.scrollIntoView = () => {};

  // Crypto subtle stub for jsdom
  if (!window.crypto.subtle && globalThis.crypto && globalThis.crypto.subtle) {
    try {
      Object.defineProperty(window.crypto, 'subtle', {
        value: globalThis.crypto.subtle,
        configurable: true
      });
    } catch (e) {
      window.crypto.subtle = globalThis.crypto.subtle;
    }
  }

  // Audio & Speech Synthesis stubs
  window.speechSynthesis = {
    speak() {}, cancel() {}, pause() {}, resume() {}, getVoices: () => []
  };
  window.SpeechSynthesisUtterance = function() {};
  window.Audio = function() {
    return { play: () => Promise.resolve(), pause() {} };
  };

  // Mock fetch
  if (options.fetch) {
    window.fetch = options.fetch;
  } else {
    window.fetch = () => Promise.resolve(new window.Response('{}', { status: 200 }));
  }

  // Pre-seed localStorage
  if (options.localStorage) {
    for (const [k, v] of Object.entries(options.localStorage)) {
      window.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
  }

  if (options.corruptLocalStorage) {
    window.localStorage.setItem('a1english_v1', '{bozuk json');
  }

  // Ensure timer unref so test process never hangs
  const origSetInterval = window.setInterval;
  window.setInterval = (fn, ms) => {
    const id = origSetInterval(fn, ms);
    if (id && typeof id.unref === 'function') id.unref();
    return id;
  };

  // Load scripts in index.html order via <script> elements (NO eval)
  for (const [file, code] of SCRIPT_SOURCES) {
    const scriptEl = window.document.createElement('script');
    scriptEl.textContent = code;
    window.document.body.appendChild(scriptEl);
  }

  const run = code => {
    const s = window.document.createElement('script');
    const isExpr = !code.includes(';') && !code.includes('\n');
    s.textContent = `window.__lastRunResult = (() => { ${isExpr ? 'return (' + code + ');' : code} })();`;
    window.document.body.appendChild(s);
    return window.__lastRunResult;
  };

  const runAsync = async code => {
    const s = window.document.createElement('script');
    const isExpr = !code.includes(';') && !code.includes('\n');
    s.textContent = `window.__lastRunPromise = (async () => { ${isExpr ? 'return (' + code + ');' : code} })();`;
    window.document.body.appendChild(s);
    return await window.__lastRunPromise;
  };

  return { dom, window, run, runAsync };
}

/* ---------- Test Assertions ---------- */
const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}
function eq(actual, expected, msg) {
  const a = JSON.stringify(actual), b = JSON.stringify(expected);
  if (a !== b) throw new Error(`${msg || 'eşit değil'}: beklenen ${b}, gelen ${a}`);
}
function ok(cond, msg) {
  if (!cond) throw new Error(msg || 'koşul sağlanmadı');
}

/* ============================================================
   1. Tüm JS Dosyaları Hatasız Yükleniyor
   ============================================================ */
test('1. Tüm JS dosyaları index.html sırasıyla <script> elementleri olarak hatasız yükleniyor', () => {
  const { window } = createEnv();
  ok(window.document, 'DOM penceresi başarıyla oluşturulmalı');
  ok(typeof window.router === 'function', 'app.js router fonksiyonu tanımlı olmalı');
  ok(typeof window.screenHome === 'function', 'screenHome tanımlı olmalı');
  ok(typeof window.screenReview === 'function', 'screenReview tanımlı olmalı');
  ok(typeof window.screenProgress === 'function', 'screenProgress tanımlı olmalı');
});

/* ============================================================
   2. UNITS Bütünlüğü: id'ler benzersiz, vocab boş en/tr yok
   ============================================================ */
test('2. UNITS: id\'ler benzersiz, vocab ünitelerinde boş en/tr yok', () => {
  const { run } = createEnv();
  const units = run('UNITS');
  ok(Array.isArray(units) && units.length === 97, 'Müfredatta toplam 97 ünite olmalı (A1: 27, A2: 25, B1: 22, B2: 23)');

  const ids = units.map(u => u.id);
  eq(new Set(ids).size, ids.length, 'Tüm ünite id\'leri benzersiz olmalı');

  let emptyCount = 0;
  units.filter(u => u.type === 'vocab').forEach(u => {
    ok(Array.isArray(u.words) && u.words.length > 0, `${u.id} ünitesi kelime listesine sahip olmalı`);
    u.words.forEach(w => {
      if (!w.en || !w.tr || !w.en.trim() || !w.tr.trim()) emptyCount++;
    });
  });
  eq(emptyCount, 0, 'Hiçbir vocab kelimesinde boş en/tr olmamalı');
});

/* ============================================================
   3. Soru Üreticileri: buildUnitLesson, Boss & Placement Testleri
   ============================================================ */
test('3. Soru üreticileri: buildUnitLesson, buildPlacementTest, buildA1BossTest, buildA2BossTest, buildReviewLesson', () => {
  const { run } = createEnv();

  // Her ünite için buildUnitLesson doğrulaması
  const units = run('UNITS');
  for (const u of units) {
    const qs = run(`buildUnitLesson(UNITS.find(x => x.id === "${u.id}"))`);
    ok(Array.isArray(qs) && qs.length >= 5, `${u.id} için soru üretilmeli (en az 5 soru)`);

    for (const q of qs) {
      if (q.kind === 'mc') {
        ok(Array.isArray(q.options), `${u.id} mc sorusu options dizisine sahip olmalı`);
        ok(q.options.includes(q.answer), `${u.id} mc cevabı (${q.answer}) options içinde bulunmalı`);
        eq(new Set(q.options).size, q.options.length, `${u.id} mc seçenekleri tekrarsız olmalı`);
      } else if (q.kind === 'order') {
        ok(Array.isArray(q.words) && q.answer, `${u.id} order sorusu words ve answer içermeli`);
        const wordsSorted = [...q.words].sort().join(' ');
        const answerWordsSorted = q.answer.trim().split(/\s+/).sort().join(' ');
        eq(wordsSorted, answerWordsSorted, `${u.id} order kelimeleri cevapla tam uyuşmalı`);
      }
    }
  }

  // buildPlacementTest
  const placement = run('buildPlacementTest()');
  ok(Array.isArray(placement) && placement.length >= 10, 'buildPlacementTest soruları dönmeli');

  // buildA1BossTest & buildA2BossTest
  const boss1 = run('buildA1BossTest()');
  eq(boss1.length, 15, 'buildA1BossTest tam 15 soru üretmeli');

  const boss2 = run('buildA2BossTest()');
  eq(boss2.length, 15, 'buildA2BossTest tam 15 soru üretmeli');

  const bossB1 = run('buildB1BossTest()');
  eq(bossB1.length, 15, 'buildB1BossTest tam 15 soru üretmeli');

  const bossB2 = run('buildB2BossTest()');
  eq(bossB2.length, 15, 'buildB2BossTest tam 15 soru üretmeli');

  // buildReviewLesson
  const reviewQs = run('buildReviewLesson(UNITS[0].words)');
  ok(Array.isArray(reviewQs) && reviewQs.length > 0, 'buildReviewLesson soru listesi üretmeli');
});

/* ============================================================
   4. Rotaların Hatasız Render Edilmesi (HATA 1 Doğrulaması Dahil)
   ============================================================ */
test('4. Rotalar hatasız render oluyor (review ve progress dahil)', () => {
  const { window, run } = createEnv();

  const coreRoutes = [
    'home', 'learn', 'logic', 'leaderboard', 'review', 'cards/u1',
    'ai', 'progress', 'settings', 'placement', 'ai-lesson', 'boss-a1', 'boss-a2', 'boss-b1', 'boss-b2', 'auth', 'locomotive', 'trap-hunter', 'survival'
  ];

  // Temel rotaların testi
  for (const r of coreRoutes) {
    window.location.hash = '#/' + r;
    window.router();
    ok(window.document.body.innerHTML.length > 0, `${r} rotası başarıyla render olmalı`);
  }

  // Tüm 52 ünitenin lesson, cards ve grammar rotaları
  const units = run('UNITS');
  for (const u of units) {
    window.location.hash = '#/lesson/' + u.id;
    window.router();

    window.location.hash = '#/cards/' + u.id;
    window.router();

    if (u.type === 'grammar') {
      window.location.hash = '#/grammar/' + u.id;
      window.router();
    }
  }

  // HATA 1 Regresyon Kontrolü: screenReview ve screenProgress curMascot ile ReferenceError vermemeli
  window.location.hash = '#/review';
  window.router();
  const reviewHtml = window.document.getElementById('view').innerHTML;
  ok(reviewHtml.includes('Zula') || reviewHtml.includes('Tazeleme') || reviewHtml.includes('Güvende'), 'Review sayfası hatasız açılmalı');

  window.location.hash = '#/progress';
  window.router();
  const progressHtml = window.document.getElementById('view').innerHTML;
  ok(progressHtml.includes('İlerlemen') || progressHtml.includes('Analizi'), 'Progress sayfası hatasız açılmalı');

  // Yoldaş Değişimi & Canlı Modal Doğrulaması (Pamuk, Bambu, Fındık)
  run(`
    store.setMascot('cat');
    applyMascotChange('cat');
  `);
  eq(run('mascotService.getActive().id'), 'cat', 'Aktif yoldaş Pamuk (cat) olmalı');
  const catSvg = run('renderMascotStageSVG("cat", "baby", "normal")');
  ok(catSvg.includes('yarn') || catSvg.includes('Yün Yumağı'), 'Kedi SVG tüy/yün yumağı içermeli');

  run(`
    store.setMascot('panda');
    applyMascotChange('panda');
  `);
  eq(run('mascotService.getActive().id'), 'panda', 'Aktif yoldaş Bambu (panda) olmalı');
  const pandaSvg = run('renderMascotStageSVG("panda", "baby", "normal")');
  ok(pandaSvg.includes('bamboo') || pandaSvg.includes('Bambu'), 'Panda SVG bambu filizi içermeli');

  run('openMascotSelectModal()');
  const choiceRows = window.document.querySelectorAll('.mascot-choice-row');
  eq(choiceRows.length, 3, 'Yoldaş seçim modalında 3 hayvan olmalı');
  run('closeModal()');
});

/* ============================================================
   5. ai.js: 200, 429, 403, 404, NO_KEY, Alıştırma Filtreleme, aiChat Rollback
   ============================================================ */
test('5. ai.js (fetch mock): 200, 429, 403, 404 fallback, NO_KEY, json temizleme, aiChat rollback', async () => {
  // 5.1 Anahtarsız -> NO_KEY
  {
    const { runAsync } = createEnv();
    let errCode = null;
    try {
      await runAsync('gemini({ contents: [{ role: "user", parts: [{ text: "hi" }] }] })');
    } catch (e) {
      errCode = e.code;
    }
    eq(errCode, 'NO_KEY', 'Anahtar yokken NO_KEY fırlatılmalı');
  }

  // 5.2 200 Başarılı
  {
    const mockFetch = async () => new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: 'Hello from AI' }] } }]
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    const { run, runAsync } = createEnv({ fetch: mockFetch });
    run('state.settings.apiKey = "AIzaSyTestValidKey123"');
    const res = await runAsync('gemini({ contents: [{ role: "user", parts: [{ text: "hi" }] }] })');
    eq(res, 'Hello from AI', '200 başarılı yanıtta AI cevabı dönmeli');
  }

  // 5.3 429 -> RATE_LIMIT
  {
    const mockFetch = async () => new Response(JSON.stringify({
      error: { message: 'Quota exceeded' }
    }), { status: 429, headers: { 'Content-Type': 'application/json' } });

    const { run, runAsync } = createEnv({ fetch: mockFetch });
    run('state.settings.apiKey = "AIzaSyTestValidKey123"');
    let errCode = null;
    try {
      await runAsync('gemini({ contents: [{ role: "user", parts: [{ text: "hi" }] }] })');
    } catch (e) {
      errCode = e.code;
    }
    eq(errCode, 'RATE_LIMIT', '429 durumunda RATE_LIMIT fırlatılmalı');
  }

  // 5.4 403 -> BAD_KEY
  {
    const mockFetch = async () => new Response(JSON.stringify({
      error: { message: 'The provided API key is invalid' }
    }), { status: 403, headers: { 'Content-Type': 'application/json' } });

    const { run, runAsync } = createEnv({ fetch: mockFetch });
    run('state.settings.apiKey = "AIzaSyBadKey123"');
    let errCode = null;
    try {
      await runAsync('gemini({ contents: [{ role: "user", parts: [{ text: "hi" }] }] })');
    } catch (e) {
      errCode = e.code;
    }
    eq(errCode, 'BAD_KEY', '403 durumunda BAD_KEY fırlatılmalı');
  }

  // 5.5 404 -> Yedek modele geçiş
  {
    let triedModels = [];
    const mockFetch = async (url) => {
      const model = url.split('/models/')[1].split(':')[0];
      triedModels.push(model);
      if (model === 'gemini-2.5-flash') {
        return new Response('Not found', { status: 404 });
      }
      return new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: 'Fallback model succeeded' }] } }]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    };

    const { run, runAsync } = createEnv({ fetch: mockFetch });
    run('state.settings.apiKey = "AIzaSyKey123"');
    run('state.settings.model = "gemini-2.5-flash"');
    const res = await runAsync('gemini({ contents: [{ role: "user", parts: [{ text: "hi" }] }] })');
    eq(res, 'Fallback model succeeded', '404 sonrası yedek modele geçerek başarılı olmalı');
    ok(triedModels.length >= 2, 'En az iki model denenmiş olmalı');
  }

  // 5.6 aiGenerateExercises bozuk soruları eler ve ```json sarmalını temizler
  {
    const rawAiOutput = '```json\n{\n  "title": "A1 Pratik",\n  "questions": [\n    { "t": "mc", "q": "I ___ a doctor.", "o": ["am", "is", "are"], "a": "am", "h": "to be" },\n    { "t": "mc", "q": "Bozuk soru", "o": ["x", "y"], "a": "z" },\n    { "t": "order", "s": "I like cats", "tr": "Kedileri severim" },\n    { "t": "mc", "q": "She ___ happy.", "o": ["is", "are"], "a": "is" }\n  ]\n}\n```';

    const mockFetch = async () => new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: rawAiOutput }] } }]
    }), { status: 200 });

    const { run, runAsync } = createEnv({ fetch: mockFetch });
    run('state.settings.apiKey = "AIzaSyKey123"');
    const ex = await runAsync('aiGenerateExercises("Selamlaşma")');
    eq(ex.title, 'A1 Pratik');
    eq(ex.questions.length, 3, 'Bozuk soru (cevabı seçeneklerde olmayan) elenmeli, 3 geçerli soru kalmalı');
  }

  // 5.7 aiChat hata verirse geçmişi geri alır (rollback)
  {
    const mockFetch = async () => new Response('Internal error', { status: 500 });
    const { run, runAsync } = createEnv({ fetch: mockFetch });
    run('state.settings.apiKey = "AIzaSyKey123"');
    run('state.chat = [{ role: "user", text: "Önceki mesaj" }]');
    let chatFailed = false;
    try {
      await runAsync('aiChat("Hatalı mesaj")');
    } catch (e) {
      chatFailed = true;
    }
    ok(chatFailed, 'aiChat hata fırlatmalı');
    const chatLen = run('state.chat.length');
    eq(chatLen, 1, 'Hata anında eklenen son kullanıcı mesajı geri alınmalı (rollback)');
  }
});

/* ============================================================
   6. Auth: Doğrulama, Kayıt, Şifre Kontrolü, HATA 2 Regresyonu ve Hash Göçü
   ============================================================ */
test('6. Auth (window.firebase yokken): Geçersiz e-posta/şifre, kayıtsız e-posta reddi (HATA 2) ve SHA-256 göçü', async () => {
  const { run, runAsync } = createEnv();

  // 6.1 Geçersiz e-posta
  let err = null;
  try {
    await runAsync('authService.registerWithEmail("gecersiz-email", "123456")');
  } catch (e) { err = e.message; }
  ok(err && err.includes('geçerli bir e-posta'), 'Geçersiz e-posta reddedilmeli');

  // 6.2 Kısa şifre
  err = null;
  try {
    await runAsync('authService.registerWithEmail("valid@test.com", "12345")');
  } catch (e) { err = e.message; }
  ok(err && err.includes('en az 6 karakter'), '6 karakterden kısa şifre reddedilmeli');

  // 6.3 Boş şifre ile giriş
  err = null;
  try {
    await runAsync('authService.signInWithEmail("valid@test.com", "")');
  } catch (e) { err = e.message; }
  ok(err && err.includes('şifreni gir'), 'Boş şifreyle giriş reddedilmeli');

  // 6.4 HATA 2 REGRESYON TESTİ: Kayıtsız e-posta ile giriş YENİ HESAP AÇMAMALI, HATA VERMELİ
  err = null;
  try {
    await runAsync('authService.signInWithEmail("kayitsiz_biri@test.com", "sifre123456")');
  } catch (e) { err = e.message; }
  ok(err && err.includes('hesap bulunamadı'), 'Kayıtsız e-posta sessizce hesap oluşturmamalı, hesap bulunamadı hatası fırlatmalı');

  // 6.5 Kayıt sonrası doğru şifreyle giriş
  const registeredUser = await runAsync('authService.registerWithEmail("sena@test.com", "dogruSifre123", "Sena")');
  eq(registeredUser.email, "sena@test.com");
  eq(run('state.auth.isGuest'), false);

  // Yanlış şifre reddi
  err = null;
  try {
    await runAsync('authService.signInWithEmail("sena@test.com", "yanlisSifre")');
  } catch (e) { err = e.message; }
  ok(err && err.includes('hatalı'), 'Yanlış şifre reddedilmeli');

  // Doğru şifreyle oturum açma
  const signedUser = await runAsync('authService.signInWithEmail("sena@test.com", "dogruSifre123")');
  eq(signedUser.displayName, 'Sena');
  eq(run('state.auth.isGuest'), false);

  // 6.6 Eski hash formatından (legacy 32-bit) yeni SHA-256 + salt formatına otomatik geçiş
  const legacyPassword = 'eskiSifre123';
  const legacyHash = run(`authService._legacyHashStr("${legacyPassword}")`);

  // LocalStorage içine eski formatta hesap ekle
  const localAccs = run('authService._getLocalAccounts()');
  localAccs['legacy@test.com'] = {
    uid: 'u_legacy_test',
    email: 'legacy@test.com',
    displayName: 'Eski Kullanıcı',
    passHash: legacyHash,
    createdAt: 1000
  };
  run(`authService._saveLocalAccounts(${JSON.stringify(localAccs)})`);

  // Eski hesapla giriş yap
  const legacyLoginUser = await runAsync('authService.signInWithEmail("legacy@test.com", "eskiSifre123")');
  eq(legacyLoginUser.email, 'legacy@test.com');

  // Hesabın yeni formata (salt + SHA-256) taşındığını doğrula
  const updatedAccs = run('authService._getLocalAccounts()');
  const migratedAcc = updatedAccs['legacy@test.com'];
  ok(migratedAcc.salt && migratedAcc.salt.length === 32, 'Eski hesap yeni kullanıcı tuzu (salt) kazanmalı');
  ok(typeof migratedAcc.passHash === 'string' && migratedAcc.passHash.length === 64, 'Eski 32-bit hash 64 karakter SHA-256 hash\'e dönüştürülmeli');

  // Güncellenmiş yeni formatla tekrar sorunsuz giriş yapılabilmeli
  const secondLogin = await runAsync('authService.signInWithEmail("legacy@test.com", "eskiSifre123")');
  eq(secondLogin.email, 'legacy@test.com');
});

/* ============================================================
   7. XSS Güvenliği: esc() ve md() Güvenli Çıktı
   ============================================================ */
test('7. XSS: esc() ve md() script/onerror etiketlerini nötralize eder', () => {
  const { run } = createEnv();

  // esc() testleri
  const escapedScript = run('esc("<script>alert(1)</script>")');
  ok(!escapedScript.includes('<script>'), 'esc() script etiketini etkisiz kılmalı');
  ok(escapedScript.includes('&lt;script&gt;'), 'esc() html varlıklarına dönüştürmeli');

  const escapedOnerror = run('esc("<img src=x onerror=alert(1)>")');
  ok(!escapedOnerror.includes('<img'), 'esc() img tagını kaçırmalı');

  // md() testleri
  const mdScript = run('md("<script>alert(\'xss\')</script>")');
  ok(!mdScript.includes('<script>'), 'md() script etiketlerini render etmemeli');

  const mdOnerror = run('md("<img src=x onerror=alert(1)>")');
  ok(!mdOnerror.includes('<img') || !mdOnerror.includes('onerror'), 'md() onerror niteliğini yürütmemeli');

  const mdJsLink = run('md("[zararlı](javascript:alert(1))")');
  ok(!mdJsLink.includes('href="javascript:'), 'md() javascript: link protokolünü filtrelemeli');
});

/* ============================================================
   8. Bozuk LocalStorage: '{bozuk json' İle Çökmeden Açılma
   ============================================================ */
test('8. Bozuk localStorage (\'{bozuk json\') ile uygulama çökmeden varsayılan duruma döner', () => {
  const { window, run } = createEnv({ corruptLocalStorage: true });
  const schema = run('store.state.schemaVersion');
  eq(schema, 1, 'Bozuk localStorage sonrasında schemaVersion 1 olmalı');
  const xp = run('store.state.xp');
  eq(xp, 0, 'Bozuk localStorage sonrasında XP sıfırlanmış varsayılan state olmalı');

  window.location.hash = '#/home';
  window.router();
  ok(window.document.body.innerHTML.includes('PatiLingo'), 'Bozuk veride de arayüz başarıyla açılmalı');
});

/* ============================================================
   9. QA & Güvenlik Güçlendirmesi Doğrulaması (Kıdemli QA Raporu)
   ============================================================ */
test('9. QA & Güvenlik: Lig özyineleme koruması, Stored XSS filtreleme, TDZ göçü, 0/0 NaN önleme, Boss replay kontrolü', () => {
  const { window, run } = createEnv();

  // A. 0/0 Sıfıra bölme ve NaN kontrolü
  const pctZero = run('recordUnitResult("u1", 0, 0)');
  eq(pctZero, 0, '0/0 sonucu 0 dönmeli, NaN olmamalı');
  const u1Stat = run('store.state.units.u1');
  ok(Number.isFinite(u1Stat.best) && !isNaN(u1Stat.best), 'unit.best NaN olmamalı');

  // B. Türk tuzağı sınıflandırıcısı false-positive kontrolü
  const trapName = run('classifyTurkishTrap({ given: "name", correct: "apple", q: "Elma" })');
  ok(trapName.trap !== 'extra_be', '"name" kelimesi n-am-e içinde am geçiyor diye extra_be olmamalı');

  const trapThis = run('classifyTurkishTrap({ given: "this is my car", correct: "this is my car", q: "Bu benim arabam" })');
  ok(trapThis.trap !== 'extra_be', '"this" kelimesi th-is içinde is geçiyor diye extra_be olmamalı');

  // C. Boss replay ödülü koruması
  const initialXP = run('store.state.xp');
  run('store.passA1Boss()');
  const passedXP1 = run('store.state.xp');
  eq(passedXP1, initialXP + 200, 'İlk A1 Boss geçişinde 200 XP verilmeli');

  run('store.passA1Boss()');
  const passedXP2 = run('store.state.xp');
  eq(passedXP2, passedXP1 + 25, 'A1 Boss tekrarında tam 200 XP yerine pratik ödülü (25 XP) verilmeli');

  // D. Stored XSS ve Zararlı Avatar Filtrelemesi
  const maliciousMember = run(`
    return normalizeLeagueMember({
      id: "hacker123",
      name: "<b>Hacker</b><script>alert(1)</script>",
      avatar: "<img src=x onerror=alert('xss')>",
      xp: 999999999
    }, false);
  `);
  ok(!maliciousMember.avatar.includes('<'), 'normalizeLeagueMember zararlı avatar etiketini temizlemeli');
  eq(maliciousMember.avatar, '🧑', 'Zararlı avatar güvenli yedek emojisine dönmeli');
  ok(!maliciousMember.name.includes('<') && !maliciousMember.name.includes('>'), 'normalizeLeagueMember isimdeki HTML taglarını temizlemeli');
  ok(maliciousMember.xp <= 2000000, 'Aşırı yüksek XP üst sınıra indirgenmeli');

  // E. Lig Odasında gainXP Sonsuz Özyineleme (Maximum Call Stack) Koruması
  run(`
    store.state.leagueRoomId = 'test_room_123';
    store.save();
    store.gainXP(10);
  `);
  const currentXP = run('store.state.xp');
  ok(currentXP >= passedXP2 + 10, 'Lig odasında gainXP özyinelemeye girmeden başarıyla çalışmalı');

  // F. Çoklu Ünite Kelime Göçü (TDZ ReferenceError olmadan)
  run(`
    const id1 = UNITS[0].id;
    const id2 = UNITS[2].id;
    const id3 = UNITS[3].id;
    store.state.units[id1] = { done: true, best: 100 };
    store.state.units[id2] = { done: true, best: 85 };
    store.state.units[id3] = { done: true, best: 90 };
    store.save();
    migrateCompletedUnitsWords();
  `);
  const wordKeys = run('Object.keys(store.state.words)');
  ok(wordKeys.length >= 100, 'Tüm tamamlanmış ünitelerin kelimeleri (100+) TDZ takılmadan Kutu 1\'e taşınmalı');
});

/* ============================================================
   10. Yeni Nesil Oyun Modları: Lokomotif, Tuzak Avcısı, Hayatta Kalma
   ============================================================ */
test('10. Oyun Modları: Lokomotif SVO yapbozu, Tuzak Avcısı arcade ve Hayatta Kalma Haritası', () => {
  const { window, run } = createEnv();

  // A. Lokomotif Veritabanı ve Mekaniği
  const locoPuzzles = run('LOCOMOTIVE_PUZZLES');
  ok(Array.isArray(locoPuzzles) && locoPuzzles.length >= 5, 'En az 5 seviye lokomotif bulmacası bulunmalı');
  for (const p of locoPuzzles) {
    ok(p.wagons.length >= 3, 'Her bulmacada en az 3 vagon olmalı (Özne, Yüklem, Nesne)');
    ok(p.correctOrder.length === p.wagons.length, 'Doğru sıra vagon sayısıyla eşleşmeli');
  }

  // B. Tuzak Avcısı Veritabanı
  const traps = run('TRAP_HUNTER_DATABASE');
  ok(Array.isArray(traps) && traps.length >= 8, 'En az 8 adet Türk düşünce tuzağı olmalı');
  for (const t of traps) {
    ok(t.trapIndex >= 0 && t.trapIndex < t.sentence.length, 'Tuzak indeksi cümle uzunluğu içinde olmalı');
    ok(t.tip && t.tip.length > 5, 'Tuzak ipucu ve açıklaması bulunmalı');
  }

  // C. Hayatta Kalma Haritası Görevleri
  const quests = run('SURVIVAL_QUESTS');
  ok(Array.isArray(quests) && quests.length >= 4, 'En az 4 hayatta kalma görevi olmalı');
  for (const q of quests) {
    ok(q.objectives.length >= 2, 'Her görevde en az 2 hedef bulunmalı');
    ok(q.starterMsg && q.starterMsg.length > 10, 'Görev başlangıç mesajı olmalı');
  }

  // D. Ekranların Render Doğrulaması
  window.location.hash = '#/locomotive';
  window.router();
  const locoHtml = window.document.getElementById('view').innerHTML;
  ok(locoHtml.includes('Lokomotif') && locoHtml.includes('Vagon'), 'Lokomotif ekranı başarıyla render edilmeli');

  window.location.hash = '#/trap-hunter';
  window.router();
  const trapHtml = window.document.getElementById('view').innerHTML;
  ok(trapHtml.includes('Arcade') && (trapHtml.includes('Tuzak') || trapHtml.includes('Avcısı')), 'Tuzak Avcısı ekranı başarıyla render edilmeli');

  window.location.hash = '#/survival';
  window.router();
  const survivalHtml = window.document.getElementById('view').innerHTML;
  ok(survivalHtml.includes('Hayatta Kalma') && survivalHtml.includes('Heathrow'), 'Hayatta Kalma Haritası başarıyla render edilmeli');
});


/* ============================================================
   11. E2E User-Flow: Landing Hero Transition & Simulator Example Switching
   ============================================================ */
test('11. User-Flow: Landing hero aksiyonu ve Dil Mantığı simülatör örnek geçişleri', () => {
  const { window, run } = createEnv();

  // Test 1: Enter setup from the landing page hero action
  const state = run('state');
  state.onboarded = false;
  window.location.hash = '#/onboarding';
  window.router();

  const heroSection = window.document.getElementById('landingHeroSection');
  ok(heroSection, 'Landing Hero bölümü (#landingHeroSection) sayfada bulunmalı');
  const heroStartBtn = window.document.getElementById('landingHeroStartBtn');
  ok(heroStartBtn, 'Landing Hero Başlat butonu (#landingHeroStartBtn) bulunmalı');
  const setupCard = window.document.getElementById('onboardSetupCard');
  ok(setupCard, 'Kişiselleştirme kartı (#onboardSetupCard) bulunmalı');

  // Hero başlat aksiyonunu tetikle
  heroStartBtn.click();
  const nameIn = window.document.getElementById('nameIn');
  ok(nameIn, 'İsim input alanı (#nameIn) mevcut olmalı');
  nameIn.value = 'TestKullanici';

  const zeroBtn = window.document.getElementById('zeroBtn');
  ok(zeroBtn, 'Hemen Başla butonu (#zeroBtn) bulunmalı');
  zeroBtn.click();

  ok(state.onboarded === true, 'Kişiselleştirme sonrası onboarded=true olmalı');

  // Test 2: Open another simulator example & switch away from Örnek 3
  window.location.hash = '#/logic?example=3';
  window.router();

  let trText = window.document.getElementById('locoTrText')?.textContent || '';
  let enText = window.document.getElementById('locoEnFull')?.textContent || '';
  ok(trText.includes("Sarah yarın Londra"), 'Örnek 3 Türkçe cümlesi Sarah olmalı: ' + trText);
  ok(enText.includes("Sarah will fly to London"), 'Örnek 3 İngilizce cümlesi Sarah olmalı: ' + enText);

  // Şimdi Örnek 1'e geç (Örnek 3'ten başka bir örneğe geçiş)
  const ex1Btn = window.document.getElementById('loco-example-1');
  ok(ex1Btn, 'Örnek 1 butonu (#loco-example-1) bulunmalı');
  ex1Btn.click();

  trText = window.document.getElementById('locoTrText')?.textContent || '';
  enText = window.document.getElementById('locoEnFull')?.textContent || '';
  ok(!trText.includes("Sarah yarın Londra"), 'Örnek 1 seçilince Sarah cümlesi KALKMALI: ' + trText);
  ok(trText.includes("Ben dün kafede"), 'Örnek 1 cümlesi görünmeli: ' + trText);
  ok(enText.includes("I drank coffee"), 'Örnek 1 İngilizce cümlesi görünmeli: ' + enText);
  ok(ex1Btn.classList.contains('active'), 'Örnek 1 butonu active class almalı');

  // Örnek 2'ye geç
  const ex2Btn = window.document.getElementById('loco-example-2');
  ok(ex2Btn, 'Örnek 2 butonu (#loco-example-2) bulunmalı');
  ex2Btn.click();

  trText = window.document.getElementById('locoTrText')?.textContent || '';
  enText = window.document.getElementById('locoEnFull')?.textContent || '';
  ok(trText.includes("Biz her sabah"), 'Örnek 2 cümlesi görünmeli: ' + trText);
  ok(enText.includes("We run in the park"), 'Örnek 2 İngilizce cümlesi görünmeli: ' + enText);
});

/* ============================================================
   Test Çalıştırıcı (Runner)
   ============================================================ */
(async () => {
  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      await t.fn();
      console.log(`✅ ${t.name}`);
      passed++;
    } catch (err) {
      console.error(`❌ ${t.name}`);
      console.error(`     → ${err.message}`);
      if (err.stack) {
        const stackLines = err.stack.split('\n').slice(1, 4).join('\n');
        console.error(`     ${stackLines}`);
      }
      failed++;
    }
  }

  console.log(`\n${passed}/${passed + failed} test geçti.`);
  process.exit(failed > 0 ? 1 : 0);
})();
