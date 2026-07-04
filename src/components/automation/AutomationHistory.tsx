/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, SlidersHorizontal, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Play, RefreshCw, XCircle } from "lucide-react";
import { AutomationHistoryEntry } from "../../types";

interface AutomationHistoryProps {
  history: AutomationHistoryEntry[];
  onReTrigger: (entry: AutomationHistoryEntry) => void;
}

export const AutomationHistory: React.FC<AutomationHistoryProps> = ({ history, onReTrigger }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.ruleName.toLowerCase().includes(search.toLowerCase()) ||
      (item.leadName && item.leadName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRetry = (entry: AutomationHistoryEntry) => {
    setRetryingId(entry.id);
    setTimeout(() => {
      onReTrigger(entry);
      setRetryingId(null);
    }, 800);
  };

  return (
    <div className="bg-white rounded-xl border border-[#D8D8D8] shadow-xs overflow-hidden" id="automation-history-panel">
      {/* Search and Filters Header */}
      <div className="p-5 border-b border-[#D8D8D8] flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search size={15} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rules or lead names..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4E4E49] focus:border-[#4E4E49] text-[#2F2F2F]"
            aria-label="Search automation logs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal size={12} />
            <span>Filter Status:</span>
          </span>
          <div className="flex bg-white border border-[#D8D8D8] rounded-lg p-0.5 shrink-0">
            {["ALL", "SUCCESS", "SKIPPED", "FAILED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-[#4E4E49] text-white"
                    : "text-[#666666] hover:text-[#2F2F2F] hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Execution Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/30 border-b border-[#D8D8D8] text-[10px] font-bold text-[#666666] uppercase tracking-wider">
              <th className="px-5 py-3.5">Automation Rule</th>
              <th className="px-5 py-3.5">Target Lead</th>
              <th className="px-5 py-3.5">Execution Date</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Speed</th>
              <th className="px-5 py-3.5">Result Details</th>
              <th className="px-5 py-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[#666666]">
                  <p className="font-semibold text-sm">No historical logs match your filters</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting the filter keywords or select "ALL"</p>
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => {
                const isSuccess = item.status === "SUCCESS";
                const isFailed = item.status === "FAILED";
                const isSkipped = item.status === "SKIPPED";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/40 transition-colors"
                    id={`history-row-${item.id}`}
                  >
                    {/* Rule name */}
                    <td className="px-5 py-4 font-semibold text-[#2F2F2F] max-w-[180px] truncate">
                      {item.ruleName}
                    </td>

                    {/* Lead name */}
                    <td className="px-5 py-4 text-gray-600">
                      {item.leadName ? (
                        <span className="font-medium font-sans px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                          {item.leadName}
                        </span>
                      ) : (
                        <span className="italic text-gray-400">System Triggered</span>
                      )}
                    </td>

                    {/* Execution Date */}
                    <td className="px-5 py-4 font-mono text-[10px] text-gray-400">
                      {new Date(item.executionTime).toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4">
                      {isSuccess && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#137333]/10 text-[#137333] border border-[#137333]/15">
                          <CheckCircle2 size={10} />
                          <span>SUCCESS</span>
                        </span>
                      )}
                      {isSkipped && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                          <HelpCircle size={10} />
                          <span>SKIPPED</span>
                        </span>
                      )}
                      {isFailed && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                          <XCircle size={10} />
                          <span>FAILED</span>
                        </span>
                      )}
                    </td>

                    {/* Speed/Duration */}
                    <td className="px-5 py-4 font-mono text-[11px] text-right font-medium text-gray-500">
                      {item.durationMs}ms
                    </td>

                    {/* Result Details */}
                    <td className="px-5 py-4 text-[#666666] max-w-sm">
                      <p className="line-clamp-2 leading-relaxed text-[11px]">
                        {item.result}
                      </p>
                      {item.errors && (
                        <div className="mt-1.5 p-2 bg-rose-50/60 rounded border border-rose-100/60 text-[10px] text-rose-700 font-mono">
                          <p className="font-semibold flex items-center gap-1">
                            <AlertTriangle size={10} /> Error Trace:
                          </p>
                          <p className="mt-0.5">{item.errors}</p>
                        </div>
                      )}
                    </td>

                    {/* Actions: Retry Trigger */}
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      {isFailed ? (
                        <button
                          onClick={() => handleRetry(item)}
                          disabled={retryingId === item.id}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all border border-rose-200 flex items-center gap-1 mx-auto cursor-pointer"
                          title="Retry failed execution"
                        >
                          <RefreshCw size={10} className={retryingId === item.id ? "animate-spin" : ""} />
                          <span>{retryingId === item.id ? "Retrying..." : "Retry"}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRetry(item)}
                          disabled={retryingId === item.id}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all cursor-pointer flex items-center justify-center mx-auto"
                          title="Simulate re-run"
                        >
                          <RefreshCw size={11} className={retryingId === item.id ? "animate-spin" : ""} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer statistics bar */}
      <div className="p-4 bg-gray-50 border-t border-[#D8D8D8] text-[11px] text-[#666666] font-mono flex items-center justify-between">
        <span>Showing {filteredHistory.length} of {history.length} operations</span>
        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
          <CheckCircle2 size={12} />
          <span>Workflow engine responsive</span>
        </span>
      </div>
    </div>
  );
};
