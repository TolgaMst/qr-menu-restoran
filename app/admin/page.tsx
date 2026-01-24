"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, X, Home, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import { hasAdminPassword, checkAdminPassword } from "@/lib/auth";
import { Lock } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
}

interface Category {
  id: string;
  name: string;
  image?: string;
  items: MenuItem[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // GitHub ayarları
  const GITHUB_USERNAME = "TolgaMst";
  const GITHUB_REPO = "qr-menu-restoran";
  const getGithubToken = () => process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionAuth = sessionStorage.getItem("adminAuthenticated");
      if (sessionAuth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data.json");
        if (response.ok) {
          const data = await response.json();
          if (data.menuData && Array.isArray(data.menuData)) {
            setCategories(data.menuData);
          }
        }
      } catch (error) {
        console.log("Veri yüklenemedi");
      }

      const savedMenu = localStorage.getItem("menuData");
      if (savedMenu) {
        try {
          setCategories(JSON.parse(savedMenu));
        } catch (e) {
          console.error("LocalStorage hatası:", e);
        }
      }
    };
    loadData();
  }, []);

  const saveToLocalStorage = (data: Category[]) => {
    localStorage.setItem("menuData", JSON.stringify(data));
    setHasChanges(true);
  };

  const handleSaveAndPush = async () => {
    const githubToken = getGithubToken();
    if (!githubToken) {
      alert("GitHub token eksik! Cloudflare'de NEXT_PUBLIC_GITHUB_TOKEN ayarlayın.");
      return;
    }

    setIsSaving(true);

    try {
      // Mevcut data.json'ı al
      const response = await fetch("/data.json");
      let existingData: any = {};
      if (response.ok) {
        existingData = await response.json();
      }

      // Sadece menü verisini güncelle
      const publicData = {
        ...existingData,
        menuData: categories,
        timestamp: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(publicData, null, 2);

      // GitHub'dan mevcut SHA'yı al
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/public/data.json`,
        { headers: { Authorization: `Bearer ${githubToken}`, Accept: "application/vnd.github.v3+json" } }
      );

      let sha = null;
      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        sha = fileData.sha;
      }

      // GitHub'a push et
      const updateResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/public/data.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Menü güncellendi - ${new Date().toLocaleString("tr-TR")}`,
            content: btoa(unescape(encodeURIComponent(dataStr))),
            sha: sha,
            branch: "main",
          }),
        }
      );

      if (updateResponse.ok) {
        alert("✅ Değişiklikler kaydedildi! 2-3 dakika içinde sitede görünecek.");
        setHasChanges(false);
      } else {
        const error = await updateResponse.json();
        alert(`❌ Kaydetme hatası: ${error.message}`);
      }
    } catch (error: any) {
      alert(`❌ Hata: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = () => {
    if (checkAdminPassword(loginPassword)) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuthenticated", "true");
      setLoginPassword("");
      setPasswordError("");
    } else {
      setPasswordError("Yanlış şifre!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuthenticated");
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.toUpperCase(),
      items: [],
    };
    const updated = [...categories, newCategory];
    setCategories(updated);
    saveToLocalStorage(updated);
    setNewCategoryName("");
    setExpandedCategory(newCategory.id);
  };

  const deleteCategory = (id: string) => {
    if (confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
      const updated = categories.filter((cat) => cat.id !== id);
      setCategories(updated);
      saveToLocalStorage(updated);
    }
  };

  const addItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: "Yeni Ürün",
      price: 0,
      category: categoryId,
    };
    const updated = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, items: [...cat.items, newItem] } : cat
    );
    setCategories(updated);
    saveToLocalStorage(updated);
  };

  const updateItem = (categoryId: string, itemId: string, updates: Partial<MenuItem>) => {
    const updated = categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)) }
        : cat
    );
    setCategories(updated);
    saveToLocalStorage(updated);
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      const updated = categories.map((cat) =>
        cat.id === categoryId ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) } : cat
      );
      setCategories(updated);
      saveToLocalStorage(updated);
    }
  };

  // Login ekranı
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-950 via-wood-900 to-primary-950 flex items-center justify-center px-4">
        <div className="bg-wood-900/90 border border-gold-400/30 rounded-xl p-8 max-w-sm w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="bg-primary-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gold-400">
              <Lock className="w-7 h-7 text-gold-400" />
            </div>
            <h1 className="text-xl font-display font-bold text-cream-100">Admin Paneli</h1>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => { setLoginPassword(e.target.value); setPasswordError(""); }}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-3 bg-wood-800 border border-gold-400/30 rounded-lg text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400"
              placeholder="Şifre"
              autoFocus
            />
            {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-primary-600 text-cream-100 rounded-lg hover:bg-primary-500 font-semibold border border-gold-400/50"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin paneli
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-950 to-wood-900">
      {/* Header */}
      <header className="bg-wood-900/95 border-b border-gold-400/30 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-display font-bold text-cream-100">Menü Yönetimi</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAndPush}
              disabled={isSaving || !hasChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${hasChanges
                  ? "bg-green-600 text-white hover:bg-green-500"
                  : "bg-wood-800 text-cream-500 cursor-not-allowed"
                }`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <a href="/" className="p-2 bg-wood-800 text-cream-300 rounded-lg hover:bg-wood-700">
              <Home className="w-4 h-4" />
            </a>
            <button onClick={handleLogout} className="p-2 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-800/50">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Yeni Kategori Ekle */}
        <div className="bg-wood-900/80 border border-gold-400/20 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCategory()}
              placeholder="Yeni kategori adı..."
              className="flex-1 px-4 py-2 bg-wood-800 border border-gold-400/20 rounded-lg text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400"
            />
            <button
              onClick={addCategory}
              className="px-4 py-2 bg-gold-500 text-wood-950 rounded-lg hover:bg-gold-400 font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Kategori Ekle
            </button>
          </div>
        </div>

        {/* Kategoriler */}
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-wood-900/80 border border-gold-400/20 rounded-lg overflow-hidden">
              {/* Kategori Başlığı */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-wood-800/50"
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-display font-bold text-gold-400">{category.name}</span>
                  <span className="text-sm text-cream-500">({category.items.length} ürün)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteCategory(category.id); }}
                    className="p-2 text-red-400 hover:bg-red-900/30 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedCategory === category.id ? (
                    <ChevronUp className="w-5 h-5 text-cream-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-cream-400" />
                  )}
                </div>
              </div>

              {/* Ürünler */}
              {expandedCategory === category.id && (
                <div className="border-t border-gold-400/10 p-4 space-y-3">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-wood-800/50 p-3 rounded-lg">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(category.id, item.id, { name: e.target.value })}
                        className="flex-1 px-3 py-2 bg-wood-700 border border-gold-400/20 rounded text-cream-100 focus:outline-none focus:border-gold-400"
                        placeholder="Ürün adı"
                      />
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(category.id, item.id, { price: Number(e.target.value) })}
                        className="w-24 px-3 py-2 bg-wood-700 border border-gold-400/20 rounded text-cream-100 text-right focus:outline-none focus:border-gold-400"
                        placeholder="Fiyat"
                      />
                      <span className="text-cream-400">₺</span>
                      <button
                        onClick={() => deleteItem(category.id, item.id)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addItem(category.id)}
                    className="w-full py-2 border-2 border-dashed border-gold-400/30 rounded-lg text-gold-400 hover:bg-gold-400/10 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Ürün Ekle
                  </button>
                </div>
              )}
            </div>
          ))}

          {categories.length === 0 && (
            <div className="text-center py-12 text-cream-500">
              <p>Henüz kategori yok. Yukarıdan yeni bir kategori ekleyin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
