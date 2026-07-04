/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SummaryDigest } from "../../types/notification";
import { Sparkles, Calendar, ArrowRight, UserPlus, FileText, CheckCircle2 } from "lucide-react";

interface DigestCardProps {
  digest: SummaryDigest;
  onOpenLeadProfile?: (leadId: string) => void;
}

export const DigestCard: React.FC<DigestCardProps> = ({
  digest,
  onOpenLeadProfile
}) => {
  return (
    <div
      className="bg-white border border-[#D8D8D8] rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition-all text-left"
      id={`digest-card-${digest.id}`}
    >
      {/* CARD COPT HEADER */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 p-4 text-white space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full tracking-wider flex items-center gap-1">
            <Sparkles size={9} className="animate-spin-reverse" />
            <span>AI {digest.type} Briefing</span>
          </span>
          <span className="text-[10px] font-mono text-purple-200">
            {new Date(digest.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })} @{" "}
            {new Date(digest.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div className="space-y-0.5">
          <h3 className="text-sm font-bold font-display tracking-tight flex items-center gap-1.5">
            Proactive Sales Dashboard Synthesis
          </h3>
          <p className="text-[11px] text-purple-100 font-medium">
            Ingested {digest.totalAlertsCount} alerts • Includes {digest.criticalAlertsCount} urgent pipeline breaches
          </p>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="p-4 space-y-4">
        {/* AI SUMMARY */}
        <div className="space-y-1">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={11} className="text-purple-600" /> Executive Co-Pilot Summary
          </h4>
          <p className="text-xs text-[#2F2F2F] leading-relaxed font-medium bg-purple-50/40 p-3 rounded-xl border border-purple-100/50">
            {digest.aiSummary}
          </p>
        </div>

        {/* TOP ACTION ITEMS */}
        {digest.topActionItems && digest.topActionItems.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Priority Directives</h4>
            <ul className="space-y-1">
              {digest.topActionItems.map((item, idx) => (
                <li key={idx} className="text-xs font-semibold text-[#2F2F2F] flex items-start gap-2 leading-relaxed">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* LEADS TO RE-ENGAGE */}
        {digest.leadsToReengage && digest.leadsToReengage.length > 0 && (
          <div className="space-y-1.5 border-t border-[#EBEBEB] pt-3.5">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <UserPlus size={11} className="text-indigo-600" /> Crucial Leads to Re-engage
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {digest.leadsToReengage.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => onOpenLeadProfile?.(lead.id)}
                  className="p-2.5 bg-[#FAF9FC] hover:bg-purple-50 border border-[#D8D8D8] hover:border-purple-200 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2F2F2F] truncate">{lead.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{lead.company}</p>
                  </div>
                  <ArrowRight size={12} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DigestCard;
