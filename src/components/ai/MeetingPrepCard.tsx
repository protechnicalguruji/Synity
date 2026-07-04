/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BookOpen, HelpCircle, CheckCircle2, AlertOctagon, Lightbulb } from "lucide-react";
import { MeetingPrepResult } from "../../lib/ai/types";
import { Card } from "../ui/Card";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface MeetingPrepCardProps {
  prep?: MeetingPrepResult | null;
  loading?: boolean;
}

export const MeetingPrepCard: React.FC<MeetingPrepCardProps> = ({ prep, loading }) => {
  if (loading) {
    return (
      <Card className="p-5 border-gray-200 animate-pulse space-y-4" id="meeting-prep-card-skeleton">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!prep) {
    return (
      <Card className="p-5 text-center text-gray-400 text-xs" id="meeting-prep-card-empty">
        <BookOpen className="mx-auto mb-2 text-gray-300" size={24} />
        No Upcoming Meeting Scheduled
      </Card>
    );
  }

  const { clientSummary, previousNotesSummary, lastActivitySummary, talkingPoints, objectionHandling, confidence } = prep;

  return (
    <Card className="p-5 border-gray-100 space-y-5" id="ai-meeting-prep-card">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 flex items-center gap-1.5">
            <Lightbulb size={12} className="text-amber-500" />
            Strategic Meeting Preparation Brief
          </span>
          <h4 className="text-sm font-bold text-gray-800">Briefing & Conversational Tactics</h4>
        </div>
        <ConfidenceBadge confidence={confidence} />
      </div>

      <div className="space-y-3.5">
        {/* Summary Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-left">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Client Context</span>
            <p className="text-gray-700 leading-relaxed font-medium mt-1">{clientSummary}</p>
          </div>
          <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-left">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Historical Notes</span>
            <p className="text-gray-700 leading-relaxed font-medium mt-1">{previousNotesSummary}</p>
          </div>
          <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-left">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Last Touchpoint</span>
            <p className="text-gray-700 leading-relaxed font-medium mt-1">{lastActivitySummary}</p>
          </div>
        </div>

        {/* Talking Points */}
        <div className="space-y-2 text-left">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Recommended Talking Points</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {talkingPoints.map((point, index) => (
              <div key={index} className="flex gap-2.5 items-start p-3 bg-emerald-50/15 border border-emerald-100/30 rounded-xl text-xs text-gray-700">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Objection Handling */}
        <div className="space-y-2.5 text-left">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Objection Defense Tactics</span>
          <div className="space-y-2">
            {objectionHandling.map((item, index) => (
              <div key={index} className="p-3.5 bg-amber-50/10 border border-amber-200/20 rounded-xl text-xs space-y-1.5">
                <p className="font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertOctagon size={12} className="text-amber-500 shrink-0" />
                  Objection: "{item.objection}"
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="font-semibold text-gray-800">AI Response:</strong> {item.response}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
