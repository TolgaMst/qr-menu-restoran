"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import { ThemeColors, presetThemes, saveTheme } from "@/lib/theme";
import { Language } from "@/lib/translations";

interface ThemeSelectorProps {
  currentTheme: ThemeColors;
  onThemeChange: (theme: ThemeColors) => void;
  translations: any;
  language: Language;
}

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
  translations,
  language,
}: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customPrimary, setCustomPrimary] = useState(currentTheme.primary);
  const [customSecondary, setCustomSecondary] = useState(currentTheme.secondary);

  const handlePresetSelect = (theme: ThemeColors) => {
    onThemeChange(theme);
    saveTheme(theme);
    setIsOpen(false);
  };

  const handleCustomColorChange = () => {
    const newTheme: ThemeColors = {
      primary: customPrimary,
      secondary: customSecondary,
    };
    onThemeChange(newTheme);
    saveTheme(newTheme);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Palette className="w-4 h-4 inline mr-2" />
          {translations.primaryColor}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presetThemes.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetSelect(preset.colors)}
              className={`p-3 rounded-lg border-2 transition-all ${
                currentTheme.primary === preset.colors.primary
                  ? "border-primary-600 ring-2 ring-primary-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              title={preset.name}
            >
              <div
                className="w-full h-12 rounded mb-2"
                style={{ backgroundColor: preset.colors.primary }}
              />
              <div className="text-xs text-gray-600 truncate">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {translations.selectColor} ({language === "tr" ? "Özel" : "Custom"})
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {translations.primaryColor}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customPrimary}
                onChange={(e) => {
                  setCustomPrimary(e.target.value);
                  handleCustomColorChange();
                }}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={customPrimary}
                onChange={(e) => {
                  setCustomPrimary(e.target.value);
                  const newTheme: ThemeColors = {
                    primary: e.target.value,
                    secondary: customSecondary,
                  };
                  onThemeChange(newTheme);
                  saveTheme(newTheme);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="#0ea5e9"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {translations.secondaryColor}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customSecondary}
                onChange={(e) => {
                  setCustomSecondary(e.target.value);
                  handleCustomColorChange();
                }}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={customSecondary}
                onChange={(e) => {
                  setCustomSecondary(e.target.value);
                  const newTheme: ThemeColors = {
                    primary: customPrimary,
                    secondary: e.target.value,
                  };
                  onThemeChange(newTheme);
                  saveTheme(newTheme);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="#0284c7"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

