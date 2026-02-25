"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { format, subDays } from "date-fns";
import { historyIncidents } from "@/lib/historyData";
import HistoryPageTitle, { type Period } from "./_components/HistoryPageTitle";
import HistorySummaryBar from "./_components/HistorySummaryBar";
import CalendarHeatmap from "./_components/CalendarHeatmap";
import HistoryFilterBar, { type HistoryFilters } from "./_components/HistoryFilterBar";
import HistoryFeed, { type ViewMode } from "./_components/HistoryFeed";
import ComparisonTray from "./_components/ComparisonTray";
import ComparisonModal from "./_components/ComparisonModal";

function fmt(d: Date) {
  return format(d, "yyyy-MM-dd");
}

function getDateRange(period: Period): { start: string; end: string } {
  const today = new Date();
  switch (period) {
    case "today":
      return { start: fmt(today), end: fmt(today) };
    case "yesterday": {
      const y = subDays(today, 1);
      return { start: fmt(y), end: fmt(y) };
    }
    case "7d":
      return { start: fmt(subDays(today, 6)), end: fmt(today) };
    case "30d":
      return { start: fmt(subDays(today, 29)), end: fmt(today) };
    case "90d":
      return { start: fmt(subDays(today, 89)), end: fmt(today) };
    case "custom":
      return { start: "", end: "" }; // caller manages
  }
}

export default function HistoryPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [filters, setFilters] = useState<HistoryFilters>({
    severity: "All",
    service: "All",
    engineer: "All",
    resolutionStatus: "All",
    search: "",
    startDate: fmt(subDays(new Date(), 29)),
    endDate: fmt(new Date()),
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  // Sync date range when period changes (not custom)
  useEffect(() => {
    if (period === "custom") return;
    const range = getDateRange(period);
    setFilters((f) => ({ ...f, startDate: range.start, endDate: range.end }));
    setSelectedDay(null); // clear heatmap selection on period change
  }, [period]);

  const handlePeriodChange = useCallback((p: Period) => {
    setPeriod(p);
    if (p !== "custom") {
      setSelectedDay(null);
    }
  }, []);

  const handleDayClick = useCallback((date: string) => {
    setSelectedDay(date || null);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelected(new Set());
  }, []);

  const handleCompare = useCallback(() => {
    setCompareOpen(true);
  }, []);

  // Effective date range (heatmap day click overrides period range)
  const effectiveStart = selectedDay ?? filters.startDate;
  const effectiveEnd = selectedDay ?? filters.endDate;

  const filteredIncidents = useMemo(() => {
    return historyIncidents.filter((inc) => {
      // Date range
      if (effectiveStart && inc.date < effectiveStart) return false;
      if (effectiveEnd && inc.date > effectiveEnd) return false;

      // Severity
      if (filters.severity !== "All" && inc.sev !== filters.severity) return false;

      // Service
      if (filters.service !== "All" && inc.service !== filters.service) return false;

      // Engineer
      if (filters.engineer !== "All" && inc.assigned !== filters.engineer) return false;

      // Resolution status (all historical are Resolved, so "Unresolved" returns none)
      if (filters.resolutionStatus === "Unresolved") return false;

      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !inc.title.toLowerCase().includes(q) &&
          !inc.id.toLowerCase().includes(q)
        )
          return false;
      }

      return true;
    });
  }, [effectiveStart, effectiveEnd, filters]);

  const selectedIncidents = historyIncidents.filter((i) => selected.has(i.id));

  return (
    <>
      <div className="px-8 py-6 max-w-[1600px] mx-auto space-y-5 pb-24">
        {/* Section 1: Page header + period selector */}
        <HistoryPageTitle period={period} onPeriodChange={handlePeriodChange} />

        {/* Section 2: Summary bar */}
        <HistorySummaryBar
          incidents={filteredIncidents}
          startDate={effectiveStart}
          endDate={effectiveEnd}
          selectedDay={selectedDay}
        />

        {/* Section 3: Calendar heatmap */}
        <CalendarHeatmap
          incidents={historyIncidents}
          selectedDay={selectedDay}
          onDayClick={handleDayClick}
        />

        {/* Section 4: Filter bar */}
        <HistoryFilterBar
          filters={filters}
          setFilters={setFilters}
          period={period}
          onPeriodChange={handlePeriodChange}
        />

        {/* Section 5: Incident feed */}
        <HistoryFeed
          incidents={filteredIncidents}
          selected={selected}
          onToggle={handleToggle}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Section 6: Comparison tray (fixed bottom) */}
      <ComparisonTray
        selected={selected}
        incidents={historyIncidents}
        onClear={handleClearSelection}
        onCompare={handleCompare}
      />

      {/* Comparison modal */}
      <ComparisonModal
        open={compareOpen}
        incidents={selectedIncidents}
        onClose={() => setCompareOpen(false)}
      />
    </>
  );
}
