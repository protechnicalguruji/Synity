/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ProductivityStats } from "../../types/analytics";
import { Zap, Sparkles, Award, Flame, CheckSquare } from "lucide-react";

interface ProductivityCardProps {
  stats: ProductivityStats;
}

export const ProductivityCard: React.FC<ProductivityCardProps> = ({ stats }) => {
  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-amber-500 fill-amber-500 animate-bounce" />
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            Personal Outreach Streak Console
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-100">
          Streak Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Flame Banner */}
        <div className="md:col-span-5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white text-center space-y-1 shadow-sm">
          <Flame size={32} className="mx-auto text-amber-200 fill-amber-200" />
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-extrabold tracking-wider opacity-85">Daily Streak</span>
            <p className="text-3xl font-black font-display tracking-tight leading-none">
              {stats.dailyStreak} Days
            </p>
            <span className="text-[9px] font-bold block opacity-75">
              Longest: {stats.longestStreak} Days
            </span>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#FAF9FC] border border-[#EBEBEB] rounded-xl p-3 text-center space-y-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block">Calls/Day</span>
            <span className="text-lg font-mono font-black text-purple-700">{stats.callsPerDay}</span>
            <span className="text-[8px] text-gray-400 font-bold uppercase block">Avg Outbound</span>
          </div>

          <div className="bg-[#FAF9FC] border border-[#EBEBEB] rounded-xl p-3 text-center space-y-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block">Meetings/Week</span>
            <span className="text-lg font-mono font-black text-blue-700">{stats.meetingsPerWeek}</span>
            <span className="text-[8px] text-gray-400 font-bold uppercase block">Completed Sessions</span>
          </div>

          <div className="bg-[#FAF9FC] border border-[#EBEBEB] rounded-xl p-3 text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <CheckSquare size={10} className="text-emerald-600" />
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block">Tasks Closed</span>
            </div>
            <span className="text-lg font-mono font-black text-emerald-700">{stats.tasksCompleted}</span>
            <span className="text-[8px] text-gray-400 font-bold uppercase block">Action Items</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityCard;
