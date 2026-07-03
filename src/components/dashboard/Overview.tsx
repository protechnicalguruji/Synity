/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Calendar, Plus, Users, ArrowRight } from "lucide-react";
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
