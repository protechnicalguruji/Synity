/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Phone, Handshake, MessageSquare, Trophy, ShieldAlert, Sparkles } from "lucide-react";
import { Card } from "../ui/Card";
import { Lead, Task, ActivityLog } from "../../types";

interface WeeklyProgressProps {
  leads: Lead[];
  tasks: Task[];
  activities: ActivityLog[];
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ leads, tasks, activities }) => {
  // Compute reactive metrics for the active week
  const wonLeadsCount = leads.filter((l) => l.status === "CLOSED_WON").length;
  const lostLeadsCount = leads.filter((l) => l.status === "CLOSED_LOST").length;
  const totalClosedCount = wonLeadsCount + lostLeadsCount;
  
  // Real-time conversion rate
  const conversionRate = totalClosedCount > 0 
    ? Math.round((wonLeadsCount / totalClosedCount) * 100) 
    : 24; // Baseline default 24%

  // Compute other completed touchpoints this week
  const completedCallsCount = 18 + activities.filter((a) => a.type === "CALL").length;
  const completedMeetingsCount = 4 + activities.filter((a) => a.type === "MEETING").length;
  const completedFollowupsCount = 12 + tasks.filter((t) => t.status === "DONE" && t.title.toLowerCase().includes("follow")).length;

  const metrics = [
    {
      id: "wp-calls",
      title: "Calls Completed",
      value: completedCallsCount,
      target: 30,
      icon: <Phone size={14} className="text-blue-600" />,
      color: "bg-blue-500",
      bgColor: "bg-blue-100/50"
    },
    {
      id: "wp-meetings",
      title: "Meetings Done",
      value: completedMeetingsCount,
      target: 8,
      icon: <Handshake size={14} className="text-amber-600" />,
      color: "bg-amber-500",
      bgColor: "bg-amber-100/50"
    },
    {
      id: "wp-followups",
      title: "Follow Ups Made",
      value: completedFollowupsCount,
      target: 20,
      icon: <MessageSquare size={14} className="text-purple-600" />,
      color: "bg-purple-500",
      bgColor: "bg-purple-100/50"
    },
    {
      id: "wp-closed",
      title: "Deals Closed",
      value: wonLeadsCount,
      target: 5,
      icon: <Trophy size={14} className="text-emerald-600" />,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-100/50"
    }
  ];

  return (
    <Card
      id="weekly-progress-widget"
      title={
        <div className="flex items-center gap-1.5">
          <Sparkles size={15} className="text-[#8CB9D7]" />
          <span className="font-display font-bold text-[#2F2F2F]">Weekly Operational Velocity</span>
        </div>
      }
      description="Track outbound call volumes, demos conducted, and closing success against weekly organizational targets."
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mt-2 text-left">
        {/* Metric Progress Bars */}
        <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((item) => {
            const percentage = Math.min(100, Math.round((item.value / item.target) * 100));
            return (
              <div key={item.id} className="p-3.5 border border-[#D8D8D8] rounded-xl space-y-3 bg-white hover:border-[#60605B] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${item.bgColor}`}>{item.icon}</div>
                    <span className="text-xs font-bold text-[#2F2F2F]">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-extrabold text-gray-500">
                    {item.value} / {item.target}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-gray-400">
                    <span>Target Completed</span>
                    <span>{percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing Conversion Rate Card */}
        <div className="md:col-span-1 p-4 bg-emerald-50/65 border border-emerald-200 rounded-xl flex flex-col justify-between items-center text-center">
          <div className="p-2.5 rounded-full bg-emerald-100 text-emerald-700">
            <Trophy size={18} />
          </div>
          <div className="space-y-0.5 my-2">
            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Conversion Rate</p>
            <p className="text-3xl font-extrabold font-display text-emerald-950 tracking-tight">{conversionRate}%</p>
          </div>
          <span className="text-[9px] font-mono font-bold text-emerald-600/85 bg-white/60 px-1.5 py-0.5 rounded border border-emerald-200">
            +4.2% from last week
          </span>
        </div>
      </div>
    </Card>
  );
};
