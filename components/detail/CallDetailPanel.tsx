"use client";

import { Bar, Line, ComposedChart, CartesianGrid, XAxis } from "recharts";
import { callComposedData } from "@/lib/data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  volume: {
    label: "Call Volume",
    color: "#E2008A",
  },
  trend: {
    label: "Trend",
    color: "#38bdf8",
  },
} satisfies ChartConfig;

export default function CallDetailPanel() {
  return (
    <div
      className="rounded-lg p-5 flex flex-col"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-[11px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          Call Overview
        </p>
        <span
          className="text-[11px] cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: "var(--magenta)", fontFamily: "var(--font-dm-mono)" }}
        >
          View Details
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-4">
        <div>
          <p className="text-2xl font-bold mb-0.5" style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}>
            5 <span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>hrs</span>
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
            Average waiting time
          </p>
        </div>
        <div className="w-px self-stretch" style={{ background: "var(--border)" }} />
        <div>
          <p className="text-2xl font-bold mb-0.5" style={{ color: "var(--magenta)", fontFamily: "var(--font-syne)", fontWeight: 800 }}>
            321
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
            Volumes of calls
          </p>
        </div>
      </div>

      {/* Bar + Line composed chart */}
      <ChartContainer config={chartConfig} className="flex-1 w-full min-h-0">
        <ComposedChart data={callComposedData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b6b80", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
            tickMargin={4}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar
            dataKey="volume"
            fill="var(--color-volume)"
            fillOpacity={0.5}
            radius={[2, 2, 0, 0]}
            animationDuration={800}
          />
          <Line
            dataKey="trend"
            type="linear"
            stroke="var(--color-trend)"
            strokeWidth={1.5}
            dot={false}
            animationDuration={800}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
