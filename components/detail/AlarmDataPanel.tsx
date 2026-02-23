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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useT } from "@/contexts/LanguageContext";

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

function AlarmTable({ headers }: { headers: [string, string, string] }) {
  return (
    <table className="w-full text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--border)" }}>
          {headers.map((h) => (
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
  );
}

export default function AlarmDataPanel() {
  const t = useT();
  const stats = [
    { label: t.critical, val: "1,250", color: "#ff3b5c" },
    { label: t.major,    val: "674",   color: "#ff8c00" },
    { label: t.minor,    val: "1,250", color: "#f5c518" },
  ];
  const alarmHeaders: [string, string, string] = [t.alarm, t.duration, t.status];

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
          {t.alarmData}
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
                {t.alarmData}
              </DialogTitle>
            </DialogHeader>

            {/* Stats row */}
            <div className="flex gap-6 px-6 pt-5 pb-4 shrink-0">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
                    {s.label}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: "var(--font-syne)", fontWeight: 800 }}>
                    {s.val}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart — fixed */}
            <div className="px-6 shrink-0 h-[260px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart data={alarmChartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradMajorD" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-major)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-major)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCriticalD" x1="0" y1="0" x2="0" y2="1">
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
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Area dataKey="major" type="natural" fill="url(#gradMajorD)" stroke="var(--color-major)" strokeWidth={1.5} stackId="a" animationDuration={800} />
                  <Area dataKey="critical" type="natural" fill="url(#gradCriticalD)" stroke="var(--color-critical)" strokeWidth={1.5} stackId="a" animationDuration={800} />
                </AreaChart>
              </ChartContainer>
            </div>

            {/* Table — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <AlarmTable headers={alarmHeaders} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-3">
        {stats.map((s) => (
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
          <AreaChart data={alarmChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area dataKey="major" type="natural" fill="url(#gradMajor)" stroke="var(--color-major)" strokeWidth={1.5} stackId="a" animationDuration={800} />
            <Area dataKey="critical" type="natural" fill="url(#gradCritical)" stroke="var(--color-critical)" strokeWidth={1.5} stackId="a" animationDuration={800} />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Table */}
      <AlarmTable headers={alarmHeaders} />
    </div>
  );
}
