"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Phone,
  MapPin,
  Clock,
  QrCode,
  Home,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeSelector from "@/components/ThemeSelector";
import { Language, getTranslation, translations } from "@/lib/translations";
import { ThemeColors, loadTheme, saveTheme } from "@/lib/theme";
import { Currency, currencies, loadCurrency, saveCurrency } from "@/lib/currency";
import { 
  hasAdminPassword, 
  checkAdminPassword, 
  setAdminPassword 
} from "@/lib/auth";
import { Lock, LogOut } from "lucide-react";

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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Restoranım",
    phone: "+90 (555) 123 45 67",
    address: "Örnek Mahalle, Örnek Sokak No:1",
    hours: "Pazartesi - Pazar: 09:00 - 23:00",
  });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "info" | "theme" | "currency">("menu");
  const [language, setLanguage] = useState<Language>("tr");
  const [theme, setTheme] = useState<ThemeColors>(loadTheme());
  const [defaultCurrency, setDefaultCurrency] = useState<Currency>(loadCurrency());

  useEffect(() => {
    // İlk yüklemede şifre kontrolü yap
    if (typeof window !== "undefined") {
      if (!hasAdminPassword()) {
        setIsFirstTime(true);
      } else {
        // Şifre varsa, session'dan kontrol et
        const sessionAuth = sessionStorage.getItem("adminAuthenticated");
        if (sessionAuth === "true") {
          setIsAuthenticated(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    const savedMenu = localStorage.getItem("menuData");
    const savedInfo = localStorage.getItem("restaurantInfo");
    const savedLanguage = localStorage.getItem("language") as Language;

    if (savedLanguage && (savedLanguage === "tr" || savedLanguage === "en")) {
      setLanguage(savedLanguage);
    }

    // Tema yükle
    const loadedTheme = loadTheme();
    setTheme(loadedTheme);

    if (savedMenu) {
      setCategories(JSON.parse(savedMenu));
    } else {
      setCategories([
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

  const saveToLocalStorage = (data: Category[]) => {
    localStorage.setItem("menuData", JSON.stringify(data));
  };

  const saveInfoToLocalStorage = (info: typeof restaurantInfo) => {
    localStorage.setItem("restaurantInfo", JSON.stringify(info));
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      items: [],
    };

    const updated = [...categories, newCategory];
    setCategories(updated);
    saveToLocalStorage(updated);
    setNewCategoryName("");
  };

  const updateCategory = (id: string, name: string) => {
    const updated = categories.map((cat) =>
      cat.id === id ? { ...cat, name } : cat
    );
    setCategories(updated);
    saveToLocalStorage(updated);
    setEditingCategory(null);
  };

  const deleteCategory = (id: string) => {
    if (confirm(getTranslation(language, "deleteCategoryConfirm"))) {
      const updated = categories.filter((cat) => cat.id !== id);
      setCategories(updated);
      saveToLocalStorage(updated);
    }
  };

  const addItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: getTranslation(language, "newProduct"),
      description: "",
      price: 0,
      category: categoryId,
    };

    const updated = categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, items: [...cat.items, newItem] }
        : cat
    );
    setCategories(updated);
    saveToLocalStorage(updated);
    setEditingItem(newItem.id);
  };

  const updateItem = (
    categoryId: string,
    itemId: string,
    updates: Partial<MenuItem>
  ) => {
    const updated = categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            items: cat.items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          }
        : cat
    );
    setCategories(updated);
    saveToLocalStorage(updated);
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    if (confirm(getTranslation(language, "deleteProductConfirm"))) {
      const updated = categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat
      );
      setCategories(updated);
      saveToLocalStorage(updated);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleThemeChange = (newTheme: ThemeColors) => {
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const getCurrentUrl = () => {
    // Her zaman production URL'sini kullan (mezecim.net)
    // Eğer localhost'ta çalışıyorsa, production URL'sini döndür
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      // Localhost veya development ortamında ise production URL'sini kullan
      if (origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes("pages.dev")) {
        return "https://mezecim.net";
      }
      return origin;
    }
    return "https://mezecim.net";
  };

  const handleFirstTimeSetup = () => {
    if (!password.trim()) {
      setPasswordError(getTranslation(language, "passwordRequired"));
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError(getTranslation(language, "passwordMismatch"));
      return;
    }
    setAdminPassword(password);
    setIsFirstTime(false);
    setIsAuthenticated(true);
    sessionStorage.setItem("adminAuthenticated", "true");
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleLogin = () => {
    if (!loginPassword.trim()) {
      setPasswordError(getTranslation(language, "passwordRequired"));
      return;
    }
    if (checkAdminPassword(loginPassword)) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuthenticated", "true");
      setLoginPassword("");
      setPasswordError("");
    } else {
      setPasswordError(getTranslation(language, "wrongPassword"));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuthenticated");
    setLoginPassword("");
  };

  // Şifre ekranı
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isFirstTime
                ? getTranslation(language, "firstTimeSetup")
                : getTranslation(language, "adminPanel")}
            </h1>
            <p className="text-gray-600 text-sm">
              {isFirstTime
                ? getTranslation(language, "firstTimeSetupDescription")
                : getTranslation(language, "enterPassword")}
            </p>
          </div>

          {isFirstTime ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation(language, "setPassword")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleFirstTimeSetup()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={getTranslation(language, "password")}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation(language, "confirmPassword")}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleFirstTimeSetup()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={getTranslation(language, "confirmPassword")}
                />
              </div>
              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}
              <button
                onClick={handleFirstTimeSetup}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                {getTranslation(language, "setPassword")}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation(language, "password")}
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={getTranslation(language, "enterPassword")}
                  autoFocus
                />
              </div>
              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}
              <button
                onClick={handleLogin}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                {getTranslation(language, "login")}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {getTranslation(language, "adminPanel")}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
              >
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{getTranslation(language, "showQRCode")}</span>
              </button>
              <a
                href="/"
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{getTranslation(language, "viewMenu")}</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{getTranslation(language, "logout")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {getTranslation(language, "qrCode")}
              </h2>
              <button
                onClick={() => setShowQRCode(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG value={getCurrentUrl()} size={256} />
              </div>
              <p className="text-gray-600 text-center">
                {getTranslation(language, "qrCodeDescription")}
              </p>
              <a
                href={getCurrentUrl()}
                className="text-primary-600 hover:text-primary-700 text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {getCurrentUrl()}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 overflow-x-auto">
          <div className="flex border-b min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === "menu"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {getTranslation(language, "menuManagement")}
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === "info"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {getTranslation(language, "restaurantInfo")}
            </button>
            <button
              onClick={() => setActiveTab("theme")}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === "theme"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {getTranslation(language, "themeSettings")}
            </button>
            <button
              onClick={() => setActiveTab("currency")}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === "currency"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {getTranslation(language, "currencySettings")}
            </button>
          </div>
        </div>

        {/* Menu Management */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            {/* Add Category */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCategory()}
                  placeholder={getTranslation(language, "newCategoryPlaceholder")}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={addCategory}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>{getTranslation(language, "addCategory")}</span>
                </button>
              </div>
            </div>

            {/* Categories */}
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    {editingCategory === category.id ? (
                      <input
                        type="text"
                        defaultValue={category.name}
                        onBlur={(e) =>
                          updateCategory(category.id, e.target.value)
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            updateCategory(
                              category.id,
                              (e.target as HTMLInputElement).value
                            );
                          }
                        }}
                        autoFocus
                        className="text-xl font-bold px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-gray-900">
                        {category.name}
                      </h2>
                    )}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setEditingCategory(
                            editingCategory === category.id ? null : category.id
                          )
                        }
                        className="p-2 text-gray-600 hover:text-primary-600 transition"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => addItem(category.id)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{getTranslation(language, "addProduct")}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        {editingItem === item.id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {getTranslation(language, "productName")}
                              </label>
                              <input
                                type="text"
                                defaultValue={item.name}
                                onChange={(e) =>
                                  updateItem(category.id, item.id, {
                                    name: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {getTranslation(language, "description")}
                              </label>
                              <textarea
                                defaultValue={item.description || ""}
                                onChange={(e) =>
                                  updateItem(category.id, item.id, {
                                    description: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {getTranslation(language, "price")} (₺)
                              </label>
                              <input
                                type="number"
                                defaultValue={item.price}
                                onChange={(e) =>
                                  updateItem(category.id, item.id, {
                                    price: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {getTranslation(language, "imageUrl")} {getTranslation(language, "optional")}
                              </label>
                              <div className="space-y-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        const base64String = reader.result as string;
                                        updateItem(category.id, item.id, {
                                          image: base64String,
                                        });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                />
                                <p className="text-xs text-gray-500">
                                  {getTranslation(language, "orUseUrl")}
                                </p>
                                <input
                                  type="url"
                                  defaultValue={item.image?.startsWith("data:") ? "" : (item.image || "")}
                                  onChange={(e) =>
                                    updateItem(category.id, item.id, {
                                      image: e.target.value,
                                    })
                                  }
                                  placeholder={getTranslation(language, "imageUrlPlaceholder")}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                {item.image && (
                                  <div className="mt-2">
                                    <img
                                      src={item.image}
                                      alt="Preview"
                                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setEditingItem(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                              >
                                {getTranslation(language, "save")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900">
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="text-gray-600 text-sm mt-1">
                                  {item.description}
                                </p>
                              )}
                              <p className="text-primary-600 font-bold mt-2">
                                {item.price.toFixed(2)} ₺
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingItem(item.id)}
                                className="p-2 text-gray-600 hover:text-primary-600 transition"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteItem(category.id, item.id)}
                                className="p-2 text-gray-600 hover:text-red-600 transition"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {category.items.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        {getTranslation(language, "noProductsInCategory")} {getTranslation(language, "addProduct")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Restaurant Info */}
        {activeTab === "info" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {getTranslation(language, "restaurantName")}
                </label>
                <input
                  type="text"
                  value={restaurantInfo.name}
                  onChange={(e) => {
                    const updated = { ...restaurantInfo, name: e.target.value };
                    setRestaurantInfo(updated);
                    saveInfoToLocalStorage(updated);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {getTranslation(language, "phone")}
                </label>
                <input
                  type="text"
                  value={restaurantInfo.phone}
                  onChange={(e) => {
                    const updated = {
                      ...restaurantInfo,
                      phone: e.target.value,
                    };
                    setRestaurantInfo(updated);
                    saveInfoToLocalStorage(updated);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {getTranslation(language, "address")}
                </label>
                <input
                  type="text"
                  value={restaurantInfo.address}
                  onChange={(e) => {
                    const updated = {
                      ...restaurantInfo,
                      address: e.target.value,
                    };
                    setRestaurantInfo(updated);
                    saveInfoToLocalStorage(updated);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  {getTranslation(language, "hours")}
                </label>
                <input
                  type="text"
                  value={restaurantInfo.hours}
                  onChange={(e) => {
                    const updated = {
                      ...restaurantInfo,
                      hours: e.target.value,
                    };
                    setRestaurantInfo(updated);
                    saveInfoToLocalStorage(updated);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Theme Settings */}
        {activeTab === "theme" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ThemeSelector
              currentTheme={theme}
              onThemeChange={handleThemeChange}
              translations={translations[language]}
              language={language}
            />
          </div>
        )}

        {/* Currency Settings */}
        {activeTab === "currency" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation(language, "currency")} ({getTranslation(language, "currencySettings")})
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  {language === "tr" 
                    ? "Varsayılan para birimini seçin. Müşteriler menüde farklı para birimleri arasında geçiş yapabilir."
                    : "Select the default currency. Customers can switch between different currencies in the menu."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.values(currencies).map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setDefaultCurrency(curr.code);
                        saveCurrency(curr.code);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        defaultCurrency === curr.code
                          ? "border-primary-600 bg-primary-50 ring-2 ring-primary-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-bold text-lg mb-1">
                        {curr.symbol} {curr.code}
                      </div>
                      <div className="text-sm text-gray-600">{curr.name}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        {language === "tr" ? "Kur:" : "Rate:"} 1 TRY = {curr.rate} {curr.code}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {language === "tr" ? "Kur Güncelleme" : "Update Exchange Rates"}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {language === "tr"
                    ? "Kurları güncellemek için lib/currency.ts dosyasındaki rate değerlerini düzenleyin."
                    : "To update exchange rates, edit the rate values in lib/currency.ts file."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

