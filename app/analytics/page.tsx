"use client";

import { useState, useCallback, useRef } from "react";
import { format } from "date-fns";
import { periodData, type AnalyticsPeriod } from "@/lib/analyticsData";
import { useT } from "@/contexts/LanguageContext";
import AnalyticsPageTitle from "./_components/AnalyticsPageTitle";
import AIInsightLayer from "./_components/AIInsightLayer";
import NetworkReliabilityScore from "./_components/NetworkReliabilityScore";
import MTTDMTTRPanel from "./_components/MTTDMTTRPanel";
import ClassificationAccuracyPanel from "./_components/ClassificationAccuracyPanel";
import ServiceHealthScorecard from "./_components/ServiceHealthScorecard";
import IncidentTrendChart from "./_components/IncidentTrendChart";
import PeakHoursHeatmap from "./_components/PeakHoursHeatmap";
import RecurrenceList from "./_components/RecurrenceList";
import DateRangeModal from "../history/_components/DateRangeModal";

type AnalyticsTab = "intelligence" | "performance" | "services" | "patterns";

const PERIOD_LABELS: Record<Exclude<AnalyticsPeriod, "custom">, string> = {
  "7d":  "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

// Maps AI insight sectionRefs to the tab that contains them
const REF_TO_TAB: Record<string, AnalyticsTab> = {
  "kpi-panel":     "performance",
  "service-health": "services",
  "recurrence":    "patterns",
};

export default function AnalyticsPage() {
  const t = useT();

  const [period, setPeriod]           = useState<AnalyticsPeriod>("30d");
  const [tab,    setTab]              = useState<AnalyticsTab>("intelligence");
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [customRange,   setCustomRange]   = useState({ start: "", end: "" });
  const prevPeriodRef = useRef<AnalyticsPeriod>("30d");

  const resolvedPeriod: Exclude<AnalyticsPeriod, "custom"> =
    period === "custom" ? "30d" : period;

  const data = periodData[resolvedPeriod];
  const periodLabel =
    period === "custom" && customRange.start && customRange.end
      ? `${format(new Date(customRange.start), "d MMM")} – ${format(new Date(customRange.end), "d MMM yyyy")}`
      : PERIOD_LABELS[resolvedPeriod];

  const handlePeriodChange = useCallback((p: AnalyticsPeriod) => {
    if (p === "custom") {
      setDateRangeOpen(true);
    } else {
      prevPeriodRef.current = p;
      setPeriod(p);
    }
  }, []);

  const handleRangeApply = useCallback((start: string, end: string) => {
    prevPeriodRef.current = "custom";
    setPeriod("custom");
    setCustomRange({ start, end });
    setDateRangeOpen(false);
  }, []);

  const handleRangeCancel = useCallback(() => {
    setDateRangeOpen(false);
    setPeriod(prevPeriodRef.current);
  }, []);

  // AI insight "View supporting data" → switches to the relevant tab
  const handleNavigate = useCallback((ref: string) => {
    const target = REF_TO_TAB[ref];
    if (target) setTab(target);
  }, []);

  const tabs: { key: AnalyticsTab; label: string }[] = [
    { key: "intelligence", label: t.tabIntelligence },
    { key: "performance",  label: t.tabPerformance  },
    { key: "services",     label: t.tabServices     },
    { key: "patterns",     label: t.tabPatterns     },
  ];

  return (
    <div className="px-8 py-6 max-w-[1600px] mx-auto pb-16 flex flex-col gap-5">
      {/* ── Page title + global period selector ── */}
      <AnalyticsPageTitle period={period} onPeriodChange={handlePeriodChange} />

      {/* ── Tab bar ── */}
      <div
        className="flex items-center rounded-lg overflow-hidden self-start"
        style={{ border: "1px solid var(--border2)" }}
      >
        {tabs.map((tb, i) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className="px-5 py-2.5 text-[12px] transition-colors"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color:      tab === tb.key ? "#fff" : "var(--text-muted)",
              background: tab === tb.key ? "var(--magenta)" : "transparent",
              borderRight: i < tabs.length - 1 ? "1px solid var(--border2)" : "none",
            }}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}

      {tab === "intelligence" && (
        <div className="flex flex-col gap-5">
          <AIInsightLayer onScrollTo={handleNavigate} />
          <div className="grid grid-cols-3 gap-5 items-stretch">
            <NetworkReliabilityScore data={data} periodLabel={periodLabel} />
            <div className="col-span-2">
              <ClassificationAccuracyPanel data={data} />
            </div>
          </div>
        </div>
      )}

      {tab === "performance" && (
        <div className="flex flex-col gap-5">
          <MTTDMTTRPanel data={data} id="kpi-panel" />
          <IncidentTrendChart period={period} />
        </div>
      )}

      {tab === "services" && (
        <ServiceHealthScorecard data={data} id="service-health" />
      )}

      {tab === "patterns" && (
        <div className="flex flex-col gap-5">
          <PeakHoursHeatmap />
          <RecurrenceList id="recurrence" />
        </div>
      )}

      {/* Custom date range modal */}
      <DateRangeModal
        open={dateRangeOpen}
        initialStart={customRange.start}
        initialEnd={customRange.end}
        onApply={handleRangeApply}
        onCancel={handleRangeCancel}
      />
    </div>
  );
}
