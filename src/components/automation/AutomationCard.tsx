/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Zap, Play, Edit2, Calendar, FileText, Trash2, ShieldCheck, History } from "lucide-react";
import { AutomationRule } from "../../types";

interface AutomationCardProps {
  rule: AutomationRule;
  onToggleActive: (id: string) => void;
  onEdit: (rule: AutomationRule) => void;
  onDelete: (id: string) => void;
  onSimulate: (rule: AutomationRule) => void;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({
  rule,
  onToggleActive,
  onEdit,
  onDelete,
  onSimulate,
}) => {
  const triggerLabel = rule.trigger.type.replace(/_/g, " ");
  const actionsCount = rule.actions.length;

  return (
    <div
      className="bg-white rounded-xl border border-[#D8D8D8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
      id={`rule-card-${rule.id}`}
    >
      <div className="p-6">
        {/* Header - Title, Active status toggle */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {rule.isDraft ? (
                <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                  DRAFT
                </span>
              ) : rule.isActive ? (
                <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md bg-[#137333]/10 text-[#137333] border border-[#137333]/20">
                  ACTIVE
                </span>
              ) : (
                <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                  PAUSED
                </span>
              )}
              <span className="text-[10px] font-mono text-gray-400 font-medium">
                v{rule.version}.0
              </span>
            </div>
            <h3 className="font-sans font-bold text-[#2F2F2F] text-base tracking-tight hover:text-black transition-colors leading-tight">
              {rule.name}
            </h3>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center">
            <button
              onClick={() => onToggleActive(rule.id)}
              disabled={rule.isDraft}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                rule.isActive ? "bg-[#4E4E49]" : "bg-gray-200"
              } ${rule.isDraft ? "opacity-50 cursor-not-allowed" : ""}`}
              role="switch"
              aria-checked={rule.isActive}
              title={rule.isDraft ? "Draft rules cannot be enabled" : rule.isActive ? "Pause automation" : "Enable automation"}
              id={`toggle-btn-${rule.id}`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  rule.isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#666666] leading-relaxed mb-4 line-clamp-2">
          {rule.description || "No custom description provided."}
        </p>

        {/* Technical flow preview */}
        <div className="space-y-2.5">
          {/* Trigger preview */}
          <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            <div className="p-1 rounded-md bg-[#4E4E49]/10 text-[#4E4E49]">
              <Zap size={13} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-[#666666] uppercase tracking-wider leading-none mb-0.5">TRIGGER WHEN</p>
              <p className="text-[11px] font-mono text-[#2F2F2F] font-semibold truncate leading-tight uppercase">
                {triggerLabel}
              </p>
            </div>
          </div>

          {/* Actions summary */}
          <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            <div className="p-1 rounded-md bg-[#137333]/10 text-[#137333]">
              <Play size={13} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold text-[#666666] uppercase tracking-wider leading-none mb-0.5">ACTIONS ENQUEUED</p>
              <p className="text-[11px] font-sans text-[#2F2F2F] font-medium leading-tight truncate">
                {actionsCount === 0 ? (
                  <span className="text-rose-500 font-semibold">No actions configured</span>
                ) : actionsCount === 1 ? (
                  rule.actions[0].type.replace(/_/g, " ")
                ) : (
                  `${actionsCount} actions (${rule.actions.map(a => a.type.replace(/_/g, " ")).join(", ")})`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-[#D8D8D8]/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-[#666666] font-mono">
          <Calendar size={12} />
          <span>Updated {new Date(rule.updatedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulation */}
          <button
            onClick={() => onSimulate(rule)}
            className="p-1.5 rounded-lg border border-[#D8D8D8] bg-white text-[#2F2F2F] hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-medium"
            title="Simulate this rule with mock lead"
            id={`simulate-btn-${rule.id}`}
          >
            <Play size={11} className="text-[#137333]" />
            <span>Simulate</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(rule)}
            className="p-1.5 rounded-lg border border-[#D8D8D8] bg-white text-[#2F2F2F] hover:bg-gray-100 transition-all cursor-pointer flex items-center justify-center"
            title="Modify workflow rules"
            id={`edit-btn-${rule.id}`}
          >
            <Edit2 size={12} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(rule.id)}
            className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer flex items-center justify-center"
            title="Remove rule"
            id={`delete-btn-${rule.id}`}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
