/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AutomationRule,
  AutomationTemplate,
  AutomationHistoryEntry,
  AutomationAnalyticsSummary,
  AutomationTriggerType,
  AutomationConditionField,
  ConditionOperator,
  AutomationActionType
} from "../../types";

export const BUILTIN_TEMPLATES: AutomationTemplate[] = [
  {
    id: "template-1",
    name: "If Follow-up Missed",
    description: "Detect when a scheduled next contact date passes without contact, and flag to account owner immediately with an urgent task.",
    category: "Operations",
    trigger: {
      type: AutomationTriggerType.FOLLOW_UP_MISSED,
      config: { gracePeriodHours: 24 }
    },
    conditionGroup: {
      id: "cond-g-1",
      logicalOperator: "AND",
      conditions: [
        {
          id: "cond-1",
          field: AutomationConditionField.PRIORITY,
          operator: ConditionOperator.EQUALS,
          value: "HIGH"
        }
      ]
    },
    actions: [
      {
        id: "act-1",
        type: AutomationActionType.CREATE_REMINDER,
        config: {
          title: "URGENT: Missed client follow-up",
          notes: "A high priority client follow-up window was missed. Re-engage immediately."
        }
      },
      {
        id: "act-2",
        type: AutomationActionType.ASSIGN_PRIORITY,
        config: { priority: "URGENT" }
      }
    ]
  },
  {
    id: "template-2",
    name: "If Lead Becomes Cold",
    description: "Automatically move leads with no contact in 14 days and medium pipeline score to the recovery queue.",
    category: "Recovery",
    trigger: {
      type: AutomationTriggerType.LEAD_UPDATED,
      config: { attribute: "lastContactedAt" }
    },
    conditionGroup: {
      id: "cond-g-2",
      logicalOperator: "AND",
      conditions: [
        {
          id: "cond-2",
          field: AutomationConditionField.DAYS_SINCE_LAST_CONTACT,
          operator: ConditionOperator.GREATER_THAN,
          value: 14
        },
        {
          id: "cond-3",
          field: AutomationConditionField.LEAD_STATUS,
          operator: ConditionOperator.NOT_EQUALS,
          value: "CLOSED_WON"
        }
      ]
    },
    actions: [
      {
        id: "act-3",
        type: AutomationActionType.MOVE_PIPELINE_STAGE,
        config: { stage: "stage-3", status: "NO_ANSWER" }
      },
      {
        id: "act-4",
        type: AutomationActionType.ADD_TAG,
        config: { tag: "RecoveryQueue" }
      },
      {
        id: "act-5",
        type: AutomationActionType.GENERATE_AI_SUMMARY,
        config: { prompt: "Analyze lead history and outline a 3-step recovery campaign." }
      }
    ]
  },
  {
    id: "template-3",
    name: "If Deal Closed",
    description: "Trigger comprehensive client onboarding and log standard success activities upon winning an opportunity.",
    category: "Operations",
    trigger: {
      type: AutomationTriggerType.DEAL_CLOSED,
      config: {}
    },
    conditionGroup: {
      id: "cond-g-3",
      logicalOperator: "AND",
      conditions: []
    },
    actions: [
      {
        id: "act-6",
        type: AutomationActionType.CREATE_TASK,
        config: {
          title: "Initiate Customer Onboarding Session",
          description: "Schedule a 30-minute kickoff call, dispatch the master software license keys, and link documentation.",
          dueDateOffsetDays: 2,
          priority: "HIGH"
        }
      },
      {
        id: "act-7",
        type: AutomationActionType.ADD_TAG,
        config: { tag: "ActiveCustomer" }
      },
      {
        id: "act-8",
        type: AutomationActionType.SEND_SLACK,
        config: {
          channel: "#sales-wins",
          message: "🎉 Opportunity Closed Won! Welcome aboard to a new partner. Let's make them successful!"
        }
      }
    ]
  },
  {
    id: "template-4",
    name: "If No Answer",
    description: "Reschedule immediate callback tasks for tomorrow morning when an outbound outreach attempt yields no answer.",
    category: "Communication",
    trigger: {
      type: AutomationTriggerType.STATUS_CHANGED,
      config: { targetStatus: "NO_ANSWER" }
    },
    conditionGroup: {
      id: "cond-g-4",
      logicalOperator: "AND",
      conditions: []
    },
    actions: [
      {
        id: "act-9",
        type: AutomationActionType.SCHEDULE_FOLLOW_UP,
        config: { offsetDays: 1, time: "10:00" }
      },
      {
        id: "act-10",
        type: AutomationActionType.CREATE_NOTIFICATION,
        config: {
          title: "Follow-up Call Rescheduled",
          description: "Client missed the outreach. Automated dial scheduled for tomorrow morning."
        }
      }
    ]
  },
  {
    id: "template-5",
    name: "If Proposal Sent",
    description: "Track sales velocity and prompt standard follow-ups 3 days after sending out pricing proposals.",
    category: "Nurturing",
    trigger: {
      type: AutomationTriggerType.PROPOSAL_SENT,
      config: {}
    },
    conditionGroup: {
      id: "cond-g-5",
      logicalOperator: "AND",
      conditions: [
        {
          id: "cond-4",
          field: AutomationConditionField.DEAL_VALUE,
          operator: ConditionOperator.GREATER_THAN,
          value: 10000
        }
      ]
    },
    actions: [
      {
        id: "act-11",
        type: AutomationActionType.CREATE_TASK,
        config: {
          title: "Follow up on Sent Proposal",
          description: "Review analytics to check if they viewed the quote, then schedule a follow-up call to handle potential objections.",
          dueDateOffsetDays: 3,
          priority: "MEDIUM"
        }
      },
      {
        id: "act-12",
        type: AutomationActionType.SEND_INTERNAL_ALERT,
        config: {
          recipient: "Alex Rivers",
          message: "High-value proposal sent! Keep active watch on client workspace sessions."
        }
      }
    ]
  }
];

export const INITIAL_RULES: AutomationRule[] = [
  {
    id: "rule-1",
    name: "Enterprise SLA Onboarding",
    description: "Automate onboarding, alert Slack win channel, and assign top priority tasks when an enterprise deal closed won.",
    isActive: true,
    isDraft: false,
    trigger: {
      type: AutomationTriggerType.DEAL_CLOSED,
      config: {}
    },
    conditionGroup: {
      id: "rg-1",
      logicalOperator: "AND",
      conditions: [
        {
          id: "rc-1",
          field: AutomationConditionField.DEAL_VALUE,
          operator: ConditionOperator.GREATER_THAN,
          value: 30000
        }
      ]
    },
    actions: [
      {
        id: "ra-1",
        type: AutomationActionType.CREATE_TASK,
        config: {
          title: "Deploy Dedicated Enterprise Cluster",
          description: "Provision staging instance and setup customized client SSO connections with legal agreement guidelines.",
          dueDateOffsetDays: 1,
          priority: "HIGH"
        }
      },
      {
        id: "ra-2",
        type: AutomationActionType.ADD_TAG,
        config: { tag: "EnterpriseSLA" }
      },
      {
        id: "ra-3",
        type: AutomationActionType.SEND_SLACK,
        config: {
          channel: "#enterprise-wins",
          message: "🚀 HUGE WIN: Enterprise client successfully onboarded with custom SLA tier. Provisioning cluster active."
        }
      }
    ],
    createdAt: "2026-06-15T09:00:00Z",
    updatedAt: "2026-07-02T16:45:00Z",
    version: 3,
    versions: [
      {
        version: 1,
        updatedAt: "2026-06-15T09:00:00Z",
        updatedBy: "Alex Rivers",
        changeSummary: "Initial workflow definition.",
        ruleState: {
          name: "Enterprise SLA Onboarding",
          description: "Automate onboarding on deal won",
          trigger: { type: AutomationTriggerType.DEAL_CLOSED, config: {} },
          conditionGroup: { id: "rcg-1", logicalOperator: "AND", conditions: [] },
          actions: []
        }
      },
      {
        version: 2,
        updatedAt: "2026-06-25T14:30:00Z",
        updatedBy: "Alex Rivers",
        changeSummary: "Added $30k deal value restriction conditions.",
        ruleState: {
          name: "Enterprise SLA Onboarding",
          description: "Automate onboarding, alert Slack on high deal value",
          trigger: { type: AutomationTriggerType.DEAL_CLOSED, config: {} },
          conditionGroup: {
            id: "rcg-2",
            logicalOperator: "AND",
            conditions: [
              { id: "c-1", field: AutomationConditionField.DEAL_VALUE, operator: ConditionOperator.GREATER_THAN, value: 30000 }
            ]
          },
          actions: []
        }
      },
      {
        version: 3,
        updatedAt: "2026-07-02T16:45:00Z",
        updatedBy: "Alex Rivers",
        changeSummary: "Added dedicated Cluster deployment task & slack integration.",
        ruleState: {
          name: "Enterprise SLA Onboarding",
          description: "Automate onboarding, alert Slack win channel, and assign top priority tasks when an enterprise deal closed won.",
          trigger: { type: AutomationTriggerType.DEAL_CLOSED, config: {} },
          conditionGroup: {
            id: "rg-1",
            logicalOperator: "AND",
            conditions: [
              { id: "rc-1", field: AutomationConditionField.DEAL_VALUE, operator: ConditionOperator.GREATER_THAN, value: 30000 }
            ]
          },
          actions: []
        }
      }
    ]
  },
  {
    id: "rule-2",
    name: "LinkedIn Lead Nurturing Router",
    description: "Applies specialized tags, scores prospects, and assigns low-friction initial call tasks to fresh LinkedIn leads.",
    isActive: true,
    isDraft: false,
    trigger: {
      type: AutomationTriggerType.LEAD_CREATED,
      config: {}
    },
    conditionGroup: {
      id: "rg-2",
      logicalOperator: "AND",
      conditions: [
        {
          id: "rc-2",
          field: AutomationConditionField.LEAD_SOURCE,
          operator: ConditionOperator.EQUALS,
          value: "LinkedIn Outreach"
        }
      ]
    },
    actions: [
      {
        id: "ra-4",
        type: AutomationActionType.ADD_TAG,
        config: { tag: "LinkedInHot" }
      },
      {
        id: "ra-5",
        type: AutomationActionType.CREATE_TASK,
        config: {
          title: "Conduct profile enrichment check",
          description: "Research prospect's corporate profile, headcount growth metrics, and current CRM platforms.",
          dueDateOffsetDays: 1,
          priority: "MEDIUM"
        }
      }
    ],
    createdAt: "2026-06-20T11:20:00Z",
    updatedAt: "2026-06-20T11:20:00Z",
    version: 1,
    versions: []
  },
  {
    id: "rule-3",
    name: "Dormant Opportunity Recovery",
    description: "For leads in negotiations that stall with no updates for over 10 days, trigger emergency AI summaries and push a Slack review alert.",
    isActive: false,
    isDraft: false,
    trigger: {
      type: AutomationTriggerType.LEAD_UPDATED,
      config: { attribute: "status" }
    },
    conditionGroup: {
      id: "rg-3",
      logicalOperator: "AND",
      conditions: [
        {
          id: "rc-3",
          field: AutomationConditionField.PIPELINE_STAGE,
          operator: ConditionOperator.EQUALS,
          value: "stage-9" // Negotiation
        },
        {
          id: "rc-4",
          field: AutomationConditionField.DAYS_SINCE_LAST_CONTACT,
          operator: ConditionOperator.GREATER_THAN,
          value: 10
        }
      ]
    },
    actions: [
      {
        id: "ra-6",
        type: AutomationActionType.GENERATE_AI_SUMMARY,
        config: { prompt: "Outline contract choke points and legal adjustments." }
      },
      {
        id: "ra-7",
        type: AutomationActionType.SEND_SLACK,
        config: { channel: "#stalled-pipelines", message: "⚠️ Attention: Negotiations stalled for more than 10 days. Re-evaluating contract..." }
      }
    ],
    createdAt: "2026-06-22T14:10:00Z",
    updatedAt: "2026-06-24T18:30:00Z",
    version: 2,
    versions: []
  },
  {
    id: "rule-4",
    name: "Webhook Lead Auto-Importer",
    description: "Validates payload records, filters regional tags, and checks duplicates from outbound marketing partners.",
    isActive: false,
    isDraft: true,
    trigger: {
      type: AutomationTriggerType.WEBHOOK_TRIGGER,
      config: { path: "/api/v1/lead-import-hook" }
    },
    conditionGroup: {
      id: "rg-4",
      logicalOperator: "OR",
      conditions: [
        {
          id: "rc-5",
          field: AutomationConditionField.COUNTRY,
          operator: ConditionOperator.EQUALS,
          value: "United States"
        },
        {
          id: "rc-6",
          field: AutomationConditionField.COUNTRY,
          operator: ConditionOperator.EQUALS,
          value: "United Kingdom"
        }
      ]
    },
    actions: [
      {
        id: "ra-8",
        type: AutomationActionType.DUPLICATE_LEAD_CHECK,
        config: { matchBy: "email" }
      },
      {
        id: "ra-9",
        type: AutomationActionType.ASSIGN_PRIORITY,
        config: { priority: "HIGH" }
      }
    ],
    createdAt: "2026-07-01T15:00:00Z",
    updatedAt: "2026-07-01T15:00:00Z",
    version: 1,
    versions: []
  }
];

export const MOCK_HISTORY: AutomationHistoryEntry[] = [
  {
    id: "h-1",
    ruleId: "rule-1",
    ruleName: "Enterprise SLA Onboarding",
    executionTime: "2026-07-04T01:30:00Z",
    leadId: "lead-6",
    leadName: "Clara Oswald",
    status: "SUCCESS",
    durationMs: 412,
    result: "SLA Cluster initialized successfully; added tag 'EnterpriseSLA' and dispatched victory payload to Slack #enterprise-wins."
  },
  {
    id: "h-2",
    ruleId: "rule-2",
    ruleName: "LinkedIn Lead Nurturing Router",
    executionTime: "2026-07-03T18:22:00Z",
    leadId: "lead-1",
    leadName: "Alexander Mercer",
    status: "SUCCESS",
    durationMs: 180,
    result: "Prospect tag 'LinkedInHot' applied. Created task 'Conduct profile enrichment check' due within 24 hours."
  },
  {
    id: "h-3",
    ruleId: "rule-1",
    ruleName: "Enterprise SLA Onboarding",
    executionTime: "2026-07-02T15:10:00Z",
    leadId: "lead-3",
    leadName: "Marcus Aurelius Vance",
    status: "SKIPPED",
    durationMs: 45,
    result: "Execution skipped. Condition check failed: Deal Value ($85,000) was higher, but the Deal Status has not reached CLOSED_WON."
  },
  {
    id: "h-4",
    ruleId: "rule-3",
    ruleName: "Dormant Opportunity Recovery",
    executionTime: "2026-07-01T12:00:00Z",
    leadId: "lead-5",
    leadName: "Kenji Sato",
    status: "FAILED",
    durationMs: 820,
    result: "Workflow failed at Step 1 (GENERATE_AI_SUMMARY). Remote generative server returned code 503 (Overloaded). Will retry automatically.",
    errors: "Generative model call failed. Service temporarily unavailable."
  },
  {
    id: "h-5",
    ruleId: "rule-2",
    ruleName: "LinkedIn Lead Nurturing Router",
    executionTime: "2026-06-30T10:15:00Z",
    leadId: "lead-2",
    leadName: "Elena Rostova",
    status: "SKIPPED",
    durationMs: 25,
    result: "Execution skipped. Condition failed: Lead source was 'Inbound Website', expected 'LinkedIn Outreach'."
  },
  {
    id: "h-6",
    ruleId: "rule-1",
    ruleName: "Enterprise SLA Onboarding",
    executionTime: "2026-06-29T14:40:00Z",
    leadId: "lead-6",
    leadName: "Clara Oswald",
    status: "SUCCESS",
    durationMs: 380,
    result: "SLA Cluster initialized successfully; added tag 'EnterpriseSLA' and dispatched win notification."
  },
  {
    id: "h-7",
    ruleId: "rule-2",
    ruleName: "LinkedIn Lead Nurturing Router",
    executionTime: "2026-06-28T09:16:00Z",
    leadId: "lead-1",
    leadName: "Alexander Mercer",
    status: "SUCCESS",
    durationMs: 195,
    result: "Prospect tag 'LinkedInHot' applied. Created profile enrichment checks."
  },
  {
    id: "h-8",
    ruleId: "rule-3",
    ruleName: "Dormant Opportunity Recovery",
    executionTime: "2026-06-25T11:00:00Z",
    leadId: "lead-4",
    leadName: "Sarah Jenkins",
    status: "SUCCESS",
    durationMs: 610,
    result: "Generative AI analysis executed. Slack announcement logged to #stalled-pipelines."
  }
];

export const MOCK_ANALYTICS: AutomationAnalyticsSummary = {
  totalRuns: 248,
  successfulRuns: 215,
  failedRuns: 8,
  avgExecutionTimeMs: 245,
  mostUsedAutomationId: "rule-2",
  mostUsedAutomationName: "LinkedIn Lead Nurturing Router",
  runsByDay: [
    { date: "06/28", runs: 28 },
    { date: "06/29", runs: 32 },
    { date: "06/30", runs: 24 },
    { date: "07/01", runs: 41 },
    { date: "07/02", runs: 35 },
    { date: "07/03", runs: 50 },
    { date: "07/04", runs: 38 }
  ]
};
