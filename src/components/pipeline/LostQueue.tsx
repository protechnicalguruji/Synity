import React from "react";
import { Lead, LeadStatus, ActivityLog, ActivityType } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { 
  XCircle, RotateCcw, AlertTriangle, TrendingDown, Calendar, 
  User, Briefcase, Sparkles 
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils";

interface LostQueueProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  activities: ActivityLog[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onOpenDetails: (lead: Lead) => void;
}

export const LostQueue: React.FC<LostQueueProps> = ({
  leads,
  setLeads,
  activities,
  setActivities,
  onOpenDetails
}) => {
  // Filter leads in CLOSED_LOST
  const lostLeads = leads.filter(l => l.status === LeadStatus.CLOSED_LOST);

  const handleReviveLead = (lead: Lead) => {
    setLeads(prev => prev.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          status: LeadStatus.NEW,
          confidenceScore: 50,
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    }));

    // Create activity
    const act: ActivityLog = {
      id: `act-revive-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.STATE_CHANGE,
      title: "Lead Revived from Archives ♻️",
      description: `Recovered ${lead.company} back to New Leads Hub for a fresh qualification cycle.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    alert("Lead revived successfully and returned to NEW stage!");
  };

  const totalLostValue = lostLeads.reduce((sum, l) => sum + l.value, 0);

  return (
    <div className="space-y-5 text-left">
      
      {/* Metrics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 border border-[#D8D8D8] bg-white flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
            <XCircle size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Lost Opportunities</span>
            <strong className="text-xl font-mono text-slate-800 leading-none">{lostLeads.length}</strong>
          </div>
        </Card>

        <Card className="p-4 border border-[#D8D8D8] bg-white flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">
            <TrendingDown size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Total Lost Value</span>
            <strong className="text-xl font-mono text-rose-700 leading-none">{formatCurrency(totalLostValue)}</strong>
          </div>
        </Card>
      </div>

      {/* Lost Deals List */}
      {lostLeads.length === 0 ? (
        <Card className="p-12 border border-[#D8D8D8] bg-white text-center space-y-3">
          <XCircle size={36} className="mx-auto text-gray-300 stroke-1" />
          <div>
            <h4 className="font-bold text-xs text-[#2F2F2F]">Archives are Clean</h4>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono">No closed lost opportunities archived in this period.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lostLeads.map(l => {
            // Attempt to parse lost reason from notes (reason might be saved as "LOST REASON: pricing")
            const notes = l.notes || "";
            const reasonMatch = notes.match(/LOST REASON:\s*([^\n|]*)/);
            const detailMatch = notes.match(/LOST DETAILS:\s*([^\n]*)/);
            
            const reason = reasonMatch ? reasonMatch[1].trim() : "Unspecified";
            const details = detailMatch ? detailMatch[1].trim() : "No extra context provided.";

            return (
              <Card
                key={l.id}
                className="p-4 border border-[#D8D8D8] bg-white text-left space-y-3.5 relative overflow-hidden"
              >
                <div className="flex justify-between items-start gap-1.5">
                  <div className="space-y-0.5">
                    <span
                      className="block font-bold text-xs text-[#2F2F2F] hover:text-[#4E4E49] cursor-pointer truncate max-w-[170px]"
                      onClick={() => onOpenDetails(l)}
                    >
                      {l.company}
                    </span>
                    <span className="block text-[10px] text-gray-400 font-mono">
                      Contact: {l.name}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider shrink-0 font-mono">
                    Archived Lost
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-2 text-[10px]">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-400 uppercase tracking-wider font-mono">Lost Reason:</span>
                    <strong className="text-rose-700 font-extrabold uppercase font-mono">{reason}</strong>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed pr-2">{details}</p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1 border-t border-[#F2F2F2]">
                  <span>REVENUE LOSS:</span>
                  <strong className="text-[#2F2F2F] font-extrabold">{formatCurrency(l.value)}</strong>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span>CLOSE DATE:</span>
                  <span className="font-bold">{formatDate(l.updatedAt || l.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2.5 border-t border-[#F5F5F5] text-[10px]">
                  <button
                    onClick={() => onOpenDetails(l)}
                    className="font-bold text-gray-400 hover:text-gray-600 font-sans"
                  >
                    Open Lead File
                  </button>

                  <button
                    onClick={() => handleReviveLead(l)}
                    className="px-2.5 py-1.5 text-[10px] font-bold text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={11} />
                    Revive Deal
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};
