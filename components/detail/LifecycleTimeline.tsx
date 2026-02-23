"use client";

import { Incident } from "@/types/incident";
import { SEV_COLOR } from "@/lib/utils";
import { useT } from "@/contexts/LanguageContext";

interface Props {
  incident: Incident;
}

export default function LifecycleTimeline({ incident }: Props) {
  const t = useT();
  const topColor = SEV_COLOR[incident.sev];

  return (
    <div
      className="rounded-lg p-5 h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <p
          className="text-[11px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
        >
          {t.incidentLifecycle}
        </p>
        <span
          className="text-[10px] px-2 py-0.5 rounded"
          style={{
            color: "var(--resolved)",
            background: "rgba(0,200,150,0.1)",
            border: "1px solid rgba(0,200,150,0.25)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          {t.autoTracked}
        </span>
      </div>

      <div className="relative pl-6">
        {/* Gradient vertical line */}
        <div
          className="absolute left-[7px] top-2 bottom-2 w-[2px] rounded"
          style={{
            background: `linear-gradient(180deg, ${topColor} 0%, #00c896 100%)`,
            opacity: 0.5,
          }}
        />

        <div className="flex flex-col gap-6">
          {incident.timeline.map((ev, i) => (
            <div
              key={i}
              className="relative animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Dot */}
              <div
                className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                style={{ border: `2px solid ${ev.color}` }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: ev.color }}
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[11px] tabular-nums"
                    style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
                  >
                    {ev.time} UTC
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded"
                    style={{
                      color: ev.color,
                      background: ev.badgeBg,
                      border: `1px solid ${ev.color}44`,
                      fontFamily: "var(--font-dm-mono)",
                    }}
                  >
                    {ev.badge}
                  </span>
                </div>
                <p
                  className="text-[13px] font-bold mb-0.5"
                  style={{ color: "var(--text)", fontFamily: "var(--font-syne)" }}
                >
                  {ev.event}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
                >
                  {ev.actor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
