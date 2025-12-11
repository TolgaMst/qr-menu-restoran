# Domain ve Hosting Rehberi - Basit Açıklama

## 🎯 Ne Gerekiyor?

1. **Domain** (www.mezecim.net gibi bir adres)
2. **Hosting** (Web sitenizin çalışacağı yer)

---

## 📝 ADIM 1: Domain Satın Alın

### Türkiye'de Domain Satın Alma:

1. **Turhost** (https://www.turhost.com)
   - Türkçe destek
   - .com domain: ~100-150 TL/yıl
   - .net domain: ~100-150 TL/yıl
   - .com.tr domain: ~50-100 TL/yıl

2. **Natro** (https://www.natro.com)
   - Türkçe destek
   - Benzer fiyatlar

3. **Getmetheme** (https://www.getmetheme.com)
   - Türkçe destek

### Yurtdışı (Daha Ucuz):

1. **Namecheap** (https://www.namecheap.com)
   - .com domain: ~$10-15/yıl
   - İngilizce

2. **GoDaddy** (https://www.godaddy.com)
   - .com domain: ~$12-20/yıl

### Domain Satın Alma Adımları:

1. Yukarıdaki sitelerden birine gidin
2. "Domain Ara" veya "Domain Sorgula" bölümüne gidin
3. İstediğiniz domain'i yazın (örnek: mezecim.net)
4. Müsaitse sepete ekleyin
5. Ödeme yapın
6. Domain sizin olur! ✅

---

## 🚀 ADIM 2: Hosting (Vercel - ÜCRETSİZ ve KOLAY)

### Vercel Nedir?
- Web sitenizi internette yayınlayan bir platform
- **TAMAMEN ÜCRETSİZ**
- Next.js için mükemmel
- Çok kolay kullanım

### Vercel'e Nasıl Yüklenir?

#### 1. GitHub Hesabı Oluşturun
- https://github.com
- Ücretsiz hesap oluşturun

#### 2. Projenizi GitHub'a Yükleyin

PowerShell'de proje klasörünüzde:

```powershell
# Git'i başlat
git init

# Dosyaları ekle
git add .

# Commit yap
git commit -m "QR Menu System"

# GitHub'da yeni repository oluşturun, sonra:
git remote add origin https://github.com/KULLANICI_ADI/qr-menu.git
git branch -M main
git push -u origin main
```

#### 3. Vercel'e Bağlayın
- https://vercel.com adresine gidin
- "Sign Up" → GitHub ile giriş yapın
- "Add New Project" → GitHub repository'nizi seçin
- "Deploy" butonuna tıklayın
- 2-3 dakika içinde siteniz hazır! 🎉

**Sonuç:** `proje-adi.vercel.app` gibi bir adres alırsınız (ÜCRETSİZ)

---

## 🔗 ADIM 3: Domain'i Vercel'e Bağlayın

### Vercel'de Domain Ayarları:

1. Vercel Dashboard'a gidin
2. Projenize tıklayın
3. "Settings" → "Domains" sekmesine gidin
4. Domain adınızı yazın (örnek: mezecim.net)
5. "Add" butonuna tıklayın

### Domain Sağlayıcınızda DNS Ayarları:

Vercel size DNS kayıtlarını verecek. Domain sağlayıcınızın (Turhost, Natro, vb.) panelinden şunları yapın:

1. Domain yönetim paneline girin
2. "DNS Ayarları" veya "Name Servers" bölümüne gidin
3. Vercel'in verdiği DNS kayıtlarını ekleyin:

**Örnek DNS Kayıtları (Vercel size verecek):**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**VEYA daha kolay:**
- "Name Servers" bölümüne gidin
- Vercel'in verdiği name server'ları yazın (örnek: ns1.vercel-dns.com)

### DNS Ayarları Ne Zaman Aktif Olur?
- 24-48 saat içinde aktif olur
- Genellikle 1-2 saat içinde çalışmaya başlar

---

## 💰 TOPLAM MALİYET

### Seçenek 1: Sadece Domain (Hosting Ücretsiz)
- Domain: ~100-150 TL/yıl
- Hosting: **ÜCRETSİZ** (Vercel)
- **TOPLAM: ~100-150 TL/yıl** ✅

### Seçenek 2: Domain + Türk Hosting
- Domain: ~100-150 TL/yıl
- Hosting: ~200-500 TL/yıl
- **TOPLAM: ~300-650 TL/yıl**

**ÖNERİLEN: Seçenek 1** (Vercel ücretsiz ve çok iyi!)

---

## 📋 ADIM ADIM ÖZET

1. ✅ **Domain Satın Alın**
   - Turhost veya Natro'dan mezecim.net satın alın
   - ~100-150 TL/yıl

2. ✅ **GitHub'a Yükleyin**
   - GitHub hesabı oluşturun
   - Projenizi yükleyin

3. ✅ **Vercel'e Deploy Edin**
   - Vercel.com'a gidin
   - GitHub ile bağlayın
   - Deploy edin (ÜCRETSİZ)

4. ✅ **Domain'i Bağlayın**
   - Vercel'de domain ekleyin
   - DNS ayarlarını yapın
   - 1-2 saat içinde aktif olur!

---

## 🆘 SORUN GİDERME

### Domain Çalışmıyor?
- DNS ayarlarının 24-48 saat içinde aktif olması normal
- Domain sağlayıcınızın panelinden DNS kayıtlarını kontrol edin
- Vercel'de domain durumunu kontrol edin

### SSL Sertifikası?
- Vercel **otomatik** SSL sertifikası verir (ücretsiz)
- https:// mezecim.net otomatik çalışır

### Yardım Gerekiyor?
- Vercel'in Türkçe desteği yok ama çok kolay
- Domain sağlayıcınızın (Turhost, Natro) Türkçe desteği var

---

## 🎯 EN KOLAY YOL

1. **Turhost'tan domain satın alın** (mezecim.net)
2. **Vercel'e projeyi yükleyin** (ücretsiz)
3. **Domain'i Vercel'e bağlayın**
4. **Hazır!** 🎉

**Toplam Süre:** 30-60 dakika
**Toplam Maliyet:** ~100-150 TL/yıl (sadece domain)

