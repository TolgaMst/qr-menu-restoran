"use client";

import { useState } from "react";
import { QrCode, Download, Share2, Printer, X, CheckCircle } from "lucide-react";
import { Language } from "@/lib/translations";

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurantName: string;
    menuUrl: string;
    language: Language;
}

export default function QRCodeModal({
    isOpen,
    onClose,
    restaurantName,
    menuUrl,
    language,
}: QRCodeModalProps) {
    const [copied, setCopied] = useState(false);
    const [selectedSize, setSelectedSize] = useState<"small" | "medium" | "large">("medium");

    const sizes = {
        small: { value: 150, label: language === "tr" ? "Küçük" : "Small" },
        medium: { value: 250, label: language === "tr" ? "Orta" : "Medium" },
        large: { value: 400, label: language === "tr" ? "Büyük" : "Large" },
    };

    // QR kod URL'si (Google Charts API kullanarak)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${sizes[selectedSize].value}x${sizes[selectedSize].value}&data=${encodeURIComponent(menuUrl)}&bgcolor=1a0f0a&color=D4AF37&margin=10`;

    const handleDownload = async () => {
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${restaurantName.replace(/\s+/g, "_")}_QR_Menu.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("QR kod indirilemedi:", error);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${restaurantName} - QR Menü`,
                    text: language === "tr"
                        ? `${restaurantName} menüsüne QR kod ile ulaşabilirsiniz!`
                        : `Access ${restaurantName} menu with QR code!`,
                    url: menuUrl,
                });
            } catch (error) {
                // Kullanıcı paylaşımı iptal etti
            }
        } else {
            // Fallback: URL'yi kopyala
            await navigator.clipboard.writeText(menuUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${restaurantName} - QR Menü</title>
            <style>
              body {
                font-family: 'Georgia', serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                background: #fff;
              }
              .container {
                text-align: center;
                padding: 40px;
                border: 3px solid #8B0000;
                border-radius: 20px;
                max-width: 400px;
              }
              h1 {
                color: #8B0000;
                font-size: 28px;
                margin-bottom: 10px;
              }
              p {
                color: #666;
                margin-bottom: 20px;
              }
              img {
                border: 2px solid #D4AF37;
                border-radius: 10px;
                padding: 10px;
                background: #1a0f0a;
              }
              .url {
                margin-top: 20px;
                font-size: 14px;
                color: #8B0000;
                word-break: break-all;
              }
              .decorative {
                color: #D4AF37;
                font-size: 20px;
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${restaurantName}</h1>
              <p class="decorative">✦ QR Menü ✦</p>
              <p>${language === "tr" ? "Menüyü görmek için QR kodu okutun" : "Scan QR code to view menu"}</p>
              <img src="${qrUrl}" alt="QR Code" />
              <p class="url">${menuUrl}</p>
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
            printWindow.document.close();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-wood-900 border border-gold-400/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in mx-4">
                {/* Header */}
                <div className="bg-wood-800 border-b border-gold-400/30 px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-primary-600 p-2 rounded-lg">
                            <QrCode className="w-5 h-5 text-gold-400" />
                        </div>
                        <h2 className="text-xl font-display font-bold text-cream-100">
                            {language === "tr" ? "QR Kod" : "QR Code"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-cream-400 hover:text-cream-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Size Selector */}
                    <div className="flex justify-center space-x-2">
                        {(Object.keys(sizes) as Array<keyof typeof sizes>).map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-4 py-2 rounded-lg font-body text-sm transition ${selectedSize === size
                                        ? "bg-primary-600 text-cream-100 border border-gold-400"
                                        : "bg-wood-800 text-cream-400 border border-gold-400/30 hover:border-gold-400/60"
                                    }`}
                            >
                                {sizes[size].label}
                            </button>
                        ))}
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center">
                        <div className="bg-wood-950 p-4 rounded-xl border-2 border-gold-400">
                            <img
                                src={qrUrl}
                                alt="QR Code"
                                className="rounded-lg"
                                style={{ width: sizes[selectedSize].value, height: sizes[selectedSize].value }}
                            />
                        </div>
                    </div>

                    {/* URL */}
                    <div className="text-center">
                        <p className="text-cream-400 text-sm font-body break-all">{menuUrl}</p>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex flex-col items-center space-y-2 p-3 bg-wood-800 hover:bg-wood-700 rounded-lg border border-gold-400/30 transition"
                        >
                            <Download className="w-6 h-6 text-gold-400" />
                            <span className="text-xs text-cream-300 font-body">
                                {language === "tr" ? "İndir" : "Download"}
                            </span>
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex flex-col items-center space-y-2 p-3 bg-wood-800 hover:bg-wood-700 rounded-lg border border-gold-400/30 transition relative"
                        >
                            {copied ? (
                                <CheckCircle className="w-6 h-6 text-green-400" />
                            ) : (
                                <Share2 className="w-6 h-6 text-gold-400" />
                            )}
                            <span className="text-xs text-cream-300 font-body">
                                {copied
                                    ? language === "tr"
                                        ? "Kopyalandı!"
                                        : "Copied!"
                                    : language === "tr"
                                        ? "Paylaş"
                                        : "Share"}
                            </span>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex flex-col items-center space-y-2 p-3 bg-wood-800 hover:bg-wood-700 rounded-lg border border-gold-400/30 transition"
                        >
                            <Printer className="w-6 h-6 text-gold-400" />
                            <span className="text-xs text-cream-300 font-body">
                                {language === "tr" ? "Yazdır" : "Print"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
