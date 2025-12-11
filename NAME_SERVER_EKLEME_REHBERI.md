# Name Server Ekleme Rehberi - Detaylı Adım Adım

## 🎯 AMAÇ
Domain'inizi Cloudflare'e bağlamak için name server'ları Turhost panelinden değiştirmemiz gerekiyor.

---

## 📝 ADIM 1: Cloudflare'den Name Server'ları Alın

### 1.1. Cloudflare Dashboard'da
1. Cloudflare sayfasında **"Continue to activation"** butonuna tıklayın
2. Cloudflare size 2 name server adresi verecek, örneğin:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
3. Bu name server'ları **KOPYALAYIN** veya **NOT ALIN**

**Örnek Name Server'lar:**
- `dana.ns.cloudflare.com`
- `jim.ns.cloudflare.com`
- Veya benzer isimler

---

## 📝 ADIM 2: Turhost Panelinden Name Server'ları Değiştirin

### 2.1. Turhost'a Giriş Yapın
1. Tarayıcıda şu adrese gidin: **https://www.turhost.com**
2. Sağ üstte **"Giriş Yap"** butonuna tıklayın
3. E-posta ve şifrenizle giriş yapın

### 2.2. Domain Yönetim Paneline Gidin
1. Turhost ana sayfasında **"Domainlerim"** veya **"Domain Yönetimi"** seçeneğine tıklayın
2. Domain listesinden **"mezecim.net"** domain'ine tıklayın
3. Domain detay sayfasına gidin

### 2.3. Name Server Ayarlarını Bulun
1. Domain detay sayfasında şu seçenekleri arayın:
   - **"Name Server Ayarları"**
   - **"DNS Ayarları"**
   - **"Name Server Değiştir"**
   - **"NS Kayıtları"**
   - Veya benzer bir başlık

2. Genellikle şu bölümlerde olur:
   - Sol menüde "DNS" veya "Name Server" sekmesi
   - Sayfanın ortasında "Name Server Ayarları" bölümü
   - "Ayarlar" veya "Yönetim" sekmesi altında

### 2.4. Name Server'ları Değiştirin
1. **"Name Server Değiştir"** veya **"Düzenle"** butonuna tıklayın
2. Mevcut name server'ları görürsünüz (örnek: `ns1.turhost.com`, `ns2.turhost.com`)
3. Cloudflare'den aldığınız name server'ları yazın:

**Örnek:**
- **Name Server 1:** `dana.ns.cloudflare.com`
- **Name Server 2:** `jim.ns.cloudflare.com`

4. **"Kaydet"** veya **"Güncelle"** butonuna tıklayın

---

## 📝 ADIM 3: Değişikliği Onaylayın

### 3.1. Turhost'tan Onay
- Turhost size bir onay mesajı gösterebilir
- **"Evet"** veya **"Onayla"** butonuna tıklayın
- Bazen e-posta onayı isteyebilir (e-postanızı kontrol edin)

### 3.2. Bekleme Süresi
- Name server değişikliği **24-48 saat** içinde aktif olur
- Genellikle **1-2 saat** içinde çalışmaya başlar
- Bazen **15-30 dakika** içinde de aktif olabilir

---

## 📝 ADIM 4: Cloudflare'de Kontrol Edin

### 4.1. Cloudflare Dashboard'a Dönün
1. Cloudflare dashboard'a gidin
2. Domain'inize (`mezecim.net`) tıklayın
3. **"Overview"** sekmesine gidin

### 4.2. Name Server Durumunu Kontrol Edin
- **"Invalid nameservers"** uyarısı kaybolmalı
- **"Active"** veya **"Active (DNS Only)"** yazısı görünmeli
- Name server'lar doğru görünmeli

---

## 📝 ADIM 5: DNS Kaydı Ekleyin (Name Server Aktif Olduktan Sonra)

### 5.1. Cloudflare DNS Sekmesine Gidin
1. Sol menüden **"DNS"** sekmesine tıklayın
2. **"+ Add record"** butonuna tıklayın

### 5.2. Root Domain İçin CNAME Ekleyin
1. **Type:** `CNAME` seçin
2. **Name:** `@` yazın (veya boş bırakın)
3. **Target:** `qr-menu-restoran.pages.dev` yazın
4. **Proxy status:** **Proxied** (turuncu bulut) seçin
5. **TTL:** Auto
6. **"Save"** butonuna tıklayın

### 5.3. www Subdomain İçin CNAME Ekleyin
1. Tekrar **"+ Add record"** butonuna tıklayın
2. **Type:** `CNAME` seçin
3. **Name:** `www` yazın
4. **Target:** `qr-menu-restoran.pages.dev` yazın
5. **Proxy status:** **Proxied** (turuncu bulut) seçin
6. **TTL:** Auto
7. **"Save"** butonuna tıklayın

---

## 📝 ADIM 6: Cloudflare Pages'den Domain'i Bağlayın

### 6.1. Cloudflare Pages'e Gidin
1. Sol menüden **"Workers & Pages"** → **"Pages"** seçin
2. **"qr-menu-restoran"** projesine tıklayın

### 6.2. Custom Domains Sekmesine Gidin
1. **"Custom domains"** sekmesine tıklayın
2. **"Set up a custom domain"** butonuna tıklayın

### 6.3. Domain'i Ekleyin
1. Domain adını yazın: `mezecim.net`
2. **"Continue"** butonuna tıklayın
3. Cloudflare otomatik olarak DNS kayıtlarını kontrol edecek
4. Eğer DNS kayıtları doğruysa, domain bağlanacak!

---

## ✅ KONTROL LİSTESİ

- [ ] Cloudflare'den name server'ları aldım
- [ ] Turhost'a giriş yaptım
- [ ] Domain yönetim paneline gittim
- [ ] Name server ayarlarını buldum
- [ ] Name server'ları değiştirdim
- [ ] Değişikliği kaydettim
- [ ] 1-2 saat bekledim
- [ ] Cloudflare'de name server durumunu kontrol ettim
- [ ] DNS kaydı ekledim (CNAME)
- [ ] Cloudflare Pages'den domain'i bağladım

---

## 🆘 SORUN GİDERME

### Name Server Ayarlarını Bulamıyorum
- Turhost müşteri hizmetlerini arayın: **0850 885 02 69**
- Veya e-posta gönderin: **info@turhost.com**
- "Domain name server değiştirme" konusunda yardım isteyin

### Name Server Değişikliği Çalışmıyor
- 24-48 saat bekleyin (normal süre)
- Turhost'tan name server'ların doğru kaydedildiğini kontrol edin
- Cloudflare'de name server'ları tekrar kontrol edin

### DNS Kaydı Ekleyemiyorum
- Name server'ların aktif olmasını bekleyin
- Cloudflare'de "DNS" sekmesinden ekleyin
- CNAME kaydının doğru yazıldığından emin olun

---

## 🎉 HAZIR!

Tüm adımlar tamamlandığında:
- `mezecim.net` → QR menü sitenize yönlendirecek
- `www.mezecim.net` → QR menü sitenize yönlendirecek
- SSL sertifikası otomatik olacak (https://)

