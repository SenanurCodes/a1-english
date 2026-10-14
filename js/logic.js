/* ============================================================
   Türkçe Mantık & Günlük Hayat Rehberi (Duolingo Tarzı Değil!)
   - Türk beyni İngilizceye nasıl geçer?
   - Formül ezberletmeyen samimi püf noktaları
   - Hayatta kalma kalıpları (Survival English)
   - Türklerin en çok düştüğü komik ve kritik tuzaklar
   ============================================================ */

const LOGIC_GUIDES = [
  {
    id: 'mindset',
    title: '🧠 Cümle Kurma Mantığı',
    sub: 'Türkçe vs İngilizce Düşünce Farkı',
    emoji: '🧩',
    color: '#FF6B6B',
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
    id: 'survival',
    title: '🛡️ Hayatta Kalma Kalıpları',
    sub: 'Yurt Dışında / İnternette En Çok Kurtaranlar',
    emoji: '✈️',
    color: '#20C997',
    summary: 'Gramer düşünmeden doğrudan ağızdan çıkması gereken refleks kalıplar.',
    phrases: [
      { en: 'Could I get a coffee, please?', tr: 'Bir kahve alabilir miyim lütfen?', tip: 'Restoranda/kafede en kibar ve doğal isteme yolu.' },
      { en: 'How much is this?', tr: 'Bu ne kadar / Kaç para?', tip: 'Fiyat sorarken doğrudan ve net.' },
      { en: 'Where is the restroom?', tr: 'Tuvalet nerede?', tip: 'En acil durum sorusu! (toilet yerine restroom daha kibardır).' },
      { en: 'Could you say that again, please?', tr: 'Tekrar söyleyebilir misiniz lütfen?', tip: 'Anlamadığında çekinmeden kullanacağın kalıp.' },
      { en: 'I didn\'t catch that.', tr: 'Tam duyamadım / yakalayamadım.', tip: 'Çok doğal bir "anlamadım" deme şekli.' },
      { en: 'Never mind!', tr: 'Boşver / Önemli değil!', tip: 'Konuyu kapatmak veya dert değil demek için.' },
      { en: 'It\'s up to you.', tr: 'Sana bağlı / Sen bilirsin.', tip: 'Kararı karşı tarafa bırakırken kullanılır.' }
    ]
  },
  {
    id: 'traps',
    title: '⚠️ Türk Tuzakları',
    sub: 'Türkçeden Birebir Çevirince Komik Olan Hatalar',
    emoji: '🚨',
    color: '#FCC419',
    traps: [
      {
        wrong: 'I am agree with you.',
        right: 'I agree with you.',
        why: 'Türkçede "katılıyorum" diyoruz diye "am" koyma eğilimi olur. "Agree" zaten kendi başına bir fiildir, to be (am/is/are) istemez!'
      },
      {
        wrong: 'I have 20 years old.',
        right: 'I am 20 years old.',
        why: 'Türkçede "20 yaşım var / yaşındayım" deriz. İngilizler ise yaşı bir sahiplik değil, bir durum olarak görür: "Ben 20 yaşındayım (I am 20)".'
      },
      {
        wrong: 'Close the light!',
        right: 'Turn off the light!',
        why: 'Işığı kapı gibi kapatamayız! Düğmeli elektrikli aletler için "turn off", açmak için "turn on" kullanılır.'
      },
      {
        wrong: 'I am coming from Turkey.',
        right: 'I am from Turkey. / I come from Turkey.',
        why: '"Coming" dersen şu anda yoldayım uçakla geliyorum gibi anlaşılır. Memleketini söylerken "I am from..." denir.'
      }
    ]
  },
  {
    id: 'culture',
    title: '🤝 Nezaket ve İletişim İncelikleri',
    sub: 'Kaba Görünmeden Konuşmanın Sırrı',
    emoji: '🎩',
    color: '#339AF0',
    summary: 'İngilizler ve Amerikalılar doğrudan emir kiplerini kaba bulurlar.',
    content: `
      <h4>1. "Give me water" deme!</h4>
      <p>Türkçede restoranda <i>"Bana bir su ver"</i> veya <i>"Bir su baksana"</i> demek samimi gelebilir. Ama İngilizcede <b>"Give me water"</b> dersen emir vermiş olursun ve çok kaba kaçar.</p>
      <p>Bunun yerine sihirli kelimeleri kullan:</p>
      <ul>
        <li><b>"Can I have a water, please?"</b> (Su alabilir miyim lütfen?)</li>
        <li><b>"I'd like a bottle of water."</b> (Bir şişe su rica edecektim.)</li>
      </ul>

      <h4>2. Teşekkürün Önemi</h4>
      <p>İngilizcede <b>"Please"</b>, <b>"Thank you"</b> ve <b>"Excuse me"</b> kelimelerini ne kadar çok kullanırsan o kadar iyi karşılanırsın. Fazla kullanmaktan asla korkma!</p>
    `
  }
];
