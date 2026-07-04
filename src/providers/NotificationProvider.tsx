/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  AppNotification,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NotificationSettings,
  SummaryDigest,
  ReminderRecurrence,
  ReminderTriggerOption,
  LeadReference
} from "../types/notification";
import { MOCK_LEADS } from "../constants";

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: "success" | "warning" | "error" | "info" | "ai";
  duration?: number;
}

interface NotificationContextType {
  notifications: AppNotification[];
  settings: NotificationSettings;
  digests: SummaryDigest[];
  toasts: ToastMessage[];
  addNotification: (notif: Omit<AppNotification, "id" | "timestamp" | "snoozeCount" | "isRead">) => void;
  updateNotificationStatus: (id: string, status: NotificationStatus) => void;
  togglePinNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  snoozeNotification: (id: string, durationMinutes: number) => void;
  addToast: (title: string, description: string, type: ToastMessage["type"], duration?: number) => void;
  removeToast: (id: string) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  escalateNotification: (id: string, reason: string) => void;
  generateDigest: (type: "MORNING" | "EVENING" | "WEEKLY" | "MONTHLY") => SummaryDigest;
  simulateRealtimeNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Initial premium mock notifications mapped from context or default rules
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-mock-1",
    title: "Immediate Follow-up Required",
    description: "Elena Rostova (Aether Digital Agency) requested proposal customization before end of day.",
    type: NotificationType.FOLLOW_UP_DUE,
    priority: NotificationPriority.CRITICAL,
    status: NotificationStatus.ACTIVE,
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hrs ago
    dueDate: new Date(Date.now() + 2 * 3600000).toISOString(), // in 2 hrs
    leadRef: {
      id: "lead-2",
      name: "Elena Rostova",
      company: "Aether Digital Agency",
      email: "elena@aetherdigital.com",
      phone: "+44 20 7946 0192"
    },
    isPinned: true,
    isRead: false,
    snoozeCount: 0,
    triggerOption: ReminderTriggerOption.MINUTES_30
  },
  {
    id: "notif-mock-2",
    title: "Overdue Follow-up Notice",
    description: "Introductory demo follow-up with Alexander Mercer is overdue by 1 day.",
    type: NotificationType.OVERDUE_FOLLOW_UP,
    priority: NotificationPriority.CRITICAL,
    status: NotificationStatus.ACTIVE,
    timestamp: new Date(Date.now() - 25 * 3600000).toISOString(), // 25 hrs ago
    dueDate: new Date(Date.now() - 1 * 3600000).toISOString(), // 1 hr ago
    leadRef: {
      id: "lead-1",
      name: "Alexander Mercer",
      company: "Helix BioTech Solutions",
      email: "alex.mercer@helixbio.io",
      phone: "+1 (555) 349-2041"
    },
    isPinned: false,
    isRead: false,
    snoozeCount: 0,
    triggerOption: ReminderTriggerOption.AT_TIME
  },
  {
    id: "notif-mock-3",
    title: "AI Insight: High Engagement Spike",
    description: "Marcus Aurelius Vance's company workspace activity shows 4 repeat visits on our interactive proposal.",
    type: NotificationType.AI_INSIGHT,
    priority: NotificationPriority.HIGH,
    status: NotificationStatus.ACTIVE,
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hrs ago
    leadRef: {
      id: "lead-3",
      name: "Marcus Aurelius Vance",
      company: "Centurion Real Estate",
      email: "mvance@centurionre.com"
    },
    isPinned: false,
    isRead: false,
    snoozeCount: 0
  },
  {
    id: "notif-mock-4",
    title: "Upcoming Meeting",
    description: "Contract finalization with Kenji Sato (Mirai Ventures) is scheduled in 30 minutes.",
    type: NotificationType.UPCOMING_MEETING,
    priority: NotificationPriority.HIGH,
    status: NotificationStatus.ACTIVE,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
    dueDate: new Date(Date.now() + 30 * 60000).toISOString(), // in 30 mins
    leadRef: {
      id: "lead-5",
      name: "Kenji Sato",
      company: "Mirai Ventures",
      email: "sato.k@miraiventures.jp"
    },
    isPinned: false,
    isRead: false,
    snoozeCount: 0,
    triggerOption: ReminderTriggerOption.MINUTES_30
  },
  {
    id: "notif-mock-5",
    title: "Smart Import Completed",
    description: "Successfully ingested and segmented 147 new real estate warm-leads from Zillow XML feed.",
    type: NotificationType.IMPORT_COMPLETED,
    priority: NotificationPriority.MEDIUM,
    status: NotificationStatus.COMPLETED,
    timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hrs ago
    isPinned: false,
    isRead: true,
    snoozeCount: 0
  },
  {
    id: "notif-mock-6",
    title: "New Achievement Unlocked",
    description: "CRM Maverick: Kept communication SLA average below 35 minutes for 5 consecutive workdays!",
    type: NotificationType.ACHIEVEMENT,
    priority: NotificationPriority.LOW,
    status: NotificationStatus.ACTIVE,
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(), // 1 hr ago
    isPinned: false,
    isRead: false,
    snoozeCount: 0
  }
];

const DEFAULT_SETTINGS: NotificationSettings = {
  meetings: true,
  calls: true,
  tasks: true,
  followups: true,
  proposals: true,
  achievements: true,
  system: true,
  ai: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00"
};

const INITIAL_DIGESTS: SummaryDigest[] = [
  {
    id: "digest-1",
    type: "MORNING",
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    totalAlertsCount: 8,
    criticalAlertsCount: 3,
    topActionItems: [
      "Follow up with Elena Rostova on Intake Proposal pricing",
      "Call Kenji Sato to secure Japanese data sovereignty clauses",
      "Review hot Zillow leads queue"
    ],
    aiSummary: "Your morning is packed with high-value deal negotiations. Kenji Sato represents 150k in estimated ARR under review by Japanese counsel. Focus on finalizing that custom annex.",
    leadsToReengage: [
      { id: "lead-2", name: "Elena Rostova", company: "Aether Digital Agency" },
      { id: "lead-5", name: "Kenji Sato", company: "Mirai Ventures" }
    ]
  }
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem("synity_notifications_engine");
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error("Failed to read local notifications", err);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const stored = localStorage.getItem("synity_notification_settings");
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error("Failed to read local settings", err);
    }
    return DEFAULT_SETTINGS;
  });

  const [digests, setDigests] = useState<SummaryDigest[]>(() => {
    try {
      const stored = localStorage.getItem("synity_notification_digests");
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.error("Failed to read local digests", err);
    }
    return INITIAL_DIGESTS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync states to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem("synity_notifications_engine", JSON.stringify(notifications));
    } catch (err) {
      console.error(err);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem("synity_notification_settings", JSON.stringify(settings));
    } catch (err) {
      console.error(err);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem("synity_notification_digests", JSON.stringify(digests));
    } catch (err) {
      console.error(err);
    }
  }, [digests]);

  // Toast controls
  const addToast = (title: string, description: string, type: ToastMessage["type"], duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type, duration }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to check if current time is within quiet hours
  const isCurrentlyInQuietHours = () => {
    if (!settings.quietHoursEnabled) return false;
    const now = new Date();
    const currentHourMinStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const start = settings.quietHoursStart;
    const end = settings.quietHoursEnd;

    if (start <= end) {
      return currentHourMinStr >= start && currentHourMinStr <= end;
    } else {
      // Overnight range, e.g., 22:00 to 07:00
      return currentHourMinStr >= start || currentHourMinStr <= end;
    }
  };

  // Add notification with settings & quiet hours filtering
  const addNotification = (notif: Omit<AppNotification, "id" | "timestamp" | "snoozeCount" | "isRead">) => {
    // Check if notification type is enabled in settings
    let isTypeEnabled = true;
    switch (notif.type) {
      case NotificationType.UPCOMING_MEETING:
        isTypeEnabled = settings.meetings;
        break;
      case NotificationType.UPCOMING_CALL:
        isTypeEnabled = settings.calls;
        break;
      case NotificationType.FOLLOW_UP_DUE:
      case NotificationType.OVERDUE_FOLLOW_UP:
        isTypeEnabled = settings.followups;
        break;
      case NotificationType.TASK_DUE:
        isTypeEnabled = settings.tasks;
        break;
      case NotificationType.PROPOSAL_REMINDER:
        isTypeEnabled = settings.proposals;
        break;
      case NotificationType.ACHIEVEMENT:
        isTypeEnabled = settings.achievements;
        break;
      case NotificationType.AI_INSIGHT:
        isTypeEnabled = settings.ai;
        break;
      case NotificationType.SYSTEM_NOTIFICATION:
        isTypeEnabled = settings.system;
        break;
    }

    if (!isTypeEnabled) return;

    const inQuietHours = isCurrentlyInQuietHours();
    const isCritical = notif.priority === NotificationPriority.CRITICAL;

    // Quiet hours restriction: pause/defer non-critical notifications
    if (inQuietHours && !isCritical) {
      console.log(`Notification of type ${notif.type} suppressed during Quiet Hours: ${notif.title}`);
      return;
    }

    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      snoozeCount: 0,
      isRead: false
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Also fire a beautiful toast notification
    let toastType: ToastMessage["type"] = "info";
    if (newNotif.type === NotificationType.AI_INSIGHT) toastType = "ai";
    else if (newNotif.priority === NotificationPriority.CRITICAL) toastType = "error";
    else if (newNotif.priority === NotificationPriority.HIGH) toastType = "warning";
    else if (newNotif.type === NotificationType.ACHIEVEMENT) toastType = "success";

    addToast(newNotif.title, newNotif.description, toastType);
  };

  const updateNotificationStatus = (id: string, status: NotificationStatus) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status, isRead: status === NotificationStatus.COMPLETED || status === NotificationStatus.DISMISSED ? true : n.isRead } : n))
    );
  };

  const togglePinNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast("All Cleared", "Marked all notifications as read successfully.", "success", 2000);
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Snooze system
  const snoozeNotification = (id: string, durationMinutes: number) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nowIso = new Date().toISOString();
          const newDueDate = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
          return {
            ...n,
            status: NotificationStatus.SNOOZED,
            dueDate: newDueDate,
            lastSnoozedAt: nowIso,
            snoozeCount: n.snoozeCount + 1,
            isRead: false
          };
        }
        return n;
      })
    );

    const match = notifications.find((n) => n.id === id);
    addToast(
      "Reminder Snoozed",
      `Snoozed "${match?.title || 'alert'}" for ${durationMinutes} minutes.`,
      "info",
      3000
    );
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast("Settings Saved", "Your notification engine preferences have been synchronized.", "success", 2000);
  };

  // Smart Escalation: elevate priority if ignored
  const escalateNotification = (id: string, reason: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          let nextPriority = n.priority;
          if (n.priority === NotificationPriority.LOW) nextPriority = NotificationPriority.MEDIUM;
          else if (n.priority === NotificationPriority.MEDIUM) nextPriority = NotificationPriority.HIGH;
          else if (n.priority === NotificationPriority.HIGH) nextPriority = NotificationPriority.CRITICAL;

          return {
            ...n,
            priority: nextPriority,
            isEscalated: true,
            escalationReason: reason,
            title: `⚠️ [ESCALATED] ${n.title}`
          };
        }
        return n;
      })
    );

    const match = notifications.find((n) => n.id === id);
    addToast(
      "Smart Alert Escalated",
      `Critical SLA threat detected for "${match?.title}". Dynamic priority escalated.`,
      "warning",
      4000
    );
  };

  // Generate morning, evening, weekly or monthly AI summaries/digests
  const generateDigest = (type: "MORNING" | "EVENING" | "WEEKLY" | "MONTHLY"): SummaryDigest => {
    const activeAlerts = notifications.filter((n) => n.status === NotificationStatus.ACTIVE);
    const criticalCount = activeAlerts.filter((n) => n.priority === NotificationPriority.CRITICAL).length;
    const leadsReferenced = activeAlerts
      .filter((n) => n.leadRef)
      .map((n) => n.leadRef as LeadReference)
      .slice(0, 3);

    const actionItems = activeAlerts.map((n) => n.title).slice(0, 4);

    let summaryText = "";
    if (type === "MORNING") {
      summaryText = `Welcome to your Morning Briefing. You have ${activeAlerts.length} active notifications pending, including ${criticalCount} critical items requiring urgent outbound action. Focus on high priority follow-ups.`;
    } else if (type === "EVENING") {
      summaryText = `Evening summary compiled. You completed or handled several pipeline items today. ${activeAlerts.length} follow-up points remain carried over for tomorrow morning. Quiet hours are configured.`;
    } else {
      summaryText = `Analytical period review compiled. Your average outreach SLA is holding strong, but ${criticalCount} items breached threshold. Recommend setting proactive 10-minute callback buffers.`;
    }

    const newDigest: SummaryDigest = {
      id: `digest-${Date.now()}`,
      type,
      timestamp: new Date().toISOString(),
      totalAlertsCount: activeAlerts.length,
      criticalAlertsCount: criticalCount,
      topActionItems: actionItems.length > 0 ? actionItems : ["Everything is currently up to date!"],
      aiSummary: summaryText,
      leadsToReengage: leadsReferenced
    };

    setDigests((prev) => [newDigest, ...prev]);
    addToast(`${type.charAt(0) + type.slice(1).toLowerCase()} Digest Synthesized`, "Check the digests sidebar section to read.", "ai", 3000);
    return newDigest;
  };

  // Simulate real-time inbound notification event
  const simulateRealtimeNotification = () => {
    const randomLead = MOCK_LEADS[Math.floor(Math.random() * MOCK_LEADS.length)];
    const typesList = [
      {
        title: "Upcoming Callback Scheduled",
        description: `Dialing window opens in 10 minutes for ${randomLead.name} (${randomLead.company}). Prep the discovery script.`,
        type: NotificationType.UPCOMING_CALL,
        priority: NotificationPriority.HIGH,
        leadRef: { id: randomLead.id, name: randomLead.name, company: randomLead.company, phone: randomLead.phone, email: randomLead.email },
        dueDate: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      },
      {
        title: "Cold Risk Warning",
        description: `High-value lead ${randomLead.name} has had no contact events for 6 consecutive days. Inbound temperature dropping.`,
        type: NotificationType.LEAD_BECOMING_COLD,
        priority: NotificationPriority.MEDIUM,
        leadRef: { id: randomLead.id, name: randomLead.name, company: randomLead.company, phone: randomLead.phone, email: randomLead.email }
      },
      {
        title: "Proposal SLA Expiring",
        description: `Pricing worksheet proposal for ${randomLead.company} was delivered 3 days ago. Dynamic retry suggested.`,
        type: NotificationType.PROPOSAL_REMINDER,
        priority: NotificationPriority.HIGH,
        leadRef: { id: randomLead.id, name: randomLead.name, company: randomLead.company, phone: randomLead.phone, email: randomLead.email }
      },
      {
        title: "System Performance Sync",
        description: "Google Calendar synchronization refreshed. Ingested 3 inbound onboarding meet slots.",
        type: NotificationType.SYSTEM_NOTIFICATION,
        priority: NotificationPriority.LOW
      }
    ];

    const chosen = typesList[Math.floor(Math.random() * typesList.length)];
    addNotification({
      title: chosen.title,
      description: chosen.description,
      type: chosen.type,
      priority: chosen.priority,
      status: NotificationStatus.ACTIVE,
      isPinned: false,
      leadRef: chosen.leadRef,
      dueDate: chosen.dueDate
    });
  };

  // Background ticker simulating reminder callback warnings and smart priority/escalation checks
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prevNotifs) => {
        let changed = false;
        const now = Date.now();

        const updated = prevNotifs.map((n) => {
          // 1. Overdue Checker: Active notifications that have a past due date and are not already marked overdue/critical
          if (
            n.dueDate &&
            n.status === NotificationStatus.ACTIVE &&
            new Date(n.dueDate).getTime() < now &&
            n.type !== NotificationType.OVERDUE_FOLLOW_UP &&
            n.priority !== NotificationPriority.CRITICAL
          ) {
            changed = true;
            addToast(`⏰ Overdue: ${n.title}`, "This high-importance action has exceeded scheduled timeline limits.", "error");
            return {
              ...n,
              priority: NotificationPriority.CRITICAL,
              type: NotificationType.OVERDUE_FOLLOW_UP,
              title: `⚠️ [OVERDUE] ${n.title}`
            };
          }

          // 2. Callback Reminders at specific milestones (Call at 3 PM -> Warn at 2 PM, 2:30 PM, 2:50 PM)
          if (
            n.dueDate &&
            n.status === NotificationStatus.ACTIVE &&
            n.type === NotificationType.UPCOMING_CALL
          ) {
            const timeDiffMs = new Date(n.dueDate).getTime() - now;
            const minsLeft = Math.floor(timeDiffMs / 60000);

            // Trigger alerts at exactly 60, 30, and 10 minutes remaining
            if (minsLeft === 60 && !n.isRead) {
              changed = true;
              addToast("Upcoming Call Brief", `1 hour remains before scheduled call with ${n.leadRef?.name || "lead"}.`, "info");
            } else if (minsLeft === 30 && !n.isRead) {
              changed = true;
              addToast("Call Approaching (30m)", `30 minutes remains before dialing ${n.leadRef?.name || "lead"}.`, "warning");
            } else if (minsLeft === 10 && !n.isRead) {
              changed = true;
              addToast("🚨 URGENT CALL PREP (10m)", `10 minutes remains! Review sales playbook for ${n.leadRef?.name || "lead"}.`, "error");
            }
          }

          // 3. Smart Escalation: If a HIGH priority notification is ignored/untouched for more than 3 minutes, escalate to CRITICAL
          if (
            n.status === NotificationStatus.ACTIVE &&
            n.priority === NotificationPriority.HIGH &&
            !n.isRead &&
            !n.isEscalated &&
            now - new Date(n.timestamp).getTime() > 180000 // 3 minutes
          ) {
            changed = true;
            return {
              ...n,
              priority: NotificationPriority.CRITICAL,
              isEscalated: true,
              escalationReason: "Unresolved high-priority action threshold breached.",
              title: `🔥 [ESCALATED] ${n.title}`
            };
          }

          return n;
        });

        return changed ? updated : prevNotifs;
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        settings,
        digests,
        toasts,
        addNotification,
        updateNotificationStatus,
        togglePinNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        snoozeNotification,
        addToast,
        removeToast,
        updateSettings,
        escalateNotification,
        generateDigest,
        simulateRealtimeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
