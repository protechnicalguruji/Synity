/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AIInsight } from "../../types/analytics";
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

interface InsightCardProps {
  insights: AIInsight[];
}

export const InsightCard: React.FC<InsightCardProps> = ({ insights }) => {
  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-600" />
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            Cognitive Copilot Pipeline Recommendations
          </h3>
        </div>
        <span className="text-[10px] font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 uppercase">
          Dynamic Insights
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => {
          let Icon = Lightbulb;
          let colorStyle = "border-sky-100 bg-sky-50/50 text-sky-800";
          
          if (insight.type === "success") {
            Icon = CheckCircle2;
            colorStyle = "border-emerald-100 bg-emerald-50/50 text-emerald-800";
          } else if (insight.type === "warning") {
            Icon = AlertTriangle;
            colorStyle = "border-amber-100 bg-amber-50/40 text-amber-800";
          } else if (insight.type === "tip") {
            Icon = TrendingUp;
            colorStyle = "border-purple-100 bg-purple-50/30 text-purple-800";
          }

          return (
            <div
              key={insight.id}
              className={`border rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors ${colorStyle}`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="shrink-0" />
                  <span className="text-xs font-extrabold uppercase tracking-tight">
                    {insight.title}
                  </span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed opacity-90">
                  {/* Replace markdown-style bolding for display */}
                  {insight.description.split("**").map((text, i) => 
                    i % 2 === 1 ? <strong key={i} className="font-bold">{text}</strong> : text
                  )}
                </p>
              </div>

              {insight.impactValue && (
                <div className="flex items-center justify-between text-[10px] font-bold uppercase border-t border-current/10 pt-2 opacity-95">
                  <span className="opacity-75">Estimated Yield</span>
                  <div className="flex items-center gap-1 font-mono">
                    <span>{insight.impactValue}</span>
                    <ArrowRight size={11} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightCard;
