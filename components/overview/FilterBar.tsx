"use client";

import { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterState {
  severity: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface Props {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
}

const sevOptions = ["All", "Critical", "Major", "Minor"];
const statusOptions = ["All", "Active", "In Progress", "Monitoring", "Resolved"];

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
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
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
          style={{
            background: "var(--surface2)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {options.map((o) => (
            <SelectItem
              key={o}
              value={o}
              className="text-[13px] rounded cursor-pointer focus:bg-[#1c1c28] focus:text-[#f0f0f5]"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-dm-mono)",
              }}
            >
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const date = value ? new Date(value + "T00:00:00") : undefined;

  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label
        className="text-[11px] uppercase tracking-widest"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
      >
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="flex h-[42px] w-full items-center gap-2 rounded-lg px-3 text-left text-[13px] outline-none"
            style={{
              ...fieldStyle,
              color: date ? "var(--text)" : "var(--text-dim)",
            }}
          >
            <CalendarIcon size={14} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
            {date ? format(date, "dd MMM yyyy") : <span>Pick a date</span>}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-auto p-0 rounded-xl"
          style={{
            background: "var(--surface)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

const defaultFilters: FilterState = { severity: "All", status: "All", startDate: "", endDate: "" };

export default function FilterBar({ filters, setFilters }: Props) {
  const isFiltered =
    filters.severity !== "All" ||
    filters.status !== "All" ||
    filters.startDate !== "" ||
    filters.endDate !== "";

  return (
    <div
      className="flex items-end gap-5 px-6 py-5 rounded-xl"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <SelectField
        label="Severity"
        value={filters.severity}
        options={sevOptions}
        onChange={(v) => setFilters((f) => ({ ...f, severity: v }))}
      />

      <SelectField
        label="Status"
        value={filters.status}
        options={statusOptions}
        onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
      />

      <div
        className="self-stretch w-px shrink-0"
        style={{ background: "var(--border2)", margin: "2px 0" }}
      />

      <DateField
        label="Start Date"
        value={filters.startDate}
        onChange={(v) => setFilters((f) => ({ ...f, startDate: v }))}
      />

      <span
        className="shrink-0 pb-[11px] text-[12px]"
        style={{ color: "var(--text-dim)", fontFamily: "var(--font-dm-mono)" }}
      >
        to
      </span>

      <DateField
        label="End Date"
        value={filters.endDate}
        onChange={(v) => setFilters((f) => ({ ...f, endDate: v }))}
      />

      {isFiltered && (
        <button
          onClick={() => setFilters(defaultFilters)}
          className="flex items-center gap-1.5 shrink-0 px-3 h-[42px] rounded-lg text-[12px] transition-opacity hover:opacity-70"
          style={{
            background: "rgba(226,0,138,0.1)",
            border: "1px solid rgba(226,0,138,0.25)",
            color: "var(--magenta)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          <X size={12} />
          Clear
        </button>
      )}
    </div>
  );
}
