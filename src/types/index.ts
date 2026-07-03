/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LeadStatus {
  NEW = "NEW",
  CALLED = "CALLED",
  NO_ANSWER = "NO_ANSWER",
  INTERESTED = "INTERESTED",
  WHATSAPP_SENT = "WHATSAPP_SENT",
  FOLLOW_UP = "FOLLOW_UP",
  MEETING = "MEETING",
  PROPOSAL = "PROPOSAL",
  NEGOTIATION = "NEGOTIATION",
  CLOSED_WON = "CLOSED_WON",
  CLOSED_LOST = "CLOSED_LOST"
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH"
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}

export enum ActivityType {
  CALL = "CALL",
  EMAIL = "EMAIL",
  MEETING = "MEETING",
  NOTE = "NOTE",
  STATE_CHANGE = "STATE_CHANGE"
}

export interface Lead {
  id: string;
  name: string; // Owner Name / Contact Name
  company: string; // Business Name
  email: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  industry?: string;
  country?: string;
  value: number; // Estimated Deal Value
  status: LeadStatus;
  source: string; // Lead Source
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  createdAt: string;
  nextFollowUp?: string;
  confidenceScore: number; // Percentage 0 - 100
  notes?: string;
  tags?: string[];
  updatedAt?: string;
  lastContactedAt?: string;
}

export interface Task {
  id: string;
  leadId?: string;
  leadName?: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface ActivityLog {
  id: string;
  leadId?: string;
  leadName?: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  userName: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  status: LeadStatus;
  color: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  type: "FOLLOW_UP" | "TASK_DUE" | "SYSTEM" | "AI_INSIGHT";
  timestamp: string;
  read: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}
