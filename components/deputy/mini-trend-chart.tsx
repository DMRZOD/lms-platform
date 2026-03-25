"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

type MiniTrendChartProps = {
  data: { value: number }[];
  color?: string;
};

export function MiniTrendChart({
  data,
  color = "#22c55e",
}: MiniTrendChartProps) {
  return (
    <ResponsiveContainer width={120} height={40}>
      <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#grad-${color})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
