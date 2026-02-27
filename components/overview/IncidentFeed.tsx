"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { incidents } from "@/lib/data";
import { Incident } from "@/types/incident";
import IncidentCard from "./IncidentCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useT } from "@/contexts/LanguageContext";
import { SEV_COLOR, SEV_BG } from "@/lib/utils";

const PREVIEW_COUNT = 5;

// Indices into incidents[] used by the simulator — varied severities
const POOL_INDICES = [0, 3, 6, 5, 4]; // Critical·4G, Critical·Roaming, Critical·Core, Major·5G, Minor·IoT

interface FilterState {
  severity: string;
  status: string;
  startDate: string;
  endDate: string;
}

// Exported so page.tsx can own the queue + render banner above FilterBar
export interface LiveIncident extends Incident {
  liveId: string;       // unique key per arrival
  acknowledged: boolean;
  arrivedAt: number;    // Date.now() at injection
}

export function makeSimulatedIncident(base: Incident): LiveIncident {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return {
    ...base,
    time: timeStr,
    duration: "0m",
    liveId: `${base.id}-${Date.now()}`,
    acknowledged: false,
    arrivedAt: Date.now(),
  };
}

// ─── New-incident banner — exported, rendered by page.tsx above FilterBar ────

export function NewIncidentBanner({
  incident,
  onView,
  onDismiss,
}: {
  incident: LiveIncident;
  onView: () => void;
  onDismiss: () => void;
}) {
  const sevColor = SEV_COLOR[incident.sev];

  // Auto-dismiss after 30 s
  useEffect(() => {
    const t = setTimeout(onDismiss, 30_000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className="animate-slide-down rounded-xl px-5 py-3.5 flex items-center gap-4"
      style={{
        background: SEV_BG[incident.sev],
        border: `1px solid ${sevColor}50`,
        borderLeft: `3px solid ${sevColor}`,
      }}
    >
      {/* Pulsing severity dot */}
      <div className="shrink-0 w-2 h-2 rounded-full pulse-dot" style={{ background: sevColor }} />

      {/* Incident info */}
      <div className="flex-1 min-w-0 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span
          className="text-[10px] font-bold tracking-widest shrink-0"
          style={{ color: sevColor, fontFamily: "var(--font-dm-mono)" }}
        >
          NEW · {incident.sev.toUpperCase()} · {incident.id}
        </span>
        <span
          className="text-[12px] font-medium truncate"
          style={{ color: "var(--text)", fontFamily: "var(--font-syne)" }}
        >
          {incident.title}
        </span>
        <span
          className="text-[11px] shrink-0"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          {incident.time} UTC
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onView}
          className="text-[11px] px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: sevColor, color: "#fff", fontFamily: "var(--font-dm-mono)" }}
        >
          View Incident
        </button>
        <button
          onClick={onDismiss}
          className="text-[11px] px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
          style={{
            color: "var(--text-dim)",
            border: "1px solid var(--border2)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

// ─── Full-list modal ─────────────────────────────────────────────────────────

function AllIncidentsModal({
  open,
  incidents: list,
  onClose,
}: {
  open: boolean;
  incidents: Incident[];
  onClose: () => void;
}) {
  const t = useT();

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden rounded-xl w-[720px] max-w-[95vw]"
        style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}
      >
        <div
          className="flex items-center gap-3 px-6 py-4 pr-12 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span
            className="text-[14px] font-bold"
            style={{ fontFamily: "var(--font-syne)", fontWeight: 700, color: "var(--text)" }}
          >
            {t.liveIncidentFeed}
          </span>
          <span
            className="text-[11px] tabular-nums px-1.5 py-0.5 rounded"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)", background: "var(--surface3)" }}
          >
            {list.length}
          </span>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto p-4" style={{ maxHeight: "72vh" }}>
          {list.length === 0 ? (
            <div
              className="text-center py-12 text-[13px]"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              {t.noIncidentsMatch}
            </div>
          ) : (
            list.map((inc) => <IncidentCard key={inc.id} incident={inc} expanded />)
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Section divider label ────────────────────────────────────────────────────

function SectionLabel({ label, dot }: { label: string; dot?: string }) {
  return (
    <div className="flex items-center gap-2">
      {dot && (
        <div className="w-1.5 h-1.5 rounded-full pulse-dot shrink-0" style={{ background: dot }} />
      )}
      <span
        className="text-[9px] uppercase tracking-widest shrink-0"
        style={{ fontFamily: "var(--font-dm-mono)", color: dot ?? "var(--text-dim)" }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

// ─── Feed ────────────────────────────────────────────────────────────────────

interface Props {
  filters: FilterState;
  liveIncidents: LiveIncident[];
  onNewIncident: (inc: LiveIncident) => void;
  onAck: (liveId: string) => void;
}

export default function IncidentFeed({ filters, liveIncidents, onNewIncident, onAck }: Props) {
  const t = useT();
  const [modalOpen, setModalOpen] = useState(false);
  const poolIndexRef = useRef(0);

  // Stable wrapper so the simulator effect doesn't re-run when parent re-renders
  const fireNewIncident = useCallback((inc: LiveIncident) => {
    onNewIncident(inc);
  }, [onNewIncident]);

  // ── Simulator ──
  useEffect(() => {
    const fire = () => {
      const idx = POOL_INDICES[poolIndexRef.current % POOL_INDICES.length];
      poolIndexRef.current++;
      fireNewIncident(makeSimulatedIncident(incidents[idx]));
    };
    const firstTimer = setTimeout(fire, 20_000);  // first at 20 s
    const interval   = setInterval(fire, 30_000); // then every 30 s
    return () => { clearTimeout(firstTimer); clearInterval(interval); };
  }, [fireNewIncident]);

  // ── Filtered static incidents ──
  const filtered = useMemo(() => {
    return incidents.filter((inc: Incident) => {
      if (filters.severity !== "All" && inc.sev !== filters.severity) return false;
      if (filters.status   !== "All" && inc.status !== filters.status) return false;
      if (filters.startDate && inc.date < filters.startDate) return false;
      if (filters.endDate   && inc.date > filters.endDate)   return false;
      return true;
    });
  }, [filters]);

  const preview    = filtered.slice(0, PREVIEW_COUNT);
  const overflow   = filtered.length - PREVIEW_COUNT;
  const unacked    = liveIncidents.filter((i) => !i.acknowledged);
  const ackedLive  = liveIncidents.filter((i) => i.acknowledged);
  const hasContent = filtered.length > 0 || liveIncidents.length > 0;

  return (
    <>
      <div
        className="rounded-xl p-6 flex flex-col gap-3"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* ── Header row ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <p
              className="text-[11px] uppercase tracking-widest"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
            >
              {t.liveIncidentFeed}
            </p>
            {/* Persistent unacked count badge */}
            {unacked.length > 0 && (
              <span
                className="text-[10px] tabular-nums px-1.5 py-0.5 rounded font-bold"
                style={{ background: "#ff3b5c", color: "#fff", fontFamily: "var(--font-dm-mono)" }}
              >
                {unacked.length}
              </span>
            )}
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 text-[12px] transition-opacity hover:opacity-70"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
          >
            {t.viewAllIncidents}
            {filtered.length > 0 && (
              <span
                className="tabular-nums px-1.5 py-0.5 rounded"
                style={{ background: "var(--surface3)", color: "var(--text-dim)", fontSize: 10 }}
              >
                {filtered.length}
              </span>
            )}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* ── Unacknowledged section ── */}
        {unacked.length > 0 && (
          <>
            <SectionLabel label={`Unacknowledged (${unacked.length})`} dot="#ff3b5c" />
            {unacked.map((inc) => (
              <IncidentCard
                key={inc.liveId}
                incident={inc}
                unacked
                arrivedAt={inc.arrivedAt}
                onAck={() => onAck(inc.liveId)}
              />
            ))}
            <SectionLabel label="Active" />
          </>
        )}

        {/* ── Cards (acked live + static preview) ── */}
        <div className="flex flex-col gap-2">
          {ackedLive.map((inc) => (
            <IncidentCard key={inc.liveId} incident={inc} />
          ))}
          {!hasContent ? (
            <div
              className="text-center py-12 text-[13px]"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              {t.noIncidentsMatch}
            </div>
          ) : (
            preview.map((inc) => <IncidentCard key={inc.id} incident={inc} />)
          )}
        </div>

        {/* ── Overflow footer ── */}
        {overflow > 0 && (
          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-2.5 rounded-lg text-[12px] transition-colors hover:bg-white/5"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color: "var(--text-dim)",
              border: "1px solid var(--border)",
            }}
          >
            + {overflow} more incident{overflow !== 1 ? "s" : ""} — view all
          </button>
        )}
      </div>

      <AllIncidentsModal
        open={modalOpen}
        incidents={filtered}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
