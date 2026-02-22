"use client";

import { useState } from "react";
import PageTitle from "@/components/overview/PageTitle";
import FilterBar from "@/components/overview/FilterBar";
import SummaryStrip from "@/components/overview/SummaryStrip";
import SeverityDonut from "@/components/overview/SeverityDonut";
import ResponseStatusBars from "@/components/overview/ResponseStatusBars";
import AffectedServicesBubble from "@/components/overview/AffectedServicesBubble";
import IncidentFeed from "@/components/overview/IncidentFeed";
import CallVolumePanel from "@/components/overview/CallVolumePanel";
import DownDetectorPanel from "@/components/overview/DownDetectorPanel";
import TicketFlowPanel from "@/components/overview/TicketFlowPanel";

interface FilterState {
  severity: string;
  status: string;
  startDate: string;
  endDate: string;
}

export default function OverviewPage() {
  const [filters, setFilters] = useState<FilterState>({
    severity: "All",
    status: "All",
    startDate: "",
    endDate: "",
  });

  return (
    <div className="px-8 py-6 max-w-[1600px] mx-auto space-y-5">
      {/* Page title + live badge */}
      <PageTitle />

      {/* Filter Bar */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {/* Summary Strip */}
      <SummaryStrip />

      {/* Row 2: Call Volume · Down Detector · Ticket Flow */}
      <div className="grid grid-cols-3 gap-5">
        <CallVolumePanel />
        <DownDetectorPanel />
        <TicketFlowPanel />
      </div>

      {/* Row 3: Severity Donut · Response Status · Affected Services */}
      <div className="grid grid-cols-3 gap-5">
        <SeverityDonut />
        <ResponseStatusBars />
        <AffectedServicesBubble />
      </div>

      {/* Row 5: Live Incident Feed — full width */}
      <IncidentFeed filters={filters} />
    </div>
  );
}
