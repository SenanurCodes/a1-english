/**
 * @fileoverview Centralized Error Boundary & Error Classification System
 */
export class ErrorHandler {
  constructor(eventBusInstance = null) {
    this._handlers = new Map();
    this._globalHandler = null;
    this._logs = [];
    this._eventBus = eventBusInstance;
  }

  /**
   * Belirli bir hata kategorisi için işleyici kaydeder.
   * @param {'auth'|'api'|'quota'|'validation'|'storage'|'unknown'} errorType
   * @param {Function} handler
   */
  register(errorType, handler) {
    this._handlers.set(errorType, handler);
    return this;
  }

  /**
   * Varsayılan global işleyiciyi belirler.
   * @param {Function} handler
   */
  setGlobalHandler(handler) {
    this._globalHandler = handler;
    return this;
  }

  /**
   * Hatayı sınıflandırır ve uygun işleyiciyi çalıştırır.
   * @param {Error|any} error
   * @param {Record<string, any>} [context]
   */
  handle(error, context = {}) {
    const errorType = this._getErrorType(error);
    const userMessage = this.getUserFriendlyMessage(error, errorType);
    const record = {
      type: errorType,
      message: error?.message || String(error),
      userMessage,
      context,
      timestamp: Date.now()
    };

    this._logToService(record);
    if (this._eventBus) {
      this._eventBus.emit('error:captured', record);
    }

    const handler = this._handlers.get(errorType) || this._globalHandler;
    if (handler) {
      return handler(error, { ...context, errorType, userMessage });
    }
    return this._defaultHandler(error, { ...context, errorType, userMessage });
  }

  /**
   * Hata nesnesinden standart hata kategorisini çıkarır.
   * @param {any} error
   */
  _getErrorType(error) {
    if (!error) return 'unknown';
    const code = error.code || '';
    if (code === 'NO_KEY' || code === 'BAD_KEY' || code === 'AUTH_ERROR') return 'auth';
    if (code === 'QUOTA_EXCEEDED') return 'quota';
    if (code === 'RATE_LIMIT' || code === 'EMPTY_RESPONSE') return 'api';
    if (code === 'VALIDATION_ERROR' || error instanceof TypeError || error instanceof RangeError) return 'validation';
    if (code === 'STORAGE_ERROR') return 'storage';
    return 'unknown';
  }

  /**
   * Kullanıcı dostu Türkçe hata mesajı üretir.
   */
  getUserFriendlyMessage(error, errorType = this._getErrorType(error)) {
    switch (errorType) {
      case 'auth':
        return 'API anahtarı eksik veya geçersiz. Ayarlar sayfasından kontrol edebilirsin.';
      case 'quota':
        return 'Günlük 15 ücretsiz AI mesaj hakkın doldu. PatiLingo Pro ile sınırsız devam edebilirsin!';
      case 'api':
        return 'Yapay zeka servisi şu an yoğun. Lütfen birkaç saniye bekleyip tekrar dene.';
      case 'validation':
        return error?.message || 'Girilen veri geçerli formatta değil.';
      case 'storage':
        return 'Veriler kaydedilirken yerel depolama sınırına ulaşıldı.';
      default:
        return error?.message || 'Beklenmeyen bir durum oluştu, ilerlemen güvende.';
    }
  }

  _defaultHandler(error, context) {
    console.error('[ErrorHandler]', context.errorType, error?.message || error, context);
    return context;
  }

  _logToService(record) {
    this._logs.push(record);
    if (this._logs.length > 50) this._logs.shift();
  }

  getRecentLogs() {
    return [...this._logs];
  }
}

export const errorHandler = new ErrorHandler();
export default errorHandler;
