# Node.js Kurulum Rehberi

## Adım 1: Node.js İndirme

1. Tarayıcınızda şu adrese gidin: **https://nodejs.org/**
2. **LTS (Long Term Support)** versiyonunu indirin (önerilen)
3. İndirilen `.msi` dosyasını çalıştırın

## Adım 2: Kurulum

1. Kurulum sihirbazında **"Next"** butonlarına tıklayın
2. **"Add to PATH"** seçeneğinin işaretli olduğundan emin olun (varsayılan olarak işaretlidir)
3. Kurulumu tamamlayın

## Adım 3: Kurulumu Doğrulama

1. **PowerShell'i veya Command Prompt'u kapatıp yeniden açın** (önemli!)
2. Şu komutları çalıştırın:

```bash
node --version
npm --version
```

Her iki komut da bir versiyon numarası göstermelidir (örnek: v20.11.0)

## Adım 4: Projeyi Çalıştırma

Kurulum tamamlandıktan sonra, proje klasörüne gidin ve şu komutları çalıştırın:

```bash
cd C:\Users\tlgms\Desktop\web
npm install
npm run dev
```

## Sorun Giderme

### Eğer hala "npm is not recognized" hatası alıyorsanız:

1. PowerShell'i **yönetici olarak** çalıştırın
2. Şu komutu çalıştırın:
   ```powershell
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
   ```
3. Veya bilgisayarınızı yeniden başlatın

### Alternatif: Chocolatey ile Kurulum

Eğer Chocolatey yüklüyse:
```powershell
choco install nodejs-lts
```



