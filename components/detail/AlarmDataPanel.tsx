"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { alarmChartData, alarmTableData } from "@/lib/data";
import { STATUS_COLOR, SEV_COLOR } from "@/lib/utils";

export default function AlarmDataPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="rounded-lg p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-[11px] uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Alarm Data
      </p>

      {/* Stats row */}
      <div className="flex gap-4 mb-3">
        {[
          { label: "Critical", val: "1,250", color: "#ff3b5c" },
          { label: "Major", val: "674", color: "#ff8c00" },
          { label: "Minor", val: "1,250", color: "#f5c518" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
              {s.label}
            </p>
            <p className="text-xl font-bold" style={{ color: s.color, fontFamily: "var(--font-syne)", fontWeight: 800 }}>
              {s.val}
            </p>
          </div>
        ))}
      </div>

      {/* Mini area chart */}
      <div className="mb-4">
        {mounted ? (
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={alarmChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="aGradC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3b5c" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ff3b5c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aGradM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff8c00" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ff8c00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="critical" stroke="#ff3b5c" strokeWidth={1.5} fill="url(#aGradC)" dot={false} animationDuration={800} />
              <Area type="monotone" dataKey="major" stroke="#ff8c00" strokeWidth={1.5} fill="url(#aGradM)" dot={false} animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 80 }} />
        )}
      </div>

      {/* Table */}
      <table className="w-full text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Alarm", "Duration", "Status"].map((h) => (
              <th key={h} className="text-left pb-2 pr-3" style={{ color: "var(--text-dim)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alarmTableData.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
              <td className="py-2 pr-3" style={{ color: "var(--text-muted)" }}>{row.alarm}</td>
              <td className="py-2 pr-3" style={{ color: "var(--text-muted)" }}>{row.duration}</td>
              <td className="py-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px]"
                  style={{
                    color: SEV_COLOR[row.status] || "var(--text-muted)",
                    background: `${SEV_COLOR[row.status] || "#fff"}18`,
                    border: `1px solid ${SEV_COLOR[row.status] || "#fff"}33`,
                  }}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
