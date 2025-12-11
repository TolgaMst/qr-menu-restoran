"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { Language, translations } from "@/lib/translations";

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
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentLanguage === "tr" ? "TR" : "EN"}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <button
              onClick={() => {
                onLanguageChange("tr");
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-lg ${
                currentLanguage === "tr" ? "bg-primary-50 text-primary-600" : ""
              }`}
            >
              🇹🇷 Türkçe
            </button>
            <button
              onClick={() => {
                onLanguageChange("en");
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-lg ${
                currentLanguage === "en" ? "bg-primary-50 text-primary-600" : ""
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



