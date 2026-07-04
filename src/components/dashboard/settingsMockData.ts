/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GlobalSettingsState, SettingsCategory } from "../../types/settings";

export const SETTINGS_CATEGORIES: { id: SettingsCategory; label: string; desc: string; icon: string }[] = [
  { id: "general", label: "General", desc: "Workspace info, timezone, locale & formats", icon: "Settings" },
  { id: "profile", label: "Profile", desc: "Personal identity, job title & security", icon: "User" },
  { id: "workspace", label: "Workspace", desc: "Workspace URL slug, stats & status", icon: "Database" },
  { id: "notifications", label: "Notifications", desc: "Control alert frequencies & channels", icon: "Bell" },
  { id: "ai", label: "AI Settings", desc: "Model parameters, temperatures & schedules", icon: "Sparkles" },
  { id: "sales", label: "Sales Targets", desc: "Targets, goals & maximum workloads", icon: "Target" },
  { id: "hours", label: "Business Hours", desc: "Working calendar, time blocks & vacation", icon: "Clock" },
  { id: "pipeline", label: "Pipeline Rules", desc: "Stage color assignments, default weights", icon: "Kanban" },
  { id: "automation", label: "Automation", desc: "Global trigger toggles & behavior overrides", icon: "Zap" },
  { id: "communication", label: "Communication", desc: "Email integration & VoIP providers", icon: "MessageSquare" },
  { id: "import", label: "Import & Export", desc: "Lead mapping logic & duplicate actions", icon: "ArrowLeftRight" },
  { id: "appearance", label: "Appearance", desc: "Themes, spacing densities & motion dynamics", icon: "Palette" },
  { id: "security", label: "Security & Access", desc: "Two-factor auth, session logs & API keys", icon: "Shield" },
  { id: "integrations", label: "API & Integrations", desc: "Google Cloud, Gemini, Stripe, Zapier stubs", icon: "Cpu" },
  { id: "billing", label: "Billing & Plans", desc: "Enterprise plan overview & placeholder invoicing", icon: "CreditCard" },
  { id: "advanced", label: "Advanced Dev", desc: "Feature flags, experimental features & debug", icon: "Sliders" },
  { id: "about", label: "About Synity", desc: "Platform version, release notes & regulatory terms", icon: "Info" },
];

export const INITIAL_SETTINGS_STATE: GlobalSettingsState = {
  general: {
    workspaceName: "Synity Sales Engine",
    workspaceLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
    companyName: "Rivers Agency Ltd",
    businessEmail: "operations@synity.io",
    businessPhone: "+1 (555) 019-2834",
    website: "https://synity.io",
    timezone: "America/New_York",
    language: "en-US",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h"
  },
  profile: {
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    fullName: "Alex Rivers",
    email: "alex@synity.io",
    phone: "+1 (555) 012-9842",
    jobTitle: "Sales Lead & Workspace Owner",
    bio: "Revenue operations architect and sales lead at Rivers Agency. Calibrating CRM triggers to achieve flawless workflow routes."
  },
  workspace: {
    name: "Synity Sales Engine",
    slug: "synity-sales-engine",
    id: "ws_rivers_92384729384",
    createdAt: "2026-01-15T08:00:00.000Z",
    memberCount: 14,
    status: "ACTIVE"
  },
  notifications: {
    meetings: true,
    followUps: true,
    tasks: true,
    callbacks: true,
    achievements: true,
    aiNotifications: true,
    systemNotifications: false
  },
  ai: {
    provider: "gemini",
    model: "gemini-1.5-pro",
    temperature: 0.7,
    responseLength: "balanced",
    dailyBriefing: true,
    aiCoaching: true,
    leadSummary: true,
    meetingPreparation: true,
    followUpSuggestions: true,
    confidenceThreshold: 75
  },
  sales: {
    dailyCallTarget: 30,
    dailyFollowUpTarget: 20,
    dailyMeetingTarget: 5,
    dailyProposalTarget: 3,
    monthlyRevenueGoal: 150000,
    monthlyDealGoal: 12,
    workloadLimit: 85
  },
  businessHours: {
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHoursStart: "08:30",
    workingHoursEnd: "18:00",
    lunchBreakStart: "12:00",
    lunchBreakEnd: "13:00"
  },
  pipeline: {
    defaultPipeline: "Core Enterprise",
    stageColors: {
      "NEW": "#4E4E49",
      "INTERESTED": "#0A66C2",
      "PROPOSAL": "#8E44AD",
      "CLOSED_WON": "#137333",
      "CLOSED_LOST": "#D93025"
    },
    stageOrdering: ["NEW", "CALLED", "INTERESTED", "WHATSAPP_SENT", "FOLLOW_UP", "MEETING", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"],
    defaultLeadStatus: "NEW",
    defaultPriority: "MEDIUM"
  },
  automation: {
    enabled: true,
    defaultRuleBehavior: "CONTINUE"
  },
  communication: {
    emailConnected: true,
    whatsappConnected: false,
    calendarConnected: true,
    twilioConnected: true,
    slackConnected: false,
    zoomConnected: false
  },
  importExport: {
    defaultImportMapping: {
      "Contact Name": "name",
      "Business Name": "company",
      "E-mail Address": "email",
      "Phone Number": "phone",
      "Estimated Value": "value",
      "Lead Priority": "priority"
    },
    duplicateStrategy: "MERGE",
    defaultExportFormat: "CSV"
  },
  appearance: {
    theme: "light",
    compactMode: false,
    animations: true,
    reducedMotion: false
  },
  advanced: {
    featureFlags: {
      "ai-voice-summarizer": false,
      "realtime-collaboration": true,
      "beta-pipeline-view": true,
      "lead-predictive-insights": true
    },
    experimentalFeatures: true,
    developerMode: false
  }
};
