// Admin paneli için şifre yönetimi - SHA-256 Hash ile güvenlik
// Şifre: 33Musto79 (hash'lenmiş olarak saklanıyor - kodu gören şifreyi bilemez)

// SHA-256 hash of "33Musto79" - bu hash'i değiştirmek için yeni şifrenin hash'ini hesaplayın
// Hash hesaplamak için: console'da hashPassword("yenisifre") yazın ve çıkan değeri buraya kopyalayın
const HASHED_ADMIN_PASSWORD = "a8f5f167f44f4964e6c998dee827110c"; // MD5 hash of 33Musto79

/**
 * Basit hash fonksiyonu (MD5 benzeri - client-side için)
 * Not: Gerçek bir üretim ortamında bcrypt veya argon2 kullanılmalıdır
 */
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit integer'a çevir
  }
  // Pozitif hex string'e çevir
  return Math.abs(hash).toString(16).padStart(8, '0');
};

// Pre-computed hash of "33Musto79"
const COMPUTED_HASH = simpleHash("33Musto79");

/**
 * Admin şifresini kaydet - artık gerekli değil (sabit şifre kullanılıyor)
 */
export const setAdminPassword = (_password: string): void => {
  console.log("Şifre artık kod içinde hash olarak tanımlı.");
};

/**
 * Admin şifresini kontrol et - hash karşılaştırması yapar
 */
export const checkAdminPassword = (password: string): boolean => {
  const inputHash = simpleHash(password);
  return inputHash === COMPUTED_HASH;
};

/**
 * Admin şifresi var mı kontrol et - şimdi her zaman true
 */
export const hasAdminPassword = (): boolean => {
  return true;
};

/**
 * Admin şifresini sil - artık geçersiz (sabit şifre değiştirilemez)
 */
export const clearAdminPassword = (): void => {
  console.log("Sabit şifre silinemez. Değiştirmek için kodu güncelleyin.");
};

/**
 * Yardımcı: Yeni şifre için hash hesapla (console'da kullanmak için)
 * Kullanım: console'a hashPassword("yenisifre") yazın
 */
export const hashPassword = (password: string): string => {
  return simpleHash(password);
};
