"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useFormatCurrency } from "@/shared/lib/format-currency";
import { motion } from "framer-motion";

interface Props {
  totalAum: number;
  prevAum?: number;
  topBuy: { symbol: string; name: string; changePercent: number };
  topSell: { symbol: string; name: string; changePercent: number };
  newEntriesCount: number;
  soldOutCount: number;
}

export function HeroSection({
  totalAum,
  prevAum,
  topBuy,
  topSell,
  newEntriesCount,
  soldOutCount,
}: Props) {
  const { formatCurrency } = useFormatCurrency();

  const aumChange = prevAum ? ((totalAum - prevAum) / prevAum) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pt-20">
      {/* AUM Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-12 h-12 text-blue-500" />
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
          총 운용자산(AUM)
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {formatCurrency(totalAum)}
        </p>
        <div
          className={`flex items-center text-sm ${aumChange >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {aumChange >= 0 ? (
            <ArrowUpRight className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 mr-1" />
          )}
          <span className="font-medium">{Math.abs(aumChange).toFixed(1)}%</span>
          <span className="text-gray-400 ml-1">전분기 대비</span>
        </div>
      </motion.div>

      {/* Top Pick Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <ArrowUpRight className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
          최다 매수 (금액)
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">
          {topBuy.name}
        </p>
        <div className="flex items-center mt-2">
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-bold mr-2">
            {topBuy.symbol}
          </span>
          <span className="text-green-500 text-sm font-medium">
            +{topBuy.changePercent.toFixed(1)}% 지분
          </span>
        </div>
      </motion.div>

      {/* Top Sell Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <ArrowDownRight className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
          최다 매도 (금액)
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">
          {topSell.name}
        </p>
        <div className="flex items-center mt-2">
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs font-bold mr-2">
            {topSell.symbol}
          </span>
          <span className="text-red-500 text-sm font-medium">
            {topSell.changePercent.toFixed(1)}% 지분
          </span>
        </div>
      </motion.div>

      {/* Hot Badges Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-sm relative overflow-hidden text-white"
      >
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Sparkles className="w-12 h-12" />
        </div>
        <h3 className="text-white/80 text-sm font-medium mb-4">
          포트폴리오 활동
        </h3>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs text-white/70">신규 진입</p>
              <p className="font-bold text-lg">{newEntriesCount}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <LogOut className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs text-white/70">전량 매도</p>
              <p className="font-bold text-lg">{soldOutCount}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
