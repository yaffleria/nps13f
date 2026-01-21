"use client";

import { useState, useMemo } from "react";
import { ActivityItem } from "@/entities/portfolio/types";
import { formatCompactNumber, formatNumber } from "@/shared/lib/format";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  TrendingUp,
  TrendingDown,
  Plus,
  X,
} from "lucide-react";

interface SortableActivityTableProps {
  activity: ActivityItem[];
}

type SortField = "type" | "symbol" | "name" | "change" | "shares" | "value";
type SortDirection = "asc" | "desc";

interface SortState {
  field: SortField;
  direction: SortDirection;
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

const getActivityTypeLabel = (item: ActivityItem) => {
  if (item.history === "new") return { label: "신규 편입", color: "bg-success/20 text-success" };
  if (item.history === "exit") return { label: "전량 매도", color: "bg-negative/20 text-negative" };
  if (item.sharesChanged > 0) return { label: "매수", color: "bg-success/20 text-success" };
  return { label: "매도", color: "bg-negative/20 text-negative" };
};

const getActivityIcon = (item: ActivityItem) => {
  if (item.history === "new") return <Plus className="w-3 h-3" />;
  if (item.history === "exit") return <X className="w-3 h-3" />;
  if (item.sharesChanged > 0) return <TrendingUp className="w-3 h-3" />;
  return <TrendingDown className="w-3 h-3" />;
};

export function SortableActivityTable({ activity }: SortableActivityTableProps) {
  const [sort, setSort] = useState<SortState>({ field: "value", direction: "desc" });
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "buy" | "sell">("all");
  const filteredActivity = useMemo(() => {
    if (filter === "all") return activity;
    if (filter === "buy") return activity.filter((a) => a.sharesChanged > 0);
    return activity.filter((a) => a.sharesChanged < 0);
  }, [activity, filter]);
  const sortedActivity = useMemo(() => {
    return [...filteredActivity].sort((a, b) => {
      let compareResult = 0;
      switch (sort.field) {
        case "type":
          compareResult = (a.sharesChanged > 0 ? 1 : 0) - (b.sharesChanged > 0 ? 1 : 0);
          break;
        case "symbol":
          compareResult = a.symbol.localeCompare(b.symbol);
          break;
        case "name":
          compareResult = a.name.localeCompare(b.name);
          break;
        case "change":
          compareResult = a.percentChange - b.percentChange;
          break;
        case "shares":
          compareResult = Math.abs(a.sharesChanged) - Math.abs(b.sharesChanged);
          break;
        case "value":
          compareResult = Math.abs(a.value) - Math.abs(b.value);
          break;
        default:
          compareResult = 0;
      }
      return sort.direction === "asc" ? compareResult : -compareResult;
    });
  }, [filteredActivity, sort]);
  const totalPages = Math.ceil(sortedActivity.length / itemsPerPage);
  const paginatedActivity = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedActivity.slice(start, start + itemsPerPage);
  }, [sortedActivity, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      
      <div className="flex items-center gap-2">
        {(["all", "buy", "sell"] as const).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-surface text-secondary hover:bg-background hover:text-foreground"
            }`}
          >
            {f === "all" && "전체"}
            {f === "buy" && (
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> 매수
              </span>
            )}
            {f === "sell" && (
              <span className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" /> 매도
              </span>
            )}
          </button>
        ))}
        <span className="text-secondary text-sm ml-2">{filteredActivity.length}건</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-background/80 text-secondary border-b border-border">
            <tr>
              <SortableHeader field="type" currentSort={sort} onSort={handleSort}>
                유형
              </SortableHeader>
              <SortableHeader field="symbol" currentSort={sort} onSort={handleSort}>
                티커
              </SortableHeader>
              <SortableHeader field="name" currentSort={sort} onSort={handleSort}>
                종목명
              </SortableHeader>
              <SortableHeader field="change" align="right" currentSort={sort} onSort={handleSort}>
                수량 변동률
              </SortableHeader>
              <SortableHeader field="shares" align="right" currentSort={sort} onSort={handleSort}>
                변동 수량
              </SortableHeader>
              <SortableHeader field="value" align="right" currentSort={sort} onSort={handleSort}>
                추정 금액
              </SortableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedActivity.map((item) => {
              const typeInfo = getActivityTypeLabel(item);
              const isBuy = item.sharesChanged > 0;
              const changeColor = isBuy ? "text-success" : "text-negative";

              return (
                <tr
                  key={`${item.symbol}-${item.history}`}
                  className="group hover:bg-background/50 transition-colors"
                >
                  
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${typeInfo.color}`}
                    >
                      {getActivityIcon(item)}
                      {typeInfo.label}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-semibold text-primary">{item.symbol}</td>

                  <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">
                    {item.name}
                  </td>

                  <td className={`px-4 py-3 text-right font-medium ${changeColor}`}>
                    {item.percentChange > 0 ? "+" : ""}
                    {item.percentChange === 100
                      ? "신규"
                      : item.percentChange === -100
                        ? "전량"
                        : `${item.percentChange.toFixed(2)}%`}
                  </td>

                  <td className={`px-4 py-3 text-right font-medium ${changeColor}`}>
                    {isBuy ? "+" : ""}
                    {formatNumber(item.sharesChanged)}
                  </td>

                  <td className="px-4 py-3 text-right font-bold text-foreground">
                    ${formatCompactNumber(Math.abs(item.value))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-secondary">
        <div>
          {sortedActivity.length > 0 && (
            <span>
              {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, sortedActivity.length)} / 총{" "}
              {sortedActivity.length}건
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
                setCurrentPage(1);
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
    </div>
  );
}
