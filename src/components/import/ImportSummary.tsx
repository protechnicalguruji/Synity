/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CheckCircle2, TrendingUp, AlertTriangle, AlertCircle, RefreshCw, Calendar, Clock, Sparkles } from "lucide-react";
import { ImportHistoryItem } from "../../types/import";
import { Button } from "../ui/Button";

interface ImportSummaryProps {
  summary: ImportHistoryItem;
  onDone: () => void;
  onReset: () => void;
}

export const ImportSummary: React.FC<ImportSummaryProps> = ({ summary, onDone, onReset }) => {
  const getSuccessRate = () => {
    if (summary.totalRecords === 0) return 100;
    return Math.round((summary.importedCount / summary.totalRecords) * 100);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto" id="import-summary-container">
      {/* Visual Header Success state */}
      <div className="p-8 border border-emerald-100 rounded-2xl bg-gradient-to-tr from-emerald-50/10 to-emerald-50/20 text-center space-y-3">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full inline-block">
          <CheckCircle2 size={32} className="animate-bounce" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-display font-bold text-[#2F2F2F]">Lead Pipeline Calibrated Successfully</h3>
          <p className="text-xs text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
            The background transaction has completed without errors. {summary.importedCount} new leads have been added to Synity CRM and assigned follow-up cron tracks.
          </p>
        </div>
      </div>

      {/* Metrics bento-style list */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1: Total */}
        <div className="p-4 bg-white border border-[#D8D8D8] rounded-xl text-left space-y-1 shadow-2xs">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Scanned</span>
          <p className="text-xl font-bold text-[#2F2F2F] font-mono">{summary.totalRecords}</p>
          <span className="text-[9px] text-gray-400 font-medium font-mono">Input file rows</span>
        </div>

        {/* Metric 2: Imported */}
        <div className="p-4 bg-white border border-emerald-100 rounded-xl text-left space-y-1 shadow-2xs">
          <span className="text-[10px] text-gray-400 font-bold uppercase block text-emerald-600">Committed</span>
          <p className="text-xl font-bold text-emerald-600 font-mono">+{summary.importedCount}</p>
          <span className="text-[9px] text-emerald-500 font-medium font-mono">{getSuccessRate()}% import rate</span>
        </div>

        {/* Metric 3: Duplicates */}
        <div className="p-4 bg-white border border-amber-100 rounded-xl text-left space-y-1 shadow-2xs">
          <span className="text-[10px] text-gray-400 font-bold uppercase block text-amber-600">Skipped/Merged</span>
          <p className="text-xl font-bold text-amber-500 font-mono">
            {summary.skippedCount + summary.duplicateCount}
          </p>
          <span className="text-[9px] text-amber-400 font-medium font-mono">Collisions prevented</span>
        </div>

        {/* Metric 4: Efficiency speed */}
        <div className="p-4 bg-white border border-[#D8D8D8] rounded-xl text-left space-y-1 shadow-2xs">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Speed</span>
          <p className="text-xl font-bold text-[#2F2F2F] font-mono">
            {(summary.processingTimeMs / 1000).toFixed(2)}s
          </p>
          <span className="text-[9px] text-gray-400 font-medium font-mono">Batch processed</span>
        </div>
      </div>

      {/* Detail Breakdown details */}
      <div className="bg-white border border-[#D8D8D8] rounded-xl p-5 text-left space-y-4 shadow-2xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Operational Audits</h4>
        
        <div className="divide-y divide-gray-100 text-xs font-medium text-gray-600">
          {/* Item 1: Filename */}
          <div className="py-2.5 flex justify-between items-center gap-4">
            <span className="text-gray-400">Target File Name</span>
            <span className="font-bold text-[#2F2F2F] font-mono truncate">{summary.fileName}</span>
          </div>

          {/* Item 2: Format */}
          <div className="py-2.5 flex justify-between items-center gap-4">
            <span className="text-gray-400">File Type</span>
            <span className="font-bold uppercase text-[#2F2F2F] font-mono bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-sm">
              {summary.fileType}
            </span>
          </div>

          {/* Item 3: Format */}
          <div className="py-2.5 flex justify-between items-center gap-4">
            <span className="text-gray-400">Validation Failures Filtered</span>
            <span className="font-bold text-red-600 font-mono">{summary.errorCount} Errors</span>
          </div>

          {/* Item 4: Assigned daily preference */}
          <div className="py-2.5 flex justify-between items-center gap-4">
            <span className="text-gray-400">Daily Lead Distribution Target</span>
            <span className="font-bold text-slate-800 font-mono bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-full">
              {summary.assignedDailyTarget} leads / day
            </span>
          </div>
        </div>

        {/* Predictive Calibration Note */}
        <div className="p-3.5 bg-purple-50/30 border border-purple-200/20 rounded-xl flex items-start gap-2 text-xs">
          <Sparkles size={14} className="text-purple-500 shrink-0 mt-0.5" />
          <p className="text-gray-500 leading-normal">
            <strong>Copilot Handshake Active:</strong> Synity's background parser has auto-assigned tomorrow's workspace schedule elements for your team. You will find them under your <strong>AI Daily Planner</strong>.
          </p>
        </div>
      </div>

      {/* Complete and Return Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button size="sm" variant="outline" onClick={onReset} className="bg-white border-[#D8D8D8]">
          Import Another File
        </Button>
        <Button size="sm" variant="primary" onClick={onDone} className="bg-[#4E4E49] hover:bg-black">
          Return to Leads Hub
        </Button>
      </div>
    </div>
  );
};
