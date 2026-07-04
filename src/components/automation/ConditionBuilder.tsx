/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Plus, Trash2, ShieldCheck, Sliders, AlertCircle, HelpCircle } from "lucide-react";
import {
  AutomationConditionGroup,
  AutomationCondition,
  AutomationConditionField,
  ConditionOperator,
  LeadStatus
} from "../../types";

interface ConditionBuilderProps {
  conditionGroup: AutomationConditionGroup;
  onChangeGroup: (group: AutomationConditionGroup) => void;
}

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  conditionGroup,
  onChangeGroup,
}) => {
  // Available fields definitions
  const fieldsOptions = [
    { value: AutomationConditionField.LEAD_STATUS, label: "Lead Status" },
    { value: AutomationConditionField.PIPELINE_STAGE, label: "Pipeline Stage" },
    { value: AutomationConditionField.DEAL_VALUE, label: "Estimated Deal Value" },
    { value: AutomationConditionField.PRIORITY, label: "Priority Level" },
    { value: AutomationConditionField.LEAD_SOURCE, label: "Lead Source" },
    { value: AutomationConditionField.INDUSTRY, label: "Vertical/Industry" },
    { value: AutomationConditionField.COUNTRY, label: "Country" },
    { value: AutomationConditionField.DAYS_SINCE_LAST_CONTACT, label: "Days Since Contact" },
    { value: AutomationConditionField.TAG, label: "Applied Tag" },
    { value: AutomationConditionField.LEAD_HEALTH, label: "Lead Health Score" },
    { value: AutomationConditionField.CUSTOM_DATE, label: "Creation Date Range" },
  ];

  // Operators available
  const operatorOptions = [
    { value: ConditionOperator.EQUALS, label: "is equal to" },
    { value: ConditionOperator.NOT_EQUALS, label: "is not equal to" },
    { value: ConditionOperator.CONTAINS, label: "contains keyword" },
    { value: ConditionOperator.GREATER_THAN, label: "greater than (>)" },
    { value: ConditionOperator.LESS_THAN, label: "less than (<)" },
    { value: ConditionOperator.IN, label: "is in set" },
    { value: ConditionOperator.NOT_IN, label: "is not in set" },
  ];

  const handleLogicalOperatorChange = (op: "AND" | "OR") => {
    onChangeGroup({ ...conditionGroup, logicalOperator: op });
  };

  const handleAddCondition = () => {
    const newCondition: AutomationCondition = {
      id: `cond-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      field: AutomationConditionField.DEAL_VALUE,
      operator: ConditionOperator.GREATER_THAN,
      value: "10000",
    };

    onChangeGroup({
      ...conditionGroup,
      conditions: [...conditionGroup.conditions, newCondition],
    });
  };

  const handleRemoveCondition = (id: string) => {
    onChangeGroup({
      ...conditionGroup,
      conditions: conditionGroup.conditions.filter((c) => c.id !== id),
    });
  };

  const handleConditionChange = (id: string, updated: Partial<AutomationCondition>) => {
    onChangeGroup({
      ...conditionGroup,
      conditions: conditionGroup.conditions.map((c) => {
        if (c.id === id) {
          return { ...c, ...updated } as AutomationCondition;
        }
        return c;
      }),
    });
  };

  return (
    <div className="space-y-6" id="condition-builder-block">
      {/* Description header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h3 className="font-sans font-bold text-[#2F2F2F] text-sm flex items-center gap-1.5">
            <Sliders size={15} className="text-[#0A66C2]" />
            <span>Configure Conditional Filter Rules</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">Refine targeting by specifying criteria blocks that prospects must meet to advance.</p>
        </div>

        {/* Logical AND/OR switch */}
        <div className="flex items-center bg-gray-100 border border-[#D8D8D8] rounded-lg p-0.5 shadow-inner">
          <button
            onClick={() => handleLogicalOperatorChange("AND")}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              conditionGroup.logicalOperator === "AND"
                ? "bg-[#4E4E49] text-white"
                : "text-[#666666] hover:text-[#2F2F2F]"
            }`}
            type="button"
          >
            AND (All Match)
          </button>
          <button
            onClick={() => handleLogicalOperatorChange("OR")}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              conditionGroup.logicalOperator === "OR"
                ? "bg-[#4E4E49] text-white"
                : "text-[#666666] hover:text-[#2F2F2F]"
            }`}
            type="button"
          >
            OR (Any Match)
          </button>
        </div>
      </div>

      {/* List of expressions */}
      <div className="space-y-3.5">
        {conditionGroup.conditions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-[#D8D8D8] flex flex-col items-center justify-center p-4">
            <HelpCircle size={20} className="text-gray-400 mb-1.5 opacity-60" />
            <p className="text-xs font-semibold text-[#666666]">No filters specified</p>
            <p className="text-[11px] text-gray-400 mt-0.5 max-w-sm">This workflow will trigger unconditionally for all leads passing the event trigger.</p>
            <button
              onClick={handleAddCondition}
              className="mt-3.5 px-3 py-1.5 text-xs font-bold border border-[#D8D8D8] bg-white rounded-lg text-[#2F2F2F] hover:bg-gray-100 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
              type="button"
            >
              <Plus size={12} />
              <span>Add Condition Filter</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {conditionGroup.conditions.map((item, index) => {
              const cond = item as AutomationCondition; // Assume flat list for initial builder
              return (
                <div
                  key={cond.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-xl border border-[#D8D8D8] shadow-xs relative group"
                  id={`condition-row-${cond.id}`}
                >
                  {/* Sequence badge */}
                  <span className="h-5 w-5 shrink-0 bg-gray-100 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-gray-500 self-start sm:self-auto">
                    {index + 1}
                  </span>

                  {/* Field select */}
                  <div className="flex-1 min-w-0">
                    <label htmlFor={`field-select-${cond.id}`} className="sr-only">Select field</label>
                    <select
                      id={`field-select-${cond.id}`}
                      value={cond.field}
                      onChange={(e) => handleConditionChange(cond.id, { field: e.target.value as AutomationConditionField })}
                      className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                    >
                      {fieldsOptions.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Operator select */}
                  <div className="w-full sm:w-44 shrink-0">
                    <label htmlFor={`operator-select-${cond.id}`} className="sr-only">Select operator</label>
                    <select
                      id={`operator-select-${cond.id}`}
                      value={cond.operator}
                      onChange={(e) => handleConditionChange(cond.id, { operator: e.target.value as ConditionOperator })}
                      className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                    >
                      {operatorOptions.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Value input / dropdown depends on field */}
                  <div className="flex-1 min-w-0">
                    <label htmlFor={`value-input-${cond.id}`} className="sr-only">Filter value</label>
                    {cond.field === AutomationConditionField.LEAD_STATUS ? (
                      <select
                        id={`value-input-${cond.id}`}
                        value={cond.value || "NEW"}
                        onChange={(e) => handleConditionChange(cond.id, { value: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                      >
                        {Object.values(LeadStatus).map((st) => (
                          <option key={st} value={st}>
                            {st.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={`value-input-${cond.id}`}
                        type="text"
                        value={cond.value || ""}
                        onChange={(e) => handleConditionChange(cond.id, { value: e.target.value })}
                        placeholder="Value (e.g. 15000, Biotech, LinkedIn...)"
                        className="w-full text-xs px-3 py-2 border border-[#D8D8D8] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#4E4E49] text-[#2F2F2F]"
                      />
                    )}
                  </div>

                  {/* Delete row */}
                  <button
                    onClick={() => handleRemoveCondition(cond.id)}
                    className="p-2 border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0 self-end sm:self-auto"
                    type="button"
                    title="Remove criteria filter row"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}

            {/* Quick add more block */}
            <div className="flex justify-start">
              <button
                onClick={handleAddCondition}
                className="px-3.5 py-2 border border-dashed border-[#D8D8D8] hover:border-gray-400 bg-white rounded-xl text-xs font-bold text-[#666666] hover:text-[#2F2F2F] transition-all flex items-center gap-1 cursor-pointer"
                type="button"
              >
                <Plus size={13} />
                <span>Append another filter expression</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
