"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useT } from "@/contexts/LanguageContext";

export default function PageTitle() {
  const [timestamp, setTimestamp] = useState("");
  const t = useT();

  useEffect(() => {
    const update = () => {
      setTimestamp(format(new Date(), "dd MMM yyyy - HH:mm") + " UTC");
    };
    update();
    const id = setInterval(update, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between">
      <h1
        className="text-[28px] leading-none"
        style={{ fontFamily: "var(--font-syne)", fontWeight: 800, color: "var(--text)" }}
      >
        {t.incidentOverview}
      </h1>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)" }}
        >
          <span className="w-2 h-2 rounded-full pulse-dot shrink-0" style={{ background: "#00c896" }} />
          <span className="text-[12px] font-medium" style={{ color: "#00c896", fontFamily: "var(--font-dm-mono)" }}>
            {t.live}
          </span>
        </div>

        <div className="w-px h-4" style={{ background: "var(--border2)" }} />

        <span className="text-[12px] tabular-nums" style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}>
          {t.lastUpdated}:&nbsp;
          <span style={{ color: "var(--text-dim)" }}>{timestamp}</span>
        </span>
      </div>
    </div>
  );
}
