# GitHub'a Yükleme Adımları

## 1. GitHub Hesabı Oluşturun
- https://github.com adresine gidin
- "Sign up" butonuna tıklayın
- Hesap oluşturun

## 2. Yeni Repository Oluşturun
- GitHub'da "New repository" butonuna tıklayın
- Repository adı: `qr-menu-restoran` (veya istediğiniz isim)
- Public veya Private seçin
- "Create repository" butonuna tıklayın

## 3. Projeyi GitHub'a Yükleyin

PowerShell'de proje klasörünüzde şu komutları çalıştırın:

```powershell
# Git'i başlat (eğer daha önce yapmadıysanız)
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit - QR Menu System"

# GitHub repository'nizi ekleyin (KULLANICI_ADI ve REPO_ADI değiştirin)
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git

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

## 4. GitHub'da Kontrol Edin
- GitHub'da repository'nize gidin
- Tüm dosyaların yüklendiğini kontrol edin

## Notlar:
- İlk kez git kullanıyorsanız, önce şunları yapın:
  ```powershell
  git config --global user.name "Adınız"
  git config --global user.email "email@example.com"
  ```

