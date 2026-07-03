import React, { useState } from "react";
import { Badge } from "../ui/Badge";
import { Lead, LeadStatus, PipelineStage } from "../../types";
import { formatCurrency } from "../../utils";
import { Database, TrendingUp, Sparkles } from "lucide-react";

interface PipelineColumnProps {
  stage: PipelineStage;
  leads: Lead[];
  children: React.ReactNode;
  onDropLead: (leadId: string, targetStatus: LeadStatus) => void;
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({
  stage,
  leads,
  children,
  onDropLead
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const leadId = e.dataTransfer.getData("text/plain");
    if (leadId) {
      onDropLead(leadId, stage.status);
    }
  };

  // Aggregate Metrics:
  // 1. Total leads
  const count = leads.length;

  // 2. Total Deal Value
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0);

  // 3. Estimated Revenue (Weighted Deal Value by confidence Score)
  const estimatedRevenue = leads.reduce((sum, l) => sum + (l.value * (l.confidenceScore / 100)), 0);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-76 rounded-xl flex flex-col shrink-0 snap-start h-[640px] transition-all duration-200 border text-left ${
        isDragOver
          ? "bg-slate-100/95 border-[#4E4E49] ring-2 ring-[#4E4E49]/20"
          : "bg-[#E5E3E7]/25 border-[#D8D8D8]"
      }`}
    >
      {/* Column Header Panel */}
      <div className="p-4 border-b border-[#D8D8D8]/70 bg-white/40 rounded-t-xl space-y-2">
        <div className="flex justify-between items-start gap-1">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: stage.color }}
            />
            <h3 className="font-bold text-sm text-[#2F2F2F] tracking-tight font-display truncate max-w-[130px]" title={stage.name}>
              {stage.name}
            </h3>
          </div>
          
          <Badge variant="primary" size="sm" className="font-mono text-[10px] font-bold tracking-tight bg-[#2F2F2F] text-white">
            {count}
          </Badge>
        </div>

        {/* Aggregate Value metrics */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-gray-100 text-[10px] text-gray-500 font-mono">
          <div>
            <span className="block text-[8px] uppercase font-bold text-gray-400">Total Value</span>
            <strong className="text-gray-800 font-extrabold text-[11px]">
              {formatCurrency(totalValue)}
            </strong>
          </div>
          <div className="border-l border-gray-100 pl-2">
            <span className="block text-[8px] uppercase font-bold text-gray-400 flex items-center gap-0.5">
              <Sparkles size={8} className="text-[#8CB9D7]" />
              Est. Rev
            </span>
            <strong className="text-emerald-700 font-extrabold text-[11px]" title="Weighted Value = sum(value * confidence)">
              {formatCurrency(estimatedRevenue)}
            </strong>
          </div>
        </div>
      </div>

      {/* Column Inner Content Scrolling */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 Scrollbar-styled select-none">
        {count === 0 ? (
          <div className="h-44 border border-dashed border-[#D8D8D8]/80 rounded-xl flex flex-col items-center justify-center p-4 text-center bg-white/20">
            <Database size={24} className="stroke-1 text-gray-400 mb-2" />
            <span className="text-[10px] font-semibold text-gray-400">No leads currently</span>
            <span className="text-[8px] text-gray-400/80 mt-1 uppercase font-mono">Drop workspace here</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
