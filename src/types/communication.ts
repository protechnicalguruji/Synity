/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LeadStatus } from "./index";

export type CommunicationChannel =
  | "EMAIL"
  | "WHATSAPP"
  | "PHONE"
  | "LINKEDIN"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "TELEGRAM"
  | "SLACK"
  | "SMS";

export type MessageType =
  | "TEXT"
  | "IMAGE"
  | "FILE"
  | "PDF"
  | "VOICE_NOTE"
  | "LOCATION"
  | "LINK"
  | "SYSTEM";

export type MessageSenderType = "INCOMING" | "OUTGOING" | "SYSTEM";

export type MessageStatus = "SENT" | "DELIVERED" | "READ" | "FAILED" | "QUEUED";

export interface MessageAttachment {
  name: string;
  url: string;
  size?: string;
  type?: string;
}

export interface Message {
  id: string;
  type: MessageType;
  senderType: MessageSenderType;
  senderName: string;
  body: string;
  timestamp: string;
  status?: MessageStatus;
  channel: CommunicationChannel;
  attachments?: MessageAttachment[];
  systemEventDetails?: {
    eventType: "MEETING_SCHEDULED" | "FOLLOW_UP_CREATED" | "PROPOSAL_SENT" | "STATUS_CHANGED";
    meta?: Record<string, string>;
  };
}

export interface ConversationAISummary {
  summary: string;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  intent: string;
  nextBestAction: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  riskReason?: string;
}

export interface SmartReminder {
  id: string;
  type: "REPLY_IN_2H" | "CALL_TOMORROW" | "FOLLOW_UP_FRIDAY" | "CUSTOM";
  title: string;
  dueDate: string;
  triggered: boolean;
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  businessName: string;
  channel: CommunicationChannel;
  lastMessageText: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  isPinned: boolean;
  messages: Message[];
  aiInsight?: ConversationAISummary;
  reminders: SmartReminder[];
}

export type TemplateCategory =
  | "COLD_OUTREACH"
  | "FOLLOW_UP"
  | "MEETING_REMINDER"
  | "PROPOSAL_REMINDER"
  | "THANK_YOU";

export interface CommunicationTemplate {
  id: string;
  category: TemplateCategory;
  title: string;
  subject?: string;
  body: string;
  channel: "EMAIL" | "WHATSAPP" | "SMS";
}
