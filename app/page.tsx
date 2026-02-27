"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/overview/PageTitle";
import FilterBar from "@/components/overview/FilterBar";
import SummaryStrip from "@/components/overview/SummaryStrip";
import SeverityDonut from "@/components/overview/SeverityDonut";
import ResponseStatusBars from "@/components/overview/ResponseStatusBars";
import AffectedServicesBubble from "@/components/overview/AffectedServicesBubble";
import IncidentFeed, {
  LiveIncident,
  NewIncidentBanner,
} from "@/components/overview/IncidentFeed";
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
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    severity: "All",
    status: "All",
    startDate: "",
    endDate: "",
  });

  // Live incidents settled in the feed (post-banner)
  const [liveIncidents, setLiveIncidents] = useState<LiveIncident[]>([]);

  // Banner queue — one visible at a time, above FilterBar
  const [bannerQueue, setBannerQueue] = useState<LiveIncident[]>([]);

  const currentBanner = bannerQueue[0] ?? null;

  // Called by the simulator in IncidentFeed
  const handleNewIncident = useCallback((inc: LiveIncident) => {
    setBannerQueue((prev) => [...prev, inc]);
  }, []);

  // Dismiss → send incident into feed as unacknowledged
  const dismissBanner = useCallback(() => {
    setBannerQueue((prev) => {
      const [current, ...rest] = prev;
      if (current) setLiveIncidents((li) => [current, ...li]);
      return rest;
    });
  }, []);

  // View → send incident into feed as acknowledged + navigate to detail
  const viewBanner = useCallback(() => {
    setBannerQueue((prev) => {
      const [current, ...rest] = prev;
      if (current) {
        setLiveIncidents((li) => [{ ...current, acknowledged: true }, ...li]);
        router.push(`/incident/${current.id}`);
      }
      return rest;
    });
  }, [router]);

  // Explicit ACK from the card's hover button
  function handleAck(liveId: string) {
    setLiveIncidents((prev) =>
      prev.map((i) => (i.liveId === liveId ? { ...i, acknowledged: true } : i))
    );
  }

  return (
    <div className="px-8 py-6 max-w-[1600px] mx-auto space-y-5">
      {/* Page title + live badge */}
      <PageTitle />

      {/* ── Intrusion banner — above all controls ── */}
      {currentBanner && (
        <NewIncidentBanner
          incident={currentBanner}
          onView={viewBanner}
          onDismiss={dismissBanner}
        />
      )}

      {/* Filter Bar */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {/* Summary Strip */}
      <SummaryStrip filters={filters} />

      {/* Live Incident Feed */}
      <IncidentFeed
        filters={filters}
        liveIncidents={liveIncidents}
        onNewIncident={handleNewIncident}
        onAck={handleAck}
      />

      {/* Row: Call Volume · Down Detector · Ticket Flow */}
      <div className="grid grid-cols-3 gap-5">
        <CallVolumePanel />
        <DownDetectorPanel />
        <TicketFlowPanel />
      </div>

      {/* Row: Severity Donut · Response Status · Affected Services */}
      <div className="grid grid-cols-3 gap-5">
        <SeverityDonut />
        <ResponseStatusBars />
        <AffectedServicesBubble />
      </div>
    </div>
  );
}
