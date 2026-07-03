/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { DollarSign, Phone, Handshake, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { Card } from "../ui/Card";
import { Lead, Task, ActivityLog } from "../../types";

interface MonthlyStatsProps {
  leads: Lead[];
  tasks: Task[];
  activities: ActivityLog[];
}

export const MonthlyStats: React.FC<MonthlyStatsProps> = ({ leads, tasks, activities }) => {
  // Calculate won revenue dynamically, baseline $182,500
  const actualWonRevenue = leads
    .filter((l) => l.status === "CLOSED_WON")
    .reduce((sum, l) => sum + l.value, 0);
  const displayRevenue = actualWonRevenue > 0 ? actualWonRevenue : 182500;

  // Closed and lost deals
  const closedDealsCount = leads.filter((l) => l.status === "CLOSED_WON").length || 3;
  const lostDealsCount = leads.filter((l) => l.status === "CLOSED_LOST").length || 1;

  // Outreach volumes
  const monthlyCalls = 145 + activities.filter((a) => a.type === "CALL").length;
  const monthlyMeetings = 32 + activities.filter((a) => a.type === "MEETING").length;

  const stats = [
    {
      id: "ms-revenue",
      title: "Monthly Closed Revenue",
      value: `$${displayRevenue.toLocaleString()}`,
      badge: "100% of Quota",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <DollarSign size={16} className="text-emerald-600" />,
      bgColor: "bg-emerald-50/40"
    },
    {
      id: "ms-calls",
      title: "Monthly Outbound Calls",
      value: monthlyCalls.toString(),
      badge: "+15% vs Goal",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <Phone size={16} className="text-blue-600" />,
      bgColor: "bg-blue-50/40"
    },
    {
      id: "ms-meetings",
      title: "Client Meetings Logged",
      value: monthlyMeetings.toString(),
      badge: "88% Attendance",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Handshake size={16} className="text-amber-600" />,
      bgColor: "bg-amber-50/40"
    },
    {
      id: "ms-closed",
      title: "Contracts Won",
      value: closedDealsCount.toString(),
      badge: "4 Active Pilots",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      icon: <CheckCircle size={16} className="text-purple-600" />,
      bgColor: "bg-purple-50/40"
    },
    {
      id: "ms-lost",
      title: "Contracts Lost",
      value: lostDealsCount.toString(),
      badge: "6.2% Loss Rate",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <XCircle size={16} className="text-rose-600" />,
      bgColor: "bg-rose-50/40"
    },
    {
      id: "ms-response",
      title: "Average Response Time",
      value: "14.2 mins",
      badge: "Grade A SLA",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      icon: <Clock size={16} className="text-teal-600" />,
      bgColor: "bg-teal-50/40"
    }
  ];

  return (
    <Card
      id="monthly-performance-widget"
      title={
        <div className="flex items-center gap-1.5">
          <TrendingUp size={16} className="text-[#4E4E49]" />
          <span className="font-display font-bold text-[#2F2F2F]">Monthly Enterprise Performance</span>
        </div>
      }
      description="A secure overview of organizational closed revenue, pipeline touchpoint statistics, and SLA response latency."
    >
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 mt-2 text-left">
        {stats.map((item) => (
          <div
            key={item.id}
            className="p-4 border border-[#D8D8D8] hover:border-[#60605B] rounded-xl flex flex-col justify-between gap-4 transition-all duration-200 bg-white shadow-2xs"
          >
            {/* Metric icon header */}
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${item.bgColor} border border-gray-100`}>
                {item.icon}
              </div>
            </div>

            {/* Value display */}
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider line-clamp-1">{item.title}</p>
              <h3 className="text-lg font-extrabold font-display text-[#2F2F2F] tracking-tight">{item.value}</h3>
            </div>

            {/* Quality status badge */}
            <span className={`inline-block w-fit text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
