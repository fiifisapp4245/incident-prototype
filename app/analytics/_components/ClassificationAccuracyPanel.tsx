"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useT } from "@/contexts/LanguageContext";
import type { PeriodData } from "@/lib/analyticsData";

const CORRECT_COLOR     = "#00c896";
const ESCALATED_COLOR   = "#38bdf8";
const DOWNGRADED_COLOR  = "#ff8c00";
const FP_COLOR          = "#ff3b5c";

interface Props {
  data: PeriodData;
}

export default function ClassificationAccuracyPanel({ data }: Props) {
  const t = useT();

  const chartData = data.classAccuracy.map((row) => ({
    name: row.initial,
    [t.correct]:      row.correct,
    [t.escalated]:    row.escalated,
    [t.downgraded]:   row.downgraded,
    [t.falsePositive]: row.falsePositive,
  }));

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4 h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div>
        <span
          className="text-[10px] uppercase tracking-widest block"
          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
        >
          {t.classAccuracyTitle}
        </span>
        <p
          className="text-[11px] mt-1 leading-snug"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          How initial AI classifications resolved
        </p>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-dim)", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
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
              formatter={(v: number, name: string) => [`${v}%`, name]}
            />
            <Bar dataKey={t.correct}      stackId="a" fill={CORRECT_COLOR}    radius={[0,0,0,0]} />
            <Bar dataKey={t.escalated}    stackId="a" fill={ESCALATED_COLOR}  radius={[0,0,0,0]} />
            <Bar dataKey={t.downgraded}   stackId="a" fill={DOWNGRADED_COLOR} radius={[0,0,0,0]} />
            <Bar dataKey={t.falsePositive} stackId="a" fill={FP_COLOR}        radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {[
          { color: CORRECT_COLOR,    label: t.correct      },
          { color: ESCALATED_COLOR,  label: t.escalated    },
          { color: DOWNGRADED_COLOR, label: t.downgraded   },
          { color: FP_COLOR,         label: t.falsePositive },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: item.color }} />
            <span
              className="text-[10px]"
              style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
