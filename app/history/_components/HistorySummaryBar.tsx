"use client";

import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { HistoricalIncident } from "@/types/incident";
import { useT } from "@/contexts/LanguageContext";

interface Props {
  incidents: HistoricalIncident[];
  startDate: string;
  endDate: string;
  selectedDay: string | null;
}

function formatDateRange(start: string, end: string, selectedDay: string | null): string {
  if (selectedDay) {
    return format(parseISO(selectedDay), "d MMM yyyy");
  }
  if (!start && !end) return "All time";
  const fmt = (d: string) => format(parseISO(d), "d MMM yyyy");
  if (start && end && start === end) return fmt(start);
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `From ${fmt(start)}`;
  return `Until ${end ? format(parseISO(end), "d MMM yyyy") : ""}`;
}

export default function HistorySummaryBar({ incidents, startDate, endDate, selectedDay }: Props) {
  const t = useT();

  const counts = useMemo(() => {
    const critical = incidents.filter((i) => i.sev === "Critical").length;
    const major = incidents.filter((i) => i.sev === "Major").length;
    const minor = incidents.filter((i) => i.sev === "Minor").length;
    return { critical, major, minor };
  }, [incidents]);

  const dateLabel = formatDateRange(startDate, endDate, selectedDay);

  return (
    <div
      className="flex items-center gap-4 px-5 py-3 rounded-xl flex-wrap"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <span
        className="text-[13px]"
        style={{ color: "var(--text)", fontFamily: "var(--font-dm-mono)" }}
      >
        <span style={{ color: "var(--text-muted)" }}>{t.showing} </span>
        <span style={{ fontWeight: 600 }}>{incidents.length}</span>
        <span style={{ color: "var(--text-muted)" }}> {t.incidentsCount}</span>
      </span>

      <span
        className="text-[11px]"
        style={{ color: "var(--border2)", fontFamily: "var(--font-dm-mono)" }}
      >
        ·
      </span>

      <span
        className="text-[12px] tabular-nums"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
      >
        {dateLabel}
      </span>

      {incidents.length > 0 && (
        <>
          <span
            className="text-[11px]"
            style={{ color: "var(--border2)", fontFamily: "var(--font-dm-mono)" }}
          >
            ·
          </span>

          {counts.critical > 0 && (
            <span
              className="text-[12px] font-medium"
              style={{ color: "#ff3b5c", fontFamily: "var(--font-dm-mono)" }}
            >
              {counts.critical} {t.critical}
            </span>
          )}

          {counts.major > 0 && (
            <span
              className="text-[12px] font-medium"
              style={{ color: "#ff8c00", fontFamily: "var(--font-dm-mono)" }}
            >
              {counts.major} {t.major}
            </span>
          )}

          {counts.minor > 0 && (
            <span
              className="text-[12px] font-medium"
              style={{ color: "#f5c518", fontFamily: "var(--font-dm-mono)" }}
            >
              {counts.minor} {t.minor}
            </span>
          )}
        </>
      )}

      {selectedDay && (
        <span
          className="ml-auto text-[11px] px-2 py-0.5 rounded-full cursor-pointer transition-opacity hover:opacity-70"
          style={{
            background: "rgba(226,0,138,0.12)",
            border: "1px solid rgba(226,0,138,0.25)",
            color: "var(--magenta)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          {t.deselectDay}
        </span>
      )}
    </div>
  );
}
