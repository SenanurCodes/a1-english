/**
 * PatiLingo AI Proxy — Cloudflare Worker
 *
 * Gemini API anahtarını tarayıcıya (frontend) sızdırmadan güvenli şekilde saklar.
 * Anahtar sadece Cloudflare'de Secret olarak tutulur: GEMINI_API_KEY
 *
 * Kurulum:
 *   1. dash.cloudflare.com -> Workers & Pages -> Create Worker ("patilingo-ai")
 *   2. Bu dosyanın içeriğini yapıştırıp Deploy et
 *   3. Settings -> Variables and Secrets -> Add Secret:
 *        Name:  GEMINI_API_KEY
 *        Value: AIzaSy... (aistudio.google.com/apikey'den aldığın anahtar)
 */

const ALLOWED_ORIGINS = [
  'https://senanurcodes.github.io',
  'http://localhost',
  'http://127.0.0.1'
];

const ALLOWED_MODELS = new Set([
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash'
]);

const MAX_BODY_BYTES = 16 * 1024; // 16 KB max istek boyutu
const MAX_OUTPUT_TOKENS = 1024;   // Yanıt token sınırı (maliyet koruması)
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 saat
const RATE_LIMIT_MAX_REQ = 25;    // IP başına saatlik maksimum istek

// Basit bellek içi hız sınırlayıcı (Worker instance başına)
const ipHits = new Map();

function isOriginAllowed(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some(allowed => origin === allowed || origin.startsWith(allowed + ':'));
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': isOriginAllowed(origin) ? origin : 'https://senanurcodes.github.io',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQ - 1 };
  }
  if (entry.count >= RATE_LIMIT_MAX_REQ) {
    return { allowed: false, remaining: 0, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQ - entry.count };
}

function jsonRes(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin)
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    // Preflight (CORS)
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Sağlık kontrolü (tarayıcıdan açıldığında çalışıp çalışmadığını görmek için)
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return jsonRes({
        ok: true,
        service: 'patilingo-ai-proxy',
        configured: Boolean(env && env.GEMINI_API_KEY)
      }, 200, origin);
    }

    if (request.method !== 'POST') {
      return jsonRes({ error: { message: 'Sadece POST istekleri kabul edilir.' } }, 405, origin);
    }

    // Sadece PatiLingo alan adından gelen isteklere izin ver
    if (!isOriginAllowed(origin)) {
      return jsonRes({ error: { message: 'Yetkisiz kaynak (Origin).' } }, 403, origin);
    }

    // API anahtarı Cloudflare Secrets içinde tanımlı mı?
    if (!env || !env.GEMINI_API_KEY) {
      return jsonRes({ error: { message: 'Sunucu yapılandırması eksik (GEMINI_API_KEY).' } }, 500, origin);
    }

    // IP tabanlı hız sınırı
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      return jsonRes({
        error: { message: 'Saatlik ücretsiz yapay zeka limitine ulaştın. Biraz bekleyip tekrar dene.' }
      }, 429, origin);
    }

    // İstek boyutu kontrolü
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return jsonRes({ error: { message: 'İstek boyutu çok büyük.' } }, 413, origin);
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return jsonRes({ error: { message: 'Geçersiz JSON.' } }, 400, origin);
    }

    const requestedModel = typeof payload.model === 'string' ? payload.model.trim() : 'gemini-2.0-flash';
    const model = ALLOWED_MODELS.has(requestedModel) ? requestedModel : 'gemini-2.0-flash';

    if (!Array.isArray(payload.contents) || payload.contents.length === 0 || payload.contents.length > 30) {
      return jsonRes({ error: { message: 'Geçersiz sohbet içeriği.' } }, 400, origin);
    }

    // Gemini'ye güvenli ve sınırlı istek oluştur
    const genConfig = {
      temperature: Number.isFinite(Number(payload.generationConfig?.temperature))
        ? Math.max(0, Math.min(1.5, Number(payload.generationConfig.temperature)))
        : 0.8,
      maxOutputTokens: MAX_OUTPUT_TOKENS
    };
    if (payload.generationConfig?.responseMimeType === 'application/json') {
      genConfig.responseMimeType = 'application/json';
    }

    const upstreamBody = {
      contents: payload.contents,
      generationConfig: genConfig
    };
    if (payload.systemInstruction && typeof payload.systemInstruction === 'object') {
      upstreamBody.systemInstruction = payload.systemInstruction;
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;

    try {
      const upstreamRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(upstreamBody)
      });
      const text = await upstreamRes.text();
      return new Response(text, {
        status: upstreamRes.status,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-RateLimit-Remaining': String(rl.remaining),
          ...corsHeaders(origin)
        }
      });
    } catch (err) {
      return jsonRes({ error: { message: 'Yapay zeka sunucusuna ulaşılamadı.' } }, 502, origin);
    }
  }
};
