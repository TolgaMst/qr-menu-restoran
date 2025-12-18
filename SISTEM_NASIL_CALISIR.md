# 🔄 Sistem Nasıl Çalışır? - Detaylı Açıklama

## 📋 İçindekiler
1. [Sayfa Yüklendiğinde Ne Oluyor?](#1-sayfa-yüklendiğinde-ne-oluyor)
2. [Veri Yükleme Sırası](#2-veri-yükleme-sırası)
3. [Kullanıcı Değişiklik Yaptığında](#3-kullanıcı-değişiklik-yaptığında)
4. [Kaydet ve Push Et Butonuna Basıldığında](#4-kaydet-ve-push-et-butonuna-basıldığında)
5. [GitHub Push İşlemi Detayları](#5-github-push-işlemi-detayları)
6. [Token Yönetimi](#6-token-yönetimi)
7. [Farklı Bilgisayarlardan Erişim](#7-farklı-bilgisayarlardan-erişim)

---

## 1. Sayfa Yüklendiğinde Ne Oluyor?

### ADIM 1: Şifre Kontrolü
```
1. Sayfa açılır
2. useEffect çalışır
3. hasAdminPassword() kontrol edilir
   - İlk kez mi? → Şifre belirleme ekranı gösterilir
   - Şifre var mı? → Giriş ekranı gösterilir
   - Session'da "adminAuthenticated" var mı? → Admin paneline giriş yapılır
```

### ADIM 2: Veri Yükleme Başlar
```
1. İkinci useEffect çalışır
2. loadData() fonksiyonu çağrılır
3. Veri yükleme sırası başlar (aşağıda detaylı)
```

---

## 2. Veri Yükleme Sırası

### AŞAMA 1: public/data.json'dan Yükleme (Ana Kaynak)

```javascript
// 1. Fetch isteği yapılır
fetch("/data.json")
  ↓
// 2. Response kontrol edilir
if (response.ok) {
  ↓
// 3. JSON parse edilir
const data = await response.json();
  ↓
// 4. Her veri tipi ayrı ayrı yüklenir:
```

#### 4a. Restoran Bilgileri
```javascript
if (data.restaurantInfo) {
  setRestaurantInfo(data.restaurantInfo);
  // State güncellenir → Ekranda görünür
}
```

#### 4b. Menü Verileri
```javascript
if (data.menuData && Array.isArray(data.menuData) && data.menuData.length > 0) {
  setCategories(data.menuData);
  // Kategoriler ve ürünler ekranda görünür
}
```

#### 4c. Dil, Para Birimi, Tema
```javascript
if (data.language) setLanguage(data.language);
if (data.currency) setDefaultCurrency(data.currency);
if (data.theme) {
  setTheme(data.theme);
  applyTheme(data.theme); // Tema hemen uygulanır
}
```

### AŞAMA 2: LocalStorage'dan Override (Admin Paneli Değişiklikleri)

**Neden?** Admin panelinde yapılan değişiklikler henüz GitHub'a push edilmemiş olabilir. Bu değişiklikler LocalStorage'da saklanır.

```javascript
// 1. LocalStorage'dan restoran bilgileri kontrol edilir
const savedInfo = localStorage.getItem("restaurantInfo");
if (savedInfo) {
  const parsedInfo = JSON.parse(savedInfo);
  setRestaurantInfo(parsedInfo); // public/data.json'dan yüklenen veri üzerine yazılır
}

// 2. LocalStorage'dan menü verileri kontrol edilir
const savedMenu = localStorage.getItem("menuData");
if (savedMenu) {
  setCategories(JSON.parse(savedMenu)); // public/data.json'dan yüklenen veri üzerine yazılır
}

// 3. Dil ve tema da LocalStorage'dan yüklenir
```

**ÖNEMLİ:** LocalStorage'daki veriler, `public/data.json`'dan yüklenen verilerin **üzerine yazılır**. Bu sayede:
- Admin panelinde yaptığınız değişiklikler kaybolmaz
- "Kaydet ve Push Et" butonuna basana kadar değişiklikler sadece LocalStorage'da kalır
- Push edildikten sonra `public/data.json` güncellenir ve tüm cihazlarda görünür

---

## 3. Kullanıcı Değişiklik Yaptığında

### Örnek: Restoran Adını Değiştirme

```javascript
// 1. Kullanıcı input'a yazar
<input 
  value={restaurantInfo.name}
  onChange={(e) => {
    // 2. State güncellenir
    const updated = { ...restaurantInfo, name: e.target.value };
    setRestaurantInfo(updated);
    
    // 3. LocalStorage'a kaydedilir (anında)
    saveInfoToLocalStorage(updated);
    // localStorage.setItem("restaurantInfo", JSON.stringify(updated));
  }}
/>
```

**Ne Oluyor?**
1. ✅ State güncellenir → Ekranda anında görünür
2. ✅ LocalStorage'a kaydedilir → Sayfa yenilense bile kaybolmaz
3. ❌ GitHub'a push edilmez → "Kaydet ve Push Et" butonuna basana kadar

### Örnek: Ürün Ekleme

```javascript
// 1. "Ürün Ekle" butonuna basılır
addItem(categoryId) {
  // 2. Yeni ürün oluşturulur
  const newItem = {
    id: Date.now().toString(),
    name: "Yeni Ürün",
    price: 0,
    category: categoryId
  };
  
  // 3. Kategorilere eklenir
  const updated = categories.map(cat =>
    cat.id === categoryId
      ? { ...cat, items: [...cat.items, newItem] }
      : cat
  );
  
  // 4. State güncellenir
  setCategories(updated);
  
  // 5. LocalStorage'a kaydedilir
  saveToLocalStorage(updated);
}
```

**Ne Oluyor?**
1. ✅ Ürün ekranda görünür
2. ✅ LocalStorage'a kaydedilir
3. ❌ GitHub'a push edilmez

---

## 4. "Kaydet ve Push Et" Butonuna Basıldığında

### ADIM 1: Token Kontrolü

```javascript
const handleSaveAndPush = async () => {
  // 1. Token kontrol edilir
  const githubToken = getGithubToken();
  
  if (!githubToken) {
    // Token yoksa uyarı gösterilir
    alert("❌ GitHub token eksik! Cloudflare Pages'de ayarlayın.");
    return; // İşlem durur
  }
```

**getGithubToken() Fonksiyonu:**
```javascript
const getGithubToken = () => {
  // Environment variable'dan token'ı al
  const envToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  return envToken || "";
};
```

**Token Nereden Geliyor?**
- Cloudflare Pages'de environment variable olarak ayarlanmış olmalı
- Build time'da kod içine gömülür
- Runtime'da `process.env.NEXT_PUBLIC_GITHUB_TOKEN` ile erişilir

### ADIM 2: Veri Toplama

```javascript
// 2. Tüm veriler birleştirilir
const publicData = {
  menuData: categories,           // Menü kategorileri ve ürünler
  restaurantInfo: restaurantInfo,  // Restoran bilgileri
  theme: theme,                    // Tema ayarları
  currency: defaultCurrency,       // Para birimi
  language: language,              // Dil
  timestamp: new Date().toISOString() // Zaman damgası
};

// 3. JSON string'e çevrilir
const dataStr = JSON.stringify(publicData, null, 2);
```

**Örnek JSON Yapısı:**
```json
{
  "menuData": [
    {
      "id": "1",
      "name": "MEZELER",
      "image": "...",
      "items": [
        {
          "id": "1",
          "name": "Molehiya",
          "price": 200,
          "description": ""
        }
      ]
    }
  ],
  "restaurantInfo": {
    "name": "Restoranım",
    "phone": "+90 (555) 123 45 67",
    "address": "...",
    "logo": "...",
    "welcomeMessage": "..."
  },
  "theme": { ... },
  "currency": "TRY",
  "language": "tr",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### ADIM 3: GitHub'a Push

```javascript
// 4. pushToGitHub() fonksiyonu çağrılır
const pushed = await pushToGitHub(dataStr);

if (pushed) {
  console.log("✅ Başarılı!");
} else {
  console.error("❌ Başarısız!");
}
```

---

## 5. GitHub Push İşlemi Detayları

### ADIM 1: Mevcut Dosyayı Okuma (SHA Almak İçin)

```javascript
// 1. GitHub API'ye GET isteği yapılır
const getFileResponse = await fetch(
  `https://api.github.com/repos/TolgaMst/qr-menu-restoran/contents/public/data.json`,
  {
    headers: {
      Authorization: `Bearer ${githubToken}`, // Token ile kimlik doğrulama
      Accept: "application/vnd.github.v3+json"
    }
  }
);
```

**Neden SHA Gerekli?**
- GitHub, dosya güncellemelerinde **SHA** (dosya hash'i) ister
- SHA, dosyanın son halini temsil eder
- Aynı anda iki kişi güncelleme yaparsa, SHA eşleşmez ve hata verir (409 Conflict)

**Sonuçlar:**
```javascript
if (getFileResponse.ok) {
  // Dosya var → SHA alınır
  const fileData = await getFileResponse.json();
  sha = fileData.sha; // "894bca1922c02552b8beca406c6eb22162a0326f"
} else if (getFileResponse.status === 404) {
  // Dosya yok → Yeni dosya oluşturulacak (SHA gerekmez)
  sha = null;
} else {
  // Hata → Kullanıcıya bildirilir
  alert("❌ Dosya okuma hatası!");
  return false;
}
```

### ADIM 2: Dosyayı Base64'e Çevirme

```javascript
// JSON string'i base64'e çevirilir
const base64Content = btoa(unescape(encodeURIComponent(dataStr)));
```

**Neden Base64?**
- GitHub API, dosya içeriğini base64 formatında ister
- Base64, binary veriyi text formatına çevirir
- Örnek: `{"name":"Test"}` → `eyJuYW1lIjoiVGVzdCJ9`

### ADIM 3: GitHub API'ye PUT İsteği

```javascript
// Request body hazırlanır
const requestBody = {
  message: `Auto-update: data.json - ${new Date().toISOString()}`, // Commit mesajı
  content: base64Content,  // Base64'e çevrilmiş içerik
  branch: "main",          // Branch adı
  sha: sha                  // Dosya varsa SHA (yoksa null)
};

// PUT isteği yapılır
const updateResponse = await fetch(
  `https://api.github.com/repos/TolgaMst/qr-menu-restoran/contents/public/data.json`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  }
);
```

### ADIM 4: Sonuç Kontrolü

#### ✅ Başarılı (200 OK)
```javascript
if (updateResponse.ok) {
  const result = await updateResponse.json();
  console.log("✅ GitHub'a push başarılı!");
  alert("✅ GitHub'a başarıyla push edildi! 2-3 dakika içinde tüm cihazlarda görünecek.");
  return true;
}
```

**Ne Oluyor?**
1. ✅ GitHub'da `public/data.json` güncellenir
2. ✅ Yeni commit oluşturulur
3. ✅ Cloudflare Pages otomatik build başlatır
4. ✅ 2-3 dakika sonra tüm cihazlarda yeni veriler görünür

#### ⚠️ 409 Conflict (Dosya Başka Biri Tarafından Değiştirilmiş)

```javascript
else if (updateResponse.status === 409) {
  // 1. Dosyayı tekrar oku (güncel SHA'yı al)
  const retryGetResponse = await fetch(...);
  const retryFileData = await retryGetResponse.json();
  const retrySha = retryFileData.sha;
  
  // 2. Güncel SHA ile tekrar dene
  const retryUpdateResponse = await fetch(..., {
    body: JSON.stringify({
      ...requestBody,
      sha: retrySha  // Güncel SHA
    })
  });
  
  if (retryUpdateResponse.ok) {
    // ✅ Başarılı (retry ile)
    return true;
  }
}
```

**Neden 409 Olur?**
- İki kişi aynı anda "Kaydet ve Push Et" butonuna basarsa
- İlk push başarılı olur
- İkinci push, eski SHA ile yapıldığı için 409 hatası verir
- Retry mekanizması, güncel SHA'yı alıp tekrar dener

#### ❌ Diğer Hatalar
```javascript
else {
  // Token geçersiz, repository yok, izin yok, vb.
  const error = await updateResponse.json();
  alert(`❌ GitHub push hatası!\n\nHata: ${error.message}`);
  return false;
}
```

---

## 6. Token Yönetimi

### Token Nerede Saklanır?

**Cloudflare Pages Environment Variable:**
```
Cloudflare Dashboard
  → Workers & Pages
    → Pages
      → Projeniz (qr-menu-restoran)
        → Settings
          → Environment Variables
            → NEXT_PUBLIC_GITHUB_TOKEN = ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Token Nasıl Kullanılır?

**Build Time (Cloudflare Pages Build):**
```
1. Cloudflare Pages build başlar
2. Environment variable'lar kod içine gömülür
3. process.env.NEXT_PUBLIC_GITHUB_TOKEN değeri kod içine yazılır
4. Build tamamlanır
5. Kod production'a deploy edilir
```

**Runtime (Tarayıcıda):**
```javascript
// Token kod içinde zaten var (build time'da gömülmüş)
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
// Token artık JavaScript kodunda sabit bir değer olarak var
```

**ÖNEMLİ:**
- ✅ Token herkese görünmez (sadece GitHub API çağrılarında kullanılır)
- ✅ Token her cihazda otomatik çalışır (environment variable sayesinde)
- ✅ Token'ı her bilgisayarda ayrı girmeye gerek yok

---

## 7. Farklı Bilgisayarlardan Erişim

### Senaryo: Bilgisayar A'dan Değişiklik Yapma

```
1. Bilgisayar A → mezecim.net/admin
2. Restoran adını değiştir → "Yeni Restoran"
3. LocalStorage'a kaydedilir (sadece Bilgisayar A'da)
4. "Kaydet ve Push Et" butonuna bas
5. GitHub'a push edilir
6. Cloudflare Pages yeni build başlatır
7. 2-3 dakika sonra public/data.json güncellenir
```

### Senaryo: Bilgisayar B'den Erişim

```
1. Bilgisayar B → mezecim.net/admin
2. Sayfa yüklenir
3. public/data.json'dan veriler yüklenir
   → "Yeni Restoran" görünür (Bilgisayar A'dan push edilen)
4. LocalStorage boş (yeni bilgisayar)
5. Token otomatik çalışır (Cloudflare Pages environment variable'dan)
```

**ÖNEMLİ:**
- ✅ Her bilgisayarda aynı veriler görünür (public/data.json'dan)
- ✅ Token her bilgisayarda otomatik çalışır
- ✅ Ayrı token girişi gerekmez

---

## 📊 Veri Akış Şeması

```
┌─────────────────────────────────────────────────────────────┐
│                    SAYFA YÜKLENDİĞİNDE                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        │                                       │
   public/data.json                      LocalStorage
   (Ana Kaynak)                        (Admin Değişiklikleri)
        │                                       │
        └───────────────────┬───────────────────┘
                            ↓
                    State Güncellenir
                    (Ekranda Görünür)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              KULLANICI DEĞİŞİKLİK YAPTIĞINDA                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    State Güncellenir
                    LocalStorage'a Kaydedilir
                    (GitHub'a Push Edilmez)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          "KAYDET VE PUSH ET" BUTONUNA BASILDIĞINDA            │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    Token Kontrol Edilir
                    (Cloudflare Pages Env Var)
                            ↓
                    Tüm Veriler Toplanır
                    (menuData, restaurantInfo, theme, vb.)
                            ↓
                    JSON String'e Çevrilir
                            ↓
                    Base64'e Çevrilir
                            ↓
                    GitHub API'ye PUT İsteği
                    (SHA ile birlikte)
                            ↓
                    ┌────────┴────────┐
                    │                │
              ✅ Başarılı      ❌ Hata
                    │                │
                    ↓                ↓
            GitHub'da Güncellenir   Kullanıcıya Bildirilir
            Cloudflare Build Başlar
            2-3 Dakika Sonra
            Tüm Cihazlarda Görünür
```

---

## 🎯 Özet

1. **Sayfa Yüklendiğinde:**
   - Önce `public/data.json`'dan veriler yüklenir (ana kaynak)
   - Sonra LocalStorage'dan override edilir (admin değişiklikleri)

2. **Değişiklik Yapıldığında:**
   - State güncellenir (ekranda görünür)
   - LocalStorage'a kaydedilir (sayfa yenilense bile kaybolmaz)
   - GitHub'a push edilmez (henüz)

3. **"Kaydet ve Push Et" Butonuna Basıldığında:**
   - Token kontrol edilir
   - Tüm veriler toplanır
   - GitHub API'ye push edilir
   - 2-3 dakika sonra tüm cihazlarda görünür

4. **Token:**
   - Cloudflare Pages'de environment variable olarak ayarlanır
   - Her bilgisayarda otomatik çalışır
   - Ayrı token girişi gerekmez

---

## ❓ Sık Sorulan Sorular

**S: LocalStorage'daki veriler ne zaman silinir?**
C: LocalStorage'daki veriler asla otomatik silinmez. Sadece:
- Tarayıcı cache temizlenirse
- Farklı tarayıcı kullanılırsa
- LocalStorage manuel temizlenirse

**S: public/data.json ile LocalStorage çakışırsa ne olur?**
C: LocalStorage'daki veriler önceliklidir. Admin panelinde yapılan değişiklikler LocalStorage'da saklanır ve `public/data.json`'dan yüklenen verilerin üzerine yazılır.

**S: Token'ı nerede görebilirim?**
C: Token kod içine gömülüdür, tarayıcıda görünmez. Sadece GitHub API çağrılarında kullanılır.

**S: Push başarısız olursa ne olur?**
C: Veriler LocalStorage'da kalır. Tekrar "Kaydet ve Push Et" butonuna basabilirsiniz.

