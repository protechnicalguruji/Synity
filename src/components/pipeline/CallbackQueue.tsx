import React, { useState, useEffect } from "react";
import { Lead, LeadStatus, Task, TaskPriority, TaskStatus, ActivityLog, ActivityType } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input, Select } from "../ui/Input";
import { 
  Phone, Calendar, Clock, AlertTriangle, ArrowRight, CheckCircle, 
  Trash2, Bell, Sparkles, HelpCircle 
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils";

interface CallbackQueueProps {
  leads: Lead[];
  tasks: Task[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activities: ActivityLog[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onOpenDetails: (lead: Lead) => void;
}

export const CallbackQueue: React.FC<CallbackQueueProps> = ({
  leads,
  tasks,
  setLeads,
  setTasks,
  activities,
  setActivities,
  onOpenDetails
}) => {
  // Callback Form State
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [callbackDate, setCallbackDate] = useState("");
  const [callbackTime, setCallbackTime] = useState("");
  const [reminder, setReminder] = useState("10_MIN_BEFORE"); // 10_MIN_BEFORE, 30_MIN_BEFORE, 1_HOUR_BEFORE

  // No Answer Custom Date Form Target
  const [customDateLeadId, setCustomDateLeadId] = useState<string | null>(null);
  const [customDateValue, setCustomDateValue] = useState("");

  // Live countdown timer state (re-renders every second)
  const [timeNow, setTimeNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setTimeNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter "No Answer" leads
  const noAnswerLeads = leads.filter(l => l.status === LeadStatus.NO_ANSWER);

  // Filter callback tasks (we detect callbacks by task title starting with "☎️ Callback:")
  const callbackTasks = tasks.filter(t => t.title.startsWith("☎️ Callback:") && t.status !== TaskStatus.DONE);

  // Parse callback details from task title & description
  const parseCallbackMeta = (task: Task) => {
    const titleMatch = task.title.match(/☎️ Callback: (.*)/);
    const company = titleMatch ? titleMatch[1] : "Unknown";
    const targetLead = leads.find(l => l.company === company || l.id === task.leadId);
    
    // Parse time until
    const dueTime = new Date(task.dueDate).getTime();
    const diff = dueTime - timeNow;
    
    return {
      company,
      lead: targetLead,
      dueDate: task.dueDate,
      diff,
      id: task.id
    };
  };

  // Callback Scheduler Form Submission
  const handleScheduleCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !callbackDate || !callbackTime) return;

    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;

    const dueISO = `${callbackDate}T${callbackTime}:00`;
    const reminderLabel = reminder.replace(/_/g, " ");

    // Create Call Callback Task
    const callbackTask: Task = {
      id: `task-callback-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      title: `☎️ Callback: ${lead.company}`,
      description: `Appointment callback scheduled. Alarm set for ${reminderLabel}. Notes: Quick follow up on details.`,
      dueDate: new Date(dueISO).toISOString(),
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO
    };

    // Update lead follow up and status (if needed, transition to follow up)
    setLeads(prev => prev.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          nextFollowUp: callbackTask.dueDate,
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    }));

    setTasks(prev => [callbackTask, ...prev]);

    // Create activity log
    const act: ActivityLog = {
      id: `act-callback-schedule-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.MEETING,
      title: "Callback Appointment Confirmed",
      description: `Scheduled callback call for ${lead.company} on ${callbackDate} at ${callbackTime} with ${reminderLabel} alarm set.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    // Clear form
    setSelectedLeadId("");
    setCallbackDate("");
    setCallbackTime("");
    alert("Callback appointment successfully logged into CRM task register!");
  };

  // No Answer Quick Actions
  const handleNoAnswerRetry = (lead: Lead, daysOut: number) => {
    const retryDate = new Date();
    retryDate.setDate(retryDate.getDate() + daysOut);
    retryDate.setHours(10, 0, 0, 0); // 10:00 AM next follow-up

    // Update Lead Follow Up Date and keep status as NO_ANSWER (or CALLBACK queue)
    setLeads(prev => prev.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          nextFollowUp: retryDate.toISOString(),
          lastContactedAt: new Date().toISOString()
        };
      }
      return l;
    }));

    // Generate task
    const retryTask: Task = {
      id: `task-noanswer-retry-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      title: `☎️ Callback (Retry): ${lead.company}`,
      description: `Auto-generated callback queue retry. Previously flagged as No Answer.`,
      dueDate: retryDate.toISOString(),
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO
    };
    setTasks(prev => [retryTask, ...prev]);

    // Create activity
    const act: ActivityLog = {
      id: `act-noanswer-retry-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.STATE_CHANGE,
      title: `No-Answer Retry scheduled (${daysOut === 1 ? "Tomorrow" : "2 Days Out"})`,
      description: `No answer logged. Automatic retry session queued for ${retryDate.toLocaleDateString()}.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    alert(`Lead queued. System scheduled retry call for ${retryDate.toLocaleDateString()} at 10:00 AM.`);
  };

  const handleCustomRetrySubmit = (lead: Lead) => {
    if (!customDateValue) return;

    const retryDate = new Date(`${customDateValue}T10:00:00`);

    setLeads(prev => prev.map(l => {
      if (l.id === lead.id) {
        return {
          ...l,
          nextFollowUp: retryDate.toISOString(),
          lastContactedAt: new Date().toISOString()
        };
      }
      return l;
    }));

    // Generate task
    const retryTask: Task = {
      id: `task-noanswer-retry-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      title: `☎️ Callback (Retry Custom): ${lead.company}`,
      description: `Auto-generated callback retry. Previously flagged as No Answer.`,
      dueDate: retryDate.toISOString(),
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO
    };
    setTasks(prev => [retryTask, ...prev]);

    // Create activity
    const act: ActivityLog = {
      id: `act-noanswer-retry-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: ActivityType.STATE_CHANGE,
      title: "No-Answer Custom Retry Queued",
      description: `No answer logged. Custom retry session queued for ${customDateValue}.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    setCustomDateLeadId(null);
    setCustomDateValue("");
    alert(`Retry callback scheduled for ${customDateValue} 10:00 AM.`);
  };

  const handleMarkCallbackDone = (taskId: string, leadId?: string, leadName?: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: TaskStatus.DONE } : t));

    if (leadId) {
      // Clear lead follow-up date
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, nextFollowUp: undefined } : l));

      // Create activity
      const act: ActivityLog = {
        id: `act-callback-done-${Date.now()}`,
        leadId,
        leadName,
        type: ActivityType.CALL,
        title: "Callback Session Completed ✅",
        description: "Scheduled callback session executed successfully.",
        timestamp: new Date().toISOString(),
        userName: "Alex Rivers"
      };
      setActivities(prev => [act, ...prev]);
    }
  };

  // Formatting countdown
  const formatCountdown = (diffMs: number) => {
    if (diffMs < 0) return "Overdue!";
    const totalSecs = Math.floor(diffMs / 1000);
    const secs = totalSecs % 60;
    const totalMins = Math.floor(totalSecs / 60);
    const mins = totalMins % 60;
    const hours = Math.floor(totalMins / 60);

    return `${hours}h ${mins}m ${secs}s`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      
      {/* COLUMN 1: INTERACTIVE CALLBACK SCHEDULER FORM */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="p-4 border border-[#D8D8D8] bg-white space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F2F2F2] pb-3">
            <Clock size={16} className="text-amber-500 animate-pulse" />
            <h4 className="font-bold text-xs text-[#2F2F2F] uppercase tracking-wider">Schedule Callback</h4>
          </div>

          <form onSubmit={handleScheduleCallback} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Select Deal</label>
              <select
                required
                value={selectedLeadId}
                onChange={e => setSelectedLeadId(e.target.value)}
                className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2 text-[#2F2F2F] outline-none"
              >
                <option value="">-- Choose Active Lead --</option>
                {leads.filter(l => l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST).map(l => (
                  <option key={l.id} value={l.id}>{l.company} ({l.name})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Date</label>
                <input
                  required
                  type="date"
                  value={callbackDate}
                  onChange={e => setCallbackDate(e.target.value)}
                  className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2 text-[#2F2F2F] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Time</label>
                <input
                  required
                  type="time"
                  value={callbackTime}
                  onChange={e => setCallbackTime(e.target.value)}
                  className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2 text-[#2F2F2F] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Reminder Alarm Preset</label>
              <select
                value={reminder}
                onChange={e => setReminder(e.target.value)}
                className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2 text-[#2F2F2F] outline-none"
              >
                <option value="10_MIN_BEFORE">10 Minutes Before</option>
                <option value="30_MIN_BEFORE">30 Minutes Before</option>
                <option value="1_HOUR_BEFORE">1 Hour Before</option>
              </select>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-2 text-[10px] text-amber-800 leading-relaxed">
              <Bell size={14} className="shrink-0 text-amber-500 mt-0.5" />
              <span>
                <strong>Workspace Integration:</strong> Alarms automatically inject dynamic countdown events and dashboard visual indicators.
              </span>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#4E4E49] hover:bg-[#3D3D38] text-white text-[11px] font-bold py-2 shadow-2xs"
            >
              Confirm Callback Reservation
            </Button>
          </form>
        </Card>
      </div>

      {/* COLUMN 2: ACTIVE CALLBACKS LIST (COUNTDOWN TIMERS) */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="p-4 border border-[#D8D8D8] bg-white space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F2F2F2] pb-3 justify-between">
            <div className="flex items-center gap-1.5">
              <Bell size={16} className="text-blue-500 animate-bounce" />
              <h4 className="font-bold text-xs text-[#2F2F2F] uppercase tracking-wider">Scheduled Alarms</h4>
            </div>
            <Badge variant="primary" size="sm" className="font-mono bg-blue-500 text-white">
              {callbackTasks.length}
            </Badge>
          </div>

          {callbackTasks.length === 0 ? (
            <div className="py-16 text-center space-y-2 text-gray-400">
              <Clock size={28} className="mx-auto stroke-1 text-gray-300" />
              <p className="text-[10px] font-mono uppercase">No active callbacks pending</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
              {callbackTasks.map(t => {
                const meta = parseCallbackMeta(t);
                const isOverdue = meta.diff < 0;

                return (
                  <div
                    key={t.id}
                    className={`p-3.5 border rounded-xl space-y-2 transition-all relative ${
                      isOverdue 
                        ? "bg-rose-50/20 border-rose-200" 
                        : "bg-slate-50/50 border-[#D8D8D8] hover:border-[#60605B]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <span className="block font-bold text-xs text-[#2F2F2F] truncate">
                          {meta.company}
                        </span>
                        <span className="block text-[10px] text-gray-400 font-mono truncate">
                          Client: {t.leadName || "Contact"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleMarkCallbackDone(t.id, t.leadId, t.leadName)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Mark Completed"
                      >
                        <CheckCircle size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono border-t border-gray-100 pt-2">
                      <span className="text-gray-400 uppercase text-[9px] font-bold">Countdown:</span>
                      <strong className={`font-extrabold ${isOverdue ? "text-rose-600 animate-pulse" : "text-amber-600"}`}>
                        {formatCountdown(meta.diff)}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1">
                      <span>APPOINTMENT:</span>
                      <span className="font-bold">{new Date(meta.dueDate).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* COLUMN 3: NO ANSWER RETRY QUEUE */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="p-4 border border-[#D8D8D8] bg-white space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F2F2F2] pb-3 justify-between">
            <div className="flex items-center gap-1.5">
              <Phone size={16} className="text-rose-500" />
              <h4 className="font-bold text-xs text-[#2F2F2F] uppercase tracking-wider">No Answer Queue</h4>
            </div>
            <Badge variant="secondary" size="sm" className="font-mono bg-rose-50 text-rose-700 border-rose-200">
              {noAnswerLeads.length}
            </Badge>
          </div>

          {noAnswerLeads.length === 0 ? (
            <div className="py-16 text-center space-y-2 text-gray-400">
              <Phone size={28} className="mx-auto stroke-1 text-gray-300" />
              <p className="text-[10px] font-mono uppercase">No Answer queue clear!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
              {noAnswerLeads.map(l => (
                <div key={l.id} className="p-3 bg-rose-50/10 border border-rose-200/40 rounded-xl space-y-3">
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="space-y-0.5 text-left">
                      <span
                        className="block font-bold text-xs text-[#2F2F2F] hover:text-[#4E4E49] cursor-pointer"
                        onClick={() => onOpenDetails(l)}
                      >
                        {l.company}
                      </span>
                      <span className="block text-[10px] text-gray-400 font-mono">
                        Contact: {l.name}
                      </span>
                    </div>

                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-rose-100 text-rose-700 border border-rose-200 tracking-wider">
                      NO ANSWER
                    </span>
                  </div>

                  {/* Retry options scheduler */}
                  {customDateLeadId === l.id ? (
                    <div className="p-2.5 bg-white border border-rose-200/50 rounded-lg space-y-2 text-[10px]">
                      <span className="block font-bold text-gray-500 uppercase tracking-wider font-mono">Select Custom Retry Date</span>
                      <input
                        type="date"
                        value={customDateValue}
                        onChange={e => setCustomDateValue(e.target.value)}
                        className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs p-1.5 outline-none"
                      />
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => setCustomDateLeadId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="xs"
                          className="bg-rose-600 text-white"
                          onClick={() => handleCustomRetrySubmit(l)}
                          disabled={!customDateValue}
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handleNoAnswerRetry(l, 1)}
                        className="px-2 py-1.5 text-[9px] font-extrabold bg-white border border-[#D8D8D8] text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Retry Tomorrow
                      </button>
                      <button
                        onClick={() => handleNoAnswerRetry(l, 2)}
                        className="px-2 py-1.5 text-[9px] font-extrabold bg-white border border-[#D8D8D8] text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Retry in 2 Days
                      </button>
                      <button
                        onClick={() => setCustomDateLeadId(l.id)}
                        className="px-2 py-1.5 text-[9px] font-extrabold bg-white border border-[#D8D8D8] text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Custom Date
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

    </div>
  );
};
