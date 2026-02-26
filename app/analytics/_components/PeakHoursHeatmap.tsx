"use client";

import { useState } from "react";
import { useT } from "@/contexts/LanguageContext";
import { heatmapData, heatmapMax } from "@/lib/analyticsData";

const DAYS   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CELL_W = 22;
const CELL_H = 22;
const CELL_GAP = 2;
const LABEL_W  = 34;
const LABEL_H  = 20;

// Interpolate between surface3 and magenta based on intensity [0–1]
function heatColor(intensity: number): string {
  if (intensity <= 0) return "var(--surface3)";
  // low: 0.1–0.3 → muted magenta; high: → full magenta
  const alpha = 0.12 + intensity * 0.88;
  return `rgba(226, 0, 138, ${alpha.toFixed(2)})`;
}

interface TooltipState {
  x: number;
  y: number;
  day: string;
  hour: number;
  value: number;
}

interface Props {
  id?: string;
}

export default function PeakHoursHeatmap({ id }: Props) {
  const t = useT();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const totalW = LABEL_W + 24 * (CELL_W + CELL_GAP);
  const totalH = LABEL_H + 7  * (CELL_H + CELL_GAP);

  return (
    <div id={id} className="flex flex-col gap-3">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
        >
          {t.peakHoursTitle}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      <div
        className="rounded-xl p-5 relative"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* SVG heatmap */}
        <svg
          width={totalW}
          height={totalH}
          style={{ overflow: "visible", maxWidth: "100%" }}
        >
          {/* Hour labels (top) */}
          {Array.from({ length: 24 }, (_, h) => (
            (h % 3 === 0) && (
              <text
                key={`hl-${h}`}
                x={LABEL_W + h * (CELL_W + CELL_GAP) + CELL_W / 2}
                y={LABEL_H - 4}
                textAnchor="middle"
                fontSize={8}
                fill="var(--text-dim)"
                fontFamily="var(--font-dm-mono)"
              >
                {h === 0 ? "12am" : h === 12 ? "12pm" : h < 12 ? `${h}am` : `${h - 12}pm`}
              </text>
            )
          ))}

          {/* Day labels (left) + cells */}
          {DAYS.map((day, di) => (
            <g key={day}>
              {/* Day label */}
              <text
                x={LABEL_W - 4}
                y={LABEL_H + di * (CELL_H + CELL_GAP) + CELL_H / 2 + 4}
                textAnchor="end"
                fontSize={9}
                fill={di < 5 ? "var(--text-muted)" : "var(--text-dim)"}
                fontFamily="var(--font-dm-mono)"
              >
                {day}
              </text>

              {/* Cells for this day */}
              {Array.from({ length: 24 }, (_, h) => {
                const cell = heatmapData.find((c) => c.day === di && c.hour === h);
                const val   = cell?.value ?? 0;
                const intensity = val / heatmapMax;
                const cx = LABEL_W + h * (CELL_W + CELL_GAP);
                const cy = LABEL_H + di * (CELL_H + CELL_GAP);

                return (
                  <rect
                    key={`${di}-${h}`}
                    x={cx}
                    y={cy}
                    width={CELL_W}
                    height={CELL_H}
                    rx={3}
                    fill={heatColor(intensity)}
                    style={{ cursor: val > 0 ? "pointer" : "default", transition: "fill 0.2s" }}
                    onMouseEnter={(e) => {
                      if (val > 0) {
                        const rect = (e.target as SVGRectElement).getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                          day: DAYS[di],
                          hour: h,
                          value: val,
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </g>
          ))}
        </svg>

        {/* Colour scale legend */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className="text-[9px]"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
          >
            {t.less}
          </span>
          <div
            className="flex gap-px"
            aria-hidden
          >
            {[0, 0.1, 0.25, 0.45, 0.65, 0.85, 1].map((v, i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: heatColor(v),
                }}
              />
            ))}
          </div>
          <span
            className="text-[9px]"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
          >
            {t.more}
          </span>
        </div>

        {/* Floating tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 pointer-events-none px-3 py-2 rounded-lg text-[11px]"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
              background: "var(--surface2)",
              border: "1px solid var(--border2)",
              fontFamily: "var(--font-dm-mono)",
              color: "var(--text)",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "var(--text-muted)" }}>{tooltip.day} </span>
            <span>
              {tooltip.hour === 0
                ? "12:00 am"
                : tooltip.hour < 12
                ? `${tooltip.hour}:00 am`
                : tooltip.hour === 12
                ? "12:00 pm"
                : `${tooltip.hour - 12}:00 pm`}
            </span>
            <span
              className="ml-2 font-bold"
              style={{ color: "var(--magenta)" }}
            >
              {tooltip.value} incidents
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
