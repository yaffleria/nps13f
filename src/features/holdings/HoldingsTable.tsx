"use client";

import { StockPosition } from "@/entities/portfolio/types";
import {
  formatCompactNumber,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/shared/lib/format";
import { ArrowDown, ArrowUp } from "lucide-react";

interface HoldingsTableProps {
  holdings: StockPosition[];
  totalValue: number;
}

export function HoldingsTable({ holdings, totalValue }: HoldingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="bg-background text-secondary">
          <tr>
            <th className="px-6 py-4 font-medium">Ticker</th>
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium text-right">% Portfolio</th>
            <th className="px-6 py-4 font-medium text-right">Shares</th>
            <th className="px-6 py-4 font-medium text-right">Reported Price</th>
            <th className="px-6 py-4 font-medium text-right">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {holdings.map((stock) => {
            const reportedPrice = stock.value / stock.shares;
            const percent = (stock.value / totalValue) * 100;

            return (
              <tr key={stock.cusip} className="group hover:bg-background/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-primary">{stock.symbol}</td>
                <td className="px-6 py-4 font-medium text-foreground max-w-[200px] truncate">
                  {stock.securityName}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-semibold text-foreground">{percent.toFixed(2)}%</span>
                    <div className="h-1.5 w-24 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-foreground font-medium">
                  {formatNumber(stock.shares)}
                </td>
                <td className="px-6 py-4 text-right text-foreground">
                  ${formatNumber(reportedPrice)}
                </td>
                <td className="px-6 py-4 text-right font-bold text-foreground">
                  ${formatCompactNumber(stock.value)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
