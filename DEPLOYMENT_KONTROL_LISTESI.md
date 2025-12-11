# Deployment Kontrol Listesi

## 🎯 Her Yeni Özellik Eklendikten Sonra Yapılacaklar

### ADIM 1: GitHub'a Yükleme
```powershell
git add .
git commit -m "Özellik açıklaması"
git push
```

### ADIM 2: Cloudflare Deployment Kontrolü (2-3 dakika sonra)
1. Cloudflare Dashboard → "Workers & Pages" → "Pages"
2. "qr-menu-restoran" projesine tıklayın
3. "Deployments" sekmesine gidin
4. En son deployment'ı kontrol edin:
   - ✅ **Yeşil tik** = Başarılı
   - ❌ **Kırmızı X** = Başarısız (build loglarına bakın)
   - ⏳ **Sarı işaret** = Build sürüyor (bekleyin)

### ADIM 3: Build Logları Kontrolü (Eğer başarısızsa)
1. Deployment'a tıklayın
2. "Build logs" veya "View logs" butonuna tıklayın
3. Hata mesajlarını kontrol edin
4. Hataları düzeltin ve tekrar yükleyin

### ADIM 4: Test Etme
1. **Önce Cloudflare Pages URL'sini test edin:**
   - `qr-menu-restoran.pages.dev` açılıyor mu?
   - ✅ Açılıyorsa → Deployment başarılı
   - ❌ Açılmıyorsa → Build hatası var

2. **Sonra custom domain'i test edin:**
   - `mezecim.net` açılıyor mu?
   - ✅ Açılıyorsa → Her şey tamam
   - ❌ Açılmıyorsa → DNS cache sorunu (15-30 dakika bekleyin)

### ADIM 5: Tarayıcı Cache Temizleme
1. Ctrl + Shift + Delete (Windows) veya Cmd + Shift + Delete (Mac)
2. "Cached images and files" seçin
3. "Clear data" butonuna tıklayın
4. Hard refresh yapın (Ctrl + F5)

---

## 🆘 Sık Karşılaşılan Sorunlar ve Çözümleri

### Sorun 1: Build Başarısız
**Belirtiler:**
- Deployment'da kırmızı X görünüyor
- Build loglarında hata mesajları var

**Çözüm:**
1. Build loglarına bakın
2. Hata mesajını okuyun
3. Kodu düzeltin
4. Tekrar GitHub'a yükleyin

### Sorun 2: Deployment Başarılı Ama Site Açılmıyor
**Belirtiler:**
- Deployment'da yeşil tik var
- `qr-menu-restoran.pages.dev` açılıyor
- `mezecim.net` açılmıyor

**Çözüm:**
1. Tarayıcı cache'ini temizleyin
2. Hard refresh yapın (Ctrl + F5)
3. 15-30 dakika bekleyin (DNS propagation)
4. Farklı tarayıcı/cihaz deneyin

### Sorun 3: next.config.js Hatası
**Belirtiler:**
- Build loglarında "next.config.js" hatası

**Çözüm:**
1. `next.config.js` dosyasını kontrol edin
2. Syntax hatası var mı bakın
3. Düzeltin ve tekrar yükleyin

### Sorun 4: DNS Cache Sorunu
**Belirtiler:**
- `qr-menu-restoran.pages.dev` açılıyor
- `mezecim.net` açılmıyor
- DNS kayıtları doğru

**Çözüm:**
1. Tarayıcı cache'ini temizleyin
2. 15-30 dakika bekleyin
3. Farklı DNS sunucusu deneyin (Google DNS: 8.8.8.8)

---

## ✅ Başarılı Deployment Kontrol Listesi

- [ ] GitHub'a yüklendi
- [ ] Cloudflare'de deployment başarılı (yeşil tik)
- [ ] `qr-menu-restoran.pages.dev` açılıyor
- [ ] `mezecim.net` açılıyor
- [ ] `www.mezecim.net` açılıyor
- [ ] Yeni özellik çalışıyor
- [ ] Mobil görünümde test edildi

---

## 📝 Notlar

- **Deployment süresi:** Genellikle 2-3 dakika
- **DNS propagation:** 15-30 dakika ile 1-2 saat arası
- **Build hatası:** Hemen düzeltilmeli, beklemek sorunu çözmez
- **DNS cache:** Tarayıcı cache'ini temizlemek genellikle yeterli

---

## 🎯 Özet

Her yeni özellik ekledikten sonra:
1. ✅ GitHub'a yükleyin
2. ✅ Cloudflare'de deployment durumunu kontrol edin
3. ✅ Build loglarına bakın (eğer başarısızsa)
4. ✅ `qr-menu-restoran.pages.dev` adresini test edin
5. ✅ `mezecim.net` adresini test edin
6. ✅ Tarayıcı cache'ini temizleyin

**Beklemek yerine proaktif olun!** 🚀

