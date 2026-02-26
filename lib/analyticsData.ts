// ============================================================
// Analytics mock data
// ============================================================

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "custom";
export type ServiceCategory  = "Radio Access" | "Core Network" | "Value Added" | "Enterprise" | "Operations";

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

export interface ScoreDriver {
  label: string;
  score: number;    // points earned (e.g. 31)
  maxScore: number; // max possible (e.g. 40)
  detail: string;   // human-readable explanation
}

export interface RecentIncident {
  id: string;
  title: string;
  sev: "Critical" | "Major" | "Minor";
  date: string;
  duration: string;
}

export interface ServiceHealth {
  id: string;
  service: string;
  category: ServiceCategory;
  score: number; // 0–100
  incidentCount: number;
  avgMTTR: number; // minutes
  worstSeverity: "Critical" | "Major" | "Minor";
  trend: "up" | "down" | "stable";
  trendPct: number; // positive = improved
  scoreBreakdown: ScoreDriver[];
  recentIncidents: RecentIncident[];
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

// --- Shared service detail data (breakdown + recent incidents) --------------
// Breakdowns are period-agnostic for brevity; scores adjust per period below.

const svcDetail: Record<string, { scoreBreakdown: ScoreDriver[]; recentIncidents: RecentIncident[] }> = {
  "4g5g": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 31, maxScore: 40, detail: "23 incidents · 8% above baseline" },
      { label: "MTTR Performance",   score: 30, maxScore: 40, detail: "52min avg · 16% above 45min target" },
      { label: "Severity Mix",       score: 17, maxScore: 20, detail: "3 Critical, 12 Major, 8 Minor" },
    ],
    recentIncidents: [
      { id: "INC-2041", title: "Mobile Data Outage — Berlin-Brandenburg", sev: "Critical", date: "2026-02-22", duration: "1h 23m" },
      { id: "INC-2034", title: "4G RAN Firmware Bug — Munich Cluster",   sev: "Major",    date: "2026-02-19", duration: "2h 10m" },
      { id: "INC-2028", title: "BGP Route Flap — Leipzig Gateway",        sev: "Minor",    date: "2026-02-17", duration: "0h 45m" },
    ],
  },
  "voice": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 21, maxScore: 40, detail: "18 incidents · 41% above baseline" },
      { label: "MTTR Performance",   score: 26, maxScore: 40, detail: "38min avg · 16% below 45min target" },
      { label: "Severity Mix",       score: 14, maxScore: 20, detail: "2 Critical, 9 Major, 7 Minor" },
    ],
    recentIncidents: [
      { id: "INC-2039", title: "BSC Cluster Overload — Munich",       sev: "Critical", date: "2026-02-21", duration: "3h 02m" },
      { id: "INC-2031", title: "VoLTE Media Gateway Capacity Breach", sev: "Major",    date: "2026-02-18", duration: "1h 40m" },
      { id: "INC-2019", title: "Voice Capacity Breach — Ruhr Area",   sev: "Major",    date: "2026-02-12", duration: "1h 15m" },
    ],
  },
  "sms": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 36, maxScore: 40, detail: "7 incidents · 10% below baseline" },
      { label: "MTTR Performance",   score: 33, maxScore: 40, detail: "22min avg · 51% below 45min target" },
      { label: "Severity Mix",       score: 19, maxScore: 20, detail: "0 Critical, 2 Major, 5 Minor" },
    ],
    recentIncidents: [
      { id: "INC-1907", title: "SMSC Rate Limiter Misconfiguration — NRW",  sev: "Major", date: "2026-02-10", duration: "2h 45m" },
      { id: "INC-1898", title: "SMS Gateway Network Congestion — Bavaria",  sev: "Minor", date: "2026-02-06", duration: "0h 55m" },
      { id: "INC-1881", title: "SMSC DNS Resolution Failure — Düsseldorf", sev: "Minor", date: "2026-01-29", duration: "0h 30m" },
    ],
  },
  "roaming": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 38, maxScore: 40, detail: "4 incidents · 18% below baseline" },
      { label: "MTTR Performance",   score: 35, maxScore: 40, detail: "18min avg · 60% below 45min target" },
      { label: "Severity Mix",       score: 19, maxScore: 20, detail: "0 Critical, 1 Major, 3 Minor" },
    ],
    recentIncidents: [
      { id: "INC-1921", title: "Roaming BGP Session Drop — Nexatel DE",      sev: "Major", date: "2026-02-14", duration: "1h 05m" },
      { id: "INC-1897", title: "Roaming Certificate Expiry — Eurolink FR",   sev: "Minor", date: "2026-02-05", duration: "0h 40m" },
      { id: "INC-1872", title: "Roaming Auth Failure — EU Partners GW",      sev: "Minor", date: "2026-01-27", duration: "0h 20m" },
    ],
  },
  "iot": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 26, maxScore: 40, detail: "11 incidents · 22% above baseline" },
      { label: "MTTR Performance",   score: 28, maxScore: 40, detail: "65min avg · 44% above 45min target" },
      { label: "Severity Mix",       score: 17, maxScore: 20, detail: "0 Critical, 8 Major, 3 Minor" },
    ],
    recentIncidents: [
      { id: "INC-1905", title: "DNS Resolver Cache Thrash — IoT APN",  sev: "Minor", date: "2026-02-20", duration: "0h 45m" },
      { id: "INC-1888", title: "IoT M2M APN Config Drift",             sev: "Major", date: "2026-02-08", duration: "2h 20m" },
      { id: "INC-1866", title: "IoT DNS TTL Update — M2M APN",         sev: "Minor", date: "2026-01-24", duration: "1h 10m" },
    ],
  },
  "core": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 18, maxScore: 40, detail: "28 incidents · 52% above baseline" },
      { label: "MTTR Performance",   score: 22, maxScore: 40, detail: "89min avg · 98% above 45min target" },
      { label: "Severity Mix",       score: 15, maxScore: 20, detail: "5 Critical, 14 Major, 9 Minor" },
    ],
    recentIncidents: [
      { id: "INC-2038", title: "Core IMS Hardware Failure — Frankfurt Primary", sev: "Critical", date: "2026-02-20", duration: "4h 15m" },
      { id: "INC-2026", title: "IMS Signalling Overload — Core West",           sev: "Critical", date: "2026-02-15", duration: "2h 50m" },
      { id: "INC-2011", title: "P-CSCF Hardware Failure — Primary Node",        sev: "Major",    date: "2026-02-09", duration: "3h 30m" },
    ],
  },
  "lte-ran": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 33, maxScore: 40, detail: "9 incidents · 5% below baseline" },
      { label: "MTTR Performance",   score: 32, maxScore: 40, detail: "41min avg · 9% below 45min target" },
      { label: "Severity Mix",       score: 18, maxScore: 20, detail: "0 Critical, 4 Major, 5 Minor" },
    ],
    recentIncidents: [
      { id: "INC-2029", title: "5G NR gNB Software Update Failure — Dresden",  sev: "Major", date: "2026-02-18", duration: "1h 55m" },
      { id: "INC-2015", title: "5G NR Firmware Regression — Düsseldorf",       sev: "Major", date: "2026-02-11", duration: "2h 05m" },
      { id: "INC-2003", title: "5G NR SON Policy Config Error — Stuttgart",    sev: "Minor", date: "2026-02-04", duration: "0h 50m" },
    ],
  },
  "broadband": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 29, maxScore: 40, detail: "14 incidents · 12% above baseline" },
      { label: "MTTR Performance",   score: 28, maxScore: 40, detail: "58min avg · 29% above 45min target" },
      { label: "Severity Mix",       score: 18, maxScore: 20, detail: "1 Critical, 6 Major, 7 Minor" },
    ],
    recentIncidents: [
      { id: "INC-2037", title: "DSL Aggregation Failure — Hamburg North",    sev: "Critical", date: "2026-02-21", duration: "2h 30m" },
      { id: "INC-2022", title: "Fibre Backhaul Congestion — Cologne",        sev: "Major",    date: "2026-02-14", duration: "1h 20m" },
      { id: "INC-2008", title: "DSLAM Hardware Fault — Nuremberg Central",   sev: "Major",    date: "2026-02-07", duration: "3h 00m" },
    ],
  },
  "emergency": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 39, maxScore: 40, detail: "2 incidents · 60% below baseline" },
      { label: "MTTR Performance",   score: 38, maxScore: 40, detail: "12min avg · 73% below 45min target" },
      { label: "Severity Mix",       score: 19, maxScore: 20, detail: "0 Critical, 1 Major, 1 Minor" },
    ],
    recentIncidents: [
      { id: "INC-1994", title: "Emergency Call Routing Delay — NRW",       sev: "Major", date: "2026-02-02", duration: "0h 18m" },
      { id: "INC-1968", title: "112 Gateway Config Drift — Bavaria",        sev: "Minor", date: "2026-01-18", duration: "0h 12m" },
      { id: "INC-1944", title: "Emergency SMS Delivery Latency — National", sev: "Minor", date: "2026-01-08", duration: "0h 22m" },
    ],
  },
  "voip": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 25, maxScore: 40, detail: "13 incidents · 24% above baseline" },
      { label: "MTTR Performance",   score: 27, maxScore: 40, detail: "72min avg · 60% above 45min target" },
      { label: "Severity Mix",       score: 17, maxScore: 20, detail: "1 Critical, 7 Major, 5 Minor" },
    ],
    recentIncidents: [
      { id: "INC-2033", title: "VoIP Gateway Hardware Fault — Cologne",       sev: "Critical", date: "2026-02-19", duration: "3h 45m" },
      { id: "INC-2018", title: "SIP Trunk Congestion — Frankfurt Exchange",   sev: "Major",    date: "2026-02-12", duration: "1h 30m" },
      { id: "INC-2005", title: "VoLTE Gateway Hardware Fault — Cologne",      sev: "Major",    date: "2026-02-05", duration: "2h 00m" },
    ],
  },
  "oss": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 35, maxScore: 40, detail: "6 incidents · 15% below baseline" },
      { label: "MTTR Performance",   score: 33, maxScore: 40, detail: "31min avg · 31% below 45min target" },
      { label: "Severity Mix",       score: 19, maxScore: 20, detail: "0 Critical, 3 Major, 3 Minor" },
    ],
    recentIncidents: [
      { id: "INC-2024", title: "BSS Billing Batch Job Failure",              sev: "Major", date: "2026-02-16", duration: "1h 10m" },
      { id: "INC-2009", title: "OSS Inventory Sync Timeout — Core Network", sev: "Major", date: "2026-02-08", duration: "0h 55m" },
      { id: "INC-1996", title: "Provisioning API Rate Limit Breach",         sev: "Minor", date: "2026-02-03", duration: "0h 25m" },
    ],
  },
  "nms": {
    scoreBreakdown: [
      { label: "Incident Frequency", score: 22, maxScore: 40, detail: "16 incidents · 28% above baseline" },
      { label: "MTTR Performance",   score: 24, maxScore: 40, detail: "78min avg · 73% above 45min target" },
      { label: "Severity Mix",       score: 16, maxScore: 20, detail: "1 Critical, 9 Major, 6 Minor" },
    ],
    recentIncidents: [
      { id: "INC-2035", title: "NMS Collector Crash — South Region",       sev: "Critical", date: "2026-02-20", duration: "2h 40m" },
      { id: "INC-2020", title: "SNMP Trap Storm — Munich Data Centre",     sev: "Major",    date: "2026-02-13", duration: "1h 50m" },
      { id: "INC-2006", title: "Network Topology Sync Failure — National", sev: "Major",    date: "2026-02-05", duration: "2h 15m" },
    ],
  },
};

const svcCategory: Record<string, ServiceCategory> = {
  "4g5g":      "Radio Access",
  "lte-ran":   "Radio Access",
  "voice":     "Core Network",
  "core":      "Core Network",
  "sms":       "Value Added",
  "roaming":   "Value Added",
  "iot":       "Value Added",
  "emergency": "Value Added",
  "broadband": "Enterprise",
  "voip":      "Enterprise",
  "oss":       "Operations",
  "nms":       "Operations",
};

function svc(
  id: string, service: string, score: number, incidentCount: number,
  avgMTTR: number, worstSeverity: ServiceHealth["worstSeverity"],
  trend: ServiceHealth["trend"], trendPct: number
): ServiceHealth {
  return { id, service, category: svcCategory[id], score, incidentCount, avgMTTR, worstSeverity, trend, trendPct, ...svcDetail[id] };
}

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
      svc("4g5g",     "4G/5G Data",        80, 6,  48, "Critical", "up",     5  ),
      svc("voice",    "Voice",             58, 5,  36, "Major",    "down",  -8  ),
      svc("sms",      "SMS",               91, 2,  20, "Minor",    "stable", 1  ),
      svc("roaming",  "Roaming",           94, 1,  15, "Minor",    "up",     3  ),
      svc("iot",      "IoT/M2M",           74, 3,  61, "Major",    "stable", 0  ),
      svc("core",     "Core/IMS",          52, 8,  84, "Critical", "down",  -12 ),
      svc("lte-ran",  "LTE RAN",           85, 2,  38, "Minor",    "up",     4  ),
      svc("broadband","Fixed Broadband",   77, 3,  54, "Critical", "stable", 0  ),
      svc("emergency","Emergency Svcs",    97, 0,  10, "Minor",    "up",     2  ),
      svc("voip",     "VoIP/SIP Trunk",    71, 4,  68, "Major",    "down",  -5  ),
      svc("oss",      "OSS/BSS Platform",  89, 1,  28, "Minor",    "stable", 1  ),
      svc("nms",      "Network Mgmt",      64, 6,  74, "Critical", "down",  -7  ),
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
      svc("4g5g",     "4G/5G Data",        78, 23, 52, "Critical", "down",  -8  ),
      svc("voice",    "Voice",             61, 18, 38, "Major",    "up",     5  ),
      svc("sms",      "SMS",               88,  7, 22, "Minor",    "stable", 1  ),
      svc("roaming",  "Roaming",           92,  4, 18, "Minor",    "up",    12  ),
      svc("iot",      "IoT/M2M",           71, 11, 65, "Major",    "down",  -3  ),
      svc("core",     "Core/IMS",          55, 28, 89, "Critical", "down",  -15 ),
      svc("lte-ran",  "LTE RAN",           83,  9, 41, "Minor",    "up",     6  ),
      svc("broadband","Fixed Broadband",   75, 14, 58, "Critical", "stable",-1  ),
      svc("emergency","Emergency Svcs",    96,  2, 12, "Minor",    "up",     3  ),
      svc("voip",     "VoIP/SIP Trunk",    69, 13, 72, "Major",    "down",  -4  ),
      svc("oss",      "OSS/BSS Platform",  87,  6, 31, "Minor",    "stable", 0  ),
      svc("nms",      "Network Mgmt",      62, 16, 78, "Critical", "down",  -9  ),
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
      svc("4g5g",     "4G/5G Data",        72, 68, 57, "Critical", "up",    11  ),
      svc("voice",    "Voice",             65, 54, 42, "Major",    "up",     8  ),
      svc("sms",      "SMS",               85, 21, 25, "Minor",    "stable", 2  ),
      svc("roaming",  "Roaming",           90, 12, 21, "Minor",    "up",    15  ),
      svc("iot",      "IoT/M2M",           68, 33, 71, "Critical", "up",     7  ),
      svc("core",     "Core/IMS",          58, 82, 94, "Critical", "up",     9  ),
      svc("lte-ran",  "LTE RAN",           80, 27, 44, "Major",    "up",     8  ),
      svc("broadband","Fixed Broadband",   73, 41, 62, "Critical", "up",     5  ),
      svc("emergency","Emergency Svcs",    95,  5, 14, "Minor",    "stable", 1  ),
      svc("voip",     "VoIP/SIP Trunk",    66, 39, 79, "Major",    "up",     6  ),
      svc("oss",      "OSS/BSS Platform",  84, 18, 34, "Minor",    "up",     4  ),
      svc("nms",      "Network Mgmt",      60, 48, 83, "Critical", "up",     7  ),
    ],
    kpiTrend: kpiTrend90d,
  },
};
