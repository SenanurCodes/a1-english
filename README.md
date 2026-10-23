# PatiLingo — Kural Ezberletmeyen A1-A2 Ingilizce Ogrenme Platformu (PWA)

**Canli Uygulama:** [https://senanurcodes.github.io/a1-english](https://senanurcodes.github.io/a1-english)  
**Kaynak Kod:** [https://github.com/SenanurCodes/a1-english](https://github.com/SenanurCodes/a1-english)

---

## Ekran Goruntuleri

> [!NOTE]
> Projenin gorsel etkisini en iyi sekilde yansitmak icin asagidaki 4 ekran goruntusunu kaydedip `screenshots/` dizinine ekleyebilirsiniz:
> 1. `screenshots/01-dil-mantigi-simulasyonu.png` -> Dil Mantigi sayfasindaki interaktif vagon dizilimi ekrani (`#/logic`).
> 2. `screenshots/02-cumle-lokomotifi-oyunu.png` -> Cumle Lokomotifi SVO vagon kenetleme oyunu (`#/locomotive`).
> 3. `screenshots/03-tuzak-avcisi-bomba-arcade.png` -> Tuzak Avcisi dinamik zorlasan bomba imha ekrani (`#/trap-hunter`).
> 4. `screenshots/04-shimeji-maskot-ve-harita.png` -> Ekranda gezinen interaktif maskot ve Hayatta Kalma Haritasi (`#/survival`).

```
[ Ekran Goruntusu: 1. Dil Mantigi Simulasyonu | screenshots/01-dil-mantigi-simulasyonu.png ]
[ Ekran Goruntusu: 2. Cumle Lokomotifi SVO   | screenshots/02-cumle-lokomotifi-oyunu.png ]
[ Ekran Goruntusu: 3. Tuzak Avcisi Bomba     | screenshots/03-tuzak-avcisi-bomba-arcade.png ]
[ Ekran Goruntusu: 4. Canli Shimeji Maskotu  | screenshots/04-shimeji-maskot-ve-harita.png ]
```

---

## Proje Ozeti

PatiLingo, Turk ogrencilerin Ingilizce ogrenirken yasadigi en buyuk bilissel engel olan Turkce SOV (Ozne-Nesne-Yuklem) ile Ingilizce SVO (Ozne-Yuklem-Nesne) cumle yapisi catismasini cozmek amaciyla gelistirilmis etkilesimli bir A1-A2 Ingilizce Progressive Web App (PWA) platformudur.

Uygulama; klasik kurallari ezberletmek yerine Turkcenin sondan eklemeli yapisini Ingilizcenin kelime sirasi mantigiyla esleyen gorsel bir Cumle Lokomotifi simulasyonu, Turkce dusunme kaliplarindaki hatalari yakalayan Tuzak Avcisi bomba imha oyunu, 5 asamali Leitner aralikli tekrar (SRS) sistemi ve sayfada kullaniciya eslik eden canli bir Shimeji maskot arkadasi sunar.

Istemci tarafinda sifir harici kutuphane bagimliligiyla (Vanilla JavaScript) gelistirilen proje, cevrimdisi (offline-first) calisabilme yetenegi, yapay zeka destekli rol yapma senaryolari (Google Gemini AI) ve 11/11 modulluk tam kapsamli otomatik test mimarisine sahiptir.

---

## Bu Projede Neler Ogrendim?

### Kendi Kurguladigim ve Gelistirdigim Kisimlar
* **Pedagojik Dil Mantigi Tasarimi:** Turkcenin sondan eklemeli ekleriyle Ingilizcenin sira tabanli yuklem-nesne duzenini gorsel olarak esleyen mantik simulasyonunu ve vagon kenetleme mekanigini tasarladim.
* **Mufredat ve Veritabani Mimarisi:** 27 A1 ve 25 A2 olmak uzere toplam 52 unitelik kapsamli kurs haritasini, kelime destelerini, gramer aciklamalarini ve Boss sinavlarini kurguladim.
* **Oyunlastirma Donguleri:** Gunluk 5/5 lokomotif seferi (Daily Challenge), puan artisina bagli 3 kademeli (Isinma -> Dedektif -> Kirmizi Alarm) Tuzak Avcisi bomba imha dinamikleri ve 5 kutulu Spaced Repetition (SRS) algoritmasini insa ettim.

### Yapay Zeka (AI) Destegiyle Gelistirdigim Kisimlar
* **Otomatik Test Suiti (CI/CD):** Node.js ve `jsdom` uzerinde calisan, API yanitlarini (200, 403, 429, fallback), XSS korumasini ve kullanici akislarini dogrulayan 11/11 kapsamli otomatik test suiti mimarisini yapay zeka ile pair-programming yaparak kurdum.
* **PWA ve Service Worker Onbellegi:** Uygulamanin cebe yuklenebilmesini, cevrimdisi calismasini ve her yeni surumde tarayici onbellegini dinamik olarak temizleyen Service Worker altyapisini olusturdum.
* **Donanim & Mobil Uyum:** Shimeji maskotunun masaustunde fareyle, mobil ekranlarda ise Pointer Events ve `setPointerCapture` ile pürüzsüz suruklenebilmesi icin gerekli dokunmatik olay optimizasyonlarini yaptim.

### En Cok Zorlandigim Noktalar ve Cozumlerim
* **Mobil Dokunmatik (Touch/Pointer) Olaylari:** Mobilde (ozellikle iOS Safari ve PWA standalone modunda) maskotu tutup suruklerken tarayicinin varsayilan dikey sayfa kaydirma (`overscroll`) hareketiyle surukleme olayinin cakismasi beni cok zorladi. Bu sorunu `touch-action: none`, SVG path pointer izolasyonu ve Pointer Events + Touch fallback cift katmanli olay dinleyicileriyle cozdum.
* **PWA Onbellek Kilitlenmesi:** Gelistirme sirasinda mobil tarayicilarin eski JavaScript dosyalarini inatla onbellekte tutmasi nedeniyle yapilan guncellemelerin yansimamasi karsilastigim en buyuk engellerden biriydi. Otomatik surum artirma (`bump-version.js`) betigi yazarak her yayinda Service Worker onbellegini otomatik tazeleyen bir yapi kurdum.

---

## Temel Ozellikler

* **52 Yapilandirilmis Unite (27 A1 + 25 A2):** Kelime desteleri, gramer anlatimlari, etkilesimli alistirmalar (coktan secmeli, kelime dizme, dinleme, eslestirme) ve kilit acmali Boss Sinavlari.
* **Cumle Lokomotifi (SVO Vagon Kenetleme):** Turkcenin SOV dizilimi yerine Ingilizcenin Ozne + Yuklem + Nesne + Mekan + Zaman vagonlarini dogru kenetlemeyi ogreten gunluk interaktif alistirma motoru.
* **Tuzak Avcisi (Bomba Imha Arcade):** Turk ogrencilerin en cok yaptigi mantik hatalarini (*"I am agree"*, *"She has 20 years old"*, *"Listen music"*, *"Actually"*) zamana karsi tespit edip patlatan dinamik zorlasan oyun.
* **Canli Shimeji Maskot Arkadasi:** Ekranda yuruyen, kullaniciyla konusan, parmakla veya fareyle suruklenebilen interaktif masaustu/mobil evcil hayvan (5 farkli maskot secenegi: Pamuk, Findik, Dost, Bilge, Bambu).
* **Hayatta Kalma Haritasi (Gemini AI Rol Yapma):** Heathrow Havalimani pasaport kontrolu, Soho'da kahve siparisi veya metroda adres sorma gibi gercek senaryolarda yapay zekayla rol yapma alistirmalari.
* **Akilli Tekrar (Spaced Repetition - SRS):** 5 kutulu Leitner sistemiyle kelimelerin unutulma egrisini takip eden ve zamani gelen kelimeleri pratik ettiren hafiza motoru.
* **Tam Cevrimdisi Destek (PWA):** Internetsiz ortamda calisabilen, ana ekrana yuklenebilen ve verileri yerel depolamada (`localStorage`) guvenle saklayan istemci tarafi mimari.

---

## Mimari ve Teknoloji Yigini

* **On Yuz:** Saf HTML5, Semantik CSS3, Vanilla JavaScript (ES6+ Moduller)
* **PWA:** Service Worker (`Cache Storage` ve `Offline Fallback`), Web App Manifest
* **Ses & Telaffuz:** Web Speech API (`SpeechSynthesis`)
* **Yapay Zeka:** Google Gemini API (`gemini-2.5-flash` / `gemini-2.0-flash` REST entegrasyonu)
* **Veri Depolama & Senkronizasyon:** `localStorage` ve coklu cihaz senkronizasyon motoru
* **Test & Kalite Guvencesi:** Node.js, `jsdom`, 11/11 Otomatik Entegrasyon Test Suiti

---

## Testleri Calistirma

Projenin tum mimari, guvenlik (XSS, TDZ), dil mantigi ve rota dogrulamalarini iceren test suiti tek komutla calistirilabilir:

```bash
# 1. Tum JavaScript dosyalarinin soz dizimini dogrula
node --check js/app.js

# 2. 11/11 Otomatik test suitini calistir
node tests/run-tests.js
```
