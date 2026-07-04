/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, GraduationCap, Flame, ArrowUpRight, Award, Zap } from "lucide-react";
import { CoachingTip } from "../../lib/ai/types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface CoachingCardProps {
  tips?: CoachingTip[];
  loading?: boolean;
}

export const CoachingCard: React.FC<CoachingCardProps> = ({ tips = [], loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse" id="coaching-skeleton">
        <div className="h-28 bg-gray-200 rounded-xl"></div>
        <div className="h-28 bg-gray-200 rounded-xl"></div>
        <div className="h-28 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-400 text-xs" id="coaching-empty">
        <GraduationCap className="mx-auto mb-2 text-gray-300" size={24} />
        Awaiting performance pattern analysis...
      </Card>
    );
  }

  const getCategoryConfig = (cat: CoachingTip["category"]) => {
    switch (cat) {
      case "EFFICIENCY":
        return {
          icon: <Zap size={14} className="text-amber-500" />,
          bg: "bg-amber-50/10 border-amber-200/20",
          text: "text-amber-700"
        };
      case "STRATEGY":
        return {
          icon: <Award size={14} className="text-[#3b7194]" />,
          bg: "bg-[#8CB9D7]/5 border-[#8CB9D7]/20",
          text: "text-[#3b7194]"
        };
      case "METRICS":
      case "ANALYTICS":
        return {
          icon: <Flame size={14} className="text-emerald-500" />,
          bg: "bg-emerald-50/10 border-emerald-200/20",
          text: "text-emerald-700"
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="ai-coaching-cards-grid">
      {tips.map((tip) => {
        const config = getCategoryConfig(tip.category);
        return (
          <div
            key={tip.id}
            className={`p-4 rounded-xl border flex flex-col justify-between bg-white text-left ${config.bg} shadow-2xs hover:shadow-xs transition-all`}
            id={`coaching-card-${tip.id}`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center gap-2">
                <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 bg-white border ${config.text}`}>
                  {config.icon}
                  {tip.category}
                </span>

                {tip.metricImpact && (
                  <Badge variant="success" size="sm" className="font-mono font-bold text-[9px] shrink-0">
                    <ArrowUpRight size={10} className="mr-0.5" />
                    {tip.metricImpact}
                  </Badge>
                )}
              </div>

              <h5 className="text-xs font-bold text-[#2F2F2F] tracking-tight">{tip.title}</h5>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{tip.message}</p>
            </div>

            {tip.actionLabel && (
              <button className="mt-3 text-[10px] font-bold text-gray-700 hover:text-black flex items-center gap-0.5 transition-colors cursor-pointer self-start">
                {tip.actionLabel}
                <span className="text-gray-400 text-xs">›</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
