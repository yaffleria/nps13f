import { create } from "zustand";

interface CurrencyState {
  currency: "KRW" | "USD";
  exchangeRate: number;
  toggleCurrency: () => void;
  setExchangeRate: (rate: number) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: "KRW",
  exchangeRate: 1450, // Default fixed rate
  toggleCurrency: () =>
    set((state) => ({ currency: state.currency === "KRW" ? "USD" : "KRW" })),
  setExchangeRate: (rate: number) => set({ exchangeRate: rate }),
}));
