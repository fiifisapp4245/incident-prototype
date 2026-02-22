"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const score = 62.5;
const SEGMENTS = 30;

function segmentColor(index: number): string {
  const pct = (index / SEGMENTS) * 100;
  if (pct < 33) return "#00c896";
  if (pct < 66) return "#ff8c00";
  return "#ff3b5c";
}

export default function DownDetectorPanel() {
  const filledCount = Math.round((score / 100) * SEGMENTS);

  return (
    <div
      className="rounded-xl p-6 flex flex-col h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-[11px] uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Down Detector
      </p>

      <p
        className="text-[11px] mb-2"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
      >
        Current User Report Score
      </p>

      <p
        className="text-5xl font-extrabold leading-none mb-5"
        style={{ color: "#ff8c00", fontFamily: "var(--font-syne)", fontWeight: 800 }}
      >
        {score}%
      </p>

      {/* Segmented bar with cursor marker */}
      <div className="relative mb-2.5">
        {/* Segments */}
        <div className="flex gap-[3px]" style={{ height: "28px" }}>
          {Array.from({ length: SEGMENTS }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                background: i < filledCount ? segmentColor(i) : "var(--surface3)",
                opacity: i < filledCount ? 1 : 0.5,
              }}
            />
          ))}
        </div>
        {/* Cursor marker */}
        <div
          className="absolute top-0 bottom-0 flex flex-col items-center"
          style={{ left: `${score}%`, transform: "translateX(-50%)", pointerEvents: "none" }}
        >
          <div className="w-[2px] h-full bg-white rounded-full opacity-90" />
        </div>
      </div>

      {/* Threshold labels */}
      <div className="flex justify-between mb-5">
        {[
          { label: "0%", sub: "Normal" },
          { label: "50%", sub: "Elevated" },
          { label: "100%", sub: "Critical" },
        ].map((t) => (
          <div key={t.label} className="flex flex-col items-center gap-0.5">
            <span
              className="text-[10px]"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              {t.label}
            </span>
            <span
              className="text-[9px]"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              {t.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Warning badge */}
      <Alert
        className="mt-auto rounded-lg border-[rgba(255,140,0,0.25)] bg-[rgba(255,140,0,0.08)] [&>svg]:text-[#ff8c00]"
      >
        <AlertTriangle size={13} />
        <AlertTitle
          className="text-[11px] font-semibold"
          style={{ color: "#ff8c00", fontFamily: "var(--font-dm-mono)" }}
        >
          Down Detector
        </AlertTitle>
        <AlertDescription
          className="text-[11px]"
          style={{ color: "#ff8c00", fontFamily: "var(--font-dm-mono)" }}
        >
          Elevated above the baseline threshold
        </AlertDescription>
      </Alert>
    </div>
  );
}
