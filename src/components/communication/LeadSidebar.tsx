/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Lead } from "../../types";
import { Conversation, SmartReminder } from "../../types/communication";
import { ReminderCard } from "./ReminderCard";
import { 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  ShieldAlert, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Calendar,
  CheckSquare,
  Activity,
  Heart,
  MessageSquare,
  Flame,
  AlertTriangle,
  User,
  ArrowUpRight
} from "lucide-react";

interface LeadSidebarProps {
  lead?: Lead;
  conversation?: Conversation;
  onQuickAction: (actionType: "CALL" | "WHATSAPP" | "EMAIL" | "MEETING" | "TASK" | "FOLLOW_UP" | "OPEN_LEAD") => void;
  onAddReminder: (type: "REPLY_IN_2H" | "CALL_TOMORROW" | "FOLLOW_UP_FRIDAY" | "CUSTOM", title: string) => void;
  onRemoveReminder: (id: string) => void;
}

export const LeadSidebar: React.FC<LeadSidebarProps> = ({
  lead,
  conversation,
  onQuickAction,
  onAddReminder,
  onRemoveReminder
}) => {
  if (!lead) {
    return (
      <div className="bg-white border border-[#D8D8D8] rounded-2xl p-6 text-center text-gray-400 space-y-3 h-full flex flex-col justify-center items-center">
        <User size={40} className="text-gray-300 stroke-[1.2]" />
        <p className="text-xs font-bold text-[#2F2F2F]">No Contact Selected</p>
        <p className="text-[11px] leading-relaxed max-w-[200px]">
          Select an active customer conversation from the list to populate CRM summary metadata.
        </p>
      </div>
    );
  }

  // Sentiment mapping for visual cues
  const getSentimentStyling = (sentiment?: string) => {
    switch (sentiment) {
      case "POSITIVE":
        return { text: "Positive", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
      case "NEGATIVE":
        return { text: "Negative / At Risk", color: "text-rose-600 bg-rose-50 border-rose-200" };
      default:
        return { text: "Neutral", color: "text-blue-600 bg-blue-50 border-blue-200" };
    }
  };

  // Priority styling
  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case "URGENT":
        return "bg-rose-500 text-white";
      case "HIGH":
        return "bg-orange-500 text-white";
      case "MEDIUM":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const sentiment = getSentimentStyling(conversation?.aiInsight?.sentiment);

  // Dynamic Lead Health calculations (simulated score)
  const healthScore = conversation?.aiInsight?.riskLevel === "HIGH" 
    ? 35 
    : conversation?.aiInsight?.riskLevel === "MEDIUM" 
      ? 65 
      : 95;

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto pr-1 pb-10" id="lead-sidebar-root">
      
      {/* 1. LEAD HEADER SUMMARY & HEALTH */}
      <div className="bg-white border border-[#D8D8D8] rounded-xl p-4 text-left space-y-3 shadow-2xs">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#2F2F2F] tracking-tight">{lead.name}</h3>
            <p className="text-xs font-semibold text-purple-600 flex items-center gap-1">
              <Building2 size={12} /> {lead.company}
            </p>
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${getPriorityColor(lead.priority)}`}>
            {lead.priority}
          </span>
        </div>

        {/* Health, Stage & Value grid */}
        <div className="grid grid-cols-3 gap-2 border-t border-[#D8D8D8] pt-3 text-center">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
              Deal Value
            </span>
            <span className="text-xs font-extrabold text-[#2F2F2F] font-mono flex items-center justify-center">
              <DollarSign size={11} className="text-gray-400 shrink-0" />
              {lead.value.toLocaleString()}
            </span>
          </div>
          <div className="space-y-1 border-x border-[#D8D8D8]">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
              SLA Health
            </span>
            <span className={`text-xs font-extrabold font-mono flex items-center justify-center gap-0.5 ${getHealthColor(healthScore)}`}>
              <Heart size={11} className="fill-current" />
              {healthScore}%
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
              Stage
            </span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full border border-purple-100 uppercase truncate max-w-full block">
              {lead.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* 2. QUICK CUSTOMER ACTIONS GRID */}
      <div className="bg-white border border-[#D8D8D8] rounded-xl p-4 text-left space-y-3 shadow-2xs">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
          Unified Outbound Actions
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onQuickAction("CALL")}
            className="flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 border border-[#D8D8D8] hover:border-purple-200 transition-all cursor-pointer group"
          >
            <Phone size={13} className="text-gray-500 group-hover:text-purple-600 group-hover:animate-wiggle" />
            <span>Call Phone</span>
          </button>
          
          <button
            type="button"
            onClick={() => onQuickAction("WHATSAPP")}
            className="flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 border border-[#D8D8D8] hover:border-emerald-200 transition-all cursor-pointer group"
          >
            <MessageSquare size={13} className="text-gray-500 group-hover:text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickAction("EMAIL")}
            className="flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-[#D8D8D8] hover:border-blue-200 transition-all cursor-pointer group"
          >
            <Mail size={13} className="text-gray-500 group-hover:text-blue-600" />
            <span>Email Lead</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickAction("MEETING")}
            className="flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 border border-[#D8D8D8] hover:border-purple-200 transition-all cursor-pointer group"
          >
            <Calendar size={13} className="text-gray-500 group-hover:text-purple-600" />
            <span>Log Meeting</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickAction("TASK")}
            className="flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-orange-50 hover:text-orange-700 border border-[#D8D8D8] hover:border-orange-200 transition-all cursor-pointer group"
          >
            <CheckSquare size={13} className="text-gray-500 group-hover:text-orange-600" />
            <span>Task File</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickAction("FOLLOW_UP")}
            className="flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-gray-700 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 border border-[#D8D8D8] hover:border-teal-200 transition-all cursor-pointer group"
          >
            <Clock size={13} className="text-gray-500 group-hover:text-teal-600" />
            <span>SLA FollowUp</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onQuickAction("OPEN_LEAD")}
          className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all cursor-pointer"
        >
          <span>Open Full Lead Overview</span>
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* 3. COGNITIVE AI INSIGHTS PLACEHOLDERS */}
      <div className="bg-[#FAF9FC] border border-[#DDD3E6] rounded-xl p-4 text-left space-y-3 shadow-2xs relative overflow-hidden" id="ai-cognitive-insight-card">
        {/* Subtle decorative purple corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200/20 rounded-full blur-md pointer-events-none" />

        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-purple-600 fill-purple-200 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2F2F]">
            AI Client Co-Pilot Insights
          </h4>
        </div>

        {conversation?.aiInsight ? (
          <div className="space-y-3 text-xs">
            {/* Conversation Summary */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                Co-Pilot Core Summary
              </span>
              <p className="text-gray-600 font-medium leading-relaxed leading-snug">
                {conversation.aiInsight.summary}
              </p>
            </div>

            {/* Sentiment & Intent Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                  Client Sentiment
                </span>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${sentiment.color}`}>
                  {sentiment.text}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                  Client Intent
                </span>
                <span className="text-[10px] font-semibold text-gray-700 font-mono block truncate">
                  {conversation.aiInsight.intent.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Next Best Action */}
            <div className="space-y-1 border-t border-purple-100 pt-2.5">
              <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wider block font-mono flex items-center gap-1">
                <Flame size={10} /> Next Best Action
              </span>
              <p className="text-[#2F2F2F] font-semibold leading-relaxed">
                {conversation.aiInsight.nextBestAction}
              </p>
            </div>

            {/* Conversation Risk */}
            {conversation.aiInsight.riskLevel !== "LOW" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-2 text-[11px] text-amber-800">
                <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block uppercase tracking-wider text-[9px] text-amber-700">
                    SLA Delay Risk ({conversation.aiInsight.riskLevel})
                  </span>
                  <p className="font-medium">{conversation.aiInsight.riskReason || "Pending review"}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <p className="text-gray-500 leading-relaxed font-medium">
              Draft or ingest additional communication histories to initiate real-time intent maps, automatic deal size estimations, and conversation summaries.
            </p>
            <div className="p-2.5 bg-white border border-[#E5E3E7] rounded-lg border-dashed text-center text-gray-400 text-[10px] font-mono">
              ⚡ Awaiting additional thread logs...
            </div>
          </div>
        )}
      </div>

      {/* 4. BUSINESS CORE DIRECTORY */}
      <div className="bg-white border border-[#D8D8D8] rounded-xl p-4 text-left space-y-3 shadow-2xs">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
          Contact Directory
        </span>
        <div className="space-y-2.5 text-xs text-gray-600 font-medium">
          {lead.phone && (
            <div className="flex items-center gap-2.5">
              <Phone size={13} className="text-gray-400 shrink-0" />
              <span className="font-mono">{lead.phone}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2.5">
            <Mail size={13} className="text-gray-400 shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>

          {lead.website && (
            <div className="flex items-center gap-2.5">
              <Globe size={13} className="text-gray-400 shrink-0" />
              <a 
                href={lead.website} 
                target="_blank" 
                rel="noreferrer"
                className="text-purple-600 hover:underline truncate"
              >
                {lead.website.replace(/^https?:\/\//i, "")}
              </a>
            </div>
          )}

          {lead.country && (
            <div className="flex items-center gap-2.5 pt-1 border-t border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono mr-1">Origin:</span>
              <span className="text-gray-700">{lead.country} ({lead.industry || "No Industry Listed"})</span>
            </div>
          )}
        </div>
      </div>

      {/* 5. SMART RESPONSE REMINDERS CARD */}
      <ReminderCard
        reminders={conversation?.reminders || []}
        onAddReminder={onAddReminder}
        onRemoveReminder={onRemoveReminder}
      />
    </div>
  );
};
