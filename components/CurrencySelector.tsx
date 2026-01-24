"use client";

import { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import { Currency, currencies, saveCurrency, loadCurrency } from "@/lib/currency";

interface CurrencySelectorProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export default function CurrencySelector({
  currentCurrency,
  onCurrencyChange,
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(currentCurrency);

  useEffect(() => {
    setMounted(true);
    const savedCurrency = loadCurrency();
    setDisplayCurrency(savedCurrency);
    if (savedCurrency !== currentCurrency) {
      onCurrencyChange(savedCurrency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCurrencyChange = (currency: Currency) => {
    setDisplayCurrency(currency);
    onCurrencyChange(currency);
    saveCurrency(currency);
    setIsOpen(false);
  };

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-wood-800 border border-gold-400/30 rounded-lg text-cream-200">
        <DollarSign className="w-4 h-4 text-gold-400" />
        <span className="text-sm font-medium">₺ TRY</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-wood-800 border border-gold-400/30 rounded-lg hover:bg-wood-700 transition text-cream-200"
      >
        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gold-400" />
        <span className="text-xs sm:text-sm font-medium">
          {currencies[displayCurrency].symbol} {displayCurrency}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-wood-900 rounded-lg shadow-lg border border-gold-400/30 z-20">
            {Object.values(currencies).map((currency, index, arr) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-wood-800 text-cream-200 ${displayCurrency === currency.code
                    ? "bg-primary-900/50 text-gold-400"
                    : ""
                  } ${index === 0 ? "rounded-t-lg" : ""} ${index === arr.length - 1 ? "rounded-b-lg" : ""
                  }`}
              >
                {currency.symbol} {currency.code} - {currency.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
