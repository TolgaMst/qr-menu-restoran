/**
 * LocalStorage'dan verileri okuyup public/data.json dosyasına yazar
 * 
 * Kullanım:
 * 1. Admin panelinde verileri doldurun
 * 2. Bu script'i çalıştırın: node scripts/export-data.js
 * 3. public/data.json dosyası otomatik oluşturulacak
 * 4. GitHub'a push edin
 */

const fs = require('fs');
const path = require('path');

// LocalStorage simülasyonu için basit bir çözüm
// Gerçek LocalStorage tarayıcıda, bu yüzden bu script'i tarayıcı console'undan çalıştırmak daha iyi

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  LocalStorage'dan Veri Export Script'i                      ║
╚══════════════════════════════════════════════════════════════╝

Bu script, tarayıcı LocalStorage'ından verileri okuyamaz.
Bunun yerine, tarayıcı console'unda şu kodu çalıştırın:

1. Admin paneline gidin: mezecim.net/admin
2. Tarayıcı console'unu açın (F12)
3. Şu kodu yapıştırın ve Enter'a basın:

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

Alternatif olarak, admin panelinde "Tüm Cihazlar İçin Export" butonunu kullanın.
`);

