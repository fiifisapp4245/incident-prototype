"use client";

import { format, parseISO } from "date-fns";
import { CheckSquare, Square, CheckCircle } from "lucide-react";
import { HistoricalIncident } from "@/types/incident";
import { SEV_COLOR, SEV_BG } from "@/lib/utils";
import { useT } from "@/contexts/LanguageContext";

interface Props {
  incident: HistoricalIncident;
  selected: boolean;
  onToggle: (id: string) => void;
  selectionDisabled?: boolean; // max 3 reached and this one isn't selected
}

function formatDateTime(date: string, time: string): string {
  return `${format(parseISO(date), "d MMM")} · ${time}`;
}

export default function HistoryCard({ incident, selected, onToggle, selectionDisabled }: Props) {
  const t = useT();
  const sevColor = SEV_COLOR[incident.sev];
  const sevBg = SEV_BG[incident.sev];

  return (
    <div
      className="relative px-5 py-4 rounded-xl transition-all duration-200"
      style={{
        background: "var(--surface2)",
        border: selected
          ? "1px solid rgba(226,0,138,0.5)"
          : "1px solid var(--border)",
        boxShadow: selected ? "0 0 0 1px rgba(226,0,138,0.2)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLElement).style.background = "var(--surface3)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLElement).style.background = "var(--surface2)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        }
      }}
    >
      {/* Top row: checkbox + sev + id */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!selectionDisabled || selected) onToggle(incident.id);
          }}
          className="shrink-0 transition-opacity"
          style={{ opacity: selectionDisabled && !selected ? 0.3 : 1 }}
        >
          {selected ? (
            <CheckSquare size={16} style={{ color: "var(--magenta)" }} />
          ) : (
            <Square size={16} style={{ color: "var(--text-dim)" }} />
          )}
        </button>

        <span
          className="inline-block px-2 py-0.5 rounded text-[10px] font-bold"
          style={{
            color: sevColor,
            background: sevBg,
            fontFamily: "var(--font-dm-mono)",
            letterSpacing: "0.04em",
          }}
        >
          {incident.sev.toUpperCase()}
        </span>

        <span
          className="text-[11px] tabular-nums"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          {incident.id}
        </span>

        <span className="flex-1" />

        {/* Resolved badge */}
        <span
          className="flex items-center gap-1 text-[10px]"
          style={{ color: "#00c896", fontFamily: "var(--font-dm-mono)" }}
        >
          <CheckCircle size={11} />
          {t.resolved}
        </span>
      </div>

      {/* Title */}
      <p
        className="text-[13px] font-bold leading-snug mb-3"
        style={{ color: "var(--text)", fontFamily: "var(--font-syne)" }}
      >
        {incident.title}
      </p>

      {/* Service + Classification tags */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span
          className="text-[10px] px-2 py-0.5 rounded-full"
          style={{
            color: "var(--text-muted)",
            background: "var(--surface3)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          {incident.service}
        </span>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full"
          style={{
            color: "var(--text-dim)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          {incident.classification}
        </span>
      </div>

      {/* Timeline row: start → end + duration + resolver */}
      <div
        className="flex items-center gap-2 flex-wrap text-[11px] tabular-nums pt-3"
        style={{
          color: "var(--text-dim)",
          fontFamily: "var(--font-dm-mono)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <span>
          <span style={{ color: "var(--text-muted)" }}>{t.started} </span>
          {formatDateTime(incident.date, incident.time)}
        </span>
        <span style={{ color: "var(--border2)" }}>→</span>
        <span>
          <span style={{ color: "var(--text-muted)" }}>{t.ended} </span>
          {formatDateTime(incident.endDate, incident.resolvedAt)}
        </span>

        <span className="flex-1" />

        <span style={{ color: "var(--text-dim)" }}>{incident.duration}</span>
        <span style={{ color: "var(--border2)" }}>·</span>
        <span style={{ color: "var(--text-muted)" }}>{incident.assigned}</span>
      </div>
    </div>
  );
}
