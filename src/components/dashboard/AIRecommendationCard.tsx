/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Lightbulb, Target, TrendingUp } from "lucide-react";
import { Card } from "../ui/Card";
import { motion, AnimatePresence } from "motion/react";

interface Recommendation {
  id: string;
  type: "warning" | "success" | "insight";
  title: string;
  message: string;
  metric?: string;
  actionLabel?: string;
}

const DEFAULT_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-1",
    type: "warning",
    title: "Overdue Touches Alert",
    message: "You missed two crucial client follow-ups yesterday. Let's schedule call actions right away to rescue the deal heat.",
    metric: "2 Overdue",
    actionLabel: "Rescue Now"
  },
  {
    id: "rec-2",
    type: "success",
    title: "Velocity Acceleration",
    message: "Outbound calls closed 20% more deals than last week! Your customized pipeline follow-up templates are performing at their peak.",
    metric: "+20% Closed",
    actionLabel: "View Performance"
  },
  {
    id: "rec-3",
    type: "insight",
    title: "Industry Pattern Discovery",
    message: "Dentistry and Medical Clinics are converting 35% better than Restaurants this month. We recommend focusing LinkedIn outreach on healthcare prospects.",
    metric: "3.5x Conversion",
    actionLabel: "Filter Industry"
  }
];

interface AIRecommendationCardProps {
  onAction?: (actionLabel: string) => void;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ onAction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DEFAULT_RECOMMENDATIONS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DEFAULT_RECOMMENDATIONS.length) % DEFAULT_RECOMMENDATIONS.length);
  };

  const current = DEFAULT_RECOMMENDATIONS[currentIndex];

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <Target className="text-amber-500" size={18} />;
      case "success":
        return <TrendingUp className="text-emerald-500" size={18} />;
      case "insight":
      default:
        return <Lightbulb className="text-blue-500" size={18} />;
    }
  };

  const getColorTheme = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-amber-50/65 border-amber-200/60 text-amber-900";
      case "success":
        return "bg-emerald-50/65 border-emerald-200/60 text-emerald-900";
      case "insight":
      default:
        return "bg-blue-50/65 border-blue-200/60 text-blue-900";
    }
  };

  return (
    <Card
      id="ai-coaching-widget"
      title={
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#8CB9D7] animate-pulse" />
          <span className="font-display font-bold text-[#2F2F2F]">Personal AI Sales Coaching</span>
        </div>
      }
      description="Proactive insights and optimizations powered by deep deal behavior analysis."
      headerActions={
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="p-1 rounded-md hover:bg-gray-100 text-[#666666] transition-colors cursor-pointer"
            title="Previous coaching card"
          >
            <ArrowLeft size={14} />
          </button>
          <span className="text-[10px] font-mono font-bold text-gray-400">
            {currentIndex + 1} / {DEFAULT_RECOMMENDATIONS.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1 rounded-md hover:bg-gray-100 text-[#666666] transition-colors cursor-pointer"
            title="Next coaching card"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      }
      className="h-full flex flex-col justify-between"
    >
      <div className="relative overflow-hidden h-40 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
            className={`w-full p-4.5 rounded-xl border flex flex-col justify-between h-full ${getColorTheme(current.type)}`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(current.type)}
                  <span className="text-xs font-bold uppercase tracking-wide">{current.title}</span>
                </div>
                {current.metric && (
                  <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-mono font-bold shadow-2xs border border-inherit">
                    {current.metric}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4E4E49] leading-relaxed text-left font-medium">
                {current.message}
              </p>
            </div>

            {current.actionLabel && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onAction && onAction(current.actionLabel || "")}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2F2F2F] hover:underline cursor-pointer"
                >
                  {current.actionLabel} <ArrowRight size={12} />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
};
