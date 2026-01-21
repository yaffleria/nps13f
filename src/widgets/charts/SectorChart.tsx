"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { StockPosition } from "@/entities/portfolio/types";

interface SectorChartProps {
  holdings: StockPosition[];
}

const COLORS = [
  "#3182F6",
  "#F04452",
  "#34C759",
  "#FF9F0A",
  "#BF5AF2",
  "#AC8E68",
  "#FF3B30",
  "#8E8E93",
];

export function SectorChart({ holdings }: SectorChartProps) {
  // Aggregate by sector
  const dataMap = new Map<string, number>();
  holdings.forEach((h) => {
    const sector = h.sector || "Other";
    dataMap.set(sector, (dataMap.get(sector) || 0) + h.value);
  });

  const data = Array.from(dataMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 sectors

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#202632",
              borderColor: "#333D4B",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#fff" }}
            formatter={(value: number) => [`$${(value / 1000000000).toFixed(1)}B`, "Value"]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-secondary">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}
