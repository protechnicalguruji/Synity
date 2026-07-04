/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useTransition } from "react";
import {
  Settings,
  User,
  Database,
  Bell,
  Sparkles,
  Target,
  Clock,
  Kanban,
  Zap,
  MessageSquare,
  ArrowLeftRight,
  Palette,
  Shield,
  Cpu,
  CreditCard,
  Sliders,
  Info,
  Lock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  FileText
} from "lucide-react";

import { useAISettings } from "../../lib/ai/hooks/useAI";
import { GlobalSettingsState, SettingsCategory } from "../../types/settings";
import { INITIAL_SETTINGS_STATE, SETTINGS_CATEGORIES } from "./settingsMockData";
import {
  SettingsSection,
  SettingsCard,
  ToggleSetting,
  InputSetting,
  SelectSetting,
  ThemeSelector,
  WorkspaceCard,
  NotificationCard,
  AISettingsCard,
  SecurityCard,
  SaveBar,
  SettingsSidebar
} from "./settingsComponents";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export const SettingsView: React.FC = () => {
  // Sync with existing AI context
  const { settings: activeAiContext, updateSettings: updateAiContext } = useAISettings();

  // Core persistent state inside Settings
  const [savedState, setSavedState] = useState<GlobalSettingsState>(() => {
    const local = localStorage.getItem("synity_global_settings");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return INITIAL_SETTINGS_STATE;
      }
    }
    return INITIAL_SETTINGS_STATE;
  });

  // Current working state
  const [workingState, setWorkingState] = useState<GlobalSettingsState>({ ...savedState });

  // Navigation and Search
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Loader and Error Simulators for professional UX
  const [isLoadingSection, setIsLoadingSection] = useState(false);
  const [simulationError, setSimulationError] = useState(false);

  // Unsaved Changes and Saving trackers
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Keep working state aligned with active AI Hook Context
  useEffect(() => {
    setWorkingState((prev) => ({
      ...prev,
      ai: {
        ...prev.ai,
        provider: activeAiContext.provider,
        model: activeAiContext.model,
        temperature: activeAiContext.temperature
      }
    }));
  }, [activeAiContext]);

  // Deep structural dirty check
  const hasChanges = JSON.stringify(workingState) !== JSON.stringify(savedState);

  // Simulate tab lazy loading transition
  const handleSelectCategory = (id: SettingsCategory) => {
    setIsLoadingSection(true);
    setTimeout(() => {
      startTransition(() => {
        setActiveCategory(id);
      });
      setIsLoadingSection(false);
    }, 280);
  };

  // Generic state modifier
  const updateField = <T extends keyof GlobalSettingsState, K extends keyof GlobalSettingsState[T]>(
    section: T,
    field: K,
    value: GlobalSettingsState[T][K]
  ) => {
    setWorkingState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Commit changes globally
  const handleSaveAll = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      // Sync with Synity AI service if provider details altered
      updateAiContext({
        provider: workingState.ai.provider,
        model: workingState.ai.model,
        temperature: workingState.ai.temperature
      });

      // Commit to LocalStorage
      localStorage.setItem("synity_global_settings", JSON.stringify(workingState));
      setSavedState({ ...workingState });
      
      setIsSaving(false);
      setSaveSuccess(true);

      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  // Rollback modified fields to last saved state
  const handleResetAll = () => {
    setWorkingState({ ...savedState });
  };

  // Category filter based on query search
  const filteredCategories = SETTINGS_CATEGORIES.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return cat.label.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto px-1" id="synity-settings-center">
      
      {/* Page Title header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D8D8D8] pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-[#2F2F2F] tracking-tight flex items-center gap-2">
            <Settings size={20} className="text-gray-500" />
            <span>Control Center & Workspace Settings</span>
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Calibrate pipeline rules, target targets, communication nodes, and Google Cloud Gemini API model integrations.
          </p>
        </div>

        {/* Diagnostic Toggle to showcase Professional Error State UI */}
        <button
          onClick={() => setSimulationError(!simulationError)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider border uppercase transition-all shrink-0 cursor-pointer ${
            simulationError
              ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
              : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
          title="Toggle sandbox error state for evaluation"
        >
          {simulationError ? "⚠️ Simulated Error Active" : "🛠️ Simulate Error State"}
        </button>
      </div>

      {simulationError ? (
        /* Professional Retry and Error UI State */
        <div className="bg-white rounded-xl border border-rose-200 p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-12 shadow-sm">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-full mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="font-sans font-bold text-[#2F2F2F] text-lg">Failed to bind config services</h3>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-sm">
            The workspace control center was unable to handshake with Synity Background Rule Workers due to a simulated sandbox timeout.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setSimulationError(false)}
              className="px-4 py-2 bg-[#4E4E49] hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Retry Control Connection</span>
            </button>
          </div>
        </div>
      ) : (
        /* Standard Layout: Two Column Responsive Grid */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* Left Navigation Category List Sidebar (1 Col) */}
          <div className="md:col-span-1">
            <SettingsSidebar
              categories={filteredCategories}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Right Detailed Settings Form Content View (3 Cols) */}
          <div className="md:col-span-3 space-y-6 bg-white/40 p-1 rounded-xl min-h-[500px]">
            {isLoadingSection || isPending ? (
              /* Premium lazy loading skeleton placeholder layout */
              <div className="space-y-5 animate-pulse" id="settings-loading-skeleton">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="space-y-3 bg-white p-5 rounded-xl border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-10 bg-gray-100 rounded w-full" />
                  <div className="h-10 bg-gray-100 rounded w-5/6" />
                </div>
                <div className="space-y-3 bg-white p-5 rounded-xl border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-20 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ) : (
              /* Settings tab components router */
              <div role="tabpanel" aria-label={`${activeCategory} panel`}>
                
                {/* 1. SECTION: GENERAL */}
                {activeCategory === "general" && (
                  <SettingsSection id="general" title="General Settings" description="Modify your primary workspace branding, company information, timezone, language, and locale formatting.">
                    <SettingsCard title="Workspace Profile Branding">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputSetting
                          id="gen-ws-name"
                          label="Workspace Title"
                          value={workingState.general.workspaceName}
                          onChange={(val) => {
                            updateField("general", "workspaceName", val);
                            updateField("workspace", "name", val);
                          }}
                        />
                        <InputSetting
                          id="gen-ws-logo"
                          label="Workspace Logo (Direct Image Link URL)"
                          value={workingState.general.workspaceLogo}
                          onChange={(val) => updateField("general", "workspaceLogo", val)}
                        />
                      </div>
                    </SettingsCard>

                    <SettingsCard title="Corporate Identity Credentials">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputSetting
                          id="gen-corp-name"
                          label="Legally Registered Company Name"
                          value={workingState.general.companyName}
                          onChange={(val) => updateField("general", "companyName", val)}
                        />
                        <InputSetting
                          id="gen-corp-email"
                          label="Operations Contact Email"
                          type="email"
                          value={workingState.general.businessEmail}
                          onChange={(val) => updateField("general", "businessEmail", val)}
                        />
                        <InputSetting
                          id="gen-corp-phone"
                          label="Operations Contact Phone"
                          value={workingState.general.businessPhone}
                          onChange={(val) => updateField("general", "businessPhone", val)}
                        />
                        <InputSetting
                          id="gen-corp-web"
                          label="Company Website"
                          value={workingState.general.website}
                          onChange={(val) => updateField("general", "website", val)}
                        />
                      </div>
                    </SettingsCard>

                    <SettingsCard title="Locale & Regional Adjustments">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <SelectSetting
                          id="gen-timezone"
                          label="Default Timezone"
                          value={workingState.general.timezone}
                          onChange={(val) => updateField("general", "timezone", val)}
                          options={[
                            { value: "America/New_York", label: "America/New_York (EST)" },
                            { value: "America/Los_Angeles", label: "America/Los_Angeles (PST)" },
                            { value: "Europe/London", label: "Europe/London (GMT)" },
                            { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" }
                          ]}
                        />
                        <SelectSetting
                          id="gen-lang"
                          label="Preferred Interface Language"
                          value={workingState.general.language}
                          onChange={(val) => updateField("general", "language", val)}
                          options={[
                            { value: "en-US", label: "English (US)" },
                            { value: "en-GB", label: "English (UK)" },
                            { value: "es-ES", label: "Español (ES)" },
                            { value: "fr-FR", label: "Français (FR)" }
                          ]}
                        />
                        <SelectSetting
                          id="gen-currency"
                          label="Deal Valuation Currency"
                          value={workingState.general.currency}
                          onChange={(val) => updateField("general", "currency", val)}
                          options={[
                            { value: "USD", label: "US Dollar ($)" },
                            { value: "EUR", label: "Euro (€)" },
                            { value: "GBP", label: "Pound Sterling (£)" },
                            { value: "JPY", label: "Yen (¥)" }
                          ]}
                        />
                        <SelectSetting
                          id="gen-date-format"
                          label="Preferred Date Format"
                          value={workingState.general.dateFormat}
                          onChange={(val) => updateField("general", "dateFormat", val)}
                          options={[
                            { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                            { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                            { value: "YYYY-MM-DD", label: "YYYY-MM-DD" }
                          ]}
                        />
                        <SelectSetting
                          id="gen-time-format"
                          label="Preferred Time Format"
                          value={workingState.general.timeFormat}
                          onChange={(val) => updateField("general", "timeFormat", val)}
                          options={[
                            { value: "12h", label: "12-Hour (AM/PM)" },
                            { value: "24h", label: "24-Hour Military" }
                          ]}
                        />
                      </div>
                    </SettingsCard>

                    <div className="flex justify-start">
                      <Button onClick={handleSaveAll} variant="primary" size="sm">
                        Save System Changes
                      </Button>
                    </div>
                  </SettingsSection>
                )}

                {/* 2. SECTION: WORKSPACE */}
                {activeCategory === "workspace" && (
                  <SettingsSection id="workspace" title="Workspace Controls" description="Configure physical identifiers and monitor workspace-wide member quotas.">
                    <WorkspaceCard
                      name={workingState.workspace.name}
                      slug={workingState.workspace.slug}
                      id={workingState.workspace.id}
                      createdAt={workingState.workspace.createdAt}
                      memberCount={workingState.workspace.memberCount}
                      status={workingState.workspace.status}
                      onSlugChange={(val) => updateField("workspace", "slug", val)}
                    />
                  </SettingsSection>
                )}

                {/* 3. SECTION: PROFILE */}
                {activeCategory === "profile" && (
                  <SettingsSection id="profile" title="Identity Profile" description="Change your profile picture, display name, contact information, job title, and brief resume bio.">
                    <SettingsCard title="Individual Identity Metrics">
                      <div className="flex flex-col sm:flex-row items-center gap-5 pb-2">
                        <img
                          src={workingState.profile.photo}
                          alt="User Profile"
                          className="w-16 h-16 rounded-full object-cover border border-[#D8D8D8] shadow-xs"
                        />
                        <div className="space-y-1.5 flex-1 w-full text-center sm:text-left">
                          <InputSetting
                            id="prof-photo-url"
                            label="Photo Link URL"
                            value={workingState.profile.photo}
                            onChange={(val) => updateField("profile", "photo", val)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputSetting
                          id="prof-fullname"
                          label="Full Display Name"
                          value={workingState.profile.fullName}
                          onChange={(val) => updateField("profile", "fullName", val)}
                        />
                        <InputSetting
                          id="prof-email"
                          label="Direct Contact Email"
                          type="email"
                          value={workingState.profile.email}
                          onChange={(val) => updateField("profile", "email", val)}
                        />
                        <InputSetting
                          id="prof-phone"
                          label="Direct Phone Number"
                          value={workingState.profile.phone}
                          onChange={(val) => updateField("profile", "phone", val)}
                        />
                        <InputSetting
                          id="prof-title"
                          label="Official Job Title"
                          value={workingState.profile.jobTitle}
                          onChange={(val) => updateField("profile", "jobTitle", val)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="prof-bio" className="text-xs font-semibold text-[#2F2F2F]">Direct Bio Statement</label>
                        <textarea
                          id="prof-bio"
                          rows={3}
                          value={workingState.profile.bio}
                          onChange={(e) => updateField("profile", "bio", e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                        />
                      </div>
                    </SettingsCard>

                    <SettingsCard title="Authentication Sandboxes (Placeholders)">
                      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-500">🔒 Dynamic Password Adjuster</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">Reset system login security credentials securely.</p>
                        </div>
                        <Badge variant="primary" size="sm">Sandbox Only</Badge>
                      </div>

                      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-500">🛡️ Multi-Factor 2FA Sieve</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">Enforces authenticator keys on secure logins.</p>
                        </div>
                        <Badge variant="primary" size="sm">Sandbox Only</Badge>
                      </div>
                    </SettingsCard>
                  </SettingsSection>
                )}

                {/* 4. SECTION: NOTIFICATIONS */}
                {activeCategory === "notifications" && (
                  <SettingsSection id="notifications" title="Dispatch Alerts Center" description="Fine-tune alert triggers for meetings, follow-ups, and AI recommendations.">
                    <NotificationCard
                      meetings={workingState.notifications.meetings}
                      followUps={workingState.notifications.followUps}
                      tasks={workingState.notifications.tasks}
                      callbacks={workingState.notifications.callbacks}
                      achievements={workingState.notifications.achievements}
                      aiNotifications={workingState.notifications.aiNotifications}
                      systemNotifications={workingState.notifications.systemNotifications}
                      onChange={(key, val) => updateField("notifications", key as any, val)}
                    />
                  </SettingsSection>
                )}

                {/* 5. SECTION: AI SETTINGS */}
                {activeCategory === "ai" && (
                  <SettingsSection id="ai" title="AI Sales Copilot Engine" description="Configure reasoning models, response formatting, and temperature constraints used by Gemini.">
                    <AISettingsCard
                      provider={workingState.ai.provider}
                      model={workingState.ai.model}
                      temperature={workingState.ai.temperature}
                      responseLength={workingState.ai.responseLength}
                      dailyBriefing={workingState.ai.dailyBriefing}
                      aiCoaching={workingState.ai.aiCoaching}
                      leadSummary={workingState.ai.leadSummary}
                      meetingPreparation={workingState.ai.meetingPreparation}
                      followUpSuggestions={workingState.ai.followUpSuggestions}
                      confidenceThreshold={workingState.ai.confidenceThreshold}
                      onFieldChange={(key, val) => updateField("ai", key as any, val)}
                    />
                  </SettingsSection>
                )}

                {/* 6. SECTION: SALES */}
                {activeCategory === "sales" && (
                  <SettingsSection id="sales" title="Commercial Quotas & Sales Targets" description="Calibrate revenue goals, closed deal volumes, and workload thresholds.">
                    <SettingsCard title="Daily Operational Performance Targets">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InputSetting
                          id="sales-call-tgt"
                          label="Daily Calls Volume"
                          type="number"
                          value={workingState.sales.dailyCallTarget}
                          onChange={(val) => updateField("sales", "dailyCallTarget", val)}
                          unit="calls"
                        />
                        <InputSetting
                          id="sales-followup-tgt"
                          label="Daily Follow-ups Target"
                          type="number"
                          value={workingState.sales.dailyFollowUpTarget}
                          onChange={(val) => updateField("sales", "dailyFollowUpTarget", val)}
                          unit="tasks"
                        />
                        <InputSetting
                          id="sales-meeting-tgt"
                          label="Daily Meetings Goal"
                          type="number"
                          value={workingState.sales.dailyMeetingTarget}
                          onChange={(val) => updateField("sales", "dailyMeetingTarget", val)}
                          unit="meets"
                        />
                        <InputSetting
                          id="sales-proposal-tgt"
                          label="Daily Proposals Goal"
                          type="number"
                          value={workingState.sales.dailyProposalTarget}
                          onChange={(val) => updateField("sales", "dailyProposalTarget", val)}
                          unit="docs"
                        />
                      </div>
                    </SettingsCard>

                    <SettingsCard title="Corporate Revenue Objectives & Capacity Caps">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InputSetting
                          id="sales-revenue-goal"
                          label="Monthly Revenue Quota"
                          type="number"
                          value={workingState.sales.monthlyRevenueGoal}
                          onChange={(val) => updateField("sales", "monthlyRevenueGoal", val)}
                          unit="USD"
                        />
                        <InputSetting
                          id="sales-deal-goal"
                          label="Monthly Won Deals Quota"
                          type="number"
                          value={workingState.sales.monthlyDealGoal}
                          onChange={(val) => updateField("sales", "monthlyDealGoal", val)}
                          unit="deals"
                        />
                        <div className="space-y-1.5">
                          <label htmlFor="sales-workload-limit" className="text-xs font-semibold text-[#2F2F2F]">Max Optimal Workload Cap</label>
                          <div className="relative">
                            <input
                              id="sales-workload-limit"
                              type="number"
                              min={10}
                              max={100}
                              value={workingState.sales.workloadLimit}
                              onChange={(e) => updateField("sales", "workloadLimit", Number(e.target.value))}
                              className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F] font-semibold"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-gray-400">%</span>
                          </div>
                          <p className="text-[9px] text-gray-400 mt-1 leading-normal">Flags warnings in the Morning Planner when representatives exceed capacity limits.</p>
                        </div>
                      </div>
                    </SettingsCard>
                  </SettingsSection>
                )}

                {/* 7. SECTION: BUSINESS HOURS */}
                {activeCategory === "hours" && (
                  <SettingsSection id="hours" title="Business Hours & Working Schedules" description="Configure representative working schedules, default time boundaries, and vacation parameters.">
                    <SettingsCard title="Weekly Operational Schedule">
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-[#2F2F2F] block">Select Working Days</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                            const isSelected = workingState.businessHours.workingDays.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => {
                                  const updated = isSelected
                                    ? workingState.businessHours.workingDays.filter((d) => d !== day)
                                    : [...workingState.businessHours.workingDays, day];
                                  updateField("businessHours", "workingDays", updated);
                                }}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-[#4E4E49] text-white border-[#4E4E49]"
                                    : "bg-white text-gray-500 border-[#D8D8D8] hover:bg-gray-50"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-100 pt-4">
                        <InputSetting
                          id="hours-work-start"
                          label="Office Start Time"
                          type="time"
                          value={workingState.businessHours.workingHoursStart}
                          onChange={(val) => updateField("businessHours", "workingHoursStart", val)}
                        />
                        <InputSetting
                          id="hours-work-end"
                          label="Office Dismissal Time"
                          type="time"
                          value={workingState.businessHours.workingHoursEnd}
                          onChange={(val) => updateField("businessHours", "workingHoursEnd", val)}
                        />
                        <InputSetting
                          id="hours-lunch-start"
                          label="Lunch Break Start"
                          type="time"
                          value={workingState.businessHours.lunchBreakStart}
                          onChange={(val) => updateField("businessHours", "lunchBreakStart", val)}
                        />
                        <InputSetting
                          id="hours-lunch-end"
                          label="Lunch Break End"
                          type="time"
                          value={workingState.businessHours.lunchBreakEnd}
                          onChange={(val) => updateField("businessHours", "lunchBreakEnd", val)}
                        />
                      </div>
                    </SettingsCard>

                    <SettingsCard title="Time-Off & Scheduled Vacation overrides">
                      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-500">🌴 Global Holidays & Paid Time Off Calendar</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">Import calendar holiday files to ignore task deadlines on national holiday blocks.</p>
                        </div>
                        <Badge variant="primary" size="sm">Sandbox Placeholder</Badge>
                      </div>

                      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-500">🏖️ Out-Of-Office Vacation Mode</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">Redirects inbound pipeline leads automatically to alternative teammates while vacation is active.</p>
                        </div>
                        <Badge variant="primary" size="sm">Sandbox Placeholder</Badge>
                      </div>
                    </SettingsCard>
                  </SettingsSection>
                )}

                {/* 8. SECTION: PIPELINE */}
                {activeCategory === "pipeline" && (
                  <SettingsSection id="pipeline" title="Pipeline Customizations" description="Configure visual board configurations, pipeline stage orderings, and card indicator styles.">
                    <SettingsCard title="Stage Assignments & Custom Board Colors">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <SelectSetting
                            id="pipe-default"
                            label="Default Pipeline Board View"
                            value={workingState.pipeline.defaultPipeline}
                            onChange={(val) => updateField("pipeline", "defaultPipeline", val)}
                            options={[
                              { value: "Core Enterprise", label: "Core Enterprise High-Value" },
                              { value: "SME Outbound", label: "SME Outbound Velocity" },
                              { value: "Partnerships", label: "Partnerships & Channel Distribution" }
                            ]}
                          />
                          <SelectSetting
                            id="pipe-def-priority"
                            label="Default Task Card Priority"
                            value={workingState.pipeline.defaultPriority}
                            onChange={(val) => updateField("pipeline", "defaultPriority", val)}
                            options={[
                              { value: "LOW", label: "LOW Priority" },
                              { value: "MEDIUM", label: "MEDIUM Priority" },
                              { value: "HIGH", label: "HIGH Priority" }
                            ]}
                          />
                        </div>

                        <div className="space-y-2 border-t border-gray-100 pt-3">
                          <span className="text-xs font-bold text-[#2F2F2F] block">Configure Stage Header Palette Hex Codes</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.entries(workingState.pipeline.stageColors).map(([stage, color]) => (
                              <div key={stage} className="flex items-center gap-2.5 p-2 bg-gray-50 border border-gray-100 rounded-lg">
                                <input
                                  type="color"
                                  value={color}
                                  onChange={(e) => {
                                    const nextColors = { ...workingState.pipeline.stageColors, [stage]: e.target.value };
                                    updateField("pipeline", "stageColors", nextColors);
                                  }}
                                  className="h-7 w-7 rounded cursor-pointer border border-[#D8D8D8]"
                                />
                                <div className="text-left font-mono">
                                  <p className="text-[10px] font-bold text-[#2F2F2F]">{stage}</p>
                                  <p className="text-[9px] text-gray-400 uppercase font-bold">{color}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-500">🪄 Auto Stage Recommender</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">Leverage customer interaction history to auto-advance cards to next steps.</p>
                          </div>
                          <Badge variant="primary" size="sm">Coming Soon</Badge>
                        </div>
                      </div>
                    </SettingsCard>
                  </SettingsSection>
                )}

                {/* 9. SECTION: AUTOMATION */}
                {activeCategory === "automation" && (
                  <SettingsSection id="automation" title="Automation Settings Override" description="Control global settings for the Synity Workflow Orchestrator.">
                    <SettingsCard title="Global Controls">
                      <ToggleSetting
                        id="auto-enabled-global"
                        label="⚡ Enable Workspace Workflows Orchestrator"
                        description="If disabled, all active rules will remain cached but paused from execution."
                        checked={workingState.automation.enabled}
                        onChange={(val) => updateField("automation", "enabled", val)}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                        <SelectSetting
                          id="auto-fail-behavior"
                          label="Default Error Behavior Override"
                          value={workingState.automation.defaultRuleBehavior}
                          onChange={(val) => updateField("automation", "defaultRuleBehavior", val as any)}
                          options={[
                            { value: "HALT", label: "HALT: Freeze entire pipeline chain" },
                            { value: "CONTINUE", label: "CONTINUE: Skip failed block, resume next" }
                          ]}
                        />
                      </div>
                    </SettingsCard>

                    <SettingsCard title="Operational Limits & Logging Registers (Placeholders)">
                      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-500">⏳ Concurrency Throttle Limits</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">Defines the maximum automated operations permitted per lead per hour to avoid spam flags.</p>
                        </div>
                        <Badge variant="primary" size="sm">Sandbox Placeholder</Badge>
                      </div>

                      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-500">📄 Rule Triggers Logging Storage</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">Configure retention periods for audit trails and webhook payload history registers.</p>
                        </div>
                        <Badge variant="primary" size="sm">Sandbox Placeholder</Badge>
                      </div>
                    </SettingsCard>
                  </SettingsSection>
                )}

                {/* 10. SECTION: COMMUNICATION */}
                {activeCategory === "communication" && (
                  <SettingsSection id="communication" title="Connected Communication Sockets" description="Manage outbound transaction bridges for SMTP, WhatsApp template dispatches, and calendars.">
                    <SettingsCard title="VoIP Channels & Connection Overrides">
                      <div className="space-y-3.5">
                        <ToggleSetting
                          id="comm-email"
                          label="📧 Outbound SMTP Email Sockets"
                          description="Connected directly using workspace environment mail routers. Handles follow-ups drafting."
                          checked={workingState.communication.emailConnected}
                          onChange={(val) => updateField("communication", "emailConnected", val)}
                        />
                        <ToggleSetting
                          id="comm-cal"
                          label="📅 Google Calendar Synchronizer"
                          description="Active token session. Pulls upcoming events and cross-references task schedules."
                          checked={workingState.communication.calendarConnected}
                          onChange={(val) => updateField("communication", "calendarConnected", val)}
                        />
                        <ToggleSetting
                          id="comm-twilio"
                          label="📞 Twilio Outbound Voice VoIP"
                          description="Active session. Handles automated callback trigger voice loops."
                          checked={workingState.communication.twilioConnected}
                          onChange={(val) => updateField("communication", "twilioConnected", val)}
                        />
                      </div>
                    </SettingsCard>

                    <SettingsCard title="Pending Connections (Placeholders)">
                      {[
                        { id: "slack", label: "💬 Slack Integration Node", desc: "Push closed deal summaries and notifications directly to sales-wins channels." },
                        { id: "whatsapp", label: "📱 WhatsApp Cloud API Sockets", desc: "Dispatch business WhatsApp template messages on new interested lead triggers." },
                        { id: "zoom", label: "🎥 Zoom Meeting Host Sockets", desc: "Provision video meeting links automatically inside scheduled tasks." }
                      ].map((item) => (
                        <div key={item.id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-500">{item.label}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">{item.desc}</p>
                          </div>
                          <Button variant="secondary" size="xs" onClick={() => alert(`${item.label} connection window is simulated inside sandboxed environment!`)}>
                            Connect Node
                          </Button>
                        </div>
                      ))}
                    </SettingsCard>
                  </SettingsSection>
                )}

                {/* 11. SECTION: IMPORT & EXPORT */}
                {activeCategory === "import" && (
                  <SettingsSection id="import" title="Data Portability Hub" description="Fine-tune lead CSV schema matching mappings, duplicates filtering strategy, and backup exports format.">
                    <SettingsCard title="CSV Mapping Configuration">
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-[#2F2F2F] block">Inbound Header Mapping Registers</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.entries(workingState.importExport.defaultImportMapping).map(([csvHeader, leadField]) => (
                            <div key={csvHeader} className="space-y-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">CSV Header: "{csvHeader}"</span>
                              <select
                                value={leadField}
                                onChange={(e) => {
                                  const updated = { ...workingState.importExport.defaultImportMapping, [csvHeader]: e.target.value };
                                  updateField("importExport", "defaultImportMapping", updated);
                                }}
                                className="w-full text-xs p-1.5 border border-[#D8D8D8] rounded-md bg-white text-[#2F2F2F] font-semibold"
                              >
                                <option value="name">Lead Contact Name</option>
                                <option value="company">Business Company Name</option>
                                <option value="email">Direct Contact Email</option>
                                <option value="phone">Direct Contact Phone</option>
                                <option value="value">Estimated Deal value</option>
                                <option value="priority">Lead Priority Flag</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SettingsCard>

                    <SettingsCard title="Duplicates Sieve & Backups Export Settings">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SelectSetting
                          id="import-duplicate"
                          label="On Encountering Identical Email/Phone"
                          value={workingState.importExport.duplicateStrategy}
                          onChange={(val) => updateField("importExport", "duplicateStrategy", val as any)}
                          options={[
                            { value: "MERGE", label: "MERGE: Appends recent logs, keep oldest info" },
                            { value: "SKIP", label: "SKIP: Ignores conflicting rows completely" },
                            { value: "OVERWRITE", label: "OVERWRITE: Overwrites completely with CSV values" }
                          ]}
                        />
                        <SelectSetting
                          id="export-format"
                          label="Default Output Format for Backups"
                          value={workingState.importExport.defaultExportFormat}
                          onChange={(val) => updateField("importExport", "defaultExportFormat", val as any)}
                          options={[
                            { value: "CSV", label: "Comma Separated Values (.csv)" },
                            { value: "JSON", label: "JavaScript Object Notation (.json)" },
                            { value: "XLSX", label: "Microsoft Excel Document (.xlsx)" }
                          ]}
                        />
                      </div>

                      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between mt-3">
                        <div>
                          <p className="text-xs font-bold text-gray-500">🪄 Auto Merge Engine</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">Intelligently clean, parse, and auto-merge duplicate customer profiles on CSV import.</p>
                        </div>
                        <Badge variant="primary" size="sm">Available</Badge>
                      </div>
                    </SettingsCard>
                  </SettingsSection>
                )}

                {/* 12. SECTION: APPEARANCE */}
                {activeCategory === "appearance" && (
                  <SettingsSection id="appearance" title="Branding Themes & Visual Densities" description="Select UI color templates, density settings, and animation constraints.">
                    <SettingsCard title="Display Styling Profiles">
                      <ThemeSelector
                        value={workingState.appearance.theme}
                        onChange={(val) => updateField("appearance", "theme", val)}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                        <ToggleSetting
                          id="app-compact"
                          label="📐 Compact Table Mode"
                          description="Reduces margins and table paddings to display heavy data rows."
                          checked={workingState.appearance.compactMode}
                          onChange={(val) => updateField("appearance", "compactMode", val)}
                        />
                        <ToggleSetting
                          id="app-animations"
                          label="🎬 Motion Layout Transitions"
                          description="Toggles slide-in route transitions and hover zoom interactions."
                          checked={workingState.appearance.animations}
                          onChange={(val) => updateField("appearance", "animations", val)}
                        />
                        <ToggleSetting
                          id="app-reduced-motion"
                          label="♿ Reduced Motion Mode"
                          description="Disables layout shifts entirely to ease screen readability."
                          checked={workingState.appearance.reducedMotion}
                          onChange={(val) => {
                            updateField("appearance", "reducedMotion", val);
                            if (val) {
                              updateField("appearance", "animations", false);
                            }
                          }}
                        />
                      </div>

                      <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-500">🎨 Accent Color Theme (Placeholder)</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">Choose your custom company brand color palette to personalize headers.</p>
                        </div>
                        <Badge variant="primary" size="sm">Coming Soon</Badge>
                      </div>
                    </SettingsCard>
                  </SettingsSection>
                )}

                {/* 13. SECTION: SECURITY */}
                {activeCategory === "security" && (
                  <SettingsSection id="security" title="Security & Authentication Sieve" description="Calibrate security rules and audits logs. Changes must not modify actual auth profiles as per guidelines.">
                    <SecurityCard />
                  </SettingsSection>
                )}

                {/* 14. SECTION: INTEGRATIONS */}
                {activeCategory === "integrations" && (
                  <SettingsSection id="integrations" title="Integration Hub Architecture" description="Configure secure API keys, and background webhooks stubs. Only mock placeholders allowed.">
                    <SettingsCard title="Available Platform Nodes">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { id: "google-workspace", label: "Google Workspace & Gmail", status: "Active Connected", color: "bg-emerald-500" },
                          { id: "google-calendar", label: "Google Calendar scheduling", status: "Active Connected", color: "bg-emerald-500" },
                          { id: "gemini-api", label: "Google Cloud Gemini SDK core", status: "Active Connected", color: "bg-emerald-500" },
                          { id: "openai-api", label: "OpenAI GPT Developer Hub", status: "Inactive Placeholder", color: "bg-gray-300" },
                          { id: "stripe-billing", label: "Stripe Subscriptions Gateway", status: "Inactive Placeholder", color: "bg-gray-300" },
                          { id: "zapier-engine", label: "Zapier Automated Triggers", status: "Inactive Placeholder", color: "bg-gray-300" },
                          { id: "make-engine", label: "Make.com Flow Webhooks", status: "Inactive Placeholder", color: "bg-gray-300" },
                          { id: "outbound-webhooks", label: "Outbound Webhooks Dispatches", status: "Active Connected", color: "bg-emerald-500" }
                        ].map((node) => (
                          <div key={node.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between text-xs">
                            <div className="space-y-1">
                              <p className="font-bold text-[#2F2F2F]">{node.label}</p>
                              <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-mono font-bold uppercase">
                                <span className={`h-1.5 w-1.5 rounded-full ${node.color}`} />
                                <span>{node.status}</span>
                              </div>
                            </div>
                            <Button variant="secondary" size="xs" onClick={() => alert(`${node.label} settings view is sandbox restricted.`)}>
                              Configure
                            </Button>
                          </div>
                        ))}
                      </div>
                    </SettingsCard>
                  </SettingsSection>
                )}

                {/* 15. SECTION: BILLING */}
                {activeCategory === "billing" && (
                  <SettingsSection id="billing" title="Billing & Plans (Placeholder)" description="Billing details and plans subscriptions. External checkout APIs must not be linked.">
                    <SettingsCard title="Subscription Plan Overview">
                      <div className="p-4.5 bg-gradient-to-tr from-[#4E4E49] to-black text-white rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-xs uppercase tracking-wider font-bold text-gray-300 font-mono">Synity Sales OS</p>
                          <Badge variant="success" size="sm">PRO ENTERPRISE TIER</Badge>
                        </div>
                        <h4 className="text-xl font-bold tracking-tight">Rivers Agency Limited Workspace</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          Enjoying complete, unrestricted capabilities including automated multi-stage workflows, portfolio-wide Gemini insights, and high-velocity outbound VoIP bridges.
                        </p>
                        <div className="border-t border-white/20 pt-2.5 flex justify-between items-center text-xs">
                          <span>Next Invoice: Aug 15, 2026 ($249/mo)</span>
                          <span className="font-mono font-bold">14 Seats Active</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-xs font-bold text-[#2F2F2F] block mb-2">Invoice Downloads</span>
                        <div className="space-y-2">
                          {[
                            { date: "June 15, 2026", num: "INV-RIVERS-92384", val: "$249.00" },
                            { date: "May 15, 2026", num: "INV-RIVERS-87429", val: "$249.00" }
                          ].map((inv) => (
                            <div key={inv.num} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between text-xs">
                              <div className="text-left font-mono">
                                <p className="font-bold text-[#2F2F2F]">{inv.num}</p>
                                <p className="text-[10px] text-gray-400">{inv.date}</p>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <span className="font-bold text-gray-700">{inv.val}</span>
                                <button
                                  onClick={() => alert(`Simulated downloading invoice ${inv.num}...`)}
                                  className="p-1 hover:bg-gray-200 rounded text-[#8E44AD]"
                                  title="Download PDF"
                                >
                                  <FileText size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SettingsCard>
                  </SettingsSection>
                )}

                {/* 16. SECTION: ADVANCED */}
                {activeCategory === "advanced" && (
                  <SettingsSection id="advanced" title="Advanced Control Center" description="Toggle experimental platform feature flags, test performance logs, and manage sandbox development modes.">
                    <SettingsCard title="Operational Feature Flags">
                      <div className="space-y-3.5">
                        {Object.entries(workingState.advanced.featureFlags).map(([flag, active]) => (
                          <ToggleSetting
                            key={flag}
                            id={`flag-${flag}`}
                            label={`📌 Experimental Feature: ${flag.replace(/-/g, " ").toUpperCase()}`}
                            description="Test incoming platform upgrades instantly before general rollout."
                            checked={active}
                            onChange={(val) => {
                              const updated = { ...workingState.advanced.featureFlags, [flag]: val };
                              updateField("advanced", "featureFlags", updated);
                            }}
                          />
                        ))}

                        <div className="border-t border-gray-100 pt-3 space-y-3.5">
                          <ToggleSetting
                            id="adv-experimental"
                            label="🔮 Enable Experimental AI Engines"
                            description="Unlocks beta models configurations and allows live debugging traces inside execution consoles."
                            checked={workingState.advanced.experimentalFeatures}
                            onChange={(val) => updateField("advanced", "experimentalFeatures", val)}
                          />
                          <ToggleSetting
                            id="adv-dev-mode"
                            label="🛠️ Developer Diagnostics HUD"
                            description="Displays diagnostic overlays indicating server request/response timings and database queries latency."
                            checked={workingState.advanced.developerMode}
                            onChange={(val) => updateField("advanced", "developerMode", val)}
                          />
                        </div>
                      </div>
                    </SettingsCard>
                  </SettingsSection>
                )}

                {/* 17. SECTION: ABOUT */}
                {activeCategory === "about" && (
                  <SettingsSection id="about" title="About Synity Sales OS" description="Workspace environment variables and platform details.">
                    <SettingsCard title="Platform Information">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <span className="text-xs font-semibold text-gray-500">Workspace Build Version</span>
                          <span className="font-mono text-xs font-bold text-[#2F2F2F]">v3.4.1-Stable (Enterprise)</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <span className="text-xs font-semibold text-gray-500">API Gateway Handshake</span>
                          <Badge variant="success" size="sm">ACTIVE CONDUIT</Badge>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <span className="text-xs font-semibold text-gray-500">Underlying Database</span>
                          <span className="font-mono text-xs font-bold text-gray-500">Firebase Firestore Cloud Sync</span>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <span className="text-xs font-bold text-[#2F2F2F]">Platform Release Notes</span>
                          <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs leading-relaxed text-gray-600">
                            <p className="font-bold text-[#2F2F2F]">🚨 Recent Upgrade v3.4.1</p>
                            <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-500">
                              <li>Added comprehensive multi-stage corporate AI Workflow triggers.</li>
                              <li>Optimized daily morning planners compilation timings by 40%.</li>
                              <li>Upgraded local settings synchronization rules caches.</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4 pt-1 text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">
                          <button onClick={() => alert("Simulated showing Privacy Policy...")} className="hover:underline hover:text-[#2F2F2F]">Privacy Policy</button>
                          <span>•</span>
                          <button onClick={() => alert("Simulated showing Terms of Service...")} className="hover:underline hover:text-[#2F2F2F]">Terms of Service</button>
                        </div>
                      </div>
                    </SettingsCard>
                  </SettingsSection>
                )}

              </div>
            )}
          </div>

        </div>
      )}

      {/* Save bar floating helper */}
      <SaveBar
        hasChanges={hasChanges}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onSave={handleSaveAll}
        onReset={handleResetAll}
      />

    </div>
  );
};
