"use client";

import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import { callVolumeData } from "@/lib/data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useT } from "@/contexts/LanguageContext";

const chartConfig = {
  volume: {
    label: "Call Volume",
    color: "#E2008A",
  },
} satisfies ChartConfig;

export default function CallVolumePanel() {
  const t = useT();
  return (
    <div
      className="rounded-xl p-6 flex flex-col h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-[11px] uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        {t.callVolumeTitle}
      </p>

      <ChartContainer config={chartConfig} className="h-[140px] w-full">
        <AreaChart data={callVolumeData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="callGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-volume)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--color-volume)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b6b80", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
            tickMargin={4}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="var(--color-volume)"
            strokeWidth={2}
            fill="url(#callGrad)"
            dot={false}
            animationDuration={800}
          />
        </AreaChart>
      </ChartContainer>

      {/* Stats */}
      <div
        className="flex gap-6 mt-5 pt-5"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div>
          <p
            className="text-[11px] uppercase tracking-widest mb-1.5"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            {t.avgWait}
          </p>
          <p
            className="text-3xl font-extrabold leading-none"
            style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}
          >
            5.2
            <span
              className="text-base font-normal ml-1"
              style={{ color: "var(--text-muted)" }}
            >
              {t.hrs}
            </span>
          </p>
        </div>

        <div className="w-px self-stretch" style={{ background: "var(--border)" }} />

        <div>
          <p
            className="text-[11px] uppercase tracking-widest mb-1.5"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            {t.volume}
          </p>
          <p
            className="text-3xl font-extrabold leading-none"
            style={{ color: "#E2008A", fontFamily: "var(--font-syne)", fontWeight: 800 }}
          >
            321
          </p>
        </div>
      </div>
    </div>
  );
}
