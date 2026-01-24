// Admin paneli için şifre yönetimi - Sabit şifre güvenliği

// Sabit admin şifresi (güvenlik için hash'lenmeli ama basitlik için düz metin)
// Bu şifreyi değiştirmek için bu dosyayı güncelleyip GitHub'a push edin
const HARDCODED_ADMIN_PASSWORD = "33Musto79";

/**
 * Admin şifresini kaydet - artık gerekli değil (sabit şifre kullanılıyor)
 */
export const setAdminPassword = (_password: string): void => {
  // Artık şifre kaydedilmiyor - sabit şifre kullanılıyor
  console.log("Şifre artık kod içinde sabit olarak tanımlı.");
};

/**
 * Admin şifresini kontrol et - sabit şifre ile karşılaştır
 */
export const checkAdminPassword = (password: string): boolean => {
  return password === HARDCODED_ADMIN_PASSWORD;
};

/**
 * Admin şifresi var mı kontrol et - şimdi her zaman true
 */
export const hasAdminPassword = (): boolean => {
  // Sabit şifre her zaman var
  return true;
};

/**
 * Admin şifresini sil - artık geçersiz (sabit şifre değiştirilemez)
 */
export const clearAdminPassword = (): void => {
  console.log("Sabit şifre silinemez. Değiştirmek için kodu güncelleyin.");
};
