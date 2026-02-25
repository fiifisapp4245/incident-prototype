"use client";

import { useT } from "@/contexts/LanguageContext";

export type Period = "today" | "yesterday" | "7d" | "30d" | "90d" | "custom";

interface Props {
  period: Period;
  onPeriodChange: (p: Period) => void;
}

export default function HistoryPageTitle({ period, onPeriodChange }: Props) {
  const t = useT();

  const periods: { key: Period; label: string }[] = [
    { key: "today",     label: t.periodToday },
    { key: "yesterday", label: t.periodYesterday },
    { key: "7d",        label: t.period7d },
    { key: "30d",       label: t.period30d },
    { key: "90d",       label: t.period90d },
    { key: "custom",    label: t.periodCustom },
  ];

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <h1
        className="text-[28px] leading-none"
        style={{ fontFamily: "var(--font-syne)", fontWeight: 800, color: "var(--text)" }}
      >
        {t.incidentHistory}
      </h1>

      {/* Period quick-select */}
      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--border2)" }}
      >
        {periods.map((p, i) => (
          <button
            key={p.key}
            onClick={() => onPeriodChange(p.key)}
            className="px-4 py-2 text-[12px] transition-colors"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color: period === p.key ? "#fff" : "var(--text-muted)",
              background: period === p.key ? "var(--magenta)" : "transparent",
              borderRight:
                i < periods.length - 1 ? "1px solid var(--border2)" : "none",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
