# 🔑 Cloudflare Pages'de GitHub Token Kurulumu

## 🎯 Amaç
GitHub token'ını Cloudflare Pages'de environment variable olarak ayarlayarak, tüm cihazlardan otomatik olarak kullanılmasını sağlamak.

## ✅ Adım Adım Kurulum

### ADIM 1: GitHub Personal Access Token Oluşturun

1. **GitHub'a gidin:** https://github.com/settings/tokens/new
2. **Token ayarları:**
   - **Note:** `QR Menu Auto Push` yazın
   - **Expiration:** `90 days` veya `No expiration` seçin
   - **Scopes:** **"repo"** kutusunu işaretleyin
3. **"Generate token"** butonuna tıklayın
4. **Token'ı kopyalayın** (bir daha gösterilmeyecek!)
   - Token şu şekilde görünür: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### ADIM 2: Cloudflare Pages'e Gidin

1. **Cloudflare Dashboard'a gidin:** https://dash.cloudflare.com
2. **"Workers & Pages"** menüsüne tıklayın
3. **"Pages"** sekmesine gidin
4. **Projenizi bulun** (örn: `qr-menu-restoran`)
5. **Projeye tıklayın**

---

### ADIM 3: Environment Variables Ekleyin

1. Proje sayfasında **"Settings"** sekmesine gidin
2. Sol menüden **"Environment variables"** seçeneğine tıklayın
3. **"Add variable"** butonuna tıklayın
4. **Variable bilgilerini girin:**
   - **Variable name:** `NEXT_PUBLIC_GITHUB_TOKEN`
   - **Value:** GitHub'dan kopyaladığınız token'ı yapıştırın (örn: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
5. **"Save"** butonuna tıklayın

---

### ADIM 4: Yeni Build Başlatın

1. **"Deployments"** sekmesine gidin
2. **"Retry deployment"** veya **"Redeploy"** butonuna tıklayın
   - VEYA yeni bir commit push edin
3. Build tamamlandığında token aktif olacak

---

## ✅ Kontrol

1. Admin paneline gidin: `mezecim.net/admin`
2. **"Restoran Bilgileri"** sekmesine gidin
3. Token varsa, sarı uyarı kutusu görünmeyecek
4. **"Kaydet ve GitHub'a Push Et"** butonuna tıklayın
5. Başarılı olursa token doğru çalışıyor demektir!

---

## 🔒 Güvenlik Notları

- ✅ Token sadece Cloudflare Pages'de saklanır
- ✅ Token herkese görünmez (environment variable)
- ✅ Token sadece GitHub API çağrılarında kullanılır
- ⚠️ Token'ı kimseyle paylaşmayın
- ⚠️ Token'ı ekran görüntüsü almayın

---

## 🆘 Sorun Giderme

### Token çalışmıyor?

1. **Token'ın doğru olduğundan emin olun:**
   - Token `ghp_` ile başlamalı
   - Token'ın süresi dolmamış olmalı
   - Token'ın "repo" izni olmalı

2. **Environment variable'ı kontrol edin:**
   - Cloudflare Pages → Settings → Environment Variables
   - `NEXT_PUBLIC_GITHUB_TOKEN` var mı?
   - Value doğru mu?

3. **Yeni build başlatın:**
   - Environment variable ekledikten sonra mutlaka yeni build başlatın
   - Eski build'lerde environment variable yoktur

4. **Console'u kontrol edin:**
   - F12 tuşuna basın
   - Console'da hata mesajları var mı?

---

## 📝 Özet

1. GitHub'dan token oluştur → `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
2. Cloudflare Pages → Settings → Environment Variables
3. `NEXT_PUBLIC_GITHUB_TOKEN` ekle
4. Token'ı yapıştır
5. Yeni build başlat
6. ✅ Hazır!

