"use client";

import { Pie, PieChart } from "recharts";
import { ticketData } from "@/lib/data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useT } from "@/contexts/LanguageContext";

const chartConfig = {
  value:      { label: "Tickets" },
  inProgress: { label: "In Progress", color: "#ff8c00" },
  toDo:       { label: "To Do",       color: "#ff3b5c" },
  done:       { label: "Done",        color: "#00c896" },
} satisfies ChartConfig;

const statusColor: Record<string, string> = {
  "In Progress": "#ff8c00",
  "To Do":       "#ff3b5c",
  Done:          "#00c896",
};

type T = ReturnType<typeof useT>;

function TicketTable({ headers, statusLabels }: { headers: [string, string, string]; statusLabels: Record<string, string> }) {
  return (
    <table className="w-full text-[11px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--border)" }}>
          {headers.map((h) => (
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
                {statusLabels[row.status] || row.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TicketDetailPanel() {
  const t = useT();

  const pieData = [
    { status: "inProgress", label: t.inProgress, value: 23, fill: "var(--color-inProgress)" },
    { status: "toDo",       label: t.toDo,       value: 64, fill: "var(--color-toDo)" },
    { status: "done",       label: t.done,        value: 12, fill: "var(--color-done)" },
  ];

  const ticketHeaders: [string, string, string] = [t.ticket, t.summary, t.status];
  const statusLabels: Record<string, string> = {
    "In Progress": t.inProgress,
    "To Do":       t.toDo,
    Done:          t.done,
  };

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
          {t.ticketFlow}
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <span
              className="text-[11px] cursor-pointer hover:opacity-70 transition-opacity"
              style={{ color: "var(--magenta)", fontFamily: "var(--font-dm-mono)" }}
            >
              {t.viewDetails}
            </span>
          </DialogTrigger>
          <DialogContent
            className="max-w-[85vw] w-[85vw] h-[90vh] flex flex-col p-0 gap-0"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <DialogHeader
              className="px-6 py-4 shrink-0"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <DialogTitle
                className="text-[11px] uppercase tracking-widest"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
              >
                {t.ticketFlow}
              </DialogTitle>
            </DialogHeader>

            {/* Stats row */}
            <div className="flex gap-6 px-6 pt-5 pb-4 shrink-0">
              {pieData.map((d) => (
                <div key={d.status}>
                  <p
                    className="text-2xl font-extrabold leading-none mb-0.5"
                    style={{ color: `var(--color-${d.status})`, fontFamily: "var(--font-syne)", fontWeight: 800 }}
                  >
                    {d.value}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
                    {d.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart — fixed */}
            <div className="relative shrink-0" style={{ height: 260 }}>
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[260px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={pieData} dataKey="value" nameKey="status" innerRadius={72} outerRadius={110} strokeWidth={0} animationDuration={800} />
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold leading-none" style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}>87</span>
                <span className="text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>{t.tickets}</span>
              </div>
            </div>

            {/* Table — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <TicketTable headers={ticketHeaders} statusLabels={statusLabels} />
            </div>
          </DialogContent>
        </Dialog>
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
            <Pie data={pieData} dataKey="value" nameKey="status" innerRadius={52} outerRadius={80} strokeWidth={0} animationDuration={800} />
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold leading-none" style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}>87</span>
          <span className="text-[10px]" style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>{t.tickets}</span>
        </div>
      </div>

      {/* Table */}
      <TicketTable headers={ticketHeaders} statusLabels={statusLabels} />
    </div>
  );
}
