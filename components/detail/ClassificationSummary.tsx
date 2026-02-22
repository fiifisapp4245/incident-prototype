"use client";

import { ExternalLink } from "lucide-react";
import { Incident } from "@/types/incident";
import { SEV_COLOR } from "@/lib/utils";

interface Props {
  incident: Incident;
}

export default function ClassificationSummary({ incident }: Props) {
  const sevColor = SEV_COLOR[incident.sev];

  return (
    <div
      className="rounded-lg p-5 h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Panel title + badge */}
      <div className="flex items-center gap-2 mb-4">
        <p
          className="text-[11px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          AI Classification Summary
        </p>
        <span
          className="text-[10px] px-2 py-0.5 rounded"
          style={{
            color: "var(--magenta)",
            background: "rgba(226,0,138,0.12)",
            border: "1px solid rgba(226,0,138,0.3)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          Agent Output
        </span>
      </div>

      {/* AI summary text */}
      <div
        className="px-4 py-4 rounded mb-5"
        style={{
          background: "var(--surface2)",
          borderLeft: `3px solid ${sevColor}`,
          fontFamily: "var(--font-dm-mono)",
          color: "var(--text-muted)",
          lineHeight: "1.65",
          fontSize: "12px",
        }}
      >
        {incident.summary}
      </div>

      {/* Affected Services */}
      <div className="mb-4">
        <p
          className="text-[11px] uppercase tracking-widest mb-2"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          Affected Services
        </p>
        <div className="flex flex-wrap gap-2">
          {incident.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded text-[11px]"
              style={{
                background: "var(--surface3)",
                border: "1px solid var(--border2)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-dm-mono)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Supporting Evidence */}
      <div>
        <p
          className="text-[11px] uppercase tracking-widest mb-2"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          Supporting Evidence
        </p>
        <div className="flex flex-col gap-1.5">
          {incident.evidence.map((ev, i) => (
            <div
              key={i}
              className="flex items-start gap-2 px-3 py-2 rounded cursor-pointer transition-colors hover:bg-[var(--surface3)]"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              <ExternalLink size={11} className="shrink-0" style={{ color: "var(--info)", marginTop: 2 }} />
              <span className="text-[11px]" style={{ color: "var(--info)" }}>
                {ev}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
