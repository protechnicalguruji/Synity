import React, { useState } from "react";
import { Lead, LeadStatus, ActivityLog, ActivityType } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { 
  DollarSign, Clock, Calendar, CheckSquare, AlertTriangle, 
  Smile, User, FileText, ChevronRight, Sparkles 
} from "lucide-react";
import { formatCurrency, formatDate, getConfidenceColor } from "../../utils";

interface NegotiationQueueProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  activities: ActivityLog[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onOpenDetails: (lead: Lead) => void;
  onMarkLostClick: (lead: Lead) => void;
}

export const NegotiationQueue: React.FC<NegotiationQueueProps> = ({
  leads,
  setLeads,
  activities,
  setActivities,
  onOpenDetails,
  onMarkLostClick
}) => {
  // Filter leads in NEGOTIATION status
  const negotiationLeads = leads.filter(l => l.status === LeadStatus.NEGOTIATION);

  // Update lead fields inline
  const handleUpdateNotes = (leadId: string, notes: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes, updatedAt: new Date().toISOString() } : l));
  };

  const handleUpdateCloseDate = (leadId: string, closeDateStr: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, nextFollowUp: new Date(closeDateStr).toISOString(), updatedAt: new Date().toISOString() } : l));
  };

  const handleUpdateConfidence = (leadId: string, confidenceScore: number) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, confidenceScore, updatedAt: new Date().toISOString() } : l));
  };

  const handleMarkWon = (lead: Lead) => {
    setLeads(prev => prev.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          status: LeadStatus.CLOSED_WON,
          confidenceScore: 100,
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    }));

    // Create activity
    const act: ActivityLog = {
      id: `act-negotiation-won-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.STATE_CHANGE,
      title: "Closed Won! 🎉 Partnership Signed",
      description: `Negotiation successfully sealed. ${lead.company} is officially onboarded. Deal value: ${formatCurrency(lead.value)}.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    alert(`Partnership confirmed! Subscriptions initiated for ${lead.company}!`);
  };

  const totalValue = negotiationLeads.reduce((sum, l) => sum + l.value, 0);

  return (
    <div className="space-y-5 text-left">
      
      {/* Metrics Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-[#D8D8D8] rounded-xl">
        <div className="space-y-0.5 text-left">
          <h4 className="font-bold text-xs text-[#2F2F2F] uppercase tracking-wider">Executive Negotiation Center</h4>
          <p className="text-[10px] text-gray-500 uppercase font-mono">
            Fine-tune payment terms, compliance clauses, and closing schedules.
          </p>
        </div>

        <div className="flex gap-4 text-xs font-mono">
          <div className="p-2 border border-slate-100 rounded-lg bg-slate-50">
            <span className="block text-[8px] text-gray-400 font-bold uppercase">Deals in Review</span>
            <strong className="text-gray-800 text-sm font-black">{negotiationLeads.length}</strong>
          </div>
          <div className="p-2 border border-emerald-100 rounded-lg bg-emerald-50">
            <span className="block text-[8px] text-emerald-600 font-bold uppercase">Weighted Pipeline</span>
            <strong className="text-emerald-700 text-sm font-black">
              {formatCurrency(negotiationLeads.reduce((sum, l) => sum + (l.value * (l.confidenceScore / 100)), 0))}
            </strong>
          </div>
        </div>
      </div>

      {/* Negotiation List */}
      {negotiationLeads.length === 0 ? (
        <Card className="p-12 border border-[#D8D8D8] bg-white text-center space-y-3">
          <Smile size={36} className="mx-auto text-gray-300 stroke-1" />
          <div>
            <h4 className="font-bold text-xs text-[#2F2F2F]">No Deals in Active Negotiation</h4>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono">Push proposal files into accepted status to populate this list.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {negotiationLeads.map(l => {
            const conf = getConfidenceColor(l.confidenceScore);

            return (
              <Card
                key={l.id}
                className="p-5 border border-[#D8D8D8] bg-white text-left space-y-4 shadow-2xs hover:border-[#4E4E49] transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-0.5">
                    <span
                      className="font-bold text-sm text-[#2F2F2F] hover:text-[#4E4E49] cursor-pointer"
                      onClick={() => onOpenDetails(l)}
                    >
                      {l.company}
                    </span>
                    <span className="block text-[11px] text-gray-400 font-medium font-mono">
                      Owner: {l.name} | Sector: {l.industry || "General"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">Closing Likelihood:</span>
                    <select
                      value={l.confidenceScore}
                      onChange={(e) => handleUpdateConfidence(l.id, parseInt(e.target.value))}
                      className={`rounded px-2.5 py-1 text-[10px] font-extrabold border font-mono ${conf.bg} ${conf.text} ${conf.border}`}
                    >
                      <option value="10">10% Ice Cold</option>
                      <option value="30">30% Cool</option>
                      <option value="50">50% Average</option>
                      <option value="75">75% High Interest</option>
                      <option value="85">85% Under Legal Review</option>
                      <option value="95">95% Contract Out</option>
                    </select>
                  </div>
                </div>

                {/* Inline Editing Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono pt-3 border-t border-[#F2F2F2]">
                  {/* Close date */}
                  <div className="space-y-1">
                    <span className="block text-[8px] uppercase font-bold text-gray-400">Target Closing Date</span>
                    <input
                      type="date"
                      value={l.nextFollowUp ? l.nextFollowUp.split("T")[0] : ""}
                      onChange={(e) => handleUpdateCloseDate(l.id, e.target.value)}
                      className="block w-full rounded-lg border border-[#D8D8D8] bg-slate-50 text-[11px] font-bold px-3 py-1.5 outline-none text-slate-800"
                    />
                  </div>

                  {/* Value */}
                  <div className="space-y-1">
                    <span className="block text-[8px] uppercase font-bold text-gray-400">Final Agreed Value ($)</span>
                    <input
                      type="number"
                      value={l.value}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                          setLeads(prev => prev.map(item => item.id === l.id ? { ...item, value: val } : item));
                        }
                      }}
                      className="block w-full rounded-lg border border-[#D8D8D8] bg-slate-50 text-[11px] font-bold px-3 py-1.5 outline-none text-slate-800"
                    />
                  </div>

                  {/* Expected Stage display */}
                  <div className="space-y-1">
                    <span className="block text-[8px] uppercase font-bold text-gray-400">Current Sales Block</span>
                    <span className="block text-blue-700 font-extrabold text-[11px] pt-1.5 uppercase flex items-center gap-1">
                      <Sparkles size={11} className="animate-pulse" />
                      NEGOTIATION PANEL
                    </span>
                  </div>
                </div>

                {/* Notes box */}
                <div className="space-y-1.5 text-xs">
                  <span className="block text-[8px] uppercase font-bold text-gray-400 font-mono">Negotiation Notes & Pain Points</span>
                  <textarea
                    rows={2}
                    placeholder="Enter special payment clauses, legal requirements or schedule dates..."
                    value={l.notes || ""}
                    onChange={(e) => handleUpdateNotes(l.id, e.target.value)}
                    className="block w-full rounded-lg border border-[#D8D8D8] bg-white p-2.5 outline-none text-xs text-[#2F2F2F] leading-relaxed resize-none font-sans"
                  />
                </div>

                {/* Closing actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-[#F5F5F5] text-[10px]">
                  <button
                    onClick={() => onOpenDetails(l)}
                    className="font-bold text-gray-400 hover:text-gray-600 font-sans"
                  >
                    Open Lead File
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onMarkLostClick(l)}
                      className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 font-extrabold rounded-lg transition-colors cursor-pointer text-[10px]"
                    >
                      Mark Lost
                    </button>
                    <button
                      onClick={() => handleMarkWon(l)}
                      className="px-4 py-1.5 bg-[#4E4E49] hover:bg-[#3D3D38] text-white font-extrabold rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer text-[10px]"
                    >
                      <Smile size={12} className="text-amber-300" />
                      Confirm Closed Won Partnership
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};
