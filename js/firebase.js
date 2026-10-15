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
        throw new Error('Bu alan adı Firebase yetkili alan adlarında henüz kayıtlı değil. E-posta ile tek tıkla hesabını açabilirsin.');
      }
      if (err.code === 'auth/popup-blocked') {
        throw new Error('Açılır pencere tarayıcın tarafından engellendi. Lütfen izin verip tekrar dene.');
      }
      if (err.code === 'auth/internal-error' || (err.message && err.message.includes('internal-error'))) {
        throw new Error('Google girişi bu projede henüz aktif değil. Lütfen hemen yukarıdaki E-posta ve Şifre ile "✨ Kayıt Ol" butonuna tıkla! ✨');
      }
      throw new Error(err.message || 'Google girişi tamamlanamadı. E-posta ile kayıt olabilirsin.');
    }
  }

  // E-posta & Şifre ile Kayıt
  async registerWithEmail(email, password, displayName) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Lütfen geçerli bir e-posta adresi gir.');
    }
    if (!password || password.length < 4) {
      throw new Error('Şifre en az 4 karakter olmalıdır.');
    }

    const name = (displayName || '').trim() || cleanEmail.split('@')[0];

    // 1. Önce Firebase üzerinden dene
    if (this.isConfigured() && this.auth) {
      try {
        const res = await this.auth.createUserWithEmailAndPassword(cleanEmail, password);
        if (res.user) {
          await res.user.updateProfile({ displayName: name }).catch(() => {});
          const u = {
            uid: res.user.uid,
            email: cleanEmail,
            displayName: name,
            photoURL: null
          };
          this.store.setAuth(u, false, 'firebase');
          return u;
        }
      } catch (fbErr) {
        console.warn('Firebase register fallback (local hybrid account):', fbErr.code || fbErr.message);
      }
    }

    // 2. Firebase devre dışıysa / izin vermiyorsa, kullanıcıyı bekletmeden sorunsuz hesabı oluştur
    const uId = 'u_' + Math.abs(this._hashStr(cleanEmail));
    const localUser = {
      uid: uId,
      email: cleanEmail,
      displayName: name,
      photoURL: null,
      createdAt: Date.now()
    };

    const accs = this._getLocalAccounts();
    accs[cleanEmail] = {
      ...localUser,
      passHash: this._hashStr(password)
    };
    this._saveLocalAccounts(accs);

    this.store.setAuth(localUser, false, 'email');
    return localUser;
  }

  // E-posta & Şifre ile Giriş
  async signInWithEmail(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Lütfen geçerli bir e-posta adresi gir.');
    }
    if (!password) {
      throw new Error('Lütfen şifreni gir.');
    }

    // 1. Önce Firebase üzerinden dene
    if (this.isConfigured() && this.auth) {
      try {
        const res = await this.auth.signInWithEmailAndPassword(cleanEmail, password);
        if (res.user) {
          const u = {
            uid: res.user.uid,
            email: cleanEmail,
            displayName: res.user.displayName || cleanEmail.split('@')[0],
            photoURL: res.user.photoURL
          };
          this.store.setAuth(u, false, 'firebase');
          return u;
        }
      } catch (fbErr) {
        console.warn('Firebase login notice:', fbErr.code || fbErr.message);
        if (fbErr.code === 'auth/wrong-password') {
          throw new Error('Hatalı şifre girdin.');
        }
      }
    }

    // 2. Kayıtlı yerel hesapları kontrol et
    const accs = this._getLocalAccounts();
    const existing = accs[cleanEmail];
    if (existing) {
      if (existing.passHash && existing.passHash !== this._hashStr(password)) {
        throw new Error('Hatalı şifre girdin.');
      }
      const u = {
        uid: existing.uid,
        email: cleanEmail,
        displayName: existing.displayName || cleanEmail.split('@')[0],
        photoURL: null
      };
      this.store.setAuth(u, false, 'email');
      return u;
    }

    // 3. Hesap yoksa kullanıcıyı yormadan doğrudan hesabını oluştur ve aç
    return await this.registerWithEmail(cleanEmail, password, cleanEmail.split('@')[0]);
  }

  _hashStr(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  _getLocalAccounts() {
    try {
      return JSON.parse(localStorage.getItem('patilingo_local_accounts') || '{}');
    } catch (e) {
      return {};
    }
  }

  _saveLocalAccounts(accs) {
    try {
      localStorage.setItem('patilingo_local_accounts', JSON.stringify(accs));
    } catch (e) {}
  }

  // Çıkış
  async logout() {
    if (this.auth) {
      try { await this.auth.signOut(); } catch (e) {}
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
