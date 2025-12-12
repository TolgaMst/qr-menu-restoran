# 🚀 GitHub Otomatik Push Özelliği

## 🎯 Özellik
Admin panelinde yaptığınız her değişiklikte, `public/data.json` dosyası otomatik olarak GitHub'a push edilir. Manuel push yapmanıza gerek kalmaz!

## ✅ Kurulum

### ADIM 1: GitHub Personal Access Token Oluşturun

#### Settings Bulma (Eğer bulamıyorsanız):

**Yöntem 1: Profil Menüsünden**
1. **GitHub'a gidin:** https://github.com
2. **Sağ üst köşede profil resminize (avatar) tıklayın**
3. Açılan menüden **"Settings"** seçeneğine tıklayın

**Yöntem 2: Direkt URL**
- Tarayıcıya şunu yazın: `https://github.com/settings/profile`
- Enter'a basın

#### Token Oluşturma:

1. **Settings sayfasında:** Sol menüden en alta kaydırın
2. **"Developer settings"** yazısına tıklayın
   - VEYA direkt: `https://github.com/settings/developers`
3. **"Personal access tokens"** → **"Tokens (classic)"** seçeneğine tıklayın
   - VEYA direkt: `https://github.com/settings/tokens`
4. **"Generate new token"** → **"Generate new token (classic)"** tıklayın
   - VEYA direkt: `https://github.com/settings/tokens/new`

### ADIM 2: Token Ayarları

- **Note** (Not): `QR Menu Auto Push` yazın
- **Expiration** (Süre): `90 days` veya `No expiration` seçin
- **Scopes** (İzinler): **"repo"** kutusunu işaretleyin
  - Bu, repository'lerinize yazma izni verir
- Sayfanın en altında **"Generate token"** butonuna tıklayın

### ADIM 3: Token'ı Kopyalayın

- Oluşturulan token'ı **KOPYALAYIN** (bir daha gösterilmeyecek!)
- Token şu şekilde görünür: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 🔧 Admin Panelinde Ayarlama

### ADIM 1: Admin Paneline Gidin

1. `mezecim.net/admin` adresine gidin
2. Şifre ile giriş yapın
3. **"Restoran Bilgileri"** sekmesine gidin

### ADIM 2: GitHub Ayarlarını Doldurun

1. **"GitHub Otomatik Push"** bölümünü bulun (yeşil kutu)
2. **GitHub Kullanıcı Adı:** GitHub kullanıcı adınızı girin (örn: `TolgaMst`)
3. **Repository Adı:** Repository adınızı girin (örn: `qr-menu-restoran`)
4. **Personal Access Token:** Oluşturduğunuz token'ı yapıştırın
5. **"Otomatik Push'u Etkinleştir"** kutusunu işaretleyin

### ADIM 3: Test Edin

1. Herhangi bir değişiklik yapın (örneğin restoran adını değiştirin)
2. 2 saniye bekleyin
3. Tarayıcı console'unu açın (F12 → Console)
4. **"✅ GitHub'a otomatik push başarılı!"** mesajını görmelisiniz

---

## 🎉 Artık Otomatik!

Her değişiklikte:
1. ✅ Veriler otomatik olarak `public/data.json` dosyasına kaydedilir
2. ✅ GitHub'a otomatik push edilir
3. ✅ Cloudflare otomatik olarak yeni deployment başlatır
4. ✅ 2-3 dakika sonra tüm cihazlarda yeni veriler görünür!

**Manuel push yapmanıza gerek yok!** 🚀

---

## 🔒 Güvenlik

- Token sadece LocalStorage'da saklanır (sadece sizin bilgisayarınızda)
- Token'ı kimseyle paylaşmayın
- Token'ı düzenli olarak yenileyin (90 günde bir)

---

## 🆘 Sorun Giderme

### "GitHub'a push başarısız" Hatası

1. **Token'ı kontrol edin:**
   - Token'ın "repo" izni var mı?
   - Token'ın süresi dolmuş mu?

2. **Kullanıcı adı ve repository adını kontrol edin:**
   - Doğru mu yazdınız?
   - Repository mevcut mu?

3. **Console'u kontrol edin:**
   - F12 → Console
   - Hata mesajını okuyun

### Token'ı Sıfırlama

1. Admin panelinde token alanını temizleyin
2. Yeni bir token oluşturun
3. Yeni token'ı yapıştırın

---

## 📝 Notlar

- **Otomatik push kapalıysa:** Dosya yine de indirilir (eski yöntem)
- **Push başarısız olursa:** Dosya indirilir, manuel push yapabilirsiniz
- **Her değişiklikte push:** 2 saniye debounce ile (çok sık push yapmaz)

---

## ✅ Özet

1. GitHub Personal Access Token oluşturun
2. Admin panelinde GitHub ayarlarını doldurun
3. "Otomatik Push'u Etkinleştir" kutusunu işaretleyin
4. Artık her değişiklikte otomatik push! 🎉

