"use client";

import { LayoutGrid, Table2 } from "lucide-react";
import { HistoricalIncident } from "@/types/incident";
import { useT } from "@/contexts/LanguageContext";
import HistoryCard from "./HistoryCard";
import HistoryTable from "./HistoryTable";

export type ViewMode = "card" | "table";

interface Props {
  incidents: HistoricalIncident[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
}

const MAX_COMPARE = 3;

export default function HistoryFeed({
  incidents,
  selected,
  onToggle,
  viewMode,
  onViewModeChange,
}: Props) {
  const t = useT();
  const selectionDisabled = selected.size >= MAX_COMPARE;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      {/* Feed header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          className="text-[11px] uppercase tracking-widest"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          {t.incidentFeedTitle}
          <span
            className="ml-2 px-1.5 py-0.5 rounded text-[10px]"
            style={{ background: "var(--surface3)", color: "var(--text-muted)" }}
          >
            {incidents.length}
          </span>
        </span>

        {/* View toggle */}
        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--border2)" }}
        >
          <button
            onClick={() => onViewModeChange("card")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] transition-colors"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color: viewMode === "card" ? "#fff" : "var(--text-muted)",
              background: viewMode === "card" ? "var(--magenta)" : "transparent",
              borderRight: "1px solid var(--border2)",
            }}
          >
            <LayoutGrid size={12} />
            {t.cardView}
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] transition-colors"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color: viewMode === "table" ? "#fff" : "var(--text-muted)",
              background: viewMode === "table" ? "var(--magenta)" : "transparent",
            }}
          >
            <Table2 size={12} />
            {t.tableView}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: "var(--surface)" }}>
        {incidents.length === 0 ? (
          <div
            className="flex items-center justify-center py-16 text-[13px]"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            {t.noHistoryMatch}
          </div>
        ) : viewMode === "card" ? (
          <div className="grid gap-3 p-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))" }}>
            {incidents.map((inc) => (
              <HistoryCard
                key={inc.id}
                incident={inc}
                selected={selected.has(inc.id)}
                onToggle={onToggle}
                selectionDisabled={selectionDisabled}
              />
            ))}
          </div>
        ) : (
          <HistoryTable
            incidents={incidents}
            selected={selected}
            onToggle={onToggle}
            selectionDisabled={selectionDisabled}
          />
        )}
      </div>
    </div>
  );
}
