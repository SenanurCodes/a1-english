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
      if (err.code === 'auth/popup-closed-by-user') {
        return null;
      }
      if (err.code === 'auth/unauthorized-domain') {
        throw new Error('senanurcodes.github.io henüz Firebase Yetkili Alan Adı (Authorized Domain) olarak eklenmemiş.');
      }
      if (err.code === 'auth/popup-blocked') {
        throw new Error('Açılır pencere tarayıcın tarafından engellendi. Lütfen açılır pencerelere izin ver.');
      }
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/internal-error' || (err.message && err.message.includes('internal-error'))) {
        throw new Error('Firebase Konsolunda Google ile giriş henüz etkinleştirilmemiş.');
      }
      throw new Error(err.message || 'Google girişi tamamlanamadı.');
    }
  }

  // E-posta & Şifre ile Kayıt
  async registerWithEmail(email, password, displayName) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Lütfen geçerli bir e-posta adresi gir.');
    }
    if (!password || password.length < 6) {
      throw new Error('Şifre en az 6 karakter olmalıdır.');
    }

    const name = (displayName || '').trim() || cleanEmail.split('@')[0];

    // 1. Firebase yapılandırılmışsa doğrudan Firebase ile kaydet
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
        // Firebase doğrulama ve hesap hatalarını kullanıcıya açıkça ilet
        if (fbErr.code === 'auth/email-already-in-use') {
          throw new Error('Bu e-posta adresi zaten kayıtlı. Lütfen giriş yap.');
        }
        if (fbErr.code === 'auth/weak-password') {
          throw new Error('Şifreniz çok zayıf. Lütfen en az 6 karakterli bir şifre seçin.');
        }
        if (fbErr.code === 'auth/invalid-email') {
          throw new Error('Geçersiz bir e-posta adresi girdin.');
        }
        if (fbErr.code === 'auth/operation-not-allowed' || fbErr.code === 'auth/unauthorized-domain') {
          console.warn('Firebase auth sağlayıcısı henüz aktif değil, yerel çevrimdışı hesaba geçiliyor:', fbErr.message);
        } else if (fbErr.code !== 'auth/network-request-failed') {
          throw new Error(fbErr.message || 'Kayıt işlemi tamamlanamadı.');
        }
        console.warn('Firebase ağ/sağlayıcı durumu (çevrimdışı yerel hesaba geçiliyor):', fbErr.message);
      }
    }

    // 2. Yalnızca ağ erişimi yokken yerel çevrimdışı hesap aç
    const uId = 'u_' + Math.abs(this._legacyHashStr(cleanEmail + '_' + Date.now()));
    const localUser = {
      uid: uId,
      email: cleanEmail,
      displayName: name,
      photoURL: null,
      createdAt: Date.now()
    };

    const salt = this._generateSalt();
    const passHash = await this._hashPassword(password, salt);

    const accs = this._getLocalAccounts();
    accs[cleanEmail] = {
      ...localUser,
      salt,
      passHash
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

    // 1. Firebase üzerinden giriş yap
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
        if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential') {
          throw new Error('E-posta veya şifre hatalı.');
        }
        if (fbErr.code === 'auth/user-not-found') {
          // Firebase'de hesap yoksa yerel hesap listesine bak
          const accs = this._getLocalAccounts();
          if (!accs[cleanEmail]) {
            throw new Error('Bu e-posta adresine ait bir hesap bulunamadı. Lütfen önce kayıt ol.');
          }
        } else if (fbErr.code === 'auth/invalid-email') {
          throw new Error('Geçersiz bir e-posta adresi girdin.');
        } else if (fbErr.code === 'auth/user-disabled') {
          throw new Error('Bu kullanıcı hesabı devre dışı bırakılmış.');
        } else if (fbErr.code === 'auth/operation-not-allowed' || fbErr.code === 'auth/unauthorized-domain') {
          console.warn('Firebase auth sağlayıcısı henüz aktif değil veya yetkisiz alan adı, yerel hesap kontrol ediliyor:', fbErr.message);
        } else if (fbErr.code !== 'auth/network-request-failed') {
          throw new Error(fbErr.message || 'Giriş yapılamadı.');
        }
        console.warn('Firebase giriş kontrolü:', fbErr.code || fbErr.message);
      }
    }

    // 2. Çevrimdışı veya yerel hesap listesinde varsa şifreyi kontrol et
    const accs = this._getLocalAccounts();
    const existing = accs[cleanEmail];
    if (!existing) {
      throw new Error('Bu e-posta adresine ait bir hesap bulunamadı. Lütfen önce kayıt ol.');
    }

    let isPasswordCorrect = false;
    let needsMigration = false;

    if (existing.salt && existing.passHash) {
      // Modern SHA-256 + salt formatı
      const computedHash = await this._hashPassword(password, existing.salt);
      if (computedHash === existing.passHash) {
        isPasswordCorrect = true;
      }
    } else if (existing.passHash !== undefined) {
      // Eski (legacy) 32-bit hash kontrolü
      const legacy = this._legacyHashStr(password);
      if (existing.passHash === legacy || String(existing.passHash) === String(legacy)) {
        isPasswordCorrect = true;
        needsMigration = true;
      }
    }

    if (!isPasswordCorrect) {
      throw new Error('E-posta veya şifre hatalı.');
    }

    // Eski formattan yeni SHA-256 + salt formatına otomatik geçiş
    if (needsMigration) {
      const newSalt = this._generateSalt();
      existing.salt = newSalt;
      existing.passHash = await this._hashPassword(password, newSalt);
      this._saveLocalAccounts(accs);
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

  _generateSalt() {
    const arr = new Uint8Array(16);
    const cryptoObj = (typeof window !== 'undefined' && window.crypto) || (typeof crypto !== 'undefined' ? crypto : null);
    if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
      cryptoObj.getRandomValues(arr);
    } else {
      for (let i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async _hashPassword(password, salt) {
    const cryptoObj = (typeof window !== 'undefined' && window.crypto && window.crypto.subtle)
      ? window.crypto
      : ((typeof crypto !== 'undefined' && crypto.subtle) ? crypto : null);
    if (cryptoObj && cryptoObj.subtle && typeof cryptoObj.subtle.digest === 'function') {
      const enc = new TextEncoder();
      const data = enc.encode(salt + ':' + password);
      const digest = await cryptoObj.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return 'legacy_' + this._legacyHashStr(salt + ':' + password);
  }

  _legacyHashStr(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  _hashStr(str) {
    return this._legacyHashStr(str);
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
