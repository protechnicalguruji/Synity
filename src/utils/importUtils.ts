/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead, LeadStatus } from "../types";
import { FieldMapping, ImportError, ParsedRecord, SupportedFileType, LeadFieldKey } from "../types/import";

// Check if a string is a valid email
export const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

// Check if a string is a valid website
export const validateWebsite = (url: string): boolean => {
  if (!url) return false;
  const re = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/.*)?$/;
  return re.test(url);
};

// Check if a phone looks reasonable
export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;
  // Strip spaces, dashes, parentheses, plus signs
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  return cleaned.length >= 7 && cleaned.length <= 15;
};

// Auto-detection heuristics for file headers mapping to Synity fields
export const detectColumnMapping = (headers: string[]): FieldMapping[] => {
  const standardFields: { key: LeadFieldKey; label: string; isRequired: boolean; patterns: RegExp[] }[] = [
    {
      key: "company",
      label: "Business Name (Company)",
      isRequired: true,
      patterns: [/company/i, /business/i, /firm/i, /organization/i, /org/i, /brand/i, /empresa/i],
    },
    {
      key: "name",
      label: "Owner / Contact Name",
      isRequired: true,
      patterns: [/name/i, /contact/i, /owner/i, /person/i, /lead/i, /nombre/i, /client/i],
    },
    {
      key: "email",
      label: "Email Address",
      isRequired: true,
      patterns: [/email/i, /mail/i, /correo/i, /e-mail/i],
    },
    {
      key: "phone",
      label: "Phone Connection",
      isRequired: false,
      patterns: [/phone/i, /tel/i, /mobile/i, /telephone/i, /telefono/i, /celular/i],
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      isRequired: false,
      patterns: [/whatsapp/i, /wa/i, /chat/i],
    },
    {
      key: "website",
      label: "Corporate Website",
      isRequired: false,
      patterns: [/website/i, /web/i, /url/i, /domain/i, /sitio/i, /link/i],
    },
    {
      key: "industry",
      label: "Industry Sector",
      isRequired: false,
      patterns: [/industry/i, /sector/i, /niche/i, /category/i, /rubro/i],
    },
    {
      key: "country",
      label: "Country / Location",
      isRequired: false,
      patterns: [/country/i, /location/i, /region/i, /state/i, /city/i, /pais/i],
    },
    {
      key: "value",
      label: "Estimated Deal Value ($)",
      isRequired: false,
      patterns: [/value/i, /worth/i, /deal/i, /amount/i, /budget/i, /price/i, /monto/i, /revenue/i],
    },
    {
      key: "notes",
      label: "Executive Context / Notes",
      isRequired: false,
      patterns: [/notes/i, /note/i, /comment/i, /context/i, /description/i, /summary/i, /notas/i],
    },
    {
      key: "status",
      label: "Initial Deal Stage",
      isRequired: false,
      patterns: [/status/i, /stage/i, /state/i, /fase/i, /estado/i],
    },
    {
      key: "source",
      label: "Acquisition Source",
      isRequired: false,
      patterns: [/source/i, /channel/i, /medium/i, /origin/i, /referral/i, /origen/i],
    },
    {
      key: "priority",
      label: "Deal Priority",
      isRequired: false,
      patterns: [/priority/i, /rank/i, /importance/i, /prioridad/i],
    },
  ];

  return standardFields.map((field) => {
    let bestMatch: string | null = null;
    let maxScore = -1;

    for (const header of headers) {
      const hClean = header.trim().toLowerCase();
      for (const pattern of field.patterns) {
        if (pattern.test(hClean)) {
          // Exact matches are scored higher
          const score = hClean === field.key || hClean.includes(field.key) ? 10 : 5;
          if (score > maxScore) {
            maxScore = score;
            bestMatch = header;
          }
        }
      }
    }

    return {
      fieldKey: field.key,
      label: field.label,
      isRequired: field.isRequired,
      mappedColumn: bestMatch,
    };
  });
};

// Validate individual row based on mapped columns
export const validateRecord = (
  rawData: Record<string, string>,
  mappings: FieldMapping[],
  rowIndex: number
): ImportError[] => {
  const errors: ImportError[] = [];

  for (const map of mappings) {
    const rawVal = map.mappedColumn ? rawData[map.mappedColumn] || "" : "";
    const cleanVal = rawVal.trim();

    // Required check
    if (map.isRequired && !cleanVal) {
      errors.push({
        row: rowIndex,
        field: map.label,
        message: `Required field is missing.`,
        severity: "error",
        value: cleanVal,
      });
      continue;
    }

    // Skip validation for empty optional values
    if (!cleanVal) continue;

    // Field-specific validation
    if (map.fieldKey === "email") {
      if (!validateEmail(cleanVal)) {
        errors.push({
          row: rowIndex,
          field: map.label,
          message: "Email format is invalid.",
          severity: "error",
          value: cleanVal,
        });
      }
    } else if (map.fieldKey === "phone") {
      if (!validatePhone(cleanVal)) {
        errors.push({
          row: rowIndex,
          field: map.label,
          message: "Phone format appears unusual (expected 7-15 digits).",
          severity: "warning",
          value: cleanVal,
        });
      }
    } else if (map.fieldKey === "whatsapp") {
      if (!validatePhone(cleanVal)) {
        errors.push({
          row: rowIndex,
          field: map.label,
          message: "WhatsApp contact number format appears unusual.",
          severity: "warning",
          value: cleanVal,
        });
      }
    } else if (map.fieldKey === "website") {
      if (!validateWebsite(cleanVal)) {
        errors.push({
          row: rowIndex,
          field: map.label,
          message: "Corporate website domain is invalid or incorrectly formatted.",
          severity: "warning",
          value: cleanVal,
        });
      }
    } else if (map.fieldKey === "value") {
      const numValue = Number(cleanVal.replace(/[^0-9.]/g, ""));
      if (isNaN(numValue)) {
        errors.push({
          row: rowIndex,
          field: map.label,
          message: "Estimated deal value must be a valid numeric value.",
          severity: "error",
          value: cleanVal,
        });
      }
    }
  }

  return errors;
};

// Check a parsed record against existing system CRM leads
export const checkDuplicates = (
  mappedData: Partial<Record<LeadFieldKey, string>>,
  existingLeads: Lead[]
): {
  isDuplicate: boolean;
  confidence?: number;
  leadId?: string;
  matchField?: "phone" | "email" | "website" | "company";
} => {
  const companyVal = mappedData.company?.trim().toLowerCase();
  const emailVal = mappedData.email?.trim().toLowerCase();
  const phoneVal = mappedData.phone?.trim().replace(/[^0-9]/g, "");
  const websiteVal = mappedData.website?.trim().toLowerCase();

  for (const lead of existingLeads) {
    // 1. Exact Email match (Critical collision indicator)
    if (emailVal && lead.email.trim().toLowerCase() === emailVal) {
      return {
        isDuplicate: true,
        confidence: 99,
        leadId: lead.id,
        matchField: "email",
      };
    }

    // 2. Exact Phone match
    const leadPhoneClean = lead.phone?.trim().replace(/[^0-9]/g, "");
    if (phoneVal && leadPhoneClean && leadPhoneClean === phoneVal) {
      return {
        isDuplicate: true,
        confidence: 90,
        leadId: lead.id,
        matchField: "phone",
      };
    }

    // 3. Exact Website Match
    if (websiteVal && lead.website) {
      const cleanLeadWeb = lead.website.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
      const cleanMapWeb = websiteVal.replace(/^(https?:\/\/)?(www\.)?/, "");
      if (cleanLeadWeb === cleanMapWeb && cleanMapWeb.length > 3) {
        return {
          isDuplicate: true,
          confidence: 80,
          leadId: lead.id,
          matchField: "website",
        };
      }
    }

    // 4. Close Company Match (High confidence if similar)
    if (companyVal && lead.company) {
      const leadCompClean = lead.company.trim().toLowerCase();
      if (leadCompClean === companyVal) {
        return {
          isDuplicate: true,
          confidence: 85,
          leadId: lead.id,
          matchField: "company",
        };
      } else if (
        leadCompClean.includes(companyVal) ||
        companyVal.includes(leadCompClean)
      ) {
        if (leadCompClean.length > 4 && companyVal.length > 4) {
          return {
            isDuplicate: true,
            confidence: 70,
            leadId: lead.id,
            matchField: "company",
          };
        }
      }
    }
  }

  return { isDuplicate: false };
};

// Smart Merging Preview generator
export interface MergedPreviewData {
  fieldKey: LeadFieldKey;
  label: string;
  currentValue: string;
  importedValue: string;
  mergedResult: string;
  isOverwritten: boolean;
}

export const generateMergePreview = (
  existingLead: Lead,
  importedRecord: Partial<Record<LeadFieldKey, string>>
): MergedPreviewData[] => {
  const fieldsToDisplay: { key: LeadFieldKey; label: string }[] = [
    { key: "company", label: "Business Name" },
    { key: "name", label: "Owner Name" },
    { key: "email", label: "Primary Email" },
    { key: "phone", label: "Phone Connection" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "website", label: "Corporate Website" },
    { key: "industry", label: "Industry" },
    { key: "country", label: "Country" },
    { key: "value", label: "Estimated Value" },
    { key: "notes", label: "Executive Notes" },
  ];

  return fieldsToDisplay.map((field) => {
    let currentValue = "";
    if (field.key === "value") {
      currentValue = existingLead.value ? `$${existingLead.value.toLocaleString()}` : "";
    } else {
      currentValue = (existingLead[field.key as keyof Lead] as string) || "";
    }

    let importedValue = importedRecord[field.key] || "";
    if (field.key === "value" && importedValue) {
      const rawNum = Number(importedValue.replace(/[^0-9.]/g, ""));
      importedValue = isNaN(rawNum) ? importedValue : `$${rawNum.toLocaleString()}`;
    }

    // Merging Strategy
    let mergedResult = currentValue;
    let isOverwritten = false;

    if (!currentValue && importedValue) {
      // Empty fields are auto-filled
      mergedResult = importedValue;
      isOverwritten = true;
    } else if (currentValue && importedValue && currentValue !== importedValue) {
      // Conflict rules:
      if (field.key === "notes") {
        // Appends notes with divider
        mergedResult = `${currentValue}\n\n[Imported Update]: ${importedValue}`;
        isOverwritten = true;
      } else {
        // Keeps current CRM value as master, but highlights it can be overwritten if user opts in
        mergedResult = currentValue; // CRM records take priority
      }
    }

    return {
      fieldKey: field.key,
      label: field.label,
      currentValue,
      importedValue,
      mergedResult,
      isOverwritten,
    };
  });
};

// Generates highly realistic lead records depending on simulated file types to support browser testing
export const generateSimulatedRecords = (fileName: string, type: SupportedFileType): Record<string, string>[] => {
  // Base headers
  const defaultHeaders = [
    "Company Name",
    "Contact Person",
    "Email Address",
    "Phone Number",
    "WhatsApp Line",
    "Website Domain",
    "Industry Sector",
    "Location",
    "Deal Value",
    "Context Notes",
    "Lead Status",
  ];

  const lowerName = fileName.toLowerCase();

  // If they upload a "real estate" file, we give them real estate leads
  if (lowerName.includes("estate") || lowerName.includes("property")) {
    return [
      {
        "Company Name": "Apex Realty Partners",
        "Contact Person": "Jonathan Crest",
        "Email Address": "jcrest@apexrealty.com",
        "Phone Number": "+1 555-829-1922",
        "WhatsApp Line": "+1 555-829-1922",
        "Website Domain": "https://apexrealty.com",
        "Industry Sector": "Real Estate",
        "Location": "United States",
        "Deal Value": "45000",
        "Context Notes": "Wants to switch brokers pipeline mapping.",
        "Lead Status": "NEW",
      },
      {
        "Company Name": "Centurion Real Estate", // DUPLICATE COLLISION with Lead 3!
        "Contact Person": "Marcus Aurelius Vance",
        "Email Address": "mvance@centurionre.com",
        "Phone Number": "+1 (555) 712-4589",
        "WhatsApp Line": "",
        "Website Domain": "https://centurionre.com",
        "Industry Sector": "Real Estate",
        "Location": "United States",
        "Deal Value": "95000",
        "Context Notes": "Follow up concerning real-estate custom CRM widgets. Already in system.",
        "Lead Status": "INTERESTED",
      },
      {
        "Company Name": "Skyline Premium Condos",
        "Contact Person": "Clara Oswald",
        "Email Address": "clara@skylinecondos", // VALIDATION EXCEPTION (invalid email)
        "Phone Number": "333444", // VALIDATION WARNING (short phone)
        "WhatsApp Line": "",
        "Website Domain": "skylinecondos.net",
        "Industry Sector": "Real Estate",
        "Location": "United Kingdom",
        "Deal Value": "18000",
        "Context Notes": "Inbound request for pricing tables.",
        "Lead Status": "NEW",
      },
      {
        "Company Name": "Vanguard Builders Group",
        "Contact Person": "Julian Finch",
        "Email Address": "jfinch@vanguardbuilders.com",
        "Phone Number": "+61 2 9382 0111",
        "WhatsApp Line": "+61 2 9382 0111",
        "Website Domain": "https://vanguardbuilders.com.au",
        "Industry Sector": "Construction",
        "Location": "Australia",
        "Deal Value": "120000",
        "Context Notes": "Huge deal size. Requires full-stack integration support.",
        "Lead Status": "NEW",
      },
    ];
  }

  // Tech / SaaS leads default
  return [
    {
      "Company Name": "Vertex Labs",
      "Contact Person": "Sophia Carter",
      "Email Address": "scarter@vertexlabs.co",
      "Phone Number": "+1 415-920-1122",
      "WhatsApp Line": "+1 415-920-1122",
      "Website Domain": "https://vertexlabs.co",
      "Industry Sector": "Software",
      "Location": "United States",
      "Deal Value": "65000",
      "Context Notes": "Looking for lightweight replacement of Salesforce.",
      "Lead Status": "NEW",
    },
    {
      "Company Name": "Helix BioTech Solutions", // DUPLICATE COLLISION with Lead 1!
      "Contact Person": "Alexander Mercer",
      "Email Address": "alex.mercer@helixbio.io",
      "Phone Number": "+1 (555) 349-2041",
      "WhatsApp Line": "+1 (555) 349-2041",
      "Website Domain": "https://helixbio.io",
      "Industry Sector": "Biotech",
      "Location": "United States",
      "Deal Value": "48000",
      "Context Notes": "Wants to sync additional laboratory trials tracking. Re-importing.",
      "Lead Status": "NEW",
    },
    {
      "Company Name": "", // VALIDATION EXCEPTION (Missing Company name!)
      "Contact Person": "Stacy Rivers",
      "Email Address": "stacy@riversmedia.com",
      "Phone Number": "Not Applicable", // VALIDATION WARNING (Alpha phone)
      "WhatsApp Line": "",
      "Website Domain": "riversmedia.com",
      "Industry Sector": "Media",
      "Location": "Canada",
      "Deal Value": "15000",
      "Context Notes": "Wants custom advertising integrations.",
      "Lead Status": "NEW",
    },
    {
      "Company Name": "Nova Cyber Security",
      "Contact Person": "Ethan Hunt",
      "Email Address": "ehunt@novacyber.net",
      "Phone Number": "+44 20 8822 1910",
      "WhatsApp Line": "",
      "Website Domain": "novacyber.net",
      "Industry Sector": "Cybersecurity",
      "Location": "United Kingdom",
      "Deal Value": "82000",
      "Context Notes": "Interested in Synity AI threat monitoring overlays.",
      "Lead Status": "INTERESTED",
    },
    {
      "Company Name": "Horizon FinTech Ltd",
      "Contact Person": "Mei Lin",
      "Email Address": "mei.lin@horizonfin.com.sg",
      "Phone Number": "+65 6288 3911",
      "WhatsApp Line": "+65 6288 3911",
      "Website Domain": "horizonfin.sg",
      "Industry Sector": "Fintech",
      "Location": "Singapore",
      "Deal Value": "115000",
      "Context Notes": "Financial data encryption compliance review requested.",
      "Lead Status": "NEW",
    },
  ];
};

// Parses CSV content if real CSV is uploaded/pasted
export const parseCSVContent = (text: string): Record<string, string>[] => {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const results: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    results.push(row);
  }

  return results;
};

// Simple CSV helper that respects quote marks
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ""));
  return result;
};
