"use client";

import { Filing13F } from "@/shared/model/types";
import { useFormatCurrency } from "@/shared/lib/format-currency";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowUp, ArrowDown, ExternalLink, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  holdings: Filing13F[];
  prevHoldingsMap: Record<string, Filing13F>;
  filter: string;
  onSelect: (symbol: string) => void;
}

export function MainList({
  holdings,
  prevHoldingsMap,
  filter,
  onSelect,
}: Props) {
  const { formatCurrency } = useFormatCurrency();

  // Filter holdings
  const filteredHoldings = holdings.filter(
    (h) =>
      h.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      h.securityName.toLowerCase().includes(filter.toLowerCase()),
  );

  // Pagination for MVP (show top 50, or load more)
  // For now show all filtered, or top 50
  const displayedHoldings = filteredHoldings.slice(0, 50);

  // Get symbols to fetch prices
  const symbolsToFetch = displayedHoldings.map((h) => h.symbol).join(",");

  const { data: prices } = useQuery({
    queryKey: ["prices", symbolsToFetch],
    queryFn: async () => {
      if (!symbolsToFetch) return {};
      const res = await axios.get(`/api/quote?symbols=${symbolsToFetch}`);
      return res.data as Record<string, number>;
    },
    enabled: !!symbolsToFetch,
    staleTime: 60 * 1000, // 1 min
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          보유 종목
        </h2>
        <span className="text-sm text-gray-400">
          {filteredHoldings.length}개 종목
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {displayedHoldings.map((h, index) => {
          const prev = prevHoldingsMap[h.cusip];
          const shareChange = prev
            ? ((h.shares - prev.shares) / prev.shares) * 100
            : 100; // 100% if new
          const npsPrice = h.value / h.shares; // Calculated price from 13F
          const currentPrice = prices?.[h.symbol];

          let priceDiffPercent = 0;
          if (currentPrice) {
            priceDiffPercent = ((currentPrice - npsPrice) / npsPrice) * 100;
          }

          return (
            <motion.div
              key={h.cusip}
              layoutId={h.cusip}
              onClick={() => onSelect(h.symbol)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow relative cursor-pointer"
            >
              {/* Rank and Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-500">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg leading-none">
                      {h.symbol}
                    </h3>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                      {h.securityName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(h.value)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(h.shares / 1000).toFixed(0)}K shares
                  </p>
                </div>
              </div>

              {/* NPS vs Current Price Bar */}
              <div className="mb-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">NPS 평단(추정)</span>
                  <span className="text-gray-500">현재가</span>
                </div>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    ${npsPrice.toFixed(2)}
                  </span>
                  <span
                    className={`font-bold ${!currentPrice ? "text-gray-400" : priceDiffPercent >= 0 ? "text-red-500" : "text-green-500"}`}
                  >
                    {currentPrice ? (
                      `$${currentPrice.toFixed(2)}`
                    ) : (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    )}
                  </span>
                </div>

                {currentPrice && (
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    {/* 
                        Visualizing logic: 
                        Center is 0%. Left is cheaper (Green), Right is expensive (Red).
                        We'll simplify: just a progress bar showing relative gain.
                        If percent is +30%, fill 80% with Red.
                        If -10%, fill 40% with Green.
                     */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${priceDiffPercent >= 0 ? "bg-red-500" : "bg-green-500"}`}
                      style={{
                        width: `${Math.min(Math.max(50 + priceDiffPercent, 0), 100)}%`,
                      }} // Very rough logic
                    />
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black/20 dark:bg-white/20" />
                  </div>
                )}

                {currentPrice && (
                  <div className="mt-1 text-center">
                    <span
                      className={`text-xs font-bold ${priceDiffPercent < 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {priceDiffPercent < 0
                        ? `🔥 ${Math.abs(priceDiffPercent).toFixed(1)}% 할인`
                        : `📈 +${priceDiffPercent.toFixed(1)}% 이익`}
                    </span>
                  </div>
                )}
              </div>

              {/* Changes */}
              <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center text-gray-500">
                  <span className="mr-2">지분 변동</span>
                </div>
                <div
                  className={`flex items-center font-medium ${shareChange > 0 ? "text-green-500" : shareChange < 0 ? "text-red-500" : "text-gray-400"}`}
                >
                  {shareChange > 0 ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : shareChange < 0 ? (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  ) : null}
                  {Math.abs(shareChange).toFixed(1)}%
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
