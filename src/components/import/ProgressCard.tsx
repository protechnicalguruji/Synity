/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Sparkles, RefreshCw, CheckCircle2, Database, ListTodo, Activity } from "lucide-react";

interface ProgressCardProps {
  totalRecords: number;
  onFinished: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ totalRecords, onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing database session...");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const addLog = (msg: string) => {
      setLogs((prev) => [msg, ...prev].slice(0, 15)); // Keep latest 15 logs
    };

    addLog("🔒 Securing background transaction channels...");
    addLog("⚙️ Commencing pipeline chunk loader (batch_size: 50)...");

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.ceil(Math.random() * 8) + 3;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setStatusText("Handshake completed! Saving system parameters...");
        addLog("✅ Committing final SQL updates... Clean up temporary transaction tables.");
        addLog("🎉 Process finalized! { status: 200, statusText: 'OK' }");
        clearInterval(interval);
        setTimeout(() => {
          onFinished();
        }, 1000);
      } else {
        setProgress(currentProgress);

        // Change status text & append logs dynamically based on progress percent
        if (currentProgress > 15 && currentProgress <= 40) {
          setStatusText(`Injecting batch 1 into workspace (Rows 1 to 50)...`);
          if (logs.length < 5) {
            addLog("⚡ Injecting chunk 1 [Records 1-50] successfully mapped to lead relational model.");
            addLog("🔍 Checking structural validity metrics of incoming elements...");
          }
        } else if (currentProgress > 40 && currentProgress <= 70) {
          setStatusText(`Syncing background duplicates & merging data records...`);
          if (logs.length < 8) {
            addLog("🔁 Resolving smart merge parameters on exact email match collisions...");
            addLog("📁 Appending timeline logs for pre-existing profiles...");
          }
        } else if (currentProgress > 70 && currentProgress < 95) {
          setStatusText(`Calibrating AI target pipelines and Daily Planner targets...`);
          if (logs.length < 11) {
            addLog("🤖 Dispatching background workers to populate initial target follow-ups...");
            addLog("📊 Recalculating enterprise pipeline metrics & summary graphs.");
          }
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 md:p-12 border border-[#D8D8D8] bg-white rounded-2xl max-w-xl mx-auto space-y-6 text-center shadow-md animate-fade-in" id="import-progress-panel">
      {/* Circle Processing icon */}
      <div className="relative h-16 w-16 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin" style={{ animationDuration: "1.5s" }} />
        <Database size={24} className="text-purple-600" />
      </div>

      {/* Main progress values */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2F2F2F]">Executing Relational Import</h3>
        <p className="text-xs text-purple-600 font-semibold font-mono animate-pulse">{statusText}</p>
        
        <div className="w-full bg-gray-100 rounded-full h-2 max-w-sm mx-auto overflow-hidden mt-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-mono font-bold text-gray-700 block">{progress}%</span>
      </div>

      {/* Database insertion metrics */}
      <div className="grid grid-cols-2 gap-3.5 max-w-md mx-auto py-4 border-y border-gray-100 text-xs">
        <div className="text-left space-y-0.5 pl-3 border-l-2 border-[#8CB9D7]">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Pending Elements</span>
          <p className="font-bold text-[#2F2F2F]">
            {Math.max(0, Math.ceil(totalRecords - (totalRecords * progress) / 100))} Rows
          </p>
        </div>
        <div className="text-left space-y-0.5 pl-3 border-l-2 border-emerald-400">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Successfully Committed</span>
          <p className="font-bold text-emerald-600">
            {Math.min(totalRecords, Math.floor((totalRecords * progress) / 100))} Rows
          </p>
        </div>
      </div>

      {/* Live Technical Action Log Console */}
      <div className="space-y-1.5 text-left max-w-md mx-auto">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
          <Activity size={12} />
          Synity Transaction Stream Console
        </span>
        <div className="h-36 bg-gray-900 border border-gray-800 rounded-xl p-3 overflow-y-auto font-mono text-[9px] text-[#A6E22E] space-y-1.5 shadow-inner">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed opacity-90 truncate">
              <span className="text-gray-500 select-none mr-1.5">&gt;&gt;</span>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
