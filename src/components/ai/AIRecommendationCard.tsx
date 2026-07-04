/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Clock, AlertCircle, Copy, Check, Send, PhoneCall } from "lucide-react";
import { FollowUpSuggestion } from "../../lib/ai/types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface AIRecommendationCardProps {
  followUp?: FollowUpSuggestion | null;
  loading?: boolean;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ followUp, loading }) => {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <Card className="p-5 border-gray-200 animate-pulse space-y-4" id="recommendation-card-skeleton">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (!followUp) {
    return (
      <Card className="p-5 text-center text-gray-400 text-xs" id="recommendation-card-empty">
        <AlertCircle className="mx-auto mb-2 text-gray-300" size={24} />
        Awaiting Next Touchpoint Calibration
      </Card>
    );
  }

  const { recommendedAction, recommendedTime, reason, tone, messageTemplate, confidence } = followUp;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-5 border-gray-100 hover:border-gray-200 transition-all shadow-xs space-y-4" id="ai-followup-recommendation-card">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 flex items-center gap-1.5">
            <Sparkles size={11} className="text-purple-500" />
            AI Recommended Touchpoint
          </span>
          <h4 className="text-sm font-bold text-gray-800">{recommendedAction}</h4>
        </div>
        <ConfidenceBadge confidence={confidence} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-gray-50 border border-gray-100/80 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Execution Time</span>
          <p className="font-bold text-gray-800 flex items-center gap-1.5 mt-0.5">
            <Clock size={12} className="text-[#3b7194]" />
            {recommendedTime}
          </p>
        </div>
        <div className="p-3 bg-gray-50 border border-gray-100/80 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Recommended Tone</span>
          <p className="font-bold text-gray-800 mt-0.5">{tone}</p>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Strategy & Rationale</span>
        <p className="text-gray-600 leading-relaxed bg-purple-50/20 border border-purple-100/40 p-3 rounded-xl">
          {reason}
        </p>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Draft Template Copy</span>
          <button
            onClick={handleCopy}
            className="text-[11px] font-semibold text-[#3b7194] hover:text-[#2f5c7a] flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy Draft
              </>
            )}
          </button>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl font-mono text-[11px] text-gray-700 whitespace-pre-wrap leading-relaxed select-all">
          {messageTemplate}
        </div>
      </div>
    </Card>
  );
};
