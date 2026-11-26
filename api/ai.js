/**
 * PatiLingo AI Proxy — Vercel Serverless Function (/api/ai)
 *
 * Gemini API anahtarını tarayıcıya sızdırmadan Vercel Environment Variables
 * içinden (GEMINI_API_KEY) güvenli şekilde okur ve Google Gemini'ye iletir.
 */

const ALLOWED_MODELS = new Set([
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash'
]);

const MAX_BODY_BYTES = 16 * 1024;
const MAX_OUTPUT_TOKENS = 1024;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQ = 25;

const ipHits = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQ - 1 };
  }
  if (entry.count >= RATE_LIMIT_MAX_REQ) {
    return { allowed: false, remaining: 0 };
  }
  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQ - entry.count };
}

module.exports = async function handler(req, res) {
  // Sağlık kontrolü
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'patilingo-vercel-ai-proxy',
      configured: Boolean(process.env.GEMINI_API_KEY)
    });
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Sadece POST istekleri kabul edilir.' } });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: { message: 'Sunucu yapılandırması eksik (GEMINI_API_KEY).' } });
  }

  // IP tabanlı hız sınırı
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString().split(',')[0].trim();
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return res.status(429).json({
      error: { message: 'Saatlik ücretsiz yapay zeka limitine ulaştın. Biraz bekleyip tekrar dene.' }
    });
  }

  const payload = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return null; } })() : req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: { message: 'Geçersiz JSON.' } });
  }

  if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > MAX_BODY_BYTES) {
    return res.status(413).json({ error: { message: 'İstek boyutu çok büyük.' } });
  }

  const requestedModel = typeof payload.model === 'string' ? payload.model.trim() : 'gemini-2.0-flash';
  const model = ALLOWED_MODELS.has(requestedModel) ? requestedModel : 'gemini-2.0-flash';

  if (!Array.isArray(payload.contents) || payload.contents.length === 0 || payload.contents.length > 30) {
    return res.status(400).json({ error: { message: 'Geçersiz sohbet içeriği.' } });
  }

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

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;

  try {
    const upstreamRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(upstreamBody)
    });
    const text = await upstreamRes.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-RateLimit-Remaining', String(rl.remaining));
    return res.status(upstreamRes.status).send(text);
  } catch (err) {
    return res.status(502).json({ error: { message: 'Yapay zeka sunucusuna ulaşılamadı.' } });
  }
};
