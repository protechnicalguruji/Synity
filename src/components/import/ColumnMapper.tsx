/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, HelpCircle, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { FieldMapping, LeadFieldKey } from "../../types/import";

interface ColumnMapperProps {
  headers: string[];
  mappings: FieldMapping[];
  firstRow: Record<string, string>;
  onMappingChange: (fieldKey: LeadFieldKey, mappedColumn: string | null) => void;
}

export const ColumnMapper: React.FC<ColumnMapperProps> = ({
  headers,
  mappings,
  firstRow,
  onMappingChange,
}) => {
  // Check if required fields are mapped
  const missingRequired = mappings.filter((m) => m.isRequired && !m.mappedColumn);

  return (
    <div className="space-y-4 text-left" id="column-mapper-wrapper">
      {/* Informative Header Banner */}
      <div className="p-4 bg-gradient-to-tr from-[#E5E3E7]/40 to-[#8CB9D7]/15 border border-[#8CB9D7]/20 rounded-xl flex items-start gap-3">
        <div className="p-1.5 bg-[#8CB9D7]/20 text-[#3b7194] rounded-lg">
          <Sparkles size={15} className="animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2F2F]">
            Synity Smart Headers Calibrated
          </h4>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            Our neural-mapped parser matched raw file columns against Synity's standard CRM variables. Feel free to manually calibrate any mapping before initiating records verification.
          </p>
        </div>
      </div>

      {/* Validation warning if required fields are missing mapping */}
      {missingRequired.length > 0 && (
        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 flex items-start gap-2 max-w-2xl" id="mapper-warning">
          <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-500" />
          <div className="space-y-0.5 font-semibold">
            <p>Missing Mandatory Column Mappings</p>
            <p className="text-[10px] text-red-600 font-medium">
              You must map raw columns to standard fields for:{" "}
              {missingRequired.map((m) => m.label).join(", ")}.
            </p>
          </div>
        </div>
      )}

      {/* Field Mapping Grid */}
      <div className="border border-[#D8D8D8] rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="bg-gray-50/70 p-3.5 border-b border-[#D8D8D8] grid grid-cols-1 md:grid-cols-12 gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <div className="md:col-span-4">Synity CRM Standard Field</div>
          <div className="md:col-span-1 text-center">Status</div>
          <div className="md:col-span-4">File Header Column</div>
          <div className="md:col-span-3">Sample Value (Row 1)</div>
        </div>

        <div className="divide-y divide-gray-100">
          {mappings.map((mapping) => {
            const isMapped = !!mapping.mappedColumn;
            const sampleVal = mapping.mappedColumn ? firstRow[mapping.mappedColumn] || "" : "";

            return (
              <div
                key={mapping.fieldKey}
                className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-gray-50/20 transition-all text-xs"
                id={`mapping-row-${mapping.fieldKey}`}
              >
                {/* 1. Field Name and Info */}
                <div className="md:col-span-4 text-left space-y-0.5">
                  <h5 className="font-bold text-[#2F2F2F] tracking-tight">{mapping.label}</h5>
                  <p className="text-[10px] text-gray-400 font-mono font-medium">
                    key: {mapping.fieldKey}
                  </p>
                </div>

                {/* 2. Status Badge */}
                <div className="md:col-span-1 text-left md:text-center">
                  {mapping.isRequired ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">
                      Required
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  )}
                </div>

                {/* 3. Dropdown Mapper Selector */}
                <div className="md:col-span-4 flex items-center gap-2">
                  <ArrowRight size={14} className="text-gray-300 hidden md:block shrink-0" />
                  <select
                    value={mapping.mappedColumn || ""}
                    onChange={(e) => onMappingChange(mapping.fieldKey, e.target.value || null)}
                    className={`w-full rounded-lg border p-2 bg-white text-xs text-[#2F2F2F] font-medium focus:ring-1 focus:ring-[#8CB9D7] outline-none transition-all ${
                      isMapped
                        ? "border-[#D8D8D8] text-[#2F2F2F] font-semibold"
                        : "border-gray-200 text-gray-400 italic"
                    }`}
                  >
                    <option value="">— Skip / Ignore Field —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Live Sample cell */}
                <div className="md:col-span-3 text-left">
                  {isMapped ? (
                    <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 border border-gray-100 rounded-lg max-w-full">
                      <span className="text-[10px] text-gray-500 font-medium truncate font-mono">
                        {sampleVal ? `"${sampleVal}"` : <em className="text-gray-400">[Blank Value]</em>}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-mono">Not imported</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
