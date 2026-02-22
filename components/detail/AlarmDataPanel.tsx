"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { alarmChartData, alarmTableData } from "@/lib/data";
import { SEV_COLOR } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  major: {
    label: "Major",
    color: "#ff8c00",
  },
  critical: {
    label: "Critical",
    color: "#ff3b5c",
  },
} satisfies ChartConfig;

export default function AlarmDataPanel() {
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
          Alarm Data
        </p>
        <span
          className="text-[11px] cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: "var(--magenta)", fontFamily: "var(--font-dm-mono)" }}
        >
          View Details
        </span>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-3">
        {[
          { label: "Critical", val: "1,250", color: "#ff3b5c" },
          { label: "Major", val: "674", color: "#ff8c00" },
          { label: "Minor", val: "1,250", color: "#f5c518" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
              {s.label}
            </p>
            <p className="text-xl font-bold" style={{ color: s.color, fontFamily: "var(--font-syne)", fontWeight: 800 }}>
              {s.val}
            </p>
          </div>
        ))}
      </div>

      {/* Stacked area chart */}
      <div className="flex-1 min-h-0 mb-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            data={alarmChartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradMajor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-major)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-major)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-critical)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-critical)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="t"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b6b80", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
              tickMargin={4}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="major"
              type="natural"
              fill="url(#gradMajor)"
              stroke="var(--color-major)"
              strokeWidth={1.5}
              stackId="a"
              animationDuration={800}
            />
            <Area
              dataKey="critical"
              type="natural"
              fill="url(#gradCritical)"
              stroke="var(--color-critical)"
              strokeWidth={1.5}
              stackId="a"
              animationDuration={800}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Table */}
      <table className="w-full text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Alarm", "Duration", "Status"].map((h) => (
              <th key={h} className="text-left pb-2 pr-3" style={{ color: "var(--text-dim)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alarmTableData.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
              <td className="py-2 pr-3" style={{ color: "var(--text-muted)" }}>{row.alarm}</td>
              <td className="py-2 pr-3" style={{ color: "var(--text-muted)" }}>{row.duration}</td>
              <td className="py-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px]"
                  style={{
                    color: SEV_COLOR[row.status] || "var(--text-muted)",
                    background: `${SEV_COLOR[row.status] || "#fff"}18`,
                    border: `1px solid ${SEV_COLOR[row.status] || "#fff"}33`,
                  }}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
