/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Zap, Plus, Sparkles, AlertCircle, RefreshCw, BarChart2, History, Search } from "lucide-react";
import { AutomationCard } from "./AutomationCard";
import { AutomationTemplateCard } from "./AutomationTemplateCard";
import { AutomationHistory } from "./AutomationHistory";
import { AutomationAnalytics } from "./AutomationAnalytics";
import { RuleBuilder } from "./RuleBuilder";
import { TestModeDialog } from "./TestModeDialog";
import { BUILTIN_TEMPLATES, INITIAL_RULES, MOCK_HISTORY, MOCK_ANALYTICS } from "./automationMockData";
import { AutomationRule, AutomationTemplate, Lead, AutomationHistoryEntry } from "../../types";

interface AutomationViewProps {
  leads: Lead[];
}

export const AutomationView: React.FC<AutomationViewProps> = ({ leads }) => {
  // Navigation tabs for module sections
  const [activeSection, setActiveSection] = useState<"active" | "draft" | "templates" | "history" | "analytics">("active");

  // Core automation state lists
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [history, setHistory] = useState<AutomationHistoryEntry[]>(MOCK_HISTORY);
  const [analytics, setAnalytics] = useState(MOCK_ANALYTICS);

  // Layout Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Search keyword for rules
  const [searchQuery, setSearchQuery] = useState("");

  // Rule Composer state
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Simulation state
  const [simulatingRule, setSimulatingRule] = useState<AutomationRule | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Trigger simulated loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeSection]);

  // Handle Retry State UI
  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // State actions
  const handleToggleRuleActive = (id: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextActiveState = !r.isActive;
          // Record history of toggle
          const log: AutomationHistoryEntry = {
            id: `h-toggle-${Date.now()}`,
            ruleId: r.id,
            ruleName: r.name,
            executionTime: new Date().toISOString(),
            status: "SUCCESS",
            durationMs: 42,
            result: `Workflow was manually ${nextActiveState ? "activated" : "paused"} by Alex Rivers.`
          };
          setHistory((prevH) => [log, ...prevH]);
          return { ...r, isActive: nextActiveState };
        }
        return r;
      })
    );
  };

  const handleDeleteRule = (id: string) => {
    const ruleToDelete = rules.find((r) => r.id === id);
    if (!ruleToDelete) return;

    if (confirm(`Are you sure you want to delete the automation "${ruleToDelete.name}"?`)) {
      setRules((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Triggered when clicking "Simulate" on card
  const handleOpenSimulation = (rule: AutomationRule) => {
    setSimulatingRule(rule);
    setIsSimulatorOpen(true);
  };

  // Clicked to edit a rule
  const handleOpenEdit = (rule: AutomationRule) => {
    setEditingRule(rule);
    setIsComposerOpen(true);
  };

  // Clicked to create a new blank rule
  const handleOpenCreateNew = () => {
    setEditingRule(null);
    setIsComposerOpen(true);
  };

  // Prepopulate form using a template
  const handleUseTemplate = (template: AutomationTemplate) => {
    const newRuleFromTemplate: AutomationRule = {
      id: `rule-temp-${Date.now()}`,
      name: template.name,
      description: template.description,
      isActive: false,
      isDraft: true,
      trigger: template.trigger,
      conditionGroup: template.conditionGroup,
      actions: template.actions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      versions: []
    };

    setEditingRule(newRuleFromTemplate);
    setIsComposerOpen(true);
  };

  // Save rule from RuleBuilder
  const handleSaveCompiledRule = (newRule: AutomationRule) => {
    setRules((prev) => {
      const exists = prev.some((r) => r.id === newRule.id);
      if (exists) {
        return prev.map((r) => (r.id === newRule.id ? newRule : r));
      } else {
        return [newRule, ...prev];
      }
    });

    setIsComposerOpen(false);
    setEditingRule(null);

    // Track statistics update
    setAnalytics((prev) => ({
      ...prev,
      totalRuns: prev.totalRuns + 1
    }));
  };

  // Re-trigger execution from logs
  const handleReTriggerLogEntry = (entry: AutomationHistoryEntry) => {
    const associatedRule = rules.find((r) => r.id === entry.ruleId);
    
    const reLog: AutomationHistoryEntry = {
      id: `h-re-${Date.now()}`,
      ruleId: entry.ruleId,
      ruleName: entry.ruleName,
      executionTime: new Date().toISOString(),
      leadId: entry.leadId,
      leadName: entry.leadName,
      status: "SUCCESS",
      durationMs: 235,
      result: `Manually re-triggered execution of rule "${entry.ruleName}" successfully.`
    };

    setHistory((prev) => [reLog, ...prev]);

    setAnalytics((prev) => ({
      ...prev,
      totalRuns: prev.totalRuns + 1,
      successfulRuns: prev.successfulRuns + 1
    }));

    alert(`Successfully re-triggered workflow rule: "${entry.ruleName}" for lead: ${entry.leadName || "system"}`);
  };

  // Filters rules based on active tab & query search
  const displayedRules = rules.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeSection === "active") {
      return !r.isDraft && matchesSearch;
    } else if (activeSection === "draft") {
      return r.isDraft && matchesSearch;
    }
    return matchesSearch;
  });

  const activeCount = rules.filter((r) => !r.isDraft).length;
  const draftCount = rules.filter((r) => r.isDraft).length;

  if (hasError) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="p-4 bg-red-50 text-red-600 rounded-full mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="font-sans font-bold text-[#2F2F2F] text-lg">Failed to initialize rule engine</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          The local server timed out while establishing socket connection with background rule runners.
        </p>
        <button
          onClick={handleReload}
          className="mt-6 px-4 py-2 bg-[#4E4E49] hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Retry Handshake</span>
        </button>
      </div>
    );
  }

  // Active workspace with composer active
  if (isComposerOpen) {
    return (
      <RuleBuilder
        initialRule={editingRule}
        onSave={handleSaveCompiledRule}
        onCancel={() => setIsComposerOpen(false)}
      />
    );
  }

  return (
    <div className="space-y-6" id="automation-workspace-view">
      
      {/* 1. Header block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D8D8D8] pb-5">
        <div>
          <h1 className="font-sans font-bold text-[#2F2F2F] text-2xl tracking-tight flex items-center gap-2">
            <Zap size={24} className="text-[#8E44AD]" />
            <span>AI Automation & Workflow Rules</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Configure intelligent triggers, lead distribution conditions, and automatic communications.</p>
        </div>

        {/* Create new automation button */}
        <button
          onClick={handleOpenCreateNew}
          className="px-4 py-2 bg-[#4E4E49] hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          id="create-automation-btn"
        >
          <Plus size={15} />
          <span>Create Automation</span>
        </button>
      </div>

      {/* 2. Executive Quick Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-4.5 rounded-xl border border-[#D8D8D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Active Rules</p>
            <p className="text-2xl font-bold text-[#2F2F2F] tracking-tight mt-0.5">{activeCount}</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold">WORKERS LIVE</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-[#D8D8D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Draft Rules</p>
            <p className="text-2xl font-bold text-[#2F2F2F] tracking-tight mt-0.5">{draftCount}</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-700 font-bold">COMPILING</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-[#D8D8D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Total Executions</p>
            <p className="text-2xl font-bold text-[#2F2F2F] tracking-tight mt-0.5">{analytics.totalRuns}</p>
          </div>
          <span className="text-[10px] font-mono text-gray-400">Lifetime</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-[#D8D8D8] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Success Ratio</p>
            <p className="text-2xl font-bold text-[#137333] tracking-tight mt-0.5">
              {((analytics.successfulRuns / analytics.totalRuns) * 100).toFixed(1)}%
            </p>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">PRISTINE</span>
        </div>
      </div>

      {/* 3. Section Tabs */}
      <div className="flex border-b border-[#D8D8D8] overflow-x-auto whitespace-nowrap">
        {[
          { id: "active", label: "Active Automations", count: activeCount },
          { id: "draft", label: "Draft Rules", count: draftCount },
          { id: "templates", label: "Workflow Templates" },
          { id: "history", label: "Execution History", icon: <History size={13} /> },
          { id: "analytics", label: "Performance Analytics", icon: <BarChart2 size={13} /> },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id as any)}
            className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === sec.id
                ? "border-[#4E4E49] text-[#2F2F2F] bg-[#E5E3E7]/20"
                : "border-transparent text-gray-400 hover:text-[#2F2F2F] hover:border-[#D8D8D8]"
            }`}
            type="button"
          >
            {sec.icon}
            <span>{sec.label}</span>
            {sec.count !== undefined && (
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                activeSection === sec.id ? "bg-[#4E4E49] text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {sec.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 4. Filter bar for active list view */}
      {["active", "draft"].includes(activeSection) && (
        <div className="relative max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search matching rules..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
            aria-label="Filter rules list"
          />
        </div>
      )}

      {/* 5. Main Canvas / Rendering Tab Content */}
      <div className="min-h-[350px]">
        {isLoading ? (
          /* Skeletal loading states as requested */
          <div className="space-y-4" id="automation-skeleton-loading">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl border border-[#D8D8D8] p-6 space-y-4 shadow-xs animate-pulse">
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 rounded-md w-12" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="space-y-2 pt-2">
                    <div className="h-10 bg-gray-200 rounded-lg" />
                    <div className="h-10 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Active & Draft Rules */}
            {["active", "draft"].includes(activeSection) && (
              displayedRules.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-[#D8D8D8] shadow-xs p-6 max-w-xl mx-auto flex flex-col items-center justify-center">
                  <Zap size={32} className="text-gray-400 opacity-40 mb-3" />
                  <p className="font-semibold text-[#2F2F2F] text-base">No automation rules configured</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
                    Create clean triggers to automatically transition pipeline leads, schedule calls, dispatch reminders, and automate workflow routes.
                  </p>
                  <button
                    onClick={handleOpenCreateNew}
                    className="mt-4 px-3.5 py-2 bg-[#4E4E49] hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Create Initial Rule
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayedRules.map((rule) => (
                    <AutomationCard
                      key={rule.id}
                      rule={rule}
                      onToggleActive={handleToggleRuleActive}
                      onEdit={handleOpenEdit}
                      onDelete={handleDeleteRule}
                      onSimulate={handleOpenSimulation}
                    />
                  ))}
                </div>
              )
            )}

            {/* Built-in Templates */}
            {activeSection === "templates" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {BUILTIN_TEMPLATES.map((temp) => (
                  <AutomationTemplateCard
                    key={temp.id}
                    template={temp}
                    onUseTemplate={handleUseTemplate}
                  />
                ))}
              </div>
            )}

            {/* Execution history table */}
            {activeSection === "history" && (
              <AutomationHistory
                history={history}
                onReTrigger={handleReTriggerLogEntry}
              />
            )}

            {/* Recharts Analytics dashboard */}
            {activeSection === "analytics" && (
              <AutomationAnalytics analytics={analytics} />
            )}
          </div>
        )}
      </div>

      {/* Global dry-run test mode simulator overlay */}
      <TestModeDialog
        isOpen={isSimulatorOpen}
        onClose={() => {
          setIsSimulatorOpen(false);
          setSimulatingRule(null);
        }}
        rule={simulatingRule}
        leads={leads}
      />

    </div>
  );
};
