/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Conversation, CommunicationTemplate, SmartReminder } from "../types/communication";

export const MOCK_TEMPLATES: CommunicationTemplate[] = [
  {
    id: "template-1",
    category: "COLD_OUTREACH",
    title: "Intro to Synity's AI CRM",
    subject: "Accelerate your pipeline with Synity AI",
    body: "Hi {{LeadName}},\n\nI noticed you're scaling operations at {{CompanyName}}. We recently launched a unified sales engine that automates workday planning and contact ingestion.\n\nWould you be open to a quick 10-minute sync this Thursday?\n\nBest regards,\n{{AgentName}}",
    channel: "EMAIL"
  },
  {
    id: "template-2",
    category: "FOLLOW_UP",
    title: "Post-Call Resource Sharing",
    subject: "Synity CRM Demo & Platform Overview",
    body: "Hi {{LeadName}},\n\nGreat speaking with you earlier! As promised, here is the quick overview of our core features:\n- 10-step Smart Import Pipeline\n- AI Daily Task Distribution\n- Real-time Visual Pipeline\n\nLet me know if next Tuesday works for a quick deep dive!\n\nBest,\n{{AgentName}}",
    channel: "EMAIL"
  },
  {
    id: "template-3",
    category: "MEETING_REMINDER",
    title: "Calendar Sync Reminder (WhatsApp)",
    body: "Hey {{LeadName}}, looking forward to our sync tomorrow at {{MeetingTime}}. Here is our video link: {{MeetingLink}}. See you then!",
    channel: "WHATSAPP"
  },
  {
    id: "template-4",
    category: "PROPOSAL_REMINDER",
    title: "Follow-up on Custom Proposal",
    subject: "Quick question regarding Synity Proposal",
    body: "Hi {{LeadName}},\n\nI wanted to follow up on the custom implementation plan we shared last week. Have you had a chance to review it with the team?\n\nHappy to answer any technical or pricing questions.\n\nBest,\n{{AgentName}}",
    channel: "EMAIL"
  },
  {
    id: "template-5",
    category: "THANK_YOU",
    title: "Onboarding Welcome Note",
    body: "Hi {{LeadName}}! Welcome to Synity CRM. We are super thrilled to have {{CompanyName}} on board. Let's schedule our initial onboarding kickoff!",
    channel: "WHATSAPP"
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    leadId: "lead-1",
    leadName: "Alexander Mercer",
    businessName: "Helix BioTech Solutions",
    channel: "EMAIL",
    lastMessageText: "I'll review the proposal with the board this afternoon and let you know if they approve.",
    lastMessageTimestamp: "2026-07-04T01:30:00Z",
    unreadCount: 2,
    isPinned: true,
    reminders: [
      {
        id: "rem-1",
        type: "REPLY_IN_2H",
        title: "Send board presentation supplementary materials",
        dueDate: "2026-07-04T03:30:00Z",
        triggered: false
      }
    ],
    aiInsight: {
      summary: "Lead is highly interested but needs board-level approval before proceeding with CRM replacement. Evaluating Salesforce but prefers Synity's simplicity.",
      sentiment: "POSITIVE",
      intent: "PURCHASE_EVALUATION",
      nextBestAction: "Provide supplementary data sheet on CRM comparative ROI and data migration speed.",
      riskLevel: "MEDIUM",
      riskReason: "High internal bureaucracy at Helix BioTech could stall the procurement cycle."
    },
    messages: [
      {
        id: "msg-1-1",
        type: "TEXT",
        senderType: "OUTGOING",
        senderName: "Agent John",
        body: "Hi Alexander, glad we connected today on LinkedIn. I would love to share how Synity can help Helix BioTech map out custom CRM properties.",
        timestamp: "2026-07-03T09:00:00Z",
        status: "READ",
        channel: "EMAIL"
      },
      {
        id: "msg-1-2",
        type: "TEXT",
        senderType: "INCOMING",
        senderName: "Alexander Mercer",
        body: "Thanks John. We are actively looking for an alternative to Salesforce. Our team finds it incredibly heavy to use. What is your ingestion pipeline like?",
        timestamp: "2026-07-03T10:15:00Z",
        status: "READ",
        channel: "EMAIL"
      },
      {
        id: "msg-1-3",
        type: "TEXT",
        senderType: "OUTGOING",
        senderName: "Agent John",
        body: "Our Smart Import Hub has a 10-step pipeline with automated duplicate cross-checks, manual override mapping, and field matching. I'm attaching our technical datasheet for review.",
        timestamp: "2026-07-03T11:00:00Z",
        status: "READ",
        channel: "EMAIL",
        attachments: [
          {
            name: "Synity_CRM_Technical_Specs.pdf",
            url: "https://example.com/synity_specs.pdf",
            size: "1.2 MB",
            type: "pdf"
          }
        ]
      },
      {
        id: "msg-1-4",
        type: "SYSTEM",
        senderType: "SYSTEM",
        senderName: "Synity System",
        body: "Proposal Sent: Custom Helix BioTech Deployment Plan ($48,000)",
        timestamp: "2026-07-03T14:30:00Z",
        channel: "EMAIL",
        systemEventDetails: {
          eventType: "PROPOSAL_SENT",
          meta: { value: "$48,000", documentId: "doc-9428" }
        }
      },
      {
        id: "msg-1-5",
        type: "TEXT",
        senderType: "INCOMING",
        senderName: "Alexander Mercer",
        body: "This looks impressive. I'll review the proposal with the board this afternoon and let you know if they approve.",
        timestamp: "2026-07-04T01:30:00Z",
        status: "DELIVERED",
        channel: "EMAIL"
      }
    ]
  },
  {
    id: "conv-2",
    leadId: "lead-3",
    leadName: "Marcus Aurelius Vance",
    businessName: "Centurion Real Estate",
    channel: "WHATSAPP",
    lastMessageText: "Sent location of our central Manhattan showroom.",
    lastMessageTimestamp: "2026-07-03T18:45:00Z",
    unreadCount: 0,
    isPinned: true,
    reminders: [
      {
        id: "rem-2",
        type: "CALL_TOMORROW",
        title: "Call Marcus to confirm office visit details",
        dueDate: "2026-07-05T10:00:00Z",
        triggered: false
      }
    ],
    aiInsight: {
      summary: "Urgent lead with high purchasing intent. The broker team wants instant mobile notifications. They are extremely active on WhatsApp.",
      sentiment: "POSITIVE",
      intent: "MEETING_CONFIRMATION",
      nextBestAction: "Confirm the on-site physical platform demo.",
      riskLevel: "LOW"
    },
    messages: [
      {
        id: "msg-2-1",
        type: "TEXT",
        senderType: "OUTGOING",
        senderName: "Agent John",
        body: "Hello Marcus, this is John from Synity. Excited to sync up! Here is our standard deck on broker workflow automations.",
        timestamp: "2026-07-03T12:00:00Z",
        status: "READ",
        channel: "WHATSAPP"
      },
      {
        id: "msg-2-2",
        type: "TEXT",
        senderType: "INCOMING",
        senderName: "Marcus Aurelius Vance",
        body: "Hey! We are hosting a brokers' meet here. Can your app automatically distribute leads based on active agents' custom daily targets?",
        timestamp: "2026-07-03T12:45:00Z",
        status: "READ",
        channel: "WHATSAPP"
      },
      {
        id: "msg-2-3",
        type: "TEXT",
        senderType: "OUTGOING",
        senderName: "Agent John",
        body: "Absolutely. Our Smart Daily Planner handles exactly that, mapping daily target distribution (e.g. 10 leads/day) while retaining strict owner allocations. Let's meet at your office to demo this.",
        timestamp: "2026-07-03T13:30:00Z",
        status: "READ",
        channel: "WHATSAPP"
      },
      {
        id: "msg-2-4",
        type: "SYSTEM",
        senderType: "SYSTEM",
        senderName: "Synity System",
        body: "Meeting Scheduled: Platform On-site Demo at Centurion Offices",
        timestamp: "2026-07-03T14:00:00Z",
        channel: "WHATSAPP",
        systemEventDetails: {
          eventType: "MEETING_SCHEDULED",
          meta: { time: "July 5, 2:00 PM", location: "Centurion Showroom" }
        }
      },
      {
        id: "msg-2-5",
        type: "LOCATION",
        senderType: "INCOMING",
        senderName: "Marcus Aurelius Vance",
        body: "725 5th Ave, New York, NY 10022",
        timestamp: "2026-07-03T18:45:00Z",
        status: "READ",
        channel: "WHATSAPP"
      }
    ]
  },
  {
    id: "conv-3",
    leadId: "lead-2",
    leadName: "Elena Rostova",
    businessName: "Aether Digital Agency",
    channel: "PHONE",
    lastMessageText: "Call ended. Duration: 12 mins 43 secs. Call recording and transcript saved.",
    lastMessageTimestamp: "2026-07-02T16:15:00Z",
    unreadCount: 0,
    isPinned: false,
    reminders: [
      {
        id: "rem-3",
        type: "FOLLOW_UP_FRIDAY",
        title: "Send custom agency pricing breakdown",
        dueDate: "2026-07-04T12:00:00Z",
        triggered: false
      }
    ],
    aiInsight: {
      summary: "Elena wants to consolidate her team's visual pipeline. Spoke about custom lead sources. She requested multi-seat discounts.",
      sentiment: "NEUTRAL",
      intent: "PRICING_INQUIRY",
      nextBestAction: "Deliver tiered multi-seat CRM subscription plan options.",
      riskLevel: "LOW"
    },
    messages: [
      {
        id: "msg-3-1",
        type: "SYSTEM",
        senderType: "SYSTEM",
        senderName: "Synity System",
        body: "Inbound Call Connected: Elena Rostova (Aether Digital Agency)",
        timestamp: "2026-07-02T16:02:00Z",
        channel: "PHONE",
        systemEventDetails: {
          eventType: "STATUS_CHANGED",
          meta: { status: "CALLED" }
        }
      },
      {
        id: "msg-3-2",
        type: "TEXT",
        senderType: "INCOMING",
        senderName: "Elena Rostova",
        body: "I need a CRM where my visual team of 15 designers can coordinate inbound leads from Dribbble, Behance, and our web portal without losing trail.",
        timestamp: "2026-07-02T16:10:00Z",
        status: "READ",
        channel: "PHONE"
      },
      {
        id: "msg-3-3",
        type: "TEXT",
        senderType: "SYSTEM",
        senderName: "Synity Phone Logger",
        body: "Call ended. Duration: 12 mins 43 secs. Call recording and transcript saved.",
        timestamp: "2026-07-02T16:15:00Z",
        channel: "PHONE"
      }
    ]
  }
];
