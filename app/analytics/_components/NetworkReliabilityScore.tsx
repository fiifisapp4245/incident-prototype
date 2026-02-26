"use client";

import { PieChart, Pie, Label, Cell } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import { ChartContainer } from "@/components/ui/chart";
import type { PeriodData } from "@/lib/analyticsData";

interface Props {
  data: PeriodData;
  periodLabel: string;
}

export default function NetworkReliabilityScore({ data, periodLabel }: Props) {
  const t = useT();
  const score = data.networkReliability;

  const color =
    score >= 90 ? "#00c896" :
    score >= 75 ? "#ff8c00" :
    "#ff3b5c";

  const pieData = [
    { name: "filled", value: score },
    { name: "gap",    value: 100 - score },
  ];

  const improved = data.mttrChange < 0;
  const trendColor = improved ? "#00c896" : data.mttrChange > 0 ? "#ff3b5c" : "var(--text-dim)";

  return (
    <div
      className="rounded-xl p-6 flex flex-col items-center justify-center text-center h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Donut via shadcn ChartContainer + Recharts */}
      <ChartContainer config={{}} className="aspect-square w-[180px]">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            innerRadius={64}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
            isAnimationActive
          >
            <Cell fill={color} />
            <Cell fill="var(--surface3)" />
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                const { cx, cy } = viewBox as { cx: number; cy: number };
                return (
                  <text textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={cx}
                      y={cy - 10}
                      fontSize="26"
                      fontWeight="800"
                      fontFamily="var(--font-syne)"
                      fill={color}
                    >
                      {score.toFixed(1)}%
                    </tspan>
                    <tspan
                      x={cx}
                      y={cy + 14}
                      fontSize="10"
                      fontFamily="var(--font-dm-mono)"
                      fill="var(--text-dim)"
                    >
                      {t.networkReliability.split(" ").slice(0, 1).join(" ")}
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* Label below ring */}
      <p
        className="text-[13px] font-semibold mt-1"
        style={{ color: "var(--text)", fontFamily: "var(--font-ibm-sans)" }}
      >
        {t.networkReliability}
      </p>
      <p
        className="text-[11px] mt-0.5"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
      >
        {periodLabel}
      </p>

      {/* Trend row */}
      <div className="flex items-center gap-1.5 mt-3">
        {improved ? (
          <TrendingUp size={13} color={trendColor} />
        ) : data.mttrChange > 0 ? (
          <TrendingDown size={13} color={trendColor} />
        ) : (
          <Minus size={13} color={trendColor} />
        )}
        <span
          className="text-[11px]"
          style={{ fontFamily: "var(--font-dm-mono)", color: trendColor }}
        >
          {t.vsPrevPeriod}
        </span>
      </div>
    </div>
  );
}
