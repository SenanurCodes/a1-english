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
  },
  {
    id: 'loco-6',
    level: 6,
    title: 'Geçmiş Zaman & Mekan',
    tr: 'Babam dün garajda arabayı tamir etti.',
    explanation: 'Özne + Geçmiş Fiil (fixed) + Nesne (the car) + Mekan + Zaman zinciri.',
    wagons: [
      { id: 'w1', text: 'My dad', role: 'subj', roleLabel: '🚂 Özne', color: '#EF4444' },
      { id: 'w2', text: 'fixed', role: 'verb', roleLabel: '🚃 Geçmiş Yüklem', color: '#3B82F6' },
      { id: 'w3', text: 'the car', role: 'obj', roleLabel: '📦 Nesne', color: '#10B981' },
      { id: 'w4', text: 'in the garage', role: 'place', roleLabel: '🚊 Mekan', color: '#8B5CF6' },
      { id: 'w5', text: 'yesterday', role: 'time', roleLabel: '🚊 Zaman', color: '#F59E0B' }
    ],
    correctOrder: ['w1', 'w2', 'w3', 'w4', 'w5'],
    sovWarning: 'Geçmiş zamanda da kural aynı: Eylem (fixed) öznenin hemen ardına bağlanır!'
  },
  {
    id: 'loco-7',
    level: 7,
    title: 'Gelecek Zaman (Will) Vagonu',
    tr: 'Biz yarın parkta buluşacağız.',
    explanation: 'Gelecek zaman yardımcısı ve fiil birlikte öne gelir: will meet.',
    wagons: [
      { id: 'w1', text: 'We', role: 'subj', roleLabel: '🚂 Özne', color: '#EF4444' },
      { id: 'w2', text: 'will meet', role: 'verb', roleLabel: '🚃 Gelecek Fiil', color: '#3B82F6' },
      { id: 'w3', text: 'at the park', role: 'place', roleLabel: '🚊 Mekan', color: '#8B5CF6' },
      { id: 'w4', text: 'tomorrow', role: 'time', roleLabel: '🚊 Zaman', color: '#F59E0B' }
    ],
    correctOrder: ['w1', 'w2', 'w3', 'w4'],
    sovWarning: 'Zaman vagonunu (tomorrow) trene en arkadan tak! Önce nereye gideceğini (at the park) bağla.'
  },
  {
    id: 'loco-8',
    level: 8,
    title: 'Yetenek (Can) & Zarf Vagonu',
    tr: 'Kız kardeşim çok güzel piyano çalabilir.',
    explanation: 'Özne + Can play + Nesne (the piano) + Durum Zarfı (beautifully).',
    wagons: [
      { id: 'w1', text: 'My sister', role: 'subj', roleLabel: '🚂 Özne', color: '#EF4444' },
      { id: 'w2', text: 'can play', role: 'verb', roleLabel: '🚃 Fiil Grubu', color: '#3B82F6' },
      { id: 'w3', text: 'the piano', role: 'obj', roleLabel: '📦 Nesne', color: '#10B981' },
      { id: 'w4', text: 'beautifully', role: 'manner', roleLabel: '🚊 Durum Zarfı', color: '#10B981' }
    ],
    correctOrder: ['w1', 'w2', 'w3', 'w4'],
    sovWarning: 'Nasıl çaldığını bildiren zarf vagonu nesneden sonra gelir!'
  }
];

/* ------------------------------------------------------------
   2. TUZAK AVCISI (TRAP HUNTER) VERİTABANI
   Kademe 1: Isınma (Bariz Mantık)
   Kademe 2: Dedektif (Edat & Kalıp)
   Kademe 3: Kırmızı Alarm (Sinsi Türk Mantık Tuzakları)
   ------------------------------------------------------------ */
const TRAP_HUNTER_DATABASE = [
  // --- KADEME 1: ISINMA (Bariz Mantık Hataları) ---
  {
    id: 'trap-1',
    difficulty: 1,
    sentence: ['I', 'am', 'agree', 'with', 'you'],
    trapIndex: 1, // 'am'
    correctReplacement: '',
    trapTitle: 'Gereksiz "am/is/are" Tuzağı',
    tip: 'Türkçedeki "katılıyorum" fiildir. Eylem olan cümleye "am" eklenmez; sadece "I agree" denir!',
    category: 'extra_be'
  },
  {
    id: 'trap-2',
    difficulty: 1,
    sentence: ['She', 'has', 'twenty', 'years', 'old'],
    trapIndex: 1, // 'has'
    correctReplacement: 'is',
    trapTitle: 'Yaş Bildirmede "Have" Tuzağı',
    tip: 'Türkçede yaşa "sahip olunur" ama İngilizcede yaş bir durumdur: "She is 20 years old"!',
    category: 'age_have'
  },
  {
    id: 'trap-3',
    difficulty: 1,
    sentence: ['I', 'very', 'like', 'this', 'music'],
    trapIndex: 1, // 'very'
    correctReplacement: 'really',
    trapTitle: '"Very like" Tuzağı',
    tip: '"Very" sıfatlarla kullanılır ("very good"). Fiilleri derecelendirmek için "really like" veya "like a lot" kullanılır!',
    category: 'very_like'
  },
  {
    id: 'trap-6',
    difficulty: 1,
    sentence: ['He', 'go', 'to', 'work', 'by', 'bus'],
    trapIndex: 1, // 'go'
    correctReplacement: 'goes',
    trapTitle: 'He/She/It "-s" Unutulması',
    tip: 'He tek başına durduğunda geniş zamanda fiil mutlaka "-s" takısı alır: "He goes"!',
    category: 'he_she_it_s'
  },
  {
    id: 'trap-t1-1',
    difficulty: 1,
    sentence: ['My', 'brother', 'make', 'delicious', 'pizzas'],
    trapIndex: 2, // 'make'
    correctReplacement: 'makes',
    trapTitle: 'Tekil Öznede Fiil Takısı Tuzağı',
    tip: '"My brother" (o) tekildir, geniş zamanda fiil "makes" olmalıdır!',
    category: 'he_she_it_s'
  },
  {
    id: 'trap-t1-2',
    difficulty: 1,
    sentence: ['They', 'are', 'live', 'in', 'Istanbul'],
    trapIndex: 1, // 'are'
    correctReplacement: '',
    trapTitle: 'Fiil Cümlesine "Are" Sıkıştırma Tuzağı',
    tip: 'Zaten "live" (yaşamak) fiili varken "are" kullanılmaz: "They live in Istanbul"!',
    category: 'extra_be'
  },

  // --- KADEME 2: DEDEKTİF (Edat & Kalıp Tuzakları) ---
  {
    id: 'trap-4',
    difficulty: 2,
    sentence: ['We', 'are', 'four', 'people', 'here'],
    trapIndex: 1, // 'are four people' -> 'are'
    correctReplacement: 'There are four of us',
    trapTitle: '"Biz 4 kişiyiz" Birebir Çeviri Tuzağı',
    tip: 'İngilizcede "There are four of us" veya "Four of us are here" kalıbı kullanılır.',
    category: 'people_count'
  },
  {
    id: 'trap-5',
    difficulty: 2,
    sentence: ['Can', 'you', 'explain', 'me', 'the', 'rule'],
    trapIndex: 3, // 'me'
    correctReplacement: 'to me',
    trapTitle: '"Explain me" Tuzağı',
    tip: 'Explain fiili yönelme edatı ister: "Explain TO me"!',
    category: 'explain_me'
  },
  {
    id: 'trap-7',
    difficulty: 2,
    sentence: ['I', 'am', 'waiting', 'you', 'here'],
    trapIndex: 3, // 'you' -> 'for you'
    correctReplacement: 'for you',
    trapTitle: '"Wait you" Edat Tuzağı',
    tip: 'Wait fiili birini beklerken "FOR" edatı ister: "waiting for you"!',
    category: 'wait_for'
  },
  {
    id: 'trap-8',
    difficulty: 2,
    sentence: ['I', 'went', 'to', 'home', 'yesterday'],
    trapIndex: 2, // 'to'
    correctReplacement: '',
    trapTitle: '"Go to home" Fazla Edat Tuzağı',
    tip: '"Home" sözcüğü yönelme içerir, önüne "to" almaz: "I went home"!',
    category: 'go_home'
  },
  {
    id: 'trap-t2-1',
    difficulty: 2,
    sentence: ['I', 'listen', 'music', 'in', 'my', 'room', 'every', 'night'],
    trapIndex: 2, // 'music'
    correctReplacement: 'to music',
    trapTitle: '"Listen music" Edat Eksikliği',
    tip: 'Listen fiili her zaman "TO" edatıyla kullanılır: "listen to music"!',
    category: 'listen_to'
  },
  {
    id: 'trap-t2-2',
    difficulty: 2,
    sentence: ['She', 'is', 'married', 'with', 'a', 'kind', 'doctor'],
    trapIndex: 3, // 'with'
    correctReplacement: 'to',
    trapTitle: '"Married with" Yanılgısı',
    tip: 'Türkçede "biriyle evli" denir ama İngilizcede yönelme kullanılır: "married TO someone"!',
    category: 'married_to'
  },
  {
    id: 'trap-t2-3',
    difficulty: 2,
    sentence: ['I', 'am', 'afraid', 'from', 'spiders', 'and', 'darkness'],
    trapIndex: 3, // 'from'
    correctReplacement: 'of',
    trapTitle: '"Afraid from" Türkçe Çeviri Tuzağı',
    tip: 'Türkçedeki "-den korkmak" İngilizcede "afraid OF" şeklinde ifade edilir.',
    category: 'afraid_of'
  },
  {
    id: 'trap-t2-4',
    difficulty: 2,
    sentence: ['Look', 'that', 'cute', 'dog', 'over', 'there'],
    trapIndex: 1, // 'that'
    correctReplacement: 'at that',
    trapTitle: '"Look" Yönelme Tuzağı',
    tip: 'Bir şeye bakarken mutlaka "LOOK AT" kullanılır: "Look at that cute dog"!',
    category: 'look_at'
  },

  // --- KADEME 3: KIRMIZI ALARM (Sinsi Türk Mantık Tuzakları) ---
  {
    id: 'trap-t3-1',
    difficulty: 3,
    sentence: ['I', 'have', 'seen', 'him', 'yesterday', 'at', 'noon'],
    trapIndex: 1, // 'have'
    correctReplacement: '',
    trapTitle: 'Yesterday Varken Present Perfect Tuzağı',
    tip: '"Yesterday", "ago", "last week" gibi kesin zaman bildiren geçmiş ifadelerde have/has kullanılmaz; Past Simple ("I saw") kullanılır!',
    category: 'past_time_trap'
  },
  {
    id: 'trap-t3-2',
    difficulty: 3,
    sentence: ['Actually', 'I', 'need', 'a', 'modern', 'laptop', 'now'],
    trapIndex: 0, // 'Actually'
    correctReplacement: 'Currently / Nowadays',
    trapTitle: '"Actually" Yalancı Eşdeğer (False Friend)',
    tip: '"Actually" aktüel/güncel demek DEĞİLDİR, "aslında / doğrusu" demektir. Güncel durum için "currently" kullanılır!',
    category: 'false_friend'
  },
  {
    id: 'trap-t3-3',
    difficulty: 3,
    sentence: ['He', 'told', 'to', 'me', 'the', 'entire', 'secret'],
    trapIndex: 2, // 'to'
    correctReplacement: '',
    trapTitle: '"Told to me" Fazla Edat Tuzağı',
    tip: '"Say to me" denir ama "tell" doğrudan nesne alır: "He told me the secret"!',
    category: 'tell_vs_say'
  },
  {
    id: 'trap-t3-4',
    difficulty: 3,
    sentence: ['I', 'lost', 'my', 'morning', 'bus', 'because', 'of', 'rain'],
    trapIndex: 1, // 'lost'
    correctReplacement: 'missed',
    trapTitle: '"Otobüsü kaybetmek" Çeviri Tuzağı',
    tip: 'Otobüs, tren veya uçak "lose" edilmez, kaçırılır ("miss the bus")!',
    category: 'lose_vs_miss'
  },
  {
    id: 'trap-t3-5',
    difficulty: 3,
    sentence: ['She', 'does', 'not', 'have', 'no', 'free', 'time'],
    trapIndex: 4, // 'no'
    correctReplacement: 'any',
    trapTitle: 'Çift Olumsuzluk (Double Negative) Tuzağı',
    tip: 'İngilizcede "does not" varsa tekrar "no" denmez, "any" kullanılır: "does not have any free time"!',
    category: 'double_negative'
  },
  {
    id: 'trap-t3-6',
    difficulty: 3,
    sentence: ['Can', 'you', 'borrow', 'me', 'your', 'pen', 'today'],
    trapIndex: 2, // 'borrow'
    correctReplacement: 'lend',
    trapTitle: '"Borrow" vs "Lend" Karıştırma Tuzağı',
    tip: 'Birine ödünç vermek "LEND"dir; birinden ödünç almak "BORROW"dur! "Can you lend me..." denir.',
    category: 'borrow_vs_lend'
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
let locoFreePlayMode = false;
let locoCountdownTimerId = null;

function getMidnightCountdownStr() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = Math.max(0, midnight - now);
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function isLocoDailyCompletedToday() {
  const today = typeof todayStr === 'function' ? todayStr() : new Date().toISOString().slice(0, 10);
  return Boolean(state && state.dailyLocomotive && state.dailyLocomotive[today] && state.dailyLocomotive[today].completed);
}

function screenLocomotive() {
  if (locoCountdownTimerId) {
    clearInterval(locoCountdownTimerId);
    locoCountdownTimerId = null;
  }

  const p = LOCOMOTIVE_PUZZLES[currentLocoPuzzleIdx] || LOCOMOTIVE_PUZZLES[0];
  const curMascot = mascotService.getActive();
  assembledWagonIds = [];

  const availableWagons = [...p.wagons].sort(() => Math.random() - 0.5);
  const isDailyDone = isLocoDailyCompletedToday();
  const totalStages = locoFreePlayMode ? LOCOMOTIVE_PUZZLES.length : 5;
  const currentStep = Math.min(currentLocoPuzzleIdx + 1, totalStages);

  view().innerHTML = `
    <div class="page loco-puzzle-page">
      <header class="page-head" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <h1 style="font-size:clamp(1.2rem, 4.5vw, 1.45rem);margin:0 0 2px;">🚂 Cümle Lokomotifi</h1>
            <p class="muted small" style="margin:0;font-size:0.82rem;line-height:1.4;">Metin yazmak yok! Vagonları rayların üstüne kenetle, SVO mantığını çöz.</p>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <span class="badge" style="background:var(--card-hover);color:var(--primary);border:1.5px solid var(--primary);font-weight:800;font-size:0.75rem;padding:4px 10px;border-radius:10px;">
              ${locoFreePlayMode ? `🔁 Serbest Mod: Seviye ${p.level} / ${LOCOMOTIVE_PUZZLES.length}` : `📅 Günün Seferi: Vagon ${currentStep} / 5`}
            </span>
            <button type="button" class="btn btn-ghost sm" id="locoModeToggleBtn" style="padding:5px 10px;font-size:0.78rem;border-radius:10px;">
              ${locoFreePlayMode ? '📅 Günün Seferine Dön' : '🔁 Serbest Pratik Modu'}
            </button>
            <a href="#/logic" class="btn btn-ghost sm" style="padding:5px 10px;font-size:0.78rem;border-radius:10px;">📘 Kural Rehberi</a>
          </div>
        </div>
      </header>

      ${isDailyDone && !locoFreePlayMode ? `
        <!-- Günün Görevi Tamamlandı Bildirim Kartı -->
        <div class="card" style="padding:14px 18px;margin-bottom:14px;background:rgba(16,185,129,0.08);border:2px solid #10B981;border-radius:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:2rem;">🎉</span>
            <div>
              <b style="color:#059669;font-size:0.98rem;">Bugünkü Lokomotif Seferini Başarıyla Tamamladın (5/5)!</b>
              <div class="muted small">Tebrikler! Günlük serin korundu. Dilersen sınırsız pratik modunda tüm vagonları çözmeye devam edebilirsin.</div>
            </div>
          </div>
          <div style="display:flex;gap:10px;align-items:center;">
            <div style="text-align:right;">
              <div class="muted small" style="font-weight:700;">Yeni Günlük Sefer:</div>
              <b style="font-family:monospace;color:var(--primary);" id="locoHeaderCountdown">${getMidnightCountdownStr()}</b>
            </div>
            <button type="button" class="btn btn-primary sm" id="locoSwitchToFreeQuickBtn">🔁 Serbest Mod</button>
          </div>
        </div>
      ` : ''}

      <!-- Hedef Cümle Paneli -->
      <div class="card loco-target-card" style="padding:14px 18px;margin-bottom:14px;background:color-mix(in srgb, var(--primary) 6%, var(--card));border:2px solid var(--border);">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <span class="badge" style="font-weight:800;font-size:0.72rem;padding:2px 8px;border-radius:99px;background:var(--card);border:1px solid var(--border);">🎯 Kurulacak Cümle</span>
              <span class="muted small" style="font-size:0.75rem;font-weight:700;">${esc(p.title)}</span>
            </div>
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
        <button type="button" class="btn btn-ghost" id="locoNextBtn" ${currentLocoPuzzleIdx === (locoFreePlayMode ? LOCOMOTIVE_PUZZLES.length - 1 : 4) ? 'disabled' : ''}>Sonraki Bulmaca ▶</button>
      </div>

      <!-- Günlük Tamamlama Kutlama Modalı Alanı -->
      <div id="locoCompleteModalContainer"></div>
    </div>
  `;

  renderCoupledWagons();

  // Canlı Geri Sayım Zamanlayıcısı
  if ($('#locoHeaderCountdown')) {
    locoCountdownTimerId = setInterval(() => {
      const el = $('#locoHeaderCountdown');
      if (el) el.textContent = getMidnightCountdownStr();
    }, 1000);
  }

  // Mod Değiştirme Butonları
  const modeBtn = $('#locoModeToggleBtn');
  if (modeBtn) {
    modeBtn.onclick = () => {
      locoFreePlayMode = !locoFreePlayMode;
      currentLocoPuzzleIdx = 0;
      screenLocomotive();
    };
  }
  const quickFreeBtn = $('#locoSwitchToFreeQuickBtn');
  if (quickFreeBtn) {
    quickFreeBtn.onclick = () => {
      locoFreePlayMode = true;
      currentLocoPuzzleIdx = 0;
      screenLocomotive();
    };
  }

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

  // Mobil Dokunma ve Dikey Kaydırma (Overscroll) İptali
  const wagonTouchContainers = [$('#depotWagonsGrid'), $('#coupledWagonsList'), $('.rail-scene-container')].filter(Boolean);
  wagonTouchContainers.forEach(container => {
    container.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
  });

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
    const maxIdx = locoFreePlayMode ? LOCOMOTIVE_PUZZLES.length - 1 : 4;
    if (currentLocoPuzzleIdx < maxIdx) {
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

    // Günlük Sefer Tamamlanması (5/5 puzzle bittiğinde)
    const isDailyFinalStep = !locoFreePlayMode && currentLocoPuzzleIdx === 4;

    setTimeout(() => {
      if (isDailyFinalStep) {
        finishDailyLocomotive();
      } else {
        const maxIdx = locoFreePlayMode ? LOCOMOTIVE_PUZZLES.length - 1 : 4;
        if (currentLocoPuzzleIdx < maxIdx) {
          currentLocoPuzzleIdx++;
          screenLocomotive();
        } else if (locoFreePlayMode) {
          // Serbest modda tüm bulmacalar tamamlandı
          showLocoAlert(`🌟 <b>Tüm Serbest Vagonlar Tamamlandı!</b> Lokomotifi baştan çalıştırmak için 1. bulmacaya dönebilirsin.`, true);
        }
      }
    }, 2400);
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

function finishDailyLocomotive() {
  const today = typeof todayStr === 'function' ? todayStr() : new Date().toISOString().slice(0, 10);
  if (!state.dailyLocomotive) state.dailyLocomotive = {};
  state.dailyLocomotive[today] = { completed: true, timestamp: Date.now() };

  if (typeof store !== 'undefined') {
    if (store._save) store._save();
    if (store.gainXP) store.gainXP(50);
    if (store.recordActivity) store.recordActivity();
  }

  if (typeof confetti === 'function') confetti(160);
  if (typeof sfx !== 'undefined' && sfx.win) sfx.win();

  const curMascot = mascotService.getActive();
  if (typeof window.shimejiSay === 'function') {
    window.shimejiSay(`🚂🏆 <b>TEBRİKLER!</b> Bugünkü 5/5 Lokomotif seferini tamamladın! Günlük serin korundu ve +50 ${curMascot.itemIcon} XP kazandın!`, `🎉 ${curMascot.name}`);
  }

  renderDailyLocoCompleteModal();
}

function renderDailyLocoCompleteModal() {
  const container = $('#locoCompleteModalContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="loco-complete-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.72);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;">
      <div class="card" style="max-width:480px;width:100%;text-align:center;padding:28px 22px;border-radius:20px;border:2px solid var(--primary);box-shadow:0 12px 36px rgba(0,0,0,0.3);animation:wagonCouplePop 0.3s ease;">
        <div style="font-size:3.6rem;line-height:1;margin-bottom:8px;">🚂💨 🏅</div>
        <span class="badge" style="background:var(--primary);color:#fff;font-weight:800;padding:4px 12px;border-radius:99px;font-size:0.8rem;margin-bottom:8px;display:inline-block;">GÜNÜN SEFERİ 5/5 BİTTİ</span>
        <h2 style="margin:6px 0 10px;font-size:1.45rem;">Tebrikler Başmakinist!</h2>
        <p class="muted" style="margin-bottom:18px;font-size:0.92rem;line-height:1.45;">
          Bugünkü 5 vagonu da kusursuz SVO sırasıyla kenetledin ve treni vaktinde istasyona ulaştırdın!
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px;">
          <div style="padding:12px;border-radius:12px;background:rgba(16,185,129,0.1);border:1.5px solid #10B981;">
            <div style="font-size:1.4rem;">🔥</div>
            <b style="color:#059669;font-size:0.95rem;">Seri Korundu</b>
            <div class="muted small">Günün alıştırması yapıldı</div>
          </div>
          <div style="padding:12px;border-radius:12px;background:rgba(59,130,246,0.1);border:1.5px solid #3B82F6;">
            <div style="font-size:1.4rem;">⭐</div>
            <b style="color:#2563EB;font-size:0.95rem;">+50 XP Bonus</b>
            <div class="muted small">Hesabına eklendi</div>
          </div>
        </div>

        <div style="background:var(--card-hover);padding:10px 14px;border-radius:12px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
          <span class="muted small" style="font-weight:700;">⏱️ Yeni Günlük Sefer:</span>
          <b style="font-family:monospace;font-size:1.05rem;color:var(--primary);" id="locoModalCountdown">${getMidnightCountdownStr()}</b>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;">
          <button type="button" class="btn btn-big btn-primary" id="locoModalFreePlayBtn" style="padding:12px 18px;font-weight:800;">
            🔁 Sınırsız Serbest Pratik Modu
          </button>
          <a href="#/" class="btn btn-ghost" style="padding:10px 16px;">🏠 Ana Sayfaya Dön</a>
        </div>
      </div>
    </div>
  `;

  const modalCountdown = setInterval(() => {
    const el = $('#locoModalCountdown');
    if (el) el.textContent = getMidnightCountdownStr();
    else clearInterval(modalCountdown);
  }, 1000);

  const freeBtn = $('#locoModalFreePlayBtn');
  if (freeBtn) {
    freeBtn.onclick = () => {
      clearInterval(modalCountdown);
      locoFreePlayMode = true;
      currentLocoPuzzleIdx = 0;
      screenLocomotive();
    };
  }
}

/* ============================================================
   EKRAN 2: TUZAK AVCISI (TRAP HUNTER ARCADE MODU)
   Dinamik Zorlaşma Katmanları:
   - Kademe 1: Isınma (0 - 29 Puan)
   - Kademe 2: Dedektif (30 - 74 Puan)
   - Kademe 3: Kırmızı Alarm (75+ Puan)
   ============================================================ */
let trapScore = 0;
let trapCombo = 0;
let trapTimeLeft = 60;
let trapTimerId = null;
let currentTrap = null;
let isTrapGameActive = false;
let defusedHistory = [];
let usedTrapIdsInRun = new Set();
let maxTrapTierReached = 1;

const TRAP_TIERS = {
  1: { label: '🟢 Kademe 1: Isınma (Bariz Mantık)', minScore: 0, bonusSec: 3, penaltySec: 4 },
  2: { label: '🟡 Kademe 2: Dedektif (Edat & Kalıp)', minScore: 30, bonusSec: 3, penaltySec: 5 },
  3: { label: '🔴 Kademe 3: Kırmızı Alarm (Sinsi Mantık)', minScore: 75, bonusSec: 4, penaltySec: 6 }
};

function getTrapCurrentTier(score) {
  if (score >= 75) return 3;
  if (score >= 30) return 2;
  return 1;
}

function pickNextTrapSentence() {
  const tier = getTrapCurrentTier(trapScore);
  if (tier > maxTrapTierReached) maxTrapTierReached = tier;

  let pool = TRAP_HUNTER_DATABASE.filter(t => (t.difficulty || 1) === tier && !usedTrapIdsInRun.has(t.id));
  if (pool.length === 0) {
    // Bu kademedeki tüm tuzaklar tüketildi, geçmişi temizleyip yeniden çevir
    usedTrapIdsInRun = new Set(Array.from(usedTrapIdsInRun).filter(id => {
      const match = TRAP_HUNTER_DATABASE.find(x => x.id === id);
      return match && match.difficulty !== tier;
    }));
    pool = TRAP_HUNTER_DATABASE.filter(t => (t.difficulty || 1) === tier);
  }

  const selected = pool[Math.floor(Math.random() * pool.length)] || TRAP_HUNTER_DATABASE[0];
  usedTrapIdsInRun.add(selected.id);
  currentTrap = selected;
  return selected;
}

function screenTrapHunter() {
  trapScore = 0;
  trapCombo = 0;
  trapTimeLeft = 60;
  isTrapGameActive = false;
  defusedHistory = [];
  usedTrapIdsInRun = new Set();
  maxTrapTierReached = 1;
  currentTrap = null;
  if (trapTimerId) clearInterval(trapTimerId);

  const curMascot = mascotService.getActive();

  view().innerHTML = `
    <div class="page trap-hunter-page">
      <header class="page-head" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <h1 style="font-size:clamp(1.25rem, 4.5vw, 1.55rem);margin:0 0 4px;">💣 Tuzak Avcısı (Arcade Modu)</h1>
            <p class="muted">Ekrana gelen cümlelerdeki gizli Türkçe düşünme tuzaklarını tespit et, hatalı kelimeye dokunup süren bitmeden İMHA ET!</p>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <span class="badge" style="background:var(--card-hover);color:var(--text);border:1.5px solid var(--border);font-weight:700;font-size:0.78rem;padding:4px 10px;border-radius:99px;">⚡ 60 Saniye Meydan Okuma</span>
          </div>
        </div>
      </header>

      <!-- Arcade HUD Gösterge Paneli -->
      <div class="card trap-hud-card" style="padding:14px 20px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;background:var(--card);border:2px solid var(--border);">
        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
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
          <div style="height:32px;width:1px;background:var(--border);"></div>
          <div>
            <div class="muted small" style="font-weight:700;">🎯 DİNAMİK KADEME</div>
            <span class="badge" id="trapTierBadge" style="background:var(--card-hover);font-weight:800;font-size:0.76rem;padding:4px 10px;border-radius:8px;">
              🟢 Kademe 1: Isınma
            </span>
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
          <h3>Hazır mısın Dedektif?</h3>
          <p class="muted" style="max-width:440px;margin:0 auto 16px;">
            Puanın arttıkça tuzaklar kurnazlaşacak! Doğru imhalar <b>+3s bonus</b> kazandırırken, yanlış tıklamalar <b>-5s ceza</b> keser.
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
  isTrapGameActive = true;
  defusedHistory = [];
  usedTrapIdsInRun = new Set();
  maxTrapTierReached = 1;

  $('#startTrapGameBtn').style.display = 'none';
  renderCurrentTrapSentence();

  if (trapTimerId) clearInterval(trapTimerId);
  trapTimerId = setInterval(() => {
    trapTimeLeft--;
    const timerEl = $('#trapTimerVal');
    if (timerEl) {
      timerEl.textContent = `${trapTimeLeft}s`;
      if (trapTimeLeft <= 15) timerEl.style.color = '#EF4444';
      else timerEl.style.color = 'var(--text)';
    }
    if (trapTimeLeft <= 0) {
      endTrapHunterGame();
    }
  }, 1000);
}

function renderCurrentTrapSentence() {
  const stage = $('#trapStageContent');
  if (!stage) return;
  const t = pickNextTrapSentence();
  const tier = getTrapCurrentTier(trapScore);
  const tierConfig = TRAP_TIERS[tier] || TRAP_TIERS[1];

  // Kademe Göstergesini Güncelle
  const tierBadge = $('#trapTierBadge');
  if (tierBadge) {
    tierBadge.textContent = tierConfig.label;
    tierBadge.style.color = tier === 3 ? '#EF4444' : (tier === 2 ? '#F59E0B' : '#10B981');
    tierBadge.style.borderColor = tier === 3 ? '#EF4444' : (tier === 2 ? '#F59E0B' : '#10B981');
  }

  stage.innerHTML = `
    <div style="margin-bottom:12px;display:flex;justify-content:center;gap:8px;align-items:center;flex-wrap:wrap;">
      <span class="badge" style="background:var(--card-hover);color:var(--text);border:1.5px solid var(--border);font-weight:700;font-size:0.75rem;padding:4px 10px;border-radius:99px;">
        💣 TUZAKLI CÜMLE · Hatalı Kelimeye Dokun!
      </span>
      <span class="badge" style="background:var(--card-hover);font-weight:800;font-size:0.72rem;padding:4px 10px;border-radius:99px;color:${tier === 3 ? '#EF4444' : (tier === 2 ? '#F59E0B' : '#10B981')};">
        ${esc(tierConfig.label.split(':')[1]?.trim() || '')}
      </span>
    </div>
    <div class="trap-tokens-wrap" style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:18px 0;">
      ${t.sentence.map((word, wIdx) => `
        <button type="button" class="trap-word-token" data-widx="${wIdx}" style="font-size:1.35rem;padding:10px 18px;border-radius:12px;border:2px solid var(--border);background:var(--card);color:var(--text);cursor:pointer;font-weight:700;transition:all 0.15s ease;">
          ${esc(word)}
        </button>
      `).join('')}
    </div>
    <div class="muted small">Bu cümlenin içine bir Türkçe mantık tuzağı gizlendi. Yanlış kelimeyi imha et!</div>
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
  const tier = getTrapCurrentTier(trapScore);
  const tierConfig = TRAP_TIERS[tier] || TRAP_TIERS[1];

  if (isCorrect) {
    // Doğru imha!
    trapCombo++;
    const points = 10 * Math.min(trapCombo, 4);
    trapScore += points;
    trapTimeLeft = Math.min(99, trapTimeLeft + tierConfig.bonusSec);
    store.gainXP(5);

    $('#trapScoreVal').textContent = trapScore;
    $('#trapComboVal').textContent = `${trapCombo}x`;
    $('#trapTimerVal').textContent = `${trapTimeLeft}s`;

    if (typeof sfx !== 'undefined' && sfx.good) sfx.good();

    if (fbCard) {
      fbCard.style.display = 'block';
      fbCard.style.background = 'rgba(16, 185, 129, 0.1)';
      fbCard.style.borderColor = '#10B981';
      fbCard.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.6rem;">💥</span>
          <div>
            <b style="color:#059669;">Tuzak İmha Edildi! (+${points} Puan · ⏱️ +${tierConfig.bonusSec}s Süre Kazandın ${trapCombo >= 2 ? `· 🔥 ${trapCombo}x Kombo` : ''})</b>
            <div style="font-size:0.86rem;margin-top:2px;"><b>${esc(t.trapTitle)}:</b> ${esc(t.tip)}</div>
          </div>
        </div>
      `;
    }

    if (trapCombo === 3 || trapCombo === 5) {
      const curMascot = mascotService.getActive();
      if (typeof window.shimejiSay === 'function') {
        window.shimejiSay(`🔥 <b>${trapCombo}x Kombo!</b> Dedektif gibi çalışıyorsun ortak! (+${tierConfig.bonusSec}s süre eklendi)`, `🎯 ${curMascot.name}`);
      }
    }

    defusedHistory.push(t);
    renderCurrentTrapSentence();
  } else {
    // Yanlış kelime
    trapCombo = 0;
    trapTimeLeft = Math.max(0, trapTimeLeft - tierConfig.penaltySec);
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
            <b style="color:#DC2626;">Orada tuzak yok! (-${tierConfig.penaltySec}s ceza)</b>
            <div style="font-size:0.86rem;margin-top:2px;">Bu cümledeki asıl tuzak: <b>"${esc(t.sentence[t.trapIndex])}"</b> kelimesiydi. ${esc(t.tip)}</div>
          </div>
        </div>
      `;
    }

    if (trapTimeLeft <= 0) {
      endTrapHunterGame();
    }
  }
}

function endTrapHunterGame() {
  if (trapTimerId) clearInterval(trapTimerId);
  isTrapGameActive = false;

  const stage = $('#trapStageContent');
  if (stage) {
    const curMascot = mascotService.getActive();
    const highestTierConfig = TRAP_TIERS[maxTrapTierReached] || TRAP_TIERS[1];

    stage.innerHTML = `
      <div style="font-size:3.5rem;margin-bottom:8px;">🏆</div>
      <h2>Süre Doldu! Skorun: <span style="color:var(--primary);">${trapScore} Puan</span></h2>
      <div style="display:flex;gap:8px;justify-content:center;margin:8px 0 14px;flex-wrap:wrap;">
        <span class="badge" style="background:var(--card-hover);color:var(--text);border:1px solid var(--border);padding:4px 10px;border-radius:99px;">
          🎖️ Maksimum Kademe: <b>${esc(highestTierConfig.label.split(':')[1]?.trim() || '')}</b>
        </span>
        <span class="badge" style="background:var(--card-hover);color:var(--primary);border:1px solid var(--border);padding:4px 10px;border-radius:99px;">
          💣 İmha Edilen: <b>${defusedHistory.length} Tuzak</b>
        </span>
      </div>

      <p class="muted" style="max-width:480px;margin:0 auto 16px;">
        Zihnindeki Türkçe düşünme kalıplarını kırdın! Aşağıdaki tuzakları inceleyerek kuralları pekiştirebilirsin.
      </p>

      ${defusedHistory.length > 0 ? `
        <div class="defused-traps-log" style="text-align:left;max-height:180px;overflow-y:auto;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px;margin:12px 0 16px;font-size:0.84rem;">
          <div style="font-weight:800;color:var(--muted);margin-bottom:8px;">📚 Bu Oyunda Temizlediğin Tuzaklar:</div>
          ${defusedHistory.map((d, i) => `
            <div style="padding:6px 0;border-bottom:1px solid var(--border);">
              <b>${i + 1}. ${esc(d.trapTitle)}:</b> ${esc(d.tip)}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap;">
        <button type="button" class="btn btn-primary" onclick="screenTrapHunter()">🔄 Yeniden Meydan Oku</button>
        <a href="#/logic" class="btn btn-ghost">📘 Mantık Kurallarını İncele</a>
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
  if (!state.survivalQuests) state.survivalQuests = {};

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
        ${SURVIVAL_QUESTS.map((q, idx) => {
          const sq = state.survivalQuests[q.id] || {};
          let status = 'current';
          let statusLabel = 'Current';
          if (sq.done) {
            status = 'completed';
            statusLabel = 'Completed';
          } else if (sq.inProgress || sq.started) {
            status = 'in-progress';
            statusLabel = 'In-Progress';
          } else if (idx === 0) {
            status = 'current';
            statusLabel = 'Current';
          } else {
            const prevDone = state.survivalQuests[SURVIVAL_QUESTS[idx - 1]?.id]?.done;
            status = prevDone ? 'current' : 'current';
            statusLabel = 'Current';
          }
          q.status = status;
          q.statusLabel = statusLabel;

          return `
            <div class="card quest-card chapter-card" id="quest-${q.id}" data-status="${status}" style="padding:18px;display:flex;flex-direction:column;justify-content:space-between;border:2px solid var(--border);border-radius:16px;background:var(--card);transition:transform 0.2s ease;">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                  <span style="font-size:2.4rem;">${q.avatar}</span>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <span class="badge chapter-status-label status-${status}" data-status="${status}" style="font-weight:800;font-size:0.75rem;padding:3px 10px;border-radius:99px;">
                      ${statusLabel}
                    </span>
                    <span class="badge" style="background:color-mix(in srgb, var(--primary) 12%, var(--card));color:var(--primary);font-weight:800;font-size:0.74rem;">Bölüm ${idx + 1}</span>
                  </div>
                </div>
                <h3 style="margin:4px 0 6px;font-size:1.15rem;">${esc(q.title)}</h3>
                <div class="muted small" style="font-weight:700;color:var(--primary);margin-bottom:6px;">📍 ${esc(q.location)}</div>
                <p class="muted small" style="line-height:1.45;margin-bottom:12px;">${esc(q.desc)}</p>
              </div>
              <div>
                <div style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                  <span class="badge badge-reward">🎁 ${esc(q.badge)}</span>
                </div>
                <a href="#/survival/${q.id}" class="btn btn-primary" style="width:100%;text-align:center;justify-content:center;">
                  ▶ Göreve Başla
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderActiveSurvivalQuest(q) {
  activeSurvivalQuest = q;
  if (!state.survivalQuests) state.survivalQuests = {};
  const sq = state.survivalQuests[q.id] || {};
  let status = 'current';
  let statusLabel = 'Current';
  if (sq.done) {
    status = 'completed';
    statusLabel = 'Completed';
  } else if (sq.inProgress || sq.started) {
    status = 'in-progress';
    statusLabel = 'In-Progress';
  } else {
    status = 'current';
    statusLabel = 'Current';
  }
  q.status = status;
  q.statusLabel = statusLabel;

  survivalChatHistory = [
    { sender: 'officer', text: q.starterMsg }
  ];

  view().innerHTML = `
    <div class="page survival-play-page chapter-detail-panel" id="chapterDetailPanel" data-status="${status}" data-chapter="${q.id}">
      <header class="page-head" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <a href="#/survival" class="btn btn-ghost sm">◀ Harita</a>
              <span class="badge" style="background:var(--primary);color:#fff;font-weight:800;">📍 ${esc(q.location)}</span>
            </div>
            <h1 style="margin-top:6px;font-size:1.25rem;">${esc(q.title)}</h1>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="badge badge-reward" id="visaBadgeAward">🎁 ${esc(q.badge)}</span>
          </div>
        </div>
      </header>

      <!-- Görev Hedefleri Kontrol Paneli (Selected Chapter Details Area) -->
      <div class="card quest-objectives-card chapter-details-area" id="chapterDetailsArea" data-status="${status}" style="padding:14px 18px;margin-bottom:16px;background:color-mix(in srgb, var(--primary) 6%, var(--card));border:2px solid var(--border);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <b style="font-size:0.88rem;">🎯 Görev Hedefleri:</b>
        </div>
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
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    await handleSurvivalUserMessage(msg, q);
  };

  $('#survivalHintBtn').onclick = () => {
    const hintEl = $('#survivalHintText');
    if (hintEl) {
      const h = q.hints[Math.floor(Math.random() * q.hints.length)];
      hintEl.textContent = 'Öneri: ' + h;
      hintEl.style.display = 'block';
    }
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

  // Track status in-progress
  if (!state.survivalQuests) state.survivalQuests = {};
  if (!state.survivalQuests[q.id]?.done) {
    state.survivalQuests[q.id] = { started: true, inProgress: true };
    saveState();
    q.status = 'in-progress';
    q.statusLabel = 'In-Progress';
    $('.chapter-status-label, .chapter-status-badge, #chapterStatusBadge, #chapterStatusPill, #chapterStatusPillTop').forEach(el => {
      el.textContent = 'In-Progress';
      el.className = 'badge chapter-status-badge chapter-status-label status-in-progress';
      el.setAttribute('data-status', 'in-progress');
    });
  }

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
    state.survivalQuests[q.id] = { done: true, completedAt: Date.now() };
    saveState();
    q.status = 'completed';
    q.statusLabel = 'Completed';
    $('.chapter-status-label, .chapter-status-badge, #chapterStatusBadge, #chapterStatusPill, #chapterStatusPillTop').forEach(el => {
      el.textContent = 'Completed';
      el.className = 'badge chapter-status-badge chapter-status-label status-completed';
      el.setAttribute('data-status', 'completed');
    });

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
