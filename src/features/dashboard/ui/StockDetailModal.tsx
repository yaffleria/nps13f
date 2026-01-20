"use client";

import { FilingPeriod } from "@/shared/model/types";
import { useFormatCurrency } from "@/shared/lib/format-currency";
import { X, ExternalLink } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  symbol: string;
  history: FilingPeriod[]; // Full data
  onClose: () => void;
}

export function StockDetailModal({ symbol, history, onClose }: Props) {
  const { formatCurrency } = useFormatCurrency();

  // Extract history for this symbol
  const chartData = history
    .map((period) => {
      const holding = period.holdings.find((h) => h.symbol === symbol);
      if (!holding) return null;
      return {
        date: period.date,
        year: period.year,
        quarter: period.quarter,
        shares: holding.shares,
        value: holding.value,
        price: holding.value / holding.shares, // Implied price
        label: `${period.year} Q${period.quarter}`,
      };
    })
    .filter(Boolean)
    .reverse(); // Oldest first

  const current = chartData[chartData.length - 1];

  if (!current) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                {symbol}
              </h2>
              <p className="text-sm text-gray-500">
                {current.shares.toLocaleString()}주 보유
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            {/* Chart */}
            <div className="h-64 sm:h-80 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="label"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderColor: "#374151",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#9ca3af" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3b82f6" }}
                    activeDot={{ r: 6 }}
                  />
                  {/* We can add dots for buy/sell events if we calculate them */}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* History Text */}
            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-gray-900 dark:text-white">
                분기별 변동
              </h3>
              <div className="space-y-2">
                {chartData
                  .map((d, i) => {
                    const prev = i > 0 ? chartData[i - 1] : null;
                    const shareDiff = prev ? d.shares - prev.shares : 0;

                    return (
                      <div
                        key={d.label}
                        className="flex justify-between items-center text-sm p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <span className="text-gray-600 dark:text-gray-300">
                          {d.label}
                        </span>
                        <div className="flex items-center space-x-4">
                          <span>{d.shares.toLocaleString()}주</span>
                          <span
                            className={`font-bold w-20 text-right ${shareDiff > 0 ? "text-green-500" : shareDiff < 0 ? "text-red-500" : "text-gray-400"}`}
                          >
                            {shareDiff > 0 ? "+" : ""}
                            {shareDiff.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                  .reverse()}
              </div>
            </div>

            {/* Footer Button */}
            <a
              href={`https://finance.yahoo.com/quote/${symbol}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Yahoo Finance에서 보기
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
