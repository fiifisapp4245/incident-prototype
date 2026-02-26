"use client";

import { useState } from "react";
import {
  LineChart, Line, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";
import { TrendingDown, TrendingUp, Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useT } from "@/contexts/LanguageContext";
import type { PeriodData } from "@/lib/analyticsData";

// Shared tooltip style — fixes the black text issue
const TOOLTIP_STYLE = {
  contentStyle: {
    background: "var(--surface2)",
    border: "1px solid var(--border2)",
    borderRadius: 8,
    fontSize: 11,
    fontFamily: "var(--font-dm-mono)",
    color: "var(--text)",
  },
  labelStyle:  { color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" },
  itemStyle:   { color: "var(--text)",       fontFamily: "var(--font-dm-mono)" },
  cursor:      { fill: "rgba(255,255,255,0.03)" },
};

interface Props {
  data: PeriodData;
  id?: string;
}

// ─── KPI block (number + sparkline) ────────────────────────────────────────

function KPINumber({
  label, value, change, trendData, trendKey, unitLabel, sparkHeight = 40,
}: {
  label: string;
  value: number;
  change: number;
  trendData: { date: string; mttd: number; mttr: number }[];
  trendKey: "mttd" | "mttr";
  unitLabel: string;
  sparkHeight?: number;
}) {
  const improved    = change < 0;
  const changeColor = improved ? "#00c896" : "#ff3b5c";

  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[10px] uppercase tracking-widest"
        style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
      >
        {label}
      </span>
      <div className="flex items-end gap-2">
        <span
          className="text-4xl leading-none"
          style={{ fontFamily: "var(--font-syne)", fontWeight: 800, color: "var(--text)" }}
        >
          {value.toFixed(1)}
        </span>
        <span
          className="text-sm mb-1"
          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
        >
          {unitLabel}
        </span>
        <div className="flex items-center gap-1 mb-1">
          {improved
            ? <TrendingDown size={13} color={changeColor} />
            : <TrendingUp   size={13} color={changeColor} />}
          <span className="text-[11px]" style={{ fontFamily: "var(--font-dm-mono)", color: changeColor }}>
            {Math.abs(change)}%
          </span>
        </div>
      </div>

      <div style={{ height: sparkHeight, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <Line
              type="monotone"
              dataKey={trendKey}
              stroke={improved ? "#00c896" : "#ff8c00"}
              strokeWidth={1.5}
              dot={false}
            />
            <Tooltip
              {...TOOLTIP_STYLE}
              formatter={(v: number) => [`${v} ${unitLabel}`, label]}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── MTTR by severity chart ─────────────────────────────────────────────────

function SeverityBars({ data, height = 80 }: { data: PeriodData; height?: number }) {
  const t = useT();
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.mttrBySeverity}
          layout="vertical"
          margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            tick={{ fill: "var(--text-dim)", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            type="category" dataKey="severity" width={52}
            tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-dm-mono)" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            formatter={(v: number) => [`${v} ${t.minutesUnit}`, t.mttrShort]}
          />
          <Bar dataKey="avgMTTR" radius={[0, 3, 3, 0]}>
            {data.mttrBySeverity.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Engineer performance list ──────────────────────────────────────────────

function EngineerList({ data, barScale = 60 }: { data: PeriodData; barScale?: number }) {
  const t = useT();
  return (
    <div className="flex flex-col gap-1.5">
      {data.engineerLeaderboard.map((eng, i) => (
        <div key={eng.name} className="flex items-center gap-2">
          <span
            className="w-4 text-[10px] text-right shrink-0"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
          >
            {i + 1}
          </span>
          <span
            className="flex-1 text-[12px] truncate"
            style={{ fontFamily: "var(--font-ibm-sans)", color: "var(--text-muted)" }}
          >
            {eng.name}
          </span>
          <div
            className="flex-shrink-0 rounded"
            style={{
              height: 4,
              width: `${Math.round((eng.avgMTTR / 80) * barScale)}px`,
              background: i === 0 ? "#00c896" : i === 4 ? "#ff8c00" : "var(--surface3)",
              border: "1px solid var(--border2)",
            }}
          />
          <span
            className="w-16 text-right text-[11px] shrink-0"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-muted)" }}
          >
            {eng.avgMTTR}{t.minutesUnit} · {eng.resolved}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Expanded modal content ──────────────────────────────────────────────────

function ExpandedView({ data }: { data: PeriodData }) {
  const t = useT();
  return (
    <div className="flex flex-col gap-7 p-6 overflow-y-auto" style={{ maxHeight: "80vh" }}>
      {/* KPI numbers with taller sparklines */}
      <div className="grid grid-cols-2 gap-8">
        <KPINumber
          label={t.mttdFull}
          value={data.mttd}
          change={data.mttdChange}
          trendData={data.kpiTrend}
          trendKey="mttd"
          unitLabel={t.minutesUnit}
          sparkHeight={100}
        />
        <KPINumber
          label={t.mttrFull}
          value={data.mttr}
          change={data.mttrChange}
          trendData={data.kpiTrend}
          trendKey="mttr"
          unitLabel={t.minutesUnit}
          sparkHeight={100}
        />
      </div>

      {/* MTTR by severity — full width, taller */}
      <div>
        <span
          className="text-[10px] uppercase tracking-widest block mb-3"
          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
        >
          {t.mttrShort} by severity
        </span>
        <SeverityBars data={data} height={130} />
      </div>

      {/* Engineer performance — full width */}
      <div>
        <span
          className="text-[10px] uppercase tracking-widest block mb-3"
          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
        >
          {t.engineerPerfTitle}
        </span>
        <EngineerList data={data} barScale={100} />
      </div>
    </div>
  );
}

// ─── Main panel ─────────────────────────────────────────────────────────────

export default function MTTDMTTRPanel({ data, id }: Props) {
  const t = useT();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div
        id={id}
        className="rounded-xl p-5 flex flex-col gap-5 h-full"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-widest"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
          >
            {t.mttdShort} / {t.mttrShort}
          </span>
          <button
            onClick={() => setExpanded(true)}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-white/8"
            title="Expand"
            style={{ color: "var(--text-dim)" }}
          >
            <Maximize2 size={13} />
          </button>
        </div>

        {/* Two KPI numbers */}
        <div className="grid grid-cols-2 gap-5">
          <KPINumber
            label={t.mttdFull}
            value={data.mttd}
            change={data.mttdChange}
            trendData={data.kpiTrend}
            trendKey="mttd"
            unitLabel={t.minutesUnit}
          />
          <KPINumber
            label={t.mttrFull}
            value={data.mttr}
            change={data.mttrChange}
            trendData={data.kpiTrend}
            trendKey="mttr"
            unitLabel={t.minutesUnit}
          />
        </div>

        {/* MTTR by severity */}
        <div>
          <span
            className="text-[10px] uppercase tracking-widest block mb-2"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
          >
            {t.mttrShort} by severity
          </span>
          <SeverityBars data={data} height={80} />
        </div>

        {/* Engineer performance */}
        <div className="flex-1">
          <span
            className="text-[10px] uppercase tracking-widest block mb-2"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
          >
            {t.engineerPerfTitle}
          </span>
          <EngineerList data={data} barScale={60} />
        </div>
      </div>

      {/* Expanded modal */}
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          className="p-0 gap-0 overflow-hidden rounded-xl w-[640px] max-w-[95vw]"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border2)",
          }}
        >
          {/* Modal header */}
          <div
            className="flex items-center px-6 py-4"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span
              className="text-[14px] font-bold"
              style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 700 }}
            >
              {t.mttdFull} / {t.mttrFull}
            </span>
          </div>

          <ExpandedView data={data} />
        </DialogContent>
      </Dialog>
    </>
  );
}
