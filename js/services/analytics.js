/**
 * @fileoverview AnalyticsService & Plugin - Kullanıcı Etkileşim ve Ders Tamamlama Analitiği
 */
export class AnalyticsService {
  constructor() {
    this._events = [];
  }

  track(eventName, payload = {}) {
    const entry = {
      event: eventName,
      payload,
      timestamp: Date.now()
    };
    this._events.push(entry);
    if (this._events.length > 100) this._events.shift();
    return entry;
  }

  getTrackedEvents() {
    return [...this._events];
  }
}

export const analyticsService = new AnalyticsService();

export const analyticsPlugin = {
  name: 'analytics',
  init() {
    analyticsService.track('plugin:initialized', { plugin: 'analytics' });
  },
  destroy() {
    analyticsService.track('plugin:destroyed', { plugin: 'analytics' });
  },
  hooks: {
    'lesson:completed': (data) => analyticsService.track('lesson_completed', data),
    'xp:earned': (data) => analyticsService.track('xp_earned', data)
  }
};

export default AnalyticsService;
