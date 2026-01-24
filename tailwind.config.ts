import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Klasik Meyhane Teması
        primary: {
          50: "#fdf2f3",
          100: "#fce4e6",
          200: "#facdd2",
          300: "#f5a3ac",
          400: "#ee6b7a",
          500: "#e23d50",
          600: "#8B0000", // Şarap kırmızısı
          700: "#722F37", // Bordo
          800: "#5a2329",
          900: "#4c1d24",
          950: "#2a0d11",
        },
        // Altın/Bakır tonları
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#D4AF37", // Ana altın
          500: "#B8860B", // Koyu altın
          600: "#a16207",
          700: "#854d0e",
          800: "#713f12",
          900: "#422006",
        },
        // Ahşap/Arka plan tonları
        wood: {
          50: "#faf5f0",
          100: "#f0e6d9",
          200: "#dcc8ad",
          300: "#c7a57d",
          400: "#b5875a",
          500: "#a5724b",
          600: "#8b5a3c",
          700: "#6f4631",
          800: "#5d3b2c",
          900: "#2d1810", // Koyu ahşap
          950: "#1a0f0a", // En koyu
        },
        // Krem/Bej tonları
        cream: {
          50: "#FFFEF7",
          100: "#FAEBD7", // Antik beyaz
          200: "#F5DEB3", // Buğday
          300: "#EEE8CD",
          400: "#E8DCC8",
          500: "#D4C4A8",
          600: "#BCA888",
          700: "#A08C68",
          800: "#847048",
          900: "#685428",
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Lora', 'serif'],
      },
      backgroundImage: {
        'wood-pattern': "url('/wood-texture.png')",
        'vintage-border': "url('/vintage-border.png')",
      },
    },
  },
  plugins: [],
};
export default config;



