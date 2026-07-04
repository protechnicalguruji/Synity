/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FunnelStageData } from "../../types/analytics";
import { ArrowDown, HelpCircle } from "lucide-react";

interface FunnelChartProps {
  data: FunnelStageData[];
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  // Let's find the max count to scale the visual bars relatively
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            Sales Funnel Velocity Index
          </h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase">
            Conversion & drop-off metrics per lifecycle stage
          </p>
        </div>
        <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
          SLA Waterfall Map
        </span>
      </div>

      <div className="space-y-2.5">
        {data.map((stage, idx) => {
          const percentageWidth = Math.max(5, Math.min(100, (stage.count / maxCount) * 100));
          
          // Color coding stages to represent progression
          let barColor = "bg-purple-600";
          if (stage.stage.includes("CLOSED_WON")) barColor = "bg-emerald-600";
          else if (stage.stage.includes("CLOSED_LOST")) barColor = "bg-rose-600";
          else if (idx < 2) barColor = "bg-indigo-400";
          else if (idx < 5) barColor = "bg-indigo-600";
          else barColor = "bg-purple-700";

          return (
            <div key={stage.stage} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-[#2F2F2F] gap-2">
                <span className="truncate">{stage.label}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-gray-500 font-bold">{stage.count} deals</span>
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md font-extrabold">
                    {stage.conversionRate}% conv.
                  </span>
                  {idx > 0 && stage.dropOffRate > 0 && (
                    <span className="text-[10px] font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md font-bold">
                      -{stage.dropOffRate}% drop
                    </span>
                  )}
                </div>
              </div>

              {/* Bar line */}
              <div className="w-full h-5 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center relative">
                <div
                  className={`h-full ${barColor} opacity-90 transition-all duration-500 rounded-r-md`}
                  style={{ width: `${percentageWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunnelChart;
