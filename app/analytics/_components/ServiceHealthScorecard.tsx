"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import type { PeriodData, ServiceHealth } from "@/lib/analyticsData";

// Small donut ring per tile
function TileRing({ score }: { score: number }) {
  const r = 22;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;
  const color =
    score >= 80 ? "#00c896" :
    score >= 60 ? "#ff8c00" :
    "#ff3b5c";

  return (
    <svg width={54} height={54} viewBox="0 0 54 54" className="shrink-0">
      <circle cx={27} cy={27} r={r} fill="none" stroke="var(--surface3)" strokeWidth={5} />
      <circle
        cx={27} cy={27} r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeDashoffset={circumference / 4}
        style={{ transition: "stroke-dasharray 0.5s ease" }}
      />
      <text
        x={27} y={27}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight={700}
        fill={color}
        fontFamily="var(--font-syne)"
      >
        {score}
      </text>
    </svg>
  );
}

const SEV_COLOR: Record<string, string> = {
  Critical: "#ff3b5c",
  Major:    "#ff8c00",
  Minor:    "#f5c518",
};

function ServiceTile({ svc }: { svc: ServiceHealth }) {
  const t = useT();

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-colors hover:border-white/20"
      style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
    >
      {/* Top row: ring + name + trend */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <TileRing score={svc.score} />
          <span
            className="text-[13px] font-semibold leading-tight"
            style={{ fontFamily: "var(--font-ibm-sans)", color: "var(--text)" }}
          >
            {svc.service}
          </span>
        </div>
        {/* Trend arrow */}
        <div className="flex items-center gap-1 shrink-0 mt-1">
          {svc.trend === "up" ? (
            <TrendingUp size={13} color="#00c896" />
          ) : svc.trend === "down" ? (
            <TrendingDown size={13} color="#ff3b5c" />
          ) : (
            <Minus size={13} color="var(--text-dim)" />
          )}
          <span
            className="text-[10px]"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color: svc.trend === "up" ? "#00c896" : svc.trend === "down" ? "#ff3b5c" : "var(--text-dim)",
            }}
          >
            {svc.trend === "stable"
              ? t.stable
              : `${svc.trendPct > 0 ? "+" : ""}${svc.trendPct}%`}
          </span>
        </div>
      </div>

      {/* Micro-stats row */}
      <div className="grid grid-cols-3 gap-1">
        {/* Incident count */}
        <div className="flex flex-col">
          <span
            className="text-[17px] leading-none font-bold"
            style={{ fontFamily: "var(--font-syne)", color: "var(--text)" }}
          >
            {svc.incidentCount}
          </span>
          <span
            className="text-[9px] mt-0.5 leading-tight"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
          >
            Incidents
          </span>
        </div>

        {/* Avg MTTR */}
        <div className="flex flex-col">
          <span
            className="text-[17px] leading-none font-bold"
            style={{ fontFamily: "var(--font-syne)", color: "var(--text)" }}
          >
            {svc.avgMTTR}
          </span>
          <span
            className="text-[9px] mt-0.5 leading-tight"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
          >
            Avg {t.mttrShort}
          </span>
        </div>

        {/* Worst severity */}
        <div className="flex flex-col">
          <span
            className="text-[13px] leading-none font-semibold"
            style={{ fontFamily: "var(--font-syne)", color: SEV_COLOR[svc.worstSeverity] }}
          >
            {svc.worstSeverity}
          </span>
          <span
            className="text-[9px] mt-0.5 leading-tight"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
          >
            {t.worstSev}
          </span>
        </div>
      </div>
    </div>
  );
}

interface Props {
  data: PeriodData;
  id?: string;
}

export default function ServiceHealthScorecard({ data, id }: Props) {
  const t = useT();

  return (
    <section id={id}>
      {/* Section label */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
        >
          {t.serviceHealthTitle}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      {/* 3×2 grid */}
      <div className="grid grid-cols-3 gap-4">
        {data.serviceHealth.map((svc) => (
          <ServiceTile key={svc.id} svc={svc} />
        ))}
      </div>
    </section>
  );
}
