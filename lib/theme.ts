export interface ThemeColors {
  primary: string;
  secondary: string;
}

export const defaultTheme: ThemeColors = {
  primary: "#0ea5e9", // primary-500
  secondary: "#0284c7", // primary-600
};

export const presetThemes: { name: string; colors: ThemeColors }[] = [
  { name: "Mavi (Varsayılan)", colors: { primary: "#0ea5e9", secondary: "#0284c7" } },
  { name: "Yeşil", colors: { primary: "#10b981", secondary: "#059669" } },
  { name: "Mor", colors: { primary: "#8b5cf6", secondary: "#7c3aed" } },
  { name: "Kırmızı", colors: { primary: "#ef4444", secondary: "#dc2626" } },
  { name: "Turuncu", colors: { primary: "#f97316", secondary: "#ea580c" } },
  { name: "Pembe", colors: { primary: "#ec4899", secondary: "#db2777" } },
  { name: "Amber", colors: { primary: "#f59e0b", secondary: "#d97706" } },
  { name: "Teal", colors: { primary: "#14b8a6", secondary: "#0d9488" } },
];

// Renk parlaklığını ayarlamak için yardımcı fonksiyon
function adjustBrightness(hex: string, factor: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  
  // RGB değerlerini ayır
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  
  // Parlaklığı ayarla
  const newR = Math.min(255, Math.floor(r + (255 - r) * (1 - factor)));
  const newG = Math.min(255, Math.floor(g + (255 - g) * (1 - factor)));
  const newB = Math.min(255, Math.floor(b + (255 - b) * (1 - factor)));
  
  // Hex'e çevir
  const result = (newR << 16) | (newG << 8) | newB;
  return `#${result.toString(16).padStart(6, "0")}`;
}

export const saveTheme = (theme: ThemeColors) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("themeColors", JSON.stringify(theme));
    applyTheme(theme);
  }
};

export const loadTheme = (): ThemeColors => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("themeColors");
    if (saved) {
      try {
        const theme = JSON.parse(saved);
        applyTheme(theme);
        return theme;
      } catch (e) {
        return defaultTheme;
      }
    }
  }
  return defaultTheme;
};

export const applyTheme = (theme: ThemeColors) => {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-secondary", theme.secondary);
    
    // Renk parlaklıklarını önceden hesapla
    const primary100 = adjustBrightness(theme.primary, 0.9);
    const primary200 = adjustBrightness(theme.primary, 0.8);
    
    // Tailwind CSS için dinamik class'lar oluştur
    const style = document.createElement("style");
    style.id = "dynamic-theme";
    style.textContent = `
      .bg-primary-600 { background-color: ${theme.primary} !important; }
      .bg-primary-700 { background-color: ${theme.secondary} !important; }
      .text-primary-600 { color: ${theme.primary} !important; }
      .text-primary-700 { color: ${theme.secondary} !important; }
      .border-primary-600 { border-color: ${theme.primary} !important; }
      .from-primary-600 { --tw-gradient-from: ${theme.primary} !important; }
      .to-primary-700 { --tw-gradient-to: ${theme.secondary} !important; }
      .hover\\:bg-primary-700:hover { background-color: ${theme.secondary} !important; }
      .hover\\:text-primary-700:hover { color: ${theme.secondary} !important; }
      .hover\\:from-primary-700:hover { --tw-gradient-from: ${theme.secondary} !important; }
      .hover\\:to-primary-800:hover { --tw-gradient-to: ${theme.secondary} !important; }
      .focus\\:ring-primary-500:focus { --tw-ring-color: ${theme.primary} !important; }
      .from-primary-100 { --tw-gradient-from: ${primary100} !important; }
      .to-primary-200 { --tw-gradient-to: ${primary200} !important; }
    `;
    
    const existingStyle = document.getElementById("dynamic-theme");
    if (existingStyle) {
      existingStyle.remove();
    }
    document.head.appendChild(style);
  }
};
