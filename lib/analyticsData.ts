// ============================================================
// Analytics mock data
// ============================================================

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "custom";

// --- Types ---------------------------------------------------

export interface AIInsight {
  id: string;
  type: "trend" | "warning" | "pattern";
  text: string;
  supportText: string;
  sectionRef: string;
}

export interface DailyTrendPoint {
  date: string;
  critical: number;
  major: number;
  minor: number;
}

export interface ServiceHealth {
  id: string;
  service: string;
  score: number; // 0–100
  incidentCount: number;
  avgMTTR: number; // minutes
  worstSeverity: "Critical" | "Major" | "Minor";
  trend: "up" | "down" | "stable";
  trendPct: number; // positive = improved
}

export interface KPITrendPoint {
  date: string;
  mttd: number;
  mttr: number;
}

export interface MTTRBySeverity {
  severity: string;
  avgMTTR: number;
  fill: string;
}

export interface EngineerPerf {
  name: string;
  avgMTTR: number;
  resolved: number;
}

export interface ClassAccuracyRow {
  initial: "Critical" | "Major" | "Minor";
  correct: number;
  escalated: number;
  downgraded: number;
  falsePositive: number;
}

export interface HeatmapCell {
  day: number;  // 0=Mon … 6=Sun
  hour: number; // 0–23
  value: number;
}

export interface RecurrencePattern {
  id: string;
  pattern: string;
  service: string;
  count: number;
  avgIntervalDays: number;
  lastOccurrence: string;
  sparkline: number[];
}

export interface PeriodData {
  networkReliability: number;
  mttd: number;   // minutes
  mttr: number;   // minutes
  mttdChange: number; // % vs previous equivalent period (negative = improved)
  mttrChange: number;
  mttrBySeverity: MTTRBySeverity[];
  engineerLeaderboard: EngineerPerf[];
  classAccuracy: ClassAccuracyRow[];
  serviceHealth: ServiceHealth[];
  kpiTrend: KPITrendPoint[];
}

// --- 90-day incident trend (Nov 28 2025 – Feb 25 2026) ------

const trendCritical = [
  2,3,1,2,4,3,2,1,3,2,4,5,2,1,2,8,6,3,2,1,2,3,2,4,2,1,3,5,2,1,
  3,2,1,2,3,4,2,1,3,2,5,3,2,1,2,3,1,2,4,2,3,2,1,2,3,2,4,3,2,1,
  2,3,2,1,4,2,3,5,7,4,2,1,3,2,4,3,2,1,2,3,4,2,1,3,5,4,3,2,1,3,
];
const trendMajor = [
  5,7,4,5,8,7,5,4,6,5,9,10,5,4,5,14,12,7,5,4,5,6,5,8,5,4,7,11,5,4,
  6,5,4,5,7,8,5,4,7,5,11,7,5,4,5,7,4,5,9,5,7,5,4,5,7,5,9,7,5,4,
  5,7,5,4,9,5,7,11,13,9,5,4,7,5,9,7,5,4,5,7,9,5,4,7,11,9,7,5,4,7,
];
const trendMinor = [
  8,10,7,8,11,10,8,7,9,8,12,14,8,7,8,18,16,10,8,7,8,9,8,11,8,7,10,14,8,7,
  9,8,7,8,10,11,8,7,10,8,14,10,8,7,8,10,7,8,12,8,10,8,7,8,10,8,12,10,8,7,
  8,10,8,7,12,8,10,14,17,12,8,7,10,8,12,10,8,7,8,10,12,8,7,10,14,12,10,8,7,10,
];

function buildTrendData(): DailyTrendPoint[] {
  const base = new Date("2025-11-28");
  return Array.from({ length: 90 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().split("T")[0],
      critical: trendCritical[i] ?? 2,
      major:    trendMajor[i]    ?? 5,
      minor:    trendMinor[i]    ?? 8,
    };
  });
}

export const allTrendData: DailyTrendPoint[] = buildTrendData();

// --- Peak hours heatmap (7 days × 24 hours) -----------------
// Each row = one day (0=Mon…6=Sun), each column = hour 0–23

const rawHeatmap: number[][] = [
  // Mon
  [0,0,0,0,0,1,1,3,6,10,12, 9, 7, 7, 8, 7, 5, 4, 3, 2, 1, 1, 0, 0],
  // Tue ← hottest day
  [0,0,0,0,0,1,2,4,8,13,15,11, 9,10, 9, 8, 6, 4, 3, 2, 1, 1, 0, 0],
  // Wed
  [0,0,0,1,0,1,2,4, 9,11,12,10, 8, 9,10, 8, 6, 4, 3, 2, 1, 1, 0, 0],
  // Thu
  [0,0,0,0,1,1,2,4, 7,10,11, 9, 7, 8, 8, 7, 5, 3, 2, 1, 1, 0, 0, 0],
  // Fri
  [0,0,0,0,0,1,2,3, 6, 9,10, 8, 6, 6, 7, 6, 5, 3, 2, 1, 0, 0, 0, 0],
  // Sat
  [0,0,0,0,0,0,1,2, 3, 5, 6, 5, 4, 4, 4, 3, 2, 2, 1, 1, 0, 0, 0, 0],
  // Sun
  [0,0,0,0,0,0,1,1, 2, 3, 5, 4, 3, 3, 4, 3, 2, 1, 1, 0, 0, 0, 0, 0],
];

export const heatmapData: HeatmapCell[] = rawHeatmap.flatMap((row, day) =>
  row.map((value, hour) => ({ day, hour, value }))
);

export const heatmapMax = 15;

// --- Recurrence patterns ------------------------------------

export const recurrencePatterns: RecurrencePattern[] = [
  {
    id: "r1",
    pattern: "4G Outage — Berlin-Brandenburg Region",
    service: "4G/5G Data",
    count: 7,
    avgIntervalDays: 8.5,
    lastOccurrence: "2026-02-22",
    sparkline: [1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0,0,1],
  },
  {
    id: "r2",
    pattern: "BSC Cluster Overload — Munich",
    service: "Voice",
    count: 5,
    avgIntervalDays: 11.2,
    lastOccurrence: "2026-02-18",
    sparkline: [0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  },
  {
    id: "r3",
    pattern: "VoLTE Registration Failure — Nationwide",
    service: "Voice",
    count: 4,
    avgIntervalDays: 15.8,
    lastOccurrence: "2026-02-14",
    sparkline: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  },
  {
    id: "r4",
    pattern: "SMS Gateway Timeout — Bavaria",
    service: "SMS",
    count: 3,
    avgIntervalDays: 22.1,
    lastOccurrence: "2026-02-08",
    sparkline: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  },
  {
    id: "r5",
    pattern: "Roaming Auth Failure — EU Partners GW",
    service: "Roaming",
    count: 3,
    avgIntervalDays: 19.4,
    lastOccurrence: "2026-01-29",
    sparkline: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  },
];

// --- AI Insights --------------------------------------------

export const aiInsights: AIInsight[] = [
  {
    id: "ins-1",
    type: "trend",
    text: "MTTD improved 23% this month compared to the previous 30-day period. Faster detection is reducing cascading failures.",
    supportText: "Based on 247 incidents · High confidence",
    sectionRef: "kpi-panel",
  },
  {
    id: "ins-2",
    type: "warning",
    text: "Voice service incidents are 3× above the 60-day average. BSC cluster utilisation in Munich exceeds 92% — immediate investigation advised.",
    supportText: "Based on 18 incidents · High confidence",
    sectionRef: "service-health",
  },
  {
    id: "ins-3",
    type: "pattern",
    text: "4G/5G outages in Berlin-Brandenburg have recurred 7 times in the last 60 days. Average recurrence interval: 8.5 days. Next window: ~1 Mar.",
    supportText: "Based on 7 recurrence events · High confidence",
    sectionRef: "recurrence",
  },
];

// --- Period-specific aggregates -----------------------------

const kpiTrend30d: KPITrendPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date("2026-01-27");
  d.setDate(d.getDate() + i);
  return {
    date: d.toISOString().split("T")[0],
    mttd: parseFloat((5.8 - i * 0.054 + Math.sin(i * 0.6) * 0.4).toFixed(1)),
    mttr: parseFloat((56 - i * 0.27 + Math.sin(i * 0.4) * 2.5).toFixed(1)),
  };
});

const kpiTrend7d: KPITrendPoint[] = kpiTrend30d.slice(-7);
const kpiTrend90d: KPITrendPoint[] = Array.from({ length: 90 }, (_, i) => {
  const d = new Date("2025-11-28");
  d.setDate(d.getDate() + i);
  return {
    date: d.toISOString().split("T")[0],
    mttd: parseFloat((7.2 - i * 0.033 + Math.sin(i * 0.4) * 0.6).toFixed(1)),
    mttr: parseFloat((62 - i * 0.11 + Math.sin(i * 0.3) * 3).toFixed(1)),
  };
});

export const periodData: Record<Exclude<AnalyticsPeriod, "custom">, PeriodData> = {
  "7d": {
    networkReliability: 96.1,
    mttd: 3.8,
    mttr: 44.2,
    mttdChange: -8,
    mttrChange: -5,
    mttrBySeverity: [
      { severity: "Critical", avgMTTR: 82,  fill: "#ff3b5c" },
      { severity: "Major",    avgMTTR: 44,  fill: "#ff8c00" },
      { severity: "Minor",    avgMTTR: 18,  fill: "#f5c518" },
    ],
    engineerLeaderboard: [
      { name: "K. Fischer",   avgMTTR: 38, resolved: 9  },
      { name: "A. Weber",     avgMTTR: 41, resolved: 7  },
      { name: "L. Hoffmann",  avgMTTR: 47, resolved: 6  },
      { name: "S. Bauer",     avgMTTR: 52, resolved: 5  },
      { name: "O. Schmidt",   avgMTTR: 61, resolved: 4  },
    ],
    classAccuracy: [
      { initial: "Critical", correct: 70, escalated: 0,  downgraded: 24, falsePositive: 6  },
      { initial: "Major",    correct: 76, escalated: 9,  downgraded: 13, falsePositive: 2  },
      { initial: "Minor",    correct: 83, escalated: 14, downgraded: 0,  falsePositive: 3  },
    ],
    serviceHealth: [
      { id: "4g5g",    service: "4G/5G Data", score: 80, incidentCount: 6,  avgMTTR: 48, worstSeverity: "Critical", trend: "up",     trendPct: 5  },
      { id: "voice",   service: "Voice",      score: 58, incidentCount: 5,  avgMTTR: 36, worstSeverity: "Major",    trend: "down",   trendPct: -8 },
      { id: "sms",     service: "SMS",        score: 91, incidentCount: 2,  avgMTTR: 20, worstSeverity: "Minor",    trend: "stable", trendPct: 1  },
      { id: "roaming", service: "Roaming",    score: 94, incidentCount: 1,  avgMTTR: 15, worstSeverity: "Minor",    trend: "up",     trendPct: 3  },
      { id: "iot",     service: "IoT/M2M",    score: 74, incidentCount: 3,  avgMTTR: 61, worstSeverity: "Major",    trend: "stable", trendPct: 0  },
      { id: "core",    service: "Core/IMS",   score: 52, incidentCount: 8,  avgMTTR: 84, worstSeverity: "Critical", trend: "down",   trendPct: -12},
    ],
    kpiTrend: kpiTrend7d,
  },

  "30d": {
    networkReliability: 94.2,
    mttd: 4.2,
    mttr: 47.8,
    mttdChange: -23,
    mttrChange: -14,
    mttrBySeverity: [
      { severity: "Critical", avgMTTR: 89,  fill: "#ff3b5c" },
      { severity: "Major",    avgMTTR: 48,  fill: "#ff8c00" },
      { severity: "Minor",    avgMTTR: 21,  fill: "#f5c518" },
    ],
    engineerLeaderboard: [
      { name: "K. Fischer",   avgMTTR: 40, resolved: 38 },
      { name: "A. Weber",     avgMTTR: 43, resolved: 34 },
      { name: "L. Hoffmann",  avgMTTR: 49, resolved: 29 },
      { name: "S. Bauer",     avgMTTR: 55, resolved: 24 },
      { name: "O. Schmidt",   avgMTTR: 63, resolved: 18 },
    ],
    classAccuracy: [
      { initial: "Critical", correct: 68, escalated: 0,  downgraded: 22, falsePositive: 10 },
      { initial: "Major",    correct: 74, escalated: 8,  downgraded: 15, falsePositive: 3  },
      { initial: "Minor",    correct: 82, escalated: 14, downgraded: 0,  falsePositive: 4  },
    ],
    serviceHealth: [
      { id: "4g5g",    service: "4G/5G Data", score: 78, incidentCount: 23, avgMTTR: 52, worstSeverity: "Critical", trend: "down",   trendPct: -8  },
      { id: "voice",   service: "Voice",      score: 61, incidentCount: 18, avgMTTR: 38, worstSeverity: "Major",    trend: "up",     trendPct: 5   },
      { id: "sms",     service: "SMS",        score: 88, incidentCount: 7,  avgMTTR: 22, worstSeverity: "Minor",    trend: "stable", trendPct: 1   },
      { id: "roaming", service: "Roaming",    score: 92, incidentCount: 4,  avgMTTR: 18, worstSeverity: "Minor",    trend: "up",     trendPct: 12  },
      { id: "iot",     service: "IoT/M2M",    score: 71, incidentCount: 11, avgMTTR: 65, worstSeverity: "Major",    trend: "down",   trendPct: -3  },
      { id: "core",    service: "Core/IMS",   score: 55, incidentCount: 28, avgMTTR: 89, worstSeverity: "Critical", trend: "down",   trendPct: -15 },
    ],
    kpiTrend: kpiTrend30d,
  },

  "90d": {
    networkReliability: 91.8,
    mttd: 5.1,
    mttr: 52.3,
    mttdChange: -31,
    mttrChange: -19,
    mttrBySeverity: [
      { severity: "Critical", avgMTTR: 98,  fill: "#ff3b5c" },
      { severity: "Major",    avgMTTR: 54,  fill: "#ff8c00" },
      { severity: "Minor",    avgMTTR: 25,  fill: "#f5c518" },
    ],
    engineerLeaderboard: [
      { name: "K. Fischer",   avgMTTR: 44, resolved: 112 },
      { name: "A. Weber",     avgMTTR: 47, resolved: 98  },
      { name: "L. Hoffmann",  avgMTTR: 53, resolved: 87  },
      { name: "S. Bauer",     avgMTTR: 59, resolved: 74  },
      { name: "O. Schmidt",   avgMTTR: 68, resolved: 59  },
    ],
    classAccuracy: [
      { initial: "Critical", correct: 64, escalated: 0,  downgraded: 26, falsePositive: 10 },
      { initial: "Major",    correct: 71, escalated: 9,  downgraded: 17, falsePositive: 3  },
      { initial: "Minor",    correct: 79, escalated: 16, downgraded: 0,  falsePositive: 5  },
    ],
    serviceHealth: [
      { id: "4g5g",    service: "4G/5G Data", score: 72, incidentCount: 68, avgMTTR: 57, worstSeverity: "Critical", trend: "up",     trendPct: 11  },
      { id: "voice",   service: "Voice",      score: 65, incidentCount: 54, avgMTTR: 42, worstSeverity: "Major",    trend: "up",     trendPct: 8   },
      { id: "sms",     service: "SMS",        score: 85, incidentCount: 21, avgMTTR: 25, worstSeverity: "Minor",    trend: "stable", trendPct: 2   },
      { id: "roaming", service: "Roaming",    score: 90, incidentCount: 12, avgMTTR: 21, worstSeverity: "Minor",    trend: "up",     trendPct: 15  },
      { id: "iot",     service: "IoT/M2M",    score: 68, incidentCount: 33, avgMTTR: 71, worstSeverity: "Critical", trend: "up",     trendPct: 7   },
      { id: "core",    service: "Core/IMS",   score: 58, incidentCount: 82, avgMTTR: 94, worstSeverity: "Critical", trend: "up",     trendPct: 9   },
    ],
    kpiTrend: kpiTrend90d,
  },
};
