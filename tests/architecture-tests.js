#!/usr/bin/env node
/* ============================================================
   PatiLingo - Clean Architecture & ES6 Modules Test Suite
   Tests: Module System, Components, EventBus, DI Container,
          Layered Architecture, Repositories, Config,
          ErrorHandler, Middleware, PluginSystem
   ============================================================ */
const assert = require('assert');
const { JSDOM } = require('jsdom');

let passed = 0;
let failed = 0;

async function runArchTests() {
  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="view"></div><div id="nav"></div></body></html>', {
    url: 'https://localhost/'
  });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.HTMLElement = dom.window.HTMLElement;
  globalThis.localStorage = dom.window.localStorage;

  const arch = await import('../js/core/index.js');

  async function test(name, fn) {
    try {
      await fn();
      passed++;
      console.log(`✅ ${name}`);
    } catch (err) {
      failed++;
      console.error(`❌ ${name}\n   ${err.stack || err.message}`);
    }
  }

  await test('1. Module System (ES6 Modules): Tüm core, domain, infrastructure, service ve component modülleri export edilir', () => {
    assert.ok(arch.config, 'config export edilmeli');
    assert.strictEqual(typeof arch.EventBus, 'function', 'EventBus sınıfı export edilmeli');
    assert.strictEqual(typeof arch.ServiceContainer, 'function', 'ServiceContainer sınıfı export edilmeli');
    assert.strictEqual(typeof arch.AppStore, 'function', 'AppStore sınıfı export edilmeli');
    assert.strictEqual(typeof arch.Router, 'function', 'Router sınıfı export edilmeli');
  });

  await test('2. Component-Based Architecture: BaseComponent mount, update, unmount lifecycle ve otomatik event temizliği', () => {
    const containerEl = document.getElementById('nav');
    const bus = new arch.EventBus();
    const store = new arch.AppStore({ eventBus: bus });
    const navComp = new arch.NavComponent(containerEl, { store, eventBus: bus });

    navComp.mount();
    assert.ok(navComp.isMounted, 'Component mount edilmiş olmalı');
    assert.ok(containerEl.innerHTML.includes('0 XP'), 'Başlangıç XP render edilmeli');

    store.gainXP(45);
    assert.ok(containerEl.innerHTML.includes('45 XP'), 'EventBus üzerinden XP güncellenmeli');

    navComp.unmount();
    assert.strictEqual(navComp.isMounted, false, 'Component unmount edilmeli');
    store.gainXP(20);
    assert.ok(containerEl.innerHTML.includes('45 XP'), 'Unmount sonrası event dinleyicisi temizlenmiş olmalı');
  });

  await test('3. Event-Driven Architecture: EventBus on, once, off ve emit mekanizması', () => {
    const bus = new arch.EventBus();
    const received = [];
    const unsub = bus.on('xp:changed', (data) => received.push(data.total));
    bus.once('streak:updated', (data) => received.push(`streak:${data.count}`));

    bus.emit('xp:changed', { amount: 15, total: 15 });
    bus.emit('xp:changed', { amount: 15, total: 30 });
    bus.emit('streak:updated', { count: 1 });
    bus.emit('streak:updated', { count: 2 }); // once olduğu için ikincisi tetiklenmemeli
    unsub();
    bus.emit('xp:changed', { amount: 15, total: 45 });

    assert.deepStrictEqual(received, [15, 30, 'streak:1']);
  });

  await test('4. Dependency Injection: ServiceContainer singleton ve factory çözümlemesi', () => {
    const c = new arch.ServiceContainer();
    let creations = 0;
    c.register('repo', () => ({ id: ++creations }));
    c.register('service', (container) => ({ repo: container.get('repo') }));

    const s1 = c.get('service');
    const s2 = c.get('service');
    assert.strictEqual(s1, s2, 'Singleton aynı örneği döndürmeli');
    assert.strictEqual(s1.repo.id, 1, 'Bağımlılık doğru enjekte edilmeli');
  });

  await test('5. Layered Architecture: Domain Entities (Lesson, User, Word, XPScore) ve Use Cases (StartLesson, CompleteLesson)', async () => {
    const storageRepo = new arch.StorageRepository('test_layered_v1');
    storageRepo.clear();
    const progressRepo = new arch.ProgressRepository(storageRepo);
    const lessonRepo = new arch.LessonRepository([
      { id: 'u1', en: 'Greetings', type: 'vocab', index: 0, requiredXP: 0 },
      { id: 'u2', en: 'Numbers', type: 'vocab', index: 1, requiredXP: 50 }
    ]);

    const startUseCase = new arch.StartLessonUseCase(lessonRepo, progressRepo);
    const lesson1 = await startUseCase.execute('u1', 'u_test');
    assert.strictEqual(lesson1.id, 'u1');

    await assert.rejects(
      () => startUseCase.execute('u2', 'u_test'),
      /Lesson locked/,
      'Kilitli ünite LESSON_LOCKED hatası fırlatmalı'
    );

    const store = new arch.AppStore({ storageRepo });
    const completeUseCase = new arch.CompleteLessonUseCase({ store, progressRepo });
    const result = await completeUseCase.execute({ lessonId: 'u1', correct: 8, total: 10 });
    assert.strictEqual(result.score, 80);
    assert.strictEqual(result.passed, true);
    assert.strictEqual(result.earnedXP, 80);

    const word = new arch.Word({ en: 'hello', tr: 'merhaba', box: 1 });
    const srsAfter = word.recordAttempt(true);
    assert.strictEqual(srsAfter.box, 2);
    assert.strictEqual(srsAfter.right, 1);
  });

  await test('6. Repository Pattern: StorageRepository ve UserRepository CRUD işlemleri', () => {
    const storageRepo = new arch.StorageRepository('test_repo_v1');
    storageRepo.clear();
    const userRepo = new arch.UserRepository(storageRepo);

    const user = new arch.User({ id: 'u_99', name: 'Senanur', xp: 250 });
    userRepo.save(user);

    const loaded = userRepo.findById('u_99');
    assert.ok(loaded, 'Kullanıcı bulunmalı');
    assert.strictEqual(loaded.name, 'Senanur');
    assert.strictEqual(loaded.xp, 250);

    userRepo.updateProgress('u_99', { xp: 400, unlockedUpTo: 5 });
    const updated = userRepo.findById('u_99');
    assert.strictEqual(updated.xp, 400);
    assert.strictEqual(updated.unlockedUpTo, 5);
  });

  await test('7. Configuration Management: Merkezi config yapısı ve sabitler', () => {
    assert.strictEqual(arch.config.app.name, 'PatiLingo');
    assert.deepStrictEqual(arch.config.srs.intervals, [0, 1, 2, 4, 7, 15, 30]);
    assert.strictEqual(arch.config.progression.passThreshold, 70);
    assert.strictEqual(arch.config.ai.dailyFreeQuota, 15);
  });

  await test('8. Error Boundary System: ErrorHandler sınıflandırma ve Türkçe mesaj üretimi', () => {
    const eh = new arch.ErrorHandler();
    let handledType = null;
    eh.register('quota', (err, ctx) => {
      handledType = ctx.errorType;
      return ctx.userMessage;
    });

    const quotaErr = new Error('Limit doldu');
    quotaErr.code = 'QUOTA_EXCEEDED';
    const msg = eh.handle(quotaErr, { screen: 'ai' });

    assert.strictEqual(handledType, 'quota');
    assert.ok(msg.includes('15 ücretsiz AI mesaj'));
    assert.strictEqual(eh.getRecentLogs().length, 1);
  });

  await test('9. Middleware Pattern: compose, loggingMiddleware, validationMiddleware ve analyticsMiddleware', async () => {
    const tracked = [];
    const pipeline = arch.compose(
      arch.loggingMiddleware,
      arch.validationMiddleware,
      arch.analyticsMiddleware
    );

    const ctx = await pipeline({
      action: 'lesson:start',
      payload: { lessonId: 'u1' },
      onTrack: (act, pay) => tracked.push({ act, pay })
    });

    assert.ok(ctx.meta.durationMs >= 0, 'loggingMiddleware süreyi kaydetmeli');
    assert.strictEqual(tracked.length, 1);
    assert.strictEqual(tracked[0].act, 'lesson:start');

    await assert.rejects(
      () => pipeline({ action: '', payload: {} }),
      /Validation failed/
    );
  });

  await test('10. Plugin Architecture: PluginSystem register, executeHook ve unregister', () => {
    const ps = new arch.PluginSystem();
    const events = [];
    ps.register({
      name: 'gamification-test',
      init() { events.push('init'); },
      destroy() { events.push('destroy'); },
      hooks: {
        'lesson:completed': (d) => events.push(`completed:${d.lessonId}`)
      }
    });

    ps.executeHook('lesson:completed', { lessonId: 'u1' });
    ps.unregister('gamification-test');
    ps.executeHook('lesson:completed', { lessonId: 'u2' });

    assert.deepStrictEqual(events, ['init', 'completed:u1', 'destroy']);
  });

  console.log(`\n============================================================`);
  console.log(`Mimari Testler — Toplam: ${passed + failed} | Geçen: ${passed} | Başarısız: ${failed}`);
  console.log(`============================================================`);
  if (failed > 0) process.exit(1);
}

runArchTests().catch(err => {
  console.error(err);
  process.exit(1);
});
