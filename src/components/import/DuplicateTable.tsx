/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AlertCircle, ArrowRight, HelpCircle, Check, Info, ShieldAlert, GitMerge, FileCheck } from "lucide-react";
import { ParsedRecord } from "../../types/import";
import { Lead } from "../../types";
import { generateMergePreview, MergedPreviewData } from "../../utils/importUtils";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface DuplicateTableProps {
  records: ParsedRecord[];
  existingLeads: Lead[];
  onDecisionChange: (index: number, decision: "import" | "skip" | "merge") => void;
}

export const DuplicateTable: React.FC<DuplicateTableProps> = ({
  records,
  existingLeads,
  onDecisionChange,
}) => {
  const [selectedMergeIndex, setSelectedMergeIndex] = useState<number | null>(null);

  const duplicates = records.filter((rec) => rec.isDuplicate);

  if (duplicates.length === 0) {
    return (
      <div className="p-10 border border-[#D8D8D8] rounded-2xl bg-emerald-50/10 text-center space-y-3" id="no-duplicates-panel">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-full inline-block">
          <FileCheck size={24} />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2F2F]">Zero Duplicates Detected</h4>
          <p className="text-[11px] text-gray-500 font-medium max-w-md mx-auto">
            Our pipeline scanner matched incoming names, domains, and phone coordinates against existing accounts. Every record is verified as completely unique and safe to register directly.
          </p>
        </div>
      </div>
    );
  }

  // Get matching existing lead details
  const getExistingLead = (leadId?: string): Lead | undefined => {
    return existingLeads.find((l) => l.id === leadId);
  };

  const getMatchIcon = (field?: string) => {
    switch (field) {
      case "email":
        return "📧";
      case "phone":
        return "📞";
      case "website":
        return "🌐";
      case "company":
      default:
        return "🏢";
    }
  };

  const activeMergeRecord = selectedMergeIndex !== null ? records.find(r => r.index === selectedMergeIndex) : null;
  const activeMergeLead = activeMergeRecord ? getExistingLead(activeMergeRecord.duplicateLeadId) : null;
  const activeMergePreview: MergedPreviewData[] = activeMergeRecord && activeMergeLead
    ? generateMergePreview(activeMergeLead, activeMergeRecord.mappedData)
    : [];

  return (
    <div className="space-y-4 text-left" id="duplicate-table-container">
      {/* Informative alert strip */}
      <div className="p-4 bg-amber-50/60 border border-amber-200/50 rounded-xl flex items-start gap-3">
        <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2F2F]">
            Pipeline Collisions Identified ({duplicates.length} Matches)
          </h4>
          <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
            Synity identified records in this file that conflict with profiles already registered in your CRM. Choose how to handle each collision to keep pipeline metrics clean and secure.
          </p>
        </div>
      </div>

      {/* Duplicates list card */}
      <div className="border border-[#D8D8D8] rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-left">
            <thead>
              <tr className="bg-gray-50/70 border-b border-[#D8D8D8] text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3 w-16 text-center">Row</th>
                <th className="p-3">Import Record details</th>
                <th className="p-3">Matched Variable</th>
                <th className="p-3">Existing CRM Lead Target</th>
                <th className="p-3 text-center">Confidence</th>
                <th className="p-3">Collision Handshake Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {duplicates.map((rec) => {
                const existingLead = getExistingLead(rec.duplicateLeadId);
                const isSelectedMerge = rec.importDecision === "merge";

                return (
                  <tr key={rec.index} className="hover:bg-gray-50/20 transition-colors">
                    {/* Row Num */}
                    <td className="p-3.5 text-center font-mono font-bold text-gray-400 bg-gray-50/10">
                      {rec.index}
                    </td>

                    {/* Import Info */}
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <p className="font-bold text-[#2F2F2F]">{rec.mappedData.company}</p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {rec.mappedData.name || "Unknown"} • {rec.mappedData.email || "No email"}
                        </p>
                      </div>
                    </td>

                    {/* Conflict field */}
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-gray-100 text-[#2F2F2F] rounded-full border border-gray-200 flex items-center gap-1.5 w-fit">
                        <span>{getMatchIcon(rec.duplicateMatchField)}</span>
                        <span>{rec.duplicateMatchField}</span>
                      </span>
                    </td>

                    {/* Existing Lead Target */}
                    <td className="p-3.5">
                      {existingLead ? (
                        <div className="space-y-0.5 text-left border-l-2 border-[#8CB9D7] pl-2.5">
                          <p className="font-bold text-[#3b7194]">{existingLead.company}</p>
                          <p className="text-[10px] text-gray-500 font-semibold font-mono">
                            Registered: {new Date(existingLead.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unresolved profile</span>
                      )}
                    </td>

                    {/* Match Confidence */}
                    <td className="p-3.5 text-center">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          (rec.duplicateConfidence || 0) > 90
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}
                      >
                        {rec.duplicateConfidence}% Match
                      </span>
                    </td>

                    {/* Decisions Toggles */}
                    <td className="p-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Option 1: Skip */}
                        <button
                          type="button"
                          onClick={() => onDecisionChange(rec.index, "skip")}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                            rec.importDecision === "skip"
                              ? "bg-gray-100 border-[#D8D8D8] text-[#2F2F2F]"
                              : "bg-white border-gray-200 text-gray-500 hover:text-[#2F2F2F] hover:border-gray-300"
                          }`}
                        >
                          Skip
                        </button>

                        {/* Option 2: Merge */}
                        <button
                          type="button"
                          onClick={() => onDecisionChange(rec.index, "merge")}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                            isSelectedMerge
                              ? "bg-purple-500 border-purple-600 text-white shadow-xs"
                              : "bg-white border-gray-200 text-purple-600 hover:bg-purple-50/50 hover:border-purple-300"
                          }`}
                        >
                          <GitMerge size={11} />
                          Smart Merge
                        </button>

                        {/* Option 3: Import anyway */}
                        <button
                          type="button"
                          onClick={() => onDecisionChange(rec.index, "import")}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                            rec.importDecision === "import"
                              ? "bg-amber-500 border-amber-600 text-white shadow-xs"
                              : "bg-white border-gray-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300"
                          }`}
                        >
                          Import Anyway
                        </button>

                        {/* Live Merge Preview Trigger */}
                        {isSelectedMerge && (
                          <button
                            type="button"
                            onClick={() => setSelectedMergeIndex(rec.index)}
                            className="text-[10px] font-bold text-[#3b7194] hover:underline flex items-center gap-0.5 ml-1 select-none transition-all"
                          >
                            Preview Merge &gt;
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SMART MERGE LIVE PREVIEW DIALOG MODAL */}
      <Modal
        isOpen={selectedMergeIndex !== null}
        onClose={() => setSelectedMergeIndex(null)}
        title={
          <span className="flex items-center gap-2 text-purple-600">
            <GitMerge size={18} className="animate-pulse" />
            Smart Merge Configuration Hub
          </span>
        }
        size="lg"
      >
        <div className="space-y-4 text-left" id="merge-preview-modal-body">
          {activeMergeLead && activeMergeRecord && (
            <>
              {/* Profile Summary Context */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Existing Master Profile</span>
                  <p className="text-xs font-bold text-slate-800 leading-tight">{activeMergeLead.company}</p>
                  <p className="text-[10px] text-gray-500 font-medium">Contact: {activeMergeLead.name}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-purple-500 block">Incoming File Record</span>
                  <p className="text-xs font-bold text-purple-800 leading-tight">{activeMergeRecord.mappedData.company}</p>
                  <p className="text-[10px] text-gray-500 font-medium">Contact: {activeMergeRecord.mappedData.name || "Unknown"}</p>
                </div>
              </div>

              {/* Informative description */}
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                Synity prevents overwriting existing customer records silently. Fields already populated are safely locked, while empty values are automatically populated. High-risk fields (like Executive Notes) are combined side by side.
              </p>

              {/* Mapped values comparative table */}
              <div className="border border-[#D8D8D8] rounded-xl overflow-hidden bg-white max-h-[300px] overflow-y-auto">
                <table className="w-full border-collapse text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#D8D8D8] text-gray-500 font-bold uppercase text-[9px]">
                      <th className="p-3">CRM Field</th>
                      <th className="p-3 bg-gray-50/50">Master CRM value</th>
                      <th className="p-3">Imported File value</th>
                      <th className="p-3 bg-purple-50/20 text-purple-900">Handshake Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-600">
                    {activeMergePreview.map((f) => (
                      <tr key={f.fieldKey} className="hover:bg-gray-50/30 transition-colors">
                        <td className="p-3 font-bold text-gray-700">{f.label}</td>
                        <td className="p-3 bg-gray-50/20 font-mono text-[10px] truncate max-w-[150px]">
                          {f.currentValue || <em className="text-gray-300 font-normal">[Empty]</em>}
                        </td>
                        <td className="p-3 font-mono text-[10px] truncate max-w-[150px]">
                          {f.importedValue || <em className="text-gray-300 font-normal">[Empty]</em>}
                        </td>
                        <td className="p-3 bg-purple-50/10 font-mono text-[10px] text-purple-900 font-semibold truncate max-w-[200px]">
                          {f.mergedResult ? (
                            <span className="flex items-center gap-1">
                              <span className="text-purple-600">✓</span>
                              {f.mergedResult}
                            </span>
                          ) : (
                            <em className="text-gray-300 font-normal">[Empty]</em>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Controls */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedMergeIndex(null)}>
                  Close Preview
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setSelectedMergeIndex(null)}
                >
                  Confirm Merge Handshake
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
