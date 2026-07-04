/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedFileType = "csv" | "xlsx" | "xls" | "pdf" | "txt" | "json" | "google_sheets" | "crm_export";

export interface ImportFile {
  name: string;
  size: number;
  type: SupportedFileType;
  contentRaw?: string; // Stored content for CSV/JSON/TXT text-based parsing
  uploadedAt: string;
}

export type LeadFieldKey =
  | "company"        // Business Name
  | "name"           // Owner/Contact Name
  | "phone"          // Phone
  | "whatsapp"       // WhatsApp
  | "email"          // Email
  | "website"        // Website
  | "industry"       // Industry
  | "country"        // Country
  | "value"          // Estimated Value
  | "notes"          // Notes
  | "status"         // Status
  | "source"         // Source
  | "priority";      // Priority

export interface FieldMapping {
  fieldKey: LeadFieldKey;
  label: string;
  mappedColumn: string | null; // The column header from the file it maps to, or null if unmapped
  isRequired: boolean;
  sampleValue?: string;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  severity: "error" | "warning";
  value: string;
}

export interface ParsedRecord {
  index: number;
  rawData: Record<string, string>; // The raw key-value pairs from the file
  mappedData: Partial<Record<LeadFieldKey, string>>; // The mapped data
  validationErrors: ImportError[];
  isDuplicate: boolean;
  duplicateConfidence?: number; // 0 to 100
  duplicateLeadId?: string; // ID of existing lead it conflicts with
  duplicateMatchField?: "phone" | "email" | "website" | "company";
  importDecision: "import" | "skip" | "merge";
}

export interface ImportHistoryItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: SupportedFileType;
  uploadDate: string;
  totalRecords: number;
  importedCount: number;
  skippedCount: number;
  duplicateCount: number;
  errorCount: number;
  warningCount: number;
  processingTimeMs: number;
  assignedDailyTarget: number; // Daily lead target preference chosen during import
  status: "COMPLETED" | "PARTIAL" | "FAILED";
}

export interface ImportSettings {
  dailyLeadAssignment: number | "custom";
  customAssignmentCount?: number;
}
