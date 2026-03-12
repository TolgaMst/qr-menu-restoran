/**
 * QR Menü ↔ Maliyet senkronizasyon yardımcı fonksiyonları
 */

/**
 * menuData'dan tüm ürünleri düz liste olarak getir
 */
export function getMenuItems() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('menuData')
    if (!raw) return []
    const categories = JSON.parse(raw)
    if (!Array.isArray(categories)) return []
    const items = []
    for (const cat of categories) {
      if (cat.items && Array.isArray(cat.items)) {
        for (const item of cat.items) {
          items.push({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description || '',
            categoryId: cat.id,
            categoryName: cat.name,
          })
        }
      }
    }
    return items
  } catch {
    return []
  }
}

/**
 * Maliyet ürünlerinin sellingPrice'larını menuData'ya yaz
 * menuItemId eşleşmesi ile çalışır
 */
export function syncMaliyetToMenu(maliyetProducts) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('menuData')
    if (!raw) return
    const categories = JSON.parse(raw)
    if (!Array.isArray(categories)) return

    let changed = false
    for (const product of maliyetProducts) {
      if (!product.menuItemId) continue
      for (const cat of categories) {
        if (!cat.items) continue
        for (let i = 0; i < cat.items.length; i++) {
          if (cat.items[i].id === product.menuItemId && cat.items[i].price !== product.sellingPrice) {
            cat.items[i].price = product.sellingPrice
            changed = true
          }
        }
      }
    }

    if (changed) {
      localStorage.setItem('menuData', JSON.stringify(categories))
    }
  } catch {
    // ignore
  }
}

/**
 * menuData fiyatlarını maliyet ürünlerine yaz
 * Döndürülen liste güncellenmişse yeni referans, değişmemişse aynı referans
 */
export function syncMenuToMaliyet(maliyetProducts) {
  if (typeof window === 'undefined') return maliyetProducts
  try {
    const menuItems = getMenuItems()
    if (menuItems.length === 0) return maliyetProducts

    const menuMap = new Map(menuItems.map(m => [m.id, m]))
    let changed = false
    const updated = maliyetProducts.map(product => {
      if (!product.menuItemId) return product
      const menuItem = menuMap.get(product.menuItemId)
      if (menuItem && menuItem.price !== product.sellingPrice) {
        changed = true
        return { ...product, sellingPrice: menuItem.price }
      }
      return product
    })

    return changed ? updated : maliyetProducts
  } catch {
    return maliyetProducts
  }
}
