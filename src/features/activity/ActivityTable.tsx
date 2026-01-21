"use client";

import { ActivityItem } from "@/entities/portfolio/types";
import { formatCompactNumber, formatNumber } from "@/shared/lib/format";
import { ArrowDown, ArrowUp, Minus, Plus } from "lucide-react";

interface ActivityTableProps {
  activity: ActivityItem[];
}

export function ActivityTable({ activity }: ActivityTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="bg-background text-secondary">
          <tr>
            <th className="px-6 py-4 font-medium">Type</th>
            <th className="px-6 py-4 font-medium">Ticker</th>
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium text-right">% Change</th>
            <th className="px-6 py-4 font-medium text-right">Shares</th>
            <th className="px-6 py-4 font-medium text-right">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {activity.map((item) => {
            const isBuy = item.sharesChanged > 0;
            const ColorIcon = isBuy ? ArrowUp : ArrowDown;
            const colorClass = isBuy ? "text-success" : "text-negative";
            const bgColorClass = isBuy ? "bg-success/10" : "bg-negative/10";
            const Label = isBuy ? "BUY" : "SELL";

            return (
              <tr key={item.symbol} className="group hover:bg-background/50 transition-colors">
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold ${colorClass} ${bgColorClass}`}
                  >
                    {Label}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-primary">{item.symbol}</td>
                <td className="px-6 py-4 font-medium text-foreground max-w-[200px] truncate">
                  {item.name}
                </td>
                <td className={`px-6 py-4 text-right font-medium ${colorClass}`}>
                  {item.percentChange > 0 ? "+" : ""}
                  {item.percentChange.toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right text-foreground">
                  {formatNumber(item.sharesChanged)}
                </td>
                <td className="px-6 py-4 text-right font-bold text-foreground">
                  ${formatCompactNumber(Math.abs(item.value))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
