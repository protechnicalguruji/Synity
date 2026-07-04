/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider } from "../providers/base";
import { GeminiProvider } from "../providers/gemini";
import { OpenAIProvider } from "../providers/openai";
import { ClaudeProvider } from "../providers/claude";
import {
  AISettings,
  AIProviderId,
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
import { AICache } from "../utils/cache";
import { Lead, Task, ActivityLog } from "../../../types";

export class AIService {
  private static instance: AIService | null = null;
  private providers: Record<AIProviderId, AIProvider>;
  private activeSettings: AISettings;

  private constructor() {
    this.providers = {
      gemini: new GeminiProvider(),
      openai: new OpenAIProvider(),
      claude: new ClaudeProvider()
    };

    // Load settings from localStorage or defaults
    const saved = localStorage.getItem("synity_ai_settings");
    if (saved) {
      try {
        this.activeSettings = JSON.parse(saved);
      } catch (e) {
        this.activeSettings = this.getDefaultSettings();
      }
    } else {
      this.activeSettings = this.getDefaultSettings();
    }
  }

  public static getInstance(): AIService {
    if (!this.instance) {
      this.instance = new AIService();
    }
    return this.instance;
  }

  private getDefaultSettings(): AISettings {
    return {
      provider: "gemini",
      model: "gemini-1.5-pro",
      temperature: 0.7,
      dailyScheduleEnabled: true,
      dailyScheduleTime: "08:00"
    };
  }

  public getSettings(): AISettings {
    return { ...this.activeSettings };
  }

  public updateSettings(newSettings: Partial<AISettings>): void {
    this.activeSettings = { ...this.activeSettings, ...newSettings };
    localStorage.setItem("synity_ai_settings", JSON.stringify(this.activeSettings));
    // Clear cache to enforce re-runs with new model/temperature if changed
    AICache.clearAll();
  }

  private getProvider(): AIProvider {
    const provId = this.activeSettings.provider;
    const provider = this.providers[provId];
    if (!provider) {
      // Fallback to gemini if provider is invalid
      return this.providers["gemini"];
    }
    return provider;
  }

  // Helper to execute actions safely with caching, logging, and error handling
  private async executeWithCache<T>(
    feature: string,
    entityId: string,
    stateHash: string,
    operation: (provider: AIProvider) => Promise<T>,
    ttlMs = 15 * 60 * 1000 // default 15 mins cache
  ): Promise<T> {
    const cacheKey = AICache.makeKey(feature, entityId, stateHash);
    
    // 1. Try to fetch from cache
    const cachedData = AICache.get<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // 2. Fetch active provider
    const provider = this.getProvider();

    try {
      // 3. Run operation with error catching
      const result = await operation(provider);

      // 4. Cache successful result
      AICache.set(cacheKey, result, ttlMs);

      // 5. Store history record
      AICache.addHistoryEntry({
        feature,
        promptName: feature.toUpperCase(),
        provider: provider.id as AIProviderId,
        metadata: { entityId, stateHash, success: true },
        response: result
      });

      return result;
    } catch (error: any) {
      // Gracefully handle errors & fallback to Gemini if other providers failed
      console.warn(`AI Service Error (${provider.name} - ${feature}): ${error.message}`);
      
      // If we are not on gemini, attempt to fallback to Gemini as backup
      if (provider.id !== "gemini") {
        try {
          console.info(`Falling back to Google Gemini Pro for ${feature}...`);
          const backupProvider = this.providers["gemini"];
          const result = await operation(backupProvider);
          AICache.set(cacheKey, result, ttlMs);
          AICache.addHistoryEntry({
            feature,
            promptName: `${feature.toUpperCase()}_FALLBACK_GEMINI`,
            provider: "gemini",
            metadata: { entityId, stateHash, fallback: true, originalProvider: provider.id },
            response: result
          });
          return result;
        } catch (fbError: any) {
          throw new Error(`AI Engine Timeout: Could not retrieve insights from central provider cluster. Error: ${fbError.message}`);
        }
      }

      // If we are already on Gemini and it failed, format a safe, readable error
      throw new Error(`AI Network Alert: ${error.message || "Unknown error contact routing."}`);
    }
  }

  // -----------------------------------------------------------------
  // CORE FEATURES PROXIES
  // -----------------------------------------------------------------

  /**
   * Evaluates the health metrics of a specific lead
   */
  public async getLeadHealth(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<LeadHealth> {
    const hash = `${lead.status}_${lead.priority}_${lead.updatedAt}_${activities.length}_${tasks.length}`;
    return this.executeWithCache(
      "lead_health",
      lead.id,
      hash,
      prov => prov.analyzeLeadHealth(lead, activities, tasks)
    );
  }

  /**
   * Generates highly conversion-focused recommended next touchpoint actions
   */
  public async getFollowUpSuggestion(lead: Lead, activities: ActivityLog[]): Promise<FollowUpSuggestion> {
    const hash = `${lead.status}_${lead.updatedAt}_${activities.length}`;
    return this.executeWithCache(
      "follow_up_suggestion",
      lead.id,
      hash,
      prov => prov.generateFollowUp(lead, activities)
    );
  }

  /**
   * Summarizes a lead's business intent, key pain points, and closing windows
   */
  public async getLeadSummary(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<LeadSummaryResult> {
    const hash = `${lead.status}_${lead.updatedAt}_${activities.length}_${tasks.length}_${lead.value}`;
    return this.executeWithCache(
      "lead_summary",
      lead.id,
      hash,
      prov => prov.summarizeLead(lead, activities, tasks)
    );
  }

  /**
   * Generates full contextual briefs and talking points for scheduled syncs
   */
  public async getMeetingPrep(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<MeetingPrepResult> {
    const hash = `${lead.status}_${lead.updatedAt}_${activities.length}_${tasks.length}`;
    return this.executeWithCache(
      "meeting_prep",
      lead.id,
      hash,
      prov => prov.prepareMeeting(lead, activities, tasks)
    );
  }

  /**
   * Synthesizes performance data into bento-styled high-level summaries
   */
  public async getDailySummary(leads: Lead[], tasks: Task[], activities: ActivityLog[]): Promise<AIDailySummaryResult> {
    // Generate an overall pipeline hash
    const hash = `${leads.length}_${tasks.length}_${activities.length}_${leads.filter(l => l.status === "CLOSED_WON").length}`;
    return this.executeWithCache(
      "daily_summary",
      "global_advisor",
      hash,
      prov => prov.generateDailySummary(leads, tasks, activities),
      20 * 60 * 1000 // 20 mins cache for summary
    );
  }

  /**
   * Compiles customized strategic insights to improve advisor conversion rates
   */
  public async getCoachingTips(leads: Lead[], tasks: Task[], activities: ActivityLog[]): Promise<CoachingTip[]> {
    const hash = `${leads.length}_${tasks.length}_${activities.length}`;
    return this.executeWithCache(
      "coaching_tips",
      "global_coach",
      hash,
      prov => prov.generateCoachingTips(leads, tasks, activities),
      30 * 60 * 1000 // 30 mins cache
    );
  }

  /**
   * Runs diagnostic analysis across pipeline stages to locate flow constraints
   */
  public async getPipelineInsights(leads: Lead[]): Promise<PipelineInsight[]> {
    const hash = `${leads.length}_${leads.map(l => l.status).join("-")}`;
    return this.executeWithCache(
      "pipeline_insights",
      "global_pipeline",
      hash,
      prov => prov.generatePipelineInsights(leads),
      30 * 60 * 1000
    );
  }

  /**
   * Flag cold accounts, missed touchpoints, and unassigned leads
   */
  public async getDetectedRisks(leads: Lead[], tasks: Task[]): Promise<RiskFlag[]> {
    const hash = `${leads.length}_${tasks.length}_${leads.map(l => l.status).join("-")}`;
    return this.executeWithCache(
      "detected_risks",
      "global_risks",
      hash,
      prov => prov.detectRisks(leads, tasks),
      5 * 60 * 1000 // 5 mins cache for dynamic risks
    );
  }

  /**
   * Balances workload suggestions according to current task volumes
   */
  public async getWorkloadSuggestions(plannerItemsCount: number, targetNewLeads: number): Promise<WorkloadSuggestion> {
    const hash = `${plannerItemsCount}_${targetNewLeads}`;
    return this.executeWithCache(
      "workload_suggestions",
      "global_workload",
      hash,
      prov => prov.assessWorkload(plannerItemsCount, targetNewLeads)
    );
  }
}
export const aiService = AIService.getInstance();
