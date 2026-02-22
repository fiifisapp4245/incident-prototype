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
      <IncidentHeader incident={incident} />

      {/* Row 1: AI Summary + Lifecycle Timeline — same height */}
      <div className="grid grid-cols-[3fr_2fr] gap-4 items-stretch">
        <div className="h-full">
          <ClassificationSummary incident={incident} />
        </div>
        <div className="h-full">
          <LifecycleTimeline incident={incident} />
        </div>
      </div>

      {/* Row 2: 2×2 signal panels — full width */}
      <div className="grid grid-cols-2 gap-4">
        <AlarmDataPanel />
        <CallDetailPanel />
        <DownDetectorDetailPanel />
        <TicketDetailPanel />
      </div>
    </div>
  );
}
