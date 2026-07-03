import React, { useState, useEffect } from "react";
import { User, Building, Phone, Mail, Globe, MapPin, Layers, DollarSign, Calendar, Sparkles, AlertTriangle, GitMerge, X } from "lucide-react";
import { Lead, LeadStatus } from "../../types";
import { LEAD_SOURCES } from "../../constants";
import { Input, TextArea } from "../ui/Input";
import { Button } from "../ui/Button";

interface LeadFormProps {
  initialLead?: Lead | null;
  existingLeads: Lead[];
  onSave: (lead: Lead, mergeTargetId?: string) => void;
  onCancel: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialLead,
  existingLeads,
  onSave,
  onCancel
}) => {
  // Field States
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [source, setSource] = useState(LEAD_SOURCES[0] || "");
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.NEW);
  const [notes, setNotes] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState("");

  // Duplicate Check Flow
  const [duplicateMatch, setDuplicateMatch] = useState<Lead | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  // Load Initial values for Edit mode
  useEffect(() => {
    if (initialLead) {
      setName(initialLead.name || "");
      setCompany(initialLead.company || "");
      setEmail(initialLead.email || "");
      setPhone(initialLead.phone || "");
      setWhatsapp(initialLead.whatsapp || "");
      setWebsite(initialLead.website || "");
      setIndustry(initialLead.industry || "");
      setCountry(initialLead.country || "");
      setSource(initialLead.source || LEAD_SOURCES[0]);
      setValue(initialLead.value ? String(initialLead.value) : "");
      setPriority(initialLead.priority || "MEDIUM");
      setStatus(initialLead.status || LeadStatus.NEW);
      setNotes(initialLead.notes || "");
      
      if (initialLead.nextFollowUp) {
        setNextFollowUp(initialLead.nextFollowUp.split("T")[0]);
      } else {
        setNextFollowUp("");
      }
    }
  }, [initialLead]);

  // Validation Checkers
  const validateForm = () => {
    if (!name.trim()) return "Owner/Contact Name is required.";
    if (!company.trim()) return "Business/Company Name is required.";
    if (!email.trim() || !email.includes("@")) return "A valid Email Address is required.";
    if (!value || isNaN(Number(value)) || Number(value) < 0) return "Valid Estimated Deal Value is required.";
    return null;
  };

  const checkDuplicates = (): Lead | null => {
    // Skip duplicate check if editing existing lead
    if (initialLead) return null;

    const emailClean = email.trim().toLowerCase();
    const phoneClean = phone.trim().replace(/[^0-9]/g, "");
    const companyClean = company.trim().toLowerCase();
    const websiteClean = website.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");

    for (const lead of existingLeads) {
      // 1. Email check
      if (lead.email.trim().toLowerCase() === emailClean) {
        return lead;
      }
      // 2. Phone check (compare numbers only)
      if (phoneClean && lead.phone && lead.phone.replace(/[^0-9]/g, "") === phoneClean) {
        return lead;
      }
      // 3. Business Name check
      if (lead.company.trim().toLowerCase() === companyClean) {
        return lead;
      }
      // 4. Website check
      if (websiteClean && lead.website) {
        const leadWeb = lead.website.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
        if (leadWeb === websiteClean) {
          return lead;
        }
      }
    }
    return null;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const matchedLead = checkDuplicates();
    if (matchedLead) {
      setDuplicateMatch(matchedLead);
      setShowDuplicateWarning(true);
    } else {
      executeSave();
    }
  };

  const executeSave = () => {
    // Propensity algorithm
    let basePropensity = 50;
    if (Number(value) > 75000) basePropensity += 20;
    if (priority === "HIGH") basePropensity += 10;
    if (priority === "URGENT") basePropensity += 15;
    if (source === "Partner Referral") basePropensity += 15;
    if (notes.toLowerCase().includes("ready") || notes.toLowerCase().includes("budget")) basePropensity += 15;
    const confidenceScore = Math.min(98, Math.max(10, basePropensity));

    const finalLead: Lead = {
      id: initialLead ? initialLead.id : `lead-${Date.now()}`,
      name: name.trim(),
      company: company.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      website: website.trim() || undefined,
      industry: industry.trim() || undefined,
      country: country.trim() || undefined,
      source,
      value: Number(value),
      priority,
      status,
      notes: notes.trim() || undefined,
      confidenceScore: initialLead ? initialLead.confidenceScore : confidenceScore,
      createdAt: initialLead ? initialLead.createdAt : new Date().toISOString(),
      nextFollowUp: nextFollowUp ? new Date(nextFollowUp).toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };

    onSave(finalLead);
  };

  const executeSmartMerge = () => {
    if (!duplicateMatch) return;

    // Merge notes
    const mergedNotes = [
      duplicateMatch.notes,
      notes.trim() ? `[Merged Note ${new Date().toLocaleDateString()}]: ${notes.trim()}` : null
    ].filter(Boolean).join("\n\n");

    const mergedLead: Lead = {
      ...duplicateMatch,
      // Merge empty details intelligently
      phone: duplicateMatch.phone || phone.trim() || undefined,
      whatsapp: duplicateMatch.whatsapp || whatsapp.trim() || undefined,
      website: duplicateMatch.website || website.trim() || undefined,
      industry: duplicateMatch.industry || industry.trim() || undefined,
      country: duplicateMatch.country || country.trim() || undefined,
      // Accumulate estimated value
      value: duplicateMatch.value + Number(value),
      notes: mergedNotes || undefined,
      updatedAt: new Date().toISOString()
    };

    onSave(mergedLead, duplicateMatch.id);
  };

  if (showDuplicateWarning && duplicateMatch) {
    return (
      <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-xl space-y-6 text-left animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-amber-900 font-display">Potential Duplicate Detected</h4>
            <p className="text-xs text-amber-800 mt-1">
              Our AI deduplication index has flagged a lead that matches this registration. Keep your workspace clean and preserve deal histories by merging.
            </p>
          </div>
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white border border-[#D8D8D8] rounded-lg">
            <p className="font-bold text-[#666666] mb-2 uppercase tracking-wider text-[10px]">Existing Record</p>
            <div className="space-y-1.5 text-slate-800">
              <p className="font-semibold text-sm">{duplicateMatch.company}</p>
              <p>👤 {duplicateMatch.name}</p>
              <p>✉️ {duplicateMatch.email}</p>
              {duplicateMatch.phone && <p>📞 {duplicateMatch.phone}</p>}
              {duplicateMatch.website && <p>🌐 {duplicateMatch.website}</p>}
              <p className="mt-2 text-[10px] bg-gray-100 px-2 py-0.5 rounded-full inline-block font-bold">Value: ${duplicateMatch.value.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#D8D8D8] rounded-lg">
            <p className="font-bold text-[#666666] mb-2 uppercase tracking-wider text-[10px]">New Incoming Record</p>
            <div className="space-y-1.5 text-slate-800">
              <p className="font-semibold text-sm">{company}</p>
              <p>👤 {name}</p>
              <p>✉️ {email}</p>
              {phone && <p>📞 {phone}</p>}
              {website && <p>🌐 {website}</p>}
              <p className="mt-2 text-[10px] bg-amber-50 px-2 py-0.5 rounded-full inline-block font-bold">Value: ${Number(value).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3 border-t border-amber-200">
          <Button
            variant="outline"
            onClick={() => {
              setShowDuplicateWarning(false);
              setDuplicateMatch(null);
            }}
            className="border-amber-300 text-amber-800 hover:bg-amber-100/50"
          >
            Go Back & Fix
          </Button>
          <Button
            variant="outline"
            onClick={executeSave}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Continue Anyway (Create Duplicate)
          </Button>
          <Button
            onClick={executeSmartMerge}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
          >
            <GitMerge size={14} />
            Smart Merge & Combine
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contact Owner */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
            <User size={13} /> Owner / Contact Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Richard Hendricks"
            required
            id="field-owner-name"
          />
        </div>

        {/* Business Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
            <Building size={13} /> Business Name
          </label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Pied Piper Corp"
            required
            id="field-business-name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
            <Mail size={13} /> Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="richard@piedpiper.com"
            required
            id="field-email"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
            <Phone size={13} /> Phone
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 019-2834"
            id="field-phone"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
            <Phone size={13} className="text-emerald-600" /> WhatsApp (Optional)
          </label>
          <Input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+1 (555) 019-2834"
            id="field-whatsapp"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Website */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
            <Globe size={13} /> Website
          </label>
          <Input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="piedpiper.com"
            id="field-website"
          />
        </div>

        {/* Industry */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
            <Layers size={13} /> Industry
          </label>
          <Input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Tech, Cloud, Biotech..."
            id="field-industry"
          />
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
            <MapPin size={13} /> Country
          </label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="United States, Japan..."
            id="field-country"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Estimated deal value */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
            <DollarSign size={13} /> Estimated Deal Value ($)
          </label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="50000"
            required
            id="field-deal-value"
          />
        </div>

        {/* Source */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666]">Lead Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none h-[42px] focus:border-[#4E4E49]"
          >
            {LEAD_SOURCES.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666]">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none h-[42px] focus:border-[#4E4E49]"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666]">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus)}
            className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none h-[42px] focus:border-[#4E4E49]"
          >
            {Object.values(LeadStatus).map((st) => (
              <option key={st} value={st}>
                {st.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Next Follow Up */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
            <Calendar size={13} /> Next Follow Up (Optional)
          </label>
          <Input
            type="date"
            value={nextFollowUp}
            onChange={(e) => setNextFollowUp(e.target.value)}
            id="field-followup-date"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#666666]">Notes & Executive Summary</label>
        <TextArea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write brief client summaries, team guidelines, or custom pricing requests here..."
          rows={3}
          id="field-notes"
        />
      </div>

      {/* Footer controls */}
      <div className="pt-4 border-t border-[#D8D8D8] flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="bg-[#4E4E49] hover:bg-[#3D3D38] text-white flex items-center gap-1" type="submit">
          <Sparkles size={13} />
          {initialLead ? "Save Changes" : "Create New Lead"}
        </Button>
      </div>
    </form>
  );
};
