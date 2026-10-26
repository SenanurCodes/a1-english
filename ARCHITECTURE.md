# 🏗️ PatiLingo Clean Architecture & ES6 Modüler Mimari Rehberi (`v2.9.32`)

Bu doküman, **PatiLingo (`a1-english`)** projesinin **Clean Architecture**, **ES6 Modules**, **Component-Based Architecture**, **Event-Driven Architecture (EventBus)** ve **Dependency Injection (ServiceContainer)** prensiplerine göre modernize edilmiş mimarisini ve geriye dönük uyumluluk (Migration Layer) yapısını açıklar.

---

## 📂 1. Klasör Yapısı (Folder Structure)

```text
js/
├── core/                         # Çekirdek Altyapı (ES6 Modules)
│   ├── index.js                  # Mimari Bootstrap & DI Kayıt Noktası
│   ├── config.js                 # Merkezi Konfigürasyon Yönetimi
│   ├── events.js                 # EventBus (on, once, off, emit)
│   ├── container.js              # Dependency Injection ServiceContainer
│   ├── store.js                  # Reaktif AppStore (EventBus & Repository entegreli)
│   ├── router.js                 # Middleware & Lifecycle destekli Router
│   ├── error-handler.js          # Merkezi ErrorHandler & Sınıflandırma
│   ├── middleware.js             # compose, logging, validation, auth, analytics
│   └── plugin-system.js          # PluginSystem (init, destroy, executeHook)
├── domain/                       # Domain Katmanı (İş Kuralları & Varlıklar)
│   ├── entities/
│   │   ├── lesson.js             # Lesson Entity (canUnlock, isPassed, completionPercentage)
│   │   ├── user.js               # User Entity (addXP, upgradeToPro)
│   │   └── word.js               # Word Entity (Leitner SRS recordAttempt)
│   └── value-objects/
│       └── xp-score.js           # Immutable XPScore Value Object
├── application/                  # Application Katmanı (Use Cases)
│   └── use-cases/
│       ├── start-lesson.js       # StartLessonUseCase
│       └── complete-lesson.js    # CompleteLessonUseCase
├── infrastructure/               # Infrastructure Katmanı (Veri & Dış API)
│   ├── repositories/
│   │   ├── storage-repository.js # localStorage / Bellek soyutlaması
│   │   ├── user-repository.js    # Kullanıcı CRUD işlemleri
│   │   ├── lesson-repository.js  # Müfredat ünite sorguları
│   │   └── progress-repository.js# Ünite ve kelime ilerleme kayıtları
│   └── api/
│       └── gemini-client.js      # Google Gemini API HTTP istemcisi
├── services/                     # Uygulama Servisleri
│   ├── ai.js                     # AIService (Günlük 15 mesaj kotası + Gemini)
│   ├── auth.js                   # AuthService (Misafir & Kullanıcı oturumu)
│   ├── storage.js                # StorageService (JSON yedekleme / geri yükleme)
│   └── analytics.js              # AnalyticsService & varsayılan analyticsPlugin
├── components/                   # Presentation Katmanı (Component-Based UI)
│   ├── base-component.js         # BaseComponent (mount, update, unmount, listen)
│   ├── nav/                      # Üst/Alt Navigasyon Bileşeni (nav.js, nav.css, index.js)
│   ├── home/                     # Ana Ekran Bileşenleri (hero.js, dashboard.js, index.js)
│   ├── lesson/                   # Ders & Soru Bileşenleri (question.js, feedback.js, index.js)
│   ├── ai/                       # AI Öğretmen Ekran Bileşeni
│   ├── progress/                 # İlerleme Panosu Bileşeni
│   └── settings/                 # Ayarlar Ekran Bileşeni
└── utils/                        # Saf Yardımcı Fonksiyonlar (ES6)
    ├── dom.js                    # qs, qsa, createElement, debounce
    ├── format.js                 # esc (XSS Koruması), formatXP, todayISO
    └── validation.js             # isNonNegativeNumber, sanitizePositiveInt, validateUserPayload
```

---

## 🔄 2. Katmanlı Mimari (Layered Architecture)

```text
┌──────────────────────────────────────────────────────────┐
│                   Presentation Layer                     │
│   (js/components/* - BaseComponent, Nav, Home, Lesson)   │
└────────────────────────────┬─────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│ (js/application/use-cases/*, js/core/router.js, Services)│
└────────────────────────────┬─────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────┐
│                     Domain Layer                         │
│     (js/domain/entities/* - Lesson, User, Word, SRS)     │
└────────────────────────────┬─────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                     │
│  (js/infrastructure/repositories/*, api/gemini-client)   │
└──────────────────────────────────────────────────────────┘
```

---

## 🧪 3. Test Komutları (72/72 Otomatik Test)

Projede 3 ayrı test paketi yer alır ve tamamı Node.js + JSDOM üzerinde çalışır:

```bash
# 1. Temel Entegrasyon Testleri (11/11)
npm test

# 2. Kapsamlı 11 Aşamalı Analiz Testleri (51/51)
npm run test:comprehensive

# 3. Clean Architecture & ES6 Modül Testleri (10/10)
npm run test:architecture

# Tüm 72 testi tek komutla çalıştır:
npm run test:all
```

---

## ⚡ 4. Vite Build & Geliştirme

- **Geliştirme Sunucusu:** `npm run dev`
- **Production Build (Tree-Shaking & Code Splitting):** `npm run build` (`vite.config.js` üzerinden `domain`, `components` ve `core` chunk'larını ayırır)
- **Geriye Dönük Uyumluluk (Migration Layer):** Hem doğrudan statik sunucularda (GitHub Pages / PWABuilder TWA) hem de Vite bundler ile sıfır kırılma ile çalışır. `window.PatiLingoArch` üzerinden tüm modüler servisler (`eventBus`, `container`, `errorHandler`, `pluginSystem`, `router`) çalışma zamanında erişilebilir durumdadır.
