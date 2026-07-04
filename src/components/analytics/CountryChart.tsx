/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CountryStats } from "../../types/analytics";
import { formatCurrency } from "../../utils";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface CountryChartProps {
  data: CountryStats[];
}

export const CountryChart: React.FC<CountryChartProps> = ({ data }) => {
  const topCountries = data.slice(0, 5);
  
  const colors = ["#1E3A8A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"];

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            Geographic Pipeline Volume
          </h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase">
            Global customer split by realized won-value
          </p>
        </div>
        <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-100">
          Global Markets
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-6 h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topCountries}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="revenue"
                nameKey="country"
              >
                {topCountries.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
                contentStyle={{
                  background: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #D8D8D8",
                  fontSize: "11px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Legend */}
        <div className="md:col-span-6 space-y-2">
          {topCountries.map((item, idx) => (
            <div key={item.country} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-md shrink-0"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
                <span className="font-bold text-gray-700 truncate max-w-[120px]">
                  {item.country}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-gray-400">{item.leads} leads</span>
                <span className="text-blue-700 font-extrabold">{item.conversionRate}%</span>
                <span className="text-[#2F2F2F] font-black">{formatCurrency(item.revenue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryChart;
