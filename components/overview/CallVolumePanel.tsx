"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { callVolumeData } from "@/lib/data";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="px-3 py-2 rounded text-[11px]"
        style={{
          background: "var(--surface2)",
          border: "1px solid var(--border2)",
          fontFamily: "var(--font-dm-mono)",
          color: "#E2008A",
        }}
      >
        {label}h: {payload[0]?.value} calls
      </div>
    );
  }
  return null;
};

export default function CallVolumePanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="rounded-xl p-6 flex flex-col h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-[11px] uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Call Volume · Support Centre
      </p>

      {mounted ? (
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={callVolumeData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="callGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E2008A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#E2008A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#E2008A"
              strokeWidth={2}
              fill="url(#callGrad)"
              dot={false}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: 140 }} />
      )}

      {/* Stats */}
      <div
        className="flex gap-6 mt-5 pt-5"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div>
          <p
            className="text-[11px] uppercase tracking-widest mb-1.5"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            Avg Wait
          </p>
          <p
            className="text-3xl font-extrabold leading-none"
            style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}
          >
            5.2
            <span
              className="text-base font-normal ml-1"
              style={{ color: "var(--text-muted)" }}
            >
              hrs
            </span>
          </p>
        </div>

        <div className="w-px self-stretch" style={{ background: "var(--border)" }} />

        <div>
          <p
            className="text-[11px] uppercase tracking-widest mb-1.5"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            Volume
          </p>
          <p
            className="text-3xl font-extrabold leading-none"
            style={{ color: "#E2008A", fontFamily: "var(--font-syne)", fontWeight: 800 }}
          >
            321
          </p>
        </div>
      </div>
    </div>
  );
}
