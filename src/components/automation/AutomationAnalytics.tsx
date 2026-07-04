/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Play, CheckCircle2, AlertTriangle, Clock, Zap, Sparkles, BrainCircuit, RefreshCw, BarChart2 } from "lucide-react";
import { AutomationAnalyticsSummary } from "../../types";

interface AutomationAnalyticsProps {
  analytics: AutomationAnalyticsSummary;
}

export const AutomationAnalytics: React.FC<AutomationAnalyticsProps> = ({ analytics }) => {
  const successRate = ((analytics.successfulRuns / analytics.totalRuns) * 100).toFixed(1);

  // AI Insights mock state
  const aiInsights = [
    {
      id: "ai-1",
      title: "AI Rule Suggestion",
      description: "Based on 45 frequent updates to 'Closed Won' with no subsequent task logs, we recommend enabling: 'Post-Sale Customer Hand-Off Automation'.",
      type: "suggestion",
      impact: "Saves ~2 hrs/week"
    },
    {
      id: "ai-2",
      title: "AI Workflow Optimization",
      description: "Rule 'LinkedIn Lead Nurturing Router' has a 98% pass-rate on the country condition 'United States'. Consider removing this filter to capture more leads.",
      type: "optimization",
      impact: "Increase volume +12%"
    },
    {
      id: "ai-3",
      title: "AI Duplicate Rule Detection",
      description: "No redundancy detected. Your active rule stack is perfectly optimized with 0 overlapping triggers.",
      type: "duplicate",
      impact: "Verified clean"
    },
    {
      id: "ai-4",
      title: "AI Performance Suggestion",
      description: "The webhook trigger '/api/v1/lead-import-hook' bursts on Mondays. Restrict email dispatches to a staggered rate limits block to prevent API fatigue.",
      type: "performance",
      impact: "Avoids transient rate-limits"
    }
  ];

  return (
    <div className="space-y-6" id="automation-analytics-panel">
      {/* 4 Core Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Runs */}
        <div className="bg-white p-5 rounded-xl border border-[#D8D8D8] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-lg text-[#2F2F2F]">
            <Play size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666] tracking-wider uppercase">Total Runs</p>
            <p className="text-2xl font-bold text-[#2F2F2F] tracking-tight mt-0.5">
              {analytics.totalRuns}
            </p>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white p-5 rounded-xl border border-[#D8D8D8] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#137333]/10 rounded-lg text-[#137333]">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666] tracking-wider uppercase">Success Rate</p>
            <p className="text-2xl font-bold text-[#137333] tracking-tight mt-0.5">
              {successRate}%
            </p>
          </div>
        </div>

        {/* Failed Runs */}
        <div className="bg-white p-5 rounded-xl border border-[#D8D8D8] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666] tracking-wider uppercase">Failures</p>
            <p className="text-2xl font-bold text-red-600 tracking-tight mt-0.5">
              {analytics.failedRuns}
            </p>
          </div>
        </div>

        {/* Average Duration */}
        <div className="bg-white p-5 rounded-xl border border-[#D8D8D8] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#0A66C2]/10 rounded-lg text-[#0A66C2]">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#666666] tracking-wider uppercase">Avg Execution</p>
            <p className="text-2xl font-bold text-[#2F2F2F] tracking-tight mt-0.5">
              {analytics.avgExecutionTimeMs}ms
            </p>
          </div>
        </div>

      </div>

      {/* Main Grid: Chart & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column (2 cols) */}
        <div className="bg-white rounded-xl border border-[#D8D8D8] shadow-xs p-5 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-sans font-bold text-[#2F2F2F] text-sm">Execution Volume Over Time</h3>
              <p className="text-xs text-gray-400">Total automated pipeline transitions triggered daily</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-[10px] font-mono text-[#666666]">
              <BarChart2 size={12} />
              <span>Real-time</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.runsByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4E4E49" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4E4E49" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                <XAxis dataKey="date" stroke="#999999" fontSize={10} tickLine={false} />
                <YAxis stroke="#999999" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #D8D8D8",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontFamily: "Inter, sans-serif"
                  }}
                />
                <Area type="monotone" dataKey="runs" name="Runs" stroke="#4E4E49" strokeWidth={2} fillOpacity={1} fill="url(#colorRuns)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Metrics Bottom Ribbon */}
          <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between text-xs text-[#666666] flex-wrap gap-2">
            <div>
              <span className="font-semibold text-[#2F2F2F]">Most Triggered Rule: </span>
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[11px] text-[#2F2F2F]">
                {analytics.mostUsedAutomationName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <RefreshCw size={12} className="animate-spin-slow" />
              <span>Synced with Sales OS logs</span>
            </div>
          </div>
        </div>

        {/* AI Insight Side Block (1 col) */}
        <div className="bg-gradient-to-br from-[#4E4E49] to-[#2F2F2F] text-white rounded-xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-white/10 text-amber-300">
                <BrainCircuit size={18} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm tracking-tight text-white">AI Automation Copilot</h3>
                <p className="text-[10px] text-gray-300 uppercase tracking-widest font-mono">Calibrated Suggestions</p>
              </div>
            </div>

            <p className="text-xs text-gray-200 leading-relaxed mb-4">
              Synity AI analyzes active deal workflows and audit history to suggest optimal rules, prevent circular triggers, and recommend efficiency sweeps.
            </p>

            <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
              {aiInsights.map((ins) => (
                <div key={ins.id} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                      <Sparkles size={10} />
                      {ins.title}
                    </span>
                    <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 bg-white/10 rounded text-white shrink-0">
                      {ins.impact}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-200 leading-normal font-normal">
                    {ins.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 mt-5 pt-4 flex justify-between items-center text-[10px] text-gray-300 font-mono">
            <span>Model: Gemini Flash</span>
            <span>Refreshed hourly</span>
          </div>
        </div>

      </div>
    </div>
  );
};
