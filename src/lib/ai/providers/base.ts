/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LeadHealth,
  FollowUpSuggestion,
  AIDailySummaryResult,
  CoachingTip,
  LeadSummaryResult,
  MeetingPrepResult,
  PipelineInsight,
  WorkloadSuggestion,
  RiskFlag
} from "../types";
import { Lead, Task, ActivityLog } from "../../../types";

export interface AIProvider {
  id: string;
  name: string;

  // 1. Lead Health Analysis
  analyzeLeadHealth(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<LeadHealth>;

  // 2. AI Follow-up Suggestions
  generateFollowUp(lead: Lead, activities: ActivityLog[]): Promise<FollowUpSuggestion>;

  // 3. Lead Summary
  summarizeLead(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<LeadSummaryResult>;

  // 4. Meeting Prep
  prepareMeeting(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<MeetingPrepResult>;

  // 5. Daily AI Summary
  generateDailySummary(leads: Lead[], tasks: Task[], activities: ActivityLog[]): Promise<AIDailySummaryResult>;

  // 6. Sales Coaching
  generateCoachingTips(leads: Lead[], tasks: Task[], activities: ActivityLog[]): Promise<CoachingTip[]>;

  // 7. Pipeline Insights
  generatePipelineInsights(leads: Lead[]): Promise<PipelineInsight[]>;

  // 8. Risk Detection
  detectRisks(leads: Lead[], tasks: Task[]): Promise<RiskFlag[]>;

  // 9. Workload Balancing & Capacity check
  assessWorkload(plannerItemsCount: number, targetNewLeads: number): Promise<WorkloadSuggestion>;
}
