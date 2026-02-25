"use client";

import { useMemo, useState } from "react";
import { format, addDays, startOfWeek, parseISO } from "date-fns";
import { HistoricalIncident } from "@/types/incident";
import { useT } from "@/contexts/LanguageContext";

interface Props {
  incidents: HistoricalIncident[];
  selectedDay: string | null;
  onDayClick: (date: string) => void;
}

interface DayData {
  date: string;
  count: number;
  critical: number;
  major: number;
  minor: number;
  isFuture: boolean;
}

interface TooltipState {
  data: DayData;
  x: number;
  y: number;
}

const WEEKS = 12;
const CELL = 20;
const GAP = 4;
const STRIDE = CELL + GAP;

function getCellColor(count: number, isFuture: boolean): string {
  if (isFuture) return "transparent";
  if (count === 0) return "var(--surface2)";
  if (count <= 2) return "rgba(226,0,138,0.22)";
  if (count <= 5) return "rgba(226,0,138,0.50)";
  if (count <= 9) return "rgba(226,0,138,0.78)";
  return "#E2008A";
}

function getCellGlow(count: number): string {
  if (count >= 10) return "0 0 10px rgba(226,0,138,0.55)";
  return "none";
}

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

export default function CalendarHeatmap({ incidents, selectedDay, onDayClick }: Props) {
  const t = useT();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");

    // Start of current week (Monday)
    const currentMonday = startOfWeek(today, { weekStartsOn: 1 });
    // Go back 11 more weeks so we show 12 total
    const startMonday = addDays(currentMonday, -(WEEKS - 1) * 7);

    // Build date → count map
    const dateMap = new Map<string, DayData>();
    for (const inc of incidents) {
      const key = inc.date;
      if (!dateMap.has(key)) {
        dateMap.set(key, { date: key, count: 0, critical: 0, major: 0, minor: 0, isFuture: false });
      }
      const d = dateMap.get(key)!;
      d.count++;
      if (inc.sev === "Critical") d.critical++;
      else if (inc.sev === "Major") d.major++;
      else d.minor++;
    }

    const weeksData: DayData[][] = [];
    const monthLabelsMap = new Map<number, string>();

    for (let w = 0; w < WEEKS; w++) {
      const week: DayData[] = [];
      const weekMonday = addDays(startMonday, w * 7);
      const prevMonday = w > 0 ? addDays(startMonday, (w - 1) * 7) : null;

      // Show month label on transition to new month
      if (!prevMonday || format(weekMonday, "M") !== format(prevMonday, "M")) {
        monthLabelsMap.set(w, format(weekMonday, "MMM"));
      }

      for (let d = 0; d < 7; d++) {
        const date = addDays(startMonday, w * 7 + d);
        const dateStr = format(date, "yyyy-MM-dd");
        const existing = dateMap.get(dateStr);
        week.push(
          existing ?? {
            date: dateStr,
            count: 0,
            critical: 0,
            major: 0,
            minor: 0,
            isFuture: dateStr > todayStr,
          }
        );
      }
      weeksData.push(week);
    }

    return { weeks: weeksData, monthLabels: monthLabelsMap };
  }, [incidents]);

  return (
    <div
      className="w-full px-6 py-5 rounded-xl"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[11px] uppercase tracking-widest"
          style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          {t.heatmapTitle}
        </span>

        <div className="flex items-center gap-2">
          <span
            className="text-[10px]"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            {t.less}
          </span>
          {[0, 1, 3, 6, 10].map((count) => (
            <div
              key={count}
              className="rounded-sm"
              style={{
                width: CELL - 4,
                height: CELL - 4,
                background: getCellColor(count, false),
              }}
            />
          ))}
          <span
            className="text-[10px]"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            {t.more}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex" style={{ gap: GAP }}>
        {/* Day labels column */}
        <div
          className="flex flex-col shrink-0"
          style={{ gap: GAP, paddingTop: 22, width: 28 }}
        >
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              style={{
                height: CELL,
                fontSize: 9,
                color: "var(--text-dim)",
                fontFamily: "var(--font-dm-mono)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Week columns */}
        <div className="flex" style={{ gap: GAP }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
              {/* Month label */}
              <div
                style={{
                  height: 18,
                  fontSize: 9,
                  color: "var(--text-dim)",
                  fontFamily: "var(--font-dm-mono)",
                  whiteSpace: "nowrap",
                  lineHeight: "18px",
                }}
              >
                {monthLabels.get(wi) ?? ""}
              </div>

              {/* Day cells */}
              {week.map((day, di) => {
                const isSelected = selectedDay === day.date;
                return (
                  <div
                    key={di}
                    onClick={() => {
                      if (day.isFuture) return;
                      onDayClick(isSelected ? "" : day.date);
                    }}
                    onMouseEnter={(e) => {
                      if (day.isFuture) return;
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      setTooltip({
                        data: day,
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 4,
                      background: getCellColor(day.count, day.isFuture),
                      cursor: day.isFuture ? "default" : day.count > 0 ? "pointer" : "default",
                      boxShadow: isSelected
                        ? `0 0 0 2px #ffffff, ${getCellGlow(day.count)}`
                        : getCellGlow(day.count),
                      transition: "transform 0.1s, box-shadow 0.1s",
                      flexShrink: 0,
                    }}
                    onMouseOver={(e) => {
                      if (!day.isFuture && day.count > 0) {
                        (e.currentTarget as HTMLElement).style.transform = "scale(1.2)";
                      }
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none rounded-lg px-3 py-2"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
            background: "var(--surface3)",
            border: "1px solid var(--border2)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          <div
            className="text-[11px] font-medium mb-0.5"
            style={{ color: "var(--text)" }}
          >
            {format(parseISO(tooltip.data.date), "EEEE d MMM")} ·{" "}
            {tooltip.data.count}{" "}
            {tooltip.data.count === 1 ? "incident" : "incidents"}
          </div>
          {tooltip.data.count > 0 && (
            <div className="flex gap-2.5 text-[10px]">
              {tooltip.data.critical > 0 && (
                <span style={{ color: "#ff3b5c" }}>{tooltip.data.critical} Critical</span>
              )}
              {tooltip.data.major > 0 && (
                <span style={{ color: "#ff8c00" }}>{tooltip.data.major} Major</span>
              )}
              {tooltip.data.minor > 0 && (
                <span style={{ color: "#f5c518" }}>{tooltip.data.minor} Minor</span>
              )}
            </div>
          )}
          {tooltip.data.count === 0 && (
            <div className="text-[10px]" style={{ color: "var(--text-dim)" }}>
              No incidents
            </div>
          )}
        </div>
      )}
    </div>
  );
}
