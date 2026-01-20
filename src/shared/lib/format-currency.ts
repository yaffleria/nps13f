import { useCurrencyStore } from "../model/use-currency-store";

export function useFormatCurrency() {
  const { currency, exchangeRate } = useCurrencyStore();

  const formatCurrency = (valueInUSD: number) => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(valueInUSD);
    } else {
      const valueInKRW = valueInUSD * exchangeRate;

      // Korean specific formatting
      if (valueInKRW >= 1000000000000) {
        // 1 Trillion
        const trillions = valueInKRW / 1000000000000;
        return `${trillions.toFixed(1)}조 원`;
      } else if (valueInKRW >= 100000000) {
        // 100 Million
        const billions = valueInKRW / 100000000;
        return `${billions.toFixed(0)}억 원`;
      } else {
        return new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
        }).format(valueInKRW);
      }
    }
  };

  return { formatCurrency };
}
