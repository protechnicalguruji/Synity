import React from "react";
import { Lead, LeadStatus, ActivityLog, ActivityType } from "../../types";
import { Card } from "../ui/Card";
import { CheckCircle2, ChevronRight, Circle, Clock, Sparkles, User, UserCheck } from "lucide-react";
import { formatDate } from "../../utils";

interface WorkflowTimelineProps {
  lead: Lead;
  activities: ActivityLog[];
}

const ORDERED_TRACK_STAGES = [
  { status: LeadStatus.NEW, label: "Created" },
  { status: LeadStatus.CALLED, label: "Called" },
  { status: LeadStatus.WHATSAPP_SENT, label: "WhatsApp" },
  { status: LeadStatus.MEETING, label: "Meeting" },
  { status: LeadStatus.PROPOSAL, label: "Proposal" },
  { status: LeadStatus.NEGOTIATION, label: "Negotiate" },
  { status: LeadStatus.CLOSED_WON, label: "Closed" }
];

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ lead, activities }) => {
  // Find current index
  const currentStageIndex = ORDERED_TRACK_STAGES.findIndex(s => s.status === lead.status);
  
  // Filter activities related to state change for this lead
  const leadTransitions = activities
    .filter(act => act.leadId === lead.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Card className="p-5 border border-[#D8D8D8] text-left space-y-5 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-xs text-[#2F2F2F] tracking-tight flex items-center gap-2 uppercase">
            <Sparkles size={13} className="text-[#8CB9D7]" />
            Workflow progression timeline
          </h4>
          <p className="text-[10px] text-gray-400 mt-0.5">Real-time lifecycle logging for {lead.company}</p>
        </div>
      </div>

      {/* 1. HORIZONTAL PROGRESS TRACKER */}
      <div className="overflow-x-auto pb-2 select-none">
        <div className="flex items-center min-w-[650px] px-2 py-3">
          {ORDERED_TRACK_STAGES.map((step, idx) => {
            const isCompleted = idx < currentStageIndex || lead.status === LeadStatus.CLOSED_WON;
            const isCurrent = lead.status === step.status || (lead.status === LeadStatus.CLOSED_LOST && step.status === LeadStatus.CLOSED_WON);
            const isLost = lead.status === LeadStatus.CLOSED_LOST && idx === ORDERED_TRACK_STAGES.length - 1;

            return (
              <React.Fragment key={step.status}>
                {/* Step Connector Line */}
                {idx > 0 && (
                  <div className={`h-[2px] flex-1 mx-2 transition-all ${
                    isCompleted ? "bg-[#4E4E49]" : "bg-gray-200"
                  }`} />
                )}

                {/* Step Bubble */}
                <div className="flex flex-col items-center text-center space-y-1 shrink-0 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all border ${
                    isLost
                      ? "bg-rose-50 text-rose-600 border-rose-300"
                      : isCompleted
                      ? "bg-[#4E4E49] text-white border-[#4E4E49]"
                      : isCurrent
                      ? "bg-[#E5E3E7] text-[#2F2F2F] border-[#4E4E49] ring-2 ring-[#4E4E49]/20"
                      : "bg-white text-gray-400 border-gray-200"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 size={13} className="stroke-[2.5]" />
                    ) : (
                      <span className="text-[9px] font-bold font-mono">{idx + 1}</span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold ${
                    isCurrent || isLost ? "text-[#2F2F2F]" : "text-gray-400"
                  }`}>
                    {step.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 2. DETAILED TRANSITIONS VERTICAL FEED */}
      <div className="space-y-3 pt-3 border-t border-[#F2F2F2]">
        <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">Transition History Log</h5>
        
        {leadTransitions.length === 0 ? (
          <div className="py-4 text-center text-[10px] text-gray-400 font-mono">
            No activity movements logged yet.
          </div>
        ) : (
          <div className="relative pl-4 border-l border-gray-100 ml-2 space-y-4">
            {leadTransitions.map((act) => (
              <div key={act.id} className="relative text-xs">
                {/* Visual bullet on line */}
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border bg-white border-gray-300 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                </span>

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-[#2F2F2F]">{act.title}</span>
                    <span className="text-[9px] text-gray-400 font-mono">{formatDate(act.timestamp)}</span>
                  </div>
                  <p className="text-gray-500 text-[11px] leading-relaxed pr-2">{act.description}</p>
                  
                  <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-mono">
                    <User size={9} />
                    <span>{act.userName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
