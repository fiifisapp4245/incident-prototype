import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SEV_COLOR: Record<string, string> = {
  Critical: "#ff3b5c",
  Major: "#ff8c00",
  Minor: "#f5c518",
  Resolved: "#00c896",
};

export const SEV_BG: Record<string, string> = {
  Critical: "rgba(255,59,92,0.12)",
  Major: "rgba(255,140,0,0.12)",
  Minor: "rgba(245,197,24,0.12)",
  Resolved: "rgba(0,200,150,0.12)",
};

export const STATUS_COLOR: Record<string, string> = {
  Active: "#ff3b5c",
  "In Progress": "#ff8c00",
  Monitoring: "#f5c518",
  Resolved: "#00c896",
};
