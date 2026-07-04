/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { aiService } from "../services/ai";
import { AICache } from "../utils/cache";
import {
  LeadHealth,
  FollowUpSuggestion,
  LeadSummaryResult,
  MeetingPrepResult,
  AIDailySummaryResult,
  CoachingTip,
  PipelineInsight,
  RiskFlag,
  WorkloadSuggestion,
  AISettings
} from "../types";
import { Lead, Task, ActivityLog } from "../../../types";

/**
 * Custom hook to manage single lead AI insights (Health, Summary, Follow-up, Meeting Prep)
 */
export function useLeadAI(lead: Lead | null, activities: ActivityLog[], tasks: Task[]) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [health, setHealth] = useState<LeadHealth | null>(null);
  const [followUp, setFollowUp] = useState<FollowUpSuggestion | null>(null);
  const [summary, setSummary] = useState<LeadSummaryResult | null>(null);
  const [meetingPrep, setMeetingPrep] = useState<MeetingPrepResult | null>(null);

  const fetchLeadInsights = useCallback(async (forceReload = false) => {
    if (!lead) return;
    setLoading(true);
    setError(null);

    if (forceReload) {
      // Invalidate existing caches for this lead
      const hashHealth = `${lead.status}_${lead.priority}_${lead.updatedAt}_${activities.length}_${tasks.length}`;
      const hashFollow = `${lead.status}_${lead.updatedAt}_${activities.length}`;
      const hashSumm = `${lead.status}_${lead.updatedAt}_${activities.length}_${tasks.length}_${lead.value}`;
      const hashMeet = `${lead.status}_${lead.updatedAt}_${activities.length}_${tasks.length}`;

      AICache.invalidate(AICache.makeKey("lead_health", lead.id, hashHealth));
      AICache.invalidate(AICache.makeKey("follow_up_suggestion", lead.id, hashFollow));
      AICache.invalidate(AICache.makeKey("lead_summary", lead.id, hashSumm));
      AICache.invalidate(AICache.makeKey("meeting_prep", lead.id, hashMeet));
    }

    try {
      // Parallelize AI requests for performance
      const [healthData, followData, summaryData, prepData] = await Promise.all([
        aiService.getLeadHealth(lead, activities, tasks),
        aiService.getFollowUpSuggestion(lead, activities),
        aiService.getLeadSummary(lead, activities, tasks),
        aiService.getMeetingPrep(lead, activities, tasks)
      ]);

      setHealth(healthData);
      setFollowUp(followData);
      setSummary(summaryData);
      setMeetingPrep(prepData);
    } catch (e: any) {
      setError(e.message || "Failed to retrieve lead insights.");
    } finally {
      setLoading(false);
    }
  }, [lead, activities, tasks]);

  useEffect(() => {
    fetchLeadInsights();
  }, [fetchLeadInsights]);

  return {
    loading,
    error,
    health,
    followUp,
    summary,
    meetingPrep,
    refetch: () => fetchLeadInsights(true)
  };
}

/**
 * Custom hook to manage global portfolio-wide AI insights (Summary, Coaching, Pipeline, Risks, Workload)
 */
export function useGlobalAI(leads: Lead[], tasks: Task[], activities: ActivityLog[]) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dailySummary, setDailySummary] = useState<AIDailySummaryResult | null>(null);
  const [coachingTips, setCoachingTips] = useState<CoachingTip[]>([]);
  const [pipelineInsights, setPipelineInsights] = useState<PipelineInsight[]>([]);
  const [detectedRisks, setDetectedRisks] = useState<RiskFlag[]>([]);
  const [workload, setWorkload] = useState<WorkloadSuggestion | null>(null);

  const fetchGlobalInsights = useCallback(async (forceReload = false, plannerItemsCount = 0, targetNewLeads = 5) => {
    if (leads.length === 0) return;
    setLoading(true);
    setError(null);

    if (forceReload) {
      const hashSumm = `${leads.length}_${tasks.length}_${activities.length}_${leads.filter(l => l.status === "CLOSED_WON").length}`;
      const hashCoach = `${leads.length}_${tasks.length}_${activities.length}`;
      const hashPipe = `${leads.length}_${leads.map(l => l.status).join("-")}`;
      const hashRisk = `${leads.length}_${tasks.length}_${leads.map(l => l.status).join("-")}`;
      const hashWork = `${plannerItemsCount}_${targetNewLeads}`;

      AICache.invalidate(AICache.makeKey("daily_summary", "global_advisor", hashSumm));
      AICache.invalidate(AICache.makeKey("coaching_tips", "global_coach", hashCoach));
      AICache.invalidate(AICache.makeKey("pipeline_insights", "global_pipeline", hashPipe));
      AICache.invalidate(AICache.makeKey("detected_risks", "global_risks", hashRisk));
      AICache.invalidate(AICache.makeKey("workload_suggestions", "global_workload", hashWork));
    }

    try {
      const [summ, coach, pipe, risk, work] = await Promise.all([
        aiService.getDailySummary(leads, tasks, activities),
        aiService.getCoachingTips(leads, tasks, activities),
        aiService.getPipelineInsights(leads),
        aiService.getDetectedRisks(leads, tasks),
        aiService.getWorkloadSuggestions(plannerItemsCount, targetNewLeads)
      ]);

      setDailySummary(summ);
      setCoachingTips(coach);
      setPipelineInsights(pipe);
      setDetectedRisks(risk);
      setWorkload(work);
    } catch (e: any) {
      setError(e.message || "Failed to load global workspace intelligence.");
    } finally {
      setLoading(false);
    }
  }, [leads, tasks, activities]);

  useEffect(() => {
    fetchGlobalInsights();
  }, [fetchGlobalInsights]);

  return {
    loading,
    error,
    dailySummary,
    coachingTips,
    pipelineInsights,
    detectedRisks,
    workload,
    refetch: (plannerItemsCount = 0, targetNewLeads = 5) => fetchGlobalInsights(true, plannerItemsCount, targetNewLeads)
  };
}

/**
 * Hook to read/update AI settings and configure providers
 */
export function useAISettings() {
  const [settings, setSettings] = useState<AISettings>(() => aiService.getSettings());

  const updateSettings = useCallback((newSettings: Partial<AISettings>) => {
    aiService.updateSettings(newSettings);
    setSettings(aiService.getSettings());
  }, []);

  return {
    settings,
    updateSettings
  };
}
