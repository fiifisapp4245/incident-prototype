"use client";

import { Bar, Line, ComposedChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { callComposedData } from "@/lib/data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useT } from "@/contexts/LanguageContext";

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

type T = ReturnType<typeof useT>;

function CallStats({ t }: { t: T }) {
  return (
    <div className="flex gap-6">
      <div>
        <p className="text-2xl font-bold mb-0.5" style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}>
          5 <span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>{t.hrs}</span>
        </p>
        <p className="text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
          {t.averageWaitingTime}
        </p>
      </div>
      <div className="w-px self-stretch" style={{ background: "var(--border)" }} />
      <div>
        <p className="text-2xl font-bold mb-0.5" style={{ color: "var(--magenta)", fontFamily: "var(--font-syne)", fontWeight: 800 }}>
          321
        </p>
        <p className="text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
          {t.volumesOfCalls}
        </p>
      </div>
    </div>
  );
}

export default function CallDetailPanel() {
  const t = useT();
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
          {t.callOverview}
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <span
              className="text-[11px] cursor-pointer hover:opacity-70 transition-opacity"
              style={{ color: "var(--magenta)", fontFamily: "var(--font-dm-mono)" }}
            >
              {t.viewDetails}
            </span>
          </DialogTrigger>
          <DialogContent
            className="max-w-[85vw] w-[85vw] h-[90vh] flex flex-col p-0 gap-0"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <DialogHeader
              className="px-6 py-4 shrink-0"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <DialogTitle
                className="text-[11px] uppercase tracking-widest"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
              >
                {t.callOverview}
              </DialogTitle>
            </DialogHeader>

            {/* Stats */}
            <div className="px-6 pt-5 pb-4 shrink-0">
              <CallStats t={t} />
            </div>

            {/* Chart — fills remaining space */}
            <div className="flex-1 px-6 pb-6 min-h-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ComposedChart data={callComposedData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6b6b80", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
                    tickMargin={4}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6b6b80", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="volume" fill="var(--color-volume)" fillOpacity={0.5} radius={[2, 2, 0, 0]} animationDuration={800} />
                  <Line dataKey="trend" type="linear" stroke="var(--color-trend)" strokeWidth={1.5} dot={false} animationDuration={800} />
                </ComposedChart>
              </ChartContainer>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-4">
        <CallStats t={t} />
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
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey="volume" fill="var(--color-volume)" fillOpacity={0.5} radius={[2, 2, 0, 0]} animationDuration={800} />
          <Line dataKey="trend" type="linear" stroke="var(--color-trend)" strokeWidth={1.5} dot={false} animationDuration={800} />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
