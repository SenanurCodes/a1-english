/* ============================================================
   Uygulama: yönlendirme (router) ve ekranlar
   ============================================================ */
const view = () => $('#view');
let pendingAILesson = null;

const NAV_DESKTOP = [
  ['home', '🏠', 'Ana Sayfa'],
  ['learn', '🗺️', 'Öğren'],
  ['logic', '💡', 'Dil Mantığı'],
  ['leaderboard', '🏆', 'Rekabet'],
  ['review', '🔁', 'Tekrar'],
  ['cards', '🃏', 'Kartlar'],
  ['ai', '🤖', 'AI Öğretmen'],
  ['progress', '📊', 'İlerleme'],
  ['settings', '⚙️', 'Ayarlar']
];

const NAV_MOBILE = [
  ['home', '🏠', 'Ana Sayfa'],
  ['learn', '🗺️', 'Öğren'],
  ['logic', '💡', 'Mantık'],
  ['cards', '🃏', 'Kartlar'],
  ['more', '✨', 'Menü']
];

const MORE_LINKS = [
  { id: 'leaderboard', icon: '🏆', title: 'Rekabet & Liderlik', desc: 'Arkadaşlarınla yarış ve skorunu paylaş' },
  { id: 'ai', icon: '🤖', title: 'AI Öğretmen', desc: 'Google Gemini ile seviye analizi ve pratik' },
  { id: 'review', icon: '🔁', title: 'Akıllı Tekrar', desc: 'Aralıklı tekrar sistemi ve hata havuzu' },
  { id: 'progress', icon: '📊', title: 'İlerleme Grafiği', desc: 'Haftalık XP ve ünite başarı tablosu' },
  { id: 'settings', icon: '⚙️', title: 'Ayarlar', desc: 'Profil, ses hızı ve Gemini API anahtarı' }
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
            <span class="msh-icon">✨</span>
            <b>Diğer Bölümler</b>
          </div>
          <button class="icon-btn close-sheet-btn" id="closeMenuBtn" aria-label="Kapat">✕</button>
        </div>
        <div class="menu-sheet-grid">
          ${MORE_LINKS.map(item => `
            <a href="#/${item.id}" class="menu-item ${active === item.id ? 'active' : ''}">
              <span class="menu-icon">${item.icon}</span>
              <div class="menu-info">
                <b>${esc(item.title)}</b>
                <p class="muted small">${esc(item.desc)}</p>
              </div>
              <span class="menu-arr">→</span>
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
      <a href="#/home" class="mh-brand">
        <span class="mh-logo">${curMascot.icon}</span>
        <span class="mh-title">A1 English</span>
      </a>
      <div class="mh-stats">
        <a href="#/progress" class="mh-badge streak" title="Günlük Seri">🔥 ${currentStreak()}</a>
        <a href="#/progress" class="mh-badge xp" title="Toplam XP">⭐ ${state.xp}</a>
        <a href="#/settings" class="mh-btn" title="Yoldaşın: ${esc(curMascot.name)}">${curMascot.icon}</a>
        <a href="#/settings" class="mh-btn" title="Ayarlar">⚙️</a>
      </div>
    `;
  }

  // Kenar çubuğu / Alt bar (Sidebar)
  const isMoreActive = MORE_LINKS.some(x => x.id === active);
  
  $('#nav').innerHTML = `
    <!-- Masaüstü Sidebar -->
    <div class="desktop-nav">
      <div class="logo">
        <span class="logo-icon">${curMascot.icon}</span>
        <div>
          <div class="logo-text">A1 English</div>
          <div class="logo-sub muted small">${curMascot.icon} ${esc(curMascot.name)}</div>
        </div>
      </div>
      <div class="nav-links">
        ${NAV_DESKTOP.map(([id, icon, label]) => `
          <a href="#/${id}" class="nav-link ${active === id ? 'active' : ''}">
            <span class="nav-icon">${icon}</span>
            <span class="nav-label">${label}</span>
          </a>
        `).join('')}
      </div>
      <div class="nav-foot" style="flex-direction:column;gap:8px;padding:8px 6px;">
        <div style="display:flex;gap:6px;width:100%;">
          <div class="mini-stat" style="flex:1;">🔥 ${currentStreak()} gün</div>
          <div class="mini-stat" style="flex:1;">⭐ ${state.xp} XP</div>
        </div>
        ${isGuest ? `<button class="btn btn-ghost sm" id="navAuthBtn" style="width:100%;font-size:0.82rem;padding:7px 10px;">👤 Giriş Yap</button>` : ''}
      </div>
    </div>

    <!-- Mobil Alt Menü Barı (5 ferah sekme) -->
    <div class="mobile-nav">
      ${NAV_MOBILE.map(([id, icon, label]) => {
        if (id === 'more') {
          return `
            <button type="button" class="nav-link ${isMoreActive ? 'active' : ''}" id="moreNavBtn">
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

  if (!state.onboarded && route !== 'placement') {
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

  const r = route || 'home';
  renderNav(r === 'grammar' ? 'learn' : r);
  window.scrollTo(0, 0);
  const screens = {
    home: screenHome, learn: screenLearn, logic: screenLogic, leaderboard: screenLeaderboard, review: screenReview, cards: screenCards, ai: screenAI,
    progress: screenProgress, settings: screenSettings, grammar: screenGrammar, lesson: screenLesson,
    placement: screenPlacement, 'ai-lesson': screenAILesson, 'boss-a1': screenA1Boss
  };
  (screens[r] || screenHome)(param);
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
  document.body.classList.add('focus-mode');
  let selectedMascot = state.mascot || 'cat';
  let selectedTheme = state.theme || 'nordic';

  view().innerHTML = `
    <div class="onboard" style="width:100%;max-width:640px;margin:0 auto;">
      <div class="onboard-hero">${(MASCOT_BY_ID && MASCOT_BY_ID[selectedMascot]) ? MASCOT_BY_ID[selectedMascot].icon : '🐾'}</div>
      <h1 class="rainbow-text">A1 English</h1>
      <p class="lead">Sana özel yoldaşın ve renklerinle İngilizce öğrenmeye başla! 🎈</p>
      
      <div class="card onboard-card" style="width:100%;max-width:640px;box-sizing:border-box;">
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
        </div>
      </div>
    </div>`;

  // Yoldaş seçimi
  $$('.mascot-card').forEach(card => {
    card.onclick = () => {
      $$('.mascot-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedMascot = card.dataset.m;
      store.setMascot(selectedMascot);
      $('.onboard-hero').textContent = MASCOT_BY_ID[selectedMascot].icon;
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
  const isGuest = state.auth ? state.auth.isGuest : true;

  view().innerHTML = `
    <div class="page">
      <header class="page-head">
        <div>
          <h1>${greet}, ${esc(state.name)}! 👋</h1>
          <p class="muted">Bugün ${todayXP} XP kazandın. ${todayXP >= 50 ? 'Günlük hedefin tamamlandı! 🎯' : `Günlük hedefe ${50 - todayXP} XP kaldı.`}</p>
        </div>
      </header>

      ${isGuest ? `
        <div class="guest-banner">
          <div>
            <div class="gb-title">✨ Misafir Modundasın</div>
            <div class="gb-sub">İlerlemen şu anda bu cihazda tutuluyor. Puanlarını kaybetmemek için Google hesabını bağlayabilirsin.</div>
          </div>
          <button class="btn btn-primary sm" id="homeLinkAuthBtn">🚀 Hesaba Bağla</button>
        </div>
      ` : ''}

      <div class="card companion-banner" style="display:flex;align-items:center;gap:14px;background:color-mix(in srgb, var(--primary) 8%, var(--card-bg));border:2px solid var(--line);border-radius:20px;padding:16px 20px;margin-bottom:16px;">
        <div style="font-size:2.8rem;line-height:1;">${curMascot.icon}</div>
        <div style="flex:1;">
          <div style="font-weight:900;font-size:1.05rem;color:var(--text);">${esc(curMascot.name)} · <span style="color:var(--muted);font-weight:600;font-size:0.85rem;">${esc(curMascot.animal)}</span></div>
          <div style="font-size:0.88rem;color:var(--text);margin-top:3px;line-height:1.4;">"${esc(curMascot.motto)}"</div>
        </div>
        <a class="btn btn-ghost sm" href="#/settings" title="Yoldaşı Değiştir">🔄 Yoldaş</a>
      </div>

      <div class="grid-3 stats-row">
        <div class="stat-card grad-1"><div class="sc-icon">🔥</div><div class="sc-val">${currentStreak()}</div><div class="sc-lbl">günlük seri</div></div>
        <div class="stat-card grad-2"><div class="sc-icon">⭐</div><div class="sc-val">${state.xp}</div><div class="sc-lbl">toplam XP · Lv ${xl.level}</div></div>
        <div class="stat-card grad-3"><div class="sc-icon">🏅</div><div class="sc-val">${lvl.done}/${UNITS.length}</div><div class="sc-lbl">ünite tamamlandı</div></div>
      </div>

      ${(() => {
        const list = getLeaderboardList();
        const rivals = list.filter(u => !u.isMe);
        if (rivals.length === 0) return '';
        const topRival = rivals[0];
        const diff = state.xp - topRival.xp;
        let rivalryMsg = diff > 0 
          ? `🔥 <b>${esc(topRival.name)}</b>'ın <b>${diff} XP</b> önündesin! Liderliği bırakma!` 
          : diff < 0 
          ? `⚡ <b>${esc(topRival.name)}</b> <b>${Math.abs(diff)} XP</b> ile önünde! Hemen bir ders yapıp yetiş!` 
          : `🤝 <b>${esc(topRival.name)}</b> ile kafa kafayasınız! (İkiniz de ${state.xp} XP)`;
        return `
        <div class="card rivalry-card">
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

      <div class="card level-card">
        <div class="level-top">
          <div>
            <div class="muted small">Mevcut Seviye · Dünya 1</div>
            <div class="level-label">${lvl.label}</div>
            <div class="muted">${lvl.desc}</div>
            ${state.a1BossPassed ? '<div style="margin-top:4px;"><span class="badge" style="background:#51CF66;color:#fff;padding:3px 10px;border-radius:99px;font-size:0.75rem;font-weight:800;">👑 A1 Mezuniyet Rozeti Aktif · A2 Dünyası Açık</span></div>' : ''}
          </div>
          <div class="ring" style="--p:${lvl.pct}"><span>%${lvl.pct}</span></div>
        </div>
        <div class="progress thick"><div class="bar rainbow" style="width:${lvl.pct}%"></div></div>
        <div class="daily-goal"><span>Günlük hedef</span><div class="progress"><div class="bar" style="width:${Math.min(100, todayXP * 2)}%;background:#51CF66"></div></div><span>${Math.min(todayXP, 50)}/50</span></div>
      </div>

      <div class="grid-2">
        ${nu ? `
        <div class="card action-card" style="--c:${nu.color}">
          <div class="ac-emoji">${nu.emoji}</div>
          <div class="ac-body">
            <div class="muted small">Sıradaki ünite · ${nu.type === 'vocab' ? 'Kelime' : 'Gramer'}</div>
            <h3>${esc(nu.title)}</h3>
            <div class="ac-actions">
              ${nu.type === 'grammar' ? `<a class="btn btn-ghost" href="#/grammar/${nu.id}">📖 Konu</a>` : `<a class="btn btn-ghost" href="#/cards/${nu.id}">🃏 Kartlar</a>`}
              <a class="btn btn-primary" href="#/lesson/${nu.id}">▶ Derse Başla</a>
            </div>
          </div>
        </div>` : `
        <div class="card action-card" style="--c:#FCC419"><div class="ac-emoji">🎓</div><div class="ac-body"><h3>Tüm A1 üniteleri tamam!</h3><p class="muted">${state.a1BossPassed ? 'A1 Final Sınavı tamamlandı! Tekrar yaparak bilgini pekiştirebilirsin.' : 'Şimdi Haritadan A1 Boss Testi\'ne girerek A2 Dünyası\'nı açabilirsin!'}</p><div class="ac-actions"><a class="btn btn-primary" href="#/learn">🗺️ Haritaya Git</a></div></div></div>`}

        <div class="card action-card" style="--c:#20C997">
          <div class="ac-emoji">🔁</div>
          <div class="ac-body">
            <div class="muted small">Akıllı tekrar</div>
            <h3>${due ? `${due} kelime tekrar bekliyor` : 'Tekrar edilecek kelime yok'}</h3>
            <div class="ac-actions"><a class="btn ${due ? 'btn-primary' : 'btn-ghost'}" href="#/review">Tekrar Et</a></div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card wotd" style="--c:${UNIT_BY_ID[wotd.unitId].color}">
          <div class="muted small">✨ Günün kelimesi</div>
          <div class="wotd-row">
            <div class="wotd-emoji">${wotd.emoji}</div>
            <div><div class="wotd-en">${esc(wotd.en)}</div><div class="muted">${esc(wotd.tr)}</div></div>
            <button class="speak-btn" data-say="${esc(wotd.en)}" aria-label="Günün kelimesini dinle" title="Dinle">🔊</button>
          </div>
        </div>
        <div class="card ai-teaser">
          <div class="muted small">🤖 AI Öğretmen</div>
          <h3>${hasAI() ? 'Seviyeni analiz etmemi ister misin?' : 'Yapay zeka öğretmenini etkinleştir'}</h3>
          <p class="muted">${hasAI() ? 'Hatalarına bakıp sana özel plan ve alıştırma hazırlarım.' : 'Ücretsiz bir Gemini anahtarıyla sana özel analiz, alıştırma ve sohbet pratiği.'}</p>
          <a class="btn btn-purple" href="#/ai">${hasAI() ? 'AI Öğretmene Git' : 'Nasıl yapılır?'}</a>
        </div>
      </div>
    </div>`;

  if ($('#homeLinkAuthBtn')) {
    $('#homeLinkAuthBtn').onclick = () => openAuthModal();
  }
  $$('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
}

/* ============================================================
   Dil Mantığı & Türkçe Rehber (Duolingo Tarzı Değil!)
   ============================================================ */
function screenLogic() {
  view().innerHTML = `
    <div class="page">
      <header class="page-head">
        <div>
          <h1>💡 Dil Mantığı & Türkçe Rehber</h1>
          <p class="muted">Ezber kurallar değil; Türk beyninin İngilizceyi doğal kavramasını sağlayan mantık ve tüyolar.</p>
        </div>
      </header>

      <div class="logic-grid">
        ${LOGIC_GUIDES.map(g => `
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
                    <div class="trap-wrong">❌ <s>${esc(t.wrong)}</s></div>
                    <div class="trap-right">✅ <b>${esc(t.right)}</b> <button class="speak-btn sm" data-say="${esc(t.right)}" aria-label="Doğru kullanımı dinle" title="Dinle">🔊</button></div>
                    <div class="trap-why muted small">${esc(t.why)}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>`;

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
          <p class="muted small">Bu linki WhatsApp'tan arkadaşına gönder! Linke tıkladığında doğrudan bu lige katılır ve ikinizin puanları canlı güncellenir.</p>
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
                  <div class="lb-name"><b>${esc(u.name)}</b> ${u.isMe ? '<span class="tag-me">SEN</span>' : ''}</div>
                  <div class="lb-sub muted small">🔥 ${u.streak || 0} gün seri · 🏅 ${u.unitsDone || 0} ünite</div>
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
          <summary style="font-weight:800;color:var(--muted);padding:4px 0;outline:none;">📦 Çevrimdışı Kod ile Yarış (Eski Manuel Seçenek - Tıkla ve Aç)</summary>
          <p class="muted small" style="margin-top:10px;">İnternetsiz ortamlar için tek seferlik puan kopyalama yöntemi.</p>

          <div class="code-box">
            <label class="lbl">Senin Tek Seferlik Kodun (Anlık Skor):</label>
            <div class="type-row">
              <input id="myShareCode" class="text-input" value="${myCode}" readonly />
              <button class="btn btn-purple" id="copyCodeBtn">📋 Kopyala</button>
            </div>
            <p class="muted small">⚠️ Bu kod o anki puanının tek seferlik fotoğrafıdır, otomatik güncellenmez. Canlı yarış için yukarıdaki <b>Canlı Lig</b>'i kullanmalısın.</p>
          </div>

          <hr class="divider" />

          <div class="code-box">
            <label class="lbl">Arkadaşının Kodunu Ekle / Güncelle:</label>
            <div class="type-row">
              <input id="friendCodeIn" class="text-input" placeholder="Arkadaşının sana attığı kodu buraya yapıştır..." />
              <button class="btn btn-green" id="importCodeBtn">➕ Ekle / Güncelle</button>
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
      btn.textContent = '⏳ Çekiliyor...';
      try {
        await syncCloudLeague();
        toast('Canlı skorlar güncellendi! 🔄');
      } catch (e) {
        toast('Güncelleme hatası: ' + e.message);
      }
      renderLeaderboardView();
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
function screenLearn() {
  const done = doneCount();
  const pct = Math.round((done / UNITS.length) * 100);
  const curMascot = mascotService.getActive();

  view().innerHTML = `
    <div class="page">
      <header class="page-head">
        <div>
          <h1>🗺️ Macera Haritası</h1>
          <p class="muted">Her üniteyi <b>%70</b> ve üzeri başarıyla tamamlayarak yol boyunca ilerle.</p>
        </div>
        <a class="btn btn-ghost" href="#/placement">📝 Seviye Testi</a>
      </header>

      <!-- Dünya 1 Kartı -->
      <div class="card world-card">
        <div class="world-head">
          <div>
            <div class="muted small" style="font-weight:800;letter-spacing:0.5px;">DÜNYA 1 / 2 · A1 TEMEL İNGİLİZCE</div>
            <div class="world-title">🌍 Başlangıç Dünyası</div>
          </div>
          <div class="world-badge">${state.a1BossPassed ? '👑' : curMascot.icon}</div>
        </div>
        <p class="muted small" style="margin:8px 0 12px;">Tüm A1 ünitelerini tamamlayınca <b>A1 Boss Testi (Büyük Final)</b> açılır ve <b>A2 Macera Dünyası</b>'na geçiş hakkı kazanırsın!</p>
        <div class="progress" style="height:10px;"><div class="bar rainbow" style="width:${pct}%"></div></div>
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:800;color:var(--muted);margin-top:6px;">
          <span>${done} / ${UNITS.length} Ünite Tamamlandı</span>
          <span>%${pct}</span>
        </div>
      </div>

      <!-- Ünite Yolu (Candy Crush Path) -->
      <div class="path">
        ${UNITS.map((u, i) => {
          const s = unitStats(u.id);
          const unlocked = isUnlocked(i);
          const offset = Math.round(Math.sin(i * 0.9) * 110);
          return `
            <div class="path-row" style="--x:${offset}px">
              <button class="node ${unlocked ? '' : 'locked'} ${s.done ? 'done' : ''} ${nextUnit()?.id === u.id ? 'current' : ''}" data-id="${u.id}" style="--c:${u.color}">
                <span class="node-emoji">${unlocked ? u.emoji : '🔒'}</span>
                ${s.done ? `<span class="node-star">⭐</span>` : ''}
              </button>
              <div class="node-label"><b>${esc(u.title)}</b><span>${u.type === 'vocab' ? '📗 Kelime' : '📘 Gramer'}${s.attempts ? ` · %${s.best}` : ''}</span></div>
            </div>`;
        }).join('')}
      </div>

      <!-- A1 Boss Testi Banner -->
      ${(() => {
        const allDone = done >= UNITS.length;
        if (state.a1BossPassed) {
          return `
            <div class="boss-banner">
              <div class="boss-emoji">👑</div>
              <div class="boss-title">A1 Büyük Finali Fethettin!</div>
              <div class="boss-sub">Tebrikler şampiyon! A1 seviyesini başarıyla bitirdin ve A2 Macera Dünyası'nın kilidini açtın.</div>
              <a class="btn btn-purple" href="#/boss-a1">🔄 Final Sınavını Tekrar Çöz</a>
            </div>
          `;
        }
        if (allDone) {
          return `
            <div class="boss-banner">
              <div class="boss-emoji">⚔️</div>
              <div class="boss-title">BÜYÜK FİNAL: A1 Boss Testi Açıldı!</div>
              <div class="boss-sub">Tüm A1 ünitelerini tamamladın! 15 soruluk final sınavından %75 ve üzeri alarak A2 Dünyası'nın kilidini aç!</div>
              <a class="btn btn-primary btn-big" href="#/boss-a1">🔥 Final Sınavına Başla</a>
            </div>
          `;
        }
        return `
          <div class="boss-banner locked">
            <div class="boss-emoji">🔒</div>
            <div class="boss-title">A1 Boss Testi (Büyük Seviye Sınavı)</div>
            <div class="boss-sub">Tüm A1 ünitelerini bitirdiğinde bu kapı açılacak (${done}/${UNITS.length} ünite tamamlandı).</div>
          </div>
        `;
      })()}

      <!-- Dünya 2: A2 Macera Dünyası Kartı -->
      <div class="card world-card" style="margin-top:20px;opacity:${state.a2Unlocked ? '1' : '0.75'};border-style:${state.a2Unlocked ? 'solid' : 'dashed'};">
        <div class="world-head">
          <div>
            <div class="muted small" style="font-weight:800;">SONRAKİ SEVİYE · DÜNYA 2</div>
            <div class="world-title">🚀 A2: Macera Dünyası</div>
          </div>
          <div class="world-badge">${state.a2Unlocked ? '✨' : '🔒'}</div>
        </div>
        <p class="muted small" style="margin:8px 0 12px;">
          ${state.a2Unlocked 
            ? '🌟 <b>Tebrikler! A2 Dünyası açık.</b> Yeni gramer yapıları ve zengin kelime dağarcığı içeren A2 müfredatı çok yakında eklenecek!' 
            : 'Bu dünya A1 Boss Testi tamamlandığında açılır. Tıpkı şeker oyunu gibi seviyeleri birer birer aşarak zirveye ulaş!'}
        </p>
        <div>
          ${state.a2Unlocked 
            ? '<span class="badge" style="background:#51CF66;color:#fff;padding:6px 14px;border-radius:99px;font-weight:800;">🔓 Kilit Açıldı</span>' 
            : '<span class="badge" style="background:var(--line);color:var(--muted);padding:6px 14px;border-radius:99px;font-weight:800;">🔒 Kilitli (A1 Boss Testi Gerekir)</span>'}
        </div>
      </div>
    </div>`;

  $$('.node').forEach(n => n.onclick = () => unitModal(UNIT_BY_ID[n.dataset.id]));
  const cur = $('.node.current');
  if (cur) setTimeout(() => cur.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
}

/* ============================================================
   A1 Boss Testi (Büyük Final Sınavı)
   ============================================================ */
function screenA1Boss() {
  const start = () => runLesson({
    title: '👑 A1 Büyük Final Sınavı (Boss Test)',
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
          message: `🎉 <b>İNANILMAZ! %${pct} Başarı ile A1 Seviyesini Tamamladın!</b><br>+200 XP Kazandın ve 🚀 <b>A2 Macera Dünyası'nın kilidini açtın!</b>`
        };
      } else {
        const earnedXP = correct * 5;
        addXP(earnedXP);
        return {
          xp: earnedXP,
          exitTo: '#/learn',
          message: `Boss Testinde %${pct} aldın (${correct}/${total}). Kilidi açmak için en az <b>%75</b> alman gerekiyor. Biraz tekrar yapıp tekrar dene! 💪`
        };
      }
    }
  });
  start();
}

function unitModal(u) {
  const s = unitStats(u.id);
  const unlocked = isUnlocked(u.index);
  openModal(`
    <div class="modal-head" style="--c:${u.color}">
      <div class="modal-emoji">${u.emoji}</div>
      <div><h2>${esc(u.title)}</h2><div class="muted">${esc(u.en)} · ${u.type === 'vocab' ? `${u.words.length} kelime` : 'Gramer'}</div></div>
    </div>
    ${unlocked ? `
      <div class="modal-stats">
        <div><b>%${s.best}</b><span>en iyi</span></div>
        <div><b>${s.attempts}</b><span>deneme</span></div>
        <div><b>${s.done ? '✅' : '—'}</b><span>durum</span></div>
      </div>
      <div class="modal-actions">
        ${u.type === 'vocab' ? `<a class="btn btn-ghost" href="#/cards/${u.id}">🃏 Kelime Kartları</a>` : `<a class="btn btn-ghost" href="#/grammar/${u.id}">📖 Konu Anlatımı</a>`}
        <a class="btn btn-big btn-primary" href="#/lesson/${u.id}">▶ ${s.attempts ? 'Tekrar Çalış' : 'Derse Başla'}</a>
      </div>` : `
      <p class="muted center">Bu ünite kilitli 🔒 Önceki üniteyi tamamla ya da seviye testine gir.</p>
      <div class="modal-actions">${u.type === 'vocab' ? `<a class="btn btn-ghost" href="#/cards/${u.id}">🃏 Kartlara göz at</a>` : `<a class="btn btn-ghost" href="#/grammar/${u.id}">📖 Konuya göz at</a>`}</div>`}
  `);
}

/* ============================================================
   Ders
   ============================================================ */
function screenLesson(id) {
  const u = UNIT_BY_ID[id];
  if (!u) { location.hash = '#/learn'; return; }
  if (!isUnlocked(u.index)) { toast('Bu ünite henüz kilitli 🔒'); location.hash = '#/learn'; return; }
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
   Tekrar
   ============================================================ */
function screenReview() {
  let words = dueWords();
  const seen = Object.keys(state.words).map(k => WORD_BY_KEY[k]).filter(Boolean);
  if (words.length < 5) {
    const extra = weakWords(10).filter(w => !words.find(x => x.key === w.key));
    words = [...words, ...extra];
  }
  if (words.length < 5) words = [...words, ...sample(seen.filter(w => !words.find(x => x.key === w.key)), 5 - words.length)];
  if (words.length < 3) {
    view().innerHTML = `<div class="page"><div class="card empty"><div class="empty-emoji">🌱</div><h2>Henüz tekrar edilecek kelime yok</h2>
      <p class="muted">Birkaç kelime dersi tamamla, öğrendiğin kelimeler burada akıllı tekrar sistemine girecek.</p>
      <a class="btn btn-primary" href="#/learn">Öğrenmeye Başla</a></div></div>`;
    return;
  }
  const start = () => runLesson({
    title: '🔁 Akıllı Tekrar',
    questions: buildReviewLesson(words),
    color: '#20C997',
    exitTo: '#/home',
    retry: start,
    onFinish: (results, { correct }) => { const xp = correct * 8; addXP(xp); return { xp }; }
  });
  start();
}

/* ============================================================
   Kelime kartları
   ============================================================ */
function screenCards(id) {
  const u = UNIT_BY_ID[id];
  if (!u || u.type !== 'vocab') {
    view().innerHTML = `
      <div class="page">
        <header class="page-head"><div><h1>🃏 Kelime Kartları</h1><p class="muted">Bir konu seç, kartları çevir, dinle ve öğren.</p></div></header>
        <div class="unit-grid">
          ${UNITS.filter(x => x.type === 'vocab').map(x => `
            <a class="unit-tile" href="#/cards/${x.id}" style="--c:${x.color}">
              <span class="ut-emoji">${x.emoji}</span><b>${esc(x.title)}</b><span class="muted small">${x.words.length} kelime</span>
            </a>`).join('')}
        </div>
      </div>`;
    return;
  }
  let words = [...u.words], i = 0;
  const draw = () => {
    const w = words[i];
    const st = state.words[w.key];
    view().innerHTML = `
      <div class="page cards-page" style="--c:${u.color}">
        <header class="page-head"><div><a href="#/cards" class="back">← Konular</a><h1>${u.emoji} ${esc(u.title)}</h1></div>
          <button class="btn btn-ghost" id="shuf">🔀 Karıştır</button></header>
        <div class="flash-wrap">
          <div class="flash" id="flash">
            <div class="flash-face front"><div class="flash-emoji">${w.emoji}</div><div class="flash-en">${esc(w.en)}</div><div class="muted small">çevirmek için tıkla</div></div>
            <div class="flash-face back"><div class="flash-emoji">${w.emoji}</div><div class="flash-tr">${esc(w.tr)}</div><div class="flash-en small-en">${esc(w.en)}</div></div>
          </div>
        </div>
        <div class="flash-modern-ctrl">
          <button class="flash-pill-btn" id="prev">← Önceki</button>
          <button class="speak-btn big" id="spk" aria-label="Kelimeyi sesli dinle" title="Dinle">🔊</button>
          <span class="flash-indicator">${i + 1} / ${words.length}${st ? ` · ${'⭐'.repeat(Math.min(st.box, 5)) || '·'}` : ''}</span>
          <button class="flash-pill-btn" id="next">Sonraki →</button>
        </div>
        <div class="center"><a class="btn btn-primary" href="#/lesson/${u.id}">▶ Bu üniteyle ders yap</a></div>
        <div class="word-list">${u.words.map(x => `<button class="word-chip" data-en="${esc(x.en)}">${x.emoji} <b>${esc(x.en)}</b> <span>${esc(x.tr)}</span></button>`).join('')}</div>
      </div>`;
    $('#flash').onclick = () => $('#flash').classList.toggle('flipped');
    $('#spk').onclick = () => speak(w.en);
    $('#prev').onclick = () => { i = (i - 1 + words.length) % words.length; draw(); };
    $('#next').onclick = () => { i = (i + 1) % words.length; draw(); };
    $('#shuf').onclick = () => { words = shuffle(words); i = 0; draw(); };
    $$('.word-chip').forEach(c => c.onclick = () => speak(c.dataset.en));
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
  const learned = Object.values(state.words).filter(w => w.box >= 3).length;
  const practiced = UNITS.filter(u => unitStats(u.id).attempts);
  const weakUnits = practiced.filter(u => unitStats(u.id).best < 80).sort((a, b) => unitStats(a.id).best - unitStats(b.id).best).slice(0, 4);

  view().innerHTML = `
    <div class="page">
      <header class="page-head"><div><h1>📊 İlerlemen</h1><p class="muted">${lvl.label} · ${lvl.desc}</p></div></header>

      <div class="grid-4">
        <div class="stat-card grad-1"><div class="sc-icon">🔥</div><div class="sc-val">${currentStreak()}</div><div class="sc-lbl">gün seri</div></div>
        <div class="stat-card grad-2"><div class="sc-icon">⭐</div><div class="sc-val">${state.xp}</div><div class="sc-lbl">XP</div></div>
        <div class="stat-card grad-3"><div class="sc-icon">🧠</div><div class="sc-val">${learned}</div><div class="sc-lbl">iyi bilinen kelime</div></div>
        <div class="stat-card grad-4"><div class="sc-icon">📚</div><div class="sc-val">%${lvl.pct}</div><div class="sc-lbl">A1 tamamlandı</div></div>
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
            ${weak.length ? `<p><b>Zorlandığın kelimeler:</b></p><div class="tag-list">${weak.map(w => `<span class="tag" style="--c:#FF6B6B">${w.emoji} ${esc(w.en)} = ${esc(w.tr)}</span>`).join('')}</div>` : ''}
          `}
          <a class="btn btn-purple" href="#/ai">🤖 Detaylı AI analizi</a>
        </div>
      </div>

      <div class="card">
        <h3>🧩 Ünite Başarıları</h3>
        <div class="unit-bars">
          ${UNITS.map(u => { const s = unitStats(u.id); return `
            <div class="ub-row ${isUnlocked(u.index) ? '' : 'locked'}">
              <span class="ub-name">${u.emoji} ${esc(u.title)}</span>
              <div class="progress"><div class="bar" style="width:${s.best}%;background:${u.color}"></div></div>
              <span class="ub-val">${s.attempts ? `%${s.best}` : isUnlocked(u.index) ? '—' : '🔒'}</span>
            </div>`; }).join('')}
        </div>
      </div>

      ${state.mistakes.length ? `
      <div class="card">
        <h3>❌ Son Hataların</h3>
        ${state.mistakes.slice(0, 10).map(m => `<div class="wrong-row"><span>${esc(m.q)} <i class="muted">(sen: ${esc(m.given || '—')})</i></span><b>${esc(m.correct)}</b></div>`).join('')}
      </div>` : ''}
    </div>`;
}

/* ============================================================
   AI Öğretmen
   ============================================================ */
let aiTab = 'analyze';
function screenAI() {
  if (!hasAI()) {
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
          <div class="type-row">
            <input id="keyIn" class="text-input" placeholder="AIza..." autocomplete="off" />
            <button class="btn btn-purple" id="saveKey">Kaydet ve Test Et</button>
          </div>
          <p class="muted small">🔒 Anahtarın sadece bu tarayıcıda saklanır ve yalnızca Google'a gönderilir.</p>
        </div>
      </div>`;
    $('#saveKey').onclick = async () => {
      const k = $('#keyIn').value.trim();
      if (!k) return;
      state.settings.apiKey = k; saveState();
      $('#saveKey').disabled = true; $('#saveKey').textContent = 'Test ediliyor...';
      try { await aiTest(); toast('Bağlantı başarılı! 🎉'); router(); }
      catch (e) { state.settings.apiKey = ''; saveState(); toast('Hata: ' + e.message); $('#saveKey').disabled = false; $('#saveKey').textContent = 'Kaydet ve Test Et'; }
    };
    return;
  }

  view().innerHTML = `
    <div class="page">
      <header class="page-head"><div><h1>🤖 AI Öğretmen</h1><p class="muted">Seviyeni takip eden kişisel öğretmenin.</p></div></header>
      <div class="tabs">
        <button class="tab ${aiTab === 'analyze' ? 'active' : ''}" data-t="analyze">🎯 Seviye Analizi</button>
        <button class="tab ${aiTab === 'practice' ? 'active' : ''}" data-t="practice">✏️ Bana Özel Alıştırma</button>
        <button class="tab ${aiTab === 'chat' ? 'active' : ''}" data-t="chat">💬 Sohbet Pratiği</button>
      </div>
      <div id="aiBody"></div>
    </div>`;
  $$('.tab').forEach(t => t.onclick = () => { aiTab = t.dataset.t; screenAI(); });
  ({ analyze: aiAnalyzeTab, practice: aiPracticeTab, chat: aiChatTab })[aiTab]($('#aiBody'));
}

function aiAnalyzeTab(el) {
  const r = state.aiReport;
  el.innerHTML = `
    <div class="card">
      <div class="row-between">
        <div><h3>Seviye Raporu</h3><p class="muted small">${r ? `Son analiz: ${new Date(r.at).toLocaleString('tr-TR')}` : 'Henüz analiz yapılmadı.'}</p></div>
        <button class="btn btn-purple" id="anBtn">${r ? '🔄 Yeniden Analiz Et' : '✨ Analiz Et'}</button>
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
        <button class="btn btn-purple" id="genBtn">✨ Alıştırma Üret</button>
      </div>
      <div class="tag-list">${['to be', 'Present Simple', 'have got', 'there is / are', 'Yer edatları', 'Soru kelimeleri'].map(t => `<button class="tag" style="--c:#CC5DE8" data-f="${t}">${t}</button>`).join('')}</div>
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
        <input id="setKey" class="text-input" type="password" value="${esc(s.apiKey)}" placeholder="AIza..." autocomplete="off" />
        <label class="lbl">Model</label>
        <input id="setModel" class="text-input" value="${esc(s.model)}" list="models" />
        <datalist id="models"><option value="gemini-2.5-flash"><option value="gemini-2.5-flash-lite"><option value="gemini-2.0-flash"><option value="gemini-flash-latest"></datalist>
        <div class="row-gap"><button class="btn btn-purple" id="testBtn">🔌 Bağlantıyı Test Et</button><span id="testOut" class="muted"></span></div>
      </div>

      <!-- Ses Ayarları -->
      <div class="card">
        <h3>🔊 Ses</h3>
        <label class="lbl">Okuma hızı: <b id="rateVal">${s.rate}</b></label>
        <input id="setRate" type="range" min="0.5" max="1.3" step="0.1" value="${s.rate}" />
        <label class="check"><input type="checkbox" id="setSound" ${s.sound ? 'checked' : ''}/> Ses efektleri</label>
        <div><button class="btn btn-ghost" id="tryVoice">▶ Sesi dene</button></div>
      </div>

      <!-- Veriler -->
      <div class="card">
        <h3>💾 Veriler</h3>
        <p class="muted small">İlerlemeni dosya olarak indirip başka bir cihaza aktarabilirsin.</p>
        <div class="row-gap">
          <button class="btn btn-ghost" id="exportBtn">⬇️ Dışa Aktar</button>
          <label class="btn btn-ghost">⬆️ İçe Aktar<input type="file" id="importIn" accept=".json" hidden /></label>
          <button class="btn btn-red" id="resetBtn">🗑️ İlerlemeyi Sıfırla</button>
        </div>
      </div>
      <div class="center"><button class="btn btn-big btn-primary" id="saveBtn">💾 Kaydet</button></div>
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
    saveState();
  };
  $('#setRate').oninput = e => { $('#rateVal').textContent = e.target.value; };
  $('#tryVoice').onclick = () => { collect(); speak('Hello! Welcome to A1 English. Let\'s learn together!'); };
  $('#saveBtn').onclick = () => { collect(); renderNav('settings'); toast('Kaydedildi ✅'); };
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
      const data = JSON.parse(await f.text());
      const key = state.settings.apiKey;
      state = { ...defaultState(), ...data, settings: { ...defaultState().settings, ...data.settings, apiKey: key || data.settings?.apiKey || '' } };
      saveState(); toast('İçe aktarıldı ✅'); router();
    } catch (err) { toast('Dosya okunamadı ❌'); }
  };
  $('#resetBtn').onclick = () => {
    if (confirm('Tüm ilerlemen silinecek. Emin misin?')) { resetState(); location.hash = '#/'; router(); }
  };
}

/* ============================================================
   Kullanıcı Girişi / Firebase Yetkilendirme Modalı
   ============================================================ */
function openAuthModal() {
  const isCfg = authService.isConfigured();
  openModal(`
    <div class="modal-head">
      <div class="modal-emoji">🔐</div>
      <div>
        <h2>Kullanıcı Girişi & Hesap</h2>
        <p class="muted small">İlerlemeni buluta yedekle ve arkadaşlarınla canlı yarış.</p>
      </div>
    </div>
    
    <div style="margin: 16px 0; display:flex; flex-direction:column; gap:12px;">
      <button class="btn btn-big btn-primary" id="modalGoogleBtn" style="justify-content:center;font-size:1.05rem;">
        <span style="font-size:1.3rem;">🌐</span> Google ile Giriş Yap
      </button>

      <div style="text-align:center;position:relative;margin:6px 0;">
        <hr style="border:none;border-top:1px solid var(--line);margin:0;" />
        <span style="position:relative;top:-10px;background:var(--card-bg, #fff);padding:0 10px;font-size:0.75rem;color:var(--muted);font-weight:700;">VEYA E-POSTA İLE</span>
      </div>

      <div>
        <label class="lbl">E-posta</label>
        <input type="email" id="modalEmailIn" class="text-input" placeholder="ornek@gmail.com" />
      </div>
      <div>
        <label class="lbl">Şifre</label>
        <input type="password" id="modalPassIn" class="text-input" placeholder="En az 6 karakter" />
      </div>

      <div class="modal-actions" style="margin-top:6px;">
        <button class="btn btn-ghost" id="modalEmailLoginBtn">Giriş Yap</button>
        <button class="btn btn-ghost" id="modalEmailRegBtn">Kayıt Ol</button>
      </div>

      ${!isCfg ? `
        <details style="margin-top:10px;background:color-mix(in srgb, var(--primary) 8%, var(--card-bg, #fff));border-radius:12px;padding:10px 12px;border:1px solid var(--line);cursor:pointer;">
          <summary style="font-weight:800;font-size:0.82rem;color:var(--primary);outline:none;">🔧 Firebase Yapılandırması (Geliştirici / Proje Ayarı)</summary>
          <p class="muted small" style="margin:8px 0;">Firebase Console'dan kopyaladığın JSON veya API Key bilgilerini buraya kaydedebilirsin:</p>
          <textarea id="firebaseConfigJsonIn" class="text-input" style="height:70px;font-family:monospace;font-size:0.78rem;" placeholder='{"apiKey": "...", "authDomain": "...", "projectId": "a1-english"}'></textarea>
          <button class="btn btn-primary sm" id="saveFirebaseCfgBtn" style="margin-top:8px;">Firebase'i Kaydet</button>
        </details>
      ` : ''}

      <div style="text-align:center;margin-top:10px;">
        <button class="btn btn-ghost sm" id="modalGuestBtn">👤 Misafir Olarak Devam Et</button>
      </div>
    </div>
  `);

  $('#modalGuestBtn').onclick = () => {
    closeModal();
    toast('Misafir modunda devam ediliyor.');
  };

  if ($('#saveFirebaseCfgBtn')) {
    $('#saveFirebaseCfgBtn').onclick = () => {
      const raw = $('#firebaseConfigJsonIn').value.trim();
      if (!raw) return toast('Lütfen Firebase yapılandırma JSON metnini gir.');
      try {
        const cfg = JSON.parse(raw);
        authService.setupConfig(cfg);
        toast('Firebase yapılandırması kaydedildi! ✅');
        closeModal();
        openAuthModal();
      } catch (err) {
        toast('Geçersiz JSON formatı: ' + err.message);
      }
    };
  }

  $('#modalGoogleBtn').onclick = async () => {
    try {
      const user = await authService.signInWithGoogle();
      toast(`Hoş geldin, ${user.displayName || user.email}! 🎉`);
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
      const user = await authService.signInWithEmail(email, pass);
      toast(`Giriş yapıldı: ${user.email} ✅`);
      closeModal();
      router();
    } catch (err) {
      toast(err.message);
    }
  };

  $('#modalEmailRegBtn').onclick = async () => {
    const email = $('#modalEmailIn').value.trim();
    const pass = $('#modalPassIn').value.trim();
    if (!email || !pass) return toast('Lütfen e-posta ve şifreni gir.');
    try {
      const user = await authService.registerWithEmail(email, pass, state.name);
      toast(`Hesabın oluşturuldu! Hoş geldin 🎉`);
      closeModal();
      router();
    } catch (err) {
      toast(err.message);
    }
  };
}
