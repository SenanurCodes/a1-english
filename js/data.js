/* ============================================================
   A1 İngilizce müfredatı
   - vocab üniteleri: words = [ingilizce, türkçe, emoji]
   - grammar üniteleri: mc = [soru, [DOĞRU, yanlış, yanlış], ipucu?]
                        order = [ingilizce cümle, türkçe anlamı]
   NOT: mc seçeneklerinde ilk seçenek her zaman doğru cevaptır,
        uygulama seçenekleri karıştırarak gösterir.
   ============================================================ */

const UNIT_COLORS = ['#FF6B6B', '#FF922B', '#FCC419', '#51CF66', '#20C997', '#339AF0', '#5C7CFA', '#CC5DE8', '#F06595'];

const RAW_UNITS = [
  {
    id: 'greetings', type: 'vocab', title: 'Selamlaşma', en: 'Greetings', emoji: '👋',
    words: [
      ['hello', 'merhaba', '👋'], ['hi', 'selam', '🙋'], ['good morning', 'günaydın', '🌅'],
      ['good afternoon', 'tünaydın', '☀️'], ['good evening', 'iyi akşamlar', '🌆'], ['good night', 'iyi geceler', '🌙'],
      ['goodbye', 'hoşça kal', '🚶'], ['see you', 'görüşürüz', '😉'], ['thank you', 'teşekkür ederim', '🙏'],
      ['please', 'lütfen', '🥺'], ['sorry', 'özür dilerim', '😔'], ['yes', 'evet', '✅'], ['no', 'hayır', '❌'],
      ['excuse me', 'affedersiniz', '🙋‍♂️'], ['how are you', 'nasılsın', '🤔'], ['fine', 'iyi', '🙂'],
      ['nice to meet you', 'tanıştığıma memnun oldum', '🤝'], ['welcome', 'hoş geldin', '🎉']
    ]
  },
  {
    id: 'tobe', type: 'grammar', title: 'to be (am / is / are)', en: 'Verb to be', emoji: '🧩',
    explain: `
      <p><b>to be</b> fiili Türkçedeki <b>"-im, -sin, -dir"</b> eklerinin karşılığıdır.</p>
      <table class="g-table">
        <tr><th>Olumlu</th><th>Olumsuz</th><th>Soru</th></tr>
        <tr><td>I <b>am</b></td><td>I <b>am not</b></td><td><b>Am</b> I?</td></tr>
        <tr><td>You <b>are</b></td><td>You <b>aren't</b></td><td><b>Are</b> you?</td></tr>
        <tr><td>He / She / It <b>is</b></td><td>He <b>isn't</b></td><td><b>Is</b> he?</td></tr>
        <tr><td>We / They <b>are</b></td><td>We <b>aren't</b></td><td><b>Are</b> they?</td></tr>
      </table>
      <p>Kısaltmalar: I'm, you're, he's, she's, it's, we're, they're</p>`,
    examples: [['I am a student.', 'Ben bir öğrenciyim.'], ['She is happy.', 'O mutlu.'], ['Are you tired?', 'Yorgun musun?'], ["They aren't at home.", 'Onlar evde değil.']],
    mc: [
      ['I ___ a student.', ['am', 'is', 'are']], ['She ___ my sister.', ['is', 'am', 'are']],
      ['They ___ from Turkey.', ['are', 'is', 'am']], ['We ___ happy.', ['are', 'is', 'am']],
      ['It ___ a cat.', ['is', 'are', 'am']], ['You ___ my friend.', ['are', 'is', 'am']],
      ['He ___ not a doctor.', ['is', 'are', 'am']], ['___ you hungry?', ['Are', 'Is', 'Am']],
      ['My mother ___ at home.', ['is', 'are', 'am']], ['I ___ not tired.', ['am', 'is', 'are']]
    ],
    order: [['I am from Turkey', "Ben Türkiye'denim."], ['She is a teacher', 'O bir öğretmen.'], ['Are you a student', 'Sen öğrenci misin?']]
  },
  {
    id: 'numbers_0_50', type: 'vocab', title: 'Sayılar: 0 - 50', en: 'Numbers: 0 to 50', emoji: '1️⃣',
    words: [
      ['zero', 'sıfır', '0️⃣'], ['one', 'bir', '1️⃣'], ['two', 'iki', '2️⃣'], ['three', 'üç', '3️⃣'], ['four', 'dört', '4️⃣'],
      ['five', 'beş', '5️⃣'], ['six', 'altı', '6️⃣'], ['seven', 'yedi', '7️⃣'], ['eight', 'sekiz', '8️⃣'], ['nine', 'dokuz', '9️⃣'],
      ['ten', 'on', '🔟'], ['eleven', 'on bir', '11'], ['twelve', 'on iki', '12'], ['thirteen', 'on üç', '13'],
      ['fourteen', 'on dört', '14'], ['fifteen', 'on beş', '15'], ['sixteen', 'on altı', '16'], ['twenty', 'yirmi', '20'],
      ['twenty-five', 'yirmi beş', '25'], ['thirty', 'otuz', '30'], ['forty', 'kırk', '40'], ['fifty', 'elli', '50']
    ]
  },
  {
    id: 'numbers_50_100', type: 'vocab', title: 'Sayılar: 50 - 100', en: 'Numbers: 50 to 100', emoji: '💯',
    words: [
      ['fifty', 'elli', '50'], ['fifty-five', 'elli beş', '55'], ['sixty', 'altmış', '60'], ['sixty-four', 'altmış dört', '64'],
      ['seventy', 'yetmiş', '70'], ['seventy-five', 'yetmiş beş', '75'], ['eighty', 'seksen', '80'], ['eighty-eight', 'seksen sekiz', '88'],
      ['ninety', 'doksan', '90'], ['ninety-nine', 'doksan dokuz', '99'], ['one hundred', 'yüz', '💯'],
      ['number', 'sayı / numara', '🔢'], ['how many', 'kaç tane', '❓'], ['how much', 'ne kadar / fiyat', '🏷️'],
      ['first', 'birinci', '🥇'], ['second', 'ikinci', '🥈'], ['third', 'üçüncü', '🥉']
    ]
  },
  {
    id: 'pronouns', type: 'grammar', title: 'Zamirler ve İyelikler', en: 'Pronouns & Possessives', emoji: '👥',
    explain: `
      <p><b>Şahıs zamirleri</b> cümlenin öznesidir. <b>İyelik sıfatları</b> bir şeyin kime ait olduğunu söyler.</p>
      <table class="g-table">
        <tr><th>Zamir</th><th>Türkçe</th><th>İyelik</th><th>Türkçe</th></tr>
        <tr><td>I</td><td>ben</td><td>my</td><td>benim</td></tr>
        <tr><td>you</td><td>sen / siz</td><td>your</td><td>senin / sizin</td></tr>
        <tr><td>he</td><td>o (erkek)</td><td>his</td><td>onun</td></tr>
        <tr><td>she</td><td>o (kadın)</td><td>her</td><td>onun</td></tr>
        <tr><td>it</td><td>o (eşya, hayvan)</td><td>its</td><td>onun</td></tr>
        <tr><td>we</td><td>biz</td><td>our</td><td>bizim</td></tr>
        <tr><td>they</td><td>onlar</td><td>their</td><td>onların</td></tr>
      </table>`,
    examples: [['My name is Ali.', 'Benim adım Ali.'], ['Her cat is white.', 'Onun kedisi beyaz.'], ['They love their school.', 'Onlar okullarını seviyor.']],
    mc: [
      ['This is ___ book. (benim)', ['my', 'I', 'me']], ['She loves ___ cat. (onun - kadın)', ['her', 'his', 'she']],
      ['He is with ___ father.', ['his', 'her', 'he']], ['We love ___ school.', ['our', 'we', 'us']],
      ['They are in ___ car.', ['their', 'they', 'them']], ['___ am Ali.', ['I', 'My', 'Me']],
      ['___ is my brother.', ['He', 'His', 'Him']], ['The dog is eating ___ food.', ['its', 'it', 'it is']],
      ['Is this ___ pen? (senin)', ['your', 'you', 'yours']], ['Ayşe is a nurse. ___ is very kind.', ['She', 'He', 'Her']]
    ],
    order: [['My name is Ali', 'Benim adım Ali.'], ['Their house is big', 'Onların evi büyük.'], ['Her eyes are blue', 'Onun gözleri mavi.']]
  },
  {
    id: 'colors', type: 'vocab', title: 'Renkler', en: 'Colours', emoji: '🎨',
    words: [
      ['red', 'kırmızı', '🔴'], ['blue', 'mavi', '🔵'], ['green', 'yeşil', '🟢'], ['yellow', 'sarı', '🟡'],
      ['orange', 'turuncu', '🟠'], ['purple', 'mor', '🟣'], ['black', 'siyah', '⚫'], ['white', 'beyaz', '⚪'],
      ['brown', 'kahverengi', '🟤'], ['pink', 'pembe', '🌸'], ['grey', 'gri', '🐘'], ['colour', 'renk', '🎨']
    ]
  },
  {
    id: 'articles', type: 'grammar', title: 'a / an ve Çoğullar', en: 'Articles & Plurals', emoji: '🍎',
    explain: `
      <p><b>a</b> ünsüz (sessiz) <b>sesle</b> başlayan kelimelerden önce, <b>an</b> ünlü (sesli) <b>sesle</b> başlayanlardan önce gelir.</p>
      <p>a <b>b</b>ook, a <b>c</b>at &nbsp;|&nbsp; an <b>a</b>pple, an <b>e</b>gg, an <b>h</b>our (h okunmaz!)</p>
      <table class="g-table">
        <tr><th>Kural</th><th>Örnek</th></tr>
        <tr><td>+ s</td><td>cat → cat<b>s</b></td></tr>
        <tr><td>-s, -x, -ch, -sh → + es</td><td>box → box<b>es</b></td></tr>
        <tr><td>ünsüz + y → ies</td><td>baby → bab<b>ies</b></td></tr>
        <tr><td>Düzensiz</td><td>man → men, woman → women, child → children, foot → feet, tooth → teeth, mouse → mice</td></tr>
      </table>`,
    examples: [['I have an apple.', 'Bir elmam var.'], ['She has two cats.', 'Onun iki kedisi var.'], ['Three children are playing.', 'Üç çocuk oynuyor.']],
    mc: [
      ['___ apple', ['an', 'a', '-']], ['___ dog', ['a', 'an', '-']], ['___ umbrella', ['an', 'a', '-']],
      ['___ book', ['a', 'an', '-']], ['___ hour', ['an', 'a', '-']], ['one box, two ___', ['boxes', 'boxs', 'box']],
      ['one baby, two ___', ['babies', 'babys', 'babyes']], ['one child, three ___', ['children', 'childs', 'childrens']],
      ['one man, two ___', ['men', 'mans', 'mens']], ['one foot, two ___', ['feet', 'foots', 'feets']]
    ],
    order: [['I have an orange', 'Bir portakalım var.'], ['I see two men', 'İki adam görüyorum.'], ['She has three cats', 'Onun üç kedisi var.']]
  },
  {
    id: 'family', type: 'vocab', title: 'Aile', en: 'Family', emoji: '👨‍👩‍👧',
    words: [
      ['mother', 'anne', '👩'], ['father', 'baba', '👨'], ['sister', 'kız kardeş', '👧'], ['brother', 'erkek kardeş', '👦'],
      ['grandmother', 'büyükanne', '👵'], ['grandfather', 'büyükbaba', '👴'], ['parents', 'ebeveynler', '👫'],
      ['son', 'oğul', '🧒'], ['daughter', 'kız evlat', '👧'], ['baby', 'bebek', '👶'], ['uncle', 'amca / dayı', '🧔'],
      ['aunt', 'teyze / hala', '👩‍🦰'], ['cousin', 'kuzen', '🧑'], ['husband', 'koca', '🤵'], ['wife', 'eş (kadın)', '👰'],
      ['family', 'aile', '👨‍👩‍👧‍👦']
    ]
  },
  {
    id: 'thisthat', type: 'grammar', title: 'this / that / these / those', en: 'Demonstratives', emoji: '👉',
    explain: `
      <table class="g-table">
        <tr><th></th><th>Yakın 👇</th><th>Uzak 👉</th></tr>
        <tr><td>Tekil</td><td><b>this</b> (bu)</td><td><b>that</b> (şu / o)</td></tr>
        <tr><td>Çoğul</td><td><b>these</b> (bunlar)</td><td><b>those</b> (şunlar / onlar)</td></tr>
      </table>
      <p>this ve that ile <b>is</b>, these ve those ile <b>are</b> kullanılır.</p>`,
    examples: [['This is my bag.', 'Bu benim çantam.'], ['Those are birds.', 'Şunlar kuş.'], ['Is that your car?', 'Şu senin araban mı?']],
    mc: [
      ['___ is my bag. (yakın, tekil)', ['This', 'These', 'Those']], ['___ are my shoes. (yakın, çoğul)', ['These', 'This', 'That']],
      ['___ is a bird. (uzak, tekil)', ['That', 'Those', 'These']], ['___ are stars. (uzak, çoğul)', ['Those', 'That', 'This']],
      ['Look at ___ mountains over there!', ['those', 'this', 'that']], ['___ apple here is red.', ['This', 'These', 'Those']],
      ['Are ___ your keys? (yakın)', ['these', 'this', 'that']], ['Is ___ your car over there?', ['that', 'those', 'these']],
      ['___ books on my desk are new.', ['These', 'This', 'That']]
    ],
    order: [['This is my house', 'Bu benim evim.'], ['Those are my friends', 'Şunlar benim arkadaşlarım.'], ['Is that your dog', 'Şu senin köpeğin mi?']]
  },
  {
    id: 'days', type: 'vocab', title: 'Günler, Aylar, Mevsimler', en: 'Days, Months, Seasons', emoji: '📅',
    words: [
      ['Monday', 'Pazartesi', '📅'], ['Tuesday', 'Salı', '📅'], ['Wednesday', 'Çarşamba', '📅'], ['Thursday', 'Perşembe', '📅'],
      ['Friday', 'Cuma', '📅'], ['Saturday', 'Cumartesi', '🎈'], ['Sunday', 'Pazar', '🎈'],
      ['January', 'Ocak', '❄️'], ['February', 'Şubat', '💘'], ['March', 'Mart', '🌱'], ['April', 'Nisan', '🌷'],
      ['May', 'Mayıs', '🌼'], ['June', 'Haziran', '🍓'], ['July', 'Temmuz', '🏖️'], ['August', 'Ağustos', '🍉'],
      ['September', 'Eylül', '🎒'], ['October', 'Ekim', '🎃'], ['November', 'Kasım', '🍂'], ['December', 'Aralık', '🎄'],
      ['spring', 'ilkbahar', '🌸'], ['summer', 'yaz', '☀️'], ['autumn', 'sonbahar', '🍁'], ['winter', 'kış', '⛄'],
      ['week', 'hafta', '🗓️'], ['year', 'yıl', '🎆']
    ]
  },
  {
    id: 'havegot', type: 'grammar', title: 'have got / has got', en: 'Have got', emoji: '🎁',
    explain: `
      <p><b>have got</b> sahiplik bildirir, Türkçedeki <b>"...-im var"</b> yapısının karşılığıdır.</p>
      <table class="g-table">
        <tr><th>Olumlu</th><th>Olumsuz</th><th>Soru</th></tr>
        <tr><td>I / You / We / They <b>have got</b></td><td><b>haven't got</b></td><td><b>Have</b> you <b>got</b>...?</td></tr>
        <tr><td>He / She / It <b>has got</b></td><td><b>hasn't got</b></td><td><b>Has</b> she <b>got</b>...?</td></tr>
      </table>`,
    examples: [["I've got a brother.", 'Bir erkek kardeşim var.'], ['She has got long hair.', 'Onun uzun saçları var.'], ['Have you got a pen?', 'Kalemin var mı?']],
    mc: [
      ['I ___ got a brother.', ['have', 'has', 'am']], ['She ___ got long hair.', ['has', 'have', 'is']],
      ['They ___ got a big house.', ['have', 'has', 'are']], ['He ___ got a car. (olumsuz)', ["hasn't", "haven't", "isn't"]],
      ['___ you got a pen?', ['Have', 'Has', 'Are']], ['___ she got a cat?', ['Has', 'Have', 'Is']],
      ['We ___ got any milk. (olumsuz)', ["haven't", "hasn't", "aren't"]], ['The cat ___ got green eyes.', ['has', 'have', 'is']],
      ['My parents ___ got two cars.', ['have', 'has', 'are']]
    ],
    order: [['I have got a sister', 'Bir kız kardeşim var.'], ['Has he got a bike', 'Onun bisikleti var mı?'], ["We haven't got a dog", 'Köpeğimiz yok.']]
  },
  {
    id: 'food', type: 'vocab', title: 'Yiyecek ve İçecek', en: 'Food & Drink', emoji: '🍔',
    words: [
      ['bread', 'ekmek', '🍞'], ['water', 'su', '💧'], ['milk', 'süt', '🥛'], ['apple', 'elma', '🍎'], ['banana', 'muz', '🍌'],
      ['egg', 'yumurta', '🥚'], ['cheese', 'peynir', '🧀'], ['tea', 'çay', '🍵'], ['coffee', 'kahve', '☕'],
      ['juice', 'meyve suyu', '🧃'], ['chicken', 'tavuk eti', '🍗'], ['fish', 'balık', '🐟'], ['rice', 'pirinç / pilav', '🍚'],
      ['soup', 'çorba', '🍲'], ['cake', 'pasta / kek', '🍰'], ['orange', 'portakal', '🍊'], ['tomato', 'domates', '🍅'],
      ['potato', 'patates', '🥔'], ['breakfast', 'kahvaltı', '🍳'], ['dinner', 'akşam yemeği', '🍽️']
    ]
  },
  {
    id: 'thereis', type: 'grammar', title: 'there is / there are', en: 'There is / are', emoji: '📍',
    explain: `
      <p><b>there is / there are</b> bir yerde bir şeyin <b>var olduğunu</b> söyler.</p>
      <table class="g-table">
        <tr><th></th><th>Tekil</th><th>Çoğul</th></tr>
        <tr><td>Olumlu</td><td>There <b>is</b> a cat.</td><td>There <b>are</b> two cats.</td></tr>
        <tr><td>Olumsuz</td><td>There <b>isn't</b> a cat.</td><td>There <b>aren't</b> any cats.</td></tr>
        <tr><td>Soru</td><td><b>Is there</b> a cat?</td><td><b>Are there</b> any cats?</td></tr>
      </table>`,
    examples: [['There is a park near my house.', 'Evimin yakınında bir park var.'], ['There are five people in my family.', 'Ailemde beş kişi var.']],
    mc: [
      ['There ___ a cat on the bed.', ['is', 'are', 'am']], ['There ___ two books on the table.', ['are', 'is', 'am']],
      ['There ___ any milk. (olumsuz)', ["isn't", "aren't", "not"]], ['___ there a bank near here?', ['Is', 'Are', 'Am']],
      ['___ there any apples?', ['Are', 'Is', 'Do']], ['There ___ many people in the park.', ['are', 'is', 'be']],
      ['There ___ a big tree in the garden.', ['is', 'are', 'have']], ['There ___ any chairs in the room. (olumsuz)', ["aren't", "isn't", "not"]],
      ['How many students ___ there?', ['are', 'is', 'do']]
    ],
    order: [['There is a lamp in my room', 'Odamda bir lamba var.'], ['There are five people in my family', 'Ailemde beş kişi var.'], ['Is there a park near here', 'Buralarda park var mı?']]
  },
  {
    id: 'body', type: 'vocab', title: 'Vücudumuz', en: 'The Body', emoji: '🧍',
    words: [
      ['head', 'baş / kafa', '🙂'], ['eye', 'göz', '👁️'], ['ear', 'kulak', '👂'], ['nose', 'burun', '👃'], ['mouth', 'ağız', '👄'],
      ['tooth', 'diş', '🦷'], ['hair', 'saç', '💇'], ['hand', 'el', '✋'], ['arm', 'kol', '💪'], ['leg', 'bacak', '🦵'],
      ['foot', 'ayak', '🦶'], ['finger', 'parmak', '☝️'], ['face', 'yüz', '😊'], ['heart', 'kalp', '❤️']
    ]
  },
  {
    id: 'clothes', type: 'vocab', title: 'Kıyafetler', en: 'Clothes', emoji: '👕',
    words: [
      ['shirt', 'gömlek', '👔'], ['T-shirt', 'tişört', '👕'], ['trousers', 'pantolon', '👖'], ['dress', 'elbise', '👗'],
      ['skirt', 'etek', '🩱'], ['shoes', 'ayakkabı', '👟'], ['socks', 'çorap', '🧦'], ['hat', 'şapka', '🎩'],
      ['coat', 'palto / mont', '🧥'], ['scarf', 'atkı', '🧣'], ['gloves', 'eldiven', '🧤'], ['bag', 'çanta', '👜'],
      ['glasses', 'gözlük', '👓'], ['boots', 'bot / çizme', '👢']
    ]
  },
  {
    id: 'presentsimple', type: 'grammar', title: 'Geniş Zaman (Present Simple)', en: 'Present Simple', emoji: '🔁',
    explain: `
      <p>Alışkanlıkları, rutinleri ve genel gerçekleri anlatır. Türkçedeki <b>geniş zaman (-r, -ar, -er)</b> gibidir.</p>
      <table class="g-table">
        <tr><th>Olumlu</th><th>Olumsuz</th><th>Soru</th></tr>
        <tr><td>I / You / We / They <b>work</b></td><td><b>don't</b> work</td><td><b>Do</b> you work?</td></tr>
        <tr><td>He / She / It <b>works</b></td><td><b>doesn't</b> work</td><td><b>Does</b> she work?</td></tr>
      </table>
      <p>He / She / It ile fiile <b>-s</b> eklenir: play → play<b>s</b>, watch → watch<b>es</b>, go → go<b>es</b>, cry → cr<b>ies</b></p>
      <p>Sıklık kelimeleri: always, usually, often, sometimes, never, every day</p>`,
    examples: [['I drink tea every morning.', 'Her sabah çay içerim.'], ['She goes to school by bus.', 'O okula otobüsle gider.'], ["He doesn't like fish.", 'O balık sevmez.']],
    mc: [
      ['She ___ to school every day.', ['goes', 'go', 'going']], ['I ___ coffee in the morning.', ['drink', 'drinks', 'drinking']],
      ['He ___ TV in the evening.', ['watches', 'watch', 'watchs']], ['They ___ like fish.', ["don't", "doesn't", "isn't"]],
      ['My father ___ work on Sundays.', ["doesn't", "don't", "isn't"]], ['___ you play football?', ['Do', 'Does', 'Are']],
      ['___ she speak English?', ['Does', 'Do', 'Is']], ['We ___ in Istanbul.', ['live', 'lives', 'living']],
      ['The baby ___ a lot.', ['cries', 'crys', 'cry']], ['Does he like pizza? Yes, he ___.', ['does', 'do', 'is']]
    ],
    order: [['I get up at seven', 'Yedide kalkarım.'], ["She doesn't eat meat", 'O et yemez.'], ['Do you like music', 'Müzik sever misin?']]
  },
  {
    id: 'routine', type: 'vocab', title: 'Günlük Rutin ve Saat', en: 'Daily Routine & Time', emoji: '⏰',
    words: [
      ['wake up', 'uyanmak', '⏰'], ['get up', 'kalkmak', '🛏️'], ['have breakfast', 'kahvaltı yapmak', '🍳'],
      ['brush my teeth', 'dişlerimi fırçalamak', '🪥'], ['take a shower', 'duş almak', '🚿'], ['get dressed', 'giyinmek', '👕'],
      ['go to school', 'okula gitmek', '🏫'], ['go to work', 'işe gitmek', '💼'], ['have lunch', 'öğle yemeği yemek', '🥪'],
      ['come home', 'eve gelmek', '🏠'], ['do homework', 'ödev yapmak', '📚'], ['watch TV', 'televizyon izlemek', '📺'],
      ['go to bed', 'yatmak', '😴'], ["o'clock", 'saat (tam)', '🕐'], ['half past', 'buçuk', '🕧'],
      ['quarter past', 'çeyrek geçe', '🕒'], ['morning', 'sabah', '🌅'], ['evening', 'akşam', '🌆']
    ]
  },
  {
    id: 'house', type: 'vocab', title: 'Ev ve Odalar', en: 'House & Rooms', emoji: '🏠',
    words: [
      ['house', 'ev', '🏠'], ['kitchen', 'mutfak', '🍳'], ['bedroom', 'yatak odası', '🛏️'], ['bathroom', 'banyo', '🛁'],
      ['living room', 'oturma odası', '🛋️'], ['garden', 'bahçe', '🌳'], ['door', 'kapı', '🚪'], ['window', 'pencere', '🪟'],
      ['table', 'masa', '🍽️'], ['chair', 'sandalye', '🪑'], ['bed', 'yatak', '🛌'], ['sofa', 'kanepe', '🛋️'],
      ['lamp', 'lamba', '💡'], ['fridge', 'buzdolabı', '🧊'], ['stairs', 'merdiven', '🪜'], ['wall', 'duvar', '🧱']
    ]
  },
  {
    id: 'prepositions', type: 'grammar', title: 'Yer Edatları', en: 'Prepositions of Place', emoji: '📦',
    explain: `
      <table class="g-table">
        <tr><th>Edat</th><th>Anlamı</th><th>Örnek</th></tr>
        <tr><td><b>in</b></td><td>içinde</td><td>in the box 📦</td></tr>
        <tr><td><b>on</b></td><td>üstünde</td><td>on the table</td></tr>
        <tr><td><b>under</b></td><td>altında</td><td>under the bed</td></tr>
        <tr><td><b>next to</b></td><td>yanında</td><td>next to the bank</td></tr>
        <tr><td><b>behind</b></td><td>arkasında</td><td>behind the door</td></tr>
        <tr><td><b>in front of</b></td><td>önünde</td><td>in front of the school</td></tr>
        <tr><td><b>between</b></td><td>arasında</td><td>between A and B</td></tr>
      </table>`,
    examples: [['The cat is under the table.', 'Kedi masanın altında.'], ['My phone is on the bed.', 'Telefonum yatağın üstünde.']],
    mc: [
      ['The cat is ___ the box. (içinde)', ['in', 'on', 'under']], ['The book is ___ the table. (üstünde)', ['on', 'in', 'under']],
      ['The ball is ___ the bed. (altında)', ['under', 'on', 'behind']], ['The bank is ___ the school. (yanında)', ['next to', 'between', 'in']],
      ['The car is ___ the house. (önünde)', ['in front of', 'behind', 'under']], ['The garden is ___ the house. (arkasında)', ['behind', 'in front of', 'on']],
      ['The shop is ___ the bank and the park. (arasında)', ['between', 'next to', 'behind']], ['My keys are ___ my bag.', ['in', 'on', 'at']],
      ['The picture is ___ the wall.', ['on', 'in', 'under']]
    ],
    order: [['The cat is under the table', 'Kedi masanın altında.'], ['My phone is on the bed', 'Telefonum yatağın üstünde.'], ['The school is next to the park', 'Okul parkın yanında.']]
  },
  {
    id: 'animals', type: 'vocab', title: 'Hayvanlar', en: 'Animals', emoji: '🐶',
    words: [
      ['cat', 'kedi', '🐱'], ['dog', 'köpek', '🐶'], ['bird', 'kuş', '🐦'], ['horse', 'at', '🐴'], ['cow', 'inek', '🐄'],
      ['sheep', 'koyun', '🐑'], ['chicken', 'tavuk', '🐔'], ['rabbit', 'tavşan', '🐰'], ['mouse', 'fare', '🐭'],
      ['lion', 'aslan', '🦁'], ['elephant', 'fil', '🐘'], ['monkey', 'maymun', '🐵'], ['bear', 'ayı', '🐻'],
      ['snake', 'yılan', '🐍'], ['duck', 'ördek', '🦆'], ['fish', 'balık', '🐠']
    ]
  },
  {
    id: 'can', type: 'grammar', title: "can / can't", en: 'Can for ability', emoji: '💪',
    explain: `
      <p><b>can</b> = yapabilmek, <b>can't (cannot)</b> = yapamamak. Herkes için aynıdır, <b>-s almaz</b>, ardından fiil yalın gelir.</p>
      <table class="g-table">
        <tr><th>Olumlu</th><th>Olumsuz</th><th>Soru</th></tr>
        <tr><td>I <b>can</b> swim.</td><td>She <b>can't</b> swim.</td><td><b>Can</b> you swim?</td></tr>
      </table>
      <p>Kısa cevaplar: Yes, I can. / No, I can't.</p>`,
    examples: [['I can ride a bike.', 'Bisiklet sürebilirim.'], ["Fish can't fly.", 'Balıklar uçamaz.'], ['Can you help me?', 'Bana yardım edebilir misin?']],
    mc: [
      ['I ___ swim. (yapabilirim)', ['can', 'cans', 'am can']], ['She ___ speak French. (yapamaz)', ["can't", "don't", "isn't"]],
      ['Fish ___ fly.', ["can't", 'can', 'cans']], ['Birds ___ fly.', ['can', "can't", 'cans']],
      ['___ you play the guitar?', ['Can', 'Do can', 'Are']], ['He can ___ very fast.', ['run', 'runs', 'running']],
      ['Can you help me? Yes, I ___.', ['can', 'do', 'am']], ['Can she drive? No, she ___.', ["can't", "doesn't", "isn't"]],
      ['___ I open the window?', ['Can', 'Am', 'Does']]
    ],
    order: [['I can ride a bike', 'Bisiklet sürebilirim.'], ['Can you speak English', 'İngilizce konuşabilir misin?'], ["He can't cook", 'O yemek yapamaz.']]
  },
  {
    id: 'jobs', type: 'vocab', title: 'Meslekler', en: 'Jobs', emoji: '👩‍⚕️',
    words: [
      ['teacher', 'öğretmen', '👩‍🏫'], ['doctor', 'doktor', '👨‍⚕️'], ['nurse', 'hemşire', '👩‍⚕️'], ['student', 'öğrenci', '🧑‍🎓'],
      ['police officer', 'polis memuru', '👮'], ['cook', 'aşçı', '👨‍🍳'], ['farmer', 'çiftçi', '👨‍🌾'], ['driver', 'şoför', '🚕'],
      ['engineer', 'mühendis', '👷'], ['singer', 'şarkıcı', '🎤'], ['waiter', 'garson', '🤵'], ['firefighter', 'itfaiyeci', '🧑‍🚒'],
      ['pilot', 'pilot', '👨‍✈️'], ['dentist', 'diş hekimi', '🦷'], ['artist', 'sanatçı', '🎨']
    ]
  },
  {
    id: 'questions', type: 'grammar', title: 'Soru Kelimeleri', en: 'Question Words', emoji: '❓',
    explain: `
      <table class="g-table">
        <tr><th>Kelime</th><th>Anlamı</th><th>Örnek</th></tr>
        <tr><td><b>What</b></td><td>ne</td><td>What is your name?</td></tr>
        <tr><td><b>Where</b></td><td>nerede / nereye</td><td>Where do you live?</td></tr>
        <tr><td><b>Who</b></td><td>kim</td><td>Who is he?</td></tr>
        <tr><td><b>When</b></td><td>ne zaman</td><td>When is your birthday?</td></tr>
        <tr><td><b>Why</b></td><td>neden</td><td>Why are you sad?</td></tr>
        <tr><td><b>How</b></td><td>nasıl</td><td>How are you?</td></tr>
        <tr><td><b>How old</b></td><td>kaç yaşında</td><td>How old are you?</td></tr>
        <tr><td><b>How many</b></td><td>kaç tane</td><td>How many cats have you got?</td></tr>
        <tr><td><b>What time</b></td><td>saat kaçta</td><td>What time is it?</td></tr>
      </table>`,
    examples: [['Where are you from?', 'Nerelisin?'], ['What time is it?', 'Saat kaç?'], ['How old is your sister?', 'Kız kardeşin kaç yaşında?']],
    mc: [
      ['___ is your name?', ['What', 'Where', 'Who']], ['___ do you live?', ['Where', 'What', 'Who']],
      ['___ is that man? He is my uncle.', ['Who', 'What', 'Where']], ['___ old are you?', ['How', 'What', 'Who']],
      ['___ is your birthday? In May.', ['When', 'Where', 'Who']], ['___ are you sad? Because I am ill.', ['Why', 'Who', 'Where']],
      ['___ many brothers have you got?', ['How', 'What', 'Who']], ['___ time is it?', ['What', 'How', 'When']],
      ["___ are you? I'm fine, thanks.", ['How', 'Who', 'What']], ["___ is my bag? It's on the chair.", ['Where', 'When', 'Who']]
    ],
    order: [['Where are you from', 'Nerelisin?'], ['What time is it', 'Saat kaç?'], ['How old is your sister', 'Kız kardeşin kaç yaşında?']]
  },
  {
    id: 'weather', type: 'vocab', title: 'Hava Durumu', en: 'Weather', emoji: '🌦️',
    words: [
      ['sunny', 'güneşli', '☀️'], ['rainy', 'yağmurlu', '🌧️'], ['cloudy', 'bulutlu', '☁️'], ['windy', 'rüzgarlı', '💨'],
      ['snowy', 'karlı', '🌨️'], ['hot', 'sıcak', '🥵'], ['cold', 'soğuk', '🥶'], ['warm', 'ılık', '🌤️'], ['rain', 'yağmur', '☔'],
      ['snow', 'kar', '☃️'], ['sun', 'güneş', '🌞'], ['storm', 'fırtına', '⛈️'], ['rainbow', 'gökkuşağı', '🌈'],
      ['weather', 'hava durumu', '🌦️']
    ]
  },
  {
    id: 'presentcont', type: 'grammar', title: 'Şimdiki Zaman (Present Continuous)', en: 'Present Continuous', emoji: '▶️',
    explain: `
      <p>Şu anda olan şeyleri anlatır. Türkçedeki <b>-yor</b> ekinin karşılığıdır.</p>
      <p><b>am / is / are + fiil-ing</b></p>
      <table class="g-table">
        <tr><th>Olumlu</th><th>Olumsuz</th><th>Soru</th></tr>
        <tr><td>I <b>am</b> read<b>ing</b>.</td><td>I'<b>m not</b> reading.</td><td><b>Am</b> I reading?</td></tr>
        <tr><td>She <b>is</b> read<b>ing</b>.</td><td>She <b>isn't</b> reading.</td><td><b>Is</b> she reading?</td></tr>
        <tr><td>They <b>are</b> read<b>ing</b>.</td><td>They <b>aren't</b> reading.</td><td><b>Are</b> they reading?</td></tr>
      </table>
      <p>Yazım: have → hav<b>ing</b>, swim → swi<b>mming</b>, run → ru<b>nning</b></p>
      <p>İpucu kelimeler: now, at the moment, Look!, Listen!</p>`,
    examples: [['I am learning English.', 'İngilizce öğreniyorum.'], ['Look! It is raining.', 'Bak! Yağmur yağıyor.'], ['What are you doing?', 'Ne yapıyorsun?']],
    mc: [
      ['I ___ reading a book now.', ['am', 'is', 'are']], ['She is ___ TV.', ['watching', 'watch', 'watches']],
      ['They ___ playing football.', ['are', 'is', 'am']], ['Look! It ___ raining.', ['is', 'are', 'am']],
      ['We are ___ dinner at the moment.', ['having', 'haveing', 'have']], ['He ___ sleeping. (olumsuz)', ["isn't", "aren't", "don't"]],
      ['___ you listening to me?', ['Are', 'Do', 'Is']], ['What ___ she doing?', ['is', 'are', 'does']],
      ['The children are ___ in the pool.', ['swimming', 'swiming', 'swim']], ["I'm ___ to music.", ['listening', 'listen', 'listens']]
    ],
    order: [['I am learning English', 'İngilizce öğreniyorum.'], ['What are you doing', 'Ne yapıyorsun?'], ['She is not working today', 'O bugün çalışmıyor.']]
  },
  {
    id: 'city', type: 'vocab', title: 'Şehir ve Ulaşım', en: 'Town & Transport', emoji: '🏙️',
    words: [
      ['school', 'okul', '🏫'], ['hospital', 'hastane', '🏥'], ['park', 'park', '🏞️'], ['shop', 'dükkan', '🏪'],
      ['supermarket', 'süpermarket', '🛒'], ['bank', 'banka', '🏦'], ['restaurant', 'restoran', '🍝'], ['cinema', 'sinema', '🎬'],
      ['library', 'kütüphane', '📚'], ['station', 'istasyon', '🚉'], ['airport', 'havalimanı', '✈️'], ['street', 'sokak', '🛣️'],
      ['bus', 'otobüs', '🚌'], ['car', 'araba', '🚗'], ['train', 'tren', '🚆'], ['bike', 'bisiklet', '🚲'],
      ['left', 'sol', '⬅️'], ['right', 'sağ', '➡️']
    ]
  },
  {
    id: 'imperatives', type: 'grammar', title: 'Emir Cümleleri', en: 'Imperatives', emoji: '📢',
    explain: `
      <p>Emir, rica ve talimat vermek için fiil <b>yalın haliyle</b> cümlenin başına gelir. Özne kullanılmaz.</p>
      <table class="g-table">
        <tr><th>Olumlu</th><th>Olumsuz</th></tr>
        <tr><td><b>Open</b> the door.</td><td><b>Don't open</b> the door.</td></tr>
        <tr><td><b>Be</b> quiet.</td><td><b>Don't be</b> late.</td></tr>
      </table>
      <p>Kibar olmak için <b>please</b> ekle: Please sit down.</p>
      <p>Öneri için <b>Let's</b> kullan: Let's go!</p>`,
    examples: [['Please close the window.', 'Lütfen pencereyi kapat.'], ["Don't be late.", 'Geç kalma.'], ['Turn right at the bank.', 'Bankadan sağa dön.']],
    mc: [
      ['___ the door, please. (aç)', ['Open', 'Opens', 'Opening']], ["___ touch it! It's hot!", ["Don't", 'Not', 'No']],
      ['___ down, please. (otur)', ['Sit', 'Sits', 'Sitting']], ['Please ___ quiet.', ['be', 'are', 'is']],
      ['___ run in the classroom!', ["Don't", "Doesn't", 'Not']], ['___ left at the bank. (dön)', ['Turn', 'Turns', 'Turning']],
      ['Listen ___ me!', ['to', 'at', 'for']], ["Let's ___ to the park.", ['go', 'goes', 'going']]
    ],
    order: [['Please close the window', 'Lütfen pencereyi kapat.'], ["Don't be late", 'Geç kalma.'], ['Turn right at the bank', 'Bankadan sağa dön.']]
  }
];

/* ---------- Normalize ---------- */
const UNITS = RAW_UNITS.map((u, i) => {
  const unit = { ...u, index: i, color: UNIT_COLORS[i % UNIT_COLORS.length] };
  if (u.type === 'vocab') {
    unit.words = u.words.map(([en, tr, emoji]) => ({ en, tr, emoji, key: `${u.id}:${en}`, unitId: u.id }));
  }
  return unit;
});

const UNIT_BY_ID = Object.fromEntries(UNITS.map(u => [u.id, u]));
const WORD_BY_KEY = {};
UNITS.forEach(u => (u.words || []).forEach(w => { WORD_BY_KEY[w.key] = w; }));
const ALL_WORDS = Object.values(WORD_BY_KEY);

/* ---------- Yoldaş Hayvanlar (Mascots) ---------- */
const MASCOTS = [
  { id: 'cat', name: 'Pamuk', animal: 'Kedi', icon: '🐱', motto: 'Çevik, meraklı ve hızla öğrenir!', perk: 'Hızlı seri avantajı' },
  { id: 'dog', name: 'Dost', animal: 'Köpek', icon: '🐶', motto: 'Sadık, enerjik ve asla pes etmez!', perk: 'Günlük tekrar gücü' },
  { id: 'owl', name: 'Bilge', animal: 'Baykuş', icon: '🦉', motto: 'Kusursuz hafıza ve gramer ustası!', perk: 'Doğruluk katsayısı' },
  { id: 'panda', name: 'Bambu', animal: 'Panda', icon: '🐼', motto: 'Sakin, dengeli ve istikrarlı ritim!', perk: 'Stressiz öğrenme' },
  { id: 'squirrel', name: 'Fındık', animal: 'Sincap', icon: '🐿️', motto: 'Hızlı kelime toplayıcı, pratik zeka!', perk: 'Kelime sandığı' }
];
const MASCOT_BY_ID = Object.fromEntries(MASCOTS.map(m => [m.id, m]));

/* ---------- Özel Renk Paletleri (Themes) ---------- */
const PALETTES = [
  {
    id: 'nordic',
    name: 'Nordic Sage',
    desc: 'Sakinleştirici adaçayı yeşili ve taş tonları',
    colors: {
      bg: '#F4F7F5',
      cardBg: '#FFFFFF',
      text: '#1E2D24',
      muted: '#637A6D',
      line: '#DCE5E0',
      accent: '#2F7C5D',
      accentD: '#1F5A42',
      primary: '#3B8B67',
      primaryD: '#28684C'
    }
  },
  {
    id: 'cyber',
    name: 'Cyber Indigo',
    desc: 'Odaklanmayı artıran koyu neon & lila',
    colors: {
      bg: '#0F172A',
      cardBg: '#1E293B',
      text: '#F8FAFC',
      muted: '#94A3B8',
      line: '#334155',
      accent: '#818CF8',
      accentD: '#6366F1',
      primary: '#6366F1',
      primaryD: '#4F46E5'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Warmth',
    desc: 'Sıcak mercan, bal sarısı ve şeftali enerjisi',
    colors: {
      bg: '#FFF8F4',
      cardBg: '#FFFFFF',
      text: '#2C1810',
      muted: '#8C6858',
      line: '#F2DFD5',
      accent: '#F97316',
      accentD: '#EA580C',
      primary: '#F97316',
      primaryD: '#C2410C'
    }
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    desc: 'Berrak turkuaz, ferah okyanus ve nane ferahlığı',
    colors: {
      bg: '#F0F9FF',
      cardBg: '#FFFFFF',
      text: '#0C2738',
      muted: '#527993',
      line: '#D2E8F7',
      accent: '#0284C7',
      accentD: '#0369A1',
      primary: '#0EA5E9',
      primaryD: '#0284C7'
    }
  }
];
const PALETTE_BY_ID = Object.fromEntries(PALETTES.map(p => [p.id, p]));

/* ---------- Seviye Dünyaları (Candy Crush Mantığı) ---------- */
const LEVEL_WORLDS = {
  A1: {
    id: 'A1',
    name: 'A1: Başlangıç Dünyası',
    badge: '🌱',
    desc: 'Temel iletişim, tanışma ve günlük konuşma kalıpları',
    unlocked: true,
    totalUnits: UNITS.length
  },
  A2: {
    id: 'A2',
    name: 'A2: Macera Dünyası',
    badge: '🚀',
    desc: 'Geçmiş zaman, seyahat, planlar ve akıcı diyaloglar',
    unlocked: false,
    requires: 'A1_BOSS_PASSED'
  }
};
