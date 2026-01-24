// Sepet yönetimi
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

const CART_KEY = "cart";

// Sepeti yükle
export function getCart(): CartItem[] {
    if (typeof window === "undefined") return [];
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

// Sepeti kaydet
function saveCart(cart: CartItem[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Sepete ürün ekle
export function addToCart(item: { id: string; name: string; price: number }): CartItem[] {
    const cart = getCart();
    const existingIndex = cart.findIndex((i) => i.id === item.id);

    if (existingIndex >= 0) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    saveCart(cart);
    return cart;
}

// Sepetten ürün çıkar
export function removeFromCart(itemId: string): CartItem[] {
    const cart = getCart();
    const existingIndex = cart.findIndex((i) => i.id === itemId);

    if (existingIndex >= 0) {
        if (cart[existingIndex].quantity > 1) {
            cart[existingIndex].quantity -= 1;
        } else {
            cart.splice(existingIndex, 1);
        }
    }

    saveCart(cart);
    return cart;
}

// Ürünü tamamen sepetten sil
export function deleteFromCart(itemId: string): CartItem[] {
    const cart = getCart().filter((i) => i.id !== itemId);
    saveCart(cart);
    return cart;
}

// Sepeti temizle
export function clearCart(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_KEY);
}

// Sepet toplamını hesapla
export function getCartTotal(cart: CartItem[]): number {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Sepetteki toplam ürün sayısı
export function getCartItemCount(cart: CartItem[]): number {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// WhatsApp sipariş mesajı oluştur
export function createWhatsAppOrderMessage(
    cart: CartItem[],
    restaurantName: string,
    language: "tr" | "en",
    total: number,
    currency: string
): string {
    if (language === "tr") {
        let message = `🍽️ *${restaurantName} - Yeni Sipariş*\n\n`;
        message += `📋 *Sipariş Detayları:*\n`;
        message += `━━━━━━━━━━━━━━━\n`;

        cart.forEach((item) => {
            message += `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} ${currency}\n`;
        });

        message += `━━━━━━━━━━━━━━━\n`;
        message += `💰 *Toplam:* ${total.toFixed(2)} ${currency}\n\n`;
        message += `📍 *Teslimat Bilgileri:*\n`;
        message += `Adres: \n`;
        message += `Not: \n`;

        return message;
    } else {
        let message = `🍽️ *${restaurantName} - New Order*\n\n`;
        message += `📋 *Order Details:*\n`;
        message += `━━━━━━━━━━━━━━━\n`;

        cart.forEach((item) => {
            message += `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} ${currency}\n`;
        });

        message += `━━━━━━━━━━━━━━━\n`;
        message += `💰 *Total:* ${total.toFixed(2)} ${currency}\n\n`;
        message += `📍 *Delivery Info:*\n`;
        message += `Address: \n`;
        message += `Note: \n`;

        return message;
    }
}
