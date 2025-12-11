# GitHub'a Yükleme - Adım Adım Detaylı Rehber

## 📝 ADIM 1: GitHub Hesabı Oluşturma

### 1.1. GitHub'a Gidin
- Tarayıcınızı açın
- Adres çubuğuna yazın: **https://github.com**
- Enter'a basın

### 1.2. Kayıt Olun
- Sağ üst köşede **"Sign up"** butonuna tıklayın
- Veya sayfanın ortasında **"Sign up for GitHub"** butonuna tıklayın

### 1.3. Bilgilerinizi Girin
- **Username** (Kullanıcı adı): Örnek: `tlgms` veya `mezecim`
- **Email address** (E-posta): E-posta adresinizi yazın
- **Password** (Şifre): Güçlü bir şifre yazın (8 karakterden fazla)
- **"Verify your account"** kısmında robot olmadığınızı doğrulayın
- **"Create account"** butonuna tıklayın

### 1.4. E-posta Doğrulama
- E-posta kutunuzu kontrol edin
- GitHub'dan gelen e-postayı açın
- **"Verify email address"** butonuna tıklayın

### 1.5. Hesap Ayarları (İsteğe Bağlı)
- GitHub size bazı sorular sorabilir (hangi planı istediğiniz, vb.)
- **"Continue for free"** veya **"Skip"** butonuna tıklayın
- Hesabınız hazır! ✅

---

## 📦 ADIM 2: Yeni Repository (Depo) Oluşturma

### 2.1. GitHub Ana Sayfasına Gidin
- Sol üst köşede GitHub logosuna tıklayın
- Veya **https://github.com** adresine gidin

### 2.2. Yeni Repository Oluşturun
- Sağ üst köşede **"+"** işaretine tıklayın
- Açılan menüden **"New repository"** seçeneğine tıklayın

### 2.3. Repository Bilgilerini Doldurun
- **Repository name** (Depo adı): `qr-menu-restoran` yazın
  - Veya istediğiniz bir isim: `mezecim-menu`, `restoran-menu`, vb.
- **Description** (Açıklama): İsteğe bağlı, boş bırakabilirsiniz
  - Örnek: "QR Kod Menü Sistemi"

### 2.4. Public/Private Seçin
- **Public** seçeneğini işaretleyin (herkes görebilir, ücretsiz)
- Veya **Private** seçin (sadece siz görebilirsiniz)

### 2.5. Diğer Ayarlar
- **"Add a README file"** kutusunu BOŞ BIRAKIN (işaretlemeyin)
- **"Add .gitignore"** kutusunu BOŞ BIRAKIN
- **"Choose a license"** kutusunu BOŞ BIRAKIN

### 2.6. Repository Oluşturun
- Sayfanın en altında **"Create repository"** (yeşil buton) tıklayın
- Repository oluşturuldu! ✅

---

## 💻 ADIM 3: PowerShell'de Komutları Çalıştırma

### 3.1. PowerShell'i Açın
- **Windows tuşu + R** tuşlarına basın
- Açılan kutuya `powershell` yazın
- Enter'a basın
- Veya Başlat menüsünde "PowerShell" arayın

### 3.2. Proje Klasörüne Gidin
PowerShell'de şu komutu yazın ve Enter'a basın:

```powershell
cd C:\Users\tlgms\Desktop\web
```

**Kontrol:** PowerShell'de şu yazıyı görmelisiniz:
```
PS C:\Users\tlgms\Desktop\web>
```

### 3.3. Git Kullanıcı Bilgilerinizi Ayarlayın (İlk Kez Kullanıyorsanız)

PowerShell'de şu komutları tek tek yazın (Enter'a basın):

```powershell
git config --global user.name "Adınız Soyadınız"
```

**Örnek:**
```powershell
git config --global user.name "Tolga"
```

Sonra:

```powershell
git config --global user.email "email@example.com"
```

**Örnek:**
```powershell
git config --global user.email "tolga@gmail.com"
```

**Not:** GitHub'da kullandığınız e-posta adresini yazın.

### 3.4. Git'i Başlatın

```powershell
git init
```

**Çıktı:** `Initialized empty Git repository in C:\Users\tlgms\Desktop\web\.git\`

### 3.5. Tüm Dosyaları Ekleyin

```powershell
git add .
```

**Çıktı:** Hiçbir şey göstermez, normal.

### 3.6. İlk Commit Yapın

```powershell
git commit -m "QR Menu System - Initial commit"
```

**Çıktı:** Dosyaların listesi görünecek.

### 3.7. GitHub Repository URL'ini Ekleyin

**ÖNEMLİ:** `KULLANICI_ADI` yerine GitHub kullanıcı adınızı yazın!

```powershell
git remote add origin https://github.com/KULLANICI_ADI/qr-menu-restoran.git
```

**Örnek (kullanıcı adınız "tlgms" ise):**
```powershell
git remote add origin https://github.com/tlgms/qr-menu-restoran.git
```

**Örnek (kullanıcı adınız "mezecim" ise):**
```powershell
git remote add origin https://github.com/mezecim/qr-menu-restoran.git
```

### 3.8. Ana Branch'i Main Olarak Ayarlayın

```powershell
git branch -M main
```

### 3.9. GitHub'a Yükleyin

```powershell
git push -u origin main
```

**Bu adımda:**
- GitHub kullanıcı adı ve şifre isteyebilir
- Şifre yerine **Personal Access Token** kullanmanız gerekebilir

---

## 🔑 ADIM 4: Personal Access Token Oluşturma (Gerekirse)

Eğer şifre çalışmazsa:

### 4.1. GitHub'da Token Oluşturun
- GitHub'a gidin
- Sağ üst köşede profil resminize tıklayın
- **"Settings"** seçeneğine tıklayın
- Sol menüden **"Developer settings"** seçeneğine tıklayın
- **"Personal access tokens"** → **"Tokens (classic)"** seçeneğine tıklayın
- **"Generate new token"** → **"Generate new token (classic)"** tıklayın

### 4.2. Token Ayarları
- **Note** (Not): `Cloudflare Pages` yazın
- **Expiration** (Süre): `90 days` veya `No expiration` seçin
- **Scopes** (İzinler): **"repo"** kutusunu işaretleyin
- Sayfanın en altında **"Generate token"** butonuna tıklayın

### 4.3. Token'ı Kopyalayın
- Oluşturulan token'ı KOPYALAYIN (bir daha gösterilmeyecek!)
- PowerShell'de şifre istediğinde bu token'ı yapıştırın

---

## ✅ ADIM 5: Kontrol

### 5.1. GitHub'da Kontrol Edin
- GitHub'a gidin
- Repository'nize gidin: `https://github.com/KULLANICI_ADI/qr-menu-restoran`
- Tüm dosyaların yüklendiğini görün ✅

### 5.2. Dosyaları Kontrol Edin
- `package.json`
- `app` klasörü
- `components` klasörü
- Tüm dosyalar görünmeli

---

## 🆘 SORUN GİDERME

### "git: command not found" Hatası
- Git yüklü değil
- https://git-scm.com/download/win adresinden Git'i indirin ve kurun

### "remote origin already exists" Hatası
- Şu komutu çalıştırın:
```powershell
git remote remove origin
```
- Sonra tekrar `git remote add origin ...` komutunu çalıştırın

### "Authentication failed" Hatası
- Personal Access Token kullanın (yukarıdaki ADIM 4)

### "Repository not found" Hatası
- Repository adını kontrol edin
- GitHub kullanıcı adınızı kontrol edin
- Repository'nin Public olduğundan emin olun

---

## 🎉 HAZIR!

GitHub'a yükleme tamamlandı! Artık Cloudflare Pages'e geçebilirsiniz.

