/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Zap, Sparkles, HelpCircle, AlertCircle, RefreshCw, Key } from "lucide-react";
import { AutomationTriggerType, LeadStatus } from "../../types";

interface TriggerSelectorProps {
  selectedType: AutomationTriggerType | "";
  config: Record<string, any>;
  onChangeType: (type: AutomationTriggerType) => void;
  onChangeConfig: (config: Record<string, any>) => void;
}

export const TriggerSelector: React.FC<TriggerSelectorProps> = ({
  selectedType,
  config,
  onChangeType,
  onChangeConfig,
}) => {
  const triggerOptions = [
    { type: AutomationTriggerType.LEAD_CREATED, label: "Lead Created", desc: "Triggers when a fresh lead enters the system or is manually registered.", cat: "Core" },
    { type: AutomationTriggerType.LEAD_UPDATED, label: "Lead Updated", desc: "Runs whenever any core attribute on the lead is edited.", cat: "Core" },
    { type: AutomationTriggerType.STATUS_CHANGED, label: "Status Changed", desc: "Fires when a lead progresses to a new pipeline state.", cat: "Core" },
    { type: AutomationTriggerType.DEAL_CLOSED, label: "Deal Closed (Won)", desc: "Triggers when the opportunity transitions to CLOSED_WON.", cat: "Revenue" },
    { type: AutomationTriggerType.DEAL_LOST, label: "Deal Lost", desc: "Triggers when a prospect transitions to CLOSED_LOST.", cat: "Revenue" },
    { type: AutomationTriggerType.FOLLOW_UP_DUE, label: "Follow-up Due", desc: "Fires when the next contact date and time arrives.", cat: "Activities" },
    { type: AutomationTriggerType.FOLLOW_UP_MISSED, label: "Follow-up Missed", desc: "Runs if a contact slot expires without communication logs.", cat: "Activities" },
    { type: AutomationTriggerType.MEETING_SCHEDULED, label: "Meeting Scheduled", desc: "Triggered on scheduling a sync task.", cat: "Activities" },
    { type: AutomationTriggerType.MEETING_COMPLETED, label: "Meeting Completed", desc: "Runs after concluding a scheduled call.", cat: "Activities" },
    { type: AutomationTriggerType.PROPOSAL_SENT, label: "Proposal Sent", desc: "Runs once a proposal file is sent.", cat: "Marketing" },
    { type: AutomationTriggerType.PROPOSAL_VIEWED, label: "Proposal Viewed", desc: "Placeholder — fires when prospect opens custom proposal URL.", cat: "Marketing" },
    { type: AutomationTriggerType.LEAD_IMPORTED, label: "Lead Imported", desc: "Triggers upon completing a CSV batch import.", cat: "Marketing" },
    { type: AutomationTriggerType.TASK_COMPLETED, label: "Task Completed", desc: "Fires upon checking off a workpiece task.", cat: "Core" },
    { type: AutomationTriggerType.REMINDER_IGNORED, label: "Reminder Ignored", desc: "Runs after warning notifications are dismissed.", cat: "Activities" },
    { type: AutomationTriggerType.MANUAL_TRIGGER, label: "Manual Execution", desc: "Can be fired manually via individual profile action menus.", cat: "Core" },
    { type: AutomationTriggerType.WEBHOOK_TRIGGER, label: "Webhook Payload", desc: "Webhook trigger — execute via external HTTP POST query.", cat: "Integrations" },
    { type: AutomationTriggerType.API_TRIGGER, label: "API Trigger", desc: "Fires when developer registers a custom SDK transaction.", cat: "Integrations" },
  ];

  const handleStatusChange = (val: string) => {
    onChangeConfig({ ...config, targetStatus: val });
  };

  const handleNumberChange = (field: string, val: number) => {
    onChangeConfig({ ...config, [field]: val });
  };

  const handleStringChange = (field: string, val: string) => {
    onChangeConfig({ ...config, [field]: val });
  };

  return (
    <div className="space-y-6" id="trigger-selector-block">
      {/* Visual Header */}
      <div>
        <h3 className="font-sans font-bold text-[#2F2F2F] text-sm flex items-center gap-1.5">
          <Zap size={15} className="text-[#8E44AD]" />
          <span>Configure Workflow Trigger</span>
        </h3>
        <p className="text-xs text-gray-400 mt-1">Select the operational event that launches this automated pipeline ruleset.</p>
      </div>

      {/* Grid selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {triggerOptions.map((opt) => {
          const isSelected = selectedType === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => {
                onChangeType(opt.type);
                // Pre-fill standard config structures
                if (opt.type === AutomationTriggerType.STATUS_CHANGED) {
                  onChangeConfig({ targetStatus: LeadStatus.NEW });
                } else if (opt.type === AutomationTriggerType.FOLLOW_UP_MISSED) {
                  onChangeConfig({ gracePeriodHours: 24 });
                } else if (opt.type === AutomationTriggerType.WEBHOOK_TRIGGER) {
                  onChangeConfig({ path: `/api/v1/lead-hook-${Math.floor(Math.random() * 90000) + 10000}` });
                } else {
                  onChangeConfig({});
                }
              }}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-32 ${
                isSelected
                  ? "bg-purple-50/50 border-[#8E44AD] shadow-sm ring-1 ring-[#8E44AD]"
                  : "bg-white border-[#D8D8D8] hover:border-gray-400"
              }`}
              type="button"
              id={`trigger-option-${opt.type}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-sans font-bold text-xs text-[#2F2F2F] tracking-tight truncate leading-none">
                    {opt.label}
                  </span>
                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                    isSelected ? "bg-purple-200 text-[#8E44AD]" : "bg-gray-100 text-gray-500"
                  }`}>
                    {opt.cat}
                  </span>
                </div>
                <p className="text-[11px] text-[#666666] leading-relaxed line-clamp-2">
                  {opt.desc}
                </p>
              </div>

              {isSelected && (
                <div className="flex items-center gap-1 text-[10px] text-[#8E44AD] font-bold mt-2">
                  <Sparkles size={11} className="animate-pulse" />
                  <span>Configuring this event</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic parameters input */}
      {selectedType && (
        <div className="p-4 rounded-xl border border-dashed border-[#D8D8D8] bg-gray-50/50 space-y-4">
          <p className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-wider">Trigger Parameter Settings:</p>

          {/* Status Changed parameters */}
          {selectedType === AutomationTriggerType.STATUS_CHANGED && (
            <div className="max-w-xs space-y-1.5">
              <label htmlFor="trigger-target-status" className="text-xs font-semibold text-[#2F2F2F]">
                Transition to Status:
              </label>
              <select
                id="trigger-target-status"
                value={config.targetStatus || LeadStatus.NEW}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] focus:border-[#4E4E49] text-[#2F2F2F]"
              >
                {Object.values(LeadStatus).map((st) => (
                  <option key={st} value={st}>
                    {st.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Follow up missed parameters */}
          {selectedType === AutomationTriggerType.FOLLOW_UP_MISSED && (
            <div className="max-w-xs space-y-1.5">
              <label htmlFor="trigger-grace-hours" className="text-xs font-semibold text-[#2F2F2F] flex items-center gap-1.5">
                <AlertCircle size={12} className="text-[#8E44AD]" />
                <span>Grace Period (Hours):</span>
              </label>
              <input
                id="trigger-grace-hours"
                type="number"
                min={1}
                max={168}
                value={config.gracePeriodHours || 24}
                onChange={(e) => handleNumberChange("gracePeriodHours", Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
              />
              <p className="text-[10px] text-gray-400">Trigger rule only if missed follow-up remains unresolved for this duration.</p>
            </div>
          )}

          {/* Webhook trigger parameters */}
          {selectedType === AutomationTriggerType.WEBHOOK_TRIGGER && (
            <div className="space-y-3">
              <div className="max-w-md space-y-1.5">
                <label htmlFor="trigger-webhook-endpoint" className="text-xs font-semibold text-[#2F2F2F] flex items-center gap-1.5">
                  <Key size={12} />
                  <span>Target API Webhook Route:</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[#D8D8D8] bg-gray-100 text-gray-500 font-mono text-[11px]">
                    https://synity.io
                  </span>
                  <input
                    id="trigger-webhook-endpoint"
                    type="text"
                    value={config.path || ""}
                    onChange={(e) => handleStringChange("path", e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 text-xs border border-[#D8D8D8] rounded-r-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] font-mono text-[#2F2F2F]"
                  />
                </div>
              </div>
              <p className="text-[11px] text-gray-400 leading-normal">
                Trigger workflows by posting a standard JSON webhook to this generated endpoint. Payload structures map automatically as lead profile objects.
              </p>
            </div>
          )}

          {/* Fallback parameters if none needed */}
          {![AutomationTriggerType.STATUS_CHANGED, AutomationTriggerType.FOLLOW_UP_MISSED, AutomationTriggerType.WEBHOOK_TRIGGER].includes(selectedType as any) && (
            <div className="flex items-center gap-2 text-xs text-[#666666] italic">
              <RefreshCw size={12} className="animate-pulse" />
              <span>No additional configurations required for this trigger type. Executes on all occurrences.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
