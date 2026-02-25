"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ArrowUpDown, ArrowUp, ArrowDown, CheckSquare, Square } from "lucide-react";
import { HistoricalIncident } from "@/types/incident";
import { SEV_COLOR, SEV_BG } from "@/lib/utils";
import { useT } from "@/contexts/LanguageContext";

interface Props {
  incidents: HistoricalIncident[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  selectionDisabled: boolean;
}

type SortKey = "date" | "sev" | "duration" | "id";
type SortDir = "asc" | "desc";

const SEV_ORDER: Record<string, number> = { Critical: 0, Major: 1, Minor: 2 };

function parseDurationMins(dur: string): number {
  const parts = dur.match(/(\d+)h\s*(\d+)m/);
  if (!parts) return 0;
  return parseInt(parts[1]) * 60 + parseInt(parts[2]);
}

function SortIcon({ column, sortBy, sortDir }: { column: SortKey; sortBy: SortKey; sortDir: SortDir }) {
  if (column !== sortBy) return <ArrowUpDown size={12} style={{ opacity: 0.3 }} />;
  return sortDir === "asc"
    ? <ArrowUp size={12} style={{ color: "var(--magenta)" }} />
    : <ArrowDown size={12} style={{ color: "var(--magenta)" }} />;
}

export default function HistoryTable({ incidents, selected, onToggle, selectionDisabled }: Props) {
  const t = useT();
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  }

  const sorted = [...incidents].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "date") {
      const aStr = `${a.date}${a.time}`;
      const bStr = `${b.date}${b.time}`;
      cmp = aStr.localeCompare(bStr);
    } else if (sortBy === "sev") {
      cmp = SEV_ORDER[a.sev] - SEV_ORDER[b.sev];
    } else if (sortBy === "duration") {
      cmp = parseDurationMins(a.duration) - parseDurationMins(b.duration);
    } else if (sortBy === "id") {
      const aNum = parseInt(a.id.replace("INC-", ""));
      const bNum = parseInt(b.id.replace("INC-", ""));
      cmp = aNum - bNum;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  function fmtDT(date: string, time: string) {
    return `${format(parseISO(date), "dd MMM")} ${time}`;
  }

  const headerCell = "text-[10px] uppercase tracking-widest px-3 py-3 text-left whitespace-nowrap";
  const dataCell = "px-3 py-3 text-[12px] align-middle";

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {/* Checkbox */}
            <th className={headerCell} style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)", width: 36 }} />

            {/* Sortable headers */}
            {(
              [
                { key: "sev" as SortKey, label: t.colSev },
                { key: "id" as SortKey, label: t.colId },
              ] as { key: SortKey; label: string }[]
            ).map(({ key, label }) => (
              <th
                key={key}
                className={headerCell}
                style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)", cursor: "pointer" }}
                onClick={() => toggleSort(key)}
              >
                <div className="flex items-center gap-1">
                  {label}
                  <SortIcon column={key} sortBy={sortBy} sortDir={sortDir} />
                </div>
              </th>
            ))}

            <th className={headerCell} style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
              {t.colTitle}
            </th>
            <th className={headerCell} style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
              {t.colService}
            </th>
            <th className={headerCell} style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
              {t.colClassification}
            </th>
            <th
              className={headerCell}
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)", cursor: "pointer" }}
              onClick={() => toggleSort("date")}
            >
              <div className="flex items-center gap-1">
                {t.colStarted}
                <SortIcon column="date" sortBy={sortBy} sortDir={sortDir} />
              </div>
            </th>
            <th className={headerCell} style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
              {t.colResolved}
            </th>
            <th
              className={headerCell}
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)", cursor: "pointer" }}
              onClick={() => toggleSort("duration")}
            >
              <div className="flex items-center gap-1">
                {t.colDuration}
                <SortIcon column="duration" sortBy={sortBy} sortDir={sortDir} />
              </div>
            </th>
            <th className={headerCell} style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}>
              {t.colEngineer}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((inc, rowIdx) => {
            const isSelected = selected.has(inc.id);
            const isDisabled = selectionDisabled && !isSelected;
            const sevColor = SEV_COLOR[inc.sev];
            const sevBg = SEV_BG[inc.sev];

            return (
              <tr
                key={inc.id}
                style={{
                  background: isSelected
                    ? "rgba(226,0,138,0.06)"
                    : rowIdx % 2 === 0
                    ? "transparent"
                    : "rgba(255,255,255,0.02)",
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface2)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLElement).style.background =
                      rowIdx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)";
                }}
              >
                {/* Checkbox */}
                <td className={dataCell} style={{ width: 36 }}>
                  <button
                    onClick={() => { if (!isDisabled || isSelected) onToggle(inc.id); }}
                    style={{ opacity: isDisabled ? 0.3 : 1 }}
                  >
                    {isSelected ? (
                      <CheckSquare size={15} style={{ color: "var(--magenta)" }} />
                    ) : (
                      <Square size={15} style={{ color: "var(--text-dim)" }} />
                    )}
                  </button>
                </td>

                {/* Sev */}
                <td className={dataCell}>
                  <span
                    className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold"
                    style={{
                      color: sevColor,
                      background: sevBg,
                      fontFamily: "var(--font-dm-mono)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {inc.sev.toUpperCase()}
                  </span>
                </td>

                {/* ID */}
                <td
                  className={dataCell}
                  style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)", whiteSpace: "nowrap" }}
                >
                  {inc.id}
                </td>

                {/* Title */}
                <td
                  className={dataCell}
                  style={{
                    color: "var(--text)",
                    fontFamily: "var(--font-syne)",
                    fontWeight: 600,
                    maxWidth: 320,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {inc.title}
                </td>

                {/* Service */}
                <td className={dataCell}>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      color: "var(--text-muted)",
                      background: "var(--surface3)",
                      fontFamily: "var(--font-dm-mono)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {inc.service}
                  </span>
                </td>

                {/* Classification */}
                <td
                  className={dataCell}
                  style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)", whiteSpace: "nowrap" }}
                >
                  {inc.classification}
                </td>

                {/* Started */}
                <td
                  className={dataCell}
                  style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)", whiteSpace: "nowrap" }}
                >
                  {fmtDT(inc.date, inc.time)}
                </td>

                {/* Resolved */}
                <td
                  className={dataCell}
                  style={{ color: "#00c896", fontFamily: "var(--font-dm-mono)", whiteSpace: "nowrap" }}
                >
                  {fmtDT(inc.endDate, inc.resolvedAt)}
                </td>

                {/* Duration */}
                <td
                  className={dataCell}
                  style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)", whiteSpace: "nowrap" }}
                >
                  {inc.duration}
                </td>

                {/* Engineer */}
                <td
                  className={dataCell}
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)", whiteSpace: "nowrap" }}
                >
                  {inc.assigned}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
