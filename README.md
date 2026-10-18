# 🐾 PatiLingo — Interactive A1–A2 English Learning PWA

[![PatiLingo CI & Automated Verification](https://github.com/SenanurCodes/a1-english/actions/workflows/ci.yml/badge.svg)](https://github.com/SenanurCodes/a1-english/actions/workflows/ci.yml)

**Live Application URL:** [https://senanurcodes.github.io/a1-english](https://senanurcodes.github.io/a1-english)  
**Repository:** [https://github.com/SenanurCodes/a1-english](https://github.com/SenanurCodes/a1-english)

---

## 🌍 Overview (English)

**PatiLingo** is a client-side Progressive Web App (PWA) designed to help Turkish speakers learn CEFR **A1 and A2 English** through structured grammar logic, spaced repetition (SRS), interactive exercises, and an optional Google Gemini AI tutor.

### ✨ Key Features
- **52 Structured Units (27 A1 + 25 A2):** Step-by-step course map with vocabulary decks, grammar explanations, interactive exercises (multiple-choice, word ordering, listening, speaking, matching), and level-unlock Boss Exams (`buildA1BossTest`, `buildA2BossTest`).
- **Language Logic Simulator (`Dil Mantığı`):** Interactive "Sentence Locomotive" and category-specific simulators (`mindset`, `culture`, `traps`, `survival`) that visually map Turkish agglutinative suffixes to English SVO word order across multiple interactive examples.
- **Smart Spaced Repetition (`Akıllı Tekrar` - SRS):** Box-based memory retention system (Boxes 1–5) that schedules vocabulary reviews based on learner performance, plus an on-demand practice review session when no scheduled words are currently due.
- **AI Teacher & Personal Tutor (`AI Öğretmen`):** Optional Google Gemini integration (`gemini-2.5-flash` / `gemini-2.0-flash`) offering personalized level analysis, custom 10-question practice generation, and voice/text conversation practice with **Sunny**.
- **Cross-Device Sync & Live Leagues:** Firebase Auth / Realtime Database integration with offline-resilient local fallback and shareable sync codes.
- **Customizable Companions & Themes:** 4 interactive animal companions (`Pati`, ` Leo`, `Bambi`, `Maviş`) and 6 color palettes (including dark mode).

---

## 🧪 What Our Test Suite Covers (TestSprite E2E + Automated CI)

Our verification pipeline combines **TestSprite 3.0 E2E browser testing** against the live deployment with a **33-test automated Node/CI suite** ([`tests/run-tests.js`](tests/run-tests.js)) executed on every push and Pull Request via [GitHub Actions](.github/workflows/ci.yml).

| Test Area | Covered User Flows & Assertions |
| :--- | :--- |
| **1. Home Dashboard & Navigation** | • Rendering Daily Goal (`50 XP`), Streak, and Next Lesson (`#/lesson/u1`) CTAs<br>• Top-level Course Progress Summary card (`Genel Kurs Tamamlama Özeti`)<br>• Direct dashboard shortcuts to **Smart Review (`#/review`)** and **AI Teacher Setup (`#/ai`)**<br>• Desktop sidebar & mobile bottom-bar / sheet navigation across all routes |
| **2. Language Logic Simulator (`#/logic`)** | • Switching between Simulator examples (`Örnek 1`, `Örnek 2`, `Örnek 3`) with immediate DOM & token-mapping re-render<br>• Category filtering (`Tümü`, `Düşünce Yapısı`, `Nezaket & Kültür`, `Klasik Tuzaklar`, `Hayatta Kalma`)<br>• Interactive wagon/token selection and Web Speech TTS playback |
| **3. Smart Review / Spaced Repetition (`#/review`)** | • Accurate SRS box progression (`recordWord`, `syncUnitWordsToBox1`, `dueWords`)<br>• Honest empty-state rendering when `0` scheduled words are due, with a direct **Practice Review Session** launcher (`#startReviewBtn`)<br>• Configurable daily review word limit (`reviewLimit`) |
| **4. Course Map, Units & Flashcards (`#/learn`, `#/cards`)** | • 52-unit curriculum integrity (27 A1 + 25 A2 units) and `>= 70%` unlock progression<br>• **Chapter Progression (`#chapterProgressionCard`)** rendered on both unlocked and locked grammar/vocabulary unit pages<br>• Interactive 3D flip flashcards, shuffle, audio pronunciation, and A1/A2 level filtering |
| **5. AI Teacher & Gemini API (`#/ai`, `#/settings`)** | • Setup instructions, API key & model configuration (`#keyIn`, `#setupModelIn`), and `localStorage` persistence across reloads<br>• Updating an existing masked API key (`#changeKeyToggleBtn`, `#newKeyIn`, `#updateKeyBtn`)<br>• Live connection verification (`aiTest()`) and error handling (`NO_KEY`, `BAD_KEY`, `RATE_LIMIT`) |
| **6. State Migration, Sync & Code Purity** | • Schema migration (`v0 -> v1`), JSON export/import, and cross-device sync code merging<br>• **Production Code Purity Guard:** Static analysis test ensuring zero test-environment detection (`navigator.webdriver`) or hardcoded fake keys exist in `js/*.js` |

### Running Tests Locally

```bash
# 1. Check JavaScript syntax across all modules
node --check js/app.js

# 2. Run the 33-test automated verification suite
node tests/run-tests.js
```

---

## 🇹🇷 Türkçe Proje Özeti

**PatiLingo**, A1 ve A2 seviyesindeki İngilizce konularını görsel cümle mantığı simülatörü, aralıklı tekrar (Spaced Repetition) sistemi, sesli telaffuz ve yapay zeka öğretmen desteğiyle sunan açık kaynaklı bir web uygulamasıdır (PWA).

- **Canlı Uygulama:** [https://senanurcodes.github.io/a1-english](https://senanurcodes.github.io/a1-english)
- **Teknoloji Yığını:** Saf HTML5, CSS3, Vanilla JavaScript (ES6+), Web Speech API, Firebase (Auth & Realtime DB), Google Gemini API (`v1beta`), Service Worker (Offline PWA).
- **Gizlilik:** Kullanıcı ilerlemesi ve isteğe bağlı Gemini API anahtarı doğrudan kullanıcının kendi tarayıcısında (`localStorage`) saklanır; kaynak kodda hiçbir gizli anahtar (secret) bulunmaz.
