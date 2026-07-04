/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles } from "lucide-react";
import { ConfidenceScore } from "../../lib/ai/types";
import { Badge } from "../ui/Badge";

interface ConfidenceBadgeProps {
  confidence?: ConfidenceScore;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  if (!confidence) return null;

  const getVariant = (level: "LOW" | "MEDIUM" | "HIGH") => {
    switch (level) {
      case "HIGH":
        return "success";
      case "MEDIUM":
        return "accent";
      case "LOW":
        return "warning";
      default:
        return "neutral";
    }
  };

  const getLabel = (level: "LOW" | "MEDIUM" | "HIGH") => {
    switch (level) {
      case "HIGH":
        return "High Certainty";
      case "MEDIUM":
        return "Medium Certainty";
      case "LOW":
        return "Low Certainty";
      default:
        return "AI Calibrated";
    }
  };

  return (
    <div className="flex items-center gap-1.5" id="ai-confidence-badge-wrapper">
      <Badge
        id="ai-confidence-badge"
        variant={getVariant(confidence.level)}
        size="sm"
        className="font-mono text-[10px] font-bold flex items-center gap-1"
      >
        <Sparkles size={10} className="shrink-0" />
        {getLabel(confidence.level)} • {confidence.percentage}%
      </Badge>
    </div>
  );
};
