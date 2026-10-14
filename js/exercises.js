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
  return UNITS.map(u => {
    const q = u.type === 'vocab' ? qTrToEn(sample(u.words, 1)[0]) : qGrammarMC(u, sample(u.mc, 1)[0]);
    q.unitIndex = u.index;
    delete q.wordKey; // seviye testi kelime istatistiğini etkilemesin
    return q;
  });
}

function buildA1BossTest() {
  const vocabUnits = UNITS.filter(u => u.type === 'vocab');
  const grammarUnits = UNITS.filter(u => u.type === 'grammar');
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

function runLesson({ title, questions, color = '#5C7CFA', exitTo = '#/home', onFinish, retry }) {
  const view = $('#view');
  document.body.classList.add('focus-mode');
  let idx = 0;
  const results = [];

  view.innerHTML = `
    <div class="lesson" style="--accent:${color}">
      <div class="lesson-top">
        <button class="icon-btn" id="quit" title="Çık">✕</button>
        <div class="progress"><div class="bar" id="pbar"></div></div>
        <div class="lesson-count" id="lcount"></div>
      </div>
      <div class="lesson-title">${esc(title)}</div>
      <div class="q-area" id="qarea"></div>
      <div class="feedback" id="feedback"></div>
    </div>`;

  $('#quit').onclick = () => {
    if (idx === 0 || confirm('Dersten çıkmak istiyor musun? İlerleme kaydedilmeyecek.')) {
      lessonKeyHandler = null;
      location.hash = exitTo;
    }
  };

  function updateProgress() {
    $('#pbar').style.width = `${(idx / questions.length) * 100}%`;
    $('#lcount').textContent = `${Math.min(idx + 1, questions.length)}/${questions.length}`;
  }

  function show() {
    updateProgress();
    const q = questions[idx];
    const area = $('#qarea');
    const fb = $('#feedback');
    fb.className = 'feedback'; fb.innerHTML = '';
    area.innerHTML = '';
    area.classList.remove('pop'); void area.offsetWidth; area.classList.add('pop');
    lessonKeyHandler = null;
    RENDERERS[q.kind](q, area, (ok, info = {}) => finish(q, ok, info));
  }

  function finish(q, ok, { given = '', correct = q.answer || '', skipped = false } = {}) {
    results.push({ q, ok, given, correct, skipped });
    if (q.wordKey && !skipped) recordWord(q.wordKey, ok);
    if (!ok && !skipped && q.kind !== 'match') {
      recordMistake({ q: q.rawQ || stripTags(q.prompt || q.tr || q.speak || ''), given, correct, unit: q.unit || title });
    }
    if (skipped) {
      tone([440], 0.08);
    } else {
      ok ? sfx.good() : sfx.bad();
    }
    if (q.speakAfter && !skipped) setTimeout(() => speak(q.speakAfter), 250);

    const fb = $('#feedback');
    fb.className = `feedback show ${skipped ? 'neutral' : (ok ? 'ok' : 'bad')}`;
    fb.innerHTML = `
      <div class="fb-inner">
        <div class="fb-text">
          <div class="fb-title">${skipped ? 'Atlandı ⏩' : (ok ? pickOne(['Harika! 🎉', 'Süper! ⭐', 'Doğru! ✅', 'Mükemmel! 🌟', 'Aferin! 👏']) : 'Olmadı 😕')}</div>
          ${skipped ? `<div class="muted small" style="font-weight:700;margin-top:2px;">Mikrofon kullanılmadığı için puanlama yapılmadı. Doğrusu: <b>${esc(correct)}</b></div>` : (!ok && correct ? `<div class="fb-correct">Doğru cevap: <b>${esc(correct)}</b></div>` : '')}
          ${q.explain ? `<div class="fb-explain">💡 ${esc(q.explain)}</div>` : ''}
        </div>
        <button class="btn btn-big ${skipped ? 'btn-ghost' : (ok ? 'btn-green' : 'btn-red')}" id="nextBtn">Devam →</button>
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
    const scored = results.filter(r => !r.skipped);
    const totalCount = scored.length || results.length;
    const pct = Math.round((correct / totalCount) * 100);
    const out = onFinish ? onFinish(results, { correct, total: totalCount, pct }) || {} : {};
    const xp = out.xp ?? 0;
    if (pct >= 70) { sfx.win(); confetti(); }
    const wrong = results.filter(r => !r.ok && !r.skipped && r.q.kind !== 'match');
    $('#view').innerHTML = `
      <div class="lesson-end" style="--accent:${color}">
        <div class="end-emoji">${pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '💪'}</div>
        <h1>${pct === 100 ? 'Kusursuz!' : pct >= 70 ? 'Ders tamamlandı!' : 'Biraz daha pratik!'}</h1>
        ${out.message ? `<p class="end-msg">${out.message}</p>` : ''}
        <div class="end-stats">
          <div class="stat-pill" style="--c:#51CF66"><span>Doğru</span><b>${correct}/${scored.length}</b></div>
          <div class="stat-pill" style="--c:#339AF0"><span>Başarı</span><b>%${pct}</b></div>
          <div class="stat-pill" style="--c:#FCC419"><span>XP</span><b>+${xp}</b></div>
        </div>
        ${wrong.length ? `<div class="card end-wrong"><h3>Tekrar etmen gerekenler</h3>
          ${wrong.map(r => `<div class="wrong-row"><span>${esc(r.q.rawQ || stripTags(r.q.prompt || r.q.tr || r.q.speak || ''))}</span><b>${esc(r.correct)}</b></div>`).join('')}</div>` : ''}
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

function stripTags(s) { const d = document.createElement('div'); d.innerHTML = s; return d.textContent; }
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
    area.innerHTML = `
      <div class="q-head">
        <div class="q-prompt">Dinle ve duyduğunu seç 🎧</div>
        <div class="listen-audio-row">
          <button class="speak-btn big" id="spk" aria-label="Sesli dinle" title="Dinle">🔊</button>
          <button class="speak-btn slow" id="spkSlow" title="Yavaş" aria-label="Yavaş sesli dinle">🐢</button>
        </div>
      </div>
      <div class="options">${q.options.map((o, i) => `<button class="option" data-v="${esc(o)}"><span class="key">${i + 1}</span>${esc(o)}</button>`).join('')}</div>`;
    $('#spk').onclick = () => speak(q.speak);
    $('#spkSlow').onclick = () => { const r = state.settings.rate; state.settings.rate = 0.5; speak(q.speak); state.settings.rate = r; };
    setTimeout(() => speak(q.speak), 300);
    bindOptions(area, q, done);
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
      <button class="hint-btn" id="hintBtn">💡 İpucu</button>`;
    const inp = $('#typeIn');
    inp.focus();
    let answered = false;
    const check = () => {
      if (answered || !inp.value.trim()) return;
      answered = true;
      const ok = same(inp.value, q.answer);
      inp.classList.add(ok ? 'ok' : 'bad');
      inp.disabled = true;
      done(ok, { given: inp.value.trim(), correct: q.answer });
    };
    $('#checkBtn').onclick = check;
    $('#hintBtn').onclick = () => { inp.placeholder = q.answer[0] + ' ' + '_ '.repeat(q.answer.length - 1); inp.focus(); };
    lessonKeyHandler = e => { if (e.key === 'Enter') { e.preventDefault(); check(); } };
  },

  speak(q, area, done) {
    area.innerHTML = `
      <div class="q-head">
        ${q.emoji ? `<div class="q-emoji">${q.emoji}</div>` : ''}
        <div class="q-prompt">Şunu sesli oku 🎙️</div>
        <div class="speak-target">
          <span class="target-word">${esc(q.target)}</span>
          <button class="speak-btn sm" id="listenTargetBtn" title="Dinle" aria-label="Dinle">🔊</button>
        </div>
        <div class="muted small">${esc(q.tr)}</div>
      </div>
      <div class="voice-center">
        <button class="mic-btn" id="micBtn" aria-label="Mikrofonu aç ve seslendir">
          <span class="mic-icon">🎙️</span>
          <span class="mic-pulse"></span>
        </button>
        <div class="voice-status muted" id="voiceStatus">Mikrofona bas ve konuş</div>
        <div class="heard-text" id="heardText"></div>
      </div>
      <div class="center" style="margin-top:16px;">
        <button class="btn btn-ghost sm" id="skipVoiceBtn">Geç (Mikrofonum Yok)</button>
      </div>`;

    const mic = $('#micBtn');
    const status = $('#voiceStatus');
    const heard = $('#heardText');
    $('#listenTargetBtn').onclick = () => speak(q.target);

    let isListening = false;
    let answered = false;

    $('#skipVoiceBtn').onclick = () => {
      if (answered) return;
      answered = true;
      stopListening();
      done(false, { given: '(Atlandı)', correct: q.target, skipped: true });
    };

    mic.onclick = () => {
      if (answered) return;
      if (isListening) {
        stopListening();
        mic.classList.remove('listening');
        status.textContent = 'Durduruldu. Tekrar dene.';
        isListening = false;
        return;
      }

      isListening = true;
      mic.classList.add('listening');
      status.textContent = 'Dinleniyor... Konuşabilirsin 🎧';
      heard.textContent = '';

      listenSpeech({
        lang: 'en-US',
        onResult: (text) => {
          isListening = false;
          mic.classList.remove('listening');
          heard.textContent = `Duyulan: "${text}"`;
          const ok = same(text, q.target) || normalize(text).includes(normalize(q.target));
          answered = true;
          done(ok, { given: text, correct: q.target });
        },
        onError: (err) => {
          isListening = false;
          mic.classList.remove('listening');
          status.textContent = err;
        },
        onEnd: () => {
          if (!answered) {
            isListening = false;
            mic.classList.remove('listening');
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
      <div class="q-head"><div class="q-prompt">Cümleyi oluştur ✍️<div class="q-sub">"${esc(q.tr)}"</div></div></div>
      <div class="order-answer" id="oAns"></div>
      <div class="order-bank" id="oBank">${q.words.map((w, i) => `<button class="chip" data-i="${i}">${esc(w)}</button>`).join('')}</div>
      <div class="center"><button class="btn btn-primary" id="checkBtn" disabled>Kontrol Et</button></div>`;
    const ans = $('#oAns'), bank = $('#oBank'), btn = $('#checkBtn');
    let answered = false;
    const refresh = () => { btn.disabled = ans.children.length === 0; };
    area.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip || answered) return;
      (chip.parentElement === bank ? ans : bank).appendChild(chip);
      refresh();
    });
    const check = () => {
      if (answered || btn.disabled) return;
      answered = true;
      const given = $$('.chip', ans).map(c => c.textContent).join(' ');
      const ok = normalize(given) === normalize(q.answer);
      ans.classList.add(ok ? 'ok' : 'bad');
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
