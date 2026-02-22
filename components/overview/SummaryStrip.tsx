"use client";

import { useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { incidents } from "@/lib/data";
import { Incident } from "@/types/incident";

interface FilterState {
  severity: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface Props {
  filters: FilterState;
}

export default function SummaryStrip({ filters }: Props) {
  const filtered = useMemo(() => {
    return incidents.filter((inc: Incident) => {
      if (filters.severity !== "All" && inc.sev !== filters.severity) return false;
      if (filters.status !== "All" && inc.status !== filters.status) return false;
      if (filters.startDate && inc.date < filters.startDate) return false;
      if (filters.endDate && inc.date > filters.endDate) return false;
      return true;
    });
  }, [filters]);

  const critical = filtered.filter((i) => i.sev === "Critical").length;
  const major    = filtered.filter((i) => i.sev === "Major").length;
  const minor    = filtered.filter((i) => i.sev === "Minor").length;

  const cards = [
    { label: "Active Incidents", value: filtered.length, accentColor: "#38bdf8", trend: 3,  trendDir: "up"   as const },
    { label: "Critical",         value: critical,         accentColor: "#ff3b5c", trend: 1,  trendDir: "up"   as const },
    { label: "Major",            value: major,            accentColor: "#ff8c00", trend: 1,  trendDir: "up"   as const },
    { label: "Minor",            value: minor,            accentColor: "#f5c518", trend: 1,  trendDir: "down" as const },
  ];

  return (
    <div className="grid grid-cols-4 gap-5">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className={`animate-fade-up delay-${i} rounded-xl p-6 flex flex-col`}
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

          <div className="flex items-center gap-1.5 mt-auto">
            <div
              className="flex items-center justify-center w-5 h-5 rounded-full shrink-0"
              style={{
                background: c.trendDir === "up"
                  ? `${c.accentColor}20`
                  : "rgba(0,200,150,0.15)",
              }}
            >
              {c.trendDir === "up" ? (
                <ArrowUp size={11} style={{ color: c.accentColor }} />
              ) : (
                <ArrowDown size={11} style={{ color: "#00c896" }} />
              )}
            </div>
            <span
              className="text-[12px]"
              style={{
                color: c.trendDir === "up" ? c.accentColor : "#00c896",
                fontFamily: "var(--font-dm-mono)",
              }}
            >
              {c.trend}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              vs yesterday
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
