"use client";

import { Dispatch, SetStateAction } from "react";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/contexts/LanguageContext";
import { HISTORY_ENGINEERS, HISTORY_SERVICES } from "@/lib/historyData";

export interface HistoryFilters {
  severity: string;
  service: string;
  engineer: string;
  resolutionStatus: string;
  search: string;
  startDate: string;
  endDate: string;
}

interface Props {
  filters: HistoryFilters;
  setFilters: Dispatch<SetStateAction<HistoryFilters>>;
}

const fieldStyle: React.CSSProperties = {
  background: "var(--surface2)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "var(--text)",
  fontFamily: "var(--font-dm-mono)",
  fontSize: 13,
};

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
      <label
        className="text-[11px] uppercase tracking-widest"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
      >
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="h-[42px] w-full rounded-lg text-[13px] focus:ring-0 focus:ring-offset-0 focus:outline-none"
          style={fieldStyle}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="rounded-lg p-1"
          style={{ background: "var(--surface2)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              className="text-[13px] rounded cursor-pointer focus:bg-[#1c1c28] focus:text-[#f0f0f5]"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function HistoryFilterBar({ filters, setFilters }: Props) {
  const t = useT();

  const isFiltered =
    filters.severity !== "All" ||
    filters.service !== "All" ||
    filters.engineer !== "All" ||
    filters.resolutionStatus !== "All" ||
    filters.search !== "";

  const sevOptions = [
    { value: "All", label: t.all },
    { value: "Critical", label: t.critical },
    { value: "Major", label: t.major },
    { value: "Minor", label: t.minor },
  ];

  const serviceOptions = [
    { value: "All", label: t.allServices },
    ...HISTORY_SERVICES.map((s) => ({ value: s, label: s })),
  ];

  const engineerOptions = [
    { value: "All", label: t.allEngineers },
    ...HISTORY_ENGINEERS.map((e) => ({ value: e, label: e })),
  ];

  const statusOptions = [
    { value: "All", label: t.all },
    { value: "Resolved", label: t.resolvedOnly },
    { value: "Unresolved", label: t.unresolvedOnly },
  ];

  function clearFilters() {
    setFilters({
      severity: "All",
      service: "All",
      engineer: "All",
      resolutionStatus: "All",
      search: "",
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
  }

  return (
    <div
      className="flex flex-col gap-4 px-6 py-5 rounded-xl"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Attribute filters + search */}
      <div className="flex items-end gap-4 flex-wrap">
        <SelectField
          label={t.severity}
          value={filters.severity}
          options={sevOptions}
          onChange={(v) => setFilters((f) => ({ ...f, severity: v }))}
        />

        <SelectField
          label={t.service}
          value={filters.service}
          options={serviceOptions}
          onChange={(v) => setFilters((f) => ({ ...f, service: v }))}
        />

        <SelectField
          label={t.engineer}
          value={filters.engineer}
          options={engineerOptions}
          onChange={(v) => setFilters((f) => ({ ...f, engineer: v }))}
        />

        <SelectField
          label={t.resolutionStatus}
          value={filters.resolutionStatus}
          options={statusOptions}
          onChange={(v) => setFilters((f) => ({ ...f, resolutionStatus: v }))}
        />

        {/* Search */}
        <div className="flex flex-col gap-1.5 flex-[2] min-w-[200px]">
          <label
            className="text-[11px] uppercase tracking-widest"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
          >
            Search
          </label>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-dim)" }}
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder={t.searchIncidents}
              className="h-[42px] w-full rounded-lg pl-9 pr-3 text-[13px] outline-none"
              style={{
                ...fieldStyle,
                background: "var(--surface2)",
              }}
            />
          </div>
        </div>

        {isFiltered && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 shrink-0 px-3 h-[42px] rounded-lg text-[12px] transition-opacity hover:opacity-70 self-end"
            style={{
              background: "rgba(226,0,138,0.1)",
              border: "1px solid rgba(226,0,138,0.25)",
              color: "var(--magenta)",
              fontFamily: "var(--font-dm-mono)",
            }}
          >
            <X size={12} />
            {t.clear}
          </button>
        )}
      </div>
    </div>
  );
}
