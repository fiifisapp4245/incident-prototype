"use client";

import { useEffect, useRef, useState } from "react";

const rows = [
  { label: "Active — Unassigned", count: 3, pct: 20, color: "#ff3b5c", colorBg: "rgba(255,59,92,0.12)" },
  { label: "In Progress", count: 8, pct: 53, color: "#ff8c00", colorBg: "rgba(255,140,0,0.12)" },
  { label: "Monitoring", count: 3, pct: 20, color: "#f5c518", colorBg: "rgba(245,197,24,0.12)" },
  { label: "Resolved", count: 12, pct: 80, color: "#00c896", colorBg: "rgba(0,200,150,0.12)" },
];

export default function ResponseStatusBars() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), 100);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-xl p-6 h-full"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-[11px] uppercase tracking-widest mb-6"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
      >
        Incident Response Status
      </p>
      <div className="flex flex-col gap-5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}>
                {r.label}
              </span>
              <span
                className="text-[14px] font-bold px-2.5 py-0.5 rounded-md"
                style={{ color: r.color, background: r.colorBg, fontFamily: "var(--font-syne)" }}
              >
                {r.count}
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "var(--surface3)" }}
            >
              <div
                className="h-full rounded-full progress-bar"
                style={{
                  width: animated ? `${r.pct}%` : "0%",
                  background: `linear-gradient(90deg, ${r.color}88, ${r.color})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
