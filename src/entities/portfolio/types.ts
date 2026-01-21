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
  sharesChanged: number; // + for buy, - for sell
  percentChange: number; // vs previous quarter holdings
  reportedPrice: number;
  value: number; // estimated value of trade
  portfolioImpact: number; // % of total portfolio
  history: "buy" | "sell" | "hold" | "new" | "exit";
  stock: StockPosition;
}
