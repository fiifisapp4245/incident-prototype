"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Incident } from "@/types/incident";
import { SEV_COLOR, SEV_BG, STATUS_COLOR } from "@/lib/utils";

interface Props {
  incident: Incident;
}

const STATUS_BG: Record<string, string> = {
  Active: "rgba(255,59,92,0.10)",
  "In Progress": "rgba(255,140,0,0.10)",
  Monitoring: "rgba(245,197,24,0.10)",
  Resolved: "rgba(0,200,150,0.10)",
};

function calcRelativeTime(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  const then = new Date();
  then.setHours(h, m, 0, 0);
  const diffMins = Math.floor((now.getTime() - then.getTime()) / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return mins > 0 ? `${hrs}h ${mins}m ago` : `${hrs}h ago`;
}

export default function IncidentCard({ incident }: Props) {
  const router = useRouter();
  const sevColor = SEV_COLOR[incident.sev];
  const statusColor = STATUS_COLOR[incident.status];
  const statusBg = STATUS_BG[incident.status] ?? "rgba(255,255,255,0.06)";

  // Start with raw time to match server render, update to relative time on client
  const [timeLabel, setTimeLabel] = useState(incident.time);
  useEffect(() => {
    setTimeLabel(calcRelativeTime(incident.time));
  }, [incident.time]);

  return (
    <div
      onClick={() => router.push(`/incident/${incident.id}`)}
      className="px-5 py-4 rounded-xl cursor-pointer transition-all duration-200"
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--surface3)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px rgba(0,0,0,0.35)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--surface2)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Top row: sev pill + ID + relative time */}
      <div className="flex items-center gap-2.5 mb-2">
        <span
          className="inline-block px-2 py-0.5 rounded text-[10px] font-bold"
          style={{
            color: sevColor,
            background: SEV_BG[incident.sev],
            fontFamily: "var(--font-dm-mono)",
            letterSpacing: "0.04em",
          }}
        >
          {incident.sev.toUpperCase()}
        </span>
        <span
          className="text-[11px] tabular-nums"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          {incident.id}
        </span>
        <span className="flex-1" />
        <span
          className="text-[11px] tabular-nums"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          {timeLabel}
        </span>
      </div>

      {/* Title */}
      <p
        className="text-[13px] font-bold leading-snug mb-2.5 truncate"
        style={{ color: "var(--text)", fontFamily: "var(--font-syne)" }}
      >
        {incident.title}
      </p>

      {/* Bottom row: service tag + status tag + duration */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-[10px] px-2 py-0.5 rounded-full"
          style={{
            color: "var(--text-muted)",
            background: "var(--surface3)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          {incident.service}
        </span>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{
            color: statusColor,
            background: statusBg,
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          {incident.status}
        </span>
      </div>
    </div>
  );
}
