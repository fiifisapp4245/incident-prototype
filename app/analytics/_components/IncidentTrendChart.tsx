"use client";

import { useMemo } from "react";
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Brush, ResponsiveContainer,
} from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { useT } from "@/contexts/LanguageContext";
import { allTrendData, type AnalyticsPeriod } from "@/lib/analyticsData";

const COLORS = {
  critical: "#ff3b5c",
  major:    "#ff8c00",
  minor:    "#f5c518",
};

interface Props {
  period: AnalyticsPeriod;
  id?: string;
}

function periodDays(period: AnalyticsPeriod): number {
  if (period === "7d")  return 7;
  if (period === "30d") return 30;
  return 90; // 90d and custom both show all
}

export default function IncidentTrendChart({ period, id }: Props) {
  const t = useT();

  const data = useMemo(() => {
    const days = periodDays(period);
    const cutoff = format(subDays(new Date(), days - 1), "yyyy-MM-dd");
    return allTrendData.filter((d) => d.date >= cutoff);
  }, [period]);

  const tickFormatter = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), period === "7d" ? "EEE d" : "d MMM");
    } catch {
      return dateStr;
    }
  };

  const tickCount = period === "7d" ? 7 : period === "30d" ? 10 : 12;

  return (
    <section id={id}>
      {/* Section label */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
        >
          {t.incidentTrendTitle}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      <div
        className="rounded-xl p-5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="gradCrit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={COLORS.critical} stopOpacity={0.25} />
                <stop offset="95%" stopColor={COLORS.critical} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradMaj" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={COLORS.major} stopOpacity={0.25} />
                <stop offset="95%" stopColor={COLORS.major} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={COLORS.minor} stopOpacity={0.20} />
                <stop offset="95%" stopColor={COLORS.minor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="date"
              tickFormatter={tickFormatter}
              tick={{ fill: "var(--text-dim)", fontSize: 10, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
              interval={Math.floor(data.length / tickCount)}
            />
            <YAxis
              tick={{ fill: "var(--text-dim)", fontSize: 10, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                background: "var(--surface2)",
                border: "1px solid var(--border2)",
                borderRadius: 8,
                fontSize: 11,
                fontFamily: "var(--font-dm-mono)",
                color: "var(--text)",
              }}
              labelFormatter={(label) => {
                try { return format(parseISO(label as string), "d MMM yyyy"); }
                catch { return label; }
              }}
              formatter={(value: number, name: string) => [value, name]}
            />

            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: 11,
                fontFamily: "var(--font-dm-mono)",
                color: "var(--text-muted)",
                paddingTop: 8,
              }}
            />

            <Area
              type="monotone"
              dataKey="minor"
              name={t.minor}
              stroke={COLORS.minor}
              fill="url(#gradMin)"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Area
              type="monotone"
              dataKey="major"
              name={t.major}
              stroke={COLORS.major}
              fill="url(#gradMaj)"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <Area
              type="monotone"
              dataKey="critical"
              name={t.critical}
              stroke={COLORS.critical}
              fill="url(#gradCrit)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />

            {/* Brush zoom control */}
            <Brush
              dataKey="date"
              height={24}
              stroke="var(--border2)"
              fill="var(--surface2)"
              travellerWidth={6}
              tickFormatter={tickFormatter}
              style={{
                fontSize: 9,
                fontFamily: "var(--font-dm-mono)",
                color: "var(--text-dim)",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
