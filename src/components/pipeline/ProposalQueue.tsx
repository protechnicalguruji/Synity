import React, { useState } from "react";
import { Lead, LeadStatus, ActivityLog, ActivityType } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { 
  FileText, Clock, TrendingUp, AlertCircle, CheckCircle2, 
  User, RefreshCw, Send, Sparkles, HelpCircle 
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils";

interface ProposalQueueProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  activities: ActivityLog[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onOpenDetails: (lead: Lead) => void;
}

export const ProposalQueue: React.FC<ProposalQueueProps> = ({
  leads,
  setLeads,
  activities,
  setActivities,
  onOpenDetails
}) => {
  // Filter leads in PROPOSAL status
  const proposalLeads = leads.filter(l => l.status === LeadStatus.PROPOSAL);

  // Help calculate "Waiting Since"
  const calculateWaitingSinceDays = (dateStr: string) => {
    const diffTime = Math.abs(Date.now() - new Date(dateStr).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Manage custom sub-status (saved in executive notes or inline states)
  // Since we want standard data persistence, we can store/update the Lead value or stage directly.
  const handleProposalStatusUpdate = (leadId: string, company: string, subStatus: string) => {
    // Generate activity
    const act: ActivityLog = {
      id: `act-prop-sub-${Date.now()}`,
      leadId,
      leadName: company,
      type: ActivityType.STATE_CHANGE,
      title: "Proposal Status Transitioned",
      description: `Updated proposal sub-status for ${company} to: ${subStatus}.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };

    setActivities(prev => [act, ...prev]);
    alert(`Updated proposal sub-status to: ${subStatus}`);
  };

  const handleUpdateDealValue = (leadId: string, newValueStr: string) => {
    const value = parseFloat(newValueStr);
    if (isNaN(value)) return;

    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, value, updatedAt: new Date().toISOString() } : l));
  };

  const handleAcceptProposal = (lead: Lead) => {
    setLeads(prev => prev.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          status: LeadStatus.NEGOTIATION,
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    }));

    // Create activity
    const act: ActivityLog = {
      id: `act-prop-accept-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.STATE_CHANGE,
      title: "Proposal Accepted 🎉",
      description: `Client agreed to financial blueprint. Shifting deal stage into legal payment negotiation.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    alert("Proposal accepted! Shifting lead into active NEGOTIATION stage.");
  };

  const totalValue = proposalLeads.reduce((sum, l) => sum + l.value, 0);

  return (
    <div className="space-y-5 text-left">
      
      {/* Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-[#D8D8D8] bg-white flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
            <FileText size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Pending Proposals</span>
            <strong className="text-xl font-mono text-[#2F2F2F] leading-none">{proposalLeads.length}</strong>
          </div>
        </Card>

        <Card className="p-4 border border-[#D8D8D8] bg-white flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Active Pipeline Value</span>
            <strong className="text-xl font-mono text-[#2F2F2F] leading-none">{formatCurrency(totalValue)}</strong>
          </div>
        </Card>

        <Card className="p-4 border border-[#D8D8D8] bg-white flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Clock size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Average Waiting Since</span>
            <strong className="text-xl font-mono text-[#2F2F2F] leading-none">
              {proposalLeads.length > 0 
                ? `${Math.round(proposalLeads.reduce((sum, l) => sum + calculateWaitingSinceDays(l.createdAt), 0) / proposalLeads.length)} Days` 
                : "N/A"
              }
            </strong>
          </div>
        </Card>
      </div>

      {/* Proposal Grid */}
      {proposalLeads.length === 0 ? (
        <Card className="p-12 border border-[#D8D8D8] bg-white text-center space-y-3">
          <FileText size={36} className="mx-auto text-gray-300 stroke-1" />
          <div>
            <h4 className="font-bold text-xs text-[#2F2F2F]">No Pending Proposals</h4>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono">Create, dispatch, and track business contracts here.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {proposalLeads.map(l => {
            const waitingDays = calculateWaitingSinceDays(l.createdAt);
            const isWarning = waitingDays > 14;

            return (
              <Card
                key={l.id}
                className={`p-4 border text-left space-y-3.5 bg-white transition-all relative ${
                  isWarning ? "border-amber-200/80 ring-1 ring-amber-500/10" : "border-[#D8D8D8] hover:border-[#60605B]"
                }`}
              >
                {/* Header info */}
                <div className="flex justify-between items-start gap-1">
                  <div className="space-y-0.5">
                    <span
                      className="block font-bold text-sm text-[#2F2F2F] hover:text-[#4E4E49] cursor-pointer"
                      onClick={() => onOpenDetails(l)}
                    >
                      {l.company}
                    </span>
                    <span className="block text-[11px] text-gray-400 font-medium">
                      Representative: {l.name}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono ${
                    isWarning 
                      ? "bg-amber-100 text-amber-700 border border-amber-200" 
                      : "bg-[#E5E3E7] text-[#2F2F2F] border border-[#D8D8D8]"
                  }`}>
                    {isWarning ? <AlertCircle size={9} /> : <FileText size={9} />}
                    {isWarning ? "Waiting Long" : "Active Proposal"}
                  </span>
                </div>

                {/* Proposal parameters inputs */}
                <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-[#F2F2F2] text-[10px] text-gray-500 font-mono">
                  <div className="space-y-1">
                    <span className="block text-[8px] uppercase font-bold text-gray-400">Proposal Value ($)</span>
                    <input
                      type="number"
                      value={l.value}
                      onChange={(e) => handleUpdateDealValue(l.id, e.target.value)}
                      className="block w-full rounded border border-[#D8D8D8] bg-slate-50 text-[11px] font-bold px-2 py-1 outline-none text-slate-800 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[8px] uppercase font-bold text-gray-400">Waiting Since</span>
                    <span className={`block font-extrabold text-[12px] pt-1.5 ${isWarning ? "text-amber-700" : "text-gray-700"}`}>
                      {waitingDays} Days Age
                    </span>
                  </div>
                </div>

                {/* Sub status state select */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[10px]">
                  <div className="space-y-1 text-left">
                    <label className="block text-[8px] uppercase font-bold text-gray-400 font-mono">Proposal Status</label>
                    <select
                      onChange={(e) => handleProposalStatusUpdate(l.id, l.company, e.target.value)}
                      className="block w-full rounded border border-[#D8D8D8] bg-white text-[10px] p-1 font-sans text-gray-700 outline-none"
                    >
                      <option value="Draft">Draft Mode</option>
                      <option value="Sent" selected>Sent to Client</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Revised">Revised Version</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-[8px] uppercase font-bold text-gray-400 font-mono">Sent Date</label>
                    <span className="block font-bold text-[10px] text-gray-600 pt-1.5 font-mono">
                      {formatDate(l.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Quick actions bottom */}
                <div className="pt-2 border-t border-[#F5F5F5] flex justify-between items-center text-[10px]">
                  <button
                    onClick={() => onOpenDetails(l)}
                    className="font-bold text-gray-500 hover:text-gray-800"
                  >
                    Open Lead File
                  </button>

                  <button
                    onClick={() => handleAcceptProposal(l)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer text-[10px]"
                  >
                    <CheckCircle2 size={11} />
                    Accept & Contract
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
