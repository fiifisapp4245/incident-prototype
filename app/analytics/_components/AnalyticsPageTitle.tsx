"use client";

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
    <div className="flex items-center justify-between flex-wrap gap-4">
      <h1
        className="text-[28px] leading-none"
        style={{ fontFamily: "var(--font-syne)", fontWeight: 800, color: "var(--text)" }}
      >
        {t.analyticsTitle}
      </h1>

      {/* Period pills */}
      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--border2)" }}
      >
        {PILLS.map((pill, i) => (
          <button
            key={pill.key}
            onClick={() => onPeriodChange(pill.key)}
            className="px-4 py-2 text-[12px] transition-colors"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color: period === pill.key ? "#fff" : "var(--text-muted)",
              background: period === pill.key ? "var(--magenta)" : "transparent",
              borderRight: i < PILLS.length - 1 ? "1px solid var(--border2)" : "none",
            }}
          >
            {t[pill.labelKey]}
          </button>
        ))}
      </div>
    </div>
  );
}
