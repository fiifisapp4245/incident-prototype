"use client";

import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Critical", value: 3, color: "#ff3b5c" },
  { name: "Major", value: 6, color: "#ff8c00" },
  { name: "Minor", value: 5, color: "#f5c518" },
  { name: "Resolved", value: 12, color: "#00c896" },
];

const total = data.reduce((s, d) => s + d.value, 0);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0];
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
        <span style={{ color: d.payload.color }}>{d.name}</span>: {d.value} (
        {Math.round((d.value / total) * 100)}%)
      </div>
    );
  }
  return null;
};

export default function SeverityDonut() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimeout(() => setAnimated(true), 120);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-xl p-6 h-full flex flex-col"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-[11px] uppercase tracking-widest mb-5"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Severity Distribution
      </p>

      <div className="flex items-center gap-6 flex-1">
        {/* Donut with center label */}
        <div className="relative shrink-0" style={{ width: 180, height: 180 }}>
          <PieChart width={180} height={180}>
            <Pie
              data={data}
              cx={90}
              cy={90}
              innerRadius={58}
              outerRadius={86}
              dataKey="value"
              strokeWidth={0}
              animationDuration={800}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className="text-3xl font-extrabold leading-none"
              style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}
            >
              {total}
            </span>
            <span
              className="text-[9px] uppercase tracking-wider mt-1 text-center leading-tight"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              Total
              <br />
              Incidents
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-4 flex-1">
          {data.map((d) => {
            const pct = Math.round((d.value / total) * 100);
            return (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ background: d.color }}
                    />
                    <span
                      className="text-[12px]"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {d.name}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-[15px] font-bold leading-none"
                      style={{ color: d.color, fontFamily: "var(--font-syne)", fontWeight: 700 }}
                    >
                      {d.value}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: "var(--surface3)" }}
                >
                  <div
                    className="h-full rounded-full progress-bar"
                    style={{
                      width: animated ? `${pct}%` : "0%",
                      background: d.color,
                      opacity: 0.75,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
