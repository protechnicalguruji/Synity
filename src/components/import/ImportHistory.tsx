/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { History, Calendar, FileText, ChevronRight, Inbox, HelpCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { ImportHistoryItem } from "../../types/import";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface ImportHistoryProps {
  history: ImportHistoryItem[];
  onSelectImport: (item: ImportHistoryItem) => void;
  onClearHistory?: () => void;
}

export const ImportHistory: React.FC<ImportHistoryProps> = ({
  history,
  onSelectImport,
  onClearHistory,
}) => {
  const [selectedItem, setSelectedItem] = useState<ImportHistoryItem | null>(null);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getStatusBadge = (status: ImportHistoryItem["status"]) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <span className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />
            Completed
          </span>
        );
      case "PARTIAL":
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <span className="h-1 w-1 bg-amber-500 rounded-full animate-pulse" />
            Partial Sync
          </span>
        );
      case "FAILED":
      default:
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <span className="h-1 w-1 bg-red-500 rounded-full animate-pulse" />
            Failed
          </span>
        );
    }
  };

  if (history.length === 0) {
    return (
      <div className="p-12 border border-dashed border-[#D8D8D8] rounded-2xl bg-white text-center space-y-4" id="history-empty-state">
        <div className="mx-auto h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
          <Inbox size={20} />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2F2F]">No Import History</h4>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            Upload your first lead file (CSV, Excel spreadsheets, or lead PDFs) using the panel above to populate historic data logs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left" id="import-history-container">
      {/* Table Title and Actions */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2F2F] flex items-center gap-1.5">
            <History size={14} className="text-[#666666]" />
            Previous Workday File Imports
          </h4>
          <p className="text-[10px] text-gray-500 font-medium">A complete audit trial of all lead spreadsheets loaded into your Synity CRM workspace.</p>
        </div>

        {onClearHistory && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline transition-colors"
          >
            Clear Audit Logs
          </button>
        )}
      </div>

      {/* History log rows list */}
      <div className="border border-[#D8D8D8] rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-left">
            <thead>
              <tr className="bg-gray-50/70 border-b border-[#D8D8D8] text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3">File details</th>
                <th className="p-3">Import Date</th>
                <th className="p-3">Committed Elements</th>
                <th className="p-3">Transaction status</th>
                <th className="p-3">Processing Duration</th>
                <th className="p-3 w-28 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/20 transition-all font-medium text-gray-600">
                  {/* Filename details */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-gray-50 rounded text-gray-400">
                        <FileText size={14} />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-bold text-slate-800 truncate max-w-[200px]">{item.fileName}</p>
                        <p className="text-[10px] text-gray-400 font-mono font-normal">
                          {formatSize(item.fileSize)} • {item.fileType.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Upload Date */}
                  <td className="p-3.5 font-mono text-gray-500">
                    {new Date(item.uploadDate).toLocaleDateString([], { month: "short", day: "2-digit", year: "numeric" })}
                  </td>

                  {/* Count */}
                  <td className="p-3.5">
                    <div className="space-y-0.5">
                      <p className="font-bold text-[#2F2F2F] font-mono">{item.importedCount} Leads</p>
                      <p className="text-[10px] text-gray-400 font-normal">
                        out of {item.totalRecords} parsed rows
                      </p>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-3.5">{getStatusBadge(item.status)}</td>

                  {/* Duration speed */}
                  <td className="p-3.5 font-mono text-gray-500">
                    {(item.processingTimeMs / 1000).toFixed(2)} seconds
                  </td>

                  {/* View Action */}
                  <td className="p-3.5 text-center">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => setSelectedItem(item)}
                      className="bg-white border-[#D8D8D8] text-[10px] font-bold inline-flex items-center gap-1 hover:border-black"
                    >
                      View Report
                      <ArrowUpRight size={10} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HISTORIC INDIVIDUAL REPORT DRILL DOWN MODAL */}
      <Modal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        title={
          <span className="flex items-center gap-2">
            <History size={18} className="text-[#3b7194]" />
            Import Transaction Audit Summary
          </span>
        }
        size="md"
      >
        <div className="space-y-4 text-left" id="history-modal-body">
          {selectedItem && (
            <>
              {/* Profile summary info */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-1.5">
                <span className="text-[9px] uppercase font-mono font-bold text-gray-400 block tracking-wider">File Metadata</span>
                <h5 className="font-bold text-slate-800 text-xs">{selectedItem.fileName}</h5>
                <p className="text-[10px] text-gray-500 font-mono">
                  Type: {selectedItem.fileType.toUpperCase()} • Size: {formatSize(selectedItem.fileSize)}
                </p>
              </div>

              {/* Grid counts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 bg-gray-100/50 rounded-xl">
                  <span className="text-[9px] text-gray-400 font-bold block">TOTAL ROWS</span>
                  <span className="font-mono font-bold text-[#2F2F2F]">{selectedItem.totalRecords}</span>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl font-bold">
                  <span className="text-[9px] text-emerald-600 block">IMPORTED</span>
                  <span className="font-mono">{selectedItem.importedCount}</span>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl font-bold">
                  <span className="text-[9px] text-amber-600 block">SKIPPED</span>
                  <span className="font-mono">{selectedItem.skippedCount}</span>
                </div>
                <div className="p-2.5 bg-red-50 text-red-800 rounded-xl font-bold">
                  <span className="text-[9px] text-red-600 block">ERRORS</span>
                  <span className="font-mono">{selectedItem.errorCount}</span>
                </div>
              </div>

              {/* Key details */}
              <div className="divide-y divide-gray-100 text-xs font-medium text-gray-600">
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-400">Import Session Date</span>
                  <span className="text-[#2F2F2F] font-mono">
                    {new Date(selectedItem.uploadDate).toLocaleString()}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-400">Pipeline Scheduler Target</span>
                  <span className="text-[#2F2F2F] font-mono">
                    {selectedItem.assignedDailyTarget} leads per day
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-400">System Handshake Duration</span>
                  <span className="text-[#2F2F2F] font-mono">
                    {(selectedItem.processingTimeMs / 1000).toFixed(2)} seconds
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-400">Transaction Status</span>
                  <span>{getStatusBadge(selectedItem.status)}</span>
                </div>
              </div>

              {/* Informative footer */}
              <div className="p-3 bg-blue-50/35 border border-blue-100/30 rounded-xl text-[10px] text-gray-500 leading-relaxed flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#3b7194]" />
                <span>All associated leads are correctly active, categorized, and queryable inside the Leads Hub.</span>
              </div>

              {/* Controls */}
              <div className="pt-3 border-t border-gray-100 flex justify-end">
                <Button size="sm" variant="primary" onClick={() => setSelectedItem(null)} className="bg-[#4E4E49] hover:bg-black">
                  Acknowledge Report
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
