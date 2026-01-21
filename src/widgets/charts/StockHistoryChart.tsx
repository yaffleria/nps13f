"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { formatCompactNumber, formatNumber } from "@/shared/lib/format";

interface StockHistoryChartProps {
  symbol: string;
  securityName: string;
  quarters: PortfolioQuarter[];
}

interface HistoryDataPoint {
  label: string;
  shares: number;
  value: number;
  price: number;
  percent: number | null;
}

export function StockHistoryChart({ symbol, securityName, quarters }: StockHistoryChartProps) {
  const data: HistoryDataPoint[] = [...quarters].reverse().map((q) => {
    const holding = q.holdings.find((h) => h.symbol === symbol || h.securityName === securityName);

    if (!holding) {
      return {
        label: `${q.year} Q${q.quarter}`,
        shares: 0,
        value: 0,
        price: 0,
        percent: null,
      };
    }

    const actualValue = holding.value / 1000;
    const percent = (holding.value / q.totalValue) * 100;
    const price = actualValue / holding.shares;

    return {
      label: `${q.year} Q${q.quarter}`,
      shares: holding.shares,
      value: actualValue,
      price,
      percent,
    };
  });
  const existingData = data.filter((d) => d.shares > 0);
  const currentData = existingData[existingData.length - 1];
  const firstData = existingData[0];

  const sharesChange = firstData && currentData ? currentData.shares - firstData.shares : 0;
  const sharesChangePercent =
    firstData && firstData.shares > 0
      ? (((currentData?.shares || 0) - firstData.shares) / firstData.shares) * 100
      : 0;

  return (
    <div className="space-y-6">
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">{symbol.slice(0, 2)}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{symbol}</h3>
          <p className="text-sm text-secondary">{securityName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-background rounded-xl border border-border">
          <p className="text-xs text-secondary mb-1">현재 보유량</p>
          <p className="text-lg font-bold text-foreground">
            {currentData ? formatNumber(currentData.shares) : "0"}주
          </p>
        </div>
        <div className="p-4 bg-background rounded-xl border border-border">
          <p className="text-xs text-secondary mb-1">현재 평가액</p>
          <p className="text-lg font-bold text-foreground">
            ${currentData ? formatCompactNumber(currentData.value) : "0"}
          </p>
        </div>
        <div className="p-4 bg-background rounded-xl border border-border">
          <p className="text-xs text-secondary mb-1">포트폴리오 비중</p>
          <p className="text-lg font-bold text-primary">
            {currentData?.percent ? currentData.percent.toFixed(2) : "0"}%
          </p>
        </div>
        <div className="p-4 bg-background rounded-xl border border-border">
          <p className="text-xs text-secondary mb-1">수량 변화 (전체 기간)</p>
          <p
            className={`text-lg font-bold ${
              sharesChange > 0
                ? "text-success"
                : sharesChange < 0
                  ? "text-negative"
                  : "text-foreground"
            }`}
          >
            {sharesChange > 0 ? "+" : ""}
            {formatNumber(sharesChange)}주
            <span className="text-sm ml-1">
              ({sharesChangePercent >= 0 ? "+" : ""}
              {sharesChangePercent.toFixed(1)}%)
            </span>
          </p>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333D4B" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#8B95A1", fontSize: 12 }}
              axisLine={{ stroke: "#333D4B" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#8B95A1", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatCompactNumber(value)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#8B95A1", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${formatCompactNumber(value)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#202632",
                borderColor: "#333D4B",
                borderRadius: "12px",
              }}
              itemStyle={{ color: "#fff" }}
              labelStyle={{ color: "#8B95A1", marginBottom: 8 }}
              formatter={(value, name) => {
                const numValue = typeof value === "number" ? value : 0;
                if (name === "shares") return [formatNumber(numValue) + "주", "보유량"];
                if (name === "value") return ["$" + formatCompactNumber(numValue), "평가액"];
                return [numValue, name];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => {
                if (value === "shares") return "보유량";
                if (value === "value") return "평가액";
                return value;
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="shares"
              fill="#3182F6"
              opacity={0.8}
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="value"
              stroke="#34C759"
              strokeWidth={2}
              dot={{ fill: "#34C759", strokeWidth: 0, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-background/80 text-secondary border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-medium">분기</th>
              <th className="px-4 py-3 text-right font-medium">보유량</th>
              <th className="px-4 py-3 text-right font-medium">수량 변화</th>
              <th className="px-4 py-3 text-right font-medium">공시가격</th>
              <th className="px-4 py-3 text-right font-medium">평가액</th>
              <th className="px-4 py-3 text-right font-medium">비중</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...data].reverse().map((item, index, arr) => {
              const prevItem = arr[index + 1];
              const sharesChanged = prevItem ? item.shares - prevItem.shares : item.shares;

              return (
                <tr key={item.label} className="hover:bg-background/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{item.label}</td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {item.shares > 0 ? formatNumber(item.shares) + "주" : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.shares > 0 ? (
                      <span
                        className={
                          sharesChanged > 0
                            ? "text-success"
                            : sharesChanged < 0
                              ? "text-negative"
                              : "text-secondary"
                        }
                      >
                        {sharesChanged > 0 ? "+" : ""}
                        {formatNumber(sharesChanged)}
                      </span>
                    ) : (
                      <span className="text-secondary">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {item.price > 0 ? "$" + formatNumber(item.price) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    {item.value > 0 ? "$" + formatCompactNumber(item.value) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-primary">
                    {item.percent ? item.percent.toFixed(2) + "%" : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
