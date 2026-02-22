"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Incident } from "@/types/incident";
import { SEV_COLOR, SEV_BG, STATUS_COLOR } from "@/lib/utils";

interface Props {
  incident: Incident;
}

export default function IncidentHeader({ incident }: Props) {
  const sevColor = SEV_COLOR[incident.sev];
  const statusColor = STATUS_COLOR[incident.status];

  return (
    <div>
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-4 text-[12px] transition-opacity hover:opacity-70"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        <ArrowLeft size={13} />
        Back to Overview
      </Link>

      {/* Breadcrumb */}
      <div
        className="flex items-center gap-2 text-[11px] mb-4"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
      >
        <Link href="/" className="hover:text-white transition-colors">Overview</Link>
        <span>›</span>
        <span style={{ color: "var(--text-muted)" }}>{incident.id}</span>
        <span>·</span>
        <span style={{ color: "var(--text)" }} className="truncate">{incident.title}</span>
      </div>

      {/* Header card */}
      <div
        className="rounded-lg p-6 relative overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderTop: `3px solid ${sevColor}`,
        }}
      >
        {/* Gradient top wash */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${sevColor}18 0%, transparent 50%)`,
          }}
        />

        <div className="relative flex items-start gap-8">
          {/* Left col */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="text-[11px] uppercase tracking-widest"
                style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
              >
                {incident.id}
              </span>
              <span
                className="px-2.5 py-0.5 rounded text-[11px] border"
                style={{
                  color: sevColor,
                  background: SEV_BG[incident.sev],
                  borderColor: `${sevColor}55`,
                  fontFamily: "var(--font-dm-mono)",
                }}
              >
                {incident.sev}
              </span>
            </div>
            <h1
              className="text-2xl font-extrabold mb-4 leading-tight"
              style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}
            >
              {incident.title}
            </h1>

            {/* Detail row */}
            <div className="flex flex-wrap gap-5">
              {[
                { label: "Service", value: incident.service },
                { label: "Detected At", value: `${incident.time} UTC` },
                { label: "Duration", value: incident.duration },
                {
                  label: "Status",
                  value: incident.status,
                  color: statusColor,
                },
                { label: "Assigned To", value: incident.assigned },
              ].map((item) => (
                <div key={item.label}>
                  <p
                    className="text-[9px] uppercase tracking-widest mb-0.5"
                    style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-[13px] font-medium"
                    style={{
                      color: item.color || "var(--text)",
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Criticality Score tile */}
          <div
            className="shrink-0 text-center px-8 py-4 rounded-lg"
            style={{
              background: `${sevColor}12`,
              border: `1px solid ${sevColor}33`,
            }}
          >
            <p
              className="text-5xl font-extrabold leading-none mb-1"
              style={{ color: sevColor, fontFamily: "var(--font-syne)", fontWeight: 800 }}
            >
              {incident.score}
            </p>
            <p
              className="text-[11px] uppercase tracking-widest"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
            >
              Criticality Score
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
