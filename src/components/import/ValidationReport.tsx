/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { ParsedRecord, ImportError } from "../../types/import";

interface ValidationReportProps {
  records: ParsedRecord[];
}

export const ValidationReport: React.FC<ValidationReportProps> = ({ records }) => {
  const [filter, setFilter] = useState<"all" | "errors" | "warnings">("all");

  // Gather all errors & warnings
  const allIssues: { recordIndex: number; companyName: string; issue: ImportError }[] = [];
  let errorCount = 0;
  let warningCount = 0;

  records.forEach((rec) => {
    rec.validationErrors.forEach((err) => {
      if (err.severity === "error") errorCount++;
      if (err.severity === "warning") warningCount++;

      allIssues.push({
        recordIndex: rec.index,
        companyName: rec.mappedData.company || `Row #${rec.index}`,
        issue: err,
      });
    });
  });

  const filteredIssues = allIssues.filter((item) => {
    if (filter === "errors") return item.issue.severity === "error";
    if (filter === "warnings") return item.issue.severity === "warning";
    return true;
  });

  const totalRecords = records.length;
  const healthyRecords = records.filter((rec) => rec.validationErrors.length === 0).length;
  const healthyPercentage = totalRecords > 0 ? Math.round((healthyRecords / totalRecords) * 100) : 100;

  return (
    <div className="space-y-4 text-left" id="validation-report-container">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Record Health Rating */}
        <div className="p-4.5 bg-white border border-[#D8D8D8] rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Data Cleanliness Rating</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#2F2F2F]">{healthyPercentage}%</span>
              <span className="text-[10px] text-gray-500 font-medium">({healthyRecords} / {totalRecords} Clean)</span>
            </div>
            <div className="w-24 bg-gray-100 h-1 rounded-full overflow-hidden mt-2">
              <div
                className={`h-1 rounded-full ${healthyPercentage > 80 ? "bg-emerald-500" : healthyPercentage > 50 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${healthyPercentage}%` }}
              />
            </div>
          </div>
          <div className={`p-3 rounded-xl shrink-0 ${healthyPercentage > 80 ? "bg-emerald-50/50 text-emerald-600" : "bg-amber-50 text-amber-500"}`}>
            <ShieldCheck size={20} />
          </div>
        </div>

        {/* Card 2: Total Critical Errors */}
        <div className="p-4.5 bg-white border border-[#D8D8D8] rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Critical Failures</span>
            <span className="text-xl font-bold text-red-600">{errorCount}</span>
            <p className="text-[10px] text-gray-500 font-medium">Blocks record importing until corrected.</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
            <AlertCircle size={20} />
          </div>
        </div>

        {/* Card 3: Warnings */}
        <div className="p-4.5 bg-white border border-[#D8D8D8] rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Calibrations & Warnings</span>
            <span className="text-xl font-bold text-amber-500">{warningCount}</span>
            <p className="text-[10px] text-gray-500 font-medium">Sub-optimal layout formats. Cleaned on import.</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl shrink-0">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Main Issues Diagnostics list */}
      {allIssues.length === 0 ? (
        <div className="p-10 border border-[#D8D8D8] rounded-2xl bg-emerald-50/10 text-center space-y-3" id="no-issues-slate">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-full inline-block">
            <CheckCircle2 size={24} />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2F2F]">Database Validation Success</h4>
            <p className="text-[11px] text-gray-500 font-medium max-w-md mx-auto">
              100% of the mapped spreadsheets are completely aligned with Synity's relational standards. Zero formatting anomalies were detected.
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-[#D8D8D8] rounded-xl overflow-hidden bg-white shadow-2xs" id="diagnostics-log-block">
          {/* Header Controls */}
          <div className="bg-gray-50/70 p-4 border-b border-[#D8D8D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-[#2F2F2F] uppercase tracking-wider">Formatting Diagnostics Logs</h4>
              <p className="text-[10px] text-gray-500 font-medium">Inspect row-level cellular discrepancies and recommended corrective paths.</p>
            </div>

            {/* Filters tabs */}
            <div className="flex gap-1.5 shrink-0 bg-gray-200/50 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${
                  filter === "all" ? "bg-white text-[#2F2F2F]" : "text-[#666666] hover:text-[#2F2F2F]"
                }`}
              >
                All ({allIssues.length})
              </button>
              <button
                type="button"
                disabled={errorCount === 0}
                onClick={() => setFilter("errors")}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${
                  filter === "errors" ? "bg-red-600 text-white" : "text-red-600 hover:bg-red-50"
                }`}
              >
                Errors ({errorCount})
              </button>
              <button
                type="button"
                disabled={warningCount === 0}
                onClick={() => setFilter("warnings")}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${
                  filter === "warnings" ? "bg-amber-500 text-white" : "text-amber-500 hover:bg-amber-50"
                }`}
              >
                Warnings ({warningCount})
              </button>
            </div>
          </div>

          {/* Log Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs text-left">
              <thead>
                <tr className="bg-gray-50/40 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                  <th className="p-3 w-16 text-center">Row</th>
                  <th className="p-3">Reference (Company)</th>
                  <th className="p-3">CRM Variable</th>
                  <th className="p-3">Faulty Cell Value</th>
                  <th className="p-3">Diagnostic Code & Suggestion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-600">
                {filteredIssues.map((item, index) => {
                  const isError = item.issue.severity === "error";

                  return (
                    <tr key={index} className="hover:bg-gray-50/30 transition-colors">
                      <td className="p-3 text-center font-mono font-bold text-gray-400 bg-gray-50/10">
                        {item.recordIndex}
                      </td>
                      <td className="p-3 font-bold text-slate-800">
                        {item.companyName}
                      </td>
                      <td className="p-3">
                        <span className="font-mono bg-gray-100 text-[#2F2F2F] px-1.5 py-0.5 rounded text-[10px] font-semibold border border-gray-200">
                          {item.issue.field}
                        </span>
                      </td>
                      <td className="p-3 text-red-700 font-mono italic">
                        {item.issue.value ? `"${item.issue.value}"` : <span className="text-gray-400 font-mono">[N/A Empty]</span>}
                      </td>
                      <td className="p-3">
                        <div className="flex items-start gap-1.5">
                          {isError ? (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200 shrink-0 mt-0.5">
                              BLOCKED
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 shrink-0 mt-0.5">
                              WARNING
                            </span>
                          )}
                          <div>
                            <p className="text-[#2F2F2F] font-semibold">{item.issue.message}</p>
                            <p className="text-[10px] text-gray-400 font-normal leading-normal">
                              {isError
                                ? "Correct spelling in original sheet or map alternative column header."
                                : "Synity parser auto-corrects formatting upon completing final handshake."}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredIssues.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 text-xs font-semibold">
                      Zero issues matching selected filters are available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
