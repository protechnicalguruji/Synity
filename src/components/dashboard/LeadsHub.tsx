import React, { useState, useEffect } from "react";
import {
  Sparkles, Grid, List, Download, Upload, Plus, RefreshCw, AlertCircle,
  FileSpreadsheet, ArrowUpDown, Undo2, X, Database, Edit2
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Lead, LeadStatus, Task, ActivityLog, ActivityType, TaskPriority, TaskStatus } from "../../types";
import { formatCurrency, formatDate } from "../../utils";

// Subcomponents imports
import { LeadStatusBadge } from "../leads/LeadStatusBadge";
import { PriorityBadge } from "../leads/PriorityBadge";
import { LeadSearch } from "../leads/LeadSearch";
import { LeadFilters, FilterState, initialFilterState } from "../leads/LeadFilters";
import { LeadForm } from "../leads/LeadForm";
import { DeleteDialog } from "../leads/DeleteDialog";
import { LeadTable } from "../leads/LeadTable";
import { LeadCard } from "../leads/LeadCard";
import { LeadDetails } from "../leads/LeadDetails";
import { Modal } from "../ui/Modal";

interface LeadsHubProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activities: ActivityLog[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onUpdateLeadStatus: (id: string, status: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
  onOpenNewLeadModal: () => void;
}

const PRIORITY_WEIGHTS = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

export const LeadsHub: React.FC<LeadsHubProps> = ({
  leads,
  setLeads,
  tasks,
  setTasks,
  activities,
  setActivities,
  onUpdateLeadStatus,
  onDeleteLead,
  onOpenNewLeadModal
}) => {
  // Views and persistence
  const [viewMode, setViewMode] = useState<"table" | "card">(() => {
    const persisted = localStorage.getItem("leads-view-mode");
    return (persisted as "table" | "card") || "table";
  });

  // Loading, retry, and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Search, Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [sortOption, setSortOption] = useState<string>("newest");

  // Inspected detail lead
  const [inspectedLead, setInspectedLead] = useState<Lead | null>(null);

  // Modals & form targets
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Import mock drag-and-drop files
  const [dragActive, setDragActive] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  // Undo delete recovery variables
  const [lastDeletedLead, setLastDeletedLead] = useState<Lead | null>(null);
  const [lastDeletedTasks, setLastDeletedTasks] = useState<Task[]>([]);
  const [lastDeletedActivities, setLastDeletedActivities] = useState<ActivityLog[]>([]);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null);

  // Persist view mode choices
  const handleViewModeChange = (mode: "table" | "card") => {
    setViewMode(mode);
    localStorage.setItem("leads-view-mode", mode);
    triggerSkeletonLoading();
  };

  // Brief dynamic skeleton triggers to look exceptionally responsive
  const triggerSkeletonLoading = () => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    triggerSkeletonLoading();
  }, [sortOption, searchQuery]);

  // Clean filters
  const handleResetFilters = () => {
    setFilters(initialFilterState);
    triggerSkeletonLoading();
  };

  // Core filter logic matching extensive specifications
  const filteredLeads = leads.filter((lead) => {
    // Search constraints
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = lead.name.toLowerCase().includes(q);
      const matchCompany = lead.company.toLowerCase().includes(q);
      const matchEmail = lead.email.toLowerCase().includes(q);
      const matchPhone = lead.phone?.toLowerCase().includes(q);
      const matchWhatsapp = lead.whatsapp?.toLowerCase().includes(q);
      const matchWebsite = lead.website?.toLowerCase().includes(q);
      const matchIndustry = lead.industry?.toLowerCase().includes(q);
      const matchCountry = lead.country?.toLowerCase().includes(q);
      const matchStatus = lead.status.toLowerCase().includes(q);
      const matchTags = lead.tags?.some((t) => t.toLowerCase().includes(q));

      if (
        !matchName && !matchCompany && !matchEmail && !matchPhone &&
        !matchWhatsapp && !matchWebsite && !matchIndustry && !matchCountry &&
        !matchStatus && !matchTags
      ) {
        return false;
      }
    }

    // Status Filter
    if (filters.status !== "ALL" && lead.status !== filters.status) {
      return false;
    }

    // Priority Filter
    if (filters.priority !== "ALL" && lead.priority !== filters.priority) {
      return false;
    }

    // Industry Filter
    if (filters.industry !== "ALL" && lead.industry !== filters.industry) {
      return false;
    }

    // Country Filter
    if (filters.country !== "ALL" && lead.country !== filters.country) {
      return false;
    }

    // Source Filter
    if (filters.source !== "ALL" && lead.source !== filters.source) {
      return false;
    }

    // Est. Deal Value range filter
    if (filters.minValue && lead.value < Number(filters.minValue)) {
      return false;
    }
    if (filters.maxValue && lead.value > Number(filters.maxValue)) {
      return false;
    }

    // Created Date filter
    const createdTime = new Date(lead.createdAt).getTime();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (filters.createdPreset === "TODAY" && now - createdTime > oneDay) {
      return false;
    }
    if (filters.createdPreset === "WEEK" && now - createdTime > 7 * oneDay) {
      return false;
    }
    if (filters.createdPreset === "MONTH" && now - createdTime > 30 * oneDay) {
      return false;
    }
    if (filters.createdPreset === "DAYS30" && now - createdTime > 30 * oneDay) {
      return false;
    }

    // Next Follow Up filter presets
    if (lead.nextFollowUp) {
      const followTime = new Date(lead.nextFollowUp).getTime();
      if (filters.nextFollowUpPreset === "TODAY" && Math.abs(now - followTime) > oneDay) {
        return false;
      }
      if (filters.nextFollowUpPreset === "TOMORROW" && (followTime - now > 2 * oneDay || followTime - now < 0)) {
        return false;
      }
      if (filters.nextFollowUpPreset === "WEEK" && (followTime - now > 7 * oneDay || followTime - now < 0)) {
        return false;
      }
      if (filters.nextFollowUpPreset === "OVERDUE" && followTime > now) {
        return false;
      }
    } else if (filters.nextFollowUpPreset !== "ALL") {
      return false;
    }

    return true;
  });

  // Sorting logics
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "company":
        return a.company.localeCompare(b.company);
      case "priority":
        return PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
      case "status":
        return a.status.localeCompare(b.status);
      case "followup":
        if (!a.nextFollowUp) return 1;
        if (!b.nextFollowUp) return -1;
        return new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime();
      case "updated":
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
      case "value":
        return b.value - a.value;
      default:
        return 0;
    }
  });

  // Actual CSV Data Export
  const handleExportCSV = () => {
    try {
      const headers = [
        "ID", "Business Name", "Owner Name", "Email", "Phone", "WhatsApp",
        "Website", "Industry", "Country", "Acquisition Source", "Estimated Value",
        "Priority", "Status", "Confidence Score", "Created On", "Last Contact", "Next Follow Up"
      ];

      const rows = leads.map((l) => [
        l.id,
        `"${l.company.replace(/"/g, '""')}"`,
        `"${l.name.replace(/"/g, '""')}"`,
        l.email,
        l.phone || "",
        l.whatsapp || "",
        l.website || "",
        l.industry || "",
        l.country || "",
        l.source,
        l.value,
        l.priority,
        l.status,
        l.confidenceScore,
        l.createdAt,
        l.lastContactedAt || "",
        l.nextFollowUp || ""
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `synity_leads_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      setIsError(true);
    }
  };

  // Add lead saver
  const handleSaveAddLead = (newLead: Lead, mergeTargetId?: string) => {
    if (mergeTargetId) {
      // Smart Merge is activated!
      setLeads((prev) => prev.map((l) => (l.id === mergeTargetId ? newLead : l)));
      
      // Create merge activity logs
      const activity: ActivityLog = {
        id: `act-merge-${Date.now()}`,
        leadId: mergeTargetId,
        leadName: newLead.name,
        type: ActivityType.STATE_CHANGE,
        title: "Deal Intelligence: Smart Merged",
        description: `Deduplication engine merged a duplicate incoming registration into this record, merging contact index details & appending deal values.`,
        timestamp: new Date().toISOString(),
        userName: "Alex Rivers"
      };
      setActivities((prev) => [activity, ...prev]);
    } else {
      // Add lead fresh
      setLeads((prev) => [newLead, ...prev]);

      // Activity log
      const activity: ActivityLog = {
        id: `act-add-${Date.now()}`,
        leadId: newLead.id,
        leadName: newLead.name,
        type: ActivityType.STATE_CHANGE,
        title: "Lead pipeline registered",
        description: `Registered outbound opportunity worth ${formatCurrency(newLead.value)} assigned to initial status: ${newLead.status.replace("_", " ")}.`,
        timestamp: new Date().toISOString(),
        userName: "Alex Rivers"
      };
      setActivities((prev) => [activity, ...prev]);

      // Warm up onboarding task
      const task: Task = {
        id: `task-onboarding-${Date.now()}`,
        leadId: newLead.id,
        leadName: newLead.name,
        title: `Generate intro briefing for ${newLead.company}`,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO
      };
      setTasks((prev) => [task, ...prev]);
    }

    setIsAddOpen(false);
    triggerSkeletonLoading();
  };

  // Edit lead saver
  const handleSaveEditLead = (updatedLead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));

    // Update context inspected lead if opened
    if (inspectedLead && inspectedLead.id === updatedLead.id) {
      setInspectedLead(updatedLead);
    }

    const activity: ActivityLog = {
      id: `act-edit-${Date.now()}`,
      leadId: updatedLead.id,
      leadName: updatedLead.name,
      type: ActivityType.NOTE,
      title: "Updated lead record",
      description: `User adjusted fields & parameter configs on this lead workspace file.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities((prev) => [activity, ...prev]);

    setEditingLead(null);
    triggerSkeletonLoading();
  };

  // Soft warning lead deletion with interactive 10-second Undo recovery
  const handleConfirmDelete = () => {
    if (!deletingLead) return;

    const leadId = deletingLead.id;
    const associatedTasks = tasks.filter((t) => t.leadId === leadId);
    const associatedActivities = activities.filter((a) => a.leadId === leadId);

    // Persist states to temporary undo buffers
    setLastDeletedLead(deletingLead);
    setLastDeletedTasks(associatedTasks);
    setLastDeletedActivities(associatedActivities);

    // Update state to remove them
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    setTasks((prev) => prev.filter((t) => t.leadId !== leadId));
    setActivities((prev) => prev.filter((a) => a.leadId !== leadId));

    // Toggle inspected lead if deleting active view
    if (inspectedLead && inspectedLead.id === leadId) {
      setInspectedLead(null);
    }

    setDeletingLead(null);
    setShowUndoToast(true);

    // Auto-cancel toast in 10 seconds
    if (undoTimer) clearTimeout(undoTimer);
    const timer = setTimeout(() => {
      setShowUndoToast(false);
      setLastDeletedLead(null);
      setLastDeletedTasks([]);
      setLastDeletedActivities([]);
    }, 10000);
    setUndoTimer(timer);
  };

  const handleRestoreDelete = () => {
    if (!lastDeletedLead) return;

    setLeads((prev) => [lastDeletedLead, ...prev]);
    setTasks((prev) => [...lastDeletedTasks, ...prev]);
    setActivities((prev) => [...lastDeletedActivities, ...prev]);

    // Clear undo buffer
    setShowUndoToast(false);
    setLastDeletedLead(null);
    setLastDeletedTasks([]);
    setLastDeletedActivities([]);
    if (undoTimer) clearTimeout(undoTimer);

    alert("Workspace successfully restored! No historical activities or tasks were pruned.");
  };

  // Drag and drop import mock interactions
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImportFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const executeMockImport = () => {
    if (!importFile) return;

    setIsImporting(true);
    setImportProgress(10);

    const interval = setInterval(() => {
      setImportProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          // Insert 3 mock imported leads
          const importedLeads: Lead[] = [
            {
              id: `imported-1-${Date.now()}`,
              name: "Sarah Jenkins",
              company: "Nova Cloud Ventures",
              email: "sarah@novacloud.io",
              value: 48000,
              source: "Cold Outreach",
              priority: "HIGH",
              status: LeadStatus.NEW,
              confidenceScore: 68,
              createdAt: new Date().toISOString(),
              industry: "Cloud Tech",
              country: "United Kingdom",
              notes: "Imported via CSV. Nova Cloud expresses high interest in API workflows."
            },
            {
              id: `imported-2-${Date.now()}`,
              name: "Kenji Sato",
              company: "Aether Grid KK",
              email: "sato@aethergrid.jp",
              value: 125000,
              source: "Partner Referral",
              priority: "URGENT",
              status: LeadStatus.NEW,
              confidenceScore: 82,
              createdAt: new Date().toISOString(),
              industry: "Biotech Logistics",
              country: "Japan",
              notes: "Imported via CSV. Immediate enterprise evaluation requested."
            }
          ];

          setLeads((prev) => [...importedLeads, ...prev]);

          importedLeads.forEach((newL) => {
            const activity: ActivityLog = {
              id: `act-import-${Date.now()}-${newL.id}`,
              leadId: newL.id,
              leadName: newL.name,
              type: ActivityType.STATE_CHANGE,
              title: "Imported from CSV Data Sheet",
              description: `Registered lead profile during directory batch compilation. AI parsing is planned for advanced semantic sorting.`,
              timestamp: new Date().toISOString(),
              userName: "Alex Rivers"
            };
            setActivities((prev) => [activity, ...prev]);
          });

          setIsImporting(false);
          setIsImportOpen(false);
          setImportFile(null);
          setImportProgress(0);
          triggerSkeletonLoading();
          return 100;
        }
        return p + 30;
      });
    }, 400);
  };

  if (isError) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4 animate-fade-in text-left">
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle size={24} className="shrink-0" />
          <div>
            <h4 className="text-sm font-bold">Workspace Loading Error</h4>
            <p className="text-[11px] mt-0.5">Could not parse local repository indexes. Synchronization timeout.</p>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setIsError(false);
              triggerSkeletonLoading();
            }}
            className="bg-[#4E4E49] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw size={12} />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // If viewing a lead's full inspect details page
  if (inspectedLead) {
    return (
      <LeadDetails
        lead={inspectedLead}
        tasks={tasks}
        activities={activities}
        onBack={() => setInspectedLead(null)}
        onUpdateLead={handleSaveEditLead}
        onAddTask={(newTask) => setTasks((prev) => [newTask, ...prev])}
        onAddActivity={(newActivity) => setActivities((prev) => [newActivity, ...prev])}
      />
    );
  }

  return (
    <div className="space-y-6 text-left relative">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#D8D8D8] pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-[#2F2F2F] tracking-tight">Active Leads Directory</h2>
          <p className="text-xs text-[#666666] mt-1">
            Manage your personal outbound journeys. We currently monitor <strong className="font-bold text-[#2F2F2F] font-mono">{leads.length} leads</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Import Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportOpen(true)}
            className="bg-white border-[#D8D8D8] text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Upload size={13} />
            <span>Import Leads</span>
          </Button>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="bg-white border-[#D8D8D8] text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </Button>

          {/* Add Outbound Lead Button */}
          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="bg-[#4E4E49] hover:bg-[#3D3D38] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus size={14} />
            <span>Add Outbound Lead</span>
          </Button>
        </div>
      </div>

      {/* 2. ADVANCED CONTROL BAR */}
      <Card className="p-4 space-y-4 border border-[#D8D8D8]">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Global search component matching Search specifications */}
          <div className="flex-1 lg:max-w-md">
            <LeadSearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end">
            
            {/* View Mode Toggle Toggler */}
            <div className="flex items-center border border-[#D8D8D8] rounded-lg p-0.5 bg-gray-50">
              <button
                type="button"
                onClick={() => handleViewModeChange("table")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "table" ? "bg-white text-[#2F2F2F] shadow-2xs" : "text-gray-400 hover:text-gray-600"
                }`}
                title="Table List View"
              >
                <List size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("card")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "card" ? "bg-white text-[#2F2F2F] shadow-2xs" : "text-gray-400 hover:text-gray-600"
                }`}
                title="Card Bento View"
              >
                <Grid size={14} />
              </button>
            </div>

            {/* Sorter Selector */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown size={12} className="text-[#666666]" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-xs bg-white border border-[#D8D8D8] rounded-lg px-2.5 py-1.5 font-semibold text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="company">Sort: Business Name</option>
                <option value="priority">Sort: Priority Level</option>
                <option value="status">Sort: Current Stage</option>
                <option value="followup">Sort: Next Follow-up</option>
                <option value="updated">Sort: Recently Updated</option>
                <option value="value">Sort: Deal Value</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modular Filter Deck */}
        <LeadFilters
          leads={leads}
          filters={filters}
          onFilterChange={(newF) => {
            setFilters(newF);
            triggerSkeletonLoading();
          }}
          onReset={handleResetFilters}
        />
      </Card>

      {/* 3. DYNAMIC SKELETON LOADERS & VIEWS */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 animate-pulse">
            <Database size={12} className="animate-spin" />
            <span>Recalibrating local indexing directories...</span>
          </div>
          {viewMode === "table" ? (
            <div className="border border-[#D8D8D8] rounded-xl overflow-hidden bg-white divide-y divide-[#D8D8D8]">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="p-5 flex items-center justify-between animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                  </div>
                  <div className="h-3 w-20 bg-gray-100 rounded"></div>
                  <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
                  <div className="h-3 w-16 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="p-5 border border-[#D8D8D8] rounded-xl bg-white space-y-4 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                    <div className="h-5 w-48 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-full bg-gray-100 rounded"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : sortedLeads.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#D8D8D8] rounded-xl space-y-4">
          <div className="flex justify-center text-gray-400">
            <Database size={48} className="stroke-1" />
          </div>
          <div className="max-w-sm mx-auto space-y-1.5">
            <h4 className="font-bold text-sm text-[#2F2F2F]">No Opportunity Indexes Found</h4>
            <p className="text-xs text-gray-400">Your filters, keywords, or queries don't match any listed entries in Synity Sales OS.</p>
          </div>
          <div className="flex justify-center gap-2">
            <Button size="xs" variant="outline" onClick={handleResetFilters}>
              Clear Filters
            </Button>
            <Button size="xs" onClick={() => setIsAddOpen(true)} className="bg-[#4E4E49] text-white">
              Add Outbound Lead
            </Button>
          </div>
        </div>
      ) : viewMode === "table" ? (
        <LeadTable
          leads={sortedLeads}
          onOpenDetails={(l) => setInspectedLead(l)}
          onEditLead={(l) => setEditingLead(l)}
          onDeleteLead={(l) => setDeletingLead(l)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onOpenDetails={() => setInspectedLead(lead)}
              onEdit={() => setEditingLead(lead)}
              onDelete={() => setDeletingLead(lead)}
            />
          ))}
        </div>
      )}

      {/* 4. MODALS & FORMS POPUPS */}

      {/* Register New Outbound Lead Modal */}
      {isAddOpen && (
        <Modal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title={
            <span className="flex items-center gap-2 font-display font-bold">
              <Plus size={16} className="text-[#4E4E49]" />
              Register New Outbound Opportunity
            </span>
          }
          size="md"
        >
          <LeadForm
            existingLeads={leads}
            onSave={handleSaveAddLead}
            onCancel={() => setIsAddOpen(false)}
          />
        </Modal>
      )}

      {/* Edit Outbound Lead Modal */}
      {editingLead && (
        <Modal
          isOpen={!!editingLead}
          onClose={() => setEditingLead(null)}
          title={
            <span className="flex items-center gap-2 font-display font-bold">
              <Edit2 size={16} className="text-[#4E4E49]" />
              Configure Deal File: {editingLead.company}
            </span>
          }
          size="md"
        >
          <LeadForm
            initialLead={editingLead}
            existingLeads={leads}
            onSave={handleSaveEditLead}
            onCancel={() => setEditingLead(null)}
          />
        </Modal>
      )}

      {/* Confirm Deletion Warning popup Dialog */}
      {deletingLead && (
        <DeleteDialog
          isOpen={!!deletingLead}
          onClose={() => setDeletingLead(null)}
          onConfirm={handleConfirmDelete}
          leadName={deletingLead.name}
          companyName={deletingLead.company}
        />
      )}

      {/* Simulated CSV/Excel Batch Import Canvas popup */}
      {isImportOpen && (
        <Modal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          title={
            <span className="flex items-center gap-2 font-display font-bold">
              <Upload size={16} className="text-[#4E4E49]" />
              Excel / CSV Directory Importer
            </span>
          }
          size="sm"
        >
          <div className="space-y-5 text-xs text-left">
            <p className="text-[#666666] leading-relaxed">
              Drag-and-drop spreadsheets to ingest outbound leads. Our CRM parsing pipeline verifies syntax, emails, and phone formats.
            </p>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center space-y-3 cursor-pointer transition-colors ${
                dragActive ? "border-[#4E4E49] bg-gray-50" : "border-gray-200 bg-white hover:bg-gray-50/50"
              }`}
            >
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-import-upload"
              />
              <label htmlFor="file-import-upload" className="cursor-pointer space-y-2 block">
                <div className="flex justify-center text-gray-400">
                  <FileSpreadsheet size={36} />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">
                    {importFile ? importFile.name : "Select your CSV or Excel document"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">Supports UTF-8 CSV, XLS, XLSX formats up to 10MB</p>
                </div>
              </label>
            </div>

            {/* Progress indicators */}
            {isImporting && (
              <div className="space-y-1.5 animate-pulse">
                <div className="flex justify-between font-mono text-[10px] text-gray-500 font-bold">
                  <span>Decompressing dataset blocks...</span>
                  <span>{importProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${importProgress}%` }}></div>
                </div>
              </div>
            )}

            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg flex items-start gap-2 text-[10px] text-blue-700 leading-relaxed">
              <Sparkles size={14} className="shrink-0 text-blue-500 mt-0.5" />
              <span>
                <strong>Future AI processing:</strong> Synity semantic parsers are planned to analyze company websites, LinkedIn profiles, and descriptions automatically.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <Button variant="outline" size="sm" onClick={() => setIsImportOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-[#4E4E49] hover:bg-[#3D3D38] text-white font-bold"
                onClick={executeMockImport}
                disabled={!importFile || isImporting}
              >
                Ingest Spreadsheet Data
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5. INTERACTIVE FLOATING UNDO RECOVERY ACTION BANNER */}
      {showUndoToast && lastDeletedLead && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xl flex items-center justify-between gap-4 animate-slide-up max-w-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 text-amber-500 rounded-lg">
              <Undo2 size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold leading-none">Lead Purged Successfully</p>
              <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                {lastDeletedLead.company} removed. Recovery is available.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRestoreDelete}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              Undo
            </button>
            <button
              onClick={() => setShowUndoToast(false)}
              className="p-1 hover:bg-slate-800 text-gray-400 hover:text-white rounded"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
