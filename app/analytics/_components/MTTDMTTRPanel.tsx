"use client";

import {
  LineChart, Line, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import type { PeriodData } from "@/lib/analyticsData";

interface Props {
  data: PeriodData;
  id?: string;
}

function KPINumber({
  label,
  value,
  change,
  trendData,
  trendKey,
  unitLabel,
}: {
  label: string;
  value: number;
  change: number;
  trendData: { date: string; mttd: number; mttr: number }[];
  trendKey: "mttd" | "mttr";
  unitLabel: string;
}) {
  const improved = change < 0;
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
          {improved ? (
            <TrendingDown size={13} color={changeColor} />
          ) : (
            <TrendingUp size={13} color={changeColor} />
          )}
          <span
            className="text-[11px]"
            style={{ fontFamily: "var(--font-dm-mono)", color: changeColor }}
          >
            {Math.abs(change)}%
          </span>
        </div>
      </div>

      {/* Mini trend sparkline */}
      <div style={{ height: 40, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <Line
              type="monotone"
              dataKey={trendKey}
              stroke={improved ? "#00c896" : "#ff8c00"}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function MTTDMTTRPanel({ data, id }: Props) {
  const t = useT();

  return (
    <div
      id={id}
      className="rounded-xl p-5 flex flex-col gap-5 h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <span
        className="text-[10px] uppercase tracking-widest"
        style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
      >
        {t.mttdShort} / {t.mttrShort}
      </span>

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
        <div style={{ height: 80 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.mttrBySeverity}
              layout="vertical"
              margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
              />
              <XAxis
                type="number"
                tick={{ fill: "var(--text-dim)", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="severity"
                width={52}
                tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-dm-mono)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                contentStyle={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border2)",
                  borderRadius: 8,
                  fontSize: 11,
                  fontFamily: "var(--font-dm-mono)",
                  color: "var(--text)",
                }}
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
      </div>

      {/* Engineer performance */}
      <div className="flex-1">
        <span
          className="text-[10px] uppercase tracking-widest block mb-2"
          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
        >
          {t.engineerPerfTitle}
        </span>
        <div className="flex flex-col gap-1.5">
          {data.engineerLeaderboard.map((eng, i) => (
            <div key={eng.name} className="flex items-center gap-2">
              {/* Rank */}
              <span
                className="w-4 text-[10px] text-right shrink-0"
                style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
              >
                {i + 1}
              </span>
              {/* Name */}
              <span
                className="flex-1 text-[12px] truncate"
                style={{ fontFamily: "var(--font-ibm-sans)", color: "var(--text-muted)" }}
              >
                {eng.name}
              </span>
              {/* Bar */}
              <div
                className="flex-shrink-0 rounded"
                style={{
                  height: 4,
                  width: `${Math.round((eng.avgMTTR / 80) * 60)}px`,
                  background: i === 0 ? "#00c896" : i === 4 ? "#ff8c00" : "var(--surface3)",
                  border: "1px solid var(--border2)",
                }}
              />
              {/* Value */}
              <span
                className="w-14 text-right text-[11px] shrink-0"
                style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-muted)" }}
              >
                {eng.avgMTTR}{t.minutesUnit} · {eng.resolved}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
