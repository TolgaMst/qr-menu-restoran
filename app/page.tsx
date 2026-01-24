"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, MapPin, Clock, Globe, ChevronDown, ChevronUp, Info, Mail, Instagram, Facebook, MessageCircle, Utensils } from "lucide-react";
import MenuDisplay from "@/components/MenuDisplay";
import LanguageSelector from "@/components/LanguageSelector";
import CurrencySelector from "@/components/CurrencySelector";
import { Language, getTranslation } from "@/lib/translations";
import { loadTheme } from "@/lib/theme";
import { Currency, loadCurrency, saveCurrency } from "@/lib/currency";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showRestaurantInfo, setShowRestaurantInfo] = useState(false);
  const [menuData, setMenuData] = useState<Category[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Restoranım",
    phone: "+90 (555) 123 45 67",
    address: "Örnek Mahalle, Örnek Sokak No:1",
    hours: "Pazartesi - Pazar: 09:00 - 23:00",
    logo: "",
    welcomeMessage: "",
    location: "",
    email: "",
    instagram: "",
    facebook: "",
  });
  const [language, setLanguage] = useState<Language>("tr");
  const [currency, setCurrency] = useState<Currency>("TRY");

  useEffect(() => {
    // Önce public/data.json dosyasından verileri yükle (tüm cihazlar için)
    const loadData = async () => {
      try {
        const response = await fetch("/data.json");
        if (response.ok) {
          const data = await response.json();

          // Public JSON'dan verileri yükle
          if (data.menuData) {
            setMenuData(data.menuData);
            // LocalStorage'a da kaydet (fallback için)
            localStorage.setItem("menuData", JSON.stringify(data.menuData));
          }

          if (data.restaurantInfo) {
            setRestaurantInfo(data.restaurantInfo);
            // LocalStorage'a da kaydet (fallback için)
            localStorage.setItem("restaurantInfo", JSON.stringify(data.restaurantInfo));
          }

          if (data.language && (data.language === "tr" || data.language === "en")) {
            setLanguage(data.language);
            localStorage.setItem("language", data.language);
          }

          if (data.currency) {
            setCurrency(data.currency);
            saveCurrency(data.currency);
          }

          if (data.theme) {
            loadTheme();
          }

          return; // Public JSON'dan yüklendi, LocalStorage'a bakmaya gerek yok
        }
      } catch (error) {
        // Public JSON dosyası yoksa LocalStorage'dan yükle
        console.log("Public data.json not found, loading from LocalStorage");
      }

      // LocalStorage'dan menü verilerini yükle (fallback)
      const savedMenu = localStorage.getItem("menuData");
      const savedInfo = localStorage.getItem("restaurantInfo");
      const savedLanguage = localStorage.getItem("language") as Language;

      if (savedLanguage && (savedLanguage === "tr" || savedLanguage === "en")) {
        setLanguage(savedLanguage);
      }

      // Para birimini yükle (sadece client-side)
      if (typeof window !== "undefined") {
        const savedCurrency = loadCurrency();
        setCurrency(savedCurrency);
      }

      // Tema yükle
      loadTheme();

      if (savedMenu) {
        setMenuData(JSON.parse(savedMenu));
      } else {
        // Varsayılan örnek menü
        setMenuData([
          {
            id: "1",
            name: "Ana Yemekler",
            items: [
              {
                id: "1",
                name: "Izgara Tavuk",
                description: "Taze sebzelerle servis edilen ızgara tavuk",
                price: 85,
                category: "1",
              },
              {
                id: "2",
                name: "Köfte",
                description: "Ev yapımı köfte, pilav ve salata ile",
                price: 95,
                category: "1",
              },
            ],
          },
          {
            id: "2",
            name: "İçecekler",
            items: [
              {
                id: "3",
                name: "Türk Kahvesi",
                description: "Geleneksel Türk kahvesi",
                price: 25,
                category: "2",
              },
              {
                id: "4",
                name: "Ayran",
                price: 15,
                category: "2",
              },
            ],
          },
        ]);
      }

      if (savedInfo) {
        setRestaurantInfo(JSON.parse(savedInfo));
      }
    };

    loadData();
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleCurrencyChange = (curr: Currency) => {
    setCurrency(curr);
    saveCurrency(curr);
  };

  // Menü gösterilmişse normal görünüm
  if (showMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-950 to-wood-900">
        {/* Header */}
        <header className="bg-wood-900/95 backdrop-blur-sm border-b border-gold-400/30 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-primary-600 p-1.5 sm:p-2 rounded-lg border border-gold-400/50">
                  <Utensils className="w-4 h-4 sm:w-6 sm:h-6 text-gold-400" />
                </div>
                <h1 className="text-lg sm:text-2xl font-display font-bold text-cream-100 truncate">
                  {restaurantInfo.name}
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <CurrencySelector
                  currentCurrency={currency}
                  onCurrencyChange={handleCurrencyChange}
                />
                <LanguageSelector
                  currentLanguage={language}
                  onLanguageChange={handleLanguageChange}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Restaurant Info */}
        <div className="bg-wood-900/80 border-b border-gold-400/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                <a
                  href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`}
                  className="text-sm sm:text-base text-cream-200 break-words hover:text-gold-400 transition"
                >
                  {restaurantInfo.phone}
                </a>
              </div>
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                <span className="text-sm sm:text-base text-cream-200 break-words">{restaurantInfo.address}</span>
              </div>
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 sm:col-span-2 md:col-span-1">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                <span className="text-sm sm:text-base text-cream-200 break-words">{restaurantInfo.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Display */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <MenuDisplay categories={menuData} language={language} currency={currency} />
        </main>

        {/* Footer */}
        <footer className="bg-wood-950 border-t border-gold-400/20 text-cream-100 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-cream-400 font-body">
                © 2025 {restaurantInfo.name}. {getTranslation(language, "allRightsReserved")}
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Hoş geldiniz sayfası - Klasik Meyhane Teması
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-950 via-wood-900 to-primary-950 flex flex-col">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      {/* Header - Sadece dil seçici */}
      <header className="bg-wood-900/80 backdrop-blur-sm border-b border-gold-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-end">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      </header>

      {/* Welcome Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center space-y-6 sm:space-y-8 max-w-2xl mx-auto animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center">
            {restaurantInfo.logo ? (
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-gold-400 shadow-2xl gold-shimmer">
                <img
                  src={restaurantInfo.logo}
                  alt={restaurantInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-br from-primary-700 to-primary-900 rounded-full flex items-center justify-center border-4 border-gold-400 shadow-2xl">
                <Utensils className="w-16 h-16 sm:w-20 sm:h-20 text-gold-400" />
              </div>
            )}
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center space-x-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
            <span className="text-gold-400 text-xl">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
          </div>

          {/* Restaurant Name */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-cream-100 drop-shadow-lg">
            {restaurantInfo.name}
          </h1>

          {/* Welcome Message */}
          <p className="text-xl sm:text-2xl text-cream-300 font-body italic">
            {restaurantInfo.welcomeMessage || getTranslation(language, "welcome")}
          </p>

          {/* Language Selection */}
          <div className="flex items-center justify-center space-x-4 pt-2">
            <button
              onClick={() => handleLanguageChange("tr")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${language === "tr"
                  ? "text-gold-400 font-semibold border-b-2 border-gold-400"
                  : "text-cream-400 hover:text-cream-200"
                }`}
            >
              <Globe className="w-4 h-4" />
              <span className="font-body">Türkçe</span>
            </button>
            <span className="text-gold-400/50">|</span>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${language === "en"
                  ? "text-gold-400 font-semibold border-b-2 border-gold-400"
                  : "text-cream-400 hover:text-cream-200"
                }`}
            >
              <Globe className="w-4 h-4" />
              <span className="font-body">English</span>
            </button>
          </div>

          {/* View Menu Button */}
          <div className="pt-6">
            <button
              onClick={() => setShowMenu(true)}
              className="btn-primary text-lg sm:text-xl px-10 py-4 hover:scale-105 transform transition-all duration-300"
            >
              {language === "tr" ? "🍽️ Menüyü Gör" : "🍽️ View Menu"}
            </button>
          </div>

          {/* Restaurant Info Button */}
          <div className="pt-2">
            <button
              onClick={() => setShowRestaurantInfo(!showRestaurantInfo)}
              className="btn-secondary text-base sm:text-lg px-8 py-3 flex items-center justify-center space-x-2 mx-auto"
            >
              <Info className="w-5 h-5" />
              <span>{getTranslation(language, "information")}</span>
              {showRestaurantInfo ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Restaurant Info Content */}
          {showRestaurantInfo && (
            <div className="pt-6 space-y-3 text-left max-w-md mx-auto animate-fade-in">
              {/* Telefon */}
              <div className="vintage-frame flex items-start space-x-3 p-4 bg-wood-900/60">
                <Phone className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`}
                  className="text-cream-200 hover:text-gold-400 transition font-body"
                >
                  {restaurantInfo.phone}
                </a>
              </div>

              {/* WhatsApp Butonu */}
              <div className="p-4 bg-green-900/40 rounded-lg border-2 border-green-500/50">
                <a
                  href={`https://wa.me/${restaurantInfo.phone.replace(/[\s()\-]/g, "")}?text=${encodeURIComponent(
                    language === "tr"
                      ? `Merhaba, ${restaurantInfo.name} için rezervasyon yapmak istiyorum.`
                      : `Hello, I would like to make a reservation for ${restaurantInfo.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn flex items-center justify-center space-x-3 w-full"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{language === "tr" ? "📱 WhatsApp ile Rezervasyon" : "📱 Reserve via WhatsApp"}</span>
                </a>
              </div>

              {/* Email */}
              {restaurantInfo.email && (
                <div className="vintage-frame flex items-start space-x-3 p-4 bg-wood-900/60">
                  <Mail className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                  <a
                    href={`mailto:${restaurantInfo.email}`}
                    className="text-cream-200 hover:text-gold-400 transition font-body"
                  >
                    {restaurantInfo.email}
                  </a>
                </div>
              )}

              {/* Adres */}
              <div className="vintage-frame flex items-start space-x-3 p-4 bg-wood-900/60">
                <MapPin className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-cream-200 font-body">{restaurantInfo.address}</span>
              </div>

              {/* Harita Linki */}
              {restaurantInfo.location && (
                <div className="vintage-frame p-4 bg-wood-900/60">
                  <a
                    href={restaurantInfo.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gold-400 hover:text-gold-300 transition font-semibold font-body"
                  >
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <span>📍 {getTranslation(language, "viewOnMap")}</span>
                  </a>
                </div>
              )}

              {/* Çalışma Saatleri */}
              <div className="vintage-frame flex items-start space-x-3 p-4 bg-wood-900/60">
                <Clock className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-cream-200 font-body">{restaurantInfo.hours}</span>
              </div>

              {/* Sosyal Medya */}
              {(restaurantInfo.instagram || restaurantInfo.facebook) && (
                <div className="vintage-frame p-4 bg-wood-900/60">
                  <div className="flex items-center space-x-6 justify-center">
                    {restaurantInfo.instagram && (
                      <a
                        href={restaurantInfo.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-pink-400 hover:text-pink-300 transition"
                      >
                        <Instagram className="w-6 h-6" />
                        <span className="text-sm font-medium font-body">Instagram</span>
                      </a>
                    )}
                    {restaurantInfo.facebook && (
                      <a
                        href={restaurantInfo.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition"
                      >
                        <Facebook className="w-6 h-6" />
                        <span className="text-sm font-medium font-body">Facebook</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-wood-950 border-t border-gold-400/20 text-cream-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400/50" />
              <span className="text-gold-400/70 text-sm">✦</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400/50" />
            </div>
            <p className="text-cream-500 text-sm font-body">
              © 2025 {restaurantInfo.name}. {getTranslation(language, "allRightsReserved")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
