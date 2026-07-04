/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TimeStats } from "../../types/analytics";
import { LeadStatus } from "../../types";
import { Clock, Hourglass, Zap, ZapOff } from "lucide-react";

interface TimeAnalyticsCardProps {
  stats: TimeStats;
}

export const TimeAnalyticsCard: React.FC<TimeAnalyticsCardProps> = ({ stats }) => {
  const timeMetrics = [
    {
      label: "Average Contact Response",
      value: `${stats.avgResponseTimeMin}m`,
      desc: "Lead creation to first outbound contact call",
      iconBg: "bg-emerald-50 text-emerald-700",
      textColor: "text-emerald-700"
    },
    {
      label: "SLA Follow-up Delay",
      value: `${stats.avgFollowupDelayHours}h`,
      desc: "Median timing between subsequent outreach cycles",
      iconBg: "bg-blue-50 text-blue-700",
      textColor: "text-blue-700"
    },
    {
      label: "Average Conversion Cycle",
      value: `${stats.avgSalesCycleDays} days`,
      desc: "Creation milestone to Closed Won signature",
      iconBg: "bg-purple-50 text-purple-700",
      textColor: "text-purple-700"
    }
  ];

  const stagesOrdered = [
    { stage: LeadStatus.NEW, label: "New" },
    { stage: LeadStatus.CALLED, label: "Called" },
    { stage: LeadStatus.INTERESTED, label: "Interested" },
    { stage: LeadStatus.FOLLOW_UP, label: "Follow Up" },
    { stage: LeadStatus.MEETING, label: "Meeting Scheduled" },
    { stage: LeadStatus.PROPOSAL, label: "Proposal Sent" },
    { stage: LeadStatus.NEGOTIATION, label: "Negotiation" }
  ];

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-purple-700" />
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            Pipeline Velocity & Delay SLA
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
          Speed Indicators
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {timeMetrics.map((m) => (
          <div key={m.label} className="bg-[#FAF9FC] border border-[#EBEBEB] rounded-xl p-3 space-y-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block">{m.label}</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-lg font-black font-mono ${m.textColor}`}>{m.value}</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase">SLA Target</span>
            </div>
            <p className="text-[9px] text-gray-400 font-medium leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Stage times */}
      <div className="space-y-2 pt-2 border-t border-[#EBEBEB]">
        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
          Average Days Retained Per Stage
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {stagesOrdered.map((stg) => {
            const days = stats.avgTimePerStageDays[stg.stage] || 1;
            return (
              <div key={stg.stage} className="bg-[#FAF9FC] border border-[#EBEBEB] rounded-lg p-2 text-center space-y-1">
                <span className="text-[9px] font-bold text-gray-700 truncate block uppercase">{stg.label}</span>
                <span className="text-xs font-mono font-black text-[#2F2F2F] block">
                  {days}d
                </span>
                <div className="w-full h-1 bg-purple-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${Math.min(100, days * 15)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeAnalyticsCard;
