/**
 * @fileoverview Middleware ve Component Lifecycle Destekli Modüler Router
 */
import { compose } from './middleware.js';
import { eventBus } from './events.js';

export class Router {
  /**
   * @param {{ eventBus?: any }} [options]
   */
  constructor(options = {}) {
    this._routes = new Map();
    this._middlewares = [];
    this._currentComponent = null;
    this._currentRoute = null;
    this._eventBus = options.eventBus || eventBus;
  }

  /**
   * Yeni bir rota kaydeder.
   * @param {string} path
   * @param {Function|object} handlerOrComponent
   */
  register(path, handlerOrComponent) {
    const clean = path.replace(/^#?\/?/, '') || 'home';
    this._routes.set(clean, handlerOrComponent);
    return this;
  }

  /**
   * Router pipeline'ına middleware ekler.
   * @param {Function} middleware
   */
  use(middleware) {
    if (typeof middleware === 'function') {
      this._middlewares.push(middleware);
    }
    return this;
  }

  /**
   * Belirtilen rotaya geçiş yapar ve middleware zincirini çalıştırır.
   * @param {string} rawHash
   */
  async navigate(rawHash = '#/home') {
    const [rawRoute, param] = String(rawHash).replace(/^#?\/?/, '').split('/');
    const route = (rawRoute ? rawRoute.split('?')[0] : '') || 'home';
    const context = {
      action: `route:${route}`,
      route,
      param: param || null,
      payload: { route, param: param || null }
    };

    const pipeline = compose(...this._middlewares);
    await pipeline(context, async () => {
      if (this._currentComponent && typeof this._currentComponent.unmount === 'function') {
        this._currentComponent.unmount();
      }

      const target = this._routes.get(route) || this._routes.get('home');
      this._currentRoute = route;

      if (target) {
        if (typeof target === 'function') {
          const maybeInstance = await target(param, context);
          this._currentComponent = (maybeInstance && typeof maybeInstance.unmount === 'function') ? maybeInstance : null;
        } else if (typeof target.mount === 'function') {
          await target.mount(param, context);
          this._currentComponent = target;
        }
      }

      if (this._eventBus) {
        this._eventBus.emit('route:changed', { route, param: param || null });
      }
      return context;
    });

    return context;
  }

  getCurrentRoute() {
    return this._currentRoute;
  }
}

export const router = new Router();
export default router;
