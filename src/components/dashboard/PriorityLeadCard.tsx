/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, ArrowRight, User, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Lead, LeadStatus } from "../../types";
import { getStatusStyle, getConfidenceColor } from "../../utils";

interface PriorityLeadCardProps {
  leads: Lead[];
  onOpenLead: (leadId: string) => void;
}

export const PriorityLeadCard: React.FC<PriorityLeadCardProps> = ({ leads, onOpenLead }) => {
  // Sort leads by confidenceScore desc, value desc, select top 5
  const priorityLeads = [...leads]
    .sort((a, b) => b.confidenceScore - a.confidenceScore || b.value - a.value)
    .slice(0, 5);

  // Helper to determine custom action & reason dynamically based on lead info
  const getAiActionAndReason = (lead: Lead) => {
    switch (lead.status) {
      case LeadStatus.NEW:
        return {
          action: "Schedule Discovery Call",
          reason: "Lead registered via outreach with no active contact logs."
        };
      case LeadStatus.CALLED:
        return {
          action: "Draft Custom Proposal",
          reason: "Prospect requested a structured pricing blueprint."
        };
      case LeadStatus.INTERESTED:
        return {
          action: "Send Feature Demonstration",
          reason: "High closing propensity. Ready for detailed CRM preview."
        };
      case LeadStatus.PROPOSAL:
        return {
          action: "Follow Up Today",
          reason: `No contact logged for 3 days since proposal V1.1 delivery.`
        };
      case LeadStatus.NEGOTIATION:
        return {
          action: "Secure Legal Review Sync",
          reason: "Contract draft currently pending. Urgent to clear barriers."
        };
      default:
        return {
          action: "Audit Account Health",
          reason: "Review onboarding and platform usage metrics."
        };
    }
  };

  return (
    <Card
      id="ai-priority-leads-widget"
      title={
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#8CB9D7]" />
          <span className="font-display font-bold text-[#2F2F2F]">AI Smart Priority Pipeline</span>
        </div>
      }
      description="The top 5 prospective deals requiring immediate high-impact sales action today."
    >
      {priorityLeads.length === 0 ? (
        <div className="text-center py-8 text-xs text-gray-500">
          No active leads in pipeline. Create some leads to seed AI prioritization!
        </div>
      ) : (
        <div className="space-y-4 mt-2">
          {priorityLeads.map((lead) => {
            const statusStyle = getStatusStyle(lead.status);
            const confStyle = getConfidenceColor(lead.confidenceScore);
            const { action, reason } = getAiActionAndReason(lead);

            return (
              <div
                key={lead.id}
                className="group p-4 bg-white hover:bg-gray-50/50 border border-[#D8D8D8] hover:border-[#60605B] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 text-left shadow-2xs"
              >
                {/* Left Side: Lead Bio & Stage Info */}
                <div className="space-y-2 max-w-xl flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-[#2F2F2F] tracking-tight group-hover:text-black">
                      {lead.company}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold border ${confStyle.bg} ${confStyle.text} ${confStyle.border}`}>
                      <TrendingUp size={10} />
                      {lead.confidenceScore}% Close
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-[10px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1 text-gray-400">
                      <User size={11} /> {lead.name}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-[#4E4E49]">
                      Value: ${lead.value.toLocaleString()}
                    </span>
                  </div>

                  {/* AI Recommendation Context */}
                  <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg flex items-start gap-2">
                    <AlertCircle size={13} className="text-[#8CB9D7] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-[#2F2F2F]">{action}</p>
                      <p className="text-[10px] text-gray-500 leading-normal font-medium">{reason}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Action Trigger */}
                <div className="shrink-0 flex items-center">
                  <button
                    onClick={() => onOpenLead(lead.id)}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#2F2F2F] hover:text-black bg-gray-50 hover:bg-[#E5E3E7]/40 border border-[#D8D8D8] rounded-lg transition-all shadow-2xs cursor-pointer"
                  >
                    <span>Open Lead</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
