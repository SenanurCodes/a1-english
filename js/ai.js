/* ============================================================
   Yapay zeka: Google Gemini API (ücretsiz katman)
   Anahtar kullanıcının tarayıcısında saklanır, başka yere gönderilmez.
   ============================================================ */

class AIError extends Error {
  constructor(code, message, original = null) {
    super(message);
    this.name = 'AIError';
    this.code = code; // 'NO_KEY' | 'RATE_LIMIT' | 'BAD_KEY' | 'EMPTY_RESPONSE' | 'UNKNOWN'
    this.original = original;
  }
}

/* ============================================================
   Freemium AI Kotası & PatiLingo Pro Yönetimi (Günlük 15 Mesaj)
   ============================================================ */
const AI_QUOTA_STORAGE_KEY = 'patilingo_ai_daily_quota_v1';
const AI_DAILY_FREE_LIMIT = 15;

function getQuotaTodayKey() {
  if (typeof todayStr === 'function') return todayStr();
  return new Date().toISOString().slice(0, 10);
}

function isProUser() {
  try {
    if (state && state.settings && state.settings.isPro === true) return true;
    if (typeof localStorage !== 'undefined' && localStorage.getItem('patilingo_is_pro') === 'true') return true;
  } catch (_) {}
  return false;
}

function getAiQuotaStatus() {
  const today = getQuotaTodayKey();
  const pro = isProUser();
  let used = 0;
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(AI_QUOTA_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.date === today && Number.isFinite(Number(parsed.count))) {
          used = Math.max(0, Math.floor(Number(parsed.count)));
        } else {
          localStorage.setItem(AI_QUOTA_STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
        }
      }
    }
  } catch (_) {}

  const remaining = pro ? Infinity : Math.max(0, AI_DAILY_FREE_LIMIT - used);
  return {
    date: today,
    used,
    limit: AI_DAILY_FREE_LIMIT,
    remaining,
    isPro: pro,
    locked: !pro && used >= AI_DAILY_FREE_LIMIT
  };
}

function incrementAiQuota() {
  const status = getAiQuotaStatus();
  if (status.isPro) return status;
  const nextCount = status.used + 1;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AI_QUOTA_STORAGE_KEY, JSON.stringify({
        date: status.date,
        count: nextCount
      }));
    }
  } catch (_) {}
  return getAiQuotaStatus();
}

function activatePatiLingoPro(planType = 'monthly') {
  try {
    if (typeof store !== 'undefined' && typeof store.setProStatus === 'function') {
      store.setProStatus(true, planType);
    } else if (state && state.settings) {
      state.settings.isPro = true;
      state.settings.proPlan = planType;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('patilingo_is_pro', 'true');
        localStorage.setItem('patilingo_pro_plan', planType);
      }
      if (typeof saveState === 'function') saveState();
    }
  } catch (_) {}

  if (typeof closeModal === 'function') closeModal();
  if (typeof confettiBurst === 'function') confettiBurst();
  const planLabel = planType === 'weekly' ? 'Haftalık Pro' : 'Aylık Pro';
  if (typeof toast === 'function') {
    toast(`👑 PatiLingo ${planLabel} aktif edildi! Sınırsız AI Öğretmen açıldı 🎉`);
  }
  if (typeof screenAI === 'function' && typeof location !== 'undefined' && location.hash.startsWith('#/ai')) {
    screenAI();
  }
  return true;
}

function openProUpgradeModal(reasonText = '') {
  if (typeof openModal !== 'function') return;
  const quota = getAiQuotaStatus();
  let selectedPlan = 'monthly';

  openModal(`
    <div class="pro-modal-wrap">
      <div class="pro-crown-badge">👑</div>
      <h2 style="margin:0 0 6px;font-size:1.45rem;">PatiLingo Pro'ya Geç</h2>
      <p class="muted small" style="margin:0 0 12px;">
        ${reasonText ? reasonText : `Günlük ücretsiz <b>${quota.limit}/${quota.limit} AI mesaj</b> hakkını tamamladın! Kesintisiz konuşma pratiği ve sınırsız yapay zeka koçluğu için Pro'ya yükselt.`}
      </p>

      <ul class="pro-feature-list">
        <li><span>✅</span> <span><b>Sınırsız Sunny AI Sohbet:</b> Günlük 15 mesaj sınırı olmadan 7/24 konuşma pratiği</span></li>
        <li><span>✅</span> <span><b>Sınırsız Özel Alıştırma & Analiz:</b> Eksiklerine göre anında yeni testler üret</span></li>
        <li><span>✅</span> <span><b>Hayatta Kalma & Maskot Koçu:</b> Aşamalı ipuçları ve detaylı gramer açıklamaları</span></li>
        <li><span>✅</span> <span><b>Reklamsız & Öncelikli Deneyim:</b> Tüm cihazlarında Pro rozeti</span></li>
      </ul>

      <div class="pro-plan-grid" id="proPlanGrid">
        <div class="pro-plan-card" data-plan="weekly">
          <div class="muted small" style="font-weight:700;">Haftalık Paket</div>
          <div style="font-size:1.25rem;font-weight:900;margin:4px 0;">₺49,99</div>
          <div class="muted small">Haftalık esnek ödeme</div>
        </div>
        <div class="pro-plan-card selected" data-plan="monthly">
          <span class="pro-plan-tag">%40 İNDİRİM</span>
          <div class="muted small" style="font-weight:700;">Aylık Paket</div>
          <div style="font-size:1.25rem;font-weight:900;margin:4px 0;">₺119,99</div>
          <div class="muted small">₺29,99 / hafta'ya gelir</div>
        </div>
      </div>

      <button type="button" class="btn btn-primary" id="confirmProPurchaseBtn" style="width:100%;padding:13px 18px;font-size:1rem;background:linear-gradient(135deg,#F59E0B,#EC4899);border:none;color:#fff;">
        👑 PatiLingo Pro'yu Başlat (Demo Aktif Et)
      </button>
      <button type="button" class="btn btn-ghost sm" id="cancelProModalBtn" style="width:100%;margin-top:8px;">
        Şimdilik Ücretsiz Devam Et (Yarın Yenilenir)
      </button>
    </div>
  `);

  const cards = document.querySelectorAll('#proPlanGrid .pro-plan-card');
  cards.forEach(card => {
    card.onclick = () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPlan = card.getAttribute('data-plan') || 'monthly';
    };
  });

  const buyBtn = document.getElementById('confirmProPurchaseBtn');
  if (buyBtn) {
    buyBtn.onclick = () => activatePatiLingoPro(selectedPlan);
  }
  const cancelBtn = document.getElementById('cancelProModalBtn');
  if (cancelBtn) {
    cancelBtn.onclick = () => closeModal();
  }
}

function getApiKey() {
  const fromState = state?.settings?.apiKey;
  if (typeof fromState === 'string' && fromState.trim()) return fromState.trim();
  if (typeof window !== 'undefined') {
    if (window.GEMINI_API_KEY && typeof window.GEMINI_API_KEY === 'string' && window.GEMINI_API_KEY.trim()) {
      return window.GEMINI_API_KEY.trim();
    }
    if (window.__ENV__?.GEMINI_API_KEY && typeof window.__ENV__.GEMINI_API_KEY === 'string' && window.__ENV__.GEMINI_API_KEY.trim()) {
      return window.__ENV__.GEMINI_API_KEY.trim();
    }
  }
  return '';
}

function hasAI() { return !!getApiKey(); }

async function gemini({ system, contents, json = false, temperature = 0.8 }) {
  const key = getApiKey();
  if (!key) throw new AIError('NO_KEY', 'API anahtarı yok. Ayarlar sayfasından ekleyebilirsin.');

  // Kullanıcının seçtiği model ve yedek kararlı modeller sırası
  const preferred = (state?.settings?.model || '').trim();
  const candidateModels = [
    preferred,
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro'
  ].filter(Boolean);

  // Tekrarlayanları temizle
  const modelsToTry = [...new Set(candidateModels)];

  let lastError = null;
  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
      const body = {
        contents,
        generationConfig: { temperature, ...(json ? { responseMimeType: 'application/json' } : {}) }
      };
      if (system) body.systemInstruction = { parts: [{ text: system }] };

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 18000) : null;
      let res;
      try {
        res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': key
          },
          body: JSON.stringify(body),
          signal: controller ? controller.signal : undefined
        });
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
      if (res.status === 404) {
        // Bu model yoksa veya bu anahtarın bölgesinde açık değilse listedeki bir sonrakini dene
        continue;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error?.message || `HTTP ${res.status}`;
        if (res.status === 429) {
          throw new AIError('RATE_LIMIT', 'Google Gemini ücretsiz kullanım sınırına ulaşıldı. Biraz bekleyip tekrar dene.', err);
        }
        if (res.status === 400 || res.status === 403) {
          let userMsg = msg;
          if (msg.toLowerCase().includes('api key not valid') || msg.includes('API_KEY_INVALID')) {
            userMsg = 'API key not valid (Google Gemini anahtarı geçersiz. Lütfen aistudio.google.com/apikey adresinden aldığınız AIzaSy... anahtarını girdiğinizden emin olun)';
          }
          throw new AIError('BAD_KEY', `API anahtarı geçersiz veya yetkisiz: ${userMsg}`, err);
        }
        throw new AIError('UNKNOWN', msg, err);
      }
      const data = await res.json();
      const text = (data.candidates?.[0]?.content?.parts || []).filter(p => !p.thought).map(p => p.text || '').join('');
      if (!text) {
        throw new AIError('EMPTY_RESPONSE', 'Yapay zekadan boş yanıt geldi.');
      }
      
      // Çalışan modeli kaydet
      if (state.settings && state.settings.model !== model) {
        state.settings.model = model;
        saveState();
      }
      return text;
    } catch (err) {
      lastError = err;
      if (err instanceof AIError && (err.code === 'NO_KEY' || err.code === 'BAD_KEY' || err.code === 'RATE_LIMIT')) {
        throw err;
      }
    }
  }

  throw lastError || new AIError('UNKNOWN', 'Uygun bir Gemini modeli bulunamadı. Lütfen API anahtarını kontrol et.');
}

/* ---------- Öğrenci özeti (AI'ya gönderilecek) ---------- */
function learnerSummary() {
  const units = UNITS.map(u => {
    const s = unitStats(u.id);
    return {
      unit: `${u.en} (${u.type})`,
      unlocked: isUnlocked(u.index),
      bestScore: s.best,
      attempts: s.attempts,
      accuracy: s.total ? Math.round((s.correct / s.total) * 100) : null
    };
  }).filter(u => u.unlocked || u.attempts);
  return {
    name: state.name,
    xp: state.xp,
    streakDays: currentStreak(),
    completedUnits: doneCount(),
    totalUnits: UNITS.length,
    units,
    weakWords: weakWords(12).map(w => `${w.en} (${w.tr}) – ${w.stats.wrong} yanlış / ${w.stats.right} doğru`),
    recentMistakes: state.mistakes.slice(0, 20).map(m => ({ question: m.q, studentAnswer: m.given, correct: m.correct, unit: m.unit }))
  };
}

const TEACHER_PERSONA = `Sen Türk öğrencilere İngilizce öğreten, sevecen, motive edici ve sabırlı bir öğretmensin.
Öğrenci CEFR A1 seviyesindedir. Açıklamalarını Türkçe yap, İngilizce örnekleri basit tut. Emojileri ölçülü kullan.`;

/* ---------- 1) Seviye analizi ---------- */
async function aiAnalyze() {
  const summary = learnerSummary();
  const prompt = `Aşağıda öğrencinin uygulamadaki ilerleme verileri var (JSON).
Bu verilere dayanarak kısa ve net bir seviye raporu hazırla. Biçim:

### 🎯 Tahmini Seviye
(A1.1 / A1.2 / A1.3 / A1.4 / A1 tamam gibi bir etiket ve bir cümlelik açıklama)

### 💪 Güçlü Yönlerin
- madde madde

### 🔧 Geliştirmen Gerekenler
- madde madde, hatalardan somut örneklerle ve kuralı kısaca açıklayarak

### 📅 Bu Haftaki Planın
- 3-4 somut öneri

Veri yoksa veya çok azsa bunu nazikçe söyle ve nereden başlaması gerektiğini öner.

VERİ:
${JSON.stringify(summary, null, 1)}`;
  const text = await gemini({ system: TEACHER_PERSONA, contents: [{ role: 'user', parts: [{ text: prompt }] }], temperature: 0.6 });
  state.aiReport = { text, at: Date.now() };
  saveState();
  return text;
}

/* ---------- 2) Kişiye özel alıştırma üret ---------- */
async function aiGenerateExercises(focus = '') {
  const summary = learnerSummary();
  const prompt = `Öğrencinin verilerine bakarak zayıf olduğu konulara odaklanan 10 soruluk bir A1 İngilizce alıştırması üret.
${focus ? `Öğrenci özellikle şu konuyu istedi: "${focus}".` : 'Hatalarına ve düşük puanlı ünitelerine odaklan. Veri azsa temel A1 konularından karışık sor.'}

SADECE şu JSON biçiminde yanıt ver:
{
  "title": "kısa Türkçe başlık",
  "questions": [
    { "t": "mc", "q": "İngilizce soru, boşluk için ___ kullan (gerekirse parantez içinde Türkçe ipucu)", "o": ["seçenek1","seçenek2","seçenek3"], "a": "doğru seçenek (o içinde birebir olmalı)", "h": "Türkçe kısa açıklama (neden doğru)" },
    { "t": "order", "s": "Noktalama işareti olmadan İngilizce cümle (3-7 kelime)", "tr": "Türkçe anlamı" }
  ]
}
Kurallar: 7-8 tane "mc", 2-3 tane "order" olsun. Seçenekler 3 veya 4 tane olsun. Sadece A1 kelimeleri kullan.

VERİ:
${JSON.stringify(summary)}`;
  const text = await gemini({ system: TEACHER_PERSONA, contents: [{ role: 'user', parts: [{ text: prompt }] }], json: true, temperature: 0.9 });
  let data;
  try { data = JSON.parse(text.replace(/^```json|```$/g, '').trim()); }
  catch (e) { throw new Error('Yapay zekanın ürettiği alıştırma okunamadı, tekrar dene.'); }
  const questions = (data.questions || []).map(q => {
    if (q.t === 'mc' && q.q && Array.isArray(q.o) && q.o.includes(q.a)) {
      return { kind: 'mc', prompt: q.q, options: shuffle(q.o), answer: q.a, explain: q.h, speakAfter: q.q.replace('___', q.a) };
    }
    if (q.t === 'order' && q.s && q.tr) {
      const s = q.s.replace(/[.?!]/g, '').trim();
      return { kind: 'order', tr: q.tr, answer: s, words: shuffle(s.split(/\s+/)) };
    }
    return null;
  }).filter(Boolean);
  if (questions.length < 3) throw new Error('Yeterli soru üretilemedi, tekrar dene.');
  return { title: data.title || 'Sana Özel Alıştırma', questions };
}

/* ---------- 3) Sohbet pratiği ---------- */
const CHAT_PERSONA = `You are "Sunny", a friendly English conversation partner for a Turkish learner at CEFR A1 level.
Rules:
- Reply in VERY simple English (A1 words, short sentences), 1-3 sentences max.
- Always end with one simple question to keep the conversation going.
- If the learner's last message has a grammar or spelling mistake, add a new line at the end starting with "💡 Düzeltme:" and briefly show the correct sentence and explain the rule in Turkish (one short sentence).
- If the learner writes in Turkish, gently help them say it in English (give the English sentence) and continue.
- Be warm and encouraging. Use an emoji sometimes.
Learner info: ${'{INFO}'}`;

async function aiChat(userText) {
  const quota = getAiQuotaStatus();
  if (quota.locked) {
    if (typeof openProUpgradeModal === 'function') {
      openProUpgradeModal();
    }
    throw new AIError('QUOTA_EXCEEDED', 'Günlük 15 ücretsiz AI mesaj hakkın doldu. Sınırsız pratik için PatiLingo Pro\'ya geçebilirsin! 👑');
  }

  state.chat.push({ role: 'user', text: userText });
  const history = state.chat.slice(-20).map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
  const info = `name=${state.name || 'friend'}, completed units=${UNITS.filter(u => unitStats(u.id).done).map(u => u.en).join(', ') || 'none yet'}`;
  try {
    const reply = await gemini({ system: CHAT_PERSONA.replace('{INFO}', info), contents: history, temperature: 0.8 });
    state.chat.push({ role: 'model', text: reply.trim() });
    state.chat = state.chat.slice(-40);
    incrementAiQuota();
    saveState();
    return reply;
  } catch (e) {
    state.chat.pop();
    throw e;
  }
}

/* ---------- Bağlantı testi ---------- */
async function aiTest() {
  const key = getApiKey();
  if (!key) throw new AIError('NO_KEY', 'API anahtarı yok. Ayarlar sayfasından ekleyebilirsin.');
  return gemini({ contents: [{ role: 'user', parts: [{ text: 'Say "Hello! I am ready to help you learn English." in one line.' }] }], temperature: 0 });
}

