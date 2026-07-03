import React, { useState } from "react";
import {
  Phone, Mail, Globe, MapPin, Calendar, MessageSquare, Plus, Sparkles,
  Clock, CheckSquare, Video, AlertCircle, Edit, User, ListPlus, X,
  ChevronLeft, Copy, Check, Info, CalendarCheck, FileText, Activity
} from "lucide-react";
import { Lead, LeadStatus, Task, TaskPriority, TaskStatus, ActivityLog, ActivityType } from "../../types";
import { formatCurrency, formatDate, getConfidenceColor } from "../../utils";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { LeadTimeline } from "./LeadTimeline";
import { LeadNotes } from "./LeadNotes";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface LeadDetailsProps {
  lead: Lead;
  tasks: Task[];
  activities: ActivityLog[];
  onBack: () => void;
  onUpdateLead: (updatedLead: Lead) => void;
  onAddTask: (task: Task) => void;
  onAddActivity: (activity: ActivityLog) => void;
}

export const LeadDetails: React.FC<LeadDetailsProps> = ({
  lead,
  tasks,
  activities,
  onBack,
  onUpdateLead,
  onAddTask,
  onAddActivity
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Filter tasks & activities associated with this lead
  const leadTasks = tasks.filter((t) => t.leadId === lead.id);
  const leadActivities = activities.filter((a) => a.leadId === lead.id);

  // Tab State
  const [activeTab, setActiveTab] = useState<"timeline" | "notes" | "tasks" | "meetings" | "ai">("timeline");

  // Interaction Modal/Form states
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Form Fields
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [followUpReminder, setFollowUpReminder] = useState(true);
  const [followUpNotes, setFollowUpNotes] = useState("");

  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDuration, setMeetingDuration] = useState("30");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [meetingType, setMeetingType] = useState("VIDEO_CALL");
  const [meetingNotes, setMeetingNotes] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [taskDueDate, setTaskDueDate] = useState("");

  const triggerCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Status management: triggers automatic log addition on update
  const handleStatusChange = (newStatus: LeadStatus) => {
    const prevStatus = lead.status;
    const updatedLead: Lead = {
      ...lead,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    onUpdateLead(updatedLead);

    // Create automatic log
    const activity: ActivityLog = {
      id: `act-state-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.STATE_CHANGE,
      title: `Deal stage shifted`,
      description: `Opportunity stage adjusted from "${prevStatus.replace("_", " ")}" to "${newStatus.replace("_", " ")}".`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    onAddActivity(activity);
  };

  const handlePriorityChange = (newPriority: "LOW" | "MEDIUM" | "HIGH" | "URGENT") => {
    const updatedLead: Lead = {
      ...lead,
      priority: newPriority,
      updatedAt: new Date().toISOString()
    };
    onUpdateLead(updatedLead);
  };

  const handleSaveNotes = (updatedNotesString: string) => {
    const updatedLead: Lead = {
      ...lead,
      notes: updatedNotesString,
      updatedAt: new Date().toISOString()
    };
    onUpdateLead(updatedLead);
  };

  // Log manual activity from timeline component
  const handleAddTimelineActivity = (type: ActivityType, title: string, description: string) => {
    const activity: ActivityLog = {
      id: `act-user-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    onAddActivity(activity);
  };

  // Follow-up handler
  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpDate) return;

    const followUpISO = `${followUpDate}T${followUpTime || "09:00"}:00Z`;
    const updatedLead: Lead = {
      ...lead,
      nextFollowUp: followUpISO,
      updatedAt: new Date().toISOString()
    };
    onUpdateLead(updatedLead);

    // Add activity log
    const activity: ActivityLog = {
      id: `act-follow-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.STATE_CHANGE,
      title: "Scheduled Follow Up",
      description: `Follow-up set for ${formatDate(followUpISO)} at ${followUpTime || "09:00"}.${
        followUpNotes ? ` Notes: "${followUpNotes}"` : ""
      }`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    onAddActivity(activity);

    // Clear and close
    setFollowUpDate("");
    setFollowUpTime("");
    setFollowUpNotes("");
    setShowFollowUpForm(false);
  };

  // Meeting scheduler handler
  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingDate) return;

    const meetingISO = `${meetingDate}T${meetingTime || "10:00"}:00Z`;

    // Create a meeting activity log
    const activity: ActivityLog = {
      id: `act-meet-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.MEETING,
      title: `Scheduled meeting: ${meetingType.replace("_", " ")}`,
      description: `Sync scheduled for ${formatDate(meetingISO)} at ${meetingTime || "10:00"} (${meetingDuration} mins) at location: ${meetingLocation || "Online"}.${
        meetingNotes ? ` Notes: "${meetingNotes}"` : ""
      }`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    onAddActivity(activity);

    // Set follow up or update lead's status to Meeting Scheduled
    handleStatusChange(LeadStatus.MEETING);

    // Reset and close
    setMeetingDate("");
    setMeetingTime("");
    setMeetingLocation("");
    setMeetingNotes("");
    setShowMeetingForm(false);
    setActiveTab("timeline");
  };

  // Task creation handler
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDueDate) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      title: taskTitle.trim(),
      dueDate: new Date(taskDueDate).toISOString(),
      priority: taskPriority,
      status: TaskStatus.TODO
    };
    onAddTask(newTask);

    // Create activity log
    const activity: ActivityLog = {
      id: `act-task-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.NOTE,
      title: `Scheduled Workday Action`,
      description: `Created lead task: "${taskTitle.trim()}" set to high-priority focus due on ${formatDate(newTask.dueDate)}.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    onAddActivity(activity);

    // Reset and close
    setTaskTitle("");
    setTaskDueDate("");
    setTaskPriority(TaskPriority.MEDIUM);
    setShowTaskForm(false);
    setActiveTab("tasks");
  };

  const confidence = getConfidenceColor(lead.confidenceScore);

  return (
    <div className="space-y-6 text-left">
      {/* Back to listing header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#2F2F2F] transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to Leads</span>
        </button>

        <span className="text-[10px] font-mono text-gray-400">ID: {lead.id}</span>
      </div>

      {/* Main Details Banner */}
      <div className="p-6 bg-white border border-[#D8D8D8] rounded-xl shadow-2xs flex flex-col md:flex-row items-stretch justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-mono text-gray-400 uppercase bg-gray-100 px-2.5 py-0.5 rounded-md font-semibold">
              {lead.industry || "No Industry"}
            </span>
            <span className="text-xs font-mono text-gray-400 uppercase bg-gray-100 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
              <MapPin size={11} />
              {lead.country || "No Location"}
            </span>
          </div>

          <h2 className="text-2xl font-bold font-display text-[#2F2F2F] tracking-tight">
            {lead.company}
          </h2>

          <p className="text-xs text-[#666666] flex items-center gap-2">
            <User size={13} />
            <span>Lead Owner: <strong className="font-semibold text-[#2F2F2F]">{lead.name}</strong></span>
          </p>
        </div>

        {/* Dynamic status selectors and indicators */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 items-start sm:items-center md:items-start lg:items-center justify-end shrink-0">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider block">Estimated Value</span>
            <span className="text-lg font-bold text-[#2F2F2F] font-mono leading-none block mt-1.5">
              {formatCurrency(lead.value)}
            </span>
          </div>

          <div className={`p-3 rounded-xl border min-w-[140px] ${confidence.bg} ${confidence.border}`}>
            <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider flex items-center gap-1">
              <Sparkles size={11} className="text-[#8CB9D7]" />
              Win Propensity
            </span>
            <span className={`text-lg font-bold font-mono leading-none block mt-1.5 ${confidence.text}`}>
              {lead.confidenceScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Left column (meta/inputs), Right column (Chronological events/Activities) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: 4 columns - Business Information, Contact Cards & Quick Action Deck */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Deck */}
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] border-b pb-2">
              Action Deck
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-[#D8D8D8] bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 hover:shadow-2xs transition-all"
                >
                  <Phone size={13} />
                  <span>Call Out</span>
                </a>
              )}
              {lead.whatsapp && (
                <a
                  href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-all"
                >
                  <MessageSquare size={13} />
                  <span>WhatsApp</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setShowFollowUpForm(!showFollowUpForm)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-blue-200 bg-blue-50/50 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
              >
                <CalendarCheck size={13} />
                <span>Follow Up</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMeetingForm(!showMeetingForm)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-purple-200 bg-purple-50/50 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-all cursor-pointer"
              >
                <Video size={13} />
                <span>Meeting</span>
              </button>
            </div>

            <Button
              type="button"
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="w-full flex items-center justify-center gap-2 bg-[#4E4E49] text-white py-2.5 rounded-lg hover:bg-[#3D3D38] font-bold text-xs"
            >
              <CheckSquare size={14} />
              <span>Assign Workspace Task</span>
            </Button>
          </Card>

          {/* Quick interactive status and priority controllers */}
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] border-b pb-2">
              Status Controllers
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500">Pipeline Stage</label>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                  className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 font-semibold text-[#2F2F2F] outline-none"
                >
                  {Object.values(LeadStatus).map((st) => (
                    <option key={st} value={st}>
                      {st.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500">Deal Priority</label>
                <select
                  value={lead.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as any)}
                  className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 font-semibold text-[#2F2F2F] outline-none"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent Escalation</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Contact Information & Copy Buttons */}
          <Card className="p-5 space-y-4 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] border-b pb-2">
              Contact Index
            </h3>

            <div className="space-y-3.5">
              {/* Email */}
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Primary Email</span>
                <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg font-mono">
                  <span className="truncate">{lead.email}</span>
                  <button
                    onClick={() => triggerCopy(lead.email, "email")}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500"
                    title="Copy Email"
                  >
                    {copiedField === "email" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              {lead.phone && (
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Direct Phone</span>
                  <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg font-mono">
                    <span>{lead.phone}</span>
                    <button
                      onClick={() => triggerCopy(lead.phone || "", "phone")}
                      className="p-1 hover:bg-gray-200 rounded text-gray-500"
                      title="Copy Phone"
                    >
                      {copiedField === "phone" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Website */}
              {lead.website && (
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Corporate Website</span>
                  <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg font-mono">
                    <span className="truncate">{lead.website}</span>
                    <button
                      onClick={() => triggerCopy(lead.website || "", "website")}
                      className="p-1 hover:bg-gray-200 rounded text-gray-500"
                      title="Copy Website"
                    >
                      {copiedField === "website" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Side: 8 columns - Interactive Workspaces (Tabs: timeline, notes, tasks, meetings, AI) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Action Modals */}
          {showFollowUpForm && (
            <Card className="p-5 border-blue-200 bg-blue-50/10 space-y-3 animate-slide-down">
              <div className="flex justify-between items-center border-b pb-2 border-blue-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <CalendarCheck size={13} />
                  Schedule Follow Up Touch point
                </h4>
                <button onClick={() => setShowFollowUpForm(false)} className="text-gray-400 hover:text-red-600">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleScheduleFollowUp} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Scheduled Date</label>
                    <input
                      type="date"
                      required
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Time Preset</label>
                    <input
                      type="time"
                      value={followUpTime}
                      onChange={(e) => setFollowUpTime(e.target.value)}
                      className="w-full bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Task Followup Guidelines</label>
                  <textarea
                    placeholder="Define follow-up outcomes, custom demo pricing modules, or touchpoint agendas..."
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button size="xs" variant="ghost" onClick={() => setShowFollowUpForm(false)}>
                    Cancel
                  </Button>
                  <Button size="xs" className="bg-blue-600 hover:bg-blue-700 text-white" type="submit">
                    Set Follow-up
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {showMeetingForm && (
            <Card className="p-5 border-purple-200 bg-purple-50/10 space-y-3 animate-slide-down">
              <div className="flex justify-between items-center border-b pb-2 border-purple-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                  <Video size={13} />
                  Schedule Sales Sync Meeting
                </h4>
                <button onClick={() => setShowMeetingForm(false)} className="text-gray-400 hover:text-red-600">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleScheduleMeeting} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Date</label>
                    <input
                      type="date"
                      required
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Time</label>
                    <input
                      type="time"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Duration (mins)</label>
                    <select
                      value={meetingDuration}
                      onChange={(e) => setMeetingDuration(e.target.value)}
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Location / Meeting URL</label>
                    <input
                      type="text"
                      placeholder="e.g. Google Meet, Zoom, Office"
                      value={meetingLocation}
                      onChange={(e) => setMeetingLocation(e.target.value)}
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Meeting Type</label>
                    <select
                      value={meetingType}
                      onChange={(e) => setMeetingType(e.target.value)}
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                    >
                      <option value="VIDEO_CALL">🎥 Video Conference</option>
                      <option value="PHONE_CALL">📞 Phone Consultation</option>
                      <option value="IN_PERSON">👥 In Person Workshop</option>
                      <option value="DEMO_PITCH">🚀 Live Product Demo</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Agenda & Guidelines</label>
                  <textarea
                    placeholder="Briefly state key targets of the sync..."
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button size="xs" variant="ghost" onClick={() => setShowMeetingForm(false)}>
                    Cancel
                  </Button>
                  <Button size="xs" className="bg-purple-600 hover:bg-purple-700 text-white" type="submit">
                    Schedule Meeting
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {showTaskForm && (
            <Card className="p-5 border-gray-200 bg-gray-50/25 space-y-3 animate-slide-down">
              <div className="flex justify-between items-center border-b pb-2 border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <CheckSquare size={13} />
                  Add Direct Deal Task
                </h4>
                <button onClick={() => setShowTaskForm(false)} className="text-gray-400 hover:text-red-600">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Task Title / Action Item</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Customize API routing brief for legal team"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Due Date</label>
                    <input
                      type="date"
                      required
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Priority Level</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                    >
                      <option value="LOW">Low priority</option>
                      <option value="MEDIUM">Medium priority</option>
                      <option value="HIGH">High focus priority</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button size="xs" variant="ghost" onClick={() => setShowTaskForm(false)}>
                    Cancel
                  </Button>
                  <Button size="xs" className="bg-[#4E4E49] hover:bg-[#3D3D38] text-white" type="submit">
                    Assign Task
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Interactive Workspaces card */}
          <Card className="overflow-hidden">
            <div className="flex border-b border-[#D8D8D8] bg-gray-50/50">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`flex items-center gap-1.5 px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "timeline"
                    ? "border-[#4E4E49] text-[#2F2F2F] bg-white"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-100/40"
                }`}
              >
                <Activity size={13} />
                Timeline ({leadActivities.length})
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`flex items-center gap-1.5 px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "notes"
                    ? "border-[#4E4E49] text-[#2F2F2F] bg-white"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-100/40"
                }`}
              >
                <FileText size={13} />
                Rich Notes
              </button>

              <button
                onClick={() => setActiveTab("tasks")}
                className={`flex items-center gap-1.5 px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "tasks"
                    ? "border-[#4E4E49] text-[#2F2F2F] bg-white"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-100/40"
                }`}
              >
                <CheckSquare size={13} />
                Active Tasks ({leadTasks.length})
              </button>

              <button
                onClick={() => setActiveTab("ai")}
                className={`flex items-center gap-1.5 px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "ai"
                    ? "border-[#4E4E49] text-[#2F2F2F] bg-white"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-100/40"
                }`}
              >
                <Sparkles size={13} className="text-[#8CB9D7]" />
                AI Insights
              </button>
            </div>

            <div className="p-6">
              {activeTab === "timeline" && (
                <LeadTimeline
                  activities={leadActivities}
                  onAddActivity={handleAddTimelineActivity}
                />
              )}

              {activeTab === "notes" && (
                <LeadNotes
                  notesString={lead.notes || ""}
                  onSaveNotes={handleSaveNotes}
                />
              )}

              {activeTab === "tasks" && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#666666]">Active Action Items</h4>
                    <Button
                      size="xs"
                      variant="outline"
                      className="bg-white border-[#D8D8D8] text-[11px] font-semibold flex items-center gap-1.5"
                      onClick={() => setShowTaskForm(true)}
                    >
                      <Plus size={12} />
                      Assign Task
                    </Button>
                  </div>

                  {leadTasks.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                      <p className="text-xs text-gray-400">All caught up! No tasks pending on this lead pipeline.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#D8D8D8] border border-[#D8D8D8] rounded-xl overflow-hidden bg-white shadow-2xs">
                      {leadTasks.map((t) => (
                        <div key={t.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/40 transition-colors">
                          <div className="space-y-1.5">
                            <h5 className="font-semibold text-xs text-[#2F2F2F]">{t.title}</h5>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                              <span className="font-mono flex items-center gap-1">
                                <Calendar size={10} />
                                Due: {formatDate(t.dueDate)}
                              </span>
                              <span>•</span>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                t.priority === "HIGH" ? "bg-red-50 text-red-600 border border-red-200/50" : "bg-gray-100 text-gray-600"
                              }`}>
                                {t.priority}
                              </span>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === "DONE" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-amber-50 text-amber-700 border border-amber-200/50"
                          }`}>
                            {t.status.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "ai" && (
                <div className="space-y-5 text-left">
                  <div className="p-4 bg-gradient-to-tr from-[#E5E3E7]/30 to-[#8CB9D7]/10 border border-[#8CB9D7]/30 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#8CB9D7]/20 text-[#3b7194] rounded-lg">
                        <Sparkles size={14} className="animate-pulse" />
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Synity Predictive Closing Insights</h4>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      Based on our localized CRM closing indicators, <strong className="font-bold">{lead.company}</strong> has an estimated closing rate of <strong className="font-bold">{lead.confidenceScore}%</strong>. The contact shows consistent touchpoint responsiveness and matches corporate budget signatures for our SaaS licensing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider block">Recommended Action</span>
                      <p className="text-xs font-bold text-[#2F2F2F] mt-1.5">Deliver Custom SLA Integration Deck</p>
                      <p className="text-[11px] text-[#666666] mt-1">Providing pre-mapped enterprise modules raises closing probability by +12%.</p>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider block">Next Calibration Date</span>
                      <p className="text-xs font-bold text-[#2F2F2F] mt-1.5">Automatic follow-up trigger set</p>
                      <p className="text-[11px] text-[#666666] mt-1">AI monitors email reply streams on this track continuously.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
