/* ============================================================
   PatiLingo - İleri Düzey Oyunlaştırma & Pratik Modülleri (v2.9.22)
   1. Cümle Lokomotifi (SVO Vagon Kenetleme Mühendisliği)
   2. Tuzak Avcısı (Türk Tuzağı İmha Modu - Arcade Time Attack)
   3. Hayatta Kalma Haritası & Gemini AI Rol Yapma Senaryoları
   ============================================================ */

/* ------------------------------------------------------------
   1. CÜMLE LOKOMOTİFİ PUZZLE VERİTABANI
   ------------------------------------------------------------ */
const LOCOMOTIVE_PUZZLES = [
  {
    id: 'loco-1',
    level: 1,
    title: 'Temel SVO (Özne + Fiil + Nesne)',
    tr: 'Kedim süt içer.',
    explanation: 'Türkçede "içer" sonda durur, ama İngilizce Lokomotifi hemen arkasında yüklem vagonunu ister!',
    wagons: [
      { id: 'w1', text: 'My cat', role: 'subj', roleLabel: '🚂 Özne (Subject)', color: '#EF4444' },
      { id: 'w2', text: 'drinks', role: 'verb', roleLabel: '🚃 Yüklem (Verb)', color: '#3B82F6' },
      { id: 'w3', text: 'milk', role: 'obj', roleLabel: '📦 Nesne (Object)', color: '#10B981' }
    ],
    correctOrder: ['w1', 'w2', 'w3'],
    sovWarning: 'Raydan çıktık! "My cat milk drinks" dedin. Türkçede fiil sonda kalır ama İngilizce Özne (My cat) arkasından hemen Fiil (drinks) vagonunu çeker!'
  },
  {
    id: 'loco-2',
    level: 2,
    title: 'Geniş Zaman & Sıklık Vagonu',
    tr: 'Biz her sabah İngilizce çalışırız.',
    explanation: 'Zaman vagonları (every morning) trenin en sonuna bağlanır.',
    wagons: [
      { id: 'w1', text: 'We', role: 'subj', roleLabel: '🚂 Özne', color: '#EF4444' },
      { id: 'w2', text: 'study', role: 'verb', roleLabel: '🚃 Yüklem', color: '#3B82F6' },
      { id: 'w3', text: 'English', role: 'obj', roleLabel: '📦 Nesne', color: '#10B981' },
      { id: 'w4', text: 'every morning', role: 'time', roleLabel: '🚊 Zaman Vagonu', color: '#F59E0B' }
    ],
    correctOrder: ['w1', 'w2', 'w3', 'w4'],
    sovWarning: 'Dikkat! Zamanı ve nesneyi öne bağlarsan tren hareket edemez. Formül: Özne + Fiil + Nesne + Zaman!'
  },
  {
    id: 'loco-3',
    level: 3,
    title: 'Mekan & Nesne Kenetleme',
    tr: 'Ayşe mutfakta kahve hazırlar.',
    explanation: 'Önce ne yaptığını (coffee), sonra nerede yaptığını (in the kitchen) bağla.',
    wagons: [
      { id: 'w1', text: 'Ayşe', role: 'subj', roleLabel: '🚂 Özne', color: '#EF4444' },
      { id: 'w2', text: 'makes', role: 'verb', roleLabel: '🚃 Yüklem', color: '#3B82F6' },
      { id: 'w3', text: 'coffee', role: 'obj', roleLabel: '📦 Nesne', color: '#10B981' },
      { id: 'w4', text: 'in the kitchen', role: 'place', roleLabel: '🚊 Mekan Vagonu', color: '#8B5CF6' }
    ],
    correctOrder: ['w1', 'w2', 'w3', 'w4'],
    sovWarning: 'Mutfak mekanını ortaya bağlama! Önce Fiil (makes) + Nesne (coffee), sonra Mekan (in the kitchen).'
  },
  {
    id: 'loco-4',
    level: 4,
    title: 'He / She / It -s Takısı Vagonu',
    tr: 'O (erkek) ofiste hızlı çalışır.',
    explanation: 'He tek başına kalınca fiil vagonu "works" şeklini alır.',
    wagons: [
      { id: 'w1', text: 'He', role: 'subj', roleLabel: '🚂 Özne', color: '#EF4444' },
      { id: 'w2', text: 'works', role: 'verb', roleLabel: '🚃 Yüklem (-s)', color: '#3B82F6' },
      { id: 'w3', text: 'fast', role: 'manner', roleLabel: '📦 Durum', color: '#10B981' },
      { id: 'w4', text: 'at the office', role: 'place', roleLabel: '🚊 Mekan', color: '#8B5CF6' }
    ],
    correctOrder: ['w1', 'w2', 'w3', 'w4'],
    sovWarning: 'İngilizce treninde He/She/It fiili öne ister ve -s takısını taşır!'
  },
  {
    id: 'loco-5',
    level: 5,
    title: 'Çift Vagon: Nesne + Zaman',
    tr: 'Öğrenciler kütüphanede her gün kitap okur.',
    explanation: 'Özne + Fiil + Nesne + Mekan + Zaman zinciri.',
    wagons: [
      { id: 'w1', text: 'Students', role: 'subj', roleLabel: '🚂 Özne', color: '#EF4444' },
      { id: 'w2', text: 'read', role: 'verb', roleLabel: '🚃 Yüklem', color: '#3B82F6' },
      { id: 'w3', text: 'books', role: 'obj', roleLabel: '📦 Nesne', color: '#10B981' },
      { id: 'w4', text: 'in the library', role: 'place', roleLabel: '🚊 Mekan', color: '#8B5CF6' },
      { id: 'w5', text: 'every day', role: 'time', roleLabel: '🚊 Zaman', color: '#F59E0B' }
    ],
    correctOrder: ['w1', 'w2', 'w3', 'w4', 'w5'],
    sovWarning: '5 vagonlu dev katar! Unutma: Yüklem (read) lokomotifin hemen peşinde olmalı!'
  }
];

/* ------------------------------------------------------------
   2. TUZAK AVCISI (TRAP HUNTER) VERİTABANI
   ------------------------------------------------------------ */
const TRAP_HUNTER_DATABASE = [
  {
    id: 'trap-1',
    sentence: ['I', 'am', 'agree', 'with', 'you'],
    trapIndex: 1, // 'am'
    correctReplacement: '',
    trapTitle: 'Gereksiz "am/is/are" Tuzağı',
    tip: 'Türkçedeki "katılıyorum" fiildir. Eylem olan cümleye "am" eklenmez; sadece "I agree" denir!',
    category: 'extra_be'
  },
  {
    id: 'trap-2',
    sentence: ['She', 'has', 'twenty', 'years', 'old'],
    trapIndex: 1, // 'has'
    correctReplacement: 'is',
    trapTitle: 'Yaş Bildirmede "Have" Tuzağı',
    tip: 'Türkçede yaşa "sahip olunur" ama İngilizcede yaş bir durumdur: "She is 20 years old"!',
    category: 'age_have'
  },
  {
    id: 'trap-3',
    sentence: ['I', 'very', 'like', 'this', 'music'],
    trapIndex: 1, // 'very'
    correctReplacement: 'really',
    trapTitle: '"Very like" Tuzağı',
    tip: '"Very" sıfatlarla kullanılır ("very good"). Fiilleri derecelendirmek için "really like" veya "like a lot" kullanılır!',
    category: 'very_like'
  },
  {
    id: 'trap-4',
    sentence: ['We', 'are', 'four', 'people', 'here'],
    trapIndex: 1, // 'are four people' -> 'are'
    correctReplacement: 'There are four of us',
    trapTitle: '"Biz 4 kişiyiz" Birebir Çeviri Tuzağı',
    tip: 'İngilizcede "There are four of us" veya "Four of us are here" kalıbı kullanılır.',
    category: 'people_count'
  },
  {
    id: 'trap-5',
    sentence: ['Can', 'you', 'explain', 'me', 'the', 'rule'],
    trapIndex: 3, // 'me'
    correctReplacement: 'to me',
    trapTitle: '"Explain me" Tuzağı',
    tip: 'Explain fiili yönelme edatı ister: "Explain TO me"!',
    category: 'explain_me'
  },
  {
    id: 'trap-6',
    sentence: ['He', 'go', 'to', 'work', 'by', 'bus'],
    trapIndex: 1, // 'go'
    correctReplacement: 'goes',
    trapTitle: 'He/She/It "-s" Unutulması',
    tip: 'He tek başına durduğunda fiil mutlaka "-s" takısı alır: "He goes"!',
    category: 'he_she_it_s'
  },
  {
    id: 'trap-7',
    sentence: ['I', 'am', 'waiting', 'you', 'here'],
    trapIndex: 3, // 'you' -> 'for you'
    correctReplacement: 'for you',
    trapTitle: '"Wait you" Edat Tuzağı',
    tip: 'Wait fiili birini beklerken "FOR" edatı ister: "waiting for you"!',
    category: 'wait_for'
  },
  {
    id: 'trap-8',
    sentence: ['I', 'went', 'to', 'home', 'yesterday'],
    trapIndex: 2, // 'to'
    correctReplacement: '',
    trapTitle: '"Go to home" Fazla Edat Tuzağı',
    tip: '"Home" sözcüğü yönelme içerir, önüne "to" almaz: "I went home"!',
    category: 'go_home'
  }
];

/* ------------------------------------------------------------
   3. HAYATTA KALMA (SURVIVAL CONTEXT) GÖREVLERİ
   ------------------------------------------------------------ */
const SURVIVAL_QUESTS = [
  {
    id: 'passport',
    title: 'Pasaport Polisini Geç',
    location: 'Londra Heathrow Havalimanı ✈️',
    officerRole: 'Pasaport Memuru (Border Force)',
    avatar: '👮‍♂️',
    desc: 'Pasaport kontrol memuruna geliş amacını ve kalış süreni doğru İngilizceyle aktar.',
    badge: '🛂 Vize Mührü',
    starterMsg: 'Good afternoon. Can I see your passport, please? What is the purpose of your visit to the UK?',
    objectives: [
      { id: 'purpose', text: 'Geliş amacını belirt (holiday / travel / study / vacation)', regex: /\b(holiday|vacation|travel|visit|tourist|study|business)\b/i },
      { id: 'duration', text: 'Kalış süreni söyle (e.g. 10 days / two weeks)', regex: /\b(days|weeks|months|week|month)\b/i }
    ],
    hints: [
      'Geliş amacı için: "I am here for a holiday." veya "For tourism."',
      'Süre için: "I will stay for two weeks." veya "About 10 days."'
    ]
  },
  {
    id: 'coffee',
    title: 'Kahve Siparişi & Yulaf Sütü',
    location: 'Soho Coffee Lab ☕',
    officerRole: 'Barista',
    avatar: '☕',
    desc: 'Büyük boy latte iste, sütü yulaf sütü (oat milk) olarak belirt ve paket (take away) al.',
    badge: '☕ Kahve Ustası Mührü',
    starterMsg: 'Hi there! Welcome to Coffee Lab. What can I get started for you today?',
    objectives: [
      { id: 'order', text: 'İçeceğini ve boyunu seç (latte / coffee / large / medium)', regex: /\b(latte|coffee|cappuccino|tea|americano)\b/i },
      { id: 'milk', text: 'Yulaf sütü iste (oat milk)', regex: /\b(oat|almond|soy|milk)\b/i },
      { id: 'takeaway', text: 'Paket / yanına alacağını belirt (to go / take away)', regex: /\b(take away|takeaway|to go|for here)\b/i }
    ],
    hints: [
      '"Can I get a large latte with oat milk, to go please?"',
      '"I would like an iced coffee with oat milk, take away."'
    ]
  },
  {
    id: 'food',
    title: 'Soğuk Yemeği Kibarca İade Et',
    location: 'Piccadilly Bistro 🍽️',
    officerRole: 'Garson (Waiter)',
    avatar: '🍽️',
    desc: 'Gelen çorbanın/yemeğin soğuk olduğunu kibarca açıkla ve ısıtılmasını veya değiştirilmesini rica et.',
    badge: '🍽️ Gurme Mührü',
    starterMsg: 'Excuse me sir, is everything alright with your soup and pasta?',
    objectives: [
      { id: 'complain', text: 'Yemeğin soğuk olduğunu belirt (cold / not warm)', regex: /\b(cold|not hot|not warm|freezing)\b/i },
      { id: 'request', text: 'Değiştirilmesini veya ısıtılmasını rica et (change / heat / warm up / please)', regex: /\b(change|heat|warm|another|replace|please)\b/i }
    ],
    hints: [
      '"Excuse me, my soup is cold. Could you please heat it up?"',
      '"Sorry, but this is a bit cold. Can I get a hot one?"'
    ]
  },
  {
    id: 'lost',
    title: 'Metro İstasyonunu Sor & Bilet Al',
    location: 'Westminster Meydanı 🚇',
    officerRole: 'Londralı Yolcu (Local Resident)',
    avatar: '🗺️',
    desc: 'Kayboldun! En yakın metro istasyonunu (Underground / Tube) sor ve nasıl gideceğini öğren.',
    badge: '🚇 Londra Kaşifi Mührü',
    starterMsg: 'Hello! You look a bit lost, mate. Do you need a hand with directions?',
    objectives: [
      { id: 'ask_station', text: 'En yakın metro istasyonunu sor (Underground / Tube / station / metro)', regex: /\b(underground|tube|metro|station|subway)\b/i },
      { id: 'ask_way', text: 'Nasıl gideceğini veya mesafeyi sor (how / where / far / walk)', regex: /\b(how|where|far|walk|get there|way)\b/i }
    ],
    hints: [
      '"Excuse me, where is the nearest Underground station?"',
      '"How can I get to the Tube from here?"'
    ]
  }
];

/* ============================================================
   EKRAN 1: CÜMLE LOKOMOTİFİ (SVO VAGON KENETLEME)
   ============================================================ */
let currentLocoPuzzleIdx = 0;
let assembledWagonIds = [];

function screenLocomotive() {
  const p = LOCOMOTIVE_PUZZLES[currentLocoPuzzleIdx] || LOCOMOTIVE_PUZZLES[0];
  const curMascot = mascotService.getActive();
  assembledWagonIds = [];

  const availableWagons = [...p.wagons].sort(() => Math.random() - 0.5);

  view().innerHTML = `
    <div class="page loco-puzzle-page">
      <header class="page-head" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <h1 style="font-size:clamp(1.2rem, 4.5vw, 1.45rem);margin:0 0 2px;">🚂 Cümle Lokomotifi</h1>
            <p class="muted small" style="margin:0;font-size:0.82rem;line-height:1.4;">Metin yazmak yok! Vagonları rayların üstüne kenetle, SVO mantığını çöz.</p>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <span class="badge" style="background:var(--card-hover);color:var(--primary);border:1.5px solid var(--primary);font-weight:800;font-size:0.75rem;padding:4px 10px;border-radius:10px;">Seviye ${p.level} / ${LOCOMOTIVE_PUZZLES.length}</span>
            <a href="#/logic" class="btn btn-ghost sm" style="padding:5px 10px;font-size:0.78rem;border-radius:10px;">📘 Kural Rehberi</a>
          </div>
        </div>
      </header>

      <!-- Hedef Cümle Paneli -->
      <div class="card loco-target-card" style="padding:14px 18px;margin-bottom:14px;background:color-mix(in srgb, var(--primary) 6%, var(--card));border:2px solid var(--border);">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
          <div>
            <span class="badge" style="font-weight:800;font-size:0.72rem;padding:2px 8px;border-radius:99px;background:var(--card);border:1px solid var(--border);margin-bottom:4px;display:inline-block;">🎯 Kurulacak Cümle</span>
            <h2 style="margin:2px 0 4px;font-size:1.15rem;font-weight:800;color:var(--text);">${esc(p.tr)}</h2>
            <div class="muted small" style="font-size:0.82rem;line-height:1.35;">${esc(p.explanation)}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.6rem;line-height:1;">${curMascot.icon}</div>
            <div class="muted small" style="font-weight:700;font-size:0.72rem;margin-top:2px;">${esc(curMascot.name)} Raylarda</div>
          </div>
        </div>
      </div>

      <!-- Ray ve Kenetleme Alanı -->
      <div class="card loco-rail-card" style="padding:20px 16px;margin-bottom:18px;position:relative;overflow:hidden;background:var(--card);">
        <div class="rail-scene" id="railScene">
          <!-- Arka Plan Ray Görseli -->
          <div class="track-line"></div>
          <div class="track-ties"></div>

          <!-- Kenetlenmiş Vagonlar Yuvası -->
          <div class="train-assembly-dock" id="trainAssemblyDock" aria-label="Kenetlenen Vagonlar">
            <div class="loco-engine-head">
              <span class="engine-smoke" id="engineSmoke">💨</span>
              <div class="engine-body">🚂</div>
              <div class="engine-pilot"></div>
            </div>
            <div class="coupled-wagons-list" id="coupledWagonsList">
              <!-- Kenetlenen vagonlar buraya gelecek -->
            </div>
          </div>
        </div>

        <div id="locoFeedbackAlert" style="display:none;margin-top:14px;padding:12px 14px;border-radius:12px;font-size:0.92rem;font-weight:600;"></div>
      </div>

      <!-- Depodaki Serbest Vagonlar (Vagon Havuzu) -->
      <div class="card loco-depot-card" style="padding:16px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;font-size:1rem;display:flex;align-items:center;gap:6px;">
            <span>📦 Vagon Deposu</span>
            <span class="muted small">(Dokunarak trene bağla)</span>
          </h3>
          <button type="button" class="btn btn-ghost sm" id="locoResetWagonsBtn">↺ Boşalt</button>
        </div>

        <div class="depot-wagons-grid" id="depotWagonsGrid">
          ${availableWagons.map(w => `
            <button type="button" class="wagon-item-btn" data-wid="${w.id}" style="--wagon-c:${w.color};">
              <span class="wagon-hook-l"></span>
              <div class="wagon-card-inner">
                <span class="wagon-role-badge">${esc(w.roleLabel)}</span>
                <b class="wagon-text">${esc(w.text)}</b>
              </div>
              <span class="wagon-hook-r"></span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Alt Eylem Butonları -->
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
        <button type="button" class="btn btn-ghost" id="locoPrevBtn" ${currentLocoPuzzleIdx === 0 ? 'disabled' : ''}>◀ Önceki Bulmaca</button>
        <button type="button" class="btn btn-big btn-primary" id="locoCheckTrainBtn" style="padding:12px 28px;font-size:1.05rem;">
          🚀 Treni Çalıştır & Test Et
        </button>
        <button type="button" class="btn btn-ghost" id="locoNextBtn" ${currentLocoPuzzleIdx === LOCOMOTIVE_PUZZLES.length - 1 ? 'disabled' : ''}>Sonraki Bulmaca ▶</button>
      </div>
    </div>
  `;

  renderCoupledWagons();

  // Olay Dinleyicileri
  $('#depotWagonsGrid').onclick = e => {
    const btn = e.target.closest('.wagon-item-btn');
    if (!btn || btn.disabled) return;
    const wid = btn.dataset.wid;
    if (!assembledWagonIds.includes(wid)) {
      assembledWagonIds.push(wid);
      renderCoupledWagons();
      if (typeof sfx !== 'undefined' && sfx.tap) sfx.tap();
    }
  };

  $('#coupledWagonsList').onclick = e => {
    const chip = e.target.closest('.coupled-wagon-chip');
    if (!chip) return;
    const wid = chip.dataset.wid;
    assembledWagonIds = assembledWagonIds.filter(id => id !== wid);
    renderCoupledWagons();
  };

  $('#locoResetWagonsBtn').onclick = () => {
    assembledWagonIds = [];
    renderCoupledWagons();
    hideLocoAlert();
  };

  $('#locoPrevBtn').onclick = () => {
    if (currentLocoPuzzleIdx > 0) {
      currentLocoPuzzleIdx--;
      screenLocomotive();
    }
  };

  $('#locoNextBtn').onclick = () => {
    if (currentLocoPuzzleIdx < LOCOMOTIVE_PUZZLES.length - 1) {
      currentLocoPuzzleIdx++;
      screenLocomotive();
    }
  };

  $('#locoCheckTrainBtn').onclick = () => {
    checkLocomotiveAssembly(p);
  };
}

function renderCoupledWagons() {
  const p = LOCOMOTIVE_PUZZLES[currentLocoPuzzleIdx];
  const listEl = $('#coupledWagonsList');
  if (!listEl) return;

  if (assembledWagonIds.length === 0) {
    listEl.innerHTML = `<span class="muted small rail-empty-hint">Vagon deposundaki kutulara tıklayarak lokomotife bağla...</span>`;
  } else {
    listEl.innerHTML = assembledWagonIds.map((wid, idx) => {
      const w = p.wagons.find(x => x.id === wid);
      if (!w) return '';
      return `
        <div class="coupled-wagon-chip" data-wid="${w.id}" style="--wagon-c:${w.color};" title="Çıkarmak için tıkla">
          <span class="coupler-joint">🔗</span>
          <div class="wagon-mini-body">
            <span class="wmb-role">${esc(w.role.toUpperCase())}</span>
            <b class="wmb-text">${esc(w.text)}</b>
          </div>
        </div>
      `;
    }).join('');
  }

  // Depodaki butonların durumunu güncelle
  $$('.wagon-item-btn').forEach(btn => {
    const isCoupled = assembledWagonIds.includes(btn.dataset.wid);
    btn.disabled = isCoupled;
    btn.classList.toggle('is-attached', isCoupled);
  });
}

function showLocoAlert(text, isSuccess) {
  const el = $('#locoFeedbackAlert');
  if (!el) return;
  el.style.display = 'block';
  el.style.background = isSuccess ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';
  el.style.color = isSuccess ? '#059669' : '#DC2626';
  el.style.border = `1.5px solid ${isSuccess ? '#10B981' : '#EF4444'}`;
  el.innerHTML = text;
}

function hideLocoAlert() {
  const el = $('#locoFeedbackAlert');
  if (el) el.style.display = 'none';
}

function checkLocomotiveAssembly(p) {
  if (assembledWagonIds.length < p.wagons.length) {
    showLocoAlert('⚠️ Tren henüz tamamlanmadı! Lütfen depodaki tüm vagonları bağla.', false);
    return;
  }

  const isExact = JSON.stringify(assembledWagonIds) === JSON.stringify(p.correctOrder);

  if (isExact) {
    // Başarılı kenetlenme
    const engineEl = $('#engineSmoke');
    if (engineEl) {
      engineEl.textContent = '💨 💨 💨 🚂 💨';
      engineEl.classList.add('puff-anim');
    }
    const scene = $('#railScene');
    if (scene) scene.classList.add('train-departure-anim');

    if (typeof sfx !== 'undefined' && sfx.good) sfx.good();
    store.gainXP(25);
    const m = mascotService.getActive();
    if (typeof window.shimejiSay === 'function') {
      window.shimejiSay(`🚂 <b>Çuf çuf!</b> Harika mühendislik! Cümle treni raylarda tam gaz ilerliyor! (+25 ${m.itemIcon})`, `🎉 ${m.name}`);
    }

    showLocoAlert(`🎉 <b>Kusursuz Kenetleme!</b> Tren tam vaktinde hareket etti (+25 ${m.itemIcon} XP). İngilizce SVO dizilimi başarıyla kuruldu!`, true);

    setTimeout(() => {
      if (currentLocoPuzzleIdx < LOCOMOTIVE_PUZZLES.length - 1) {
        currentLocoPuzzleIdx++;
        screenLocomotive();
      }
    }, 2800);
  } else {
    // Hatalı dizilim (Türkçe SOV Mantığı Uyarısı)
    if (typeof sfx !== 'undefined' && sfx.bad) sfx.bad();
    const scene = $('#railScene');
    if (scene) {
      scene.classList.add('derail-shake');
      setTimeout(() => scene.classList.remove('derail-shake'), 600);
    }
    showLocoAlert(`🚨 <b>${esc(p.sovWarning)}</b>`, false);
    if (typeof window.shimejiSay === 'function') {
      window.shimejiSay(`🚨 Raydan çıktık ortak! Türkçede fiili en sona atarız ama İngilizce lokomotifin hemen peşinde eylemi ister!`, '⚠️ Türk Tuzağı Uyarısı');
    }
  }
}

/* ============================================================
   EKRAN 2: TUZAK AVCISI (TRAP HUNTER ARCADE MODU)
   ============================================================ */
let trapScore = 0;
let trapCombo = 0;
let trapTimeLeft = 60;
let trapTimerId = null;
let currentTrapIndex = 0;
let isTrapGameActive = false;
let defusedHistory = [];

function screenTrapHunter() {
  trapScore = 0;
  trapCombo = 0;
  trapTimeLeft = 60;
  currentTrapIndex = 0;
  isTrapGameActive = false;
  defusedHistory = [];
  if (trapTimerId) clearInterval(trapTimerId);

  const curMascot = mascotService.getActive();

  view().innerHTML = `
    <div class="page trap-hunter-page">
      <header class="page-head" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <h1 style="font-size:clamp(1.25rem, 4.5vw, 1.55rem);margin:0 0 4px;">💣 Tuzak Avcısı</h1>
            <p class="muted">Ekrana gelen cümlelerdeki gizli Türkçe mantık tuzaklarını tespit et, üstüne tıklayıp süren bitmeden İMHA ET!</p>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <span class="badge" style="background:var(--card-hover);color:var(--text);border:1.5px solid var(--border);font-weight:700;font-size:0.78rem;padding:4px 10px;border-radius:99px;">⚡ 60 Saniye Meydan Okuma</span>
          </div>
        </div>
      </header>

      <!-- Arcade HUD Gösterge Paneli -->
      <div class="card trap-hud-card" style="padding:14px 20px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;background:var(--card);border:2px solid var(--border);">
        <div style="display:flex;gap:18px;align-items:center;">
          <div>
            <div class="muted small" style="font-weight:700;">⏱️ KALAN SÜRE</div>
            <div style="font-size:1.6rem;font-weight:900;color:${trapTimeLeft <= 15 ? '#EF4444' : 'var(--text)'};" id="trapTimerVal">60s</div>
          </div>
          <div style="height:32px;width:1px;background:var(--border);"></div>
          <div>
            <div class="muted small" style="font-weight:700;">🏆 İMHA PUANI</div>
            <div style="font-size:1.6rem;font-weight:900;color:var(--primary);" id="trapScoreVal">0</div>
          </div>
          <div style="height:32px;width:1px;background:var(--border);"></div>
          <div>
            <div class="muted small" style="font-weight:700;">🔥 KOMBO</div>
            <div style="font-size:1.6rem;font-weight:900;color:#F59E0B;" id="trapComboVal">0x</div>
          </div>
        </div>
        <div>
          <button type="button" class="btn btn-big btn-primary" id="startTrapGameBtn" style="padding:10px 22px;font-weight:800;">
            ▶ Avı Başlat!
          </button>
        </div>
      </div>

      <!-- Radar Sahnesi (Cümle Alanı) -->
      <div class="card trap-stage-card" id="trapStageCard" style="padding:32px 20px;text-align:center;margin-bottom:18px;min-height:220px;display:flex;flex-direction:column;justify-content:center;align-items:center;background:color-mix(in srgb, var(--primary) 4%, var(--card));border:2px dashed var(--border);border-radius:16px;">
        <div id="trapStageContent">
          <div style="font-size:3.2rem;margin-bottom:8px;">🎯 💣 ⚡</div>
          <h3>Hazır mısın?</h3>
          <p class="muted" style="max-width:440px;margin:0 auto 16px;">
            "I am agree", "She has 20 years old" gibi Türk beyninin alışkanlıklarını yakala, hatalı kelimeye dokunup patlat!
          </p>
          <button type="button" class="btn btn-primary" onclick="$('#startTrapGameBtn').click()">Hemen Başla</button>
        </div>
      </div>

      <!-- İmha Açıklama ve Geri Bildirim Kartı -->
      <div id="trapFeedbackCard" style="display:none;padding:14px 18px;border-radius:14px;margin-bottom:16px;background:var(--card);border:1.5px solid var(--border);"></div>
    </div>
  `;

  $('#startTrapGameBtn').onclick = () => {
    startTrapHunterGame();
  };
}

function startTrapHunterGame() {
  trapScore = 0;
  trapCombo = 0;
  trapTimeLeft = 60;
  currentTrapIndex = 0;
  isTrapGameActive = true;
  defusedHistory = [];

  $('#startTrapGameBtn').style.display = 'none';
  renderCurrentTrapSentence();

  if (trapTimerId) clearInterval(trapTimerId);
  trapTimerId = setInterval(() => {
    trapTimeLeft--;
    const timerEl = $('#trapTimerVal');
    if (timerEl) {
      timerEl.textContent = `${trapTimeLeft}s`;
      if (trapTimeLeft <= 15) timerEl.style.color = '#EF4444';
    }
    if (trapTimeLeft <= 0) {
      endTrapHunterGame();
    }
  }, 1000);
}

function renderCurrentTrapSentence() {
  const stage = $('#trapStageContent');
  if (!stage) return;
  const t = TRAP_HUNTER_DATABASE[currentTrapIndex % TRAP_HUNTER_DATABASE.length];

  stage.innerHTML = `
    <div style="margin-bottom:12px;">
      <span class="badge" style="background:var(--card-hover);color:var(--text);border:1.5px solid var(--border);font-weight:700;font-size:0.75rem;padding:4px 10px;border-radius:99px;">💣 TUZAKLI CÜMLE · Hatalı Kelimeye Dokun!</span>
    </div>
    <div class="trap-tokens-wrap" style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:18px 0;">
      ${t.sentence.map((word, wIdx) => `
        <button type="button" class="trap-word-token" data-widx="${wIdx}" style="font-size:1.35rem;padding:10px 18px;border-radius:12px;border:2px solid var(--border);background:var(--card);color:var(--text);cursor:pointer;font-weight:700;transition:all 0.15s ease;">
          ${esc(word)}
        </button>
      `).join('')}
    </div>
    <div class="muted small">Tuzak bu cümlenin içine gizlendi. Yanlış kelimeyi imha et!</div>
  `;

  $$('.trap-word-token', stage).forEach(btn => {
    btn.onclick = () => {
      if (!isTrapGameActive) return;
      const clickedIdx = parseInt(btn.dataset.widx, 10);
      handleTrapClick(clickedIdx, t);
    };
  });
}

function handleTrapClick(clickedIdx, t) {
  const isCorrect = clickedIdx === t.trapIndex;
  const fbCard = $('#trapFeedbackCard');

  if (isCorrect) {
    // Doğru imha!
    trapCombo++;
    const points = 10 * Math.min(trapCombo, 4);
    trapScore += points;
    store.gainXP(5);

    $('#trapScoreVal').textContent = trapScore;
    $('#trapComboVal').textContent = `${trapCombo}x`;

    if (typeof sfx !== 'undefined' && sfx.good) sfx.good();

    if (fbCard) {
      fbCard.style.display = 'block';
      fbCard.style.background = 'rgba(16, 185, 129, 0.1)';
      fbCard.style.borderColor = '#10B981';
      fbCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.6rem;">💥</span>
          <div>
            <b style="color:#059669;">Tuzak İmha Edildi! (+${points} Puan ${trapCombo >= 2 ? `· 🔥 ${trapCombo}x Kombo` : ''})</b>
            <div style="font-size:0.86rem;margin-top:2px;"><b>${esc(t.trapTitle)}:</b> ${esc(t.tip)}</div>
          </div>
        </div>
      `;
    }

    defusedHistory.push(t);
    currentTrapIndex++;
    renderCurrentTrapSentence();
  } else {
    // Yanlış kelime
    trapCombo = 0;
    trapTimeLeft = Math.max(0, trapTimeLeft - 3);
    $('#trapComboVal').textContent = '0x';
    $('#trapTimerVal').textContent = `${trapTimeLeft}s`;

    if (typeof sfx !== 'undefined' && sfx.bad) sfx.bad();

    if (fbCard) {
      fbCard.style.display = 'block';
      fbCard.style.background = 'rgba(239, 68, 68, 0.05)';
      fbCard.style.borderColor = '#EF4444';
      fbCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.6rem;">⚠️</span>
          <div>
            <b style="color:#DC2626;">Orada tuzak yok! (-3 saniye ceza)</b>
            <div style="font-size:0.86rem;margin-top:2px;">Bu cümledeki asıl tuzak: <b>"${esc(t.sentence[t.trapIndex])}"</b> kelimesiydi. ${esc(t.tip)}</div>
          </div>
        </div>
      `;
    }
  }
}

function endTrapHunterGame() {
  if (trapTimerId) clearInterval(trapTimerId);
  isTrapGameActive = false;

  const stage = $('#trapStageContent');
  if (stage) {
    const curMascot = mascotService.getActive();
    stage.innerHTML = `
      <div style="font-size:3.5rem;margin-bottom:8px;">🏆</div>
      <h2>Süre Doldu! Skorun: <span style="color:var(--primary);">${trapScore} Puan</span></h2>
      <p class="muted">Toplam <b>${defusedHistory.length}</b> Türkçe düşünme tuzağını başarıyla imha ettin ve zihnini temizledin!</p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;">
        <button type="button" class="btn btn-primary" onclick="screenTrapHunter()">🔄 Yeniden Oyna</button>
        <a href="#/logic" class="btn btn-ghost">📘 Kuralları İncele</a>
      </div>
    `;
  }
}

/* ============================================================
   EKRAN 3: HAYATTA KALMA (SURVIVAL CONTEXT) GEMINI AI SENARYOLARI
   ============================================================ */
let activeSurvivalQuest = null;
let survivalChatHistory = [];

function screenSurvival(questId = null) {
  const quest = SURVIVAL_QUESTS.find(q => q.id === questId);

  if (quest) {
    renderActiveSurvivalQuest(quest);
  } else {
    renderSurvivalQuestsMap();
  }
}

function renderSurvivalQuestsMap() {
  const curMascot = mascotService.getActive();

  view().innerHTML = `
    <div class="page survival-map-page">
      <header class="page-head" style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <h1>🗺️ Hayatta Kalma Haritası (Survival English)</h1>
            <p class="muted">Sıkıcı renkler ve hayvanlar yok! Doğrudan hayatta kalma senaryolarında yapay zeka ile canlı rol yaparak seviyeni kanıtla.</p>
          </div>
          <div style="font-size:1.8rem;">${curMascot.icon}</div>
        </div>
      </header>

      <div class="survival-quests-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:16px;">
        ${SURVIVAL_QUESTS.map((q, idx) => `
          <div class="card quest-card" style="padding:18px;display:flex;flex-direction:column;justify-content:space-between;border:2px solid var(--border);border-radius:16px;background:var(--card);transition:transform 0.2s ease;">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                <span style="font-size:2.4rem;">${q.avatar}</span>
                <span class="badge" style="background:color-mix(in srgb, var(--primary) 12%, var(--card));color:var(--primary);font-weight:800;font-size:0.74rem;">Bölüm ${idx + 1}</span>
              </div>
              <h3 style="margin:4px 0 6px;font-size:1.15rem;">${esc(q.title)}</h3>
              <div class="muted small" style="font-weight:700;color:var(--primary);margin-bottom:6px;">📍 ${esc(q.location)}</div>
              <p class="muted small" style="line-height:1.45;margin-bottom:12px;">${esc(q.desc)}</p>
            </div>
            <div>
              <div style="margin-bottom:12px;">
                <span class="badge" style="background:#F59E0B;color:#000;font-weight:800;font-size:0.7rem;">Ödül: ${esc(q.badge)}</span>
              </div>
              <a href="#/survival/${q.id}" class="btn btn-primary" style="width:100%;text-align:center;justify-content:center;">
                ▶ Göreve Başla
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderActiveSurvivalQuest(q) {
  activeSurvivalQuest = q;
  survivalChatHistory = [
    { sender: 'officer', text: q.starterMsg }
  ];

  view().innerHTML = `
    <div class="page survival-play-page">
      <header class="page-head" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;">
              <a href="#/survival" class="btn btn-ghost sm">◀ Haritaya Dön</a>
              <span class="badge" style="background:var(--primary);color:#fff;font-weight:800;">📍 ${esc(q.location)}</span>
            </div>
            <h1 style="margin-top:6px;">${esc(q.title)}</h1>
          </div>
          <div>
            <span class="badge" style="background:#F59E0B;color:#000;font-weight:800;" id="visaBadgeAward">${esc(q.badge)}</span>
          </div>
        </div>
      </header>

      <!-- Görev Hedefleri Kontrol Paneli -->
      <div class="card quest-objectives-card" style="padding:14px 18px;margin-bottom:16px;background:color-mix(in srgb, var(--primary) 6%, var(--card));border:2px solid var(--border);">
        <b style="font-size:0.92rem;display:block;margin-bottom:8px;">🎯 Görevi Tamamlamak İçin Gerekenler:</b>
        <div style="display:flex;flex-direction:column;gap:6px;" id="questObjectivesList">
          ${q.objectives.map(obj => `
            <div class="quest-obj-row" id="obj-${obj.id}" style="display:flex;align-items:center;gap:8px;font-size:0.86rem;color:var(--text);">
              <span class="obj-check">⬜</span>
              <span>${esc(obj.text)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Canlı Diyalog Akışı -->
      <div class="card quest-dialog-card" id="questDialogCard" style="padding:18px;margin-bottom:16px;min-height:280px;max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;background:var(--card);">
        <!-- Mesajlar buraya render edilir -->
      </div>

      <!-- Giriş ve İpucu Alanı -->
      <div class="card quest-input-card" style="padding:14px;background:var(--card);">
        <form id="survivalInputForm" style="display:flex;gap:10px;align-items:center;">
          <input type="text" id="survivalTextIn" class="text-input" placeholder="İngilizce yanıtını yaz..." autocomplete="off" style="flex:1;" />
          <button type="submit" class="btn btn-primary" id="survivalSendBtn" style="padding:10px 20px;font-weight:800;">Gönder</button>
        </form>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
          <button type="button" class="btn btn-ghost sm" id="survivalHintBtn" style="font-size:0.78rem;">💡 Yoldaş İpucu Ver</button>
          <span class="muted small" id="survivalHintText" style="display:none;font-weight:600;color:var(--primary);"></span>
        </div>
      </div>
    </div>
  `;

  renderSurvivalChat();

  $('#survivalInputForm').onsubmit = async e => {
    e.preventDefault();
    const input = $('#survivalTextIn');
    const msg = (input ? input.value : '').trim();
    if (!msg) return;
    input.value = '';
    await handleSurvivalUserMessage(msg, q);
  };

  $('#survivalHintBtn').onclick = () => {
    const hintEl = $('#survivalHintText');
    if (!hintEl) return;
    const randomHint = q.hints[Math.floor(Math.random() * q.hints.length)];
    hintEl.textContent = randomHint;
    hintEl.style.display = 'inline';
    if (typeof speak === 'function') speak(randomHint.replace(/"/g, ''), 'en');
  };
}

function renderSurvivalChat() {
  const card = $('#questDialogCard');
  if (!card) return;

  card.innerHTML = survivalChatHistory.map(item => `
    <div class="dialog-msg-row ${item.sender === 'user' ? 'msg-user' : 'msg-officer'}" style="display:flex;gap:10px;align-items:flex-start;${item.sender === 'user' ? 'justify-content:flex-end;' : ''}">
      ${item.sender === 'officer' ? `<div style="font-size:1.8rem;line-height:1;">${activeSurvivalQuest.avatar}</div>` : ''}
      <div style="max-width:75%;padding:10px 14px;border-radius:14px;background:${item.sender === 'user' ? 'var(--primary)' : 'var(--card-hover)'};color:${item.sender === 'user' ? '#fff' : 'var(--text)'};font-size:0.92rem;line-height:1.45;">
        ${esc(item.text)}
      </div>
      ${item.sender === 'user' ? `<div style="font-size:1.6rem;line-height:1;">👤</div>` : ''}
    </div>
  `).join('');

  card.scrollTop = card.scrollHeight;
}

async function handleSurvivalUserMessage(msg, q) {
  survivalChatHistory.push({ sender: 'user', text: msg });
  renderSurvivalChat();

  // Hedefleri kontrol et
  let allDone = true;
  q.objectives.forEach(obj => {
    const checkEl = $(`#obj-${obj.id} .obj-check`);
    const isMet = survivalChatHistory.some(h => h.sender === 'user' && obj.regex.test(h.text));
    if (checkEl) {
      checkEl.textContent = isMet ? '✅' : '⬜';
    }
    if (!isMet) allDone = false;
  });

  // AI veya Akıllı Rol Simülatörü Yanıtı
  let reply = '';
  try {
    if (typeof gemini === 'function' && state.settings && state.settings.apiKey) {
      const prompt = `Sen ${q.officerRole} rolündesin (${q.location}). Bir Türk öğrenciyle konuşuyorsun. Öğrenci: "${msg}". Kısa, doğal ve 1-2 cümlelik İngilizce yanıt ver. A1 seviyesine uygun konuş.`;
      reply = await gemini({ system: prompt, contents: [{ parts: [{ text: msg }] }] });
    }
  } catch (e) {
    console.warn('AI survival fallback active:', e.message);
  }

  if (!reply) {
    // Akıllı Yerel Simülatör (Offline Yedek)
    if (q.id === 'passport') {
      reply = allDone
        ? 'Everything is in order! Welcome to the United Kingdom, enjoy your stay! ✈️'
        : 'Thank you. And how long are you planning to stay in the country?';
    } else if (q.id === 'coffee') {
      reply = allDone
        ? 'Great choice! One oat milk latte to go. That will be £3.80 please! ☕'
        : 'Sure thing! What kind of milk would you like with that?';
    } else if (q.id === 'food') {
      reply = allDone
        ? 'I am so sorry about that! I will take this back to the kitchen and bring you a fresh, hot one right away! 🍲'
        : 'Oh, is there any problem with the temperature?';
    } else {
      reply = allDone
        ? 'You are very welcome! Just turn right at the corner and you will see the station entrance. Safe travels! 🚇'
        : 'The station is nearby, about 3 minutes walk. Are you walking or taking a taxi?';
    }
  }

  survivalChatHistory.push({ sender: 'officer', text: reply });
  renderSurvivalChat();

  if (allDone) {
    store.gainXP(50);
    if (typeof sfx !== 'undefined' && sfx.good) sfx.good();
    const m = mascotService.getActive();
    if (typeof window.shimejiSay === 'function') {
      window.shimejiSay(`🎉 <b>GÖREV TAMAMLANDI!</b> ${esc(q.badge)} kazandın! İngilizceyi gerçek hayatta konuştun! (+50 ${m.itemIcon})`, `🏆 ${m.name}`);
    }
    const badgeEl = $('#visaBadgeAward');
    if (badgeEl) {
      badgeEl.textContent = `🌟 KAZANILDI: ${q.badge}`;
      badgeEl.style.background = '#10B981';
      badgeEl.style.color = '#fff';
    }
  }
}
