/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Trophy, AlertTriangle, ListTodo, Calendar, TrendingUp } from "lucide-react";
import { AIDailySummaryResult } from "../../lib/ai/types";
import { Card } from "../ui/Card";

interface AISummaryProps {
  summary?: AIDailySummaryResult | null;
  loading?: boolean;
}

export const AISummary: React.FC<AISummaryProps> = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse" id="summary-skeleton">
        <div className="h-44 bg-gray-200 rounded-xl"></div>
        <div className="h-44 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const { wins, risks, priorities, tomorrowSuggestions, summaryParagraph, generatedAt } = summary;

  return (
    <div className="space-y-4" id="ai-daily-summary-container">
      {/* Overview Card */}
      <Card
        id="ai-daily-overview-card"
        className="p-5 border-l-4 border-l-[#8CB9D7] bg-gradient-to-tr from-[#E5E3E7]/25 to-[#8CB9D7]/5 border-gray-100"
      >
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#8CB9D7]/20 text-[#3b7194] rounded-lg">
              <Sparkles size={14} className="animate-pulse" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Synity AI Daily Workday Briefing
            </h4>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            Calibrated: {new Date(generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed mt-3 font-medium">
          {summaryParagraph}
        </p>
      </Card>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Wins */}
        <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-xl p-4.5 space-y-3 text-left">
          <h5 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy size={14} className="text-emerald-500" />
            Today's Wins & Momentum
          </h5>
          <ul className="space-y-2 text-xs text-gray-600">
            {wins.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0 font-bold select-none">✓</span>
                <span className="leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Today's Risks */}
        <div className="bg-red-50/15 border border-red-100/40 rounded-xl p-4.5 space-y-3 text-left">
          <h5 className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-red-500" />
            Risk & Friction Indicators
          </h5>
          <ul className="space-y-2 text-xs text-gray-600">
            {risks.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0 select-none">!</span>
                <span className="leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Today's Priorities */}
        <div className="bg-indigo-50/15 border border-indigo-100/40 rounded-xl p-4.5 space-y-3 text-left">
          <h5 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
            <ListTodo size={14} className="text-indigo-500" />
            High Focus Priorities
          </h5>
          <ul className="space-y-2 text-xs text-gray-600">
            {priorities.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-400 shrink-0 select-none">•</span>
                <span className="leading-relaxed font-semibold text-gray-700">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tomorrow's Suggestions */}
        <div className="bg-purple-50/15 border border-purple-100/40 rounded-xl p-4.5 space-y-3 text-left">
          <h5 className="text-[11px] font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={14} className="text-purple-500" />
            Tomorrow's Suggested Track
          </h5>
          <ul className="space-y-2 text-xs text-gray-600">
            {tomorrowSuggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-purple-400 shrink-0 font-bold select-none">→</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
