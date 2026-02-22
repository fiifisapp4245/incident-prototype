"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ticketData } from "@/lib/data";
import { SEV_COLOR } from "@/lib/utils";

const pieData = [
  { name: "In Progress", value: 23, color: "#ff8c00" },
  { name: "To Do", value: 64, color: "#ff3b5c" },
  { name: "Done", value: 12, color: "#00c896" },
];

const statusColor: Record<string, string> = {
  "In Progress": "#ff8c00",
  "To Do": "#ff3b5c",
  Done: "#00c896",
};

export default function TicketDetailPanel() {
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
        Ticket Flow
      </p>

      <div className="flex gap-8 mb-6">
        {/* Donut */}
        <div className="relative shrink-0" style={{ width: 180, height: 180 }}>
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={88}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={800}
                >
                  {pieData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
          {/* Center */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <span
              className="text-2xl font-extrabold leading-none"
              style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}
            >
              87
            </span>
            <span
              className="text-[10px]"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              Tickets
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-4 justify-center">
          {pieData.map((d) => (
            <div key={d.name}>
              <p
                className="text-[11px] uppercase tracking-widest mb-0.5"
                style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
              >
                {d.name}
              </p>
              <p
                className="text-3xl font-extrabold"
                style={{ color: d.color, fontFamily: "var(--font-syne)", fontWeight: 800 }}
              >
                {d.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Ticket", "Summary", "Status"].map((h) => (
              <th key={h} className="text-left pb-2 pr-4" style={{ color: "var(--text-dim)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ticketData.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
              <td className="py-2 pr-4" style={{ color: "var(--text-muted)" }}>
                {row.ticket}
              </td>
              <td className="py-2 pr-4" style={{ color: "var(--text-muted)" }}>
                {row.summary}
              </td>
              <td className="py-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px]"
                  style={{
                    color: statusColor[row.status],
                    background: `${statusColor[row.status]}18`,
                    border: `1px solid ${statusColor[row.status]}33`,
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
