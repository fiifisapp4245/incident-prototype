"use client";

import { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const services = [
  { name: "4G/5G Data", x: 6, y: 8.7, r: 22, fill: "rgba(255,59,92,0.35)", stroke: "#ff3b5c" },
  { name: "Voice", x: 3, y: 5.2, r: 14, fill: "rgba(255,140,0,0.3)", stroke: "#ff8c00" },
  { name: "SMS", x: 2, y: 3.1, r: 9, fill: "rgba(245,197,24,0.3)", stroke: "#f5c518" },
  { name: "Roaming", x: 1, y: 2.0, r: 7, fill: "rgba(56,189,248,0.25)", stroke: "#38bdf8" },
  { name: "IoT/M2M", x: 1, y: 1.4, r: 5, fill: "rgba(0,200,150,0.25)", stroke: "#00c896" },
];

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={payload.r}
      fill={payload.fill}
      stroke={payload.stroke}
      strokeWidth={1.5}
    />
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0]?.payload;
    return (
      <div
        className="px-3 py-2 rounded text-[11px]"
        style={{
          background: "var(--surface2)",
          border: "1px solid var(--border2)",
          fontFamily: "var(--font-dm-mono)",
          color: "var(--text)",
        }}
      >
        <p style={{ color: d.stroke }}>{d.name}</p>
        <p style={{ color: "var(--text-muted)" }}>Incidents: {d.x}</p>
        <p style={{ color: "var(--text-muted)" }}>Avg Score: {d.y}</p>
      </div>
    );
  }
  return null;
};

export default function AffectedServicesBubble() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="rounded-xl p-6 h-full flex flex-col"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-[11px] uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Affected Services
      </p>

      {/* Chart + right-side legend */}
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 min-w-0">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Incident Count"
                  domain={[0, 8]}
                  tick={{ fill: "#6b6b80", fontSize: 10, fontFamily: "var(--font-dm-mono)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Avg Severity Score"
                  domain={[0, 10]}
                  tick={{ fill: "#6b6b80", fontSize: 10, fontFamily: "var(--font-dm-mono)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={services} shape={<CustomDot />} animationDuration={800}>
                  {services.map((s, i) => (
                    <Cell key={i} fill={s.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* Right-side legend */}
        <div className="flex flex-col justify-center gap-3 shrink-0">
          {services.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: s.stroke }}
              />
              <span
                className="text-[11px]"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
              >
                {s.name}
              </span>
            </div>
          ))}
          <p
            className="text-[9px] mt-2 leading-tight"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            Bubble size =<br />Customer Impact
          </p>
        </div>
      </div>
    </div>
  );
}
