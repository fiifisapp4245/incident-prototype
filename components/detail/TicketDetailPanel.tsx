"use client";

import { Pie, PieChart } from "recharts";
import { ticketData } from "@/lib/data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const pieData = [
  { status: "inProgress", label: "In Progress", value: 23, fill: "var(--color-inProgress)" },
  { status: "toDo",       label: "To Do",        value: 64, fill: "var(--color-toDo)" },
  { status: "done",       label: "Done",         value: 12, fill: "var(--color-done)" },
];

const chartConfig = {
  value: { label: "Tickets" },
  inProgress: { label: "In Progress", color: "#ff8c00" },
  toDo:       { label: "To Do",       color: "#ff3b5c" },
  done:       { label: "Done",        color: "#00c896" },
} satisfies ChartConfig;

const statusColor: Record<string, string> = {
  "In Progress": "#ff8c00",
  "To Do": "#ff3b5c",
  Done: "#00c896",
};

export default function TicketDetailPanel() {
  return (
    <div
      className="rounded-lg p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-[11px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          Ticket Flow
        </p>
        <span
          className="text-[11px] cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: "var(--magenta)", fontFamily: "var(--font-dm-mono)" }}
        >
          View Details
        </span>
      </div>

      {/* Stats row */}
      <div className="flex gap-6 mb-4">
        {pieData.map((d) => (
          <div key={d.status}>
            <p
              className="text-2xl font-extrabold leading-none mb-0.5"
              style={{ color: `var(--color-${d.status})`, fontFamily: "var(--font-syne)", fontWeight: 800 }}
            >
              {d.value}
            </p>
            <p
              className="text-[10px]"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              {d.label}
            </p>
          </div>
        ))}
      </div>

      {/* Donut chart */}
      <div className="relative mb-4">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[180px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="status"
              innerRadius={52}
              outerRadius={80}
              strokeWidth={0}
              animationDuration={800}
            />
          </PieChart>
        </ChartContainer>
        {/* Centre label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
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
              <td className="py-2 pr-4" style={{ color: "var(--text-muted)" }}>{row.ticket}</td>
              <td className="py-2 pr-4" style={{ color: "var(--text-muted)" }}>{row.summary}</td>
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
