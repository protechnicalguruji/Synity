/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Check,
  HelpCircle,
  Clock,
  Sparkles,
  Zap,
  Lock,
  User,
  Shield,
  CreditCard,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

// -------------------------------------------------
// 1. SettingsSection
// -------------------------------------------------
interface SettingsSectionProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  id,
  title,
  description,
  children
}) => {
  return (
    <div id={`section-${id}`} className="space-y-4 animate-fade-in text-left">
      <div className="border-b border-[#D8D8D8] pb-3.5">
        <h3 className="text-base font-bold text-[#2F2F2F] tracking-tight">{title}</h3>
        <p className="text-xs text-[#666666] mt-0.5">{description}</p>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

// -------------------------------------------------
// 2. SettingsCard
// -------------------------------------------------
interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  children,
  id
}) => {
  return (
    <div id={id} className="bg-white rounded-xl border border-[#D8D8D8] p-5 space-y-4 shadow-xs text-left">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2F2F]">{title}</h4>
        {description && <p className="text-[11px] text-gray-400 mt-0.5 leading-normal">{description}</p>}
      </div>
      <div className="space-y-3 pt-1">
        {children}
      </div>
    </div>
  );
};

// -------------------------------------------------
// 3. ToggleSetting
// -------------------------------------------------
interface ToggleSettingProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  badgeText?: string;
}

export const ToggleSetting: React.FC<ToggleSettingProps> = ({
  id,
  label,
  description,
  checked,
  onChange,
  badgeText
}) => {
  return (
    <div className="flex items-start justify-between gap-4 p-3.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100/50 transition-colors">
      <div className="space-y-1 text-left">
        <label htmlFor={id} className="font-bold text-xs text-[#2F2F2F] flex items-center gap-1.5 cursor-pointer">
          <span>{label}</span>
          {badgeText && (
            <span className="text-[9px] px-1.5 py-0.5 bg-gray-200 text-gray-700 font-mono font-bold rounded">
              {badgeText}
            </span>
          )}
        </label>
        <p className="text-[10px] text-gray-500 max-w-xl leading-relaxed">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
          checked ? "bg-[#4E4E49]" : "bg-gray-300"
        }`}
      >
        <span className={`absolute top-1 left-1 bg-white h-4 w-4 rounded-full transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`} />
      </button>
    </div>
  );
};

// -------------------------------------------------
// 4. InputSetting
// -------------------------------------------------
interface InputSettingProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (val: any) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  unit?: string;
}

export const InputSetting: React.FC<InputSettingProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  min,
  max,
  unit
}) => {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="text-xs font-semibold text-[#2F2F2F] flex items-center justify-between">
        <span>{label}</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => {
            const val = type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value;
            onChange(val);
          }}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F] disabled:bg-gray-50 disabled:text-gray-400 font-medium"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-gray-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------
// 5. SelectSetting
// -------------------------------------------------
interface SelectSettingProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export const SelectSetting: React.FC<SelectSettingProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false
}) => {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="text-xs font-semibold text-[#2F2F2F]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F] disabled:bg-gray-50 disabled:text-gray-400 font-semibold"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// -------------------------------------------------
// 6. ThemeSelector
// -------------------------------------------------
interface ThemeSelectorProps {
  value: "light" | "dark" | "system";
  onChange: (val: "light" | "dark" | "system") => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-1.5 text-left">
      <span className="text-xs font-semibold text-[#2F2F2F]">Interface theme preference</span>
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: "light", label: "☀️ Light Theme" },
          { id: "dark", label: "🌙 Dark Theme" },
          { id: "system", label: "🖥️ System OS" }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id as any)}
            className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
              value === t.id
                ? "bg-[#4E4E49] text-white border-[#4E4E49] shadow-xs"
                : "bg-white text-[#666666] border-[#D8D8D8] hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------
// 7. WorkspaceCard
// -------------------------------------------------
interface WorkspaceCardProps {
  name: string;
  slug: string;
  id: string;
  createdAt: string;
  memberCount: number;
  status: "ACTIVE" | "MAINTENANCE" | "SUSPENDED";
  onSlugChange: (val: string) => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  name,
  slug,
  id,
  createdAt,
  memberCount,
  status,
  onSlugChange
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#D8D8D8] p-5 space-y-4 shadow-xs text-left">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2F2F]">Workspace Metadata</h4>
          <p className="text-[11px] text-gray-400 mt-0.5">Physical identifier registries and workspace credentials</p>
        </div>
        <Badge variant={status === "ACTIVE" ? "success" : "warning"} size="sm">
          {status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3 bg-gray-50 rounded-lg space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">Workspace ID</span>
          <p className="font-mono font-bold text-[#2F2F2F] select-all">{id}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">Registry Date</span>
          <p className="font-medium text-[#2F2F2F]">
            {new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-3">
        <div className="space-y-1.5">
          <label htmlFor="ws-slug-field" className="text-xs font-bold text-[#2F2F2F]">Custom Workspace URL Slug</label>
          <div className="flex items-center">
            <span className="px-3 py-2 bg-gray-100 border border-r-0 border-[#D8D8D8] rounded-l-lg text-xs text-gray-500 font-mono font-medium">
              synity.io/ws/
            </span>
            <input
              id="ws-slug-field"
              type="text"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
              placeholder="my-workspace"
              className="flex-1 text-xs px-3 py-2 border border-[#D8D8D8] rounded-r-lg focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F] font-semibold"
            />
          </div>
          <p className="text-[10px] text-gray-400">Slug must contain only letters, numbers, hyphens or underscores.</p>
        </div>

        <div className="flex justify-between items-center p-3 bg-purple-50/40 border border-purple-100 rounded-lg">
          <div className="text-left space-y-0.5">
            <span className="text-[10px] font-bold text-[#8E44AD] uppercase tracking-wider font-mono">MEMBER ROSTER STUB</span>
            <p className="text-[11px] text-gray-600 font-medium">This workspace has {memberCount} registered seats.</p>
          </div>
          <Button variant="secondary" size="xs">
            Manage Members
          </Button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------
// 8. NotificationCard
// -------------------------------------------------
interface NotificationCardProps {
  meetings: boolean;
  followUps: boolean;
  tasks: boolean;
  callbacks: boolean;
  achievements: boolean;
  aiNotifications: boolean;
  systemNotifications: boolean;
  onChange: (key: string, val: boolean) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  meetings,
  followUps,
  tasks,
  callbacks,
  achievements,
  aiNotifications,
  systemNotifications,
  onChange
}) => {
  return (
    <div className="space-y-4 text-left">
      <SettingsCard title="Alert Categories & Dispatch Toggles" description="Receive instantaneous notifications on pipeline transitions, due deadlines, and performance wins.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <ToggleSetting
            id="notif-meetings"
            label="📅 Calender Meetings"
            description="Trigger banners for upcoming Google Calendar sync briefings and sales pitches."
            checked={meetings}
            onChange={(val) => onChange("meetings", val)}
          />
          <ToggleSetting
            id="notif-followups"
            label="⚡ Outgoing Follow-Ups"
            description="Notifications when customer interaction intervals expire and need immediate touch."
            checked={followUps}
            onChange={(val) => onChange("followUps", val)}
          />
          <ToggleSetting
            id="notif-tasks"
            label="📋 Task Deadlines"
            description="Trigger alerts when workday action cards approach execution due times."
            checked={tasks}
            onChange={(val) => onChange("tasks", val)}
          />
          <ToggleSetting
            id="notif-callbacks"
            label="📞 Callback Reminders"
            description="System notifications for customer voice calls marked with urgent tags."
            checked={callbacks}
            onChange={(val) => onChange("callbacks", val)}
          />
          <ToggleSetting
            id="notif-achievements"
            label="🏆 Gamified Achievements"
            description="Real-time celebrations when individual representatives hit target quotas."
            checked={achievements}
            onChange={(val) => onChange("achievements", val)}
          />
          <ToggleSetting
            id="notif-ai"
            label="✨ AI Insights Alerts"
            description="Daily briefing reports compiled by Gemini containing risk-propensity alerts."
            checked={aiNotifications}
            onChange={(val) => onChange("aiNotifications", val)}
          />
          <ToggleSetting
            id="notif-system"
            label="⚙️ System Handshakes"
            description="Banners indicating outbound webhooks dispatches and worker diagnostics."
            checked={systemNotifications}
            onChange={(val) => onChange("systemNotifications", val)}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Notification Channels (Placeholders)" description="Setup external conduits for alert dispatches.">
        <div className="space-y-4">
          <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500">📧 SMTP Email Alerts</p>
              <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">Dispatch notification alerts directly to business email inbox.</p>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-100 shrink-0">STUB PLACEHOLDER</span>
          </div>

          <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500">📱 Mobile Push Notifications</p>
              <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">Send transaction triggers to native iOS or Android devices via Firebase Cloud Messaging.</p>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-100 shrink-0">STUB PLACEHOLDER</span>
          </div>

          <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500">🌐 Desktop Browser Push</p>
              <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">Leverage HTML5 push channels to display floating canvas alerts during workday hours.</p>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-100 shrink-0">STUB PLACEHOLDER</span>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};

// -------------------------------------------------
// 9. AISettingsCard
// -------------------------------------------------
interface AISettingsCardProps {
  provider: string;
  model: string;
  temperature: number;
  responseLength: "short" | "balanced" | "detailed";
  dailyBriefing: boolean;
  aiCoaching: boolean;
  leadSummary: boolean;
  meetingPreparation: boolean;
  followUpSuggestions: boolean;
  confidenceThreshold: number;
  onFieldChange: (key: string, val: any) => void;
}

export const AISettingsCard: React.FC<AISettingsCardProps> = ({
  provider,
  model,
  temperature,
  responseLength,
  dailyBriefing,
  aiCoaching,
  leadSummary,
  meetingPreparation,
  followUpSuggestions,
  confidenceThreshold,
  onFieldChange
}) => {
  return (
    <div className="space-y-5 text-left">
      <SettingsCard title="LLM Optimization Weights & Provider Options" description="Calibrate temperature variance thresholds and output parameters.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectSetting
            id="ai-provider"
            label="🧠 Primary AI Core Provider"
            value={provider}
            onChange={(val) => onFieldChange("provider", val)}
            options={[
              { value: "gemini", label: "Google Gemini (Active)" },
              { value: "openai", label: "OpenAI GPT (Stub Sandbox)" },
              { value: "claude", label: "Anthropic Claude (Stub Sandbox)" }
            ]}
          />
          <SelectSetting
            id="ai-model"
            label="✨ Active Reasoning Model"
            value={model}
            onChange={(val) => onFieldChange("model", val)}
            options={
              provider === "gemini"
                ? [
                    { value: "gemini-1.5-pro", label: "gemini-1.5-pro (High reasoning context)" },
                    { value: "gemini-1.5-flash", label: "gemini-1.5-flash (Low latency)" }
                  ]
                : provider === "openai"
                ? [
                    { value: "gpt-4o", label: "gpt-4o (Enterprise default)" },
                    { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo (Drafting sandbox)" }
                  ]
                : [
                    { value: "claude-3-5-sonnet", label: "claude-3.5-sonnet-v2 (Precision drafts)" },
                    { value: "claude-3-haiku", label: "claude-3-haiku (Rapid execution)" }
                  ]
            }
          />
        </div>

        {/* Temperature slider */}
        <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-bold text-[#2F2F2F] flex items-center gap-1.5">
              <Zap size={13} className="text-amber-500" />
              Intelligence Temperature Variance
            </span>
            <span className="font-mono font-bold bg-[#E5E3E7] text-[#2F2F2F] px-2 py-0.5 rounded-sm">
              {temperature}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={temperature}
            onChange={(e) => onFieldChange("temperature", parseFloat(e.target.value))}
            className="w-full accent-gray-700 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-gray-400 font-medium">
            <span>0.1 (Strict Deductions)</span>
            <span>0.7 (Standard Executive Balance)</span>
            <span>1.0 (Dynamic Drafting)</span>
          </div>
        </div>

        {/* Response length */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectSetting
            id="ai-length"
            label="📝 Draft Summary Output Format"
            value={responseLength}
            onChange={(val) => onFieldChange("responseLength", val)}
            options={[
              { value: "short", label: "Short Bulleted Traces" },
              { value: "balanced", label: "Balanced Paragraph with Highlights" },
              { value: "detailed", label: "Detailed Deep Analysis" }
            ]}
          />
          <div className="space-y-1.5">
            <label htmlFor="ai-threshold" className="text-xs font-semibold text-[#2F2F2F]">
              🛡️ Propensity Confidence Sieve
            </label>
            <div className="relative">
              <input
                id="ai-threshold"
                type="number"
                min={1}
                max={100}
                value={confidenceThreshold}
                onChange={(e) => onFieldChange("confidenceThreshold", Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F] font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-gray-400">%</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-normal">Ignore AI predictions under this confidence threshold on lead metrics dashboards.</p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Model Feature Gateways" description="Select which platform components use background AI inference pipelines.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <ToggleSetting
            id="ai-briefing"
            label="📅 Morning Mission Summarizer"
            description="Generates dynamic, daily workspace briefings compiled automatically on login."
            checked={dailyBriefing}
            onChange={(val) => onFieldChange("dailyBriefing", val)}
          />
          <ToggleSetting
            id="ai-coaching"
            label="💡 Real-time Sales Coach"
            description="Bridges training recommendations with live lead metrics."
            checked={aiCoaching}
            onChange={(val) => onFieldChange("aiCoaching", val)}
          />
          <ToggleSetting
            id="ai-summary"
            label="📝 Automated Lead Synthesis"
            description="Synthesizes customer activity logs and emails to outline status summaries."
            checked={leadSummary}
            onChange={(val) => onFieldChange("leadSummary", val)}
          />
          <ToggleSetting
            id="ai-preparation"
            label="⚡ Meeting Brief Compilers"
            description="Inspects previous lead logs to draft talking points and objection-handling guidelines."
            checked={meetingPreparation}
            onChange={(val) => onFieldChange("meetingPreparation", val)}
          />
          <ToggleSetting
            id="ai-suggestions"
            label="✉️ Smart Draft Suggestions"
            description="Creates check-in templates dynamically utilizing the active sales representative's voice."
            checked={followUpSuggestions}
            onChange={(val) => onFieldChange("followUpSuggestions", val)}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Prompt Debug Sandbox (Placeholder)" description="Debug context window configurations.">
        <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500">🧪 Model Temperature Debug Logger</p>
            <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">Logs prompt schemas and context length tokens on the browser console for evaluation.</p>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-100 shrink-0">STUB PLACEHOLDER</span>
        </div>
      </SettingsCard>
    </div>
  );
};

// -------------------------------------------------
// 10. SecurityCard
// -------------------------------------------------
export const SecurityCard: React.FC = () => {
  return (
    <div className="space-y-5 text-left" id="security-control-card">
      <SettingsCard title="Access Credentials Management" description="Enforce secure login guidelines and passwords keys">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase font-mono">Password Configuration</span>
            <p className="text-xs font-semibold text-gray-600">Last changed: 3 months ago</p>
          </div>
          <div className="flex justify-start sm:justify-end">
            <Button variant="secondary" size="sm" onClick={() => alert("Change Password Stub Triggered:\nAuthentication changes are disabled as per instructions.")}>
              Change Account Password
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-xs font-bold text-[#2F2F2F]">Two-Factor Authorization (2FA)</p>
            <p className="text-[10px] text-gray-400 leading-relaxed">Secure your account using dynamic authenticator key sieves.</p>
          </div>
          <span className="text-[10px] px-2 py-1 bg-amber-50 border border-amber-100 text-amber-700 font-bold rounded">UNCONFIGURED</span>
        </div>
      </SettingsCard>

      <SettingsCard title="Live Sessions & Audit Register (Stubs)" description="A full audit tree tracking current connected agents.">
        <div className="space-y-3.5">
          <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <p className="font-bold text-[#2F2F2F]">Chrome Browser - New York, USA</p>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Current Session</span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">IP: 192.168.1.1 — Active 2 minutes ago</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs opacity-75">
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-600">Safari Mobile - iPhone 15 Pro</p>
              <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Logged Out</span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">IP: 74.125.19.14 — 3 days ago</p>
          </div>

          <div className="border-t border-gray-100 pt-3 text-center">
            <button
              onClick={() => alert("Audit Logs download is coming soon!")}
              className="text-[10px] font-bold text-gray-400 hover:text-[#2F2F2F] uppercase tracking-wider font-mono"
            >
              📥 Download Workspace Access Audits CSV
            </button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};

// -------------------------------------------------
// 11. SaveBar
// -------------------------------------------------
interface SaveBarProps {
  hasChanges: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  onSave: () => void;
  onReset: () => void;
}

export const SaveBar: React.FC<SaveBarProps> = ({
  hasChanges,
  isSaving,
  saveSuccess,
  onSave,
  onReset
}) => {
  if (!hasChanges && !isSaving && !saveSuccess) return null;

  return (
    <div
      id="settings-save-alert-bar"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-fade-in"
    >
      <div className="bg-[#2F2F2F] text-white p-4.5 rounded-xl border border-gray-700/60 shadow-xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          {isSaving ? (
            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
          ) : saveSuccess ? (
            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-amber-400 shrink-0" />
          )}

          <div className="text-left">
            <p className="text-xs font-bold leading-normal">
              {isSaving
                ? "Synchronizing Control Center..."
                : saveSuccess
                ? "Settings updated successfully"
                : "You have unsaved changes in settings!"}
            </p>
            <p className="text-[10px] text-gray-300 leading-none mt-0.5">
              {isSaving
                ? "Deploying changes to local instance"
                : saveSuccess
                ? "Roster state and rules updated"
                : "Click Save to commit configurations"}
            </p>
          </div>
        </div>

        {!isSaving && !saveSuccess && (
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-2.5 py-1.5 hover:bg-white/10 rounded-lg text-[11px] font-bold transition-all text-gray-300 cursor-pointer"
              type="button"
            >
              Reset
            </button>
            <button
              onClick={onSave}
              className="px-3.5 py-1.5 bg-white text-[#2F2F2F] hover:bg-gray-100 rounded-lg text-[11px] font-bold transition-all shadow-xs cursor-pointer"
              type="button"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------
// 12. SettingsSidebar
// -------------------------------------------------
interface SettingsSidebarProps {
  categories: { id: string; label: string; desc: string; icon: string }[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="space-y-4" id="settings-control-sidebar">
      {/* Search Input */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search size={14} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search categories & settings..."
          className="w-full pl-9 pr-4 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
          aria-label="Filter settings tabs"
        />
      </div>

      {/* Categories stack list */}
      <div className="space-y-1 overflow-y-auto max-h-[600px] pr-1" role="tablist">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full p-3 text-left rounded-lg transition-all flex flex-col cursor-pointer ${
                isActive
                  ? "bg-[#4E4E49] text-white shadow-xs"
                  : "bg-transparent text-[#666666] hover:bg-[#E5E3E7]/40 hover:text-[#2F2F2F]"
              }`}
            >
              <span className="text-xs font-bold flex items-center gap-2">
                <span>{cat.label}</span>
              </span>
              <span className={`text-[9px] mt-0.5 leading-snug truncate ${isActive ? "text-gray-200" : "text-gray-400"}`}>
                {cat.desc}
              </span>
            </button>
          );
        })}

        {categories.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6 font-medium italic">No category matches</p>
        )}
      </div>
    </div>
  );
};
