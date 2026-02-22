"use client";

import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "To Do", value: 23, color: "#ff3b5c" },
  { name: "In Progress", value: 52, color: "#ff8c00" },
  { name: "Done", value: 12, color: "#00c896" },
];

const total = data.reduce((s, d) => s + d.value, 0);

export default function TicketFlowPanel() {
  return (
    <div
      className="rounded-xl p-6 flex flex-col h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-[11px] uppercase tracking-widest mb-5"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Ticket Flow
      </p>

      <div className="flex items-center gap-6 flex-1">
        {/* Donut with center label */}
        <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
          <PieChart width={160} height={160}>
            <Pie
              data={data}
              cx={80}
              cy={80}
              innerRadius={52}
              outerRadius={72}
              dataKey="value"
              strokeWidth={0}
              animationDuration={800}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className="text-2xl font-extrabold leading-none"
              style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}
            >
              {total}
            </span>
            <span
              className="text-[9px] uppercase tracking-wider mt-1 text-center leading-tight"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              Open
              <br />
              Tickets
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-4 flex-1">
          {data.map((d) => (
            <div key={d.name}>
              <div className="flex items-center justify-between mb-1">
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
                <span
                  className="text-[15px] font-bold"
                  style={{ color: d.color, fontFamily: "var(--font-syne)", fontWeight: 700 }}
                >
                  {d.value}
                </span>
              </div>
              {/* Mini progress bar per category */}
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: "var(--surface3)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(d.value / total) * 100}%`,
                    background: d.color,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
