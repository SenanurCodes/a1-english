/**
 * @fileoverview PatiLingo Merkezi Konfigürasyon Yönetimi (Single Source of Truth)
 */
const envMode = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE)
  ? import.meta.env.MODE
  : (typeof process !== 'undefined' && process.env && process.env.NODE_ENV ? process.env.NODE_ENV : 'production');

export const config = {
  app: {
    name: 'PatiLingo',
    version: '2.9.32',
    environment: envMode,
    storeKey: 'a1english_v2',
    legacyStoreKey: 'a1english_v1'
  },
  srs: {
    intervals: [0, 1, 2, 4, 7, 15, 30],
    boxes: 7,
    defaultReviewLimit: 25
  },
  xp: {
    perLesson: 15,
    perBoss: 50,
    perDaily: 10,
    perCorrectAnswer: 10
  },
  progression: {
    passThreshold: 70,
    unlockNextLevel: true,
    levelBoundaries: {
      A1: { start: 0, end: 26 },
      A2: { start: 27, end: 51 },
      B1: { start: 52, end: 73 },
      B2: { start: 74, end: 96 }
    }
  },
  ai: {
    defaultModel: 'gemini-2.5-flash',
    fallbackModels: ['gemini-2.0-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest'],
    dailyFreeQuota: 15,
    quotaStorageKey: 'patilingo_ai_daily_quota_v1',
    timeoutMs: 18000,
    maxRetries: 3
  },
  ui: {
    animationDuration: 300,
    debounceDelay: 300,
    defaultMascot: 'squirrel',
    defaultTheme: 'nordic'
  }
};

if (config.app.environment === 'development') {
  config.ai.rateLimit = 100;
}

export default config;
