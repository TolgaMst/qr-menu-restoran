// Admin paneli için şifre yönetimi

const ADMIN_PASSWORD_KEY = "adminPassword";

/**
 * Admin şifresini kaydet
 */
export const setAdminPassword = (password: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_PASSWORD_KEY, password);
  }
};

/**
 * Admin şifresini kontrol et
 */
export const checkAdminPassword = (password: string): boolean => {
  if (typeof window !== "undefined") {
    const savedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
    return savedPassword === password;
  }
  return false;
};

/**
 * Admin şifresi var mı kontrol et
 */
export const hasAdminPassword = (): boolean => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem(ADMIN_PASSWORD_KEY);
  }
  return false;
};

/**
 * Admin şifresini sil (sıfırlama için)
 */
export const clearAdminPassword = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_PASSWORD_KEY);
  }
};

