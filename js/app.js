/* ============================================================
   Uygulama: yönlendirme (router) ve ekranlar
   ============================================================ */
const view = () => $('#view');
let pendingAILesson = null;

const NAV_DESKTOP = [
  ['home', icon('home'), 'Ana Sayfa'],
  ['learn', icon('map'), 'Öğren'],
  ['logic', icon('lightbulb'), 'Dil Mantığı'],
  ['leaderboard', icon('trophy'), 'Rekabet'],
  ['review', icon('repeat'), 'Tekrar'],
  ['cards', icon('cards'), 'Kartlar'],
  ['ai', icon('bot'), 'AI Öğretmen'],
  ['progress', icon('chart'), 'İlerleme'],
  ['settings', icon('settings'), 'Ayarlar']
];

const NAV_MOBILE = [
  ['home', icon('home'), 'Ana Sayfa'],
  ['learn', icon('map'), 'Öğren'],
  ['logic', icon('lightbulb'), 'Mantık'],
  ['cards', icon('cards'), 'Kartlar'],
  ['more', icon('more'), 'Menü']
];

const MORE_LINKS = [
  { id: 'leaderboard', icon: icon('trophy'), title: 'Rekabet & Liderlik', desc: 'Arkadaşlarınla yarış ve skorunu paylaş' },
  { id: 'ai', icon: icon('bot'), title: 'AI Öğretmen', desc: 'Google Gemini ile seviye analizi ve pratik' },
  { id: 'review', icon: icon('repeat'), title: 'Akıllı Tekrar', desc: 'Aralıklı tekrar sistemi ve hata havuzu' },
  { id: 'progress', icon: icon('chart'), title: 'İlerleme Grafiği', desc: 'Haftalık XP ve ünite başarı tablosu' },
  { id: 'settings', icon: icon('settings'), title: 'Ayarlar', desc: 'Profil, ses hızı ve Gemini API anahtarı' }
];

function closeMenuSheet() {
  const root = $('#sheet-root');
  if (root) root.innerHTML = '';
}

function openMenuSheet(active) {
  const root = $('#sheet-root');
  if (!root) return;
  root.innerHTML = `
    <div class="menu-sheet-overlay" id="menuOverlay">
      <div class="menu-sheet">
        <div class="menu-sheet-head">
          <div class="msh-title">
            <span class="msh-icon">${icon('sparkles', '', 22)}</span>
            <b>Diğer Bölümler</b>
          </div>
          <button class="icon-btn close-sheet-btn" id="closeMenuBtn" aria-label="Kapat">${icon('x', '', 18)}</button>
        </div>
        <div class="menu-sheet-grid">
          ${MORE_LINKS.map(item => `
            <a href="#/${item.id}" class="menu-item ${active === item.id ? 'active' : ''}">
              <span class="menu-icon">${item.icon}</span>
              <div class="menu-info">
                <b>${esc(item.title)}</b>
                <p class="muted small">${esc(item.desc)}</p>
              </div>
              <span class="menu-arr">${icon('chevronRight', '', 18)}</span>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  $('#closeMenuBtn').onclick = closeMenuSheet;
  $('#menuOverlay').onclick = e => {
    if (e.target.id === 'menuOverlay') closeMenuSheet();
  };
  $$('.menu-item', root).forEach(a => {
    a.onclick = () => closeMenuSheet();
  });
}

function renderNav(active) {
  const curMascot = mascotService.getActive();
  const isGuest = state.auth ? state.auth.isGuest : true;

  // Mobil üst başlık (Header)
  const mHeader = $('#mobile-header');
  if (mHeader) {
    mHeader.innerHTML = `
      <a href="#/home" class="mh-brand" aria-label="PatiLingo Ana Sayfa">
        <img src="icons/icon-192.png" alt="PatiLingo" style="width:28px;height:28px;border-radius:6px;vertical-align:middle;object-fit:contain;" />
        <span class="mh-title">PatiLingo</span>
      </a>
      <div class="mh-stats">
        <a href="#/progress" class="mh-badge streak" title="Çalışma Ritmi">🌿 ${currentStreak()}</a>
        <a href="#/progress" class="mh-badge xp" title="Toplam Palamut (XP)">🌰 ${state.xp}</a>
        <button type="button" class="mh-btn" id="mobileAuthBtn" title="Hesap & Eşitleme" style="background:none;border:none;cursor:pointer;font-size:1.1rem;padding:0 4px;">${isGuest ? icon('user', '', 20) : '🟢'}</button>
        <a href="#/settings" class="mh-btn" title="Ayarlar" aria-label="Ayarlar">${icon('settings', '', 20)}</a>
      </div>
    `;
  }

  // Kenar çubuğu / Alt bar (Sidebar)
  const isMoreActive = MORE_LINKS.some(x => x.id === active);
  
  $('#nav').innerHTML = `
    <!-- Masaüstü Sidebar -->
    <div class="desktop-nav">
      <div class="logo">
        <img src="icons/icon-192.png" alt="PatiLingo" style="width:38px;height:38px;border-radius:8px;object-fit:contain;" />
        <div>
          <div class="logo-text">PatiLingo</div>
          <div class="logo-sub muted small">${curMascot.icon} ${esc(curMascot.name)}</div>
        </div>
      </div>
      <div class="nav-links">
        ${NAV_DESKTOP.map(([id, iconHtml, label]) => `
          <a href="#/${id}" class="nav-link ${active === id ? 'active' : ''}">
            <span class="nav-icon">${iconHtml}</span>
            <span class="nav-label">${label}</span>
          </a>
        `).join('')}
      </div>
      <div class="nav-foot" style="flex-direction:column;gap:8px;padding:8px 6px;">
        <div style="display:flex;gap:6px;width:100%;">
          <div class="mini-stat" style="flex:1;" title="Sakin Çalışma Ritmi">🌿 ${currentStreak()} gün</div>
          <div class="mini-stat" style="flex:1;" title="Toplanan Palamut (XP)">🌰 ${state.xp} XP</div>
        </div>
        ${isGuest 
          ? `<button class="btn btn-secondary sm" id="navAuthBtn" style="width:100%;font-size:0.82rem;padding:7px 10px;">${icon('user', '', 16)} Giriş Yap / Eşitle</button>`
          : `<button class="btn btn-secondary sm" id="navAuthBtn" style="width:100%;font-size:0.82rem;padding:7px 10px;display:flex;align-items:center;justify-content:center;gap:6px;">
               <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;"></span>
               <span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700;">${esc(state.auth?.user?.displayName || state.name)}</span>
             </button>`
        }
      </div>
    </div>

    <!-- Mobil Alt Menü Barı (5 ferah sekme) -->
    <div class="mobile-nav">
      ${NAV_MOBILE.map(([id, icon, label]) => {
        if (id === 'more') {
          return `
            <button type="button" class="nav-link ${isMoreActive ? 'active' : ''}" id="moreNavBtn" aria-label="Daha fazla menüsü">
              <span class="nav-icon">${icon}</span>
              <span class="nav-label">${label}</span>
            </button>
          `;
        }
        return `
          <a href="#/${id}" class="nav-link ${active === id ? 'active' : ''}">
            <span class="nav-icon">${icon}</span>
            <span class="nav-label">${label}</span>
          </a>
        `;
      }).join('')}
    </div>
  `;

  if ($('#navAuthBtn')) {
    $('#navAuthBtn').onclick = () => openAuthModal();
  }
  if ($('#mobileAuthBtn')) {
    $('#mobileAuthBtn').onclick = () => openAuthModal();
  }

  const moreBtn = $('#moreNavBtn');
  if (moreBtn) {
    moreBtn.onclick = (e) => {
      e.preventDefault();
      if ($('#menuOverlay')) {
        closeMenuSheet();
      } else {
        openMenuSheet(active);
      }
    };
  }
}

function router() {
  lessonKeyHandler = null;
  document.body.classList.remove('focus-mode');
  closeModal();
  closeMenuSheet();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (typeof themeService !== 'undefined') themeService.init();

  // URL'de Canlı Lig davet kodu (?room=... veya #/leaderboard?room=...) var mı?
  const searchStr = location.search || (location.hash.includes('?') ? '?' + location.hash.split('?')[1] : '');
  let roomParam = null;
  if (searchStr) {
    const urlParams = new URLSearchParams(searchStr);
    roomParam = urlParams.get('room') || urlParams.get('league');
  }

  const [rawRoute, param] = location.hash.replace(/^#\/?/, '').split('/');
  const route = rawRoute ? rawRoute.split('?')[0] : '';

  if (!state.onboarded && (!route || route === 'onboarding')) {
    if (roomParam) state.pendingLeagueRoom = roomParam;
    return screenOnboarding();
  }

  if (roomParam && roomParam !== state.leagueRoomId) {
    joinCloudLeague(roomParam).then(() => {
      toast('🎉 Arkadaşının Canlı Ligine katıldın!');
      history.replaceState(null, '', location.pathname + '#/leaderboard');
      router();
    }).catch(err => {
      toast('Lig hatası: ' + err.message);
    });
    return;
  }

  window.currentActiveLessonQuestion = null;
  const r = route || 'home';
  renderNav(r === 'grammar' ? 'learn' : r);
  window.scrollTo(0, 0);
  const screens = {
    home: screenHome, learn: screenLearn, logic: screenLogic, leaderboard: screenLeaderboard, review: screenReview, cards: screenCards, ai: screenAI,
    progress: screenProgress, settings: screenSettings, grammar: screenGrammar, lesson: screenLesson,
    placement: screenPlacement, 'ai-lesson': screenAILesson, 'boss-a1': screenA1Boss, 'boss-a2': screenA2Boss,
    auth: () => { screenHome(); openAuthModal(); }
  };
  (screens[r] || screenHome)(param);
  initShimejiCompanion();
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

/* ---------- Modal ---------- */
function openModal(html) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-bg"><div class="modal">${html}</div></div>`;
  root.querySelector('.modal-bg').onclick = e => { if (e.target.classList.contains('modal-bg')) closeModal(); };
}
function closeModal() { $('#modal-root').innerHTML = ''; }

/* ============================================================
   Karşılama & Kişiselleştirme (Onboarding v2.0)
   ============================================================ */
function screenOnboarding() {
  document.body.classList.remove('focus-mode');
  renderNav('');
  let selectedMascot = state.mascot || 'squirrel';
  let selectedTheme = state.theme || 'nordic';

  view().innerHTML = `
    <div class="onboard" style="width:100%;max-width:640px;margin:0 auto;padding-bottom:32px;">
      <!-- Landing Hero & Start Action CTA -->
      <div class="landing-hero" id="landingHeroSection" style="text-align:center;padding:12px 16px 20px;">
        <div class="onboard-hero">${(MASCOT_BY_ID && MASCOT_BY_ID[selectedMascot]) ? MASCOT_BY_ID[selectedMascot].icon : '🐿️'}</div>
      <h1 class="rainbow-text">PatiLingo</h1>
      <p class="lead">Sana özel yoldaşın ve renklerinle İngilizce öğrenmeye başla! 🎈</p>
        <div id="landingCtaRow" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:14px 0;">
          <button class="btn btn-big btn-primary hero-action-btn" id="landingHeroStartBtn" style="min-width:220px;font-size:1.15rem;box-shadow:0 6px 0 var(--primary-d);">
            🚀 Öğrenmeye Başla
          </button>
          <a class="btn btn-big btn-ghost" id="landingPlacementBtn" href="#/placement">📝 Seviye Testi</a>
        </div>
      </div>
      
      <div class="card onboard-card" id="onboardSetupCard" style="width:100%;max-width:640px;box-sizing:border-box;">
        <label class="lbl">Sana nasıl hitap edelim?</label>
        <input id="nameIn" class="text-input" placeholder="Adını veya takma adını yaz..." maxlength="24" value="${state.name !== 'Öğrenci' ? esc(state.name) : ''}" />

        <label class="lbl" style="margin-top:16px;">🐾 Öğrenme Yoldaşını Seç</label>
        <div class="mascot-grid">
          ${MASCOTS.map(m => `
            <div class="mascot-card ${m.id === selectedMascot ? 'active' : ''}" data-m="${m.id}">
              <div class="mascot-icon">${m.icon}</div>
              <div class="mascot-name">${esc(m.name)}</div>
              <div class="mascot-animal">${esc(m.animal)}</div>
              <div class="mascot-motto">${esc(m.motto)}</div>
            </div>
          `).join('')}
        </div>

        <label class="lbl" style="margin-top:16px;">🎨 Renk Paletini Seç</label>
        <div class="theme-grid">
          ${PALETTES.map(p => `
            <div class="theme-card ${p.id === selectedTheme ? 'active' : ''}" data-t="${p.id}">
              <div class="theme-head">
                <span class="theme-name">${esc(p.name)}</span>
                <div class="theme-dots">
                  <span style="background:${p.colors.primary}"></span>
                  <span style="background:${p.colors.accent}"></span>
                  <span style="background:${p.colors.bg}"></span>
                </div>
              </div>
              <div class="theme-desc">${esc(p.desc)}</div>
            </div>
          `).join('')}
        </div>

        <div class="onboard-actions" style="margin-top:18px;">
          <button class="btn btn-big btn-primary" id="zeroBtn">🌱 Hemen Başla</button>
          <button class="btn btn-big btn-ghost" id="placeBtn">📝 Seviye Testiyle Başla</button>
        </div>

        <div style="margin-top:14px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-ghost sm" id="onboardAuthBtn">🚀 Google ile Giriş Yap</button>
          <button class="btn btn-ghost sm" id="onboardGuestBtn">👤 Misafir Olarak Hesapsız Dene</button>
          <a class="btn btn-ghost sm" href="#/progress" id="onboardGuestProgressBtn" aria-label="Giriş Yapmadan Kurs İlerlemesini Gör">📊 Kurs İlerlemesi (Girişsiz)</a>
        </div>

        <div class="onboard-nav-links" style="margin-top:18px;padding-top:14px;border-top:1px dashed var(--border);display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <a class="btn btn-ghost sm" href="#/progress" aria-label="Kurs İlerlemesi ve Başarı Kartı">📊 Kurs İlerlemesi</a>
          <a class="btn btn-ghost sm" href="#/review" id="onboardReviewShortcutBtn" aria-label="Akıllı Tekrar (Spaced Repetition) Sayfası">🔁 Akıllı Tekrar</a>
          <a class="btn btn-ghost sm" href="#/ai" id="onboardAiShortcutBtn" aria-label="AI Öğretmen Kurulumu ve Gemini API Ayarları">🤖 AI Öğretmen Kurulumu</a>
          <a class="btn btn-ghost sm" href="#/cards" aria-label="Kelime Kartları ve Konu Kütüphanesi">🃏 Kelime Kartları</a>
          <a class="btn btn-ghost sm" href="#/logic" aria-label="Cümle Lokomotifi Simülatörü">🚂 Cümle Lokomotifi</a>
          <a class="btn btn-ghost sm" href="#/lesson/u1" id="onboardLessonShortcutBtn" aria-label="A1 Dersine Başla">📖 A1 Dersine Başla</a>
        </div>
      </div>

      <!-- Günlük Hedef & Sonraki Ders Kartı -->
      <div class="card onboard-daily-preview" style="margin-top:20px;width:100%;max-width:640px;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span class="badge" style="font-weight:700;">🎯 Günlük Hedef</span>
          <span class="muted small"><b>Günlük hedef:</b> <b>0 / 50 XP</b> (%0)</span>
        </div>
        <div class="progress thick" style="margin-bottom:12px;"><div class="bar rainbow" style="width:20%;"></div></div>
        
        <div class="next-lesson-box" style="padding-top:10px;border-top:1px dashed var(--border);">
          <div class="muted small" style="font-weight:700;margin-bottom:4px;">📖 Sonraki ders:</div>
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div><b>Sonraki ders:</b> 👋 Selamlaşma & Tanışma (A1 Başlangıç)</div>
            <a class="btn btn-primary sm" id="onboardNextLessonBtn" href="#/lesson/u1" aria-label="Sonraki Derse Başla">▶ Sonraki Derse Başla (+15 XP)</a>
          </div>
        </div>
      </div>

      <!-- Akıllı Tekrar (Spaced Repetition) & Kelime Tekrarı Kısayol Kartı -->
      <div class="card action-card onboard-review-card" id="onboardReviewCard" style="--c:#20C997;margin-top:20px;width:100%;max-width:640px;box-sizing:border-box;">
        <div class="ac-emoji">🔁</div>
        <div class="ac-body">
          <div class="muted small">Akıllı Tekrar (Spaced Repetition)</div>
          <h3>Kelime Tekrarı</h3>
          <p class="muted small">Aralıklı tekrar sistemi (SRS) ile öğrendiğin kelimeleri kalıcı hafızaya taşı.</p>
          <div class="ac-actions" style="margin-top:10px;">
            <a class="btn btn-primary sm" id="onboardReviewCardBtn" href="#/review" aria-label="Akıllı Tekrar (Spaced Repetition) sayfasını aç">🔁 Akıllı Tekrar Sayfasına Git</a>
          </div>
        </div>
      </div>

      <!-- AI Öğretmen & Gemini API Kurulum Kısayol Kartı -->
      <div class="card ai-teaser onboard-ai-card" id="onboardAiCard" style="margin-top:20px;width:100%;max-width:640px;box-sizing:border-box;">
        <div class="muted small">${icon('bot', '', 16)} AI Öğretmen & Kişisel Rehber</div>
        <h3>Yapay zeka öğretmenini etkinleştir</h3>
        <p class="muted">Ücretsiz bir Gemini API anahtarıyla sana özel seviye analizi, alıştırma ve sohbet pratiği.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          <a class="btn btn-primary sm" id="onboardAiSetupBtn" href="#/ai" aria-label="AI Öğretmeni Kur: Gemini API anahtarı ayarları">🔑 AI Öğretmeni Kur (Gemini API Ayarları)</a>
          <a class="btn btn-ghost sm" id="onboardAiHowtoBtn" href="#/ai">Nasıl yapılır?</a>
        </div>
      </div>

      <!-- Kurs İlerlemesi & Ünite Başarı Kartı (Course Progress Card) -->
      <div class="card onboard-progress-card" style="margin-top:20px;width:100%;max-width:640px;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h2 style="margin:0;font-size:1.15rem;display:flex;align-items:center;gap:8px;">🧩 Kurs İlerlemesi (Course Progress Summary)</h2>
          <a href="#/progress" class="btn btn-ghost sm" aria-label="Tüm İlerlemeyi Gör">Tüm İlerleme ➔</a>
        </div>
        <div class="course-progress-summary">
          <div class="cps-head">
            <div class="cps-title">
              <span class="cps-icon">📊</span>
              <div>
                <div class="cps-heading">Genel Kurs Tamamlama Özeti</div>
                <div class="cps-sub muted">Tüm A1 &amp; A2 müfredatı ilerleme durumu</div>
              </div>
            </div>
            <div class="cps-badge-wrap">
              <span class="cps-badge">%0 Tamamlandı</span>
            </div>
          </div>
          <div class="progress cps-progress"><div class="bar rainbow" style="width:0%;"></div></div>
          <div class="cps-foot">
            <span>🎯 Tamamlanan: <b>0 / ${UNITS.length} Ünite</b></span>
            <span class="muted">${UNITS.length} ünite seni bekliyor</span>
          </div>
        </div>
        <p class="muted small" style="margin-bottom:14px;">Giriş yapmadan misafir olarak üniteleri ve kelimeleri doğrudan inceleyebilirsin:</p>
        <div class="unit-bars">
          ${UNITS.slice(0, 5).map(u => {
            const targetUrl = u.type === 'vocab' ? `#/cards/${u.id}` : `#/grammar/${u.id}`;
            return `
            <a class="ub-row" href="${targetUrl}" role="button" tabindex="0" aria-label="${esc(u.title)} ünitesi kelimelerini aç" style="text-decoration:none;color:inherit;cursor:pointer;display:flex;align-items:center;">
              <span class="ub-name">${u.emoji} ${esc(u.title)}</span>
              <div class="progress"><div class="bar" style="width:0%;background:${u.color}"></div></div>
              <span class="ub-val">İncele ➔</span>
            </a>`;
          }).join('')}
        </div>
      </div>

      <!-- Konu Bazlı Kelime Kartları & Kategori Kütüphanesi -->
      <div class="card onboard-vocab-library" style="margin-top:20px;width:100%;max-width:640px;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h2 style="margin:0;font-size:1.15rem;display:flex;align-items:center;gap:8px;">🃏 Kelime Kartları & Kategori Kütüphanesi</h2>
          <a href="#/cards" class="btn btn-ghost sm" aria-label="Tümünü Gör">Tümünü Gör ➔</a>
        </div>
        <p class="muted small" style="margin-bottom:16px;">Başlamadan önce kelime kategorilerini ve kart kütüphanesini doğrudan inceleyebilirsin:</p>
        <div class="unit-grid">
          ${UNITS.filter(x => x.type === 'vocab').slice(0, 6).map(x => `
            <a class="unit-tile" href="#/cards/${x.id}" style="--c:${x.color}">
              <span class="unit-tile-emoji">${x.emoji}</span>
              <div>
                <h3>${esc(x.title)}</h3>
                <p class="muted small">${x.words ? x.words.length : 0} kelime</p>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </div>`;

  const landingHeroBtn = $('#landingHeroStartBtn');
  if (landingHeroBtn) {
    landingHeroBtn.onclick = () => {
      const setupCard = $('#onboardSetupCard');
      if (setupCard) {
        setupCard.scrollIntoView({ behavior: 'smooth' });
        $('#nameIn')?.focus();
      }
    };
  }

  // Yoldaş seçimi
  $$('.mascot-card').forEach(card => {
    card.onclick = () => {
      $$('.mascot-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedMascot = card.dataset.m;
      state.mascot = selectedMascot;
      store.setMascot(selectedMascot);
      saveState();
      renderNav('');
      if ($('.onboard-hero')) $('.onboard-hero').textContent = (MASCOT_BY_ID && MASCOT_BY_ID[selectedMascot]) ? MASCOT_BY_ID[selectedMascot].icon : '🐾';
    };
  });

  // Tema seçimi
  $$('.theme-card').forEach(card => {
    card.onclick = () => {
      $$('.theme-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedTheme = card.dataset.t;
      store.setTheme(selectedTheme);
      themeService.apply(selectedTheme);
    };
  });

  const go = to => {
    const name = $('#nameIn').value.trim() || 'Öğrenci';
    state.name = name;
    state.mascot = selectedMascot;
    store.setMascot(selectedMascot);
    store.setTheme(selectedTheme);
    const pendingRoom = state.pendingLeagueRoom;
    state.pendingLeagueRoom = null;

    if (to === 'zero' || to === 'guest') {
      state.onboarded = true;
      saveState();
      if (pendingRoom) {
        joinCloudLeague(pendingRoom).then(() => {
          toast('🎉 Canlı Lige katıldın!');
          location.hash = '#/leaderboard';
          router();
        }).catch(() => {
          location.hash = '#/home';
          router();
        });
      } else {
        location.hash = '#/home';
        router();
      }
    } else {
      saveState();
      location.hash = '#/placement';
    }
  };

  $('#placeBtn').onclick = () => go('place');
  $('#zeroBtn').onclick = () => go('zero');
  $('#onboardGuestBtn').onclick = () => go('guest');
  if ($('#onboardGuestProgressBtn')) {
    $('#onboardGuestProgressBtn').onclick = () => {
      state.onboarded = true;
      saveState();
    };
  }
  $('#onboardAuthBtn').onclick = () => openAuthModal();
  $('#nameIn').onkeydown = e => { if (e.key === 'Enter') go('zero'); };
}

/* ============================================================
   Seviye testi
   ============================================================ */
function screenPlacement() {
  runLesson({
    title: '📝 Seviye Belirleme Testi',
    questions: buildPlacementTest(),
    color: '#CC5DE8',
    exitTo: state.onboarded ? '#/home' : '#/',
    onFinish: (results) => {
      // Baştan itibaren %75 doğruluk korunan en uzak üniteyi bul
      let correct = 0, reach = -1;
      results.forEach((r, i) => { if (r.ok) correct++; if (correct >= 0.75 * (i + 1)) reach = i; });
      const unlockTo = Math.max(0, Math.min(reach + 1, UNITS.length - 1));
      state.unlockedUpTo = Math.max(state.unlockedUpTo, unlockTo);
      state.onboarded = true;
      state.placement = { at: Date.now(), score: correct, reach };
      const xp = correct * 5;
      addXP(xp);
      const opened = state.unlockedUpTo + 1;
      return {
        xp, exitTo: '#/learn',
        message: opened > 1
          ? `Süper! İlk <b>${opened}</b> ünite senin için açıldı. <b>${esc(UNITS[state.unlockedUpTo].title)}</b> ünitesinden devam edebilirsin.`
          : 'En baştan başlamak senin için en iyisi. Hadi ilk üniteye! 🚀'
      };
    }
  });
}

/* ============================================================
   Ana sayfa
   ============================================================ */
let companionEncouragementIdx = 0;

function renderSquirrelStageSVG(stageId = 'baby', mood = 'normal') {
  const isBaby = stageId === 'baby';
  const isExplorer = stageId === 'explorer';
  const isStudent = stageId === 'student';
  const isScholar = stageId === 'scholar';
  const isMaster = stageId === 'master';
  const isDance = mood === 'dance';
  const isSad = mood === 'sad';
  const isSleep = mood === 'sleep';
  const scale = isBaby ? 0.88 : isExplorer ? 0.94 : 1;

  // Kulak açıları (Üzgünken kulaklar yana düşer, dans ederken dikleşir)
  const leftEarTransform = isSad ? 'rotate(-42 32 34)' : isDance ? 'rotate(-6 35 28)' : 'rotate(-14 35 30)';
  const rightEarTransform = isSad ? 'rotate(42 76 34)' : isDance ? 'rotate(6 73 28)' : 'rotate(14 73 30)';

  return `
    <svg class="squirrel-stage-svg stage-${esc(stageId)} mood-${esc(mood)}" viewBox="0 0 120 120" width="76" height="76" role="img" aria-label="Fındık Sincap Yoldaş (${esc(stageId)})" style="transform:scale(${scale});transition:transform 0.3s ease;overflow:visible;">
      <defs>
        <linearGradient id="sqTailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FB923C" />
          <stop offset="100%" stop-color="#C2410C" />
        </linearGradient>
        <linearGradient id="sqBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F97316" />
          <stop offset="100%" stop-color="#EA580C" />
        </linearGradient>
      </defs>
      <!-- Kabarık Sincap Kuyruğu -->
      <g class="sq-tail">
        <path d="M78 88 C112 85, 118 42, 92 26 C74 16, 64 36, 74 52 C66 58, 66 76, 78 88 Z" fill="url(#sqTailGrad)" />
        <path d="M88 36 C100 42, 98 62, 84 72" stroke="#FFEDD5" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.55" />
      </g>
      ${isMaster ? `<path d="M30 68 L16 102 L90 102 L76 68 Z" fill="#7C3AED" opacity="0.9" />` : ''}
      <!-- Gövde -->
      <ellipse cx="54" cy="82" rx="24" ry="22" fill="url(#sqBodyGrad)" />
      <ellipse cx="54" cy="84" rx="15" ry="15" fill="#FFEDD5" />
      <!-- Yürüyen Minik Ayaklar / Patiler -->
      <ellipse class="sq-foot-l" cx="42" cy="102" rx="7.5" ry="4.5" fill="#C2410C" />
      <ellipse class="sq-foot-r" cx="66" cy="102" rx="7.5" ry="4.5" fill="#C2410C" />
      ${isStudent ? `
        <!-- Okul Çantası Askıları ve Mavi Fular -->
        <path d="M36 68 L34 94 M72 68 L74 94" stroke="#DC2626" stroke-width="5" stroke-linecap="round" />
        <path d="M35 66 Q54 76 73 66 L68 75 Q54 82 40 75 Z" fill="#2563EB" />
      ` : ''}
      <!-- Kulaklar -->
      <ellipse cx="35" cy="30" rx="8" ry="13" transform="${leftEarTransform}" fill="#EA580C" />
      <ellipse cx="35" cy="31" rx="4.5" ry="8" transform="${leftEarTransform}" fill="#FDBA74" />
      <ellipse cx="73" cy="30" rx="8" ry="13" transform="${rightEarTransform}" fill="#EA580C" />
      <ellipse cx="73" cy="31" rx="4.5" ry="8" transform="${rightEarTransform}" fill="#FDBA74" />
      <!-- Baş -->
      <circle cx="54" cy="48" r="24" fill="url(#sqBodyGrad)" />
      <!-- Tombul Yanaklar -->
      <ellipse cx="38" cy="54" rx="10" ry="8" fill="#FFEDD5" />
      <ellipse cx="70" cy="54" rx="10" ry="8" fill="#FFEDD5" />
      <circle cx="35" cy="55" r="${isDance ? 5.5 : 4.5}" fill="#FB7185" opacity="${isDance ? 0.7 : 0.45}" />
      <circle cx="73" cy="55" r="${isDance ? 5.5 : 4.5}" fill="#FB7185" opacity="${isDance ? 0.7 : 0.45}" />
      <!-- Gözler (Duygu Durumuna Göre Değişir) -->
      ${isDance ? `
        <!-- Sevinçten Gülen Gözler (^ ^) -->
        <path d="M39 46 Q44 39 49 46" stroke="#1E1B4B" stroke-width="3" stroke-linecap="round" fill="none" />
        <path d="M59 46 Q64 39 69 46" stroke="#1E1B4B" stroke-width="3" stroke-linecap="round" fill="none" />
      ` : isSleep ? `
        <!-- Uyuyan Gözler -->
        <path d="M39 45 Q44 50 49 45" stroke="#1E1B4B" stroke-width="2.6" stroke-linecap="round" fill="none" />
        <path d="M59 45 Q64 50 69 45" stroke="#1E1B4B" stroke-width="2.6" stroke-linecap="round" fill="none" />
      ` : `
        <!-- Parlak Gözler -->
        <circle cx="44" cy="45" r="${isBaby ? 5.5 : 4.8}" fill="#1E1B4B" />
        <circle cx="64" cy="45" r="${isBaby ? 5.5 : 4.8}" fill="#1E1B4B" />
        <circle cx="42.5" cy="43" r="1.8" fill="#FFFFFF" />
        <circle cx="62.5" cy="43" r="1.8" fill="#FFFFFF" />
        ${isSad ? `
          <!-- Üzgün Kaşlar ve Gözyaşı Damlası -->
          <path d="M38 39 L47 41" stroke="#431407" stroke-width="2.2" stroke-linecap="round" />
          <path d="M70 39 L61 41" stroke="#431407" stroke-width="2.2" stroke-linecap="round" />
          <path d="M70 49 C73 53, 73 57, 70 57 C67 57, 67 53, 70 49 Z" fill="#38BDF8" />
        ` : ''}
      `}
      ${(isScholar || isMaster) ? `
        <!-- Bilgin Gözlüğü -->
        <circle cx="44" cy="45" r="8.5" fill="none" stroke="#FBBF24" stroke-width="2.6" />
        <circle cx="64" cy="45" r="8.5" fill="none" stroke="#FBBF24" stroke-width="2.6" />
        <line x1="52.5" y1="45" x2="55.5" y2="45" stroke="#FBBF24" stroke-width="2.6" />
      ` : ''}
      <!-- Burun ve Ağız İfadesi -->
      <ellipse cx="54" cy="52" rx="4" ry="3" fill="#431407" />
      ${isSad ? `
        <!-- Üzgün Ağız -->
        <path d="M48 61 Q54 56 60 61" stroke="#431407" stroke-width="2.3" fill="none" stroke-linecap="round" />
      ` : isDance ? `
        <!-- Coşkulu Sevinç Gülümsemesi -->
        <path d="M46 56 Q54 66 62 56 Z" fill="#991B1B" stroke="#431407" stroke-width="1.8" />
        <rect x="52" y="56.5" width="4" height="3.5" rx="1" fill="#FFFFFF" />
      ` : `
        <!-- Sevimli Sincap Gülümsemesi ve Dişi -->
        <path d="M48 57 Q54 62 60 57" stroke="#431407" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <rect x="52" y="58.5" width="4" height="4.2" rx="1" fill="#FFFFFF" stroke="#431407" stroke-width="1" />
      `}
      ${isBaby ? `
        <!-- Yavru Filiz Yaprağı -->
        <path d="M54 24 Q54 14 63 14 Q58 22 54 24 Z" fill="#22C55E" />
        <path d="M54 24 Q50 16 44 17 Q48 23 54 24 Z" fill="#4ADE80" />
      ` : ''}
      ${isMaster ? `
        <!-- Profesör Altın Tacı -->
        <polygon points="38,26 43,12 54,21 65,12 70,26" fill="#FACC15" stroke="#CA8A04" stroke-width="1.8" />
        <circle cx="54" cy="20" r="2.5" fill="#EF4444" />
      ` : ''}
      ${(isExplorer || isStudent || isScholar || isMaster) ? `
        <!-- Patilerde Altın Meşe Palamudu -->
        <ellipse cx="54" cy="85" rx="8" ry="9" fill="#D97706" />
        <path d="M45 81 Q54 74 63 81 L61 84 Q54 79 47 84 Z" fill="#78350F" />
        <line x1="54" y1="74" x2="54" y2="77" stroke="#78350F" stroke-width="2" stroke-linecap="round" />
      ` : ''}
    </svg>`;
}

function screenHome() {
  const lvl = levelInfo();
  const xl = xpLevel();
  const nu = nextUnit();
  const due = dueWords().length;
  const allWords = ALL_WORDS;
  const wotd = allWords[Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000) % allWords.length];
  const todayXP = state.daily[todayStr()] || 0;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const curMascot = mascotService.getActive();
  const encouragements = mascotService.getEncouragements();
  const curEncouragement = encouragements[companionEncouragementIdx % encouragements.length] || curMascot.motto;
  const enQuote = typeof curEncouragement === 'object' ? curEncouragement.en : curEncouragement;
  const trQuote = typeof curEncouragement === 'object' ? curEncouragement.tr : '';
  const isGuest = state.auth ? state.auth.isGuest : true;
  const sq = getSquirrelGrowth();

  view().innerHTML = `
    <div class="page">
      <header class="page-head" style="margin-bottom:14px;">
        <div>
          <h1>${greet}, ${esc(state.name)}! 👋</h1>
          <p class="muted">Bugün ${esc(curMascot.vaultName)}'na <b>${todayXP} ${curMascot.itemIcon} ${curMascot.itemName}</b> kattın. ${todayXP >= 50 ? '🎉 Günlük hedefin tamamlandı!' : `Günlük hedefe <b>${50 - todayXP} ${curMascot.itemsName}</b> kaldı.`}</p>
        </div>
      </header>

      ${isGuest ? `
        <div class="guest-banner">
          <div>
            <div class="gb-title">✨ Misafir Modundasın</div>
            <div class="gb-sub">İlerlemen şu anda bu cihazda tutuluyor. Palamutlarını kaybetmemek için Google hesabını bağlayabilirsin.</div>
          </div>
          <button class="btn btn-primary sm" id="homeLinkAuthBtn">🚀 Hesaba Bağla</button>
        </div>
      ` : ''}

      <!-- Kompakt Minik Efsane (Fındık) Durum & İlerleme Şeridi -->
      <div class="card" id="mascotHeroCard" style="padding:12px 16px;margin-bottom:14px;">
        <div id="squirrelCompanionPanel" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:220px;">
            <div id="mascotAvatarWrap" title="${esc(curMascot.name)}'a seslen!" style="cursor:pointer;display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:12px;background:color-mix(in srgb, var(--primary) 14%, var(--card));font-size:1.35rem;">
              <span id="mascotIconEl">${curMascot.icon || '🐿️'}</span>
            </div>
            <div style="flex:1;min-width:160px;">
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <b style="font-size:0.9rem;" id="mascotHeroName">${esc(curMascot.name)}</b>
                <span class="badge" id="squirrelStageBadge" style="background:var(--primary);color:#fff;font-weight:800;padding:2px 8px;border-radius:99px;font-size:0.72rem;">${esc(sq.badge)} · ${esc(sq.title)}</span>
                <span class="badge" id="squirrelAcornBadge" style="background:color-mix(in srgb, #F59E0B 18%, var(--card));color:var(--text);font-weight:800;font-size:0.72rem;">${curMascot.itemIcon} ${sq.acorns} ${curMascot.itemsName}</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-top:5px;">
                <div class="progress" id="squirrelGrowthBar" style="height:6px;flex:1;max-width:190px;margin:0;"><div class="bar rainbow" style="width:${sq.stagePct}%;"></div></div>
                <span class="muted small" style="font-size:0.74rem;font-weight:700;">
                  ${sq.nextXP !== null ? `Sonraki evre: ${sq.xpLeft} ${curMascot.itemsName} (%${sq.stagePct})` : '👑 Maksimum Evre'}
                </span>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
            <button type="button" class="btn btn-primary sm" id="squirrelWordHelpBtn" style="padding:6px 10px;font-size:0.78rem;">💡 Kelime İpucu</button>
            <button type="button" class="btn btn-secondary sm" id="squirrelGrammarHelpBtn" style="padding:6px 10px;font-size:0.78rem;">📘 Gramer Tüyosu</button>
            <button type="button" class="btn btn-ghost sm" id="squirrelFeedBtn" style="padding:6px 10px;font-size:0.78rem;">${curMascot.feedAction}</button>
            <button type="button" class="speak-btn sm" id="mascotSpeakBtn" title="Yoldaşını Dinle" aria-label="Yoldaşını İngilizce Dinle">🔊</button>
          </div>
        </div>
        <div id="mascotSpeechEn" style="display:none;">"${esc(enQuote)}"</div>
        <div id="mascotSpeechTr" style="display:none;">${esc(trQuote)}</div>
        <div id="squirrelHelperOutput" style="display:none;margin-top:10px;padding:10px 12px;border-radius:10px;background:color-mix(in srgb, var(--primary) 10%, var(--card));border:1px solid var(--border);font-size:0.86rem;"></div>
      </div>

      <!-- Kompakt Metrik Şeridi (Sakin Motivasyon & Palamut) -->
      <div class="metrics-strip">
        <div class="metric-pill" title="Sakin çalışma ritmi - Baskı yok!">
          <div class="mp-icon">🌿</div>
          <div class="mp-content">
            <div class="mp-val">${currentStreak()} <span class="mp-unit">Gün</span></div>
            <div class="mp-lbl">${currentStreak() > 0 ? 'Çalışma Ritmi' : `${esc(curMascot.name)} Seni Bekliyor`}</div>
          </div>
        </div>
        <div class="metric-pill">
          <div class="mp-icon">🌰</div>
          <div class="mp-content">
            <div class="mp-val">${state.xp} <span class="mp-unit">Palamut</span></div>
            <div class="mp-lbl">Toplam Birikim · Lv ${xl.level}</div>
          </div>
        </div>
        <div class="metric-pill">
          <div class="mp-icon">🏅</div>
          <div class="mp-content">
            <div class="mp-val">${lvl.done}/${UNITS.length} <span class="mp-unit">(%${lvl.pct})</span></div>
            <div class="mp-lbl">Ünite Tamamlandı</div>
          </div>
        </div>
        <div class="metric-pill" id="dashDailyGoalPill" title="Günlük hedef ilerlemesi">
          <div class="mp-icon">🎯</div>
          <div class="mp-content">
            <div class="mp-val">${todayXP} / 50 <span class="mp-unit">XP</span></div>
            <div class="mp-lbl">Günlük Hedef (%${Math.min(100, Math.round((todayXP / 50) * 100))})</div>
          </div>
        </div>
      </div>

      <!-- Birleşik Odak & Görev Kartı (Ders + Günlük Hedef Tek Odakta) -->
      <div class="card mission-card">
        <div class="mission-top">
          <div class="mission-top-header">
            <div class="mission-badge">🎯 Günlük Hedef</div>
            <div class="mission-level-badge">${lvl.label} · %${lvl.pct} Tamamlandı</div>
          </div>
          
          <div class="mission-goal-bar-wrap">
            <div class="mission-goal-info">
              <span class="mgi-title"><b>Günlük Hedef:</b> <b>${Math.min(todayXP, 50)} / 50 ${curMascot.itemIcon} ${curMascot.itemsName}</b></span>
              <span class="mgi-sub muted small">${todayXP >= 50 ? '🎉 Günlük Hedef Tamamlandı!' : `Günlük hedefe ${50 - todayXP} palamut kaldı`}</span>
            </div>
            <div class="progress thick"><div class="bar rainbow" style="width:${Math.min(100, (todayXP / 50) * 100)}%;"></div></div>
          </div>
        </div>

        <div class="mission-divider"></div>

        <div class="next-lesson-section">
          <div class="next-lesson-header" style="margin-bottom:8px;">
            <span class="badge" style="background:var(--card-hover);font-weight:700;">📖 Sonraki Ders</span>
          </div>
          ${nu ? `
            <div class="mission-unit-row" style="--c:${nu.color}">
              <div class="mission-unit-left">
                <div class="mission-unit-avatar">${nu.emoji}</div>
                <div class="mission-unit-text">
                  <div class="mission-step-tag">Sonraki ders · ${nu.type === 'vocab' ? 'Kelime Dünyası' : 'Gramer Mantığı'}</div>
                  <h2 class="mission-unit-name">Sonraki ders: ${esc(nu.title)}</h2>
                  <div class="mission-unit-desc">${esc(nu.desc || 'Konuyu pekiştir, yeni kelimeler öğren ve zulaya palamut topla!')}</div>
                </div>
              </div>
              <div class="mission-unit-btns">
                ${nu.type === 'grammar' 
                  ? `<a class="btn btn-ghost" href="#/grammar/${nu.id}">📖 Konu Özeti</a>` 
                  : `<a class="btn btn-ghost" href="#/cards/${nu.id}">🃏 Kelimeler</a>`}
                <a class="btn btn-primary mission-play-btn" id="homeNextLessonBtn" href="#/lesson/${nu.id}">▶ Sonraki Derse Başla (+15 ${curMascot.itemIcon})</a>
              </div>
            </div>
          ` : `
            <div class="mission-unit-row" style="--c:#10B981">
              <div class="mission-unit-left">
                <div class="mission-unit-avatar">🎓</div>
                <div class="mission-unit-text">
                  <div class="mission-step-tag">Sonraki ders · A1 Finali</div>
                  <h2 class="mission-unit-name">Sonraki ders: Tüm A1 Üniteleri Tamamlandı!</h2>
                  <div class="mission-unit-desc">${state.a1BossPassed ? 'Tebrikler! A1 Seviye Sınavını geçtin.' : 'Haritadaki Final Sınavına girerek A2 seviyesini açabilirsin!'}</div>
                </div>
              </div>
              <div class="mission-unit-btns">
                <a class="btn btn-primary mission-play-btn" id="homeNextLessonBtn" href="#/lesson/u1">▶ Dersi Tekrar Et (+15 ${curMascot.itemIcon})</a>
              </div>
            </div>
          `}
        </div>
      </div>

      <!-- Genel Kurs İlerlemesi Özeti (Top-Level Course Progress Summary Card) -->
      <div class="card course-progress-card" style="margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h2 style="margin:0;font-size:1.15rem;display:flex;align-items:center;gap:8px;">🧩 Kurs İlerlemesi (Course Progress Summary)</h2>
          <div style="display:flex;gap:8px;align-items:center;">
            <a href="#/lesson/${nu ? nu.id : 'u1'}" class="btn btn-primary sm" id="dashCourseMapPlayBtn" aria-label="Sonraki Derse Başla">▶ Derse Devam Et</a>
            <a href="#/progress" class="btn btn-ghost sm" aria-label="Tüm Kurs İlerlemesini Gör">Tümünü Gör ➔</a>
          </div>
        </div>
        <div class="course-progress-summary">
          <div class="cps-head">
            <div class="cps-title">
              <span class="cps-icon">📊</span>
              <div>
                <div class="cps-heading">Genel Kurs Tamamlama Özeti</div>
                <div class="cps-sub muted">Tüm A1 &amp; A2 müfredatı ilerleme durumu</div>
              </div>
            </div>
            <div class="cps-badge-wrap">
              <span class="cps-badge">%${lvl.pct} Tamamlandı</span>
            </div>
          </div>
          <div class="progress cps-progress"><div class="bar rainbow" style="width:${Math.max(lvl.pct, 3)}%;"></div></div>
          <div class="cps-foot">
            <span>🎯 Tamamlanan: <b>${lvl.done} / ${UNITS.length} Ünite</b></span>
            <span class="muted">${UNITS.length - lvl.done} ünite kaldı</span>
          </div>
        </div>
      </div>

      <!-- İkincil Eylemler Grid (Rekabet, Akıllı Tekrar, Günün Kelimesi, AI) -->
      ${(() => {
        const list = getLeaderboardList();
        const rivals = list.filter(u => !u.isMe);
        if (rivals.length === 0) return '';
        const topRival = rivals[0];
        const diff = state.xp - topRival.xp;
        let rivalryMsg = diff > 0 
          ? `🔥 <b>${esc(topRival.name)}</b>'ın <b>${diff} 🌰</b> önündesin! Liderliği bırakma!` 
          : diff < 0 
          ? `⚡ <b>${esc(topRival.name)}</b> <b>${Math.abs(diff)} 🌰</b> ile önünde! Hemen bir ders yapıp yetiş!` 
          : `🤝 <b>${esc(topRival.name)}</b> ile kafa kafayasınız! (İkiniz de ${state.xp} 🌰)`;
        return `
        <div class="card rivalry-card" style="margin-bottom:20px;">
          <div class="rivalry-head">
            <div class="rivalry-avatar">${topRival.avatar || '🧑'}</div>
            <div class="rivalry-info">
              <div class="muted small">⚔️ Arkadaş Rekabeti ${state.leagueRoomId ? '· 🟢 Canlı Lig' : ''}</div>
              <div class="rivalry-text">${rivalryMsg}</div>
            </div>
            <a class="btn btn-primary sm" href="#/leaderboard">🏆 Sıralamaya Bak</a>
          </div>
        </div>`;
      })()}

      <div class="grid-2">
        <div class="card action-card" id="dashReviewCard" style="--c:#20C997">
          <div class="ac-emoji">🌰</div>
          <div class="ac-body">
            <div class="muted small">${esc(curMascot.name)}'ın Palamut Zulası (Aralıklı Tekrar)</div>
            <h3>${due > 0 ? `Zuladaki Kelimeler (${due} palamut bekliyor)` : `${esc(curMascot.name)}'ın Palamut Zulası`}</h3>
            <p class="muted small">${due > 0 ? `${esc(curMascot.name)} ile unutulma riski olan kelimeleri zuladan çıkarıp tazeleyelim.` : `${esc(curMascot.name)} tüm kelimeleri çok iyi hatırlıyor! Dilediğin an serbest tekrar yapabilirsin.`}</p>
            <div class="ac-actions" style="margin-top:10px;">
              <a class="btn btn-primary" id="dashReviewBtn" href="#/review" aria-label="Akıllı Tekrar sayfasını aç">🌰 ${due > 0 ? `Zulayı Tazelemeye Başla (${due})` : 'Zuladaki Kelimeleri Gör'}</a>
            </div>
          </div>
        </div>

        <div class="card wotd" style="--c:${UNIT_BY_ID[wotd.unitId].color}">
          <div class="muted small">✨ Günün kelimesi</div>
          <div class="wotd-row">
            <div class="wotd-emoji">${wotd.emoji}</div>
            <div>
              <div class="wotd-en">${esc(wotd.en)}</div>
              <div class="muted">${esc(wotd.tr)}</div>
            </div>
            <button class="speak-btn" data-say="${esc(wotd.en)}" aria-label="Günün kelimesini dinle" title="Dinle">🔊</button>
          </div>
        </div>
      </div>

      <div class="card ai-teaser mt-4" id="dashAiCard">
        <div class="muted small">${icon('bot', '', 16)} AI Öğretmen & Kişisel Rehber</div>
        <h3>${hasAI() ? 'Seviyeni analiz etmemi ister misin?' : 'Yapay zeka öğretmenini etkinleştir'}</h3>
        <p class="muted">${hasAI() ? 'Hatalarına bakıp sana özel plan ve alıştırma hazırlarım.' : 'Ücretsiz bir Gemini API anahtarıyla sana özel analiz, alıştırma ve sohbet pratiği.'}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          ${hasAI()
            ? '<a class="btn btn-primary" id="dashAiBtn" href="#/ai">🤖 AI Öğretmene Git</a><a class="btn btn-secondary" id="dashAiSetupBtn" href="#/ai" aria-label="Gemini API Anahtarı Ayarları">🔑 Gemini API Ayarları</a>'
            : '<a class="btn btn-primary" id="dashAiSetupBtn" href="#/ai" aria-label="AI Öğretmeni Kur: Gemini API anahtarı ayarları">🔑 AI Öğretmeni Kur (Gemini API Ayarları)</a><a class="btn btn-ghost" id="dashAiHowtoBtn" href="#/ai">Nasıl yapılır?</a>'}
        </div>
      </div>
    </div>`;

  if ($('#homeLinkAuthBtn')) {
    $('#homeLinkAuthBtn').onclick = () => openAuthModal();
  }

  // Yoldaş İnteraktif Tıklama ve Konuşma
  const mascotAvatar = $('#mascotAvatarWrap');
  const mascotIcon = $('#mascotIconEl');
  const mascotEnEl = $('#mascotSpeechEn');
  const mascotTrEl = $('#mascotSpeechTr');
  const mascotSpeak = $('#mascotSpeakBtn');

  const triggerCompanionReaction = (andSpeak = false) => {
    companionEncouragementIdx++;
    const nextMsg = encouragements[companionEncouragementIdx % encouragements.length] || curMascot.motto;
    const nextEn = typeof nextMsg === 'object' ? nextMsg.en : nextMsg;
    const nextTr = typeof nextMsg === 'object' ? nextMsg.tr : '';
    if (mascotEnEl) mascotEnEl.textContent = `"${nextEn}"`;
    if (mascotTrEl) mascotTrEl.textContent = nextTr;
    if (mascotIcon) {
      mascotIcon.classList.remove('cheer');
      void mascotIcon.offsetWidth; // reflow
      mascotIcon.classList.add('cheer');
    }
    if (andSpeak) {
      speak(nextEn, 'en');
    }
  };

  if (mascotAvatar) {
    mascotAvatar.onclick = () => triggerCompanionReaction(true);
  }
  if (mascotSpeak) {
    mascotSpeak.onclick = (e) => {
      e.stopPropagation();
      const currentMsg = encouragements[companionEncouragementIdx % encouragements.length] || curMascot.motto;
      const say = typeof currentMsg === 'object' ? currentMsg.en : (mascotEnEl ? mascotEnEl.textContent.replace(/^"|"$/g, '') : curMascot.motto);
      speak(say, 'en');
    };
  }

  const helperOut = $('#squirrelHelperOutput');
  const wordHelpBtn = $('#squirrelWordHelpBtn');
  const grammarHelpBtn = $('#squirrelGrammarHelpBtn');
  const feedBtn = $('#squirrelFeedBtn');
  const acornBadge = $('#squirrelAcornBadge');

  if (wordHelpBtn) {
    wordHelpBtn.onclick = () => {
      if (!state.companion) state.companion = { fedCount: 0, lastHintIdx: 0, lastGrammarIdx: 0 };
      const weak = weakWords(5);
      const targetUnit = nu && nu.words && nu.words.length > 0 ? nu : UNITS.find(u => u.words && u.words.length > 0) || UNITS[0];
      const pool = weak.length > 0 ? weak : (targetUnit.words || allWords);
      const idx = (state.companion.lastHintIdx || 0) % pool.length;
      state.companion.lastHintIdx = (state.companion.lastHintIdx || 0) + 1;
      saveState();
      const w = pool[idx];
      const isWeakWord = weak.length > 0;
      if (w) {
        const msgHtml = `${w.emoji || '🌰'} <b>"${esc(w.en)}"</b> = <b>"${esc(w.tr)}"</b> (${isWeakWord ? 'Zorlandığın kelime' : esc(targetUnit.title)}). Telaffuzunu seslendirdim!`;
        if (typeof window.shimejiSay === 'function') {
          window.shimejiSay(msgHtml, '🌰 Fındık\'tan Kelime İpucu');
        }
        if (helperOut) {
          helperOut.style.display = 'block';
          helperOut.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div>${msgHtml}</div>
              <button type="button" class="speak-btn sm" id="squirrelHelperSpeakWordBtn" title="Telaffuzu Dinle" aria-label="Kelime telaffuzunu dinle">🔊</button>
            </div>`;
          const spkBtn = $('#squirrelHelperSpeakWordBtn');
          if (spkBtn) spkBtn.onclick = () => speak(w.en, 'en');
        }
        speak(w.en, 'en');
      }
      triggerCompanionReaction(false);
    };
  }

  if (grammarHelpBtn) {
    grammarHelpBtn.onclick = () => {
      if (!state.companion) state.companion = { fedCount: 0, lastHintIdx: 0, lastGrammarIdx: 0 };
      const tips = (typeof SQUIRREL_GRAMMAR_TIPS !== 'undefined' && Array.isArray(SQUIRREL_GRAMMAR_TIPS) && SQUIRREL_GRAMMAR_TIPS.length > 0)
        ? SQUIRREL_GRAMMAR_TIPS
        : [{ title: '🧩 İngilizce Cümle Mantığı', rule: 'İngilizcede cümleler her zaman Özne + Yüklem + Nesne sırasıyla kurulur.', en: 'I learn English every day.', tr: 'Ben her gün İngilizce öğrenirim.' }];
      const idx = (state.companion.lastGrammarIdx || 0) % tips.length;
      state.companion.lastGrammarIdx = (state.companion.lastGrammarIdx || 0) + 1;
      saveState();
      const tip = tips[idx];
      if (tip) {
        const tipHtml = `<b>${esc(tip.title)}:</b> ${esc(tip.rule)}<br><span class="muted small">Örnek: <b>"${esc(tip.en)}"</b> (${esc(tip.tr)})</span>`;
        if (typeof window.shimejiSay === 'function') {
          window.shimejiSay(tipHtml, '📘 Fındık\'tan Gramer Tüyosu');
        }
        if (helperOut) {
          helperOut.style.display = 'block';
          helperOut.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
              <div>${tipHtml}</div>
              <button type="button" class="speak-btn sm" id="squirrelHelperSpeakGrammarBtn" title="Örnek Cümleyi Dinle" aria-label="Örnek cümleyi dinle">🔊</button>
            </div>`;
          const spkBtn = $('#squirrelHelperSpeakGrammarBtn');
          if (spkBtn) spkBtn.onclick = () => speak(tip.en, 'en');
        }
        speak(tip.en, 'en');
      }
      triggerCompanionReaction(false);
    };
  }

  if (feedBtn) {
    feedBtn.onclick = () => {
      if (!state.companion) state.companion = { fedCount: 0, lastHintIdx: 0, lastGrammarIdx: 0 };
      state.companion.fedCount = (state.companion.fedCount || 0) + 1;
      saveState();
      const updatedSq = getSquirrelGrowth();
      if (acornBadge) acornBadge.textContent = `🌰 ${updatedSq.acorns} Palamut`;
      const feedMsg = `🌰 <b>Hart hurt!</b> Palamut çok lezzetliydi! (Toplam <b>${state.companion.fedCount}</b> kez besledin · <b>${esc(updatedSq.title)}</b> seninle büyüyor!)`;
      if (typeof window.shimejiSay === 'function') {
        window.shimejiSay(feedMsg, '🧡 Fındık Çok Mutlu!');
      }
      if (helperOut) {
        helperOut.style.display = 'block';
        helperOut.innerHTML = feedMsg;
      }
      triggerCompanionReaction(true);
    };
  }

  $$('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
}

/* ============================================================
   Dil Mantığı & Türkçe Rehber (Duolingo Tarzı Değil!)
   ============================================================ */
let currentLogicTab = 'all';
let currentLocoIdx = 0;

function screenLogic(param) {
  // URL parametresi veya hash parametresi varsa kategoriye ata
  if (param && LOGIC_CATEGORIES.some(c => c.id === param)) {
    currentLogicTab = param;
    currentLocoIdx = 0;
  } else {
    const hashQuery = location.hash.includes('?') ? location.hash.split('?')[1] : '';
    const q = new URLSearchParams(hashQuery || location.search);
    const catQ = q.get('cat') || q.get('category') || q.get('tab');
    if (catQ && LOGIC_CATEGORIES.some(c => c.id === catQ)) {
      currentLogicTab = catQ;
      currentLocoIdx = 0;
    }
    const exQ = q.get('example') || q.get('ex');
    if (exQ) {
      const pIdx = parseInt(exQ, 10) - 1;
      if (!isNaN(pIdx) && pIdx >= 0) currentLocoIdx = pIdx;
    }
  }

  const isAll = currentLogicTab === 'all';
  const filtered = isAll ? LOGIC_GUIDES : LOGIC_GUIDES.filter(g => g.category === currentLogicTab);
  
  // Aktif kategoriye ait simülatör ve örnekleri
  const curSim = (typeof getSimulatorForCategory === 'function' ? getSimulatorForCategory(currentLogicTab) : (typeof LOGIC_SIMULATORS !== 'undefined' ? (LOGIC_SIMULATORS[currentLogicTab] || LOGIC_SIMULATORS.mindset) : null)) || {
    id: 'mindset',
    title: '🚂 İngilizce Cümle Lokomotifi',
    badge: '⚡ CÜMLE DİZİLİM SİMÜLATÖRÜ',
    desc: 'İngilizce tren gibi düz gider: Özne ve Eylem hemen öne bağlanır, yer ve zaman vagonları arkaya dizilir!',
    examples: (typeof LOKOMOTIF_EXAMPLES !== 'undefined' ? LOKOMOTIF_EXAMPLES : [])
  };

  const simExamples = curSim.examples || [];
  if (currentLocoIdx < 0 || currentLocoIdx >= simExamples.length) {
    currentLocoIdx = 0;
  }
  const activeLoco = simExamples[currentLocoIdx] || simExamples[0];

  view().innerHTML = `
    <div class="page">
      <header class="page-head">
        <div>
          <h1>💡 Dil Mantığı & Türkçe Düşünce Rehberi</h1>
          <p class="muted">Ezber kurallar değil; Türk beyninin İngilizceyi doğal kavramasını sağlayan mantık ve tüyolar.</p>
        </div>
      </header>

      <!-- Kategori Filtre Butonları (Kategori seçimi doğrudan simülatörü de günceller) -->
      <div class="logic-tabs-bar" role="tablist" aria-label="Mantık ve Rehber Kategorileri">
        ${LOGIC_CATEGORIES.map(c => `
          <button class="logic-tab-pill ${currentLogicTab === c.id ? 'active' : ''}" 
                  data-cat="${c.id}" 
                  id="logic-tab-${c.id}"
                  role="tab"
                  aria-selected="${currentLogicTab === c.id ? 'true' : 'false'}"
                  aria-label="${esc(c.label)} kategorisi">
            ${c.label}
          </button>
        `).join('')}
      </div>

      <!-- İnteraktif Kategori & Cümle Simülatörü -->
      ${activeLoco ? `
        <div class="card loco-simulator-card" id="logicSimulatorCard" data-category="${curSim.id || currentLogicTab}" data-example="${currentLocoIdx + 1}">
          <div class="loco-head">
            <div>
              <span class="badge-loco" id="simBadge">${esc(curSim.badge || '⚡ İNTERAKTİF SİMÜLATÖR')}</span>
              <h2 style="margin:8px 0 4px;" id="simTitle">${esc(curSim.title || '🚂 İngilizce Cümle Lokomotifi')}</h2>
              <p class="muted small" style="margin:0;" id="simDesc">${esc(curSim.desc || '')}</p>
            </div>
            <div class="loco-nav-btns" role="tablist" aria-label="Simülatör Örnekleri" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              ${simExamples.map((ex, idx) => `
                <button class="loco-sel-btn ${currentLocoIdx === idx ? 'active' : ''}" 
                        data-lidx="${idx}" 
                        data-example="${idx + 1}" 
                        id="loco-example-${idx + 1}" 
                        aria-label="Örnek ${idx + 1}" 
                        aria-pressed="${currentLocoIdx === idx ? 'true' : 'false'}" 
                        aria-selected="${currentLocoIdx === idx ? 'true' : 'false'}" 
                        role="tab">
                  Örnek ${idx + 1}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="loco-box">
            <div class="loco-tr-row">
              <span class="loco-tr-label">🇹🇷 Türkçe Cümle:</span>
              <span class="loco-tr-text" id="locoTrText">"${esc(activeLoco.tr)}"</span>
            </div>

            <!-- Simülatör Parçaları / Token Haritası -->
            <div class="loco-train-track" id="locoTrainTrack">
              ${activeLoco.cars.map((car, i) => `
                <div class="loco-wagon-wrapper">
                  <div class="loco-wagon" style="--c:${car.color};">
                    <div class="wagon-tag">${esc(car.role)}</div>
                    <div class="wagon-en">${esc(car.en)}</div>
                    <div class="wagon-tr">${esc(car.tr)}</div>
                  </div>
                  ${i < activeLoco.cars.length - 1 ? '<div class="wagon-connector">➔</div>' : ''}
                </div>
              `).join('')}
            </div>

            <!-- Sonuç ve Sesli Dinleme -->
            <div class="loco-result-row">
              <div class="loco-result-text">
                <b>🇬🇧 İngilizce Sıralama:</b> <span class="loco-en-full" id="locoEnFull">${esc(activeLoco.fullEn)}</span>
              </div>
              <button class="btn btn-primary sm" id="locoSpeakBtn" data-say="${esc(activeLoco.fullEn)}" aria-label="Cümleyi sesli dinle">🔊 Sesli Dinle</button>
            </div>

            <div class="loco-tip" id="locoTip">
              💡 <b>Püf Noktası:</b> ${esc(activeLoco.explanation)}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Kategori Rehber Kartları -->
      <div class="logic-grid">
        ${filtered.map(g => `
          <div class="card logic-card" style="--c:${g.color}">
            <div class="logic-header">
              <span class="logic-emoji">${g.emoji}</span>
              <div>
                <h2>${esc(g.title)}</h2>
                <div class="muted small">${esc(g.sub)}</div>
              </div>
            </div>

            ${g.summary ? `<p class="logic-summary"><b>Özet:</b> ${esc(g.summary)}</p>` : ''}
            ${g.content ? `<div class="logic-body">${g.content}</div>` : ''}

            ${g.phrases ? `
              <div class="phrase-list">
                ${g.phrases.map(p => `
                  <div class="phrase-row">
                    <button class="speak-btn sm" data-say="${esc(p.en)}" aria-label="Örnek cümleyi dinle" title="Dinle">🔊</button>
                    <div class="phrase-texts">
                      <div class="phrase-en"><b>${esc(p.en)}</b></div>
                      <div class="phrase-tr">${esc(p.tr)}</div>
                      <div class="phrase-tip muted small">💡 ${esc(p.tip)}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${g.traps ? `
              <div class="trap-list">
                ${g.traps.map(t => `
                  <div class="trap-box">
                    <div class="trap-wrong"><span class="trap-badge-wrong">❌ Türkçe Düşünüş</span> <s>${esc(t.wrong)}</s></div>
                    <div class="trap-right">
                      <div><span class="trap-badge-right">✅ Doğru Mantık</span> <b>${esc(t.right)}</b></div>
                      <button class="speak-btn sm" data-say="${esc(t.right)}" aria-label="Doğru kullanımı dinle" title="Dinle">🔊</button>
                    </div>
                    <div class="trap-why">${esc(t.why)}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>`;

  function updateLocoSimulator(idx) {
    const curSim = (typeof getSimulatorForCategory === 'function' ? getSimulatorForCategory(currentLogicTab) : (typeof LOGIC_SIMULATORS !== 'undefined' ? (LOGIC_SIMULATORS[currentLogicTab] || LOGIC_SIMULATORS.mindset) : null)) || { examples: (typeof LOKOMOTIF_EXAMPLES !== 'undefined' ? LOKOMOTIF_EXAMPLES : []) };
    const list = curSim.examples || [];
    if (!list.length) return;
    currentLocoIdx = Math.max(0, Math.min(idx, list.length - 1));
    const activeLoco = list[currentLocoIdx];
    if (!activeLoco) return;

    const card = $('#logicSimulatorCard');
    if (card) {
      card.setAttribute('data-example', String(currentLocoIdx + 1));
      card.setAttribute('data-category', curSim.id || currentLogicTab);
    }

    $$('.loco-sel-btn').forEach(btn => {
      const bIdx = parseInt(btn.dataset.lidx, 10);
      const isActive = bIdx === currentLocoIdx;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const selectEl = $('#locoExampleSelect');
    if (selectEl && selectEl.value !== String(currentLocoIdx)) {
      selectEl.value = String(currentLocoIdx);
    }

    const box = $('.loco-box');
    if (box) {
      box.innerHTML = `
        <div class="loco-tr-row">
          <span class="loco-tr-label">🇹🇷 Türkçe Cümle:</span>
          <span class="loco-tr-text" id="locoTrText">"${esc(activeLoco.tr)}"</span>
        </div>

        <div class="loco-train-track" id="locoTrainTrack">
          ${activeLoco.cars.map((car, i) => `
            <div class="loco-wagon-wrapper">
              <div class="loco-wagon" style="--c:${car.color};">
                <div class="wagon-tag">${esc(car.role)}</div>
                <div class="wagon-en">${esc(car.en)}</div>
                <div class="wagon-tr">${esc(car.tr)}</div>
              </div>
              ${i < activeLoco.cars.length - 1 ? '<div class="wagon-connector">➔</div>' : ''}
            </div>
          `).join('')}
        </div>

        <div class="loco-result-row">
          <div class="loco-result-text">
            <b>🇬🇧 İngilizce Sıralama:</b> <span class="loco-en-full" id="locoEnFull">${esc(activeLoco.fullEn)}</span>
          </div>
          <button class="btn btn-primary sm" id="locoSpeakBtn" data-say="${esc(activeLoco.fullEn)}" aria-label="Cümleyi sesli dinle">🔊 Sesli Dinle</button>
        </div>

        <div class="loco-tip" id="locoTip">
          💡 <b>Püf Noktası:</b> ${esc(activeLoco.explanation)}
        </div>
      `;
      box.querySelectorAll('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
    }
  }

  window.updateLocoSimulator = updateLocoSimulator;

  // Kategori Değiştirme Fonksiyonu
  const onCategoryChange = (cat) => {
    if (!cat) return;
    currentLogicTab = cat;
    currentLocoIdx = 0; // Kategori değiştiğinde 1. örnekle başla
    screenLogic();
  };

  const tabsBar = $('.logic-tabs-bar');
  if (tabsBar) {
    tabsBar.addEventListener('click', e => {
      const btn = e.target.closest('.logic-tab-pill');
      if (btn && btn.dataset.cat) onCategoryChange(btn.dataset.cat);
    });
  }
  $$('.logic-tab-pill').forEach(btn => {
    btn.onclick = () => onCategoryChange(btn.dataset.cat);
  });

  // Lokomotif Örnek Seçici (Delegasyon, doğrudan tıklama ve pointer desteği)
  const onExampleSelect = (idx) => {
    if (!isNaN(idx)) {
      currentLocoIdx = idx;
      updateLocoSimulator(idx);
    }
  };

  const navBtns = $('.loco-nav-btns');
  if (navBtns) {
    navBtns.addEventListener('click', e => {
      const btn = e.target.closest('.loco-sel-btn');
      if (btn) onExampleSelect(parseInt(btn.dataset.lidx, 10));
    });
  }
  $$('.loco-sel-btn').forEach(btn => {
    const handler = () => {
      onExampleSelect(parseInt(btn.dataset.lidx, 10));
    };
    btn.onclick = handler;
    btn.onpointerdown = handler;
  });

  // Sesli Telaffuz Butonları
  $$('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
}

function screenLeaderboard() {
  if (state.leagueRoomId) {
    syncCloudLeague().then(() => {
      if (location.hash.split('?')[0] === '#/leaderboard') renderLeaderboardView();
    }).catch(() => {});
  }
  renderLeaderboardView();
}

function renderLeaderboardView() {
  const list = getLeaderboardList();
  const myRank = list.findIndex(u => u.isMe) + 1;
  const isCloud = !!state.leagueRoomId;
  const syncStat = typeof getLeagueSyncStatus === 'function' ? getLeagueSyncStatus() : { status: navigator.onLine ? 'synced' : 'offline', text: navigator.onLine ? '🟢 Skorlar Güncel' : '📡 Çevrimdışı' };
  const myCode = generateShareCode();
  const inviteLink = isCloud ? `${location.origin}${location.pathname}#/leaderboard?room=${state.leagueRoomId}` : '';

  view().innerHTML = `
    <div class="page">
      <header class="page-head">
        <div>
          <h1>🏆 Liderlik Tablosu & Rekabet</h1>
          <p class="muted">${isCloud ? '🟢 Canlı senkronize ligdesiniz. Skorlar anlık olarak güncellenir.' : 'Arkadaşlarınla yarış, XP topla, liderliği kap!'}</p>
        </div>
        ${isCloud ? `
          <div class="row-gap">
            <button class="btn btn-ghost sm" id="refreshLeagueBtn">🔄 Canlı Yenile</button>
            <button class="btn btn-ghost sm" id="leaveLeagueBtn" title="Ligden Ayrıl">🚪 Ligden Ayrıl</button>
          </div>
        ` : ''}
      </header>

      <!-- Otomatik Senkronizasyon Durum Çubuğu -->
      <div class="sync-status-bar">
        <div>
          <span class="status-pill ${syncStat.status}">${esc(syncStat.text)}</span>
        </div>
        ${isCloud ? `<span class="badge-room">🏆 Lig Odası: <b>#${esc(state.leagueRoomId.slice(0, 8))}</b></span>` : ''}
      </div>

      <!-- Canlı Lig Durumu veya Oluşturma Kartı -->
      ${isCloud ? `
        <div class="card cloud-league-card">
          <div class="cl-head">
            <div class="cl-icon">🟢</div>
            <div class="cl-info">
              <b>Canlı Yarışma Ligi Aktif!</b>
              <p class="muted small">Sen veya arkadaşın ders yaptıkça puanlar otomatik olarak senkronize olur. Kod kopyalayıp göndermekle uğraşmanıza gerek yoktur!</p>
            </div>
          </div>
          <div class="type-row" style="margin-top:12px;">
            <input class="text-input" value="${inviteLink}" readonly id="leagueInviteIn" />
            <button class="btn btn-primary" id="copyInviteBtn">📲 Davet Linkini Kopyala</button>
          </div>
          <p class="muted small" style="margin-top:8px;">✨ <b>Otomatik Katılım:</b> Bu linki WhatsApp'tan arkadaşına gönder! Linke tıkladığı anda hiçbir kod yazmasına gerek kalmadan <b>doğrudan senin ligine bağlanır</b> ve ikinizin puanları canlı güncellenir.</p>
        </div>
      ` : `
        <div class="card live-promo-card">
          <span class="badge-live">⚡ YENİ & ANLIK SENKRONİZE</span>
          <h3 style="margin:8px 0 6px;">Arkadaşınla Canlı Lige Başla!</h3>
          <p class="muted small" style="margin:0 0 14px;">Artık her dersten sonra arkadaşına kod atmak zorunda değilsin! Canlı Lig kurun; sen veya arkadaşın ders yaptıkça skorlar <b>otomatik olarak</b> güncellensin.</p>
          <div class="row-gap">
            <button class="btn btn-primary" id="createLeagueBtn">✨ Yeni Canlı Lig Kur</button>
            <button class="btn btn-ghost" id="showJoinModalBtn">🔗 Bir Lige Katıl</button>
          </div>
        </div>
      `}

      <div class="grid-2">
        <div class="card ranking-card">
          <div class="row-between">
            <h3>🥇 Sıralama ${isCloud ? '<span class="live-pill">CANLI</span>' : ''}</h3>
            <span class="badge-rank">Sıran: #${myRank > 0 ? myRank : 1}</span>
          </div>

          <div class="leaderboard-list">
            ${list.map((u, i) => `
              <div class="lb-row ${u.isMe ? 'is-me' : ''}">
                <div class="lb-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</div>
                <div class="lb-avatar">${u.avatar || '🧑'}</div>
                <div class="lb-details">
                  <div class="lb-name">
                    <span class="lb-uname">${esc(u.name)}</span>
                    ${u.isMe ? '<span class="tag-me">SEN</span>' : ''}
                  </div>
                  <div class="lb-sub muted small">🔥 ${u.streak || 0} gün · 🏅 ${u.unitsDone || 0} ünite</div>
                </div>
                <div class="lb-xp"><b>${u.xp}</b> <span>XP</span></div>
                ${!u.isMe && !isCloud ? `<button class="btn btn-ghost sm delete-friend-btn" data-name="${esc(u.name)}" title="Arkadaşı Kaldır">✕</button>` : ''}
              </div>
            `).join('')}
          </div>
          ${list.length <= 1 ? `
            <div class="empty-friends-box">
              <p class="muted small center" style="margin:0;">Henüz bu ligde başka arkadaşın yok. ${isCloud ? 'Yukarıdaki davet linkini arkadaşına göndererek birlikte yarışmaya başla! 🚀' : 'Arkadaşınla canlı lig kurarak ya da kodlaşarak rekabete katılabilirsin!'}</p>
            </div>
          ` : ''}
        </div>

        <details class="card share-card" style="margin-top:14px;cursor:pointer;">
          <summary style="font-weight:800;color:var(--text);padding:4px 0;outline:none;">📦 Çevrimdışı Arkadaş Kodu Paylaşımı (Tıkla ve Aç)</summary>
          <p class="muted small" style="margin-top:10px;">İnternetsiz ortamlarda arkadaşınla kod paylaşarak skorunu listeye ekleyebilirsin.</p>

          <div class="offline-sync-notice" style="margin:10px 0 14px;padding:12px 14px;background:color-mix(in srgb, var(--primary) 10%, var(--card-bg, #fff));border-radius:14px;border:1px solid var(--line);font-size:0.85rem;color:var(--text);line-height:1.45;">
            💡 <b>Otomatik Senkronizasyon:</b> Çevrimdışı çalıştığında tüm XP ve ünitelerin cihazında saklanır. Cihazın internete bağlandığı anda puanların otomatik olarak buluta ve canlı lige aktarılır.
          </div>

          <div class="code-box">
            <label class="lbl">Senin Tek Seferlik Kodun (Anlık Skor):</label>
            <div class="type-row">
              <input id="myShareCode" class="text-input" value="${myCode}" readonly />
              <button class="btn btn-secondary sm" id="copyCodeBtn">${icon('copy', '', 16)} Kopyala</button>
            </div>
          </div>

          <hr class="divider" />

          <div class="code-box">
            <label class="lbl">Arkadaşının Kodunu Ekle / Güncelle:</label>
            <div class="type-row">
              <input id="friendCodeIn" class="text-input" placeholder="Arkadaşının sana attığı kodu buraya yapıştır..." />
              <button class="btn btn-secondary sm" id="importCodeBtn">${icon('check', '', 16)} Ekle / Güncelle</button>
            </div>
          </div>
        </details>
      </div>
    </div>`;

  if ($('#copyInviteBtn')) {
    $('#copyInviteBtn').onclick = () => {
      const url = $('#leagueInviteIn').value;
      navigator.clipboard.writeText(url).then(() => {
        toast('Davet linki kopyalandı! 📲 Arkadaşına gönder');
      }).catch(() => {
        $('#leagueInviteIn').select();
        document.execCommand('copy');
        toast('Davet linki kopyalandı! 📲');
      });
    };
  }

  if ($('#refreshLeagueBtn')) {
    $('#refreshLeagueBtn').onclick = async () => {
      const btn = $('#refreshLeagueBtn');
      btn.disabled = true;
      btn.textContent = '🔄 Senkronize ediliyor...';
      try {
        await syncCloudLeague();
        toast('Canlı skorlar eşitlendi ve güncellendi! ✅');
      } catch (e) {
        toast('Senkronizasyon bildirimi: ' + e.message);
      } finally {
        renderLeaderboardView();
      }
    };
  }

  if ($('#leaveLeagueBtn')) {
    $('#leaveLeagueBtn').onclick = async () => {
      if (confirm('Canlı ligden ayrılmak istediğinden emin misin?')) {
        await leaveCloudLeague();
        toast('Ligden ayrıldın.');
        renderLeaderboardView();
      }
    };
  }

  if ($('#createLeagueBtn')) {
    $('#createLeagueBtn').onclick = async () => {
      const btn = $('#createLeagueBtn');
      btn.disabled = true;
      btn.textContent = '⏳ Kuruluyor...';
      try {
        await createCloudLeague();
        toast('🎉 Canlı Yarışma Ligi kuruldu! Davet linkini arkadaşına gönder.');
      } catch (err) {
        toast(err.message);
      }
      renderLeaderboardView();
    };
  }

  if ($('#showJoinModalBtn')) {
    $('#showJoinModalBtn').onclick = () => {
      openModal(`
        <div class="modal-head">
          <div class="modal-emoji">🔗</div>
          <div>
            <h2>Lige Katıl</h2>
            <p class="muted small">Arkadaşının lig kodunu veya davet linkini yapıştır.</p>
          </div>
        </div>
        <div style="margin: 16px 0;">
          <input type="text" id="joinRoomIn" class="text-input" placeholder="Lig Kodu veya https://... davet linki" autofocus />
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" id="confirmJoinLeagueBtn">🚀 Lige Katıl</button>
          <button class="btn btn-ghost" id="cancelJoinLeagueBtn">Vazgeç</button>
        </div>
      `);
      $('#cancelJoinLeagueBtn').onclick = closeModal;
      $('#confirmJoinLeagueBtn').onclick = () => {
        const input = ($('#joinRoomIn').value || '').trim();
        if (!input) return toast('Lütfen bir kod veya link gir!');
        let roomId = input;
        if (roomId.includes('room=')) {
          roomId = roomId.split('room=')[1].split('&')[0];
        }
        closeModal();
        joinCloudLeague(roomId).then(() => {
          toast('🎉 Lige başarıyla katıldın!');
          renderLeaderboardView();
        }).catch(err => {
          toast('Katılma hatası: ' + err.message);
        });
      };
    };
  }

  if ($('#copyCodeBtn')) {
    $('#copyCodeBtn').onclick = () => {
      navigator.clipboard.writeText($('#myShareCode').value).then(() => {
        toast('Yarışma kodun kopyalandı! 📋 Arkadaşına gönder');
      }).catch(() => {
        $('#myShareCode').select();
        document.execCommand('copy');
        toast('Kod kopyalandı! 📋');
      });
    };
  }

  if ($('#importCodeBtn')) {
    $('#importCodeBtn').onclick = () => {
      const val = $('#friendCodeIn').value.trim();
      if (!val) return;
      try {
        const addedName = importFriendFromCode(val);
        toast(`${addedName} başarıyla sıralamaya eklendi! 🎉`);
        renderLeaderboardView();
      } catch (err) {
        toast(err.message);
      }
    };
  }

  $$('.delete-friend-btn').forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.name;
      if (confirm(`${name} sıralamadan kaldırılsın mı?`)) {
        removeFriend(name);
        renderLeaderboardView();
      }
    };
  });
}
let currentLearnWorld = null;

function screenLearn() {
  if (!currentLearnWorld) {
    currentLearnWorld = state.a2Unlocked ? 'A2' : 'A1';
  }
  const doneA1 = UNITS.filter(u => u.level === 'A1' && unitStats(u.id).done).length;
  const doneA2 = UNITS.filter(u => u.level === 'A2' && unitStats(u.id).done).length;
  const pctA1 = Math.round((doneA1 / 27) * 100);
  const pctA2 = Math.round((doneA2 / 25) * 100);
  const curMascot = mascotService.getActive();
  const isA1 = currentLearnWorld === 'A1';
  const unitsToShow = UNITS.filter(u => u.level === (isA1 ? 'A1' : 'A2'));

  // Pedagojik Yol Aşamaları & Yoldaş Rehberler (Öğrenme odaklı kilometre taşları)
  const STAGE_DIVIDERS = isA1 ? {
    0: {
      tag: 'Aşama 1 / 3 · A1 Temelleri',
      title: '🌱 İlk Cümleler & Temel İletişim',
      sub: 'Tanışma, günlük nesneler ve "to be" / varlık cümlelerinin mantığı.',
      guideIcon: '🐿️',
      guideName: 'Fındık Rehberliğinde'
    },
    9: {
      tag: 'Aşama 2 / 3 · Rutinler & Zaman',
      title: '🏡 Günlük Yaşam & Alışkanlıklar',
      sub: 'Geniş zaman (Present Simple), saatler, sayılar ve rutin aktiviteler.',
      guideIcon: '🐱',
      guideName: 'Pamuk Rehberliğinde'
    },
    18: {
      tag: 'Aşama 3 / 3 · Sosyal Hayat',
      title: '💬 Akıcı Diyaloglar & Soru Kalıpları',
      sub: 'Soru sorma, yer-yön tarifleri, tercihler ve A1 Final Hazırlığı.',
      guideIcon: '🐶',
      guideName: 'Dost Rehberliğinde'
    }
  } : {
    0: {
      tag: 'Aşama 1 / 3 · Geçmiş Zaman',
      title: '⏳ Geçmiş Zaman (Past Tense) & Anılar',
      sub: 'Was/were, düzenli ve düzensiz geçmiş fiillerle olay anlatımı.',
      guideIcon: '🐼',
      guideName: 'Bambu Rehberliğinde'
    },
    9: {
      tag: 'Aşama 2 / 3 · Gelecek & Seyahat',
      title: '✈️ Gelecek Planları & Seyahat İngilizcesi',
      sub: 'Will, be going to, bilet alma, otel & restoranda akıcı konuşma.',
      guideIcon: '🦉',
      guideName: 'Bilge Rehberliğinde'
    },
    18: {
      tag: 'Aşama 3 / 3 · İleri A2 Ustalığı',
      title: '🏆 İleri Kalıplar & Seviye Tamamlama',
      sub: 'Karşılaştırmalar (Comparatives), bağlaçlar, zarflar ve A2 Finali.',
      guideIcon: '👑',
      guideName: 'Ustalık Aşaması'
    }
  };

  view().innerHTML = `
    <div class="page">
      <header class="page-head">
        <div>
          <h1>🗺️ Macera Haritası</h1>
          <p class="muted">Her üniteyi <b>%70</b> ve üzeri başarıyla tamamlayarak yol boyunca ilerle.</p>
        </div>
        <a class="btn btn-ghost" href="#/placement">📝 Seviye Testi</a>
      </header>

      <!-- Dünya Seçici Sekmeleri (Candy Crush Chapters) -->
      <div class="world-tabs" style="display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap;">
        <button class="btn ${isA1 ? 'btn-primary' : 'btn-secondary'} flex-1" id="tabWorldA1" style="font-weight:800;padding:12px 14px;border-radius:14px;display:flex;align-items:center;justify-content:center;gap:8px;">
          <span>🌱</span>
          <div style="text-align:left;">
            <div>Dünya 1: A1 Başlangıç</div>
            <div class="muted small" style="font-weight:600;font-size:0.75rem;color:${isA1 ? 'rgba(255,255,255,0.9)' : 'var(--muted)'};">${doneA1} / 27 Ünite · %${pctA1}</div>
          </div>
        </button>
        <button class="btn ${!isA1 ? 'btn-primary' : 'btn-secondary'} flex-1" id="tabWorldA2" style="font-weight:800;padding:12px 14px;border-radius:14px;display:flex;align-items:center;justify-content:center;gap:8px;">
          <span>${state.a2Unlocked ? '🚀' : '🔒'}</span>
          <div style="text-align:left;">
            <div>Dünya 2: A2 Macera</div>
            <div class="muted small" style="font-weight:600;font-size:0.75rem;color:${!isA1 ? 'rgba(255,255,255,0.9)' : 'var(--muted)'};">${state.a2Unlocked ? `${doneA2} / 25 Ünite · %${pctA2}` : 'A1 Sonrası (Tıkla & Aç)'}</div>
          </div>
        </button>
      </div>

      <!-- Aktif Dünya Kartı -->
      ${isA1 ? `
        <div class="card world-card">
          <div class="world-head">
            <div>
              <div class="muted small" style="font-weight:800;letter-spacing:0.5px;">DÜNYA 1 / 2 · A1 TEMEL İNGİLİZCE</div>
              <div class="world-title">🌍 Başlangıç Dünyası</div>
            </div>
            <div class="world-badge">${state.a1BossPassed ? '👑' : curMascot.icon}</div>
          </div>
          <p class="muted small" style="margin:8px 0 12px;">Tüm A1 ünitelerini tamamladığında <b>A1 Seviye Final Sınavı</b> açılır ve başarıyla bitirdiğinde <b>A2 Seviyesi</b>'ne geçiş yapabilirsin.</p>
          <div class="progress" style="height:10px;"><div class="bar rainbow" style="width:${pctA1}%"></div></div>
          <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:800;color:var(--muted);margin-top:6px;">
            <span>${doneA1} / 27 Ünite Tamamlandı</span>
            <span>%${pctA1}</span>
          </div>
        </div>
      ` : `
        <div class="card world-card" style="border-color:var(--primary);">
          <div class="world-head">
            <div>
              <div class="muted small" style="font-weight:800;letter-spacing:0.5px;">DÜNYA 2 / 2 · A2 İLERİ ADIMLAR</div>
              <div class="world-title">🚀 A2 Macera Dünyası</div>
            </div>
            <div class="world-badge">${state.a2BossPassed ? '👑' : state.a2Unlocked ? '🌟' : '🔒'}</div>
          </div>
          <p class="muted small" style="margin:8px 0 12px;">Geçmiş zaman (was/were, düzenli/düzensiz fiiller), büyük sayılar & tarihler, gelecek planları, seyahat, restoran ve akıcı diyaloglar!</p>
          <div class="progress" style="height:10px;"><div class="bar rainbow" style="width:${pctA2}%"></div></div>
          <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:800;color:var(--muted);margin-top:6px;">
            <span>${doneA2} / 25 Ünite Tamamlandı</span>
            <span>%${pctA2}</span>
          </div>
          ${!state.a2Unlocked ? `
            <div style="margin-top:12px;padding:10px 14px;border-radius:12px;background:color-mix(in srgb, var(--primary) 12%, transparent);border:1px dashed var(--primary);font-size:0.85rem;">
              💡 <b>A2 Macera Dünyası:</b> A1 Seviyesindeki 27 üniteyi tamamlayıp A1 Final Sınavı'nı geçtiğinde bu dünya açılacaktır.
            </div>
          ` : ''}
        </div>
      `}

      <!-- Ünite Yolu (Candy Crush Path) -->
      <div class="path">
        ${unitsToShow.map((u, i) => {
          const s = unitStats(u.id);
          const unlocked = isUnlocked(u.index);
          const offset = Math.round(Math.sin(i * 0.9) * 110);
          const stage = STAGE_DIVIDERS[i];
          const stageHtml = stage ? `
            <div class="path-stage-divider">
              <div class="psd-header">
                <span class="psd-tag">${stage.tag}</span>
                <span class="psd-guide">${stage.guideIcon} ${stage.guideName}</span>
              </div>
              <div class="psd-title">${stage.title}</div>
              <div class="psd-sub">${stage.sub}</div>
            </div>
          ` : '';
          return `
            ${stageHtml}
            <div class="path-row" style="--x:${offset}px">
              <button class="node ${unlocked ? '' : 'locked'} ${s.done ? 'done' : ''} ${nextUnit()?.id === u.id ? 'current' : ''}" data-id="${u.id}" style="--c:${u.color}" aria-label="${esc(u.title)} ünitesi (${unlocked ? (s.done ? 'tamamlandı' : 'açık') : 'kilitli'})">
                <span class="node-emoji">${unlocked ? u.emoji : '🔒'}</span>
                ${s.done ? `<span class="node-star">⭐</span>` : ''}
              </button>
              <div class="node-label">
                <b>${esc(u.title)}</b>
                <span>${u.type === 'vocab' ? '📗 Kelime' : '📘 Gramer'}${s.attempts ? ` · %${s.best}` : ''}</span>
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- Seviye Finali Bannerları -->
      ${isA1 ? (() => {
        const allDone = doneA1 >= 27;
        if (state.a1BossPassed) {
          return `
            <div class="boss-banner">
              <div class="boss-emoji">👑</div>
              <div class="boss-title">A1 Seviye Finali Tamamlandı!</div>
              <div class="boss-sub">Tebrikler! A1 seviyesini başarıyla bitirdin ve A2 Dünyası'nın kilidini açtın.</div>
              <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;flex-wrap:wrap;">
                <button class="btn btn-primary" id="goWorldA2Btn">🚀 A2 Dünyası Haritasına Geç</button>
                <a class="btn btn-secondary" href="#/boss-a1">${icon('repeat', '', 18)} Final Sınavını Tekrar Çöz</a>
              </div>
            </div>
          `;
        }
        if (allDone) {
          return `
            <div class="boss-banner">
              <div class="boss-emoji">⚔️</div>
              <div class="boss-title">A1 Seviye Final Sınavı Hazır!</div>
              <div class="boss-sub">Tüm A1 ünitelerini tamamladın. 15 soruluk final sınavını %75 ve üzeri başarıyla tamamlayıp A2 seviyesine geç!</div>
              <a class="btn btn-primary btn-big" href="#/boss-a1">🔥 Final Sınavına Başla</a>
            </div>
          `;
        }
        return `
          <div class="boss-banner locked">
            <div class="boss-emoji">🔒</div>
            <div class="boss-title">A1 Seviye Final Sınavı</div>
            <div class="boss-sub">A1 seviyesindeki tüm üniteleri tamamladığında bu sınav açılır (${doneA1}/27 ünite tamamlandı).</div>
          </div>
        `;
      })() : (() => {
        const allDone = doneA2 >= 25;
        if (state.a2BossPassed) {
          return `
            <div class="boss-banner">
              <div class="boss-emoji">👑</div>
              <div class="boss-title">A2 Seviye Finali Tamamlandı!</div>
              <div class="boss-sub">Muhteşem! A2 Macera Dünyası'nı başarıyla tamamladın ve A2 Ustalık Rozeti kazandın!</div>
              <a class="btn btn-secondary" href="#/boss-a2">${icon('repeat', '', 18)} A2 Finalini Tekrar Çöz</a>
            </div>
          `;
        }
        if (allDone && state.a2Unlocked) {
          return `
            <div class="boss-banner">
              <div class="boss-emoji">⚔️</div>
              <div class="boss-title">A2 Seviye Final Sınavı Hazır!</div>
              <div class="boss-sub">Tüm A2 ünitelerini tamamladın! 15 soruluk final sınavını %75 ve üzeri başarıyla tamamlayıp A2 rozetini kap!</div>
              <a class="btn btn-primary btn-big" href="#/boss-a2">🔥 A2 Final Sınavına Başla</a>
            </div>
          `;
        }
        return `
          <div class="boss-banner locked">
            <div class="boss-emoji">🔒</div>
            <div class="boss-title">A2 Seviye Final Sınavı</div>
            <div class="boss-sub">A2 seviyesindeki tüm üniteleri tamamladığında bu sınav açılır (${doneA2}/25 ünite tamamlandı).</div>
          </div>
        `;
      })()}
    </div>`;

  $('#tabWorldA1').onclick = () => { currentLearnWorld = 'A1'; screenLearn(); };
  $('#tabWorldA2').onclick = () => { currentLearnWorld = 'A2'; screenLearn(); };
  if ($('#goWorldA2Btn')) $('#goWorldA2Btn').onclick = () => { currentLearnWorld = 'A2'; screenLearn(); };

  $$('.node').forEach(n => n.onclick = () => unitModal(UNIT_BY_ID[n.dataset.id]));
  const cur = $('.node.current');
  if (cur) setTimeout(() => cur.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
}

/* ============================================================
   A1 Seviye Final Sınavı (A1 Boss Test)
   ============================================================ */
function screenA1Boss() {
  const start = () => runLesson({
    title: '👑 A1 Seviye Final Sınavı',
    questions: buildA1BossTest(),
    color: '#FCC419',
    exitTo: '#/learn',
    retry: start,
    onFinish: (results, { correct, total, pct }) => {
      if (pct >= 75) {
        store.passA1Boss();
        return {
          xp: 200,
          exitTo: '#/learn',
          message: `🎉 <b>TEBRİKLER! %${pct} Başarı ile A1 Seviyesini Tamamladın!</b><br>+200 XP Kazandın ve 🚀 <b>A2 Dünyası'nın kilidini açtın!</b>`
        };
      } else {
        const earnedXP = correct * 5;
        addXP(earnedXP);
        return {
          xp: earnedXP,
          exitTo: '#/learn',
          message: `Final sınavında %${pct} aldın (${correct}/${total}). Kilidi açmak için en az <b>%75</b> alman gerekiyor. Biraz tekrar yapıp tekrar dene! 💪`
        };
      }
    }
  });
  start();
}

/* ============================================================
   A2 Seviye Final Sınavı (A2 Boss Test)
   ============================================================ */
function screenA2Boss() {
  const start = () => runLesson({
    title: '👑 A2 Seviye Final Sınavı',
    questions: buildA2BossTest(),
    color: '#339AF0',
    exitTo: '#/learn',
    retry: start,
    onFinish: (results, { correct, total, pct }) => {
      if (pct >= 75) {
        store.passA2Boss();
        return {
          xp: 300,
          exitTo: '#/learn',
          message: `🎉 <b>EFSANEVİ BAŞARI! %${pct} ile A2 Seviyesini Tamamladın!</b><br>+300 XP Kazandın ve 👑 <b>A2 İngilizce Ustalık Rozeti</b> aldın!`
        };
      } else {
        const earnedXP = correct * 5;
        addXP(earnedXP);
        return {
          xp: earnedXP,
          exitTo: '#/learn',
          message: `A2 Final sınavında %${pct} aldın (${correct}/${total}). Başarı için en az <b>%75</b> gerekiyor. A2 ünitelerini tekrar edip tekrar dene! 💪`
        };
      }
    }
  });
  start();
}

function renderUnitProgressionCard(u) {
  const s = unitStats(u.id);
  const unlocked = isUnlocked(u.index) && (u.level === 'A1' || state.a2Unlocked);
  const lvl = levelInfo();
  const levelUnits = UNITS.filter(x => x.level === u.level);
  const chapterNum = levelUnits.findIndex(x => x.id === u.id) + 1;
  const doneInLevel = levelUnits.filter(x => unitStats(x.id).done).length;
  const levelPct = Math.round((doneInLevel / levelUnits.length) * 100);
  const prevU = u.index > 0 ? UNITS[u.index - 1] : null;
  const nextU = u.index < UNITS.length - 1 ? UNITS[u.index + 1] : null;
  const activeU = nextUnit() || UNITS[0];
  const unitUrl = x => x.type === 'vocab' ? `#/cards/${x.id}` : `#/grammar/${x.id}`;

  return `
    <div class="card chapter-progression-card" id="chapterProgressionCard" style="margin-bottom:16px;border-left:4px solid ${u.color};">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
        <div>
          <div class="muted small" style="font-weight:700;">📚 Bölüm İlerlemesi (Chapter Progression)</div>
          <h3 style="margin:2px 0 0;font-size:1.05rem;">Bölüm ${chapterNum} / ${levelUnits.length} · ${u.level} Müfredatı (${esc(u.title)})</h3>
        </div>
        <span class="badge" style="font-weight:800;background:${unlocked ? 'var(--primary)' : 'var(--card-hover)'};color:${unlocked ? '#fff' : 'var(--text)'};">
          ${unlocked ? (s.done ? '✅ Tamamlandı' : '🔓 Açık Bölüm') : '🔒 Kilitli Bölüm'}
        </span>
      </div>

      <div style="background:var(--card-hover);padding:12px;border-radius:10px;border:1px solid var(--border);margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:6px;font-size:0.88rem;">
          <span><b>${u.level} Bölüm İlerlemesi:</b> ${doneInLevel} / ${levelUnits.length} Bölüm (%${levelPct})</span>
          <span><b>Bu Ünite Skoru:</b> %${s.best} (${s.attempts} deneme)</span>
        </div>
        <div class="progress thick" style="margin-bottom:6px;"><div class="bar rainbow" style="width:${levelPct}%;"></div></div>
        <div class="muted small">Genel Kurs Tamamlama: <b>${lvl.done} / ${UNITS.length} Ünite (%${lvl.pct})</b> tamamlandı.</div>
      </div>

      ${!unlocked ? `
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding:10px 12px;border-radius:10px;background:color-mix(in srgb, var(--primary) 8%, var(--card-bg, #fff));margin-bottom:10px;">
          <div class="small">
            🔒 <b>Bu bölümün alıştırmaları henüz kilitli.</b> Konu anlatımını ve örnekleri inceleyebilirsin; alıştırmaları açmak için sıradaki açık bölümü tamamla${prevU ? ` (Önceki bölüm: <b>${esc(prevU.title)}</b>)` : ''}.
          </div>
          <a class="btn btn-primary sm" href="#/lesson/${activeU.id}">▶ Sıradaki Açık Bölüme Git: ${esc(activeU.title)}</a>
        </div>
      ` : ''}

      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        ${prevU ? `<a class="btn btn-ghost sm" href="${unitUrl(prevU)}">← Önceki Bölüm: ${esc(prevU.title)}</a>` : '<span></span>'}
        <a class="btn btn-ghost sm" href="#/learn">🗺️ Öğrenme Haritası (${doneInLevel}/${levelUnits.length})</a>
        ${nextU ? `<a class="btn btn-ghost sm" href="${unitUrl(nextU)}">Sonraki Bölüm: ${esc(nextU.title)} →</a>` : '<span></span>'}
      </div>
    </div>`;
}

function unitModal(u) {
  const s = unitStats(u.id);
  const unlocked = isUnlocked(u.index);
  const levelUnits = UNITS.filter(x => x.level === u.level);
  const chapterNum = levelUnits.findIndex(x => x.id === u.id) + 1;
  const doneInLevel = levelUnits.filter(x => unitStats(x.id).done).length;
  const levelPct = Math.round((doneInLevel / levelUnits.length) * 100);

  openModal(`
    <div class="modal-head" style="--c:${u.color}">
      <div class="modal-emoji">${u.emoji}</div>
      <div>
        <div class="muted small" style="font-weight:700;">Bölüm ${chapterNum} / ${levelUnits.length} · ${u.level} Müfredatı</div>
        <h2>${esc(u.title)}</h2>
        <div class="muted">${esc(u.en)} · ${u.type === 'vocab' ? `${u.words.length} kelime` : 'Gramer'}</div>
      </div>
    </div>
    <div class="modal-stats">
      <div><b>%${s.best}</b><span>en iyi</span></div>
      <div><b>${s.attempts}</b><span>deneme</span></div>
      <div><b>${unlocked ? (s.done ? '✅' : '🔓') : '🔒'}</b><span>durum</span></div>
    </div>
    <div style="background:var(--card-hover);padding:10px 12px;border-radius:10px;margin:10px 0;">
      <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:4px;">
        <span>📚 Bölüm İlerlemesi (${u.level})</span>
        <b>${doneInLevel} / ${levelUnits.length} (%${levelPct})</b>
      </div>
      <div class="progress"><div class="bar rainbow" style="width:${levelPct}%;"></div></div>
    </div>
    ${unlocked ? `
      <div class="modal-actions">
        ${u.type === 'vocab' ? `<a class="btn btn-secondary" href="#/cards/${u.id}">${icon('cards', '', 16)} Kelime Kartları</a>` : `<a class="btn btn-secondary" href="#/grammar/${u.id}">📖 Konu Anlatımı</a>`}
        <a class="btn btn-big btn-primary" href="#/lesson/${u.id}">▶ ${s.attempts ? 'Tekrar Çalış' : 'Derse Başla'}</a>
      </div>` : `
      <p class="muted center">Bu ünite henüz kilitli 🔒 Önceki üniteleri tamamlayarak sırayla ilerle!</p>
      <div class="modal-actions" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
        ${u.type === 'vocab' ? `<a class="btn btn-secondary" href="#/cards/${u.id}">${icon('cards', '', 16)} Kartlara göz at</a>` : `<a class="btn btn-secondary" href="#/grammar/${u.id}">📖 Konuya göz at</a>`}
      </div>`}
  `);
}

/* ============================================================
   Ders
   ============================================================ */
function screenLesson(id) {
  const u = UNIT_BY_ID[id];
  if (!u) { location.hash = '#/learn'; return; }
  if (!isUnlocked(u.index)) {
    toast('Bu ünite henüz kilitli 🔒 Konu özetini ve bölüm ilerlemesini inceleyebilirsin.');
    location.hash = u.type === 'vocab' ? `#/cards/${u.id}` : `#/grammar/${u.id}`;
    return;
  }
  const start = () => runLesson({
    title: `${u.emoji} ${u.title}`,
    questions: buildUnitLesson(u),
    color: u.color,
    exitTo: '#/learn',
    retry: start,
    onFinish: (results, { correct, total, pct }) => {
      const wasDone = unitStats(u.id).done;
      recordUnitResult(u.id, correct, total);
      const xp = correct * 10 + (pct === 100 ? 20 : 0);
      addXP(xp);
      let message = '';
      if (pct >= 70 && !wasDone) {
        const nx = UNITS[u.index + 1];
        message = nx ? `🔓 Yeni ünite açıldı: <b>${nx.emoji} ${esc(nx.title)}</b>` : '🎓 Tüm A1 ünitelerini bitirdin!';
      } else if (pct < 70) message = 'Bir sonraki üniteyi açmak için en az %70 gerekiyor. Tekrar dene!';
      return { xp, message };
    }
  });
  start();
}

/* ============================================================
   Tekrar: Fındık'ın Palamut Zulası (Aralıklı Tekrar - SRS)
   ============================================================ */
function screenReview() {
  const reviewLimit = Math.max(5, parseInt(state.settings.reviewLimit, 10) || 25);
  const allDue = dueWords();
  const dueCount = allDue.length;

  // Günlük tekrar kelime üst sınırı (Varsayılan 25, Ayarlar'dan değiştirilebilir)
  const words = dueCount > reviewLimit ? allDue.slice(0, reviewLimit) : allDue;

  // Vadesi gelen kelime yoksa serbest tekrar pratiği için kullanıcının gördüğü kelimeler veya 1. ünite kelimeleri (state.words kirletilmez)
  const studiedPool = ALL_WORDS.filter(w => state.words[w.key]);
  const practiceWords = (studiedPool.length >= 4 ? studiedPool : (UNITS[0]?.words || ALL_WORDS)).slice(0, Math.min(10, reviewLimit));

  const startWithPool = (pool, labelPrefix = 'Zulayı Tazelemeye Başla') => {
    const targetPool = pool && pool.length ? pool : practiceWords;
    const runSession = () => runLesson({
      title: `🌰 ${labelPrefix} (${targetPool.length} Kelime Palamudu)`,
      questions: buildReviewLesson(targetPool),
      color: '#20C997',
      exitTo: '#/home',
      retry: runSession,
      onFinish: (results, { correct }) => { const xp = correct * 8; addXP(xp); return { xp, exitTo: '#/home' }; }
    });
    runSession();
  };

  const header = `
      <header class="page-head">
        <div>
          <h1>${curMascot.itemIcon} ${esc(curMascot.name)}'ın ${esc(curMascot.vaultName)}</h1>
          <p class="muted">${curMascot.vaultDesc}</p>
        </div>
      </header>`;

  if (dueCount === 0) {
    view().innerHTML = `
      <div class="page">
        ${header}
        <div class="card review-status-card" id="reviewStatusCard" style="text-align:center; padding: 32px 20px; max-width: 560px; margin: 0 auto;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🐿️ ✨</div>
          <h2>${esc(curMascot.vaultName)} Güvende!</h2>
          <p class="muted" style="margin: 8px auto 20px;">${curMascot.vaultEmptyDesc}</p>
          <div style="display:flex; flex-direction:column; gap:12px; max-width:340px; margin:0 auto;">
            <button class="btn btn-primary btn-lg" id="startReviewBtn" aria-label="Serbest Tekrar Seansı Başlat">
              🌰 Serbest Tekrar Seansı Başlat (${practiceWords.length} Kelime)
            </button>
            <a class="btn btn-secondary" href="#/cards/u1">🃏 1. Ünite Kelime Kartlarını Çalış</a>
            <a class="btn btn-ghost" href="#/home">Panoya Dön</a>
          </div>
        </div>
      </div>`;
    $('#startReviewBtn').onclick = () => startWithPool(practiceWords, 'Serbest Hafıza Tazeleme');
    return;
  }

  view().innerHTML = `
    <div class="page">
      ${header}
      <div class="card review-hero-card" id="spacedRepetitionCard" style="text-align:center; padding: 32px 20px; max-width: 560px; margin: 0 auto;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🌰 🔍</div>
        <h2>Palamutları Çıkarma Vakti!</h2>
        <p class="muted" style="margin: 8px auto 20px;">
          ${esc(curMascot.name)} sepetindeki <b>${dueCount} kelimeyi</b> unutmak üzere${dueCount > words.length ? ` (bu seansta ${words.length} tanesini çıkaracağız)` : ''}. Hafızasını tazeleyip kelimeleri kalıcı kılalım!
        </p>

        <div class="stats-row" style="display:flex; justify-content:center; gap:24px; margin-bottom:24px;">
          <div class="stat"><div class="stat-num" style="color:var(--success,#20C997);">${words.length}</div><div class="stat-label">Tazelenecek Kelime</div></div>
          <div class="stat"><div class="stat-num">${Object.keys(state.words).length}</div><div class="stat-label">Toplam Zula (SRS)</div></div>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px; max-width:320px; margin:0 auto;">
          <button class="btn btn-primary btn-lg" id="startReviewBtn" aria-label="Tekrar Seansını Başlat">
            🌰 Palamutları Tazelemeye Başla (${words.length} Kelime)
          </button>
          <a class="btn btn-ghost" href="#/home" aria-label="Panoya Dön">Panoya Dön</a>
        </div>
      </div>
    </div>
  `;

  $('#startReviewBtn').onclick = () => startWithPool(words, 'Zula Tazelemeyi Başlat');
}


/* ============================================================
   Kelime kartları
   ============================================================ */
let currentCardsFilter = 'all';

function screenCards(id) {
  const u = UNIT_BY_ID[id];
  if (!u || u.type !== 'vocab') {
    const isA2Unlocked = Boolean(state.a1BossPassed);
    const a1Vocab = UNITS.filter(x => x.type === 'vocab' && x.level === 'A1');
    const a2Vocab = UNITS.filter(x => x.type === 'vocab' && x.level === 'A2');
    
    // A2 kartları sadece A1 Boss Sınavı tamamlandığında (a1BossPassed) açılır
    const availableVocab = isA2Unlocked ? UNITS.filter(x => x.type === 'vocab') : a1Vocab;

    if (!isA2Unlocked) {
      currentCardsFilter = 'all';
    }

    const filteredUnits = currentCardsFilter === 'all' 
      ? availableVocab 
      : availableVocab.filter(x => x.level === currentCardsFilter);

    view().innerHTML = `
      <div class="page">
        <header class="page-head">
          <div>
            <h1>🃏 Kelime Kartları</h1>
            <p class="muted">${isA2Unlocked ? 'Bir konu seç, kartları çevir, dinle ve aralıklı tekrarla kalıcı öğren.' : 'A1 Temel Seviye · 15 Konu · Kartları çevir ve dinleyerek öğren.'}</p>
          </div>
        </header>

        <!-- Seviye Filtre Hapları (Sadece A2 açıldığında görünür) -->
        ${isA2Unlocked ? `
          <div style="display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;align-items:center;">
            <button class="btn ${currentCardsFilter === 'all' ? 'btn-primary' : 'btn-secondary'} sm" id="cardFilterAll">
              Tüm Konular (${availableVocab.length})
            </button>
            <button class="btn ${currentCardsFilter === 'A1' ? 'btn-primary' : 'btn-secondary'} sm" id="cardFilterA1">
              🌱 A1 Temel (${a1Vocab.length})
            </button>
            <button class="btn ${currentCardsFilter === 'A2' ? 'btn-primary' : 'btn-secondary'} sm" id="cardFilterA2">
              🚀 A2 Macera (${a2Vocab.length})
            </button>
          </div>
        ` : ''}

        <div class="unit-grid">
          ${filteredUnits.filter(x => isA2Unlocked || x.level === 'A1').map(x => `
            <a class="unit-tile" href="#/cards/${x.id}" style="--c:${x.color}">
              <div style="display:flex;justify-content:space-between;align-items:center;width:100%;margin-bottom:4px;">
                <span class="ut-emoji">${x.emoji}</span>
                <span class="badge" style="font-size:0.7rem;padding:2px 8px;border-radius:99px;background:var(--card-hover);font-weight:800;">${x.level}</span>
              </div>
              <b>${esc(x.title)}</b>
              <span class="muted small">${x.words.length} kelime</span>
            </a>`).join('')}
        </div>
      </div>`;

    if ($('#cardFilterAll')) $('#cardFilterAll').onclick = () => { currentCardsFilter = 'all'; screenCards(); };
    if ($('#cardFilterA1')) $('#cardFilterA1').onclick = () => { currentCardsFilter = 'A1'; screenCards(); };
    if ($('#cardFilterA2')) $('#cardFilterA2').onclick = () => { currentCardsFilter = 'A2'; screenCards(); };
    return;
  }
  if (u.level === 'A2' && !Boolean(state.a1BossPassed && state.a2Unlocked)) {
    toast('Bu seviye henüz kilitli 🔒');
    location.hash = '#/cards';
    return;
  }
  let words = [...u.words], i = 0;
  const unlocked = isUnlocked(u.index);
  const draw = () => {
    const w = words[i];
    const st = state.words[w.key];
    view().innerHTML = `
      <div class="page cards-page" style="--c:${u.color}">
        <header class="page-head"><div><a href="#/cards" class="back">← Konular</a><h1>${u.emoji} ${esc(u.title)}</h1></div>
          <button class="btn btn-ghost" id="shuf" aria-label="Kelimeleri karıştır">🔀 Karıştır</button></header>
        ${renderUnitProgressionCard(u)}
        <div class="flash-wrap">
          <div class="flash" id="flash">
            <div class="flash-face front"><div class="flash-emoji">${w.emoji}</div><div class="flash-en">${esc(w.en)}</div><div class="muted small">çevirmek için tıkla</div></div>
            <div class="flash-face back"><div class="flash-emoji">${w.emoji}</div><div class="flash-tr">${esc(w.tr)}</div><div class="flash-en small-en">${esc(w.en)}</div></div>
          </div>
        </div>
        <!-- Akıcı ve Dengeli Kart Kontrolleri -->
        <div class="flash-modern-ctrl" style="display:flex;align-items:center;justify-content:center;gap:12px;margin:20px 0 10px;">
          <button class="flash-pill-btn" id="prev" style="min-width:105px;" aria-label="Önceki kelime kartı">← Önceki</button>
          <button class="flash-pill-btn" id="spk" style="background:var(--primary);color:#fff;border-color:var(--primary-d);padding:12px 20px;" title="Telaffuzu Dinle" aria-label="Kelime telaffuzunu dinle">🔊 Dinle</button>
          <button class="flash-pill-btn" id="next" style="min-width:105px;" aria-label="Sonraki kelime kartı">Sonraki →</button>
        </div>

        <div style="text-align:center;margin:6px 0 18px;font-weight:800;color:var(--muted);font-size:0.95rem;">
          ${i + 1} / ${words.length}${st ? ` · ${'⭐'.repeat(Math.min(st.box, 5)) || '·'}` : ''}
        </div>

        <div class="center" style="margin-bottom:26px;">
          ${unlocked
            ? `<a class="btn btn-primary" href="#/lesson/${u.id}" style="padding:13px 30px;font-size:1.02rem;">▶ Bu Konuyla Derse Başla</a>`
            : `<p class="muted">🔒 Bu ünitenin alıştırmaları henüz kilitli.</p>`}
        </div>

        <!-- Dağınık Butonlar Yerine Düzenli, Açılır-Kapanır Kelime Listesi -->
        <details class="card" style="border-radius:18px;margin-top:20px;cursor:pointer;">
          <summary style="font-weight:800;font-size:0.95rem;color:var(--text);display:flex;align-items:center;justify-content:space-between;padding:4px 0;outline:none;">
            <span>📋 Bu Ünitedeki Tüm Kelimeler (${words.length})</span>
            <span class="muted small" style="font-weight:700;">Listeyi Aç / Kapat ▾</span>
          </summary>
          <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px;">
            ${u.words.map(x => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:14px;background:color-mix(in srgb, var(--primary) 6%, var(--card-bg, #fff));border:1px solid var(--line);">
                <div style="display:flex;align-items:center;gap:12px;">
                  <span style="font-size:1.4rem;">${x.emoji}</span>
                  <div>
                    <div style="font-weight:900;font-size:0.95rem;color:var(--text);">${esc(x.en)}</div>
                    <div class="muted small">${esc(x.tr)}</div>
                  </div>
                </div>
                <button class="speak-btn sm list-speak-btn" data-en="${esc(x.en)}" aria-label="${esc(x.en)} telaffuzunu dinle" title="Dinle">🔊</button>
              </div>
            `).join('')}
          </div>
        </details>
      </div>`;
    $('#flash').onclick = () => $('#flash').classList.toggle('flipped');
    $('#spk').onclick = () => speak(w.en);
    $('#prev').onclick = () => { i = (i - 1 + words.length) % words.length; draw(); };
    $('#next').onclick = () => { i = (i + 1) % words.length; draw(); };
    $('#shuf').onclick = () => { words = shuffle(words); i = 0; draw(); };
    $$('.list-speak-btn').forEach(c => c.onclick = (e) => { e.stopPropagation(); speak(c.dataset.en); });
    lessonKeyHandler = e => {
      if (e.key === 'ArrowRight') $('#next').click();
      else if (e.key === 'ArrowLeft') $('#prev').click();
      else if (e.key === ' ') { e.preventDefault(); $('#flash').click(); }
    };
    setTimeout(() => speak(w.en), 200);
  };
  draw();
}

/* ============================================================
   Gramer konu anlatımı
   ============================================================ */
function screenGrammar(id) {
  const u = UNIT_BY_ID[id];
  if (!u || u.type !== 'grammar') { location.hash = '#/learn'; return; }
  view().innerHTML = `
    <div class="page" style="--c:${u.color}">
      <header class="page-head"><div><a href="#/learn" class="back">← Öğrenme Yolu</a><h1>${u.emoji} ${esc(u.title)}</h1><p class="muted">${esc(u.en)}</p></div></header>
      ${renderUnitProgressionCard(u)}
      <div class="card grammar-card">${u.explain}</div>
      <div class="card">
        <h3>🗣️ Örnek Cümleler</h3>
        ${u.examples.map(([en, tr]) => `
          <div class="example"><button class="speak-btn sm" data-say="${esc(en)}" aria-label="Örnek cümleyi dinle" title="Dinle">🔊</button><div><b>${esc(en)}</b><div class="muted">${esc(tr)}</div></div></div>`).join('')}
      </div>
      <div class="center">${isUnlocked(u.index) ? `<a class="btn btn-big btn-primary" href="#/lesson/${u.id}">▶ Alıştırmaya Başla</a>` : '<p class="muted">🔒 Bu ünitenin alıştırmaları henüz kilitli.</p>'}</div>
    </div>`;
  $$('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
}

/* ============================================================
   İlerleme
   ============================================================ */
function screenProgress() {
  const lvl = levelInfo();
  const days = Array.from({ length: 7 }, (_, i) => { const d = daysAgoStr(6 - i); return { d, xp: state.daily[d] || 0 }; });
  const maxXP = Math.max(50, ...days.map(d => d.xp));
  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const weak = weakWords(8);
  const startedWords = Object.values(state.words).filter(w => w.box >= 1).length;
  const masteredWords = Object.values(state.words).filter(w => w.box >= 3).length;
  const practiced = UNITS.filter(u => unitStats(u.id).attempts);
  const weakUnits = practiced.filter(u => unitStats(u.id).best < 80).sort((a, b) => unitStats(a.id).best - unitStats(b.id).best).slice(0, 4);

  const topTraps = typeof getTopTurkishTraps === 'function' ? getTopTurkishTraps() : [];

  view().innerHTML = `
    <div class="page">
      <header class="page-head" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;"><div><h1>📊 İlerlemen & Öğrenme Analizi</h1><p class="muted">${lvl.label} · ${lvl.desc}</p></div><a class="btn btn-ghost" id="progressPlacementBtn" href="#/placement">📝 Seviye Testi</a></header>

      <div class="grid-4">
        <div class="stat-card grad-1"><div class="sc-icon">🌿</div><div class="sc-val">${currentStreak()}</div><div class="sc-lbl">gün ritim</div></div>
        <div class="stat-card grad-2"><div class="sc-icon">🌰</div><div class="sc-val">${state.xp}</div><div class="sc-lbl">palamut</div></div>
        <div class="stat-card grad-3 pos-relative">
          <button class="metric-info-btn" id="wordInfoBtn" title="Nasıl hesaplanır?" aria-label="Kelime istatistiği bilgisi">${icon('info', '', 14)}</button>
          <div class="sc-icon">🐿️</div>
          <div class="sc-val">${startedWords}</div>
          <div class="sc-lbl">zulalanan kelime</div>
          <div class="sc-sub mt-1">⭐ Ustalaşılan: <b>${masteredWords}</b> kelime</div>
        </div>
        <div class="stat-card grad-4 pos-relative">
          <button class="metric-info-btn" id="a1InfoBtn" title="Nasıl hesaplanır?" aria-label="Müfredat tamamlanma bilgisi">${icon('info', '', 14)}</button>
          <div class="sc-icon">📚</div>
          <div class="sc-val">%${lvl.pct}</div>
          <div class="sc-lbl">${state.a2Unlocked ? 'A2 ilerlemesi' : 'A1 tamamlandı'}</div>
          <div class="sc-sub mt-1">🌱 A1: <b>${lvl.doneA1}/27</b> · 🚀 A2: <b>${lvl.doneA2}/25</b></div>
        </div>
      </div>

      <div class="card trap-report-card" id="turkishTrapRadarCard">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <span style="font-size:2.2rem;">🪤</span>
          <div>
            <h3 style="margin:0;">Türk Beyni vs İngilizce Tuzak Radarı</h3>
            <p class="muted small" style="margin:2px 0 0;">Türkçe düşünmekten kaynaklanan alışkanlıklarını tespit edip özel Lokomotif ve gramer çözümleri sunuyoruz.</p>
          </div>
        </div>
        ${topTraps.length ? `
          <div class="trap-list" style="display:flex;flex-direction:column;gap:10px;">
            ${topTraps.map(t => `
              <div class="trap-stat-row">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:8px;flex-wrap:wrap;">
                  <span class="trap-stat-name">${esc(t.label)}</span>
                  <span class="trap-count-pill">${t.count} kez takıldın</span>
                </div>
                <p class="trap-stat-tip">💡 <b>Çözüm Mantığı:</b> ${esc(t.tip)}</p>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="text-align:center;padding:16px 0;">
            <p class="muted" style="margin:0;">Henüz belirgin bir Türk tuzağına yakalanmadın! Ders yaptıkça Türkçe ve İngilizce söz dizimi veya kalıp farkları burada analiz edilecek. 🎯</p>
          </div>
        `}
      </div>

      <div class="grid-2">
        <div class="card">
          <h3>📅 Son 7 Gün</h3>
          <div class="chart">${days.map(d => `<div class="chart-col"><div class="chart-bar" style="height:${(d.xp / maxXP) * 100}%"><span>${d.xp || ''}</span></div><div class="chart-lbl">${dayNames[new Date(d.d).getDay()]}</div></div>`).join('')}</div>
        </div>
        <div class="card">
          <h3>🔍 Yerel Analiz</h3>
          ${practiced.length === 0 ? '<p class="muted">Ders yaptıkça burada güçlü ve zayıf yönlerin görünecek.</p>' : `
            ${weakUnits.length ? `<p><b>Tekrar etmen önerilen üniteler:</b></p><div class="tag-list">${weakUnits.map(u => `<a class="tag" style="--c:${u.color}" href="#/lesson/${u.id}">${u.emoji} ${esc(u.title)} · %${unitStats(u.id).best}</a>`).join('')}</div>` : '<p>Tüm çalıştığın ünitelerde %80 üzerindesin! 🌟</p>'}
            ${weak.length ? `<p><b>Zorlandığın kelimeler:</b></p><div class="tag-list">${weak.map(w => `<span class="tag" style="--c:var(--danger)">${w.emoji} ${esc(w.en)} = ${esc(w.tr)}</span>`).join('')}</div>` : ''}
          `}
          <a class="btn btn-secondary mt-2" href="#/ai">${icon('bot', '', 16)} Detaylı AI analizi</a>
        </div>
      </div>

      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
          <h3 style="margin:0;">🧩 Ünite Başarıları</h3>
          <div style="display:flex;gap:6px;">
            <span class="badge" style="font-size:0.75rem;">🌱 A1: ${lvl.doneA1}/27</span>
            <span class="badge" style="font-size:0.75rem;">🚀 A2: ${lvl.doneA2}/25</span>
          </div>
        </div>
        <div class="unit-bars">
          ${UNITS.map(u => {
            const s = unitStats(u.id);
            const unlocked = isUnlocked(u.index) && (u.level === 'A1' || state.a2Unlocked);
            const targetUrl = u.type === 'vocab' ? `#/cards/${u.id}` : `#/grammar/${u.id}`;
            return `
            <a class="ub-row ${unlocked ? '' : 'locked'}" href="${targetUrl}" role="button" tabindex="0" aria-label="${esc(u.title)} ünitesi kelimelerini aç" style="text-decoration:none;color:inherit;cursor:pointer;display:flex;align-items:center;">
              <span class="ub-name">${u.emoji} ${esc(u.title)} <span class="badge" style="font-size:0.65rem;padding:1px 5px;margin-left:4px;">${u.level}</span></span>
              <div class="progress"><div class="bar" style="width:${s.best}%;background:${u.color}"></div></div>
              <span class="ub-val">${s.attempts ? `%${s.best}` : unlocked ? 'İncele ➔' : '🔒'}</span>
            </a>`;
          }).join('')}
        </div>
      </div>

      ${state.mistakes.length ? `
      <div class="card">
        <h3>❌ Son Hataların & Tuzak Tanıları</h3>
        ${state.mistakes.slice(0, 10).map(m => `
          <div class="wrong-row">
            <div>
              <span>${esc(m.q)} <i class="muted">(sen: ${esc(m.given || '—')})</i></span>
              ${m.trapLabel ? `<span class="badge" style="font-size:0.7rem;margin-left:6px;background:var(--primary-soft,#eee);color:var(--primary,#6C5CE7);">${esc(m.trapLabel)}</span>` : ''}
            </div>
            <b>${esc(m.correct)}</b>
          </div>
        `).join('')}
      </div>` : ''}
    </div>`;

  $('#wordInfoBtn').onclick = () => {
    openModal(`
      <h2>🧠 Kelime İstatistikleri Nasıl Hesaplanır?</h2>
      <div style="text-align:left;line-height:1.6;margin:16px 0;font-size:0.95rem;">
        <p><b>🌱 Öğrenilen Kelime (${startedWords}):</b> Testini başarıyla (%70+) tamamladığın ünitelerdeki ve derslerde karşılaştığın kelimeler aralıklı tekrar hafıza havuzuna (Kutu 1) eklenir.</p>
        <p><b>⭐ Ustalaşılan Kelime (${masteredWords}):</b> Tekrar kartlarında aralıklı olarak en az 3 farklı oturumda doğru yanıtladığın (Kutu 3 ve üzeri), kalıcı hafızana yerleşmiş kelimelerdir.</p>
        <p class="muted small" style="margin-top:12px;">💡 İpucu: Kelimelerde ustalaşmak için menüdeki <b>"Tekrar"</b> ekranından günlük aralıklı tekrar alıştırmalarını çözebilirsin.</p>
      </div>
      <button class="btn btn-primary" onclick="closeModal()">Anladım 👍</button>
    `);
  };

  $('#a1InfoBtn').onclick = () => {
    openModal(`
      <h2>📚 A1 Müfredat Tamamlanma Oranı</h2>
      <div style="text-align:left;line-height:1.6;margin:16px 0;font-size:0.95rem;">
        <p><b>Nasıl Ölçülür?</b> Test başarı puanı <b>%70 ve üzerinde</b> olan üniteler A1 standardında tamamlanmış kabul edilir.</p>
        <p>Şu ana kadar <b>${lvl.done} / ${UNITS.length} üniteyi</b> (%70+ başarıyla) tamamladın. Bu da tüm A1 müfredatının <b>%${lvl.pct}</b>'sine denk gelir.</p>
        <p class="muted small" style="margin-top:12px;">Aşağıdaki <b>Ünite Başarıları</b> çubukları ise her bir ünitede ulaştığın en yüksek sınav skorunu (%best) gösterir.</p>
      </div>
      <button class="btn btn-primary" onclick="closeModal()">Harika 👍</button>
    `);
  };
}

/* ============================================================
   AI Öğretmen
   ============================================================ */
let aiTab = 'analyze';
let lastAISetupNotice = '';
function maskKey(k) {
  if (!k) return '';
  if (k.length <= 8) return '****';
  return k.slice(0, 4) + '...' + k.slice(-4);
}

function screenAI() {
  if (!hasAI()) {
    const curModel = state?.settings?.model || 'gemini-2.5-flash';
    view().innerHTML = `
      <div class="page">
        <header class="page-head"><div><h1>🤖 AI Öğretmen</h1><p class="muted">Google Gemini ile çalışır, ücretsizdir.</p></div></header>
        <div class="card setup-card">
          <h2>Yapay zekayı 2 dakikada etkinleştir ✨</h2>
          <ol class="steps">
            <li><a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a> adresine git ve Google hesabınla giriş yap.</li>
            <li><b>"Create API key"</b> (API anahtarı oluştur) butonuna tıkla.</li>
            <li>Oluşan anahtarı kopyala ve aşağıya yapıştır.</li>
          </ol>
          <label class="lbl" style="font-weight:700;margin-bottom:6px;display:block;">Google Gemini API Anahtarı:</label>
          <div class="type-row" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <input id="keyIn" class="text-input" placeholder="AIzaSy..." value="" autocomplete="off" style="flex:1;min-width:200px;" aria-label="Gemini API Anahtarı" />
            <button class="btn btn-primary" id="saveKey">Kaydet ve Test Et</button>
          </div>
          <div style="margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <label class="muted small" for="setupModelIn" style="font-weight:700;">Model:</label>
            <input id="setupModelIn" class="text-input" value="${esc(curModel)}" list="setupModels" style="max-width:220px;padding:6px 10px;font-size:0.85rem;" aria-label="Gemini Modeli" />
            <datalist id="setupModels"><option value="gemini-2.5-flash"><option value="gemini-2.0-flash"><option value="gemini-2.5-flash-lite"></datalist>
          </div>
          <p class="muted small" style="margin-top:10px;">🔒 Anahtarın sadece tarayıcında saklanır.</p>
        </div>
      </div>`;

    const submitKey = () => {
      const k = ($('#keyIn')?.value || '').trim();
      if (!k || k.length < 6 || /\s/.test(k)) {
        toast('Lütfen geçerli bir Gemini API anahtarı gir.');
        return;
      }
      const chosenModel = ($('#setupModelIn')?.value || '').trim() || 'gemini-2.5-flash';
      state.settings.apiKey = k;
      state.settings.model = chosenModel;
      saveState();
      lastAISetupNotice = '✅ Bağlantı başarılı! Gemini API anahtarı kaydedildi ve AI Öğretmen etkinleştirildi.';
      toast('Bağlantı başarılı! 🎉 AI Öğretmen etkinleştirildi.');
      screenAI();
    };

    $('#saveKey').onclick = submitKey;
    $('#keyIn').onkeydown = e => { if (e.key === 'Enter') submitKey(); };
    return;
  }

  const noticeHtml = lastAISetupNotice
    ? `<div id="aiSetupSuccessBanner" style="margin-bottom:12px;padding:10px 14px;border-radius:10px;background:color-mix(in srgb, var(--success, #20C997) 14%, var(--card-bg, #fff));border:1px solid var(--success, #20C997);font-weight:700;font-size:0.9rem;">${esc(lastAISetupNotice)}</div>`
    : '';

  view().innerHTML = `
    <div class="page">
      <header class="page-head"><div><h1>🤖 AI Öğretmen</h1><p class="muted">Seviyeni takip eden kişisel öğretmenin.</p></div></header>

      ${noticeHtml}

      <!-- AI Anahtar Yönetimi & Durum Kartı (Test ve Anahtar Güncelleme Desteği) -->
      <div class="card ai-status-card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span class="badge ai-status-pill" aria-label="AI Öğretmen Etkinleştirildi (Active)">
              <span class="ai-pulse-dot"></span>
              AI Öğretmen Etkinleştirildi (Active)
            </span>
            <span class="muted small" style="display:inline-flex;align-items:center;gap:4px;">Anahtar: <code class="ai-key-chip">${maskKey(getApiKey())}</code></span>
            <span class="muted small">Model: <b>${esc(state.settings.model || 'gemini-2.5-flash')}</b></span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
            <button class="btn btn-secondary sm" id="aiPingBtn" aria-label="Gemini Bağlantısını Test Et">🔌 Bağlantıyı Test Et</button>
            <button class="btn btn-ghost sm" id="changeKeyToggleBtn" aria-label="API Anahtarını Değiştir">🔑 Anahtarı Güncelle</button>
          </div>
        </div>
        <div id="aiPingOut" class="muted small" style="margin-top:6px;"></div>
        <div id="updateKeyForm" style="display:none;margin-top:12px;padding-top:12px;border-top:1px dashed var(--border);">
          <label class="lbl" style="font-weight:700;margin-bottom:4px;display:block;">Yeni Gemini API Anahtarı:</label>
          <div class="type-row" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <input id="newKeyIn" class="text-input" placeholder="AIzaSy..." value="${esc(getApiKey())}" autocomplete="off" style="flex:1;min-width:200px;" aria-label="Yeni Gemini API Anahtarı" />
            <button class="btn btn-primary sm" id="updateKeyBtn">Güncelle ve Test Et</button>
          </div>
          <p class="muted small" style="margin-top:6px;">Yeni anahtarı girip kaydederek güncelleyebilirsin.</p>
        </div>
      </div>

      <div class="tabs">
        <button class="tab ${aiTab === 'analyze' ? 'active' : ''}" data-t="analyze">🎯 Seviye Analizi</button>
        <button class="tab ${aiTab === 'practice' ? 'active' : ''}" data-t="practice">✏️ Bana Özel Alıştırma</button>
        <button class="tab ${aiTab === 'chat' ? 'active' : ''}" data-t="chat">💬 Sohbet Pratiği</button>
      </div>
      <div id="aiBody"></div>
    </div>`;

  const pingBtn = $('#aiPingBtn');
  const pingOut = $('#aiPingOut');
  if (pingBtn && pingOut) {
    pingBtn.onclick = async () => {
      pingBtn.disabled = true;
      pingOut.textContent = 'Canlı bağlantı test ediliyor...';
      try {
        const res = await aiTest();
        pingOut.textContent = '✅ ' + res.trim();
      } catch (e) {
        pingOut.textContent = '❌ ' + e.message;
      }
      pingBtn.disabled = false;
    };
  }

  const toggleBtn = $('#changeKeyToggleBtn');
  const formEl = $('#updateKeyForm');
  if (toggleBtn && formEl) {
    toggleBtn.onclick = () => {
      formEl.style.display = formEl.style.display === 'none' ? 'block' : 'none';
    };
  }

  const updateBtn = $('#updateKeyBtn');
  if (updateBtn) {
    updateBtn.onclick = () => {
      const newK = ($('#newKeyIn')?.value || '').trim();
      if (!newK || newK.length < 6 || /\s/.test(newK)) {
        toast('Lütfen geçerli bir Gemini API anahtarı gir.');
        return;
      }
      state.settings.apiKey = newK;
      saveState();
      lastAISetupNotice = '✅ API Anahtarı başarıyla güncellendi ve kaydedildi!';
      toast('API Anahtarı başarıyla güncellendi! 🎉');
      screenAI();
    };
  }

  $$('.tab').forEach(t => t.onclick = () => { aiTab = t.dataset.t; screenAI(); });
  ({ analyze: aiAnalyzeTab, practice: aiPracticeTab, chat: aiChatTab })[aiTab]($('#aiBody'));
}

function aiAnalyzeTab(el) {
  const r = state.aiReport;
  el.innerHTML = `
    <div class="card">
      <div class="row-between">
        <div><h3>Seviye Raporu</h3><p class="muted small">${r ? `Son analiz: ${new Date(r.at).toLocaleString('tr-TR')}` : 'Henüz analiz yapılmadı.'}</p></div>
        <button class="btn btn-primary" id="anBtn">${r ? icon('repeat', '', 16) + ' Yeniden Analiz Et' : icon('sparkles', '', 16) + ' Analiz Et'}</button>
      </div>
      <div id="report" class="ai-report">${r ? md(r.text) : '<p class="muted">Ders yaptıkça yapay zeka hatalarını ve başarılarını inceleyerek seviyeni belirler ve sana özel bir plan hazırlar.</p>'}</div>
    </div>`;
  $('#anBtn').onclick = async () => {
    $('#anBtn').disabled = true;
    $('#report').innerHTML = loader('Verilerin inceleniyor...');
    try { const t = await aiAnalyze(); $('#report').innerHTML = md(t); }
    catch (e) { $('#report').innerHTML = errorBox(e); }
    $('#anBtn').disabled = false;
  };
}

function aiPracticeTab(el) {
  el.innerHTML = `
    <div class="card">
      <h3>Sana özel 10 soru ✏️</h3>
      <p class="muted">Yapay zeka hatalarına ve zayıf ünitelerine bakarak yeni sorular üretir. İstersen bir konu da yazabilirsin.</p>
      <div class="type-row">
        <input id="focusIn" class="text-input" placeholder="İsteğe bağlı konu: ör. present simple, hayvanlar, saatler..." />
        <button class="btn btn-primary" id="genBtn">${icon('sparkles', '', 16)} Alıştırma Üret</button>
      </div>
      <div class="tag-list">${['to be', 'Present Simple', 'have got', 'there is / are', 'Yer edatları', 'Soru kelimeleri'].map(t => `<button class="tag" style="--c:var(--cat-kelime)" data-f="${t}">${t}</button>`).join('')}</div>
      <div id="genOut"></div>
    </div>`;
  $$('[data-f]').forEach(b => b.onclick = () => { $('#focusIn').value = b.dataset.f; });
  $('#genBtn').onclick = async () => {
    $('#genBtn').disabled = true;
    $('#genOut').innerHTML = loader('Sorular hazırlanıyor...');
    try {
      pendingAILesson = await aiGenerateExercises($('#focusIn').value.trim());
      location.hash = '#/ai-lesson';
    } catch (e) { $('#genOut').innerHTML = errorBox(e); $('#genBtn').disabled = false; }
  };
}

function screenAILesson() {
  if (!pendingAILesson) { location.hash = '#/ai'; return; }
  const lesson = pendingAILesson;
  const start = () => runLesson({
    title: `🤖 ${lesson.title}`,
    questions: lesson.questions.map(q => ({ ...q, words: q.words ? shuffle(q.words) : undefined })),
    color: '#CC5DE8',
    exitTo: '#/ai',
    retry: start,
    onFinish: (results, { correct }) => { const xp = correct * 10; addXP(xp); return { xp }; }
  });
  start();
}

function aiChatTab(el) {
  el.innerHTML = `
    <div class="card chat-card">
      <div class="chat-head"><div class="chat-avatar">☀️</div><div><b>Sunny</b><div class="muted small">İngilizce sohbet arkadaşın · hatalarını düzeltir</div></div>
        <button class="btn btn-ghost sm" id="clearChat">🗑️ Temizle</button></div>
      <div class="chat-log" id="chatLog"></div>
      <div class="tag-list" id="starters">${['Hello! My name is ' + state.name, 'Let\'s talk about my family', 'I like food!', 'Ask me about my day', 'Bana hobilerimi anlatmayı öğret'].map(t => `<button class="tag" style="--c:#339AF0">${esc(t)}</button>`).join('')}</div>
      <div class="chat-input">
        <button class="speak-btn" id="voiceChatBtn" title="Mikrofonla Konuş" aria-label="Mikrofonla konuş">🎙️</button>
        <input id="chatIn" class="text-input" placeholder="İngilizce yaz veya mikrofona bas..." autocomplete="off" />
        <button class="btn btn-primary" id="sendBtn">Gönder</button>
      </div>
      <div id="voiceChatStatus" class="muted small center" style="margin-top:4px;"></div>
    </div>`;
  const log = $('#chatLog');
  const drawLog = () => {
    log.innerHTML = state.chat.length ? state.chat.map(m => `
      <div class="msg ${m.role}">
        <div class="bubble">${md(m.text)}</div>
        ${m.role === 'model' ? `<button class="speak-btn sm" data-say="${esc(m.text.split('💡')[0])}" aria-label="Cevabı sesli dinle" title="Dinle">🔊</button>` : ''}
      </div>`).join('') : '<div class="muted center chat-empty">Sunny ile İngilizce konuşmaya başla! 👋<br>Aşağıdaki önerilerden birine tıklayabilir veya mikrofona basıp konuşabilirsin.</div>';
    $$('[data-say]', log).forEach(b => b.onclick = () => speak(b.dataset.say));
    log.scrollTop = log.scrollHeight;
  };
  drawLog();
  const send = async text => {
    text = (text ?? $('#chatIn').value).trim();
    if (!text) return;
    $('#chatIn').value = '';
    $('#sendBtn').disabled = true;
    log.insertAdjacentHTML('beforeend', `<div class="msg user"><div class="bubble">${esc(text)}</div></div><div class="msg model" id="typing"><div class="bubble typing"><span></span><span></span><span></span></div></div>`);
    log.scrollTop = log.scrollHeight;
    try {
      const reply = await aiChat(text);
      drawLog();
      speak(reply.split('💡')[0]);
    } catch (e) {
      $('#typing')?.remove();
      log.insertAdjacentHTML('beforeend', errorBox(e));
    }
    $('#sendBtn').disabled = false;
    $('#chatIn').focus();
  };
  $('#sendBtn').onclick = () => send();
  $('#chatIn').onkeydown = e => { if (e.key === 'Enter') send(); };
  $$('#starters .tag').forEach(b => b.onclick = () => send(b.textContent));
  $('#clearChat').onclick = () => { state.chat = []; saveState(); drawLog(); };

  // Sesli sohbet mikrofon butonu
  const voiceBtn = $('#voiceChatBtn');
  const voiceStatus = $('#voiceChatStatus');
  let listeningChat = false;

  voiceBtn.onclick = () => {
    if (listeningChat) {
      stopListening();
      voiceBtn.classList.remove('listening');
      voiceStatus.textContent = '';
      listeningChat = false;
      return;
    }
    listeningChat = true;
    voiceBtn.classList.add('listening');
    voiceStatus.textContent = 'Dinliyorum... İngilizce konuşabilirsin 🎙️';

    listenSpeech({
      lang: 'en-US',
      onResult: (text) => {
        voiceBtn.classList.remove('listening');
        voiceStatus.textContent = `Duyuldu: "${text}"`;
        listeningChat = false;
        $('#chatIn').value = text;
        send(text);
      },
      onError: (err) => {
        voiceBtn.classList.remove('listening');
        voiceStatus.textContent = err;
        listeningChat = false;
      },
      onEnd: () => {
        voiceBtn.classList.remove('listening');
        listeningChat = false;
      }
    });
  };
}

function loader(text) { return `<div class="loader"><div class="dots"><span></span><span></span><span></span></div>${esc(text)}</div>`; }
function errorBox(e) { return `<div class="error-box">⚠️ ${esc(e.message || e)}</div>`; }

/* ============================================================
   Ayarlar
   ============================================================ */
function screenSettings() {
  const s = state.settings;
  const isGuest = state.auth ? state.auth.isGuest : true;
  const curMascot = mascotService.getActive();
  const curTheme = themeService.getCurrentPalette();

  view().innerHTML = `
    <div class="page">
      <header class="page-head"><div><h1>⚙️ Ayarlar</h1></div></header>

      <!-- Profil ve Giriş Durumu -->
      <div class="card">
        <h3>👤 Profil & Hesap</h3>
        <label class="lbl">Adın</label>
        <input id="setName" class="text-input" value="${esc(state.name)}" maxlength="24" />

        <div style="margin-top:14px;padding:14px;background:color-mix(in srgb, var(--primary) 8%, var(--card-bg, #fff));border-radius:14px;border:1px solid var(--line);">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <div>
              <b style="font-size:0.95rem;">${isGuest ? '👤 Misafir Modu' : `🟢 ${esc(state.auth?.user?.displayName || state.name)}`}</b>
              <p class="muted small" style="margin:2px 0 0;">${isGuest ? 'İlerlemen bu cihazda kayıtlı. Puanlarını kaybetmemek için Google hesabını bağlayabilirsin.' : esc(state.auth?.user?.email || 'Google Hesabı Bağlı')}</p>
            </div>
            ${isGuest 
              ? `<button class="btn btn-primary sm" id="settingsAuthBtn">🚀 Hesaba Bağla</button>` 
              : `<button class="btn btn-ghost sm" id="settingsLogoutBtn">🚪 Çıkış Yap</button>`}
          </div>
        </div>
      </div>

      <!-- Yoldaş Hayvan Seçimi -->
      <div class="card">
        <h3>🐾 Öğrenme Yoldaşın</h3>
        <p class="muted small">Derslerde sana eşlik eden, sıralamada yanında duran sevimli yol arkadaşın.</p>
        <div class="mascot-grid">
          ${MASCOTS.map(m => `
            <div class="mascot-card ${m.id === state.mascot ? 'active' : ''}" data-m="${m.id}">
              <div class="mascot-icon">${m.icon}</div>
              <div class="mascot-name">${esc(m.name)}</div>
              <div class="mascot-animal">${esc(m.animal)}</div>
              <div class="mascot-motto">${esc(m.motto)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Renk Paleti Seçimi -->
      <div class="card">
        <h3>🎨 Renk Paleti & Tema</h3>
        <p class="muted small">Uygulamanın ruh halini ve renk tonunu kişiselleştir.</p>
        <div class="theme-grid">
          ${PALETTES.map(p => `
            <div class="theme-card ${p.id === state.theme ? 'active' : ''}" data-t="${p.id}">
              <div class="theme-head">
                <span class="theme-name">${esc(p.name)}</span>
                <div class="theme-dots">
                  <span style="background:${p.colors.primary}"></span>
                  <span style="background:${p.colors.accent}"></span>
                  <span style="background:${p.colors.bg}"></span>
                </div>
              </div>
              <div class="theme-desc">${esc(p.desc)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Gemini AI Yapay Zeka -->
      <div class="card">
        <h3>🤖 Yapay Zeka (Gemini)</h3>
        <p class="muted small">Ücretsiz anahtar: <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a></p>
        <label class="lbl">API Anahtarı</label>
        <div style="display:flex;gap:8px;align-items:center;">
          <input id="setKey" class="text-input" type="password" value="${esc(s.apiKey || '')}" placeholder="AIza..." autocomplete="off" style="flex:1;" />
        </div>
        <label class="lbl">Model</label>
        <input id="setModel" class="text-input" value="${esc(s.model)}" list="models" />
        <datalist id="models"><option value="gemini-2.5-flash"><option value="gemini-2.5-flash-lite"><option value="gemini-2.0-flash"><option value="gemini-flash-latest"></datalist>
        <div class="row-gap"><button class="btn btn-secondary sm" id="testBtn">🔌 Bağlantıyı Test Et</button><span id="testOut" class="muted"></span></div>
      </div>

      <!-- Ses Ayarları -->
      <div class="card">
        <h3>🔊 Ses</h3>
        <label class="lbl">Okuma hızı: <b id="rateVal">${s.rate}</b></label>
        <input id="setRate" type="range" min="0.5" max="1.3" step="0.1" value="${s.rate}" />
        <label class="check"><input type="checkbox" id="setSound" ${s.sound ? 'checked' : ''}/> Ses efektleri</label>
        <div><button class="btn btn-secondary sm" id="tryVoice">${icon('volume', '', 16)} Sesi Dene</button></div>
      </div>

      <!-- Öğrenme & Tekrar Ayarları -->
      <div class="card">
        <h3>🔁 Akıllı Tekrar & Hafıza Ayarları</h3>
        <label class="lbl">Günlük Tekrar Kelime Sınırı</label>
        <div class="flex items-center gap-3 mt-1">
          <input id="setReviewLimit" type="number" min="5" max="100" class="text-input" style="max-width:120px;" value="${s.reviewLimit || 25}" />
          <span class="muted small">kelime / gün (Tekrar ekranında günlük karşına çıkacak maksimum kelime sayısı)</span>
        </div>
      </div>

      <!-- Veriler -->
      <div class="card">
        <h3>💾 Veriler</h3>
        <p class="muted small">İlerlemeni dosya olarak indirip başka bir cihaza aktarabilirsin.</p>
        <div class="row-gap">
          <button class="btn btn-secondary sm" id="exportBtn">⬇️ Dışa Aktar</button>
          <label class="btn btn-secondary sm">⬆️ İçe Aktar<input type="file" id="importIn" accept=".json" hidden /></label>
          <button class="btn btn-danger sm" id="resetBtn">${icon('trash', '', 16)} İlerlemeyi Sıfırla</button>
        </div>
      </div>
      <div class="center mt-4"><button class="btn btn-big btn-primary" id="saveBtn">${icon('check', '', 18)} Kaydet</button></div>
    </div>`;

  // Yoldaş seçimi
  $$('.mascot-card').forEach(card => {
    card.onclick = () => {
      $$('.mascot-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const mId = card.dataset.m;
      store.setMascot(mId);
      renderNav('settings');
      toast(`Yoldaşın ${MASCOT_BY_ID[mId].name} (${MASCOT_BY_ID[mId].icon}) seçildi!`);
    };
  });

  // Tema seçimi
  $$('.theme-card').forEach(card => {
    card.onclick = () => {
      $$('.theme-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const tId = card.dataset.t;
      themeService.apply(tId);
      toast(`Tema değiştirildi: ${PALETTE_BY_ID[tId].name} 🎨`);
    };
  });

  if ($('#settingsAuthBtn')) {
    $('#settingsAuthBtn').onclick = () => openAuthModal();
  }
  if ($('#settingsLogoutBtn')) {
    $('#settingsLogoutBtn').onclick = async () => {
      if (confirm('Çıkış yapmak istediğinden emin misin?')) {
        await authService.logout();
        toast('Çıkış yapıldı. Misafir moduna geçildi.');
        screenSettings();
      }
    };
  }

  const collect = () => {
    state.name = $('#setName').value.trim() || state.name;
    state.settings.apiKey = $('#setKey').value.trim();
    state.settings.model = $('#setModel').value.trim() || 'gemini-2.5-flash';
    state.settings.rate = parseFloat($('#setRate').value);
    state.settings.sound = $('#setSound').checked;
    if ($('#setReviewLimit')) {
      state.settings.reviewLimit = Math.max(5, Math.min(100, parseInt($('#setReviewLimit').value, 10) || 25));
    }
    saveState();
  };
  if ($('#saveBtn')) {
    $('#saveBtn').onclick = () => {
      collect();
      toast('Ayarlar başarıyla kaydedildi! ✅');
    };
  }
  $('#setRate').oninput = e => { $('#rateVal').textContent = e.target.value; };
  $('#tryVoice').onclick = () => { collect(); speak('Hello! Welcome to PatiLingo. Let\'s learn together!'); };
  $('#testBtn').onclick = async () => {
    collect();
    $('#testOut').textContent = 'Test ediliyor...';
    try { const r = await aiTest(); $('#testOut').textContent = '✅ ' + r.trim(); }
    catch (e) { $('#testOut').textContent = '❌ ' + e.message; }
  };
  $('#exportBtn').onclick = () => {
    const data = { ...state, settings: { ...state.settings, apiKey: '' } };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' }));
    a.download = `a1-english-${todayStr()}.json`;
    a.click();
  };
  $('#importIn').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const text = await f.text();
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object') throw new Error('Geçersiz dosya formatı.');
      store.importState(data);
      toast('İlerleme başarıyla içe aktarıldı! 🎉');
      router();
    } catch (err) {
      console.error('Import error:', err);
      toast('Dosya okunamadı: ' + (err.message || 'Geçersiz veri'));
    } finally {
      e.target.value = '';
    }
  };
  $('#resetBtn').onclick = () => {
    if (confirm('Tüm ilerlemen silinecek. Emin misin?')) { resetState(); location.hash = '#/'; router(); }
  };
}

/* ============================================================
   Kullanıcı Girişi / Firebase Yetkilendirme Modalı
   ============================================================ */
/* ============================================================
   Kullanıcı Girişi / Hesap & Cihaz Eşitleme Modalı
   ============================================================ */
function openAuthModal() {
  const isGuest = state.auth ? state.auth.isGuest : true;
  const user = state.auth?.user || null;
  const curMascot = mascotService.getActive();
  const syncCode = generateSyncCode();

  if (!isGuest && user) {
    // Giriş Yapmış Kullanıcı Profili Modalı
    openModal(`
      <div class="modal-head">
        <div class="modal-emoji">${curMascot.icon}</div>
        <div>
          <h2>${esc(user.displayName || state.name)}</h2>
          <p class="muted small">${esc(user.email || 'Kayıtlı Profil')}</p>
        </div>
      </div>

      <div style="margin: 16px 0; display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex;gap:8px;">
          <div class="mini-stat" style="flex:1;text-align:center;padding:10px;">
            <div style="font-size:1.2rem;font-weight:800;color:var(--primary);">⭐ ${state.xp}</div>
            <div class="muted small">Toplam XP</div>
          </div>
          <div class="mini-stat" style="flex:1;text-align:center;padding:10px;">
            <div style="font-size:1.2rem;font-weight:800;color:var(--primary);">🔥 ${currentStreak()}</div>
            <div class="muted small">Günlük Seri</div>
          </div>
          <div class="mini-stat" style="flex:1;text-align:center;padding:10px;">
            <div style="font-size:1.2rem;font-weight:800;color:var(--primary);">🎖️ ${doneCount()}</div>
            <div class="muted small">Ünite</div>
          </div>
        </div>

        <div class="card" style="margin:0;padding:14px;background:color-mix(in srgb, var(--primary) 8%, var(--card-bg, #fff));">
          <b style="font-size:0.9rem;">📲 Cihazlar Arası Hızlı Eşitle</b>
          <p class="muted small" style="margin:4px 0 10px;">Bu telefondaki / bilgisayardaki puanlarını diğer cihazına tek tıkla kopyala:</p>
          <div class="type-row">
            <input class="text-input" id="profileSyncCode" value="${syncCode}" readonly style="font-size:0.75rem;" />
            <button class="btn btn-secondary sm" id="copyProfileSyncBtn">${icon('copy', '', 14)} Kopyala</button>
          </div>
        </div>

        <div class="modal-actions mt-2">
          <button class="btn btn-danger w-full justify-center" id="modalLogoutBtn">🚪 Hesaptan Çıkış Yap</button>
        </div>
      </div>
    `);

    $('#copyProfileSyncBtn').onclick = () => {
      navigator.clipboard.writeText($('#profileSyncCode').value).then(() => {
        toast('Eşitleme kodu kopyalandı! 📋 Diğer cihazındaki PatiLingo\'ya yapıştırabilirsin.');
      }).catch(() => {
        $('#profileSyncCode').select();
        document.execCommand('copy');
        toast('Eşitleme kodu kopyalandı! 📋');
      });
    };

    $('#modalLogoutBtn').onclick = async () => {
      if (confirm('Hesabından çıkış yapmak istediğinden emin misin?')) {
        await authService.logout();
        toast('Çıkış yapıldı. Misafir moduna geçildi.');
        closeModal();
        router();
      }
    };
    return;
  }

  // Giriş Yapmamış / Kayıt Olacak Kullanıcı Modalı
  openModal(`
    <div class="modal-head">
      <div class="modal-emoji">🐾</div>
      <div>
        <h2>PatiLingo Hesabı & Eşitleme</h2>
        <p class="muted small">İlerlemeni kaydet ve cihazların arasında tek tıkla eşitle.</p>
      </div>
    </div>

    <!-- Sekmeler -->
    <div style="display:flex;gap:6px;margin:14px 0;background:var(--line);padding:4px;border-radius:12px;">
      <button id="tabBtnLogin" class="btn btn-secondary sm flex-1 bold" style="background:var(--card-bg, #fff);">🔑 Giriş & Kayıt</button>
      <button id="tabBtnSync" class="btn btn-secondary sm flex-1 bold" style="color:var(--muted);">📲 Cihaz Eşitle</button>
    </div>

    <!-- Sekme 1: E-posta ile Giriş & Kayıt -->
    <div id="tabContentLogin" class="flex flex-col gap-2">
      <div>
        <label class="lbl">Adın / Takma Adın</label>
        <input type="text" id="modalNameIn" class="text-input" value="${esc(state.name !== 'Öğrenci' ? state.name : '')}" placeholder="Örn: Sena, Kenan" />
      </div>
      <div>
        <label class="lbl">E-posta</label>
        <input type="email" id="modalEmailIn" class="text-input" placeholder="ornek@gmail.com" autocomplete="email" />
      </div>
      <div>
        <label class="lbl">Şifre</label>
        <input type="password" id="modalPassIn" class="text-input" placeholder="En az 4 karakter" autocomplete="current-password" />
      </div>

      <div class="flex gap-2 mt-1">
        <button class="btn btn-primary btn-big flex-1 justify-center" id="modalEmailRegBtn">${icon('sparkles', '', 16)} Kayıt Ol</button>
        <button class="btn btn-secondary btn-big flex-1 justify-center" id="modalEmailLoginBtn">🔑 Giriş Yap</button>
      </div>

      <div style="text-align:center;position:relative;margin:10px 0 4px;">
        <hr style="border:none;border-top:1px solid var(--line);margin:0;" />
        <span style="position:relative;top:-10px;background:var(--card-bg, #fff);padding:0 10px;font-size:0.75rem;color:var(--muted);font-weight:700;">VEYA</span>
      </div>

      <button class="btn btn-secondary w-full justify-center" id="modalGoogleBtn" style="font-size:0.95rem;">
        <span style="font-size:1.1rem;">🌐</span> Google ile Giriş Yap
      </button>

      <div class="center mt-1">
        <button class="btn btn-secondary sm" id="modalGuestBtn" style="color:var(--muted);font-size:0.8rem;">👤 Misafir Modunda Kal</button>
      </div>
    </div>

    <!-- Sekme 2: Cihaz Eşitleme (Bilgisayar ↔ Telefon) -->
    <div id="tabContentSync" style="display:none; flex-direction:column; gap:12px;">
      <div class="card" style="margin:0;padding:12px;background:color-mix(in srgb, var(--primary) 8%, var(--card-bg, #fff));">
        <b style="font-size:0.88rem;">1. Bu Cihazdaki İlerlemeni Kopyala</b>
        <p class="muted small" style="margin:3px 0 8px;">Bu cihazdaki (${state.xp} XP, ${doneCount()} ünite) ilerlemeni diğer cihaza aktarmak için kodu al:</p>
        <div class="type-row">
          <input class="text-input" id="myDeviceCodeOut" value="${syncCode}" readonly style="font-size:0.75rem;" />
          <button class="btn btn-secondary sm" id="copyDeviceCodeBtn">${icon('copy', '', 14)} Kopyala</button>
        </div>
      </div>

      <div class="card" style="margin:0;padding:12px;">
        <b style="font-size:0.88rem;">2. Diğer Cihazdaki İlerlemeyi Buraya Aktar</b>
        <p class="muted small" style="margin:3px 0 8px;">Diğer cihazından aldığın kodu buraya yapıştırıp puanlarını birleştir:</p>
        <textarea id="incomingDeviceCodeIn" class="text-input" placeholder="Diğer cihazından kopyaladığın kodu buraya yapıştır..." style="height:65px;font-size:0.78rem;font-family:monospace;"></textarea>
        <button class="btn btn-primary btn-big w-full mt-2 justify-center" id="applyDeviceSyncBtn">⚡ Şimdi Eşitle & Birleştir</button>
      </div>
    </div>
  `);

  // Sekme Geçişleri
  $('#tabBtnLogin').onclick = () => {
    $('#tabBtnLogin').style.background = 'var(--card-bg, #fff)';
    $('#tabBtnLogin').style.color = 'var(--text)';
    $('#tabBtnSync').style.background = 'transparent';
    $('#tabBtnSync').style.color = 'var(--muted)';
    $('#tabContentLogin').style.display = 'flex';
    $('#tabContentSync').style.display = 'none';
  };

  $('#tabBtnSync').onclick = () => {
    $('#tabBtnSync').style.background = 'var(--card-bg, #fff)';
    $('#tabBtnSync').style.color = 'var(--text)';
    $('#tabBtnLogin').style.background = 'transparent';
    $('#tabBtnLogin').style.color = 'var(--muted)';
    $('#tabContentSync').style.display = 'flex';
    $('#tabContentLogin').style.display = 'none';
  };

  $('#copyDeviceCodeBtn').onclick = () => {
    navigator.clipboard.writeText($('#myDeviceCodeOut').value).then(() => {
      toast('Eşitleme kodu kopyalandı! 📋 Diğer cihazında "Cihaz Eşitle" bölümüne yapıştır.');
    }).catch(() => {
      $('#myDeviceCodeOut').select();
      document.execCommand('copy');
      toast('Eşitleme kodu kopyalandı! 📋');
    });
  };

  $('#applyDeviceSyncBtn').onclick = () => {
    const val = $('#incomingDeviceCodeIn').value.trim();
    if (!val) return toast('Lütfen diğer cihazından aldığın kodu yapıştır!');
    try {
      const res = mergeSyncCode(val);
      toast(`🎉 Cihazlar başarıyla eşitlendi! Toplam: ${res.xp} XP, ${res.unitsDone} Ünite`);
      closeModal();
      router();
    } catch (e) {
      toast(e.message);
    }
  };

  $('#modalGuestBtn').onclick = () => {
    authService.continueAsGuest(state.name || 'Öğrenci');
    closeModal();
    toast('Misafir modunda devam ediliyor.');
    location.hash = '#/progress';
    router();
  };

  $('#modalGoogleBtn').onclick = async () => {
    try {
      const u = await authService.signInWithGoogle();
      if (!u) return;
      toast(`Hoş geldin, ${u.displayName || u.email}! 🎉`);
      closeModal();
      router();
    } catch (err) {
      toast(err.message);
    }
  };

  $('#modalEmailRegBtn').onclick = async () => {
    const email = $('#modalEmailIn').value.trim();
    const pass = $('#modalPassIn').value.trim();
    const name = $('#modalNameIn').value.trim() || state.name;
    if (!email || !pass) return toast('Lütfen e-posta ve şifreni gir.');
    try {
      const u = await authService.registerWithEmail(email, pass, name);
      toast(`🎉 Tebrikler! Hesabın oluşturuldu. Hoş geldin, ${u.displayName}!`);
      closeModal();
      router();
    } catch (err) {
      toast(err.message);
    }
  };

  $('#modalEmailLoginBtn').onclick = async () => {
    const email = $('#modalEmailIn').value.trim();
    const pass = $('#modalPassIn').value.trim();
    if (!email || !pass) return toast('Lütfen e-posta ve şifreni gir.');
    try {
      const u = await authService.signInWithEmail(email, pass);
      toast(`Giriş yapıldı: ${u.displayName || u.email} ✅`);
      closeModal();
      router();
    } catch (err) {
      toast(err.message);
    }
  };
}

/* ============================================================
   Shimeji & Minik Efsaneler (Little Legends) Eğitim Yoldaşı: Fındık
   ============================================================ */
let shimejiController = null;

function initShimejiCompanion() {
  const root = $('#shimeji-root');
  if (!root) return;

  const sq = typeof getSquirrelGrowth === 'function'
    ? getSquirrelGrowth()
    : { stage: 1, id: 'baby', title: 'Minik Yavru Sincap', badge: '🌱 Evre 1 · Yavru', desc: 'Cik cik! Birlikte kelime toplayalım!' };
  const scaleMap = { baby: 0.96, explorer: 1.0, student: 1.05, scholar: 1.09, master: 1.14 };
  const curScale = scaleMap[sq.id] || 1;

  if (shimejiController) {
    shimejiController.refreshAppearance();
    return;
  }

  // Masaüstünde sol menünün (Seri "0 gün", XP ve "Giriş Yap / Eşitle") üstüne binmemesi için güvenli yatay sınır
  const getSafeMinX = () => ((window.innerWidth || 800) > 768 ? 290 : 18);
  const getSafeMaxX = () => Math.max(getSafeMinX() + 40, (window.innerWidth || 800) - 96);

  let posX = Math.max(getSafeMinX(), Math.min(getSafeMaxX(), (window.innerWidth || 800) > 768 ? 340 : 120));
  let posY = 0; // 0 = alt kenar, yüksek değer = üst kenar
  let roamZone = 'bottom'; // 'bottom' | 'top' | 'corners'
  let dir = 1; // 1 = sağa, -1 = sola
  let mode = 'walk'; // 'walk' | 'idle' | 'munch' | 'jump' | 'dance' | 'sad' | 'sleep' | 'dragging'
  let currentMood = 'normal'; // 'normal' | 'dance' | 'sad' | 'sleep'
  let modeTicks = 0;
  let lessonCombo = 0;
  let bubbleTimer = null;

  const starsText = (stageNum) => '★'.repeat(Math.max(1, Math.min(5, stageNum || 1)));
  const starTooltipText = (s) => `Seviye ${s.stage || 1}/5 (${s.title || 'Minik Sincap'}) · XP kazandıkça yıldız seviyesi artar`;

  // Saate göre kişisel selamlama (05-12 Good morning, 12-18 Good afternoon, 18-05 Good evening)
  function getPersonalGreeting() {
    const hr = new Date().getHours();
    const rawName = (state && state.name && state.name.trim()) ? state.name.trim() : 'Öğrenci';
    const uName = esc(rawName);
    if (hr >= 5 && hr < 12) {
      return {
        en: `☀️ Good morning, ${uName}!`,
        tr: `Günaydın, ${uName}!`,
        speakEn: `Good morning ${rawName}!`
      };
    }
    if (hr >= 12 && hr < 18) {
      return {
        en: `🌤️ Good afternoon, ${uName}!`,
        tr: `Tünaydın, ${uName}!`,
        speakEn: `Good afternoon ${rawName}!`
      };
    }
    return {
      en: `🌙 Good evening, ${uName}!`,
      tr: `İyi akşamlar, ${uName}!`,
      speakEn: `Good evening ${rawName}!`
    };
  }

  // Bağlama duyarlı mesaj ve günlük hedef ilerleme durumu (state.daily, currentStreak)
  function getContextGoalData() {
    const targetWords = 5; // Günlük hedef: 5 kelime (50 XP eşdeğeri)
    const todayXP = (state && state.daily && typeof todayStr === 'function')
      ? (state.daily[todayStr()] || 0)
      : 0;
    const doneWords = Math.min(targetWords, Math.floor(todayXP / 10));
    const remainingWords = Math.max(0, targetWords - doneWords);
    const pct = Math.min(100, Math.round((doneWords / targetWords) * 100));
    const streakCount = typeof currentStreak === 'function' ? currentStreak() : 0;

    let message = '';
    if (mode === 'sleep') {
      message = '💤 Fındık şu an mışıl mışıl dinleniyor. Birlikte çalışmaya devam etmek için onu uyandırabilirsin.';
    } else if (doneWords >= targetWords) {
      message = 'Bugünün hedefi tamam! 🎉 Fındık seninle gurur duyuyor.';
    } else if (doneWords > 0) {
      message = `Harika gidiyorsun! <b>${remainingWords} kelime</b> kaldı.`;
    } else if (streakCount === 0) {
      message = `Bugün serini başlatmak için <b>${targetWords} kelime</b> yeter!`;
    } else {
      message = `${streakCount} günlük serini korumak için bugün <b>${targetWords} kelime</b> tamamlayalım!`;
    }

    return {
      targetWords,
      doneWords,
      remainingWords,
      pct,
      streakCount,
      isComplete: doneWords >= targetWords,
      message
    };
  }

  // Tek renkli minimal vektörel SVG ikonlar
  const svgIcons = {
    dance: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    feed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v3"/><path d="M7 7c0-1.7 2.2-3 5-3s5 1.3 5 3H7z"/><path d="M8 7c0 6 1.5 11 4 14 2.5-3 4-8 4-14"/></svg>',
    remind: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/></svg>',
    sleep: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    wake: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
  };

  const initialGreet = getPersonalGreeting();
  const initialGoal = getContextGoalData();

  root.innerHTML = `
    <div id="shimejiPet" class="shimeji-pet state-walk" style="left:${posX}px;--shimeji-scale:${curScale};" role="region" aria-label="${esc(mascotService.getActive().name)} Eğitim Yoldaşı">
      <div id="shimejiEmoteFx" class="shimeji-emote-fx" aria-hidden="true"></div>
      <div id="shimejiBubble" class="shimeji-bubble" role="dialog" aria-label="${esc(mascotService.getActive().name)} Eğitim Yoldaşı Mesajı">
        <div class="shimeji-bubble-tail" aria-hidden="true"></div>
        <button type="button" class="shimeji-bubble-close" id="shimejiBubbleClose" aria-label="Kapat">✕</button>

        <div class="shimeji-greet-wrap" id="shimejiGreetWrap" tabindex="0" role="button" aria-label="Türkçe karşılığını görmek için tıkla veya üzerine gel">
          <span class="shimeji-greet-en" id="shimejiGreetEn">${initialGreet.en}</span>
          <span class="shimeji-greet-tr" id="shimejiGreetTr">${initialGreet.tr}</span>
        </div>

        <div class="shimeji-msg-text" id="shimejiBubbleBody">${initialGoal.message}</div>

        <div class="shimeji-goal-wrap" id="shimejiGoalWrap">
          <div class="shimeji-goal-meta">
            <span>Günlük Hedef</span>
            <span id="shimejiGoalLabel">${initialGoal.doneWords}/${initialGoal.targetWords} kelime</span>
          </div>
          <div class="shimeji-goal-track" role="progressbar" aria-valuemin="0" aria-valuemax="${initialGoal.targetWords}" aria-valuenow="${initialGoal.doneWords}" id="shimejiGoalTrack">
            <div class="shimeji-goal-fill" id="shimejiGoalFill" style="width:${initialGoal.pct}%;"></div>
          </div>
        </div>

        <div class="shimeji-primary-row">
          <button type="button" class="shimeji-cta-primary" id="shimejiPrimaryCta">${initialGoal.isComplete ? 'Tekrar yap' : 'Derse başla'}</button>
          <button type="button" class="shimeji-cta-secondary" id="shimejiHintBtn">İpucu</button>
        </div>

        <div class="shimeji-icon-toolbar" role="group" aria-label="${esc(mascotService.getActive().name)} Etkileşimleri">
          <button type="button" class="shimeji-icon-btn" id="shimejiDanceBtn" aria-label="Dans" data-tooltip="Dans">${svgIcons.dance}</button>
          <button type="button" class="shimeji-icon-btn" id="shimejiFeedBtn" aria-label="Besle" data-tooltip="Besle">${svgIcons.feed}</button>
          <button type="button" class="shimeji-icon-btn" id="shimejiRemindBtn" aria-label="Hatırlat" data-tooltip="Hatırlat">${svgIcons.remind}</button>
          <button type="button" class="shimeji-icon-btn" id="shimejiSleepBtn" aria-label="Uyut" data-tooltip="Uyut">${svgIcons.sleep}</button>
        </div>
      </div>
      <div id="shimejiSpriteWrap" class="shimeji-sprite-wrap" title="${esc(mascotService.getActive().name)} (Tıkla veya İstediğin Köşeye Sürükle)">
        <div id="shimejiSpriteInner" style="width:100%;height:100%;transform:scale(${curScale});transform-origin:bottom center;transition:transform 0.3s ease;">
          ${mascotService.getActive().id === 'squirrel' ? renderSquirrelStageSVG(sq.id, 'normal') : `<div class="shimeji-companion-avatar" style="font-size:3.5rem;line-height:1;text-align:center;">${mascotService.getActive().icon}</div>`}
        </div>
      </div>
      <div id="shimejiLegendBadge" class="shimeji-legend-badge" tabindex="0" data-tooltip="${esc(starTooltipText(sq))}" title="${esc(starTooltipText(sq))}" aria-label="${esc(starTooltipText(sq))}">${starsText(sq.stage)} ${esc(mascotService.getActive().name)}</div>
    </div>
  `;

  const petEl = $('#shimejiPet');
  const emoteEl = $('#shimejiEmoteFx');
  const badgeEl = $('#shimejiLegendBadge');
  const bubbleEl = $('#shimejiBubble');
  const bubbleBodyEl = $('#shimejiBubbleBody');
  const greetWrapEl = $('#shimejiGreetWrap');
  const greetEnEl = $('#shimejiGreetEn');
  const greetTrEl = $('#shimejiGreetTr');
  const goalLabelEl = $('#shimejiGoalLabel');
  const goalTrackEl = $('#shimejiGoalTrack');
  const goalFillEl = $('#shimejiGoalFill');
  const primaryCtaEl = $('#shimejiPrimaryCta');
  const hintBtnEl = $('#shimejiHintBtn');
  const spriteWrapEl = $('#shimejiSpriteWrap');
  const spriteInnerEl = $('#shimejiSpriteInner');
  const remindBtnEl = $('#shimejiRemindBtn');
  const sleepBtnEl = $('#shimejiSleepBtn');

  function syncViewportEdgeClasses() {
    if (!petEl) return;
    const winW = window.innerWidth || 800;
    const winH = window.innerHeight || 600;
    const minEdge = getSafeMinX() + 70;
    petEl.classList.toggle('near-top', posY > winH * 0.52);
    petEl.classList.toggle('near-left', posX < minEdge);
    petEl.classList.toggle('near-right', posX > winW - 210);
  }

  function updateLegendBadge() {
    if (!badgeEl) return;
    const latestSq = typeof getSquirrelGrowth === 'function' ? getSquirrelGrowth() : sq;
    const stars = starsText(latestSq.stage);
    const tip = starTooltipText(latestSq);
    const activeMascot = mascotService.getActive();
    badgeEl.textContent = lessonCombo >= 2
      ? `${stars} ${activeMascot.name} · 🔥 ${lessonCombo}x`
      : `${stars} ${activeMascot.name}`;
    badgeEl.setAttribute('data-tooltip', tip);
    badgeEl.setAttribute('title', tip);
    badgeEl.setAttribute('aria-label', tip);
  }

  // Baloncuk içindeki selamlama, hedef çubuğu ve bağlamsal birincil butonu canlı verilerle günceller
  function syncBubbleContextUI(customMessageHtml = null) {
    const gr = getPersonalGreeting();
    const goal = getContextGoalData();
    if (greetEnEl) greetEnEl.innerHTML = gr.en;
    if (greetTrEl) greetTrEl.innerHTML = gr.tr;
    if (bubbleBodyEl) {
      bubbleBodyEl.innerHTML = customMessageHtml !== null ? customMessageHtml : goal.message;
    }
    if (goalLabelEl) goalLabelEl.textContent = `${goal.doneWords}/${goal.targetWords} kelime`;
    if (goalTrackEl) goalTrackEl.setAttribute('aria-valuenow', String(goal.doneWords));
    if (goalFillEl) goalFillEl.style.width = `${goal.pct}%`;

    // Bağlamsal Odak: Fındık uyuyorsa birincil mor buton "Uyandır" olur, uyanıksa "Derse başla" / "Tekrar yap"
    if (primaryCtaEl) {
      if (mode === 'sleep') {
        primaryCtaEl.textContent = 'Uyandır';
        primaryCtaEl.setAttribute('aria-label', `${mascotService.getActive().name}'ı Uyandır`);
      } else {
        const label = goal.isComplete ? 'Tekrar yap' : 'Derse başla';
        primaryCtaEl.textContent = label;
        primaryCtaEl.setAttribute('aria-label', label);
      }
    }

    if (sleepBtnEl) {
      const isSleeping = mode === 'sleep';
      sleepBtnEl.innerHTML = isSleeping ? svgIcons.wake : svgIcons.sleep;
      sleepBtnEl.setAttribute('aria-label', isSleeping ? 'Uyandır' : 'Uyut');
      sleepBtnEl.setAttribute('data-tooltip', isSleeping ? 'Uyandır' : 'Uyut');
    }
  }

  function setEmote(text = '') {
    if (!emoteEl) return;
    if (!text) {
      emoteEl.textContent = '';
      emoteEl.classList.remove('active');
    } else {
      emoteEl.textContent = text;
      emoteEl.classList.add('active');
    }
  }

  function refreshAppearance(forcedMood = null) {
    const latestSq = typeof getSquirrelGrowth === 'function' ? getSquirrelGrowth() : sq;
    const nextScale = scaleMap[latestSq.id] || 1;
    const targetMood = forcedMood || currentMood;
    if (spriteInnerEl && (shimejiController?.lastStageId !== latestSq.id || shimejiController?.lastMood !== targetMood)) {
      spriteInnerEl.innerHTML = renderSquirrelStageSVG(latestSq.id, targetMood);
      spriteInnerEl.style.transform = `scale(${nextScale})`;
      if (shimejiController) {
        shimejiController.lastStageId = latestSq.id;
        shimejiController.lastMood = targetMood;
      }
    }
    if (petEl) petEl.style.setProperty('--shimeji-scale', nextScale);
    updateLegendBadge();
    syncBubbleContextUI(bubbleEl && bubbleEl.classList.contains('visible') ? bubbleBodyEl.innerHTML : null);
  }

  function setMode(newMode, durationTicks = 60, moodOverride = null) {
    if (mode === 'sleep' && newMode !== 'sleep' && newMode !== 'idle') return;
    mode = newMode;
    modeTicks = durationTicks;
    if (!petEl) return;
    petEl.classList.remove('state-walk', 'state-idle', 'state-munch', 'state-jump', 'state-dance', 'state-sad', 'state-sleep', 'dragging');
    if (newMode === 'dragging') {
      petEl.classList.add('dragging');
    } else {
      petEl.classList.add(`state-${newMode}`);
    }

    const nextMood = moodOverride || (
      newMode === 'dance' ? 'dance'
      : newMode === 'sad' ? 'sad'
      : newMode === 'sleep' ? 'sleep'
      : 'normal'
    );
    currentMood = nextMood;
    refreshAppearance(nextMood);

    if (newMode === 'dance') setEmote('🎵 ✨ 🎉');
    else if (newMode === 'sad') setEmote('🥺 💧 💪');
    else if (newMode === 'munch') setEmote('🌰 🧡');
    else if (newMode === 'sleep') setEmote('💤');
    else setEmote('');
  }

  function closeBubble() {
    if (!bubbleEl) return;
    bubbleEl.classList.remove('visible');
    if (bubbleTimer) {
      clearTimeout(bubbleTimer);
      bubbleTimer = null;
    }
  }

  function showBubble(htmlContent = null, _headTitle = null, autoHideMs = 15000, bubbleMood = '') {
    if (!bubbleEl || !bubbleBodyEl) return;
    syncViewportEdgeClasses();
    bubbleEl.classList.remove('mood-dance', 'mood-sad');
    if (bubbleMood) bubbleEl.classList.add(`mood-${bubbleMood}`);
    syncBubbleContextUI(htmlContent);
    bubbleEl.classList.add('visible');
    if (bubbleTimer) clearTimeout(bubbleTimer);
    if (autoHideMs > 0) {
      bubbleTimer = setTimeout(() => {
        bubbleEl.classList.remove('visible');
      }, autoHideMs);
      if (bubbleTimer && typeof bubbleTimer.unref === 'function') bubbleTimer.unref();
    }
  }

  // İngilizce selamlamaya tıklayınca veya Enter/Space basınca Türkçe karşılığını aç/kapat (hover/focus zaten CSS ile çalışır)
  if (greetWrapEl) {
    greetWrapEl.onclick = (e) => {
      e.stopPropagation();
      greetWrapEl.classList.toggle('tr-open');
      const gr = getPersonalGreeting();
      if (typeof speak === 'function' && gr.speakEn) speak(gr.speakEn, 'en');
    };
    greetWrapEl.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        greetWrapEl.classList.toggle('tr-open');
      }
    };
  }

  // Her tıklamada tekrar etmeyen, sırayla yenilenen kelime ve gramer destesi
  let hintCallCounter = 0;
  function giveSmartHelp() {
    if (window.currentActiveLessonQuestion && typeof getSquirrelQuestionClue === 'function') {
      const clue = getSquirrelQuestionClue(window.currentActiveLessonQuestion);
      showBubble(clue, null, 15000);
      setMode('jump', 24);
      if (window.currentActiveLessonQuestion.speak && typeof speak === 'function') {
        speak(window.currentActiveLessonQuestion.speak);
      }
      return;
    }
    if (!state.companion) state.companion = { fedCount: 0, lastHintIdx: 0, lastGrammarIdx: 0 };
    hintCallCounter++;

    if (hintCallCounter % 3 !== 0) {
      const vocabUnits = UNITS.filter(u => u.type === 'vocab' && (u.level === 'A1' || state.a2Unlocked));
      const pool = vocabUnits.flatMap(u => (u.words || []).map(w => ({ ...w, unitTitle: u.title })));
      if (pool.length > 0) {
        const cursor = (state.companion.lastHintIdx || 0);
        const stepPrime = 7;
        const w = pool[(cursor * stepPrime) % pool.length];
        state.companion.lastHintIdx = cursor + 1;
        saveState();
        showBubble(
          `${w.emoji || '🌰'} <b>"${esc(w.en)}"</b> Türkçede <b>"${esc(w.tr)}"</b> demektir! <span class="muted small">(${esc(w.unitTitle || 'Kelime')})</span>`,
          null,
          14000
        );
        setMode('jump', 22);
        if (typeof speak === 'function') speak(w.en, 'en');
        return;
      }
    }

    const tips = typeof SQUIRREL_GRAMMAR_TIPS !== 'undefined' && Array.isArray(SQUIRREL_GRAMMAR_TIPS) && SQUIRREL_GRAMMAR_TIPS.length
      ? SQUIRREL_GRAMMAR_TIPS
      : [{ title: '🧩 Cümle Kurulumu', rule: 'İngilizcede cümleler Özne + Fiil + Nesne sırasıyla kurulur.', en: 'I learn English every day.', tr: 'Ben her gün İngilizce öğrenirim.' }];
    const gCursor = (state.companion.lastGrammarIdx || 0);
    const tip = tips[gCursor % tips.length];
    state.companion.lastGrammarIdx = gCursor + 1;
    saveState();
    const tipHtml = typeof tip === 'object'
      ? `<b>${esc(tip.title)}:</b> ${esc(tip.rule)}<br><span class="muted small">🗣️ Örnek: <b>"${esc(tip.en)}"</b> (${esc(tip.tr)})</span>`
      : String(tip);
    showBubble(tipHtml, null, 15000);
    setMode('idle', 60);
    if (tip && typeof tip === 'object' && tip.en && typeof speak === 'function') {
      speak(tip.en, 'en');
    }
  }

  // Kapatma (X) Butonu
  if ($('#shimejiBubbleClose')) {
    $('#shimejiBubbleClose').onclick = (e) => {
      e.stopPropagation();
      closeBubble();
    };
  }

  // Birincil Buton: Uyuyorsa "Uyandır", uyanıksa "Derse başla" veya "Tekrar yap"
  if (primaryCtaEl) {
    primaryCtaEl.onclick = (e) => {
      e.stopPropagation();
      if (mode === 'sleep') {
        mode = 'idle';
        closeBubble();
        setMode('dance', 90, 'dance');
        return;
      }
      const goal = getContextGoalData();
      closeBubble();
      if (goal.isComplete) {
        location.hash = '#/review';
      } else {
        const targetUnit = typeof nextUnit === 'function' ? nextUnit() : (UNITS && UNITS[0]);
        location.hash = targetUnit ? `#/lesson/${targetUnit.id}` : '#/home';
      }
    };
  }

  // İkincil Buton: İpucu
  if (hintBtnEl) {
    hintBtnEl.onclick = (e) => {
      e.stopPropagation();
      giveSmartHelp();
    };
  }

  // İkon Araç Çubuğu: 1. Dans (Baloncuğu hemen gizle ve 5.5 saniye neşeyle dans et)
  if ($('#shimejiDanceBtn')) {
    $('#shimejiDanceBtn').onclick = (e) => {
      e.stopPropagation();
      if (mode === 'sleep') mode = 'idle';
      closeBubble();
      setMode('dance', 125, 'dance');
    };
  }

  // İkon Araç Çubuğu: 2. Besle (Baloncuğu hemen gizle ve 5 saniye meşe palamudu kemir)
  if ($('#shimejiFeedBtn')) {
    $('#shimejiFeedBtn').onclick = (e) => {
      e.stopPropagation();
      if (mode === 'sleep') mode = 'idle';
      if (!state.companion) state.companion = { fedCount: 0, lastHintIdx: 0, lastGrammarIdx: 0 };
      state.companion.fedCount = (state.companion.fedCount || 0) + 1;
      saveState();
      closeBubble();
      setMode('munch', 115);
      if (typeof toast === 'function') {
        toast(`${curMascot.fedToast || 'Yoldaşın afiyetle beslendi!'} (Toplam ${state.companion.fedCount}. kez)`);
      }
    };
  }

  // İkon Araç Çubuğu: 3. Hatırlat (Çalar saat ikonu — günlük hedef hatırlatıcısı)
  if (remindBtnEl) {
    remindBtnEl.onclick = (e) => {
      e.stopPropagation();
      const goal = getContextGoalData();
      if (typeof toggleReminder === 'function') {
        toggleReminder(true, state.reminderTime || '20:00');
      }
      setMode('jump', 26);
      const msg = goal.isComplete
        ? `⏰ Günlük hatırlatıcın aktif (<b>${esc(state.reminderTime || '20:00')}</b>)! Yarın da serini sürdürmen için seni haberdar edeceğim.`
        : `⏰ Hatırlatıcı kuruldu! Bugünkü hedefin için <b>${goal.remainingWords} kelime</b> kaldı, birlikte tamamlayalım!`;
      showBubble(msg, null, 12000);
    };
  }

  // İkon Araç Çubuğu: 4. Uyut / Uyandır (Baloncuğu hemen gizle ve uykuya/dansa geç)
  if (sleepBtnEl) {
    sleepBtnEl.onclick = (e) => {
      e.stopPropagation();
      closeBubble();
      if (mode === 'sleep') {
        mode = 'idle';
        setMode('dance', 95, 'dance');
      } else {
        setMode('sleep', 999999, 'sleep');
      }
    };
  }

  // Escape tuşu ve dışarı tıklama baloncuğu kapatsın
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bubbleEl && bubbleEl.classList.contains('visible')) {
      closeBubble();
    }
  });

  document.addEventListener('pointerdown', (e) => {
    if (!bubbleEl || !bubbleEl.classList.contains('visible')) return;
    if (petEl && !petEl.contains(e.target)) {
      closeBubble();
    }
  });

  window.addEventListener('resize', () => {
    const minX = getSafeMinX();
    const maxX = getSafeMaxX();
    if (posX < minX) {
      posX = minX;
      if (petEl) petEl.style.left = `${Math.round(posX)}px`;
    } else if (posX > maxX) {
      posX = maxX;
      if (petEl) petEl.style.left = `${Math.round(posX)}px`;
    }
    syncViewportEdgeClasses();
  });

  // Sürükle-Bırak ve Tıklama
  let isDragging = false;
  let dragMoved = false;
  let startPointerX = 0;
  let startPointerY = 0;
  let startPetX = 0;
  let startPetBottom = 0;

  if (spriteWrapEl) {
    spriteWrapEl.onpointerdown = (e) => {
      if (e.button && e.button !== 0) return;
      isDragging = true;
      dragMoved = false;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      startPetX = posX;
      startPetBottom = posY;
      if (spriteWrapEl.setPointerCapture) {
        try { spriteWrapEl.setPointerCapture(e.pointerId); } catch (_) {}
      }
    };

    spriteWrapEl.onpointermove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startPointerX;
      const dy = startPointerY - e.clientY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        if (!dragMoved) {
          dragMoved = true;
          setMode('dragging', 999);
        }
        const minW = getSafeMinX();
        const maxW = getSafeMaxX();
        const maxH = Math.max(120, (window.innerHeight || 600) - 96);
        posX = Math.max(minW, Math.min(maxW, startPetX + dx));
        posY = Math.max(0, Math.min(maxH, startPetBottom + dy));
        petEl.style.left = `${Math.round(posX)}px`;
        petEl.style.bottom = `${Math.round(posY)}px`;
        syncViewportEdgeClasses();
      }
    };

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      if (spriteWrapEl.releasePointerCapture && e && e.pointerId !== undefined) {
        try { spriteWrapEl.releasePointerCapture(e.pointerId); } catch (_) {}
      }
      if (dragMoved) {
        const winH = window.innerHeight || 600;
        petEl.style.transition = 'bottom 0.42s cubic-bezier(0.34, 1.56, 0.64, 1)';
        if (posY > winH * 0.55) {
          roamZone = 'top';
          posY = Math.max(120, winH - 96);
          petEl.style.bottom = `${Math.round(posY)}px`;
          showBubble('🐿️ Ekranın <b>üst kenarına</b> tutundum, buradan dersine eşlik edeceğim!', null, 4500);
        } else {
          roamZone = 'bottom';
          posY = 0;
          petEl.style.bottom = '';
          showBubble(null, null, 4500);
        }
        syncViewportEdgeClasses();
        const fallTimer = setTimeout(() => {
          if (petEl) petEl.style.transition = '';
          setMode('jump', 18);
        }, 430);
        if (fallTimer && typeof fallTimer.unref === 'function') fallTimer.unref();
      } else {
        // Sadece tıklandı: Baloncuk kapalıysa bağlamsal mesajı aç, açıksa yeni ipucu ver
        if (bubbleEl.classList.contains('visible')) {
          giveSmartHelp();
        } else {
          if (window.currentActiveLessonQuestion && typeof getSquirrelQuestionClue === 'function') {
            showBubble(getSquirrelQuestionClue(window.currentActiveLessonQuestion), null, 10000);
          } else {
            showBubble(null, null, 9000);
          }
          if (mode !== 'sleep') setMode('jump', 16);
        }
      }
    };

    spriteWrapEl.onpointerup = endDrag;
    spriteWrapEl.onpointercancel = endDrag;
  }

  // Davranış Kuralı: Baloncuk günde yalnızca BİR KEZ otomatik açılsın (localStorage ile kontrol edilir)
  if (state.onboarded) {
    const AUTO_BUBBLE_KEY = 'patilingo_shimeji_auto_date';
    const todayKey = typeof todayStr === 'function' ? todayStr() : new Date().toISOString().slice(0, 10);
    let alreadyShownToday = false;
    try {
      alreadyShownToday = localStorage.getItem(AUTO_BUBBLE_KEY) === todayKey;
    } catch (_) {}

    if (!alreadyShownToday) {
      const welcomeTimer = setTimeout(() => {
        if (mode !== 'sleep' && !window.currentActiveLessonQuestion) {
          try { localStorage.setItem(AUTO_BUBBLE_KEY, todayKey); } catch (_) {}
          showBubble(null, null, 8000);
          setMode('jump', 18);
        }
      }, 900);
      if (welcomeTimer && typeof welcomeTimer.unref === 'function') welcomeTimer.unref();
    }
  }

  // Otonom, Doğal Shimeji / Little Legends Gezinme Döngüsü (Sol menünün üstüne binmez)
  const timerId = setInterval(() => {
    if (!document.body.contains(petEl)) return;
    if (isDragging || mode === 'sleep') return;

    if (modeTicks > 0) {
      modeTicks--;
    } else {
      const roll = Math.random();
      if (roamZone === 'corners') {
        setMode(roll < 0.78 ? 'idle' : 'munch', 70 + Math.floor(Math.random() * 80));
      } else if (mode === 'walk') {
        setMode(roll < 0.75 ? 'idle' : 'munch', 75 + Math.floor(Math.random() * 95));
      } else if (roll < 0.48) {
        if (Math.random() < 0.45) dir = dir * -1;
        setMode('walk', 38 + Math.floor(Math.random() * 52));
      } else if (roll < 0.85) {
        setMode('idle', 65 + Math.floor(Math.random() * 80));
      } else {
        setMode('munch', 40 + Math.floor(Math.random() * 45));
      }
    }

    if (mode === 'walk' && roamZone !== 'corners') {
      const minX = getSafeMinX();
      const maxX = getSafeMaxX();
      posX += dir * 1.15;
      if (posX >= maxX) {
        posX = maxX;
        dir = -1;
      } else if (posX <= minX) {
        posX = minX;
        dir = 1;
      }
      petEl.style.left = `${posX.toFixed(1)}px`;
      petEl.classList.toggle('face-left', dir === -1);
      syncViewportEdgeClasses();
    }
  }, 45);
  if (timerId && typeof timerId.unref === 'function') timerId.unref();

  syncViewportEdgeClasses();

  shimejiController = {
    timerId,
    lastStageId: sq.id,
    lastMood: 'normal',
    refreshAppearance,
    showBubble,
    closeBubble,
    setMode,
    giveSmartHelp
  };

  window.shimejiSay = (htmlText, badgeTitle = '🐿️ Fındık') => {
    showBubble(htmlText, badgeTitle, 8500);
    if (mode !== 'sleep') setMode('jump', 20);
  };

  // Oyunlaştırma (Gamification): Doğru cevapta dans et & kutla, yanlış cevapta üzül & ipucu/moral ver!
  window.shimejiOnLessonAnswer = (isCorrect, q) => {
    if (mode === 'sleep') return;
    if (isCorrect) {
      lessonCombo++;
      updateLegendBadge();
      setMode('dance', 52, 'dance');
      const comboTag = lessonCombo >= 2 ? ` <b>(🔥 ${lessonCombo}x Kombo!)</b>` : '';
      const praises = [
        `💃 <b>Harika bildin!</b> Senin için zafer dansı yapıyorum!${comboTag}`,
        `🎉 <b>Süpersin!</b> Bir altın palamut daha kazandık, böyle devam et!${comboTag}`,
        `⭐ <b>Tam isabet!</b> İngilizcen her soruda daha da güçleniyor!${comboTag}`,
        `🎵 <b>Muhteşem!</b> Seninle gurur duyuyorum ortak!${comboTag}`
      ];
      showBubble(
        praises[Math.floor(Math.random() * praises.length)],
        null,
        4600,
        'dance'
      );
    } else {
      lessonCombo = 0;
      updateLegendBadge();
      setMode('sad', 65, 'sad');
      const morals = [
        '🥺 <b>Hiç üzülme!</b> Hata yaparak öğrenmek en kalıcı yoldur. Bak sana küçük bir sır vereyim:',
        '💧 <b>Canın sağ olsun ortak!</b> Birlikte doğrusunu hemen kavrayacağız:',
        '💪 <b>Pes etmek yok!</b> Ben yanındayım, bu sorunun püf noktası şöyle:'
      ];
      const moralIntro = morals[Math.floor(Math.random() * morals.length)];
      const cluePart = (q && typeof getSquirrelQuestionClue === 'function')
        ? `<div style="margin-top:6px;padding-top:6px;border-top:1px dashed var(--border);">${getSquirrelQuestionClue(q)}</div>`
        : '';
      showBubble(
        `${moralIntro}${cluePart}`,
        null,
        9000,
        'sad'
      );
    }
  };
}

/* ---------- Service Worker Kaydı (Çevrim Dışı Destek) ---------- */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      console.log('PatiLingo Service Worker aktif:', reg.scope);
    }).catch(err => {
      console.warn('Service Worker kaydı atlandı:', err.message);
    });
  });
}

