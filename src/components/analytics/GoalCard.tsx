/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GoalProgress } from "../../types/analytics";
import { formatCurrency } from "../../utils";
import { Target, CheckCircle2, TrendingUp, Calendar } from "lucide-react";

interface GoalCardProps {
  goals: GoalProgress;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goals }) => {
  const items = [
    {
      id: "revenue",
      title: "Monthly Revenue Booking",
      target: goals.monthlyRevenue.target,
      current: goals.monthlyRevenue.current,
      format: (v: number) => formatCurrency(v),
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50"
    },
    {
      id: "calls",
      title: "Monthly Outreach Calls",
      target: goals.monthlyCalls.target,
      current: goals.monthlyCalls.current,
      format: (v: number) => `${v} calls`,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50"
    },
    {
      id: "followups",
      title: "Monthly SLA Follow-ups",
      target: goals.monthlyFollowups.target,
      current: goals.monthlyFollowups.current,
      format: (v: number) => `${v} follow-ups`,
      color: "bg-purple-500",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50"
    },
    {
      id: "meetings",
      title: "Discovery Meetings",
      target: goals.monthlyMeetings.target,
      current: goals.monthlyMeetings.current,
      format: (v: number) => `${v} sessions`,
      color: "bg-amber-500",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50"
    }
  ];

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-purple-700" />
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            Active Milestone Tracker
          </h3>
        </div>
        <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1 font-bold">
          <Calendar size={11} />
          <span>Jul 2026 Goal Pool</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const rawPercentage = Math.round((item.current / item.target) * 100);
          const percentage = Math.min(100, Math.max(0, rawPercentage));
          const isComplete = rawPercentage >= 100;

          return (
            <div
              key={item.id}
              className="border border-[#EBEBEB] rounded-xl p-3 space-y-2 relative overflow-hidden bg-[#FAF9FC]"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-tight">
                  {item.title}
                </span>
                {isComplete ? (
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                ) : (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.textColor} ${item.bgColor}`}>
                    {rawPercentage}%
                  </span>
                )}
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold font-display text-gray-900">
                  {item.format(item.current)}
                </span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase">
                  Target: {item.format(item.target)}
                </span>
              </div>

              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalCard;
