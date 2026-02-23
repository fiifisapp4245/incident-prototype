"use client";

import { useMemo } from "react";
import { incidents } from "@/lib/data";
import { Incident } from "@/types/incident";
import IncidentCard from "./IncidentCard";
import { useT } from "@/contexts/LanguageContext";

interface FilterState {
  severity: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface Props {
  filters: FilterState;
}

export default function IncidentFeed({ filters }: Props) {
  const t = useT();

  const filtered = useMemo(() => {
    return incidents.filter((inc: Incident) => {
      if (filters.severity !== "All" && inc.sev !== filters.severity) return false;
      if (filters.status !== "All" && inc.status !== filters.status) return false;
      if (filters.startDate && inc.date < filters.startDate) return false;
      if (filters.endDate && inc.date > filters.endDate) return false;
      return true;
    });
  }, [filters]);

  return (
    <div
      className="rounded-xl p-6 flex flex-col"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <p
          className="text-[11px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          {t.liveIncidentFeed}
        </p>
        <span
          className="flex items-center gap-1.5 text-[12px] cursor-pointer"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          {t.viewAllIncidents}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      <div
        className="flex flex-col gap-2 overflow-y-auto pr-1"
        style={{ maxHeight: "540px" }}
      >
        {filtered.length === 0 ? (
          <div
            className="text-center py-12 text-[13px]"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            {t.noIncidentsMatch}
          </div>
        ) : (
          filtered.map((inc) => <IncidentCard key={inc.id} incident={inc} />)
        )}
      </div>
    </div>
  );
}
