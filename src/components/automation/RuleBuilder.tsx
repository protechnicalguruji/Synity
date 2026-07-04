/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Sparkles, BrainCircuit, ShieldCheck, History, Sliders, CheckSquare, Zap, Play, Terminal } from "lucide-react";
import { TriggerSelector } from "./TriggerSelector";
import { ConditionBuilder } from "./ConditionBuilder";
import { ActionBuilder } from "./ActionBuilder";
import { NodeEditor } from "./NodeEditor";
import {
  AutomationRule,
  AutomationTriggerType,
  AutomationConditionGroup,
  AutomationAction,
  AutomationCondition,
  AutomationRuleVersion
} from "../../types";

interface RuleBuilderProps {
  initialRule: AutomationRule | null;
  onSave: (rule: AutomationRule) => void;
  onCancel: () => void;
}

export const RuleBuilder: React.FC<RuleBuilderProps> = ({
  initialRule,
  onSave,
  onCancel,
}) => {
  // Navigation Tabs for composition
  const [activeTab, setActiveTab] = useState<"details" | "trigger" | "conditions" | "actions" | "flow">("details");

  // Local Rule Composition States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [isActive, setIsActive] = useState(false);
  
  const [triggerType, setTriggerType] = useState<AutomationTriggerType | "">("");
  const [triggerConfig, setTriggerConfig] = useState<Record<string, any>>({});

  const [conditionGroup, setConditionGroup] = useState<AutomationConditionGroup>({
    id: "rg-root",
    logicalOperator: "AND",
    conditions: []
  });

  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [versions, setVersions] = useState<AutomationRuleVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  // Load initial rule states
  useEffect(() => {
    if (initialRule) {
      setName(initialRule.name);
      setDescription(initialRule.description);
      setIsDraft(initialRule.isDraft);
      setIsActive(initialRule.isActive);
      setTriggerType(initialRule.trigger.type);
      setTriggerConfig(initialRule.trigger.config);
      setConditionGroup(initialRule.conditionGroup);
      setActions(initialRule.actions);
      setVersions(initialRule.versions || []);
    } else {
      // Setup blank new rules
      setName("");
      setDescription("");
      setIsDraft(true);
      setIsActive(false);
      setTriggerType("");
      setTriggerConfig({});
      setConditionGroup({ id: `rg-${Date.now()}`, logicalOperator: "AND", conditions: [] });
      setActions([]);
      setVersions([]);
    }
  }, [initialRule]);

  // Handle dry-run draft toggles
  const handleToggleDraft = (val: boolean) => {
    setIsDraft(val);
    if (val) setIsActive(false); // drafts can't be active
  };

  // Compile conditions list to printable strings
  const getConditionsSummary = (): string[] => {
    return conditionGroup.conditions.map((item) => {
      const cond = item as AutomationCondition;
      return `${cond.field} ${cond.operator.toLowerCase().replace(/_/g, " ")} "${cond.value}"`;
    });
  };

  // Trigger Local Save
  const handleLocalSave = () => {
    if (!name.trim()) {
      alert("Please provide a name for your automation.");
      return;
    }

    const compiledRule: AutomationRule = {
      id: initialRule?.id || `rule-${Date.now()}`,
      name,
      description,
      isActive: isDraft ? false : isActive,
      isDraft,
      trigger: {
        type: triggerType || AutomationTriggerType.LEAD_CREATED,
        config: triggerConfig
      },
      conditionGroup,
      actions,
      createdAt: initialRule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: initialRule ? initialRule.version + 1 : 1,
      versions: [
        ...(initialRule?.versions || []),
        {
          version: initialRule ? initialRule.version + 1 : 1,
          updatedAt: new Date().toISOString(),
          updatedBy: "Alex Rivers",
          changeSummary: initialRule ? `Modified rule configurations` : `Created rule`,
          ruleState: {
            name,
            description,
            trigger: { type: triggerType || AutomationTriggerType.LEAD_CREATED, config: triggerConfig },
            conditionGroup,
            actions
          }
        }
      ]
    };

    onSave(compiledRule);
  };

  // AI Suggestion triggers (Placeholders)
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const triggerAISuggestions = () => {
    setAiOptimizing(true);
    setAiSuggestion(null);
    setTimeout(() => {
      setAiOptimizing(false);
      setAiSuggestion(
        "AI Optimization Summary: Your trigger matches are highly efficient. Consider appending a 3-day Slack nudge to optimize team contact velocity."
      );
    }, 1200);
  };

  // Rollback to specific historic version (Simulation)
  const handleRollback = (ver: AutomationRuleVersion) => {
    setSelectedVersion(ver.version);
    setName(ver.ruleState.name);
    setDescription(ver.ruleState.description);
    setTriggerType(ver.ruleState.trigger.type);
    setTriggerConfig(ver.ruleState.trigger.config);
    setConditionGroup(ver.ruleState.conditionGroup);
    setActions(ver.ruleState.actions);
    alert(`Restored configurations from version ${ver.version} temporarily. Click Save to publish.`);
  };

  return (
    <div className="space-y-6" id="rule-builder-workspace">
      
      {/* Top action header bar */}
      <div className="flex items-center justify-between border-b border-[#D8D8D8] pb-5 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg border border-[#D8D8D8] hover:bg-gray-100 text-[#2F2F2F] transition-all cursor-pointer bg-white"
            title="Return to list"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="font-sans font-bold text-[#2F2F2F] text-lg tracking-tight">
              {initialRule ? `Modify Rule: ${name || "Unnamed Rule"}` : "Create AI Workflow Ruleset"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Configure real-time triggers, logic operators, and task automation actions.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Draft/Active toggle selectors */}
          <div className="flex bg-gray-100 border border-[#D8D8D8] rounded-lg p-0.5 shadow-inner">
            <button
              onClick={() => handleToggleDraft(true)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                isDraft
                  ? "bg-[#4E4E49] text-white"
                  : "text-[#666666] hover:text-[#2F2F2F]"
              }`}
              type="button"
            >
              Draft Mode
            </button>
            <button
              onClick={() => handleToggleDraft(false)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                !isDraft
                  ? "bg-[#4E4E49] text-white"
                  : "text-[#666666] hover:text-[#2F2F2F]"
              }`}
              type="button"
            >
              Publish Active
            </button>
          </div>

          <button
            onClick={handleLocalSave}
            className="px-4 py-2 bg-[#137333] hover:bg-[#0f5a27] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            id="rule-save-btn"
          >
            <Save size={14} />
            <span>Save Workflow</span>
          </button>
        </div>
      </div>

      {/* Main Grid: left builder core, right AI assistant / history info */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Core Composition Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Step-by-Step Navigation Tabs */}
          <div className="flex border-b border-[#D8D8D8] overflow-x-auto whitespace-nowrap">
            {[
              { id: "details", label: "1. Rule Details" },
              { id: "trigger", label: "2. Trigger Event" },
              { id: "conditions", label: "3. Logic Filters" },
              { id: "actions", label: "4. Pipeline Actions" },
              { id: "flow", label: "5. Visual Node Flow" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "border-[#4E4E49] text-[#2F2F2F] bg-[#E5E3E7]/25"
                    : "border-transparent text-gray-400 hover:text-[#2F2F2F] hover:border-[#D8D8D8]"
                }`}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Render Tab Contents */}
          <div className="bg-white p-6 rounded-xl border border-[#D8D8D8] shadow-xs min-h-[300px]">
            
            {/* TAB: General Details */}
            {activeTab === "details" && (
              <div className="space-y-5" id="rule-details-form">
                <div>
                  <h3 className="font-sans font-bold text-[#2F2F2F] text-sm mb-1">Define Basic Metadata</h3>
                  <p className="text-xs text-gray-400">Describe the rule's commercial objective so team members can understand its function.</p>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="builder-rule-name" className="text-xs font-semibold text-[#2F2F2F]">
                    Automation Rule Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="builder-rule-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Enterprise Welcome Sequence"
                    className="w-full text-xs px-3.5 py-2.5 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] focus:border-[#4E4E49] text-[#2F2F2F]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="builder-rule-desc" className="text-xs font-semibold text-[#2F2F2F]">
                    Commercial Description
                  </label>
                  <textarea
                    id="builder-rule-desc"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Automatically trigger customer setup emails and create onboarding tickets for any deal closed won with value > $30k..."
                    className="w-full text-xs px-3.5 py-2.5 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                  />
                </div>

                {!isDraft && (
                  <div className="flex items-center gap-3 bg-[#137333]/10 border border-[#137333]/20 p-4 rounded-xl">
                    <input
                      id="builder-rule-isactive"
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="h-4 w-4 rounded text-[#137333] border-[#D8D8D8] focus:ring-[#137333] cursor-pointer"
                    />
                    <div>
                      <label htmlFor="builder-rule-isactive" className="text-xs font-bold text-[#2F2F2F] cursor-pointer">
                        Instantly Activate Automation Upon Save
                      </label>
                      <p className="text-[10px] text-gray-500 mt-0.5">If unchecked, the rule remains published but paused on the background workers.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Trigger Configuration */}
            {activeTab === "trigger" && (
              <TriggerSelector
                selectedType={triggerType}
                config={triggerConfig}
                onChangeType={setTriggerType}
                onChangeConfig={setTriggerConfig}
              />
            )}

            {/* TAB: Logic Filters */}
            {activeTab === "conditions" && (
              <ConditionBuilder
                conditionGroup={conditionGroup}
                onChangeGroup={setConditionGroup}
              />
            )}

            {/* TAB: Sequence Actions */}
            {activeTab === "actions" && (
              <ActionBuilder
                actions={actions}
                onChangeActions={setActions}
              />
            )}

            {/* TAB: Visual Node Flow */}
            {activeTab === "flow" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans font-bold text-[#2F2F2F] text-sm">Visual Flow Graph</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Displays trigger matching, condition pathways, and sequentially enqueued actions.</p>
                </div>
                <NodeEditor
                  triggerType={triggerType}
                  conditionsCount={conditionGroup.conditions.length}
                  conditionsSummary={getConditionsSummary()}
                  actions={actions}
                />
              </div>
            )}

          </div>

          {/* Navigation Controls inside builder panel */}
          <div className="flex justify-between items-center bg-gray-50 border border-[#D8D8D8] rounded-xl p-4">
            <button
              onClick={() => {
                if (activeTab === "flow") setActiveTab("actions");
                else if (activeTab === "actions") setActiveTab("conditions");
                else if (activeTab === "conditions") setActiveTab("trigger");
                else if (activeTab === "trigger") setActiveTab("details");
              }}
              disabled={activeTab === "details"}
              className="px-4 py-2 border border-[#D8D8D8] bg-white rounded-lg text-xs font-semibold text-[#2F2F2F] hover:bg-gray-100 transition-all disabled:opacity-40 cursor-pointer"
              type="button"
            >
              Previous Step
            </button>
            <button
              onClick={() => {
                if (activeTab === "details") setActiveTab("trigger");
                else if (activeTab === "trigger") setActiveTab("conditions");
                else if (activeTab === "conditions") setActiveTab("actions");
                else if (activeTab === "actions") setActiveTab("flow");
              }}
              disabled={activeTab === "flow"}
              className="px-4 py-2 bg-[#4E4E49] hover:bg-black text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer"
              type="button"
            >
              Next Step
            </button>
          </div>

        </div>

        {/* Right Sidebar: AI Assist and Version Control (1 col) */}
        <div className="space-y-6">
          
          {/* AI Assist Module Panel */}
          <div className="bg-gradient-to-tr from-[#E5E3E7]/40 to-[#8CB9D7]/10 rounded-xl border border-[#D8D8D8] p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-[#4E4E49] text-white">
                <BrainCircuit size={15} />
              </div>
              <h4 className="font-sans font-bold text-xs text-[#2F2F2F] uppercase tracking-wider">Gemini Workflow Assist</h4>
            </div>

            <p className="text-[11px] text-[#666666] leading-relaxed">
              Use Gemini intelligence to analyze, optimize, detect redundancies, or summarize your workflow configurations before deploying.
            </p>

            <button
              onClick={triggerAISuggestions}
              disabled={aiOptimizing}
              className="w-full py-2 bg-white hover:bg-gray-50 border border-[#D8D8D8] text-[#2F2F2F] rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles size={12} className="text-[#8E44AD]" />
              <span>{aiOptimizing ? "Analyzing rule stack..." : "Get AI Rule Suggestions"}</span>
            </button>

            {aiSuggestion && (
              <div className="p-3 bg-white border border-purple-100 rounded-lg text-[11px] text-gray-700 leading-relaxed font-sans space-y-1">
                <p className="font-bold text-[#8E44AD] flex items-center gap-1">
                  <Sparkles size={11} /> Copilot Insight:
                </p>
                <p>{aiSuggestion}</p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
              <button
                onClick={() => alert("Duplicate Rule Check: No overlapping rules or duplicate triggers found on your workspace.")}
                className="text-[10px] text-left hover:text-[#2F2F2F] text-gray-500 font-bold flex items-center gap-1 cursor-pointer uppercase tracking-wider font-mono"
              >
                <span>🛡 AI Duplicate Detection</span>
              </button>
              <button
                onClick={() => alert(`AI Rule Summary:\nThis rule evaluates "${triggerType || "Lead Created"}" events under "${conditionGroup.logicalOperator}" logical operators on ${conditionGroup.conditions.length} conditions, triggering ${actions.length} consecutive action items.`)}
                className="text-[10px] text-left hover:text-[#2F2F2F] text-gray-500 font-bold flex items-center gap-1 cursor-pointer uppercase tracking-wider font-mono"
              >
                <span>📝 AI Automation Summary</span>
              </button>
            </div>
          </div>

          {/* Version History Panel */}
          <div className="bg-white rounded-xl border border-[#D8D8D8] p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <History size={15} className="text-gray-500" />
              <h4 className="font-sans font-bold text-xs text-[#2F2F2F] uppercase tracking-wider">Version History</h4>
            </div>

            {versions.length === 0 ? (
              <p className="text-[11px] text-gray-400 italic">No previous versions. This is initial version 1.0.</p>
            ) : (
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {versions.map((ver) => (
                  <div
                    key={ver.version}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedVersion === ver.version
                        ? "bg-purple-50 border-purple-200"
                        : "bg-gray-50/50 border-[#D8D8D8]/60 hover:bg-gray-150"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-[10px] font-bold text-[#2F2F2F]">
                        Version v{ver.version}.0
                      </span>
                      <span className="text-[9px] text-gray-400">
                        {new Date(ver.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      {ver.changeSummary}
                    </p>
                    <button
                      onClick={() => handleRollback(ver)}
                      className="mt-2 text-[10px] font-bold text-[#8E44AD] hover:underline flex items-center gap-0.5 cursor-pointer"
                      type="button"
                    >
                      <span>Rollback draft here</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
