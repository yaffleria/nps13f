export interface StockPosition {
  symbol: string;
  securityName: string;
  cusip: string;
  shares: number;
  value: number;
  sector: string;
  putCallShare: string;
}

export interface PortfolioQuarter {
  date: string;
  year: number;
  quarter: number;
  totalValue: number;
  holdings: StockPosition[];
}

export interface ActivityItem {
  symbol: string;
  name: string;
  sharesChanged: number;
  percentChange: number;
  reportedPrice: number;
  value: number;
  portfolioImpact: number;
  history: "buy" | "sell" | "hold" | "new" | "exit";
  stock: StockPosition;
}
