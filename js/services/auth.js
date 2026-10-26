/**
 * @fileoverview AuthService - Kimlik Doğrulama ve Misafir/Pro Oturum Yönetimi
 */
export class AuthService {
  /**
   * @param {import('../core/store.js').AppStore} store
   * @param {import('../core/events.js').EventBus} [eventBus]
   */
  constructor(store, eventBus = null) {
    this.store = store;
    this.eventBus = eventBus;
  }

  isValidEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  isValidPassword(password) {
    return typeof password === 'string' && password.length >= 6;
  }

  loginAsGuest(name = 'Öğrenci') {
    this.store.setName(name);
    this.store.state.auth = { isGuest: true, user: null, provider: 'guest' };
    this.store.save();
    if (this.eventBus) this.eventBus.emit('auth:changed', this.store.state.auth);
    return this.store.state.auth;
  }

  loginWithUser(user, provider = 'password') {
    if (!user || !this.isValidEmail(user.email)) {
      const err = new Error('Geçerli bir e-posta adresi giriniz.');
      err.code = 'AUTH_ERROR';
      throw err;
    }
    this.store.state.auth = {
      isGuest: false,
      user: {
        uid: user.uid || 'u_' + Date.now(),
        email: user.email.trim(),
        displayName: user.displayName || this.store.state.name
      },
      provider
    };
    this.store.save();
    if (this.eventBus) this.eventBus.emit('auth:changed', this.store.state.auth);
    return this.store.state.auth;
  }
}

export default AuthService;
