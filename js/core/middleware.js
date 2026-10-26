/**
 * @fileoverview Router ve Aksiyon Pipeline için Middleware Sistemi
 */

/**
 * Birden fazla middleware fonksiyonunu tek bir asenkron boru hattında (pipeline) birleştirir.
 * @param {...Function} middlewares
 */
export function compose(...middlewares) {
  return (context, finalHandler = () => Promise.resolve(context)) => {
    let index = -1;
    function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i;
      const fn = i === middlewares.length ? finalHandler : middlewares[i];
      if (!fn) return Promise.resolve(context);
      try {
        return Promise.resolve(fn(context, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  };
}

export const loggingMiddleware = async (context, next) => {
  context.meta = context.meta || {};
  context.meta.startedAt = Date.now();
  const result = await next();
  context.meta.durationMs = Date.now() - context.meta.startedAt;
  return result;
};

export const validationMiddleware = async (context, next) => {
  if (!context || typeof context.action !== 'string' || !context.action.trim()) {
    const err = new Error('Geçersiz aksiyon (Validation failed)');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  return next();
};

export const authMiddleware = async (context, next) => {
  if (context.requiresPro && (!context.user || !context.user.isPro)) {
    const err = new Error('Bu özellik PatiLingo Pro gerektirir.');
    err.code = 'QUOTA_EXCEEDED';
    throw err;
  }
  return next();
};

export const analyticsMiddleware = async (context, next) => {
  const result = await next();
  if (typeof context.onTrack === 'function') {
    context.onTrack(context.action, context.payload);
  }
  return result;
};
