export type Currency = "TRY" | "USD" | "EUR";

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  rate: number; // TRY'ye göre kur
}

export const currencies: Record<Currency, CurrencyInfo> = {
  TRY: {
    code: "TRY",
    symbol: "₺",
    name: "Türk Lirası",
    rate: 1,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 0.034, // Örnek kur (1 TRY = 0.034 USD)
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.031, // Örnek kur (1 TRY = 0.031 EUR)
  },
};

export const formatPrice = (price: number, currency: Currency): string => {
  const currencyInfo = currencies[currency];
  const convertedPrice = price * currencyInfo.rate;

  if (currency === "TRY") {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(convertedPrice);
  } else if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(convertedPrice);
  } else if (currency === "EUR") {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(convertedPrice);
  }

  return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
};

export const saveCurrency = (currency: Currency) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("selectedCurrency", currency);
  }
};

export const loadCurrency = (): Currency => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("selectedCurrency") as Currency;
    if (saved && (saved === "TRY" || saved === "USD" || saved === "EUR")) {
      return saved;
    }
  }
  return "TRY";
};



