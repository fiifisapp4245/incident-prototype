"use client";

import { BarChart2 } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import type { AnalyticsPeriod } from "@/lib/analyticsData";

interface Props {
  period: AnalyticsPeriod;
  onPeriodChange: (p: AnalyticsPeriod) => void;
}

const PILLS: { key: AnalyticsPeriod; labelKey: "period7d" | "period30d" | "period90d" | "periodCustom" }[] = [
  { key: "7d",     labelKey: "period7d"     },
  { key: "30d",    labelKey: "period30d"    },
  { key: "90d",    labelKey: "period90d"    },
  { key: "custom", labelKey: "periodCustom" },
];

export default function AnalyticsPageTitle({ period, onPeriodChange }: Props) {
  const t = useT();

  return (
    <div className="flex items-center justify-between">
      {/* Left: title + icon */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded flex items-center justify-center shrink-0"
          style={{ background: "var(--surface3)", border: "1px solid var(--border2)" }}
        >
          <BarChart2 size={18} style={{ color: "var(--magenta)" }} />
        </div>
        <div>
          <h1
            className="text-2xl leading-none"
            style={{ fontFamily: "var(--font-syne)", fontWeight: 800, color: "var(--text)" }}
          >
            {t.analyticsTitle}
          </h1>
          <p
            className="text-[11px] mt-0.5"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
          >
            {t.aiMonitoring}
          </p>
        </div>
      </div>

      {/* Right: period pills */}
      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--border2)" }}
      >
        {PILLS.map((pill, i) => {
          const active = period === pill.key;
          return (
            <button
              key={pill.key}
              onClick={() => onPeriodChange(pill.key)}
              className="px-4 py-2 text-[12px] transition-colors"
              style={{
                fontFamily: "var(--font-dm-mono)",
                color: active ? "#fff" : "var(--text-muted)",
                background: active ? "var(--magenta)" : "transparent",
                borderRight: i < PILLS.length - 1 ? "1px solid var(--border2)" : "none",
              }}
            >
              {t[pill.labelKey]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
