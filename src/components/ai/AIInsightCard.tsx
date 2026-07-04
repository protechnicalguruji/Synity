/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Calendar, Zap, Lightbulb, TrendingUp, Compass } from "lucide-react";
import { LeadSummaryResult } from "../../lib/ai/types";
import { Card } from "../ui/Card";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface AIInsightCardProps {
  summary?: LeadSummaryResult | null;
  loading?: boolean;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ summary, loading }) => {
  if (loading) {
    return (
      <Card className="p-5 border-gray-200 animate-pulse space-y-4" id="insight-card-skeleton">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className="p-5 text-center text-gray-400 text-xs" id="insight-card-empty">
        <Lightbulb className="mx-auto mb-2 text-gray-300" size={24} />
        No strategic intelligence parsed on this lead yet.
      </Card>
    );
  }

  const { oneLiner, keyInsights, bestTimeToCall, currentStatusBrief, estimatedCloseDate, confidence } = summary;

  return (
    <Card className="p-5 border-gray-100 space-y-4 shadow-xs" id="ai-lead-insight-card">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 flex items-center gap-1.5">
            <Compass size={12} className="text-teal-500 animate-spin" style={{ animationDuration: "12s" }} />
            Synity AI Deal Intelligence
          </span>
          <h4 className="text-sm font-bold text-[#2F2F2F]">Strategic Core Analysis</h4>
        </div>
        <ConfidenceBadge confidence={confidence} />
      </div>

      <div className="p-4 bg-gradient-to-tr from-[#E5E3E7]/15 to-[#8CB9D7]/5 border border-[#8CB9D7]/20 rounded-xl space-y-1">
        <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block tracking-wider">Opportunity Overview</span>
        <p className="text-xs text-gray-800 font-semibold leading-relaxed">
          {oneLiner}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Best Contact Hour</span>
          <p className="font-bold text-[#3b7194] flex items-center gap-1 mt-0.5">
            <Sparkles size={11} className="text-teal-500" />
            {bestTimeToCall}
          </p>
        </div>
        <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Closing Path Status</span>
          <p className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
            <TrendingUp size={11} className="text-emerald-500" />
            {currentStatusBrief}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-xs text-left">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Key Operational Insights</span>
        <div className="space-y-2">
          {keyInsights.map((insight, idx) => (
            <div key={idx} className="flex gap-2.5 items-start p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 font-medium">
              <span className="text-[#3b7194] text-xs font-bold shrink-0">#{idx + 1}</span>
              <p className="leading-relaxed text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {estimatedCloseDate && (
        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium font-mono border-t border-gray-100 pt-3">
          <Calendar size={11} />
          <span>Predicted Contract Handshake Opportunity: {estimatedCloseDate}</span>
        </div>
      )}
    </Card>
  );
};
