/* ============================================================
   Alıştırma üreticileri + ders oynatıcı (lesson runner)
   ============================================================ */

/* ---------- Soru üreticileri ---------- */
function distractorWords(word, n = 3) {
  const unit = UNIT_BY_ID[word.unitId];
  let pool = unit.words.filter(w => w.en !== word.en && w.tr !== word.tr);
  if (pool.length < n) pool = ALL_WORDS.filter(w => w.en !== word.en && w.tr !== word.tr);
  return sample(pool, n);
}

function qEnToTr(w) {
  return {
    kind: 'mc', prompt: `<span class="en-word">${esc(w.en)}</span> ne demek?`, speak: w.en,
    options: shuffle([w.tr, ...distractorWords(w).map(d => d.tr)]), answer: w.tr, wordKey: w.key, unit: UNIT_BY_ID[w.unitId].en
  };
}
function qTrToEn(w) {
  return {
    kind: 'mc', emoji: w.emoji, prompt: `<b>"${esc(w.tr)}"</b> İngilizcede hangisi?`, speakAfter: w.en,
    options: shuffle([w.en, ...distractorWords(w).map(d => d.en)]), answer: w.en, wordKey: w.key, unit: UNIT_BY_ID[w.unitId].en
  };
}
function qListen(w) {
  return {
    kind: 'listen', speak: w.en, options: shuffle([w.en, ...distractorWords(w).map(d => d.en)]),
    answer: w.en, wordKey: w.key, unit: UNIT_BY_ID[w.unitId].en
  };
}
function qType(w) {
  return { kind: 'type', emoji: w.emoji, prompt: `<b>"${esc(w.tr)}"</b> İngilizce nasıl yazılır?`, answer: w.en, speakAfter: w.en, wordKey: w.key, unit: UNIT_BY_ID[w.unitId].en };
}
function qSpeak(w) {
  return { kind: 'speak', emoji: w.emoji, target: w.en, tr: w.tr, answer: w.en, speakAfter: w.en, wordKey: w.key, unit: UNIT_BY_ID[w.unitId].en };
}
function qMatch(words) {
  return { kind: 'match', pairs: words.map(w => ({ left: w.en, right: w.tr, key: w.key })), unit: UNIT_BY_ID[words[0].unitId].en };
}
function qGrammarMC(unit, [q, opts]) {
  const answer = opts[0];
  return {
    kind: 'mc', prompt: esc(q).replace('___', '<span class="blank">___</span>'), options: shuffle(opts), answer,
    speakAfter: q.replace(/\s*\(.*?\)\s*/g, ' ').replace('___', answer).trim(), unit: unit.en, rawQ: q
  };
}
function qOrder(unit, [s, tr]) {
  return { kind: 'order', tr, answer: s, words: shuffle(s.split(' ')), unit: unit ? unit.en : '' };
}

function buildVocabLesson(unit) {
  const w = sample(unit.words, Math.min(8, unit.words.length));
  const makers = [qEnToTr, qEnToTr, qTrToEn, qListen, qEnToTr, qType, qTrToEn, qListen];
  const qs = shuffle(w.map((word, i) => makers[i % makers.length](word)));
  qs.splice(3, 0, qMatch(sample(w, 4)));
  qs.push(qSpeak(sample(w, 1)[0])); // Konuşma ve telaffuz sorusu ekle
  return qs;
}

function buildGrammarLesson(unit) {
  const mcs = sample(unit.mc, 7).map(m => qGrammarMC(unit, m));
  const orders = sample(unit.order, 3).map(o => qOrder(unit, o));
  const qs = [...mcs];
  qs.splice(3, 0, orders[0]);
  qs.splice(7, 0, orders[1]);
  qs.push(orders[2]);
  return qs.filter(Boolean);
}

function buildUnitLesson(unit) {
  return unit.type === 'vocab' ? buildVocabLesson(unit) : buildGrammarLesson(unit);
}

function buildReviewLesson(words) {
  const makers = [qEnToTr, qTrToEn, qListen, qType];
  return shuffle(words).slice(0, 10).map(w => makers[Math.floor(Math.random() * makers.length)](w));
}

function buildPlacementTest() {
  // 97 ünite yerine tüm müfredatı (A1, A2, B1, B2) dengeli temsil eden 15 soruluk pratik seviye testi
  const count = 15;
  const step = (UNITS.length - 1) / (count - 1);
  const selectedUnits = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.round(i * step);
    selectedUnits.push(UNITS[idx]);
  }
  return selectedUnits.map(u => {
    const q = u.type === 'vocab' ? qTrToEn(sample(u.words, 1)[0]) : qGrammarMC(u, sample(u.mc, 1)[0]);
    q.unitIndex = u.index;
    delete q.wordKey; // seviye testi kelime istatistiğini etkilemesin
    return q;
  });
}

function buildA1BossTest() {
  const vocabUnits = UNITS.filter(u => u.type === 'vocab' && u.level === 'A1');
  const grammarUnits = UNITS.filter(u => u.type === 'grammar' && u.level === 'A1');
  const vocabQuestions = sample(vocabUnits, 8).map(u => {
    const w = sample(u.words, 1)[0];
    const maker = pickOne([qEnToTr, qTrToEn, qListen, qType]);
    const q = maker(w);
    delete q.wordKey;
    return q;
  });
  const grammarQuestions = sample(grammarUnits, 7).map(u => {
    return qGrammarMC(u, sample(u.mc, 1)[0]);
  });
  return shuffle([...vocabQuestions, ...grammarQuestions]);
}

function buildA2BossTest() {
  const vocabUnits = UNITS.filter(u => u.type === 'vocab' && u.level === 'A2');
  const grammarUnits = UNITS.filter(u => u.type === 'grammar' && u.level === 'A2');
  const vocabQuestions = sample(vocabUnits, 8).map(u => {
    const w = sample(u.words, 1)[0];
    const maker = pickOne([qEnToTr, qTrToEn, qListen, qType]);
    const q = maker(w);
    delete q.wordKey;
    return q;
  });
  const grammarQuestions = sample(grammarUnits, 7).map(u => {
    return qGrammarMC(u, sample(u.mc, 1)[0]);
  });
  return shuffle([...vocabQuestions, ...grammarQuestions]);
}

function buildB1BossTest() {
  const vocabUnits = UNITS.filter(u => u.type === 'vocab' && u.level === 'B1');
  const grammarUnits = UNITS.filter(u => u.type === 'grammar' && u.level === 'B1');
  const vocabQuestions = sample(vocabUnits, 8).map(u => {
    const w = sample(u.words, 1)[0];
    const maker = pickOne([qEnToTr, qTrToEn, qListen, qType]);
    const q = maker(w);
    delete q.wordKey;
    return q;
  });
  const grammarQuestions = sample(grammarUnits, 7).map(u => {
    return qGrammarMC(u, sample(u.mc, 1)[0]);
  });
  return shuffle([...vocabQuestions, ...grammarQuestions]);
}

function buildB2BossTest() {
  const vocabUnits = UNITS.filter(u => u.type === 'vocab' && u.level === 'B2');
  const grammarUnits = UNITS.filter(u => u.type === 'grammar' && u.level === 'B2');
  const vocabQuestions = sample(vocabUnits, 8).map(u => {
    const w = sample(u.words, 1)[0];
    const maker = pickOne([qEnToTr, qTrToEn, qListen, qType]);
    const q = maker(w);
    delete q.wordKey;
    return q;
  });
  const grammarQuestions = sample(grammarUnits, 7).map(u => {
    return qGrammarMC(u, sample(u.mc, 1)[0]);
  });
  return shuffle([...vocabQuestions, ...grammarQuestions]);
}


/* ---------- Ders oynatıcı ---------- */
let lessonKeyHandler = null;
document.addEventListener('keydown', e => { if (lessonKeyHandler) lessonKeyHandler(e); });

function getSquirrelQuestionClue(q) {
  if (!q) return 'Soruyu dikkatlice oku, özne ve zaman ipuçlarına bak! 🌰';
  if (q.explain) return q.explain;
  if (q.kind === 'order' && q.answer) {
    const parts = q.answer.split(' ');
    const starter = parts.slice(0, Math.min(2, parts.length)).join(' ');
    return `İngilizce cümle diziliminde önce Özne + Yüklem gelir. Cümleye <b>"${esc(starter)}..."</b> ile başlayabilirsin!`;
  }
  if (q.kind === 'match' && Array.isArray(q.pairs) && q.pairs.length > 0) {
    const p = q.pairs[0];
    return `Eşleştirme ipucu: <b>"${esc(p[0])}"</b> ifadesinin karşılığı <b>"${esc(p[1])}"</b>!`;
  }
  const ans = String(q.answer || q.speak || '').trim();
  const promptText = stripTags(q.prompt || '');
  if (promptText.includes('___')) {
    if (/\b(She|He|It)\b/.test(promptText)) {
      return `Cümlede tekil özne (<b>He / She / It</b>) var! Tekil yardımcı fiil (<b>is / does / has</b>) veya fiilde <b>-s</b> takısı ara. (Cevap <b>"${esc(ans[0] || '')}..."</b> ile başlıyor)`;
    }
    if (/\b(They|We|You)\b/.test(promptText)) {
      return `Cümlede çoğul özne (<b>You / We / They</b>) var! Çoğul yardımcı fiil (<b>are / do / have</b>) veya yalın fiil düşün. (Cevap <b>"${esc(ans[0] || '')}..."</b> ile başlıyor)`;
    }
  }
  if (ans) {
    const firstChar = ans[0].toUpperCase();
    const wordCount = ans.split(/\s+/).length;
    return `Aradığımız ifade <b>"${esc(firstChar)}..."</b> harfiyle başlıyor (${ans.length} karakter, ${wordCount} kelime). Telaffuzu dinlemek için 🔊 butonuna da basabilirsin!`;
  }
  return 'Sorudaki anahtar kelimelere odaklan, Fındık sana güveniyor! 🐿️';
}

function getUnitLogicBanner(title = '') {
  const t = String(title || '').toLowerCase();
  let badge = '🧠 Türk Beyni için İngilizce İpucu';
  let trWay = 'Türkçeden kelime kelime çeviri yapmak ("I am agree" gibi) en büyük tuzaktır.';
  let enWay = 'Her yeni kelimeyi Fındık\'ın gömdüğü bir palamut (🌰) gibi düşün; cümle kurarken önce 🚂 Kim? + 🚃 Ne yapıyor? sırasını izle!';

  if (t.includes('be') || t.includes('tanışma') || t.includes('selam') || t.includes('aile') || t.includes('meslek')) {
    badge = '🧠 Türk Beyni vs İngilizce Mantığı';
    trWay = 'Türkçede "Ben öğrenciyim" derken fiil kullanmayız, ismin sonuna "-yim" eki takarız.';
    enWay = 'İngilizcede ise cümle fiilsiz olmaz! Lokomotifin (I/You/He) hemen arkasına "am / is / are" bağlanır: "I am a student."';
  } else if (t.includes('geniş') || t.includes('rutin') || t.includes('fiil') || t.includes('zaman')) {
    badge = '🚂 Lokomotif Kuralı · Söz Dizimi';
    trWay = 'Türkçede yüklemi en sona saklarız: "Ben her sabah kahve içerim."';
    enWay = 'İngilizcede eylem (fiil) bekletilmez! Özne (🚂 I) + Eylem (🚃 drink) hemen birleşir: "I drink coffee every morning."';
  }

  return {
    badge,
    title: badge,
    trWay,
    enWay,
    body: `${trWay} ${enWay}`
  };
}

function runLesson({ title, questions, color = '#5C7CFA', exitTo = '#/home', onFinish, retry, isExam: isExamProp }) {
  const view = $('#view');
  document.body.classList.add('focus-mode');
  let idx = 0;
  const results = [];
  const isExam = Boolean(isExamProp || (title && (title.includes('Test') || title.includes('Boss') || title.includes('Sınav') || title.includes('Seviye'))));
  const activeMascot = (typeof mascotService !== 'undefined') ? mascotService.getActive() : { name: 'Yoldaş', icon: '🐾' };
  const logicInfo = getUnitLogicBanner(title);

  view.innerHTML = `
    <div class="lesson" style="--accent:${color}">
      <div class="lesson-top">
        <button class="icon-btn" id="quit" aria-label="Dersten çık" title="Çık">✕</button>
        <div class="progress"><div class="bar" id="pbar"></div></div>
        <div class="lesson-count" id="lcount"></div>
      </div>
      <div class="lesson-title">${esc(title)}</div>
      ${!isExam ? `
      <div class="lesson-squirrel-bar" id="lessonSquirrelHelper" style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;margin-bottom:12px;border-radius:12px;background:color-mix(in srgb, var(--primary, #4F46E5) 8%, var(--card-bg, #fff));border:1px dashed var(--border, #e2e8f0);flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:8px;font-size:0.86rem;">
          <span style="font-size:1.25rem;">${esc(activeMascot.icon || '🐾')}</span>
          <span><b>${esc(activeMascot.name || 'Yoldaş')}:</b> Takıldığın yerde sana ipucu verebilirim!</span>
        </div>
        <button type="button" class="btn btn-ghost sm" id="lessonSquirrelBtn" aria-label="${esc(activeMascot.name || 'Yoldaş')}'tan soru ipucu al" style="font-weight:800;">💡 ${esc(activeMascot.name || 'Yoldaş')}'tan İpucu Al</button>
      </div>
      <div id="lessonSquirrelClueBox" style="display:none;padding:10px 14px;margin-bottom:14px;border-radius:12px;background:color-mix(in srgb, #F59E0B 12%, var(--card-bg, #fff));border:1px solid rgba(245, 158, 11, 0.35);font-size:0.88rem;line-height:1.45;"></div>
      ` : ''}
      <div class="q-area" id="qarea"></div>
      <div class="feedback" id="feedback"></div>
    </div>`;

  $('#quit').onclick = () => {
    if (idx === 0 || confirm('Dersten çıkmak istiyor musun? İlerleme kaydedilmeyecek.')) {
      lessonKeyHandler = null;
      if (typeof window !== 'undefined') window.currentActiveLessonQuestion = null;
      location.hash = exitTo;
    }
  };

  function updateProgress() {
    $('#pbar').style.width = `${(idx / questions.length) * 100}%`;
    $('#lcount').textContent = `${Math.min(idx + 1, questions.length)}/${questions.length}`;
    const logicBannerEl = $('#lessonLogicBanner');
    if (logicBannerEl) {
      logicBannerEl.style.display = idx === 0 ? 'block' : 'none';
    }
  }

  function show() {
    updateProgress();
    const q = questions[idx];
    if (typeof window !== 'undefined') window.currentActiveLessonQuestion = q;
    const area = $('#qarea');
    const fb = $('#feedback');
    const clueBox = $('#lessonSquirrelClueBox');
    if (clueBox) { clueBox.style.display = 'none'; clueBox.innerHTML = ''; }
    const sqBtn = $('#lessonSquirrelBtn');
    if (sqBtn) {
      sqBtn.onclick = () => {
        if (!clueBox) return;
        const clueHtml = getSquirrelQuestionClue(q);
        clueBox.style.display = 'block';
        clueBox.innerHTML = `🐿️ <b>Fındık'ın İpucu:</b> ${clueHtml}`;
        if (typeof window !== 'undefined' && typeof window.shimejiSay === 'function') {
          window.shimejiSay(clueHtml, '💡 Soru İpucu');
        }
        if (q.speak || q.answer) {
          speak(String(q.speak || q.answer), 'en');
        }
      };
    }
    fb.className = 'feedback'; fb.innerHTML = '';
    area.innerHTML = '';
    area.classList.remove('pop'); void area.offsetWidth; area.classList.add('pop');
    lessonKeyHandler = null;
    RENDERERS[q.kind](q, area, (ok, info = {}) => finish(q, ok, info));
  }

  function finish(q, ok, { given = '', correct = q.answer || '', skipped = false } = {}) {
    let trapMeta = null;
    if (!ok && !skipped && q.kind !== 'match') {
      const mistakeObj = { q: q.rawQ || stripTags(q.prompt || q.tr || q.speak || ''), given, correct, unit: q.unit || title, kind: q.kind };
      if (typeof classifyTurkishTrap === 'function') {
        trapMeta = classifyTurkishTrap(mistakeObj);
      }
      recordMistake(mistakeObj);
    }
    results.push({ q, ok, given, correct, skipped, trapMeta });
    if (q.wordKey && !skipped) recordWord(q.wordKey, ok);
    if (skipped) {
      sfx.good();
    } else {
      ok ? sfx.good() : sfx.bad();
    }
    if (typeof window !== 'undefined' && typeof window.shimejiOnLessonAnswer === 'function') {
      window.shimejiOnLessonAnswer(ok || skipped, q);
    }
    if (q.speakAfter) setTimeout(() => speak(q.speakAfter), 250);

    const fb = $('#feedback');
    fb.className = `feedback show ${ok ? 'ok' : 'bad'}`;
    fb.innerHTML = `
      <div class="fb-inner">
        <div class="fb-text">
          <div class="fb-title">${skipped ? 'Tamamlandı (+10 🌰 Palamut) ⏩' : (ok ? pickOne(['Harika! 🌰 +1 Palamut Zulada!', 'Süper! ⭐', 'Doğru! ✅', 'Mükemmel! 🌟', 'Aferin! 👏']) : 'Küçük Bir Tuzak! 🪤')}</div>
          ${skipped ? `<div class="muted small" style="font-weight:700;margin-top:2px;">Mikrofon pas geçildi, tam puanın eklendi! Doğrusu: <b>${esc(correct)}</b></div>` : (!ok && correct ? `<div class="fb-correct">Doğru cevap: <b>${esc(correct)}</b></div>` : '')}
          ${(!ok && trapMeta) ? `<div class="fb-explain" style="margin-top:4px;"><b>${esc(trapMeta.trapTitle)}:</b> ${esc(trapMeta.trapTip)}</div>` : ''}
          ${q.explain ? `<div class="fb-explain">💡 ${esc(q.explain)}</div>` : ''}
        </div>
        <button class="btn btn-big ${ok ? 'btn-green' : 'btn-red'}" id="nextBtn">Devam →</button>
      </div>`;
    const next = () => { idx++; idx < questions.length ? show() : end(); };
    $('#nextBtn').onclick = next;
    $('#nextBtn').focus();
    lessonKeyHandler = e => { if (e.key === 'Enter') { e.preventDefault(); next(); } };
  }

  function end() {
    lessonKeyHandler = null;
    saveState();
    const correct = results.filter(r => r.ok).length;
    const totalCount = results.length;
    const pct = Math.round((correct / totalCount) * 100);
    const out = onFinish ? onFinish(results, { correct, total: totalCount, pct }) || {} : {};
    const xp = out.xp ?? 0;
    if (pct >= 70) { sfx.win(); confetti(); }
    const wrong = results.filter(r => !r.ok && !r.skipped && r.q.kind !== 'match');
    $('#view').innerHTML = `
      <div class="lesson-end" style="--accent:${color}">
        <div class="end-emoji">${pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '🌱'}</div>
        <h1>${pct === 100 ? 'Kusursuz! Palamutlar Zulada!' : pct >= 70 ? 'Ders tamamlandı!' : 'Fındık seninle! Birlikte pekiştirelim'}</h1>
        ${out.message ? `<p class="end-msg">${out.message}</p>` : ''}
        <div class="end-stats">
          <div class="stat-pill" style="--c:#51CF66"><span>Doğru</span><b>${correct}/${totalCount}</b></div>
          <div class="stat-pill" style="--c:#339AF0"><span>Başarı</span><b>%${pct}</b></div>
          <div class="stat-pill" style="--c:#FCC419"><span>🌰 Palamut (XP)</span><b>+${xp}</b></div>
        </div>
        ${wrong.length ? `<div class="card end-wrong"><h3>🪤 Dikkat Edeceğimiz Türk Tuzakları</h3>
          ${wrong.map(r => `<div class="wrong-row" style="flex-direction:column;align-items:flex-start;gap:4px;">
            <div style="display:flex;justify-content:space-between;width:100%;gap:8px;">
              <span>${esc(r.q.rawQ || stripTags(r.q.prompt || r.q.tr || r.q.speak || ''))} <i class="muted">(sen: ${esc(r.given || '—')})</i></span>
              <b>${esc(r.correct)}</b>
            </div>
            ${r.trapMeta ? `<div class="muted small">💡 ${esc(r.trapMeta.trapTitle)}</div>` : ''}
          </div>`).join('')}</div>` : ''}
        <div class="end-actions">
          ${retry ? '<button class="btn btn-ghost" id="retryBtn">🔁 Tekrar Dene</button>' : ''}
          <button class="btn btn-big btn-primary" id="doneBtn">Devam →</button>
        </div>
      </div>`;
    document.body.classList.remove('focus-mode');
    $('#doneBtn').onclick = () => { location.hash = out.exitTo || exitTo; };
    if (retry) $('#retryBtn').onclick = retry;
  }

  show();
}

function stripTags(s) {
  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    const d = document.createElement('div');
    d.innerHTML = s;
    return d.textContent;
  }
  return String(s || '').replace(/<[^>]*>/g, '');
}
function pickOne(a) { return a[Math.floor(Math.random() * a.length)]; }
function same(a, b) { return normalize(a).replace(/[-\s]/g, '') === normalize(b).replace(/[-\s]/g, ''); }

/* ---------- Soru tipleri ---------- */
const RENDERERS = {
  mc(q, area, done) {
    area.innerHTML = `
      <div class="q-head">
        ${q.emoji ? `<div class="q-emoji">${q.emoji}</div>` : ''}
        <div class="q-prompt">${q.prompt}</div>
        ${q.speak ? `<button class="speak-btn" id="spk" aria-label="Sesli dinle" title="Dinle">🔊</button>` : ''}
      </div>
      <div class="options">${q.options.map((o, i) => `<button class="option" data-v="${esc(o)}"><span class="key">${i + 1}</span>${esc(o)}</button>`).join('')}</div>`;
    if (q.speak) { $('#spk').onclick = () => speak(q.speak); setTimeout(() => speak(q.speak), 300); }
    bindOptions(area, q, done);
  },

  listen(q, area, done) {
    let answered = false;
    area.innerHTML = `
      <div class="q-head">
        <div class="q-prompt">Dinle ve duyduğunu seç 🎧</div>
        <div class="listen-audio-row">
          <button class="speak-btn big" id="spk" aria-label="Sesli dinle" title="Dinle">🔊</button>
          <button class="speak-btn slow" id="spkSlow" title="Yavaş" aria-label="Yavaş sesli dinle">🐢</button>
        </div>
      </div>
      <div class="options">${q.options.map((o, i) => `<button class="option" data-v="${esc(o)}"><span class="key">${i + 1}</span>${esc(o)}</button>`).join('')}</div>
      <div style="text-align:center;margin-top:14px;">
        <button type="button" class="btn btn-ghost sm cant-listen-btn" id="cantListenBtn" style="color:var(--muted);font-weight:700;">🔇 Şu an dinleyemiyorum</button>
      </div>`;
    $('#spk').onclick = () => speak(q.speak);
    $('#spkSlow').onclick = () => { const r = state.settings.rate; state.settings.rate = 0.5; speak(q.speak); state.settings.rate = r; };
    setTimeout(() => speak(q.speak), 300);
    bindOptions(area, q, (ok, meta) => {
      answered = true;
      done(ok, meta);
    });

    const cantListenBtn = $('#cantListenBtn');
    if (cantListenBtn) {
      cantListenBtn.onclick = () => {
        if (answered) return;
        answered = true;
        done(false, { given: '(Şu an dinleyemiyorum)', correct: q.answer, skipped: true, cantListen: true });
      };
    }
  },

  type(q, area, done) {
    area.innerHTML = `
      <div class="q-head">
        ${q.emoji ? `<div class="q-emoji">${q.emoji}</div>` : ''}
        <div class="q-prompt">${q.prompt}</div>
      </div>
      <div class="type-row">
        <input id="typeIn" class="type-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Buraya yaz..." />
        <button class="btn btn-primary" id="checkBtn">Kontrol Et</button>
      </div>
      <div class="type-actions-row">
        <button type="button" class="hint-btn" id="hintBtn">💡 İpucu Al</button>
        <button type="button" class="btn btn-ghost sm" id="dontKnowBtn">❓ Bilmiyorum (Cevabı Gör)</button>
      </div>
      <div id="hintBox" class="hint-box" style="display:none;"></div>
      <div id="typeWarn" class="type-warn-msg" style="display:none;"></div>`;

    const inp = $('#typeIn');
    inp.focus();
    let answered = false;
    let hintLevel = 0;
    const hintBtn = $('#hintBtn');
    const hintBox = $('#hintBox');
    const warnBox = $('#typeWarn');

    const check = () => {
      if (answered) return;
      const val = inp.value.trim();
      if (!val) {
        // BOŞ BIRAKILDIĞINDA KULLANICIYI BİLGİLENDİR & TİTRE:
        inp.classList.remove('shake');
        void inp.offsetWidth;
        inp.classList.add('shake');
        inp.focus();
        warnBox.style.display = 'flex';
        warnBox.innerHTML = `⚠️ <b>Henüz bir şey yazmadın!</b> Bilmiyorsan 💡 İpucu alabilir veya <b>"Bilmiyorum"</b> butonuna basabilirsin.`;
        return;
      }
      answered = true;
      const ok = same(val, q.answer);
      inp.classList.add(ok ? 'ok' : 'bad');
      inp.disabled = true;
      done(ok, { given: val, correct: q.answer });
    };

    $('#checkBtn').onclick = check;
    inp.oninput = () => { warnBox.style.display = 'none'; };

    let dontKnowStep = 0;
    const dontKnowBtn = $('#dontKnowBtn');
    if (dontKnowBtn) {
      dontKnowBtn.onclick = () => {
        if (answered) return;
        if (dontKnowStep === 0) {
          dontKnowStep = 1;
          dontKnowBtn.textContent = '👀 Emin misin? Doğru cevabı aç';
          dontKnowBtn.style.color = '#e03131';
          hintBox.style.display = 'block';
          warnBox.style.display = 'none';
          const half = Math.ceil(q.answer.length / 2);
          hintBox.innerHTML = `💡 <b>İpucu:</b> Bu ifade "<b>${esc(q.answer.slice(0, half))}...</b>" ile başlıyor (${q.answer.length} harf). Bir kez daha dene, vazgeçmek istersen tekrar tıkla!`;
          inp.placeholder = q.answer.slice(0, half) + '...';
          inp.focus();
        } else {
          answered = true;
          inp.classList.add('bad');
          inp.disabled = true;
          done(false, { given: '(Bilmiyorum)', correct: q.answer });
        }
      };
    };

    hintBtn.onclick = () => {
      hintLevel++;
      hintBox.style.display = 'block';
      warnBox.style.display = 'none';
      if (hintLevel === 1) {
        hintBox.innerHTML = `💡 <b>İpucu 1:</b> Kelime "<b>${q.answer[0].toUpperCase()}</b>" harfiyle başlıyor (${q.answer.length} harf)`;
        inp.placeholder = q.answer[0] + ' ' + '_ '.repeat(q.answer.length - 1);
      } else if (hintLevel === 2) {
        const half = Math.ceil(q.answer.length / 2);
        hintBox.innerHTML = `💡 <b>İpucu 2:</b> İlk harfleri: "<b>${q.answer.slice(0, half)}...</b>" (${q.answer.length} harf)`;
        inp.placeholder = q.answer.slice(0, half) + ' ' + '_ '.repeat(q.answer.length - half);
      } else {
        hintBox.innerHTML = `💡 <b>İpucu 3:</b> Doğru cevap: "<b>${esc(q.answer)}</b>"`;
      }
      inp.focus();
    };

    lessonKeyHandler = e => { if (e.key === 'Enter') { e.preventDefault(); check(); } };
  },

  speak(q, area, done) {
    area.innerHTML = `
      <div class="speak-hero-container">
        <div class="q-head">
          ${q.emoji ? `<div class="q-emoji">${q.emoji}</div>` : ''}
          <div class="q-prompt">Telaffuz Pratiği 🎙️</div>
        </div>

        <div class="card speak-hero-card">
          <div class="speak-target-row">
            <span class="target-word">${esc(q.target)}</span>
            <button class="speak-btn sm" id="listenTargetBtn" title="Doğru telaffuzu dinle" aria-label="Doğru telaffuzu dinle">🔊</button>
          </div>
          <div class="speak-tr-text">${esc(q.tr)}</div>

          <!-- Ergonomik Mikrofon Alanı -->
          <div class="voice-action-zone">
            <button class="mic-pill-btn" id="micBtn" aria-label="Mikrofonu aç ve seslendir">
              <span class="mic-pill-icon">🎙️</span>
              <span class="mic-pill-label" id="micBtnLabel">Mikrofona Bas ve Konuş</span>
            </button>
            <div class="voice-status-text" id="voiceStatus">Kelimeyi sesli söyle, telaffuzunu kontrol edelim</div>
            <div class="heard-text-box" id="heardText"></div>
          </div>
        </div>

        <!-- Alternatifler: Yazarak Cevapla veya Geç -->
        <div class="speak-alt-options">
          <button class="btn btn-ghost sm" id="switchToTypeBtn" aria-label="Yazarak cevapla" title="Yazarak tam puan al">⌨️ Yazarak Cevapla</button>
          <button class="btn btn-ghost sm" id="skipVoiceBtn" aria-label="Bu soruyu atla" title="Bu soruyu atla">⏩ Bu Soruyu Atla</button>
        </div>

        <!-- Yazarak Cevaplama Paneli -->
        <div class="card speak-type-fallback" id="speakTypeFallback" style="display:none;margin-top:14px;">
          <div class="muted small" style="margin-bottom:8px;font-weight:700;">⌨️ Kelimeyi yazarak tam puanını al:</div>
          <div class="type-row">
            <input id="speakFallbackIn" class="type-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="İngilizce karşılığını yaz..." />
            <button class="btn btn-primary" id="checkFallbackBtn" aria-label="Yazılı cevabı kontrol et">Kontrol Et</button>
          </div>
          <div id="fallbackWarn" class="type-warn-msg" style="display:none;"></div>
        </div>
      </div>`;

    const mic = $('#micBtn');
    const micLabel = $('#micBtnLabel');
    const status = $('#voiceStatus');
    const heard = $('#heardText');
    $('#listenTargetBtn').onclick = () => speak(q.target);

    let isListening = false;
    let answered = false;

    // GEÇ BUTONU: Soru doğru sayılmaz (puan eklenmez), doğru telaffuz gösterilir
    $('#skipVoiceBtn').onclick = () => {
      if (answered) return;
      answered = true;
      stopListening();
      done(false, { given: '(Geçildi)', correct: q.target, skipped: true });
    };

    // YAZARAK CEVAPLAMA BUTONU:
    const fallbackBox = $('#speakTypeFallback');
    const fallbackIn = $('#speakFallbackIn');
    const fallbackBtn = $('#checkFallbackBtn');
    const fallbackWarn = $('#fallbackWarn');

    $('#switchToTypeBtn').onclick = () => {
      fallbackBox.style.display = fallbackBox.style.display === 'none' ? 'block' : 'none';
      if (fallbackBox.style.display === 'block') {
        fallbackIn.focus();
      }
    };

    const checkFallback = () => {
      if (answered) return;
      const val = fallbackIn.value.trim();
      if (!val) {
        fallbackIn.classList.remove('shake');
        void fallbackIn.offsetWidth;
        fallbackIn.classList.add('shake');
        fallbackIn.focus();
        fallbackWarn.style.display = 'flex';
        fallbackWarn.innerHTML = '⚠️ Lütfen kelimenin İngilizcesini yazın!';
        return;
      }
      answered = true;
      const ok = same(val, q.target);
      fallbackIn.classList.add(ok ? 'ok' : 'bad');
      fallbackIn.disabled = true;
      done(ok, { given: val, correct: q.target });
    };
    fallbackBtn.onclick = checkFallback;
    fallbackIn.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); checkFallback(); } };
    fallbackIn.oninput = () => { fallbackWarn.style.display = 'none'; };

    // MİKROFON BUTONU:
    mic.onclick = () => {
      if (answered) return;
      if (isListening) {
        stopListening();
        mic.classList.remove('listening');
        micLabel.textContent = 'Mikrofona Bas ve Konuş';
        status.textContent = 'Durduruldu. Tekrar dene.';
        isListening = false;
        return;
      }

      isListening = true;
      mic.classList.add('listening');
      micLabel.textContent = 'Dinleniyor... Konuşabilirsin 🎧';
      status.textContent = 'Telaffuzunu bekliyoruz...';
      heard.textContent = '';

      listenSpeech({
        lang: 'en-US',
        onResult: (text) => {
          isListening = false;
          mic.classList.remove('listening');
          micLabel.textContent = 'Tamamlandı ✅';
          heard.textContent = `Duyulan: "${text}"`;
          const ok = same(text, q.target) || normalize(text).includes(normalize(q.target));
          answered = true;
          done(ok, { given: text, correct: q.target });
        },
        onError: (err) => {
          isListening = false;
          mic.classList.remove('listening');
          micLabel.textContent = 'Mikrofona Bas ve Konuş';
          status.textContent = err || 'Ses algılanamadı, tekrar deneyebilir veya "Geç" diyebilirsin.';
        },
        onEnd: () => {
          if (!answered) {
            isListening = false;
            mic.classList.remove('listening');
            micLabel.textContent = 'Mikrofona Bas ve Konuş';
            status.textContent = 'Ses kesildi. Tekrar basarak dene.';
          }
        }
      });
    };
  },

  match(q, area, done) {
    const left = shuffle(q.pairs), right = shuffle(q.pairs);
    area.innerHTML = `
      <div class="q-head"><div class="q-prompt">Eşleştir 🔗</div></div>
      <div class="match">
        <div class="match-col">${left.map(p => `<button class="option m-left" data-k="${p.key}">${esc(p.left)}</button>`).join('')}</div>
        <div class="match-col">${right.map(p => `<button class="option m-right" data-k="${p.key}">${esc(p.right)}</button>`).join('')}</div>
      </div>`;
    let sel = null, mistakes = 0, matched = 0;
    const wrongKeys = new Set();
    $$('.m-left', area).forEach(b => b.onclick = () => {
      if (b.classList.contains('matched')) return;
      $$('.m-left', area).forEach(x => x.classList.remove('selected'));
      b.classList.add('selected'); sel = b;
      speak(b.textContent);
    });
    $$('.m-right', area).forEach(b => b.onclick = () => {
      if (!sel || b.classList.contains('matched')) return;
      if (b.dataset.k === sel.dataset.k) {
        b.classList.add('matched'); sel.classList.add('matched'); sel.classList.remove('selected');
        sel = null; matched++;
        tone([700], 0.06);
        if (matched === q.pairs.length) {
          q.pairs.forEach(p => recordWord(p.key, !wrongKeys.has(p.key)));
          done(mistakes <= 1, { correct: mistakes <= 1 ? '' : `${mistakes} hata yaptın` });
        }
      } else {
        mistakes++; wrongKeys.add(sel.dataset.k);
        b.classList.add('wrong'); sel.classList.add('wrong');
        const s = sel;
        setTimeout(() => { b.classList.remove('wrong'); s.classList.remove('wrong'); }, 450);
        sfx.bad();
      }
    });
  },

  order(q, area, done) {
    area.innerHTML = `
      <div class="q-head">
        <div class="q-prompt">🚂 Cümle Trenini Kur (Lokomotif Kuralı) ✍️
          <div class="q-sub">🇹🇷 "${esc(q.tr)}"</div>
          <div class="muted small" style="margin-top:4px;font-size:0.78rem;">İpucu: <b>1. Vagon = 🚂 Özne (Lokomotif)</b> · <b>2. Vagon = 🚃 Eylem (Fiil)</b> · Sonraki Vagonlar = Nesne/Yer/Zaman</div>
        </div>
      </div>
      <div class="order-answer loco-order-track" id="oAns" data-empty-hint="Vagonları sırasıyla buraya diz (🚂 Özne ➔ 🚃 Fiil ➔ 🚋 Nesne)..."></div>
      <div class="order-bank" id="oBank">${q.words.map((w, i) => `<button class="chip wagon-chip" data-i="${i}" data-word="${esc(w)}">${esc(w)}</button>`).join('')}</div>
      <div class="center"><button class="btn btn-primary" id="checkBtn" disabled>🚂 Treni Hareket Ettir (Kontrol Et)</button></div>`;
    const ans = $('#oAns'), bank = $('#oBank'), btn = $('#checkBtn');
    let answered = false;
    const updateWagonBadges = () => {
      $$('.chip', ans).forEach((c, idx) => {
        c.setAttribute('data-wagon-role', idx === 0 ? '🚂 Özne' : idx === 1 ? '🚃 Fiil' : `🚋 Vagon ${idx + 1}`);
        c.classList.toggle('wagon-loco', idx === 0);
        c.classList.toggle('wagon-verb', idx === 1);
      });
      $$('.chip', bank).forEach(c => {
        c.removeAttribute('data-wagon-role');
        c.classList.remove('wagon-loco', 'wagon-verb');
      });
      btn.disabled = ans.children.length === 0;
    };
    area.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip || answered) return;
      (chip.parentElement === bank ? ans : bank).appendChild(chip);
      updateWagonBadges();
    });
    const check = () => {
      if (answered || btn.disabled) return;
      answered = true;
      const given = $$('.chip', ans).map(c => c.dataset.word || c.textContent).join(' ');
      const ok = normalize(given) === normalize(q.answer);
      ans.classList.add(ok ? 'ok' : 'bad');
      if (ok) ans.classList.add('train-depart');
      q.speakAfter = q.answer;
      done(ok, { given, correct: q.answer });
    };
    btn.onclick = check;
    lessonKeyHandler = e => { if (e.key === 'Enter') { e.preventDefault(); check(); } };
  }
};

function bindOptions(area, q, done) {
  const btns = $$('.option', area);
  let answered = false;
  const choose = b => {
    if (answered) return;
    answered = true;
    const v = b.dataset.v;
    const ok = v === q.answer;
    btns.forEach(x => { x.disabled = true; if (x.dataset.v === q.answer) x.classList.add('correct'); });
    if (!ok) b.classList.add('wrong');
    done(ok, { given: v, correct: q.answer });
  };
  btns.forEach(b => b.onclick = () => choose(b));
  lessonKeyHandler = e => {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= btns.length) choose(btns[n - 1]);
  };
}
