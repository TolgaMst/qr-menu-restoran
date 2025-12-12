# 🔄 Otomatik Export - En Kolay Yöntem

## 🎯 Sorun
Tarayıcı güvenlik kısıtlamaları nedeniyle, JavaScript dosya sistemine doğrudan yazamaz. Bu yüzden indirilen dosyayı manuel olarak `public` klasörüne koymanız gerekiyor.

## ✅ EN KOLAY ÇÖZÜM: Tarayıcı Console'dan Otomatik Export

### ADIM 1: Admin Paneline Gidin
1. `mezecim.net/admin` adresine gidin
2. Şifre ile giriş yapın
3. Verilerinizi doldurun/güncelleyin

### ADIM 2: Tarayıcı Console'unu Açın
1. **F12** tuşuna basın (veya sağ tık → "İncele" / "Inspect")
2. **"Console"** sekmesine gidin

### ADIM 3: Otomatik Export Kodunu Çalıştırın
Console'a şu kodu yapıştırın ve **Enter**'a basın:

```javascript
// Verileri LocalStorage'dan oku
const menuData = JSON.parse(localStorage.getItem('menuData') || '[]');
const restaurantInfo = JSON.parse(localStorage.getItem('restaurantInfo') || '{}');
const theme = JSON.parse(localStorage.getItem('themeColors') || '{}');
const currency = localStorage.getItem('currency') || 'TRY';
const language = localStorage.getItem('language') || 'tr';

// data.json oluştur
const data = {
  menuData: menuData,
  restaurantInfo: restaurantInfo,
  theme: theme,
  currency: currency,
  language: language,
  timestamp: new Date().toISOString()
};

// Dosyayı indir
const dataStr = JSON.stringify(data, null, 2);
const blob = new Blob([dataStr], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'data.json';
link.click();
URL.revokeObjectURL(url);

console.log('✅ data.json dosyası indirildi! public klasörüne koyun.');
```

### ADIM 4: Dosyayı Public Klasörüne Koyun
1. İndirilen `data.json` dosyasını bulun
2. `C:\Users\tlgms\Desktop\web\public\data.json` olarak kaydedin

### ADIM 5: GitHub'a Push Edin
```powershell
cd C:\Users\tlgms\Desktop\web
git add public/data.json
git commit -m "Veriler güncellendi"
git push
```

---

## 🚀 DAHA DA KOLAY: Bookmarklet (Tek Tıkla Export)

### Bookmarklet Oluşturma:
1. Tarayıcınızda yeni bir bookmark oluşturun
2. Ad: "Export data.json"
3. URL: Aşağıdaki kodu yapıştırın:

```javascript
javascript:(function(){const menuData=JSON.parse(localStorage.getItem('menuData')||'[]');const restaurantInfo=JSON.parse(localStorage.getItem('restaurantInfo')||'{}');const theme=JSON.parse(localStorage.getItem('themeColors')||'{}');const currency=localStorage.getItem('currency')||'TRY';const language=localStorage.getItem('language')||'tr';const data={menuData:menuData,restaurantInfo:restaurantInfo,theme:theme,currency:currency,language:language,timestamp:new Date().toISOString()};const dataStr=JSON.stringify(data,null,2);const blob=new Blob([dataStr],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='data.json';link.click();URL.revokeObjectURL(url);alert('✅ data.json indirildi! public klasörüne koyun.');})();
```

### Kullanım:
1. Admin paneline gidin
2. Bookmark'a tıklayın
3. `data.json` dosyası indirilecek!

---

## 📝 NOTLAR

- **Otomatik indirme**: Admin panelinde yaptığınız her değişiklikte `data.json` otomatik olarak indirilir (2 saniye debounce ile)
- **Manuel export**: İsterseniz "Tüm Cihazlar İçin Export" butonunu da kullanabilirsiniz
- **Console export**: En hızlı yöntem - console'dan tek komutla export edin

---

## 🎯 ÖNERİLEN YÖNTEM

**Bookmarklet kullanın!** Tek tıkla export edin, sonra dosyayı `public` klasörüne koyup GitHub'a push edin.

