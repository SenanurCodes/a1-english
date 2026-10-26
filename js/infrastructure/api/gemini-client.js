/**
 * @fileoverview Infrastructure API Layer - Google Gemini HTTP İstemcisi
 */
import { config } from '../../core/config.js';

export class GeminiClient {
  /**
   * @param {{ fetchImpl?: typeof fetch, getApiKey?: () => string }} [options]
   */
  constructor(options = {}) {
    this._fetch = options.fetchImpl || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    this._getApiKey = options.getApiKey || (() => '');
  }

  async generateContent({ system, contents, json = false, temperature = 0.8, model = config.ai.defaultModel }) {
    const key = this._getApiKey();
    if (!key) {
      const err = new Error('API anahtarı yok. Ayarlar sayfasından ekleyebilirsin.');
      err.code = 'NO_KEY';
      throw err;
    }
    if (!this._fetch) {
      throw new Error('Fetch API mevcut değil.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const body = {
      contents,
      generationConfig: { temperature, ...(json ? { responseMimeType: 'application/json' } : {}) }
    };
    if (system) body.systemInstruction = { parts: [{ text: system }] };

    const res = await this._fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg = errBody?.error?.message || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      err.code = res.status === 429 ? 'RATE_LIMIT' : (res.status === 400 || res.status === 403 ? 'BAD_KEY' : 'UNKNOWN');
      throw err;
    }

    const data = await res.json();
    const text = (data.candidates?.[0]?.content?.parts || [])
      .filter(p => !p.thought)
      .map(p => p.text || '')
      .join('');
    if (!text) {
      const err = new Error('Yapay zekadan boş yanıt geldi.');
      err.code = 'EMPTY_RESPONSE';
      throw err;
    }
    return text;
  }
}

export default GeminiClient;
