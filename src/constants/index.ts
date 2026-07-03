/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LeadStatus, TaskPriority, TaskStatus, ActivityType, PipelineStage, Lead, Task, ActivityLog, SystemNotification } from "../types";

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: "stage-1", name: "New Leads", status: LeadStatus.NEW, color: "#8CB9D7" },
  { id: "stage-2", name: "Contacted", status: LeadStatus.CONTACTED, color: "#F2C94C" },
  { id: "stage-3", name: "Qualified", status: LeadStatus.QUALIFIED, color: "#27AE60" },
  { id: "stage-4", name: "Proposal Sent", status: LeadStatus.PROPOSAL, color: "#BB6BD9" },
  { id: "stage-5", name: "Negotiation", status: LeadStatus.NEGOTIATION, color: "#2F80ED" },
  { id: "stage-6", name: "Closed Won", status: LeadStatus.CLOSED_WON, color: "#219653" },
  { id: "stage-7", name: "Closed Lost", status: LeadStatus.CLOSED_LOST, color: "#EB5757" }
];

export const LEAD_SOURCES = [
  "Inbound Website",
  "LinkedIn Outreach",
  "Cold Call Campaign",
  "Partner Referral",
  "Product Hunt Hunt",
  "Newsletter Signup"
];

export const MOCK_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Alexander Mercer",
    company: "Helix BioTech Solutions",
    email: "alex.mercer@helixbio.io",
    phone: "+1 (555) 349-2041",
    value: 48000,
    status: LeadStatus.NEW,
    source: "LinkedIn Outreach",
    createdAt: "2026-06-28T09:15:00Z",
    nextFollowUp: "2026-07-04T10:00:00Z",
    confidenceScore: 78,
    notes: "Alex is looking for a comprehensive CRM customization. He is currently evaluating Salesforce but dislikes the complexity. Synity has a huge advantage here."
  },
  {
    id: "lead-2",
    name: "Elena Rostova",
    company: "Aether Digital Agency",
    email: "elena@aetherdigital.com",
    phone: "+44 20 7946 0192",
    value: 12500,
    status: LeadStatus.CONTACTED,
    source: "Inbound Website",
    createdAt: "2026-06-29T11:30:00Z",
    nextFollowUp: "2026-07-03T15:00:00Z",
    confidenceScore: 65,
    notes: "Aether wants to streamline their web development project intake pipeline. Showed them the pipeline integration. She requested a custom workflow proposal."
  },
  {
    id: "lead-3",
    name: "Marcus Aurelius Vance",
    company: "Centurion Real Estate",
    email: "mvance@centurionre.com",
    phone: "+1 (555) 712-4589",
    value: 85000,
    status: LeadStatus.QUALIFIED,
    source: "Partner Referral",
    createdAt: "2026-06-25T14:20:00Z",
    nextFollowUp: "2026-07-05T09:00:00Z",
    confidenceScore: 92,
    notes: "High value deal. Marcus needs an AI sales tool for his brokers. AI auto-categorization and follow-up generation is the absolute killer feature for him."
  },
  {
    id: "lead-4",
    name: "Sarah Jenkins",
    company: "Apex Scaling Co.",
    email: "sarah.j@apexscaling.com",
    phone: "+1 (555) 890-3411",
    value: 22000,
    status: LeadStatus.PROPOSAL,
    source: "Cold Call Campaign",
    createdAt: "2026-06-20T10:00:00Z",
    nextFollowUp: "2026-07-06T14:30:00Z",
    confidenceScore: 80,
    notes: "Sent proposal last Tuesday. Followed up on Thursday. Sarah is interested in our pilot package for her team of 12 sales representatives."
  },
  {
    id: "lead-5",
    name: "Kenji Sato",
    company: "Mirai Ventures",
    email: "sato.k@miraiventures.jp",
    phone: "+81 3 5555 0143",
    value: 150000,
    status: LeadStatus.NEGOTIATION,
    source: "Partner Referral",
    createdAt: "2026-06-15T08:00:00Z",
    nextFollowUp: "2026-07-03T17:00:00Z",
    confidenceScore: 85,
    notes: "Contract draft under legal review at Mirai. Negotiating payment terms and server localization details. Close expected before July 15th."
  },
  {
    id: "lead-6",
    name: "Clara Oswald",
    company: "Chronos Media Group",
    email: "clara.oswald@chronos.tv",
    phone: "+44 1632 960012",
    value: 35000,
    status: LeadStatus.CLOSED_WON,
    source: "Product Hunt",
    createdAt: "2026-06-10T15:45:00Z",
    confidenceScore: 100,
    notes: "Deal closed! Subscribed to Enterprise Annual Plan. Successfully onboarded the primary executive assistant and sales leads."
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    leadId: "lead-2",
    leadName: "Elena Rostova",
    title: "Draft customization proposal",
    description: "Prepare and email the custom workflow intake template with agency-specific pricing modules.",
    dueDate: "2026-07-03T18:00:00Z",
    priority: TaskPriority.HIGH,
    status: TaskStatus.TODO
  },
  {
    id: "task-2",
    leadId: "lead-5",
    leadName: "Kenji Sato",
    title: "Finalize compliance document",
    description: "Coordinate with tech lead to secure data sovereignty and localized storage guarantee clauses for legal review.",
    dueDate: "2026-07-04T12:00:00Z",
    priority: TaskPriority.HIGH,
    status: TaskStatus.IN_PROGRESS
  },
  {
    id: "task-3",
    leadId: "lead-1",
    leadName: "Alexander Mercer",
    title: "Introductory discovery demonstration",
    description: "Introduce Synity core benefits: proactive follow-ups and AI intelligence. Avoid standard Salesforce over-complications.",
    dueDate: "2026-07-04T10:00:00Z",
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO
  },
  {
    id: "task-4",
    leadId: "lead-3",
    leadName: "Marcus Aurelius Vance",
    title: "Send real estate agent workflow slides",
    description: "Follow up with Marcus providing the brokerage layout blueprint slides we discussed.",
    dueDate: "2026-07-05T09:00:00Z",
    priority: TaskPriority.LOW,
    status: TaskStatus.TODO
  },
  {
    id: "task-5",
    title: "Calibrate email warm-up schedules",
    description: "Check LinkedIn outreach domain warm-up statistics in Google Search Console / Postmaster tools.",
    dueDate: "2026-07-02T17:00:00Z",
    priority: TaskPriority.LOW,
    status: TaskStatus.DONE
  }
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    id: "activity-1",
    leadId: "lead-6",
    leadName: "Clara Oswald",
    type: ActivityType.STATE_CHANGE,
    title: "Deal Closed Won 🎉",
    description: "Clara Oswald signed the master service agreement. Synity license initialized.",
    timestamp: "2026-07-02T16:30:00Z",
    userName: "Alex Rivers"
  },
  {
    id: "activity-2",
    leadId: "lead-5",
    leadName: "Kenji Sato",
    type: ActivityType.MEETING,
    title: "Contract negotiation sync",
    description: "Discussed localized infrastructure and Japan region data backup. Japan legal team accepted standard API terms with custom annex.",
    timestamp: "2026-07-02T11:00:00Z",
    userName: "Alex Rivers"
  },
  {
    id: "activity-3",
    leadId: "lead-2",
    leadName: "Elena Rostova",
    type: ActivityType.CALL,
    title: "Incoming phone call check-in",
    description: "Elena inquired about native Google Sheets exports and API webhook triggers for her engineering team.",
    timestamp: "2026-07-01T14:15:00Z",
    userName: "Alex Rivers"
  },
  {
    id: "activity-4",
    leadId: "lead-4",
    leadName: "Sarah Jenkins",
    type: ActivityType.EMAIL,
    title: "Emailed Proposal V1.1",
    description: "Sent structured corporate contract outlining the 12-user pilot package and live SLA training schedule.",
    timestamp: "2026-06-30T09:40:00Z",
    userName: "Alex Rivers"
  }
];

export const MOCK_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    title: "Immediate Follow-up Required",
    description: "Elena Rostova (Aether Digital) requested proposal customization before end of day.",
    type: "FOLLOW_UP",
    timestamp: "2026-07-03T11:00:00Z",
    read: false
  },
  {
    id: "notif-2",
    title: "AI Insight: Close Propensity High",
    description: "Marcus Aurelius Vance's company website activity shows 4 repeat visits on our features board. Pitch active integration now.",
    type: "AI_INSIGHT",
    timestamp: "2026-07-02T19:20:00Z",
    read: false
  },
  {
    id: "notif-3",
    title: "Task Overdue Notice",
    description: "Calibrate email warm-up schedules was completed late.",
    type: "TASK_DUE",
    timestamp: "2026-07-02T17:05:00Z",
    read: true
  }
];
