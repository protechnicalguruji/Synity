import React, { useState } from "react";
import { Lead, LeadStatus, ActivityLog, ActivityType } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { 
  Calendar, Clock, AlertTriangle, CheckCircle2, Phone, MessageSquare, 
  ChevronRight, ArrowUpDown, RefreshCw, UserCheck 
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils";

interface FollowUpQueueProps {
  leads: Lead[];
  onOpenDetails: (lead: Lead) => void;
  onUpdateFollowUp: (leadId: string, nextFollowUp: string | undefined) => void;
  onAddActivity: (activity: ActivityLog) => void;
}

export const FollowUpQueue: React.FC<FollowUpQueueProps> = ({
  leads,
  onOpenDetails,
  onUpdateFollowUp,
  onAddActivity
}) => {
  const [filter, setFilter] = useState<"ALL" | "OVERDUE" | "TODAY" | "TOMORROW" | "FUTURE">("ALL");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;
  const tomorrowEnd = todayEnd + 24 * 60 * 60 * 1000;

  // Filter leads that have follow-ups and are not Won/Lost
  const activeLeads = leads.filter(
    (l) => l.nextFollowUp && l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST
  );

  const getFollowUpCategory = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    if (time < todayStart) return "OVERDUE";
    if (time >= todayStart && time < todayEnd) return "TODAY";
    if (time >= todayEnd && time < tomorrowEnd) return "TOMORROW";
    return "FUTURE";
  };

  const categorizedLeads = activeLeads.map(l => ({
    lead: l,
    category: getFollowUpCategory(l.nextFollowUp!)
  }));

  const filteredQueue = categorizedLeads.filter(item => {
    if (filter === "ALL") return true;
    return item.category === filter;
  });

  // Sort: Overdue first, then by date ascending
  const sortedQueue = [...filteredQueue].sort((a, b) => {
    return new Date(a.lead.nextFollowUp!).getTime() - new Date(b.lead.nextFollowUp!).getTime();
  });

  const handleMarkComplete = (lead: Lead) => {
    // Clear follow-up
    onUpdateFollowUp(lead.id, undefined);

    // Create Activity Log
    const newActivity: ActivityLog = {
      id: `act-complete-fu-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.STATE_CHANGE,
      title: "Follow-up Task Completed",
      description: `Accomplished scheduled follow-up journey for ${lead.company}. Ready for pipeline acceleration.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    onAddActivity(newActivity);
  };

  // Counting badges
  const overdueCount = categorizedLeads.filter(i => i.category === "OVERDUE").length;
  const todayCount = categorizedLeads.filter(i => i.category === "TODAY").length;
  const tomorrowCount = categorizedLeads.filter(i => i.category === "TOMORROW").length;
  const futureCount = categorizedLeads.filter(i => i.category === "FUTURE").length;

  return (
    <div className="space-y-4 text-left">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={() => setFilter("ALL")}
          className={`p-3 rounded-xl border text-left transition-all ${
            filter === "ALL"
              ? "bg-[#4E4E49] text-white border-[#4E4E49]"
              : "bg-white text-gray-700 border-[#D8D8D8] hover:bg-gray-50"
          }`}
        >
          <span className="block text-[9px] uppercase font-bold tracking-wider opacity-85">All Follow-ups</span>
          <strong className="text-lg font-mono leading-none">{categorizedLeads.length}</strong>
        </button>

        <button
          onClick={() => setFilter("OVERDUE")}
          className={`p-3 rounded-xl border text-left transition-all ${
            filter === "OVERDUE"
              ? "bg-rose-600 text-white border-rose-600"
              : "bg-white text-rose-600 border-rose-200 hover:bg-rose-50/55"
          }`}
        >
          <span className="block text-[9px] uppercase font-bold tracking-wider opacity-85 flex items-center gap-1">
            <AlertTriangle size={10} className="shrink-0 animate-pulse" />
            Overdue
          </span>
          <strong className="text-lg font-mono leading-none">{overdueCount}</strong>
        </button>

        <button
          onClick={() => setFilter("TODAY")}
          className={`p-3 rounded-xl border text-left transition-all ${
            filter === "TODAY"
              ? "bg-amber-600 text-white border-amber-600"
              : "bg-white text-amber-600 border-amber-200 hover:bg-amber-50/55"
          }`}
        >
          <span className="block text-[9px] uppercase font-bold tracking-wider opacity-85">Today</span>
          <strong className="text-lg font-mono leading-none">{todayCount}</strong>
        </button>

        <button
          onClick={() => setFilter("TOMORROW")}
          className={`p-3 rounded-xl border text-left transition-all ${
            filter === "TOMORROW"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50/55"
          }`}
        >
          <span className="block text-[9px] uppercase font-bold tracking-wider opacity-85">Tomorrow</span>
          <strong className="text-lg font-mono leading-none">{tomorrowCount}</strong>
        </button>

        <button
          onClick={() => setFilter("FUTURE")}
          className={`p-3 rounded-xl border text-left transition-all ${
            filter === "FUTURE"
              ? "bg-slate-700 text-white border-slate-700"
              : "bg-white text-slate-700 border-[#D8D8D8] hover:bg-gray-50"
          }`}
        >
          <span className="block text-[9px] uppercase font-bold tracking-wider opacity-85">Future</span>
          <strong className="text-lg font-mono leading-none">{futureCount}</strong>
        </button>
      </div>

      {/* Main List */}
      <Card className="p-4 border border-[#D8D8D8] bg-white">
        {sortedQueue.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="flex justify-center text-gray-300">
              <Calendar size={42} className="stroke-1" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#2F2F2F]">Follow-up Queue Empty</h4>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono">No actions required for the selected interval.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedQueue.map(({ lead, category }) => {
              const isOverdue = category === "OVERDUE";
              return (
                <div
                  key={lead.id}
                  className={`py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                    isOverdue ? "bg-rose-50/20 px-3 rounded-xl border border-dashed border-rose-200/50 my-1 first:mt-0" : ""
                  }`}
                >
                  {/* Lead details */}
                  <div className="space-y-1 text-left min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-[#2F2F2F] hover:text-[#4E4E49] cursor-pointer" onClick={() => onOpenDetails(lead)}>
                        {lead.company}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">({lead.name})</span>
                      
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                          <AlertTriangle size={8} /> Overdue
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-500 font-mono">
                      <span className="flex items-center gap-1 font-sans font-bold text-gray-400">
                        VALUE: <strong className="text-gray-700">{formatCurrency(lead.value)}</strong>
                      </span>
                      <span className="flex items-center gap-1 font-sans font-bold text-gray-400">
                        STAGE: <strong className="text-gray-700">{lead.status.replace("_", " ")}</strong>
                      </span>
                      <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                        <Clock size={10} />
                        FOLLOW-UP DUE: {formatDate(lead.nextFollowUp!)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-stretch md:self-auto justify-end shrink-0">
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition-colors"
                        title="Simulate Outbound Call"
                      >
                        <Phone size={12} />
                      </a>
                    )}
                    
                    <button
                      onClick={() => onOpenDetails(lead)}
                      className="px-3 py-1.5 text-[10px] font-bold text-gray-600 hover:text-gray-800 bg-gray-50 border border-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Open Lead File
                    </button>

                    <button
                      onClick={() => handleMarkComplete(lead)}
                      className="px-3 py-1.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <CheckCircle2 size={11} />
                      Done
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
