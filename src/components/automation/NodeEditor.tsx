/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Zap, HelpCircle, ArrowDown, ZoomIn, ZoomOut, Maximize2, AlertTriangle, Play, HelpCircle as HelpIcon, Sparkles } from "lucide-react";
import { AutomationTriggerType, AutomationActionType, AutomationConditionField } from "../../types";

interface NodeEditorProps {
  triggerType: AutomationTriggerType | "";
  conditionsCount: number;
  conditionsSummary: string[];
  actions: { type: AutomationActionType; id: string }[];
}

export const NodeEditor: React.FC<NodeEditorProps> = ({
  triggerType,
  conditionsCount,
  conditionsSummary,
  actions,
}) => {
  const [zoomScale, setZoomScale] = useState(1);

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.1, 0.6));
  const handleResetZoom = () => setZoomScale(1);

  // Logical Validation Flags
  const warnings: { id: string; message: string; type: "error" | "warning" }[] = [];

  if (!triggerType) {
    warnings.push({ id: "v-1", message: "No Trigger Selected: Workflow will never execute.", type: "error" });
  }

  if (actions.length === 0) {
    warnings.push({ id: "v-2", message: "No Action Defined: Trigger matches will yield no effects.", type: "error" });
  }

  // Circular Logic Check
  // E.g. Status Changed trigger matching a Stage move action
  const hasStatusChangedTrigger = triggerType === AutomationTriggerType.STATUS_CHANGED;
  const hasMoveStageAction = actions.some((act) => act.type === AutomationActionType.MOVE_PIPELINE_STAGE);
  if (hasStatusChangedTrigger && hasMoveStageAction) {
    warnings.push({
      id: "v-3",
      message: "Potential Circular Logic: Workflow triggers on Status Change and contains a Move Stage action, which can trigger itself recursively.",
      type: "warning"
    });
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-[#D8D8D8] shadow-inner overflow-hidden relative min-h-[500px]" id="node-editor-canvas">
      
      {/* Top Controls Toolbar: Zoom + validation alert bar */}
      <div className="absolute top-4 left-4 z-10 bg-white border border-[#D8D8D8] rounded-lg shadow-sm p-1.5 flex items-center gap-2">
        <button
          onClick={handleZoomIn}
          className="p-1 rounded-md text-[#666666] hover:text-[#2F2F2F] hover:bg-gray-100 transition-all cursor-pointer"
          title="Zoom In"
          type="button"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1 rounded-md text-[#666666] hover:text-[#2F2F2F] hover:bg-gray-100 transition-all cursor-pointer"
          title="Zoom Out"
          type="button"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-1 rounded-md text-[#666666] hover:text-[#2F2F2F] hover:bg-gray-100 transition-all cursor-pointer"
          title="Reset Zoom"
          type="button"
        >
          <Maximize2 size={13} />
        </button>
        <div className="h-4 w-[1px] bg-[#D8D8D8] mx-0.5" />
        <span className="text-[10px] font-mono text-[#666666] px-1 font-bold">
          {Math.round(zoomScale * 100)}%
        </span>
      </div>

      {/* Floating Rules Validation box */}
      <div className="absolute top-4 right-4 z-10 max-w-sm space-y-2">
        {warnings.map((w) => (
          <div
            key={w.id}
            className={`p-3 rounded-lg border flex items-start gap-2.5 shadow-sm text-xs transition-all animate-fade-in ${
              w.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            <AlertTriangle className="shrink-0 mt-0.5" size={14} />
            <div>
              <p className="font-bold leading-none uppercase text-[9px] tracking-wider mb-0.5">
                {w.type === "error" ? "Rule Validation Error" : "Optimization Warning"}
              </p>
              <p className="leading-snug text-[11px] font-medium">{w.message}</p>
            </div>
          </div>
        ))}

        {warnings.length === 0 && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg flex items-center gap-2 shadow-sm text-[11px] font-medium">
            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span>Workflow validated successfully: ready to compile</span>
          </div>
        )}
      </div>

      {/* MiniMap Placeholder */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-xs border border-[#D8D8D8] rounded-xl p-3.5 shadow-md w-36 h-28 flex flex-col justify-between select-none">
        <p className="text-[9px] font-bold text-gray-400 font-mono tracking-widest uppercase">MINI MAP</p>
        <div className="flex-1 bg-gray-100 rounded-md border border-gray-200 mt-1.5 p-1 relative flex flex-col items-center justify-around">
          {/* Mock miniatures */}
          <div className="w-8 h-2.5 bg-purple-200 rounded-[2px]" />
          <div className="w-10 h-2.5 bg-blue-200 rounded-[2px]" />
          <div className="w-8 h-2.5 bg-emerald-200 rounded-[2px]" />
        </div>
        <span className="text-[8px] text-gray-400 text-center mt-1 block">Visual Canvas View</span>
      </div>

      {/* Interactive Node Flow Tree with zoom scale */}
      <div
        className="flex flex-col items-center justify-center p-12 transition-transform duration-200 ease-out origin-center"
        style={{ transform: `scale(${zoomScale})` }}
      >
        
        {/* Node 1: Event Trigger */}
        <div className="w-72 bg-white rounded-xl border border-[#D8D8D8] shadow-sm overflow-hidden flex flex-col hover:border-purple-400 transition-colors">
          <div className="px-4 py-2.5 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between text-[#8E44AD]">
            <div className="flex items-center gap-1.5">
              <Zap size={13} className="animate-pulse" />
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Trigger Node</span>
            </div>
            <span className="text-[9px] font-mono font-medium px-2 py-0.5 bg-purple-100 rounded-full uppercase text-[#8E44AD]">
              Input
            </span>
          </div>
          <div className="p-4 text-center">
            {triggerType ? (
              <>
                <p className="font-mono text-xs font-semibold text-[#2F2F2F] uppercase bg-gray-50 py-1 rounded">
                  {triggerType.replace(/_/g, " ")}
                </p>
                <p className="text-[11px] text-gray-400 mt-2">Active listener binds to system events stream</p>
              </>
            ) : (
              <p className="text-xs text-rose-500 font-bold italic">No event trigger configured</p>
            )}
          </div>
        </div>

        {/* Down Connection Arrow 1 */}
        <div className="flex flex-col items-center my-6">
          <div className="w-[2px] h-8 bg-gray-300" />
          <div className="p-1 rounded-full bg-white border border-[#D8D8D8] text-gray-400 -mt-2 shadow-xs">
            <ArrowDown size={12} />
          </div>
        </div>

        {/* Node 2: Logic Condition Gate */}
        <div className="w-72 bg-white rounded-xl border border-[#D8D8D8] shadow-sm overflow-hidden flex flex-col hover:border-blue-400 transition-colors">
          <div className="px-4 py-2.5 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between text-[#0A66C2]">
            <div className="flex items-center gap-1.5">
              <HelpCircle size={13} />
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Logic Filters Gate</span>
            </div>
            <span className="text-[9px] font-mono font-medium px-2 py-0.5 bg-blue-100 rounded-full uppercase text-[#0A66C2]">
              Filter
            </span>
          </div>
          <div className="p-4 text-center space-y-1.5">
            {conditionsCount === 0 ? (
              <>
                <p className="text-xs font-bold text-gray-400 italic">No constraints applied</p>
                <p className="text-[11px] text-[#666666]">Matches pass-through directly to actions block</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-xs text-[#2F2F2F]">
                  Evaluates {conditionsCount} criteria filters
                </p>
                <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto pr-0.5 pt-1">
                  {conditionsSummary.map((s, idx) => (
                    <span key={idx} className="text-[10px] text-[#666666] font-mono bg-gray-50 p-1 rounded block truncate border border-gray-100/40">
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Down Connection Arrow 2 */}
        <div className="flex flex-col items-center my-6">
          <div className="w-[2px] h-8 bg-gray-300" />
          <div className="p-1 rounded-full bg-white border border-[#D8D8D8] text-gray-400 -mt-2 shadow-xs">
            <ArrowDown size={12} />
          </div>
        </div>

        {/* Node 3: Executing Actions stack */}
        <div className="w-72 bg-white rounded-xl border border-[#D8D8D8] shadow-sm overflow-hidden flex flex-col hover:border-emerald-400 transition-colors">
          <div className="px-4 py-2.5 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between text-[#137333]">
            <div className="flex items-center gap-1.5">
              <Play size={13} />
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Actions Pipeline</span>
            </div>
            <span className="text-[9px] font-mono font-medium px-2 py-0.5 bg-emerald-100 rounded-full uppercase text-[#137333]">
              Output
            </span>
          </div>
          <div className="p-4 text-center space-y-2">
            {actions.length === 0 ? (
              <p className="text-xs text-rose-500 font-bold italic">No actions configured yet</p>
            ) : (
              <div className="space-y-1.5">
                {actions.map((act, idx) => (
                  <div key={act.id} className="flex items-center justify-between gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded text-[10px] font-mono font-semibold text-gray-700">
                    <span className="h-4 w-4 bg-[#137333] text-white rounded-full flex items-center justify-center font-mono text-[9px]">
                      {idx + 1}
                    </span>
                    <span className="truncate flex-1 text-left px-1">{act.type.replace(/_/g, " ")}</span>
                    <span className="text-[8px] text-emerald-600 uppercase font-bold tracking-wider shrink-0 bg-emerald-50 px-1 border border-emerald-100 rounded">OK</span>
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
