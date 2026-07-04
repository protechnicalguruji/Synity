/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider } from "./base";
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

export class ClaudeProvider implements AIProvider {
  public id = "claude";
  public name = "Anthropic Claude 3.5 Sonnet";

  public async analyzeLeadHealth(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<LeadHealth> {
    throw new Error("Claude Provider is currently deactivated. Switch active provider in AI settings.");
  }

  public async generateFollowUp(lead: Lead, activities: ActivityLog[]): Promise<FollowUpSuggestion> {
    throw new Error("Claude Provider is currently deactivated. Switch active provider in AI settings.");
  }

  public async summarizeLead(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<LeadSummaryResult> {
    throw new Error("Claude Provider is currently deactivated. Switch active provider in AI settings.");
  }

  public async prepareMeeting(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<MeetingPrepResult> {
    throw new Error("Claude Provider is currently deactivated. Switch active provider in AI settings.");
  }

  public async generateDailySummary(leads: Lead[], tasks: Task[], activities: ActivityLog[]): Promise<AIDailySummaryResult> {
    throw new Error("Claude Provider is currently deactivated. Switch active provider in AI settings.");
  }

  public async generateCoachingTips(leads: Lead[], tasks: Task[], activities: ActivityLog[]): Promise<CoachingTip[]> {
    throw new Error("Claude Provider is currently deactivated. Switch active provider in AI settings.");
  }

  public async generatePipelineInsights(leads: Lead[]): Promise<PipelineInsight[]> {
    throw new Error("Claude Provider is currently deactivated. Switch active provider in AI settings.");
  }

  public async detectRisks(leads: Lead[], tasks: Task[]): Promise<RiskFlag[]> {
    throw new Error("Claude Provider is currently deactivated. Switch active provider in AI settings.");
  }

  public async assessWorkload(plannerItemsCount: number, targetNewLeads: number): Promise<WorkloadSuggestion> {
    throw new Error("Claude Provider is currently deactivated. Switch active provider in AI settings.");
  }
}
