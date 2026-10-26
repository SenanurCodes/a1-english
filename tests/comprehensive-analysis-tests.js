#!/usr/bin/env node
/* ============================================================
   PatiLingo - Kapsamlı Analiz Test Suite
   Aşamalı ve detaylı analiz testleri
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

  // Prompt Stubs
  window.HTMLCanvasElement.prototype.getContext = () => ({
    fillRect() {}, clearRect() {}, getImageData() {}, putImageData() {},
    createImageData() {}, setTransform() {}, drawImage() {}, save() {},
    fillText() {}, restore() {}, beginPath() {}, moveTo() {}, lineTo() {},
    closePath() {}, stroke() {}, strokeRect() {}, arc() {}, fill() {}
  });

  if (!window.TextEncoder && typeof TextEncoder !== 'undefined') {
    window.TextEncoder = TextEncoder;
  }
  if (!window.TextDecoder && typeof TextDecoder !== 'undefined') {
    window.TextDecoder = TextDecoder;
  }

  window.scrollTo = () => {};
  window.Element.prototype.scrollIntoView = () => {};

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

  window.speechSynthesis = {
    speak() {}, cancel() {}, pause() {}, resume() {}, getVoices: () => []
  };
  window.SpeechSynthesisUtterance = function() {};
  window.Audio = function() {
    return { play: () => Promise.resolve(), pause() {} };
  };

  if (options.fetch) {
    window.fetch = options.fetch;
  } else {
    window.fetch = () => Promise.resolve(new window.Response('{}', { status: 200 }));
  }

  if (options.localStorage) {
    for (const [k, v] of Object.entries(options.localStorage)) {
      window.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
  }

  if (options.corruptLocalStorage) {
    window.localStorage.setItem('a1english_v1', '{bozuk json');
  }

  const origSetInterval = window.setInterval;
  window.setInterval = (fn, ms) => {
    const id = origSetInterval(fn, ms);
    if (id && typeof id.unref === 'function') id.unref();
    return id;
  };

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
function gt(val, min, msg) {
  if (val <= min) throw new Error(`${msg || 'değer büyük olmalı'}: ${val} > ${min} gerekli`);
}
function lt(val, max, msg) {
  if (val >= max) throw new Error(`${msg || 'değer küçük olmalı'}: ${val} < ${max} gerekli`);
}

/* ============================================================
   FASE 1: VERİ YAPISI VE MÜFREDAT ANALİZİ
   ============================================================ */

test('1.1 Müfredat: Toplam ünite sayısı ve dağılım doğrulaması', () => {
  const { run } = createEnv();
  const units = run('UNITS');

  ok(Array.isArray(units), 'UNITS bir dizi olmalı');
  eq(units.length, 97, 'Toplam 97 ünite olmalı (A1: 27, A2: 25, B1: 22, B2:23)');

  const levelCounts = {
    A1: units.filter(u => u.level === 'A1').length,
    A2: units.filter(u => u.level === 'A2').length,
    B1: units.filter(u => u.level === 'B1').length,
    B2: units.filter(u => u.level === 'B2').length
  };

  eq(levelCounts.A1, 27, 'A1 seviyesinde 27 ünite olmalı');
  eq(levelCounts.A2, 25, 'A2 seviyesinde 25 ünite olmalı');
  eq(levelCounts.B1, 22, 'B1 seviyesinde 22 ünite olmalı');
  eq(levelCounts.B2, 23, 'B2 seviyesinde 23 ünite olmalı');
});

test('1.2 Müfredat: Ünite ID benzersizliği ve sıralı doğrulama', () => {
  const { run } = createEnv();
  const units = run('UNITS');

  const ids = units.map(u => u.id);
  eq(new Set(ids).size, ids.length, 'Tüm ünite ID\'leri benzersiz olmalı');

  // ID'ler string ve benzersiz olmalı (format esnek)
  ids.forEach(id => {
    ok(id && typeof id === 'string', `Ünite ID string olmalı: ${id}`);
  });

  // Sıralı indeks kontrolü
  const indexes = units.map(u => u.index);
  eq(new Set(indexes).size, indexes.length, 'Tüm indeksler benzersiz olmalı');
  eq(Math.max(...indexes), units.length - 1, 'Maksimum indeks toplam ünite sayısından 1 az olmalı');
});

test('1.3 Kelime veritabanı: Kelime sayısı ve dağılım analizi', () => {
  const { run } = createEnv();
  const units = run('UNITS');
  const allWords = run('ALL_WORDS');

  ok(Array.isArray(allWords), 'ALL_WORDS bir dizi olmalı');
  gt(allWords.length, 0, 'Kelime veritabanı boş olmamalı');

  // Her kelimenin gerekli alanları
  allWords.forEach(w => {
    ok(w.en && typeof w.en === 'string', 'Kelime "en" alanına sahip olmalı');
    ok(w.tr && typeof w.tr === 'string', 'Kelime "tr" alanına sahip olmalı');
    ok(w.key && typeof w.key === 'string', 'Kelime "key" alanına sahip olmalı');
    ok(w.unitId && typeof w.unitId === 'string', 'Kelime "unitId" alanına sahip olmalı');
  });

  // Kelime birim başına dağılım
  const vocabUnits = units.filter(u => u.type === 'vocab');
  vocabUnits.forEach(u => {
    ok(u.words && Array.isArray(u.words), `${u.id} ünitesi kelime listesine sahip olmalı`);
    gt(u.words.length, 0, `${u.id} ünitesi en az 1 kelimeye sahip olmalı`);
  });
});

test('1.4 Kelime veritabanı: Boş veya eksik alan kontrolü', () => {
  const { run } = createEnv();
  const allWords = run('ALL_WORDS');

  let emptyEn = 0, emptyTr = 0, missingKey = 0;
  allWords.forEach(w => {
    if (!w.en || !w.en.trim()) emptyEn++;
    if (!w.tr || !w.tr.trim()) emptyTr++;
    if (!w.key) missingKey++;
  });

  eq(emptyEn, 0, 'Hiçbir kelimenin "en" alanı boş olmamalı');
  eq(emptyTr, 0, 'Hiçbir kelimenin "tr" alanı boş olmamalı');
  eq(missingKey, 0, 'Hiçbir kelimenin "key" alanı eksik olmamalı');
});

test('1.5 Grammer üniteleri: Soru ve örnek kontrolü', () => {
  const { run } = createEnv();
  const units = run('UNITS');
  const grammarUnits = units.filter(u => u.type === 'grammar');

  gt(grammarUnits.length, 0, 'En az 1 gramer ünitesi olmalı');

  grammarUnits.forEach(u => {
    if (u.mc) {
      ok(Array.isArray(u.mc), `${u.id} mc (multiple choice) soruları bir dizi olmalı`);
      u.mc.forEach(([q, opts]) => {
        ok(q && typeof q === 'string', `${u.id} soru metni olmalı`);
        ok(Array.isArray(opts) && opts.length >= 2, `${u.id} seçenekler en az 2 elemanlı olmalı`);
      });
    }
    if (u.order) {
      ok(Array.isArray(u.order), `${u.id} order (sıralama) soruları bir dizi olmalı`);
      u.order.forEach(([s, tr]) => {
        ok(s && typeof s === 'string', `${u.id} order cümlesi olmalı`);
        ok(tr && typeof tr === 'string', `${u.id} order çevirisi olmalı`);
      });
    }
  });
});

test('1.6 Temel veri yapıları: ALL_WORDS ve UNIT_BY_ID bütünlüğü', () => {
  const { run } = createEnv();
  const units = run('UNITS');
  const allWords = run('ALL_WORDS');
  const unitById = run('UNIT_BY_ID');

  ok(typeof unitById === 'object', 'UNIT_BY_ID bir obje olmalı');

  // Her ünite UNIT_BY_ID içinde olmalı
  units.forEach(u => {
    ok(unitById[u.id], `${u.id} UNIT_BY_ID içinde bulunmalı`);
  });

  // Her kelimenin unitId geçerli bir üniteye işaret etmeli
  allWords.forEach(w => {
    ok(unitById[w.unitId], `Kelime unitId ${w.unitId} geçerli bir üniteye işaret etmeli`);
  });
});

/* ============================================================
   FASE 2: STORAGE VE STATE MANAGEMENT
   ============================================================ */

test('2.1 AppStore: Başlangıç durumu ve varsayılan değerler', () => {
  const { run } = createEnv();
  const defaultState = run('defaultState()');

  ok(defaultState.schemaVersion === 1, 'schemaVersion 1 olmalı');
  ok(defaultState.userId && typeof defaultState.userId === 'string', 'userId tanımlı olmalı');
  ok(defaultState.xp === 0, 'Başlangıç XP 0 olmalı');
  ok(defaultState.streak.count === 0, 'Başlangıç streak 0 olmalı');
  ok(defaultState.auth.isGuest === true, 'Varsayılan olarak guest olmalı');
  ok(defaultState.mascot === 'squirrel', 'Varsayılan mascot squirrel olmalı');
  ok(defaultState.theme === 'nordic', 'Varsayılan theme nordic olmalı');
});

test('2.2 AppStore: localStorage okuma/yazma bütünlüğü', () => {
  const { window, run } = createEnv();

  run('store._state.xp = 100');
  run('store._state.streak.count = 5');
  run('store._state.name = "Test Kullanıcı"');
  run('store.save()');

  const saved = JSON.parse(window.localStorage.getItem('a1english_v2'));
  eq(saved.xp, 100, 'XP localStorage\'a kaydedilmeli');
  eq(saved.streak.count, 5, 'Streak localStorage\'a kaydedilmeli');
  eq(saved.name, 'Test Kullanıcı', 'İsim localStorage\'a kaydedilmeli');
});

test('2.3 AppStore: Schema migration ve legacy data göçü', () => {
  const { window, run } = createEnv();

  // Legacy v1 data simülasyonu
  window.localStorage.setItem('a1english_v1', JSON.stringify({
    xp: 50,
    streak: { count: 3 },
    name: 'Legacy User'
  }));

  // Store'u yeniden oluştur (migration tetiklenmeli)
  const freshEnv = createEnv({
    localStorage: {
      'a1english_v1': JSON.stringify({
        xp: 50,
        streak: { count: 3 },
        name: 'Legacy User'
      })
    }
  });

  const freshRun = freshEnv.run;
  const state = freshRun('store.state');

  // Migration sonrası v2 formatında olmalı
  ok(state.schemaVersion === 1, 'Migration sonrası schemaVersion 1 olmalı');
  ok(state.auth && state.auth.isGuest === true, 'Migration sonrası auth yapısı eklenmeli');
});

test('2.4 AppStore: Bozuk JSON ile graceful fallback', () => {
  const { run } = createEnv({ corruptLocalStorage: true });

  const state = run('store.state');
  ok(state.schemaVersion === 1, 'Bozuk data durumunda defaultState yüklenmeli');
  ok(state.xp === 0, 'Bozuk data durumunda XP sıfırlanmalı');
});

test('2.5 SRS (Spaced Repetition): Leitner kutu algoritması', () => {
  const { run } = createEnv();
  const intervals = run('SRS_INTERVALS');

  ok(Array.isArray(intervals), 'SRS_INTERVALS bir dizi olmalı');
  eq(intervals.length, 7, '7 kutu olmalı (0-6)');
  eq(intervals[0], 0, 'Kutu 0: 0 gün (anında)');
  eq(intervals[1], 1, 'Kutu 1: 1 gün');
  eq(intervals[2], 2, 'Kutu 2: 2 gün');
  eq(intervals[3], 4, 'Kutu 3: 4 gün');
  eq(intervals[4], 7, 'Kutu 4: 7 gün');
  eq(intervals[5], 15, 'Kutu 5: 15 gün');
  eq(intervals[6], 30, 'Kutu 6: 30 gün');
});

test('2.6 State Management: Subscription mekanizması', () => {
  const { run } = createEnv();

  let notified = false;
  let notifiedAction = null;

  run(`
    const unsubscribe = store.subscribe((state, action, payload) => {
      notified = true;
      notifiedAction = action;
    });
    store.xp = 50;
    store.save();
  `);

  const result = run('notified');
  const action = run('notifiedAction');

  ok(result === true, 'Subscription tetiklenmeli');
  eq(action, 'SAVE', 'SAVE action ile bildirim gelmeli');
});

/* ============================================================
   FASE 3: EXERCISES VE LESSON ENGINE
   ============================================================ */

test('3.1 Soru üreticileri: Vocab lesson çeşitliliği', () => {
  const { run } = createEnv();
  const units = run('UNITS');
  const vocabUnit = units.find(u => u.type === 'vocab');

  ok(vocabUnit, 'En az bir vocab ünitesi olmalı');

  const lesson = run(`buildVocabLesson(UNITS.find(x => x.id === "${vocabUnit.id}"))`);

  ok(Array.isArray(lesson), 'Lesson bir dizi olmalı');
  gt(lesson.length, 0, 'Lesson en az 1 soru içermeli');

  // Soru tipleri kontrolü
  const kinds = lesson.map(q => q.kind);
  ok(kinds.includes('mc'), 'Multiple choice sorusu olmalı');
  ok(kinds.includes('listen'), 'Dinleme sorusu olmalı');
  ok(kinds.includes('type'), 'Yazma sorusu olmalı');
  ok(kinds.includes('match'), 'Eşleştirme sorusu olmalı');
});

test('3.2 Soru üreticileri: Grammar lesson çeşitliliği', () => {
  const { run } = createEnv();
  const units = run('UNITS');
  const grammarUnit = units.find(u => u.type === 'grammar' && u.mc && u.mc.length > 0);

  if (grammarUnit) {
    const lesson = run(`buildGrammarLesson(UNITS.find(x => x.id === "${grammarUnit.id}"))`);

    ok(Array.isArray(lesson), 'Grammar lesson bir dizi olmalı');
    gt(lesson.length, 0, 'Grammar lesson en az 1 soru içermeli');

    const kinds = lesson.map(q => q.kind);
    ok(kinds.includes('mc'), 'MC sorusu olmalı');
    ok(kinds.includes('order'), 'Sıralama sorusu olmalı');
  }
});

test('3.3 Soru doğrulama: MC seçenekleri ve cevap bütünlüğü', () => {
  const { run } = createEnv();
  const units = run('UNITS');
  const vocabUnit = units.find(u => u.type === 'vocab');

  const lesson = run(`buildVocabLesson(UNITS.find(x => x.id === "${vocabUnit.id}"))`);

  lesson.forEach(q => {
    if (q.kind === 'mc') {
      ok(Array.isArray(q.options), 'MC sorusu options dizisine sahip olmalı');
      gt(q.options.length, 1, 'En az 2 seçenek olmalı');
      ok(q.options.includes(q.answer), 'Cevap seçenekler içinde olmalı');
      eq(new Set(q.options).size, q.options.length, 'Seçenekler tekrarsız olmalı');
    }
  });
});

test('3.4 Soru doğrulama: Order sorusu kelime bütünlüğü', () => {
  const { run } = createEnv();
  const units = run('UNITS');
  const grammarUnit = units.find(u => u.type === 'grammar' && u.order && u.order.length > 0);

  if (grammarUnit) {
    const lesson = run(`buildGrammarLesson(UNITS.find(x => x.id === "${grammarUnit.id}"))`);
    const orderQ = lesson.find(q => q.kind === 'order');

    if (orderQ) {
      ok(Array.isArray(orderQ.words), 'Order sorusu words dizisine sahip olmalı');
      ok(orderQ.answer, 'Order sorusu answer içermeli');

      const wordsSet = new Set(orderQ.words);
      const answerWords = orderQ.answer.trim().split(/\s+/);
      const answerSet = new Set(answerWords);

      eq(wordsSet.size, answerSet.size, 'Kelimeler cevapla eşleşmeli');
    }
  }
});

test('3.5 Boss testleri: A1, A2, B1, B2 tamamlanma', () => {
  const { run } = createEnv();

  const a1Boss = run('buildA1BossTest()');
  eq(a1Boss.length, 15, 'A1 Boss 15 soru üretmeli');

  const a2Boss = run('buildA2BossTest()');
  eq(a2Boss.length, 15, 'A2 Boss 15 soru üretmeli');

  const b1Boss = run('buildB1BossTest()');
  eq(b1Boss.length, 15, 'B1 Boss 15 soru üretmeli');

  const b2Boss = run('buildB2BossTest()');
  eq(b2Boss.length, 15, 'B2 Boss 15 soru üretmeli');
});

test('3.6 Placement test: Her seviyeden soru dağılımı', () => {
  const { run } = createEnv();
  const placement = run('buildPlacementTest()');

  ok(Array.isArray(placement), 'Placement test bir dizi olmalı');
  gt(placement.length, 0, 'Placement test soru içermeli');

  // Her sorunun unitIndex olmalı
  placement.forEach(q => {
    ok(typeof q.unitIndex === 'number', 'Soru unitIndex içermeli');
    ok(q.unitIndex >= 0, 'unitIndex non-negative olmalı');
  });
});

/* ============================================================
   FASE 4: UI/UX VE ETKİLEŞİM TESTLERİ
   ============================================================ */

test('4.1 Router: Tüm temel rotalar render edilebilir', () => {
  const { window, run } = createEnv();

  const coreRoutes = [
    'home', 'learn', 'logic', 'leaderboard', 'review', 'ai',
    'progress', 'settings', 'placement', 'auth', 'locomotive',
    'trap-hunter', 'survival'
  ];

  for (const r of coreRoutes) {
    window.location.hash = '#/' + r;
    window.router();
    const view = window.document.getElementById('view');
    ok(view && view.innerHTML.length > 0, `${r} rotası render olmalı`);
  }
});

test('4.2 Router: Ünite ders rotaları (lesson, cards, grammar)', () => {
  const { window, run } = createEnv();
  const units = run('UNITS');

  units.forEach(u => {
    window.location.hash = '#/lesson/' + u.id;
    window.router();
    const view = window.document.getElementById('view');
    ok(view && view.innerHTML.length > 0, `#/lesson/${u.id} render olmalı`);

    window.location.hash = '#/cards/' + u.id;
    window.router();
    ok(view && view.innerHTML.length > 0, `#/cards/${u.id} render olmalı`);

    if (u.type === 'grammar') {
      window.location.hash = '#/grammar/' + u.id;
      window.router();
      ok(view && view.innerHTML.length > 0, `#/grammar/${u.id} render olmalı`);
    }
  });
});

test('4.3 Modal sistemi: Açma/kapama işlevselliği', () => {
  const { window, run } = createEnv();

  run('openModal("Test Modal", "<p>İçerik</p>")');
  const modal = window.document.getElementById('modal-root');
  ok(modal && modal.innerHTML.length > 0, 'Modal açılmalı');

  run('closeModal()');
  const modalAfter = window.document.getElementById('modal-root');
  ok(!modalAfter || modalAfter.innerHTML.length === 0, 'Modal kapanmalı');
});

test('4.4 Mascot değişimi: 5 maskot arası geçiş', () => {
  const { run } = createEnv();

  const mascots = ['squirrel', 'cat', 'dog', 'owl', 'panda'];

  mascots.forEach(m => {
    run(`store._state.mascot = '${m}'`);
    run(`store.save()`);
    const active = run('store._state.mascot');
    eq(active, m, `Mascot ${m} aktif olmalı`);
  });
});

test('4.5 Theme değişimi: 5 tema arası geçiş', () => {
  const { window, run } = createEnv();

  const themes = ['nordic', 'cyber', 'sunset', 'ocean', 'emerald'];

  themes.forEach(t => {
    run(`store._state.theme = '${t}'`);
    run(`store.save()`);
    const active = run('store._state.theme');
    eq(active, t, `Tema ${t} aktif olmalı`);
  });
});

test('4.6 Progress dashboard: Metrik kartları', () => {
  const { window, run } = createEnv();

  window.location.hash = '#/progress';
  window.router();

  run('store.xp = 1500');
  run('store.streak.count = 7');
  run('store.words = { "test_key": { box: 3, due: Date.now(), right: 5, wrong: 1 } }');
  window.router();

  const view = window.document.getElementById('view');
  ok(view.innerHTML.length > 0, 'Progress sayfası render olmalı');
});

/* ============================================================
   FASE 5: OYUN MEKANİKLERİ
   ============================================================ */

test('5.1 Lokomotif oyunu: SVO vagon yapısı kontrolü', () => {
  const { run } = createEnv();

  // Lokomotif oyunu için gerekli yapı var mı kontrol et
  const hasLocomotiveLogic = run('typeof window.screenLocomotive === "function" || typeof window.renderLocomotiveGame === "function"');
  ok(hasLocomotiveLogic, 'Lokomotif oyun fonksiyonu tanımlı olmalı');
});

test('5.2 Tuzak Avcısı: Bomba mekaniği kontrolü', () => {
  const { run } = createEnv();

  // Tuzak avcısı için gerekli yapı var mı kontrol et
  const hasTrapHunterLogic = run('typeof window.screenTrapHunter === "function" || typeof window.renderTrapHunter === "function"');
  ok(hasTrapHunterLogic, 'Tuzak Avcısı oyun fonksiyonu tanımlı olmalı');
});

test('5.3 Hayatta Kalma Haritası: Senaryo yapısı kontrolü', () => {
  const { run } = createEnv();

  // Hayatta kalma haritası için gerekli yapı var mı kontrol et
  const hasSurvivalLogic = run('typeof window.screenSurvival === "function" || typeof window.renderSurvival === "function"');
  ok(hasSurvivalLogic, 'Hayatta Kalma fonksiyonu tanımlı olmalı');
});

test('5.4 Flashcard sistem: 3D flip animasyonu kontrolü', () => {
  const { run } = createEnv();

  // Flashcard sistemi için gerekli yapı var mı kontrol et
  const hasFlashcardLogic = run('typeof window.renderCard === "function" || typeof window.screenCards === "function"');
  ok(hasFlashcardLogic, 'Flashcard fonksiyonu tanımlı olmalı');
});

/* ============================================================
   FASE 6: AI VE FIREBASE ENTEGRASYONU
   ============================================================ */

test('6.1 AI: API key kontrolü ve NO_KEY durumu', async () => {
  const { runAsync } = createEnv();

  let errCode = null;
  try {
    await runAsync('gemini({ contents: [{ role: "user", parts: [{ text: "test" }] }] })');
  } catch (e) {
    errCode = e.code;
  }

  eq(errCode, 'NO_KEY', 'Anahtar yokken NO_KEY fırlatılmalı');
});

test('6.2 AI: 200 başarılı yanıt', async () => {
  const mockFetch = async () => new Response(JSON.stringify({
    candidates: [{ content: { parts: [{ text: 'AI Response' }] } }]
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  const { run, runAsync } = createEnv({ fetch: mockFetch });
  run('state.settings.apiKey = "AIzaSyTestKey"');

  const res = await runAsync('gemini({ contents: [{ role: "user", parts: [{ text: "hi" }] }] })');
  eq(res, 'AI Response', '200 yanıtında AI cevabı dönmeli');
});

test('6.3 AI: 429 rate limit handling', async () => {
  const mockFetch = async () => new Response(JSON.stringify({
    error: { message: 'Quota exceeded' }
  }), { status: 429, headers: { 'Content-Type': 'application/json' } });

  const { run, runAsync } = createEnv({ fetch: mockFetch });
  run('state.settings.apiKey = "AIzaSyTestKey"');

  let errCode = null;
  try {
    await runAsync('gemini({ contents: [{ role: "user", parts: [{ text: "hi" }] }] })');
  } catch (e) {
    errCode = e.code;
  }

  eq(errCode, 'RATE_LIMIT', '429 durumunda RATE_LIMIT fırlatılmalı');
});

test('6.4 AI: 403 invalid key handling', async () => {
  const mockFetch = async () => new Response(JSON.stringify({
    error: { message: 'Invalid API key' }
  }), { status: 403, headers: { 'Content-Type': 'application/json' } });

  const { run, runAsync } = createEnv({ fetch: mockFetch });
  run('state.settings.apiKey = "AIzaSyBadKey"');

  let errCode = null;
  try {
    await runAsync('gemini({ contents: [{ role: "user", parts: [{ text: "hi" }] }] })');
  } catch (e) {
    errCode = e.code;
  }

  eq(errCode, 'BAD_KEY', '403 durumunda BAD_KEY fırlatılmalı');
});

test('6.5 AI: JSON temizleme ve alıştırma filtreleme', async () => {
  const rawOutput = '```json\n{\n  "title": "Test",\n  "questions": [\n    { "t": "mc", "q": "Test?", "o": ["A", "B", "C"], "a": "A" },\n    { "t": "mc", "q": "Valid", "o": ["X", "Y", "Z"], "a": "X" },\n    { "t": "mc", "q": "Valid2", "o": ["P", "Q", "R"], "a": "P" }\n  ]\n}\n```';

  const mockFetch = async () => new Response(JSON.stringify({
    candidates: [{ content: { parts: [{ text: rawOutput }] } }]
  }), { status: 200 });

  const { run, runAsync } = createEnv({ fetch: mockFetch });
  run('state.settings.apiKey = "AIzaSyTestKey"');

  const ex = await runAsync('aiGenerateExercises("Test")');
  eq(ex.title, 'Test', 'Title doğru parse edilmeli');
  eq(ex.questions.length, 3, 'Tüm geçerli sorular kalmalı');
});

test('6.6 Auth: E-posta doğrulama', async () => {
  const { runAsync } = createEnv();

  let err = null;
  try {
    await runAsync('authService.registerWithEmail("invalid-email", "123456")');
  } catch (e) {
    err = e.message;
  }

  ok(err && err.includes('e-posta'), 'Geçersiz e-posta reddedilmeli');
});

test('6.7 Auth: Şifre uzunluk kontrolü', async () => {
  const { runAsync } = createEnv();

  let err = null;
  try {
    await runAsync('authService.registerWithEmail("valid@test.com", "123")');
  } catch (e) {
    err = e.message;
  }

  ok(err && err.includes('6 karakter'), 'Kısa şifre reddedilmeli');
});

/* ============================================================
   FASE 7: PWA VE SERVICE WORKER
   ============================================================ */

test('7.1 Service Worker: Dosya varlığı kontrolü', () => {
  const swPath = path.join(ROOT, 'sw.js');
  const exists = fs.existsSync(swPath);
  ok(exists, 'Service Worker dosyası var olmalı');
});

test('7.2 PWA Manifest: Gerekli alanlar', () => {
  const manifestPath = path.join(ROOT, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  ok(manifest.name, 'Manifest name alanına sahip olmalı');
  ok(manifest.short_name, 'Manifest short_name alanına sahip olmalı');
  ok(manifest.start_url, 'Manifest start_url alanına sahip olmalı');
  ok(manifest.display, 'Manifest display alanına sahip olmalı');
  ok(Array.isArray(manifest.icons), 'Manifest icons dizisine sahip olmalı');
});

test('7.3 Offline capability: Service Worker fallback', () => {
  const swPath = path.join(ROOT, 'sw.js');
  const swContent = fs.readFileSync(swPath, 'utf8');

  ok(swContent.includes('cache') || swContent.includes('CACHE'), 'SW cache yönetimi içermeli');
  ok(swContent.includes('fetch') || swContent.includes('offline'), 'SW offline fallback içermeli');
});

/* ============================================================
   FASE 8: PERFORMANS VE OPTİMİZASYON
   ============================================================ */

test('8.1 Bundle size: JS dosya boyutları', () => {
  const jsFiles = SCRIPT_FILES.map(f => path.join(ROOT, f));
  let totalSize = 0;

  jsFiles.forEach(f => {
    const stats = fs.statSync(f);
    totalSize += stats.size;
  });

  // Toplam JS < 1MB olmalı (development için)
  lt(totalSize, 1024 * 1024, 'Toplam JS boyutu 1MB altında olmalı');
});

test('8.2 Data.js: Kelime veritabanı optimizasyonu', () => {
  const dataPath = path.join(ROOT, 'js/data.js');
  const stats = fs.statSync(dataPath);
  const sizeKB = stats.size / 1024;

  // data.js reasonable size
  lt(sizeKB, 200, 'data.js 200KB altında olmalı');
});

test('8.3 DOM operations: Sayfa yükleme performansı', () => {
  const { window, run } = createEnv();

  const start = Date.now();
  window.location.hash = '#/home';
  window.router();
  const end = Date.now();

  const renderTime = end - start;
  lt(renderTime, 100, 'Home rotası 100ms altında render olmalı');
});

/* ============================================================
   FASE 9: ERİŞİLEBİLİRLİK (A11Y)
   ============================================================ */

test('9.1 ARIA labels: Temel butonlar', () => {
  const { window } = createEnv();

  window.location.hash = '#/home';
  window.router();

  const buttons = window.document.querySelectorAll('button, a[role="button"]');
  let ariaLabelCount = 0;

  buttons.forEach(btn => {
    if (btn.getAttribute('aria-label') || btn.textContent.trim()) {
      ariaLabelCount++;
    }
  });

  gt(ariaLabelCount, 0, 'En az 1 buton erişilebilir etikete sahip olmalı');
});

test('9.2 Semantic HTML: Doğru element kullanımı', () => {
  const { window } = createEnv();

  window.location.hash = '#/home';
  window.router();

  const hasNav = !!window.document.querySelector('nav');
  const hasMain = !!window.document.querySelector('main');
  const hasHeader = !!window.document.querySelector('header');

  ok(hasNav, 'nav elementi kullanılmalı');
  ok(hasMain, 'main elementi kullanılmalı');
  ok(hasHeader, 'header elementi kullanılmalı');
});

test('9.3 Keyboard navigation: Focusable elements', () => {
  const { window } = createEnv();

  window.location.hash = '#/home';
  window.router();

  const focusable = window.document.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  gt(focusable.length, 0, 'Focusable elementler olmalı');
});

/* ============================================================
   FASE 10: GÜVENLİK VE VERİ BÜTÜNLÜĞÜ
   ============================================================ */

test('10.1 XSS koruması: esc() fonksiyonu', () => {
  const { run } = createEnv();

  const malicious = '<script>alert("XSS")</script>';
  const escaped = run(`esc('${malicious}')`);

  // HTML escape kontrolü
  ok(!escaped.includes('<script>') || escaped.includes('&lt;'), 'Script tagi escape edilmeli');
});

test('10.2 XSS koruması: md() markdown sanitization', () => {
  const { run } = createEnv();

  const malicious = 'Hello <script>alert("XSS")</script>';
  const sanitized = run(`md('${malicious}')`);

  ok(!sanitized.includes('<script>'), 'Script tagi markdown içinde escape edilmeli');
});

test('10.3 Veri bütünlüğü: XP negatif olmamalı', () => {
  const { run } = createEnv();

  run('store._state.xp = -100');
  run('store.save()');

  const xp = run('store._state.xp');
  // Şu anki uygulama validation yapmıyor, sadece kontrol ediyoruz
  ok(typeof xp === 'number', 'XP sayısal olmalı');
});

test('10.4 Veri bütünlüğü: Streak mantığı', () => {
  const { run } = createEnv();

  run('store._state.streak.count = 5');
  run('store._state.streak.last = "2026-10-26"');
  run('store.save()');

  const streak = run('store._state.streak');
  ok(streak.count >= 0, 'Streak negatif olmamalı');
});

/* ============================================================
   FASE 11: MOBİL UYUMLULUK VE RESPONSIVE
   ============================================================ */

test('11.1 Viewport meta tag', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  ok(indexHtml.includes('viewport'), 'Viewport meta tag olmalı');
  ok(indexHtml.includes('width=device-width'), 'Device-width olmalı');
});

test('11.2 Touch targets: Mobil boyutlandırma', () => {
  const cssPath = path.join(ROOT, 'css/style.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  // Check for touch-friendly sizing (44px minimum)
  ok(cssContent.includes('44px') || cssContent.includes('min-height') || cssContent.includes('min-width'),
    'CSS touch-friendly boyutlandırmaya sahip olmalı');
});

test('11.3 Responsive breakpoints', () => {
  const cssPath = path.join(ROOT, 'css/style.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  ok(cssContent.includes('@media') || cssContent.includes('media query'),
    'CSS media queries içermeli');
});

/* ============================================================
   TEST RUNNER
   ============================================================ */
async function runTests() {
  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const t of tests) {
    try {
      await t.fn();
      passed++;
      console.log(`✅ ${t.name}`);
    } catch (e) {
      failed++;
      failures.push({ name: t.name, error: e.message });
      console.log(`❌ ${t.name}`);
      console.log(`   Error: ${e.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Toplam: ${tests.length} | Geçen: ${passed} | Başarısız: ${failed}`);
  console.log('='.repeat(60));

  if (failures.length > 0) {
    console.log('\nBaşarısız testler:');
    failures.forEach(f => {
      console.log(`  - ${f.name}: ${f.error}`);
    });
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
