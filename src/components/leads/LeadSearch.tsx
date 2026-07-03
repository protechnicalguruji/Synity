import React from "react";
import { Search, X, HelpCircle } from "lucide-react";
import { Input } from "../ui/Input";

interface LeadSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const LeadSearch: React.FC<LeadSearchProps> = ({
  value,
  onChange,
  placeholder = "Search leads..."
}) => {
  return (
    <div className="relative flex-1">
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          icon={<Search size={16} className="text-[#666666]" />}
          className="pr-10"
          id="lead-search-input"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#666666] hover:text-[#2F2F2F] rounded-full hover:bg-gray-100 transition-all"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-gray-400">
        <HelpCircle size={11} />
        <span>Searches by Business Name, Owner, Phone, Email, Website, Industry, Country, Tags and Status.</span>
      </div>
    </div>
  );
};
