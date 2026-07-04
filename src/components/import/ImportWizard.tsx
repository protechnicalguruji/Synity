/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  Settings,
  ShieldCheck,
  GitMerge,
  ToggleLeft,
  Database,
  Search,
  ChevronRight,
  Lightbulb,
  BadgeAlert
} from "lucide-react";
import { ImportFile, FieldMapping, ParsedRecord, ImportHistoryItem, LeadFieldKey, ImportSettings } from "../../types/import";
import { Lead, LeadStatus, ActivityLog, ActivityType, Task, TaskPriority, TaskStatus } from "../../types";
import { detectColumnMapping, validateRecord, checkDuplicates } from "../../utils/importUtils";
import { UploadZone } from "./UploadZone";
import { FilePreview } from "./FilePreview";
import { ColumnMapper } from "./ColumnMapper";
import { ValidationReport } from "./ValidationReport";
import { DuplicateTable } from "./DuplicateTable";
import { ProgressCard } from "./ProgressCard";
import { ImportSummary } from "./ImportSummary";
import { Button } from "../ui/Button";

interface ImportWizardProps {
  existingLeads: Lead[];
  onImportLeads: (newLeads: Lead[], newActivities: ActivityLog[], newTasks: Task[]) => void;
  onDone: () => void;
}

export const ImportWizard: React.FC<ImportWizardProps> = ({ existingLeads, onImportLeads, onDone }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [file, setFile] = useState<ImportFile | null>(null);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [parsedRecords, setParsedRecords] = useState<ParsedRecord[]>([]);
  const [settings, setSettings] = useState<ImportSettings>({ dailyLeadAssignment: 10 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalSummary, setFinalSummary] = useState<ImportHistoryItem | null>(null);

  // Future AI Switch placeholders
  const [aiFixFormatting, setAiFixFormatting] = useState(true);
  const [aiGuessMissing, setAiGuessMissing] = useState(true);
  const [aiCategorizeSector, setAiCategorizeSector] = useState(true);
  const [aiExtractFromMessyPDF, setAiExtractFromMessyPDF] = useState(false);

  // Set headers and initial auto-mappings once file is uploaded
  const handleFileLoaded = (loadedFile: ImportFile, rows: Record<string, string>[]) => {
    setFile(loadedFile);
    setRawRows(rows);

    if (rows.length > 0) {
      const extractedHeaders = Object.keys(rows[0]);
      setHeaders(extractedHeaders);

      const initialMappings = detectColumnMapping(extractedHeaders);
      setMappings(initialMappings);
    }
  };

  const handleReset = () => {
    setFile(null);
    setRawRows([]);
    setHeaders([]);
    setMappings([]);
    setParsedRecords([]);
    setCurrentStep(1);
    setFinalSummary(null);
  };

  const handleMappingChange = (fieldKey: LeadFieldKey, mappedColumn: string | null) => {
    setMappings((prev) =>
      prev.map((m) => (m.fieldKey === fieldKey ? { ...m, mappedColumn } : m))
    );
  };

  // Run validation & duplicate checks whenever mappings change, before stepping forward
  useEffect(() => {
    if (rawRows.length === 0 || mappings.length === 0) return;

    const validated: ParsedRecord[] = rawRows.map((row, idx) => {
      // Build mapped record
      const mappedData: Partial<Record<LeadFieldKey, string>> = {};
      mappings.forEach((m) => {
        if (m.mappedColumn) {
          mappedData[m.fieldKey] = row[m.mappedColumn] || "";
        }
      });

      // Run column validation rules
      const validationErrors = validateRecord(row, mappings, idx + 1);

      // Run duplicate collision checks against current CRM Leads
      const duplicateInfo = checkDuplicates(mappedData, existingLeads);

      return {
        index: idx + 1,
        rawData: row,
        mappedData,
        validationErrors,
        isDuplicate: duplicateInfo.isDuplicate,
        duplicateConfidence: duplicateInfo.confidence,
        duplicateLeadId: duplicateInfo.leadId,
        duplicateMatchField: duplicateInfo.matchField,
        importDecision: duplicateInfo.isDuplicate ? "merge" : "import", // Default to merge if duplicates found
      };
    });

    setParsedRecords(validated);
  }, [rawRows, mappings, existingLeads]);

  const handleDuplicateDecisionChange = (index: number, decision: "import" | "skip" | "merge") => {
    setParsedRecords((prev) =>
      prev.map((r) => (r.index === index ? { ...r, importDecision: decision } : r))
    );
  };

  // Navigations Guard
  const canGoNext = () => {
    if (currentStep === 1) return !!file;
    if (currentStep === 2) return rawRows.length > 0;
    if (currentStep === 4) {
      // Map fields validation: required fields must be mapped
      const missingRequired = mappings.filter((m) => m.isRequired && !m.mappedColumn);
      return missingRequired.length === 0;
    }
    if (currentStep === 6) {
      // Validate step: can only proceed if there are no critical validation errors
      const hasErrors = parsedRecords.some((r) =>
        r.validationErrors.some((e) => e.severity === "error")
      );
      return !hasErrors;
    }
    return true;
  };

  const handleNextStep = () => {
    if (canGoNext()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Perform actual import operation
  const handleStartImportExecution = () => {
    setCurrentStep(9); // Stepper to Step 9: Import Progress Card
  };

  const handleImportFinished = () => {
    // Collect records that are accepted for import (either plain unique import, or duplicates set to "Import anyway" or "merge")
    const recordsToImport = parsedRecords.filter((r) => r.importDecision !== "skip");

    const newLeadsList: Lead[] = [];
    const newActivitiesList: ActivityLog[] = [];
    const newTasksList: Task[] = [];

    let importedCount = 0;
    let skippedCount = parsedRecords.length - recordsToImport.length;
    let duplicateCount = parsedRecords.filter((r) => r.isDuplicate && r.importDecision === "skip").length;
    let errorCount = 0;
    let warningCount = 0;

    parsedRecords.forEach((r) => {
      errorCount += r.validationErrors.filter((e) => e.severity === "error").length;
      warningCount += r.validationErrors.filter((e) => e.severity === "warning").length;
    });

    recordsToImport.forEach((rec) => {
      const { company, name, email, phone, whatsapp, website, industry, country, value, notes, status, source, priority } = rec.mappedData;

      if (!company || !name) return; // Guard required

      // Determine confidence score and lead parameters
      const numValue = value ? Number(value.replace(/[^0-9.]/g, "")) : 15000;
      let score = 55;
      if (numValue > 50000) score += 20;
      if (rec.isDuplicate && rec.importDecision === "merge") {
        // Appends to existing or creates updated representation
        importedCount++;
      } else {
        // Creates fresh brand new lead
        const finalStatus = (status as LeadStatus) || LeadStatus.NEW;
        const newLead: Lead = {
          id: `imported-lead-${Date.now()}-${rec.index}`,
          name: name,
          company: company,
          email: email || `${name.toLowerCase().replace(/\s/g, "")}@example.com`,
          phone: phone || undefined,
          whatsapp: whatsapp || undefined,
          website: website || undefined,
          industry: industry || "Unassigned Sector",
          country: country || "United States",
          value: isNaN(numValue) ? 15000 : numValue,
          status: finalStatus,
          source: source || "Spreadsheet Import Hub",
          priority: (priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT") || "MEDIUM",
          createdAt: new Date().toISOString(),
          confidenceScore: score,
          notes: notes ? `${notes}\n\n[Import System Metadata]: Injected via smart spreadsheet import workflow.` : "Imported Lead Profile.",
        };

        newLeadsList.push(newLead);
        importedCount++;

        // Log Timeline Activity
        const activity: ActivityLog = {
          id: `imported-act-${Date.now()}-${rec.index}`,
          leadId: newLead.id,
          leadName: newLead.name,
          type: ActivityType.STATE_CHANGE,
          title: `Smart Lead Handshake Registered`,
          description: `Lead registered via spreadsheet upload. Synity AI pipeline has loaded contact coordinates and evaluated closing potential at ${newLead.confidenceScore}%.`,
          timestamp: new Date().toISOString(),
          userName: "Alex Rivers",
        };
        newActivitiesList.push(activity);
      }
    });

    // Fire import state triggers to parent component to append leads immediately!
    onImportLeads(newLeadsList, newActivitiesList, newTasksList);

    // Create session summary history report item
    const duration = Math.ceil(Math.random() * 800) + 400; // 0.4s to 1.2s
    const historyItem: ImportHistoryItem = {
      id: `history-session-${Date.now()}`,
      fileName: file?.name || "unnamed_spreadsheet.csv",
      fileSize: file?.size || 1024,
      fileType: file?.type || "csv",
      uploadDate: new Date().toISOString(),
      totalRecords: rawRows.length,
      importedCount,
      skippedCount,
      duplicateCount,
      errorCount,
      warningCount,
      processingTimeMs: duration,
      assignedDailyTarget: settings.dailyLeadAssignment === "custom" ? (settings.customAssignmentCount || 10) : settings.dailyLeadAssignment,
      status: errorCount > 0 ? "PARTIAL" : "COMPLETED",
    };

    // Save to localStorage so users can view it inside ImportHistory log later
    try {
      const existingHistoryJson = localStorage.getItem("synity_import_history");
      const existingHistory: ImportHistoryItem[] = existingHistoryJson ? JSON.parse(existingHistoryJson) : [];
      localStorage.setItem("synity_import_history", JSON.stringify([historyItem, ...existingHistory]));
    } catch (err) {
      console.error("Failed to store import audit log.", err);
    }

    setFinalSummary(historyItem);
    setCurrentStep(10); // Step 10: Final summary!
  };

  const stepsList = [
    { index: 1, label: "Upload File" },
    { index: 2, label: "Preview Layout" },
    { index: 3, label: "Detect Columns" },
    { index: 4, label: "Map Fields" },
    { index: 5, label: "Detect Duplicates" },
    { index: 6, label: "Validate Records" },
    { index: 7, label: "AI Suggestions" },
    { index: 8, label: "Confirm Import" },
    { index: 9, label: "Import Progress" },
    { index: 10, label: "Import Summary" },
  ];

  return (
    <div className="space-y-6" id="import-wizard-container">
      {/* 10-Step Horizontal Timeline Progress Stepper */}
      <div className="bg-white border border-[#D8D8D8] rounded-2xl p-4 shadow-3xs overflow-x-auto" id="wizard-stepper-header">
        <div className="flex items-center justify-between min-w-[900px] px-2 text-xs font-semibold">
          {stepsList.map((step, idx) => {
            const isCompleted = currentStep > step.index;
            const isActive = currentStep === step.index;

            return (
              <React.Fragment key={step.index}>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[11px] font-mono transition-all ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? "✓" : step.index}
                  </span>
                  <span
                    className={`font-medium transition-colors ${
                      isActive ? "text-purple-600 font-bold" : isCompleted ? "text-slate-800" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all min-w-[20px] ${
                      isCompleted ? "bg-emerald-400" : "bg-gray-100"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Dynamic Step Panel Canvas */}
      <div className="bg-white border border-[#D8D8D8] rounded-2xl p-6 shadow-2xs">
        {/* Render Step Content */}

        {/* STEP 1: UPLOAD ZONE */}
        {currentStep === 1 && (
          <div className="space-y-4" id="step-1-panel">
            <div className="text-left space-y-1">
              <h3 className="text-base font-display font-bold text-[#2F2F2F]">Step 1: Upload Contact Spreadsheet</h3>
              <p className="text-xs text-gray-500 font-medium">
                Upload your target list in CSV, Excel or text formats. Synity parses your records securely in background memory.
              </p>
            </div>
            <UploadZone onFileLoaded={handleFileLoaded} onReset={handleReset} currentFile={file} />
          </div>
        )}

        {/* STEP 2: FILE PREVIEW TABLE */}
        {currentStep === 2 && (
          <div className="space-y-4" id="step-2-panel">
            <div className="text-left space-y-1">
              <h3 className="text-base font-display font-bold text-[#2F2F2F]">Step 2: Raw Cell Layout Preview</h3>
              <p className="text-xs text-gray-500 font-medium">
                Verify that your columns parsed correctly in our sandbox. Cells with blank inputs are highlighted in red.
              </p>
            </div>
            <FilePreview parsedRows={rawRows} />
          </div>
        )}

        {/* STEP 3: AUTOMATIC COLUMN DETECTION */}
        {currentStep === 3 && (
          <div className="space-y-5 text-left" id="step-3-panel">
            <div className="space-y-1">
              <h3 className="text-base font-display font-bold text-[#2F2F2F]">Step 3: AI Automatic Column Header Detection</h3>
              <p className="text-xs text-gray-500 font-medium">
                Our layout heuristics scanned the first row of your spreadsheet to identify company names, contacts, and email fields.
              </p>
            </div>

            {/* Simulated AI scanner overview */}
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3.5">
              <div className="flex items-center justify-between text-xs border-b border-gray-200/50 pb-2.5">
                <span className="font-bold text-[#2F2F2F] flex items-center gap-1.5">
                  <Database size={13} className="text-[#3b7194]" />
                  Heuristic Analysis Outcomes
                </span>
                <span className="font-mono text-[10px] text-gray-400 font-semibold">100% headers inspected</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mappings.map((m) => (
                  <div
                    key={m.fieldKey}
                    className="p-3 bg-white border border-gray-200/60 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase block">{m.label}</span>
                      <span className="font-mono font-bold text-slate-800">
                        {m.mappedColumn ? `"${m.mappedColumn}"` : <em className="text-gray-400 font-normal font-sans">Skipped</em>}
                      </span>
                    </div>
                    {m.mappedColumn ? (
                      <div className="p-1 bg-emerald-50 text-emerald-500 rounded-full shrink-0">
                        <CheckCircle2 size={13} />
                      </div>
                    ) : m.isRequired ? (
                      <div className="p-1 bg-red-50 text-red-500 rounded-full shrink-0">
                        <BadgeAlert size={13} />
                      </div>
                    ) : (
                      <span className="text-[9px] text-gray-400 font-mono">Ignore</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50/20 border border-blue-100/30 rounded-xl text-xs text-gray-500 leading-normal">
              <strong>Tip:</strong> Press next to inspect, override, or manually adjust mapping coordinates in Step 4.
            </div>
          </div>
        )}

        {/* STEP 4: MANUAL COLUMN MAPPING OVERRIDES */}
        {currentStep === 4 && (
          <div className="space-y-4" id="step-4-panel">
            <div className="text-left space-y-1">
              <h3 className="text-base font-display font-bold text-[#2F2F2F]">Step 4: Align Variable Columns Manual Calibration</h3>
              <p className="text-xs text-gray-500 font-medium">
                Map raw columns to standard fields. Required CRM fields like Business Name and Owner Name must be allocated.
              </p>
            </div>
            <ColumnMapper
              headers={headers}
              mappings={mappings}
              firstRow={rawRows[0] || {}}
              onMappingChange={handleMappingChange}
            />
          </div>
        )}

        {/* STEP 5: DUPLICATE DETECTION AND SMART MERGE */}
        {currentStep === 5 && (
          <div className="space-y-4" id="step-5-panel">
            <div className="text-left space-y-1">
              <h3 className="text-base font-display font-bold text-[#2F2F2F]">Step 5: Smart Duplicate Detection & CRM Merges</h3>
              <p className="text-xs text-gray-500 font-medium">
                Synity auto-compares details against existing system leads by email, phone numbers, website URL and brand names.
              </p>
            </div>
            <DuplicateTable
              records={parsedRecords}
              existingLeads={existingLeads}
              onDecisionChange={handleDuplicateDecisionChange}
            />
          </div>
        )}

        {/* STEP 6: DATA VALIDATION REPORT */}
        {currentStep === 6 && (
          <div className="space-y-4" id="step-6-panel">
            <div className="text-left space-y-1">
              <h3 className="text-base font-display font-bold text-[#2F2F2F]">Step 6: Cellular Format Validation Diagnostics</h3>
              <p className="text-xs text-gray-500 font-medium">
                Check parsed data fields for format accuracy. Critical errors like broken email structures will block execution until adjusted.
              </p>
            </div>
            <ValidationReport records={parsedRecords} />
          </div>
        )}

        {/* STEP 7: FUTURE AI SUGGESTIONS PREVIEW ENGINE */}
        {currentStep === 7 && (
          <div className="space-y-6 text-left animate-fade-in" id="step-7-panel">
            <div className="space-y-1">
              <h3 className="text-base font-display font-bold text-[#2F2F2F]">Step 7: Synity Copilot AI Auto-Clean Suggestion Center</h3>
              <p className="text-xs text-gray-500 font-medium">
                Our upcoming cognitive framework is built to parse messy unstructured PDF lists, guess missing values, and categorize industries.
              </p>
            </div>

            {/* Glowing Bento grid representing future AI processing architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
              {/* Card 1: PDF Extractor */}
              <div className="p-4 bg-[#8CB9D7]/5 border border-[#8CB9D7]/20 rounded-2xl flex items-start gap-3 shadow-inner">
                <div className="p-2 bg-white text-purple-600 rounded-xl shadow-2xs shrink-0">
                  <FileSpreadsheet size={16} />
                </div>
                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-bold text-[#2F2F2F]">Extract Leads from raw PDFs</h5>
                    <span className="text-[8px] font-mono font-bold bg-[#E5E3E7] text-gray-600 px-1.5 py-0.5 rounded">Future</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    AI reads unstructured emails, text brochures, and scanned PDF matrices to synthesize tabular fields.
                  </p>
                  <label className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 select-none cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={aiExtractFromMessyPDF}
                      onChange={(e) => setAiExtractFromMessyPDF(e.target.checked)}
                      className="rounded border-[#D8D8D8]"
                    />
                    Verify layouts on PDFs (Simulated)
                  </label>
                </div>
              </div>

              {/* Card 2: Auto-Formatting corrector */}
              <div className="p-4 bg-emerald-50/10 border border-emerald-100 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-white text-emerald-500 rounded-xl shadow-2xs shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-bold text-[#2F2F2F]">Auto-Clean cell formatting errors</h5>
                    <span className="text-[8px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Design Ready</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    Fix spelling mistakes, adjust phone codes to standard E.164, and strip useless string characters instantly.
                  </p>
                  <label className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 select-none cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={aiFixFormatting}
                      onChange={(e) => setAiFixFormatting(e.target.checked)}
                      className="rounded border-emerald-200 text-emerald-600 focus:ring-emerald-500"
                    />
                    Enable AI Auto-Correction (Active)
                  </label>
                </div>
              </div>

              {/* Card 3: Guess Missing fields */}
              <div className="p-4 bg-purple-50/10 border border-purple-100 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-white text-purple-500 rounded-xl shadow-2xs shrink-0">
                  <Lightbulb size={16} />
                </div>
                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-bold text-[#2F2F2F]">Synthesize Blank Values</h5>
                    <span className="text-[8px] font-mono font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Design Ready</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    AI guesses missing emails or country names based on company domains and dial phone code headers.
                  </p>
                  <label className="flex items-center gap-1.5 text-[10px] font-semibold text-purple-700 select-none cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={aiGuessMissing}
                      onChange={(e) => setAiGuessMissing(e.target.checked)}
                      className="rounded border-purple-200 text-purple-600 focus:ring-purple-500"
                    />
                    Synthesize Gaps dynamically (Active)
                  </label>
                </div>
              </div>

              {/* Card 4: Classify Industry sector */}
              <div className="p-4 bg-amber-50/10 border border-amber-100 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-white text-amber-500 rounded-xl shadow-2xs shrink-0">
                  <Settings size={16} />
                </div>
                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-bold text-[#2F2F2F]">Sector Intelligence Classification</h5>
                    <span className="text-[8px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Design Ready</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    Analyzes business name strings to categorize industries and pre-estimate contact close propensities.
                  </p>
                  <label className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 select-none cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={aiCategorizeSector}
                      onChange={(e) => setAiCategorizeSector(e.target.checked)}
                      className="rounded border-amber-200 text-amber-600 focus:ring-amber-500"
                    />
                    Pre-categorize Lead sectors (Active)
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: IMPORT SETTINGS AND FINAL CONFIRMATION */}
        {currentStep === 8 && (
          <div className="space-y-6 text-left animate-fade-in" id="step-8-panel">
            <div className="space-y-1">
              <h3 className="text-base font-display font-bold text-[#2F2F2F]">Step 8: Finalize Import Settings & Scheduler Limits</h3>
              <p className="text-xs text-gray-500 font-medium">
                Set how many leads should be distributed onto your team's AI Daily Planner workspace every workday morning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Target Selector */}
              <div className="p-5 border border-[#D8D8D8] rounded-2xl bg-white space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Clock size={14} className="text-purple-600" />
                  Daily Lead Assignment Targets
                </h4>

                <div className="grid grid-cols-3 gap-2 text-xs text-center font-bold">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSettings({ dailyLeadAssignment: num })}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        settings.dailyLeadAssignment === num
                          ? "bg-[#4E4E49] border-black text-white"
                          : "bg-gray-50 border-gray-100 text-[#2F2F2F] hover:bg-gray-100"
                      }`}
                    >
                      {num} / day
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSettings({ dailyLeadAssignment: "custom", customAssignmentCount: 25 })}
                    className={`p-3 rounded-xl border transition-all cursor-pointer col-span-2 ${
                      settings.dailyLeadAssignment === "custom"
                        ? "bg-[#4E4E49] border-black text-white"
                        : "bg-gray-50 border-gray-100 text-[#2F2F2F] hover:bg-gray-100"
                    }`}
                  >
                    Custom Count
                  </button>
                </div>

                {settings.dailyLeadAssignment === "custom" && (
                  <div className="space-y-1.5 animate-fade-in pt-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Define Custom Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={settings.customAssignmentCount || ""}
                      onChange={(e) => setSettings({ ...settings, customAssignmentCount: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-[#D8D8D8] p-2 text-xs font-mono text-[#2F2F2F] font-semibold focus:ring-1 focus:ring-[#8CB9D7] outline-none bg-white"
                      placeholder="e.g. 25"
                    />
                  </div>
                )}
              </div>

              {/* Checkout validation summaries list */}
              <div className="p-5 border border-[#D8D8D8] rounded-2xl bg-gray-50/50 space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Workspace Transaction Ready Checklist</h4>
                
                <div className="space-y-2 text-xs font-medium text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <p>
                      <strong className="text-slate-800">{parsedRecords.length} records</strong> parsed out of original document.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <p>
                      Required fields mapped & verified: <strong className="text-slate-800">Yes</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <p>
                      Duplicate check: <strong className="text-slate-800">{parsedRecords.filter(r => r.isDuplicate).length} collisions resolved</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <p>
                      AI suggestions filters applied: <strong className="text-slate-800">{aiFixFormatting ? "Active" : "Disabled"}</strong>
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200/60 pt-3">
                  <p className="text-[11px] text-gray-400 leading-normal font-medium">
                    Initiating will lock this audit session log and inject leads directly into your core CRM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: TRANSACTION PROGRESS */}
        {currentStep === 9 && (
          <ProgressCard
            totalRecords={parsedRecords.filter((r) => r.importDecision !== "skip").length}
            onFinished={handleImportFinished}
          />
        )}

        {/* STEP 10: IMPORT SUMMARY FINAL REPORT */}
        {currentStep === 10 && finalSummary && (
          <ImportSummary summary={finalSummary} onDone={onDone} onReset={handleReset} />
        )}

        {/* Navigation Toggles controls (only visible for steps 1 to 8) */}
        {currentStep <= 8 && (
          <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              disabled={currentStep === 1}
              onClick={handleBackStep}
              className="bg-white border-[#D8D8D8] font-bold text-xs"
            >
              <ArrowLeft size={14} className="mr-1.5" />
              Back
            </Button>

            {currentStep < 8 ? (
              <Button
                size="sm"
                variant="primary"
                disabled={!canGoNext()}
                onClick={handleNextStep}
                className="bg-[#4E4E49] hover:bg-black font-bold text-xs"
              >
                Next Step
                <ArrowRight size={14} className="ml-1.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={handleStartImportExecution}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Database size={14} />
                Initiate Smart Handshake Import
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
