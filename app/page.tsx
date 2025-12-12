"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, MapPin, Clock, Globe, ChevronDown, ChevronUp, Info, Mail, Instagram, Facebook } from "lucide-react";
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
    // LocalStorage'dan menü verilerini yükle
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-primary-600 p-1.5 sm:p-2 rounded-lg">
                  <Menu className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
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
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mt-0.5 sm:mt-0 flex-shrink-0" />
                <a
                  href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`}
                  className="text-sm sm:text-base text-gray-700 break-words hover:text-primary-600 transition"
                >
                  {restaurantInfo.phone}
                </a>
              </div>
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mt-0.5 sm:mt-0 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700 break-words">{restaurantInfo.address}</span>
              </div>
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 sm:col-span-2 md:col-span-1">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mt-0.5 sm:mt-0 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700 break-words">{restaurantInfo.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Display */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <MenuDisplay categories={menuData} language={language} currency={currency} />
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-400">
                © 2025 {restaurantInfo.name}. {getTranslation(language, "allRightsReserved")}
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Hoş geldiniz sayfası
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Sadece dil seçici */}
      <header className="bg-primary-600 text-white">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            {restaurantInfo.logo ? (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary-200 shadow-lg">
                <img
                  src={restaurantInfo.logo}
                  alt={restaurantInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-primary-100 rounded-full flex items-center justify-center border-4 border-primary-200">
                <Menu className="w-16 h-16 sm:w-20 sm:h-20 text-primary-600" />
              </div>
            )}
          </div>

          {/* Restaurant Name */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            {restaurantInfo.name}
          </h1>

          {/* Welcome Message */}
          <p className="text-xl sm:text-2xl text-gray-700">
            {restaurantInfo.welcomeMessage || getTranslation(language, "welcome")}
          </p>

          {/* Language Selection */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => handleLanguageChange("tr")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                language === "tr"
                  ? "text-primary-600 font-semibold underline"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Türkçe</span>
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                language === "en"
                  ? "text-primary-600 font-semibold underline"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>English</span>
            </button>
          </div>

          {/* View Menu Button */}
          <div className="pt-4">
            <button
              onClick={() => setShowMenu(true)}
              className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white text-lg sm:text-xl font-bold rounded-xl hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
            >
              {language === "tr" ? "Menüyü Gör" : "View Menu"}
            </button>
          </div>

          {/* Restaurant Info Button */}
          <div className="pt-4">
            <button
              onClick={() => setShowRestaurantInfo(!showRestaurantInfo)}
              className="w-full sm:w-auto px-8 py-4 bg-gray-600 text-white text-lg sm:text-xl font-bold rounded-xl hover:bg-gray-700 transition shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Info className="w-5 h-5" />
              <span>{getTranslation(language, "information")}</span>
            </button>
          </div>

          {/* Restaurant Info Content */}
          {showRestaurantInfo && (
            <div className="pt-6 space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`}
                  className="text-gray-700 hover:text-primary-600 transition"
                >
                  {restaurantInfo.phone}
                </a>
              </div>
              {restaurantInfo.email && (
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <a
                    href={`mailto:${restaurantInfo.email}`}
                    className="text-gray-700 hover:text-primary-600 transition"
                  >
                    {restaurantInfo.email}
                  </a>
                </div>
              )}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{restaurantInfo.address}</span>
              </div>
              {restaurantInfo.location && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <a
                    href={restaurantInfo.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-primary-600 hover:text-primary-700 transition font-semibold"
                  >
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <span>{getTranslation(language, "viewOnMap")}</span>
                  </a>
                </div>
              )}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{restaurantInfo.hours}</span>
              </div>
              {/* Sosyal Medya */}
              {(restaurantInfo.instagram || restaurantInfo.facebook) && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4 justify-center">
                    {restaurantInfo.instagram && (
                      <a
                        href={restaurantInfo.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition"
                      >
                        <Instagram className="w-5 h-5" />
                        <span className="text-sm font-medium">Instagram</span>
                      </a>
                    )}
                    {restaurantInfo.facebook && (
                      <a
                        href={restaurantInfo.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition"
                      >
                        <Facebook className="w-5 h-5" />
                        <span className="text-sm font-medium">Facebook</span>
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
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 {restaurantInfo.name}. {getTranslation(language, "allRightsReserved")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

