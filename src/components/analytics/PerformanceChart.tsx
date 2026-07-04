/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PerformanceStats } from "../../types/analytics";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface PerformanceChartProps {
  stats: PerformanceStats;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ stats }) => {
  const data = [
    { name: "Calls", target: 80, actual: stats.callsMade, type: "outbound" },
    { name: "Follow-ups", target: 60, actual: stats.followupsCompleted, type: "outbound" },
    { name: "Tasks", target: 50, actual: stats.tasksCompleted, type: "execution" },
    { name: "Proposals", target: 15, actual: stats.proposalsSent, type: "deal" },
    { name: "Meetings", target: 10, actual: stats.meetingsHeld, type: "deal" },
    { name: "Closed Won", target: 5, actual: stats.dealsClosed, type: "conversion" }
  ];

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            Sales Activity Yield index
          </h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase">
            Actual activity velocities vs recommended targets
          </p>
        </div>
        <span className="text-[10px] font-mono bg-[#FAF9FC] text-purple-700 px-2 py-0.5 border border-[#DDD3E6] rounded-full font-bold">
          Performance Map
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis dataKey="name" stroke="#666666" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#666666" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid #D8D8D8",
                fontSize: "11px"
              }}
            />
            <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }} />
            <Bar dataKey="actual" fill="#7C3AED" name="Completed Actions" radius={[4, 4, 0, 0]} barSize={25} />
            <Line type="monotone" dataKey="target" stroke="#8CB9D7" strokeWidth={2} name="Weekly Benchmark" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#EBEBEB]">
        <div className="bg-[#FAF9FC] p-2 rounded-xl">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Total Contact Actions</span>
          <span className="text-sm font-mono font-black text-purple-700">{stats.callsMade + stats.followupsCompleted}</span>
        </div>
        <div className="bg-[#FAF9FC] p-2 rounded-xl">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Meeting Yield Ratio</span>
          <span className="text-sm font-mono font-black text-indigo-700">
            {stats.callsMade > 0 ? Math.round((stats.meetingsHeld / stats.callsMade) * 100) : 0}%
          </span>
        </div>
        <div className="bg-[#FAF9FC] p-2 rounded-xl">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Proposal Win Rate</span>
          <span className="text-sm font-mono font-black text-emerald-700">
            {stats.proposalsSent > 0 ? Math.round((stats.dealsClosed / stats.proposalsSent) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
