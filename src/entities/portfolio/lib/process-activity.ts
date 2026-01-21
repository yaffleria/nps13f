import { PortfolioQuarter, ActivityItem, StockPosition } from "../types";

export function processActivity(
  current: PortfolioQuarter,
  previous: PortfolioQuarter | undefined,
): ActivityItem[] {
  if (!previous) return [];

  const activity: ActivityItem[] = [];
  const prevMap = new Map<string, StockPosition>(previous.holdings.map((h) => [h.cusip, h]));

  // Check current holdings against previous
  current.holdings.forEach((curr) => {
    const prev = prevMap.get(curr.cusip);

    if (!prev) {
      // New Position
      activity.push({
        symbol: curr.symbol,
        name: curr.securityName,
        sharesChanged: curr.shares,
        percentChange: 100,
        reportedPrice: curr.value / curr.shares,
        value: curr.value,
        portfolioImpact: (curr.value / current.totalValue) * 100, // Impact on NEW portfolio
        history: "new",
        stock: curr,
      });
    } else if (curr.shares !== prev.shares) {
      // Change
      const diff = curr.shares - prev.shares;
      const pctChange = (diff / prev.shares) * 100;
      activity.push({
        symbol: curr.symbol,
        name: curr.securityName,
        sharesChanged: diff,
        percentChange: pctChange, // Share count change %
        reportedPrice: curr.value / curr.shares,
        value: diff * (curr.value / curr.shares), // Approximate value of trade
        portfolioImpact: (Math.abs(diff * (curr.value / curr.shares)) / previous.totalValue) * 100, // Impact relative to old portfolio size roughly
        history: diff > 0 ? "buy" : "sell",
        stock: curr,
      });
    }
    // Remove processed from map
    prevMap.delete(curr.cusip);
  });

  // Check for exits (remaining in prevMap)
  prevMap.forEach((prev) => {
    activity.push({
      symbol: prev.symbol,
      name: prev.securityName,
      sharesChanged: -prev.shares,
      percentChange: -100,
      reportedPrice: prev.value / prev.shares, // Last known price
      value: prev.value,
      portfolioImpact: (prev.value / previous.totalValue) * 100,
      history: "exit",
      stock: prev,
    });
  });

  // Sort by impact (absolute value of trade)
  return activity.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
}
