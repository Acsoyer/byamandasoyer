# byamandasoyer.pt — Proje Açıklaması

Bu klasör, **byAmandaSoyer Lisbon Baking Studio** web sitesinin yayınlanabilir statik sürümünü içerir. Proje herhangi bir build sistemi veya framework gerektirmez; HTML, CSS ve JavaScript doğrudan dosyaların içinde yer alır.

## Ana dosyalar

### `index.html`

Sitenin ana sayfasıdır.

Başlıca sorumlulukları:

- İngilizce ve Portekizce dil desteği
- Mobil öncelikli hero alanı
- Fotoğrafsız, mobil öncelikli marka hero alanı
- Düşük kontrastlı, tekrar eden pasta süsleme deseni
- Instagram, TikTok, WhatsApp ve e-posta bağlantıları
- “Start Your Order / Comece a sua encomenda” sipariş butonları
- Scroll sırasında görünen sticky üst menü
- Testimonials / Feedback bölümü
- İki dilli FAQ içeriği ve accordion davranışı
- Guides & Care bölümü
- Footer ve Privacy Policy bağlantısı
- Sipariş formunun tam ekran iframe overlay içinde açılması
- Ana sayfanın scroll konumunu sipariş formu açılıp kapatılırken koruma

Ana sayfa sipariş formunu şu şekilde açar:

```text
cake-order-form.html?lang=<en|pt>&embed=1
```

Ana sayfa ve iframe içindeki form `postMessage` kullanarak adım numarası, restart ve kapatma olaylarını birbirine iletir.

## `cake-order-form.html`

Özel pasta sipariş formudur. Tek dosya içinde form arayüzünü, fiyat hesaplamasını, doğrulamayı ve Supabase entegrasyonunu barındırır.

Formun mevcut adımları:

1. Boyut
2. Lezzet
3. Renk
4. Pasta üzeri yazı
5. Dekorasyon
6. Mum
7. Referans fotoğrafları
8. Alerjiler
9. Politikalar
10. İletişim bilgileri
11. Teslim alma tarihi ve saati
12. Markanın nereden duyulduğu
13. E-posta tercihi
14. Sipariş özeti ve gönderim

Formun başlıca özellikleri:

- İngilizce ve Portekizce arayüz
- Seçimlere göre anlık tahmini fiyat hesaplama
- Zorunlu alan ve adım doğrulaması
- En fazla üç referans görseli yükleme
- Sipariş özet ekranı
- Mobil uyumlu adım göstergesi
- Sipariş tamamlandıktan sonra isteğe bağlı geri bildirim
- İki dilli Privacy Policy modalı
- Ana sayfa içinde iframe olarak veya bağımsız sayfa olarak çalışabilme

## Supabase veri akışı

`cake-order-form.html`, Supabase JavaScript istemcisini CDN üzerinden yükler.

- Sipariş kayıtları `orders` tablosuna eklenir.
- Referans fotoğrafları `references` Storage bucket’ına yüklenir.
- Yüklenen fotoğrafların public URL’leri sipariş kaydına eklenir.
- Yeni siparişler `status: "new"` ve `is_read: false` değerleriyle oluşturulur.
- Gönderim sonrasında üretilen özel submission token, geri bildirimi siparişle güvenli biçimde ilişkilendirmek için kullanılır.
- Geri bildirim `submit_order_feedback` RPC fonksiyonu üzerinden gönderilir.

Dosyada kullanılan Supabase anon key istemci tarafında bulunur. Bu normaldir; gerçek veri güvenliği Supabase RLS politikaları, Storage politikaları ve RPC yetkileriyle sağlanmalıdır. Service-role anahtarı hiçbir zaman bu dosyalara eklenmemelidir.

## `order/index.html`

Müşteriye özel sipariş portalıdır. URL içindeki token ile sipariş bilgilerini getirir ve müşterinin siparişi kabul veya iptal etmesine imkân verir.

Kullanılan RPC fonksiyonları:

- `get_order_portal`
- `respond_order_portal`

Beklenen bağlantı biçimi:

```text
/order/<token>
```

## `vercel.json`

Vercel üzerinde müşteri sipariş bağlantısını portal sayfasına yönlendirir:

```text
/order/:token → /order/index.html?token=:token
```

## Yayınlama

Bu klasör Vercel’e statik site olarak yüklenebilir. Yayın sırasında aşağıdaki yapının korunması gerekir:

```text
byamandasoyer.pt/
├── index.html
├── cake-order-form.html
├── vercel.json
├── order/
│   └── index.html
└── description.md
```

Ana sayfa ile sipariş formu arasındaki göreli bağlantılar nedeniyle `index.html` ve `cake-order-form.html` aynı klasörde kalmalıdır.

## Bakım notları

- Hero alanı geniş `byAmandaSoyer_Logo_NoBackground.png` logosunu Supabase bağlantısından kullanır. Düşük kontrastlı pasta süsleme deseni düzenlenebilir `background-pattern.svg` ve `background-pattern-light.svg` dosyalarında tutulur.
- Testimonials metinleri `TESTI` dizisinden yönetilir.
- FAQ içeriği `FAQ` dizisinden yönetilir.
- Guides & Care içeriği `GUIDES` dizisinden yönetilir.
- Sipariş formu adım sırası `cake-order-form.html` içindeki `STEPS` dizisinden yönetilir.
- Ana sayfa adresi form içindeki `MAIN_PAGE_URL` sabitinden yönetilir.
- Form fiyatları, seçenekleri ve iki dilli metinleri form dosyasındaki veri nesnelerinde tutulur.
- Privacy Policy her iki dil için `PRIVACY` nesnesinde yer alır.
- Mobil Safari düzeninde `svh`, `dvh` ve `safe-area-inset-bottom` kullanılır. Hero yüksekliği veya alt boşluk değiştirilirken iPhone Safari’de gerçek cihaz testi yapılmalıdır.
- Yeni sürüm hazırlanırken mevcut klasör korunmalı ve bir sonraki numaralı sürüme kopyalanmalıdır.

## Sürüm

Bu doküman `Byamandasoyer_v18` klasöründeki site yapısını açıklamak için güncellenmiştir.

### v17 ana sayfa değişiklikleri

- v16 klasörü bütünüyle v17'ye kopyalandı; dashboard, sipariş formu ve müşteri portalı korundu.
- Açılış hero alanındaki hareketli pasta fotoğrafı şeridi ve ona bağlı lightbox kodu kaldırıldı.
- Yuvarlak `byAS` logosu yerine geniş `byAmandaSoyer` logosu kullanıldı.
- Markanın bordo rengini çok düşük opaklıkta kullanan, küçük pasta/parıltı çizimlerinden oluşan tekrar eden arka plan deseni eklendi.
- Hero yüksekliği iOS Safari için `100svh`, `safe-area-inset-top` ve `safe-area-inset-bottom` ile yeniden düzenlendi.
- Önceki sürümde yapay olarak eklenen 168–196 piksellik mobil hero yüksekliği kaldırıldı; kısa iPhone ekranları için ayrıca kompakt bir yerleşim eklendi.

### v18 ana sayfa değişiklikleri

- v17 klasörü bütünüyle v18'e kopyalandı; dashboard, sipariş formu ve müşteri portalı korundu.
- Tüm geniş logo kullanımları Supabase'deki şu ortak kaynağa bağlandı: `https://ivnybivjjydihltknlmo.supabase.co/storage/v1/object/public/references/images/byAmandaSoyer_Logo_NoBackground.png`.
- Hero logosu, metinleri, bilgi kutusu, sosyal düğmeleri ve ana sipariş düğmesi büyütüldü.
- Hero içeriği üstten başlayan ve ana CTA'yı ekranın güvenli alt kenarına yerleştiren bir düzene geçirildi. İlk açılışta sonraki bölümün görünmemesi için `100svh` yüksekliği korundu.
- `Start Your Order` düğmesi CTA grubunun sonuna taşındı; böylece iOS Safari alt araç çubuğuna güvenli alan bırakırken gereksiz büyük boşluk azaltıldı.
- Arka plan deseni düzenlenebilir `background-pattern.svg` dosyasına taşındı ve hero dışındaki açık renkli sayfa bölümlerine de uygulandı.
- Testimonials gibi bordo zeminlerde aynı çizimlerin açık renkli sürümü olan `background-pattern-light.svg` kullanılmaya başlandı. Footer bilinçli olarak desensiz bırakıldı.

#### Arka plan desenini kişiselleştirme

Her iki SVG de 92 × 92 piksellik tekrar eden bir karo içerir. Dosyalar normal bir metin düzenleyicide veya SVG destekleyen bir tasarım aracında açılabilir.

- Desen rengini değiştirmek için `<g>` içindeki `stroke` değerini değiştirin.
- Belirginliği değiştirmek için `stroke-opacity` değerini değiştirin. `0` görünmez, `1` tamamen opaktır.
- Çizgi kalınlığını değiştirmek için `stroke-width` değerini değiştirin.
- Tekrar sıklığını değiştirmek için SVG içindeki `width`, `height` ve `viewBox` değerleriyle birlikte CSS'teki `background-size:92px 92px` değerini güncelleyin.
- Tek tek semboller SVG içindeki dört ayrı `<path>` öğesidir. İstenmeyen sembolün `<path>` satırı silinebilir veya aynı `viewBox` içinde yeni çizimler eklenebilir.
- Açık ve bordo zemin sürümlerinin şekillerinin aynı kalması için bir dosyada yapılan yol (`d`) değişiklikleri diğer dosyaya da uygulanmalıdır.
