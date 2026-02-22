"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { downDetectorData } from "@/lib/data";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="px-3 py-2 rounded text-[11px]"
        style={{
          background: "var(--surface2)",
          border: "1px solid var(--border2)",
          fontFamily: "var(--font-dm-mono)",
          color: "#ff8c00",
        }}
      >
        {label}: {payload[0]?.value}%
      </div>
    );
  }
  return null;
};

export default function DownDetectorDetailPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="rounded-lg p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-[11px] uppercase tracking-widest mb-2"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Down Detector — Detail
      </p>

      <p
        className="text-4xl font-bold mb-0.5"
        style={{ color: "#ff8c00", fontFamily: "var(--font-syne)", fontWeight: 800 }}
      >
        60%
      </p>
      <p
        className="text-[10px] mb-4"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
      >
        Current user score
      </p>

      {mounted ? (
        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={downDetectorData} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff8c00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff8c00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#6b6b80", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#6b6b80", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={50}
              stroke="rgba(255,255,255,0.15)"
              strokeDasharray="4 3"
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#ff8c00"
              strokeWidth={2}
              fill="url(#ddGrad)"
              dot={false}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: 110 }} />
      )}
    </div>
  );
}
