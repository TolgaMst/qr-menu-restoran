"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { CartItem, getCart, addToCart, removeFromCart, deleteFromCart, clearCart, getCartTotal, getCartItemCount, createWhatsAppOrderMessage } from "@/lib/cart";
import { Currency, formatPrice } from "@/lib/currency";
import { Language, getTranslation } from "@/lib/translations";

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    setCart: (cart: CartItem[]) => void;
    currency: Currency;
    language: Language;
    restaurantName: string;
    restaurantPhone: string;
}

export default function CartModal({
    isOpen,
    onClose,
    cart,
    setCart,
    currency,
    language,
    restaurantName,
    restaurantPhone,
}: CartModalProps) {
    const total = getCartTotal(cart);
    const itemCount = getCartItemCount(cart);

    const handleIncrease = (itemId: string) => {
        const item = cart.find((i) => i.id === itemId);
        if (item) {
            const newCart = addToCart(item);
            setCart([...newCart]);
        }
    };

    const handleDecrease = (itemId: string) => {
        const newCart = removeFromCart(itemId);
        setCart([...newCart]);
    };

    const handleDelete = (itemId: string) => {
        const newCart = deleteFromCart(itemId);
        setCart([...newCart]);
    };

    const handleClearCart = () => {
        clearCart();
        setCart([]);
    };

    const handleSendOrder = () => {
        if (cart.length === 0) return;

        const currencySymbol = currency === "TRY" ? "₺" : currency === "USD" ? "$" : "€";
        const message = createWhatsAppOrderMessage(cart, restaurantName, language, total, currencySymbol);
        const phoneNumber = restaurantPhone.replace(/[\s()\-+]/g, "");
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-wood-900 border border-gold-400/30 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl animate-fade-in">
                {/* Header */}
                <div className="bg-wood-800 border-b border-gold-400/30 px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-primary-600 p-2 rounded-lg">
                            <ShoppingCart className="w-5 h-5 text-gold-400" />
                        </div>
                        <h2 className="text-xl font-display font-bold text-cream-100">
                            {language === "tr" ? "Sepetim" : "My Cart"}
                            {itemCount > 0 && (
                                <span className="ml-2 text-sm font-normal text-cream-400">
                                    ({itemCount} {language === "tr" ? "ürün" : "items"})
                                </span>
                            )}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-cream-400 hover:text-cream-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="overflow-y-auto max-h-[40vh] p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="text-center py-8">
                            <ShoppingCart className="w-16 h-16 text-cream-600 mx-auto mb-4" />
                            <p className="text-cream-400 font-body">
                                {language === "tr" ? "Sepetiniz boş" : "Your cart is empty"}
                            </p>
                            <p className="text-cream-500 text-sm mt-2 font-body">
                                {language === "tr"
                                    ? "Menüden ürün ekleyebilirsiniz"
                                    : "Add items from the menu"}
                            </p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="bg-wood-800/60 border border-gold-400/20 rounded-lg p-3 flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <h3 className="font-display font-semibold text-cream-100">
                                        {item.name}
                                    </h3>
                                    <p className="text-gold-400 text-sm font-body">
                                        {formatPrice(item.price, currency)} x {item.quantity}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center bg-wood-700 rounded-lg">
                                        <button
                                            onClick={() => handleDecrease(item.id)}
                                            className="p-2 text-cream-300 hover:text-cream-100 transition"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-3 text-cream-100 font-semibold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleIncrease(item.id)}
                                            className="p-2 text-cream-300 hover:text-cream-100 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-gold-400/30 p-4 space-y-4 bg-wood-800/50">
                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-cream-300 font-body">
                                {language === "tr" ? "Toplam:" : "Total:"}
                            </span>
                            <span className="text-2xl font-display font-bold text-gold-400">
                                {formatPrice(total, currency)}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                            <button
                                onClick={handleClearCart}
                                className="flex-1 py-3 px-4 bg-wood-700 text-cream-300 rounded-lg hover:bg-wood-600 transition font-body"
                            >
                                {language === "tr" ? "Sepeti Temizle" : "Clear Cart"}
                            </button>
                            <button
                                onClick={handleSendOrder}
                                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-500 transition font-semibold flex items-center justify-center space-x-2 shadow-lg"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>{language === "tr" ? "Sipariş Ver" : "Order"}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Sepet Butonu Component'i
interface CartButtonProps {
    cart: CartItem[];
    onClick: () => void;
}

export function CartButton({ cart, onClick }: CartButtonProps) {
    const itemCount = getCartItemCount(cart);

    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-40 bg-primary-600 hover:bg-primary-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-gold-400"
        >
            <ShoppingCart className="w-6 h-6 text-gold-400" />
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-400 text-wood-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                </span>
            )}
        </button>
    );
}
