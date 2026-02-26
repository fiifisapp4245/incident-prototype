"use client";

import { useState, useCallback, useRef } from "react";
import { format } from "date-fns";
import { periodData, type AnalyticsPeriod } from "@/lib/analyticsData";
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

const PERIOD_LABELS: Record<Exclude<AnalyticsPeriod, "custom">, string> = {
  "7d":  "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
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

  const handleScrollTo = useCallback((ref: string) => {
    const el = document.getElementById(ref);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="px-8 py-6 max-w-[1600px] mx-auto space-y-6 pb-16">
      {/* ── Page title + global period selector ───────────────── */}
      <AnalyticsPageTitle period={period} onPeriodChange={handlePeriodChange} />

      {/* ── Section 1: AI Insight Layer ───────────────────────── */}
      <AIInsightLayer onScrollTo={handleScrollTo} />

      {/* ── Section 2: Performance Health ─────────────────────── */}
      {/* Row A: Network Reliability | MTTD/MTTR | Classification Accuracy */}
      <div className="grid grid-cols-3 gap-5 items-stretch">
        <NetworkReliabilityScore data={data} periodLabel={periodLabel} />
        <MTTDMTTRPanel data={data} id="kpi-panel" />
        <ClassificationAccuracyPanel data={data} />
      </div>

      {/* Row B: Service Health Scorecard (full width) */}
      <ServiceHealthScorecard data={data} id="service-health" />

      {/* ── Section 3: Deep Pattern Analysis ──────────────────── */}
      <IncidentTrendChart period={period} />

      {/* Bottom row: Peak Hours Heatmap | Recurrence List */}
      <div className="grid grid-cols-2 gap-5 items-start">
        <PeakHoursHeatmap />
        <RecurrenceList id="recurrence" />
      </div>

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
