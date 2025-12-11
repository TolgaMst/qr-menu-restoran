export interface FavoriteItem {
  itemId: string;
  categoryId: string;
  timestamp: number;
}

export const getFavorites = (): string[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
  }
  return [];
};

export const addToFavorites = (itemId: string) => {
  const favorites = getFavorites();
  if (!favorites.includes(itemId)) {
    favorites.push(itemId);
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }
};

export const removeFromFavorites = (itemId: string) => {
  const favorites = getFavorites();
  const updated = favorites.filter((id) => id !== itemId);
  if (typeof window !== "undefined") {
    localStorage.setItem("favorites", JSON.stringify(updated));
  }
};

export const isFavorite = (itemId: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(itemId);
};

export const toggleFavorite = (itemId: string) => {
  if (isFavorite(itemId)) {
    removeFromFavorites(itemId);
  } else {
    addToFavorites(itemId);
  }
};



