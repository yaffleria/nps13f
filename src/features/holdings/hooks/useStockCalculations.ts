import { useMemo } from "react";
import { StockPosition } from "@/entities/portfolio/types";

export interface EnrichedStock extends StockPosition {
  value: number;
  reportedPrice: number;
  percent: number;
  sharesChange: number;
  portfolioChange: number;
  isNew: boolean;
}

export interface UseStockCalculationsParams {
  holdings: StockPosition[];
  totalValue: number;
  previousQuarterHoldings?: StockPosition[];
}

export function useStockCalculations({
  holdings,
  totalValue,
  previousQuarterHoldings,
}: UseStockCalculationsParams): EnrichedStock[] {
  const prevHoldingsMap = useMemo(() => {
    if (!previousQuarterHoldings) return new Map<string, StockPosition>();
    return new Map(previousQuarterHoldings.map((h) => [h.cusip, h]));
  }, [previousQuarterHoldings]);

  const enrichedHoldings = useMemo(() => {
    return holdings.map((stock) => {
      const actualValue = stock.value / 1000;
      const reportedPrice = actualValue / stock.shares;
      const percent = (stock.value / totalValue) * 100;
      const prevStock = prevHoldingsMap.get(stock.cusip);
      const prevShares = prevStock?.shares || 0;
      const sharesChange = prevStock ? stock.shares - prevShares : stock.shares;
      const portfolioChange = prevStock
        ? (stock.value / totalValue) * 100 - (prevStock.value / totalValue) * 100
        : (stock.value / totalValue) * 100;

      return {
        ...stock,
        value: actualValue,
        reportedPrice,
        percent,
        sharesChange,
        portfolioChange,
        isNew: !prevStock,
      };
    });
  }, [holdings, totalValue, prevHoldingsMap]);

  return enrichedHoldings;
}
