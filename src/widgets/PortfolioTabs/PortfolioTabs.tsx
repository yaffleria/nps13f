"use client";

import { useState } from "react";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { SortableHoldingsTable } from "@/features/holdings/SortableHoldingsTable";
import { SortableActivityTable } from "@/features/activity/SortableActivityTable";
import { QuarterSelector } from "@/widgets/QuarterSelector/QuarterSelector";
import { processActivity } from "@/entities/portfolio/lib/process-activity";
import { formatCompactNumber } from "@/shared/lib/format";
import { BarChart3, TrendingUp, Briefcase, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Modal } from "@/shared/ui/Modal";
import { PortfolioTrendChart } from "@/widgets/charts/PortfolioTrendChart";

interface PortfolioTabsProps {
  quarters: PortfolioQuarter[];
  initialTab?: "holdings" | "activity";
}

export function PortfolioTabs({ quarters, initialTab = "holdings" }: PortfolioTabsProps) {
  const [selectedQuarterIndex, setSelectedQuarterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"holdings" | "activity">(initialTab);
  const [showTrendModal, setShowTrendModal] = useState(false);

  const currentQuarter = quarters[selectedQuarterIndex];
  const previousQuarter = quarters[selectedQuarterIndex + 1];

  const activity = processActivity(currentQuarter, previousQuarter);

  const totalValue = currentQuarter.totalValue;
  const holdingsCount = currentQuarter.holdings.length;
  const buys = activity.filter((a) => a.sharesChanged > 0);
  const sells = activity.filter((a) => a.sharesChanged < 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="p-4 sm:p-6 bg-surface rounded-2xl border border-border shadow-sm">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-y-6 gap-x-4 sm:gap-8">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs sm:text-sm text-secondary mb-1">포트폴리오 가치</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">
                ${formatCompactNumber(totalValue)}
              </p>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div>
              <p className="text-xs sm:text-sm text-secondary mb-1">분기</p>
              <p className="text-lg sm:text-xl font-semibold text-foreground">
                {currentQuarter.year}년 {currentQuarter.quarter}분기
              </p>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div>
              <p className="text-xs sm:text-sm text-secondary mb-1">보유 종목 수</p>
              <p className="text-lg sm:text-xl font-semibold text-foreground">{holdingsCount}개</p>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div>
              <p className="text-xs sm:text-sm text-secondary mb-1">공시일</p>
              <p className="text-lg sm:text-xl font-semibold text-foreground">
                {new Date(currentQuarter.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            onClick={() => setShowTrendModal(true)}
            className="px-4 py-2.5 bg-surface border border-border rounded-xl hover:bg-background hover:border-primary/50 transition-all flex items-center justify-center gap-2 text-secondary hover:text-foreground w-full sm:w-auto"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium whitespace-nowrap">포트폴리오 추이</span>
          </button>
          <div className="w-full sm:w-auto">
            <QuarterSelector
              quarters={quarters}
              selectedIndex={selectedQuarterIndex}
              onSelect={setSelectedQuarterIndex}
            />
          </div>
        </div>
      </div>

      <div className="border-b border-border overflow-x-auto">
        <nav className="flex gap-1 min-w-max" role="tablist" aria-label="포트폴리오 보기">
          <button
            role="tab"
            aria-selected={activeTab === "holdings"}
            aria-controls="holdings-panel"
            id="holdings-tab"
            onClick={() => setActiveTab("holdings")}
            className={`px-4 sm:px-6 py-3 font-medium text-sm transition-all relative whitespace-nowrap ${
              activeTab === "holdings" ? "text-primary" : "text-secondary hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              보유 종목
              <span className="px-2 py-0.5 text-xs bg-surface rounded-full">{holdingsCount}</span>
            </div>
            {activeTab === "holdings" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "activity"}
            aria-controls="activity-panel"
            id="activity-tab"
            onClick={() => setActiveTab("activity")}
            className={`px-4 sm:px-6 py-3 font-medium text-sm transition-all relative whitespace-nowrap ${
              activeTab === "activity" ? "text-primary" : "text-secondary hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              매매 내역
              {activity.length > 0 && (
                <span className="flex items-center gap-1 text-xs">
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-success/20 text-success rounded">
                    <ArrowUpRight className="w-3 h-3" />
                    {buys.length}
                  </span>
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-negative/20 text-negative rounded">
                    <ArrowDownRight className="w-3 h-3" />
                    {sells.length}
                  </span>
                </span>
              )}
            </div>
            {activeTab === "activity" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </nav>
      </div>

      <div>
        <div
          role="tabpanel"
          id="holdings-panel"
          aria-labelledby="holdings-tab"
          hidden={activeTab !== "holdings"}
        >
          {activeTab === "holdings" && (
            <SortableHoldingsTable
              holdings={currentQuarter.holdings}
              totalValue={currentQuarter.totalValue}
              previousQuarterHoldings={previousQuarter?.holdings}
              quarters={quarters}
            />
          )}
        </div>

        <div
          role="tabpanel"
          id="activity-panel"
          aria-labelledby="activity-tab"
          hidden={activeTab !== "activity"}
        >
          {activeTab === "activity" && (
            <>
              {activity.length > 0 ? (
                <SortableActivityTable activity={activity} />
              ) : (
                <div className="text-center py-20 text-secondary bg-surface rounded-xl border border-border">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">매매 내역이 없습니다</p>
                  <p className="text-sm mt-1">
                    {selectedQuarterIndex === quarters.length - 1
                      ? "가장 오래된 데이터입니다."
                      : "이 분기에는 변동 사항이 없습니다."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="sr-only">
        <h2>
          국민연금 {currentQuarter.year}년 {currentQuarter.quarter}분기 보유 종목
        </h2>
        <p>
          국민연금은 {currentQuarter.year}년 {currentQuarter.quarter}분기에 미국 주식{" "}
          {holdingsCount}개 종목을 총 ${formatCompactNumber(totalValue)} 규모로 보유하고 있습니다.
        </p>
        <h2>국민연금 매매 내역</h2>
        <p>
          이 분기 동안 국민연금은 {buys.length}개 종목을 매수하고 {sells.length}개 종목을
          매도했습니다.
        </p>
      </div>

      <Modal
        isOpen={showTrendModal}
        onClose={() => setShowTrendModal(false)}
        title="포트폴리오 추이"
        size="xl"
      >
        <PortfolioTrendChart quarters={quarters} />
      </Modal>
    </div>
  );
}
