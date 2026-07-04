/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AIProviderId = "gemini" | "openai" | "claude";

export interface AISettings {
  provider: AIProviderId;
  model: string;
  temperature: number;
  dailyScheduleEnabled: boolean;
  dailyScheduleTime: string; // "HH:MM"
}

export type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

export interface ConfidenceScore {
  level: ConfidenceLevel;
  percentage: number; // 0 to 100
}

// 1. Lead Health Type
export type LeadHealthStatus = "HEALTHY" | "WARM" | "COLD" | "CRITICAL";

export interface LeadHealth {
  score: number; // 0 to 100
  status: LeadHealthStatus;
  reasons: string[];
  lastContactDeltaDays: number;
  confidence: ConfidenceScore;
}

// 2. AI Follow-up Suggestions
export interface FollowUpSuggestion {
  recommendedAction: string;
  recommendedTime: string; // ISO string or human readable
  reason: string;
  tone: string; // "Urgent & Professional" | "Casual Catch-up" | etc.
  messageTemplate: string;
  confidence: ConfidenceScore;
}

// 3. Risk Flag Type
export type RiskType = "COLD_LEAD" | "MISSED_FOLLOW_UP" | "NO_CONTACT" | "OVERDUE_MEETING" | "STUCK_STAGE";

export interface RiskFlag {
  id: string;
  type: RiskType;
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  detectedAt: string;
}

// 4. Daily AI Summary
export interface AIDailySummaryResult {
  wins: string[];
  risks: string[];
  priorities: string[];
  tomorrowSuggestions: string[];
  summaryParagraph: string;
  generatedAt: string;
}

// 5. Sales Coaching Card
export interface CoachingTip {
  id: string;
  title: string;
  message: string;
  category: "EFFICIENCY" | "STRATEGY" | "METRICS" | "ANALYTICS";
  metricImpact?: string; // e.g. "+15% close rate"
  actionLabel?: string;
}

// 6. Lead Summary
export interface LeadSummaryResult {
  leadId: string;
  oneLiner: string;
  keyInsights: string[];
  bestTimeToCall: string; // e.g. "3:00 PM"
  currentStatusBrief: string;
  estimatedCloseDate?: string;
  confidence: ConfidenceScore;
}

// 7. Meeting Preparation
export interface MeetingPrepResult {
  leadId: string;
  clientSummary: string;
  previousNotesSummary: string;
  lastActivitySummary: string;
  talkingPoints: string[];
  objectionHandling: { objection: string; response: string }[];
  confidence: ConfidenceScore;
}

// 8. Pipeline Insights
export interface PipelineInsight {
  id: string;
  title: string;
  description: string;
  metricBrief?: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  suggestedAction: string;
}

// 9. Workload Suggestions
export interface WorkloadSuggestion {
  capacityScore: number; // 0 to 100 (percentage of maximum optimal workload)
  status: "UNDERUTILIZED" | "BALANCED" | "OVERLOADED";
  insights: string[];
  recommendedCaps: {
    maxDailyFollowUps: number;
    targetNewLeads: number;
  };
}

// 10. AI History Record
export interface AIHistoryItem {
  id: string;
  timestamp: string;
  feature: string;
  promptName: string;
  provider: AIProviderId;
  metadata: Record<string, any>;
  response: any;
}
