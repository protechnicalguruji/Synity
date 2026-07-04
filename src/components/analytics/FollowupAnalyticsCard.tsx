/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FollowupStats } from "../../types/analytics";
import { Clock, CheckCircle2, AlertTriangle, Star } from "lucide-react";

interface FollowupAnalyticsCardProps {
  stats: FollowupStats;
}

export const FollowupAnalyticsCard: React.FC<FollowupAnalyticsCardProps> = ({ stats }) => {
  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-purple-700" />
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            Follow-up SLA Engagement
          </h3>
        </div>
        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase">
          SLA Metrics
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#FAF9FC] border border-[#EBEBEB] rounded-xl p-3 space-y-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block">Follow-ups Due</span>
          <span className="text-lg font-mono font-black text-amber-700">{stats.due}</span>
          <span className="text-[8px] text-gray-400 font-bold uppercase block">Pending Action</span>
        </div>

        <div className="bg-[#FAF9FC] border border-[#EBEBEB] rounded-xl p-3 space-y-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block">Completed SLA</span>
          <span className="text-lg font-mono font-black text-emerald-700">{stats.completed}</span>
          <span className="text-[8px] text-gray-400 font-bold uppercase block">Outreach Cycles</span>
        </div>

        <div className="bg-[#FAF9FC] border border-[#EBEBEB] rounded-xl p-3 space-y-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block">Missed / Overdue</span>
          <span className="text-lg font-mono font-black text-rose-700">{stats.missed}</span>
          <span className="text-[8px] text-gray-400 font-bold uppercase block">Breached Hours</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#EBEBEB]">
        <div className="flex items-start gap-2 bg-[#FAF9FC] border border-[#EBEBEB] p-2.5 rounded-xl">
          <Clock size={14} className="text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[9px] text-gray-400 font-bold uppercase">Average Delay</span>
            <p className="text-xs font-mono font-black text-[#2F2F2F]">{stats.avgDelayHours} hours</p>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-purple-50 border border-purple-100 p-2.5 rounded-xl">
          <Star size={14} className="text-purple-600 fill-purple-200 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[9px] text-purple-600 font-bold uppercase">Best Performing Step</span>
            <p className="text-xs font-black text-purple-800 uppercase tracking-tight">
              {stats.bestPerformingNumber}rd Follow-up call
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowupAnalyticsCard;
