/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Sparkles,
  Database,
  Cloud,
  Check,
  Zap,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Clock
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { useAISettings } from "../../lib/ai/hooks/useAI";

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useAISettings();
  const [profileName, setProfileName] = useState("Alex Rivers");
  const [profileRole, setProfileRole] = useState("Sales Lead / Architect");
  const [profileEmail, setProfileEmail] = useState("alex@synity.io");
  const [profileCompany, setProfileCompany] = useState("Rivers Agency");

  const [aiFollowUp, setAiFollowUp] = useState(true);
  const [aiScoring, setAiScoring] = useState(true);
  const [supabaseSync, setSupabaseSync] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl text-left">
      {/* Header */}
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold font-display text-[#2F2F2F] tracking-tight">System Settings & Controls</h2>
        <p className="text-xs text-[#666666]">Configure Sales OS capabilities, adjust close-propensity weights, and calibrate team accounts.</p>
      </div>

      {/* Grid: Profile and System AI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Navigation Categories mockup */}
        <div className="md:col-span-1 space-y-1.5">
          <div className="p-3 rounded-lg bg-[#E5E3E7] font-semibold text-xs text-[#2F2F2F] flex items-center gap-2">
            <User size={14} /> Profile Settings
          </div>
          <div className="p-3 rounded-lg hover:bg-[#E5E3E7]/45 font-semibold text-xs text-[#666666] hover:text-[#2F2F2F] flex items-center gap-2 cursor-pointer transition-colors">
            <Sparkles size={14} /> AI Copilot Engine
          </div>
          <div className="p-3 rounded-lg hover:bg-[#E5E3E7]/45 font-semibold text-xs text-[#666666] hover:text-[#2F2F2F] flex items-center gap-2 cursor-pointer transition-colors">
            <Database size={14} /> Supabase Postgres Sync
          </div>
          <div className="p-3 rounded-lg hover:bg-[#E5E3E7]/45 font-semibold text-xs text-[#666666] hover:text-[#2F2F2F] flex items-center gap-2 cursor-pointer transition-colors">
            <Cloud size={14} /> Integrations & Keys
          </div>
        </div>

        {/* Action Panel body */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Form: Profile Card */}
          <Card title="Workspace Profile" description="Change your profile metrics and organization credentials.">
            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Display Name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="text-xs py-2.5"
                />
                <Input
                  label="Role in Company"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  className="text-xs py-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Contact"
                  value={profileEmail}
                  type="email"
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="text-xs py-2.5"
                />
                <Input
                  label="Company/Agency Name"
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  className="text-xs py-2.5"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                {saveSuccess ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-pulse">
                    <CheckCircle2 size={14} /> System changes saved successfully
                  </span>
                ) : (
                  <div />
                )}
                <Button type="submit" variant="primary" size="sm">
                  Save Settings
                </Button>
              </div>
            </form>
          </Card>

          {/* AI Calibrator controls */}
          <Card
            title="AI Sales Copilot Preferences"
            description="Toggle advanced scoring routines and contextual follow-up generation engines."
          >
            <div className="space-y-5 mt-4 text-xs">
              
              {/* Option 1 */}
              <div className="flex items-start justify-between gap-4 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="space-y-1 text-left">
                  <p className="font-bold text-[#2F2F2F] flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#8CB9D7]" />
                    AI Follow-Up Prompt Engine
                  </p>
                  <p className="text-[10px] text-gray-500 max-w-md leading-relaxed">
                    Automatically draft contextual email check-ins and call briefs on behalf of active sales representatives when follow-up dates expire.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAiFollowUp(!aiFollowUp)}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
                    aiFollowUp ? "bg-[#4E4E49]" : "bg-gray-300"
                  }`}
                >
                  <span className={`absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform ${
                    aiFollowUp ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Option 2 */}
              <div className="flex items-start justify-between gap-4 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="space-y-1 text-left">
                  <p className="font-bold text-[#2F2F2F] flex items-center gap-1.5">
                    <Zap size={13} className="text-[#8CB9D7]" />
                    Dynamic Deal propensity scoring
                  </p>
                  <p className="text-[10px] text-gray-500 max-w-md leading-relaxed">
                    Perform semantic profiling on customer emails and notes to calculate real-time close rate probability models (0% to 100%).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAiScoring(!aiScoring)}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
                    aiScoring ? "bg-[#4E4E49]" : "bg-gray-300"
                  }`}
                >
                  <span className={`absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform ${
                    aiScoring ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Option 3: Supabase Sync preparation */}
              <div className="flex items-start justify-between gap-4 p-3 bg-amber-50/20 border border-amber-200/50 rounded-xl">
                <div className="space-y-1 text-left">
                  <p className="font-bold text-[#2F2F2F] flex items-center gap-1.5">
                    <Database size={13} className="text-amber-600" />
                    Supabase PostgreSQL Live-Sync (Future Integration)
                  </p>
                  <p className="text-[10px] text-gray-500 max-w-md leading-relaxed">
                    Prepare background sockets to mirror local lead states to production Supabase Postgres schema rules as specified in the project blueprint.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSupabaseSync(!supabaseSync)}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
                    supabaseSync ? "bg-[#4E4E49]" : "bg-gray-300"
                  }`}
                >
                  <span className={`absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform ${
                    supabaseSync ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

            </div>
          </Card>

          {/* AI Model Calibration Controls */}
          <Card
            title="AI Model Calibration Controls"
            description="Calibrate the primary AI model weights, select active providers, and set daily scheduler pipelines."
          >
            <div className="space-y-4 mt-4 text-xs text-left" id="ai-model-calibration-card">
              {/* Row 1: Provider & Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#2F2F2F] flex items-center gap-1">
                    <Cpu size={13} className="text-[#3b7194]" />
                    AI Intelligence Provider
                  </label>
                  <select
                    value={settings.provider}
                    onChange={(e) => updateSettings({ provider: e.target.value as any })}
                    className="w-full rounded-lg border border-[#D8D8D8] p-2 bg-white text-xs text-[#2F2F2F] font-medium focus:ring-1 focus:ring-[#8CB9D7] outline-none"
                  >
                    <option value="gemini">Google Gemini API (Active)</option>
                    <option value="openai">OpenAI GPT-4o (Stub Integration)</option>
                    <option value="claude">Anthropic Claude 3.5 (Stub Integration)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#2F2F2F] flex items-center gap-1">
                    <Sparkles size={13} className="text-[#3b7194]" />
                    LLM Engine Model
                  </label>
                  <select
                    value={settings.model}
                    onChange={(e) => updateSettings({ model: e.target.value })}
                    className="w-full rounded-lg border border-[#D8D8D8] p-2 bg-white text-xs text-[#2F2F2F] font-medium focus:ring-1 focus:ring-[#8CB9D7] outline-none"
                  >
                    {settings.provider === "gemini" && (
                      <>
                        <option value="gemini-1.5-pro">gemini-1.5-pro (High Strategic Insight)</option>
                        <option value="gemini-1.5-flash">gemini-1.5-flash (High Velocity Execution)</option>
                      </>
                    )}
                    {settings.provider === "openai" && (
                      <>
                        <option value="gpt-4o">gpt-4o (Standard Enterprise)</option>
                        <option value="gpt-4-turbo">gpt-4-turbo</option>
                      </>
                    )}
                    {settings.provider === "claude" && (
                      <>
                        <option value="claude-3-5-sonnet">claude-3.5-sonnet-v2</option>
                        <option value="claude-3-haiku">claude-3-haiku</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Row 2: Temperature Slider */}
              <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#2F2F2F] flex items-center gap-1.5">
                    <Zap size={13} className="text-amber-500" />
                    Generation Temperature
                  </span>
                  <span className="font-mono font-bold bg-[#E5E3E7] text-[#2F2F2F] px-2 py-0.5 rounded-sm">
                    {settings.temperature}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.temperature}
                  onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                  className="w-full accent-gray-700 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-400 font-medium">
                  <span>0.1 (Strict & Precise)</span>
                  <span>0.7 (Balanced Creative Rationale)</span>
                  <span>1.0 (Highly Dynamic)</span>
                </div>
              </div>

              {/* Row 3: Daily Workday Schedule */}
              <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold text-[#2F2F2F] flex items-center gap-1.5">
                      <Clock size={13} className="text-purple-500" />
                      Daily Workday Planner Cron Triggers
                    </span>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Configure background workflows to assemble your daily mission dashboard automatically.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSettings({ dailyScheduleEnabled: !settings.dailyScheduleEnabled })}
                    className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
                      settings.dailyScheduleEnabled ? "bg-[#4E4E49]" : "bg-gray-300"
                    }`}
                  >
                    <span className={`absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform ${
                      settings.dailyScheduleEnabled ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                {settings.dailyScheduleEnabled && (
                  <div className="flex items-center gap-3 border-t border-gray-200/50 pt-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold block">Planner Dispatch Time</span>
                      <input
                        type="time"
                        value={settings.dailyScheduleTime}
                        onChange={(e) => updateSettings({ dailyScheduleTime: e.target.value })}
                        className="rounded-lg border border-[#D8D8D8] p-1.5 bg-white text-xs font-mono text-[#2F2F2F] outline-none focus:ring-1 focus:ring-[#8CB9D7]"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-4">
                      Every morning, Synity will run pipeline sweeps to synthesize meetings, follow-ups, and risk signals before your first login.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Connected Services list */}
          <Card title="Connected Integrations" description="SaaS APIs integrated into Synity's background framework.">
            <div className="space-y-3.5 mt-4 text-xs text-left">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-[#2F2F2F]">Gemini SDK Interface v2.4</span>
                </div>
                <Badge variant="success" size="sm">Active (Using Workspace Env)</Badge>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="font-semibold text-[#2F2F2F]">Supabase PostgreSQL Database</span>
                </div>
                <Badge variant="primary" size="sm">Pending Configuration</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-[#2F2F2F]">Google Calendar Follow-ups</span>
                </div>
                <Badge variant="success" size="sm">Active (Local Session)</Badge>
              </div>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};
