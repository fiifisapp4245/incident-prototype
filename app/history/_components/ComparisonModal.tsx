"use client";

import { format, parseISO } from "date-fns";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HistoricalIncident } from "@/types/incident";
import { SEV_COLOR, SEV_BG } from "@/lib/utils";
import { useT } from "@/contexts/LanguageContext";

interface Props {
  open: boolean;
  incidents: HistoricalIncident[];
  onClose: () => void;
}

function parseDurationMins(dur: string): number {
  const parts = dur.match(/(\d+)h\s*(\d+)m/);
  if (!parts) return 0;
  return parseInt(parts[1]) * 60 + parseInt(parts[2]);
}

function fmtDT(date: string, time: string) {
  return `${format(parseISO(date), "d MMM yyyy")} · ${time}`;
}

interface RowProps {
  label: string;
  values: string[];
  isDiff: boolean;
}

function CompareRow({ label, values, isDiff }: RowProps) {
  return (
    <div
      className="grid gap-0"
      style={{
        gridTemplateColumns: `120px repeat(${values.length}, 1fr)`,
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Label */}
      <div
        className="py-3 pr-4 text-[10px] uppercase tracking-widest self-center"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
      >
        {label}
      </div>

      {/* Values */}
      {values.map((val, i) => (
        <div
          key={i}
          className="py-3 px-4 text-[12px]"
          style={{
            color: isDiff ? "#f5c518" : "var(--text)",
            fontFamily: "var(--font-dm-mono)",
            background: isDiff ? "rgba(245,197,24,0.05)" : "transparent",
            borderLeft: "1px solid var(--border)",
          }}
        >
          {val}
          {isDiff && i === 0 && (
            <span
              className="ml-2 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider"
              style={{
                background: "rgba(245,197,24,0.15)",
                color: "#f5c518",
                fontFamily: "var(--font-dm-mono)",
              }}
            >
              diff
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ComparisonModal({ open, incidents, onClose }: Props) {
  const t = useT();

  if (incidents.length < 2) return null;

  const cols = incidents.slice(0, 3); // max 3

  // Helper to check if all values are the same
  function allSame(vals: string[]): boolean {
    return vals.every((v) => v === vals[0]);
  }

  const sevValues = cols.map((i) => i.sev);
  const serviceValues = cols.map((i) => i.service);
  const classValues = cols.map((i) => i.classification);
  const engineerValues = cols.map((i) => i.assigned);
  const durationMins = cols.map((i) => parseDurationMins(i.duration));
  const durationValues = cols.map((i) => i.duration);
  const startedValues = cols.map((i) => fmtDT(i.date, i.time));
  const resolvedValues = cols.map((i) => fmtDT(i.endDate, i.resolvedAt));

  // Compute MTTR (use duration directly, it's already formatted)
  const mttrValues = durationValues;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="max-w-[90vw] w-full p-0 overflow-hidden rounded-xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border2)",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span
            className="text-[15px] font-bold"
            style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 700 }}
          >
            {t.incidentCompare}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
          >
            <X size={16} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>

        {/* Column headers — one per incident */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `120px repeat(${cols.length}, 1fr)`,
            borderBottom: "1px solid var(--border)",
            background: "var(--surface2)",
          }}
        >
          <div className="py-4 pr-4" />
          {cols.map((inc) => {
            const sevColor = SEV_COLOR[inc.sev];
            const sevBg = SEV_BG[inc.sev];
            return (
              <div
                key={inc.id}
                className="py-4 px-4"
                style={{ borderLeft: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold"
                    style={{
                      color: sevColor,
                      background: sevBg,
                      fontFamily: "var(--font-dm-mono)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {inc.sev.toUpperCase()}
                  </span>
                  <span
                    className="text-[12px]"
                    style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
                  >
                    {inc.id}
                  </span>
                </div>
                <p
                  className="text-[13px] font-bold leading-tight"
                  style={{ color: "var(--text)", fontFamily: "var(--font-syne)" }}
                >
                  {inc.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Comparison rows */}
        <div className="px-7 pb-6">
          <CompareRow
            label="Severity"
            values={sevValues}
            isDiff={!allSame(sevValues)}
          />
          <CompareRow
            label="Service"
            values={serviceValues}
            isDiff={!allSame(serviceValues)}
          />
          <CompareRow
            label={t.classification}
            values={classValues}
            isDiff={!allSame(classValues)}
          />
          <CompareRow
            label={t.started}
            values={startedValues}
            isDiff={!allSame(startedValues)}
          />
          <CompareRow
            label={t.ended}
            values={resolvedValues}
            isDiff={!allSame(resolvedValues)}
          />
          <CompareRow
            label={t.duration}
            values={mttrValues}
            isDiff={!allSame(mttrValues)}
          />
          <CompareRow
            label={t.resolvedBy}
            values={engineerValues}
            isDiff={!allSame(engineerValues)}
          />

          {/* Lifecycle section */}
          <div className="mt-5 mb-2">
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              {t.incidentLifecycle}
            </span>
          </div>

          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: `120px repeat(${cols.length}, 1fr)` }}
          >
            <div />
            {cols.map((inc) => (
              <div
                key={inc.id}
                className="px-4 py-3"
                style={{ borderLeft: "1px solid var(--border)" }}
              >
                <div className="flex flex-col gap-2">
                  {inc.timeline.map((event, ei) => (
                    <div key={ei} className="flex items-start gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ background: event.color }}
                      />
                      <div>
                        <div
                          className="text-[11px]"
                          style={{ color: "var(--text)", fontFamily: "var(--font-dm-mono)" }}
                        >
                          {event.time} — {event.badge}
                        </div>
                        <div
                          className="text-[10px]"
                          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
                        >
                          {event.actor}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
