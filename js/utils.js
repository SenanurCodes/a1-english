/* ============================================================
   Yardımcılar: ses, seslendirme, konfeti, markdown, karıştırma
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample(arr, n) { return shuffle(arr).slice(0, n); }

function normalize(s) {
  return String(s).toLowerCase().replace(/[.,!?;:'"’]/g, '').replace(/\s+/g, ' ').trim();
}

/* ---------- Seslendirme (Web Speech API) ---------- */
let enVoice = null;
let trVoice = null;

function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  
  // İngilizce için en doğal ses (Google US, Natural Online, en-US / en-GB)
  enVoice = voices.find(v => /en[-_]US/i.test(v.lang) && /Google|Natural|Online|Neural/i.test(v.name))
    || voices.find(v => /en[-_]US/i.test(v.lang))
    || voices.find(v => /en[-_]GB/i.test(v.lang))
    || voices.find(v => /^en/i.test(v.lang)) || null;

  // Türkçe için en doğal ses (Google Türkçe, Microsoft Tolga/Emel, Apple Yelda)
  trVoice = voices.find(v => /tr[-_]TR/i.test(v.lang) && /Google|Natural|Online|Neural/i.test(v.name))
    || voices.find(v => /tr[-_]TR/i.test(v.lang))
    || voices.find(v => /^tr/i.test(v.lang)) || null;
}

if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

function speak(text, forceLang) {
  if (!('speechSynthesis' in window) || !text) return;
  speechSynthesis.cancel();
  
  // Emojileri temizle (TTS emojileri saçma sapan okumasın veya dili şaşırtmasın)
  const clean = String(text)
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}]/gu, '')
    .replace(/^["'“”«»]+|["'“”«»]+$/g, '')
    .trim();
  if (!clean) return;

  const u = new SpeechSynthesisUtterance(clean);

  // Dil Tespiti: Türkçe mi, İngilizce mi?
  const isTr = forceLang === 'tr' || (!forceLang && (
    /[çğıöşüÇĞİÖŞÜ]/.test(clean) ||
    /\b(miyav|hav|merhaba|hata|hadi|asla|öğren|ders|günlük|yoldaş|fındık|bambu|pamuk|bilge|dost|adım|başarı|güveniyorum)\b/i.test(clean)
  ));

  if (isTr) {
    u.lang = 'tr-TR';
    if (trVoice) u.voice = trVoice;
  } else {
    u.lang = 'en-US';
    if (enVoice) u.voice = enVoice;
  }

  u.rate = (state.settings && state.settings.rate) || 0.92;
  speechSynthesis.speak(u);
}

/* ---------- Konuşma Tanıma (Mikrofon - Speech Recognition) ---------- */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function isSpeechSupported() {
  return !!SpeechRecognition;
}

let activeRecognizer = null;

function listenSpeech({ onResult, onError, onEnd, lang = 'en-US' }) {
  if (!SpeechRecognition) {
    if (onError) onError('Tarayıcın ses tanımayı desteklemiyor. Chrome veya Edge kullanmayı deneyebilirsin.');
    return null;
  }
  if (activeRecognizer) {
    try { activeRecognizer.abort(); } catch(e) {}
  }
  try {
    const recog = new SpeechRecognition();
    recog.lang = lang;
    recog.interimResults = false;
    recog.maxAlternatives = 3;

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    recog.onerror = (event) => {
      if (onError) onError(event.error === 'no-speech' ? 'Ses algılanamadı, lütfen tekrar dene.' : 'Mikrofon hatası: ' + event.error);
    };

    recog.onend = () => {
      activeRecognizer = null;
      if (onEnd) onEnd();
    };

    activeRecognizer = recog;
    recog.start();
    return recog;
  } catch (err) {
    if (onError) onError('Mikrofon başlatılamadı: ' + err.message);
    return null;
  }
}

function stopListening() {
  if (activeRecognizer) {
    try { activeRecognizer.stop(); } catch(e) {}
    activeRecognizer = null;
  }
}

/* ---------- Ses efektleri (Web Audio) ---------- */
let audioCtx = null;
function tone(freqs, dur = 0.12, type = 'sine') {
  if (!state.settings.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type; o.frequency.value = f;
      const t = audioCtx.currentTime + i * dur;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(audioCtx.destination);
      o.start(t); o.stop(t + dur + 0.02);
    });
  } catch (e) { /* ses desteklenmiyor */ }
}
const sfx = {
  good: () => tone([660, 880], 0.1),
  bad: () => tone([220, 170], 0.15, 'triangle'),
  win: () => tone([523, 659, 784, 1047], 0.12)
};

/* ---------- Konfeti ---------- */
function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function confetti(count = 140) {
  // Hareket azaltma tercihi açıksa konfeti gösterme
  if (prefersReducedMotion()) return;
  const canvas = $('#confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = innerWidth; canvas.height = innerHeight;
  const colors = UNIT_COLORS;
  const parts = Array.from({ length: count }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 200,
    y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 16,
    vy: Math.random() * -14 - 4,
    s: Math.random() * 8 + 5,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    c: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frame = 0;
  (function loop() {
    if (canvas.width !== innerWidth || canvas.height !== innerHeight) {
      canvas.width = innerWidth; canvas.height = innerHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach(p => {
      p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    });
    if (++frame < 160) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })();
}

/* ---------- Basit markdown ---------- */
function md(text) {
  const lines = esc(text).split('\n');
  let html = '', inList = false;
  for (let line of lines) {
    line = line.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*]+)\*/g, '$1<i>$2</i>');
    const li = line.match(/^\s*[-*•]\s+(.*)/) || line.match(/^\s*\d+\.\s+(.*)/);
    if (li) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${li[1]}</li>`;
      continue;
    }
    if (inList) { html += '</ul>'; inList = false; }
    const h = line.match(/^(#{1,4})\s+(.*)/);
    if (h) html += `<h4>${h[2]}</h4>`;
    else if (line.trim()) html += `<p>${line}</p>`;
  }
  if (inList) html += '</ul>';
  return html;
}

/* ---------- Toast ---------- */
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.setAttribute('aria-live', 'polite');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
}
