/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LeadStatus } from "./index";

export type DateFilterType =
  | "TODAY"
  | "YESTERDAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "LAST_90_DAYS"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "CUSTOM";

export interface DateRange {
  start: string; // ISO date string
  end: string;   // ISO date string
}

export interface KPIStats {
  totalLeads: number;
  activeLeads: number;
  dealsClosed: number;
  dealsLost: number;
  revenueClosed: number;
  revenuePipeline: number;
  avgDealValue: number;
  conversionRate: number;
}

export interface FunnelStageData {
  stage: LeadStatus;
  label: string;
  count: number;
  conversionRate: number; // Conversion from previous stage or total
  dropOffRate: number;     // Drop-off from previous stage
}

export interface PipelineRevenueData {
  pipeline: number;
  closed: number;
  lost: number;
  atRisk: number;
  expected: number;
}

export interface PerformanceStats {
  callsMade: number;
  meetingsHeld: number;
  followupsCompleted: number;
  tasksCompleted: number;
  proposalsSent: number;
  dealsClosed: number;
  dealsLost: number;
}

export interface TimeStats {
  avgResponseTimeMin: number;       // Minutes
  avgFollowupDelayHours: number;   // Hours
  avgSalesCycleDays: number;       // Days
  avgTimePerStageDays: Record<LeadStatus, number>;
}

export interface LeadSourceStats {
  source: string;
  totalLeads: number;
  conversionRate: number;
  revenue: number;
}

export interface IndustryStats {
  industry: string;
  leadCount: number;
  closedDeals: number;
  conversionRate: number;
  revenue: number;
}

export interface CountryStats {
  country: string;
  leads: number;
  revenue: number;
  conversionRate: number;
}

export interface LossReasonStats {
  reason: string;
  count: number;
  percentage: number;
  revenueLost: number;
}

export interface LossStats {
  reasons: LossReasonStats[];
  mostCommonReason: string;
  totalRevenueLost: number;
}

export interface FollowupStats {
  due: number;
  completed: number;
  missed: number;
  avgDelayHours: number;
  bestPerformingNumber: number; // e.g., 3rd follow-up is best
}

export interface ProductivityStats {
  callsPerDay: number;
  meetingsPerWeek: number;
  tasksCompleted: number;
  dailyStreak: number;
  longestStreak: number;
}

export interface RevenueForecast {
  expected: number;
  likely: number;
  optimistic: number;
  pessimistic: number;
}

export interface GoalProgress {
  monthlyRevenue: { target: number; current: number };
  monthlyCalls: { target: number; current: number };
  monthlyFollowups: { target: number; current: number };
  monthlyMeetings: { target: number; current: number };
}

export interface AIInsight {
  id: string;
  type: "success" | "warning" | "info" | "tip";
  title: string;
  description: string;
  impactValue?: string;
}

export interface ReportSchedule {
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  email: string;
  enabled: boolean;
  format: "PDF" | "EXCEL" | "CSV";
}
