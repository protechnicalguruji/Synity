/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProviderId } from "../lib/ai/types";

export interface GeneralSettings {
  workspaceName: string;
  workspaceLogo: string;
  companyName: string;
  businessEmail: string;
  businessPhone: string;
  website: string;
  timezone: string;
  language: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
}

export interface ProfileSettings {
  photo: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  bio: string;
}

export interface WorkspaceSettings {
  name: string;
  slug: string;
  id: string;
  createdAt: string;
  memberCount: number;
  status: "ACTIVE" | "MAINTENANCE" | "SUSPENDED";
}

export interface NotificationSettings {
  meetings: boolean;
  followUps: boolean;
  tasks: boolean;
  callbacks: boolean;
  achievements: boolean;
  aiNotifications: boolean;
  systemNotifications: boolean;
}

export interface SettingsAISettings {
  provider: AIProviderId;
  model: string;
  temperature: number;
  responseLength: "short" | "balanced" | "detailed";
  dailyBriefing: boolean;
  aiCoaching: boolean;
  leadSummary: boolean;
  meetingPreparation: boolean;
  followUpSuggestions: boolean;
  confidenceThreshold: number;
}

export interface SalesSettings {
  dailyCallTarget: number;
  dailyFollowUpTarget: number;
  dailyMeetingTarget: number;
  dailyProposalTarget: number;
  monthlyRevenueGoal: number;
  monthlyDealGoal: number;
  workloadLimit: number;
}

export interface BusinessHoursSettings {
  workingDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  lunchBreakStart: string;
  lunchBreakEnd: string;
}

export interface PipelineSettings {
  defaultPipeline: string;
  stageColors: Record<string, string>;
  stageOrdering: string[];
  defaultLeadStatus: string;
  defaultPriority: string;
}

export interface AutomationSettings {
  enabled: boolean;
  defaultRuleBehavior: "HALT" | "CONTINUE";
}

export interface CommunicationSettings {
  emailConnected: boolean;
  whatsappConnected: boolean;
  calendarConnected: boolean;
  twilioConnected: boolean;
  slackConnected: boolean;
  zoomConnected: boolean;
}

export interface ImportExportSettings {
  defaultImportMapping: Record<string, string>;
  duplicateStrategy: "MERGE" | "SKIP" | "OVERWRITE";
  defaultExportFormat: "CSV" | "JSON" | "XLSX";
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  compactMode: boolean;
  animations: boolean;
  reducedMotion: boolean;
}

export interface AdvancedSettings {
  featureFlags: Record<string, boolean>;
  experimentalFeatures: boolean;
  developerMode: boolean;
}

export interface GlobalSettingsState {
  general: GeneralSettings;
  profile: ProfileSettings;
  workspace: WorkspaceSettings;
  notifications: NotificationSettings;
  ai: SettingsAISettings;
  sales: SalesSettings;
  businessHours: BusinessHoursSettings;
  pipeline: PipelineSettings;
  automation: AutomationSettings;
  communication: CommunicationSettings;
  importExport: ImportExportSettings;
  appearance: AppearanceSettings;
  advanced: AdvancedSettings;
}

export type SettingsCategory =
  | "general"
  | "workspace"
  | "profile"
  | "notifications"
  | "ai"
  | "sales"
  | "hours"
  | "pipeline"
  | "automation"
  | "communication"
  | "import"
  | "appearance"
  | "security"
  | "integrations"
  | "billing"
  | "advanced"
  | "about";
