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
  AlertCircle
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";

export const SettingsView: React.FC = () => {
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
