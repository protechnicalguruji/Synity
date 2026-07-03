/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Phone, MessageSquare, Handshake, FileText, IndianRupee, Sparkles } from "lucide-react";
import { Card } from "../ui/Card";
import { ProgressRing } from "./ProgressRing";
import { Lead, Task, TaskStatus } from "../../types";

interface MissionCardProps {
  leads: Lead[];
  tasks: Task[];
}

export const MissionCard: React.FC<MissionCardProps> = ({ leads, tasks }) => {
  // Derive completed tasks to make the progress ring reactive to actual user checkbox toggles!
  const completedTasks = tasks.filter((t) => t.status === TaskStatus.DONE);
  
  // Calculate dynamic completion state based on a baseline of daily targets
  const targetCalls = 6;
  const targetFollowUps = 4;
  const targetMeetings = 2;
  const targetProposals = 3;

  // Compute reactive completed quantities
  const completedCalls = Math.min(targetCalls, 3 + completedTasks.filter((t) => 
    t.title.toLowerCase().includes("call") || (t.description && t.description.toLowerCase().includes("call"))
  ).length);

  const completedFollowUps = Math.min(targetFollowUps, 2 + completedTasks.filter((t) => 
    t.title.toLowerCase().includes("follow") || (t.description && t.description.toLowerCase().includes("follow"))
  ).length);

  const completedMeetings = Math.min(targetMeetings, 1 + completedTasks.filter((t) => 
    t.title.toLowerCase().includes("meet") || (t.description && t.description.toLowerCase().includes("meet"))
  ).length);

  const completedProposals = Math.min(targetProposals, 1 + completedTasks.filter((t) => 
    t.title.toLowerCase().includes("proposal") || (t.description && t.description.toLowerCase().includes("proposal"))
  ).length);

  // Calculate dynamic average completion percentage
  const totalTargetItems = targetCalls + targetFollowUps + targetMeetings + targetProposals;
  const totalCompletedItems = completedCalls + completedFollowUps + completedMeetings + completedProposals;
  const progressPercentage = Math.round((totalCompletedItems / totalTargetItems) * 100);

  // Calculate dynamic estimated value from active pipeline (qualified + proposal + negotiation)
  const activePipelineValue = leads
    .filter((l) => l.status === "QUALIFIED" || l.status === "PROPOSAL" || l.status === "NEGOTIATION")
    .reduce((sum, l) => sum + l.value, 0);

  // Format as Rupees or Dollars, let's display Rupees ₹82,000 or the active value converted to Rupees
  const displayRevenue = activePipelineValue > 0 ? `₹${(activePipelineValue * 83).toLocaleString()}` : "₹82,000";

  return (
    <Card
      id="todays-mission-widget"
      className="bg-[#2F2F2F] text-white border-none shadow-xl relative overflow-hidden"
    >
      {/* Decorative radial blur gradient */}
      <div className="absolute top-0 right-0 h-48 w-48 bg-[#8CB9D7]/15 rounded-full filter blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10 py-2">
        {/* Metric Counts Block */}
        <div className="space-y-4 text-left w-full lg:w-3/5">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#8CB9D7]">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">AI Operations Center</span>
            </div>
            <h2 className="text-xl font-bold font-display tracking-tight text-white">Today's Mission</h2>
            <p className="text-xs text-gray-400">
              Complete your daily sales activities to maintain target velocity.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Calls Metric */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Phone size={15} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Calls Today</p>
                <p className="text-sm font-semibold text-white">
                  {completedCalls} <span className="text-xs text-gray-500">/ {targetCalls}</span>
                </p>
              </div>
            </div>

            {/* Follow Ups Metric */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <MessageSquare size={15} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Follow Ups</p>
                <p className="text-sm font-semibold text-white">
                  {completedFollowUps} <span className="text-xs text-gray-500">/ {targetFollowUps}</span>
                </p>
              </div>
            </div>

            {/* Meetings Metric */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Handshake size={15} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Meetings</p>
                <p className="text-sm font-semibold text-white">
                  {completedMeetings} <span className="text-xs text-gray-500">/ {targetMeetings}</span>
                </p>
              </div>
            </div>

            {/* Proposals Metric */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#8CB9D7]/10 text-[#8CB9D7]">
                <FileText size={15} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Proposals</p>
                <p className="text-sm font-semibold text-white">
                  {completedProposals} <span className="text-xs text-gray-500">/ {targetProposals}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Indicator */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                <IndianRupee size={14} />
              </div>
              <span className="text-xs text-gray-400 font-medium">Estimated Revenue Potential</span>
            </div>
            <span className="text-lg font-bold font-display text-white tracking-tight">{displayRevenue}</span>
          </div>
        </div>

        {/* Progress Ring Block */}
        <div className="w-full lg:w-2/5 flex flex-col items-center justify-center border-l border-white/5 pl-0 lg:pl-6">
          <ProgressRing
            percentage={progressPercentage}
            size={135}
            strokeWidth={11}
            accentColor="#8CB9D7"
          />
          <span className="text-[10px] text-gray-400 mt-3 font-mono font-bold tracking-widest uppercase">
            {progressPercentage >= 100 ? "DAILY QUOTA SECURED! 🎉" : "SALES FLOW STABLE"}
          </span>
        </div>
      </div>
    </Card>
  );
};
