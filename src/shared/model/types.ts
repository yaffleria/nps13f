export interface Filing13F {
  symbol: string;
  securityName: string;
  sector?: string;
  cusip: string;
  shares: number;
  value: number; // in USD
  putCallShare: "PUT" | "CALL" | "SHARE" | null;
  investmentDiscretion: string;
  votingAuthority: {
    sole: number;
    shared: number;
    none: number;
  };
}

export interface FilingPeriod {
  date: string;
  year: number;
  quarter: number;
  totalValue: number;
  holdings: Filing13F[];
}
