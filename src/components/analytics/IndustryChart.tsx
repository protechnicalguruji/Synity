/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { IndustryStats } from "../../types/analytics";
import { formatCurrency } from "../../utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface IndustryChartProps {
  data: IndustryStats[];
}

export const IndustryChart: React.FC<IndustryChartProps> = ({ data }) => {
  // Take top 5 industries
  const topFive = data.slice(0, 5);

  const colors = ["#4C1D95", "#5B21B6", "#6D28D9", "#7C3AED", "#8B5CF6"];

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            Industry Velocity & Close Yield
          </h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase">
            Aggregated revenue contract volume by vertical market
          </p>
        </div>
        <span className="text-[10px] font-mono bg-[#E0F2FE] text-sky-700 px-2 py-0.5 rounded-full font-bold">
          B2B Segment Yields
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topFive}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <XAxis
                type="number"
                stroke="#666666"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`}
              />
              <YAxis
                dataKey="industry"
                type="category"
                stroke="#666666"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                contentStyle={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #D8D8D8",
                  fontSize: "11px"
                }}
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={16}>
                {topFive.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed breakdown sidebar */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-2">
          <div className="border border-[#EBEBEB] rounded-xl overflow-hidden divide-y divide-[#EBEBEB]">
            {topFive.map((ind, idx) => (
              <div
                key={ind.industry}
                className="flex items-center justify-between p-2 hover:bg-gray-50/50 transition-colors text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <span className="font-bold text-gray-700 truncate max-w-[110px]">
                    {ind.industry}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-gray-500">{ind.leadCount} leads</span>
                  <span className="text-emerald-700 font-extrabold">{ind.conversionRate}% CR</span>
                  <span className="text-gray-800 font-bold">{formatCurrency(ind.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryChart;
