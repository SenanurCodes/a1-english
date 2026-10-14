/* ============================================================
   A1 English v2.0 - Firebase Entegrasyonu
   AuthService (Google & E-posta Girişi, Misafir Modu)
   CloudDatabaseService (Firebase Realtime Database Düello Motoru)
   ============================================================ */

const FIREBASE_CONFIG_KEY = 'a1_firebase_config';

class AuthService {
  constructor(appStore) {
    this.store = appStore;
    this.auth = null;
    this.provider = null;
    this._init();
  }

  _init() {
    try {
      const savedConfig = localStorage.getItem(FIREBASE_CONFIG_KEY);
      if (savedConfig && window.firebase && !firebase.apps.length) {
        const config = JSON.parse(savedConfig);
        firebase.initializeApp(config);
        this.auth = firebase.auth();
        this.provider = new firebase.auth.GoogleAuthProvider();

        this.auth.onAuthStateChanged(user => {
          if (user) {
            this.store.setAuth({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0],
              photoURL: user.photoURL
            }, false, user.providerData?.[0]?.providerId || 'firebase');
          } else {
            // Çıkış yapıldıysa misafir moduna al
            if (!this.store.state.auth.isGuest) {
              this.store.setAuth(null, true, 'guest');
            }
          }
        });
      }
    } catch (e) {
      console.warn('Firebase init notice:', e.message);
    }
  }

  isConfigured() {
    return !!(window.firebase && firebase.apps && firebase.apps.length);
  }

  setupConfig(configObj) {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(configObj));
    if (window.firebase && !firebase.apps.length) {
      firebase.initializeApp(configObj);
      this.auth = firebase.auth();
      this.provider = new firebase.auth.GoogleAuthProvider();
      return true;
    }
    return true;
  }

  // Google ile Giriş
  async signInWithGoogle() {
    if (!this.isConfigured() || !this.auth) {
      throw new Error('Firebase henüz yapılandırılmadı. Ayarlardan Firebase yapılandırmasını ekleyebilirsin.');
    }
    try {
      const res = await this.auth.signInWithPopup(this.provider);
      return res.user;
    } catch (err) {
      throw new Error(err.message || 'Google girişi tamamlanamadı.');
    }
  }

  // E-posta & Şifre ile Kayıt
  async registerWithEmail(email, password, displayName) {
    if (!this.isConfigured() || !this.auth) {
      throw new Error('Firebase henüz aktif değil.');
    }
    const res = await this.auth.createUserWithEmailAndPassword(email, password);
    if (displayName && res.user) {
      await res.user.updateProfile({ displayName });
    }
    return res.user;
  }

  // E-posta & Şifre ile Giriş
  async signInWithEmail(email, password) {
    if (!this.isConfigured() || !this.auth) {
      throw new Error('Firebase henüz aktif değil.');
    }
    const res = await this.auth.signInWithEmailAndPassword(email, password);
    return res.user;
  }

  // Çıkış
  async logout() {
    if (this.auth) {
      await this.auth.signOut();
    }
    this.store.setAuth(null, true, 'guest');
  }

  // Misafir Modu ile Devam Et
  continueAsGuest(name = 'Öğrenci') {
    this.store.state.name = name;
    this.store.setAuth(null, true, 'guest');
    this.store.state.onboarded = true;
    this.store.save();
  }
}

const authService = new AuthService(store);
