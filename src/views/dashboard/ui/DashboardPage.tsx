"use client";

import { useState } from "react";
import { FilingPeriod, Filing13F } from "@/shared/model/types";
import { GlobalNav } from "@/features/dashboard/ui/GlobalNav";
import { HeroSection } from "@/features/dashboard/ui/HeroSection";
import { MainList } from "@/features/dashboard/ui/MainList";
import { StockDetailModal } from "@/features/dashboard/ui/StockDetailModal";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  data: FilingPeriod[];
}

export function DashboardPage({ data }: Props) {
  const [filter, setFilter] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-10 text-center">
        데이터가 없습니다. 스크립트를 실행해주세요.
      </div>
    );
  }

  const currentPeriod = data[0];
  const previousPeriod = data[1]; // Might be undefined if only 1 exists

  // --- Hero Logic ---
  const currentHoldingsMap = new Map(
    currentPeriod.holdings.map((h) => [h.cusip, h]),
  );
  const prevHoldingsMap: Record<string, Filing13F> = previousPeriod
    ? Object.fromEntries(previousPeriod.holdings.map((h) => [h.cusip, h]))
    : {};

  // New & Sold Out
  const newEntries = currentPeriod.holdings.filter(
    (h) => !prevHoldingsMap[h.cusip],
  );
  const soldOutEntries = previousPeriod
    ? previousPeriod.holdings.filter((h) => !currentHoldingsMap.has(h.cusip))
    : [];

  // Top Pick/Sell (by share change %)
  // Calculation: (current shares - prev shares) / prev shares
  // If new, 100%. If sold out, -100%.

  // We need a unified list of all changes to find Top Pick/Sell
  // But purely for "Top Pick" (Highest % increase or Value increase?)
  // User said: "Top Pick: 이번 분기에 가장 많이 산 종목 1위". Usually massive buying volume or high % calc.
  // I'll rank by: (Current Shares - Prev Shares) * Price(approx) = Net Buying Amount. This is more meaningful than %.
  // Because small cap +1000% is less impactful than Apple +1%.
  // actually "Most Bought" usually means Net Inflow.
  // Net Inflow ~= (Shares diff) * (Current Value / Current Shares)

  const changes = currentPeriod.holdings.map((h) => {
    const prev = prevHoldingsMap[h.cusip];
    const prevShares = prev ? prev.shares : 0;
    const diffShares = h.shares - prevShares;
    const price = h.value / h.shares;
    const netFlow = diffShares * price;
    return {
      symbol: h.symbol,
      name: h.securityName,
      netFlow,
      percentInfo: prev ? ((h.shares - prevShares) / prevShares) * 100 : 100,
    };
  });

  // Include Sold Out in Top Sell calculation
  if (previousPeriod) {
    const soldOuts = soldOutEntries.map((h) => {
      // Sold everything. Net flow = -Value (at prev time? or current?)
      // We use prev value as negative flow approximation
      return {
        symbol: h.symbol,
        name: h.securityName,
        netFlow: -h.value, // Negative flow
        percentInfo: -100,
      };
    });
    changes.push(...soldOuts);
  }

  const sortedByFlow = [...changes].sort((a, b) => b.netFlow - a.netFlow);

  const topBuy =
    sortedByFlow.length > 0
      ? sortedByFlow[0]
      : { symbol: "-", name: "-", percentInfo: 0 };
  const topSell =
    sortedByFlow.length > 0
      ? sortedByFlow[sortedByFlow.length - 1]
      : { symbol: "-", name: "-", percentInfo: 0 };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <GlobalNav onSearch={setFilter} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection
          totalAum={currentPeriod.totalValue}
          prevAum={previousPeriod?.totalValue}
          topBuy={{
            symbol: topBuy.symbol,
            name: topBuy.name,
            changePercent: topBuy.percentInfo,
          }}
          topSell={{
            symbol: topSell.symbol,
            name: topSell.name,
            changePercent: topSell.percentInfo,
          }}
          newEntriesCount={newEntries.length}
          soldOutCount={soldOutEntries.length}
        />

        <MainList
          holdings={currentPeriod.holdings}
          prevHoldingsMap={prevHoldingsMap}
          filter={filter}
          onSelect={(symbol) => setSelectedSymbol(symbol)}
        />

        {selectedSymbol && (
          <StockDetailModal
            symbol={selectedSymbol}
            history={data}
            onClose={() => setSelectedSymbol(null)}
          />
        )}
      </main>
    </div>
  );
}
