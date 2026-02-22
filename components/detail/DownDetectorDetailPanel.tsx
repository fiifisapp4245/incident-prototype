"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { downDetectorData } from "@/lib/data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  score: {
    label: "User Score",
    color: "#E2008A",
  },
} satisfies ChartConfig;

export default function DownDetectorDetailPanel() {
  return (
    <div
      className="rounded-lg p-5 flex flex-col"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p
          className="text-[11px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          Down Detector Data
        </p>
        <span
          className="text-[11px] cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: "var(--magenta)", fontFamily: "var(--font-dm-mono)" }}
        >
          View Details
        </span>
      </div>

      <p
        className="text-4xl font-bold mb-0.5"
        style={{ color: "var(--magenta)", fontFamily: "var(--font-syne)", fontWeight: 800 }}
      >
        60%
      </p>
      <p
        className="text-[10px] mb-4"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
      >
        Current user score
      </p>

      <ChartContainer config={chartConfig} className="flex-1 w-full min-h-0">
        <AreaChart data={downDetectorData} margin={{ top: 4, right: 0, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b6b80", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
            tickMargin={4}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b6b80", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
            tickFormatter={(v) => `${v}%`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <ReferenceLine
            y={50}
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 3"
          />
          <Area
            dataKey="score"
            type="natural"
            fill="url(#ddGrad)"
            stroke="var(--color-score)"
            strokeWidth={2}
            dot={false}
            animationDuration={800}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
