"use client";

import { useState } from "react";
import { TrendingUp, AlertTriangle, Repeat2, X, ArrowRight } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import { aiInsights, type AIInsight } from "@/lib/analyticsData";

// Accent config per insight type
const ACCENTS: Record<AIInsight["type"], { color: string; bg: string; icon: React.ReactNode; labelKey: "trendInsight" | "warningInsight" | "patternInsight" }> = {
  trend: {
    color: "#00c896",
    bg: "rgba(0,200,150,0.08)",
    icon: <TrendingUp size={14} />,
    labelKey: "trendInsight",
  },
  warning: {
    color: "#ff8c00",
    bg: "rgba(255,140,0,0.08)",
    icon: <AlertTriangle size={14} />,
    labelKey: "warningInsight",
  },
  pattern: {
    color: "#E2008A",
    bg: "rgba(226,0,138,0.08)",
    icon: <Repeat2 size={14} />,
    labelKey: "patternInsight",
  },
};

interface InsightCardProps {
  insight: AIInsight;
  onDismiss: (id: string) => void;
  onScrollTo: (ref: string) => void;
}

function InsightCard({ insight, onDismiss, onScrollTo }: InsightCardProps) {
  const t = useT();
  const acc = ACCENTS[insight.type];

  return (
    <div
      className="relative flex flex-col gap-3 rounded-xl p-5 flex-1 min-w-0"
      style={{
        background: acc.bg,
        border: `1px solid ${acc.color}33`,
      }}
    >
      {/* Dismiss */}
      <button
        onClick={() => onDismiss(insight.id)}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-80 transition-opacity"
        aria-label={t.dismissInsight}
      >
        <X size={13} style={{ color: "var(--text-muted)" }} />
      </button>

      {/* Type badge */}
      <div className="flex items-center gap-1.5" style={{ color: acc.color }}>
        {acc.icon}
        <span
          className="text-[10px] uppercase tracking-widest font-semibold"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {t[acc.labelKey]}
        </span>
      </div>

      {/* Insight text */}
      <p
        className="text-[13px] leading-relaxed pr-4"
        style={{ color: "var(--text)", fontFamily: "var(--font-ibm-sans)" }}
      >
        {insight.text}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span
          className="text-[11px]"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          {insight.supportText}
        </span>
        <button
          onClick={() => onScrollTo(insight.sectionRef)}
          className="flex items-center gap-1 text-[11px] transition-opacity hover:opacity-70"
          style={{ color: acc.color, fontFamily: "var(--font-dm-mono)" }}
        >
          {t.viewSupportingData}
          <ArrowRight size={11} />
        </button>
      </div>

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r"
        style={{ background: acc.color }}
      />
    </div>
  );
}

interface Props {
  onScrollTo: (ref: string) => void;
}

export default function AIInsightLayer({ onScrollTo }: Props) {
  const t = useT();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = aiInsights.filter((ins) => !dismissed.has(ins.id));

  const handleDismiss = (id: string) => {
    setDismissed((prev) => { const next = new Set(prev); next.add(id); return next; });
  };

  return (
    <section>
      {/* Section label */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
        >
          {t.aiInsightLayer}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        {dismissed.size > 0 && (
          <button
            className="text-[10px] opacity-50 hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-muted)" }}
            onClick={() => setDismissed(new Set())}
          >
            Restore {dismissed.size} dismissed
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div
          className="rounded-xl px-6 py-5 text-center text-[13px]"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-dim)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          {t.noInsights}
        </div>
      ) : (
        <div className="flex gap-4">
          {visible.map((ins) => (
            <InsightCard
              key={ins.id}
              insight={ins}
              onDismiss={handleDismiss}
              onScrollTo={onScrollTo}
            />
          ))}
        </div>
      )}
    </section>
  );
}
