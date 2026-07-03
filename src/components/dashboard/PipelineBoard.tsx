/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Building,
  MoreHorizontal,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Phone,
  FileText,
  Briefcase,
  AlertTriangle,
  Smile,
  XCircle,
  HelpCircle,
  Activity,
  Calendar,
  Layers,
  Inbox
} from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Lead, LeadStatus, Task, ActivityLog, ActivityType, TaskStatus, TaskPriority } from "../../types";
import { PIPELINE_STAGES } from "../../constants";
import { formatCurrency, getConfidenceColor } from "../../utils";
import { motion, AnimatePresence } from "motion/react";

// Sub-components from our dedicated pipeline folder
import { PipelineColumn } from "../pipeline/PipelineColumn";
import { PipelineCard } from "../pipeline/PipelineCard";
import { WorkflowTimeline } from "../pipeline/WorkflowTimeline";
import { FollowUpQueue } from "../pipeline/FollowUpQueue";
import { CallbackQueue } from "../pipeline/CallbackQueue";
import { MeetingQueue } from "../pipeline/MeetingQueue";
import { ProposalQueue } from "../pipeline/ProposalQueue";
import { NegotiationQueue } from "../pipeline/NegotiationQueue";
import { LostQueue } from "../pipeline/LostQueue";
import { ClosedDeals } from "../pipeline/ClosedDeals";

// Existing details component for full lead viewing
import { LeadDetails } from "../leads/LeadDetails";

interface PipelineBoardProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activities: ActivityLog[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onUpdateLeadStatus: (id: string, status: LeadStatus) => void;
}

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  leads,
  setLeads,
  tasks,
  setTasks,
  activities,
  setActivities,
  onUpdateLeadStatus,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    "KANBAN" | "TODAY_WORK" | "FOLLOW_UP" | "CALLBACK" | "MEETING" | "PROPOSAL" | "NEGOTIATION" | "CLOSED" | "LOST"
  >("KANBAN");

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [industryFilter, setIndustryFilter] = useState("ALL");

  // Inspected Lead Workspace Details
  const [inspectedLead, setInspectedLead] = useState<Lead | null>(null);

  // Mark Lost dialog target
  const [markLostLead, setMarkLostLead] = useState<Lead | null>(null);
  const [lostReason, setLostReason] = useState("");
  const [lostDetails, setLostDetails] = useState("");

  // Skeleton loading simulation for crisp transitions
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (tab: typeof activeTab) => {
    setIsLoading(true);
    setActiveTab(tab);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  };

  // Extract unique industries from leads to populate dynamic dropdown filter
  const industries = ["ALL", ...Array.from(new Set(leads.map(l => l.industry).filter(Boolean)))];

  // Core filter logic matching extensive criteria
  const filteredLeads = leads.filter(lead => {
    // Search query constraint
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = lead.name.toLowerCase().includes(q);
      const companyMatch = lead.company.toLowerCase().includes(q);
      const industryMatch = lead.industry?.toLowerCase().includes(q);
      if (!nameMatch && !companyMatch && !industryMatch) return false;
    }

    // Priority filter
    if (priorityFilter !== "ALL" && lead.priority !== priorityFilter) {
      return false;
    }

    // Industry filter
    if (industryFilter !== "ALL" && lead.industry !== industryFilter) {
      return false;
    }

    return true;
  });

  // Calculate overall metrics
  const totalLeadsCount = leads.length;
  const pipelineWeightedValue = leads.reduce(
    (sum, l) => sum + l.value * (l.confidenceScore / 100),
    0
  );
  const totalContractValue = leads.reduce((sum, l) => sum + l.value, 0);

  // Drag & drop stage transfer updates
  const handleDropLead = (leadId: string, targetStatus: LeadStatus) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    if (lead.status === targetStatus) return;

    const prevStatus = lead.status;

    // Intercept CLOSED_LOST drag to require reasons
    if (targetStatus === LeadStatus.CLOSED_LOST) {
      setMarkLostLead(lead);
      return;
    }

    // Update state
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          return {
            ...l,
            status: targetStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      })
    );

    // Create Automated Activity Log
    const srcName = PIPELINE_STAGES.find(s => s.status === prevStatus)?.name || prevStatus;
    const dstName = PIPELINE_STAGES.find(s => s.status === targetStatus)?.name || targetStatus;

    const act: ActivityLog = {
      id: `act-board-drop-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.STATE_CHANGE,
      title: `Pipeline Block Relocated: ${dstName}`,
      description: `Lead moved manually via Kanban Board from '${srcName}' segment into '${dstName}' workflow slot.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    // Simple alert-based toast confirmation for UX
    alert(`Successfully moved ${lead.company} to ${dstName}!`);
  };

  // Exit Lost Reason Confirmation Submitter
  const handleMarkLostConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!markLostLead || !lostReason) return;

    setLeads(prev =>
      prev.map(l => {
        if (l.id === markLostLead.id) {
          return {
            ...l,
            status: LeadStatus.CLOSED_LOST,
            confidenceScore: 0,
            notes: `LOST REASON: ${lostReason}\nLOST DETAILS: ${lostDetails || "None"}\n\n${l.notes || ""}`,
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      })
    );

    // Create Activity Log
    const act: ActivityLog = {
      id: `act-closed-lost-${Date.now()}`,
      leadId: markLostLead.id,
      leadName: markLostLead.name,
      type: ActivityType.STATE_CHANGE,
      title: `Deal Lost ❌ - ${lostReason}`,
      description: `Exited sales funnel. Reason: ${lostReason}. exit details: ${lostDetails || "None"}.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    setMarkLostLead(null);
    setLostReason("");
    setLostDetails("");
    alert("Deal archived in CLOSED LOST repository. Analytics compiled.");
  };

  // Card Quick Actions Callbacks
  const handleQuickCall = (lead: Lead) => {
    const act: ActivityLog = {
      id: `act-call-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.CALL,
      title: "Outbound Dialing Connected 📞",
      description: `Simulated a phone call session to ${lead.phone}. Connected with client successfully.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);
    alert(`Simulating outbound dialing to ${lead.name} (${lead.company}) at ${lead.phone}.\nConnection established and logged to history!`);
  };

  const handleQuickWhatsapp = (lead: Lead) => {
    // Automatically transition NEW or CALLED status to WHATSAPP_SENT
    setLeads(prev =>
      prev.map(l => {
        if (l.id === lead.id && (l.status === LeadStatus.NEW || l.status === LeadStatus.CALLED)) {
          return {
            ...l,
            status: LeadStatus.WHATSAPP_SENT,
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      })
    );

    const act: ActivityLog = {
      id: `act-wa-quick-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.EMAIL,
      title: "WhatsApp Dispatch Sent 💬",
      description: `Dispatched Synity interactive slides and callback link to client's WhatsApp chat.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);
    alert(`WhatsApp brochure dispatched. Stage updated to WHATSAPP_SENT and logged in CRM!`);
  };

  const handleScheduleFollowUpRedirect = (lead: Lead) => {
    setActiveTab("CALLBACK");
    alert(`Redirected to Callback Scheduler. ${lead.company} has been queued.`);
  };

  const handleQuickTaskAdd = (lead: Lead) => {
    const title = prompt(`Enter custom client action task for ${lead.company}:`, "Verify security compliance parameters");
    if (!title) return;

    const newTask: Task = {
      id: `task-manual-lead-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      title,
      description: `Direct action item created from Sales Pipeline workspace.`,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO
    };

    setTasks(prev => [newTask, ...prev]);

    const act: ActivityLog = {
      id: `act-task-add-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.CALL,
      title: `Team Task Commissioned: ${title}`,
      description: `Booked a new action task: "${title}". Allocated to workday agenda.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);
    alert(`Task created. Registered in workspace calendar.`);
  };

  const handleSaveInspectEdit = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => (l.id === updatedLead.id ? updatedLead : l)));
    setInspectedLead(updatedLead);
  };

  // Calculate Counts for sub-tabs badging
  const pendingFollowUpsCount = leads.filter(
    l => l.nextFollowUp && l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST
  ).length;

  const noAnswerLeadsCount = leads.filter(l => l.status === LeadStatus.NO_ANSWER).length;
  const proposalLeadsCount = leads.filter(l => l.status === LeadStatus.PROPOSAL).length;
  const negotiationLeadsCount = leads.filter(l => l.status === LeadStatus.NEGOTIATION).length;

  // Filter Today's workspace data
  const getTodayAgenda = () => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const todayCalls = filteredLeads.filter(
      l => (l.status === LeadStatus.CALLED || l.status === LeadStatus.NO_ANSWER) && l.nextFollowUp?.startsWith(todayStr)
    );
    const todayFollowUps = filteredLeads.filter(
      l => l.nextFollowUp?.startsWith(todayStr) && l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST
    );
    const todayMeetings = tasks.filter(
      t => t.title.startsWith("📅 Meeting:") && t.dueDate?.startsWith(todayStr) && t.status !== TaskStatus.DONE
    );
    const todayProposals = filteredLeads.filter(
      l => l.status === LeadStatus.PROPOSAL && l.updatedAt?.startsWith(todayStr)
    );

    return {
      calls: todayCalls,
      followUps: todayFollowUps,
      meetings: todayMeetings,
      proposals: todayProposals
    };
  };

  const todayAgenda = getTodayAgenda();
  const todayWorkTotalCount = todayAgenda.calls.length + todayAgenda.followUps.length + todayAgenda.meetings.length + todayAgenda.proposals.length;

  // Render Full Workspace details if lead is inspected
  if (inspectedLead) {
    return (
      <LeadDetails
        lead={inspectedLead}
        tasks={tasks}
        activities={activities}
        onBack={() => setInspectedLead(null)}
        onUpdateLead={handleSaveInspectEdit}
        onAddTask={newTask => setTasks(prev => [newTask, ...prev])}
        onAddActivity={newActivity => setActivities(prev => [newActivity, ...prev])}
      />
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* 1. TOP HEADER HERO SUMMARY BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 border border-[#D8D8D8] rounded-2xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#4E4E49] text-white rounded-lg">
              <Layers size={14} />
            </span>
            <h2 className="text-lg font-black font-display text-[#2F2F2F] tracking-tight">Sales Workflow Engine</h2>
          </div>
          <p className="text-xs text-[#666666]">
            Configure closing funnels, schedule call alarms, log executive proposals, and run diagnostic exit analytics.
          </p>
        </div>

        {/* Aggregate weighted indicators */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono z-10">
          <div className="px-4 py-2 bg-slate-50 border border-slate-200/50 rounded-xl">
            <span className="block text-[8px] uppercase font-bold text-gray-400">Pipeline Weighted Size</span>
            <strong className="text-gray-800 font-extrabold text-sm">{formatCurrency(pipelineWeightedValue)}</strong>
          </div>
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
            <span className="block text-[8px] uppercase font-bold text-emerald-600">Total Contract Value</span>
            <strong className="text-emerald-700 font-extrabold text-sm">{formatCurrency(totalContractValue)}</strong>
          </div>
        </div>
      </div>

      {/* 2. ADVANCED CONTROL BAR: FILTERING, SEARCHING & QUICK SEARCH */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 border border-[#D8D8D8] rounded-xl text-xs">
        {/* Instant Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search entire pipeline instantly by owner, business, sector..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#E5E3E7]/20 border border-[#D8D8D8] hover:border-gray-300 rounded-lg pl-9 pr-4 py-2 text-xs outline-none text-[#2F2F2F] font-medium"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-gray-400" />
            <span className="font-bold text-gray-500 uppercase text-[9px] font-mono">Priority:</span>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="bg-[#E5E3E7]/20 border border-[#D8D8D8] rounded-lg px-2.5 py-1.5 font-bold outline-none text-gray-700 cursor-pointer"
            >
              <option value="ALL">All priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-500 uppercase text-[9px] font-mono">Sector:</span>
            <select
              value={industryFilter}
              onChange={e => setIndustryFilter(e.target.value)}
              className="bg-[#E5E3E7]/20 border border-[#D8D8D8] rounded-lg px-2.5 py-1.5 font-bold outline-none text-gray-700 cursor-pointer max-w-[140px]"
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>
                  {ind === "ALL" ? "All Sectors" : ind}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. MULTI-MODULE WORKFLOW AGENDA NAVIGATION TAB BAR */}
      <div className="flex items-center border-b border-[#D8D8D8] overflow-x-auto gap-1 pb-1 select-none Scrollbar-styled">
        <button
          onClick={() => handleTabChange("KANBAN")}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "KANBAN"
              ? "bg-[#4E4E49]/10 text-[#2F2F2F] border-b-2 border-[#4E4E49]"
              : "text-gray-500 hover:text-[#2F2F2F] hover:bg-gray-100/50"
          }`}
        >
          <Layers size={13} />
          Kanban Board
        </button>

        <button
          onClick={() => handleTabChange("TODAY_WORK")}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "TODAY_WORK"
              ? "bg-[#4E4E49]/10 text-[#2F2F2F] border-b-2 border-[#4E4E49]"
              : "text-gray-500 hover:text-[#2F2F2F] hover:bg-gray-100/50"
          }`}
        >
          <Activity size={13} />
          Today's Agenda
          {todayWorkTotalCount > 0 && (
            <span className="bg-red-500 text-white rounded-full text-[9px] px-1.5 font-mono font-bold animate-pulse">
              {todayWorkTotalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange("FOLLOW_UP")}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "FOLLOW_UP"
              ? "bg-[#4E4E49]/10 text-[#2F2F2F] border-b-2 border-[#4E4E49]"
              : "text-gray-500 hover:text-[#2F2F2F] hover:bg-gray-100/50"
          }`}
        >
          <Clock size={13} />
          Follow-up Queue
          {pendingFollowUpsCount > 0 && (
            <span className="bg-amber-600 text-white rounded-full text-[9px] px-1.5 font-mono font-bold">
              {pendingFollowUpsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange("CALLBACK")}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "CALLBACK"
              ? "bg-[#4E4E49]/10 text-[#2F2F2F] border-b-2 border-[#4E4E49]"
              : "text-gray-500 hover:text-[#2F2F2F] hover:bg-gray-100/50"
          }`}
        >
          <Phone size={13} />
          Callbacks & No-Answer
          {noAnswerLeadsCount > 0 && (
            <span className="bg-rose-600 text-white rounded-full text-[9px] px-1.5 font-mono font-bold">
              {noAnswerLeadsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange("MEETING")}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "MEETING"
              ? "bg-[#4E4E49]/10 text-[#2F2F2F] border-b-2 border-[#4E4E49]"
              : "text-gray-500 hover:text-[#2F2F2F] hover:bg-gray-100/50"
          }`}
        >
          <Calendar size={13} />
          Meeting Sync
        </button>

        <button
          onClick={() => handleTabChange("PROPOSAL")}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "PROPOSAL"
              ? "bg-[#4E4E49]/10 text-[#2F2F2F] border-b-2 border-[#4E4E49]"
              : "text-gray-500 hover:text-[#2F2F2F] hover:bg-gray-100/50"
          }`}
        >
          <FileText size={13} />
          Proposals
          {proposalLeadsCount > 0 && (
            <span className="bg-[#8E44AD] text-white rounded-full text-[9px] px-1.5 font-mono font-bold">
              {proposalLeadsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange("NEGOTIATION")}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "NEGOTIATION"
              ? "bg-[#4E4E49]/10 text-[#2F2F2F] border-b-2 border-[#4E4E49]"
              : "text-gray-500 hover:text-[#2F2F2F] hover:bg-gray-100/50"
          }`}
        >
          <Briefcase size={13} />
          Negotiation
          {negotiationLeadsCount > 0 && (
            <span className="bg-blue-600 text-white rounded-full text-[9px] px-1.5 font-mono font-bold">
              {negotiationLeadsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange("CLOSED")}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "CLOSED"
              ? "bg-[#4E4E49]/10 text-[#2F2F2F] border-b-2 border-[#4E4E49]"
              : "text-gray-500 hover:text-[#2F2F2F] hover:bg-gray-100/50"
          }`}
        >
          <Smile size={13} className="text-emerald-600" />
          Won Deals
        </button>

        <button
          onClick={() => handleTabChange("LOST")}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === "LOST"
              ? "bg-[#4E4E49]/10 text-[#2F2F2F] border-b-2 border-[#4E4E49]"
              : "text-gray-500 hover:text-[#2F2F2F] hover:bg-gray-100/50"
          }`}
        >
          <XCircle size={13} className="text-rose-600" />
          Lost Archives
        </button>
      </div>

      {/* 4. DYNAMIC VIEWS CONTAINER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + (isLoading ? "-loading" : "-ready")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="min-h-[450px]"
        >
          {isLoading ? (
            /* Premium Skeleton loading panel */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-16 bg-white border border-[#D8D8D8] rounded-xl animate-pulse" />
                <div className="h-16 bg-white border border-[#D8D8D8] rounded-xl animate-pulse" />
                <div className="h-16 bg-white border border-[#D8D8D8] rounded-xl animate-pulse" />
              </div>
              <div className="h-96 bg-[#E5E3E7]/20 border border-[#D8D8D8] rounded-2xl animate-pulse" />
            </div>
          ) : activeTab === "KANBAN" ? (
            /* Horizontal scrolling Kanban Board */
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x select-none Scrollbar-styled">
              {PIPELINE_STAGES.map(stage => {
                const stageLeads = filteredLeads.filter(l => l.status === stage.status);

                return (
                  <PipelineColumn
                    key={stage.id}
                    stage={stage}
                    leads={stageLeads}
                    onDropLead={handleDropLead}
                  >
                    {stageLeads.map(lead => (
                      <PipelineCard
                        key={lead.id}
                        lead={lead}
                        onOpenDetails={setInspectedLead}
                        onQuickCall={handleQuickCall}
                        onQuickWhatsapp={handleQuickWhatsapp}
                        onScheduleFollowUp={handleScheduleFollowUpRedirect}
                        onAddTask={handleQuickTaskAdd}
                      />
                    ))}
                  </PipelineColumn>
                );
              })}
            </div>
          ) : activeTab === "TODAY_WORK" ? (
            /* Special Today's Work workspace */
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/45 border border-blue-100 rounded-xl flex items-start gap-2 text-xs text-blue-800 leading-normal">
                <Sparkles size={16} className="text-[#8CB9D7] shrink-0 mt-0.5 animate-pulse" />
                <span>
                  <strong>Executive Workday Agenda:</strong> This panel aggregates all sales client sync tasks scheduled specifically for today. Direct integration with calendar databases optimizes follow-up cycles automatically.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section A: Calls & Follow ups */}
                <Card className="p-4 border border-[#D8D8D8] bg-white space-y-3">
                  <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={13} className="text-amber-500 animate-spin" />
                    Today's Call Queue ({todayAgenda.calls.length + todayAgenda.followUps.length})
                  </h4>

                  {todayAgenda.calls.length === 0 && todayAgenda.followUps.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-[10px] uppercase font-mono">
                      No dialer tasks for today.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {[...todayAgenda.calls, ...todayAgenda.followUps].map(l => (
                        <div key={l.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center text-xs">
                          <div className="text-left">
                            <span className="block font-bold text-slate-800">{l.company}</span>
                            <span className="block text-[10px] text-gray-400">Contact: {l.name}</span>
                          </div>
                          <div className="flex gap-1.5">
                            {l.phone && (
                              <button
                                onClick={() => handleQuickCall(l)}
                                className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                <Phone size={10} />
                              </button>
                            )}
                            <button
                              onClick={() => setInspectedLead(l)}
                              className="px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 text-[10px] font-bold"
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Section B: Scheduled Meetings */}
                <Card className="p-4 border border-[#D8D8D8] bg-white space-y-3">
                  <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={13} className="text-blue-500" />
                    Today's Scheduled Syncs ({todayAgenda.meetings.length})
                  </h4>

                  {todayAgenda.meetings.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-[10px] uppercase font-mono">
                      No meetings booked for today.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {todayAgenda.meetings.map(t => (
                        <div key={t.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between items-center">
                          <div className="text-left">
                            <span className="block font-bold text-slate-800">{t.title}</span>
                            <span className="block text-[10px] text-gray-400">{t.description}</span>
                          </div>
                          <button
                            onClick={() => {
                              const target = leads.find(l => l.id === t.leadId);
                              if (target) setInspectedLead(target);
                            }}
                            className="px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 text-[10px] font-bold"
                          >
                            Open Lead
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          ) : activeTab === "FOLLOW_UP" ? (
            /* Follow-up Manager */
            <FollowUpQueue
              leads={filteredLeads}
              onOpenDetails={setInspectedLead}
              onUpdateFollowUp={(id, date) => {
                setLeads(prev =>
                  prev.map(l => (l.id === id ? { ...l, nextFollowUp: date, updatedAt: new Date().toISOString() } : l))
                );
              }}
              onAddActivity={act => setActivities(prev => [act, ...prev])}
            />
          ) : activeTab === "CALLBACK" ? (
            /* Callback appointment scheduler */
            <CallbackQueue
              leads={filteredLeads}
              tasks={tasks}
              setLeads={setLeads}
              setTasks={setTasks}
              activities={activities}
              setActivities={setActivities}
              onOpenDetails={setInspectedLead}
            />
          ) : activeTab === "MEETING" ? (
            /* Calendar Meetings sync manager */
            <MeetingQueue
              leads={filteredLeads}
              tasks={tasks}
              setLeads={setLeads}
              setTasks={setTasks}
              activities={activities}
              setActivities={setActivities}
              onOpenDetails={setInspectedLead}
            />
          ) : activeTab === "PROPOSAL" ? (
            /* Proposal draft list */
            <ProposalQueue
              leads={filteredLeads}
              setLeads={setLeads}
              activities={activities}
              setActivities={setActivities}
              onOpenDetails={setInspectedLead}
            />
          ) : activeTab === "NEGOTIATION" ? (
            /* Legal negotiations list */
            <NegotiationQueue
              leads={filteredLeads}
              setLeads={setLeads}
              activities={activities}
              setActivities={setActivities}
              onOpenDetails={setInspectedLead}
              onMarkLostClick={setMarkLostLead}
            />
          ) : activeTab === "CLOSED" ? (
            /* Closed Won List */
            <ClosedDeals leads={filteredLeads} onOpenDetails={setInspectedLead} />
          ) : (
            /* Closed Lost archives */
            <LostQueue
              leads={filteredLeads}
              setLeads={setLeads}
              activities={activities}
              setActivities={setActivities}
              onOpenDetails={setInspectedLead}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 5. INTERACTIVE CLOSED LOST REQUIRE EXIT FEEDBACK MODAL */}
      {markLostLead && (
        <Modal
          isOpen={!!markLostLead}
          onClose={() => setMarkLostLead(null)}
          title={
            <span className="flex items-center gap-2 text-rose-700 font-bold font-display">
              <AlertTriangle size={16} />
              Archive Deal as Closed Lost
            </span>
          }
          size="sm"
        >
          <form onSubmit={handleMarkLostConfirm} className="space-y-4 text-xs text-left">
            <p className="text-[#666666] leading-relaxed">
              Archiving <strong className="text-slate-800">{markLostLead.company}</strong> as lost requires compiling exit diagnostic logs for agency audit reports.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Lost Exit Reason</label>
              <select
                required
                value={lostReason}
                onChange={e => setLostReason(e.target.value)}
                className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2.5 text-[#2F2F2F] outline-none"
              >
                <option value="">-- Choose Exit Reason --</option>
                <option value="Pricing / Budget Shifting">Pricing / Budget Shifting</option>
                <option value="Lost to Competitor">Lost to Competitor</option>
                <option value="Ghosted / No Response">Ghosted / No Response</option>
                <option value="Timing / Postponed">Timing / Postponed</option>
                <option value="Missing Crucial Features">Missing Crucial Features</option>
                <option value="Other">Other Exit Causes</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Exit Comments & feedback</label>
              <textarea
                rows={3}
                placeholder="Details of competitor pitch or missing features..."
                value={lostDetails}
                onChange={e => setLostDetails(e.target.value)}
                className="block w-full rounded-lg border border-[#D8D8D8] bg-white p-2.5 outline-none text-xs text-[#2F2F2F] leading-normal resize-none"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2.5">
              <Button type="button" variant="outline" onClick={() => setMarkLostLead(null)}>
                Cancel
              </Button>
              <Button
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                type="submit"
                disabled={!lostReason}
              >
                Archive Closed Lost Account
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
