import React, { useState } from "react";
import { Lead, LeadStatus, Task, TaskPriority, TaskStatus, ActivityLog, ActivityType } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { 
  Calendar, MapPin, Video, Users, Clock, AlertTriangle, 
  CheckCircle2, Plus, Sparkles, RefreshCw, XCircle 
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils";

interface MeetingQueueProps {
  leads: Lead[];
  tasks: Task[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activities: ActivityLog[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onOpenDetails: (lead: Lead) => void;
}

export const MeetingQueue: React.FC<MeetingQueueProps> = ({
  leads,
  tasks,
  setLeads,
  setTasks,
  activities,
  setActivities,
  onOpenDetails
}) => {
  // Modal / Form state
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [duration, setDuration] = useState("30_MIN"); // 30_MIN, 45_MIN, 1_HOUR
  const [location, setLocation] = useState(""); // Google Meet url, physical, etc.
  
  // Filter tasks starting with "📅 Meeting:" to show meetings
  const meetingTasks = tasks.filter(t => t.title.startsWith("📅 Meeting:"));

  // Parse meeting info from task
  const parseMeetingDetails = (task: Task) => {
    const titleMatch = task.title.match(/📅 Meeting: (.*)/);
    const company = titleMatch ? titleMatch[1] : "Unknown";
    const targetLead = leads.find(l => l.company === company || l.id === task.leadId);

    // Extract location & duration from description
    const desc = task.description || "";
    const locMatch = desc.match(/Location: (.*?) \|/);
    const durMatch = desc.match(/Duration: (.*?)$/);

    const loc = locMatch ? locMatch[1] : "Google Meet Video Call";
    const dur = durMatch ? durMatch[1] : "30 Minutes";

    let statusLabel = "Scheduled";
    if (task.status === TaskStatus.DONE) statusLabel = "Completed";

    return {
      company,
      lead: targetLead,
      time: task.dueDate,
      location: loc,
      duration: dur,
      status: statusLabel,
      id: task.id
    };
  };

  const handleAddMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !meetingDate || !meetingTime || !location) return;

    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;

    const dueISO = `${meetingDate}T${meetingTime}:00`;
    const durLabel = duration === "30_MIN" ? "30 Minutes" : duration === "45_MIN" ? "45 Minutes" : "1 Hour";

    // Create Meeting Task
    const meetingTask: Task = {
      id: `task-meeting-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      title: `📅 Meeting: ${lead.company}`,
      description: `Location: ${location} | Duration: ${durLabel}`,
      dueDate: new Date(dueISO).toISOString(),
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO
    };

    // Update lead status to MEETING stage if they are currently behind it
    setLeads(prev => prev.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          status: LeadStatus.MEETING,
          nextFollowUp: meetingTask.dueDate,
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    }));

    setTasks(prev => [meetingTask, ...prev]);

    // Create activity log
    const act: ActivityLog = {
      id: `act-meeting-create-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.MEETING,
      title: "Client Meeting Scheduled",
      description: `Arranged a ${durLabel} sync with ${lead.company} at ${location}. Due date set to ${meetingDate}.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    // Clear form
    setSelectedLeadId("");
    setMeetingDate("");
    setMeetingTime("");
    setLocation("");
    setShowAddMeeting(false);
    alert("Meeting successfully booked and pipeline stage updated to MEETING!");
  };

  const handleToggleMeetingDone = (taskId: string, company: string, leadId?: string, leadName?: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: TaskStatus.DONE } : t));

    // Create Activity
    if (leadId) {
      const act: ActivityLog = {
        id: `act-meeting-done-${Date.now()}`,
        leadId,
        leadName,
        type: ActivityType.MEETING,
        title: "Meeting Successfully Concluded ✅",
        description: `Discovery alignment meeting completed with ${company}. Transitioning discussion to Proposal preparation.`,
        timestamp: new Date().toISOString(),
        userName: "Alex Rivers"
      };
      setActivities(prev => [act, ...prev]);
    }
  };

  return (
    <div className="space-y-5 text-left">
      
      {/* Top action header */}
      <div className="flex justify-between items-center bg-white p-4 border border-[#D8D8D8] rounded-xl">
        <div className="space-y-0.5">
          <h4 className="font-bold text-xs text-[#2F2F2F] uppercase tracking-wider">Sync Calendar & Agenda</h4>
          <p className="text-[10px] text-gray-500 uppercase font-mono">
            Tracks client alignment meetings, demos, and closing panels.
          </p>
        </div>

        <button
          onClick={() => setShowAddMeeting(!showAddMeeting)}
          className="px-3 py-1.5 bg-[#4E4E49] hover:bg-[#3D3D38] text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
        >
          <Plus size={12} />
          {showAddMeeting ? "Close Scheduler" : "Book Meeting"}
        </button>
      </div>

      {/* Booking Form drawer if toggled */}
      {showAddMeeting && (
        <Card className="p-4 border border-[#D8D8D8] bg-white max-w-xl mx-auto space-y-4">
          <div className="flex items-center gap-1.5 border-b border-[#F2F2F2] pb-2.5">
            <Sparkles size={14} className="text-[#8CB9D7]" />
            <span className="font-bold text-xs text-[#2F2F2F] uppercase font-display">Schedule Client Meeting</span>
          </div>

          <form onSubmit={handleAddMeetingSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Lead Client</label>
                <select
                  required
                  value={selectedLeadId}
                  onChange={e => setSelectedLeadId(e.target.value)}
                  className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2 text-[#2F2F2F] outline-none"
                >
                  <option value="">-- Choose Client --</option>
                  {leads.filter(l => l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST).map(l => (
                    <option key={l.id} value={l.id}>{l.company} ({l.name})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Location Link / Venue</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. meet.google.com/xyz-abc-123"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2 text-[#2F2F2F] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Date</label>
                <input
                  required
                  type="date"
                  value={meetingDate}
                  onChange={e => setMeetingDate(e.target.value)}
                  className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2 text-[#2F2F2F] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Time</label>
                <input
                  required
                  type="time"
                  value={meetingTime}
                  onChange={e => setMeetingTime(e.target.value)}
                  className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2 text-[#2F2F2F] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Duration</label>
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2 text-[#2F2F2F] outline-none"
                >
                  <option value="30_MIN">30 Minutes</option>
                  <option value="45_MIN">45 Minutes</option>
                  <option value="1_HOUR">1 Hour</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#F2F2F2]">
              <Button type="button" variant="outline" onClick={() => setShowAddMeeting(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#4E4E49] text-white font-bold">
                Book Meeting Room
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Meeting Cards List */}
      {meetingTasks.length === 0 ? (
        <Card className="p-12 border border-[#D8D8D8] bg-white text-center space-y-3">
          <Calendar size={36} className="mx-auto text-gray-300 stroke-1" />
          <div>
            <h4 className="font-bold text-xs text-[#2F2F2F]">No Client Meetings Booked</h4>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono">Use the booking scheduler above to coordinate syncs.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetingTasks.map(t => {
            const meta = parseMeetingDetails(t);
            const isCompleted = meta.status === "Completed";

            return (
              <Card
                key={t.id}
                className={`p-4 border text-left space-y-3 transition-all relative overflow-hidden ${
                  isCompleted 
                    ? "bg-slate-50/50 border-gray-200 opacity-75" 
                    : "bg-white border-[#D8D8D8] hover:border-[#60605B] shadow-2xs"
                }`}
              >
                {/* Visual Status Indicator line */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${isCompleted ? "bg-slate-300" : "bg-[#8CB9D7]"}`} />

                <div className="flex justify-between items-start gap-1">
                  <div className="space-y-0.5">
                    <span className="block font-bold text-xs text-[#2F2F2F] leading-tight truncate max-w-[150px]">
                      {meta.company}
                    </span>
                    <span className="block text-[10px] text-gray-400 font-mono">
                      Client: {t.leadName || "Contact"}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                    isCompleted 
                      ? "bg-gray-100 text-gray-500 border border-gray-200" 
                      : "bg-[#E5E3E7] text-[#2F2F2F] border border-[#D8D8D8]"
                  }`}>
                    {meta.status}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#F2F2F2] text-[10px] text-gray-500 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-gray-400">
                      <Clock size={10} /> Date & Time
                    </span>
                    <strong className="text-gray-700">{new Date(meta.time).toLocaleString()}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-gray-400">
                      <Clock size={10} /> Duration
                    </span>
                    <span className="font-bold">{meta.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-gray-400">
                      <MapPin size={10} /> Venue
                    </span>
                    <span className="font-bold text-blue-600 truncate max-w-[120px]" title={meta.location}>
                      {meta.location}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-[#F5F5F5]">
                  <button
                    onClick={() => meta.lead && onOpenDetails(meta.lead)}
                    className="text-[10px] font-bold text-gray-500 hover:text-[#2F2F2F] font-sans"
                  >
                    Open Deal File
                  </button>

                  {!isCompleted && (
                    <button
                      onClick={() => handleToggleMeetingDone(t.id, meta.company, t.leadId, t.leadName)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <CheckCircle2 size={10} />
                      Done
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};
