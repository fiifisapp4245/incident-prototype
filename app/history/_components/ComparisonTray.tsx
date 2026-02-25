"use client";

import { X, GitCompare } from "lucide-react";
import { HistoricalIncident } from "@/types/incident";
import { SEV_COLOR } from "@/lib/utils";
import { useT } from "@/contexts/LanguageContext";

interface Props {
  selected: Set<string>;
  incidents: HistoricalIncident[];
  onClear: () => void;
  onCompare: () => void;
}

export default function ComparisonTray({ selected, incidents, onClear, onCompare }: Props) {
  const t = useT();
  const selectedIncidents = incidents.filter((i) => selected.has(i.id));
  const count = selected.size;
  const canCompare = count >= 2;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-out"
      style={{
        transform: count === 0 ? "translateY(100%)" : "translateY(0)",
        background: "rgba(10,10,15,0.97)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border2)",
      }}
    >
      <div className="max-w-[1600px] mx-auto px-8 flex items-center gap-4 h-[68px]">
        {/* Selected incident chips */}
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          {selectedIncidents.map((inc) => (
            <div
              key={inc.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0"
              style={{
                background: "var(--surface2)",
                border: "1px solid var(--border2)",
              }}
            >
              <span
                className="text-[10px] font-bold"
                style={{
                  color: SEV_COLOR[inc.sev],
                  fontFamily: "var(--font-dm-mono)",
                }}
              >
                {inc.sev.toUpperCase()}
              </span>
              <span
                className="text-[11px]"
                style={{ color: "var(--text)", fontFamily: "var(--font-dm-mono)" }}
              >
                {inc.id}
              </span>
            </div>
          ))}

          {count < 2 && (
            <span
              className="text-[12px]"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              {t.selectOneMore}
            </span>
          )}
        </div>

        {/* Status text */}
        <span
          className="text-[12px] shrink-0"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          {count} {t.selectedIncidents}
        </span>

        {/* Clear */}
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-opacity hover:opacity-70 shrink-0"
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border2)",
            color: "var(--text-muted)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          <X size={12} />
          {t.clearSelection}
        </button>

        {/* Compare button */}
        <button
          onClick={onCompare}
          disabled={!canCompare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-all shrink-0"
          style={{
            background: canCompare ? "var(--magenta)" : "var(--surface2)",
            color: canCompare ? "#fff" : "var(--text-dim)",
            border: canCompare ? "none" : "1px solid var(--border2)",
            fontFamily: "var(--font-dm-mono)",
            cursor: canCompare ? "pointer" : "not-allowed",
            opacity: canCompare ? 1 : 0.5,
          }}
        >
          <GitCompare size={14} />
          {t.compareBtn}
        </button>
      </div>
    </div>
  );
}
