"use client";

import { useEffect, useRef, useState } from "react";
import { PieChart, Pie } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useT } from "@/contexts/LanguageContext";

const chartConfig = {
  value:    { label: "Incidents" },
  critical: { label: "Critical", color: "#ff3b5c" },
  major:    { label: "Major",    color: "#ff8c00" },
  minor:    { label: "Minor",    color: "#f5c518" },
  resolved: { label: "Resolved", color: "#00c896" },
} satisfies ChartConfig;

export default function SeverityDonut() {
  const t = useT();
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const pieData = [
    { status: "critical", name: t.critical, value: 3,  fill: "var(--color-critical)", color: "#ff3b5c" },
    { status: "major",    name: t.major,    value: 6,  fill: "var(--color-major)",    color: "#ff8c00" },
    { status: "minor",    name: t.minor,    value: 5,  fill: "var(--color-minor)",    color: "#f5c518" },
    { status: "resolved", name: t.resolved, value: 12, fill: "var(--color-resolved)", color: "#00c896" },
  ];

  const total = pieData.reduce((s, d) => s + d.value, 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimeout(() => setAnimated(true), 120);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-xl p-6 h-full flex flex-col"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-[11px] uppercase tracking-widest mb-5"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        {t.severityDistribution}
      </p>

      <div className="flex items-center gap-6 flex-1">
        {/* Donut with center label */}
        <div className="relative shrink-0" style={{ width: 180, height: 180 }}>
          <ChartContainer config={chartConfig} className="w-[180px] h-[180px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={86}
                dataKey="value"
                nameKey="status"
                strokeWidth={0}
                animationDuration={800}
              />
            </PieChart>
          </ChartContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className="text-3xl font-extrabold leading-none"
              style={{ color: "var(--text)", fontFamily: "var(--font-syne)", fontWeight: 800 }}
            >
              {total}
            </span>
            <span
              className="text-[9px] uppercase tracking-wider mt-1 text-center leading-tight"
              style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)", whiteSpace: "pre-wrap" }}
            >
              {t.totalIncidents}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-4 flex-1">
          {pieData.map((d) => {
            const pct = Math.round((d.value / total) * 100);
            return (
              <div key={d.status}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ background: d.color }}
                    />
                    <span
                      className="text-[12px]"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {d.name}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-[15px] font-bold leading-none"
                      style={{ color: d.color, fontFamily: "var(--font-syne)", fontWeight: 700 }}
                    >
                      {d.value}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: "var(--surface3)" }}
                >
                  <div
                    className="h-full rounded-full progress-bar"
                    style={{
                      width: animated ? `${pct}%` : "0%",
                      background: d.color,
                      opacity: 0.75,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
