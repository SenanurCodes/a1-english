# Product Requirements Document (PRD)
## Project Name: PatiLingo (A1 English)
**Live Demo:** https://senanurcodes.github.io/a1-english/  
**Repository:** https://github.com/SenanurCodes/a1-english  
**Category:** Gamified Educational Web Application / EdTech  

---

## 1. Executive Summary
**PatiLingo** is an interactive, gamified English learning web platform specifically designed for Turkish speakers. Unlike generic language learning tools, PatiLingo addresses the cognitive linguistic gap between Turkish (SOV sentence structure, agglutinative suffix language) and English (SVO sentence structure, prepositional language) by focusing on **"Turkish Traps" (Türk Tuzakları)** and grammatical intuition.

---

## 2. Target Audience & User Personas
- **Primary Users:** Turkish speakers starting at the A1 (Beginner) CEFR level.
- **Pain Points:** Literal word-by-word translation errors (e.g., saying *"I am agree"* instead of *"I agree"*, or *"I have 20 years old"* instead of *"I am 20 years old"*), fear of speaking, and grammatical confusion due to inverse word order.
- **Platform:** Mobile-first responsive web app (PWA), accessible on both smartphone browsers (390px viewport) and desktop displays (1440px viewport).

---

## 3. Core Architecture & Tech Stack
- **Frontend:** Vanilla JavaScript (ES6+ modular architecture), CSS3 Custom Properties (Design System tokens), HTML5 Semantic Elements.
- **State Management:** Single source of truth reactive `AppStore` with `Proxy` fallback, versioned schema migrations (`schemaVersion`), and `localStorage` persistence (`a1english_v2`).
- **AI Integration:** Google Gemini API (`gemini-2.5-flash` / `gemini-2.0-flash`) for personalized proficiency analysis, mistake analysis, and exercise generation.
- **Database & Sync:** Firebase Realtime Database for friend rivalry leagues and cross-device profile sync, plus offline-first manual JSON export/import.
- **Offline / PWA:** Service Worker with versioned pre-caching (`v2.7.2`) and non-intrusive update banner.
- **Accessibility:** WCAG AA contrast ratio compliance (≥ 4.5:1), responsive layout, and `prefers-reduced-motion` animation suppression.

---

## 4. Key Functional Modules & Testable Flows

### 4.1. Onboarding & Unforced Guest Access
- **Behavior:** Visiting the site presents a welcoming onboarding screen with a mascot greeting.
- **Actions:** Users can click *"Hemen Başla"* (Start Immediately) or *"Misafir Olarak Hesapsız Dene"* (Try as Guest) without forced registration.
- **Pass Criteria:** User state initializes with `schemaVersion: 1`, `xp: 0`, and unlocks Unit 1 (`greetings`). Navigation is immediately interactive.

### 4.2. Learning Path & Adventure Map (Candy Crush Progression)
- **Map View (`#/learn`):** Displays sequential unit nodes divided into Vocab (`var(--cat-kelime)`) and Grammar (`var(--cat-gramer)`).
- **Unit Locking:** Unit $N+1$ unlocks only when Unit $N$ is passed with $\ge 70\%$ score.
- **Unit Modal:** Clicking a unit tile opens an accessible modal with statistics (Best score %, attempts, completion status), "Kelime Kartları" button, and "Derse Başla" button.
- **Pass Criteria:** Modal opens without style anomalies. Completing a lesson with $\ge 70\%$ awards XP, records streak, and unlocks the next unit tile.

### 4.3. Interactive Lesson Engine (`#/lesson/:id`)
- **Question Types:**
  1. *Multiple Choice:* Tap correct Turkish/English equivalent.
  2. *Word Reorder (Train cars):* Reorder English words into correct sentence order.
  3. *Listening & Pronunciation:* Web Speech API synthesis button to hear native pronunciation.
  4. *Type-in:* Spelling exercises.
- **Feedback & Scoring:** Immediate feedback banner (green for correct, red with explanation for incorrect). Score calculation and celebratory confetti on completion.

### 4.4. Language Logic & Sentence Locomotive (`#/logic`)
- **Visualizer:** Interactive "Cümle Lokomotifi" showing the fundamental difference between Turkish and English sentence order:
  - 🚂 1. Subject (`--role-subject`)
  - ⚡ 2. Verb (`--role-verb`)
  - 📦 3. Object (`--role-object`)
  - 👥 4. Accompaniment (`--role-with`)
  - 📍 5. Location (`--role-place`)
  - ⏰ 6. Time (`--role-time`)
- **Guides:** 4 categorized tabs: *Cümle Lokomotifi*, *Türk Tuzakları* (False friends), *Hayatta Kalma* (Survival phrases), *Nezaket & Kültür* (Politeness).
- **Pass Criteria:** Tab switching renders respective guides, audio buttons trigger voice pronunciation.

### 4.5. Spaced Repetition Flashcards (`#/cards` & `#/review`)
- **Flashcard Engine:** 3D flip card animation showing English word, pronunciation icon, example sentence, and Turkish translation.
- **Leitner 5-Box SRS:** Completed unit vocabulary is automatically synchronized to Leitner Box 1. Answering correctly moves card to Box $N+1$; answering incorrectly returns to Box 1. Mastered words require Box 3+.
- **Pass Criteria:** Cards flip smoothly, next/prev navigation works, box levels update accurately.

### 4.6. Mascots & 5 Curated Themes (`#/settings`)
- **5 Mascots:** Pamuk (Cat), Dost (Dog), Bilge (Owl), Bambu (Panda), Fındık (Squirrel). Mascot selection immediately reflects in navigation and speech balloons.
- **5 Themes:**
  1. *Nordic Sage:* Light, calming stone & sage green.
  2. *Cyber Indigo:* Dark, focus-enhancing neon & violet (Dark mode).
  3. *Midnight Emerald:* Dark, high-contrast black & emerald neon (Dark mode).
  4. *Sunset Warmth:* Light, warm coral & honey yellow.
  5. *Deep Ocean:* Light, crisp turquoise & ocean blue.
- **Pass Criteria:** Theme selection instantly updates root CSS variables (`data-theme`, `data-mode`), persists in `localStorage`, and prevents theme flash on reload.

### 4.7. Progress Dashboard (`#/progress`)
- **4 Metric Cards:**
  1. Günlük Seri (Daily Streak) - Amber gradient.
  2. Toplam XP (Total XP) - Gold gradient.
  3. Öğrenilen Kelime (Learned Words: Box 1+) & Ustalaşılan (Mastered: Box 3+) with info modal.
  4. A1 Müfredat Tamamlanma % with unit completion count.
- **7-Day Activity Chart:** Dynamic bar chart of XP earned per day.

---

## 5. Non-Functional & Quality Standards
- **Zero Console Errors:** 0 unhandled promise rejections or syntax exceptions during navigation.
- **Performance:** 100% client-side execution, sub-second route transitions.
- **Resilience:** Graceful error handling for missing network connections and missing API keys.
- **Data Integrity:** Fully validated import/export mechanism; schema migrations preserve 100% of existing user XP, streaks, and unit progress.
