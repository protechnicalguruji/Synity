/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertTriangle, Clock, Ban, UserCheck, CalendarDays, HelpCircle } from "lucide-react";
import { RiskFlag } from "../../lib/ai/types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface RiskCardProps {
  risks?: RiskFlag[];
  loading?: boolean;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risks = [], loading }) => {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse" id="risks-skeleton">
        <div className="h-12 bg-gray-200 rounded-lg"></div>
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (risks.length === 0) {
    return (
      <Card className="p-5 text-center text-gray-400 text-xs" id="risks-empty">
        <UserCheck className="mx-auto mb-2 text-emerald-500/80 animate-pulse" size={24} />
        Zero active risk flags detected. Deal pipeline is secure.
      </Card>
    );
  }

  const getRiskIcon = (type: RiskFlag["type"]) => {
    switch (type) {
      case "COLD_LEAD":
        return <Ban size={15} className="text-blue-500" />;
      case "MISSED_FOLLOW_UP":
        return <Clock size={15} className="text-red-500" />;
      case "NO_CONTACT":
        return <HelpCircle size={15} className="text-amber-500" />;
      case "OVERDUE_MEETING":
        return <CalendarDays size={15} className="text-purple-500" />;
      default:
        return <AlertTriangle size={15} className="text-red-500" />;
    }
  };

  const getSeverityBadgeVariant = (severity: RiskFlag["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        return "danger";
      case "HIGH":
        return "danger";
      case "MEDIUM":
        return "warning";
      case "LOW":
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-2.5 text-left" id="ai-risks-list">
      {risks.map((risk) => (
        <div
          key={risk.id}
          className={`p-3.5 rounded-xl border bg-white flex items-start gap-3 transition-colors ${
            risk.severity === "CRITICAL" || risk.severity === "HIGH"
              ? "border-red-100 hover:border-red-200 bg-red-50/5"
              : "border-gray-100 hover:border-gray-200"
          }`}
          id={`risk-item-${risk.id}`}
        >
          <div className="p-1.5 bg-gray-50 rounded-lg shrink-0 mt-0.5">
            {getRiskIcon(risk.type)}
          </div>

          <div className="flex-1 space-y-1 text-xs">
            <div className="flex items-center justify-between gap-2">
              <h6 className="font-bold text-gray-800 leading-tight">{risk.title}</h6>
              <Badge variant={getSeverityBadgeVariant(risk.severity)} size="sm" className="font-mono text-[9px] font-bold">
                {risk.severity}
              </Badge>
            </div>
            <p className="text-gray-500 leading-relaxed font-medium">{risk.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
