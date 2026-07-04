/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Plus, Trash2, Play, AlertCircle, FileText, Share2, Sparkles, Sliders, CheckSquare } from "lucide-react";
import { AutomationAction, AutomationActionType, TaskPriority } from "../../types";
import { PIPELINE_STAGES } from "../../constants";

interface ActionBuilderProps {
  actions: AutomationAction[];
  onChangeActions: (actions: AutomationAction[]) => void;
}

export const ActionBuilder: React.FC<ActionBuilderProps> = ({
  actions,
  onChangeActions,
}) => {
  const actionTypes = [
    { value: AutomationActionType.CREATE_TASK, label: "Create Task", cat: "Operations", desc: "Schedules a standard workday task assigned to the owner." },
    { value: AutomationActionType.ADD_TAG, label: "Add Tag", cat: "Metadata", desc: "Appends a categorizing label tag to the lead profile." },
    { value: AutomationActionType.REMOVE_TAG, label: "Remove Tag", cat: "Metadata", desc: "Strips an existing tag from the lead profile." },
    { value: AutomationActionType.MOVE_PIPELINE_STAGE, label: "Move Pipeline Stage", cat: "Operations", desc: "Moves the lead to a specific column on the pipeline." },
    { value: AutomationActionType.CREATE_REMINDER, label: "Create Reminder", cat: "Operations", desc: "Logs a standard countdown reminder in Smart Reminders." },
    { value: AutomationActionType.CREATE_NOTIFICATION, label: "Create Notification", cat: "Operations", desc: "Pushes an in-app system notification alert." },
    { value: AutomationActionType.GENERATE_AI_SUMMARY, label: "Generate AI Summary", cat: "AI Models", desc: "Leverages Gemini to synthesize previous notes and drafts (Placeholder)." },
    { value: AutomationActionType.SEND_SLACK, label: "Send Slack Notification", cat: "Integrations", desc: "Pushes a real-time message payload to custom Slack channels." },
    { value: AutomationActionType.SEND_EMAIL, label: "Send Email (SMTP)", desc: "Triggers a client-side automated SMTP transaction.", cat: "Integrations" },
    { value: AutomationActionType.SEND_WHATSAPP, label: "Send WhatsApp Message", desc: "Triggers a WhatsApp template dispatch.", cat: "Integrations" },
    { value: AutomationActionType.TRIGGER_WEBHOOK, label: "Trigger Outbound Webhook", desc: "Sends an HTTP POST webhook containing lead details.", cat: "Integrations" },
    { value: AutomationActionType.DUPLICATE_LEAD_CHECK, label: "Duplicate Lead Check", desc: "Cross-checks existing system leads by email or phone.", cat: "Metadata" },
  ];

  const handleAddAction = () => {
    const newAction: AutomationAction = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: AutomationActionType.CREATE_TASK,
      config: { title: "Follow-up Task", description: "Automated standard follow-up", priority: "MEDIUM", dueDateOffsetDays: 3 },
    };
    onChangeActions([...actions, newAction]);
  };

  const handleRemoveAction = (id: string) => {
    onChangeActions(actions.filter((a) => a.id !== id));
  };

  const handleActionChange = (id: string, updated: Partial<AutomationAction>) => {
    onChangeActions(
      actions.map((a) => {
        if (a.id === id) {
          return { ...a, ...updated } as AutomationAction;
        }
        return a;
      })
    );
  };

  const handleConfigChange = (id: string, key: string, val: any) => {
    const action = actions.find((a) => a.id === id);
    if (action) {
      handleActionChange(id, {
        config: { ...action.config, [key]: val },
      });
    }
  };

  return (
    <div className="space-y-6" id="action-builder-block">
      {/* Description header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="font-sans font-bold text-[#2F2F2F] text-sm flex items-center gap-1.5">
            <Play size={15} className="text-[#137333]" />
            <span>Define Sequential Workflow Actions</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">Specify one or more automated steps to execute sequentially when all filters pass.</p>
        </div>
      </div>

      {/* List of active actions */}
      <div className="space-y-4">
        {actions.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-[#D8D8D8] flex flex-col items-center justify-center p-4">
            <AlertCircle size={20} className="text-rose-500 mb-1.5 opacity-80" />
            <p className="text-xs font-semibold text-[#666666]">No actions defined yet</p>
            <p className="text-[11px] text-gray-400 mt-0.5 max-w-sm">An automation requires at least one action to be published. Add your first step below.</p>
            <button
              onClick={handleAddAction}
              className="mt-3.5 px-3 py-1.5 text-xs font-bold bg-[#4E4E49] hover:bg-black text-white rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs"
              type="button"
            >
              <Plus size={12} />
              <span>Add Initial Action Step</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {actions.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#D8D8D8] overflow-hidden shadow-xs"
                id={`action-row-${item.id}`}
              >
                {/* Action Row Top Bar */}
                <div className="px-5 py-3 bg-gray-50/50 border-b border-[#D8D8D8]/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-5 bg-[#4E4E49] text-white rounded-full flex items-center justify-center font-mono text-[10px] font-bold">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-[#2F2F2F] uppercase tracking-wider font-mono">
                      STEP ACTION
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveAction(item.id)}
                    className="p-1 text-[#666666] hover:text-red-600 rounded hover:bg-gray-100 transition-all cursor-pointer"
                    type="button"
                    title="Remove action block"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Action Row Config Body */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Select Type (Col 1) */}
                  <div className="space-y-1.5">
                    <label htmlFor={`action-type-${item.id}`} className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Action Event Type:
                    </label>
                    <select
                      id={`action-type-${item.id}`}
                      value={item.type}
                      onChange={(e) => {
                        handleActionChange(item.id, {
                          type: e.target.value as AutomationActionType,
                          config: {}, // reset config structure
                        });
                      }}
                      className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                    >
                      {actionTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-400 leading-normal mt-1">
                      {actionTypes.find((at) => at.value === item.type)?.desc}
                    </p>
                  </div>

                  {/* Config Parameters form (Cols 2-3) */}
                  <div className="md:col-span-2 space-y-4">
                    <p className="text-xs font-bold text-[#2F2F2F]">Parameters Configuration:</p>

                    {/* CREATE_TASK options */}
                    {item.type === AutomationActionType.CREATE_TASK && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label htmlFor={`task-title-${item.id}`} className="text-[11px] font-bold text-gray-500">Task Title</label>
                          <input
                            id={`task-title-${item.id}`}
                            type="text"
                            value={item.config.title || ""}
                            onChange={(e) => handleConfigChange(item.id, "title", e.target.value)}
                            placeholder="e.g. Schedule Introductory Brief"
                            className="w-full text-xs px-3 py-1.5 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor={`task-days-${item.id}`} className="text-[11px] font-bold text-gray-500">Due Date (Offset Days)</label>
                          <input
                            id={`task-days-${item.id}`}
                            type="number"
                            min={0}
                            value={item.config.dueDateOffsetDays || 3}
                            onChange={(e) => handleConfigChange(item.id, "dueDateOffsetDays", Number(e.target.value))}
                            className="w-full text-xs px-3 py-1.5 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label htmlFor={`task-desc-${item.id}`} className="text-[11px] font-bold text-gray-500">Detailed Description</label>
                          <textarea
                            id={`task-desc-${item.id}`}
                            rows={2}
                            value={item.config.description || ""}
                            onChange={(e) => handleConfigChange(item.id, "description", e.target.value)}
                            placeholder="Provide deep interaction guidelines here..."
                            className="w-full text-xs px-3 py-1.5 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                          />
                        </div>
                      </div>
                    )}

                    {/* ADD_TAG options */}
                    {item.type === AutomationActionType.ADD_TAG && (
                      <div className="max-w-xs space-y-1">
                        <label htmlFor={`add-tag-${item.id}`} className="text-[11px] font-bold text-gray-500">Tag Label</label>
                        <input
                          id={`add-tag-${item.id}`}
                          type="text"
                          value={item.config.tag || ""}
                          onChange={(e) => handleConfigChange(item.id, "tag", e.target.value)}
                          placeholder="e.g. EnterpriseProspect"
                          className="w-full text-xs px-3 py-1.5 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none text-[#2F2F2F]"
                        />
                      </div>
                    )}

                    {/* MOVE_PIPELINE_STAGE options */}
                    {item.type === AutomationActionType.MOVE_PIPELINE_STAGE && (
                      <div className="max-w-xs space-y-1">
                        <label htmlFor={`pipeline-select-${item.id}`} className="text-[11px] font-bold text-gray-500">Target Stage</label>
                        <select
                          id={`pipeline-select-${item.id}`}
                          value={item.config.stage || ""}
                          onChange={(e) => {
                            const selectedStage = PIPELINE_STAGES.find((s) => s.id === e.target.value);
                            handleActionChange(item.id, {
                              config: {
                                stage: e.target.value,
                                status: selectedStage?.status || "NEW"
                              }
                            });
                          }}
                          className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                        >
                          <option value="">-- Choose Pipeline Stage --</option>
                          {PIPELINE_STAGES.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.name} ({st.status.replace(/_/g, " ")})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* SEND_SLACK options */}
                    {item.type === AutomationActionType.SEND_SLACK && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="space-y-1">
                          <label htmlFor={`slack-chan-${item.id}`} className="text-[11px] font-bold text-gray-500 font-mono">Slack Channel</label>
                          <input
                            id={`slack-chan-${item.id}`}
                            type="text"
                            value={item.config.channel || "#"}
                            onChange={(e) => handleConfigChange(item.id, "channel", e.target.value)}
                            placeholder="e.g. #sales-wins"
                            className="w-full text-xs px-3 py-1.5 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none text-[#2F2F2F]"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label htmlFor={`slack-msg-${item.id}`} className="text-[11px] font-bold text-gray-500">Slack Message Body</label>
                          <input
                            id={`slack-msg-${item.id}`}
                            type="text"
                            value={item.config.message || ""}
                            onChange={(e) => handleConfigChange(item.id, "message", e.target.value)}
                            placeholder="e.g. Opportunity closed! Congrats to the team! 🎉"
                            className="w-full text-xs px-3 py-1.5 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none text-[#2F2F2F]"
                          />
                        </div>
                      </div>
                    )}

                    {/* GENERATE_AI_SUMMARY options */}
                    {item.type === AutomationActionType.GENERATE_AI_SUMMARY && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                          <Sparkles size={13} className="animate-pulse" />
                          <span>Gemini model placeholder integration</span>
                        </div>
                        <label htmlFor={`ai-prompt-${item.id}`} className="text-[11px] font-bold text-gray-500">Custom Generation Instructions</label>
                        <textarea
                          id={`ai-prompt-${item.id}`}
                          rows={2}
                          value={item.config.prompt || ""}
                          onChange={(e) => handleConfigChange(item.id, "prompt", e.target.value)}
                          placeholder="Instructions: e.g. Analyze recent notes and summarize key buying factors, pricing challenges, and competitive barriers..."
                          className="w-full text-xs px-3 py-1.5 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                        />
                      </div>
                    )}

                    {/* Fallback parameters message */}
                    {![
                      AutomationActionType.CREATE_TASK,
                      AutomationActionType.ADD_TAG,
                      AutomationActionType.MOVE_PIPELINE_STAGE,
                      AutomationActionType.SEND_SLACK,
                      AutomationActionType.GENERATE_AI_SUMMARY
                    ].includes(item.type as any) && (
                      <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500 italic flex items-center gap-1">
                        <CheckSquare size={13} />
                        <span>Generic execution parameters will be pre-filled automatically on trigger. No further input needed.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom append row */}
            <div className="flex justify-start pt-1">
              <button
                onClick={handleAddAction}
                className="px-4 py-2 bg-[#E5E3E7] hover:bg-[#4E4E49] hover:text-white rounded-xl text-xs font-bold text-[#2F2F2F] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                type="button"
              >
                <Plus size={14} />
                <span>Append Next Step Action</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
