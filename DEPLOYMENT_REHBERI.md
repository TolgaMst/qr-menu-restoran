# Web Sitesini Canlıya Alma Rehberi

## Seçenek 1: Vercel (Önerilen - En Kolay)

### Adımlar:

1. **Vercel Hesabı Oluşturun**
   - https://vercel.com adresine gidin
   - "Sign Up" butonuna tıklayın
   - GitHub, GitLab veya Email ile kayıt olun

2. **GitHub'a Kodunuzu Yükleyin**
   - GitHub hesabı oluşturun: https://github.com
   - Yeni bir repository oluşturun
   - Projenizi GitHub'a yükleyin:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
     git push -u origin main
     ```

3. **Vercel'e Bağlayın**
   - Vercel dashboard'a gidin
   - "Add New Project" butonuna tıklayın
   - GitHub repository'nizi seçin
   - "Import" butonuna tıklayın
   - Vercel otomatik olarak Next.js'i algılayacak
   - "Deploy" butonuna tıklayın

4. **Hazır!**
   - Birkaç dakika içinde siteniz canlıda olacak
   - Vercel size ücretsiz bir domain verecek: `proje-adi.vercel.app`
   - Özel domain de ekleyebilirsiniz

### Avantajlar:
- ✅ Tamamen ücretsiz
- ✅ Otomatik SSL sertifikası
- ✅ Otomatik deployment (GitHub'a push yaptığınızda)
- ✅ Hızlı CDN
- ✅ Next.js için optimize edilmiş

---

## Seçenek 2: Netlify

### Adımlar:

1. **Netlify Hesabı Oluşturun**
   - https://www.netlify.com adresine gidin
   - "Sign up" butonuna tıklayın

2. **Projeyi Build Edin**
   ```bash
   npm run build
   ```

3. **Netlify'e Yükleyin**
   - Netlify dashboard'a gidin
   - "Add new site" → "Deploy manually"
   - `.next` klasörünü yükleyin (veya GitHub'a bağlayın)

### Avantajlar:
- ✅ Ücretsiz plan
- ✅ Kolay kullanım
- ✅ Form desteği

---

## Seçenek 3: Kendi Sunucunuz (VPS)

### Gereksinimler:
- VPS (DigitalOcean, AWS, Linode, vb.)
- Domain adı
- Node.js kurulumu

### Adımlar:

1. **VPS'e Bağlanın**
   ```bash
   ssh kullanici@sunucu-ip
   ```

2. **Node.js ve PM2 Kurun**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Projeyi Yükleyin**
   ```bash
   git clone https://github.com/KULLANICI_ADI/REPO_ADI.git
   cd REPO_ADI
   npm install
   npm run build
   ```

4. **PM2 ile Çalıştırın**
   ```bash
   pm2 start npm --name "qr-menu" -- start
   pm2 save
   pm2 startup
   ```

5. **Nginx Kurulumu (Reverse Proxy)**
   ```bash
   sudo apt install nginx
   ```

6. **Nginx Konfigürasyonu**
   `/etc/nginx/sites-available/qr-menu` dosyası oluşturun:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **SSL Sertifikası (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Seçenek 4: Railway

### Adımlar:

1. **Railway Hesabı Oluşturun**
   - https://railway.app adresine gidin
   - GitHub ile giriş yapın

2. **Yeni Proje Oluşturun**
   - "New Project" → "Deploy from GitHub repo"
   - Repository'nizi seçin

3. **Ortam Değişkenleri (Gerekirse)**
   - Settings → Variables
   - Gerekli değişkenleri ekleyin

### Avantajlar:
- ✅ Kolay kullanım
- ✅ Otomatik deployment
- ✅ Ücretsiz plan mevcut

---

## Önemli Notlar

### 1. Environment Variables (Ortam Değişkenleri)
Eğer API key'ler veya gizli bilgiler varsa, bunları environment variables olarak ekleyin.

### 2. Build Ayarları
Vercel ve Netlify otomatik olarak algılar, ama manuel ayar gerekirse:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. Domain Ayarları
- Vercel/Netlify'da "Domains" bölümünden özel domain ekleyebilirsiniz
- DNS ayarlarını domain sağlayıcınızdan yapmanız gerekir

### 4. Database (Gelecekte)
Şu anda localStorage kullanıyoruz. Gerçek bir uygulama için:
- **Vercel Postgres** (Vercel ile entegre)
- **Supabase** (ücretsiz)
- **MongoDB Atlas** (ücretsiz)
- **PlanetScale** (MySQL, ücretsiz)

---

## Hızlı Başlangıç: Vercel ile 5 Dakikada

1. GitHub'a kodunuzu yükleyin
2. Vercel.com'a gidin ve kayıt olun
3. "Add New Project" → GitHub repo seçin
4. "Deploy" butonuna tıklayın
5. Hazır! 🎉

---

## Sorun Giderme

### Build Hatası
- `npm run build` komutunu local'de çalıştırıp hataları kontrol edin
- `package.json` dosyasını kontrol edin

### 404 Hatası
- `next.config.js` dosyasını kontrol edin
- Routing yapısını kontrol edin

### Environment Variables
- Vercel/Netlify dashboard'dan environment variables ekleyin
- `.env.local` dosyasını production'a yüklemeyin (güvenlik riski)

---

## Önerilen: Vercel

En kolay ve hızlı yol Vercel'dir. Next.js ile mükemmel çalışır ve tamamen ücretsizdir.

