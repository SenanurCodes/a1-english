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
      ['___ it was cold, he wore only a T-shirt.', ['Although', 'Because', 'So']], ['She called me ___ I was studying.', ['while', 'because', 'so']]
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
     B1 CEFR ORTA SEVİYE MÜFREDATI (Intermediate - 20 Ünite)
     ============================================================ */

  {
    "id": "b1_pres_perf_past",
    "level": "B1",
    "type": "grammar",
    "title": "Present Perfect vs Past Simple",
    "en": "Present Perfect vs Past Simple",
    "emoji": "⏳",
    "explain": "<h4>Zaman Ayrımı: Present Perfect vs Past Simple</h4>\n<p><b>Past Simple:</b> Geçmişte belirli bir zamanda bitmiş eylemler (yesterday, in 2020, two days ago).</p>\n<p><b>Present Perfect:</b> Zamanı belirsiz, etkisi şu an süren veya hayat tecrübesi olan eylemler (since, for, already, yet, just, ever).</p>\n<table class=\"g-table\">\n  <tr><th>Zaman</th><th>Anahtar Kelimeler</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Past Simple</b></td><td>yesterday, last night, ago, in 2010</td><td>I <b>visited</b> London last year.</td></tr>\n  <tr><td><b>Present Perfect</b></td><td>already, yet, since, for, just, ever</td><td>I <b>have visited</b> London twice.</td></tr>\n</table>",
    "examples": [
      [
        "I have lived here for five years.",
        "Beş yıldır burada yaşıyorum (hala buradayım)."
      ],
      [
        "I lived in Paris in 2018.",
        "2018 yılında Paris'te yaşadım (artık orada değilim)."
      ],
      [
        "Have you ever seen a whale?",
        "Hiç balina gördün mü?"
      ]
    ],
    "mc": [
      [
        "She ___ her keys yesterday morning.",
        [
          "lost",
          "has lost",
          "loses"
        ]
      ],
      [
        "I ___ never ___ Japanese food before.",
        [
          "have / eaten",
          "did / eat",
          "am / eating"
        ]
      ],
      [
        "They ___ in this company since 2021.",
        [
          "have worked",
          "worked",
          "work"
        ]
      ],
      [
        "We ___ our tickets two hours ago.",
        [
          "bought",
          "have bought",
          "buy"
        ]
      ],
      [
        "He ___ already ___ his homework.",
        [
          "has / finished",
          "did / finish",
          "had / finish"
        ]
      ]
    ],
    "order": [
      [
        "I have already seen that movie",
        "O filmi zaten gördüm."
      ],
      [
        "She lived in Rome two years ago",
        "İki yıl önce Roma'da yaşadı."
      ],
      [
        "Have you finished your breakfast yet",
        "Kahvaltını henüz bitirdin mi?"
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
        "colleague",
        "iş arkadaşı",
        "🤝"
      ],
      [
        "salary",
        "maaş",
        "💰"
      ],
      [
        "employment",
        "istihdam / iş",
        "🏢"
      ],
      [
        "interview",
        "mülakat / görüşme",
        "🎙️"
      ],
      [
        "experience",
        "deneyim / tecrübe",
        "⭐"
      ],
      [
        "responsible",
        "sorumlu",
        "📋"
      ],
      [
        "skill",
        "beceri / yetenek",
        "🎯"
      ],
      [
        "contract",
        "sözleşme",
        "📑"
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
    "explain": "<h4>Present Perfect Continuous (have/has been + -ing)</h4>\n<p>Geçmişte başlayıp <b>şu ana kadar kesintisiz devam eden</b> veya az önce bitip <b>etkisi gözle görülen</b> eylemler için kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Özne</th><th>Kalıp</th><th>Örnek</th></tr>\n  <tr><td><b>I / You / We / They</b></td><td>have been + V-ing</td><td>I <b>have been studying</b> for three hours.</td></tr>\n  <tr><td><b>He / She / It</b></td><td>has been + V-ing</td><td>She <b>has been waiting</b> since morning.</td></tr>\n</table>",
    "examples": [
      [
        "It has been raining all morning.",
        "Bütün sabahtır yağmur yağıyor."
      ],
      [
        "I have been learning English for six months.",
        "Altı aydır İngilizce öğreniyorum."
      ],
      [
        "Why are you out of breath? Because I have been running.",
        "Neden nefes nefesesin? Çünkü koşuyordum."
      ]
    ],
    "mc": [
      [
        "She is tired because she ___ all day.",
        [
          "has been working",
          "worked",
          "works"
        ]
      ],
      [
        "How long ___ you ___ for me?",
        [
          "have / been waiting",
          "did / wait",
          "are / waiting"
        ]
      ],
      [
        "They ___ football since 2 o'clock.",
        [
          "have been playing",
          "played",
          "play"
        ]
      ],
      [
        "He ___ Spanish for two years.",
        [
          "has been studying",
          "studied",
          "studies"
        ]
      ],
      [
        "My eyes hurt because I ___ at the screen.",
        [
          "have been looking",
          "looked",
          "look"
        ]
      ]
    ],
    "order": [
      [
        "She has been working here for years",
        "Yıllardır burada çalışıyor."
      ],
      [
        "How long have you been studying",
        "Ne kadar süredir ders çalışıyorsun?"
      ],
      [
        "It has been snowing all day",
        "Bütün gündür kar yağıyor."
      ]
    ]
  },
  {
    "id": "b1_environment_nature",
    "level": "B1",
    "type": "vocab",
    "title": "Çevre ve Doğa Bilinci",
    "en": "Environment & Climate",
    "emoji": "🌍",
    "words": [
      [
        "renewable",
        "yenilenebilir",
        "♻️"
      ],
      [
        "pollution",
        "kirlilik",
        "🏭"
      ],
      [
        "ecosystem",
        "ekosistem",
        "🌿"
      ],
      [
        "deforestation",
        "ormansızlaşma",
        "🪓"
      ],
      [
        "climate change",
        "iklim değişikliği",
        "🌡️"
      ],
      [
        "protect",
        "korumak",
        "🛡️"
      ],
      [
        "solar energy",
        "güneş enerjisi",
        "☀️"
      ],
      [
        "extinction",
        "neslin tükenmesi",
        "🦕"
      ],
      [
        "recycle",
        "geri dönüştürmek",
        "🔄"
      ],
      [
        "sustainable",
        "sürdürülebilir",
        "🌱"
      ],
      [
        "carbon footprint",
        "karbon ayak izi",
        "👣"
      ],
      [
        "wildlife",
        "yaban hayatı",
        "🦉"
      ]
    ]
  },
  {
    "id": "b1_past_perfect",
    "level": "B1",
    "type": "grammar",
    "title": "Past Perfect Simple (had done)",
    "en": "Past Perfect Simple",
    "emoji": "🕰️",
    "explain": "<h4>Past Perfect Simple (had + V3)</h4>\n<p>Geçmişte gerçekleşen iki olaydan <b>daha önce gerçekleşeni</b> anlatmak için kullanılır (\"Geçmişin Geçmişi\").</p>\n<table class=\"g-table\">\n  <tr><th>Olay Sırası</th><th>Kullanılan Zaman</th><th>Örnek</th></tr>\n  <tr><td><b>1. İlk Olan Eylem</b></td><td>Past Perfect (had + V3)</td><td>The train <b>had left</b>...</td></tr>\n  <tr><td><b>2. Daha Sonraki Eylem</b></td><td>Past Simple (V2)</td><td>...when we arrived at the station.</td></tr>\n</table>",
    "examples": [
      [
        "When I arrived, the film had already started.",
        "Ben vardığımda film çoktan başlamıştı."
      ],
      [
        "She had lived in Paris before she moved to London.",
        "Londra'ya taşınmadan önce Paris'te yaşamıştı."
      ],
      [
        "I was not hungry because I had had lunch.",
        "Aç değildim çünkü öğle yemeği yemiştim."
      ]
    ],
    "mc": [
      [
        "By the time we got home, everyone ___ to sleep.",
        [
          "had gone",
          "went",
          "goes"
        ]
      ],
      [
        "She recognized the city because she ___ it before.",
        [
          "had visited",
          "visits",
          "visiting"
        ]
      ],
      [
        "When the police arrived, the thieves ___ away.",
        [
          "had escaped",
          "escape",
          "are escaping"
        ]
      ],
      [
        "I knew the answer because I ___ the book.",
        [
          "had read",
          "read",
          "am reading"
        ]
      ],
      [
        "He ___ his phone before he left the house.",
        [
          "had charged",
          "charges",
          "charge"
        ]
      ]
    ],
    "order": [
      [
        "The train had left when we arrived",
        "Biz vardığımızda tren kalkmıştı."
      ],
      [
        "She had finished dinner before I called",
        "Ben aramadan önce akşam yemeğini bitirmişti."
      ],
      [
        "I realized that I had lost my keys",
        "Anahtarlarımı kaybettiğimi fark ettim."
      ]
    ]
  },
  {
    "id": "b1_opinions_debate",
    "level": "B1",
    "type": "vocab",
    "title": "Görüş Belirtme ve Tartışma",
    "en": "Opinions & Debating",
    "emoji": "🗣️",
    "words": [
      [
        "in my opinion",
        "bana göre / fikrimce",
        "💭"
      ],
      [
        "perspective",
        "bakış açısı",
        "🔭"
      ],
      [
        "disagree",
        "aynı fikirde olmamak",
        "❌"
      ],
      [
        "argument",
        "argüman / iddia",
        "💡"
      ],
      [
        "furthermore",
        "dahası / üstelik",
        "➕"
      ],
      [
        "whereas",
        "oysaki / buna karşın",
        "⚖️"
      ],
      [
        "conclude",
        "sonuca varmak",
        "🏁"
      ],
      [
        "convince",
        "ikna etmek",
        "🎯"
      ],
      [
        "point of view",
        "görüş noktası",
        "👀"
      ],
      [
        "evidence",
        "kanıt / delil",
        "🔍"
      ],
      [
        "benefit",
        "fayda / yarar",
        "✨"
      ],
      [
        "drawback",
        "dezavantaj / eksiklik",
        "📉"
      ]
    ]
  },
  {
    "id": "b1_second_conditional",
    "level": "B1",
    "type": "grammar",
    "title": "Second Conditional (Hayali Durumlar)",
    "en": "Second Conditional",
    "emoji": "🦄",
    "explain": "<h4>Second Conditional (If + Past Simple, would + V1)</h4>\n<p>Şu anki gerçekliğe aykırı, <b>hayali durumlar</b> veya <b>tavsiye</b> bildirmek için kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Koşul Cümlesi (If)</th><th>Sonuç Cümlesi</th><th>Anlamı</th></tr>\n  <tr><td>If I <b>had</b> more time,</td><td>I <b>would travel</b> the world.</td><td>Daha çok vaktim olsa dünyayı gezerdim (ama yok).</td></tr>\n  <tr><td>If I <b>were</b> you,</td><td>I <b>would take</b> this job.</td><td>Senin yerinde olsaydım bu işi kabul ederdim (tavsiye).</td></tr>\n</table>",
    "examples": [
      [
        "If I won the lottery, I would buy a house.",
        "Piyangoyu kazansam bir ev alırdım."
      ],
      [
        "If I were you, I would see a doctor.",
        "Senin yerinde olsaydım doktora görünürdüm."
      ],
      [
        "What would you do if you were invisible?",
        "Görünmez olsan ne yapardın?"
      ]
    ],
    "mc": [
      [
        "If I had a million dollars, I ___ a yacht.",
        [
          "would buy",
          "will buy",
          "bought"
        ]
      ],
      [
        "If she ___ harder, she would pass the exam.",
        [
          "studied",
          "studies",
          "study"
        ]
      ],
      [
        "If I were you, I ___ that car.",
        [
          "would not buy",
          "will not buy",
          "did not buy"
        ]
      ],
      [
        "Where would you go if you ___ fly?",
        [
          "could",
          "can",
          "will"
        ]
      ],
      [
        "He would help us if he ___ the answer.",
        [
          "knew",
          "knows",
          "know"
        ]
      ]
    ],
    "order": [
      [
        "If I were you I would accept",
        "Senin yerinde olsam kabul ederdim."
      ],
      [
        "What would you do if you won",
        "Kazansaydın ne yapardın?"
      ],
      [
        "I would travel if I had time",
        "Vaktim olsa seyahat ederdim."
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
        "curriculum",
        "müfredat / öğretim planı",
        "📚"
      ],
      [
        "scholarship",
        "burs",
        "📜"
      ],
      [
        "graduate",
        "mezun olmak / mezun",
        "🧑‍🎓"
      ],
      [
        "assignment",
        "ödev / görev",
        "✍️"
      ],
      [
        "semester",
        "dönem / yarıyıl",
        "🗓️"
      ],
      [
        "tuition",
        "öğrenim harcı",
        "💳"
      ],
      [
        "research",
        "araştırma",
        "🔬"
      ],
      [
        "presentation",
        "sunum",
        "📊"
      ],
      [
        "lecture",
        "üniversite dersi",
        "👨‍🏫"
      ],
      [
        "degree",
        "diploma / derece",
        "🎖️"
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
      ]
    ]
  },
  {
    "id": "b1_passive_voice",
    "level": "B1",
    "type": "grammar",
    "title": "Edilgen Çatı (Passive Voice)",
    "en": "Passive Voice (Present & Past)",
    "emoji": "🏗️",
    "explain": "<h4>Edilgen Çatı: Passive Voice (be + V3)</h4>\n<p>Eylemi kimin yaptığından ziyade <b>eylemin kendisine veya nesneye</b> odaklanıldığında kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Zaman</th><th>Etken (Active)</th><th>Edilgen (Passive)</th></tr>\n  <tr><td><b>Present Simple</b></td><td>They make cars.</td><td>Cars <b>are made</b>.</td></tr>\n  <tr><td><b>Past Simple</b></td><td>Bell invented the phone.</td><td>The phone <b>was invented</b>.</td></tr>\n</table>",
    "examples": [
      [
        "This bridge was built in 1920.",
        "Bu köprü 1920'de inşa edildi."
      ],
      [
        "English is spoken all around the world.",
        "İngilizce tüm dünyada konuşulur."
      ],
      [
        "The email was sent by the manager.",
        "E-posta müdür tarafından gönderildi."
      ]
    ],
    "mc": [
      [
        "The Mona Lisa ___ by Leonardo da Vinci.",
        [
          "was painted",
          "painted",
          "is painting"
        ]
      ],
      [
        "Millions of phones ___ in this factory every month.",
        [
          "are produced",
          "produce",
          "produced"
        ]
      ],
      [
        "The window ___ during the storm yesterday.",
        [
          "was broken",
          "breaks",
          "broken"
        ]
      ],
      [
        "Coffee ___ in Brazil and Colombia.",
        [
          "is grown",
          "grows",
          "grown"
        ]
      ],
      [
        "The stolen car ___ by the police last night.",
        [
          "was found",
          "finds",
          "finding"
        ]
      ]
    ],
    "order": [
      [
        "This castle was built in medieval times",
        "Bu kale orta çağda inşa edildi."
      ],
      [
        "English is spoken in many countries",
        "İngilizce birçok ülkede konuşulur."
      ],
      [
        "The letter was delivered this morning",
        "Mektup bu sabah teslim edildi."
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
        "run out of",
        "tükenmek / bitmek",
        "⛽"
      ],
      [
        "carry on",
        "devam etmek",
        "🚶"
      ],
      [
        "find out",
        "öğrenmek / keşfetmek",
        "💡"
      ],
      [
        "turn down",
        "reddetmek / kısmak",
        "👎"
      ],
      [
        "pick up",
        "almak / toplamak",
        "📦"
      ],
      [
        "call off",
        "iptal etmek",
        "🚫"
      ],
      [
        "set up",
        "kurmak / düzenlemek",
        "⚙️"
      ],
      [
        "put off",
        "ertelemek",
        "⏳"
      ],
      [
        "get along with",
        "biriyle iyi geçinmek",
        "🤝"
      ],
      [
        "take off",
        "havalanmak / çıkarmak",
        "🛫"
      ]
    ]
  },
  {
    "id": "b1_reported_speech",
    "level": "B1",
    "type": "grammar",
    "title": "Dolaylı Anlatım (Reported Speech)",
    "en": "Reported Speech",
    "emoji": "💬",
    "explain": "<h4>Dolaylı Anlatım: Reported Speech</h4>\n<p>Birinin söylediği sözü başka birine aktarırken fiil genellikle <b>bir derece geçmiş zamana</b> kaydırılır.</p>\n<table class=\"g-table\">\n  <tr><th>Doğrudan Cümle (Direct)</th><th>Aktarılan Cümle (Reported)</th></tr>\n  <tr><td>\"I <b>am</b> happy.\"</td><td>He said that he <b>was</b> happy.</td></tr>\n  <tr><td>\"I <b>like</b> coffee.\"</td><td>She said that she <b>liked</b> coffee.</td></tr>\n  <tr><td>\"I <b>will</b> call you.\"</td><td>He told me that he <b>would</b> call me.</td></tr>\n</table>",
    "examples": [
      [
        "He said that he lived in Istanbul.",
        "İstanbul'da yaşadığını söyledi."
      ],
      [
        "She told me that she was studying for the test.",
        "Sınava çalıştığını bana söyledi."
      ],
      [
        "They said they would arrive on time.",
        "Zamanında varacaklarını söylediler."
      ]
    ],
    "mc": [
      [
        "\"I am tired.\" ➔ He said that he ___ tired.",
        [
          "was",
          "is",
          "be"
        ]
      ],
      [
        "\"I have finished.\" ➔ She said that she ___ finished.",
        [
          "had",
          "has",
          "have"
        ]
      ],
      [
        "\"I will help.\" ➔ He told me that he ___ help.",
        [
          "would",
          "will",
          "can"
        ]
      ],
      [
        "\"We can swim.\" ➔ They said that they ___ swim.",
        [
          "could",
          "can",
          "may"
        ]
      ],
      [
        "\"I don't know.\" ➔ She explained that she ___ know.",
        [
          "didn't",
          "doesn't",
          "not"
        ]
      ]
    ],
    "order": [
      [
        "He said that he was ready",
        "Hazır olduğunu söyledi."
      ],
      [
        "She told me she would call",
        "Arayacağını bana söyledi."
      ],
      [
        "They said they had arrived safely",
        "Güvenle vardıklarını söylediler."
      ]
    ]
  },
  {
    "id": "b1_travel_culture",
    "level": "B1",
    "type": "vocab",
    "title": "Kültür ve Gezi Rotaları",
    "en": "Travel & Culture",
    "emoji": "🏛️",
    "words": [
      [
        "heritage",
        "kültürel miras",
        "🏛️"
      ],
      [
        "itinerary",
        "gezi planı / rota",
        "🗺️"
      ],
      [
        "accommodation",
        "konaklama",
        "🏨"
      ],
      [
        "sightseeing",
        "turistik yerleri gezme",
        "📸"
      ],
      [
        "customs",
        "gümrük / gelenekler",
        "🛂"
      ],
      [
        "destination",
        "varış noktası",
        "📍"
      ],
      [
        "foreigner",
        "yabancı",
        "🌍"
      ],
      [
        "monument",
        "anıt / abide",
        "🗿"
      ],
      [
        "souvenir",
        "hediyelik eşya",
        "🎁"
      ],
      [
        "guidebook",
        "rehber kitap",
        "📖"
      ],
      [
        "traditional",
        "geleneksel",
        "🏮"
      ],
      [
        "explore",
        "keşfetmek",
        "🧭"
      ]
    ]
  },
  {
    "id": "b1_modals_deduction",
    "level": "B1",
    "type": "grammar",
    "title": "Çıkarım Modalleri (must, can't, might)",
    "en": "Modals of Deduction",
    "emoji": "🔍",
    "explain": "<h4>Çıkarım Modalleri: must, can't, might / could</h4>\n<p>Elimizdeki ipuçlarına dayanarak bir durum hakkında tahminde bulunurken kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Modal</th><th>Kesinlik Oranı</th><th>Örnek</th><th>Anlamı</th></tr>\n  <tr><td><b>must</b></td><td>%95 Emin (Olumlu)</td><td>He <b>must be</b> rich.</td><td>Zengin olmalı (kesin gibi).</td></tr>\n  <tr><td><b>can't</b></td><td>%95 Emin (Olumsuz)</td><td>It <b>can't be</b> true.</td><td>Doğru olamaz (imkansız).</td></tr>\n  <tr><td><b>might / could</b></td><td>%50 İhtimal</td><td>She <b>might be</b> busy.</td><td>Meşgul olabilir (belki).</td></tr>\n</table>",
    "examples": [
      [
        "You have worked for 12 hours, you must be exhausted!",
        "12 saat çalıştın, çok yorulmuş olmalısın!"
      ],
      [
        "He can't be forty years old, he looks so young.",
        "Kırk yaşında olamaz, çok genç görünüyor."
      ],
      [
        "Take an umbrella, it might rain later.",
        "Şemsiye al, daha sonra yağmur yağabilir."
      ]
    ],
    "mc": [
      [
        "Look at the snow outside, it ___ freezing cold!",
        [
          "must be",
          "can't be",
          "should"
        ]
      ],
      [
        "He just had lunch, so he ___ hungry.",
        [
          "can't be",
          "must be",
          "might be"
        ]
      ],
      [
        "I don't know where Anna is, she ___ at the library.",
        [
          "might be",
          "must",
          "can't"
        ]
      ],
      [
        "That car is a Ferrari, it ___ cost a fortune!",
        [
          "must",
          "can't",
          "may not"
        ]
      ],
      [
        "She isn't answering, she ___ driving right now.",
        [
          "could be",
          "can't",
          "mustn't"
        ]
      ]
    ],
    "order": [
      [
        "You must be tired after work",
        "İşten sonra yorulmuş olmalısın."
      ],
      [
        "That story cannot be true",
        "O hikaye doğru olamaz."
      ],
      [
        "It might rain in the evening",
        "Akşam yağmur yağabilir."
      ]
    ]
  },
  {
    "id": "b1_health_fitness",
    "level": "B1",
    "type": "vocab",
    "title": "Sağlık, Beslenme ve Zindelik",
    "en": "Health & Nutrition",
    "emoji": "🥗",
    "words": [
      [
        "nutrition",
        "beslenme",
        "🥗"
      ],
      [
        "symptom",
        "belirti / semptom",
        "🤒"
      ],
      [
        "treatment",
        "tedavi",
        "💊"
      ],
      [
        "workout",
        "antrenman / egzersiz",
        "🏋️"
      ],
      [
        "immune system",
        "bağışıklık sistemi",
        "🛡️"
      ],
      [
        "calorie",
        "kalori",
        "🔥"
      ],
      [
        "prevention",
        "önleme / tedbir",
        "⚠️"
      ],
      [
        "recovery",
        "iyileşme / toparlanma",
        "🩹"
      ],
      [
        "blood pressure",
        "tansiyon / kan basıncı",
        "🩺"
      ],
      [
        "mental health",
        "ruh sağlığı",
        "🧠"
      ],
      [
        "habit",
        "alışkanlık",
        "📅"
      ],
      [
        "digest",
        "sindirmek",
        "🫄"
      ]
    ]
  },
  {
    "id": "b1_relative_clauses",
    "level": "B1",
    "type": "grammar",
    "title": "İlgi Cümlecikleri (Relative Clauses)",
    "en": "Defining Relative Clauses",
    "emoji": "🔗",
    "explain": "<h4>Defining Relative Clauses (who, which, whose, where, when)</h4>\n<p>Bahsettiğimiz kişinin, nesnenin veya yerin <b>kim veya ne olduğunu kesin olarak belirten</b> sıfat cümlecikleridir.</p>\n<table class=\"g-table\">\n  <tr><th>Bağlaç</th><th>Kullanım</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>who / that</b></td><td>İnsanlar için</td><td>The teacher <b>who</b> taught me English.</td></tr>\n  <tr><td><b>which / that</b></td><td>Cansız varlık & Hayvan</td><td>The car <b>which</b> broke down.</td></tr>\n  <tr><td><b>whose</b></td><td>Sahiplik (Kimin?)</td><td>The boy <b>whose</b> dog was lost.</td></tr>\n  <tr><td><b>where</b></td><td>Mekanlar için</td><td>The city <b>where</b> I was born.</td></tr>\n</table>",
    "examples": [
      [
        "I met a woman who writes books.",
        "Kitaplar yazan bir kadınla tanıştım."
      ],
      [
        "This is the phone which has the best camera.",
        "En iyi kameraya sahip olan telefon bu."
      ],
      [
        "He is the man whose car was stolen.",
        "Arabası çalınan adam o."
      ]
    ],
    "mc": [
      [
        "The architect ___ designed this building is famous.",
        [
          "who",
          "which",
          "where"
        ]
      ],
      [
        "This is the laptop ___ battery lasts for 20 hours.",
        [
          "whose",
          "which",
          "who"
        ]
      ],
      [
        "Do you remember the park ___ we played football?",
        [
          "where",
          "which",
          "who"
        ]
      ],
      [
        "A dictionary is a book ___ gives word meanings.",
        [
          "which",
          "who",
          "where"
        ]
      ],
      [
        "The student ___ won the competition was very happy.",
        [
          "who",
          "which",
          "whose"
        ]
      ]
    ],
    "order": [
      [
        "This is the doctor who treated me",
        "Beni tedavi eden doktor bu."
      ],
      [
        "I like places where nature is preserved",
        "Doğanın korunduğu yerleri severim."
      ],
      [
        "The woman whose purse was stolen called",
        "Çantası çalınan kadın aradı."
      ]
    ]
  },
  {
    "id": "b1_media_arts",
    "level": "B1",
    "type": "vocab",
    "title": "Medya, Sinema ve Sanat",
    "en": "Media & Arts",
    "emoji": "🎬",
    "words": [
      [
        "masterpiece",
        "başyapıt / şaheser",
        "🎨"
      ],
      [
        "audience",
        "seyirci / kitle",
        "👥"
      ],
      [
        "performance",
        "performans / gösteri",
        "🎭"
      ],
      [
        "documentary",
        "belgesel",
        "🎥"
      ],
      [
        "director",
        "yönetmen",
        "🎬"
      ],
      [
        "exhibition",
        "sergi",
        "🖼️"
      ],
      [
        "soundtrack",
        "film müziği",
        "🎵"
      ],
      [
        "broadcast",
        "yayın / yayınlamak",
        "📡"
      ],
      [
        "review",
        "eleştiri / inceleme",
        "⭐"
      ],
      [
        "genre",
        "tür / tarz",
        "📂"
      ],
      [
        "sculpture",
        "heykel",
        "🗿"
      ],
      [
        "actor",
        "oyuncu / aktör",
        "🌟"
      ]
    ]
  },
  {
    "id": "b1_gerunds_infinitives",
    "level": "B1",
    "type": "grammar",
    "title": "Gerunds vs Infinitives",
    "en": "Gerunds vs Infinitives",
    "emoji": "⚖️",
    "explain": "<h4>Fiilden İsim Yapma: Gerund (-ing) vs Infinitive (to + V1)</h4>\n<p>Bazı fiiller kendisinden sonra <b>-ing</b> (enjoy, avoid, suggest), bazıları <b>to + fiil</b> (hope, decide, promise) ister.</p>\n<table class=\"g-table\">\n  <tr><th>Grup</th><th>Örnek Fiiller</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>Gerund (-ing)</b></td><td>enjoy, mind, admit, avoid, finish</td><td>I enjoy <b>reading</b>.</td></tr>\n  <tr><td><b>Infinitive (to)</b></td><td>decide, hope, plan, promise, want</td><td>I decided <b>to go</b>.</td></tr>\n  <tr><td><b>Anlam Değişen</b></td><td>remember, stop, forget</td><td>I stopped <b>smoking</b> (bıraktım) vs stopped <b>to smoke</b> (içmek için durdum).</td></tr>\n</table>",
    "examples": [
      [
        "I decided to study abroad next year.",
        "Gelecek yıl yurt dışında okumaya karar verdim."
      ],
      [
        "She avoids eating fast food.",
        "Hazır yemek yemekten kaçınır."
      ],
      [
        "Don't forget to lock the door.",
        "Kapıyı kilitlemeyi unutma."
      ]
    ],
    "mc": [
      [
        "I promised ___ my friend tomorrow.",
        [
          "to visit",
          "visiting",
          "visit"
        ]
      ],
      [
        "Would you mind ___ the window?",
        [
          "closing",
          "to close",
          "close"
        ]
      ],
      [
        "He stopped ___ because he was coughing.",
        [
          "smoking",
          "to smoke",
          "smoke"
        ]
      ],
      [
        "We are planning ___ on holiday in July.",
        [
          "to go",
          "going",
          "go"
        ]
      ],
      [
        "She enjoys ___ international podcasts.",
        [
          "listening to",
          "to listen",
          "listen"
        ]
      ]
    ],
    "order": [
      [
        "I decided to study medicine abroad",
        "Yurt dışında tıp okumaya karar verdim."
      ],
      [
        "She avoids drinking sugary drinks",
        "Şekerli içecekler içmekten kaçınır."
      ],
      [
        "Remember to call your parents tonight",
        "Bu akşam aileni aramayı hatırla."
      ]
    ]
  },
  {
    "id": "b1_personality_psych",
    "level": "B1",
    "type": "vocab",
    "title": "Kişilik ve Karakter Özellikleri",
    "en": "Personality Traits",
    "emoji": "🎭",
    "words": [
      [
        "ambitious",
        "hırslı / azimli",
        "🧗"
      ],
      [
        "generous",
        "cömert",
        "🤲"
      ],
      [
        "reliable",
        "güvenilir",
        "🤝"
      ],
      [
        "stubborn",
        "inatçı",
        "🐂"
      ],
      [
        "open-minded",
        "açık fikirli",
        "💡"
      ],
      [
        "sensitive",
        "duyarlı / hassas",
        "💧"
      ],
      [
        "pessimistic",
        "karamsar",
        "🌧️"
      ],
      [
        "optimistic",
        "iyimser",
        "🌈"
      ],
      [
        "introvert",
        "içe dönük",
        "🚪"
      ],
      [
        "extrovert",
        "dışa dönük",
        "🎉"
      ],
      [
        "patient",
        "sabırlı",
        "🧘"
      ],
      [
        "creative",
        "yaratıcı",
        "🎨"
      ]
    ]
  },
  {
    "id": "b1_used_to_would",
    "level": "B1",
    "type": "grammar",
    "title": "Geçmiş Alışkanlıklar (used to & would)",
    "en": "used to & would",
    "emoji": "📼",
    "explain": "<h4>Eski Alışkanlıklar: used to vs would</h4>\n<p>Geçmişte düzenli olarak yapılan ama <b>artık yapılmayan</b> alışkanlıkları ve durumları anlatır.</p>\n<table class=\"g-table\">\n  <tr><th>Kalıp</th><th>Kullanım Alanı</th><th>Örnek</th></tr>\n  <tr><td><b>used to</b></td><td>Hem eylem hem de durum fiilleri (be, live, have)</td><td>I <b>used to live</b> in Izmir.</td></tr>\n  <tr><td><b>would</b></td><td>Yalnızca tekrarlanan eylemler (durum fiili olmaz)</td><td>My grandfather <b>would tell</b> stories.</td></tr>\n</table>",
    "examples": [
      [
        "I used to play basketball when I was a child.",
        "Çocukken basketbol oynardım (artık oynamıyorum)."
      ],
      [
        "Did you use to drink coffee back then?",
        "O zamanlar kahve içer miydin?"
      ],
      [
        "Every summer, we would swim in the lake.",
        "Her yaz gölde yüzerdik."
      ]
    ],
    "mc": [
      [
        "I ___ wear glasses, but now I wear contacts.",
        [
          "used to",
          "use to",
          "would to"
        ]
      ],
      [
        "When I was young, my father ___ read me bedtime stories.",
        [
          "would",
          "used",
          "is used to"
        ]
      ],
      [
        "She ___ have long blonde hair, but she cut it.",
        [
          "used to",
          "would",
          "is used to"
        ]
      ],
      [
        "___ you ___ live in Ankara?",
        [
          "Did / use to",
          "Do / used to",
          "Have / used to"
        ]
      ],
      [
        "They ___ eat meat, but now they are vegan.",
        [
          "used to",
          "would",
          "will"
        ]
      ]
    ],
    "order": [
      [
        "I used to live in a small village",
        "Küçük bir köyde yaşardım."
      ],
      [
        "We would play outside every evening",
        "Her akşam dışarıda oynardık."
      ],
      [
        "She used to have a red bicycle",
        "Kırmızı bir bisikleti vardı."
      ]
    ]
  },
  {
    "id": "b1_crime_society",
    "level": "B1",
    "type": "vocab",
    "title": "Toplum, Hukuk ve Kurallar",
    "en": "Crime & Society",
    "emoji": "⚖️",
    "words": [
      [
        "citizen",
        "vatandaş / yurttaş",
        "🏙️"
      ],
      [
        "witness",
        "tanık / şahit",
        "👁️"
      ],
      [
        "punishment",
        "ceza / yaptırım",
        "⛓️"
      ],
      [
        "innocent",
        "masum / suçsuz",
        "🕊️"
      ],
      [
        "guilty",
        "suçlu",
        "⚖️"
      ],
      [
        "judge",
        "yargıç / hakim",
        "🧑‍⚖️"
      ],
      [
        "evidence",
        "delil / kanıt",
        "🔎"
      ],
      [
        "investigate",
        "soruşturmak",
        "🕵️"
      ],
      [
        "community",
        "topluluk / cemiyet",
        "👥"
      ],
      [
        "prevent",
        "önlemek / engellemek",
        "🛑"
      ],
      [
        "security",
        "güvenlik",
        "🔒"
      ],
      [
        "rights",
        "haklar",
        "📜"
      ]
    ]
  }
,

  /* ============================================================
     B2 CEFR İLERİ SEVİYE MÜFREDATI (Upper-Intermediate - 20 Ünite)
     ============================================================ */

  {
    "id": "b2_third_conditional",
    "level": "B2",
    "type": "grammar",
    "title": "Third Conditional (Geçmiş Pişmanlıklar)",
    "en": "Third Conditional",
    "emoji": "💔",
    "explain": "<h4>Third Conditional (If + Past Perfect, would have + V3)</h4>\n<p>Geçmişte yaşanmış ve <b>artık değiştirilmesi imkansız olan</b> olaylar hakkındaki varsayımları ve pişmanlıkları anlatır.</p>\n<table class=\"g-table\">\n  <tr><th>Koşul (If + had V3)</th><th>Sonuç (would have V3)</th><th>Gerçek Durum</th></tr>\n  <tr><td>If I <b>had studied</b> harder,</td><td>I <b>would have passed</b>.</td><td>Çalışmadım ve kaldım.</td></tr>\n  <tr><td>If you <b>had told</b> me,</td><td>I <b>could have helped</b> you.</td><td>Bana söylemedin, yardım edemedim.</td></tr>\n</table>",
    "examples": [
      [
        "If we had left earlier, we would not have missed the flight.",
        "Daha erken çıksaydık uçağı kaçırmazdık."
      ],
      [
        "If she had known the truth, she wouldn't have reacted that way.",
        "Gerçeği bilseydi bu şekilde tepki vermezdi."
      ],
      [
        "What would you have done if you had been there?",
        "Orada olsaydın ne yapardın?"
      ]
    ],
    "mc": [
      [
        "If I ___ about the traffic, I would have taken the subway.",
        [
          "had known",
          "knew",
          "have known"
        ]
      ],
      [
        "She would have won the race if she ___ her ankle.",
        [
          "had not injured",
          "did not injure",
          "has not injured"
        ]
      ],
      [
        "If they had listened to advice, they ___ so much money.",
        [
          "would not have lost",
          "will not lose",
          "did not lose"
        ]
      ],
      [
        "What ___ you ___ if the manager had asked you directly?",
        [
          "would / have said",
          "will / say",
          "did / say"
        ]
      ],
      [
        "If we had booked early, the tickets ___ much cheaper.",
        [
          "would have been",
          "will be",
          "are"
        ]
      ]
    ],
    "order": [
      [
        "If I had known I would have called you",
        "Bilseydim seni arardım."
      ],
      [
        "We would not have missed the train if we had hurried",
        "Acele etseydik treni kaçırmazdık."
      ],
      [
        "She would have succeeded if she had tried harder",
        "Daha çok çabalasaydı başarırdı."
      ]
    ]
  },
  {
    "id": "b2_business_negotiation",
    "level": "B2",
    "type": "vocab",
    "title": "İş Müzakeresi ve Finans",
    "en": "Business Negotiation & Finance",
    "emoji": "📊",
    "words": [
      [
        "negotiate",
        "müzakere etmek / pazarlık yapmak",
        "🤝"
      ],
      [
        "revenue",
        "gelir / hasılat",
        "💰"
      ],
      [
        "stakeholder",
        "paydaş / hissedar",
        "🏢"
      ],
      [
        "compromise",
        "uzlaşma / ödün verme",
        "⚖️"
      ],
      [
        "acquisition",
        "şirket satın alımı",
        "📈"
      ],
      [
        "profit margin",
        "kar marjı",
        "📊"
      ],
      [
        "asset",
        "varlık / aktif değer",
        "💎"
      ],
      [
        "liability",
        "yükümlülük / borç",
        "📉"
      ],
      [
        "collaborate",
        "iş birliği yapmak",
        "👥"
      ],
      [
        "feasibility",
        "fizibilite / uygulanabilirlik",
        "📐"
      ],
      [
        "venture capital",
        "girişim sermayesi",
        "🚀"
      ],
      [
        "turnover",
        "ciro / devir hızı",
        "🔄"
      ]
    ]
  },
  {
    "id": "b2_wish_if_only",
    "level": "B2",
    "type": "grammar",
    "title": "Keşkeler: I wish & If only",
    "en": "Wishes & Regrets (I wish / If only)",
    "emoji": "🌠",
    "explain": "<h4>Keşkeler ve Pişmanlıklar: I wish / If only</h4>\n<table class=\"g-table\">\n  <tr><th>Zaman Dilimi</th><th>Kullanılan Yapı</th><th>Örnek</th><th>Anlamı</th></tr>\n  <tr><td><b>Şimdiki Zaman İçin</b></td><td>wish + Past Simple</td><td>I wish I <b>spoke</b> French.</td><td>Keşke Fransızca konuşabilsem (şu an bilmiyorum).</td></tr>\n  <tr><td><b>Geçmiş Zaman İçin</b></td><td>wish + Past Perfect</td><td>I wish I <b>had gone</b>.</td><td>Keşke gitseydim (geçmiş pişmanlık).</td></tr>\n  <tr><td><b>Şikayet / Başkası</b></td><td>wish + would</td><td>I wish it <b>would stop</b> raining!</td><td>Keşke yağmur dursa! (şikayet).</td></tr>\n</table>",
    "examples": [
      [
        "I wish I had more free time these days.",
        "Bu günlerde keşke daha çok boş vaktim olsa."
      ],
      [
        "If only I had listened to your advice!",
        "Keşke senin tavsiyeni dinlemiş olsaydım!"
      ],
      [
        "I wish you would listen to me when I speak.",
        "Konuştuğumda keşke beni dinlesen."
      ]
    ],
    "mc": [
      [
        "I don't have a car. I wish I ___ one.",
        [
          "had",
          "have",
          "would have"
        ]
      ],
      [
        "I failed the exam. I wish I ___ more.",
        [
          "had studied",
          "studied",
          "study"
        ]
      ],
      [
        "The music next door is loud. I wish they ___ it down!",
        [
          "would turn",
          "turned",
          "turn"
        ]
      ],
      [
        "If only we ___ that train yesterday!",
        [
          "had caught",
          "caught",
          "catch"
        ]
      ],
      [
        "She is lonely. She wishes she ___ more friends.",
        [
          "had",
          "has",
          "would have"
        ]
      ]
    ],
    "order": [
      [
        "I wish I had studied harder for the test",
        "Keşke sınava daha çok çalışsaydım."
      ],
      [
        "If only I knew the answer to this question",
        "Keşke bu sorunun cevabını bilseydim."
      ],
      [
        "I wish it would stop raining so heavily",
        "Keşke bu kadar şiddetli yağmasa."
      ]
    ]
  },
  {
    "id": "b2_technology_ai",
    "level": "B2",
    "type": "vocab",
    "title": "Yapay Zeka ve Gelecek Teknolojisi",
    "en": "Artificial Intelligence & Future Tech",
    "emoji": "🤖",
    "words": [
      [
        "algorithm",
        "algoritma",
        "🧮"
      ],
      [
        "automation",
        "otomasyon",
        "⚙️"
      ],
      [
        "breakthrough",
        "çığır açan buluş",
        "⚡"
      ],
      [
        "cybersecurity",
        "siber güvenlik",
        "🛡️"
      ],
      [
        "neural network",
        "yapay sinir ağı",
        "🧠"
      ],
      [
        "disruptive",
        "ezber bozan / dönüştürücü",
        "💥"
      ],
      [
        "virtual reality",
        "sanal gerçeklik",
        "🥽"
      ],
      [
        "data privacy",
        "veri gizliliği",
        "🔒"
      ],
      [
        "unprecedented",
        "benzeri görülmemiş",
        "🚀"
      ],
      [
        "autonomous",
        "otonom / sürücüsüz",
        "🚗"
      ],
      [
        "nanotechnology",
        "nanoteknoloji",
        "🔬"
      ],
      [
        "biometrics",
        "biyometrik veri",
        "👁️"
      ]
    ]
  },
  {
    "id": "b2_causatives_passive",
    "level": "B2",
    "type": "grammar",
    "title": "Ettirgen Çatı (Causatives: have/get done)",
    "en": "Causatives & Impersonal Passive",
    "emoji": "🛠️",
    "explain": "<h4>Ettirgen Çatı: Causatives (have / get something done)</h4>\n<p>Bir işi kendimiz yapmak yerine bir başkasına <b>yaptırdığımızda</b> veya bir hizmet aldığımızda kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Kalıp</th><th>Örnek Cümle</th><th>Anlamı</th></tr>\n  <tr><td><b>have something done</b></td><td>I <b>had my car repaired</b>.</td><td>Arabamı tamir ettirdim (tamirci yaptı).</td></tr>\n  <tr><td><b>get something done</b></td><td>She <b>got her hair cut</b>.</td><td>Saçını kestirdi (kuaför yaptı).</td></tr>\n  <tr><td><b>İleri Edilgen</b></td><td>It <b>is said that</b> he is rich.</td><td>Zengin olduğu söyleniyor.</td></tr>\n</table>",
    "examples": [
      [
        "I need to have my passport renewed.",
        "Pasaportumu yeniletmem gerekiyor."
      ],
      [
        "She gets her teeth cleaned twice a year.",
        "Yılda iki kez dişlerini temizletir."
      ],
      [
        "It is believed that the pyramids were built by skilled workers.",
        "Piramitlerin usta işçilerce yapıldığına inanılır."
      ]
    ],
    "mc": [
      [
        "My laptop was broken, so I had it ___ yesterday.",
        [
          "repaired",
          "repair",
          "repairing"
        ]
      ],
      [
        "She is going to get her wedding dress ___ by a designer.",
        [
          "made",
          "make",
          "to make"
        ]
      ],
      [
        "We must have the roof ___ before winter arrives.",
        [
          "fixed",
          "fix",
          "fixing"
        ]
      ],
      [
        "It ___ that the global economy will grow next quarter.",
        [
          "is expected",
          "expects",
          "expecting"
        ]
      ],
      [
        "He ___ his house painted last week.",
        [
          "had",
          "made",
          "did"
        ]
      ]
    ],
    "order": [
      [
        "I had my car washed yesterday afternoon",
        "Dün öğleden sonra arabamı yıkattım."
      ],
      [
        "She got her hair styled for the wedding",
        "Düğün için saçını yaptırdı."
      ],
      [
        "It is thought that the project will succeed",
        "Projenin başarılı olacağı düşünülüyor."
      ]
    ]
  },
  {
    "id": "b2_psychology_mind",
    "level": "B2",
    "type": "vocab",
    "title": "Psikoloji ve İnsan Zihni",
    "en": "Psychology & Human Behavior",
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
        "🧩"
      ],
      [
        "empathy",
        "empati / duygudaşlık",
        "❤️"
      ],
      [
        "resilience",
        "psikolojik dayanıklılık",
        "🌱"
      ],
      [
        "perception",
        "algı / idrak",
        "👁️"
      ],
      [
        "motivation",
        "güdülenme / motivasyon",
        "🔥"
      ],
      [
        "anxiety",
        "kaygı / endişe",
        "🌪️"
      ],
      [
        "instinct",
        "içgüdü",
        "🐾"
      ],
      [
        "behavioral",
        "davranışsal",
        "📋"
      ],
      [
        "personality",
        "kişilik",
        "🎭"
      ],
      [
        "consciousness",
        "bilinç / farkındalık",
        "💡"
      ],
      [
        "trauma",
        "travma / sarsıntı",
        "⚡"
      ]
    ]
  },
  {
    "id": "b2_future_cont_perf",
    "level": "B2",
    "type": "grammar",
    "title": "Future Continuous & Future Perfect",
    "en": "Future Continuous & Future Perfect",
    "emoji": "🚀",
    "explain": "<h4>Gelecek Zaman Süreçleri</h4>\n<table class=\"g-table\">\n  <tr><th>Zaman</th><th>Kalıp</th><th>Örnek</th><th>Anlamı</th></tr>\n  <tr><td><b>Future Continuous</b></td><td>will be + V-ing</td><td>This time tomorrow, I <b>will be flying</b>.</td><td>Yarın bu saatte uçuyor olacağım.</td></tr>\n  <tr><td><b>Future Perfect</b></td><td>will have + V3</td><td>By 2030, she <b>will have graduated</b>.</td><td>2030'a kadar mezun olmuş olacak.</td></tr>\n</table>",
    "examples": [
      [
        "By next month, I will have finished writing this book.",
        "Gelecek aya kadar bu kitabı yazmayı bitirmiş olacağım."
      ],
      [
        "Don't call at eight, I will be having dinner.",
        "Sekizde arama, akşam yemeği yiyor olacağım."
      ],
      [
        "By the time you arrive, we will have prepared everything.",
        "Sen varana kadar her şeyi hazırlamış olacağız."
      ]
    ],
    "mc": [
      [
        "By this time next year, I ___ from university.",
        [
          "will have graduated",
          "will graduate",
          "will be graduating"
        ]
      ],
      [
        "Tomorrow at 3 PM, we ___ our final presentation.",
        [
          "will be delivering",
          "will deliver",
          "have delivered"
        ]
      ],
      [
        "By 2050, scientists ___ a cure for many diseases.",
        [
          "will have found",
          "find",
          "will be finding"
        ]
      ],
      [
        "Don't disturb him tonight, he ___ for his exam.",
        [
          "will be studying",
          "will have studied",
          "studies"
        ]
      ],
      [
        "By next Friday, they ___ their house.",
        [
          "will have sold",
          "will sell",
          "are selling"
        ]
      ]
    ],
    "order": [
      [
        "By next year I will have completed my degree",
        "Gelecek yıla kadar diplomamı tamamlamış olacağım."
      ],
      [
        "This time tomorrow we will be swimming in the sea",
        "Yarın bu saatte denizde yüzüyor olacağız."
      ],
      [
        "By five o clock they will have finished the match",
        "Saat beşe kadar maçı bitirmiş olacaklar."
      ]
    ]
  },
  {
    "id": "b2_global_challenges",
    "level": "B2",
    "type": "vocab",
    "title": "Küresel Krizler ve Diplomasi",
    "en": "Global Challenges & Diplomacy",
    "emoji": "🌐",
    "words": [
      [
        "poverty",
        "yoksulluk / sefalet",
        "🏚️"
      ],
      [
        "sustainable development",
        "sürdürülebilir kalkınma",
        "🌱"
      ],
      [
        "diplomatic",
        "diplomatik / diplomatça",
        "🕊️"
      ],
      [
        "resolution",
        "karar / uzlaşı metni",
        "📜"
      ],
      [
        "humanitarian",
        "insani / yardımsever",
        "🤝"
      ],
      [
        "sanction",
        "yaptırım",
        "🛑"
      ],
      [
        "negotiate treaty",
        "antlaşma müzakere etmek",
        "✍️"
      ],
      [
        "crisis management",
        "kriz yönetimi",
        "🚨"
      ],
      [
        "inequality",
        "eşitsizlik",
        "⚖️"
      ],
      [
        "sovereignty",
        "egemenlik",
        "👑"
      ],
      [
        "refugee",
        "mülteci / sığınmacı",
        "🏕️"
      ],
      [
        "coalition",
        "koalisyon / ittifak",
        "🌐"
      ]
    ]
  },
  {
    "id": "b2_modals_past_deduction",
    "level": "B2",
    "type": "grammar",
    "title": "Geçmiş Çıkarım (must/can't have done)",
    "en": "Past Modals of Deduction",
    "emoji": "🕵️",
    "explain": "<h4>Geçmişe Dair Güçlü Çıkarımlar (Modal + have + V3)</h4>\n<table class=\"g-table\">\n  <tr><th>Kalıp</th><th>Anlamı</th><th>Örnek Cümle</th></tr>\n  <tr><td><b>must have + V3</b></td><td>Yapmış olmalı (kesine yakın)</td><td>He <b>must have forgotten</b> his keys.</td></tr>\n  <tr><td><b>can't have + V3</b></td><td>Yapmış olamaz (imkansız)</td><td>She <b>can't have said</b> such a thing.</td></tr>\n  <tr><td><b>might have + V3</b></td><td>Yapmış olabilir (ihtimal)</td><td>They <b>might have missed</b> the bus.</td></tr>\n  <tr><td><b>should have + V3</b></td><td>Yapmalıydı (ama yapmadı)</td><td>You <b>should have called</b> me!</td></tr>\n</table>",
    "examples": [
      [
        "The streets are wet, it must have rained last night.",
        "Sokaklar ıslak, dün gece yağmur yağmış olmalı."
      ],
      [
        "He can't have stolen the money, he was in Paris!",
        "Parayı o çalmış olamaz, Paris'teydi!"
      ],
      [
        "You should have told me earlier, I could have helped.",
        "Bana daha önce söylemeliydin, yardım edebilirdim."
      ]
    ],
    "mc": [
      [
        "The lights are off and the door is locked. They ___ out.",
        [
          "must have gone",
          "can't have gone",
          "should go"
        ]
      ],
      [
        "He only started reading 5 minutes ago, he ___ the whole book.",
        [
          "can't have finished",
          "must have finished",
          "should finish"
        ]
      ],
      [
        "You look exhausted. You ___ slept enough last night.",
        [
          "can't have",
          "must have",
          "might have"
        ]
      ],
      [
        "I didn't see Jack at the party. He ___ busy.",
        [
          "might have been",
          "can't be",
          "must be"
        ]
      ],
      [
        "I failed the driving test. I ___ practiced more parking.",
        [
          "should have",
          "must have",
          "can't have"
        ]
      ]
    ],
    "order": [
      [
        "He must have left his wallet at home",
        "Cüzdanını evde unutmuş olmalı."
      ],
      [
        "She can not have done that on purpose",
        "Bunu bilerek yapmış olamaz."
      ],
      [
        "You should have listened to the teacher carefully",
        "Öğretmeni dikkatlice dinlemeliydin."
      ]
    ]
  },
  {
    "id": "b2_advanced_idioms",
    "level": "B2",
    "type": "vocab",
    "title": "İleri Düzey Deyimler ve Nüanslar",
    "en": "Advanced Idioms & Collocations",
    "emoji": "🎭",
    "words": [
      [
        "bite the bullet",
        "acı reçeteyi kabul etmek / katlanmak",
        "🎯"
      ],
      [
        "blessing in disguise",
        "görünüşte kötü ama hayırlı olan durum",
        "✨"
      ],
      [
        "hit the nail on the head",
        "tam üstüne basmak / taşı gediğine koymak",
        "🔨"
      ],
      [
        "once in a blue moon",
        "kırk yılda bir / nadiren",
        "🌕"
      ],
      [
        "break the ice",
        "buzları eritmek / samimiyet kurmak",
        "🧊"
      ],
      [
        "spill the beans",
        "ağzındaki baklayı çıkarmak / sırrı açığa vurmak",
        "🫘"
      ],
      [
        "under the weather",
        "biraz keyifsiz / hafif hasta",
        "🌧️"
      ],
      [
        "burn the midnight oil",
        "gece gündüz harıl harıl çalışmak",
        "🕯️"
      ],
      [
        "cost an arm and a leg",
        "ateş pahası olmak / çok pahalı",
        "🏷️"
      ],
      [
        "see eye to eye",
        "tamamen aynı fikirde olmak",
        "👁️"
      ],
      [
        "piece of cake",
        "çocuk oyuncağı / çok kolay",
        "🍰"
      ],
      [
        "cut corners",
        "kolaya kaçmak / kaliteden kısmak",
        "✂️"
      ]
    ]
  },
  {
    "id": "b2_inversion_emphasis",
    "level": "B2",
    "type": "grammar",
    "title": "Devrik Cümleler (Inversion)",
    "en": "Inversion for Emphasis",
    "emoji": "⚡",
    "explain": "<h4>Vurgu İçin Devrik Cümle (Inversion)</h4>\n<p>Cümleye olumsuz veya kısıtlayıcı bir zarfla başlandığında (Never, Seldom, Rarely, Hardly, Under no circumstances) cümle soru kalıbı gibi <b>devrik (Inversion)</b> yapılır.</p>\n<table class=\"g-table\">\n  <tr><th>Zarf</th><th>Devrik Cümle Yapısı</th><th>Normal Cümle</th></tr>\n  <tr><td><b>Never</b></td><td>Never <b>have I seen</b> such beauty.</td><td>I have never seen...</td></tr>\n  <tr><td><b>Seldom</b></td><td>Seldom <b>does he complain</b>.</td><td>He seldom complains.</td></tr>\n  <tr><td><b>Hardly... when</b></td><td>Hardly <b>had we arrived</b> when it rained.</td><td>We had hardly arrived...</td></tr>\n</table>",
    "examples": [
      [
        "Never have I witnessed such an extraordinary sunset.",
        "Asla böylesine olağanüstü bir gün batımına tanık olmamıştım."
      ],
      [
        "Seldom do people realize the value of peace.",
        "İnsanlar barışın değerini pek nadir fark ederler."
      ],
      [
        "Under no circumstances should you open this door.",
        "Hiçbir koşul altında bu kapıyı açmamalısın."
      ]
    ],
    "mc": [
      [
        "Never ___ such an amazing performance.",
        [
          "have I seen",
          "I have seen",
          "did I saw"
        ]
      ],
      [
        "Seldom ___ out on weekdays.",
        [
          "does he go",
          "he goes",
          "he did go"
        ]
      ],
      [
        "Hardly ___ home when the phone rang.",
        [
          "had I arrived",
          "I had arrived",
          "did I arrive"
        ]
      ],
      [
        "Not only ___ late, but he also forgot the tickets.",
        [
          "was he",
          "he was",
          "is he"
        ]
      ],
      [
        "Under no circumstances ___ the rules.",
        [
          "should you break",
          "you should break",
          "break you"
        ]
      ]
    ],
    "order": [
      [
        "Never have I felt so proud of myself",
        "Kendimle asla bu kadar gurur duymamıştım."
      ],
      [
        "Seldom do we see such dedication in work",
        "İşte böyle bir adanmışlığı pek nadir görürüz."
      ],
      [
        "Hardly had the meeting started when he left",
        "Toplantı henüz başlamıştı ki ayrıldı."
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
        "investigative",
        "araştırmacı",
        "🔍"
      ],
      [
        "censorship",
        "sansür",
        "✂️"
      ],
      [
        "propaganda",
        "propaganda / taraflı yönlendirme",
        "📢"
      ],
      [
        "objective",
        "nesnel / tarafsız",
        "⚖️"
      ],
      [
        "misinformation",
        "yanıltıcı bilgi / dezenformasyon",
        "❌"
      ],
      [
        "unbiased",
        "önyargısız",
        "🕊️"
      ],
      [
        "whistleblower",
        "içeriden bilgi sızdıran / ifşaatçı",
        "🪈"
      ],
      [
        "editorial",
        "başyazı / editoryal",
        "✍️"
      ],
      [
        "sensationalism",
        "sansasyonellik / abartı",
        "📰"
      ],
      [
        "credibility",
        "güvenilirlik / inandırıcılık",
        "⭐"
      ],
      [
        "anonymous source",
        "isimsiz kaynak",
        "👤"
      ],
      [
        "verify",
        "doğrulamak / teyit etmek",
        "✅"
      ]
    ]
  },
  {
    "id": "b2_cleft_sentences",
    "level": "B2",
    "type": "grammar",
    "title": "Vurgu Cümleleri (Cleft Sentences)",
    "en": "Cleft Sentences (It was... / What...)",
    "emoji": "🎯",
    "explain": "<h4>Vurgu Cümleleri: Cleft Sentences</h4>\n<p>Cümlede belirli bir bilgiyi (özneyi, nesneyi veya zamanı) öne çıkarıp <b>vurgulamak</b> için kullanılır.</p>\n<table class=\"g-table\">\n  <tr><th>Tür</th><th>Örnek Cümle</th><th>Vurgulanan Öğe</th></tr>\n  <tr><td><b>It-cleft</b></td><td><b>It was John who</b> broke the vase.</td><td>Vurgu: Yapan John idi!</td></tr>\n  <tr><td><b>Wh-cleft</b></td><td><b>What I need is</b> a long vacation.</td><td>Vurgu: İhtiyacım olan tek şey tatil!</td></tr>\n  <tr><td><b>All-cleft</b></td><td><b>All I want is</b> peace and quiet.</td><td>Vurgu: Tek istediğim sessizlik!</td></tr>\n</table>",
    "examples": [
      [
        "What matters most is your health and well-being.",
        "En çok önemli olan şey senin sağlığın ve esenliğindir."
      ],
      [
        "It was my brother who introduced us.",
        "Bizi tanıştıran kişi erkek kardeşimdi."
      ],
      [
        "All she did was ask a simple question.",
        "Yaptığı tek şey basit bir soru sormaktı."
      ]
    ],
    "mc": [
      [
        "___ I really love about this city is the historic architecture.",
        [
          "What",
          "That",
          "Which"
        ]
      ],
      [
        "It was yesterday ___ we finalized the contract.",
        [
          "that",
          "which",
          "what"
        ]
      ],
      [
        "All I want for my birthday ___ to spend time with family.",
        [
          "is",
          "are",
          "were"
        ]
      ],
      [
        "It was Sarah ___ solved the difficult puzzle.",
        [
          "who",
          "which",
          "where"
        ]
      ],
      [
        "What annoys me most ___ people who interrupt.",
        [
          "is",
          "are",
          "was"
        ]
      ]
    ],
    "order": [
      [
        "What I need right now is some quiet time",
        "Şu an ihtiyacım olan şey biraz sessizlik."
      ],
      [
        "It was Mary who told me the secret",
        "Bana sırrı söyleyen kişi Mary idi."
      ],
      [
        "All they did was follow the instructions",
        "Yaptıkları tek şey talimatları izlemekti."
      ]
    ]
  },
  {
    "id": "b2_science_innovation",
    "level": "B2",
    "type": "vocab",
    "title": "Bilimsel İnovasyon ve Keşifler",
    "en": "Science & Innovation",
    "emoji": "🔬",
    "words": [
      [
        "hypothesis",
        "varsayım / hipotez",
        "🧪"
      ],
      [
        "experiment",
        "deney",
        "🔬"
      ],
      [
        "genetic code",
        "genetik kod",
        "🧬"
      ],
      [
        "quantum physics",
        "kuantum fiziği",
        "⚛️"
      ],
      [
        "pioneer",
        "öncü / çığır açan kişi",
        "🚀"
      ],
      [
        "laboratory",
        "laboratuvar",
        "🧫"
      ],
      [
        "empirical",
        "deneysel / gözleme dayalı",
        "📊"
      ],
      [
        "phenomenon",
        "olgu / fenomen",
        "🌌"
      ],
      [
        "synthesize",
        "sentezlemek",
        "⚗️"
      ],
      [
        "variable",
        "değişken",
        "📈"
      ],
      [
        "astrophysics",
        "astrofizik",
        "🪐"
      ],
      [
        "prototype",
        "ilk örnek / prototip",
        "🛠️"
      ]
    ]
  },
  {
    "id": "b2_participle_clauses",
    "level": "B2",
    "type": "grammar",
    "title": "Ortaç Cümlecikleri (Participle Clauses)",
    "en": "Participle Clauses (-ing / -ed / Having done)",
    "emoji": "✂️",
    "explain": "<h4>Cümle Kısaltmaları: Participle Clauses</h4>\n<p>Yazılı ve akıcı İngilizcede iki cümleyi bağlaç kullanmadan <b>zarf-fiil</b> ile kısaltıp zarifçe birleştirir.</p>\n<table class=\"g-table\">\n  <tr><th>Tür</th><th>Kısaltılmış Hali</th><th>Uzun Hali</th></tr>\n  <tr><td><b>Present Participle (-ing)</b></td><td><b>Walking down the street</b>, I met Tom.</td><td>While I was walking...</td></tr>\n  <tr><td><b>Past Participle (-ed)</b></td><td><b>Shocked by the news</b>, she cried.</td><td>Because she was shocked...</td></tr>\n  <tr><td><b>Perfect Participle</b></td><td><b>Having completed the work</b>, he slept.</td><td>After he had completed...</td></tr>\n</table>",
    "examples": [
      [
        "Having finished his degree, he applied for an internship.",
        "Diplomasını bitirdikten sonra staja başvurdu."
      ],
      [
        "Not knowing what to say, she remained silent.",
        "Ne söyleyeceğini bilemeyerek sessiz kaldı."
      ],
      [
        "Written in simple language, the book is easy to understand.",
        "Basit bir dille yazılmış olan kitabı anlamak kolaydır."
      ]
    ],
    "mc": [
      [
        "___ his breakfast, he hurried to catch the morning train.",
        [
          "Having eaten",
          "Ate",
          "Eating have"
        ]
      ],
      [
        "___ in 1889, the Eiffel Tower remains an iconic monument.",
        [
          "Constructed",
          "Constructing",
          "Construct"
        ]
      ],
      [
        "Not ___ where to go, we asked a passerby for directions.",
        [
          "knowing",
          "knew",
          "known"
        ]
      ],
      [
        "___ by the noise outside, the baby woke up crying.",
        [
          "Frightened",
          "Frightening",
          "Frighten"
        ]
      ],
      [
        "___ for hours in the rain, their clothes were soaked.",
        [
          "Having walked",
          "Walked",
          "Walk"
        ]
      ]
    ],
    "order": [
      [
        "Having finished the report she closed her laptop",
        "Raporu bitirdikten sonra dizüstü bilgisayarını kapattı."
      ],
      [
        "Walking along the beach I found a seashell",
        "Sahil boyunca yürürken bir deniz kabuğu buldum."
      ],
      [
        "Shocked by the announcement everyone stayed silent",
        "Duyuruyla sarsılan herkes sessiz kaldı."
      ]
    ]
  },
  {
    "id": "b2_academic_formal",
    "level": "B2",
    "type": "vocab",
    "title": "Akademik ve Resmi Yazışma Dili",
    "en": "Academic & Formal Discourse",
    "emoji": "🖋️",
    "words": [
      [
        "consequently",
        "sonuç olarak / dolayısıyla",
        "➡️"
      ],
      [
        "furthermore",
        "ayrıca / dahası",
        "📑"
      ],
      [
        "nevertheless",
        "buna rağmen / yine de",
        "⚖️"
      ],
      [
        "substantiate",
        "somut kanıtlarla desteklemek",
        "📋"
      ],
      [
        "imperative",
        "zorunlu / hayati önemde",
        "❗"
      ],
      [
        "discourse",
        "söylem / akademik tartışma",
        "🎙️"
      ],
      [
        "facilitate",
        "kolaylaştırmak / olanak sağlamak",
        "🗝️"
      ],
      [
        "comprehensive",
        "kapsamlı / etraflı",
        "🌐"
      ],
      [
        "coherent",
        "tutarlı / bağlantılı",
        "🧩"
      ],
      [
        "notwithstanding",
        "-e rağmen / karşın",
        "🛡️"
      ],
      [
        "prevalent",
        "yaygın / hüküm süren",
        "📊"
      ],
      [
        "methodology",
        "yöntembilim / metodoloji",
        "📐"
      ]
    ]
  },
  {
    "id": "b2_mixed_conditionals",
    "level": "B2",
    "type": "grammar",
    "title": "Karışık Koşullar (Mixed Conditionals)",
    "en": "Mixed Conditionals",
    "emoji": "🔀",
    "explain": "<h4>Karışık Koşul Cümleleri (Mixed Conditionals)</h4>\n<p>Geçmişteki bir eylemin <b>şimdiki zamandaki sonucunu</b> veya genel bir özelliğin <b>geçmişteki sonucunu</b> ifade eder.</p>\n<table class=\"g-table\">\n  <tr><th>Koşul</th><th>Sonuç</th><th>Örnek</th><th>Anlamı</th></tr>\n  <tr><td>Geçmiş (had V3)</td><td>Şimdiki Zaman (would V1)</td><td>If I <b>had accepted</b> that job, I <b>would be</b> rich today.</td><td>Kabul etseydim bugün zengin olurdum.</td></tr>\n  <tr><td>Genel Durum (Past)</td><td>Geçmiş Sonuç (would have V3)</td><td>If I <b>weren't</b> so afraid of heights, I <b>would have climbed</b>.</td><td>Korkmasaydım tırmanırdım.</td></tr>\n</table>",
    "examples": [
      [
        "If I had won that scholarship, I would be studying in London right now.",
        "O bursu kazansaydım şu an Londra'da okuyor olurdum."
      ],
      [
        "If she spoke German fluently, she would have gotten the job yesterday.",
        "Almanca'yı akıcı konuşuyor olsaydı dün işe alınırdı."
      ],
      [
        "If we had taken the map, we wouldn't be lost right now.",
        "Haritayı alsaydık şu an kaybolmuş olmazdık."
      ]
    ],
    "mc": [
      [
        "If I had saved more money last year, I ___ that apartment now.",
        [
          "would buy",
          "would have bought",
          "will buy"
        ]
      ],
      [
        "If he ___ so stubborn, he would have apologized yesterday.",
        [
          "weren't",
          "hadn't been",
          "isn't"
        ]
      ],
      [
        "If we had taken the earlier flight, we ___ at the beach right now.",
        [
          "would be relaxing",
          "will relax",
          "would have relaxed"
        ]
      ],
      [
        "If she had prepared better, she ___ so nervous today.",
        [
          "wouldn't be",
          "wouldn't have been",
          "won't be"
        ]
      ],
      [
        "If I were braver, I ___ that roller coaster yesterday.",
        [
          "would have ridden",
          "would ride",
          "will ride"
        ]
      ]
    ],
    "order": [
      [
        "If I had taken the map we would not be lost",
        "Haritayı alsaydım kaybolmuş olmazdık."
      ],
      [
        "If she were more patient she would have succeeded",
        "Daha sabırlı olsaydı başarırdı."
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
        "inevitable",
        "kaçınılmaz",
        "⏳"
      ],
      [
        "unprecedented",
        "eşi benzeri görülmemiş",
        "🌟"
      ],
      [
        "profound",
        "derin / etkileyici",
        "🌊"
      ],
      [
        "vulnerable",
        "savunmasız / incinebilir",
        "🛡️"
      ],
      [
        "eloquent",
        "etkili konuşan / beliğ",
        "🎙️"
      ],
      [
        "superficial",
        "yüzeysel / sığ",
        "🛶"
      ],
      [
        "ambiguous",
        "muğlak / çift anlamlı",
        "🌫️"
      ],
      [
        "relentless",
        "aralıksız / amansız",
        "⚡"
      ],
      [
        "pragmatic",
        "pratik / faydacı",
        "🔧"
      ],
      [
        "candid",
        "samimi / içten / açık sözlü",
        "🤍"
      ],
      [
        "flawless",
        "kusursuz / lekesiz",
        "✨"
      ]
    ]
  },
  {
    "id": "b2_unreal_past_subjunctive",
    "level": "B2",
    "type": "grammar",
    "title": "Gerçek Dışı Geçmiş (It's high time, I'd rather)",
    "en": "Unreal Past & Subjunctive",
    "emoji": "⏳",
    "explain": "<h4>Gerçek Dışı Geçmiş: Unreal Past (It's time, would rather)</h4>\n<p>Şimdiki veya gelecek zamandaki bir durumdan <b>acil beklenti</b> veya <b>güçlü tercih</b> belirtirken fiil geçmiş zamanda çekimlenir.</p>\n<table class=\"g-table\">\n  <tr><th>Kalıp</th><th>Kural</th><th>Örnek Cümle</th><th>Anlamı</th></tr>\n  <tr><td><b>It's high time</b></td><td>Özne + Past Simple</td><td>It's high time you <b>found</b> a job!</td><td>Çoktan bir iş bulmuş olmalıydın! (Vakti geldi de geçiyor).</td></tr>\n  <tr><td><b>I'd rather</b></td><td>Özne + Past Simple</td><td>I'd rather you <b>didn't smoke</b> here.</td><td>Burada sigara içmemeni tercih ederim.</td></tr>\n  <tr><td><b>as if / as though</b></td><td>Özne + Past Simple</td><td>He talks as if he <b>knew</b> everything.</td><td>Her şeyi biliyormuş gibi konuşuyor.</td></tr>\n</table>",
    "examples": [
      [
        "It is high time we made a decision.",
        "Bir karar almamızın vakti geldi de geçiyor."
      ],
      [
        "I would rather you stayed with us tonight.",
        "Bu gece bizimle kalmanı tercih ederim."
      ],
      [
        "She acts as though she were the boss.",
        "Sanki patron kendisiymiş gibi davranıyor."
      ]
    ],
    "mc": [
      [
        "It's high time you ___ your bedroom.",
        [
          "cleaned",
          "clean",
          "cleaning"
        ]
      ],
      [
        "I'd rather you ___ anyone about our conversation.",
        [
          "didn't tell",
          "don't tell",
          "won't tell"
        ]
      ],
      [
        "He spends money as if he ___ a billionaire.",
        [
          "were",
          "is",
          "will be"
        ]
      ],
      [
        "It is time we ___ home; it is getting dark.",
        [
          "went",
          "go",
          "are going"
        ]
      ],
      [
        "Would you rather we ___ tomorrow instead?",
        [
          "met",
          "meet",
          "will meet"
        ]
      ]
    ],
    "order": [
      [
        "It is high time you made up your mind",
        "Kararını vermenin vakti geldi de geçiyor."
      ],
      [
        "I would rather you did not discuss this in public",
        "Bunu herkesin içinde konuşmamanı tercih ederim."
      ],
      [
        "He speaks as if he owned the entire building",
        "Bütün binanın sahibiymiş gibi konuşuyor."
      ]
    ]
  },
  {
    "id": "b2_rhetoric_debate",
    "level": "B2",
    "type": "vocab",
    "title": "Hitabet, Retorik ve Argüman",
    "en": "Rhetoric & Discourse",
    "emoji": "🏛️",
    "words": [
      [
        "persuasive",
        "ikna edici",
        "🎯"
      ],
      [
        "eloquence",
        "güzel ve etkili konuşma sanatı",
        "🎙️"
      ],
      [
        "controversy",
        "ihtilaf / hararetli tartışma",
        "⚡"
      ],
      [
        "dilemma",
        "ikilem / çıkmaz",
        "🤔"
      ],
      [
        "consensus",
        "fikir birliği / uzlaşma",
        "🤝"
      ],
      [
        "plausible",
        "makul / akla yatkın",
        "💡"
      ],
      [
        "counterargument",
        "karşı sav / antitez",
        "🛡️"
      ],
      [
        "fallacy",
        "mantık hatası / safsata",
        "⚠️"
      ],
      [
        "assert",
        "iddia etmek / ileri sürmek",
        "📢"
      ],
      [
        "clarify",
        "netleştirmek / açıklığa kavuşturmak",
        "🔍"
      ],
      [
        "advocate",
        "savunmak / destekçi",
        "🗣️"
      ],
      [
        "validity",
        "geçerlilik / doğruluk",
        "✅"
      ]
    ]
  }

];

/* ---------- CEFR Seviyeleri ---------- */
const LEVELS = [
  { id: 'A1', name: 'A1 Başlangıç (Beginner)', emoji: '🌱', desc: 'Temel kelimeler, tanışma ve günlük yaşam.', count: 27 },
  { id: 'A2', name: 'A2 Temel Akıcılık (Elementary)', emoji: '🚀', desc: 'Geçmiş zaman, gelecek planları, seyahat ve alışveriş.', count: 25 },
  { id: 'B1', name: 'B1 Bağımsız İletişim (Intermediate)', emoji: '⚡', desc: 'Edilgen çatı, dolaylı anlatım, koşul cümleleri ve kariyer.', count: 20 },
  { id: 'B2', name: 'B2 İleri Düzey Yetkinlik (Upper-Intermediate)', emoji: '👑', desc: 'Devrik cümleler, nüanslar, deyimler ve akıcı argüman.', count: 20 }
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
