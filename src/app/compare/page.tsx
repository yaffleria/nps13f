"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GlobalHeader } from "@/widgets/GlobalHeader/GlobalHeader";
import { FadeIn } from "@/shared/ui/FadeIn";
import { formatCompactNumber, formatNumber } from "@/shared/lib/format";
import { Search, X, Plus, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ClientOnly } from "@/shared/ui/ClientOnly";

interface PortfolioQuarter {
  date: string;
  year: number;
  quarter: number;
  totalValue: number;
  holdings: {
    symbol: string;
    securityName: string;
    cusip: string;
    shares: number;
    value: number;
    sector: string;
  }[];
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];

export default function ComparePage() {
  const [data, setData] = useState<PortfolioQuarter[] | null>(null);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로드
  useMemo(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setIsLoading(false);
      })
      .catch(() => {
        // fallback: 직접 JSON 로드 시도
        import("@/shared/data/sec-data.json").then((module) => {
          setData(module.default as PortfolioQuarter[]);
          setIsLoading(false);
        });
      });
  }, []);

  // 모든 종목 리스트
  const allSymbols = useMemo(() => {
    if (!data) return [];
    const symbolMap = new Map<string, { symbol: string; name: string; sector: string }>();
    data.forEach((q) => {
      q.holdings.forEach((h) => {
        if (!symbolMap.has(h.symbol)) {
          symbolMap.set(h.symbol, {
            symbol: h.symbol,
            name: h.securityName,
            sector: h.sector,
          });
        }
      });
    });
    return Array.from(symbolMap.values()).sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [data]);

  // 검색 필터링
  const filteredSymbols = useMemo(() => {
    if (!searchQuery) return allSymbols.slice(0, 20);
    const query = searchQuery.toLowerCase();
    return allSymbols
      .filter((s) => s.symbol.toLowerCase().includes(query) || s.name.toLowerCase().includes(query))
      .slice(0, 20);
  }, [allSymbols, searchQuery]);

  // 차트 데이터 생성
  const chartData = useMemo(() => {
    if (!data || selectedSymbols.length === 0) return [];

    return data
      .slice()
      .reverse()
      .map((q) => {
        const point: Record<string, number | string> = {
          quarter: `${q.year} Q${q.quarter}`,
        };

        selectedSymbols.forEach((symbol) => {
          const holding = q.holdings.find((h) => h.symbol === symbol);
          point[symbol] = holding ? holding.value / 1000 : 0;
        });

        return point;
      });
  }, [data, selectedSymbols]);

  // 현재 분기 비교 데이터
  const comparisonData = useMemo(() => {
    if (!data || selectedSymbols.length === 0) return [];

    const currentQ = data[0];
    const prevQ = data[1];

    return selectedSymbols.map((symbol) => {
      const current = currentQ.holdings.find((h) => h.symbol === symbol);
      const prev = prevQ?.holdings.find((h) => h.symbol === symbol);

      const currentValue = current ? current.value / 1000 : 0;
      const prevValue = prev ? prev.value / 1000 : 0;
      const valueChange = prevValue > 0 ? ((currentValue - prevValue) / prevValue) * 100 : 0;

      const currentShares = current?.shares || 0;
      const prevShares = prev?.shares || 0;
      const sharesChange = currentShares - prevShares;

      return {
        symbol,
        name: current?.securityName || prev?.securityName || "",
        sector: current?.sector || prev?.sector || "",
        value: currentValue,
        shares: currentShares,
        valueChange,
        sharesChange,
        percent: current ? (current.value / currentQ.totalValue) * 100 : 0,
        isHeld: !!current,
      };
    });
  }, [data, selectedSymbols]);

  const addSymbol = (symbol: string) => {
    if (!selectedSymbols.includes(symbol) && selectedSymbols.length < 8) {
      setSelectedSymbols([...selectedSymbols, symbol]);
      setSearchQuery("");
    }
  };

  const removeSymbol = (symbol: string) => {
    setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <GlobalHeader />

      <main className="container mx-auto px-4 py-8">
        <FadeIn>
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent inline-block">
              종목 비교
            </h1>
            <p className="text-secondary text-lg">
              국민연금의 보유 종목을 비교 분석하세요. 최대 8개 종목까지 비교할 수 있습니다.
            </p>
          </header>

          {/* 종목 선택 */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSymbols.map((symbol, i) => (
                <span
                  key={symbol}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-white font-medium"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                >
                  {symbol}
                  <button
                    onClick={() => removeSymbol(symbol)}
                    className="hover:bg-white/20 rounded p-0.5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
              {selectedSymbols.length === 0 && (
                <span className="text-secondary">종목을 검색하여 추가하세요</span>
              )}
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder="티커 또는 종목명 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted"
              />

              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                  {filteredSymbols.map((item) => (
                    <button
                      key={item.symbol}
                      onClick={() => addSymbol(item.symbol)}
                      disabled={selectedSymbols.includes(item.symbol)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="text-left">
                        <span className="font-semibold text-primary">{item.symbol}</span>
                        <span className="text-secondary text-sm ml-2">{item.name}</span>
                      </div>
                      {!selectedSymbols.includes(item.symbol) && (
                        <Plus className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                  {filteredSymbols.length === 0 && (
                    <div className="px-4 py-3 text-secondary text-center">검색 결과가 없습니다</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 비교 차트 */}
          {selectedSymbols.length > 0 && chartData.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                보유액 추이 비교
              </h2>
              <div className="p-6 bg-surface rounded-xl border border-border">
                <ClientOnly>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis
                        dataKey="quarter"
                        tick={{ fill: "var(--color-secondary)" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "var(--color-secondary)" }}
                        tickLine={false}
                        tickFormatter={(v) => `$${formatCompactNumber(v)}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number | undefined) => [
                          `$${formatCompactNumber(value ?? 0)}`,
                          "",
                        ]}
                      />
                      <Legend />
                      {selectedSymbols.map((symbol, i) => (
                        <Line
                          key={symbol}
                          type="monotone"
                          dataKey={symbol}
                          stroke={COLORS[i % COLORS.length]}
                          strokeWidth={2}
                          dot={{ fill: COLORS[i % COLORS.length] }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </ClientOnly>
              </div>
            </section>
          )}

          {/* 비교 테이블 */}
          {comparisonData.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">현재 분기 비교</h2>
              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full text-sm">
                  <thead className="bg-background/80 text-secondary border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">티커</th>
                      <th className="px-4 py-3 text-left font-medium">종목명</th>
                      <th className="px-4 py-3 text-left font-medium">섹터</th>
                      <th className="px-4 py-3 text-right font-medium">비중</th>
                      <th className="px-4 py-3 text-right font-medium">보유 수량</th>
                      <th className="px-4 py-3 text-right font-medium">평가액</th>
                      <th className="px-4 py-3 text-right font-medium">변동</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {comparisonData.map((item, i) => (
                      <tr key={item.symbol} className="hover:bg-background/50 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            href={`/stocks/${item.symbol}`}
                            className="font-semibold hover:underline"
                            style={{ color: COLORS[i % COLORS.length] }}
                          >
                            {item.symbol}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-foreground max-w-40 truncate">{item.name}</td>
                        <td className="px-4 py-3 text-secondary">{item.sector}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {item.percent.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.isHeld ? formatNumber(item.shares) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right font-bold">
                          {item.isHeld ? `$${formatCompactNumber(item.value)}` : "-"}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-medium flex items-center justify-end gap-1 ${
                            item.sharesChange > 0
                              ? "text-success"
                              : item.sharesChange < 0
                                ? "text-negative"
                                : "text-secondary"
                          }`}
                        >
                          {item.sharesChange !== 0 && (
                            <>
                              {item.sharesChange > 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {item.sharesChange > 0 ? "+" : ""}
                              {formatNumber(item.sharesChange)}
                            </>
                          )}
                          {item.sharesChange === 0 && "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 빈 상태 */}
          {selectedSymbols.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-surface rounded-xl border border-border">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted opacity-30" />
              <p className="text-lg font-medium text-secondary mb-2">비교할 종목을 선택하세요</p>
              <p className="text-sm text-muted">
                위 검색창에서 티커 또는 종목명을 검색하여 추가할 수 있습니다.
              </p>
            </div>
          )}
        </FadeIn>
      </main>

      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted">
            © 2025 NPS 13F 트래커. SEC 공개 데이터 기반 분석 서비스입니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
