/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, FileUp, History, Database, HelpCircle, FileSpreadsheet } from "lucide-react";
import { ImportWizard } from "./ImportWizard";
import { ImportHistory } from "./ImportHistory";
import { ImportHistoryItem } from "../../types/import";
import { Lead, ActivityLog, Task } from "../../types";

interface ImportHubProps {
  existingLeads: Lead[];
  onImportLeads: (newLeads: Lead[], newActivities: ActivityLog[], newTasks: Task[]) => void;
  onDone: () => void;
}

export const ImportHub: React.FC<ImportHubProps> = ({ existingLeads, onImportLeads, onDone }) => {
  const [activeTab, setActiveTab] = useState<"wizard" | "history">("wizard");
  const [importHistory, setImportHistory] = useState<ImportHistoryItem[]>([]);

  // Load import logs from localStorage on mount
  useEffect(() => {
    loadHistory();
  }, [activeTab]);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem("synity_import_history");
      if (stored) {
        setImportHistory(JSON.parse(stored));
      } else {
        setImportHistory([]);
      }
    } catch (err) {
      console.error("Failed to read import history from system database", err);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to completely wipe all past import audit history? This action cannot be undone.")) {
      localStorage.removeItem("synity_import_history");
      setImportHistory([]);
    }
  };

  const handleSelectHistoryItem = (item: ImportHistoryItem) => {
    // Allows viewing past summaries in depth
    alert(`File Name: ${item.fileName}\nImported Leads Count: ${item.importedCount}\nCompleted At: ${new Date(item.uploadDate).toLocaleString()}`);
  };

  return (
    <div className="space-y-6 text-left" id="smart-import-hub-root">
      {/* Page Title & Main Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8D8D8] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-wider">
              Flagship Core System
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">Module OS v4.1</span>
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-[#2F2F2F]">
            Smart Import Hub
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl font-medium">
            Ingest and clean contact spreadsheets from any custom format. Detect duplicate profiles, resolve column headers, map pipeline properties, and calibrate daily workday distribution targets.
          </p>
        </div>

        {/* Dynamic Navigation Toggles */}
        <div className="flex items-center gap-1 bg-gray-200/50 p-1.5 rounded-xl self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("wizard")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "wizard"
                ? "bg-white text-[#2F2F2F] shadow-xs font-bold"
                : "text-[#666666] hover:text-[#2F2F2F]"
            }`}
          >
            <FileUp size={14} />
            Import Wizard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "history"
                ? "bg-white text-[#2F2F2F] shadow-xs font-bold"
                : "text-[#666666] hover:text-[#2F2F2F]"
            }`}
          >
            <History size={14} />
            History Logs
            {importHistory.length > 0 && (
              <span className="text-[9px] font-mono font-bold bg-[#E5E3E7] text-[#2F2F2F] px-1.5 py-0.5 rounded-full">
                {importHistory.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Primary tab canvas */}
      <div className="space-y-4" id="import-hub-canvas-body">
        {activeTab === "wizard" ? (
          <ImportWizard
            existingLeads={existingLeads}
            onImportLeads={onImportLeads}
            onDone={onDone}
          />
        ) : (
          <ImportHistory
            history={importHistory}
            onSelectImport={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
          />
        )}
      </div>
    </div>
  );
};
export default ImportHub;
