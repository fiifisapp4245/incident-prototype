import { notFound } from "next/navigation";
import { incidents } from "@/lib/data";
import IncidentHeader from "@/components/detail/IncidentHeader";
import ClassificationSummary from "@/components/detail/ClassificationSummary";
import LifecycleTimeline from "@/components/detail/LifecycleTimeline";
import AlarmDataPanel from "@/components/detail/AlarmDataPanel";
import CallDetailPanel from "@/components/detail/CallDetailPanel";
import DownDetectorDetailPanel from "@/components/detail/DownDetectorDetailPanel";
import TicketDetailPanel from "@/components/detail/TicketDetailPanel";

interface Props {
  params: { id: string };
}

export default function DetailPage({ params }: Props) {
  const incident = incidents.find((inc) => inc.id === params.id);
  if (!incident) notFound();

  return (
    <div className="px-5 py-5 max-w-[1600px] mx-auto space-y-4">
      {/* Incident Header */}
      <IncidentHeader incident={incident} />

      {/* Row 1: AI Summary + Timeline */}
      <div className="grid grid-cols-2 gap-4">
        <ClassificationSummary incident={incident} />
        <LifecycleTimeline incident={incident} />
      </div>

      {/* Row 2: Signal Data — 3 columns */}
      <div className="grid grid-cols-3 gap-4">
        <AlarmDataPanel />
        <CallDetailPanel />
        <DownDetectorDetailPanel />
      </div>

      {/* Row 3: Ticket Flow — full width */}
      <TicketDetailPanel />
    </div>
  );
}
