"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { incidents } from "@/lib/data";
import { Incident } from "@/types/incident";
import IncidentCard from "./IncidentCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useT } from "@/contexts/LanguageContext";

const PREVIEW_COUNT = 5;

interface FilterState {
  severity: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface Props {
  filters: FilterState;
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
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border2)",
        }}
      >
        {/* Header */}
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

        {/* Scrollable list — IncidentCard handles its own navigation on click */}
        <div
          className="flex flex-col gap-2 overflow-y-auto p-4"
          style={{ maxHeight: "72vh" }}
        >
          {list.length === 0 ? (
            <div
              className="text-center py-12 text-[13px]"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              {t.noIncidentsMatch}
            </div>
          ) : (
            list.map((inc) => <IncidentCard key={inc.id} incident={inc} />)
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Feed ────────────────────────────────────────────────────────────────────

export default function IncidentFeed({ filters }: Props) {
  const t = useT();
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return incidents.filter((inc: Incident) => {
      if (filters.severity !== "All" && inc.sev !== filters.severity) return false;
      if (filters.status   !== "All" && inc.status !== filters.status) return false;
      if (filters.startDate && inc.date < filters.startDate) return false;
      if (filters.endDate   && inc.date > filters.endDate)   return false;
      return true;
    });
  }, [filters]);

  const preview  = filtered.slice(0, PREVIEW_COUNT);
  const overflow = filtered.length - PREVIEW_COUNT;

  return (
    <>
      <div
        className="rounded-xl p-6 flex flex-col"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <p
            className="text-[11px] uppercase tracking-widest"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
          >
            {t.liveIncidentFeed}
          </p>
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

        {/* Preview cards — no scroll */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 ? (
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

        {/* "Show N more" footer — only when overflow exists */}
        {overflow > 0 && (
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 w-full py-2.5 rounded-lg text-[12px] transition-colors hover:bg-white/5"
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
