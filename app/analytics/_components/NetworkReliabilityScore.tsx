"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import type { PeriodData } from "@/lib/analyticsData";

// SVG donut ring helper
function DonutRing({ score }: { score: number }) {
  const r = 52;
  const cx = 64;
  const cy = 64;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;
  const gap = circumference - filled;

  // Color: green > 90, amber 75-90, red < 75
  const color =
    score >= 90 ? "#00c896" :
    score >= 75 ? "#ff8c00" :
    "#ff3b5c";

  return (
    <svg width={128} height={128} viewBox="0 0 128 128">
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="var(--surface3)"
        strokeWidth={10}
      />
      {/* Filled arc */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${gap}`}
        strokeDashoffset={circumference / 4}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}

interface Props {
  data: PeriodData;
  periodLabel: string;
}

export default function NetworkReliabilityScore({ data, periodLabel }: Props) {
  const t = useT();
  const score = data.networkReliability;

  const color =
    score >= 90 ? "#00c896" :
    score >= 75 ? "#ff8c00" :
    "#ff3b5c";

  return (
    <div
      className="rounded-xl p-6 flex flex-col items-center justify-center text-center h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Ring + number overlay */}
      <div className="relative flex items-center justify-center mb-4">
        <DonutRing score={score} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl leading-none"
            style={{ fontFamily: "var(--font-syne)", fontWeight: 800, color }}
          >
            {score.toFixed(1)}%
          </span>
        </div>
      </div>

      <p
        className="text-[13px] font-semibold"
        style={{ color: "var(--text)", fontFamily: "var(--font-ibm-sans)" }}
      >
        {t.networkReliability}
      </p>
      <p
        className="text-[11px] mt-0.5"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
      >
        {periodLabel}
      </p>

      {/* Trend row */}
      <div className="flex items-center gap-1.5 mt-3">
        {data.mttrChange < 0 ? (
          <TrendingUp size={13} color="#00c896" />
        ) : data.mttrChange > 0 ? (
          <TrendingDown size={13} color="#ff3b5c" />
        ) : (
          <Minus size={13} color="var(--text-dim)" />
        )}
        <span
          className="text-[11px]"
          style={{
            fontFamily: "var(--font-dm-mono)",
            color: data.mttrChange < 0 ? "#00c896" : data.mttrChange > 0 ? "#ff3b5c" : "var(--text-dim)",
          }}
        >
          {t.vsPrevPeriod}
        </span>
      </div>
    </div>
  );
}
