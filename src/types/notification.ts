/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum NotificationType {
  UPCOMING_CALL = "UPCOMING_CALL",
  UPCOMING_MEETING = "UPCOMING_MEETING",
  FOLLOW_UP_DUE = "FOLLOW_UP_DUE",
  OVERDUE_FOLLOW_UP = "OVERDUE_FOLLOW_UP",
  TASK_DUE = "TASK_DUE",
  PROPOSAL_REMINDER = "PROPOSAL_REMINDER",
  LEAD_BECOMING_COLD = "LEAD_BECOMING_COLD",
  DEAL_CLOSED = "DEAL_CLOSED",
  DEAL_LOST = "DEAL_LOST",
  IMPORT_COMPLETED = "IMPORT_COMPLETED",
  AI_INSIGHT = "AI_INSIGHT",
  ACHIEVEMENT = "ACHIEVEMENT",
  SYSTEM_NOTIFICATION = "SYSTEM_NOTIFICATION"
}

export enum NotificationPriority {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW"
}

export enum NotificationStatus {
  ACTIVE = "ACTIVE",
  SNOOZED = "SNOOZED",
  COMPLETED = "COMPLETED",
  DISMISSED = "DISMISSED",
  ARCHIVED = "ARCHIVED"
}

export enum ReminderTriggerOption {
  AT_TIME = "AT_TIME",
  MINUTES_10 = "MINUTES_10",
  MINUTES_30 = "MINUTES_30",
  HOUR_1 = "HOUR_1",
  HOURS_3 = "HOURS_3",
  DAY_1 = "DAY_1",
  CUSTOM = "CUSTOM"
}

export enum ReminderRecurrence {
  NONE = "NONE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  CUSTOM = "CUSTOM"
}

export interface LeadReference {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  timestamp: string; // ISO datetime string
  dueDate?: string;  // ISO datetime string
  leadRef?: LeadReference;
  isPinned: boolean;
  isRead: boolean;
  recurrence?: ReminderRecurrence;
  triggerOption?: ReminderTriggerOption;
  snoozeCount: number;
  lastSnoozedAt?: string;
  isEscalated?: boolean;
  escalationReason?: string;
}

export interface NotificationSettings {
  meetings: boolean;
  calls: boolean;
  tasks: boolean;
  followups: boolean;
  proposals: boolean;
  achievements: boolean;
  system: boolean;
  ai: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "HH:MM" format
  quietHoursEnd: string;   // "HH:MM" format
}

export interface SummaryDigest {
  id: string;
  type: "MORNING" | "EVENING" | "WEEKLY" | "MONTHLY";
  timestamp: string;
  totalAlertsCount: number;
  criticalAlertsCount: number;
  topActionItems: string[];
  aiSummary: string;
  leadsToReengage: LeadReference[];
}
