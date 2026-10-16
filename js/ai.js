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
    'gemini-2.5-flash'
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

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key
        },
        body: JSON.stringify(body)
      });
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
          throw new AIError('BAD_KEY', `API anahtarı geçersiz veya yetkisiz: ${msg}`, err);
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
  state.chat.push({ role: 'user', text: userText });
  const history = state.chat.slice(-20).map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
  const info = `name=${state.name || 'friend'}, completed units=${UNITS.filter(u => unitStats(u.id).done).map(u => u.en).join(', ') || 'none yet'}`;
  try {
    const reply = await gemini({ system: CHAT_PERSONA.replace('{INFO}', info), contents: history, temperature: 0.8 });
    state.chat.push({ role: 'model', text: reply.trim() });
    state.chat = state.chat.slice(-40);
    saveState();
    return reply;
  } catch (e) {
    state.chat.pop();
    throw e;
  }
}

/* ---------- Bağlantı testi ---------- */
async function aiTest() {
  return gemini({ contents: [{ role: 'user', parts: [{ text: 'Say "Hello! I am ready to help you learn English." in one line.' }] }], temperature: 0 });
}
