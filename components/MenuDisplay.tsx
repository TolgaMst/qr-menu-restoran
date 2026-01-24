"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Heart, ThumbsUp, Search, ShoppingCart, Plus } from "lucide-react";
import { Language, getTranslation } from "@/lib/translations";
import { Currency, formatPrice, loadCurrency } from "@/lib/currency";
import { isFavorite, toggleFavorite, getFavorites } from "@/lib/favorites";
import { getItemLikes, toggleLike, hasUserLiked, getLikes, getLikedItems } from "@/lib/likes";

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
  image?: string;
  items: MenuItem[];
}

interface MenuDisplayProps {
  categories: Category[];
  language: Language;
  currency: Currency;
  onAddToCart?: (item: { id: string; name: string; price: number }) => void;
}

export default function MenuDisplay({ categories, language, currency, onAddToCart }: MenuDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories.length > 0 ? categories[0].id : ""
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Favorileri yükle
    const favs = getFavorites();
    setFavorites(favs);

    // Beğenileri yükle
    const likesData = getLikes();
    setLikes(likesData);

    // Kullanıcının beğendiği ürünleri yükle
    const liked = getLikedItems();
    setUserLiked(new Set(liked));
  }, []);

  const handleFavoriteToggle = (itemId: string) => {
    toggleFavorite(itemId);
    const favs = getFavorites();
    setFavorites(favs);
  };

  const handleLikeToggle = (itemId: string) => {
    const newLikes = toggleLike(itemId);
    setLikes((prev) => ({ ...prev, [itemId]: newLikes }));
    const liked = getLikedItems();
    setUserLiked(new Set(liked));
  };

  const handleAddToCart = (item: MenuItem) => {
    if (onAddToCart) {
      onAddToCart({ id: item.id, name: item.name, price: item.price });

      // Görsel geri bildirim
      setAddedItems((prev) => new Set([...prev, item.id]));
      setTimeout(() => {
        setAddedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
      }, 1000);
    }
  };

  // İlk kategoriyi varsayılan olarak seç
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);


  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-cream-300 text-lg font-body">{getTranslation(language, "noMenu")}</p>
        <a
          href="/admin"
          className="text-gold-400 hover:text-gold-300 font-medium mt-4 inline-block font-body"
        >
          {getTranslation(language, "addMenuFromAdmin")}
        </a>
      </div>
    );
  }

  // Arama fonksiyonu
  const filterItems = (items: MenuItem[], query: string) => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );
  };

  // Kategorileri arama sorgusuna göre filtrele
  const filteredCategories = searchQuery.trim()
    ? categories.map((cat) => ({
      ...cat,
      items: filterItems(cat.items, searchQuery),
    })).filter((cat) => cat.items.length > 0)
    : categories;

  const selectedCategoryData = filteredCategories.find((cat) => cat.id === selectedCategory);

  // Arama yapıldığında ilk kategoriyi seç
  useEffect(() => {
    if (searchQuery.trim() && filteredCategories.length > 0) {
      setSelectedCategory(filteredCategories[0].id);
    } else if (!searchQuery.trim() && categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
  }, [searchQuery, filteredCategories.length]);

  return (
    <div className="space-y-4">
      {/* Arama Kutusu */}
      <div className="vintage-frame bg-wood-900/80 backdrop-blur-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation(language, "searchPlaceholder")}
            className="w-full pl-10 pr-4 py-3 bg-wood-800/80 border border-gold-400/30 rounded-lg text-cream-100 placeholder-cream-500 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 font-body transition-all"
          />
        </div>
      </div>

      {/* Yatay Kaydırılabilir Kategori Seçici */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        <div className="flex space-x-2 sm:space-x-3 min-w-max">
          {filteredCategories.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center space-y-2 p-3 sm:p-4 rounded-lg transition-all duration-300 min-w-[100px] sm:min-w-[120px] ${isSelected
                    ? "bg-gradient-to-br from-primary-600 to-primary-700 border-2 border-gold-400 shadow-lg shadow-primary-900/50"
                    : "bg-wood-800/80 border border-gold-400/30 hover:border-gold-400/60 hover:bg-wood-700/80"
                  }`}
              >
                {category.image ? (
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden ${isSelected ? "ring-2 ring-gold-400" : "ring-1 ring-gold-400/30"
                    }`}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center text-3xl sm:text-4xl ${isSelected ? "bg-primary-800/50" : "bg-wood-700/50"
                    }`}>
                    🍽️
                  </div>
                )}
                <span className={`text-xs sm:text-sm font-display font-semibold text-center ${isSelected ? "text-gold-300" : "text-cream-200"
                  }`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seçili Kategorinin İçeriği */}
      {selectedCategoryData && (
        <div className="vintage-frame bg-wood-900/80 backdrop-blur-sm overflow-hidden">
          {/* Kategori Görseli */}
          {selectedCategoryData.image && (
            <div className="w-full h-56 sm:h-72 bg-wood-800 overflow-hidden relative">
              <img
                src={selectedCategoryData.image}
                alt={selectedCategoryData.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wood-900 via-transparent to-transparent" />
            </div>
          )}

          <div className="p-4 sm:p-6">
            {/* Kategori Başlığı */}
            <div className="category-header mb-6">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-cream-100 flex items-center">
                <span className="text-gold-400 mr-2">✦</span>
                {selectedCategoryData.name}
                <span className="text-gold-400 ml-2">✦</span>
              </h2>
            </div>

            {/* Ürünler Listesi */}
            <div className="space-y-4">
              {selectedCategoryData.items.map((item, index) => (
                <div
                  key={item.id}
                  className="menu-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Ürün Görseli */}
                    {item.image && (
                      <div className="w-full sm:w-36 sm:h-36 flex-shrink-0 bg-wood-800 overflow-hidden rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 sm:h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Ürün Bilgileri */}
                    <div className="flex-1 p-3 sm:p-4">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h3 className="font-display font-bold text-lg sm:text-xl text-cream-100 flex-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {/* Favori Butonu */}
                          <button
                            onClick={() => handleFavoriteToggle(item.id)}
                            className={`p-2 rounded-full transition-all duration-300 ${favorites.includes(item.id)
                                ? "text-red-400 bg-red-900/30 shadow-sm shadow-red-500/20"
                                : "text-cream-500 hover:text-red-400 hover:bg-red-900/20"
                              }`}
                            title={
                              favorites.includes(item.id)
                                ? getTranslation(language, "removeFromFavorites")
                                : getTranslation(language, "addToFavorites")
                            }
                          >
                            <Heart
                              className={`w-5 h-5 ${favorites.includes(item.id) ? "fill-current" : ""
                                }`}
                            />
                          </button>
                          {/* Beğeni Butonu */}
                          <button
                            onClick={() => handleLikeToggle(item.id)}
                            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-300 ${userLiked.has(item.id)
                                ? "text-gold-400 bg-gold-900/30 shadow-sm shadow-gold-500/20"
                                : "text-cream-500 hover:text-gold-400 hover:bg-gold-900/20"
                              }`}
                            title={getTranslation(language, "like")}
                          >
                            <ThumbsUp
                              className={`w-4 h-4 ${userLiked.has(item.id) ? "fill-current" : ""
                                }`}
                            />
                            <span className="text-sm font-medium font-body">
                              {likes[item.id] || 0}
                            </span>
                          </button>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-cream-400 text-sm sm:text-base mb-3 font-body leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        <span className="price-tag text-xl sm:text-2xl">
                          {formatPrice(item.price, currency)}
                        </span>

                        {/* Sepete Ekle Butonu */}
                        {onAddToCart && (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${addedItems.has(item.id)
                                ? "bg-green-600 text-white"
                                : "bg-primary-600 hover:bg-primary-500 text-cream-100 border border-gold-400/50"
                              }`}
                          >
                            {addedItems.has(item.id) ? (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                <span>{language === "tr" ? "Eklendi!" : "Added!"}</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                <span>{language === "tr" ? "Sepete Ekle" : "Add to Cart"}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedCategoryData.items.length === 0 && (
              <p className="text-cream-400 text-center py-8 font-body">
                {searchQuery.trim()
                  ? getTranslation(language, "noResults")
                  : getTranslation(language, "noProductsInCategory")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
