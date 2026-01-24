// Çalışma saatleri kontrolü

export interface BusinessHours {
    monday: { open: string; close: string; closed?: boolean };
    tuesday: { open: string; close: string; closed?: boolean };
    wednesday: { open: string; close: string; closed?: boolean };
    thursday: { open: string; close: string; closed?: boolean };
    friday: { open: string; close: string; closed?: boolean };
    saturday: { open: string; close: string; closed?: boolean };
    sunday: { open: string; close: string; closed?: boolean };
}

// Varsayılan çalışma saatleri (Mezecim için)
export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
    monday: { open: "12:00", close: "00:00" },
    tuesday: { open: "12:00", close: "00:00" },
    wednesday: { open: "12:00", close: "00:00" },
    thursday: { open: "12:00", close: "00:00" },
    friday: { open: "12:00", close: "01:00" },
    saturday: { open: "12:00", close: "01:00" },
    sunday: { open: "12:00", close: "00:00" },
};

// Gün isimlerini Türkçe'ye çevir
const DAY_NAMES_TR: Record<string, string> = {
    monday: "Pazartesi",
    tuesday: "Salı",
    wednesday: "Çarşamba",
    thursday: "Perşembe",
    friday: "Cuma",
    saturday: "Cumartesi",
    sunday: "Pazar",
};

const DAY_NAMES_EN: Record<string, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
};

// Şu anki günü al (JavaScript: 0 = Pazar, 6 = Cumartesi)
function getCurrentDayKey(): keyof BusinessHours {
    const days: (keyof BusinessHours)[] = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    return days[new Date().getDay()];
}

// Saat string'ini dakikaya çevir
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

// Şu an açık mı kontrol et
export function isCurrentlyOpen(hours: BusinessHours = DEFAULT_BUSINESS_HOURS): boolean {
    const now = new Date();
    const currentDay = getCurrentDayKey();
    const todayHours = hours[currentDay];

    if (todayHours.closed) return false;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = timeToMinutes(todayHours.open);
    let closeMinutes = timeToMinutes(todayHours.close);

    // Gece yarısını geçen kapanış saati (örn: 01:00)
    if (closeMinutes < openMinutes) {
        // Gece yarısından sonra mıyız?
        if (currentMinutes < closeMinutes) {
            return true;
        }
        // Normal açılış saatinden sonra mıyız?
        return currentMinutes >= openMinutes;
    }

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

// Bir sonraki açılış zamanını al
export function getNextOpenTime(
    hours: BusinessHours = DEFAULT_BUSINESS_HOURS,
    language: "tr" | "en" = "tr"
): string {
    const days: (keyof BusinessHours)[] = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    const dayNames = language === "tr" ? DAY_NAMES_TR : DAY_NAMES_EN;

    const now = new Date();
    const currentDayIndex = now.getDay();

    // Bugünden itibaren 7 gün kontrol et
    for (let i = 0; i < 7; i++) {
        const checkIndex = (currentDayIndex + i) % 7;
        const dayKey = days[checkIndex];
        const dayHours = hours[dayKey];

        if (!dayHours.closed) {
            if (i === 0) {
                // Bugün açılacak mı?
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                const openMinutes = timeToMinutes(dayHours.open);

                if (currentMinutes < openMinutes) {
                    return language === "tr"
                        ? `Bugün saat ${dayHours.open}'de açılıyor`
                        : `Opens today at ${dayHours.open}`;
                }
            } else if (i === 1) {
                return language === "tr"
                    ? `Yarın saat ${dayHours.open}'de açılıyor`
                    : `Opens tomorrow at ${dayHours.open}`;
            } else {
                return language === "tr"
                    ? `${dayNames[dayKey]} saat ${dayHours.open}'de açılıyor`
                    : `Opens ${dayNames[dayKey]} at ${dayHours.open}`;
            }
        }
    }

    return language === "tr" ? "Kapalı" : "Closed";
}

// Bugünün çalışma saatlerini al
export function getTodayHours(
    hours: BusinessHours = DEFAULT_BUSINESS_HOURS,
    language: "tr" | "en" = "tr"
): string {
    const currentDay = getCurrentDayKey();
    const todayHours = hours[currentDay];

    if (todayHours.closed) {
        return language === "tr" ? "Bugün kapalı" : "Closed today";
    }

    return `${todayHours.open} - ${todayHours.close}`;
}
