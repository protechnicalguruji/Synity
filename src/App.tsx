/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sidebar } from "./components/shared/Sidebar";
import { TopNav } from "./components/shared/TopNav";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { Modal } from "./components/ui/Modal";
import { Input, TextArea, Select } from "./components/ui/Input";
import { Button } from "./components/ui/Button";

// View modules
import { Overview } from "./components/dashboard/Overview";
import { LeadsHub } from "./components/dashboard/LeadsHub";
import { PipelineBoard } from "./components/dashboard/PipelineBoard";
import { TasksView } from "./components/dashboard/TasksView";
import { AnalyticsDashboard } from "./components/dashboard/AnalyticsDashboard";
import { SettingsView } from "./components/dashboard/SettingsView";
import { TodayView } from "./components/dashboard/TodayView";

// Data & constants
import {
  MOCK_LEADS,
  MOCK_TASKS,
  MOCK_ACTIVITIES,
  LEAD_SOURCES
} from "./constants";
import { Lead, LeadStatus, Task, TaskPriority, TaskStatus, ActivityType, ActivityLog } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, UserPlus, FileText } from "lucide-react";

// Auth integrations
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { LoginView } from "./components/auth/LoginView";
import { SignupView } from "./components/auth/SignupView";
import { ForgotPasswordView } from "./components/auth/ForgotPasswordView";
import { ResetPasswordView } from "./components/auth/ResetPasswordView";
import { Spinner } from "./components/ui/Loading";

function AppContent() {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState<"login" | "signup" | "forgot" | "reset">("login");

  // Navigation & Drawer States
  const [currentTab, setCurrentTab] = useState<string>("today");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  // Core Repositories State
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activities, setActivities] = useState<ActivityLog[]>(MOCK_ACTIVITIES);

  // New Lead Form Fields
  const [formName, setFormName] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formStatus, setFormStatus] = useState<LeadStatus>(LeadStatus.NEW);
  const [formSource, setFormSource] = useState(LEAD_SOURCES[0]);
  const [formNotes, setFormNotes] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#E5E3E7]/40 text-[#2F2F2F] font-sans">
        <Spinner size="lg" />
        <p className="mt-4 text-xs font-mono text-[#666666] tracking-wider uppercase">Loading Synity Sales OS...</p>
      </div>
    );
  }

  if (!user) {
    switch (authScreen) {
      case "signup":
        return <SignupView onNavigate={setAuthScreen} />;
      case "forgot":
        return <ForgotPasswordView onNavigate={setAuthScreen} />;
      case "reset":
        return <ResetPasswordView onNavigate={setAuthScreen} />;
      case "login":
      default:
        return <LoginView onNavigate={setAuthScreen} />;
    }
  }

  // -----------------------------------------------------------------
  // LEAD CALLBACK DISPATCHERS
  // -----------------------------------------------------------------
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCompany.trim() || !formValue || !formEmail.trim()) return;

    // Simulate standard AI lead scoring (high value + referral = higher propensities)
    let basePropensity = 50;
    if (Number(formValue) > 50000) basePropensity += 20;
    if (formSource === "Partner Referral") basePropensity += 15;
    if (formNotes.toLowerCase().includes("urgent") || formNotes.toLowerCase().includes("ready")) basePropensity += 15;
    const finalPropensity = Math.min(98, basePropensity);

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: formName,
      company: formCompany,
      value: Number(formValue),
      email: formEmail,
      phone: formPhone || undefined,
      status: formStatus,
      source: formSource,
      priority: "MEDIUM",
      notes: formNotes || undefined,
      createdAt: new Date().toISOString(),
      confidenceScore: finalPropensity,
      nextFollowUp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days out standard follow-up
    };

    setLeads([newLead, ...leads]);

    // Record activity log
    const activity: ActivityLog = {
      id: `act-${Date.now()}`,
      leadId: newLead.id,
      leadName: newLead.name,
      type: ActivityType.STATE_CHANGE,
      title: `Opportunity Registered: ${newLead.company}`,
      description: `${newLead.name} added as a potential contract worth $${newLead.value.toLocaleString()} with AI propensity score: ${newLead.confidenceScore}%`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities([activity, ...activities]);

    // Add automatic onboarding task to warm them up
    const onboardingTask: Task = {
      id: `task-${Date.now()}`,
      leadId: newLead.id,
      leadName: newLead.name,
      title: `Generate AI introductory brief for ${newLead.name}`,
      description: `Synthesize previous interactions & construct a custom pricing workflow tailored to ${newLead.company}.`,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day out
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO
    };
    setTasks([onboardingTask, ...tasks]);

    // Reset Form & Close
    setFormName("");
    setFormCompany("");
    setFormValue("");
    setFormEmail("");
    setFormPhone("");
    setFormStatus(LeadStatus.NEW);
    setFormSource(LEAD_SOURCES[0]);
    setFormNotes("");
    setIsNewLeadModalOpen(false);
  };

  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === leadId) {
        // Record status change activity
        const activity: ActivityLog = {
          id: `act-${Date.now()}`,
          leadId: lead.id,
          leadName: lead.name,
          type: ActivityType.STATE_CHANGE,
          title: `Deal Stage Transitioned`,
          description: `${lead.name} (${lead.company}) shifted from ${lead.status} to ${status}.`,
          timestamp: new Date().toISOString(),
          userName: "Alex Rivers"
        };
        setActivities((prev) => [activity, ...prev]);

        return { ...lead, status };
      }
      return lead;
    });
    setLeads(updatedLeads);
  };

  const handleDeleteLead = (id: string) => {
    const leadToDelete = leads.find((l) => l.id === id);
    if (!leadToDelete) return;

    if (window.confirm(`Are you sure you want to remove ${leadToDelete.name} (${leadToDelete.company})? This action is irreversible.`)) {
      setLeads(leads.filter((l) => l.id !== id));
      // Delete child tasks associated
      setTasks(tasks.filter((t) => t.leadId !== id));

      // Record activity
      const activity: ActivityLog = {
        id: `act-${Date.now()}`,
        type: ActivityType.STATE_CHANGE,
        title: `Opportunity Removed`,
        description: `Lead profile for ${leadToDelete.name} (${leadToDelete.company}) has been purged from system.`,
        timestamp: new Date().toISOString(),
        userName: "Alex Rivers"
      };
      setActivities((prev) => [activity, ...prev]);
    }
  };

  // -----------------------------------------------------------------
  // TASK CALLBACK DISPATCHERS
  // -----------------------------------------------------------------
  const handleAddTask = (taskInput: Omit<Task, "id">) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...taskInput
    };
    setTasks([newTask, ...tasks]);

    // Record activity log
    const activity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: ActivityType.NOTE,
      title: `Scheduled Workday Action`,
      description: `Task scheduled: "${newTask.title}" is flagged at ${newTask.priority} priority.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities([activity, ...activities]);
  };

  const handleToggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
          
          if (newStatus === TaskStatus.DONE) {
            // Log completed task activity
            const activity: ActivityLog = {
              id: `act-${Date.now()}`,
              type: ActivityType.CALL,
              title: `Task Marked Completed ✅`,
              description: `Action item accomplished: "${t.title}".`,
              timestamp: new Date().toISOString(),
              userName: "Alex Rivers"
            };
            setActivities((prev) => [activity, ...prev]);
          }

          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // -----------------------------------------------------------------
  // ROUTE / VIEW MANAGER
  // -----------------------------------------------------------------
  const renderActiveModule = () => {
    switch (currentTab) {
      case "today":
        return (
          <TodayView
            leads={leads}
            setLeads={setLeads}
            tasks={tasks}
            setTasks={setTasks}
            activities={activities}
            setActivities={setActivities}
          />
        );
      case "dashboard":
        return (
          <Overview
            leads={leads}
            tasks={tasks}
            activities={activities}
            onChangeTab={setCurrentTab}
            onToggleTaskStatus={handleToggleTaskStatus}
          />
        );
      case "leads":
        return (
          <LeadsHub
            leads={leads}
            setLeads={setLeads}
            tasks={tasks}
            setTasks={setTasks}
            activities={activities}
            setActivities={setActivities}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onDeleteLead={handleDeleteLead}
            onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
          />
        );
      case "pipeline":
        return (
          <PipelineBoard
            leads={leads}
            setLeads={setLeads}
            tasks={tasks}
            setTasks={setTasks}
            activities={activities}
            setActivities={setActivities}
            onUpdateLeadStatus={handleUpdateLeadStatus}
          />
        );
      case "tasks":
        return (
          <TasksView
            tasks={tasks}
            leads={leads}
            onAddTask={handleAddTask}
            onToggleTaskStatus={handleToggleTaskStatus}
            onDeleteTask={handleDeleteTask}
          />
        );
      case "analytics":
        return <AnalyticsDashboard leads={leads} />;
      case "settings":
        return <SettingsView />;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-bold text-[#2F2F2F]">Module under active construction</h3>
            <p className="text-sm text-gray-500 mt-2">Check back soon for upcoming upgrades.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-[#E5E3E7]/40 text-[#2F2F2F]">
      
      {/* Structural Sidebar Left */}
      <Sidebar
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame Right */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header navigation bar */}
        <TopNav
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
        />

        {/* Dynamic Canvas Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {renderActiveModule()}
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* GLOBAL CREATE NEW LEAD POPUP FORM MODAL */}
      <Modal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        title={
          <span className="flex items-center gap-2">
            <UserPlus size={18} className="text-[#4E4E49]" />
            Register New Outbound Lead
          </span>
        }
        size="md"
      >
        <form onSubmit={handleAddLead} className="space-y-4 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Full Name"
              placeholder="e.g. David Hassel"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              id="lead-form-name"
            />
            <Input
              label="Organization/Company"
              placeholder="e.g. Zenith Analytics Co."
              value={formCompany}
              onChange={(e) => setFormCompany(e.target.value)}
              required
              id="lead-form-company"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Bespoke Contract Value ($ USD)"
              placeholder="e.g. 25000"
              type="number"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              required
              id="lead-form-value"
            />
            <Input
              label="Primary Email Address"
              placeholder="e.g. david@zenith.com"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
              id="lead-form-email"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Connection (Optional)"
              placeholder="e.g. +1 555-014-9922"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              id="lead-form-phone"
            />
            
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#2F2F2F]">Acquisition Channel</label>
              <select
                className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-sm px-4 py-2.5 text-[#2F2F2F] outline-none"
                value={formSource}
                onChange={(e) => setFormSource(e.target.value)}
              >
                {LEAD_SOURCES.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#2F2F2F]">Initial Stage Allocation</label>
            <select
              className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-sm px-4 py-2.5 text-[#2F2F2F] outline-none"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as LeadStatus)}
            >
              <option value={LeadStatus.NEW}>New Leads Hub</option>
              <option value={LeadStatus.CALLED}>Called Opportunity</option>
              <option value={LeadStatus.INTERESTED}>Interested Deal</option>
              <option value={LeadStatus.PROPOSAL}>Proposal Sent</option>
            </select>
          </div>

          <TextArea
            label="Internal Executive Notes & Context"
            placeholder="Add specific pain points, software they currently use, or meeting availability schedules..."
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            id="lead-form-notes"
          />

          <div className="p-3.5 bg-blue-50/45 border border-[#8CB9D7]/30 rounded-xl flex items-start gap-2.5">
            <Sparkles size={16} className="text-[#8CB9D7] shrink-0 mt-0.5" />
            <div className="text-[11px] text-gray-500 leading-normal">
              <strong>Synity Propensity Insight:</strong> Submitting will trigger a contextual AI Closepropensity analysis score. It will also auto-generate an introductory onboarding workday checklist for your team.
            </div>
          </div>

          <div className="pt-4 border-t border-[#D8D8D8] flex justify-end gap-3.5">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNewLeadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Register Lead Profile
            </Button>
          </div>

        </form>
      </Modal>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
