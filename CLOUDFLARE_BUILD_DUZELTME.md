# Cloudflare Pages Build Hatası Düzeltme

## 🔧 Sorun
Cloudflare Pages, build output directory'yi bulamıyor. Next.js static export `out` klasörüne çıktı veriyor.

## ✅ Çözüm

### 1. next.config.js Güncellendi
- `distDir: 'out'` eklendi
- Artık build çıktısı `out` klasörüne gidecek

### 2. Cloudflare Pages Build Ayarları

Cloudflare Pages dashboard'da şu ayarları yapın:

**Build Settings:**
- **Framework preset:** Next.js (Static HTML Export)
- **Build command:** `npm run build`
- **Build output directory:** `out` ⚠️ (`.next` değil, `out` olmalı!)
- **Root directory:** `/` (boş bırakın)

### 3. Deploy Command (Opsiyonel)
- **Deploy command:** Boş bırakın veya silin
- Cloudflare Pages otomatik deploy edecek

## 📝 Adımlar

1. GitHub'a güncellenmiş `next.config.js` dosyasını yükleyin
2. Cloudflare Pages'de build ayarlarını kontrol edin
3. Tekrar deploy edin

