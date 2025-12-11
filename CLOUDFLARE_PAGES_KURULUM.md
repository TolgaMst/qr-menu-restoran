# Cloudflare Pages - Adım Adım Kurulum Rehberi

## 🎯 Cloudflare Pages'e Deploy Etme

### ADIM 1: GitHub'a Projeyi Yükleyin

#### 1.1. GitHub Hesabı Oluşturun
- https://github.com adresine gidin
- "Sign up" butonuna tıklayın
- Ücretsiz hesap oluşturun

#### 1.2. Yeni Repository Oluşturun
- GitHub'da sağ üstte "+" → "New repository"
- Repository adı: `qr-menu-restoran` (veya istediğiniz isim)
- Public veya Private seçin
- "Create repository" butonuna tıklayın

#### 1.3. Projeyi GitHub'a Yükleyin

PowerShell'de proje klasörünüzde (`C:\Users\tlgms\Desktop\web`) şu komutları çalıştırın:

```powershell
# Git'i başlat (eğer daha önce yapmadıysanız)
git init

# Git kullanıcı bilgilerinizi ayarlayın (ilk kez kullanıyorsanız)
git config --global user.name "Adınız"
git config --global user.email "email@example.com"

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "QR Menu System - Initial commit"

# GitHub repository URL'inizi ekleyin (KULLANICI_ADI ve REPO_ADI değiştirin)
git remote add origin https://github.com/KULLANICI_ADI/qr-menu-restoran.git

# Ana branch'i main olarak ayarlayın
git branch -M main

# GitHub'a yükleyin
git push -u origin main
```

**Örnek:**
```powershell
git remote add origin https://github.com/tlgms/qr-menu-restoran.git
git push -u origin main
```

**Not:** GitHub kullanıcı adı ve şifre isteyebilir. Şifre yerine Personal Access Token kullanmanız gerekebilir.

---

### ADIM 2: Cloudflare Pages'e Bağlayın

#### 2.1. Cloudflare Hesabı Oluşturun
- https://pages.cloudflare.com adresine gidin
- "Sign up" butonuna tıklayın
- Email veya GitHub ile kayıt olun (GitHub önerilir)

#### 2.2. Yeni Proje Oluşturun
- Cloudflare Pages dashboard'a gidin
- "Create a project" butonuna tıklayın
- "Connect to Git" seçeneğini seçin
- GitHub hesabınızı bağlayın (izin verin)
- Repository'nizi seçin (`qr-menu-restoran`)

#### 2.3. Build Ayarlarını Yapın

Cloudflare Pages otomatik olarak Next.js'i algılayacak, ama manuel ayar yapmak isterseniz:

**Build Settings:**
- **Framework preset:** Next.js (Static HTML Export)
- **Build command:** `npm run build`
- **Build output directory:** `.next`
- **Root directory:** `/` (boş bırakın)

**ÖNEMLİ:** Next.js için `next.config.js` dosyasını güncellememiz gerekiyor!

---

### ADIM 3: Next.js Config Güncelleme

Cloudflare Pages için Next.js'i static export yapmamız gerekiyor.

`next.config.js` dosyasını güncelleyin:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Cloudflare Pages için static export
  images: {
    unoptimized: true, // Cloudflare Pages için
  },
}

module.exports = nextConfig
```

Bu değişikliği yapalım mı?

---

### ADIM 4: Deploy

1. Cloudflare Pages'de "Save and Deploy" butonuna tıklayın
2. 2-3 dakika içinde build tamamlanacak
3. Siteniz hazır! 🎉

**URL:** `proje-adi.pages.dev` gibi bir adres alırsınız

---

### ADIM 5: Domain Bağlama (İsteğe Bağlı)

#### 5.1. Cloudflare'de Domain Ekleme
- Cloudflare Pages dashboard → Projeniz → "Custom domains"
- "Set up a custom domain" butonuna tıklayın
- Domain adınızı yazın (örnek: mezecim.net)
- "Continue" butonuna tıklayın

#### 5.2. DNS Ayarları
Cloudflare size DNS kayıtlarını verecek. Domain sağlayıcınızın (Turhost) panelinden:

1. Domain yönetim paneline girin
2. "DNS Ayarları" bölümüne gidin
3. Cloudflare'in verdiği CNAME kaydını ekleyin:

**Örnek DNS Kaydı:**
```
Type: CNAME
Name: @ (veya boş)
Value: proje-adi.pages.dev
```

VEYA

```
Type: CNAME
Name: www
Value: proje-adi.pages.dev
```

#### 5.3. SSL Sertifikası
- Cloudflare otomatik SSL sertifikası verir
- 24 saat içinde aktif olur
- https:// mezecim.net otomatik çalışır

---

## ✅ KONTROL LİSTESİ

- [ ] GitHub hesabı oluşturuldu
- [ ] Repository oluşturuldu
- [ ] Proje GitHub'a yüklendi
- [ ] Cloudflare Pages hesabı oluşturuldu
- [ ] GitHub repository bağlandı
- [ ] Build ayarları yapıldı
- [ ] Deploy edildi
- [ ] Domain bağlandı (isteğe bağlı)

---

## 🆘 SORUN GİDERME

### Build Hatası
- `npm run build` komutunu local'de çalıştırıp hataları kontrol edin
- `next.config.js` dosyasını kontrol edin

### Domain Çalışmıyor
- DNS ayarlarının 24-48 saat içinde aktif olması normal
- Cloudflare'de domain durumunu kontrol edin

### Static Export Hatası
- `next.config.js` dosyasında `output: 'export'` olduğundan emin olun
- `images.unoptimized: true` olduğundan emin olun

---

## 🎉 HAZIR!

Siteniz artık canlıda! 🚀

