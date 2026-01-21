"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PortfolioQuarter } from "@/entities/portfolio/types";
import { formatCompactNumber } from "@/shared/lib/format";

interface PortfolioTrendChartProps {
  quarters: PortfolioQuarter[];
}

export function PortfolioTrendChart({ quarters }: PortfolioTrendChartProps) {
  const data = [...quarters].reverse().map((q) => ({
    label: `${q.year} Q${q.quarter}`,
    value: q.totalValue / 1000,
    holdings: q.holdings.length,
  }));

  return (
    <div className="space-y-6">
      
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3182F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3182F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333D4B" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#8B95A1", fontSize: 12 }}
              axisLine={{ stroke: "#333D4B" }}
              tickLine={false}
            />
            <YAxis
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
              formatter={(value) => {
                const numValue = typeof value === "number" ? value : 0;
                return [`$${formatCompactNumber(numValue)}`, "포트폴리오 가치"];
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3182F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-background/80 text-secondary border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-medium">분기</th>
              <th className="px-4 py-3 text-right font-medium">포트폴리오 가치</th>
              <th className="px-4 py-3 text-right font-medium">보유 종목 수</th>
              <th className="px-4 py-3 text-right font-medium">변동률</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item, index) => {
              const prevValue = index > 0 ? data[index - 1].value : null;
              const change = prevValue ? ((item.value - prevValue) / prevValue) * 100 : null;

              return (
                <tr key={item.label} className="hover:bg-background/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{item.label}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    ${formatCompactNumber(item.value)}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">{item.holdings}개</td>
                  <td className="px-4 py-3 text-right">
                    {change !== null ? (
                      <span className={change >= 0 ? "text-success" : "text-negative"}>
                        {change >= 0 ? "+" : ""}
                        {change.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-secondary">-</span>
                    )}
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
