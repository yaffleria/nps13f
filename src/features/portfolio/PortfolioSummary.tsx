import { formatCompactNumber } from "@/shared/lib/format";

interface PortfolioSummaryProps {
  totalValue: number;
  period: string;
  count: number;
  updateDate: string;
}

export function PortfolioSummary({ totalValue, period, count, updateDate }: PortfolioSummaryProps) {
  return (
    <div className="rounded-2xl bg-surface border border-border p-6 shadow-sm mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <div className="text-secondary text-xs sm:text-sm font-medium mb-1">Portfolio Value</div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            ${formatCompactNumber(totalValue)}
          </div>
        </div>
        <div>
          <div className="text-secondary text-xs sm:text-sm font-medium mb-1">Period</div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">{period}</div>
        </div>
        <div>
          <div className="text-secondary text-xs sm:text-sm font-medium mb-1">Holdings</div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">{count}</div>
        </div>
        <div>
          <div className="text-secondary text-xs sm:text-sm font-medium mb-1">Last Update</div>
          <div className="text-lg sm:text-xl font-medium text-foreground">{updateDate}</div>
        </div>
      </div>
    </div>
  );
}
