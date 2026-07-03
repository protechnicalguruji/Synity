/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Phone, Clock, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Lead } from "../../types";

interface CallbackCardProps {
  leads: Lead[];
  onOpenLead: (leadId: string) => void;
}

interface CallbackItem {
  leadId: string;
  company: string;
  name: string;
  phone?: string;
  timeString: string;
  isUrgent: boolean; // Less than 1 hour or overdue
  isOverdue: boolean;
  rawDiffMs: number;
}

export const CallbackCard: React.FC<CallbackCardProps> = ({ leads, onOpenLead }) => {
  const [callbacks, setCallbacks] = useState<CallbackItem[]>([]);

  useEffect(() => {
    function computeTimes() {
      const now = new Date();
      const items = leads
        .filter((l) => l.nextFollowUp && l.status !== "CLOSED_WON" && l.status !== "CLOSED_LOST")
        .map((lead) => {
          const followTime = new Date(lead.nextFollowUp!);
          const diffMs = followTime.getTime() - now.getTime();
          const isOverdue = diffMs < 0;
          const absDiff = Math.abs(diffMs);

          const hours = Math.floor(absDiff / (1000 * 60 * 60));
          const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

          let timeString = "";
          if (isOverdue) {
            timeString = `Overdue by ${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
          } else {
            timeString = `${hours > 0 ? `${hours}h ` : ""}${minutes}m remaining`;
          }

          // Urgent if overdue or less than 1 hour remaining
          const isUrgent = isOverdue || (!isOverdue && diffMs < 60 * 60 * 1000);

          return {
            leadId: lead.id,
            company: lead.company,
            name: lead.name,
            phone: lead.phone,
            timeString,
            isUrgent,
            isOverdue,
            rawDiffMs: diffMs
          };
        })
        // Sort callbacks: overdue and urgent first, then closest in the future
        .sort((a, b) => {
          if (a.isOverdue && !b.isOverdue) return -1;
          if (!a.isOverdue && b.isOverdue) return 1;
          return a.rawDiffMs - b.rawDiffMs;
        });

      setCallbacks(items.slice(0, 4)); // Show top 4 upcoming callbacks
    }

    computeTimes();
    const interval = setInterval(computeTimes, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [leads]);

  return (
    <Card
      id="upcoming-callbacks-widget"
      title={
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-amber-500 animate-pulse" />
          <span className="font-display font-bold text-[#2F2F2F]">Upcoming Active Callbacks</span>
        </div>
      }
      description="Live countdown timers for scheduled follow-ups. Highlighted rows require swift action."
    >
      {callbacks.length === 0 ? (
        <div className="text-center py-10 text-xs text-gray-500 border border-dashed border-[#D8D8D8] rounded-xl bg-white">
          <CheckCircle size={20} className="mx-auto text-emerald-500 mb-2" />
          <p className="font-semibold">No Pending Follow-ups</p>
          <p className="text-[10px] text-gray-400 mt-1">Time to generate and nurture new sales leads.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-left">
          {callbacks.map((item) => (
            <div
              key={item.leadId}
              className={`p-3 rounded-xl border flex flex-col justify-between gap-3.5 transition-all duration-200 ${
                item.isUrgent
                  ? "bg-rose-50/70 border-rose-200 shadow-xs animate-pulse hover:border-rose-400"
                  : "bg-white border-[#D8D8D8] hover:border-[#60605B] shadow-2xs"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold text-[#2F2F2F] truncate max-w-[130px]">{item.company}</p>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                    item.isUrgent ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {item.isUrgent ? <AlertTriangle size={9} /> : <Phone size={9} />}
                    <span>{item.isOverdue ? "Overdue" : "Scheduled"}</span>
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono font-medium truncate">Client: {item.name}</p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-[11px]">
                <div className="flex items-center gap-1 font-mono font-bold text-[#4E4E49]">
                  <Clock size={11} className={item.isUrgent ? "text-rose-500" : "text-gray-400"} />
                  <span>{item.timeString}</span>
                </div>
                
                <button
                  onClick={() => onOpenLead(item.leadId)}
                  className="p-1 rounded-md bg-gray-50 border border-gray-100 text-[#4E4E49] hover:bg-gray-100 cursor-pointer"
                  title="Open client file"
                >
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
