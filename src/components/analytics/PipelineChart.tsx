/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PipelineRevenueData } from "../../types/analytics";
import { formatCurrency } from "../../utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface PipelineChartProps {
  data: PipelineRevenueData;
}

export const PipelineChart: React.FC<PipelineChartProps> = ({ data }) => {
  const chartData = [
    { name: "Active Pipeline", value: data.pipeline, color: "#8E44AD" },
    { name: "Expected weighted", value: data.expected, color: "#2980B9" },
    { name: "Closed Won", value: data.closed, color: "#27AE60" },
    { name: "Closed Lost", value: data.lost, color: "#C0392B" },
    { name: "Pipeline At Risk", value: data.atRisk, color: "#D35400" }
  ];

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div>
        <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
          Pipeline Revenue Allocation
        </h3>
        <p className="text-[10px] text-gray-400 font-semibold uppercase">
          Comparison of core financial categories
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#666666"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={5}
            />
            <YAxis
              stroke="#666666"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), "Value"]}
              contentStyle={{
                background: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid #D8D8D8",
                fontSize: "11px",
                fontFamily: "sans-serif"
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2 border-t border-[#EBEBEB]">
        {chartData.map((item) => (
          <div key={item.name} className="space-y-0.5">
            <span className="text-[9px] text-gray-400 font-bold uppercase truncate block">
              {item.name}
            </span>
            <span className="text-xs font-mono font-bold text-[#2F2F2F] block">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineChart;
