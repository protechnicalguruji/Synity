/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Sparkles,
  Award,
  Globe,
  RefreshCcw,
  Zap
} from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Lead, LeadStatus } from "../../types";
import { formatCurrency } from "../../utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface AnalyticsDashboardProps {
  leads: Lead[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ leads }) => {
  // Calculations
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === LeadStatus.CLOSED_WON);
  const lostLeads = leads.filter((l) => l.status === LeadStatus.CLOSED_LOST);
  const activeLeads = leads.filter(
    (l) => l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST
  );

  const totalWonValue = wonLeads.reduce((sum, l) => sum + l.value, 0);
  const totalActiveValue = activeLeads.reduce((sum, l) => sum + l.value, 0);

  // Conversion rate: Won / (Won + Lost)
  const closedCount = wonLeads.length + lostLeads.length;
  const conversionRate = closedCount > 0 ? Math.round((wonLeads.length / closedCount) * 100) : 0;

  // Avg deal size for won accounts
  const avgDealSize = wonLeads.length > 0 ? Math.round(totalWonValue / wonLeads.length) : 0;

  // Source Distribution Metrics
  const sourcePerformance = Array.from(new Set(leads.map((l) => l.source))).map((source) => {
    const sourceLeads = leads.filter((l) => l.source === source);
    const sourceTotalValue = sourceLeads.reduce((sum, l) => sum + l.value, 0);
    const wonCount = sourceLeads.filter((l) => l.status === LeadStatus.CLOSED_WON).length;
    
    return {
      name: source,
      leadsCount: sourceLeads.length,
      totalValue: sourceTotalValue,
      wonCount,
    };
  });

  // Recharts Status Breakdown Data
  const statusData = [
    { name: "New Leads", value: leads.filter((l) => l.status === LeadStatus.NEW).length, color: "#8CB9D7" },
    { name: "Called", value: leads.filter((l) => l.status === LeadStatus.CALLED).length, color: "#60605B" },
    { name: "Interested", value: leads.filter((l) => l.status === LeadStatus.INTERESTED).length, color: "#4E4E49" },
    { name: "Proposal/Negotiation", value: leads.filter((l) => l.status === LeadStatus.PROPOSAL || l.status === LeadStatus.NEGOTIATION).length, color: "#2F2F2F" },
    { name: "Closed Won", value: wonLeads.length, color: "#219653" },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="text-left space-y-0.5">
        <h2 className="text-xl font-bold font-display text-[#2F2F2F] tracking-tight">Sales Analytics & ROI Dashboard</h2>
        <p className="text-xs text-[#666666]">Review conversion analytics, lead capture yields, and close-rate optimization metrics.</p>
      </div>

      {/* Grid: Extended Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <Card className="py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <Award size={18} />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider">Historical Conversion Rate</span>
              <p className="text-xl font-bold font-display text-[#2F2F2F] mt-0.5">{conversionRate}% Won</p>
            </div>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <TrendingUp size={18} />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider">Average Won Deal Size</span>
              <p className="text-xl font-bold font-display text-[#2F2F2F] mt-0.5">{formatCurrency(avgDealSize)}</p>
            </div>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#8CB9D7]/10 text-[#3b7194] rounded-xl">
              <Zap size={18} />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider">Outbound Velocity index</span>
              <p className="text-xl font-bold font-display text-[#2F2F2F] mt-0.5">High Efficiency</p>
            </div>
          </div>
        </Card>

      </div>

      {/* Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Deal Value by Source BarChart */}
        <Card
          title="Lead Pipeline Value by Acquisition Source"
          description="Aggregate contract worth segmented across outreach campaigns."
        >
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourcePerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#666666" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#666666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Total Value"]}
                  contentStyle={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #D8D8D8", fontSize: "11px" }}
                />
                <Bar dataKey="totalValue" fill="#4E4E49" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution PieChart */}
        <Card
          title="Active Deal Phase Allocation"
          description="Allocation of active opportunities inside pipeline stages."
        >
          <div className="h-[250px] w-full mt-4 flex items-center justify-center">
            {statusData.length === 0 ? (
              <p className="text-xs text-gray-400">No active deal segments found.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: "11px" }} />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "10px", fontFamily: "sans-serif" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

      </div>

      {/* Channel Yield Metrics Table */}
      <Card
        title="Channel Yield and Performance Metrics"
        description="Detailed performance index metrics segmented across LinkedIn, inbound registrations, and direct cold outreach."
      >
        <div className="border border-[#D8D8D8] rounded-xl overflow-hidden mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#D8D8D8] text-xs font-bold text-[#666666] uppercase tracking-wider">
                <th className="py-3 px-6">Source Channel</th>
                <th className="py-3 px-6">Leads Registered</th>
                <th className="py-3 px-6">Gross Contract Value</th>
                <th className="py-3 px-6">Closed Won Deals</th>
                <th className="py-3 px-6 text-right">Yield Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D8D8] text-xs">
              {sourcePerformance.map((src, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-[#2F2F2F] flex items-center gap-1.5">
                    <Globe size={12} className="text-gray-400" />
                    {src.name}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-gray-500">{src.leadsCount}</td>
                  <td className="py-3.5 px-6 font-semibold font-mono text-[#2F2F2F]">{formatCurrency(src.totalValue)}</td>
                  <td className="py-3.5 px-6">
                    <Badge variant={src.wonCount > 0 ? "success" : "neutral"} size="sm">
                      {src.wonCount} won
                    </Badge>
                  </td>
                  <td className="py-3.5 px-6 text-right font-semibold text-emerald-600">
                    {src.totalValue > 50000 ? "High Yield 🔥" : "Medium Yield"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
