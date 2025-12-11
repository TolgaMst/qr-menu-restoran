"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Heart, ThumbsUp } from "lucide-react";
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
  items: MenuItem[];
}

interface MenuDisplayProps {
  categories: Category[];
  language: Language;
  currency: Currency;
}

export default function MenuDisplay({ categories, language, currency }: MenuDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories.length > 0 ? categories[0].id : ""
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Set<string>>(new Set());

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

  // İlk kategoriyi varsayılan olarak seç
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);


  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{getTranslation(language, "noMenu")}</p>
        <a
          href="/admin"
          className="text-primary-600 hover:text-primary-700 font-medium mt-4 inline-block"
        >
          {getTranslation(language, "addMenuFromAdmin")}
        </a>
      </div>
    );
  }

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Yatay Kaydırılabilir Kategori Seçici */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex space-x-3 sm:space-x-4 min-w-max">
          {categories.map((category) => {
            const firstItem = category.items[0];
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-all min-w-[100px] sm:min-w-[120px] ${
                  isSelected
                    ? "bg-primary-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300"
                }`}
              >
                {firstItem?.image ? (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={firstItem.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl border-2 ${
                    isSelected ? "border-white" : "border-gray-200"
                  }`}>
                    🍽️
                  </div>
                )}
                <span className={`text-xs sm:text-sm font-medium text-center ${
                  isSelected ? "text-white" : "text-gray-700"
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
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Kategori Görseli (İlk ürünün görseli) */}
          {selectedCategoryData.items.length > 0 && selectedCategoryData.items[0]?.image && (
            <div className="w-full h-48 sm:h-64 bg-gray-200 overflow-hidden">
              <img
                src={selectedCategoryData.items[0].image}
                alt={selectedCategoryData.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              {selectedCategoryData.name}
            </h2>
            
            {/* Ürünler Listesi - Alt Alta */}
            <div className="space-y-3 sm:space-y-4">
              {selectedCategoryData.items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 flex-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          <button
                            onClick={() => handleFavoriteToggle(item.id)}
                            className={`p-1.5 rounded-full transition ${
                              favorites.includes(item.id)
                                ? "text-red-500 bg-red-50"
                                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                            }`}
                            title={
                              favorites.includes(item.id)
                                ? getTranslation(language, "removeFromFavorites")
                                : getTranslation(language, "addToFavorites")
                            }
                          >
                            <Heart
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                favorites.includes(item.id) ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => handleLikeToggle(item.id)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full transition ${
                              userLiked.has(item.id)
                                ? "text-primary-600 bg-primary-50"
                                : "text-gray-400 hover:text-primary-600 hover:bg-primary-50"
                            }`}
                            title={getTranslation(language, "like")}
                          >
                            <ThumbsUp
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                userLiked.has(item.id) ? "fill-current" : ""
                              }`}
                            />
                            <span className="text-xs font-medium">
                              {likes[item.id] || 0}
                            </span>
                          </button>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-gray-600 text-xs sm:text-sm mb-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-primary-600 font-bold text-base sm:text-lg">
                          {formatPrice(item.price, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedCategoryData.items.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                {getTranslation(language, "noProductsInCategory")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

