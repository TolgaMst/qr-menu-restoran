# Git Kurulum Rehberi - Windows

## 🎯 Git Nedir?
Git, projelerinizi GitHub'a yüklemek için gereken bir programdır.

## 📥 ADIM 1: Git'i İndirin

### 1.1. Git İndirme Sayfasına Gidin
- Tarayıcınızı açın
- Adres çubuğuna yazın: **https://git-scm.com/download/win**
- Enter'a basın
- Veya direkt: https://git-scm.com/download/win

### 1.2. İndirmeyi Başlatın
- Sayfa otomatik olarak indirmeyi başlatacak
- Veya **"Click here to download"** butonuna tıklayın
- İndirme başlayacak (yaklaşık 50-60 MB)

## 🔧 ADIM 2: Git'i Kurun

### 2.1. İndirilen Dosyayı Açın
- İndirilen dosya: `Git-2.xx.x-64-bit.exe` (veya benzer bir isim)
- Genellikle **İndirilenler** klasöründe olur
- Dosyaya çift tıklayın

### 2.2. Kurulum Sihirbazı
- **"Next"** butonuna tıklayın (birkaç kez)
- Varsayılan ayarları kabul edin
- **"Install"** butonuna tıklayın
- Kurulum 1-2 dakika sürecek

### 2.3. Kurulum Tamamlandı
- **"Finish"** butonuna tıklayın
- Git kuruldu! ✅

## ✅ ADIM 3: Git'in Kurulduğunu Kontrol Edin

### 3.1. PowerShell'i Yeniden Açın
- Mevcut PowerShell penceresini kapatın
- Yeni bir PowerShell penceresi açın
- (Git kurulduktan sonra PATH güncellenir, bu yüzden yeniden açmak gerekir)

### 3.2. Git Versiyonunu Kontrol Edin
PowerShell'de şu komutu yazın:

```powershell
git --version
```

**Beklenen Çıktı:**
```
git version 2.xx.x.windows.x
```

Eğer versiyon numarası görünüyorsa, Git başarıyla kuruldu! ✅

## 🎉 HAZIR!

Artık Git komutlarını kullanabilirsiniz!

---

## 🚀 ŞİMDİ NE YAPACAKSINIZ?

Git kurulduktan sonra, proje klasörünüzde şu komutları çalıştırın:

```powershell
# Proje klasörüne gidin
cd C:\Users\tlgms\Desktop\web

# Git kullanıcı bilgilerinizi ayarlayın
git config --global user.name "Tolga"
git config --global user.email "email@example.com"

# Git'i başlat
git init

# Dosyaları ekle
git add .

# Commit yap
git commit -m "QR Menu System"

# GitHub repository'yi ekle
git remote add origin https://github.com/TolgaMst/qr-menu-restoran.git

# Branch'i ayarla
git branch -M main

# GitHub'a yükle
git push -u origin main
```

---

## 🆘 SORUN GİDERME

### "git: command not found" Hatası Devam Ediyorsa
1. PowerShell'i tamamen kapatın
2. Yeni bir PowerShell penceresi açın
3. Tekrar deneyin

### Hala Çalışmıyorsa
1. Bilgisayarınızı yeniden başlatın
2. PowerShell'i yönetici olarak çalıştırın

