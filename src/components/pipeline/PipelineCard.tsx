import React from "react";
import { 
  Building, User, Briefcase, Calendar, Phone, MessageSquare, 
  Eye, CheckSquare, Clock, AlertTriangle, ArrowRight 
} from "lucide-react";
import { Lead, LeadStatus } from "../../types";
import { formatCurrency, formatDate, getConfidenceColor, getStatusStyle } from "../../utils";
import { motion } from "motion/react";

interface PipelineCardProps {
  lead: Lead;
  onOpenDetails: (lead: Lead) => void;
  onQuickCall: (lead: Lead) => void;
  onQuickWhatsapp: (lead: Lead) => void;
  onScheduleFollowUp: (lead: Lead) => void;
  onAddTask: (lead: Lead) => void;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({
  lead,
  onOpenDetails,
  onQuickCall,
  onQuickWhatsapp,
  onScheduleFollowUp,
  onAddTask
}) => {
  const confColor = getConfidenceColor(lead.confidenceScore);
  
  // Drag start handler for Kanban
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", lead.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const getPriorityStyle = (priority: Lead["priority"]) => {
    switch (priority) {
      case "URGENT":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "HIGH":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "MEDIUM":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "LOW":
        default:
          return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // Check if follow-up is overdue
  const isFollowUpOverdue = () => {
    if (!lead.nextFollowUp) return false;
    const followTime = new Date(lead.nextFollowUp).getTime();
    const now = Date.now();
    // Only flag overdue if status is not Won or Lost
    return followTime < now && lead.status !== LeadStatus.CLOSED_WON && lead.status !== LeadStatus.CLOSED_LOST;
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`group bg-white border border-[#D8D8D8] rounded-xl p-4 shadow-2xs hover:shadow-md hover:border-[#4E4E49] hover:-translate-y-0.5 hover:scale-[1.01] transition-all duration-200 cursor-grab active:cursor-grabbing text-left space-y-3.5 relative ${
        isFollowUpOverdue() ? "ring-1 ring-rose-500/30 border-rose-200" : ""
      }`}
    >
      {/* Overdue alert indicator */}
      {isFollowUpOverdue() && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-rose-500 rounded-t-xl" />
      )}

      {/* 1. Header: Priority & Confidence score */}
      <div className="flex items-center justify-between gap-1">
        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border ${getPriorityStyle(lead.priority)}`}>
          {lead.priority}
        </span>
        
        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[9px] font-bold border ${confColor.bg} ${confColor.text} ${confColor.border}`}>
          {lead.confidenceScore}% Close
        </span>
      </div>

      {/* 2. Core Info: Business Name & Owner */}
      <div className="space-y-1">
        <h4 className="font-bold text-xs text-[#2F2F2F] tracking-tight group-hover:text-[#4E4E49] transition-colors leading-snug truncate">
          {lead.company}
        </h4>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
          <User size={10} className="text-gray-400 shrink-0" />
          <span className="truncate">{lead.name}</span>
        </div>
      </div>

      {/* 3. Deal Details: Value & Industry */}
      <div className="pt-2 border-t border-[#F2F2F2] flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Value</p>
          <p className="text-xs font-extrabold text-[#2F2F2F] font-mono leading-none">
            {formatCurrency(lead.value)}
          </p>
        </div>
        
        {lead.industry && (
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md text-[9px] text-gray-500 font-semibold border border-gray-100 max-w-[120px] truncate">
            <Building size={9} className="shrink-0 text-gray-400" />
            <span className="truncate">{lead.industry}</span>
          </div>
        )}
      </div>

      {/* 4. Timestamps & Alerts: Next Follow Up / Last contacted */}
      <div className="space-y-1.5 pt-1.5 border-t border-[#F2F2F2] text-[10px] text-gray-500 font-medium font-mono">
        {lead.nextFollowUp && (
          <div className={`flex items-center justify-between p-1 rounded ${
            isFollowUpOverdue() ? "bg-rose-50/50 text-rose-700" : "bg-slate-50 text-slate-600"
          }`}>
            <span className="flex items-center gap-1 shrink-0 font-sans text-[9px] uppercase tracking-wider font-bold">
              <Clock size={10} className={isFollowUpOverdue() ? "text-rose-500 animate-pulse" : "text-gray-400"} />
              Follow-Up
            </span>
            <span className="truncate font-bold">
              {formatDate(lead.nextFollowUp)}
            </span>
          </div>
        )}

        {lead.lastContactedAt ? (
          <div className="flex items-center justify-between px-1 text-[9px] text-gray-400">
            <span>LAST CONTACT:</span>
            <span>{formatDate(lead.lastContactedAt)}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-1 text-[9px] text-gray-400">
            <span>CREATED:</span>
            <span>{formatDate(lead.createdAt)}</span>
          </div>
        )}
      </div>

      {/* 5. Quick Actions Bar */}
      <div className="pt-2 border-t border-[#F5F5F5] flex items-center justify-between gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onOpenDetails(lead)}
          className="p-1.5 text-gray-500 hover:text-[#2F2F2F] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Open Lead Workspace"
          aria-label="View Details"
        >
          <Eye size={12} />
        </button>

        <div className="flex items-center gap-0.5 ml-auto">
          {lead.phone && (
            <button
              onClick={() => onQuickCall(lead)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title={`Simulate Direct Phone Call to ${lead.phone}`}
              aria-label="Call Lead"
            >
              <Phone size={11} />
            </button>
          )}

          <button
            onClick={() => onQuickWhatsapp(lead)}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            title="Dispatch WhatsApp Notification"
            aria-label="WhatsApp Sent"
          >
            <MessageSquare size={11} />
          </button>

          <button
            onClick={() => onScheduleFollowUp(lead)}
            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            title="Schedule Follow-Up Callback"
            aria-label="Schedule Follow Up"
          >
            <Calendar size={11} />
          </button>

          <button
            onClick={() => onAddTask(lead)}
            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
            title="Schedule Custom Action Task"
            aria-label="Add Task"
          >
            <CheckSquare size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};
