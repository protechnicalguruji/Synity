/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { LossStats } from "../../types/analytics";
import { formatCurrency } from "../../utils";
import { Trash2, AlertTriangle, ArrowRight, Skull } from "lucide-react";

interface LossAnalyticsCardProps {
  stats: LossStats;
}

export const LossAnalyticsCard: React.FC<LossAnalyticsCardProps> = ({ stats }) => {
  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trash2 size={16} className="text-rose-600" />
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            Loss Reason Analysis
          </h3>
        </div>
        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
          Churn Analysis
        </span>
      </div>

      <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 flex items-start gap-3">
        <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wide">
            Primary Revenue Leak Reason
          </span>
          <p className="text-xs font-black text-rose-800 uppercase tracking-tight">
            {stats.mostCommonReason}
          </p>
          <p className="text-[10px] text-rose-700/80 font-medium">
            Accumulated loss of <strong className="font-extrabold">{formatCurrency(stats.totalRevenueLost)}</strong> across pipeline.
          </p>
        </div>
      </div>

      <div className="space-y-2.5 pt-1">
        {stats.reasons.map((item) => (
          <div key={item.reason} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-700">{item.reason}</span>
              <div className="font-mono text-gray-500 font-bold space-x-2">
                <span>{item.count} deals lost</span>
                <span className="text-rose-600 bg-rose-50/50 px-1.5 py-0.5 rounded-md font-extrabold">
                  {item.percentage}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-50 border border-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full opacity-85 transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-gray-600 shrink-0 min-w-[50px] text-right">
                {formatCurrency(item.revenueLost)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LossAnalyticsCard;
