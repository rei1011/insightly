"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export type RankingChartProps = {
  data: {
    rank: number;
    companyName: string;
    avgSalary: number;
    count: number;
  }[];
};

type TooltipPayloadEntry = {
  value: number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-[var(--foreground)]/20 bg-white px-3 py-2 text-sm shadow dark:bg-black">
      <p className="font-medium text-[var(--foreground)]">{label}</p>
      <p className="text-[var(--foreground)]/80">
        平均年収: {payload[0].value.toLocaleString("ja-JP")}万円
      </p>
    </div>
  );
}

export function RankingChart({ data }: RankingChartProps) {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--foreground)]/70 font-sans">
        データがありません
      </div>
    );
  }

  const maxSalary = Math.max(...data.map((d) => d.avgSalary));
  const yAxisMax = Math.ceil(maxSalary / 100) * 100 + 100;

  return (
    <div
      className="mb-8 w-full overflow-x-auto"
      data-testid="ranking-chart"
    >
      <div style={{ minWidth: data.length * 40 + 80 }}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, left: 16, bottom: 120 }}
          >
            <XAxis
              dataKey="companyName"
              tick={{ fontSize: 11, fill: "var(--foreground)" }}
              angle={-55}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              domain={[0, yAxisMax]}
              tickFormatter={(v: number) => `${v}万`}
              tick={{ fontSize: 11, fill: "var(--foreground)" }}
              width={56}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgSalary" radius={[3, 3, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.rank}
                  fill={
                    entry.rank === 1
                      ? "#F59E0B"
                      : entry.rank === 2
                      ? "#9CA3AF"
                      : entry.rank === 3
                      ? "#B45309"
                      : "#6366F1"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
