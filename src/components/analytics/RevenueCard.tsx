/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { formatCurrency } from "../../utils";
import { DollarSign, ShieldAlert, TrendingUp, AlertTriangle } from "lucide-react";

interface RevenueCardProps {
  closedRevenue: number;
  pipelineRevenue: number;
  expectedRevenue: number;
  atRiskRevenue: number;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({
  closedRevenue,
  pipelineRevenue,
  expectedRevenue,
  atRiskRevenue
}) => {
  const totalPool = closedRevenue + pipelineRevenue;
  const closedPercent = totalPool > 0 ? Math.round((closedRevenue / totalPool) * 100) : 0;
  const pipePercent = totalPool > 0 ? Math.round((pipelineRevenue / totalPool) * 100) : 0;

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold text-[#2F2F2F] tracking-tight uppercase">
          Dynamic Pipeline Liquidity
        </h3>
        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full uppercase border border-purple-100">
          Financial Pool
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1 bg-[#FAF9FC] border border-[#EBEBEB] p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[10px] uppercase">
            <TrendingUp size={12} />
            <span>Revenue Closed</span>
          </div>
          <p className="text-xl font-bold font-display text-emerald-700">
            {formatCurrency(closedRevenue)}
          </p>
          <span className="text-[10px] text-gray-500 font-medium">Actual realized booking yield</span>
        </div>

        <div className="space-y-1 bg-[#FAF9FC] border border-[#EBEBEB] p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[10px] uppercase">
            <DollarSign size={12} />
            <span>Active Pipeline</span>
          </div>
          <p className="text-xl font-bold font-display text-purple-700">
            {formatCurrency(pipelineRevenue)}
          </p>
          <span className="text-[10px] text-gray-500 font-medium">In-flight opportunities pool</span>
        </div>
      </div>

      {/* Bar Gauge */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase">
          <span>Won Booking: {closedPercent}%</span>
          <span>Pipeline: {pipePercent}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${closedPercent}%` }}
            title={`Closed Won: ${closedPercent}%`}
          />
          <div
            className="h-full bg-purple-500 transition-all duration-500"
            style={{ width: `${pipePercent}%` }}
            title={`Active Pipeline: ${pipePercent}%`}
          />
        </div>
      </div>

      {/* At risk and Weighted Expected value summary */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#EBEBEB] text-[10px] font-bold uppercase">
        <div className="flex items-start gap-1.5 text-amber-600 bg-amber-50/50 p-2 border border-amber-100 rounded-lg">
          <AlertTriangle size={12} className="shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-gray-400 font-medium block">Revenue At Risk</span>
            <span className="text-xs font-bold text-amber-700">{formatCurrency(atRiskRevenue)}</span>
          </div>
        </div>

        <div className="flex items-start gap-1.5 text-blue-600 bg-blue-50/50 p-2 border border-blue-100 rounded-lg">
          <ShieldAlert size={12} className="shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-gray-400 font-medium block">Weighted Expected</span>
            <span className="text-xs font-bold text-blue-700">{formatCurrency(expectedRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
