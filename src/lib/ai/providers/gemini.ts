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
import { Lead, Task, ActivityLog, LeadStatus, TaskStatus } from "../../../types";

export class GeminiProvider implements AIProvider {
  public id = "gemini";
  public name = "Google Gemini Pro";

  // Helper to determine delay to simulate network latency
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper to determine confidence level
  private computeConfidence(base: number): { level: "LOW" | "MEDIUM" | "HIGH"; percentage: number } {
    const val = Math.min(100, Math.max(0, Math.round(base)));
    let level: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM";
    if (val >= 80) level = "HIGH";
    else if (val <= 45) level = "LOW";
    return { level, percentage: val };
  }

  // 1. Lead Health Analysis
  public async analyzeLeadHealth(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<LeadHealth> {
    await this.delay(500);

    const leadActivities = activities.filter(a => a.leadId === lead.id);
    const leadTasks = tasks.filter(t => t.leadId === lead.id);

    // Calculate days since last contact
    let lastContactDays = 15; // default if never contacted
    if (lead.lastContactedAt) {
      const diffMs = Date.now() - new Date(lead.lastContactedAt).getTime();
      lastContactDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    } else if (leadActivities.length > 0) {
      const times = leadActivities.map(a => new Date(a.timestamp).getTime());
      const maxTime = Math.max(...times);
      const diffMs = Date.now() - maxTime;
      lastContactDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    }

    // Determine components
    const hasUpcomingMeeting = lead.status === LeadStatus.MEETING || leadTasks.some(t => t.title.toLowerCase().includes("meeting") && t.status !== TaskStatus.DONE);
    const proposalActive = lead.status === LeadStatus.PROPOSAL || lead.status === LeadStatus.NEGOTIATION;
    const hasUncompletedOverdueTasks = leadTasks.some(t => t.status !== TaskStatus.DONE && new Date(t.dueDate).getTime() < Date.now());

    // Compute Health Score (0-100)
    let score = 70; // baseline

    // Contact frequency component
    if (lastContactDays <= 2) score += 15;
    else if (lastContactDays <= 5) score += 5;
    else if (lastContactDays >= 14) score -= 25;
    else if (lastContactDays >= 7) score -= 15;

    // Stage modifiers
    if (lead.status === LeadStatus.CLOSED_WON) score = 100;
    else if (lead.status === LeadStatus.CLOSED_LOST) score = 0;
    else {
      if (hasUpcomingMeeting) score += 10;
      if (proposalActive) score += 15;
      if (hasUncompletedOverdueTasks) score -= 15;
      if (lead.status === LeadStatus.NO_ANSWER) score -= 10;
    }

    // Cap score
    score = Math.min(100, Math.max(0, score));

    // Determine status
    let status: "HEALTHY" | "WARM" | "COLD" | "CRITICAL" = "WARM";
    if (score >= 80) status = "HEALTHY";
    else if (score <= 30) status = "CRITICAL";
    else if (score <= 55) status = "COLD";

    // Generate specific justifications
    const reasons: string[] = [];
    if (lead.status === LeadStatus.CLOSED_WON) {
      reasons.push("Deal successfully closed won. Fully calibrated customer onboarding active.");
    } else if (lead.status === LeadStatus.CLOSED_LOST) {
      reasons.push("Opportunity closed as lost. Archive active.");
    } else {
      if (lastContactDays <= 2) {
        reasons.push(`Highly responsive contact profile. Last touched ${lastContactDays === 0 ? "today" : `${lastContactDays} days ago`}.`);
      } else if (lastContactDays >= 10) {
        reasons.push(`Stagnating communication gap detected. Over ${lastContactDays} days since last logging.`);
      }

      if (hasUpcomingMeeting) {
        reasons.push("High intent. Scheduled meeting event is active in calendar.");
      }
      if (proposalActive) {
        reasons.push("High progression. Active proposal is currently under client evaluation.");
      }
      if (hasUncompletedOverdueTasks) {
        reasons.push("Warning: There are active tasks overdue for this client account.");
      }
      if (lead.status === LeadStatus.NO_ANSWER) {
        reasons.push("Multiple outbound attempts went unanswered recently.");
      }
      if (reasons.length === 0) {
        reasons.push("Standard sales pipeline tracking. Healthy velocity, awaiting next check-in.");
      }
    }

    return {
      score,
      status,
      reasons,
      lastContactDeltaDays: lastContactDays,
      confidence: this.computeConfidence(score > 50 ? score : 100 - score)
    };
  }

  // 2. AI Follow-up Suggestions
  public async generateFollowUp(lead: Lead, activities: ActivityLog[]): Promise<FollowUpSuggestion> {
    await this.delay(400);

    let recommendedAction = "Outbound Re-engagement";
    let recommendedTime = "Tomorrow at 10:00 AM";
    let reason = "Establish contact and qualify deal parameters.";
    let tone = "Professional & High Value";
    let messageTemplate = `Hi ${lead.name},\n\nI hope you're having a productive week. I'm following up on our discussion regarding Synity's custom solutions for ${lead.company}. Do you have 10 minutes for a brief call tomorrow to align on specifications?\n\nBest regards,\nAlex Rivers`;

    // Tailor suggestion based on lead status
    switch (lead.status) {
      case LeadStatus.NEW:
        recommendedAction = "Initial Outbound Call & Welcome Email";
        recommendedTime = "Today within 1 hour";
        reason = "Speed to lead is critical. Fresh prospects are 7x more likely to convert if reached within 1 hour.";
        tone = "Helpful & Warm";
        messageTemplate = `Hi ${lead.name},\n\nThank you for reaching out to Synity! I saw you are interested in optimizing your team's sales pipeline. I'd love to schedule a quick 10-minute introduction call to map out your requirements.\n\nAre you free this afternoon?\n\nBest,`;
        break;
      case LeadStatus.INTERESTED:
        recommendedAction = "Value-Add Demo Deck Delivery";
        recommendedTime = "Tomorrow at 2:00 PM";
        reason = "Lead expressed interest but hasn't committed to a deep-dive. Send customized material first.";
        tone = "Educational & Authoritative";
        messageTemplate = `Hi ${lead.name},\n\nGreat connecting with you. I put together a quick 3-page customized overview of how Synity can streamline ${lead.company}'s dental operations, addressing the staff scheduling bottleneck we touched on.\n\nLet me know if this aligns with your current focus!`;
        break;
      case LeadStatus.CALLED:
      case LeadStatus.NO_ANSWER:
        recommendedAction = "Low-Friction Multi-Channel Ping (WhatsApp & Email)";
        recommendedTime = "In 2 days at 11:30 AM";
        reason = "Direct dials went unanswered. Drop a brief text touchpoint first to lower responsiveness hurdles.";
        tone = "Casual & Friendly";
        messageTemplate = `Hi ${lead.name}, sorry I missed you earlier! I dropped a quick voicemail. Just wanted to see if you're still looking into solving staff scheduling issues at ${lead.company} this month. No rush, let me know if we can text here.`;
        break;
      case LeadStatus.FOLLOW_UP:
        recommendedAction = "Direct Phone Call - Secondary Follow up";
        recommendedTime = "Tomorrow at 3:00 PM";
        reason = "Scheduled follow-up window is active. Pick up the phone directly before competitors occupy their schedule.";
        tone = "Direct & Executive";
        messageTemplate = `Hi ${lead.name},\n\nFollowing up on our calendar marker. Let's do a fast sync to address the lingering contract questions you had. I have my line open at 3 PM.\n\nSpeak soon,`;
        break;
      case LeadStatus.PROPOSAL:
        recommendedAction = "Contract Margin Review Call";
        recommendedTime = "In 3 days at 10:30 AM";
        reason = "Proposal is currently undergoing review. Schedule a collaborative review to resolve SLA friction points.";
        tone = "Collaborative & Closing";
        messageTemplate = `Hi ${lead.name},\n\nI hope you've had a chance to review the proposal draft we sent over. I'd love to jump on a quick screen-share to tailor the licensing terms or security SLA directly to fit ${lead.company}'s procurement guidelines.\n\nHow is Thursday looking?`;
        break;
      case LeadStatus.NEGOTIATION:
        recommendedAction = "Send Final Adjusted Contract";
        recommendedTime = "Tomorrow at 9:00 AM";
        reason = "Negotiation stages require immediate execution once terms are aligned. Solidify parameters.";
        tone = "Confident & Closing";
        messageTemplate = `Hi ${lead.name},\n\nFollowing up on our negotiation call. I've adjusted Section 4 to reflect the 12% multi-site discount we agreed upon. The e-sign link is fully updated below.\n\nLet's get this finalized so your team can start onboarding next week!`;
        break;
      case LeadStatus.CLOSED_WON:
        recommendedAction = "Customer Success Handshake Intro";
        recommendedTime = "In 2 days at 1:00 PM";
        reason = "Transition from sales to onboarding. Deliver exceptional early post-sale care.";
        tone = "Warm & Enthusiastic";
        messageTemplate = `Hi ${lead.name},\n\nWelcome to Synity! We are thrilled to partner with ${lead.company}. I'm copying our Customer Success Director, Sarah, who will set up your portal and lead the staff training session.\n\nLet's coordinate a kickoff!`;
        break;
    }

    return {
      recommendedAction,
      recommendedTime,
      reason,
      tone,
      messageTemplate,
      confidence: this.computeConfidence(85)
    };
  }

  // 3. Lead Summary
  public async summarizeLead(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<LeadSummaryResult> {
    await this.delay(350);

    // Dynamic summarizer parsing lead fields
    const totalValue = lead.value;
    const notesStr = lead.notes || "";
    
    let bestTime = "3:00 PM";
    if (lead.company.toLowerCase().includes("dental")) bestTime = "1:30 PM (Between appointments)";
    else if (lead.company.toLowerCase().includes("tech") || lead.company.toLowerCase().includes("soft")) bestTime = "10:00 AM (Morning focus)";
    
    let closingBrief = "Steady progression. Re-establishing communication.";
    if (lead.status === LeadStatus.CLOSED_WON) closingBrief = "Deal closed successfully! In onboarding stage.";
    else if (lead.status === LeadStatus.NEW) closingBrief = "Fresh outbound lead. Highly responsive, qualification pending.";
    else if (lead.status === LeadStatus.PROPOSAL) closingBrief = "High intent. Currently reviewing customized solution pricing.";

    const insights = [
      `Exhibits clear budget authority with a targeted deal value of ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalValue)}.`,
      notesStr.toLowerCase().includes("schedule") || notesStr.toLowerCase().includes("staff")
        ? "Identified core pain point around staff scheduling efficiency and overtime overhead."
        : "Seeking streamlined CRM workflows to automate manual customer contact tracking.",
      `Current touchpoint count: ${activities.filter(a => a.leadId === lead.id).length} recorded interactions in database.`
    ];

    return {
      leadId: lead.id,
      oneLiner: `Enterprise prospect in ${lead.industry || "General Consulting"} seeking to streamline operational pipelines.`,
      keyInsights: insights,
      bestTimeToCall: bestTime,
      currentStatusBrief: closingBrief,
      estimatedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days out
      confidence: this.computeConfidence(lead.confidenceScore)
    };
  }

  // 4. Meeting Prep
  public async prepareMeeting(lead: Lead, activities: ActivityLog[], tasks: Task[]): Promise<MeetingPrepResult> {
    await this.delay(500);

    const leadActivities = activities.filter(a => a.leadId === lead.id);
    const lastAct = leadActivities[0]?.description || "Initial system outreach logged.";

    return {
      leadId: lead.id,
      clientSummary: `${lead.name} is the primary stakeholder at ${lead.company}. They operate in the ${lead.industry || "Professional Services"} sector and are evaluating Synity for pipeline consolidation.`,
      previousNotesSummary: lead.notes || "No previous historical notes logged. Focus call on direct discovery of pain points.",
      lastActivitySummary: `Last tracked touchpoint: ${lastAct}`,
      talkingPoints: [
        `Confirm ${lead.company}'s core operational bottlenecks in the current fiscal quarter.`,
        "Demonstrate Synity's custom automation rules and unified visual pipelines.",
        `Frame pricing value relative to their estimated deal size of ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(lead.value)}.`,
        "Propose a 14-day sandboxed proof of concept (POC) with their core admin team."
      ],
      objectionHandling: [
        {
          objection: "Pricing appears higher than basic spreadsheet tracking or legacy CRM alternatives.",
          response: "Focus on ROI. Automating follow-ups and reducing missed callback windows recovers 1.5 hours per advisor daily, paying back licensing within 45 days."
        },
        {
          objection: "Our team is hesitant to onboard and learn another software system.",
          response: "Highlight Synity's minimalist single-screen Daily Planner. Setup takes under 5 minutes and integrates natively with standard communications."
        }
      ],
      confidence: this.computeConfidence(80)
    };
  }

  // 5. Daily AI Summary
  public async generateDailySummary(leads: Lead[], tasks: Task[], activities: ActivityLog[]): Promise<AIDailySummaryResult> {
    await this.delay(600);

    const closedWonLeads = leads.filter(l => l.status === LeadStatus.CLOSED_WON);
    const totalWonValue = closedWonLeads.reduce((sum, l) => sum + l.value, 0);

    const overdueTasks = tasks.filter(t => t.status !== TaskStatus.DONE && new Date(t.dueDate).getTime() < Date.now());
    const highPriorityLeads = leads.filter(l => l.priority === "URGENT" || l.priority === "HIGH");

    const wins = [
      closedWonLeads.length > 0 
        ? `Closed ${closedWonLeads.length} enterprise contracts, securing ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalWonValue)} in new pipeline bookings!`
        : "Maintained active engagement across top tier accounts. Perfect record of logging CRM follow-up comments.",
      "Pipeline activity represents a 14% increase in outbound connection frequency compared to last week."
    ];

    const risks = [
      overdueTasks.length > 0
        ? `You have ${overdueTasks.length} uncompleted tasks that are currently past their due dates.`
        : "No overdue calendar tasks. Keep up the high responsiveness!",
      leads.filter(l => l.status === LeadStatus.NO_ANSWER).length > 2
        ? "Accumulated several unanswered calling logs. Risk of prospect stagnation if not shifted to messaging channels."
        : "Minimal lead stagnation detected."
    ];

    const priorities = [
      highPriorityLeads.length > 0
        ? `Re-engage high-priority contacts: ${highPriorityLeads.slice(0, 2).map(l => l.company).join(", ")}.`
        : "Conduct qualification calls on newly routed marketing leads.",
      "Settle pending pricing structures for deals sitting in the Proposal stage."
    ];

    const tomorrowSuggestions = [
      "Dedicate the first 45 minutes of the morning to reviving cold calling channels.",
      "Batch send custom SLA agreement files to prospects undergoing contract review.",
      "Reduce scheduled follow-up frequency on low-value leads to preserve capacity."
    ];

    return {
      wins,
      risks,
      priorities,
      tomorrowSuggestions,
      summaryParagraph: `Alex, you are running an efficient sales program today. With active deals progressing across your pipeline, focusing on outstanding contract approvals while cleaning up the ${overdueTasks.length} overdue tasks will ensure zero deal slippage. Maintain high engagement with top dental and consulting prospects.`,
      generatedAt: new Date().toISOString()
    };
  }

  // 6. Sales Coaching
  public async generateCoachingTips(leads: Lead[], tasks: Task[], activities: ActivityLog[]): Promise<CoachingTip[]> {
    await this.delay(500);

    const skippedCalls = 5; // Simulating skipped tasks
    const closedWonCount = leads.filter(l => l.status === LeadStatus.CLOSED_WON).length;

    return [
      {
        id: "coach-1",
        title: "Overdue Follow-up Slippage Warning",
        message: `You skipped or rescheduled ${skippedCalls} follow-ups yesterday. Maintaining a tight 24-hour response window on warm leads increases downstream conversions by 34%.`,
        category: "EFFICIENCY",
        metricImpact: "+34% Velocity",
        actionLabel: "Clear Backlog"
      },
      {
        id: "coach-2",
        title: "Surgical Dental Niche Focus",
        message: "Dentist and dental group prospects are converting at a 22% higher rate this month. Focus outbound prospecting on medical and healthcare practices in the western region.",
        category: "STRATEGY",
        metricImpact: "2.4x Close Rate",
        actionLabel: "Target Medical"
      },
      {
        id: "coach-3",
        title: "Multi-touch Retention Signature",
        message: `Most of your closed-won contracts (${closedWonCount || 3} deals) transitioned status exactly after the second follow-up touchpoint. Do not abandon prospects after a single call attempt.`,
        category: "METRICS",
        metricImpact: "+18% Close Won",
        actionLabel: "Review Cadences"
      }
    ];
  }

  // 7. Pipeline Insights
  public async generatePipelineInsights(leads: Lead[]): Promise<PipelineInsight[]> {
    await this.delay(450);

    const totalLeads = leads.length;
    const stageCounts = leads.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const followUpCount = stageCounts[LeadStatus.FOLLOW_UP] || 0;
    const noAnswerCount = stageCounts[LeadStatus.NO_ANSWER] || 0;
    const proposalCount = stageCounts[LeadStatus.PROPOSAL] || 0;

    const insights: PipelineInsight[] = [];

    if (followUpCount > totalLeads * 0.35) {
      insights.push({
        id: "pipe-1",
        title: "Prospect Congestion in Follow-Up",
        description: `Approximately ${Math.round((followUpCount / totalLeads) * 100)}% of your active leads are currently pooled in the Follow-up stage. Deals are backing up and require direct closure action.`,
        metricBrief: `${followUpCount} Leads Stuck`,
        severity: "WARNING",
        suggestedAction: "Run direct closing campaigns or deliver SLA drafts immediately."
      });
    }

    if (noAnswerCount > 2) {
      insights.push({
        id: "pipe-2",
        title: "High Volume of 'No Answer' Logs",
        description: `You have ${noAnswerCount} contacts sitting in unanswered call tracks. Continuous cold calling is yielding low returns.`,
        metricBrief: `${noAnswerCount} Silent Accounts`,
        severity: "CRITICAL",
        suggestedAction: "Pivot to structured WhatsApp/SMS follow-up pings to break the silence."
      });
    }

    if (proposalCount >= 2) {
      insights.push({
        id: "pipe-3",
        title: "Proposal Stage Volume is Expanding",
        description: `Your Proposal Sent stage is growing with ${proposalCount} pending contracts under review. This represents healthy mid-funnel expansion.`,
        metricBrief: `${proposalCount} Proposals Out`,
        severity: "INFO",
        suggestedAction: "Set calendar alarms to host contract review and margin alignment syncs."
      });
    }

    // Default catch-all if pipeline is sparse
    if (insights.length === 0) {
      insights.push({
        id: "pipe-default",
        title: "Funnel Velocity is Balanced",
        description: "Your leads are distributed evenly across standard pipeline stages. Maintain consistent outbound qualification dials.",
        metricBrief: "Healthy Distribution",
        severity: "INFO",
        suggestedAction: "Continue standard CRM operations."
      });
    }

    return insights;
  }

  // 8. Risk Detection
  public async detectRisks(leads: Lead[], tasks: Task[]): Promise<RiskFlag[]> {
    await this.delay(400);

    const risks: RiskFlag[] = [];
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    leads.forEach(l => {
      // Risk 1: Overdue follow ups
      if (l.nextFollowUp && new Date(l.nextFollowUp).getTime() < now && l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST) {
        risks.push({
          id: `risk-overdue-${l.id}`,
          type: "MISSED_FOLLOW_UP",
          title: "Missed Scheduled Follow-Up",
          description: `Scheduled contact milestone for ${l.company} (${l.name}) was missed and is currently overdue.`,
          severity: l.priority === "URGENT" || l.priority === "HIGH" ? "CRITICAL" : "HIGH",
          detectedAt: new Date().toISOString()
        });
      }

      // Risk 2: Cold Leads
      if (l.lastContactedAt) {
        const deltaDays = Math.floor((now - new Date(l.lastContactedAt).getTime()) / oneDay);
        if (deltaDays >= 14 && l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST) {
          risks.push({
            id: `risk-cold-${l.id}`,
            type: "COLD_LEAD",
            title: "Stagnated Cold Pipeline",
            description: `No advisor touchpoint logged for ${l.company} in over ${deltaDays} days. High risk of lead churn.`,
            severity: "HIGH",
            detectedAt: new Date().toISOString()
          });
        }
      }

      // Risk 3: No Contact
      if (!l.lastContactedAt && l.status === LeadStatus.NEW) {
        const createdDelta = Math.floor((now - new Date(l.createdAt).getTime()) / oneDay);
        if (createdDelta >= 3) {
          risks.push({
            id: `risk-nocontact-${l.id}`,
            type: "NO_CONTACT",
            title: "Prospect Sitting in Queue",
            description: `Fresh inbound lead ${l.company} has been left untouched in the funnel for ${createdDelta} days.`,
            severity: "MEDIUM",
            detectedAt: new Date().toISOString()
          });
        }
      }
    });

    return risks;
  }

  // 9. Workload Balancing
  public async assessWorkload(plannerItemsCount: number, targetNewLeads: number): Promise<WorkloadSuggestion> {
    await this.delay(300);

    const totalActiveActions = plannerItemsCount;
    let capacityScore = Math.min(100, Math.round((totalActiveActions / 10) * 100));
    
    let status: "UNDERUTILIZED" | "BALANCED" | "OVERLOADED" = "BALANCED";
    if (capacityScore >= 85) status = "OVERLOADED";
    else if (capacityScore <= 40) status = "UNDERUTILIZED";

    const insights: string[] = [];
    let maxDailyFollowUps = 12;
    let targetNewLeadsAdjusted = targetNewLeads;

    if (status === "OVERLOADED") {
      insights.push("Advisor is currently carrying critical workload densities. Focus strictly on existing contract approvals and high-priority callbacks.");
      insights.push("Workload balancer recommends restricting new prospect routing today to maintain responsive SLA levels on active deals.");
      maxDailyFollowUps = 15;
      targetNewLeadsAdjusted = Math.max(1, Math.min(2, targetNewLeads - 3));
    } else if (status === "UNDERUTILIZED") {
      insights.push("Advisor has excess pipeline capacity today. Focus on heavy outbound qualification dials and reviving older cold lead segments.");
      insights.push("We have automatically allocated additional fresh market prospects to your Daily Planner backlog.");
      maxDailyFollowUps = 8;
      targetNewLeadsAdjusted = targetNewLeads + 4;
    } else {
      insights.push("Current task densities are optimally aligned. Balanced mix of proactive dials, scheduled client syncs, and administrative proposals.");
      maxDailyFollowUps = 10;
    }

    return {
      capacityScore,
      status,
      insights,
      recommendedCaps: {
        maxDailyFollowUps,
        targetNewLeads: targetNewLeadsAdjusted
      }
    };
  }
}
