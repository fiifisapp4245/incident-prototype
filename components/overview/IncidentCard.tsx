"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Incident } from "@/types/incident";
import { SEV_COLOR, SEV_BG, STATUS_COLOR } from "@/lib/utils";

interface Props {
  incident: Incident;
  /** True for newly arrived, unacknowledged incidents */
  unacked?: boolean;
  /** Timestamp (Date.now()) when the incident first appeared */
  arrivedAt?: number;
  /** Called when the engineer explicitly acks without navigating */
  onAck?: () => void;
  /** Allow title to wrap and remove overflow-hidden (used in modals) */
  expanded?: boolean;
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

export default function IncidentCard({ incident, unacked, arrivedAt, onAck, expanded }: Props) {
  const router = useRouter();
  const sevColor = SEV_COLOR[incident.sev];
  const statusColor = STATUS_COLOR[incident.status];
  const statusBg = STATUS_BG[incident.status] ?? "rgba(255,255,255,0.06)";

  // Start with raw time to match server render, update to relative time on client
  const [timeLabel, setTimeLabel] = useState(incident.time);
  useEffect(() => {
    setTimeLabel(calcRelativeTime(incident.time));
  }, [incident.time]);

  // Show hover state to reveal ACK button
  const [isHovered, setIsHovered] = useState(false);

  // Flash overlay — starts true for unacked cards, clears after 800 ms
  const [isFlashing, setIsFlashing] = useState(() => !!unacked);
  useEffect(() => {
    if (!unacked) return;
    const t = setTimeout(() => setIsFlashing(false), 800);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown: minutes since the card arrived unacknowledged
  const [unackedMins, setUnackedMins] = useState(0);
  useEffect(() => {
    if (!unacked || !arrivedAt) return;
    const tick = () => setUnackedMins(Math.floor((Date.now() - arrivedAt) / 60000));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, [unacked, arrivedAt]);

  const baseBg = unacked ? "var(--surface3)" : "var(--surface2)";
  const baseBorder = unacked ? "var(--border2)" : "var(--border)";

  function handleClick() {
    if (unacked) onAck?.();
    router.push(`/incident/${incident.id}`);
  }

  return (
    <div
      onClick={handleClick}
      className={`relative px-5 py-4 rounded-xl cursor-pointer transition-all duration-200 ${expanded ? "" : "overflow-hidden"}`}
      style={{ background: baseBg, border: `1px solid ${baseBorder}` }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        (e.currentTarget as HTMLElement).style.background = "var(--surface3)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.35)";
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        (e.currentTarget as HTMLElement).style.background = baseBg;
        (e.currentTarget as HTMLElement).style.borderColor = baseBorder;
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* ── Flash overlay on arrival ── */}
      {isFlashing && (
        <div
          className={`absolute inset-0 rounded-xl pointer-events-none card-flash-${incident.sev.toLowerCase()}`}
        />
      )}

      {/* ── Pulsing left accent bar (unacked only) ── */}
      {unacked && (
        <div
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full border-breathe pointer-events-none"
          style={{ background: sevColor }}
        />
      )}

      {/* ── Top row: sev pill · ID · (NEW badge OR time) ── */}
      <div className="flex items-center gap-2.5 mb-2">
        <span
          className="inline-block px-2 py-0.5 rounded text-[10px] font-bold shrink-0"
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

        {unacked ? (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-widest"
            style={{
              background: "rgba(226,0,138,0.15)",
              color: "var(--magenta)",
              fontFamily: "var(--font-dm-mono)",
              letterSpacing: "0.08em",
            }}
          >
            NEW
          </span>
        ) : (
          <span
            className="text-[11px] tabular-nums"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            {timeLabel}
          </span>
        )}
      </div>

      {/* ── Title ── */}
      <p
        className={`text-[13px] font-bold leading-snug mb-2.5 ${expanded ? "" : "truncate"}`}
        style={{ color: "var(--text)", fontFamily: "var(--font-syne)" }}
      >
        {incident.title}
      </p>

      {/* ── Bottom row: service · status · duration · (countdown OR ack) ── */}
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

        <span
          className="text-[10px]"
          style={{ color: "var(--border2)", fontFamily: "var(--font-dm-mono)" }}
        >
          |
        </span>

        <span
          className="text-[10px] tabular-nums"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          Duration: {incident.duration}
        </span>

        {/* Unacked: countdown when resting, ACK button on hover */}
        {unacked && (
          <>
            <span className="flex-1" />
            {isHovered ? (
              <button
                onClick={(e) => { e.stopPropagation(); onAck?.(); }}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-colors hover:bg-white/10"
                style={{
                  color: "var(--text-muted)",
                  border: "1px solid var(--border2)",
                  fontFamily: "var(--font-dm-mono)",
                }}
              >
                <Check size={9} />
                ACK
              </button>
            ) : (
              <span
                className="text-[10px] tabular-nums"
                style={{
                  color: unackedMins >= 5 ? "#ff3b5c" : "var(--text-dim)",
                  fontFamily: "var(--font-dm-mono)",
                }}
              >
                {unackedMins < 1 ? "just now" : `${unackedMins}m unacknowledged`}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
