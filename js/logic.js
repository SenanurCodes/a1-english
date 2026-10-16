/* ============================================================
   Türkçe Mantık & Günlük Hayat Rehberi 
   - Türk beyni İngilizceye nasıl geçer?
   - Formül ezberletmeyen samimi püf noktaları
   - Lokomotif Cümle Kuralı (Özne -> Eylem -> Detay)
   - Hayatta kalma kalıpları (Survival English)
   - Türklerin en çok düştüğü komik ve kritik tuzaklar
   ============================================================ */

const LOKOMOTIF_EXAMPLES = [
  {
    tr: 'Ben dün kafede arkadaşlarımla kahve içtim.',
    explanation: 'Türkçede fiil (içtim) en sondadır. İngilizcede ise sabırsızdır, hemen özneden sonra söylenir!',
    cars: [
      { role: '🚂 1. ÖZNE (Kim?)', en: 'I', tr: 'Ben', color: 'var(--role-subject)' },
      { role: '⚡ 2. EYLEM (Ne yaptı?)', en: 'drank', tr: 'İçtim', color: 'var(--role-verb)' },
      { role: '📦 3. NESNE (Neyi?)', en: 'coffee', tr: 'Kahve', color: 'var(--role-object)' },
      { role: '👥 4. KİMLE (Kiminle?)', en: 'with my friends', tr: 'Arkadaşlarımla', color: 'var(--role-with)' },
      { role: '📍 5. YER (Nerede?)', en: 'at a cafe', tr: 'Kafede', color: 'var(--role-place)' },
      { role: '⏰ 6. ZAMAN (Ne zaman?)', en: 'yesterday', tr: 'Dün', color: 'var(--role-time)' }
    ],
    fullEn: 'I drank coffee with my friends at a cafe yesterday.'
  },
  {
    tr: 'Biz her sabah parkta koşarız.',
    explanation: 'Özne ve eylem yapışıktır (We run). Nerede ve ne zaman detayları arkaya sıralanır.',
    cars: [
      { role: '🚂 1. ÖZNE (Kim?)', en: 'We', tr: 'Biz', color: 'var(--role-subject)' },
      { role: '⚡ 2. EYLEM (Ne yapar?)', en: 'run', tr: 'Koşarız', color: 'var(--role-verb)' },
      { role: '📍 3. YER (Nerede?)', en: 'in the park', tr: 'Parkta', color: 'var(--role-place)' },
      { role: '⏰ 4. ZAMAN (Ne zaman?)', en: 'every morning', tr: 'Her sabah', color: 'var(--role-time)' }
    ],
    fullEn: 'We run in the park every morning.'
  },
  {
    tr: 'Sarah yarın Londra\'ya uçacak.',
    explanation: 'Zaman zarfları (tomorrow, yesterday) lokomotifin en son vagonudur!',
    cars: [
      { role: '🚂 1. ÖZNE (Kim?)', en: 'Sarah', tr: 'Sarah', color: 'var(--role-subject)' },
      { role: '⚡ 2. EYLEM (Ne yapacak?)', en: 'will fly', tr: 'Uçacak', color: 'var(--role-verb)' },
      { role: '📍 3. YER (Nereye?)', en: 'to London', tr: 'Londra\'ya', color: 'var(--role-place)' },
      { role: '⏰ 4. ZAMAN (Ne zaman?)', en: 'tomorrow', tr: 'Yarın', color: 'var(--role-time)' }
    ],
    fullEn: 'Sarah will fly to London tomorrow.'
  }
];

const LOGIC_CATEGORIES = [
  { id: 'all', label: '🌟 Tümü' },
  { id: 'mindset', label: '🚂 Cümle Lokomotifi' },
  { id: 'traps', label: '⚠️ Türk Tuzakları' },
  { id: 'survival', label: '🛡️ Hayatta Kalma' },
  { id: 'culture', label: '🤝 Nezaket & Kültür' }
];

const LOGIC_GUIDES = [
  {
    id: 'mindset',
    category: 'mindset',
    title: '🧠 Cümle Kurma Mantığı: Lokomotif Kuralı',
    sub: 'Türkçe vs İngilizce Düşünce Farkı',
    emoji: '🚂',
    color: 'var(--cat-mantik)',
    summary: 'Türkçe cümle tersten gelir, İngilizce ise tren lokomotifi gibi düz gider!',
    content: `
      <h4>1. Lokomotif Kuralı: Özne + İş + Detay</h4>
      <p>Türkçede en önemli eylemi cümlenin en sonuna saklarız: <i>"Ben dün akşam arkadaşlarımla kahve <b>içtim</b>."</i></p>
      <p>İngilizler ise sabırsızdır! Hemen kimin ne yaptığını duymak isterler:</p>
      <div class="logic-box">
        <b>İngilizce Mantığı:</b> <u>Kim?</u> (I) ➡️ <u>Ne yaptı?</u> (drank) ➡️ <u>Neyi?</u> (coffee) ➡️ <u>Kiminle?</u> (with friends) ➡️ <u>Ne zaman?</u> (yesterday).<br>
        👉 <b>"I drank coffee with friends yesterday."</b>
      </div>

      <h4>2. Türkçedeki Ekler Yerine Ön Kelimeler</h4>
      <p>Biz kelimenin sonuna ek yapıştırırız (<i>ev-<b>de</b>, araba-<b>dan</b>, okul-<b>a</b></i>). İngilizce ise o eki kelimenin önüne ayrı bir kelime olarak koyar: (<i><b>in</b> the house, <b>from</b> the car, <b>to</b> the school</i>).</p>
    `
  },
  {
    id: 'traps',
    category: 'traps',
    title: '⚠️ Türklerin Düştüğü Kritik Tuzaklar',
    sub: 'Türkçeden Birebir Çevirince Komik Olan Hatalar',
    emoji: '🚨',
    color: 'var(--warning)',
    summary: 'Kelimeleri birebir Türkçe düşünerek İngilizceye çevirdiğinde bu tuzaklara düşersin.',
    traps: [
      {
        wrong: 'I am agree with you.',
        right: 'I agree with you.',
        why: 'Türkçede "katılıyorum" diyoruz diye "am" koyma eğilimi olur. "Agree" zaten kendi başına bir fiildir, "am/is/are" istemez!'
      },
      {
        wrong: 'I have 20 years old.',
        right: 'I am 20 years old.',
        why: 'Türkçede "20 yaşım var" deriz. İngilizler ise yaşı bir eşya gibi sahiplik değil, bir durum olarak görür: "Ben 20 yaşındayım (I am 20)".'
      },
      {
        wrong: 'Close the light!',
        right: 'Turn off the light!',
        why: 'Işığı kapı gibi kapatamayız! Düğmeli elektrikli aletler için "turn off", açmak için "turn on" kullanılır.'
      },
      {
        wrong: 'I am coming from Turkey.',
        right: 'I am from Turkey. / I come from Turkey.',
        why: '"Coming" dersen şu anda uçakla yoldayım gibi anlaşılır. Memleketini söylerken "I am from..." kalıbı kullanılır.'
      },
      {
        wrong: 'I am boring.',
        right: 'I am bored.',
        why: '"I am boring" dersen "Ben çok sıkıcı bir insanım" demiş olursun! Canın sıkıldığında "I am bored" demelisin.'
      },
      {
        wrong: 'How does it look like?',
        right: 'What does it look like?',
        why: 'Türkçede "Nasıl görünüyor?" deriz ama İngilizler "O neye benziyor? (What ... like?)" diye sorar.'
      }
    ]
  },
  {
    id: 'survival',
    category: 'survival',
    title: '🛡️ Hayatta Kalma Kalıpları (Refleks Kalıplar)',
    sub: 'Yurt Dışında / İnternette En Çok Kurtaranlar',
    emoji: '✈️',
    color: 'var(--success)',
    summary: 'Gramer formülü düşünmeden doğrudan ağzından çıkması gereken hayat kurtarıcı refleksler.',
    phrases: [
      { en: 'Could I get a coffee, please?', tr: 'Bir kahve alabilir miyim lütfen?', tip: 'Restoranda/kafede en kibar ve doğal sipariş isteme yolu.' },
      { en: 'How much is this?', tr: 'Bu ne kadar / Kaç para?', tip: 'Fiyat sorarken doğrudan ve net kalıp.' },
      { en: 'Where is the restroom?', tr: 'Tuvalet nerede?', tip: 'En acil durum sorusu! ("toilet" yerine "restroom" daha kibardır).' },
      { en: 'Could you say that again, please?', tr: 'Tekrar söyleyebilir misiniz lütfen?', tip: 'Anlamadığında çekinmeden kullanacağın kalıp.' },
      { en: 'I didn\'t catch that.', tr: 'Tam duyamadım / yakalayamadım.', tip: 'Çok doğal ve samimi bir "anlamadım" deme şekli.' },
      { en: 'Never mind!', tr: 'Boşver / Önemli değil!', tip: 'Konuyu kapatmak veya dert değil demek için kullanılır.' },
      { en: 'It\'s up to you.', tr: 'Sana bağlı / Sen bilirsin.', tip: 'Kararı karşı tarafa bırakırken kullanılan şık ifade.' },
      { en: 'Keep the change!', tr: 'Üstü kalsın!', tip: 'Taksi veya bahşiş bırakırken en çok kullanılan havalı kalıp.' }
    ]
  },
  {
    id: 'culture',
    category: 'culture',
    title: '🤝 Nezaket ve İletişim İncelikleri',
    sub: 'Kaba Görünmeden Konuşmanın Sırrı',
    emoji: '🎩',
    color: 'var(--cat-mantik)',
    summary: 'İngilizler ve Amerikalılar doğrudan emir kiplerini kaba bulurlar. İşte sihirli yumuşatıcılar:',
    content: `
      <h4>1. "Give me water" deme!</h4>
      <p>Türkçede restoranda <i>"Bana bir su ver"</i> veya <i>"Bir su baksana"</i> demek samimi gelebilir. Ama İngilizcede <b>"Give me water"</b> dersen sert bir emir vermiş olursun ve garsonu kırabilirsin.</p>
      <p>Bunun yerine sihirli kelimeleri kullan:</p>
      <ul>
        <li><b>"Can I have a water, please?"</b> (Su alabilir miyim lütfen?)</li>
        <li><b>"I'd like a bottle of water."</b> (Bir şişe su rica edecektim.)</li>
      </ul>

      <h4>2. Teşekkürün Önemi</h4>
      <p>İngilizcede <b>"Please"</b>, <b>"Thank you"</b> ve <b>"Excuse me"</b> kelimelerini ne kadar çok kullanırsan o kadar iyi karşılanırsın. Fazla kullanmaktan asla korkma!</p>
    `,
    phrases: [
      { en: 'Can I have a water, please?', tr: 'Bir su alabilir miyim lütfen?', tip: 'Restoranda/kafede kaba emir kipi yerine kullanılan en kibar ve doğal istek kalıbı.' },
      { en: "I'd like a coffee, please.", tr: 'Bir kahve rica ediyorum.', tip: 'Sipariş verirken kullanılan sihirli yumuşatıcı ifade.' },
      { en: 'Excuse me, could you help me?', tr: 'Affedersiniz, bana yardımcı olabilir misiniz?', tip: 'Birine soru sormadan önce mutlaka söylenmesi gereken nezaket kalıbı.' },
      { en: 'Thank you so much!', tr: 'Çok teşekkür ederim!', tip: 'Her yardım veya alışveriş sonrasında içten teşekkür kalıbı.' }
    ]
  }
];

