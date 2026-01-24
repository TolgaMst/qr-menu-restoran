"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { isCurrentlyOpen, getNextOpenTime, getTodayHours, DEFAULT_BUSINESS_HOURS, BusinessHours } from "@/lib/businessHours";
import { Language } from "@/lib/translations";

interface BusinessStatusProps {
    hours?: BusinessHours;
    language: Language;
    showDetails?: boolean;
}

export default function BusinessStatus({
    hours = DEFAULT_BUSINESS_HOURS,
    language,
    showDetails = true,
}: BusinessStatusProps) {
    const [isOpen, setIsOpen] = useState<boolean | null>(null);
    const [nextOpen, setNextOpen] = useState<string>("");
    const [todayHours, setTodayHours] = useState<string>("");

    useEffect(() => {
        // İlk yükleme
        const updateStatus = () => {
            setIsOpen(isCurrentlyOpen(hours));
            setNextOpen(getNextOpenTime(hours, language));
            setTodayHours(getTodayHours(hours, language));
        };

        updateStatus();

        // Her dakika güncelle
        const interval = setInterval(updateStatus, 60000);
        return () => clearInterval(interval);
    }, [hours, language]);

    // Henüz yüklenmedi
    if (isOpen === null) {
        return (
            <div className="flex items-center space-x-2 text-cream-400">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-body">...</span>
            </div>
        );
    }

    return (
        <div className="vintage-frame bg-wood-900/60 p-4 space-y-2">
            {/* Ana durum */}
            <div className="flex items-center space-x-3">
                {isOpen ? (
                    <>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-green-400 font-display font-bold text-lg">
                            {language === "tr" ? "Şu An Açık" : "Open Now"}
                        </span>
                    </>
                ) : (
                    <>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                            <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-red-400 font-display font-bold text-lg">
                            {language === "tr" ? "Şu An Kapalı" : "Closed Now"}
                        </span>
                    </>
                )}
            </div>

            {/* Detaylar */}
            {showDetails && (
                <div className="space-y-1 pl-5 border-l-2 border-gold-400/30 ml-1">
                    <div className="flex items-center space-x-2 text-cream-300">
                        <Clock className="w-4 h-4 text-gold-400" />
                        <span className="text-sm font-body">
                            {language === "tr" ? "Bugün: " : "Today: "}
                            <span className="text-cream-100">{todayHours}</span>
                        </span>
                    </div>
                    {!isOpen && (
                        <p className="text-sm text-cream-400 font-body">
                            ⏰ {nextOpen}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// Küçük badge versiyonu
interface BusinessStatusBadgeProps {
    hours?: BusinessHours;
    language: Language;
}

export function BusinessStatusBadge({ hours = DEFAULT_BUSINESS_HOURS, language }: BusinessStatusBadgeProps) {
    const [isOpen, setIsOpen] = useState<boolean | null>(null);

    useEffect(() => {
        setIsOpen(isCurrentlyOpen(hours));
        const interval = setInterval(() => setIsOpen(isCurrentlyOpen(hours)), 60000);
        return () => clearInterval(interval);
    }, [hours]);

    if (isOpen === null) return null;

    return (
        <div
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isOpen
                    ? "bg-green-900/50 text-green-400 border border-green-500/30"
                    : "bg-red-900/50 text-red-400 border border-red-500/30"
                }`}
        >
            <div
                className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
            />
            <span>{isOpen ? (language === "tr" ? "Açık" : "Open") : (language === "tr" ? "Kapalı" : "Closed")}</span>
        </div>
    );
}
