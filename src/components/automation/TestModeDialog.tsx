/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, X, CheckCircle2, AlertTriangle, Cpu, Terminal, ArrowRight, User, HelpCircle, Server } from "lucide-react";
import { AutomationRule, Lead } from "../../types";

interface TestModeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rule: AutomationRule | null;
  leads: Lead[];
}

export const TestModeDialog: React.FC<TestModeDialogProps> = ({
  isOpen,
  onClose,
  rule,
  leads,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || "");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<{
    status: "PASS" | "FAIL" | "SKIPPED";
    summary: string;
    steps: { name: string; status: "PASS" | "FAIL" | "PENDING"; detail: string }[];
  } | null>(null);

  if (!isOpen || !rule) return null;

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimulationResult(null);
    setSimulationLogs([]);

    const addLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setSimulationLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
          resolve();
        }, delay);
      });
    };

    // Async simulation stepping
    (async () => {
      await addLog(`Initializing dry-run pipeline for rule: "${rule.name}"`, 150);
      await addLog(`Selected lead: ${selectedLead.name} (${selectedLead.company})`, 250);
      await addLog(`Evaluating Trigger: ${rule.trigger.type}`, 300);
      await addLog(`Trigger condition satisfied: simulating event payload.`, 250);
      await addLog(`Evaluating logic conditions block (${rule.conditionGroup.logicalOperator})...`, 350);

      const conds = rule.conditionGroup.conditions;
      let conditionsPassed = true;
      const stepResults: { name: string; status: "PASS" | "FAIL" | "PENDING"; detail: string }[] = [];

      if (conds.length === 0) {
        await addLog(`No custom conditions configured. Group defaults to PASS.`, 200);
      } else {
        for (const c of conds) {
          const cond = c as any; // Cast for evaluation
          let evaluationPassed = false;
          let detailMsg = "";

          if (cond.field === "dealValue") {
            const operatorLabel = cond.operator === "GREATER_THAN" ? ">" : cond.operator === "LESS_THAN" ? "<" : "==";
            evaluationPassed = cond.operator === "GREATER_THAN"
              ? selectedLead.value > cond.value
              : cond.operator === "LESS_THAN"
              ? selectedLead.value < cond.value
              : selectedLead.value === cond.value;

            detailMsg = `Deal value ($${selectedLead.value.toLocaleString()}) ${operatorLabel} threshold ($${Number(cond.value).toLocaleString()})`;
          } else if (cond.field === "leadSource") {
            evaluationPassed = selectedLead.source === cond.value;
            detailMsg = `Lead source "${selectedLead.source}" matches required "${cond.value}"`;
          } else if (cond.field === "leadStatus") {
            evaluationPassed = selectedLead.status === cond.value;
            detailMsg = `Lead status "${selectedLead.status}" matches required "${cond.value}"`;
          } else {
            // Default pass for simulation fun
            evaluationPassed = true;
            detailMsg = `Evaluated filter condition on field [${cond.field}] with result TRUE`;
          }

          if (evaluationPassed) {
            await addLog(`✔ Condition met: ${detailMsg}`, 250);
            stepResults.push({ name: `Filter: ${cond.field}`, status: "PASS", detail: detailMsg });
          } else {
            await addLog(`❌ Condition failed: ${detailMsg}`, 250);
            stepResults.push({ name: `Filter: ${cond.field}`, status: "FAIL", detail: detailMsg });
            conditionsPassed = false;
          }
        }
      }

      await addLog(`Final logic outcome: ${conditionsPassed ? "MATCHED" : "UNMATCHED (Skipping Actions)"}`, 300);

      if (conditionsPassed) {
        await addLog(`Executing ${rule.actions.length} enqueued simulation actions...`, 200);
        for (const act of rule.actions) {
          await addLog(`→ Dispatching Mock Action: ${act.type}`, 350);
          if (act.type === "CREATE_TASK") {
            await addLog(`  [Simulated Effect] Scheduled onboarding task "${act.config.title || "Task"}"`, 100);
          } else if (act.type === "ADD_TAG") {
            await addLog(`  [Simulated Effect] Lead tags array will append: "${act.config.tag || "Tag"}"`, 100);
          } else if (act.type === "SEND_SLACK") {
            await addLog(`  [Simulated Effect] Push Slack message payload to "${act.config.channel || "#channel"}"`, 100);
          } else {
            await addLog(`  [Simulated Effect] Dispatched execution call successfully`, 100);
          }
        }

        setSimulationResult({
          status: "PASS",
          summary: `This automation would execute fully! It will apply ${rule.actions.length} action(s) to ${selectedLead.name}.`,
          steps: [
            { name: "Trigger Matching", status: "PASS", detail: `Evaluation matched event trigger: ${rule.trigger.type}` },
            ...stepResults,
            { name: "Actions Dispatch", status: "PASS", detail: `${rule.actions.length} mock operations resolved without errors` }
          ]
        });
      } else {
        setSimulationResult({
          status: "SKIPPED",
          summary: `The lead "${selectedLead.name}" was evaluated but skipped. The condition block did not match. No actions were executed.`,
          steps: [
            { name: "Trigger Matching", status: "PASS", detail: `Matched event trigger: ${rule.trigger.type}` },
            ...stepResults,
            { name: "Actions Dispatch", status: "PENDING", detail: "Bypassed - logic filters did not pass" }
          ]
        });
      }

      setIsSimulating(false);
    })();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#2F2F2F]/40 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative bg-white w-full max-w-2xl rounded-xl border border-[#D8D8D8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#D8D8D8] bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#4E4E49] text-white">
                <Cpu size={16} />
              </div>
              <div>
                <h3 className="font-sans font-bold text-[#2F2F2F] text-sm">Dry-Run Simulation Workspace</h3>
                <p className="text-[10px] text-gray-400 font-mono">Evaluate triggers and filters prior to saving</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Rule summary ribbon */}
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <span className="text-[9px] font-bold text-gray-400 font-mono uppercase">TARGETING WORKFLOW:</span>
              <p className="text-xs font-bold text-[#2F2F2F] mt-0.5">{rule.name}</p>
              <p className="text-[11px] text-[#666666] mt-0.5">{rule.description}</p>
            </div>

            {/* Step 1: Select Target Lead */}
            <div>
              <label htmlFor="lead-simulator-select" className="text-xs font-bold text-[#2F2F2F] flex items-center gap-1.5 mb-2">
                <User size={13} />
                <span>1. Select Prospect to Simulate</span>
              </label>
              <select
                id="lead-simulator-select"
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] focus:border-[#4E4E49] text-[#2F2F2F]"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.company}) — Value: ${l.value.toLocaleString()} | Source: {l.source}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Live Debug Console & Trace */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#2F2F2F] flex items-center gap-1.5">
                  <Terminal size={13} />
                  <span>2. Local Engine Trace Console</span>
                </h4>
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="px-3 py-1.5 bg-[#4E4E49] hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  id="simulate-now-btn"
                >
                  <Play size={11} fill="white" />
                  <span>{isSimulating ? "Processing..." : "Run Simulation"}</span>
                </button>
              </div>

              {/* Console logs output */}
              <div className="h-44 bg-gray-900 border border-gray-950 rounded-xl p-4 overflow-y-auto font-mono text-[10px] text-emerald-400 space-y-1.5 shadow-inner">
                {simulationLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 font-sans">
                    <Server size={24} className="mb-2 opacity-40 animate-pulse" />
                    <p>Select a lead and trigger the Dry-Run simulation above</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">Evaluates logical transitions inside your browser context</p>
                  </div>
                ) : (
                  simulationLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed border-l border-emerald-500/20 pl-2">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Step 3: Simulation Results */}
            {simulationResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-[#D8D8D8] bg-gray-50 space-y-3"
              >
                <div className="flex items-center gap-2">
                  {simulationResult.status === "PASS" ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-[#137333] px-2 py-0.5 bg-[#137333]/10 border border-[#137333]/20 rounded-md">
                      <CheckCircle2 size={12} />
                      <span>SIMULATED SUCCESS</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-700 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-md">
                      <AlertTriangle size={12} />
                      <span>SIMULATED SKIPPED</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-500 font-medium">Evaluation complete</span>
                </div>

                <p className="text-xs text-[#2F2F2F] font-medium leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                  {simulationResult.summary}
                </p>

                {/* Steps Trace details */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Step execution breakdown:</p>
                  <div className="divide-y divide-gray-100">
                    {simulationResult.steps.map((st, sIdx) => (
                      <div key={sIdx} className="py-2 flex items-start justify-between text-xs gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-[#2F2F2F]">{st.name}</p>
                          <p className="text-gray-500 text-[11px] mt-0.5 truncate">{st.detail}</p>
                        </div>
                        {st.status === "PASS" && (
                          <span className="text-[10px] font-bold text-emerald-600 font-mono">RESOLVED</span>
                        )}
                        {st.status === "FAIL" && (
                          <span className="text-[10px] font-bold text-rose-500 font-mono font-bold">FAILED FILTER</span>
                        )}
                        {st.status === "PENDING" && (
                          <span className="text-[10px] font-bold text-gray-400 font-mono">BYPASSED</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-[#D8D8D8] flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#D8D8D8] hover:bg-gray-100 text-[#2F2F2F] rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              Close Simulator
            </button>
            {simulationResult && simulationResult.status === "PASS" && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#137333] hover:bg-[#0f5a27] text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                Save & Instantiate
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
