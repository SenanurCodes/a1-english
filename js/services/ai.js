/**
 * @fileoverview AIService - Dependency Injection Uyumlu Yapay Zeka ve Kota Servisi
 */
import { config } from '../core/config.js';

export class AIService {
  /**
   * @param {import('../core/store.js').AppStore} store
   * @param {import('../infrastructure/api/gemini-client.js').GeminiClient} [geminiClient]
   */
  constructor(store, geminiClient = null) {
    this.store = store;
    this.client = geminiClient;
  }

  getQuotaStatus() {
    const today = new Date().toISOString().slice(0, 10);
    const isPro = Boolean(this.store?.state?.settings?.isPro);
    let used = 0;
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(config.ai.quotaStorageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.date === today) {
            used = Math.max(0, Math.floor(Number(parsed.count) || 0));
          }
        }
      }
    } catch (_) {}

    const limit = config.ai.dailyFreeQuota;
    return {
      date: today,
      used,
      limit,
      remaining: isPro ? Infinity : Math.max(0, limit - used),
      isPro,
      locked: !isPro && used >= limit
    };
  }

  incrementQuota() {
    const status = this.getQuotaStatus();
    if (status.isPro) return status;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(config.ai.quotaStorageKey, JSON.stringify({
          date: status.date,
          count: status.used + 1
        }));
      }
    } catch (_) {}
    return this.getQuotaStatus();
  }

  async chat(userText) {
    const quota = this.getQuotaStatus();
    if (quota.locked) {
      const err = new Error('Günlük 15 ücretsiz AI mesaj hakkın doldu.');
      err.code = 'QUOTA_EXCEEDED';
      throw err;
    }
    if (typeof globalThis.aiChat === 'function') {
      return globalThis.aiChat(userText);
    }
    if (!this.client) {
      throw new Error('GeminiClient yapılandırılmadı.');
    }
    const reply = await this.client.generateContent({
      contents: [{ role: 'user', parts: [{ text: userText }] }]
    });
    this.incrementQuota();
    return reply;
  }
}

export default AIService;
