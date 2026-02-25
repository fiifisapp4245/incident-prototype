"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  initialStart: string;
  initialEnd: string;
  onApply: (start: string, end: string) => void;
  onCancel: () => void;
}

export default function DateRangeModal({ open, initialStart, initialEnd, onApply, onCancel }: Props) {
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);

  // Reset draft to current applied range each time the modal opens
  useEffect(() => {
    if (open) {
      setDraft(
        initialStart || initialEnd
          ? {
              from: initialStart ? parseISO(initialStart) : undefined,
              to: initialEnd ? parseISO(initialEnd) : undefined,
            }
          : undefined
      );
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const canApply = !!draft?.from && !!draft?.to;

  function handleApply() {
    if (!canApply) return;
    onApply(
      format(draft!.from!, "yyyy-MM-dd"),
      format(draft!.to!, "yyyy-MM-dd")
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden rounded-xl w-auto max-w-fit"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border2)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span
            className="text-[14px] font-bold"
            style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 700 }}
          >
            Select Date Range
          </span>
        </div>

        {/* Calendar */}
        <div className="p-4">
          <Calendar
            mode="range"
            defaultMonth={draft?.from ?? new Date()}
            selected={draft}
            onSelect={setDraft}
            numberOfMonths={2}
            initialFocus
          />
        </div>

        {/* Footer: range label + actions */}
        <div
          className="flex items-center justify-between px-6 py-4 gap-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span
            className="text-[12px] tabular-nums"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            {draft?.from && draft?.to
              ? `${format(draft.from, "dd MMM yyyy")} – ${format(draft.to, "dd MMM yyyy")}`
              : draft?.from
              ? `${format(draft.from, "dd MMM yyyy")} – pick end date`
              : "Pick a start date"}
          </span>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-[12px] transition-opacity hover:opacity-70"
              style={{
                background: "var(--surface2)",
                border: "1px solid var(--border2)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-dm-mono)",
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              disabled={!canApply}
              className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
              style={{
                background: canApply ? "var(--magenta)" : "var(--surface2)",
                color: canApply ? "#fff" : "var(--text-dim)",
                border: canApply ? "none" : "1px solid var(--border2)",
                fontFamily: "var(--font-dm-mono)",
                cursor: canApply ? "pointer" : "not-allowed",
                opacity: canApply ? 1 : 0.5,
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
