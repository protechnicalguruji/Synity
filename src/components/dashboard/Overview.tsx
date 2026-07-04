/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Calendar, Plus, Users, ArrowRight, RefreshCw, AlertCircle, ShieldAlert, GraduationCap } from "lucide-react";
import { MissionCard } from "./MissionCard";
import { PriorityLeadCard } from "./PriorityLeadCard";
import { TaskCard } from "./TaskCard";
import { CallbackCard } from "./CallbackCard";
import { PipelineCard } from "./PipelineCard";
import { RecentActivity } from "./RecentActivity";
import { WeeklyProgress } from "./WeeklyProgress";
import { MonthlyStats } from "./MonthlyStats";
import { AIRecommendationCard } from "./AIRecommendationCard";
import { QuickActions } from "./QuickActions";
import { Lead, Task, ActivityLog } from "../../types";
import { useGlobalAI } from "../../lib/ai/hooks/useAI";
import { AISummary } from "../ai/AISummary";
import { CoachingCard } from "../ai/CoachingCard";
import { RiskCard } from "../ai/RiskCard";

interface OverviewProps {
  leads: Lead[];
  tasks: Task[];
  activities: ActivityLog[];
  onChangeTab: (tab: string) => void;
  onToggleTaskStatus: (id: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  leads,
  tasks,
  activities,
  onChangeTab,
  onToggleTaskStatus,
}) => {
  const [activeStageFilter, setActiveStageFilter] = useState<string>("");

  // Global AI sales intelligence metrics & advisor tips
  const activeTasksCount = tasks.filter(t => t.status !== "DONE").length;
  const {
    loading: aiLoading,
    error: aiError,
    dailySummary,
    coachingTips,
    detectedRisks,
    refetch: refetchGlobalAI
  } = useGlobalAI(leads, tasks, activities);

  // Handle opening lead: changes tab to leads and can let leads list handle filter if needed
  const handleOpenLead = (leadId: string) => {
    onChangeTab("leads");
  };

  // Handle stage click from Pipeline Card: can filter active leads list
  const handleStageClick = (stage: string) => {
    setActiveStageFilter(stage);
    onChangeTab("pipeline");
  };

  // Handle quick shortcut action dispatchers
  const handleAddLeadAction = () => {
    // We can simulate opening the new lead modal by querying the global button click,
    // or since TopNav is in App.tsx, we can trigger the native form or tell the user how to trigger it!
    // Let's click the "New Lead" button inside the DOM dynamically to open the modal seamlessly!
    const addLeadBtn = document.querySelector('button[id^="qa-add-lead"]') || document.querySelector('button:has-text("New Lead")');
    if (addLeadBtn) {
      (addLeadBtn as HTMLButtonElement).click();
    } else {
      onChangeTab("leads");
    }
  };

  const handleImportLeadsAction = () => {
    onChangeTab("leads");
  };

  const handleScheduleMeetingAction = () => {
    onChangeTab("tasks");
  };

  const handleAddTaskAction = () => {
    onChangeTab("tasks");
  };

  const handleCoachingAction = (label: string) => {
    if (label.includes("Rescue") || label.includes("Filter")) {
      onChangeTab("leads");
    } else if (label.includes("Performance")) {
      onChangeTab("analytics");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8" id="synity-dashboard-main">
      {/* Top Section: Today's Mission & AI Coaching Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MissionCard leads={leads} tasks={tasks} />
        </div>
        <div className="lg:col-span-1">
          <AIRecommendationCard onAction={handleCoachingAction} />
        </div>
      </div>

      {/* Quick Administration Shortcuts Row */}
      <QuickActions
        onAddLead={handleAddLeadAction}
        onImportLeads={handleImportLeadsAction}
        onScheduleMeeting={handleScheduleMeetingAction}
        onAddTask={handleAddTaskAction}
      />

      {/* Synity AI Intelligence Hub Dashboard Integration */}
      <div className="bg-white border border-[#D8D8D8] rounded-2xl p-6 space-y-6" id="ai-intelligence-hub-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="space-y-1 text-left">
            <h3 className="text-base font-display font-bold text-[#2F2F2F] flex items-center gap-2">
              <Sparkles className="text-purple-600 animate-pulse" size={18} />
              Synity AI Intelligence Hub
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Cognitive CRM assistant monitoring lead responsiveness, pipeline friction, and sales coaches.
            </p>
          </div>
          <button
            disabled={aiLoading}
            onClick={() => refetchGlobalAI(activeTasksCount, 5)}
            className="px-3 py-1.5 rounded-lg border border-[#D8D8D8] bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw size={12} className={aiLoading ? "animate-spin" : ""} />
            {aiLoading ? "Recalibrating..." : "Calibrate Pipeline"}
          </button>
        </div>

        {aiError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 flex items-center gap-2 text-left">
            <AlertCircle size={14} className="shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {/* 1. Daily Summary Panel */}
        <AISummary summary={dailySummary} loading={aiLoading} />

        {/* 2. Coaching & Threat Diagnostic bento split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Coaching Cards */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 text-left flex items-center gap-1.5">
              <GraduationCap size={14} className="text-purple-500" />
              Strategic Conversion Coaching
            </h4>
            <CoachingCard tips={coachingTips} loading={aiLoading} />
          </div>

          {/* Stagnancy Risks Lists */}
          <div className="lg:col-span-1 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 text-left flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-red-500" />
              Outstanding Pipeline Anomalies
            </h4>
            <RiskCard risks={detectedRisks} loading={aiLoading} />
          </div>
        </div>
      </div>

      {/* Middle Grid: Priorities and Timeline checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Columns: AI Priority Pipeline & Pipeline Status Counts */}
        <div className="lg:col-span-2 space-y-6">
          <PriorityLeadCard leads={leads} onOpenLead={handleOpenLead} />
          <PipelineCard
            leads={leads}
            onStageClick={handleStageClick}
            activeStage={activeStageFilter}
          />
        </div>

        {/* Right Column: Workday Action Checklist & Callback Countdown timers */}
        <div className="lg:col-span-1 space-y-6">
          <TaskCard
            tasks={tasks}
            onToggleTaskStatus={onToggleTaskStatus}
            onAddTaskClick={() => onChangeTab("tasks")}
          />
          <CallbackCard leads={leads} onOpenLead={handleOpenLead} />
        </div>
      </div>

      {/* Bottom Performance and History section */}
      <div className="space-y-6">
        {/* Weekly Operational Targets progress */}
        <WeeklyProgress leads={leads} tasks={tasks} activities={activities} />

        {/* Monthly Performance aggregated statistics */}
        <MonthlyStats leads={leads} tasks={tasks} activities={activities} />

        {/* Live logs activity feed stream */}
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
};
