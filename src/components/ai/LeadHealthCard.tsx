/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Activity, ShieldCheck, Heart, AlertTriangle, HelpCircle } from "lucide-react";
import { LeadHealth } from "../../lib/ai/types";
import { Card } from "../ui/Card";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface LeadHealthCardProps {
  health?: LeadHealth | null;
  loading?: boolean;
}

export const LeadHealthCard: React.FC<LeadHealthCardProps> = ({ health, loading }) => {
  if (loading) {
    return (
      <Card className="p-5 border-gray-200 animate-pulse space-y-4" id="health-card-skeleton">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded-full w-1/4"></div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="h-16 w-16 bg-gray-200 rounded-full shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!health) {
    return (
      <Card className="p-5 text-center text-gray-400 text-xs" id="health-card-empty">
        <HelpCircle className="mx-auto mb-2 text-gray-300" size={24} />
        Awaiting Lead Health Calibration
      </Card>
    );
  }

  const { score, status, reasons, lastContactDeltaDays, confidence } = health;

  const getStatusConfig = (s: typeof status) => {
    switch (s) {
      case "HEALTHY":
        return {
          bg: "bg-emerald-50 border-emerald-200",
          text: "text-emerald-700",
          scoreBg: "text-emerald-600 bg-emerald-50 border-emerald-200",
          progressBg: "bg-emerald-500",
          icon: <ShieldCheck size={16} className="text-emerald-500" />
        };
      case "WARM":
        return {
          bg: "bg-amber-50/50 border-amber-200/60",
          text: "text-amber-700",
          scoreBg: "text-amber-600 bg-amber-50 border-amber-200/60",
          progressBg: "bg-amber-500",
          icon: <Activity size={16} className="text-amber-500" />
        };
      case "COLD":
        return {
          bg: "bg-blue-50/50 border-blue-200/60",
          text: "text-blue-700",
          scoreBg: "text-blue-600 bg-blue-50 border-blue-200/60",
          progressBg: "bg-blue-500",
          icon: <Heart size={16} className="text-blue-400" />
        };
      case "CRITICAL":
        return {
          bg: "bg-red-50/50 border-red-200/60",
          text: "text-red-700",
          scoreBg: "text-red-600 bg-red-50 border-red-200/60",
          progressBg: "bg-red-500",
          icon: <AlertTriangle size={16} className="text-red-500 animate-bounce" />
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Card className={`p-5 border ${config.bg} transition-all shadow-xs`} id={`health-card-${status.toLowerCase()}`}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1.5">
            {config.icon}
            Relationship Health
          </span>
          <h4 className={`text-lg font-display font-bold mt-1 ${config.text}`}>
            {status} STATUS
          </h4>
        </div>
        <ConfidenceBadge confidence={confidence} />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 mt-4">
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              className="stroke-gray-100 fill-none"
              strokeWidth="6"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              className={`stroke-current ${config.text} fill-none`}
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 * (1 - score / 100)}
            />
          </svg>
          <span className="absolute text-xs font-mono font-bold text-gray-800">{score}%</span>
        </div>

        <div className="flex-1 space-y-1.5 text-left w-full">
          <p className="text-xs text-gray-700 font-medium">
            Last logged touchpoint: <strong className="font-semibold text-gray-900">{lastContactDeltaDays === 0 ? "Today" : lastContactDeltaDays === 1 ? "Yesterday" : `${lastContactDeltaDays} days ago`}</strong>
          </p>
          <div className="space-y-1">
            {reasons.map((r, i) => (
              <p key={i} className="text-[11px] text-gray-500 leading-relaxed flex items-start gap-1">
                <span className="text-gray-400 shrink-0 select-none">•</span>
                <span>{r}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
