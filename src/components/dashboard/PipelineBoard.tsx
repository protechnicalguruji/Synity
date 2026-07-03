/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Building,
  MoreHorizontal
} from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Lead, LeadStatus, PipelineStage } from "../../types";
import { PIPELINE_STAGES } from "../../constants";
import { formatCurrency, getConfidenceColor } from "../../utils";
import { motion } from "motion/react";

interface PipelineBoardProps {
  leads: Lead[];
  onUpdateLeadStatus: (id: string, status: LeadStatus) => void;
}

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  leads,
  onUpdateLeadStatus,
}) => {
  const [activeStageMenu, setActiveStageMenu] = useState<string | null>(null);

  // Group leads by status
  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter((l) => l.status === status);
  };

  // Get total monetary value of leads in a status
  const getStageValue = (status: LeadStatus) => {
    return leads
      .filter((l) => l.status === status)
      .reduce((sum, lead) => sum + lead.value, 0);
  };

  // Move a lead to adjacent stage helper
  const handleShiftLead = (leadId: string, currentStatus: LeadStatus, direction: "next" | "prev") => {
    const currentIndex = PIPELINE_STAGES.findIndex((st) => st.status === currentStatus);
    if (currentIndex === -1) return;

    let targetIndex = currentIndex;
    if (direction === "next" && currentIndex < PIPELINE_STAGES.length - 1) {
      targetIndex += 1;
    } else if (direction === "prev" && currentIndex > 0) {
      targetIndex -= 1;
    }

    if (targetIndex !== currentIndex) {
      onUpdateLeadStatus(leadId, PIPELINE_STAGES[targetIndex].status);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Description */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold font-display text-[#2F2F2F] tracking-tight">Sales Pipeline Board</h2>
          <p className="text-xs text-[#666666]">
            Visualize deals through your agency's closing progression. Shift lead stages using quick trigger arrows.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200/50 rounded-lg text-xs font-mono text-[#666666]">
          <TrendingUp size={13} className="text-[#4E4E49]" />
          <span>Weighted Value: <strong className="text-[#2F2F2F]">{formatCurrency(leads.reduce((sum, l) => sum + (l.value * (l.confidenceScore / 100)), 0))}</strong></span>
        </div>
      </div>

      {/* Horizontal Kanban Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x select-none">
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = getLeadsByStatus(stage.status);
          const stageTotalValue = getStageValue(stage.status);

          return (
            <div
              key={stage.id}
              className="w-72 bg-[#E5E3E7]/30 border border-[#D8D8D8] rounded-xl p-4 flex flex-col shrink-0 snap-start h-[600px]"
            >
              {/* Column Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h3 className="font-semibold text-sm text-[#2F2F2F] tracking-tight font-display truncate w-36">
                      {stage.name}
                    </h3>
                  </div>
                  <p className="text-[10px] font-mono text-gray-500">
                    {stageLeads.length} {stageLeads.length === 1 ? "deal" : "deals"}
                  </p>
                </div>
                
                {/* Aggregate Column Value */}
                <Badge variant="primary" size="sm" className="font-mono font-bold shrink-0">
                  {formatCurrency(stageTotalValue)}
                </Badge>
              </div>

              {/* Column Cards (List) */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {stageLeads.length === 0 ? (
                  <div className="h-28 border border-dashed border-[#D8D8D8]/60 rounded-lg flex items-center justify-center p-4 text-center">
                    <span className="text-[10px] font-medium text-gray-400">Drag/Move leads here</span>
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const confColor = getConfidenceColor(lead.confidenceScore);
                    const isFirstStage = stage.status === PIPELINE_STAGES[0].status;
                    const isLastStage = stage.status === PIPELINE_STAGES[PIPELINE_STAGES.length - 1].status;

                    return (
                      <motion.div
                        key={lead.id}
                        layoutId={`lead-card-${lead.id}`}
                        className="bg-white border border-[#D8D8D8] rounded-lg p-3.5 hover:border-[#60605B] shadow-2xs hover:shadow-sm transition-all duration-200 text-left relative group"
                      >
                        {/* Title and Action Dots */}
                        <div className="flex justify-between items-start gap-1">
                          <p className="text-xs font-bold text-[#2F2F2F] leading-tight truncate w-44">
                            {lead.name}
                          </p>
                          
                          {/* Shifter control links */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                            {!isFirstStage && (
                              <button
                                onClick={() => handleShiftLead(lead.id, lead.status, "prev")}
                                className="p-1 rounded-sm hover:bg-gray-100 text-gray-500 hover:text-[#2F2F2F]"
                                title="Move left"
                              >
                                <ChevronLeft size={11} />
                              </button>
                            )}
                            {!isLastStage && (
                              <button
                                onClick={() => handleShiftLead(lead.id, lead.status, "next")}
                                className="p-1 rounded-sm hover:bg-gray-100 text-gray-500 hover:text-[#2F2F2F]"
                                title="Move right"
                              >
                                <ChevronRight size={11} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Company */}
                        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 font-mono truncate">
                          <Building size={10} /> {lead.company}
                        </p>

                        {/* Divider */}
                        <div className="h-px bg-gray-100 my-3" />

                        {/* Bottom metrics */}
                        <div className="flex items-center justify-between gap-1.5">
                          {/* Value */}
                          <span className="text-xs font-bold text-[#4E4E49] font-mono">
                            {formatCurrency(lead.value)}
                          </span>

                          {/* Close Propensity */}
                          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[9px] font-bold border ${confColor.bg} ${confColor.text} ${confColor.border}`}>
                            <Sparkles size={8} className="shrink-0" />
                            {lead.confidenceScore}% Close
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
