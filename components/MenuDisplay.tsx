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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((cat) => cat.id))
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

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };


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

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white flex items-center justify-between hover:from-primary-700 hover:to-primary-800 transition-all"
          >
            <h2 className="text-xl font-bold">{category.name}</h2>
            {expandedCategories.has(category.id) ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {expandedCategories.has(category.id) && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {item.image ? (
                      <div className="aspect-video bg-gray-200 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <span className="text-primary-600 text-4xl">🍽️</span>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900 flex-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-2 ml-2">
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
                              className={`w-5 h-5 ${
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
                              className={`w-4 h-4 ${
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
                        <p className="text-gray-600 text-sm mb-3">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-primary-600 font-bold text-lg">
                          {formatPrice(item.price, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {category.items.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  {getTranslation(language, "noProductsInCategory")}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

