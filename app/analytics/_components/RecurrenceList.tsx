"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import { recurrencePatterns } from "@/lib/analyticsData";

const SERVICE_COLORS: Record<string, string> = {
  "4G/5G Data": "#38bdf8",
  "Voice":      "#a78bfa",
  "SMS":        "#34d399",
  "Roaming":    "#f59e0b",
  "IoT/M2M":   "#f472b6",
  "Core/IMS":  "#ff3b5c",
};

// Tiny inline sparkline (30 points)
function Sparkline({ data }: { data: number[] }) {
  const max  = Math.max(...data, 1);
  const W    = 60;
  const H    = 18;
  const step = W / (data.length - 1);

  const pts = data
    .map((v, i) => `${(i * step).toFixed(1)},${(H - (v / max) * H).toFixed(1)}`)
    .join(" ");

  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      <polyline
        points={pts}
        fill="none"
        stroke="var(--magenta)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.7}
      />
      {/* Dots only on non-zero */}
      {data.map((v, i) =>
        v > 0 ? (
          <circle
            key={i}
            cx={(i * step).toFixed(1)}
            cy={(H - (v / max) * H).toFixed(1)}
            r={2}
            fill="var(--magenta)"
          />
        ) : null
      )}
    </svg>
  );
}

interface Props {
  id?: string;
}

export default function RecurrenceList({ id }: Props) {
  const t = useT();

  return (
    <div id={id} className="flex flex-col gap-3">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
        >
          {t.recurrenceTitle}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Column headers */}
        <div
          className="grid items-center px-5 py-2.5"
          style={{
            gridTemplateColumns: "20px 1fr 100px 80px 80px 64px 28px",
            gap: "12px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {["#", "Pattern", t.recurrenceCount, t.avgIntervalDays, "Last seen", "Trend", ""].map((h, i) => (
            <span
              key={i}
              className="text-[9px] uppercase tracking-widest"
              style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {recurrencePatterns.map((rec, i) => {
          const svcColor = SERVICE_COLORS[rec.service] ?? "#888";

          return (
            <div
              key={rec.id}
              className="grid items-center px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
              style={{
                gridTemplateColumns: "20px 1fr 100px 80px 80px 64px 28px",
                gap: "12px",
                borderBottom: i < recurrencePatterns.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              {/* Rank */}
              <span
                className="text-[12px] text-center"
                style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
              >
                {i + 1}
              </span>

              {/* Pattern name + service */}
              <div className="min-w-0 flex flex-col gap-0.5">
                <span
                  className="text-[12px] font-medium truncate"
                  style={{ fontFamily: "var(--font-ibm-sans)", color: "var(--text)" }}
                >
                  {rec.pattern}
                </span>
                <span
                  className="text-[10px]"
                  style={{ fontFamily: "var(--font-dm-mono)", color: svcColor }}
                >
                  {rec.service}
                </span>
              </div>

              {/* Count */}
              <span
                className="text-[14px] font-bold"
                style={{ fontFamily: "var(--font-syne)", color: "var(--text)" }}
              >
                {rec.count}×
              </span>

              {/* Avg interval */}
              <span
                className="text-[12px]"
                style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-muted)" }}
              >
                {rec.avgIntervalDays}d
              </span>

              {/* Last occurrence */}
              <span
                className="text-[11px]"
                style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
              >
                {rec.lastOccurrence}
              </span>

              {/* Sparkline */}
              <div>
                <Sparkline data={rec.sparkline} />
              </div>

              {/* Link */}
              <Link
                href="/history"
                className="flex items-center justify-center w-7 h-7 rounded transition-colors hover:bg-white/8"
                style={{ color: "var(--text-dim)" }}
                title={t.viewAllInstances}
              >
                <ArrowRight size={13} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
