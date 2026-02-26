"use client";

import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Search, X, ExternalLink } from "lucide-react";
import { PieChart, Pie, Cell, Label } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useT } from "@/contexts/LanguageContext";
import { recurrencePatterns } from "@/lib/analyticsData";
import type { PeriodData, ServiceHealth, ServiceCategory } from "@/lib/analyticsData";

// ─── Colour helpers ──────────────────────────────────────────────────────────

const SEV_COLOR: Record<string, string> = {
  Critical: "#ff3b5c",
  Major:    "#ff8c00",
  Minor:    "#f5c518",
};

function scoreColor(s: number) {
  return s >= 80 ? "#00c896" : s >= 60 ? "#ff8c00" : "#ff3b5c";
}

type FilterKey = "all" | "degraded" | "critical" | "stable";

function filterScore(svc: ServiceHealth, filter: FilterKey) {
  if (filter === "all")      return true;
  if (filter === "critical") return svc.score < 60;
  if (filter === "degraded") return svc.score >= 60 && svc.score < 80;
  return svc.score >= 80;
}

// ─── Recharts donut ring (matches NetworkReliabilityScore pattern) ────────────

function DonutRing({
  score,
  containerClass = "aspect-square w-[60px]",
  innerRadius = 20,
  outerRadius = 27,
  fontSize = 10,
}: {
  score: number;
  containerClass?: string;
  innerRadius?: number;
  outerRadius?: number;
  fontSize?: number;
}) {
  const color   = scoreColor(score);
  const pieData = [{ value: score }, { value: 100 - score }];

  return (
    <ChartContainer config={{}} className={`shrink-0 ${containerClass}`}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
          isAnimationActive={false}
        >
          <Cell fill={color} />
          <Cell fill="var(--surface3)" />
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
              const { cx, cy } = viewBox as { cx: number; cy: number };
              return (
                <text textAnchor="middle" dominantBaseline="middle">
                  <tspan
                    x={cx} y={cy}
                    fontSize={fontSize}
                    fontWeight="800"
                    fontFamily="var(--font-syne)"
                    fill={color}
                  >
                    {score}
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

// ─── Score driver bar ─────────────────────────────────────────────────────────

function DriverBar({ label, score, maxScore, detail }: {
  label: string; score: number; maxScore: number; detail: string;
}) {
  const pct   = Math.round((score / maxScore) * 100);
  const color = pct >= 80 ? "#00c896" : pct >= 60 ? "#ff8c00" : "#ff3b5c";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px]" style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-muted)" }}>
          {label}
        </span>
        <span className="text-[11px] tabular-nums" style={{ fontFamily: "var(--font-dm-mono)", color }}>
          {score}/{maxScore}
        </span>
      </div>
      <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: "var(--surface3)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: "width 0.5s ease" }} />
      </div>
      <span className="text-[10px]" style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}>
        {detail}
      </span>
    </div>
  );
}

// ─── Service detail modal ─────────────────────────────────────────────────────

function ServiceModal({ svc, onClose }: { svc: ServiceHealth; onClose: () => void }) {
  const t = useT();

  const svcRecurrence = recurrencePatterns.filter(
    (p) => p.service.toLowerCase() === svc.service.toLowerCase()
  );

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden rounded-xl w-[620px] max-w-[95vw]"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border2)",
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
            >
              {svc.category}
            </span>
            <span
              className="text-[16px] font-bold"
              style={{ fontFamily: "var(--font-syne)", fontWeight: 700, color: "var(--text)" }}
            >
              {svc.service}
            </span>
          </div>
        </div>

        {/* Scrollable body */}
        <div
          className="flex flex-col gap-6 p-6 overflow-y-auto"
          style={{ maxHeight: "76vh" }}
        >
          {/* Score hero */}
          <div className="flex items-center gap-6">
            <DonutRing
              score={svc.score}
              containerClass="aspect-square w-[100px]"
              innerRadius={34}
              outerRadius={44}
              fontSize={18}
            />
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {svc.trend === "up"
                  ? <TrendingUp  size={14} color="#00c896" />
                  : svc.trend === "down"
                  ? <TrendingDown size={14} color="#ff3b5c" />
                  : <Minus size={14} color="var(--text-dim)" />
                }
                <span
                  className="text-[12px]"
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    color: svc.trend === "up" ? "#00c896" : svc.trend === "down" ? "#ff3b5c" : "var(--text-dim)",
                  }}
                >
                  {svc.trend === "stable"
                    ? t.stable
                    : `${svc.trendPct > 0 ? "+" : ""}${svc.trendPct}% vs prev. period`}
                </span>
              </div>
              <div className="flex items-center gap-6">
                {([
                  { value: `${svc.incidentCount}`, label: "Incidents" },
                  { value: `${svc.avgMTTR}m`,      label: `Avg ${t.mttrShort}` },
                  { value: svc.worstSeverity,       label: t.worstSev, color: SEV_COLOR[svc.worstSeverity] },
                ] as Array<{ value: string; label: string; color?: string }>).map(({ value, label, color: c }) => (
                  <div key={label}>
                    <span
                      className="text-[22px] font-bold leading-none block"
                      style={{ fontFamily: "var(--font-syne)", color: c ?? "var(--text)" }}
                    >
                      {value}
                    </span>
                    <span className="text-[9px]" style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div>
            <span
              className="text-[10px] uppercase tracking-widest block mb-3"
              style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
            >
              {t.scoreBreakdown}
            </span>
            <div className="flex flex-col gap-4">
              {svc.scoreBreakdown.map((d) => <DriverBar key={d.label} {...d} />)}
            </div>
          </div>

          {/* Recent incidents */}
          <div>
            <span
              className="text-[10px] uppercase tracking-widest block mb-3"
              style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
            >
              {t.recentIncidents}
            </span>
            <div className="flex flex-col gap-1.5">
              {svc.recentIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg"
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
                >
                  <span
                    className="text-[10px] shrink-0 mt-0.5 px-1.5 py-0.5 rounded"
                    style={{
                      fontFamily:  "var(--font-dm-mono)",
                      color:       SEV_COLOR[inc.sev],
                      background:  `${SEV_COLOR[inc.sev]}18`,
                      border:      `1px solid ${SEV_COLOR[inc.sev]}44`,
                    }}
                  >
                    {inc.sev}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] truncate" style={{ fontFamily: "var(--font-ibm-sans)", color: "var(--text-muted)" }}>
                      {inc.title}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}>
                      {inc.id} · {inc.date} · {inc.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recurrence patterns */}
          <div>
            <span
              className="text-[10px] uppercase tracking-widest block mb-3"
              style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
            >
              {t.recurrencePatterns}
            </span>
            {svcRecurrence.length === 0 ? (
              <p className="text-[11px]" style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}>
                {t.noRecurrence}
              </p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {svcRecurrence.map((p) => (
                  <div
                    key={p.id}
                    className="px-3 py-2.5 rounded-lg"
                    style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
                  >
                    <p className="text-[12px]" style={{ fontFamily: "var(--font-ibm-sans)", color: "var(--text-muted)" }}>
                      {p.pattern}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}>
                      {p.count}× · avg {p.avgIntervalDays}d interval · last {p.lastOccurrence}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* View in History link */}
          <a
            href={`/history?service=${encodeURIComponent(svc.service)}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-80"
            style={{
              background:  "var(--surface2)",
              border:      "1px solid var(--border2)",
              fontFamily:  "var(--font-dm-mono)",
              color:       "var(--magenta)",
            }}
          >
            {t.viewInHistory} — {svc.service}
            <ExternalLink size={12} />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────

function ServiceCard({ svc, onClick }: { svc: ServiceHealth; onClick: () => void }) {
  const t = useT();

  return (
    <button
      onClick={onClick}
      className="rounded-xl p-4 flex flex-col gap-3 text-left w-full transition-all"
      style={{ background: "var(--surface2)", border: "1px solid var(--border)", cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {/* Ring + name + trend */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <DonutRing score={svc.score} />
          <span
            className="text-[13px] font-semibold leading-tight"
            style={{ fontFamily: "var(--font-ibm-sans)", color: "var(--text)" }}
          >
            {svc.service}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0 mt-1">
          {svc.trend === "up"
            ? <TrendingUp size={13} color="#00c896" />
            : svc.trend === "down"
            ? <TrendingDown size={13} color="#ff3b5c" />
            : <Minus size={13} color="var(--text-dim)" />
          }
          <span
            className="text-[10px]"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color: svc.trend === "up" ? "#00c896" : svc.trend === "down" ? "#ff3b5c" : "var(--text-dim)",
            }}
          >
            {svc.trend === "stable" ? t.stable : `${svc.trendPct > 0 ? "+" : ""}${svc.trendPct}%`}
          </span>
        </div>
      </div>

      {/* Micro-stats */}
      <div className="grid grid-cols-3 gap-1">
        <div className="flex flex-col">
          <span className="text-[17px] leading-none font-bold" style={{ fontFamily: "var(--font-syne)", color: "var(--text)" }}>
            {svc.incidentCount}
          </span>
          <span className="text-[9px] mt-0.5" style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}>
            Incidents
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[17px] leading-none font-bold" style={{ fontFamily: "var(--font-syne)", color: "var(--text)" }}>
            {svc.avgMTTR}
          </span>
          <span className="text-[9px] mt-0.5" style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}>
            Avg {t.mttrShort}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] leading-none font-semibold" style={{ fontFamily: "var(--font-syne)", color: SEV_COLOR[svc.worstSeverity] }}>
            {svc.worstSeverity}
          </span>
          <span className="text-[9px] mt-0.5" style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}>
            {t.worstSev}
          </span>
        </div>
      </div>

      {/* Mini score breakdown bars */}
      <div className="flex flex-col gap-1 pt-1" style={{ borderTop: "1px solid var(--border)" }}>
        {svc.scoreBreakdown.map((d) => {
          const pct    = Math.round((d.score / d.maxScore) * 100);
          const bcolor = pct >= 80 ? "#00c896" : pct >= 60 ? "#ff8c00" : "#ff3b5c";
          return (
            <div key={d.label} className="flex items-center gap-2">
              <span className="text-[9px] w-24 shrink-0 truncate" style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}>
                {d.label}
              </span>
              <div className="flex-1 rounded-full overflow-hidden" style={{ height: 3, background: "var(--surface3)" }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: bcolor }} />
              </div>
              <span className="text-[9px] w-6 text-right shrink-0 tabular-nums" style={{ fontFamily: "var(--font-dm-mono)", color: bcolor }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </button>
  );
}

// ─── Main panel ──────────────────────────────────────────────────────────────

const CATEGORIES: ServiceCategory[] = [
  "Radio Access", "Core Network", "Value Added", "Enterprise", "Operations",
];

interface Props {
  data: PeriodData;
  id?: string;
}

export default function ServiceHealthScorecard({ data, id }: Props) {
  const t = useT();

  const [activeCat,  setActiveCat]  = useState<ServiceCategory | "All">("All");
  const [filter,     setFilter]     = useState<FilterKey>("all");
  const [query,      setQuery]      = useState("");
  const [modalSvc,   setModalSvc]   = useState<ServiceHealth | null>(null);

  const sorted = useMemo(
    () => [...data.serviceHealth].sort((a, b) => a.score - b.score),
    [data.serviceHealth]
  );

  const visible = useMemo(() => {
    const q = query.toLowerCase();
    return sorted.filter((s) => {
      const inCat    = activeCat === "All" || s.category === activeCat;
      const inFilter = filterScore(s, filter);
      const inQuery  = !q || s.service.toLowerCase().includes(q);
      return inCat && inFilter && inQuery;
    });
  }, [sorted, activeCat, filter, query]);

  const counts = useMemo(() => {
    const base = activeCat === "All" ? sorted : sorted.filter((s) => s.category === activeCat);
    return {
      all:      base.length,
      critical: base.filter((s) => s.score < 60).length,
      degraded: base.filter((s) => s.score >= 60 && s.score < 80).length,
      stable:   base.filter((s) => s.score >= 80).length,
    };
  }, [sorted, activeCat]);

  const catLabel: Record<ServiceCategory | "All", string> = {
    "All":          t.allCategories,
    "Radio Access": t.catRadioAccess,
    "Core Network": t.catCoreNetwork,
    "Value Added":  t.catValueAdded,
    "Enterprise":   t.catEnterprise,
    "Operations":   t.catOperations,
  };

  const filterPills: { key: FilterKey; label: string; count: number; color?: string }[] = [
    { key: "all",      label: t.allCategories, count: counts.all      },
    { key: "critical", label: t.critical,       count: counts.critical, color: "#ff3b5c" },
    { key: "degraded", label: t.filterDegraded, count: counts.degraded, color: "#ff8c00" },
    { key: "stable",   label: t.stable,         count: counts.stable,   color: "#00c896" },
  ];

  return (
    <section id={id} className="flex flex-col gap-4">

      {/* Category tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {(["All", ...CATEGORIES] as Array<ServiceCategory | "All">).map((cat) => {
          const active   = activeCat === cat;
          const catCount = cat === "All"
            ? sorted.length
            : sorted.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => { setActiveCat(cat); setFilter("all"); setQuery(""); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all"
              style={{
                fontFamily: "var(--font-dm-mono)",
                background: active ? "var(--magenta)" : "var(--surface2)",
                color:      active ? "#fff" : "var(--text-muted)",
                border:     active ? "1px solid var(--magenta)" : "1px solid var(--border2)",
              }}
            >
              {catLabel[cat]}
              <span
                className="text-[9px] px-1 py-0.5 rounded"
                style={{
                  background: active ? "rgba(255,255,255,0.2)" : "var(--surface3)",
                  color:      active ? "#fff" : "var(--text-dim)",
                }}
              >
                {catCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[200px] max-w-[320px]"
          style={{ background: "var(--surface2)", border: "1px solid var(--border2)" }}
        >
          <Search size={13} color="var(--text-dim)" />
          <input
            className="flex-1 bg-transparent text-[12px] outline-none"
            style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text)" }}
            placeholder="Search services…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X size={11} color="var(--text-dim)" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {filterPills.map((fp) => {
            const active = filter === fp.key;
            return (
              <button
                key={fp.key}
                onClick={() => setFilter(fp.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all"
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  background: active && fp.color ? `${fp.color}1a` : active ? "var(--surface3)" : "transparent",
                  color:      active && fp.color ? fp.color : active ? "var(--text)" : "var(--text-dim)",
                  border:     active && fp.color ? `1px solid ${fp.color}55` : active ? "1px solid var(--border2)" : "1px solid transparent",
                }}
              >
                {fp.label}
                {fp.count > 0 && (
                  <span
                    className="text-[9px] px-1 rounded"
                    style={{
                      background: fp.color ? `${fp.color}22` : "var(--surface3)",
                      color:      fp.color ?? "var(--text-dim)",
                    }}
                  >
                    {fp.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <span
          className="text-[11px] ml-auto"
          style={{ fontFamily: "var(--font-dm-mono)", color: "var(--text-dim)" }}
        >
          {visible.length} service{visible.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Service cards grid */}
      {visible.length === 0 ? (
        <div
          className="rounded-xl px-6 py-10 text-center text-[13px]"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
        >
          No services match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {visible.map((svc) => (
            <ServiceCard key={svc.id} svc={svc} onClick={() => setModalSvc(svc)} />
          ))}
        </div>
      )}

      {/* Service detail modal */}
      {modalSvc && (
        <ServiceModal svc={modalSvc} onClose={() => setModalSvc(null)} />
      )}
    </section>
  );
}
