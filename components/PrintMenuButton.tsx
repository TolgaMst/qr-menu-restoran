"use client";

import { Printer } from "lucide-react";
import { Language } from "@/lib/translations";
import { Currency, formatPrice } from "@/lib/currency";

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

interface PrintMenuButtonProps {
    categories: Category[];
    restaurantName: string;
    language: Language;
    currency: Currency;
}

export default function PrintMenuButton({
    categories,
    restaurantName,
    language,
    currency,
}: PrintMenuButtonProps) {
    const handlePrint = () => {
        const currencySymbol = currency === "TRY" ? "₺" : currency === "USD" ? "$" : "€";

        // Menü HTML'i oluştur
        let menuHtml = "";
        categories.forEach((category) => {
            menuHtml += `
        <div class="category">
          <h2>${category.name}</h2>
          <div class="items">
            ${category.items
                    .map(
                        (item) => `
              <div class="item">
                <div class="item-header">
                  <span class="item-name">${item.name}</span>
                  <span class="item-price">${currencySymbol}${item.price.toFixed(2)}</span>
                </div>
                ${item.description ? `<p class="item-desc">${item.description}</p>` : ""}
              </div>
            `
                    )
                    .join("")}
          </div>
        </div>
      `;
        });

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${restaurantName} - ${language === "tr" ? "Menü" : "Menu"}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;500&display=swap');
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Lora', serif;
                background: #fff;
                color: #333;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
              }
              
              .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #8B0000;
              }
              
              .header h1 {
                font-family: 'Playfair Display', serif;
                font-size: 36px;
                color: #8B0000;
                margin-bottom: 5px;
              }
              
              .header .decorative {
                color: #D4AF37;
                font-size: 18px;
              }
              
              .category {
                margin-bottom: 25px;
                page-break-inside: avoid;
              }
              
              .category h2 {
                font-family: 'Playfair Display', serif;
                font-size: 22px;
                color: #8B0000;
                padding: 10px 0;
                margin-bottom: 15px;
                border-bottom: 1px solid #D4AF37;
                display: flex;
                align-items: center;
              }
              
              .category h2::before {
                content: '✦';
                color: #D4AF37;
                margin-right: 10px;
              }
              
              .items {
                display: flex;
                flex-direction: column;
                gap: 12px;
              }
              
              .item {
                padding: 8px 0;
                border-bottom: 1px dotted #ccc;
              }
              
              .item:last-child {
                border-bottom: none;
              }
              
              .item-header {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
              }
              
              .item-name {
                font-weight: 600;
                font-size: 16px;
                color: #333;
              }
              
              .item-price {
                font-family: 'Playfair Display', serif;
                font-weight: 700;
                font-size: 16px;
                color: #8B0000;
                white-space: nowrap;
                margin-left: 10px;
              }
              
              .item-desc {
                font-size: 13px;
                color: #666;
                margin-top: 4px;
                font-style: italic;
              }
              
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #8B0000;
                text-align: center;
              }
              
              .footer p {
                font-size: 12px;
                color: #888;
              }
              
              @media print {
                body {
                  padding: 0;
                }
                
                .category {
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${restaurantName}</h1>
              <p class="decorative">✦ ${language === "tr" ? "Menü" : "Menu"} ✦</p>
            </div>
            
            ${menuHtml}
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${restaurantName}</p>
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

    return (
        <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-wood-800 hover:bg-wood-700 border border-gold-400/30 rounded-lg text-cream-200 transition font-body text-sm"
        >
            <Printer className="w-4 h-4 text-gold-400" />
            <span>{language === "tr" ? "Menüyü Yazdır" : "Print Menu"}</span>
        </button>
    );
}
