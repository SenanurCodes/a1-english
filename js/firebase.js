/* ============================================================
   A1 English v2.0 - Firebase Entegrasyonu
   AuthService (Google & E-posta Girişi, Misafir Modu)
   CloudDatabaseService (Firebase Realtime Database Düello Motoru)
   ============================================================ */

const FIREBASE_CONFIG_KEY = 'a1_firebase_config';

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCsK3eNAey8glF4N04Ey-rf76BTEf95_OM",
  authDomain: "a1-english-91fff.firebaseapp.com",
  projectId: "a1-english-91fff",
  storageBucket: "a1-english-91fff.firebasestorage.app",
  messagingSenderId: "808229244489",
  appId: "1:808229244489:web:c0cefe8fb7cf9bd88cf998",
  measurementId: "G-66B2H7SHQL",
  databaseURL: "https://a1-english-91fff-default-rtdb.firebaseio.com"
};

class AuthService {
  constructor(appStore) {
    this.store = appStore;
    this.auth = null;
    this.provider = null;
    this._init();
  }

  _init() {
    try {
      let config = DEFAULT_FIREBASE_CONFIG;
      const savedConfig = localStorage.getItem(FIREBASE_CONFIG_KEY);
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          if (parsed && parsed.apiKey && parsed.projectId) {
            config = parsed;
          } else {
            localStorage.removeItem(FIREBASE_CONFIG_KEY);
          }
        } catch (e) {
          localStorage.removeItem(FIREBASE_CONFIG_KEY);
        }
      }

      if (window.firebase) {
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }
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
    if (!window.firebase) return false;
    if (!firebase.apps.length) {
      this._init();
    }
    return !!(firebase.apps && firebase.apps.length);
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
      this._init();
    }
    if (!this.auth) {
      throw new Error('Firebase bağlantısı kurulamadı. İnternet bağlantını kontrol edip sayfayı yenile.');
    }
    try {
      const res = await this.auth.signInWithPopup(this.provider);
      return res.user;
    } catch (err) {
      if (err.code === 'auth/unauthorized-domain') {
        throw new Error('Bu alan adı Firebase yetkili alan adlarında henüz kayıtlı değil. Giriş yapmadan Misafir Modu ile devam edebilirsin.');
      }
      if (err.code === 'auth/popup-blocked') {
        throw new Error('Açılır pencere tarayıcın tarafından engellendi. Lütfen izin verip tekrar dene.');
      }
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
