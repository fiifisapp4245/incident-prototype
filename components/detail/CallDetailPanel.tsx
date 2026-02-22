"use client";

import { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { callComposedData } from "@/lib/data";

export default function CallDetailPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="rounded-lg p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-[11px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          Call Overview
        </p>
        <span
          className="text-[11px] cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: "var(--magenta)", fontFamily: "var(--font-dm-mono)" }}
        >
          View Details
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-4">
        <div>
          <p className="text-2xl font-bold mb-0.5" style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}>
            5 <span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>hrs</span>
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
            Average waiting time
          </p>
        </div>
        <div className="w-px self-stretch" style={{ background: "var(--border)" }} />
        <div>
          <p className="text-2xl font-bold mb-0.5" style={{ color: "var(--magenta)", fontFamily: "var(--font-syne)", fontWeight: 800 }}>
            321
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
            Volumes of calls
          </p>
        </div>
      </div>

      {/* Composed chart */}
      {mounted ? (
        <ResponsiveContainer width="100%" height={120}>
          <ComposedChart data={callComposedData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fill: "#6b6b80", fontSize: 9, fontFamily: "var(--font-dm-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="volume" fill="rgba(226,0,138,0.5)" radius={[2, 2, 0, 0]} animationDuration={800} />
            <Line type="monotone" dataKey="trend" stroke="#38bdf8" strokeWidth={1.5} dot={false} animationDuration={800} />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: 120 }} />
      )}
    </div>
  );
}
