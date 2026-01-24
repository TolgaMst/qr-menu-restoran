"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Language } from "@/lib/translations";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-wood-800 border border-gold-400/30 rounded-lg hover:bg-wood-700 transition text-cream-200"
      >
        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gold-400" />
        <span className="text-xs sm:text-sm font-medium">
          {currentLanguage === "tr" ? "TR" : "EN"}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-wood-900 rounded-lg shadow-lg border border-gold-400/30 z-20">
            <button
              onClick={() => {
                onLanguageChange("tr");
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-wood-800 rounded-t-lg text-cream-200 ${currentLanguage === "tr" ? "bg-primary-900/50 text-gold-400" : ""
                }`}
            >
              🇹🇷 Türkçe
            </button>
            <button
              onClick={() => {
                onLanguageChange("en");
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-wood-800 rounded-b-lg text-cream-200 ${currentLanguage === "en" ? "bg-primary-900/50 text-gold-400" : ""
                }`}
            >
              🇬🇧 English
            </button>
          </div>
        </>
      )}
    </div>
  );
}
