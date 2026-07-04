/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AutomationTriggerType {
  LEAD_CREATED = "LEAD_CREATED",
  LEAD_UPDATED = "LEAD_UPDATED",
  STATUS_CHANGED = "STATUS_CHANGED",
  FOLLOW_UP_DUE = "FOLLOW_UP_DUE",
  FOLLOW_UP_MISSED = "FOLLOW_UP_MISSED",
  MEETING_SCHEDULED = "MEETING_SCHEDULED",
  MEETING_COMPLETED = "MEETING_COMPLETED",
  PROPOSAL_SENT = "PROPOSAL_SENT",
  PROPOSAL_VIEWED = "PROPOSAL_VIEWED",
  DEAL_CLOSED = "DEAL_CLOSED",
  DEAL_LOST = "DEAL_LOST",
  LEAD_IMPORTED = "LEAD_IMPORTED",
  TASK_COMPLETED = "TASK_COMPLETED",
  REMINDER_IGNORED = "REMINDER_IGNORED",
  MANUAL_TRIGGER = "MANUAL_TRIGGER",
  WEBHOOK_TRIGGER = "WEBHOOK_TRIGGER",
  API_TRIGGER = "API_TRIGGER"
}

export enum AutomationConditionField {
  LEAD_STATUS = "leadStatus",
  INDUSTRY = "industry",
  COUNTRY = "country",
  LEAD_SOURCE = "leadSource",
  PRIORITY = "priority",
  DEAL_VALUE = "dealValue",
  LEAD_HEALTH = "leadHealth",
  DAYS_SINCE_LAST_CONTACT = "daysSinceLastContact",
  PIPELINE_STAGE = "pipelineStage",
  TAG = "tag",
  CUSTOM_DATE = "customDate"
}

export enum ConditionOperator {
  EQUALS = "EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
  CONTAINS = "CONTAINS",
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  IN = "IN",
  NOT_IN = "NOT_IN"
}

export enum AutomationActionType {
  CREATE_TASK = "CREATE_TASK",
  SCHEDULE_FOLLOW_UP = "SCHEDULE_FOLLOW_UP",
  SCHEDULE_MEETING = "SCHEDULE_MEETING",
  MOVE_PIPELINE_STAGE = "MOVE_PIPELINE_STAGE",
  ASSIGN_PRIORITY = "ASSIGN_PRIORITY",
  ADD_TAG = "ADD_TAG",
  REMOVE_TAG = "REMOVE_TAG",
  CREATE_NOTIFICATION = "CREATE_NOTIFICATION",
  CREATE_REMINDER = "CREATE_REMINDER",
  GENERATE_AI_SUMMARY = "GENERATE_AI_SUMMARY",
  SEND_INTERNAL_ALERT = "SEND_INTERNAL_ALERT",
  UPDATE_LEAD = "UPDATE_LEAD",
  DUPLICATE_LEAD_CHECK = "DUPLICATE_LEAD_CHECK",
  SEND_EMAIL = "SEND_EMAIL",
  SEND_WHATSAPP = "SEND_WHATSAPP",
  SEND_SLACK = "SEND_SLACK",
  TRIGGER_WEBHOOK = "TRIGGER_WEBHOOK"
}

export interface AutomationTrigger {
  type: AutomationTriggerType;
  config: Record<string, any>;
}

export interface AutomationCondition {
  id: string;
  field: AutomationConditionField;
  operator: ConditionOperator;
  value: any;
}

export interface AutomationConditionGroup {
  id: string;
  logicalOperator: "AND" | "OR";
  conditions: (AutomationCondition | AutomationConditionGroup)[];
}

export interface AutomationAction {
  id: string;
  type: AutomationActionType;
  config: Record<string, any>;
}

export interface AutomationRuleVersion {
  version: number;
  updatedAt: string;
  updatedBy: string;
  changeSummary: string;
  ruleState: {
    name: string;
    description: string;
    trigger: AutomationTrigger;
    conditionGroup: AutomationConditionGroup;
    actions: AutomationAction[];
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isDraft: boolean;
  trigger: AutomationTrigger;
  conditionGroup: AutomationConditionGroup;
  actions: AutomationAction[];
  createdAt: string;
  updatedAt: string;
  version: number;
  versions: AutomationRuleVersion[];
}

export interface AutomationHistoryEntry {
  id: string;
  ruleId: string;
  ruleName: string;
  executionTime: string;
  leadId?: string;
  leadName?: string;
  status: "SUCCESS" | "FAILED" | "SKIPPED";
  durationMs: number;
  result: string;
  errors?: string;
}

export interface AutomationAnalyticsSummary {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  avgExecutionTimeMs: number;
  mostUsedAutomationId: string;
  mostUsedAutomationName: string;
  runsByDay: { date: string; runs: number }[];
}

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: "Nurturing" | "Operations" | "Recovery" | "Communication";
  trigger: AutomationTrigger;
  conditionGroup: AutomationConditionGroup;
  actions: AutomationAction[];
}
