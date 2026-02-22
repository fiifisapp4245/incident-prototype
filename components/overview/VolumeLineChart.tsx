"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
import { volumeData } from "@/lib/data";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="px-3 py-2 rounded text-[11px] space-y-1"
        style={{
          background: "var(--surface2)",
          border: "1px solid var(--border2)",
          fontFamily: "var(--font-dm-mono)",
        }}
      >
        <p style={{ color: "var(--text-muted)" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex gap-4 justify-end mb-2">
      {payload.map((p: any) => (
        <div key={p.value} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm" style={{ background: p.color }} />
          <span className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}>
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function VolumeLineChart() {
  return (
    <div
      className="rounded-xl p-6 h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-[11px] uppercase tracking-widest mb-5"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Incident Volume · Last 24hrs
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={volumeData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff3b5c" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#ff3b5c" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="majGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff8c00" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#ff8c00" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f5c518" stopOpacity={0.08} />
              <stop offset="95%" stopColor="#f5c518" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fill: "#6b6b80", fontSize: 10, fontFamily: "var(--font-dm-mono)" }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fill: "#6b6b80", fontSize: 10, fontFamily: "var(--font-dm-mono)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
          <Area
            type="monotone"
            dataKey="Critical"
            stroke="#ff3b5c"
            strokeWidth={2}
            fill="url(#critGrad)"
            dot={false}
            animationDuration={800}
          />
          <Area
            type="monotone"
            dataKey="Major"
            stroke="#ff8c00"
            strokeWidth={2}
            fill="url(#majGrad)"
            dot={false}
            animationDuration={800}
          />
          <Area
            type="monotone"
            dataKey="Minor"
            stroke="#f5c518"
            strokeWidth={1.5}
            fill="url(#minGrad)"
            dot={false}
            animationDuration={800}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
