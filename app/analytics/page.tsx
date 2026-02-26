"use client";

import { useState, useCallback } from "react";
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

const PERIOD_LABELS: Record<Exclude<AnalyticsPeriod, "custom">, string> = {
  "7d":  "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");

  const resolvedPeriod: Exclude<AnalyticsPeriod, "custom"> =
    period === "custom" ? "30d" : period;

  const data = periodData[resolvedPeriod];
  const periodLabel = PERIOD_LABELS[resolvedPeriod];

  const handlePeriodChange = useCallback((p: AnalyticsPeriod) => {
    setPeriod(p);
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
    </div>
  );
}
