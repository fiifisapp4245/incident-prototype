export interface TimelineEvent {
  time: string;
  event: string;
  actor: string;
  color: string;
  badge: string;
  badgeBg: string;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  sev: "Critical" | "Major" | "Minor";
  status: "Active" | "In Progress" | "Monitoring" | "Resolved";
  time: string;
  sparkTrend: number[];
  score: string;
  duration: string;
  assigned: string;
  summary: string;
  tags: string[];
  evidence: string[];
  timeline: TimelineEvent[];
}
