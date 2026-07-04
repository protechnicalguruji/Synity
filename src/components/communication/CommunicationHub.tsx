/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Lead, ActivityLog, Task, ActivityType, LeadStatus, TaskPriority, TaskStatus } from "../../types";
import { Conversation, Message, SmartReminder, CommunicationChannel } from "../../types/communication";
import { INITIAL_CONVERSATIONS } from "../../utils/communicationMockData";
import { ConversationList } from "./ConversationList";
import { ConversationView } from "./ConversationView";
import { LeadSidebar } from "./LeadSidebar";
import { 
  Sparkles, 
  Wifi, 
  WifiOff, 
  LayoutGrid, 
  RefreshCw, 
  AlertCircle, 
  Activity,
  Send
} from "lucide-react";

interface CommunicationHubProps {
  leads: Lead[];
  activities: ActivityLog[];
  tasks: Task[];
  onAddActivity: (activity: Omit<ActivityLog, "id" | "timestamp">) => void;
  onAddTask: (task: Omit<Task, "id" | "status">) => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({
  leads,
  activities,
  tasks,
  onAddActivity,
  onAddTask,
  onUpdateLeadStatus
}) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    // Attempt load from localStorage first for persistence
    try {
      const stored = localStorage.getItem("synity_conversations");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error("Failed to read local conversations, falling back to mock", err);
    }
    return INITIAL_CONVERSATIONS;
  });

  const [selectedId, setSelectedId] = useState<string>(() => {
    return INITIAL_CONVERSATIONS[0]?.id || "";
  });

  const [connectionError, setConnectionError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem("synity_conversations", JSON.stringify(conversations));
    } catch (err) {
      console.error("Failed to persist conversations state", err);
    }
  }, [conversations]);

  const activeConv = conversations.find((c) => c.id === selectedId);
  // Match with current global lead details
  const activeLead = leads.find((l) => l.id === activeConv?.leadId);

  // 1. REFRESH & SYNC UTILITIES
  const handleForceRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
    }, 800);
  };

  // 2. TOGGLE PIN
  const handleTogglePin = () => {
    if (!selectedId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // 3. SEND MESSAGE
  const handleSendMessage = (
    body: string, 
    type: "TEXT" | "PDF" | "FILE", 
    attachments?: any[]
  ) => {
    if (!selectedId || !activeConv) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      type,
      senderType: "OUTGOING",
      senderName: "Agent John",
      body,
      timestamp: new Date().toISOString(),
      status: "SENT",
      channel: activeConv.channel,
      attachments
    };

    // Update conversation
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            lastMessageText: body || (type === "PDF" ? "Sent a PDF Document" : "Sent a file attachment"),
            lastMessageTimestamp: newMessage.timestamp,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    // Auto-create Activity Log in the Lead Timeline
    onAddActivity({
      leadId: activeConv.leadId,
      leadName: activeConv.leadName,
      type: getCategoryFromChannel(activeConv.channel),
      title: `${activeConv.channel} Outbound Sent`,
      description: body.length > 60 ? `${body.substring(0, 57)}...` : body,
      userName: "Agent John"
    });

    // Simulate standard Network Ingestion Delays for Delivered / Read statuses
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMessage.id ? { ...m, status: "DELIVERED" } : m
              )
            };
          }
          return c;
        })
      );
    }, 1500);

    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMessage.id ? { ...m, status: "READ" } : m
              )
            };
          }
          return c;
        })
      );
    }, 3000);
  };

  // 4. SMART REMINDERS
  const handleAddReminder = (
    type: "REPLY_IN_2H" | "CALL_TOMORROW" | "FOLLOW_UP_FRIDAY" | "CUSTOM",
    title: string
  ) => {
    if (!selectedId) return;

    // Calculate due date based on preset type
    const now = new Date();
    if (type === "REPLY_IN_2H") now.setHours(now.getHours() + 2);
    else if (type === "CALL_TOMORROW") now.setDate(now.getDate() + 1);
    else if (type === "FOLLOW_UP_FRIDAY") {
      const distance = (5 - now.getDay() + 7) % 7;
      now.setDate(now.getDate() + (distance === 0 ? 7 : distance));
      now.setHours(14, 0, 0, 0); // Friday 2 PM
    } else {
      now.setDate(now.getDate() + 3); // 3 days default
    }

    const newRem: SmartReminder = {
      id: `rem-${Date.now()}`,
      type,
      title,
      dueDate: now.toISOString(),
      triggered: false
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, reminders: [newRem, ...c.reminders] } : c))
    );

    // Also add to global workday tasks list to integrate with planner
    onAddTask({
      leadId: activeConv?.leadId,
      leadName: activeConv?.leadName,
      title: `[SLA Reminder] ${title}`,
      description: `Auto-generated response timer set to expire on ${now.toLocaleString()}`,
      dueDate: now.toISOString().split("T")[0],
      priority: TaskPriority.HIGH
    });
  };

  const handleRemoveReminder = (id: string) => {
    if (!selectedId) return;
    setConversations((prev) =>
      prev.map((c) => ({
        ...c,
        reminders: c.reminders.filter((r) => r.id !== id)
      }))
    );
  };

  // 5. UNIFIED TIMELINE & QUICK ACTIONS
  const handleQuickAction = (actionType: "CALL" | "WHATSAPP" | "EMAIL" | "MEETING" | "TASK" | "FOLLOW_UP" | "OPEN_LEAD") => {
    if (!activeConv || !activeLead) return;

    const timestampStr = new Date().toISOString();

    if (actionType === "CALL") {
      // 1. Add Call Event Message
      const sysMsg: Message = {
        id: `msg-sys-${Date.now()}`,
        type: "SYSTEM",
        senderType: "SYSTEM",
        senderName: "Synity Phone Logger",
        body: "Outbound Call Connected: Dialing primary number...",
        timestamp: timestampStr,
        channel: "PHONE",
        systemEventDetails: {
          eventType: "STATUS_CHANGED",
          meta: { duration: "Connecting...", number: activeLead.phone || "No phone listed" }
        }
      };

      // Update lead status in main app
      onUpdateLeadStatus(activeLead.id, LeadStatus.CALLED);

      // Log activity
      onAddActivity({
        leadId: activeLead.id,
        leadName: activeLead.name,
        type: ActivityType.CALL,
        title: "Logged Outbound Call",
        description: `Dialed ${activeLead.phone || "primary mobile number"} from Universal Communication Hub.`,
        userName: "Agent John"
      });

      // Append call system log
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              lastMessageText: "Outbound Call Connected: Dialing...",
              lastMessageTimestamp: timestampStr,
              messages: [...c.messages, sysMsg]
            };
          }
          return c;
        })
      );
    } 
    
    else if (actionType === "WHATSAPP") {
      const sysMsg: Message = {
        id: `msg-sys-${Date.now()}`,
        type: "SYSTEM",
        senderType: "SYSTEM",
        senderName: "WhatsApp Ingestion",
        body: "WhatsApp Thread Initiated: Quick follow up template delivered.",
        timestamp: timestampStr,
        channel: "WHATSAPP",
        systemEventDetails: {
          eventType: "STATUS_CHANGED",
          meta: { status: "WHATSAPP_SENT", target: activeLead.whatsapp || "primary mobile" }
        }
      };

      onUpdateLeadStatus(activeLead.id, LeadStatus.WHATSAPP_SENT);

      onAddActivity({
        leadId: activeLead.id,
        leadName: activeLead.name,
        type: ActivityType.NOTE,
        title: "Sent WhatsApp Outreach",
        description: "Sent introductory greeting to lead on WhatsApp.",
        userName: "Agent John"
      });

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              lastMessageText: "WhatsApp Thread Initiated",
              lastMessageTimestamp: timestampStr,
              messages: [...c.messages, sysMsg]
            };
          }
          return c;
        })
      );
    }

    else if (actionType === "EMAIL") {
      const sysMsg: Message = {
        id: `msg-sys-${Date.now()}`,
        type: "SYSTEM",
        senderType: "SYSTEM",
        senderName: "Synity Mailer",
        body: `Email Sent: Pricing spreadsheet attachment delivered to ${activeLead.email}.`,
        timestamp: timestampStr,
        channel: "EMAIL",
        systemEventDetails: {
          eventType: "PROPOSAL_SENT",
          meta: { subject: "Pricing Proposal", email: activeLead.email }
        }
      };

      onAddActivity({
        leadId: activeLead.id,
        leadName: activeLead.name,
        type: ActivityType.EMAIL,
        title: "Sent Pricing Email",
        description: "Delivered pricing proposal spreadsheet to registered email address.",
        userName: "Agent John"
      });

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              lastMessageText: "Sent Pricing Proposal",
              lastMessageTimestamp: timestampStr,
              messages: [...c.messages, sysMsg]
            };
          }
          return c;
        })
      );
    }

    else if (actionType === "MEETING") {
      const sysMsg: Message = {
        id: `msg-sys-${Date.now()}`,
        type: "SYSTEM",
        senderType: "SYSTEM",
        senderName: "Synity Calendar Sync",
        body: "Calendar Event Created: Technical Onboarding Kickoff",
        timestamp: timestampStr,
        channel: activeConv.channel,
        systemEventDetails: {
          eventType: "MEETING_SCHEDULED",
          meta: { host: "Agent John", date: "Next Tuesday, 2 PM", video: "https://zoom.us/j/8492" }
        }
      };

      onUpdateLeadStatus(activeLead.id, LeadStatus.MEETING);

      onAddActivity({
        leadId: activeLead.id,
        leadName: activeLead.name,
        type: ActivityType.MEETING,
        title: "Scheduled Technical Onboarding Kickoff",
        description: "Created video sync appointment for next Tuesday.",
        userName: "Agent John"
      });

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              lastMessageText: "Calendar Event Created",
              lastMessageTimestamp: timestampStr,
              messages: [...c.messages, sysMsg]
            };
          }
          return c;
        })
      );
    }

    else if (actionType === "TASK") {
      // Task creation
      onAddTask({
        leadId: activeLead.id,
        leadName: activeLead.name,
        title: `Follow up on recent ${activeConv.channel} thread`,
        description: "Manually created workday task from Universal Communication Hub sidebar.",
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // 2 days
        priority: TaskPriority.MEDIUM
      });

      // Quick visual toast simulation inside thread
      const sysMsg: Message = {
        id: `msg-sys-${Date.now()}`,
        type: "SYSTEM",
        senderType: "SYSTEM",
        senderName: "Synity Taskmaster",
        body: "CRM Task Logged: Follow up on recent thread",
        timestamp: timestampStr,
        channel: activeConv.channel,
        systemEventDetails: {
          eventType: "FOLLOW_UP_CREATED",
          meta: { priority: "MEDIUM", status: "TODO" }
        }
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              messages: [...c.messages, sysMsg]
            };
          }
          return c;
        })
      );
    }

    else if (actionType === "FOLLOW_UP") {
      onUpdateLeadStatus(activeLead.id, LeadStatus.FOLLOW_UP);
      
      const sysMsg: Message = {
        id: `msg-sys-${Date.now()}`,
        type: "SYSTEM",
        senderType: "SYSTEM",
        senderName: "Synity State Engine",
        body: "CRM Status Updated: Pipeline moved to FOLLOW UP",
        timestamp: timestampStr,
        channel: activeConv.channel,
        systemEventDetails: {
          eventType: "STATUS_CHANGED",
          meta: { previous: activeLead.status, current: "FOLLOW_UP" }
        }
      };

      onAddActivity({
        leadId: activeLead.id,
        leadName: activeLead.name,
        type: ActivityType.STATE_CHANGE,
        title: "Moved Stage to Follow Up",
        description: "Pipeline status updated from Universal Communication Hub sidebar.",
        userName: "Agent John"
      });

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              messages: [...c.messages, sysMsg]
            };
          }
          return c;
        })
      );
    }

    else if (actionType === "OPEN_LEAD") {
      alert(`Navigating to Lead Overview profile for ${activeLead.name} (${activeLead.company}).`);
    }
  };

  // Helper mapping channel to ActivityType
  const getCategoryFromChannel = (chan: CommunicationChannel): ActivityType => {
    if (chan === "EMAIL") return ActivityType.EMAIL;
    if (chan === "PHONE") return ActivityType.CALL;
    return ActivityType.NOTE; // Default
  };

  return (
    <div className="space-y-4 text-left h-full flex flex-col" id="comms-hub-root-view">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8D8D8] pb-5 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-wider">
              Flagship Core System
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">Channel Engine v3.9</span>
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-[#2F2F2F]">
            Universal Communication Hub
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl font-medium">
            A single, unified cockpit coordinating all outbound channels (Email, WhatsApp, Voice Logs, and future-ready networks). Ingest, route, and schedule messages without switching tabs.
          </p>
        </div>

        {/* Dynamic Controls / Sync Toggles */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          
          {/* Connection Error Simulator Trigger */}
          <button
            type="button"
            onClick={() => setConnectionError(!connectionError)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              connectionError
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-emerald-50 text-emerald-600 border-emerald-200"
            }`}
            title="Click to simulate connection status toggle for testing error retry UI"
          >
            {connectionError ? (
              <>
                <WifiOff size={13} className="text-rose-500 animate-pulse" />
                <span>Simulated Offline</span>
              </>
            ) : (
              <>
                <Wifi size={13} className="text-emerald-500" />
                <span>Simulated Online</span>
              </>
            )}
          </button>

          {/* Sync Button */}
          <button
            type="button"
            onClick={handleForceRefresh}
            className="p-2 bg-white hover:bg-gray-100 text-[#2F2F2F] border border-[#D8D8D8] rounded-xl transition-all cursor-pointer shadow-3xs hover:shadow-xs flex items-center justify-center"
            title="Force refresh synchronization"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* THREE PANEL GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-hidden items-stretch">
        
        {/* PANEL 1: LEFT CONVERSATION LISTING (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col min-h-[450px] lg:h-full overflow-hidden">
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedId}
            onSelectConversation={setSelectedId}
            isLoading={isLoading}
          />
        </div>

        {/* PANEL 2: CENTER THREAD WORKSPACE (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col min-h-[500px] lg:h-full overflow-hidden">
          <ConversationView
            conversation={activeConv}
            lead={activeLead}
            onSendMessage={handleSendMessage}
            onTogglePin={handleTogglePin}
            onClearThread={() => {
              if (window.confirm("Are you sure you want to clear message history from local storage cache?")) {
                setConversations((prev) =>
                  prev.map((c) => (c.id === selectedId ? { ...c, messages: [] } : c))
                );
              }
            }}
            connectionError={connectionError}
            onRetryConnection={() => setConnectionError(false)}
          />
        </div>

        {/* PANEL 3: RIGHT LEAD PROFILE SUMMARY (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col min-h-[400px] lg:h-full overflow-hidden">
          <LeadSidebar
            lead={activeLead}
            conversation={activeConv}
            onQuickAction={handleQuickAction}
            onAddReminder={handleAddReminder}
            onRemoveReminder={handleRemoveReminder}
          />
        </div>

      </div>
    </div>
  );
};
export default CommunicationHub;
