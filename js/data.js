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
      ['zero','sıfır','0️⃣'], ['one','bir','1️⃣'], ['two','iki','2️⃣'], ['three','üç','3️⃣'],
      ['four','dört','4️⃣'], ['five','beş','5️⃣'], ['six','altı','6️⃣'], ['seven','yedi','7️⃣'],
      ['eight','sekiz','8️⃣'], ['nine','dokuz','9️⃣'], ['ten','on','🔟'], ['eleven','on bir','11'],
      ['twelve','on iki','12'], ['thirteen','on üç','13'], ['fourteen','on dört','14'], ['fifteen','on beş','15'],
      ['sixteen','on altı','16'], ['seventeen','on yedi','17'], ['eighteen','on sekiz','18'], ['nineteen','on dokuz','19'],
      ['twenty','yirmi','20'], ['twenty-one','yirmi bir','21'], ['twenty-two','yirmi iki','22'], ['twenty-three','yirmi üç','23'],
      ['twenty-four','yirmi dört','24'], ['twenty-five','yirmi beş','25'], ['twenty-six','yirmi altı','26'], ['twenty-seven','yirmi yedi','27'],
      ['twenty-eight','yirmi sekiz','28'], ['twenty-nine','yirmi dokuz','29'], ['thirty','otuz','30'], ['thirty-one','otuz bir','31'],
      ['thirty-two','otuz iki','32'], ['thirty-three','otuz üç','33'], ['thirty-four','otuz dört','34'], ['thirty-five','otuz beş','35'],
      ['thirty-six','otuz altı','36'], ['thirty-seven','otuz yedi','37'], ['thirty-eight','otuz sekiz','38'], ['thirty-nine','otuz dokuz','39'],
      ['forty','kırk','40'], ['forty-one','kırk bir','41'], ['forty-two','kırk iki','42'], ['forty-three','kırk üç','43'],
      ['forty-four','kırk dört','44'], ['forty-five','kırk beş','45'], ['forty-six','kırk altı','46'], ['forty-seven','kırk yedi','47'],
      ['forty-eight','kırk sekiz','48'], ['forty-nine','kırk dokuz','49'], ['fifty','elli','50']
    ]
  },
  {
    id: 'numbers_50_100', type: 'vocab', title: 'Sayılar: 50 - 100', en: 'Numbers: 50 to 100', emoji: '💯',
    words: [
      ['fifty','elli','50'], ['fifty-one','elli bir','51'], ['fifty-two','elli iki','52'], ['fifty-three','elli üç','53'],
      ['fifty-four','elli dört','54'], ['fifty-five','elli beş','55'], ['fifty-six','elli altı','56'], ['fifty-seven','elli yedi','57'],
      ['fifty-eight','elli sekiz','58'], ['fifty-nine','elli dokuz','59'], ['sixty','altmış','60'], ['sixty-one','altmış bir','61'],
      ['sixty-two','altmış iki','62'], ['sixty-three','altmış üç','63'], ['sixty-four','altmış dört','64'], ['sixty-five','altmış beş','65'],
      ['sixty-six','altmış altı','66'], ['sixty-seven','altmış yedi','67'], ['sixty-eight','altmış sekiz','68'], ['sixty-nine','altmış dokuz','69'],
      ['seventy','yetmiş','70'], ['seventy-one','yetmiş bir','71'], ['seventy-two','yetmiş iki','72'], ['seventy-three','yetmiş üç','73'],
      ['seventy-four','yetmiş dört','74'], ['seventy-five','yetmiş beş','75'], ['seventy-six','yetmiş altı','76'], ['seventy-seven','yetmiş yedi','77'],
      ['seventy-eight','yetmiş sekiz','78'], ['seventy-nine','yetmiş dokuz','79'], ['eighty','seksen','80'], ['eighty-one','seksen bir','81'],
      ['eighty-two','seksen iki','82'], ['eighty-three','seksen üç','83'], ['eighty-four','seksen dört','84'], ['eighty-five','seksen beş','85'],
      ['eighty-six','seksen altı','86'], ['eighty-seven','seksen yedi','87'], ['eighty-eight','seksen sekiz','88'], ['eighty-nine','seksen dokuz','89'],
      ['ninety','doksan','90'], ['ninety-one','doksan bir','91'], ['ninety-two','doksan iki','92'], ['ninety-three','doksan üç','93'],
      ['ninety-four','doksan dört','94'], ['ninety-five','doksan beş','95'], ['ninety-six','doksan altı','96'], ['ninety-seven','doksan yedi','97'],
      ['ninety-eight','doksan sekiz','98'], ['ninety-nine','doksan dokuz','99'], ['one hundred','yüz','💯']
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
  },

  /* ============================================================
     DÜNYA 2: A2 İNGİLİZCE MÜFREDATI (CEFR STANDARDI)
     ============================================================ */
  {
    id: 'numbers_large', level: 'A2', type: 'vocab', title: 'Büyük Sayılar ve Sıra Sayıları', en: 'Numbers, Ordinals & Dates', emoji: '🔢',
    words: [
      ['one hundred', 'yüz (100)', '💯'], ['two hundred', 'iki yüz (200)', '2️⃣0️⃣0️⃣'], ['five hundred', 'beş yüz (500)', '5️⃣0️⃣0️⃣'],
      ['one thousand', 'bin (1.000)', '1️⃣0️⃣0️⃣0️⃣'], ['two thousand', 'iki bin (2.000)', '2️⃣0️⃣0️⃣0️⃣'], ['ten thousand', 'on bin (10.000)', '🔟0️⃣0️⃣0️⃣'],
      ['fifty thousand', 'elli bin (50.000)', '5️⃣0️⃣k'], ['one hundred thousand', 'yüz bin (100.000)', '💯k'], ['one million', 'bir milyon (1.000.000)', '💎'],
      ['one billion', 'bir milyar', '🪐'],
      ['first', 'birinci / ilk (1st)', '🥇'], ['second', 'ikinci (2nd)', '🥈'], ['third', 'üçüncü (3rd)', '🥉'],
      ['fourth', 'dördüncü (4th)', '4️⃣th'], ['fifth', 'beşinci (5th)', '5️⃣th'], ['sixth', 'altıncı (6th)', '6️⃣th'],
      ['seventh', 'yedinci (7th)', '7️⃣th'], ['eighth', 'sekizinci (8th)', '8️⃣th'], ['ninth', 'dokuzuncu (9th)', '9️⃣th'],
      ['tenth', 'onuncu (10th)', '🔟th'], ['eleventh', 'on birinci (11th)', '1️⃣1️⃣th'], ['twelfth', 'on ikinci (12th)', '1️⃣2️⃣th'],
      ['thirteenth', 'on üçüncü (13th)', '1️⃣3️⃣th'], ['fourteenth', 'on dördüncü (14th)', '1️⃣4️⃣th'], ['fifteenth', 'on beşinci (15th)', '1️⃣5️⃣th'],
      ['twentieth', 'yirminci (20th)', '2️⃣0️⃣th'], ['twenty-first', 'yirmi birinci (21st)', '2️⃣1️⃣st'], ['twenty-second', 'yirmi ikinci (22nd)', '2️⃣2️⃣nd'],
      ['thirtieth', 'otuzuncu (30th)', '3️⃣0️⃣th'], ['thirty-first', 'otuz birinci (31st)', '3️⃣1️⃣st'],
      ['half', 'yarım / buçuk', '½'], ['quarter', 'çeyrek', '¼'], ['percent', 'yüzde (%)', '％'], ['double', 'çift / iki katı', '✖️2'],
      ['century', 'yüzyıl / asır', '🏛️'], ['date', 'tarih', '📅']
    ]
  },
  {
    id: 'dates_years_rules', level: 'A2', type: 'grammar', title: 'Tarih, Yıl ve Sayı Okuma Kuralları', en: 'Dates, Years & Numbers Rules', emoji: '📆',
    explain: `
      <p>İngilizcede tarih, yıl ve büyük sayıları okurken Türkçe mantığından farklı kesin kurallar vardır:</p>
      <table class="g-table">
        <tr><th>Kullanım</th><th>Kural</th><th>Örnek</th></tr>
        <tr><td>Günler & Tarihler</td><td><b>on + the + Sıra Sayısı</b></td><td><b>on the 15th of May</b> / on May 15th</td></tr>
        <tr><td>Yıllar (2000 öncesi)</td><td>İkiye bölünerek okunur</td><td>1995 ➔ <b>nineteen ninety-five</b></td></tr>
        <tr><td>Yıllar (2000 sonrası)</td><td>two thousand and ...</td><td>2024 ➔ <b>twenty twenty-four</b></td></tr>
        <tr><td>Büyük Sayılar</td><td>hundred, thousand -s ALMAZ!</td><td>three <b>thousand</b> cars (thousands DEĞİL!)</td></tr>
      </table>
      <p><b>DİKKAT (Türk Tuzağı):</b> Gün belirtirken daima <b>"on"</b> kullanılır: <i>"on Monday", "on the 1st of January"</i>.</p>`,
    examples: [
      ['My birthday is on the 4th of July.', 'Doğum günüm 4 Temmuz\'da.'],
      ['I was born in nineteen ninety-eight.', '1998\'de doğdum.'],
      ['There are two hundred students.', 'İki yüz öğrenci var.']
    ],
    mc: [
      ['My birthday is ___ the 5th of May.', ['on', 'in', 'at']],
      ['How do you read 1985?', ['nineteen eighty-five', 'one thousand nine eighty-five', 'nineteen eighty']],
      ['There are three ___ books in the library.', ['thousand', 'thousands', 'thousand of']],
      ['We celebrate Republic Day ___ October 29th.', ['on', 'in', 'at']],
      ['He won the ___ prize in the competition.', ['first', 'one', 'once']],
      ['Tomorrow is the ___ of September.', ['twenty-first', 'twenty-one', 'twenties']]
    ],
    order: [
      ['My birthday is on May fifth', 'Doğum günüm 5 Mayıs\'ta.'],
      ['There are five hundred students here', 'Burada beş yüz öğrenci var.'],
      ['I was born in nineteen ninety', '1990 yılında doğdum.']
    ]
  },
  {
    id: 'past_tobe', level: 'A2', type: 'grammar', title: 'was / were (Geçmiş Zaman to be)', en: 'Past Simple of to be', emoji: '🕰️',
    explain: `
      <p><b>was / were</b>, "am / is / are" fiilinin geçmiş zaman halidir (<b>-idi</b>).</p>
      <table class="g-table">
        <tr><th>Özne</th><th>Olumlu</th><th>Olumsuz</th><th>Soru</th></tr>
        <tr><td>I / He / She / It</td><td><b>was</b></td><td><b>wasn't</b> (was not)</td><td><b>Was</b> he?</td></tr>
        <tr><td>You / We / They</td><td><b>were</b></td><td><b>weren't</b> (were not)</td><td><b>Were</b> you?</td></tr>
      </table>
      <p>Geçmiş zaman zaman zarfları: <b>yesterday</b> (dün), <b>last night</b> (dün gece), <b>two days ago</b> (iki gün önce).</p>`,
    examples: [['I was at home yesterday.', 'Dün evdeydim.'], ['They were very happy.', 'Onlar çok mutluydu.'], ['Was she tired last night?', 'Dün gece yorgun muydu?'], ["We weren't at school.", 'Biz okulda değildik.']],
    mc: [
      ['I ___ at home yesterday.', ['was', 'were', 'am']], ['They ___ very happy last week.', ['were', 'was', 'are']],
      ['She ___ not at work on Monday.', ['was', 'were', 'is']], ['___ you tired last night?', ['Were', 'Was', 'Are']],
      ['It ___ a sunny day yesterday.', ['was', 'were', 'is']], ['We ___ in London two years ago.', ['were', 'was', 'are']],
      ['Where ___ you yesterday morning?', ['were', 'was', 'are']], ['He ___ hungry, so he ate dinner.', ['was', 'were', 'is']]
    ],
    order: [['I was at home yesterday', 'Dün evdeydim.'], ['They were very tired last night', 'Dün gece çok yorgundular.'], ['Where were you yesterday', 'Dün neredeydin?']]
  },
  {
    id: 'past_regular', level: 'A2', type: 'grammar', title: 'Geçmiş Zaman: Düzenli Fiiller', en: 'Past Simple - Regular Verbs', emoji: '📅',
    explain: `
      <p>Düzenli fiillerin geçmiş zaman halinde fiilin sonuna <b>-ed</b> eklenir.</p>
      <table class="g-table">
        <tr><th>Kural</th><th>Örnek</th></tr>
        <tr><td>Genel: + ed</td><td>play → play<b>ed</b>, watch → watch<b>ed</b>, cook → cook<b>ed</b></td></tr>
        <tr><td>-e ile biten: + d</td><td>live → live<b>d</b>, like → like<b>d</b></td></tr>
        <tr><td>ünsüz + y: -ied</td><td>study → stud<b>ied</b>, try → tr<b>ied</b></td></tr>
        <tr><td>Kısa ünlü + ünsüz: çift harf</td><td>stop → stop<b>ped</b>, plan → plan<b>ned</b></td></tr>
      </table>
      <p><b>DİKKAT (Türk Tuzağı):</b> Olumsuz ve sorularda <b>did / didn't</b> geldiğinde fiil tekrar <b>yalın haline</b> döner! <i>"I didn't play"</i> (I didn't played DEĞİL!).</p>`,
    examples: [['I played tennis yesterday.', 'Dün tenis oynadım.'], ['She watched a movie last night.', 'Dün gece bir film izledi.'], ["They didn't visit us.", 'Bizi ziyaret etmediler.'], ['Did you study for the exam?', 'Sınava çalıştın mı?']],
    mc: [
      ['I ___ football yesterday. (oynadım)', ['played', 'play', 'playing']], ['She ___ a great movie last night.', ['watched', 'watch', 'watches']],
      ["We didn't ___ tennis on Sunday.", ['play', 'played', 'playing']], ['Did you ___ your homework?', ['finish', 'finished', 'finishes']],
      ['He ___ hard for the test.', ['studied', 'study', 'studyed']], ['They ___ to Istanbul two years ago.', ['moved', 'move', 'moving']],
      ['She ___ her room yesterday.', ['cleaned', 'clean', 'cleaning']], ["I didn't ___ the door.", ['lock', 'locked', 'locking']]
    ],
    order: [['I played football yesterday', 'Dün futbol oynadım.'], ['She watched a movie last night', 'Dün gece bir film izledi.'], ['Did you finish your homework', 'Ödevini bitirdin mi?']]
  },
  {
    id: 'past_irregular', level: 'A2', type: 'grammar', title: 'Geçmiş Zaman: Düzensiz Fiiller', en: 'Past Simple - Irregular Verbs', emoji: '⚡',
    explain: `
      <p>İngilizcede en sık kullanılan fiiller kural dinlemez; <b>-ed almaz, tamamen şekil değiştirir</b>.</p>
      <table class="g-table">
        <tr><th>Fiil (V1)</th><th>Geçmiş (V2)</th><th>Anlamı</th></tr>
        <tr><td>go</td><td><b>went</b></td><td>gitti</td></tr>
        <tr><td>see</td><td><b>saw</b></td><td>gördü</td></tr>
        <tr><td>have</td><td><b>had</b></td><td>sahip oldu / yaptı</td></tr>
        <tr><td>eat</td><td><b>ate</b></td><td>yedi</td></tr>
        <tr><td>buy</td><td><b>bought</b></td><td>satın aldı</td></tr>
        <tr><td>come</td><td><b>came</b></td><td>geldi</td></tr>
        <tr><td>make / do</td><td><b>made / did</b></td><td>yaptı</td></tr>
        <tr><td>take / write</td><td><b>took / wrote</b></td><td>aldı / yazdı</td></tr>
      </table>
      <p><b>Tüyo:</b> Olumsuzda ve soruda fiil 1. haline döner: <i>"I went"</i> ➔ <i>"I didn't go"</i> ➔ <i>"Did you go?"</i></p>`,
    examples: [['I went to the cinema yesterday.', 'Dün sinemaya gittim.'], ['She bought a new car.', 'O yeni bir araba satın aldı.'], ['We ate delicious pizza.', 'Lezzetli pizza yedik.'], ["He didn't come to the party.", 'Partiye gelmedi.']],
    mc: [
      ['Yesterday I ___ to the beach.', ['went', 'go', 'goed']], ['She ___ a new dress on Friday.', ['bought', 'buyed', 'buy']],
      ['We ___ dinner at 8 PM.', ['ate', 'eated', 'eat']], ["He didn't ___ a letter.", ['write', 'wrote', 'written']],
      ['Did you ___ my keys?', ['see', 'saw', 'seen']], ['They ___ a lot of photos on holiday.', ['took', 'taked', 'take']],
      ['I ___ my best friend yesterday.', ['met', 'meeted', 'meet']], ['She ___ me a great present.', ['gave', 'gived', 'give']]
    ],
    order: [['I went to school yesterday', 'Dün okula gittim.'], ['She bought a new car', 'O yeni bir araba satın aldı.'], ['Did you see my keys', 'Anahtarlarımı gördün mü?']]
  },
  {
    id: 'past_continuous', level: 'A2', type: 'grammar', title: 'Geçmişte Devam Eden Zaman (was/were + -ing)', en: 'Past Continuous', emoji: '⏳',
    explain: `
      <p>Geçmişte belli bir anda <b>yapmakta olduğumuz</b> süregelen işleri anlatır (<b>-yordu</b>).</p>
      <p>Formül: <b>was / were + Fiil-ing</b></p>
      <table class="g-table">
        <tr><th>Kural</th><th>Örnek</th></tr>
        <tr><td>I / He / She / It</td><td>I <b>was reading</b> a book at 8 PM.</td></tr>
        <tr><td>You / We / They</td><td>They <b>were playing</b> tennis.</td></tr>
        <tr><td>Olumsuz</td><td>He <b>wasn't sleeping</b>.</td></tr>
        <tr><td>when (olduğunda)</td><td>I was studying <b>when you called</b>.</td></tr>
      </table>`,
    examples: [['I was sleeping at 11 PM.', 'Saat 11\'de uyuyordum.'], ['They were watching TV when I arrived.', 'Ben vardığımda TV izliyorlardı.'], ["She wasn't listening to me.", 'Beni dinlemiyordu.']],
    mc: [
      ['At 9 PM yesterday, I ___ a book.', ['was reading', 'were reading', 'readed']], ['What ___ you doing when it rained?', ['were', 'was', 'are']],
      ['She ___ sleeping when the phone rang.', ['was', 'were', 'is']], ['They ___ playing football at 4 PM.', ['were', 'was', 'are']],
      ['We ___ having dinner when he arrived.', ['were', 'was', 'did']], ["He ___ not driving fast.", ['was', 'were', 'is']]
    ],
    order: [['I was sleeping when you called', 'Sen aradığında uyuyordum.'], ['They were watching television at eight', 'Saat sekizde televizyon izliyorlardı.'], ['She was cooking in the kitchen', 'Mutfakta yemek pişiriyordu.']]
  },
  {
    id: 'quantifiers_a2', level: 'A2', type: 'grammar', title: 'Miktar Belirteçleri (some, any, much, many)', en: 'Quantifiers: much, many, some, any', emoji: '🍎',
    explain: `
      <p>İsimlerin miktarını belirtirken <b>sayılabilen (countable)</b> ve <b>sayılamayan (uncountable)</b> ayrımı yapılır:</p>
      <table class="g-table">
        <tr><th>Belirteç</th><th>Hangi İsimlerle?</th><th>Cümle Türü</th><th>Örnek</th></tr>
        <tr><td><b>some</b> (biraz/birkaç)</td><td>Her ikisiyle</td><td>Olumlu</td><td>I have <b>some</b> apples / milk.</td></tr>
        <tr><td><b>any</b> (hiç)</td><td>Her ikisiyle</td><td>Olumsuz & Soru</td><td>Do you have <b>any</b> water?</td></tr>
        <tr><td><b>many</b> (çok)</td><td>Sayılabilen çoğul</td><td>Olumsuz & Soru</td><td><b>many</b> books, <b>many</b> friends</td></tr>
        <tr><td><b>much</b> (çok)</td><td>Sayılamayan tekil</td><td>Olumsuz & Soru</td><td><b>much</b> time, <b>much</b> money</td></tr>
        <tr><td><b>a lot of</b> (çok)</td><td>Her ikisiyle</td><td>Olumlu</td><td><b>a lot of</b> people / sugar</td></tr>
        <tr><td><b>a few / a little</b></td><td>few: sayılan / little: sayılamayan</td><td>Olumlu (az)</td><td>a <b>few</b> books, a <b>little</b> water</td></tr>
      </table>
      <p><b>DİKKAT (Türk Tuzağı):</b> "Money" (para) ve "time" (zaman) İngilizcede <b>sayılamaz</b> kabul edilir! <i>"I don't have much money"</i> denir.</p>`,
    examples: [
      ['Do you have any questions?', 'Hiç sorunuz var mı?'],
      ['How much milk do you need?', 'Ne kadar süte ihtiyacın var?'],
      ['How many students are there?', 'Kaç tane öğrenci var?'],
      ['I have a few close friends.', 'Birkaç yakın arkadaşım var.']
    ],
    mc: [
      ['How ___ books did you buy?', ['many', 'much', 'any']],
      ['How ___ money do you have?', ['much', 'many', 'few']],
      ['We don\'t have ___ milk in the fridge.', ['any', 'some', 'many']],
      ['I have ___ friends in London.', ['a few', 'a little', 'much']],
      ['There is only a ___ sugar left.', ['little', 'few', 'many']],
      ['Would you like ___ coffee? (teklif)', ['some', 'any', 'many']]
    ],
    order: [
      ['How many books do you have', 'Kaç tane kitabın var?'],
      ['I do not have much time', 'Çok fazla vaktim yok.'],
      ['Do you have any questions', 'Hiç sorunuz var mı?']
    ]
  },
  {
    id: 'travel_airport', level: 'A2', type: 'vocab', title: 'Havalimanı ve Seyahat', en: 'Airport & Travel', emoji: '✈️',
    words: [
      ['passport', 'pasaport', '🛂'], ['boarding pass', 'biniş kartı', '🎫'], ['flight', 'uçuş', '🛫'],
      ['airport', 'havalimanı', '✈️'], ['luggage', 'bagaj', '🧳'], ['suitcase', 'bavul', '💼'],
      ['departure', 'kalkış', '🛫'], ['arrival', 'varış', '🛬'], ['ticket', 'bilet', '🎟️'],
      ['gate', 'kapı (uçuş kapısı)', '🚪'], ['passenger', 'yolcu', '🧑‍✈️'], ['delay', 'gecikme / rötar', '⏱️'],
      ['security', 'güvenlik kontrolü', '👮'], ['pilot', 'pilot', '👨‍✈️'], ['land', 'iniş yapmak', '🛬'],
      ['take off', 'havalanmak / kalkmak', '🛫'], ['journey', 'yolculuk / seyahat', '🗺️'], ['customs', 'gümrük', '🛃']
    ]
  },
  {
    id: 'hotel_booking', level: 'A2', type: 'vocab', title: 'Otel ve Konaklama', en: 'Hotel & Booking', emoji: '🏨',
    words: [
      ['hotel', 'otel', '🏨'], ['reception', 'resepsiyon', '🛎️'], ['reservation', 'rezervasyon', '📋'],
      ['single room', 'tek kişilik oda', '🛏️'], ['double room', 'çift kişilik oda', '🛌'], ['key card', 'oda kartı / anahtarı', '💳'],
      ['check-in', 'giriş yapma', '📥'], ['check-out', 'çıkış yapma', '📤'], ['elevator', 'asansör', '🛗'],
      ['guest', 'konuk / misafir', '👤'], ['sea view', 'deniz manzarası', '🌊'], ['breakfast included', 'kahvaltı dahil', '🍳'],
      ['swimming pool', 'yüzme havuzu', '🏊'], ['stay', 'konaklamak / kalmak', '🏠'], ['available', 'müsait / boşta', '✅'],
      ['air conditioning', 'klima', '❄️']
    ]
  },
  {
    id: 'future_goingto', level: 'A2', type: 'grammar', title: 'Gelecek Zaman: be going to', en: 'Future with be going to', emoji: '🎯',
    explain: `
      <p>Önceden <b>karar verilmiş planlar, niyetler</b> ve <b>belirtisi görünen olaylar</b> için kullanılır (<b>-ecek / -acak</b>).</p>
      <p>Formül: <b>am / is / are + going to + Fiil (V1)</b></p>
      <table class="g-table">
        <tr><th>Özne</th><th>Cümle</th></tr>
        <tr><td>I</td><td>I <b>am going to travel</b> to Spain.</td></tr>
        <tr><td>He / She / It</td><td>He <b>is going to buy</b> a laptop.</td></tr>
        <tr><td>You / We / They</td><td>They <b>are going to meet</b> us.</td></tr>
        <tr><td>Kanıtlı Durum</td><td>Look at the clouds! It <b>is going to rain</b>.</td></tr>
      </table>`,
    examples: [['I am going to visit my grandmother.', 'Büyükannemi ziyaret edeceğim.'], ['She is going to buy a new phone.', 'Yeni bir telefon satın alacak.'], ['Are you going to study tonight?', 'Bu gece ders çalışacak mısın?']],
    mc: [
      ['I am ___ to visit my friend tomorrow.', ['going', 'go', 'went']], ['She ___ going to buy a new car.', ['is', 'are', 'am']],
      ['Look at the dark clouds! It is going to ___ .', ['rain', 'rained', 'raining']], ['We are going ___ cook dinner.', ['to', 'for', 'at']],
      ['___ you going to watch the match?', ['Are', 'Is', 'Do']], ['They ___ not going to travel this summer.', ['are', 'is', 'do']]
    ],
    order: [['I am going to visit my friend', 'Arkadaşımı ziyaret edeceğim.'], ['She is going to buy a car', 'O bir araba satın alacak.'], ['Are you going to study tonight', 'Bu gece ders çalışacak mısın?']]
  },
  {
    id: 'future_will', level: 'A2', type: 'grammar', title: 'Gelecek Zaman: will / won\'t', en: 'Future with will', emoji: '🔮',
    explain: `
      <p><b>will</b>, konuşma anında verilen <b>ani kararlar</b>, <b>tahminler</b> ve <b>sözler</b> için kullanılır.</p>
      <table class="g-table">
        <tr><th>Cümle Türü</th><th>Yapı</th><th>Örnek</th></tr>
        <tr><td>Olumlu</td><td>Özne + <b>will</b> + V1</td><td>I <b>will help</b> you.</td></tr>
        <tr><td>Olumsuz</td><td>Özne + <b>won't</b> + V1</td><td>I <b>won't tell</b> anyone.</td></tr>
        <tr><td>Soru</td><td><b>Will</b> + Özne + V1?</td><td><b>Will</b> it rain?</td></tr>
      </table>
      <p>Genellikle <i>"I think"</i> (bence) veya <i>"I promise"</i> (söz veririm) kalıplarıyla kullanılır.</p>`,
    examples: [['I will open the window.', 'Pencereyi açayım (anlık karar).'], ['I think it will be sunny tomorrow.', 'Bence yarın hava güneşli olacak.'], ["Don't worry, I won't forget.", 'Merak etme, unutmayacağım.']],
    mc: [
      ['The phone is ringing. I ___ answer it.', ['will', 'am', 'going']], ['I think you ___ pass the exam.', ['will', 'are', 'did']],
      ["Don't worry, I ___ be late.", ["won't", "not will", "don't"]], ['___ you help me with this box?', ['Will', 'Do', 'Are']],
      ['Tomorrow ___ be a great day.', ['will', 'is', 'did']], ['I promise I ___ call you tonight.', ['will', 'would', 'am']]
    ],
    order: [['I will help you with bags', 'Çantalar için sana yardım edeceğim.'], ['I think it will rain tomorrow', 'Bence yarın yağmur yağacak.'], ['I will not forget your birthday', 'Doğum gününü unutmayacağım.']]
  },
  {
    id: 'restaurant_dining', level: 'A2', type: 'vocab', title: 'Restoran ve Yemek Siparişi', en: 'Restaurant & Ordering', emoji: '🍽️',
    words: [
      ['waiter', 'garson (erkek)', '🤵'], ['waitress', 'garson (kadın)', '👩‍🍳'], ['menu', 'menü', '📜'],
      ['order', 'sipariş vermek', '📝'], ['bill', 'hesap / adisyon', '🧾'], ['appetizer', 'başlangıç / meze', '🥗'],
      ['main course', 'ana yemek', '🥩'], ['dessert', 'tatlı', '🍰'], ['tip', 'bahşiş', '💵'],
      ['delicious', 'lezzetli / nefis', '😋'], ['sparkling water', 'maden suyu', '🫧'], ['napkin', 'peçete', '🧻'],
      ['fork and knife', 'çatal ve bıçak', '🍴'], ['table for two', 'iki kişilik masa', '🪑'], ['recommend', 'tavsiye etmek / önermek', '👍'],
      ['ready to order', 'siparişe hazır', '🙋']
    ]
  },
  {
    id: 'comparatives', level: 'A2', type: 'grammar', title: 'Kıyaslama: Sıfatlarda Karşılaştırma', en: 'Comparatives', emoji: '⚖️',
    explain: `
      <p>İki şeyi birbiriyle kıyaslarken (<b>daha ...</b>) sıfatın uzunluğuna göre kural değişir:</p>
      <table class="g-table">
        <tr><th>Sıfat Türü</th><th>Kural</th><th>Örnek</th></tr>
        <tr><td>Kısa sıfatlar</td><td>+ <b>er than</b></td><td>tall → tall<b>er than</b>, fast → fast<b>er than</b></td></tr>
        <tr><td>-y ile bitenler</td><td>y düşer + <b>ier than</b></td><td>easy → eas<b>ier than</b>, happy → happ<b>ier than</b></td></tr>
        <tr><td>Uzun sıfatlar</td><td><b>more</b> ... <b>than</b></td><td>more expensive than, more beautiful than</td></tr>
        <tr><td>Düzensizler</td><td>özel şekil</td><td>good → <b>better than</b>, bad → <b>worse than</b></td></tr>
      </table>`,
    examples: [['An elephant is bigger than a lion.', 'Fil aslandan daha büyüktür.'], ['This car is more expensive than that one.', 'Bu araba şu arabadan daha pahalıdır.'], ['English is easier than German.', 'İngilizce Almancadan daha kolaydır.']],
    mc: [
      ['An airplane is ___ than a train.', ['faster', 'fast', 'more fast']], ['Gold is ___ than silver.', ['more expensive', 'expensiver', 'most expensive']],
      ['Today is ___ than yesterday.', ['colder', 'cold', 'more cold']], ['My brother is ___ than me.', ['taller', 'more tall', 'tall']],
      ['This book is ___ than that movie.', ['better', 'gooder', 'more good']], ['Driving in snow is ___ than in rain.', ['worse', 'badder', 'more bad']]
    ],
    order: [['An elephant is bigger than a lion', 'Fil aslandan daha büyüktür.'], ['This book is better than that one', 'Bu kitap şu kitaptan daha iyidir.'], ['London is bigger than Oxford', 'Londra Oxford\'dan daha büyüktür.']]
  },
  {
    id: 'superlatives', level: 'A2', type: 'grammar', title: 'Üstünlük Sıfatları (the -est / the most)', en: 'Superlatives', emoji: '🥇',
    explain: `
      <p>Bir grup içindeki <b>"en ..."</b> olanı söylerken kullanılır.</p>
      <table class="g-table">
        <tr><th>Sıfat Türü</th><th>Kural</th><th>Örnek</th></tr>
        <tr><td>Kısa sıfatlar</td><td><b>the</b> + sıfat<b>est</b></td><td>the fast<b>est</b>, the tall<b>est</b>, the bigg<b>est</b></td></tr>
        <tr><td>Uzun sıfatlar</td><td><b>the most</b> + sıfat</td><td><b>the most</b> expensive, <b>the most</b> popular</td></tr>
        <tr><td>Düzensizler</td><td>özel ezber</td><td>good → <b>the best</b>, bad → <b>the worst</b></td></tr>
      </table>
      <p><b>Tüyo:</b> Superlative'in önünde mutlaka <b>"the"</b> bulunur: <i>"the tallest boy in class"</i>.</p>`,
    examples: [['Mount Everest is the highest mountain.', 'Everest Dağı en yüksek dağdır.'], ['He is the best student in class.', 'O sınıftaki en iyi öğrencidir.'], ['This is the most interesting book.', 'Bu en ilginç kitaptır.']],
    mc: [
      ['The cheetah is ___ animal in the world.', ['the fastest', 'faster', 'the most fast']], ['Russia is ___ country on Earth.', ['the biggest', 'bigger', 'the most big']],
      ['She is ___ singer in our school.', ['the best', 'the goodest', 'better']], ['This is ___ difficult question of all.', ['the most', 'the more', 'the much']],
      ['January is usually ___ month of the year.', ['the coldest', 'colder', 'the most cold']]
    ],
    order: [['Everest is the highest mountain', 'Everest en yüksek dağdır.'], ['He is the best student here', 'O buradaki en iyi öğrencidir.'], ['This is the most expensive car', 'Bu en pahalı arabadır.']]
  },
  {
    id: 'too_enough', level: 'A2', type: 'grammar', title: 'Aşırılık ve Yeterlilik: too & enough', en: 'too & enough', emoji: '⚖️',
    explain: `
      <p><b>too</b> ve <b>enough</b> bir durumun aşırı veya yeterli olduğunu anlatır:</p>
      <table class="g-table">
        <tr><th>Kalıp</th><th>Kural</th><th>Örnek</th><th>Anlamı</th></tr>
        <tr><td><b>too</b> (fazla/aşırı)</td><td><b>too + Sıfat</b></td><td>This coffee is <b>too hot</b>.</td><td>Bu kahve aşırı sıcak (olumsuz).</td></tr>
        <tr><td><b>enough</b> (sıfatla)</td><td><b>Sıfat + enough</b></td><td>He is <b>tall enough</b>.</td><td>Yeterince uzun.</td></tr>
        <tr><td><b>enough</b> (isimle)</td><td><b>enough + İsim</b></td><td>I have <b>enough money</b>.</td><td>Yeterli param var.</td></tr>
      </table>
      <p><b>DİKKAT (Türk Tuzağı):</b> Sıfatla kullanılırken enough <b>sıfattan sonra</b> gelir: <i>"old enough"</i> (enough old YANLIŞ!).</p>`,
    examples: [
      ['This box is too heavy to lift.', 'Bu kutu kaldırılamayacak kadar ağır.'],
      ['She is old enough to drive a car.', 'Araba kullanacak kadar yeterince büyük.'],
      ['We don\'t have enough time.', 'Yeterli vaktimiz yok.']
    ],
    mc: [
      ['The soup is ___ hot to drink.', ['too', 'enough', 'much']],
      ['He is not strong ___ to carry this.', ['enough', 'too', 'very']],
      ['Do we have ___ money for tickets?', ['enough', 'too', 'too much']],
      ['This jacket is ___ small for me.', ['too', 'enough', 'many']],
      ['She speaks English well ___ to communicate.', ['enough', 'too', 'such']]
    ],
    order: [
      ['This coffee is too hot to drink', 'Bu kahve içmek için aşırı sıcak.'],
      ['He is not old enough to drive', 'Araba kullanmak için yeterince büyük değil.'],
      ['We have enough time for lunch', 'Öğle yemeği için yeterli vaktimiz var.']
    ]
  },
  {
    id: 'first_conditional', level: 'A2', type: 'grammar', title: 'Koşul Cümleleri (First Conditional - If)', en: 'First Conditional (Type 1)', emoji: '🌱',
    explain: `
      <p>Gelecekte <b>gerçekleşmesi muhtemel</b> durumları ve şartları anlatırken kullanılır (<b>Eğer ... yaparsan, ... olacak</b>).</p>
      <p>Formül: <b>If + Geniş Zaman (Present Simple) , will + Fiil (V1)</b></p>
      <table class="g-table">
        <tr><th>Kısım</th><th>Yapı</th><th>Örnek</th></tr>
        <tr><td>Şart Cümlesi (If)</td><td>If + Özne + V1 (Geniş Zaman)</td><td><b>If it rains</b>,</td></tr>
        <tr><td>Sonuç Cümlesi</td><td>Özne + will / won't + V1</td><td>we <b>will stay</b> home.</td></tr>
      </table>
      <p><b>DİKKAT (Türk Tuzağı):</b> "If" olan tarafa ASLA <b>will</b> gelmez! <i>"If you study, you will pass."</i> (If you will study YANLIŞ!).</p>`,
    examples: [
      ['If it is sunny tomorrow, we will go to the beach.', 'Yarın hava güneşli olursa plaja gideceğiz.'],
      ['If you study hard, you will pass the exam.', 'Eğer sıkı çalışırsan sınavı geçeceksin.'],
      ['She will be angry if you are late.', 'Geç kalırsan sana kızacak.']
    ],
    mc: [
      ['If it rains tomorrow, we ___ at home.', ['will stay', 'stayed', 'staying']],
      ['If you ___ hard, you will succeed.', ['study', 'will study', 'studied']],
      ['She will call you if she ___ time.', ['has', 'will have', 'have']],
      ['If he doesn\'t hurry, he ___ miss the bus.', ['will', 'is', 'did']],
      ['What ___ you do if it rains?', ['will', 'do', 'are']]
    ],
    order: [
      ['If it rains we will stay home', 'Yağmur yağarsa evde kalacağız.'],
      ['If you study you will pass', 'Eğer çalışırsan geçeceksin.'],
      ['She will be happy if you come', 'Eğer gelirsen mutlu olacak.']
    ]
  },
  {
    id: 'shopping_stores', level: 'A2', type: 'vocab', title: 'Alışveriş ve Mağazalar', en: 'Shopping & Stores', emoji: '🛍️',
    words: [
      ['price', 'fiyat', '🏷️'], ['discount', 'indirim', '🔖'], ['customer', 'müşteri', '🛍️'],
      ['cashier', 'kasiyer', '🧑‍💼'], ['receipt', 'fiş / makbuz', '🧾'], ['cheap', 'ucuz', '🪙'],
      ['expensive', 'pahalı', '💎'], ['size', 'beden / numara', '📏'], ['fitting room', 'soyunma / deneme kabini', '🚪'],
      ['credit card', 'kredi kartı', '💳'], ['cash', 'nakit para', '💵'], ['refund', 'para iadesi', '↩️'],
      ['on sale', 'indirimde / satışta', '🔥'], ['buy', 'satın almak', '🛒'], ['sell', 'satmak', '🏪']
    ]
  },
  {
    id: 'directions_location', level: 'A2', type: 'vocab', title: 'Yol Tarifi ve Şehirde Yönler', en: 'Directions & Locations', emoji: '🧭',
    words: [
      ['turn left', 'sola dön', '⬅️'], ['turn right', 'sağa dön', '➡️'], ['go straight ahead', 'dümdüz ilerle', '⬆️'],
      ['opposite', 'karşısında', '↔️'], ['next to', 'yanında / bitişiğinde', '👉'], ['between', 'arasında', '🥪'],
      ['traffic lights', 'trafik ışıkları', '🚦'], ['roundabout', 'dönel kavşak / göbek', '🔄'], ['cross the street', 'karşıya geç', '🚶‍♂️'],
      ['corner', 'köşe', '📐'], ['near', 'yakın', '📍'], ['far', 'uzak', '🔭'],
      ['bridge', 'köprü', '🌉'], ['bus stop', 'otobüs durağı', '🚏'], ['map', 'harita', '🗺️']
    ]
  },
  {
    id: 'modals_rules', level: 'A2', type: 'grammar', title: 'have to / must / should', en: 'Modals of Obligation & Advice', emoji: '📜',
    explain: `
      <p>Zorunluluk ve tavsiye bildiren modallar:</p>
      <table class="g-table">
        <tr><th>Modal</th><th>Anlamı</th><th>Kullanım</th></tr>
        <tr><td><b>have to / has to</b></td><td>-mek zorunda</td><td>Dış kurallar (kanun, okul kuralı): I <b>have to wear</b> a uniform.</td></tr>
        <tr><td><b>don't have to</b></td><td>zorunda değilsin</td><td>Gerek yok / serbestsin: You <b>don't have to pay</b>.</td></tr>
        <tr><td><b>must</b></td><td>kesin zorunluluk</td><td>Güçlü kişisel his veya kural: We <b>must stop</b> here.</td></tr>
        <tr><td><b>should</b></td><td>-meli / -malı</td><td>Tavsiye ve öneri: You <b>should drink</b> water.</td></tr>
      </table>`,
    examples: [['You must stop at red lights.', 'Kırmızı ışıkta durmalısın (zorunluluk).'], ['You should visit the doctor.', 'Doktora gitmelisin (tavsiye).'], ["Tomorrow is Sunday, I don't have to wake up early.", 'Yarın pazar, erken uyanmak zorunda değilim.']],
    mc: [
      ['You look sick. You ___ see a doctor.', ['should', 'have', 'must to']], ['Drivers ___ stop at red lights.', ['must', 'should', 'can']],
      ['Tomorrow is a holiday. We ___ wake up early.', ["don't have to", "must not", "should"]], ['She ___ wear glasses to read.', ['has to', 'have to', 'must to']],
      ['You ___ smoke in the hospital!', ["mustn't", "don't have to", "should"]]
    ],
    order: [['You should see a doctor soon', 'Yakında bir doktora görünmelisin.'], ['We must stop at red light', 'Kırmızı ışıkta durmalıyız.'], ['You do not have to pay', 'Ödeme yapmak zorunda değilsin.']]
  },
  {
    id: 'health_medicine', level: 'A2', type: 'vocab', title: 'Sağlık, Eczane ve Hastalıklar', en: 'Health & Medicine', emoji: '🩺',
    words: [
      ['headache', 'baş ağrısı', '🤕'], ['stomachache', 'karın ağrısı', '🤢'], ['sore throat', 'boğaz ağrısı', '🗣️'],
      ['fever', 'yüksek ateş', '🌡️'], ['cough', 'öksürük', '😷'], ['medicine', 'ilaç', '💊'],
      ['pharmacy', 'eczane', '🏥'], ['painkiller', 'ağrı kesici', '💉'], ['dentist', 'diş hekimi', '🦷'],
      ['doctor', 'doktor', '👩‍⚕️'], ['hospital', 'hastane', '🏥'], ['appointment', 'randevu', '📅'],
      ['hurt', 'acımak / incinmek', '⚡'], ['rest', 'dinlenmek', '🛌'], ['feel sick', 'hasta hissetmek', '🤒']
    ]
  },
  {
    id: 'feelings_traits', level: 'A2', type: 'vocab', title: 'Duygular ve Kişilik Özellikleri', en: 'Feelings & Personality', emoji: '🎭',
    words: [
      ['excited', 'heyecanlı', '🤩'], ['nervous', 'gergin / endişeli', '😰'], ['proud', 'gururlu', '🦁'],
      ['bored', 'canı sıkılmış', '🥱'], ['angry', 'kızgın / öfkeli', '😡'], ['polite', 'kibar / nazik', '🎩'],
      ['generous', 'cömert / eli açık', '🎁'], ['confident', 'kendine güvenen', '💪'], ['patient', 'sabırlı', '🧘'],
      ['honest', 'dürüst', '🤝'], ['hardworking', 'çalışkan', '🐝'], ['lazy', 'tembel', '🦥'],
      ['friendly', 'arkadaş canlısı', '🤗'], ['calm', 'sakin / huzurlu', '🌊'], ['creative', 'yaratıcı', '🎨']
    ]
  },
  {
    id: 'present_perfect_exp', level: 'A2', type: 'grammar', title: 'Hayat Deneyimleri: Present Perfect', en: 'Present Perfect for Experience', emoji: '🎒',
    explain: `
      <p>Hayatımız boyunca <b>hiç yapıp yapmadığımız tecrübeleri</b> anlatırken kullanılır (tam zamanı önemli değildir).</p>
      <p>Formül: <b>have / has + Fiilin 3. Hali (V3)</b></p>
      <table class="g-table">
        <tr><th>Kalıp</th><th>Örnek</th><th>Anlamı</th></tr>
        <tr><td>Soru (ever)</td><td>Have you <b>ever been</b> to Italy?</td><td>Hiç İtalya'da bulundun mu?</td></tr>
        <tr><td>Olumsuz (never)</td><td>I have <b>never eaten</b> sushi.</td><td>Hiç suşi yemedim.</td></tr>
        <tr><td>Olumlu</td><td>She has <b>visited</b> five countries.</td><td>Beş ülke ziyaret etti.</td></tr>
      </table>
      <p><b>Tüyo:</b> "Gitmek ve dönmek" tecrübesi için <b>been</b> kullanılır: <i>"I have been to London"</i> (Londra'da bulundum).</p>`,
    examples: [['Have you ever seen snow?', 'Hiç kar gördün mü?'], ['I have never flown in a plane.', 'Hiç uçağa binmedim.'], ['He has lived in three different cities.', 'Üç farklı şehirde yaşadı.']],
    mc: [
      ['Have you ever ___ to London?', ['been', 'went', 'go']], ['I have never ___ sushi in my life.', ['eaten', 'ate', 'eat']],
      ['She has ___ five books this year.', ['read', 'reads', 'reading']], ['___ you ever seen a tiger?', ['Have', 'Has', 'Did']],
      ['He ___ never traveled abroad.', ['has', 'have', 'is']]
    ],
    order: [['Have you ever seen snow', 'Hiç kar gördün mü?'], ['I have never been to London', 'Hiç Londra\'da bulunmadım.'], ['She has visited three countries', 'O üç ülke ziyaret etti.']]
  },
  {
    id: 'conjunctions_a2', level: 'A2', type: 'grammar', title: 'Bağlaçlar: because, so, although', en: 'Conjunctions', emoji: '🔗',
    explain: `
      <p>Cümleleri mantıkla birbirine bağlayarak akıcı konuşmayı sağlar:</p>
      <table class="g-table">
        <tr><th>Bağlaç</th><th>Anlamı</th><th>Örnek</th></tr>
        <tr><td><b>because</b></td><td>çünkü / -dığı için</td><td>I took an umbrella <b>because</b> it was raining.</td></tr>
        <tr><td><b>so</b></td><td>bu yüzden / bu sebeple</td><td>I was tired, <b>so</b> I went to bed early.</td></tr>
        <tr><td><b>although</b></td><td>-e rağmen</td><td><b>Although</b> it was cold, we went swimming.</td></tr>
        <tr><td><b>while</b></td><td>-iken (aynı anda)</td><td>He called me <b>while</b> I was cooking.</td></tr>
      </table>`,
    examples: [['I study English because I love traveling.', 'İngilizce çalışıyorum çünkü seyahat etmeyi seviyorum.'], ['He had a headache, so he took medicine.', 'Başı ağrıyordu, bu yüzden ilaç aldı.'], ['Although she was tired, she smiled.', 'Yorgun olmasına rağmen gülümsedi.']],
    mc: [
      ['I went to bed early ___ I was very tired.', ['because', 'so', 'although']], ['It was raining, ___ we stayed at home.', ['so', 'because', 'although']],
      ['___ it was cold, he wore only a T-shirt.', ['Although', 'Because', 'So']], ['She called me ___ I was studying.', ['while', 'because', 'so']],
      ['We went hiking ___ the weather was cold.', ['although', 'because', 'so']]
    ],
    order: [['I stayed home because it rained', 'Evde kaldım çünkü yağmur yağdı.'], ['He was tired so he slept', 'Yorgundu bu yüzden uyudu.'], ['Although it rained we went out', 'Yağmur yağmasına rağmen dışarı çıktık.']]
  },
  {
    id: 'relative_pronouns', level: 'A2', type: 'grammar', title: 'İlgi Zamirleri (who, which, that, where)', en: 'Relative Pronouns', emoji: '🔍',
    explain: `
      <p>Bir insanı, nesneyi veya yeri tanımlarken iki cümleyi tek bir cümlede birleştirmeye yarar (<b>-en, -an, -dığı</b>):</p>
      <table class="g-table">
        <tr><th>Zamir</th><th>Neler İçin?</th><th>Örnek</th><th>Anlamı</th></tr>
        <tr><td><b>who</b></td><td>İnsanlar için</td><td>The boy <b>who</b> speaks English</td><td>İngilizce konuş<b>an</b> çocuk</td></tr>
        <tr><td><b>which</b></td><td>Hayvan ve eşyalar</td><td>The car <b>which</b> is red</td><td>Kırmızı ol<b>an</b> araba</td></tr>
        <tr><td><b>that</b></td><td>Hem insan hem eşya</td><td>The book <b>that</b> I read</td><td>Okudu<b>ğum</b> kitap</td></tr>
        <tr><td><b>where</b></td><td>Yerler için</td><td>The city <b>where</b> I live</td><td>Yaşadı<b>ğım</b> şehir</td></tr>
      </table>`,
    examples: [
      ['This is the doctor who helped me.', 'Bana yardım eden doktor bu.'],
      ['I loved the book which you gave me.', 'Bana verdiğin kitabı çok sevdim.'],
      ['This is the cafe where we met.', 'Tanıştığımız kafe burası.']
    ],
    mc: [
      ['The woman ___ lives next door is a teacher.', ['who', 'which', 'where']],
      ['This is the laptop ___ I bought yesterday.', ['which', 'who', 'where']],
      ['That is the restaurant ___ we ate delicious pizza.', ['where', 'who', 'which']],
      ['I know a person ___ speaks four languages.', ['who', 'which', 'where']],
      ['The dog ___ is barking belongs to Tom.', ['which', 'who', 'where']]
    ],
    order: [
      ['This is the doctor who helped me', 'Bana yardım eden doktor bu.'],
      ['This is the city where I live', 'Yaşadığım şehir burası.'],
      ['I like books which are interesting', 'İlginç olan kitapları severim.']
    ]
  },
  {
    id: 'technology_media', level: 'A2', type: 'vocab', title: 'Dijital Dünya ve Teknoloji', en: 'Technology & Digital World', emoji: '💻',
    words: [
      ['smartphone', 'akıllı telefon', '📱'], ['download', 'indirmek', '⬇️'], ['upload', 'yüklemek', '⬆️'],
      ['password', 'şifre / parola', '🔑'], ['charger', 'şarj aleti', '🔌'], ['battery', 'pil / batarya', '🔋'],
      ['screen', 'ekran', '🖥️'], ['send message', 'mesaj göndermek', '💬'], ['attachment', 'ek / dosya eki', '📎'],
      ['wireless', 'kablosuz (Wi-Fi)', '📶'], ['headphones', 'kulaklık', '🎧'], ['application', 'uygulama (app)', '📲'],
      ['website', 'web sitesi', '🌐'], ['click', 'tıklamak', '🖱️'], ['connect', 'bağlanmak', '🔗']
    ]
  },

  /* ============================================================
     B1 CEFR ORTA SEVİYE MÜFREDATI (Intermediate - 22 Ünite: 12 Gramer + 10 Kelime)
     ============================================================ */

  {
    "id": "b1_pres_perf_past",
    "level": "B1",
    "type": "grammar",
    "title": "Present Perfect vs Past Simple",
    "en": "Present Perfect vs Past Simple",
    "emoji": "⏳",
    "explain": "<h4>Zaman Ayrımı: Present Perfect vs Past Simple</h4>\n<p><b>Kritik İpucu (Deneyimler):</b> Hayat tecrübelerimizden bahsederken zaman vermiyorsak <b>Present Perfect</b> (have/has + V3) kullanırız. Geçmişte belirli bir zamanda gerçekleşmiş ve bitmiş eylemlerde ise <b>Past Simple</b> (V2) kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Zaman</th><th>Kullanım Amacı</th><th>Zaman Zarfları</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Past Simple</b></td><td>Geçmişte bitmiş, zamanı belli eylem</td><td>yesterday, in 2018, two days ago, last month</td><td>I <b>visited</b> Rome in 2020.</td></tr>\n  <tr><td><b>Present Perfect</b></td><td>Hayat deneyimi, etkisi süren eylem</td><td>ever, never, already, yet, so far, recently</td><td>I <b>have visited</b> Rome three times.</td></tr>\n</table>\n<p>💡 <i>\"Have you ever...\" kalıbı hayatında hiç o deneyimi yaşayıp yaşamadığını sorar!</i></p>",
    "examples": [
      [
        "I have tried sushi before, but I didn't like it.",
        "Daha önce suşi denedim (deneyim), ama beğenmedim."
      ],
      [
        "She moved to Berlin last September.",
        "Geçen Eylül'de Berlin'e taşındı (belirli geçmiş zaman)."
      ],
      [
        "Have you ever met a celebrity in person?",
        "Şahsen hiç ünlü biriyle tanıştın mı?"
      ]
    ],
    "mc": [
      [
        "She ___ in Canada for two years when she was a child.",
        [
          "lived",
          "has lived",
          "lives"
        ]
      ],
      [
        "I ___ never ___ such a breathtaking view before.",
        [
          "have / seen",
          "did / see",
          "am / seeing"
        ]
      ],
      [
        "We ___ our university degrees in 2021.",
        [
          "completed",
          "have completed",
          "complete"
        ]
      ],
      [
        "___ you ever ___ bungee jumping in your life?",
        [
          "Have / tried",
          "Did / try",
          "Do / try"
        ]
      ],
      [
        "He ___ already ___ his master's thesis.",
        [
          "has / submitted",
          "did / submit",
          "is / submitting"
        ]
      ]
    ],
    "order": [
      [
        "I have never visited Japan before",
        "Daha önce hiç Japonya'yı ziyaret etmedim."
      ],
      [
        "They arrived in London two days ago",
        "İki gün önce Londra'ya vardılar."
      ],
      [
        "Have you ever driven an electric car",
        "Hiç elektrikli bir araba sürdün mü?"
      ]
    ]
  },
  {
    "id": "b1_career_jobs",
    "level": "B1",
    "type": "vocab",
    "title": "Kariyer ve İş Mülakatı",
    "en": "Career & Job Interviews",
    "emoji": "💼",
    "words": [
      [
        "applicant",
        "başvuru sahibi / aday",
        "👤"
      ],
      [
        "resume",
        "özgeçmiş (CV)",
        "📄"
      ],
      [
        "promotion",
        "terfi / yükselme",
        "📈"
      ],
      [
        "deadline",
        "son teslim tarihi",
        "⏰"
      ],
      [
        "salary",
        "maaş / ücret",
        "💵"
      ],
      [
        "colleague",
        "iş arkadaşı",
        "🤝"
      ],
      [
        "experience",
        "deneyim / tecrübe",
        "🧠"
      ],
      [
        "skills",
        "beceriler / yetenekler",
        "🛠️"
      ],
      [
        "contract",
        "sözleşme / kontrat",
        "📝"
      ],
      [
        "department",
        "departman / bölüm",
        "🏢"
      ],
      [
        "interview",
        "mülakat / iş görüşmesi",
        "🎤"
      ],
      [
        "hire",
        "işe almak",
        "👔"
      ]
    ]
  },
  {
    "id": "b1_pres_perf_cont",
    "level": "B1",
    "type": "grammar",
    "title": "Present Perfect Continuous",
    "en": "Present Perfect Continuous",
    "emoji": "🔄",
    "explain": "<h4>Süreç Odaklı Zaman: have / has been + V-ing</h4>\n<p><b>Kritik İpucu (Since & For):</b> Geçmişte başlayıp <i>şu ana kadar kesintisiz devam eden</i> veya sonucu şu an gözle görülen süreçleri anlatır.</p>\n<table class=\"g-table\">\n  <tr><th>Kalıp</th><th>Ne Zaman Kullanılır?</th><th>Örnek</th></tr>\n  <tr><td><b>Since + Başlangıç Noktası</b></td><td>Olayın başladığı kesin tarih veya an</td><td>I have been working <b>since 9 AM</b>.</td></tr>\n  <tr><td><b>For + Süre Miktarı</b></td><td>Olayın toplamda ne kadar sürdüğü</td><td>I have been waiting <b>for three hours</b>.</td></tr>\n</table>\n<p>💡 <i>How long have you been learning English? (Ne kadar süredir İngilizce öğreniyorsun?)</i></p>",
    "examples": [
      [
        "It has been raining all morning.",
        "Bütün sabahtır yağmur yağıyor (hala yağıyor)."
      ],
      [
        "She has been studying architecture for four years.",
        "Dört yıldır mimarlık okuyor."
      ],
      [
        "They have been negotiating since yesterday.",
        "Dünden beri müzakere ediyorlar."
      ]
    ],
    "mc": [
      [
        "He is out of breath because he ___ for thirty minutes.",
        [
          "has been running",
          "was running",
          "runs"
        ]
      ],
      [
        "We ___ in this office since early morning.",
        [
          "have been working",
          "are working",
          "worked"
        ]
      ],
      [
        "How long ___ you ___ for the bus?",
        [
          "have / been waiting",
          "did / wait",
          "are / waiting"
        ]
      ],
      [
        "She ___ French for six months now.",
        [
          "has been learning",
          "learns",
          "learned"
        ]
      ],
      [
        "They are exhausted; they ___ all day.",
        [
          "have been travelling",
          "travel",
          "will travel"
        ]
      ]
    ],
    "order": [
      [
        "I have been waiting here for two hours",
        "İki saattir burada bekliyorum."
      ],
      [
        "She has been living in Paris since 2019",
        "2019'dan beri Paris'te yaşıyor."
      ],
      [
        "How long have you been working here",
        "Ne kadar süredir burada çalışıyorsun?"
      ]
    ]
  },
  {
    "id": "b1_environment_nature",
    "level": "B1",
    "type": "vocab",
    "title": "Çevre ve Doğa Bilinci",
    "en": "Environment & Ecology",
    "emoji": "🌿",
    "words": [
      [
        "pollution",
        "kirlilik",
        "🏭"
      ],
      [
        "recycle",
        "geri dönüştürmek",
        "♻️"
      ],
      [
        "climate change",
        "iklim değişikliği",
        "🌡️"
      ],
      [
        "renewable",
        "yenilenebilir (enerji)",
        "☀️"
      ],
      [
        "species",
        "tür / canlı türü",
        "🐾"
      ],
      [
        "extinction",
        "neslin tükenmesi",
        "🦕"
      ],
      [
        "deforestation",
        "ormansızlaşma",
        "🪓"
      ],
      [
        "ecosystem",
        "ekosistem",
        "🌍"
      ],
      [
        "conservation",
        "koruma / muhafaza",
        "🛡️"
      ],
      [
        "drought",
        "kuraklık",
        "🏜️"
      ],
      [
        "flood",
        "sel / su baskını",
        "🌊"
      ],
      [
        "waste",
        "atık / israf",
        "🗑️"
      ]
    ]
  },
  {
    "id": "b1_past_cont_vs_simple",
    "level": "B1",
    "type": "grammar",
    "title": "Past Continuous vs Past Simple",
    "en": "Past Continuous vs Past Simple (While & When)",
    "emoji": "📖",
    "explain": "<h4>Hikaye Anlatımı: Past Continuous vs Past Simple</h4>\n<p><b>Kritik İpucu (While & When):</b> Geçmişte devam etmekte olan bir sürecin ortasında ani bir olay meydana geldiğinde bu iki zaman birlikte kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Zaman & Bağlaç</th><th>İşlevi</th><th>Örnek</th></tr>\n  <tr><td><b>While + Past Continuous</b></td><td>Arka planda devam eden uzun eylem (was/were V-ing)</td><td><b>While</b> I was cooking dinner...</td></tr>\n  <tr><td><b>When + Past Simple</b></td><td>Araya giren, süreci bölen ani eylem (V2)</td><td>...the lights <b>went</b> out.</td></tr>\n</table>\n<p>💡 <i>While I was walking in the park, I found a wallet. (Parkta yürürken bir cüzdan buldum.)</i></p>",
    "examples": [
      [
        "While I was reading a book, the phone rang.",
        "Kitap okurken telefon çaldı."
      ],
      [
        "She was driving to work when the accident happened.",
        "Kaza meydana geldiğinde işe arabayla gidiyordu."
      ],
      [
        "What were you doing when I called you yesterday?",
        "Dün seni aradığımda ne yapıyordun?"
      ]
    ],
    "mc": [
      [
        "While they ___ in the forest, it suddenly started to snow.",
        [
          "were walking",
          "walked",
          "are walking"
        ]
      ],
      [
        "I ___ my finger when I was chopping the onions.",
        [
          "cut",
          "was cutting",
          "have cut"
        ]
      ],
      [
        "What ___ you ___ when the earthquake occurred?",
        [
          "were / doing",
          "did / do",
          "have / done"
        ]
      ],
      [
        "The power went out while we ___ a movie.",
        [
          "were watching",
          "watched",
          "watch"
        ]
      ],
      [
        "When the teacher entered the classroom, the students ___ loudly.",
        [
          "were shouting",
          "shout",
          "have shouted"
        ]
      ]
    ],
    "order": [
      [
        "While I was sleeping the phone suddenly rang",
        "Ben uyurken telefon aniden çaldı."
      ],
      [
        "She was driving home when the storm began",
        "Fırtına başladığında arabayla eve sürüyordu."
      ],
      [
        "What were you doing when the alarm sounded",
        "Alarm çaldığında ne yapıyordun?"
      ]
    ]
  },
  {
    "id": "b1_opinions_debate",
    "level": "B1",
    "type": "vocab",
    "title": "Görüş Belirtme ve Tartışma",
    "en": "Opinions & Debate",
    "emoji": "🗣️",
    "words": [
      [
        "argument",
        "argüman / tartışma",
        "💬"
      ],
      [
        "perspective",
        "bakış açısı",
        "🔭"
      ],
      [
        "disagree",
        "aynı fikirde olmamak",
        "🙅"
      ],
      [
        "convince",
        "ikna etmek",
        "💡"
      ],
      [
        "evidence",
        "kanıt / delil",
        "🔍"
      ],
      [
        "conclusion",
        "sonuç / vargı",
        "📌"
      ],
      [
        "clarify",
        "netleştirmek / açıklamak",
        "✨"
      ],
      [
        "priority",
        "öncelik",
        "⭐"
      ],
      [
        "propose",
        "önermek / teklif etmek",
        "💍"
      ],
      [
        "solution",
        "çözüm",
        "🔑"
      ],
      [
        "compromise",
        "uzlaşma / anlaşma",
        "🤝"
      ],
      [
        "statement",
        "ifade / beyan",
        "📢"
      ]
    ]
  },
  {
    "id": "b1_past_perfect",
    "level": "B1",
    "type": "grammar",
    "title": "Past Perfect Simple",
    "en": "Past Perfect Simple (had + V3)",
    "emoji": "⏮️",
    "explain": "<h4>Geçmişin Geçmişi: Past Perfect (had + V3)</h4>\n<p><b>Kritik İpucu (İki Olayın Sırası):</b> Geçmişte gerçekleşen iki olaydan <b>daha önce olanı</b> belirtmek için Past Perfect, daha sonra olanı için Past Simple kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>1. Olay (Daha Önce)</th><th>2. Olay (Daha Sonra)</th><th>Birleşik Cümle</th></tr>\n  <tr><td>Tren istasyondan ayrıldı (had left)</td><td>Biz istasyona vardık (arrived)</td><td>When we arrived, the train <b>had already left</b>.</td></tr>\n  <tr><td>Ödevimi bitirmiştim (had finished)</td><td>Yatağa gittim (went to bed)</td><td>After I <b>had finished</b> my work, I went to bed.</td></tr>\n</table>\n<p>💡 <i>Anahtar kelimeler: before, after, by the time, already.</i></p>",
    "examples": [
      [
        "By the time we got to the cinema, the movie had already started.",
        "Sinemaya vardığımızda film çoktan başlamıştı."
      ],
      [
        "She had never flown before her trip to London.",
        "Londra gezisinden önce hiç uçağa binmemişti."
      ],
      [
        "He realized that he had left his keys at home.",
        "Anahtarlarını evde unuttuğunu fark etti."
      ]
    ],
    "mc": [
      [
        "When the police arrived, the burglar ___ already ___.",
        [
          "had / escaped",
          "has / escaped",
          "was / escaping"
        ]
      ],
      [
        "I couldn't enter the flat because I ___ my keys at work.",
        [
          "had forgotten",
          "have forgotten",
          "forget"
        ]
      ],
      [
        "By the time she turned twenty, she ___ three books.",
        [
          "had published",
          "publishes",
          "has published"
        ]
      ],
      [
        "He felt sick because he ___ too much cake.",
        [
          "had eaten",
          "eats",
          "has eaten"
        ]
      ],
      [
        "Before they bought the house, they ___ several banks for a loan.",
        [
          "had visited",
          "visit",
          "have visited"
        ]
      ]
    ],
    "order": [
      [
        "The train had already left before we arrived",
        "Biz varmadan önce tren çoktan ayrılmıştı."
      ],
      [
        "She had finished her homework before dinner started",
        "Akşam yemeği başlamadan önce ödevini bitirmişti."
      ],
      [
        "By midnight the storm had completely stopped",
        "Gece yarısına kadar fırtına tamamen durmuştu."
      ]
    ]
  },
  {
    "id": "b1_education_academic",
    "level": "B1",
    "type": "vocab",
    "title": "Eğitim ve Üniversite Hayatı",
    "en": "Education & Academics",
    "emoji": "🎓",
    "words": [
      [
        "scholarship",
        "burs",
        "📜"
      ],
      [
        "lecture",
        "üniversite dersi / konferans",
        "🧑‍🏫"
      ],
      [
        "assignment",
        "ödev / görev",
        "📑"
      ],
      [
        "tuition",
        "öğrenim harcı",
        "💳"
      ],
      [
        "campus",
        "yerleşke / kampüs",
        "🏫"
      ],
      [
        "dormitory",
        "öğrenci yurdu",
        "🛏️"
      ],
      [
        "curriculum",
        "müfredat / öğretim programı",
        "📚"
      ],
      [
        "graduate",
        "mezun olmak / mezun",
        "🎓"
      ],
      [
        "semester",
        "dönem / yarıyıl",
        "🗓️"
      ],
      [
        "faculty",
        "fakülte / akademik kadro",
        "🏛️"
      ],
      [
        "thesis",
        "tez / bitirme çalışması",
        "📖"
      ],
      [
        "internship",
        "staj",
        "💼"
      ]
    ]
  },
  {
    "id": "b1_future_forms",
    "level": "B1",
    "type": "grammar",
    "title": "Gelecek Zaman Yapıları",
    "en": "Future Forms (Will, Be going to, Present Continuous)",
    "emoji": "🚀",
    "explain": "<h4>Gelecek Zaman Nüansları: Hangi Yapı Nerede?</h4>\n<p><b>Kritik İpucu:</b> İngilizcede tek bir gelecek zaman yoktur; niyetin kesinliğine göre seçim yapılır.</p>\n<table class=\"g-table\">\n  <tr><th>Yapı</th><th>Kullanım Amacı</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Will + V1</b></td><td>Konuşma anında verilen ani kararlar, tahminler, sözler</td><td>The phone is ringing. I <b>will answer</b> it!</td></tr>\n  <tr><td><b>Be going to + V1</b></td><td>Önceden planlanmış niyetler veya kanıta dayalı tahminler</td><td>Look at those dark clouds! It <b>is going to rain</b>.</td></tr>\n  <tr><td><b>Present Continuous (am/is/are + V-ing)</b></td><td>Tarihi ve yeri kesinleşmiş randevular / ayarlamalar</td><td>I <b>am meeting</b> the director at 3 PM tomorrow.</td></tr>\n</table>",
    "examples": [
      [
        "Don't worry, I will help you with your luggage.",
        "Endişelenme, valizlerinde sana yardım ederim (anlık karar)."
      ],
      [
        "We are going to buy a new house next spring.",
        "Gelecek ilkbaharda yeni bir ev alacağız (planlanan niyet)."
      ],
      [
        "I am flying to Rome on Friday; my ticket is booked.",
        "Cuma günü Roma'ya uçuyorum; biletlerim ayırtıldı (kesin plan)."
      ]
    ],
    "mc": [
      [
        "\"I don't have enough money for coffee.\" — \"Don't worry, I ___ for you.\"",
        [
          "will pay",
          "am paying",
          "am going to pay"
        ]
      ],
      [
        "Look at that driver! He is going way too fast; he ___ an accident!",
        [
          "is going to have",
          "will have",
          "has"
        ]
      ],
      [
        "We ___ dinner with Sarah tomorrow night at eight; the table is reserved.",
        [
          "are having",
          "will have",
          "have"
        ]
      ],
      [
        "I promise I ___ tell your secret to anyone.",
        [
          "won't",
          "am not",
          "am not going to"
        ]
      ],
      [
        "What ___ you ___ after university graduation?",
        [
          "are / going to do",
          "will / do",
          "do / do"
        ]
      ]
    ],
    "order": [
      [
        "I will answer the door for you",
        "Kapıya senin için ben bakarım."
      ],
      [
        "Look at the clouds it is going to rain",
        "Bulutlara bak yağmur yağacak."
      ],
      [
        "We are flying to Paris next Monday morning",
        "Gelecek Pazartesi sabahı Paris'e uçuyoruz."
      ]
    ]
  },
  {
    "id": "b1_phrasal_verbs_1",
    "level": "B1",
    "type": "vocab",
    "title": "Temel Phrasal Verbs (Öbek Fiiller)",
    "en": "Essential Phrasal Verbs",
    "emoji": "🧩",
    "words": [
      [
        "give up",
        "pes etmek / bırakmak",
        "🏳️"
      ],
      [
        "look forward to",
        "dört gözle beklemek",
        "👀"
      ],
      [
        "turn down",
        "reddetmek / kısmak",
        "👎"
      ],
      [
        "figure out",
        "çözmek / anlamak",
        "💡"
      ],
      [
        "carry on",
        "devam etmek",
        "🚶"
      ],
      [
        "put off",
        "ertelemek",
        "📅"
      ],
      [
        "run out of",
        "tükenmek / bitmek",
        "⛽"
      ],
      [
        "catch up with",
        "yetişmek / yakalamak",
        "🏃"
      ],
      [
        "break down",
        "bozulmak (araç) / çökmek",
        "🚗"
      ],
      [
        "come across",
        "tesadüfen karşılaşmak",
        "🔍"
      ],
      [
        "set up",
        "kurmak / başlatmak",
        "⛺"
      ],
      [
        "look after",
        "bakmak / ilgilenmek",
        "👶"
      ]
    ]
  },
  {
    "id": "b1_modal_verbs",
    "level": "B1",
    "type": "grammar",
    "title": "Temel Modal Verbs",
    "en": "Modal Verbs (Must, Should, Have to, Ought to)",
    "emoji": "🚦",
    "explain": "<h4>Tavsiye ve Zorunluluk Modalleri</h4>\n<p><b>Kritik İpucu (Kural vs Tavsiye):</b> Dış kurallardan kaynaklanan zorunluluklarda <b>have to</b>, kişisel güçlü gereklilikte <b>must</b>, öneri ve tavsiyelerde <b>should / ought to</b> kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Modal</th><th>Anlam / İşlev</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Must</b></td><td>Kişisel iç zorunluluk / güçlü gereklilik</td><td>I <b>must</b> study hard for my dream job.</td></tr>\n  <tr><td><b>Have to</b></td><td>Dış kural, yasa veya zorunluluk</td><td>You <b>have to</b> wear a seatbelt by law.</td></tr>\n  <tr><td><b>Should / Ought to</b></td><td>Tavsiye, öğüt (\"yapsan iyi olur\")</td><td>You <b>should</b> drink more water every day.</td></tr>\n  <tr><td><b>Don't have to</b></td><td>Zorunluluk yok (\"yapmana gerek yok\")</td><td>You <b>don't have to</b> come early tomorrow.</td></tr>\n  <tr><td><b>Mustn't</b></td><td>Yasak (\"kesinlikle yapamazsın\")</td><td>You <b>mustn't</b> park your car here.</td></tr>\n</table>",
    "examples": [
      [
        "You should see a doctor if your headache continues.",
        "Baş ağrın devam ederse bir doktora görünmelisin."
      ],
      [
        "In the UK, drivers have to drive on the left.",
        "Birleşik Krallık'ta sürücüler soldan sürmek zorundadır."
      ],
      [
        "You don't have to cook; we can order pizza.",
        "Yemek pişirmek zorunda değilsin; pizza sipariş edebiliriz."
      ]
    ],
    "mc": [
      [
        "This is a secret. You ___ tell anyone about it!",
        [
          "mustn't",
          "don't have to",
          "should"
        ]
      ],
      [
        "Tomorrow is a national holiday, so we ___ go to work.",
        [
          "don't have to",
          "mustn't",
          "shouldn't"
        ]
      ],
      [
        "You look exhausted. You ___ take a short break.",
        [
          "should",
          "must to",
          "have"
        ]
      ],
      [
        "All passengers ___ show their passports at immigration.",
        [
          "have to",
          "should to",
          "ought"
        ]
      ],
      [
        "Citizens ___ pay their taxes on time.",
        [
          "ought to",
          "must to",
          "should to"
        ]
      ]
    ],
    "order": [
      [
        "You should drink plenty of water every day",
        "Her gün bol su içmelisin."
      ],
      [
        "Passengers have to fasten their seat belts",
        "Yolcular emniyet kemerlerini bağlamak zorundadır."
      ],
      [
        "You do not have to pay for parking today",
        "Bugün otopark için ödeme yapmak zorunda değilsin."
      ]
    ]
  },
  {
    "id": "b1_travel_culture",
    "level": "B1",
    "type": "vocab",
    "title": "Kültür ve Gezi Rotaları",
    "en": "Travel & World Cultures",
    "emoji": "✈️",
    "words": [
      [
        "destination",
        "varış noktası / rota",
        "📍"
      ],
      [
        "itinerary",
        "seyahat planı / güzergah",
        "🗺️"
      ],
      [
        "heritage",
        "kültürel miras",
        "🏛️"
      ],
      [
        "souvenir",
        "hediyelik eşya",
        "🎁"
      ],
      [
        "currency",
        "para birimi",
        "💱"
      ],
      [
        "customs",
        "gümrük",
        "🛃"
      ],
      [
        "monument",
        "anıt / abide",
        "🗿"
      ],
      [
        "hospitality",
        "misafirperverlik",
        "🍵"
      ],
      [
        "guide",
        "rehber",
        "🧭"
      ],
      [
        "landmark",
        "simge yapı / eser",
        "🗼"
      ],
      [
        "excursion",
        "kısa gezi / tur",
        "🚌"
      ],
      [
        "tradition",
        "gelenek / anane",
        "🎎"
      ]
    ]
  },
  {
    "id": "b1_conditionals_1_2",
    "level": "B1",
    "type": "grammar",
    "title": "Conditionals Type 1 & 2",
    "en": "Conditionals Type 1 & 2 (Real vs Unreal)",
    "emoji": "🎲",
    "explain": "<h4>Koşul Cümleleri: Type 1 (Olası) vs Type 2 (Hayali)</h4>\n<p><b>Kritik İpucu (Gerçekçi vs Hayali Senaryolar):</b></p>\n<table class=\"g-table\">\n  <tr><th>Koşul Türü</th><th>Kalıp</th><th>Kullanım Amacı</th><th>Örnek</th></tr>\n  <tr><td><b>Type 1 (Real)</b></td><td>If + Present Simple, will + V1</td><td>Gelecekte gerçekleşmesi muhtemel, gerçekçi durumlar</td><td>If it <b>rains</b>, we <b>will stay</b> at home.</td></tr>\n  <tr><td><b>Type 2 (Unreal)</b></td><td>If + Past Simple, would + V1</td><td>Şu anda gerçek olmayan, tamamen hayali varsayımlar</td><td>If I <b>won</b> the lottery, I <b>would travel</b> the world.</td></tr>\n</table>\n<p>💡 <i>\"If I were you, I would...\" kalıbı tavsiye vermek için hayali koşul kullanır!</i></p>",
    "examples": [
      [
        "If I study hard, I will pass the exam tomorrow.",
        "Çok çalışırsam yarınki sınavı geçerim (gerçekçi olasılık)."
      ],
      [
        "If I had a million dollars, I would buy an island.",
        "Bir milyon dolarım olsa bir ada satın alırdım (hayali varsayım)."
      ],
      [
        "If she knew the truth, she would be very angry.",
        "Gerçeği bilseydi çok kızardı (şu an bilmiyor)."
      ]
    ],
    "mc": [
      [
        "If I ___ free time this weekend, I will visit my grandparents.",
        [
          "have",
          "had",
          "would have"
        ]
      ],
      [
        "If I ___ wings, I would fly across the ocean.",
        [
          "had",
          "have",
          "will have"
        ]
      ],
      [
        "If she ___ harder, she will get a promotion soon.",
        [
          "works",
          "worked",
          "would work"
        ]
      ],
      [
        "What ___ you do if you found a bag full of cash?",
        [
          "would",
          "will",
          "do"
        ]
      ],
      [
        "If I ___ in your position, I wouldn't accept that offer.",
        [
          "were",
          "am",
          "will be"
        ]
      ]
    ],
    "order": [
      [
        "If it rains tomorrow we will stay home",
        "Yarın yağmur yağarsa evde kalacağız."
      ],
      [
        "If I had more money I would travel abroad",
        "Daha fazla param olsa yurt dışına seyahat ederdim."
      ],
      [
        "If I were you I would take that opportunity",
        "Senin yerinde olsam o fırsatı değerlendirirdim."
      ]
    ]
  },
  {
    "id": "b1_health_fitness",
    "level": "B1",
    "type": "vocab",
    "title": "Sağlık, Beslenme ve Zindelik",
    "en": "Health & Wellness",
    "emoji": "🏃",
    "words": [
      [
        "symptom",
        "belirti / semptom",
        "🌡️"
      ],
      [
        "prescription",
        "reçete",
        "💊"
      ],
      [
        "nutrition",
        "beslenme",
        "🥗"
      ],
      [
        "recovery",
        "iyileşme / toparlanma",
        "🩹"
      ],
      [
        "infection",
        "enfeksiyon / bulaş",
        "🦠"
      ],
      [
        "fatigue",
        "aşırı yorgunluk / halsizlik",
        "🥱"
      ],
      [
        "treatment",
        "tedavi",
        "🩺"
      ],
      [
        "allergy",
        "alerji",
        "🤧"
      ],
      [
        "immune",
        "bağışıklık (sistemi)",
        "🛡️"
      ],
      [
        "endurance",
        "dayanıklılık",
        "🏋️"
      ],
      [
        "therapy",
        "terapi / tedavi seansı",
        "🧘"
      ],
      [
        "physician",
        "hekim / doktor",
        "👨‍⚕️"
      ]
    ]
  },
  {
    "id": "b1_passive_simple",
    "level": "B1",
    "type": "grammar",
    "title": "Passive Voice (Temel)",
    "en": "Passive Voice (Present & Past Simple)",
    "emoji": "⚙️",
    "explain": "<h4>Temel Edilgen Çatı: be + V3</h4>\n<p><b>Kritik İpucu (Eylem ve Nesne Odaklılık):</b> Eylemi kimin yaptığından ziyade <i>ne yapıldığı veya kime yapıldığı</i> önemli olduğunda edilgen çatı kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Zaman</th><th>Etken (Active)</th><th>Edilgen (Passive)</th></tr>\n  <tr><td><b>Present Simple</b></td><td>People speak English worldwide.</td><td>English <b>is spoken</b> worldwide.</td></tr>\n  <tr><td><b>Past Simple</b></td><td>Edison invented the light bulb in 1879.</td><td>The light bulb <b>was invented</b> in 1879.</td></tr>\n</table>\n<p>💡 <i>Eylemi yapan kişiyi belirtmek istersek cümlenin sonuna <b>\"by + kişi\"</b> ekleriz (örn: Hamlet was written by Shakespeare).</i></p>",
    "examples": [
      [
        "Millions of emails are sent every single minute.",
        "Her dakika milyonlarca e-posta gönderilir."
      ],
      [
        "The ancient castle was restored three years ago.",
        "Tarihi kale üç yıl önce restore edildi."
      ],
      [
        "Smartphones are produced in modern factories.",
        "Akıllı telefonlar modern fabrikalarda üretilir."
      ]
    ],
    "mc": [
      [
        "This novel ___ into over fifty languages in 1995.",
        [
          "was translated",
          "translated",
          "is translating"
        ]
      ],
      [
        "Coffee ___ in tropical regions of South America.",
        [
          "is grown",
          "grows",
          "was grown"
        ]
      ],
      [
        "The stolen paintings ___ by the police yesterday.",
        [
          "were discovered",
          "discovered",
          "are discovering"
        ]
      ],
      [
        "Plastic waste ___ in special recycling plants.",
        [
          "is processed",
          "processes",
          "was processing"
        ]
      ],
      [
        "The famous bridge ___ by a German architect in 1920.",
        [
          "was designed",
          "designed",
          "is designing"
        ]
      ]
    ],
    "order": [
      [
        "English is spoken all over the world today",
        "Bugün İngilizce tüm dünyada konuşulmaktadır."
      ],
      [
        "The Eiffel Tower was built in Paris in 1889",
        "Eyfel Kulesi 1889 yılında Paris'te inşa edildi."
      ],
      [
        "Millions of photos are uploaded to social media daily",
        "Her gün sosyal medyaya milyonlarca fotoğraf yüklenir."
      ]
    ]
  },
  {
    "id": "b1_media_arts",
    "level": "B1",
    "type": "vocab",
    "title": "Medya, Sinema ve Sanat",
    "en": "Media, Cinema & Arts",
    "emoji": "🎬",
    "words": [
      [
        "broadcast",
        "yayın / yayınlamak",
        "📡"
      ],
      [
        "documentary",
        "belgesel",
        "🎥"
      ],
      [
        "exhibition",
        "sergi",
        "🖼️"
      ],
      [
        "sculpture",
        "heykel",
        "🗿"
      ],
      [
        "audience",
        "seyirci / izleyici kitlesi",
        "👥"
      ],
      [
        "critic",
        "eleştirmen",
        "✍️"
      ],
      [
        "genre",
        "tür / janr (müzik, film)",
        "🎭"
      ],
      [
        "performance",
        "performans / gösteri",
        "🎪"
      ],
      [
        "premiere",
        "galâ / ilk gösterim",
        "🎟️"
      ],
      [
        "plot",
        "olay örgüsü / konu",
        "📖"
      ],
      [
        "soundtrack",
        "film müziği albümü",
        "🎵"
      ],
      [
        "masterpiece",
        "başyapıt / şaheser",
        "🎨"
      ]
    ]
  },
  {
    "id": "b1_defining_rel_clauses",
    "level": "B1",
    "type": "grammar",
    "title": "Defining Relative Clauses",
    "en": "Defining Relative Clauses (who, which, that, whose)",
    "emoji": "🔗",
    "explain": "<h4>Tanımlayıcı Sıfat Cümlecikleri: Defining Relative Clauses</h4>\n<p><b>Kritik İpucu (Kişi ve Nesneleri Tanımlama):</b> Bahsettiğimiz kişinin veya nesnenin tam olarak <i>kim veya hangisi</i> olduğunu tanımlamak için kullanılır. Virgül KULLANILMAZ.</p>\n<table class=\"g-table\">\n  <tr><th>Zamir</th><th>Kullanım Alanı</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>who / that</b></td><td>İnsanlar için</td><td>The architect <b>who</b> designed this tower is famous.</td></tr>\n  <tr><td><b>which / that</b></td><td>Nesneler ve hayvanlar için</td><td>I read the article <b>which</b> explained climate change.</td></tr>\n  <tr><td><b>whose</b></td><td>Sahiplik / aitlik için (\"-ın/-in\")</td><td>A boy <b>whose</b> father is a pilot joined our class.</td></tr>\n  <tr><td><b>where</b></td><td>Yerler için</td><td>This is the museum <b>where</b> the treasure is kept.</td></tr>\n</table>",
    "examples": [
      [
        "The woman who works next to me is an engineer.",
        "Yanımda çalışan kadın bir mühendis."
      ],
      [
        "I returned the laptop which was defective.",
        "Kusurlu olan dizüstü bilgisayarı iade ettim."
      ],
      [
        "Do you know the musician whose concert was canceled?",
        "Konseri iptal edilen müzisyeni tanıyor musun?"
      ]
    ],
    "mc": [
      [
        "A surgeon is a specialist doctor ___ performs operations.",
        [
          "who",
          "which",
          "where"
        ]
      ],
      [
        "The company published a report ___ showed strong financial growth.",
        [
          "which",
          "who",
          "whose"
        ]
      ],
      [
        "I met a traveler ___ passport had been stolen.",
        [
          "whose",
          "who",
          "which"
        ]
      ],
      [
        "This is the small town ___ I spent my childhood.",
        [
          "where",
          "which",
          "that"
        ]
      ],
      [
        "The mobile app ___ we downloaded is extremely helpful.",
        [
          "that",
          "whose",
          "where"
        ]
      ]
    ],
    "order": [
      [
        "The woman who lives next door is a doctor",
        "Yan kapıda yaşayan kadın bir doktordur."
      ],
      [
        "This is the book which changed my perspective",
        "Bakış açımı değiştiren kitap budur."
      ],
      [
        "I met an author whose books are very popular",
        "Kitapları çok popüler olan bir yazarla tanıştım."
      ]
    ]
  },
  {
    "id": "b1_personality_psych",
    "level": "B1",
    "type": "vocab",
    "title": "Kişilik ve Karakter Özellikleri",
    "en": "Personality & Traits",
    "emoji": "🎭",
    "words": [
      [
        "ambitious",
        "hırslı / azimli",
        "🧗"
      ],
      [
        "generous",
        "cömert / eli açık",
        "🎁"
      ],
      [
        "reliable",
        "güvenilir",
        "🤝"
      ],
      [
        "stubborn",
        "inatçı / dik kafalı",
        "🦙"
      ],
      [
        "empathetic",
        "empati kurabilen / duyarlı",
        "❤️"
      ],
      [
        "arrogant",
        "kibirli / burnu havada",
        "🦚"
      ],
      [
        "punctual",
        "dakik / zamanında gelen",
        "⏱️"
      ],
      [
        "humble",
        "alçakgönüllü / mütevazı",
        "🌱"
      ],
      [
        "creative",
        "yaratıcı / üretken",
        "🎨"
      ],
      [
        "cautious",
        "temkinli / dikkatli",
        "🛡️"
      ],
      [
        "sincere",
        "samimi / içten",
        "😊"
      ],
      [
        "impatient",
        "sabırsız / tez canlı",
        "⌛"
      ]
    ]
  },
  {
    "id": "b1_gerunds_infinitives",
    "level": "B1",
    "type": "grammar",
    "title": "Temel Gerunds & Infinitives",
    "en": "Gerunds & Infinitives (V-ing vs to V)",
    "emoji": "🎯",
    "explain": "<h4>Hangi Fiilden Sonra Ne Gelir? Gerund (-ing) vs Infinitive (to V)</h4>\n<p><b>Kritik İpucu (Temel Fiil Listesi):</b> Bir fiilden sonra ikinci bir eylem geldiğinde, ilk fiilin kuralına göre -ing veya to- mastar eki alır.</p>\n<table class=\"g-table\">\n  <tr><th>Kategori</th><th>Popüler Fiiller</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Gerund (-ing) Alanlar</b></td><td>enjoy, avoid, mind, keep, admit, finish, suggest</td><td>I <b>enjoy swimming</b> in the sea.</td></tr>\n  <tr><td><b>Infinitive (to V) Alanlar</b></td><td>decide, hope, plan, refuse, promise, offer, want</td><td>We <b>decided to cancel</b> the trip.</td></tr>\n  <tr><td><b>Edat (Preposition) Sonrası</b></td><td>interested in, good at, afraid of, tired of</td><td>She is good <b>at playing</b> tennis.</td></tr>\n</table>",
    "examples": [
      [
        "She decided to accept the scholarship offer.",
        "Burs teklifini kabul etmeye karar verdi."
      ],
      [
        "They avoid driving during rush hour.",
        "Yoğun saatlerde araç sürmekten kaçınırlar."
      ],
      [
        "Are you interested in learning new languages?",
        "Yeni diller öğrenmekle ilgileniyor musun?"
      ]
    ],
    "mc": [
      [
        "He promised ___ his sister with her physics project.",
        [
          "to help",
          "helping",
          "help"
        ]
      ],
      [
        "We really enjoy ___ through the historical city center.",
        [
          "walking",
          "to walk",
          "walk"
        ]
      ],
      [
        "I cannot afford ___ such an expensive smartphone right now.",
        [
          "to buy",
          "buying",
          "buy"
        ]
      ],
      [
        "She is very good at ___ international contracts.",
        [
          "negotiating",
          "to negotiate",
          "negotiate"
        ]
      ],
      [
        "They managed ___ the summit despite the freezing wind.",
        [
          "to reach",
          "reaching",
          "reach"
        ]
      ]
    ],
    "order": [
      [
        "She decided to study medicine at university",
        "Üniversitede tıp okumaya karar verdi."
      ],
      [
        "We enjoy spending time together on weekends",
        "Hafta sonları birlikte vakit geçirmekten keyif alırız."
      ],
      [
        "He refused to sign the unfair business contract",
        "Adil olmayan iş sözleşmesini imzalamayı reddetti."
      ]
    ]
  },
  {
    "id": "b1_crime_society",
    "level": "B1",
    "type": "vocab",
    "title": "Toplum, Hukuk ve Kurallar",
    "en": "Law, Society & Rules",
    "emoji": "⚖️",
    "words": [
      [
        "regulation",
        "yönetmelik / düzenleme",
        "📜"
      ],
      [
        "witness",
        "tanık / görgü şahidi",
        "👁️"
      ],
      [
        "verdict",
        "mahkeme kararı / hüküm",
        "⚖️"
      ],
      [
        "guilty",
        "suçlu",
        "🚨"
      ],
      [
        "innocent",
        "masum / suçsuz",
        "🕊️"
      ],
      [
        "penalty",
        "ceza / yaptırım",
        "🛑"
      ],
      [
        "investigation",
        "soruşturma / tahkikat",
        "🔍"
      ],
      [
        "citizen",
        "vatandaş / yurttaş",
        "🆔"
      ],
      [
        "constitution",
        "anayasa",
        "🏛️"
      ],
      [
        "prohibit",
        "yasaklamak / men etmek",
        "🚫"
      ],
      [
        "evidence",
        "delil / ispat",
        "📁"
      ],
      [
        "security",
        "güvenlik / emniyet",
        "👮"
      ]
    ]
  },
  {
    "id": "b1_reported_speech",
    "level": "B1",
    "type": "grammar",
    "title": "Reported Speech (Temel)",
    "en": "Reported Speech (Statements & Tense Backshift)",
    "emoji": "📢",
    "explain": "<h4>Dolaylı Anlatım: Birinin Sözünü Aktarma</h4>\n<p><b>Kritik İpucu (Tense Backshift / Zaman Kayması):</b> Birinin geçmişte söylediği cümleyi aktarırken (He said that...), zaman bir derece geçmişe kayar.</p>\n<table class=\"g-table\">\n  <tr><th>Doğrudan Cümle (Direct)</th><th>Aktarılan Cümle (Reported)</th></tr>\n  <tr><td>\"I <b>am</b> tired.\"</td><td>He said that he <b>was</b> tired.</td></tr>\n  <tr><td>\"I <b>live</b> in London.\"</td><td>She said that she <b>lived</b> in London.</td></tr>\n  <tr><td>\"I <b>will call</b> you.\"</td><td>He said that he <b>would call</b> me.</td></tr>\n  <tr><td>\"I <b>have seen</b> that movie.\"</td><td>She told me that she <b>had seen</b> that movie.</td></tr>\n</table>\n<p>💡 <i><b>Say vs Tell:</b> \"He said that...\" Kime söylediğini belirtirsek: \"He told <b>me</b> that...\".</i></p>",
    "examples": [
      [
        "\"I love classical music.\" -> She said that she loved classical music.",
        "\"Klasik müziği seviyorum.\" -> Klasik müziği sevdiğini söyledi."
      ],
      [
        "\"We are moving to Canada.\" -> They told us that they were moving to Canada.",
        "\"Kanada'ya taşınıyoruz.\" -> Kanada'ya taşınmakta olduklarını bize söylediler."
      ],
      [
        "\"I will send the email today.\" -> He said that he would send the email that day.",
        "\"E-postayı bugün göndereceğim.\" -> E-postayı o gün göndereceğini söyledi."
      ]
    ],
    "mc": [
      [
        "\"I am looking for my passport.\" -> He said that he ___ for his passport.",
        [
          "was looking",
          "is looking",
          "has looked"
        ]
      ],
      [
        "\"We will attend the seminar.\" -> They said that they ___ the seminar.",
        [
          "would attend",
          "will attend",
          "attend"
        ]
      ],
      [
        "\"I have lost my wallet.\" -> She told me that she ___ her wallet.",
        [
          "had lost",
          "has lost",
          "lost"
        ]
      ],
      [
        "The manager told ___ that the meeting was postponed.",
        [
          "us",
          "to us",
          "that us"
        ]
      ],
      [
        "\"I don't understand the question.\" -> He said that he ___ the question.",
        [
          "didn't understand",
          "doesn't understand",
          "hadn't understand"
        ]
      ]
    ],
    "order": [
      [
        "She said that she was very tired today",
        "Bugün çok yorgun olduğunu söyledi."
      ],
      [
        "He told me that he would call me later",
        "Beni daha sonra arayacağını söyledi."
      ],
      [
        "They said that they had already booked the flights",
        "Uçuşları çoktan ayırtmış olduklarını söylediler."
      ]
    ]
  },
  {
    "id": "b1_used_to_would",
    "level": "B1",
    "type": "grammar",
    "title": "Used to & Would",
    "en": "Past Habits & States (used to vs would)",
    "emoji": "🕰️",
    "explain": "<h4>Geçmiş Alışkanlıklar ve Durumlar</h4>\n<p><b>Kritik İpucu (Eylem vs Durum Ayrımı):</b></p>\n<table class=\"g-table\">\n  <tr><th>Yapı</th><th>Kullanım Alanı</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>used to + V1</b></td><td>Hem geçmiş <b>durumlar</b> (states: live, have, be) hem de tekrarlanan <b>eylemler</b> için</td><td>I <b>used to live</b> in an old village.</td></tr>\n  <tr><td><b>would + V1</b></td><td>SADECE geçmişte nostaljik olarak tekrarlanan <b>eylemler</b> için (durum fiilleriyle KULLANILMAZ)</td><td>Every summer, we <b>would swim</b> in the river.</td></tr>\n</table>\n<p>💡 <i>\"I used to have long hair\" (Doğru) — \"I would have long hair\" (YANLIŞ, çünkü have durum bildirir!).</i></p>",
    "examples": [
      [
        "My grandfather used to work at a coal mine.",
        "Büyükbabam eskiden bir kömür madeninde çalışırdı."
      ],
      [
        "Whenever it rained, my mother would bake fresh cookies.",
        "Ne zaman yağmur yağsa annem taze kurabiyeler pişirirdi."
      ],
      [
        "I didn't use to like olives when I was a child.",
        "Çocukken zeytin sevmezdim (artık seviyorum)."
      ]
    ],
    "mc": [
      [
        "When we were young, we ___ play football on the street until sunset.",
        [
          "would",
          "used",
          "use to"
        ]
      ],
      [
        "I ___ live in a tiny apartment before I moved to Istanbul.",
        [
          "used to",
          "would",
          "was used to"
        ]
      ],
      [
        "Did you ___ wear school uniforms in primary school?",
        [
          "use to",
          "used to",
          "would"
        ]
      ],
      [
        "She ___ have curly hair, but now she straightens it every day.",
        [
          "used to",
          "would",
          "uses to"
        ]
      ],
      [
        "Every weekend, my father ___ take us fishing by the lake.",
        [
          "would",
          "use to",
          "was"
        ]
      ]
    ],
    "order": [
      [
        "I used to play basketball every afternoon",
        "Eskiden her öğleden sonra basketbol oynardım."
      ],
      [
        "We would spend our summer holidays by the lake",
        "Yaz tatillerimizi göl kenarında geçirirdik."
      ],
      [
        "She did not use to drink coffee in the morning",
        "Eskiden sabahları kahve içmezdi."
      ]
    ]
  }
,

  /* ============================================================
     B2 CEFR İLERİ SEVİYE MÜFREDATI (Upper-Intermediate - 23 Ünite: 13 Gramer + 10 Kelime)
     ============================================================ */

  {
    "id": "b2_past_perf_cont",
    "level": "B2",
    "type": "grammar",
    "title": "Past Perfect Continuous",
    "en": "Past Perfect Continuous (had been + V-ing)",
    "emoji": "⏳",
    "explain": "<h4>Geçmişin Geçmişindeki Süreç: had been + V-ing</h4>\n<p><b>Kritik İpucu (Süreç ve Geçmişteki Sonuç):</b> Geçmişte belirli bir ana kadar ne kadar süredir devam etmekte olan bir eylemi ve o eylemin o anki belirgin sonucunu vurgular.</p>\n<table class=\"g-table\">\n  <tr><th>Zaman</th><th>Vurgulanan Nokta</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Past Perfect Simple</b></td><td>Eylemin tamamlanmış olması (Sonuç)</td><td>I <b>had written</b> three letters by noon.</td></tr>\n  <tr><td><b>Past Perfect Continuous</b></td><td>Eylemin ne kadar sürdüğü (Süreç & Neden)</td><td>He was exhausted because he <b>had been driving</b> for six hours.</td></tr>\n</table>",
    "examples": [
      [
        "Her eyes were red because she had been crying.",
        "Gözleri kırmızıydı çünkü ağlamaktaydı."
      ],
      [
        "They had been negotiating for months before reaching an agreement.",
        "Bir anlaşmaya varmadan önce aylardır müzakere ediyorlardı."
      ],
      [
        "How long had you been waiting when the train finally arrived?",
        "Tren nihayet vardığında ne kadar süredir beklemekteydin?"
      ]
    ],
    "mc": [
      [
        "The ground was soaked because it ___ all night.",
        [
          "had been raining",
          "was raining",
          "has rained"
        ]
      ],
      [
        "She was out of breath; she ___ uphill for an hour.",
        [
          "had been running",
          "ran",
          "has been running"
        ]
      ],
      [
        "We ___ for the missing files for two days before finding them.",
        [
          "had been searching",
          "have searched",
          "searched"
        ]
      ],
      [
        "How long ___ they ___ in the company before they got promoted?",
        [
          "had / been working",
          "were / working",
          "have / worked"
        ]
      ],
      [
        "He felt dizzy because he ___ in the intense sun all afternoon.",
        [
          "had been standing",
          "stands",
          "has stood"
        ]
      ]
    ],
    "order": [
      [
        "She had been working for ten hours without a break",
        "Aralıksız on saattir çalışmaktaydı."
      ],
      [
        "The roads were slippery because it had been snowing",
        "Yollar kaygandı çünkü kar yağmaktaydı."
      ],
      [
        "How long had you been studying before the exam",
        "Sınavdan önce ne kadar süredir çalışmaktaydın?"
      ]
    ]
  },
  {
    "id": "b2_business_negotiation",
    "level": "B2",
    "type": "vocab",
    "title": "İş Müzakeresi ve Finans",
    "en": "Business Negotiation & Finance",
    "emoji": "💼",
    "words": [
      [
        "leverage",
        "koz / avantaj sağlayan güç",
        "⚖️"
      ],
      [
        "concession",
        "taviz / ödün",
        "🤝"
      ],
      [
        "revenue",
        "şirket geliri / hasılat",
        "💰"
      ],
      [
        "stakeholder",
        "paydaş / ilgili taraf",
        "👔"
      ],
      [
        "acquisition",
        "şirket satın alması",
        "🏢"
      ],
      [
        "lucrative",
        "son derece karlı / kazançlı",
        "💎"
      ],
      [
        "liability",
        "yükümlülük / borç / mali sorumluluk",
        "🧾"
      ],
      [
        "benchmark",
        "kıyaslama ölçütü / standart",
        "📊"
      ],
      [
        "liquidity",
        "likidite / nakit akış gücü",
        "💧"
      ],
      [
        "monopoly",
        "tekel / monopol piyasa",
        "♟️"
      ],
      [
        "dividend",
        "kar payı / temettü",
        "📈"
      ],
      [
        "merger",
        "şirket birleşmesi",
        "🔗"
      ]
    ]
  },
  {
    "id": "b2_future_cont_perf",
    "level": "B2",
    "type": "grammar",
    "title": "Future Continuous & Future Perfect",
    "en": "Future Continuous & Future Perfect",
    "emoji": "🔮",
    "explain": "<h4>Geleceğin Zamanları: Devam Eden vs Tamamlanmış Eylemler</h4>\n<p><b>Kritik İpucu:</b> \"Gelecekte tam o anda yapıyor olacağım\" (Future Continuous) ile \"Gelecekte o tarihe kadar çoktan bitirmiş olacağım\" (Future Perfect) ayrımıdır.</p>\n<table class=\"g-table\">\n  <tr><th>Zaman</th><th>Kalıp</th><th>Zaman İfadesi</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Future Continuous</b></td><td>will be + V-ing</td><td>this time tomorrow, at 4 PM</td><td>This time next week, I <b>will be relaxing</b> on the beach.</td></tr>\n  <tr><td><b>Future Perfect</b></td><td>will have + V3</td><td>by next month, by 2030</td><td>By next year, they <b>will have completed</b> the bridge.</td></tr>\n</table>",
    "examples": [
      [
        "By midnight, I will have finished writing this report.",
        "Gece yarısına kadar bu raporu yazmayı bitirmiş olacağım."
      ],
      [
        "Don't call me at 8 PM; I will be watching the Champions League final.",
        "Saat 20:00'de beni arama; Şampiyonlar Ligi finalini izliyor olacağım."
      ],
      [
        "By the time you wake up, our flight will have landed in New York.",
        "Sen uyandığında uçağımız New York'a inmiş olacak."
      ]
    ],
    "mc": [
      [
        "By the end of this decade, scientists ___ a cure for this rare disease.",
        [
          "will have found",
          "will be finding",
          "find"
        ]
      ],
      [
        "This time next Monday, we ___ over the Atlantic Ocean.",
        [
          "will be flying",
          "will have flown",
          "fly"
        ]
      ],
      [
        "By tomorrow morning, the construction team ___ the road repair.",
        [
          "will have completed",
          "will be completing",
          "completed"
        ]
      ],
      [
        "In five years' time, most citizens ___ electric vehicles.",
        [
          "will be driving",
          "will have drive",
          "are driving"
        ]
      ],
      [
        "Don't ring the doorbell at three; the baby ___ then.",
        [
          "will be sleeping",
          "will have slept",
          "sleeps"
        ]
      ]
    ],
    "order": [
      [
        "By next month I will have completed my degree",
        "Gelecek aya kadar diplomamı tamamlamış olacağım."
      ],
      [
        "This time tomorrow we will be flying to Tokyo",
        "Yarın bu saatlerde Tokyo'ya uçuyor olacağız."
      ],
      [
        "By the year 2030 the project will have finished",
        "2030 yılına kadar proje bitmiş olacaktır."
      ]
    ]
  },
  {
    "id": "b2_technology_ai",
    "level": "B2",
    "type": "vocab",
    "title": "Yapay Zeka ve Gelecek Teknolojisi",
    "en": "AI & Next-Gen Tech",
    "emoji": "🤖",
    "words": [
      [
        "algorithm",
        "algoritma / işlem basamağı",
        "💻"
      ],
      [
        "neural network",
        "yapay sinir ağı",
        "🧠"
      ],
      [
        "autonomous",
        "özerk / otonom (sürücüsüz)",
        "🚗"
      ],
      [
        "breakthrough",
        "çığır açan buluş / devrim",
        "⚡"
      ],
      [
        "cybersecurity",
        "siber güvenlik",
        "🛡️"
      ],
      [
        "encryption",
        "şifreleme / kriptografi",
        "🔐"
      ],
      [
        "automation",
        "otomasyon / makineleşme",
        "🦾"
      ],
      [
        "biotechnology",
        "biyoteknoloji",
        "🧬"
      ],
      [
        "quantum computing",
        "kuantum bilgisayar bilimi",
        "⚛️"
      ],
      [
        "obsolete",
        "kullanım dışı / modası geçmiş",
        "📟"
      ],
      [
        "disruptive",
        "ezber bozan / dönüştürücü",
        "💥"
      ],
      [
        "interface",
        "kullanıcı arayüzü",
        "🖥️"
      ]
    ]
  },
  {
    "id": "b2_cond_3_mixed",
    "level": "B2",
    "type": "grammar",
    "title": "Conditionals Type 3 & Mixed",
    "en": "Third & Mixed Conditionals",
    "emoji": "🔀",
    "explain": "<h4>İleri Düzey Koşullar: Type 3 ve Karışık (Mixed) Şartlar</h4>\n<p><b>Kritik İpucu (Geçmiş Pişmanlıklar ve Şimdiki Yansımaları):</b></p>\n<table class=\"g-table\">\n  <tr><th>Koşul Türü</th><th>Kalıp</th><th>Anlam</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Type 3 (Geçmiş Pişmanlık)</b></td><td>If + had V3, would have V3</td><td>Geçmişte olmamış olay ve geçmişteki hayali sonucu</td><td>If I <b>had studied</b>, I <b>would have passed</b>.</td></tr>\n  <tr><td><b>Mixed: Geçmiş -> Şimdi</b></td><td>If + had V3, would + V1</td><td>Geçmişteki kararın <b>şu anki</b> hayali sonucu</td><td>If I <b>had accepted</b> that job, I <b>would be living</b> in London now.</td></tr>\n  <tr><td><b>Mixed: Genel Durum -> Geçmiş</b></td><td>If + Past Simple, would have V3</td><td>Kişinin genel karakterinin geçmişteki sonucu</td><td>If I <b>were not</b> so shy, I <b>would have spoken</b> to her.</td></tr>\n</table>",
    "examples": [
      [
        "If we had taken the earlier train, we wouldn't have missed our flight.",
        "Erken trene binmiş olsaydık uçağımızı kaçırmamış olurduk (Type 3)."
      ],
      [
        "If I had won that scholarship, I would be studying at Oxford right now.",
        "O bursu kazansaydım şu an Oxford'da okuyor olurdum (Mixed)."
      ],
      [
        "If he were more organized, he wouldn't have forgotten the presentation slides.",
        "Daha düzenli biri olsaydı sunum slaytlarını unutmazdı (Mixed)."
      ]
    ],
    "mc": [
      [
        "If you ___ me about the schedule change yesterday, I would have rescheduled.",
        [
          "had informed",
          "informed",
          "have informed"
        ]
      ],
      [
        "If she had invested in tech stocks five years ago, she ___ very wealthy today.",
        [
          "would be",
          "would have been",
          "will be"
        ]
      ],
      [
        "We ___ the contract if they had offered better payment terms.",
        [
          "would have signed",
          "would sign",
          "signed"
        ]
      ],
      [
        "If I ___ afraid of heights, I would have tried skydiving with you.",
        [
          "weren't",
          "hadn't been",
          "won't be"
        ]
      ],
      [
        "They wouldn't have gotten lost if they ___ the GPS navigation.",
        [
          "had used",
          "used",
          "would use"
        ]
      ]
    ],
    "order": [
      [
        "If I had known the truth I would have warned you",
        "Gerçeği bilmiş olsaydım seni uyarırdım."
      ],
      [
        "If we had taken that flight we would be in Rome now",
        "O uçuşa binmiş olsaydık şu an Roma'da olurduk."
      ],
      [
        "She would have succeeded if she had practiced more",
        "Daha fazla pratik yapmış olsaydı başarılı olurdu."
      ]
    ]
  },
  {
    "id": "b2_psychology_mind",
    "level": "B2",
    "type": "vocab",
    "title": "Psikoloji ve İnsan Zihni",
    "en": "Psychology & Cognitive Science",
    "emoji": "🧠",
    "words": [
      [
        "subconscious",
        "bilinçaltı",
        "🌊"
      ],
      [
        "cognitive",
        "bilişsel / zihinsel",
        "💭"
      ],
      [
        "perception",
        "algı / idrak",
        "👁️"
      ],
      [
        "bias",
        "önyargı / yanlılık",
        "⚖️"
      ],
      [
        "resilience",
        "psikolojik dayanıklılık / toparlanma",
        "🌱"
      ],
      [
        "intuition",
        "sezgi / içgüdüsel his",
        "🔮"
      ],
      [
        "trauma",
        "travma / ruhsal sarsıntı",
        "⚡"
      ],
      [
        "empathy",
        "empati / duygudaşlık",
        "🤝"
      ],
      [
        "narcissism",
        "narsisizm / özseverlik",
        "🪞"
      ],
      [
        "stimulus",
        "uyarıcı / tetikleyici etken",
        "💡"
      ],
      [
        "conditioning",
        "şartlanma / koşullanma",
        "🔔"
      ],
      [
        "temperament",
        "mizaç / yaratılış",
        "🎭"
      ]
    ]
  },
  {
    "id": "b2_wish_if_only",
    "level": "B2",
    "type": "grammar",
    "title": "Wish Clauses & If Only",
    "en": "Wish Clauses & If Only (Regrets & Desires)",
    "emoji": "🌠",
    "explain": "<h4>Dilek ve Pişmanlık: Wish & If Only</h4>\n<p><b>Kritik İpucu (Zaman Geriye Kayar):</b> Dilek cümlelerinde gerçek olmayan bir durum istendiği için zaman hep bir derece geçmişe çekilir.</p>\n<table class=\"g-table\">\n  <tr><th>İfade</th><th>Kalıp</th><th>Kullanım Amacı</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Şimdiki Zaman Dileği</b></td><td>wish / if only + <b>Past Simple</b></td><td>Şu anki durumdan duyulan memnuniyetsizlik</td><td>I wish I <b>knew</b> fluent Spanish. (Şu an bilmiyorum).</td></tr>\n  <tr><td><b>Geçmiş Zaman Pişmanlığı</b></td><td>wish / if only + <b>Past Perfect</b></td><td>Geçmişte yaşanmış bir eyleme duyulan pişmanlık</td><td>I wish I <b>had studied</b> medicine. (Okumadım).</td></tr>\n  <tr><td><b>Şikayet & Davranış Değişimi</b></td><td>wish + <b>would + V1</b></td><td>Birisinin rahatsız edici bir eylemi bırakmasını istemek</td><td>I wish you <b>would stop</b> interrupting me!</td></tr>\n</table>\n<p>💡 <i>\"If only\", \"I wish\"ten çok daha güçlü ve duygusal bir pişmanlık/özlem vurgusu taşır!</i></p>",
    "examples": [
      [
        "I wish I had more free time to travel the world.",
        "Dünyayı gezmek için daha fazla boş vaktim olmasını dilerdim (şu an yok)."
      ],
      [
        "If only we hadn't missed that golden investment opportunity.",
        "Keşke o altın yatırım fırsatını kaçırmamış olsaydık (kaçırıldı)."
      ],
      [
        "I wish it would stop raining so heavily.",
        "Keşke şu yağmur bu kadar şiddetli yağmayı kesse!"
      ]
    ],
    "mc": [
      [
        "I feel terribly sick. I wish I ___ so much spicy food last night.",
        [
          "hadn't eaten",
          "didn't eat",
          "haven't eaten"
        ]
      ],
      [
        "This apartment is too noisy. I wish we ___ in a quieter neighborhood.",
        [
          "lived",
          "had lived",
          "live"
        ]
      ],
      [
        "I wish my coworker ___ talking loudly on the phone all day.",
        [
          "would stop",
          "stopped",
          "will stop"
        ]
      ],
      [
        "If only she ___ the manager the truth before she resigned.",
        [
          "had told",
          "told",
          "tells"
        ]
      ],
      [
        "I have no idea how to solve this math problem. I wish I ___ better at algebra.",
        [
          "were",
          "am",
          "had been"
        ]
      ]
    ],
    "order": [
      [
        "I wish I had accepted that job offer in London",
        "Keşke Londra'daki o iş teklifini kabul etmiş olsaydım."
      ],
      [
        "If only we had more time to finish this project",
        "Keşke bu projeyi bitirmek için daha fazla vaktimiz olsaydı."
      ],
      [
        "I wish you would listen to my advice carefully",
        "Keşke tavsiyemi dikkatlice dinlesen!"
      ]
    ]
  },
  {
    "id": "b2_global_challenges",
    "level": "B2",
    "type": "vocab",
    "title": "Küresel Krizler ve Diplomasi",
    "en": "Global Crisis & Diplomacy",
    "emoji": "🌐",
    "words": [
      [
        "sanction",
        "yaptırım / ambargo",
        "🛑"
      ],
      [
        "treaty",
        "uluslararası antlaşma / pakt",
        "📜"
      ],
      [
        "humanitarian",
        "insani / yardımsever",
        "🕊️"
      ],
      [
        "sovereignty",
        "egemenlik / bağımsızlık",
        "👑"
      ],
      [
        "refugee",
        "mülteci / sığınmacı",
        "🏕️"
      ],
      [
        "ceasefire",
        "ateşkes",
        "🏳️"
      ],
      [
        "diplomat",
        "diplomat / elçi",
        "👔"
      ],
      [
        "famine",
        "kıtlık / açlık krizi",
        "🌾"
      ],
      [
        "bilateral",
        "iki taraflı / ikili anlaşma",
        "🤝"
      ],
      [
        "escalate",
        "tırmanmak / şiddetlenmek",
        "📈"
      ],
      [
        "mediator",
        "arabulucu",
        "⚖️"
      ],
      [
        "solidarity",
        "dayanışma",
        "✊"
      ]
    ]
  },
  {
    "id": "b2_impersonal_passive",
    "level": "B2",
    "type": "grammar",
    "title": "Advanced & Impersonal Passive",
    "en": "Impersonal & Advanced Passive Voice",
    "emoji": "📰",
    "explain": "<h4>Haber ve Akademik Dil: Impersonal Passive</h4>\n<p><b>Kritik İpucu (\"It is said that...\" / \"He is believed to...\"):</b> Genel dedikodular, bilimsel kanaatler veya haber metinlerinde kaynağı gizleyip objektif görünmek için kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Kalıp Türü</th><th>Formül</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>1. It + Passive + that clause</b></td><td>It is said / thought / believed that...</td><td><b>It is believed that</b> the universe is expanding.</td></tr>\n  <tr><td><b>2. Özne + Passive + to Infinitive</b></td><td>Subject + is said to be / to have done</td><td>The suspect <b>is thought to have fled</b> abroad.</td></tr>\n</table>\n<p>💡 <i>\"The company is expected to announce profits\" (Şirketin kar açıklaması bekleniyor).</i></p>",
    "examples": [
      [
        "It is reported that three ministers have resigned.",
        "Üç bakanın istifa ettiği bildiriliyor."
      ],
      [
        "The ancient temple is believed to be over five thousand years old.",
        "Antik tapınağın beş bin yıldan eski olduğuna inanılıyor."
      ],
      [
        "The CEO is expected to step down by the end of the quarter.",
        "İcra Kurulu Başkanı'nın çeyrek sonuna kadar istifa etmesi bekleniyor."
      ]
    ],
    "mc": [
      [
        "It is widely ___ that regular meditation reduces chronic stress.",
        [
          "acknowledged",
          "acknowledging",
          "acknowledge"
        ]
      ],
      [
        "The historic diamond is believed ___ stolen by an international gang.",
        [
          "to have been",
          "to be being",
          "having been"
        ]
      ],
      [
        "The economic reforms are expected ___ thousands of new jobs next year.",
        [
          "to create",
          "creating",
          "created"
        ]
      ],
      [
        "It ___ that the lost manuscript was discovered in an old attic.",
        [
          "was confirmed",
          "confirmed",
          "is confirming"
        ]
      ],
      [
        "The accused politician is thought ___ bribes from multinational corporations.",
        [
          "to have received",
          "to receive",
          "receiving"
        ]
      ]
    ],
    "order": [
      [
        "It is said that drinking green tea improves longevity",
        "Yeşil çay içmenin ömrü uzattığı söylenir."
      ],
      [
        "The company is expected to launch a new product",
        "Şirketin yeni bir ürün piyasaya sürmesi bekleniyor."
      ],
      [
        "It was reported that the negotiations ended successfully",
        "Müzakerelerin başarıyla sona erdiği bildirildi."
      ]
    ]
  },
  {
    "id": "b2_advanced_idioms",
    "level": "B2",
    "type": "vocab",
    "title": "İleri Düzey Deyimler ve Nüanslar",
    "en": "Advanced Idiomatic Expressions",
    "emoji": "💡",
    "words": [
      [
        "bite the bullet",
        "acı gerçeğe katlanmak / dişini sıkmak",
        "🦷"
      ],
      [
        "burn the midnight oil",
        "gece gündüz harıl harıl çalışmak",
        "🕯️"
      ],
      [
        "cut corners",
        "kolaya kaçmak / kaliteden çalmak",
        "✂️"
      ],
      [
        "devil's advocate",
        "şeytanın avukatı / karşıt fikir savunucusu",
        "😈"
      ],
      [
        "see eye to eye",
        "tamamen aynı fikirde olmak",
        "👁️"
      ],
      [
        "take with a grain of salt",
        "ihtiyatla karşılamak / şüpheyle yaklaşmak",
        "🧂"
      ],
      [
        "back to the drawing board",
        "baştan başlamak / sıfırdan planlamak",
        "📐"
      ],
      [
        "spill the beans",
        "ağzındaki baklayı çıkarmak / sırrı ifşa etmek",
        "🫘"
      ],
      [
        "blessing in disguise",
        "gizli bir lütuf / şer görünen hayır",
        "🎭"
      ],
      [
        "hit the nail on the head",
        "tam üstüne basmak / taşı gediğine koymak",
        "🔨"
      ],
      [
        "on thin ice",
        "riskli sularda yüzmek / bıçak sırtında olmak",
        "🧊"
      ],
      [
        "through the grapevine",
        "kulaktan kulağa / dedikodu yoluyla",
        "🍇"
      ]
    ]
  },
  {
    "id": "b2_non_defining_rel",
    "level": "B2",
    "type": "grammar",
    "title": "Non-defining Relative Clauses",
    "en": "Non-defining Relative Clauses (Extra Information)",
    "emoji": "📝",
    "explain": "<h4>Ek Bilgi Veren Sıfat Cümlecikleri: Non-defining Relative Clauses</h4>\n<p><b>Kritik İpucu (Virgül ve \"That\" Yasağı):</b> Zaten bilinen bir isim hakkında <i>ekstra, zorunlu olmayan bilgi</i> verir. Cümleden çıkarıldığında ana anlam bozulmaz.</p>\n<table class=\"g-table\">\n  <tr><th>Kural</th><th>Açıklama</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Virgül Zorunludur</b></td><td>Cümlecik iki virgül arasına alınır</td><td>My brother<b>, who lives in Sydney,</b> is an engineer.</td></tr>\n  <tr><td><b>\"THAT\" ASLA Kullanılamaz!</b></td><td>Sadece who, which, whose, where gelir</td><td>The Mona Lisa<b>, which was painted by Da Vinci,</b> is in Paris.</td></tr>\n  <tr><td><b>Cümleyi Niteleyen Which</b></td><td>Virgülden sonra gelip tüm bir cümleyi niteler</td><td>He failed his exam<b>, which surprised everyone</b>.</td></tr>\n</table>",
    "examples": [
      [
        "Albert Einstein, who was born in Germany, revolutionized modern physics.",
        "Almanya'da doğan Albert Einstein, modern fizikte devrim yaptı."
      ],
      [
        "The head office, which is located in Geneva, will be renovated.",
        "Cenevre'de bulunan genel merkez restore edilecek."
      ],
      [
        "She decided to resign from the committee, which shocked all the board members.",
        "Kuruldan istifa etmeye karar verdi, ki bu tüm yönetim kurulu üyelerini şok etti."
      ]
    ],
    "mc": [
      [
        "William Shakespeare, ___ plays are performed globally, was born in Stratford.",
        [
          "whose",
          "who",
          "that"
        ]
      ],
      [
        "My MacBook, ___ I bought three years ago, still runs flawlessly.",
        [
          "which",
          "that",
          "who"
        ]
      ],
      [
        "He refused to apologize to the customer, ___ made the dispute worse.",
        [
          "which",
          "that",
          "what"
        ]
      ],
      [
        "London, ___ over eight million people live, is a major financial hub.",
        [
          "where",
          "which",
          "that"
        ]
      ],
      [
        "The Louvre Museum, ___ attracts millions of visitors, houses famous masterpieces.",
        [
          "which",
          "that",
          "where"
        ]
      ]
    ],
    "order": [
      [
        "My brother who lives in Canada is visiting us next week",
        "Kanada'da yaşayan kardeşim gelecek hafta bizi ziyaret ediyor."
      ],
      [
        "The painting which was stolen last year was recovered yesterday",
        "Geçen yıl çalınan tablo dün bulundu."
      ],
      [
        "He arrived late for the interview which disappointed the director",
        "Mülakata geç kaldı ki bu yöneticiyi hayal kırıklığına uğrattı."
      ]
    ]
  },
  {
    "id": "b2_journalism_ethics",
    "level": "B2",
    "type": "vocab",
    "title": "Medya Etiği ve Araştırmacı Gazetecilik",
    "en": "Journalism & Media Ethics",
    "emoji": "📰",
    "words": [
      [
        "censorship",
        "sansür",
        "✂️"
      ],
      [
        "propaganda",
        "propaganda / algı yönetimi",
        "📢"
      ],
      [
        "defamation",
        "karalama / iftira",
        "⚖️"
      ],
      [
        "integrity",
        "dürüstlük / mesleki ahlak",
        "💎"
      ],
      [
        "whistleblower",
        "içeriden bilgi sızdıran / ifşacı",
        "🗣️"
      ],
      [
        "investigative",
        "araştırmacı (gazetecilik)",
        "🕵️"
      ],
      [
        "misinformation",
        "yanıltıcı bilgi / dezenformasyon",
        "❌"
      ],
      [
        "unbiased",
        "tarafsız / objektif",
        "⚖️"
      ],
      [
        "sensationalism",
        "sansasyonellik / tiraj avcılığı",
        "💥"
      ],
      [
        "credibility",
        "güvenilirlik / itibar",
        "🤝"
      ],
      [
        "editorial",
        "başyazı / editör yorumu",
        "🖋️"
      ],
      [
        "source",
        "haber kaynağı",
        "📑"
      ]
    ]
  },
  {
    "id": "b2_perfect_modals",
    "level": "B2",
    "type": "grammar",
    "title": "Perfect Modals",
    "en": "Past Modals of Deduction & Regret",
    "emoji": "🔍",
    "explain": "<h4>Geçmiş Çıkarımlar ve Eleştiriler: Modal + have + V3</h4>\n<p><b>Kritik İpucu (Geçmişe Yönelik Çıkarım ve Pişmanlık):</b> Geçmişte olmuş olaylar hakkında mantıksal tahmin yürütürken veya pişmanlık/eleştiri yaparken kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Modal</th><th>Anlam</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>must have V3</b></td><td>Geçmişe yönelik kesin çıkarım (\"Kesinlikle yapmıştır\")</td><td>The streets are wet. It <b>must have rained</b>.</td></tr>\n  <tr><td><b>can't / couldn't have V3</b></td><td>Geçmişe yönelik imkansızlık (\"Yapmış olması imkansız\")</td><td>He was in Paris. He <b>can't have committed</b> the crime.</td></tr>\n  <tr><td><b>should have V3</b></td><td>Geçmişe yönelik pişmanlık / eleştiri (\"Yapsaydın iyi olurdu\")</td><td>You <b>should have told</b> me the truth.</td></tr>\n  <tr><td><b>might / could have V3</b></td><td>Geçmişe yönelik ihtimal (\"Yapmış olabilir\")</td><td>She <b>might have forgotten</b> her phone at home.</td></tr>\n</table>",
    "examples": [
      [
        "He got a perfect score on the exam; he must have studied really hard.",
        "Sınavdan tam not aldı; kesinlikle çok sıkı çalışmış olmalı."
      ],
      [
        "You should have called an ambulance immediately!",
        "Derhal bir ambulans çağırmalıydın (ama çağırmadın)!"
      ],
      [
        "She can't have sent that email; she doesn't even have an account.",
        "O e-postayı onun göndermiş olması imkansız; hesabı bile yok."
      ]
    ],
    "mc": [
      [
        "The front door was wide open when I arrived. The burglar ___ through it.",
        [
          "must have entered",
          "should enter",
          "can enter"
        ]
      ],
      [
        "I failed my driving test yesterday. I ___ more lessons.",
        [
          "should have taken",
          "must take",
          "can have taken"
        ]
      ],
      [
        "She ___ that expensive handbag; she is in serious debt!",
        [
          "couldn't have bought",
          "must buy",
          "should buy"
        ]
      ],
      [
        "Where is my passport? I ___ it in the hotel room.",
        [
          "might have left",
          "should leave",
          "must leave to"
        ]
      ],
      [
        "You ___ your secret to him; he told everybody!",
        [
          "shouldn't have told",
          "mustn't tell",
          "can't tell"
        ]
      ]
    ],
    "order": [
      [
        "He must have left his keys in the car",
        "Anahtarlarını arabada unutmuş olmalı."
      ],
      [
        "You should have checked the tire pressure before leaving",
        "Yola çıkmadan önce lastik basıncını kontrol etmeliydin."
      ],
      [
        "They cannot have finished the whole project already",
        "Bütün projeyi şimdiden bitirmiş olmaları imkansız."
      ]
    ]
  },
  {
    "id": "b2_science_innovation",
    "level": "B2",
    "type": "vocab",
    "title": "Bilimsel İnovasyon ve Keşifler",
    "en": "Scientific Innovation",
    "emoji": "🔬",
    "words": [
      [
        "hypothesis",
        "hipotez / bilimsel varsayım",
        "💡"
      ],
      [
        "empirical",
        "deneysel / ampirik kanıta dayalı",
        "📊"
      ],
      [
        "paradigm",
        "paradigma / düşünce modeli",
        "🌀"
      ],
      [
        "phenomenon",
        "fenomen / doğa olayı",
        "⚡"
      ],
      [
        "catalyst",
        "katalizör / hızlandırıcı etken",
        "🧪"
      ],
      [
        "quantum",
        "kuantum",
        "⚛️"
      ],
      [
        "genome",
        "genom / genetik harita",
        "🧬"
      ],
      [
        "synthesize",
        "sentezlemek / birleştirmek",
        "🔬"
      ],
      [
        "velocity",
        "vektörel hız / sürat",
        "🚀"
      ],
      [
        "radiation",
        "radyasyon / ışıma",
        "☢️"
      ],
      [
        "fusion",
        "füzyon / nükleer kaynaşma",
        "☀️"
      ],
      [
        "correlation",
        "korelasyon / karşılıklı ilişki",
        "📈"
      ]
    ]
  },
  {
    "id": "b2_causatives",
    "level": "B2",
    "type": "grammar",
    "title": "Causatives (Ettirgen Yapı)",
    "en": "Causatives (have/get something done, make, let)",
    "emoji": "🛠️",
    "explain": "<h4>Ettirgen Yapı: Bir Şeyi Başkasına Yaptırmak</h4>\n<p><b>Kritik İpucu (Have / Get / Make / Let Ayrımı):</b></p>\n<table class=\"g-table\">\n  <tr><th>Kalıp</th><th>İşlev</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>have / get + nesne + V3</b></td><td>Bir hizmeti veya işi bir uzmana yaptırmak</td><td>I <b>had my hair cut</b> yesterday.</td></tr>\n  <tr><td><b>make + kişi + V1 (yalın)</b></td><td>Birini bir şey yapmaya zorlamak / mecbur bırakmak</td><td>The boss <b>made us work</b> overtime.</td></tr>\n  <tr><td><b>let + kişi + V1 (yalın)</b></td><td>Birine bir şey yapması için izin vermek</td><td>My parents <b>let me stay</b> out late.</td></tr>\n  <tr><td><b>get + kişi + to V1</b></td><td>Birini ikna ederek bir şey yaptırmak</td><td>I <b>got my friend to help</b> me move.</td></tr>\n</table>",
    "examples": [
      [
        "I must have my car serviced before our long road trip.",
        "Uzun yolculuğumuzdan önce arabamı servise sokturmalıyım."
      ],
      [
        "The coach made the players run five miles every morning.",
        "Antrenör oyunculara her sabah beş mil koşturdu."
      ],
      [
        "She got the technician to fix her laptop in one hour.",
        "Teknisyeni ikna edip dizüstü bilgisayarını bir saatte tamir ettirdi."
      ]
    ],
    "mc": [
      [
        "I went to the dentist this morning to have my tooth ___.",
        [
          "extracted",
          "extracting",
          "extract"
        ]
      ],
      [
        "The strict teacher made the students ___ their cell phones in a box.",
        [
          "leave",
          "to leave",
          "leaving"
        ]
      ],
      [
        "Our company lets employees ___ from home on Fridays.",
        [
          "work",
          "to work",
          "working"
        ]
      ],
      [
        "He got his brother ___ his university application letter.",
        [
          "to review",
          "review",
          "reviewed"
        ]
      ],
      [
        "We are going to have our living room ___ this weekend.",
        [
          "painted",
          "paint",
          "painting"
        ]
      ]
    ],
    "order": [
      [
        "I had my car repaired by an expert yesterday",
        "Dün arabamı bir uzmana tamir ettirdim."
      ],
      [
        "The teacher made the students rewrite the essay",
        "Öğretmen öğrencilere makaleyi baştan yazdırdı."
      ],
      [
        "She got her assistant to schedule the meeting",
        "Asistanına toplantıyı planlattı."
      ]
    ]
  },
  {
    "id": "b2_academic_formal",
    "level": "B2",
    "type": "vocab",
    "title": "Akademik ve Resmi Yazışma Dili",
    "en": "Academic & Formal Writing",
    "emoji": "🖋️",
    "words": [
      [
        "furthermore",
        "dahası / üstelik / ayrıca",
        "➕"
      ],
      [
        "consequently",
        "sonuç olarak / bu nedenle",
        "➡️"
      ],
      [
        "notwithstanding",
        "buna rağmen / -e karşın",
        "🛡️"
      ],
      [
        "demonstrate",
        "ortaya koymak / kanıtlamak",
        "🔍"
      ],
      [
        "substantial",
        "kayda değer / önemli miktarda",
        "📈"
      ],
      [
        "advocate",
        "savunmak / desteklemek",
        "🗣️"
      ],
      [
        "implement",
        "yürürlüğe koymak / uygulamak",
        "⚙️"
      ],
      [
        "preliminary",
        "ön / başlangıç niteliğinde",
        "🚦"
      ],
      [
        "facilitate",
        "kolaylaştırmak / olanak sağlamak",
        "🤝"
      ],
      [
        "comprehensive",
        "kapsamlı / etraflı",
        "📚"
      ],
      [
        "discrepancy",
        "tutarsızlık / uyumsuzluk",
        "❓"
      ],
      [
        "feasible",
        "uygulanabilir / yapılabilir",
        "✅"
      ]
    ]
  },
  {
    "id": "b2_inversion",
    "level": "B2",
    "type": "grammar",
    "title": "Inversion (Devrik Cümleler)",
    "en": "Inversion (Negative Adverbials & Emphasis)",
    "emoji": "⚡",
    "explain": "<h4>Edebi ve Vurgulu Anlatım: Devrik Cümleler (Inversion)</h4>\n<p><b>Kritik İpucu (Soru Cümlesi Gibi Dizilim):</b> Cümleye olumsuz veya kısıtlayıcı bir zarfla başlandığında, cümle sanki soru cümlesiymiş gibi yardımcı fiil öznenin önüne geçer.</p>\n<table class=\"g-table\">\n  <tr><th>Zarf</th><th>Normal Cümle</th><th>Devrik Cümle (Inversion)</th></tr>\n  <tr><td><b>Never</b></td><td>I have never heard such nonsense.</td><td><b>Never have I heard</b> such nonsense.</td></tr>\n  <tr><td><b>Rarely / Seldom</b></td><td>We rarely see such dedication.</td><td><b>Rarely do we see</b> such dedication.</td></tr>\n  <tr><td><b>No sooner... than</b></td><td>He had no sooner left than it rained.</td><td><b>No sooner had he left than</b> it started raining.</td></tr>\n  <tr><td><b>Under no circumstances</b></td><td>You must not touch this button.</td><td><b>Under no circumstances should you touch</b> this button.</td></tr>\n  <tr><td><b>Hardly... when</b></td><td>She had hardly arrived when he called.</td><td><b>Hardly had she arrived when</b> the phone rang.</td></tr>\n</table>",
    "examples": [
      [
        "Rarely have I witnessed such an extraordinary musical performance.",
        "Nadiren bu denli olağanüstü bir müzik performansına şahit oldum."
      ],
      [
        "No sooner had they launched the product than orders flooded in.",
        "Ürünü piyasaya sürer sürmez siparişler yağdı."
      ],
      [
        "Under no circumstances should personal confidential data be leaked.",
        "Hiçbir koşul altında kişisel gizli veriler sızdırılmamalıdır."
      ]
    ],
    "mc": [
      [
        "Seldom ___ such an inspiring speaker at an international conference.",
        [
          "have I heard",
          "I have heard",
          "did I heard"
        ]
      ],
      [
        "No sooner had the plane landed ___ the passengers stood up.",
        [
          "than",
          "when",
          "that"
        ]
      ],
      [
        "Hardly ___ the door when the fire alarm started blaring.",
        [
          "had he opened",
          "he opened",
          "has he opened"
        ]
      ],
      [
        "Under no circumstances ___ staff members accept cash gifts from clients.",
        [
          "should",
          "ought",
          "have to"
        ]
      ],
      [
        "Only after the investigation concluded ___ the truth emerge.",
        [
          "did",
          "was",
          "had"
        ]
      ]
    ],
    "order": [
      [
        "Never have I witnessed such a magnificent sunset",
        "Asla bu kadar görkemli bir gün batımına şahit olmamıştım."
      ],
      [
        "Rarely do we encounter such dedicated professionals",
        "Bu kadar özverili profesyonellerle nadiren karşılaşırız."
      ],
      [
        "No sooner had we arrived than it started pouring",
        "Biz varır varmaz bardaktan boşanırcasına yağmur başladı."
      ]
    ]
  },
  {
    "id": "b2_sophisticated_adjectives",
    "level": "B2",
    "type": "vocab",
    "title": "Sofistike ve Nüanslı Sıfatlar",
    "en": "Sophisticated Adjectives",
    "emoji": "💎",
    "words": [
      [
        "meticulous",
        "titiz / kılı kırk yaran",
        "🔍"
      ],
      [
        "ubiquitous",
        "her yerde hazır ve nazır olan",
        "🌐"
      ],
      [
        "pragmatic",
        "pratik / faydacı yaklaşan",
        "🛠️"
      ],
      [
        "eloquent",
        "etkili konuşan / beliğ",
        "🎙️"
      ],
      [
        "vulnerable",
        "savunmasız / kırılgan",
        "🛡️"
      ],
      [
        "ambiguous",
        "çift anlamlı / muğlak",
        "🌫️"
      ],
      [
        "volatile",
        "oynak / dengesiz / değişken",
        "💥"
      ],
      [
        "resilient",
        "zorluklara göğüs geren / dirençli",
        "🌱"
      ],
      [
        "superfluous",
        "gereksiz / fuzuli / fazlalık",
        "🗑️"
      ],
      [
        "indispensable",
        "vazgeçilmez / olmazsa olmaz",
        "🔑"
      ],
      [
        "lucid",
        "açık seçik / berrak zihinli",
        "✨"
      ],
      [
        "spontaneous",
        "anlık / kendiliğinden gelişen",
        "⚡"
      ]
    ]
  },
  {
    "id": "b2_adv_gerund_inf",
    "level": "B2",
    "type": "grammar",
    "title": "Advanced Gerunds & Infinitives",
    "en": "Verbs Changing Meaning with Gerund vs Infinitive",
    "emoji": "🔄",
    "explain": "<h4>Anlamı Değişen Fiiller: Gerund vs Infinitive</h4>\n<p><b>Kritik İpucu (Stop, Remember, Regret, Try):</b> Bazı fiiller hem -ing hem de to alabilir; fakat aldıkları eke göre anlam tamamen değişir!</p>\n<table class=\"g-table\">\n  <tr><th>Fiil</th><th>+ Gerund (-ing) Anlamı</th><th>+ Infinitive (to V) Anlamı</th></tr>\n  <tr><td><b>stop</b></td><td>Bir alışkanlığı tamamen bırakmak (stop smoking)</td><td>Başka bir şey yapmak için duraklamak (stop to smoke)</td></tr>\n  <tr><td><b>remember</b></td><td>Geçmişte yapılan bir anıyı hatırlamak (I remember meeting him)</td><td>Gelecekte yapmayı unutmamak (Remember to lock the door)</td></tr>\n  <tr><td><b>regret</b></td><td>Geçmişte yapılan bir şeye pişman olmak (I regret saying that)</td><td>Üzülerek bir kötü haber bildirmek (I regret to inform you...)</td></tr>\n  <tr><td><b>try</b></td><td>Bir yöntemi denemek / tecrübe etmek (Try taking an aspirin)</td><td>Çaba sarf etmek / gayret göstermek (Try to lift this box)</td></tr>\n  <tr><td><b>forget</b></td><td>Geçmişte yapılan bir anıyı unutmak (I'll never forget seeing Paris)</td><td>Yapılacak bir görevi unutmak (Don't forget to pay the bill)</td></tr>\n</table>",
    "examples": [
      [
        "He stopped smoking ten years ago.",
        "On yıl önce sigarayı bıraktı (alışkanlığı terk etti)."
      ],
      [
        "He was driving home, but he stopped to buy flowers.",
        "Eve sürüyordu, ama çiçek almak için durdu (ara verdi)."
      ],
      [
        "I clearly remember turning off the oven before leaving.",
        "Çıkmadan önce fırını kapattığımı net olarak hatırlıyorum."
      ]
    ],
    "mc": [
      [
        "I deeply regret ___ that rude comment during the meeting.",
        [
          "making",
          "to make",
          "make"
        ]
      ],
      [
        "We regret ___ you that your application has been unsuccessful.",
        [
          "to inform",
          "informing",
          "inform"
        ]
      ],
      [
        "Please remember ___ the alarm before going to bed.",
        [
          "to set",
          "setting",
          "set"
        ]
      ],
      [
        "I will never forget ___ the Northern Lights in Norway.",
        [
          "seeing",
          "to see",
          "see"
        ]
      ],
      [
        "If your computer is freezing, try ___ it.",
        [
          "restarting",
          "to restart",
          "restart"
        ]
      ]
    ],
    "order": [
      [
        "He stopped smoking because of his health condition",
        "Sağlık durumundan ötürü sigarayı bıraktı."
      ],
      [
        "Please remember to turn off the lights before leaving",
        "Lütfen çıkmadan önce ışıkları kapatmayı unutmayın."
      ],
      [
        "I will never forget meeting you for the first time",
        "Seninle ilk kez tanıştığım anı asla unutmayacağım."
      ]
    ]
  },
  {
    "id": "b2_rhetoric_debate",
    "level": "B2",
    "type": "vocab",
    "title": "Hitabet, Retorik ve Argüman",
    "en": "Rhetoric, Debate & Persuasion",
    "emoji": "🎙️",
    "words": [
      [
        "persuasion",
        "ikna kabiliyeti",
        "🧠"
      ],
      [
        "fallacy",
        "mantık hatası / safsata",
        "⚠️"
      ],
      [
        "assertion",
        "iddia / sav",
        "📌"
      ],
      [
        "refute",
        "çürütmek / aksini ispatlamak",
        "🥊"
      ],
      [
        "anecdote",
        "kısa anekdot / ibretli hikaye",
        "📖"
      ],
      [
        "consensus",
        "ortak mutabakat / fikir birliği",
        "🤝"
      ],
      [
        "counterargument",
        "karşı sav / antitez",
        "🛡️"
      ],
      [
        "hyperbole",
        "mübalağa / abartı sanatı",
        "🔍"
      ],
      [
        "articulate",
        "düşüncelerini akıcı ve net ifade etmek",
        "🗣️"
      ],
      [
        "credibility",
        "inandırıcılık / güvenilirlik",
        "⭐"
      ],
      [
        "rebuttal",
        "itiraz / savunma cevabı",
        "⚖️"
      ],
      [
        "standpoint",
        "görüş açısı / duruş noktası",
        "🔭"
      ]
    ]
  },
  {
    "id": "b2_noun_clauses_reporting",
    "level": "B2",
    "type": "grammar",
    "title": "Noun Clauses & Reporting Verbs",
    "en": "Noun Clauses & Advanced Reporting Verbs",
    "emoji": "🗣️",
    "explain": "<h4>Gelişmiş Aktarma Fiilleri ve İsim Cümlecikleri</h4>\n<p><b>Kritik İpucu (Subjunctive ve Özel Edatlar):</b> Sadece \"said\" veya \"told\" demek yerine; <i>suggest, insist, deny, admit, recommend</i> gibi fiiller kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Fiil Kalıbı</th><th>Kural</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>suggest / recommend that + özne + V1 (yalın)</b></td><td>Subjunctive kipi: tekil öznelerde dahi fiil ek almaz!</td><td>The doctor recommended that he <b>take</b> a week off.</td></tr>\n  <tr><td><b>insist on + V-ing</b></td><td>Bir konuda ısrar etmek</td><td>He insisted <b>on paying</b> for the entire meal.</td></tr>\n  <tr><td><b>deny / admit + V-ing (veya having V3)</b></td><td>İnkar etmek veya itiraf etmek</td><td>The suspect denied <b>having stolen</b> the diamonds.</td></tr>\n  <tr><td><b>Noun Clause as Subject</b></td><td>What / Whether / How ile cümle başı</td><td><b>What surprised me most</b> was his calm reaction.</td></tr>\n</table>",
    "examples": [
      [
        "The committee demanded that the minister resign immediately.",
        "Komite, bakanın derhal istifa etmesini talep etti (Subjunctive)."
      ],
      [
        "She admitted having made a grave calculation error.",
        "Ağır bir hesaplama hatası yaptığını itiraf etti."
      ],
      [
        "What we need right now is a concrete plan of action.",
        "Şu anda ihtiyacımız olan şey somut bir eylem planıdır."
      ]
    ],
    "mc": [
      [
        "The financial advisor suggested that she ___ her portfolio.",
        [
          "diversify",
          "diversifies",
          "diversified"
        ]
      ],
      [
        "He vehemently denied ___ any confidential company files.",
        [
          "leaking",
          "to leak",
          "leak"
        ]
      ],
      [
        "The lawyer insisted on ___ the witness in court again.",
        [
          "questioning",
          "to question",
          "question"
        ]
      ],
      [
        "The CEO proposed that the board ___ the merger offer.",
        [
          "accept",
          "accepts",
          "accepted"
        ]
      ],
      [
        "___ impressed the interviewer was her fluency in three languages.",
        [
          "What",
          "Which",
          "That"
        ]
      ]
    ],
    "order": [
      [
        "The doctor recommended that he take a few days off",
        "Doktor onun birkaç gün izin almasını tavsiye etti."
      ],
      [
        "He denied having any involvement in the financial scandal",
        "Mali skandalla herhangi bir ilgisi olduğunu inkar etti."
      ],
      [
        "What surprised everyone was her unexpected announcement",
        "Herkesi şaşırtan şey onun beklenmedik duyurusu oldu."
      ]
    ]
  },
  {
    "id": "b2_participle_clauses",
    "level": "B2",
    "type": "grammar",
    "title": "Participle Clauses",
    "en": "Participle Clauses (Present & Past Participle)",
    "emoji": "✂️",
    "explain": "<h4>Cümle Kısaltmaları: Participle Clauses</h4>\n<p><b>Kritik İpucu (Having done, Doing, Done):</b> Cümleleri daha akıcı ve edebi kılmak için bağlaç ve özne atılarak fiil ortaca dönüştürülür.</p>\n<table class=\"g-table\">\n  <tr><th>Kalıp</th><th>Açılımı (Normal Cümle)</th><th>Kısaltılmış Hali (Participle Clause)</th></tr>\n  <tr><td><b>Present Participle (V-ing)</b></td><td>Because he was tired, he fell asleep.</td><td><b>Feeling tired</b>, he fell asleep.</td></tr>\n  <tr><td><b>Perfect Participle (Having V3)</b></td><td>After she had finished her degree, she moved.</td><td><b>Having completed her degree</b>, she moved to Berlin.</td></tr>\n  <tr><td><b>Past Participle (V3 - Edilgen)</b></td><td>Because it was built in 1900, the bridge is old.</td><td><b>Built in 1900</b>, the bridge is an architectural marvel.</td></tr>\n</table>\n<p>⚠️ <i>Dangling modifier tuzağı: Kısaltmadaki eylemi ana cümlenin öznesi yapmalıdır!</i></p>",
    "examples": [
      [
        "Having worked all day in the hot sun, the laborers were exhausted.",
        "Bütün gün sıcak güneşte çalışmış olan işçiler bitkindi."
      ],
      [
        "Seen from space, our planet appears as a fragile blue marble.",
        "Uzaydan bakıldığında gezegenimiz kırılgan mavi bir misket gibi görünür."
      ],
      [
        "Realizing he was late, he quickly caught a taxi.",
        "Geç kaldığını fark ederek hızla bir taksiye bindi."
      ]
    ],
    "mc": [
      [
        "___ all his savings, he had to apply for a bank loan.",
        [
          "Having lost",
          "Losing",
          "Lost"
        ]
      ],
      [
        "___ by world-renowned architects, the library opened last week.",
        [
          "Designed",
          "Designing",
          "Having designed"
        ]
      ],
      [
        "___ left alone in the dark room, the child began to cry.",
        [
          "Being",
          "Be",
          "Having"
        ]
      ],
      [
        "___ his passport in his pocket, he approached the border gate.",
        [
          "Holding",
          "Held",
          "Hold"
        ]
      ],
      [
        "___ no money left, we decided to walk back to our hotel.",
        [
          "Having",
          "Had",
          "Have"
        ]
      ]
    ],
    "order": [
      [
        "Having finished his degree he applied for several jobs",
        "Diplomasını bitirdikten sonra birçok işe başvurdu."
      ],
      [
        "Seen from above the ancient city looks spectacular",
        "Yukarıdan bakıldığında antik şehir muhteşem görünüyor."
      ],
      [
        "Hearing the loud explosion everyone ran outside immediately",
        "Büyük patlamayı duyan herkes derhal dışarı koştu."
      ]
    ]
  },
  {
    "id": "b2_academic_linkers",
    "level": "B2",
    "type": "grammar",
    "title": "Akademik ve İleri Bağlaçlar",
    "en": "Advanced Linkers & Conjunctions",
    "emoji": "🔗",
    "explain": "<h4>Zıtlık, Koşul ve Sebep Bağlaçları: İleri Düzey Nüanslar</h4>\n<p><b>Kritik İpucu (Gramer Yapısı Ayrımı):</b> Bir bağlacın ardından <i>cümle (Özne + Yüklem)</i> mi yoksa <i>isim öbeği (Noun Phrase / V-ing)</i> mi geldiği hayati önem taşır.</p>\n<table class=\"g-table\">\n  <tr><th>Bağlaç</th><th>Ardından Ne Gelir?</th><th>İşlev</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Despite / In spite of</b></td><td>+ Noun / Gerund (-ing)</td><td>Zıtlık (\"-e rağmen\")</td><td><b>Despite the heavy rain</b>, we went out.</td></tr>\n  <tr><td><b>Although / Whereas</b></td><td>+ Tam Cümle (S + V)</td><td>Zıtlık / Karşılaştırma</td><td>He loves cities, <b>whereas I prefer</b> nature.</td></tr>\n  <tr><td><b>Provided that / As long as</b></td><td>+ Tam Cümle (S + V)</td><td>Şart / Koşul (\"-ması şartıyla\")</td><td>You can borrow my car <b>provided that you drive</b> safely.</td></tr>\n  <tr><td><b>Nonetheless / Nevertheless</b></td><td>Noktalama sonrası bağımsız</td><td>Zıtlık (\"Yine de / Buna karşın\")</td><td>It was freezing; <b>nonetheless,</b> they continued.</td></tr>\n</table>",
    "examples": [
      [
        "In spite of facing severe obstacles, she founded a unicorn startup.",
        "Ağır engellerle karşılaşmasına rağmen milyar dolarlık bir girişim kurdu."
      ],
      [
        "Some countries invest heavily in solar energy, whereas others rely on coal.",
        "Bazı ülkeler güneş enerjisine yoğun yatırım yaparken, diğerleri kömüre bağımlı kalıyor."
      ],
      [
        "You will pass the rigorous exam, provided that you follow the study plan.",
        "Çalışma planına sadık kalman şartıyla bu zorlu sınavı geçersin."
      ]
    ],
    "mc": [
      [
        "___ the economic recession, our company achieved record export figures.",
        [
          "Despite",
          "Although",
          "Whereas"
        ]
      ],
      [
        "Some students prefer studying in silence, ___ others thrive with music.",
        [
          "whereas",
          "despite",
          "in spite of"
        ]
      ],
      [
        "You can use the advanced lab equipment ___ that you wear safety goggles.",
        [
          "provided",
          "despite",
          "nonetheless"
        ]
      ],
      [
        "The weather was terrible; ___, the outdoor music festival went ahead.",
        [
          "nevertheless",
          "although",
          "in spite of"
        ]
      ],
      [
        "___ possessing immense natural resources, the region struggles with poverty.",
        [
          "In spite of",
          "Whereas",
          "Provided that"
        ]
      ]
    ],
    "order": [
      [
        "Despite the heavy snow the international flight departed on time",
        "Yoğun kara rağmen uluslararası uçuş zamanında kalktı."
      ],
      [
        "You can borrow my car provided that you drive carefully",
        "Dikkatli sürmen şartıyla arabamı ödünç alabilirsin."
      ],
      [
        "He loves living in cities whereas she prefers the countryside",
        "O şehirlerde yaşamayı severken o ise kırsalı tercih ediyor."
      ]
    ]
  }

];

/* ---------- CEFR Seviyeleri ---------- */
const LEVELS = [
  { id: 'A1', name: 'A1 Başlangıç (Beginner)', emoji: '🌱', desc: 'Temel kelimeler, tanışma ve günlük yaşam.', count: 27 },
  { id: 'A2', name: 'A2 Temel Akıcılık (Elementary)', emoji: '🚀', desc: 'Geçmiş zaman, gelecek planları, seyahat ve alışveriş.', count: 25 },
  { id: 'B1', name: 'B1 Bağımsız İletişim (Intermediate)', emoji: '⚡', desc: 'Edilgen çatı, dolaylı anlatım, koşul cümleleri ve kariyer.', count: 22 },
  { id: 'B2', name: 'B2 İleri Düzey Yetkinlik (Upper-Intermediate)', emoji: '👑', desc: 'Devrik cümleler, nüanslar, deyimler ve akıcı argüman.', count: 23 }
];

/* ---------- Normalize ---------- */
const UNITS = RAW_UNITS.map((u, i) => {
  const level = u.level || (i < 27 ? 'A1' : 'A2');
  const unit = { ...u, level, index: i, color: u.type === 'vocab' ? 'var(--cat-kelime)' : 'var(--cat-gramer)' };
  if (u.type === 'vocab') {
    unit.words = u.words.map(([en, tr, emoji]) => ({ en, tr, emoji, key: `${u.id}:${en}`, unitId: u.id, level }));
  }
  return unit;
});

const UNIT_BY_ID = Object.fromEntries(UNITS.map(u => [u.id, u]));
const WORD_BY_KEY = {};
UNITS.forEach(u => (u.words || []).forEach(w => { WORD_BY_KEY[w.key] = w; }));
const ALL_WORDS = Object.values(WORD_BY_KEY);

/* ---------- Yoldaş Hayvanlar (Mascots - 3 Özel Karakter) ---------- */
const MASCOTS = [
  {
    id: 'squirrel',
    name: 'Fındık',
    animal: 'Sincap',
    icon: '🐿️',
    itemIcon: '🌰',
    itemName: 'Palamut',
    itemsName: 'Palamut',
    vaultName: 'Palamut Zulası',
    feedAction: '🌰 Palamut Ver',
    fedToast: '🐿️ Fındık palamudunu afiyetle yedi!',
    vaultDesc: 'Sincaplar kış için gömdükleri palamutları unutur! Fındık bu kelimeleri unutmadan zuladan çıkarıp tazeleyelim.',
    vaultEmptyDesc: 'Fındık tüm palamutların yerini çok iyi hatırlıyor! Dilediğin an serbest tekrar yapabilirsin.',
    motto: 'Yavrudan büyüyen, kelime ve gramerde sana yardım eden akıllı sincap yoldaşın!',
    perk: 'Canlı Ders & Kelime Yardımı',
    stages: [
      { stage: 1, id: 'baby', title: 'Minik Yavru Sincap', badge: '🍼 Evre 1/5', minXP: 0, nextXP: 100, perkTitle: 'Kelime Fısıltısı', desc: 'İlk İngilizce kelimeleri seninle keşfediyor.' },
      { stage: 2, id: 'explorer', title: 'Meraklı Kaşif Sincap', badge: '🌿 Evre 2/5', minXP: 100, nextXP: 300, perkTitle: 'Gramer Desteği', desc: 'Yeni cümle yapılarını merakla inceliyor.' },
      { stage: 3, id: 'student', title: 'Usta Palamutçu Sincap', badge: '🌰 Evre 3/5', minXP: 300, nextXP: 700, perkTitle: 'Hızlı İpucu', desc: 'Zorlu testlerde anında taktik veriyor.' },
      { stage: 4, id: 'scholar', title: 'Bilge Orman Rehberi', badge: '🎓 Evre 4/5', minXP: 700, nextXP: 1500, perkTitle: 'Hafıza Kalkanı', desc: 'Kelimeleri kalıcı hafızaya mühürlüyor.' },
      { stage: 5, id: 'master', title: 'Efsanevi Meşe Muhafızı', badge: '👑 Evre 5/5', minXP: 1500, nextXP: null, perkTitle: 'Akıcı İngilizce Ustası', desc: 'Tüm A1 & A2 kelimelerine tamamen hakim!' }
    ],
    encouragements: [
      { en: "Ready to collect new words today? Let's grow together! 🌰", tr: "Fındık hazır! Sen yeni kelimeler öğrendikçe ben de büyüyorum!" },
      { en: "Need a hint on a tricky word or grammar rule? Just ask me! 🐿️", tr: "Zor bir kelimede takılırsan bana tıkla, hemen ipucu vereyim!" },
      { en: "Quick thinking shines with daily practice! You rock! ⚡", tr: "Pratik zeka pratik yaparak parlar! Sen harikasın!" },
      { en: "English becomes fluent with just five minutes a day! 🚀", tr: "İngilizce her gün sadece 5 dakikayla akıcı hale gelir!" },
      { en: "Together we add every new word into our acorn chest! 🌰", tr: "Öğrendiğin her yeni kelimeyi palamut zulamıza ekliyoruz!" }
    ]
  },
  {
    id: 'cat',
    name: 'Pamuk',
    animal: 'Kedi',
    icon: '🐱',
    itemIcon: '🧶',
    itemName: 'Yün Yumağı',
    itemsName: 'Yumak',
    vaultName: 'Pati Sepeti',
    feedAction: '🥛 Süt Ver',
    fedToast: '🐱 Pamuk sütünü keyifle içti, mırıldıyor!',
    vaultDesc: 'Kediler meraklıdır! Pamuk ile sepetindeki yeni kelimeleri tazeleyip kalıcı hafızaya taşıyalım.',
    vaultEmptyDesc: 'Pamuk tüm kelimeleri pati gibi sağlam hatırlıyor! Dilediğin an serbest tekrar yapabilirsin.',
    motto: 'Çevik, meraklı ve hızla öğrenen sevimli kedi yoldaşın!',
    perk: 'Hızlı Seri & Kelime Avı',
    stages: [
      { stage: 1, id: 'baby', title: 'Minik Yavru Kedi', badge: '🍼 Evre 1/5', minXP: 0, nextXP: 100, perkTitle: 'Pati İpucu', desc: 'Dünyayı keşfeden minik ve meraklı bir kedi yavrusu.' },
      { stage: 2, id: 'explorer', title: 'Meraklı Avcı Kedi', badge: '🐾 Evre 2/5', minXP: 100, nextXP: 300, perkTitle: 'Kelime Avcısı', desc: 'Yeni İngilizce kelimeleri bir fare gibi ustalıkla yakalar.' },
      { stage: 3, id: 'student', title: 'Usta Yumakbaz Kedi', badge: '🧶 Evre 3/5', minXP: 300, nextXP: 700, perkTitle: 'Gramer Yumağı', desc: 'Cümle yapılarını yün yumağı gibi ustalıkla çözer.' },
      { stage: 4, id: 'scholar', title: 'Asil Salon Kedisi', badge: '🎩 Evre 4/5', minXP: 700, nextXP: 1500, perkTitle: 'Kusursuz Odak', desc: 'İngilizce konuşurken asaletini ve netliğini korur.' },
      { stage: 5, id: 'master', title: 'Efsanevi Pati Ustası', badge: '👑 Evre 5/5', minXP: 1500, nextXP: null, perkTitle: 'Akıcı Kedi Zekası', desc: 'Tüm dilde 9 canlı akıcılık ve ustalık!' }
    ],
    encouragements: [
      { en: "Never be afraid of making mistakes, learn by exploring! 🐾", tr: "Miyav! Hata yapmaktan asla korkma, keşfederek öğren!" },
      { en: "Did you catch a new word today? Let's add it to our yarn basket! 🧶", tr: "Bugün yeni bir kelime yakaladın mı? Hemen sepetimize ekleyelim!" },
      { en: "Five minutes of practice every day moves you forward! ✨", tr: "Her gün 5 dakikalık pratik seni dev adımlarla öne taşır!" },
      { en: "Small steps bring great success, I believe in you! 🌟", tr: "Küçük adımlar büyük başarılar getirir, sana güveniyorum!" }
    ]
  },
  {
    id: 'panda',
    name: 'Bambu',
    animal: 'Panda',
    icon: '🐼',
    itemIcon: '🎋',
    itemName: 'Bambu Filizi',
    itemsName: 'Filiz',
    vaultName: 'Bambu Bahçesi',
    feedAction: '🎋 Bambu Ver',
    fedToast: '🐼 Bambu taze filizleri afiyetle çıtırdatıyor!',
    vaultDesc: 'Pandalar sakin ve istikrarlıdır! Bambu ile taze kelime filizlerini toplayıp bilgini pekiştirelim.',
    vaultEmptyDesc: 'Bambu bahçesindeki tüm kelimeleri çok iyi hatırlıyor! Dilediğin an serbest tekrar yapabilirsin.',
    motto: 'Sakin, dengeli ve istikrarlı ritim ustası tatlı pandan!',
    perk: 'Stressiz ve Dengeli Öğrenme',
    stages: [
      { stage: 1, id: 'baby', title: 'Minik Yavru Panda', badge: '🍼 Evre 1/5', minXP: 0, nextXP: 100, perkTitle: 'Zen Dinginliği', desc: 'Stressiz, sakin ve neşeli ilk adımlar.' },
      { stage: 2, id: 'explorer', title: 'Neşeli Filiz Avcısı', badge: '🎋 Evre 2/5', minXP: 100, nextXP: 300, perkTitle: 'Dengeli Adımlar', desc: 'Her gün düzenli kelime filizleri toplar.' },
      { stage: 3, id: 'student', title: 'Usta Bambu Sever', badge: '🍃 Evre 3/5', minXP: 300, nextXP: 700, perkTitle: 'Hafıza Bahçesi', desc: 'Gramer yapılarını sağlam bambu kökleri gibi kavrar.' },
      { stage: 4, id: 'scholar', title: 'Denge & Odak Ustası', badge: '🥋 Evre 4/5', minXP: 700, nextXP: 1500, perkTitle: 'Kung-Fu İngilizce', desc: 'Zorlu soruları dingin zihniyle tek hamlede çözer.' },
      { stage: 5, id: 'master', title: 'Efsanevi Zen Üstadı', badge: '👑 Evre 5/5', minXP: 1500, nextXP: null, perkTitle: 'Kusursuz Ustalık', desc: 'Tamamen dengeli, akıcı ve dingin İngilizce ustalığı!' }
    ],
    encouragements: [
      { en: "No rush! Calm and steady steps bring real mastery! 🎋", tr: "Acele yok! Sakin ve dengeli adımlar kalıcı öğrenme sağlar!" },
      { en: "How about collecting fresh bamboo words today? 🐼", tr: "Bugün biraz çalışıp taze kelime filizleri toplamaya ne dersin?" },
      { en: "Every new word opens a new world, relax and enjoy! 🌸", tr: "Her kelime yeni bir dünya açar, rahat ol ve öğren!" },
      { en: "Consistency is your superpower! Step by step to the top! 🌟", tr: "İstikrar en büyük süper gücün! Adım adım zirveye!" }
    ]
  }
];
const MASCOT_BY_ID = Object.fromEntries(MASCOTS.map(m => [m.id, m]));

/* ---------- Sincap Yoldaş (Fındık) 5 Doğal Büyüme Evresi (Yavrudan Ustaya) ---------- */
const SQUIRREL_STAGES = [
  {
    stage: 1,
    id: 'baby',
    title: 'Minik Yavru Sincap',
    badge: '🍼 Evre 1/5',
    minXP: 0,
    nextXP: 100,
    perkTitle: 'Kelime & Telaffuz Fısıltısı',
    desc: 'Yuvasından yeni çıktı! İlk İngilizce kelimeleri seninle keşfediyor ve telaffuz ipuçları veriyor.'
  },
  {
    stage: 2,
    id: 'explorer',
    title: 'Meraklı Toplayıcı Sincap',
    badge: '🌰 Evre 2/5',
    minXP: 100,
    nextXP: 300,
    perkTitle: 'Kelime & Örnek Cümle Sepeti',
    desc: 'Büyüdü ve palamut sepetini eline aldı! Öğrendiğin kelimeleri biriktirip örnek kalıplarla pekiştiriyor.'
  },
  {
    stage: 3,
    id: 'student',
    title: 'Okullu Çırak Sincap',
    badge: '🎒 Evre 3/5',
    minXP: 300,
    nextXP: 700,
    perkTitle: 'Gramer & Soru İpucu Rehberi',
    desc: 'Çantasını ve fularını taktı! Derslerde takıldığın sorularda sana gramer mantığını açıklıyor.'
  },
  {
    stage: 4,
    id: 'scholar',
    title: 'Bilgin Rehber Sincap',
    badge: '👓 Evre 4/5',
    minXP: 700,
    nextXP: 1500,
    perkTitle: 'Zayıf Kelime & Hata Dedektifi',
    desc: 'Bilgin gözlüğünü taktı! Zorlandığın kelimeleri takip edip unutmaman için özel tekrar yaptırıyor.'
  },
  {
    stage: 5,
    id: 'master',
    title: 'Usta Profesör Sincap',
    badge: '👑 Evre 5/5',
    minXP: 1500,
    nextXP: null,
    perkTitle: 'Tam İngilizce & Sınav Ustası',
    desc: 'Altın Meşe Tacını taktı! En ileri seviye cümlelerde ve sınavlarda bile senin başdanışmanın!'
  }
];

const SQUIRREL_GRAMMAR_TIPS = [
  {
    title: '🧩 am / is / are Kuralı (To Be)',
    rule: 'Cümlede fiil yoksa "-im, -sin, -dir" anlamı için: I -> am, He/She/It -> is, You/We/They -> are kullanılır.',
    en: 'I am happy, she is a teacher, they are friends.',
    tr: 'Ben mutluyum, o bir öğretmen, onlar arkadaşlar.'
  },
  {
    title: '⚡ Geniş Zamanda "-s" Takısı (Present Simple)',
    rule: 'Geniş zamanda He / She / It öznelerinden sonra fiile "-s" takısı eklenir (Olumsuzda doesn\'t gelir ve -s düşer!).',
    en: 'She likes coffee, but she does not like tea.',
    tr: 'O kahveyi sever ama çayı sevmez.'
  },
  {
    title: '📍 Yer ve Zaman Edatları: in / on / at',
    rule: 'Saatlerde "at" (at 7:00), günlerde "on" (on Monday), aylarda/şehirlerde/odaların içinde "in" (in May, in Istanbul) kullanılır.',
    en: 'I wake up at 8 o\'clock on Monday in Istanbul.',
    tr: 'İstanbul\'da Pazartesi günü saat 8\'de uyanırım.'
  },
  {
    title: '💪 Yetenek & İzin: can / can\'t',
    rule: '"-ebilmek" anlamı katar. Özne ne olursa olsun (I, He, They) "can" değişmez ve arkasından gelen fiil yalın kalır!',
    en: 'Squirrels can climb trees very fast!',
    tr: 'Sincaplar ağaçlara çok hızlı tırmanabilir!'
  },
  {
    title: '⏪ Geçmiş Zaman İpucu (Past Simple)',
    rule: 'Geçmişte bitmiş olaylar için düzenli fiillere "-ed" gelir (walk -> walked). Sorularda ve olumsuzda "did / didn\'t" yardımcı olur.',
    en: 'Yesterday I learned ten new English words!',
    tr: 'Dün on yeni İngilizce kelime öğrendim!'
  },
  {
    title: '🔮 Gelecek Planları: going to vs. will',
    rule: 'Önceden planladığın işler için "am/is/are going to", konuşma anında verdiğin ani kararlar ve tahminler için "will" kullanılır.',
    en: 'I am going to study English tonight. I will help you!',
    tr: 'Bu akşam İngilizce çalışacağım. Sana yardım edeceğim!'
  }
];


/* ---------- Özel Renk Paletleri (Themes) ---------- */
const PALETTES = [
  {
    id: 'cyber',
    name: 'Cyber Indigo',
    desc: 'Odaklanmayı artıran modern koyu neon ve lila',
    isDark: true,
    colors: {
      bg: '#0B0F19',
      cardBg: '#161F33',
      text: '#F8FAFC',
      muted: '#94A3B8',
      line: '#28354D',
      accent: '#818CF8',
      accentD: '#6366F1',
      primary: '#6366F1',
      primaryD: '#4F46E5',
      primarySoft: 'rgba(99, 102, 241, 0.16)',
      catKelime: '#A855F7',
      catGramer: '#3B82F6',
      catMantik: '#F59E0B',
      catRekabet: '#EAB308',
      catAi: '#06B6D4',
      catTekrar: '#EC4899'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Emerald',
    desc: 'Ultra koyu siyah ve canlı zümrüt neonu',
    isDark: true,
    colors: {
      bg: '#0A0C10',
      cardBg: '#141A24',
      text: '#F0FDF4',
      muted: '#8B9BAE',
      line: '#222D3E',
      accent: '#34D399',
      accentD: '#10B981',
      primary: '#10B981',
      primaryD: '#059669',
      primarySoft: 'rgba(16, 185, 129, 0.16)',
      catKelime: '#8B5CF6',
      catGramer: '#0EA5E9',
      catMantik: '#F59E0B',
      catRekabet: '#FBBF24',
      catAi: '#10B981',
      catTekrar: '#F43F5E'
    }
  },
  {
    id: 'nordic',
    name: 'Nordic Sage',
    desc: 'Sakinleştirici adaçayı yeşili ve taş tonları',
    isDark: false,
    colors: {
      bg: '#F4F7F5',
      cardBg: '#FFFFFF',
      text: '#1E2D24',
      muted: '#52695C',
      line: '#DCE5E0',
      accent: '#2F7C5D',
      accentD: '#1F5A42',
      primary: '#3B8B67',
      primaryD: '#28684C',
      primarySoft: 'rgba(59, 139, 103, 0.14)',
      catKelime: '#7C3AED',
      catGramer: '#2563EB',
      catMantik: '#D97706',
      catRekabet: '#CA8A04',
      catAi: '#0D9488',
      catTekrar: '#DB2777'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Warmth',
    desc: 'Sıcak mercan, bal sarısı ve şeftali enerjisi',
    isDark: false,
    colors: {
      bg: '#FFF8F4',
      cardBg: '#FFFFFF',
      text: '#2C1810',
      muted: '#7C5848',
      line: '#F2DFD5',
      accent: '#F97316',
      accentD: '#EA580C',
      primary: '#F97316',
      primaryD: '#C2410C',
      primarySoft: 'rgba(249, 115, 22, 0.14)',
      catKelime: '#8B5CF6',
      catGramer: '#2563EB',
      catMantik: '#EA580C',
      catRekabet: '#D97706',
      catAi: '#059669',
      catTekrar: '#E11D48'
    }
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    desc: 'Berrak turkuaz, ferah okyanus ve nane ferahlığı',
    isDark: false,
    colors: {
      bg: '#F0F9FF',
      cardBg: '#FFFFFF',
      text: '#0C2738',
      muted: '#426883',
      line: '#D2E8F7',
      accent: '#0284C7',
      accentD: '#0369A1',
      primary: '#0EA5E9',
      primaryD: '#0284C7',
      primarySoft: 'rgba(14, 165, 233, 0.14)',
      catKelime: '#8B5CF6',
      catGramer: '#0284C7',
      catMantik: '#D97706',
      catRekabet: '#EAB308',
      catAi: '#0D9488',
      catTekrar: '#E11D48'
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
    totalUnits: 27
  },
  A2: {
    id: 'A2',
    name: 'A2: Macera Dünyası',
    badge: '🚀',
    desc: 'Geçmiş zaman, seyahat, planlar, kıyaslamalar ve akıcı diyaloglar',
    unlocked: false,
    totalUnits: 25,
    requires: 'A1_BOSS_PASSED'
  }
};
