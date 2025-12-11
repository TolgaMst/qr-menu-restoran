export interface LikeData {
  [itemId: string]: number;
}

export const getLikes = (): LikeData => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("itemLikes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
  }
  return {};
};

export const getItemLikes = (itemId: string): number => {
  const likes = getLikes();
  return likes[itemId] || 0;
};

export const likeItem = (itemId: string) => {
  const likes = getLikes();
  likes[itemId] = (likes[itemId] || 0) + 1;
  if (typeof window !== "undefined") {
    localStorage.setItem("itemLikes", JSON.stringify(likes));
  }
  return likes[itemId];
};

export const getLikedItems = (): string[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("userLikedItems");
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

export const hasUserLiked = (itemId: string): boolean => {
  const likedItems = getLikedItems();
  return likedItems.includes(itemId);
};

export const toggleLike = (itemId: string) => {
  const likedItems = getLikedItems();
  const index = likedItems.indexOf(itemId);
  
  if (index > -1) {
    // Kullanıcı daha önce beğenmiş, beğeniyi geri al
    likedItems.splice(index, 1);
    const likes = getLikes();
    likes[itemId] = Math.max(0, (likes[itemId] || 0) - 1);
    if (typeof window !== "undefined") {
      localStorage.setItem("itemLikes", JSON.stringify(likes));
      localStorage.setItem("userLikedItems", JSON.stringify(likedItems));
    }
    return likes[itemId];
  } else {
    // Kullanıcı beğeniyor
    likedItems.push(itemId);
    const likes = getLikes();
    likes[itemId] = (likes[itemId] || 0) + 1;
    if (typeof window !== "undefined") {
      localStorage.setItem("itemLikes", JSON.stringify(likes));
      localStorage.setItem("userLikedItems", JSON.stringify(likedItems));
    }
    return likes[itemId];
  }
};



