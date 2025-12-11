"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, MapPin, Clock } from "lucide-react";
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
  const [menuData, setMenuData] = useState<Category[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Restoranım",
    phone: "+90 (555) 123 45 67",
    address: "Örnek Mahalle, Örnek Sokak No:1",
    hours: "Pazartesi - Pazar: 09:00 - 23:00",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Menu className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {restaurantInfo.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <CurrencySelector
                currentCurrency={currency}
                onCurrencyChange={handleCurrencyChange}
              />
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
              <a
                href="/admin"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {getTranslation(language, "management")}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary-600" />
              <span className="text-gray-700">{restaurantInfo.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary-600" />
              <span className="text-gray-700">{restaurantInfo.address}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary-600" />
              <span className="text-gray-700">{restaurantInfo.hours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Display */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

