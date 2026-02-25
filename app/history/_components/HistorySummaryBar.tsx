"use client";

import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { HistoricalIncident } from "@/types/incident";
import { useT } from "@/contexts/LanguageContext";

interface Props {
  incidents: HistoricalIncident[];
  startDate: string;
  endDate: string;
}

function formatDateRange(start: string, end: string): string {
  if (!start && !end) return "All time";
  const fmt = (d: string) => format(parseISO(d), "d MMM yyyy");
  if (start && end && start === end) return fmt(start);
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `From ${fmt(start)}`;
  return `Until ${end ? format(parseISO(end), "d MMM yyyy") : ""}`;
}

export default function HistorySummaryBar({ incidents, startDate, endDate }: Props) {
  const t = useT();

  const { critical, major, minor } = useMemo(() => ({
    critical: incidents.filter((i) => i.sev === "Critical").length,
    major:    incidents.filter((i) => i.sev === "Major").length,
    minor:    incidents.filter((i) => i.sev === "Minor").length,
  }), [incidents]);

  const total = incidents.length;
  const dateLabel = formatDateRange(startDate, endDate);
  const pct = (n: number) => total === 0 ? "0%" : `${Math.round((n / total) * 100)}%`;

  const cards = [
    {
      label: t.incidentsCount,
      value: total,
      accentColor: "var(--magenta)",
      sub: dateLabel,
      subIsDate: true,
    },
    {
      label: t.critical,
      value: critical,
      accentColor: "#ff3b5c",
      sub: pct(critical),
      subIsDate: false,
    },
    {
      label: t.major,
      value: major,
      accentColor: "#ff8c00",
      sub: pct(major),
      subIsDate: false,
    },
    {
      label: t.minor,
      value: minor,
      accentColor: "#f5c518",
      sub: pct(minor),
      subIsDate: false,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl p-6 flex flex-col"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            className="text-[11px] uppercase tracking-widest mb-4"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
          >
            {c.label}
          </p>

          <p
            className="text-6xl leading-none mb-5"
            style={{
              color: "var(--text)",
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
            }}
          >
            {c.value}
          </p>

          <p
            className="text-[12px] mt-auto tabular-nums"
            style={{
              color: c.subIsDate ? "var(--text-dim)" : c.accentColor,
              fontFamily: "var(--font-dm-mono)",
            }}
          >
            {c.sub}
            {!c.subIsDate && total > 0 && (
              <span style={{ color: "var(--text-dim)" }}> of total</span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
