"use client";

import { useState } from "react";
import Link from "next/link";
import { StockPosition, PortfolioQuarter } from "@/entities/portfolio/types";
import { formatCompactNumber, formatNumber } from "@/shared/lib/format";
import { ChevronUp, ChevronDown, ChevronsUpDown, History } from "lucide-react";
import { Modal } from "@/shared/ui/Modal";
import { StockHistoryChart } from "@/shared/ui/charts/StockHistoryChart";
import { useStockCalculations, EnrichedStock } from "./hooks/useStockCalculations";
import { useSortableTable, SortField, SortState } from "./hooks/useSortableTable";

interface SortableHoldingsTableProps {
  holdings: StockPosition[];
  totalValue: number;
  previousQuarterHoldings?: StockPosition[];
  quarters?: PortfolioQuarter[];
}

const SortIcon = ({ field, currentSort }: { field: SortField; currentSort: SortState }) => {
  if (currentSort.field !== field) {
    return <ChevronsUpDown className="w-4 h-4 text-muted opacity-50" />;
  }
  return currentSort.direction === "desc" ? (
    <ChevronDown className="w-4 h-4 text-primary" />
  ) : (
    <ChevronUp className="w-4 h-4 text-primary" />
  );
};

interface SortableHeaderProps {
  field: SortField;
  children: React.ReactNode;
  align?: "left" | "right";
  currentSort: SortState;
  onSort: (field: SortField) => void;
}

const SortableHeader = ({
  field,
  children,
  align = "left",
  currentSort,
  onSort,
}: SortableHeaderProps) => (
  <th
    className={`px-4 py-3 font-medium cursor-pointer hover:bg-background/80 transition-colors select-none ${
      align === "right" ? "text-right" : "text-left"
    } ${currentSort.field === field ? "text-primary" : ""}`}
    onClick={() => onSort(field)}
  >
    <div
      className={`flex items-center gap-1 ${align === "right" ? "justify-end" : "justify-start"}`}
    >
      {children}
      <SortIcon field={field} currentSort={currentSort} />
    </div>
  </th>
);

export function SortableHoldingsTable({
  holdings,
  totalValue,
  previousQuarterHoldings,
  quarters,
}: SortableHoldingsTableProps) {
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; name: string } | null>(null);

  const enrichedHoldings = useStockCalculations({
    holdings,
    totalValue,
    previousQuarterHoldings,
  });

  const sortFn = (a: EnrichedStock, b: EnrichedStock, field: SortField): number => {
    switch (field) {
      case "symbol":
        return a.symbol.localeCompare(b.symbol);
      case "name":
        return a.securityName.localeCompare(b.securityName);
      case "percent":
        return a.percent - b.percent;
      case "shares":
        return a.shares - b.shares;
      case "price":
        return a.reportedPrice - b.reportedPrice;
      case "value":
        return a.value - b.value;
      case "change":
        return a.portfolioChange - b.portfolioChange;
      default:
        return 0;
    }
  };

  const {
    sortedData: sortedHoldings,
    paginatedData: paginatedHoldings,
    currentPage,
    totalPages,
    itemsPerPage,
    sort,
    setCurrentPage,
    setItemsPerPage,
    handleSort,
  } = useSortableTable({
    data: enrichedHoldings,
    sortFn,
  });

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-background/80 text-secondary border-b border-border">
            <tr>
              <SortableHeader field="symbol" currentSort={sort} onSort={handleSort}>
                티커
              </SortableHeader>
              <SortableHeader field="name" currentSort={sort} onSort={handleSort}>
                종목명
              </SortableHeader>
              <SortableHeader field="percent" align="right" currentSort={sort} onSort={handleSort}>
                비중
              </SortableHeader>
              <SortableHeader field="shares" align="right" currentSort={sort} onSort={handleSort}>
                보유 수량*
              </SortableHeader>
              <SortableHeader field="price" align="right" currentSort={sort} onSort={handleSort}>
                공시 가격*
              </SortableHeader>
              <SortableHeader field="value" align="right" currentSort={sort} onSort={handleSort}>
                평가액
              </SortableHeader>
              {previousQuarterHoldings && (
                <SortableHeader field="change" align="right" currentSort={sort} onSort={handleSort}>
                  비중 변동
                </SortableHeader>
              )}
              <th className="px-4 py-3 font-medium">
                <div className="flex items-center justify-center gap-1">보유 이력</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedHoldings.map((stock) => {
              const changeColor =
                stock.portfolioChange > 0
                  ? "text-success"
                  : stock.portfolioChange < 0
                    ? "text-negative"
                    : "text-secondary";

              return (
                <tr key={stock.cusip} className="group hover:bg-background/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-primary">
                    <Link href={`/stocks/${stock.symbol}`} className="hover:underline">
                      {stock.symbol}
                    </Link>
                    {stock.isNew && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-success/20 text-success rounded">
                        신규
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium text-foreground max-w-50 truncate">
                    {stock.securityName}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-semibold text-foreground">
                        {stock.percent.toFixed(2)}%
                      </span>
                      <div className="h-1.5 w-20 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-primary to-accent rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(stock.percent * 5, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    {formatNumber(stock.shares)}
                  </td>

                  <td className="px-4 py-3 text-right text-foreground">
                    ${formatNumber(stock.reportedPrice)}
                  </td>

                  <td className="px-4 py-3 text-right font-bold text-foreground">
                    ${formatCompactNumber(stock.value)}
                  </td>

                  {previousQuarterHoldings && (
                    <td className={`px-4 py-3 text-right font-medium ${changeColor}`}>
                      {stock.portfolioChange > 0 ? "+" : ""}
                      {stock.portfolioChange.toFixed(2)}%
                    </td>
                  )}

                  <td className="px-4 py-3 text-center">
                    <button
                      className={`p-1.5 rounded-lg transition-colors ${
                        quarters && quarters.length > 1
                          ? "hover:bg-primary/10 text-secondary hover:text-primary cursor-pointer"
                          : "text-muted cursor-not-allowed opacity-30"
                      }`}
                      title="이력 보기"
                      onClick={() => {
                        if (quarters && quarters.length > 1) {
                          setSelectedStock({ symbol: stock.symbol, name: stock.securityName });
                        }
                      }}
                      disabled={!quarters || quarters.length <= 1}
                    >
                      <History className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 text-sm text-secondary">
        <div>
          {sortedHoldings.length > 0 && (
            <span>
              {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, sortedHoldings.length)} / 총{" "}
              {sortedHoldings.length}개
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>페이지당</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
              }}
              className="bg-surface border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            <span className="px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {selectedStock && quarters && (
        <Modal
          isOpen={!!selectedStock}
          onClose={() => setSelectedStock(null)}
          title={`${selectedStock.symbol} 보유 이력`}
          size="lg"
        >
          <StockHistoryChart
            symbol={selectedStock.symbol}
            securityName={selectedStock.name}
            quarters={quarters}
          />
        </Modal>
      )}
    </div>
  );
}
