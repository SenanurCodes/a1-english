# PatiLingo Android Ana Ekran Kelime Widget'ı

Bu klasör, Play Store `.aab` paketini oluştururken (PWABuilder kaynak projesi veya Capacitor Android projesi) doğrudan kopyalanıp kullanılabilecek **hazır Android Ana Ekran Widget** dosyalarını içerir.

## Özellikler
- **702 gerçek PatiLingo kelimesi** (`res/raw/patilingo_words.json`) — tamamen çevrimdışı çalışır.
- **Otomatik Açık / Koyu Tema** (`values/` ve `values-night/`).
- **Her 3 saatte bir** otomatik yeni kelime + ana ekrandan **`🔄 Yeni`** butonuyla anında kelime değiştirme.
- **2×2 Kare** ve **4×2 Geniş** boyutlara esnek uyumlu.

## Play Store Android Projesine 3 Adımda Ekleme

1. `PatiLingoWordWidget.kt` dosyasını Android projesindeki `app/src/main/java/io/github/senanurcodes/patilingo/widget/` klasörüne kopyala *(paket adını kendi `applicationId` değerine göre güncelle)*.
2. `res/` klasöründeki tüm alt klasörleri (`drawable`, `layout`, `raw`, `values`, `values-night`, `xml`) projenin `app/src/main/res/` klasörüne kopyala.
3. `app/src/main/AndroidManifest.xml` içindeki `<application>` bloğuna şunu ekle:

```xml
<receiver
    android:name=".widget.PatiLingoWordWidget"
    android:exported="true"
    android:label="PatiLingo Kelime Kartı">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
        <action android:name="io.github.senanurcodes.patilingo.ACTION_NEXT_WORD" />
    </intent-filter>
    <meta-data
        android:name="android.appwidget.provider"
        android:resource="@xml/patilingo_word_widget_info" />
</receiver>
```
