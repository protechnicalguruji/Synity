/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from "./client";
import { Database } from "../../types/database.types";

// Database Row Types extracted from schema
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Activity = Database["public"]["Tables"]["activities"]["Row"];
export type FollowUp = Database["public"]["Tables"]["follow_ups"]["Row"];
export type Meeting = Database["public"]["Tables"]["meetings"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type LostReason = Database["public"]["Tables"]["lost_reasons"]["Row"];
export type AiInsight = Database["public"]["Tables"]["ai_insights"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type ImportJob = Database["public"]["Tables"]["import_jobs"]["Row"];

// ---------------------------------------------------------------------
// 1. DUMMY SEED DATA FOR DEMO SANDBOX FALLBACK
// ---------------------------------------------------------------------

const SEED_PROFILES: Profile[] = [
  {
    id: "demo-user-123",
    full_name: "Alex Rivers",
    company_name: "Synity Agency",
    phone: "+1 (555) 019-2834",
    country: "United States",
    timezone: "America/New_York",
    daily_lead_target: 5,
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_LEADS: Lead[] = [
  {
    id: "lead-1",
    user_id: "demo-user-123",
    business_name: "Acme Ventures",
    owner_name: "Sarah Jenkins",
    phone: "+1 (555) 123-4567",
    whatsapp: "+1 (555) 123-4567",
    email: "sjenkins@acmeventures.com",
    website: "https://acmeventures.com",
    industry: "Venture Capital",
    country: "United States",
    status: "NEW",
    priority: "HIGH",
    estimated_value: 45000.00,
    source: "LinkedIn Outreach",
    notes: "High profile VC contact seeking custom automation suite.",
    last_contacted_at: null,
    next_follow_up_at: new Date(Date.now() + 86400000).toISOString(), // 1 day out
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "lead-2",
    user_id: "demo-user-123",
    business_name: "Nebula Retail",
    owner_name: "John Carter",
    phone: "+44 20 7946 0192",
    whatsapp: "+44 20 7946 0192",
    email: "jcarter@nebularouter.io",
    website: "https://nebularouter.io",
    industry: "E-commerce",
    country: "United Kingdom",
    status: "CALLED",
    priority: "MEDIUM",
    estimated_value: 18500.00,
    source: "Cold Call",
    notes: "Discussed Shopify migration. Needs cost assessment.",
    last_contacted_at: new Date(Date.now() - 3600000).toISOString(),
    next_follow_up_at: new Date(Date.now() + 172800000).toISOString(),
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "lead-3",
    user_id: "demo-user-123",
    business_name: "Apex Logistical",
    owner_name: "Miriam Vance",
    phone: "+1 (555) 987-6543",
    whatsapp: null,
    email: "miriam.v@apexlogistics.com",
    website: "https://apexlogistics.com",
    industry: "Supply Chain",
    country: "Canada",
    status: "NO_ANSWER",
    priority: "LOW",
    estimated_value: 12000.00,
    source: "Inbound Form",
    notes: "Called twice, no pickup. Left corporate voicemail.",
    last_contacted_at: new Date(Date.now() - 7200000).toISOString(),
    next_follow_up_at: new Date(Date.now() + 259200000).toISOString(),
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "lead-4",
    user_id: "demo-user-123",
    business_name: "Quantum Health",
    owner_name: "Dr. Aris Vance",
    phone: "+1 (555) 444-2222",
    whatsapp: "+1 (555) 444-2222",
    email: "dr.vance@quantumhealth.com",
    website: "https://quantumhealth.org",
    industry: "Biotech",
    country: "United States",
    status: "INTERESTED",
    priority: "HIGH",
    estimated_value: 62000.00,
    source: "Google Search",
    notes: "Extremely keen on AI-driven client intake pipelines.",
    last_contacted_at: new Date(Date.now() - 86400000).toISOString(),
    next_follow_up_at: new Date(Date.now() + 43200000).toISOString(),
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "lead-5",
    user_id: "demo-user-123",
    business_name: "Horizon Real Estate",
    owner_name: "Marcus Brody",
    phone: "+1 (555) 231-1002",
    whatsapp: "+1 (555) 231-1002",
    email: "mbrody@horizonre.com",
    website: "https://horizonre.com",
    industry: "Real Estate",
    country: "United States",
    status: "WHATSAPP_SENT",
    priority: "MEDIUM",
    estimated_value: 24000.00,
    source: "Facebook Ads",
    notes: "Sent introductory brochure over WhatsApp Business.",
    last_contacted_at: new Date(Date.now() - 12000000).toISOString(),
    next_follow_up_at: new Date(Date.now() + 345600000).toISOString(),
    created_at: new Date(Date.now() - 518400000).toISOString(),
    updated_at: new Date(Date.now() - 12000000).toISOString()
  },
  {
    id: "lead-6",
    user_id: "demo-user-123",
    business_name: "Vanguard Security",
    owner_name: "Ethan Hunt",
    phone: "+1 (555) 999-8888",
    whatsapp: "+1 (555) 999-8888",
    email: "ehunt@vanguardsec.com",
    website: "https://vanguardsec.net",
    industry: "Cybersecurity",
    country: "United States",
    status: "FOLLOW_UP",
    priority: "URGENT",
    estimated_value: 85000.00,
    source: "Referral",
    notes: "Immediate follow-up required. Interested in custom CRM SDK integrations.",
    last_contacted_at: new Date(Date.now() - 1800000).toISOString(),
    next_follow_up_at: new Date(Date.now() + 3600000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: "lead-7",
    user_id: "demo-user-123",
    business_name: "Lumina Creative",
    owner_name: "Elena Rostova",
    phone: "+7 495 123-45-67",
    whatsapp: null,
    email: "erostova@lumina.ru",
    website: "https://lumina.ru",
    industry: "Creative Agency",
    country: "Russia",
    status: "MEETING",
    priority: "MEDIUM",
    estimated_value: 15000.00,
    source: "LinkedIn Outreach",
    notes: "Zoom meeting scheduled to demonstrate Synity workflows.",
    last_contacted_at: null,
    next_follow_up_at: new Date(Date.now() + 432000000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "lead-8",
    user_id: "demo-user-123",
    business_name: "Zeta Global",
    owner_name: "Tariq Al-Mansoor",
    phone: "+971 4 123 4567",
    whatsapp: "+971 4 123 4567",
    email: "talmansoor@zetaglobal.ae",
    website: "https://zetaglobal.ae",
    industry: "Conglomerate",
    country: "United Arab Emirates",
    status: "PROPOSAL",
    priority: "HIGH",
    estimated_value: 135000.00,
    source: "Partner Network",
    notes: "Enterprise proposal submitted. Awaiting legal review.",
    last_contacted_at: new Date(Date.now() - 172800000).toISOString(),
    next_follow_up_at: new Date(Date.now() + 172800000).toISOString(),
    created_at: new Date(Date.now() - 1209600000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "lead-9",
    user_id: "demo-user-123",
    business_name: "Echo Energy",
    owner_name: "Chloe Devereaux",
    phone: "+33 1 42 27 78 89",
    whatsapp: "+33 1 42 27 78 89",
    email: "cdevereaux@echoenergy.fr",
    website: "https://echoenergy.fr",
    industry: "Renewables",
    country: "France",
    status: "NEGOTIATION",
    priority: "HIGH",
    estimated_value: 95000.00,
    source: "Conference",
    notes: "Negotiating contract terms and custom multi-user seat licensing pricing.",
    last_contacted_at: new Date(Date.now() - 86400000).toISOString(),
    next_follow_up_at: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date(Date.now() - 1209600000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "lead-10",
    user_id: "demo-user-123",
    business_name: "Matrix Retailers",
    owner_name: "Neo Anderson",
    phone: "+1 (555) 101-0101",
    whatsapp: "+1 (555) 101-0101",
    email: "nanderson@matrixretail.com",
    website: "https://matrixretail.com",
    industry: "Fashion Retail",
    country: "United States",
    status: "CLOSED",
    priority: "LOW",
    estimated_value: 22000.00,
    source: "Google Search",
    notes: "Deal finalized. Onboarding completed successfully.",
    last_contacted_at: new Date(Date.now() - 259200000).toISOString(),
    next_follow_up_at: null,
    created_at: new Date(Date.now() - 2592000000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: "lead-11",
    user_id: "demo-user-123",
    business_name: "Sovereign Corp",
    owner_name: "Reginald Sterling",
    phone: "+1 (555) 700-1200",
    whatsapp: null,
    email: "rsterling@sovereigncorp.com",
    website: "https://sovereigncorp.com",
    industry: "Real Estate",
    country: "United States",
    status: "LOST",
    priority: "LOW",
    estimated_value: 50000.00,
    source: "Cold Call",
    notes: "Lost due to budget cuts. Check back in Q3 2027.",
    last_contacted_at: new Date(Date.now() - 432000000).toISOString(),
    next_follow_up_at: null,
    created_at: new Date(Date.now() - 1728000000).toISOString(),
    updated_at: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: "lead-12",
    user_id: "demo-user-123",
    business_name: "Titanium Heavy",
    owner_name: "Bruce Banner",
    phone: "+1 (555) 300-4000",
    whatsapp: "+1 (555) 300-4000",
    email: "bbanner@titaniumheavy.com",
    website: "https://titaniumheavy.com",
    industry: "Manufacturing",
    country: "United States",
    status: "NEW",
    priority: "MEDIUM",
    estimated_value: 35000.00,
    source: "Referral",
    notes: "New heavy manufacturing lead. Seeking inventory automation system.",
    last_contacted_at: null,
    next_follow_up_at: new Date(Date.now() + 518400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "lead-13",
    user_id: "demo-user-123",
    business_name: "Starlight Hotels",
    owner_name: "Stella Maris",
    phone: "+34 91 123 4567",
    whatsapp: "+34 91 123 4567",
    email: "smaris@starlight.es",
    website: "https://starlight.es",
    industry: "Hospitality",
    country: "Spain",
    status: "INTERESTED",
    priority: "MEDIUM",
    estimated_value: 28000.00,
    source: "Inbound Form",
    notes: "Inquired about scheduling tools. Very responsive.",
    last_contacted_at: new Date(Date.now() - 172800000).toISOString(),
    next_follow_up_at: new Date(Date.now() + 259200000).toISOString(),
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "lead-14",
    user_id: "demo-user-123",
    business_name: "Alpha Labs",
    owner_name: "Giles Corby",
    phone: "+61 2 9876 5432",
    whatsapp: null,
    email: "gcorby@alphalabs.com.au",
    website: "https://alphalabs.com.au",
    industry: "Biotech",
    country: "Australia",
    status: "FOLLOW_UP",
    priority: "MEDIUM",
    estimated_value: 16000.00,
    source: "LinkedIn Outreach",
    notes: "Keep in touch. Asked for technical integration document.",
    last_contacted_at: new Date(Date.now() - 345600000).toISOString(),
    next_follow_up_at: new Date(Date.now() + 345600000).toISOString(),
    created_at: new Date(Date.now() - 1209600000).toISOString(),
    updated_at: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: "lead-15",
    user_id: "demo-user-123",
    business_name: "Omega Finance",
    owner_name: "Arthur Dent",
    phone: "+44 117 928 1111",
    whatsapp: null,
    email: "adent@omegafinance.co.uk",
    website: "https://omegafinance.co.uk",
    industry: "Fintech",
    country: "United Kingdom",
    status: "PROPOSAL",
    priority: "URGENT",
    estimated_value: 78000.00,
    source: "LinkedIn Outreach",
    notes: "Custom data dashboard proposal submitted. Follow up on Monday.",
    last_contacted_at: new Date(Date.now() - 86400000).toISOString(),
    next_follow_up_at: new Date(Date.now() + 259200000).toISOString(),
    created_at: new Date(Date.now() - 1209600000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "lead-16",
    user_id: "demo-user-123",
    business_name: "Hyperion Labs",
    owner_name: "Selina Kyle",
    phone: "+1 (555) 808-9090",
    whatsapp: "+1 (555) 808-9090",
    email: "skyle@hyperionlabs.com",
    website: "https://hyperionlabs.io",
    industry: "Technology",
    country: "United States",
    status: "MEETING",
    priority: "HIGH",
    estimated_value: 40000.00,
    source: "Google Search",
    notes: "Reviewing system parameters in Zoom next Friday.",
    last_contacted_at: null,
    next_follow_up_at: new Date(Date.now() + 604800000).toISOString(),
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: "lead-17",
    user_id: "demo-user-123",
    business_name: "Blue Sky Aviation",
    owner_name: "Hal Jordan",
    phone: "+1 (555) 555-0123",
    whatsapp: "+1 (555) 555-0123",
    email: "hjordan@blueskyaviation.com",
    website: "https://blueskyaviation.com",
    industry: "Logistics",
    country: "United States",
    status: "CALLED",
    priority: "MEDIUM",
    estimated_value: 49000.00,
    source: "Cold Call",
    notes: "Spoke briefly. Requested customized pilot portal overview.",
    last_contacted_at: new Date(Date.now() - 43200000).toISOString(),
    next_follow_up_at: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: "lead-18",
    user_id: "demo-user-123",
    business_name: "Delta Construct",
    owner_name: "John Doe",
    phone: "+1 (555) 222-3333",
    whatsapp: null,
    email: "jdoe@deltaconstruct.com",
    website: "https://deltaconstruct.com",
    industry: "Construction",
    country: "United States",
    status: "NEW",
    priority: "LOW",
    estimated_value: 11500.00,
    source: "Cold Call",
    notes: "Initial call. Construction firm interested in field dispatching.",
    last_contacted_at: null,
    next_follow_up_at: new Date(Date.now() + 691200000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "lead-19",
    user_id: "demo-user-123",
    business_name: "Novus Tech",
    owner_name: "Claire Redfield",
    phone: "+1 (555) 474-3929",
    whatsapp: "+1 (555) 474-3929",
    email: "credfield@novustech.com",
    website: "https://novustech.io",
    industry: "SaaS",
    country: "United States",
    status: "CLOSED",
    priority: "MEDIUM",
    estimated_value: 31000.00,
    source: "Inbound Form",
    notes: "Onboarding completed. Satisfied with initial layout and latency.",
    last_contacted_at: new Date(Date.now() - 604800000).toISOString(),
    next_follow_up_at: null,
    created_at: new Date(Date.now() - 2592000000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString()
  },
  {
    id: "lead-20",
    user_id: "demo-user-123",
    business_name: "Oasis Water",
    owner_name: "Immortan Joe",
    phone: "+1 (555) 888-0000",
    whatsapp: "+1 (555) 888-0000",
    email: "ijoe@oasiswater.org",
    website: "https://oasiswater.org",
    industry: "Agriculture",
    country: "United States",
    status: "LOST",
    priority: "URGENT",
    estimated_value: 99000.00,
    source: "Inbound Form",
    notes: "Lost due to competitor undercut.",
    last_contacted_at: new Date(Date.now() - 86400000).toISOString(),
    next_follow_up_at: null,
    created_at: new Date(Date.now() - 864000000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  }
];

const SEED_LOST_REASONS: LostReason[] = [
  {
    id: "lost-1",
    lead_id: "lead-11",
    user_id: "demo-user-123",
    reason: "Budget Restrictions",
    details: "Internal structural reorganization halted all spending until 2027.",
    created_at: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: "lost-2",
    lead_id: "lead-20",
    user_id: "demo-user-123",
    reason: "Competitor Selection",
    details: "Competitor offered a 35% discount on licensing to match their current budget.",
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

const SEED_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    lead_id: "lead-1",
    user_id: "demo-user-123",
    activity_type: "Lead Created",
    description: "Lead manually entered via the Synity Quick Creator.",
    metadata: { origin: "user_ui" },
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "act-2",
    lead_id: "lead-2",
    user_id: "demo-user-123",
    activity_type: "Called",
    description: "Spoke with John Carter. Discussed Shopify migration steps.",
    metadata: { duration_seconds: 312 },
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "act-3",
    lead_id: "lead-4",
    user_id: "demo-user-123",
    activity_type: "Email Sent",
    description: "Dispatched personalized platform brochure and custom calendar link.",
    metadata: { brochure_attached: true },
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "act-4",
    lead_id: "lead-5",
    user_id: "demo-user-123",
    activity_type: "WhatsApp Sent",
    description: "Sent introductory PDF and pricing layout on WhatsApp Business.",
    metadata: { media_sent: "pdf" },
    created_at: new Date(Date.now() - 12000000).toISOString()
  },
  {
    id: "act-5",
    lead_id: "lead-8",
    user_id: "demo-user-123",
    activity_type: "Proposal",
    description: "Drafted and emailed comprehensive enterprise automation proposal.",
    metadata: { version: "v1.2_final" },
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

const SEED_TASKS: Task[] = [
  {
    id: "task-1",
    user_id: "demo-user-123",
    lead_id: "lead-1",
    title: "Draft custom VC integration proposal",
    description: "Acme requested detailed architecture diagrams for client data privacy pipelines.",
    priority: "HIGH",
    status: "TODO",
    due_date: new Date(Date.now() + 86400000).toISOString(),
    completed_at: null,
    created_at: new Date().toISOString()
  },
  {
    id: "task-2",
    user_id: "demo-user-123",
    lead_id: "lead-2",
    title: "Compile cost assessment for Shopify",
    description: "Review current e-commerce transaction volumes to calculate cost savings.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    due_date: new Date(Date.now() + 172800000).toISOString(),
    completed_at: null,
    created_at: new Date().toISOString()
  },
  {
    id: "task-3",
    user_id: "demo-user-123",
    lead_id: "lead-6",
    title: "CRITICAL Follow-up on Vanguard Security",
    description: "Ethan requested immediate contact to resolve technical compliance concerns.",
    priority: "URGENT",
    status: "TODO",
    due_date: new Date(Date.now() + 3600000).toISOString(),
    completed_at: null,
    created_at: new Date().toISOString()
  },
  {
    id: "task-4",
    user_id: "demo-user-123",
    lead_id: null,
    title: "Prepare weekly pipeline evaluation review",
    description: "Internal chore: Review closing stages and update confidence values.",
    priority: "LOW",
    status: "TODO",
    due_date: new Date(Date.now() + 259200000).toISOString(),
    completed_at: null,
    created_at: new Date().toISOString()
  }
];

const SEED_FOLLOW_UPS: FollowUp[] = [
  {
    id: "follow-1",
    lead_id: "lead-1",
    user_id: "demo-user-123",
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    completed: false,
    completed_at: null,
    followup_type: "EMAIL",
    notes: "Follow up on acme ventures proposal feedback.",
    created_at: new Date().toISOString()
  },
  {
    id: "follow-2",
    lead_id: "lead-4",
    user_id: "demo-user-123",
    scheduled_at: new Date(Date.now() + 43200000).toISOString(),
    completed: false,
    completed_at: null,
    followup_type: "CALL",
    notes: "Answer Dr. Vance technical questions regarding client storage integration.",
    created_at: new Date().toISOString()
  },
  {
    id: "follow-3",
    lead_id: "lead-6",
    user_id: "demo-user-123",
    scheduled_at: new Date(Date.now() + 3600000).toISOString(),
    completed: false,
    completed_at: null,
    followup_type: "WHATSAPP",
    notes: "High-priority check-in with Ethan Hunt.",
    created_at: new Date().toISOString()
  }
];

const SEED_MEETINGS: Meeting[] = [
  {
    id: "meet-1",
    lead_id: "lead-7",
    user_id: "demo-user-123",
    title: "Synity Platform Demo",
    meeting_time: new Date(Date.now() + 432000000).toISOString(),
    duration: 45,
    location: "https://meet.google.com/abc-defg-hij",
    meeting_type: "ONLINE",
    notes: "Demoing multi-seat dashboard, notification channels, and active lead cards.",
    status: "SCHEDULED",
    created_at: new Date().toISOString()
  },
  {
    id: "meet-2",
    lead_id: "lead-16",
    user_id: "demo-user-123",
    title: "Parameter Engineering Review",
    meeting_time: new Date(Date.now() + 604800000).toISOString(),
    duration: 60,
    location: "https://zoom.us/j/123456789",
    meeting_type: "ONLINE",
    notes: "Deep technical dive into AI-assisted lead scoring algorithms with Selina Kyle.",
    status: "SCHEDULED",
    created_at: new Date().toISOString()
  }
];

const SEED_AI_INSIGHTS: AiInsight[] = [
  {
    id: "insight-1",
    user_id: "demo-user-123",
    lead_id: "lead-1",
    insight_type: "CONVERSION_PROPENSITY",
    title: "High Closure Likelihood",
    description: "Acme Ventures matches the historical ICP with 92% similarity in both volume and urgency.",
    confidence_score: 92.50,
    created_at: new Date().toISOString()
  },
  {
    id: "insight-2",
    user_id: "demo-user-123",
    lead_id: "lead-6",
    insight_type: "RISK_ALERT",
    title: "Potential Leakage Threat",
    description: "Vanguard Security has an urgent timeline. Delaying contact past today may result in competitor acquisition.",
    confidence_score: 85.00,
    created_at: new Date().toISOString()
  }
];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    user_id: "demo-user-123",
    title: "Task Due: Vanguard Security Check",
    message: "Your urgent task to check compliant guidelines with Vanguard Security is due in 1 hour.",
    type: "WARNING",
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    id: "notif-2",
    user_id: "demo-user-123",
    title: "Acme Ventures Insight Generated",
    message: "Deep Engine finished conversion propensity scan. Score calculated at 92.50%.",
    type: "SUCCESS",
    is_read: false,
    created_at: new Date().toISOString()
  }
];

const SEED_IMPORT_JOBS: ImportJob[] = [
  {
    id: "job-1",
    user_id: "demo-user-123",
    file_name: "leads_july_outreach.csv",
    file_type: "CSV",
    total_records: 150,
    successful_records: 142,
    failed_records: 8,
    status: "COMPLETED",
    created_at: new Date().toISOString()
  }
];

// Helper to load/save mock DB tables from localStorage
function getLocalTable<T>(key: string, initialData: T[]): T[] {
  const data = localStorage.getItem(`synity_db_${key}`);
  if (!data) {
    localStorage.setItem(`synity_db_${key}`, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialData;
  }
}

function saveLocalTable<T>(key: string, data: T[]): void {
  localStorage.setItem(`synity_db_${key}`, JSON.stringify(data));
}

// ---------------------------------------------------------------------
// 2. UNIFIED CLOUD OR LOCAL DB OPERATIONS PROVIDER
// ---------------------------------------------------------------------

export const db = {
  // === PROFILE OPERATIONS ===
  async getProfile(userId: string): Promise<Profile | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        console.error("Error fetching profile from cloud:", error);
        return null;
      }
      return data;
    } else {
      const profiles = getLocalTable<Profile>("profiles", SEED_PROFILES);
      return profiles.find((p) => p.id === userId) || null;
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single();
      if (error) {
        console.error("Error updating profile in cloud:", error);
        return null;
      }
      return data;
    } else {
      const profiles = getLocalTable<Profile>("profiles", SEED_PROFILES);
      const index = profiles.findIndex((p) => p.id === userId);
      if (index === -1) {
        const newProfile: Profile = {
          id: userId,
          full_name: updates.full_name || "Sales Partner",
          company_name: updates.company_name || "Synity Agency",
          phone: updates.phone || null,
          country: updates.country || null,
          timezone: updates.timezone || "UTC",
          daily_lead_target: updates.daily_lead_target || 5,
          avatar_url: updates.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        profiles.push(newProfile);
        saveLocalTable("profiles", profiles);
        return newProfile;
      } else {
        const updated = { ...profiles[index], ...updates, updated_at: new Date().toISOString() };
        profiles[index] = updated;
        saveLocalTable("profiles", profiles);
        return updated;
      }
    }
  },

  // === LEAD OPERATIONS ===
  async getLeads(userId: string): Promise<Lead[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching leads from cloud:", error);
        return [];
      }
      return data || [];
    } else {
      const leads = getLocalTable<Lead>("leads", SEED_LEADS);
      // Remap user_id for demo flow to match currently active profile
      return leads.map(l => ({ ...l, user_id: userId }));
    }
  },

  async getLeadById(userId: string, id: string): Promise<Lead | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", userId)
        .eq("id", id)
        .single();
      if (error) {
        console.error("Error fetching lead from cloud:", error);
        return null;
      }
      return data;
    } else {
      const leads = getLocalTable<Lead>("leads", SEED_LEADS);
      return leads.find((l) => l.id === id) || null;
    }
  },

  async createLead(userId: string, lead: Omit<Lead, "id" | "user_id" | "created_at" | "updated_at">): Promise<Lead | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          ...lead,
          user_id: userId
        })
        .select()
        .single();
      if (error) {
        console.error("Error creating lead in cloud:", error);
        return null;
      }
      return data;
    } else {
      const leads = getLocalTable<Lead>("leads", SEED_LEADS);
      const newLead: Lead = {
        ...lead,
        id: `lead-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      leads.unshift(newLead);
      saveLocalTable("leads", leads);
      return newLead;
    }
  },

  async updateLead(userId: string, id: string, updates: Partial<Lead>): Promise<Lead | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("leads")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        console.error("Error updating lead in cloud:", error);
        return null;
      }
      return data;
    } else {
      const leads = getLocalTable<Lead>("leads", SEED_LEADS);
      const index = leads.findIndex((l) => l.id === id);
      if (index === -1) return null;
      const updated = { ...leads[index], ...updates, updated_at: new Date().toISOString() };
      leads[index] = updated;
      saveLocalTable("leads", leads);
      return updated;
    }
  },

  async deleteLead(userId: string, id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("user_id", userId)
        .eq("id", id);
      if (error) {
        console.error("Error deleting lead from cloud:", error);
        return false;
      }
      return true;
    } else {
      const leads = getLocalTable<Lead>("leads", SEED_LEADS);
      const filtered = leads.filter((l) => l.id !== id);
      saveLocalTable("leads", filtered);
      return true;
    }
  },

  // === ACTIVITY OPERATIONS ===
  async getActivities(userId: string, leadId?: string): Promise<Activity[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from("activities").select("*").eq("user_id", userId);
      if (leadId) {
        query = query.eq("lead_id", leadId);
      }
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching activities from cloud:", error);
        return [];
      }
      return data || [];
    } else {
      const activities = getLocalTable<Activity>("activities", SEED_ACTIVITIES);
      const userActivities = activities.map(a => ({ ...a, user_id: userId }));
      if (leadId) {
        return userActivities.filter((a) => a.lead_id === leadId);
      }
      return userActivities;
    }
  },

  async createActivity(userId: string, activity: Omit<Activity, "id" | "user_id" | "created_at">): Promise<Activity | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("activities")
        .insert({
          ...activity,
          user_id: userId
        })
        .select()
        .single();
      if (error) {
        console.error("Error creating activity in cloud:", error);
        return null;
      }
      return data;
    } else {
      const activities = getLocalTable<Activity>("activities", SEED_ACTIVITIES);
      const newActivity: Activity = {
        ...activity,
        id: `act-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString()
      };
      activities.unshift(newActivity);
      saveLocalTable("activities", activities);
      return newActivity;
    }
  },

  // === FOLLOW-UP OPERATIONS ===
  async getFollowUps(userId: string, leadId?: string): Promise<FollowUp[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from("follow_ups").select("*").eq("user_id", userId);
      if (leadId) {
        query = query.eq("lead_id", leadId);
      }
      const { data, error } = await query.order("scheduled_at", { ascending: true });
      if (error) {
        console.error("Error fetching follow-ups from cloud:", error);
        return [];
      }
      return data || [];
    } else {
      const followUps = getLocalTable<FollowUp>("follow_ups", SEED_FOLLOW_UPS);
      const userFollowUps = followUps.map(f => ({ ...f, user_id: userId }));
      if (leadId) {
        return userFollowUps.filter((f) => f.lead_id === leadId);
      }
      return userFollowUps;
    }
  },

  async createFollowUp(userId: string, followUp: Omit<FollowUp, "id" | "user_id" | "created_at">): Promise<FollowUp | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("follow_ups")
        .insert({
          ...followUp,
          user_id: userId
        })
        .select()
        .single();
      if (error) {
        console.error("Error creating follow-up in cloud:", error);
        return null;
      }
      return data;
    } else {
      const followUps = getLocalTable<FollowUp>("follow_ups", SEED_FOLLOW_UPS);
      const newFollow: FollowUp = {
        ...followUp,
        id: `follow-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString()
      };
      followUps.push(newFollow);
      saveLocalTable("follow_ups", followUps);
      return newFollow;
    }
  },

  async updateFollowUp(userId: string, id: string, updates: Partial<FollowUp>): Promise<FollowUp | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("follow_ups")
        .update(updates)
        .eq("user_id", userId)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        console.error("Error updating follow-up in cloud:", error);
        return null;
      }
      return data;
    } else {
      const followUps = getLocalTable<FollowUp>("follow_ups", SEED_FOLLOW_UPS);
      const index = followUps.findIndex((f) => f.id === id);
      if (index === -1) return null;
      const updated = { ...followUps[index], ...updates };
      followUps[index] = updated;
      saveLocalTable("follow_ups", followUps);
      return updated;
    }
  },

  // === MEETING OPERATIONS ===
  async getMeetings(userId: string, leadId?: string): Promise<Meeting[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from("meetings").select("*").eq("user_id", userId);
      if (leadId) {
        query = query.eq("lead_id", leadId);
      }
      const { data, error } = await query.order("meeting_time", { ascending: true });
      if (error) {
        console.error("Error fetching meetings from cloud:", error);
        return [];
      }
      return data || [];
    } else {
      const meetings = getLocalTable<Meeting>("meetings", SEED_MEETINGS);
      const userMeetings = meetings.map(m => ({ ...m, user_id: userId }));
      if (leadId) {
        return userMeetings.filter((m) => m.lead_id === leadId);
      }
      return userMeetings;
    }
  },

  async createMeeting(userId: string, meeting: Omit<Meeting, "id" | "user_id" | "created_at">): Promise<Meeting | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("meetings")
        .insert({
          ...meeting,
          user_id: userId
        })
        .select()
        .single();
      if (error) {
        console.error("Error creating meeting in cloud:", error);
        return null;
      }
      return data;
    } else {
      const meetings = getLocalTable<Meeting>("meetings", SEED_MEETINGS);
      const newMeeting: Meeting = {
        ...meeting,
        id: `meet-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString()
      };
      meetings.push(newMeeting);
      saveLocalTable("meetings", meetings);
      return newMeeting;
    }
  },

  async updateMeeting(userId: string, id: string, updates: Partial<Meeting>): Promise<Meeting | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("meetings")
        .update(updates)
        .eq("user_id", userId)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        console.error("Error updating meeting in cloud:", error);
        return null;
      }
      return data;
    } else {
      const meetings = getLocalTable<Meeting>("meetings", SEED_MEETINGS);
      const index = meetings.findIndex((m) => m.id === id);
      if (index === -1) return null;
      const updated = { ...meetings[index], ...updates };
      meetings[index] = updated;
      saveLocalTable("meetings", meetings);
      return updated;
    }
  },

  // === TASK OPERATIONS ===
  async getTasks(userId: string, leadId?: string): Promise<Task[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from("tasks").select("*").eq("user_id", userId);
      if (leadId) {
        query = query.eq("lead_id", leadId);
      }
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching tasks from cloud:", error);
        return [];
      }
      return data || [];
    } else {
      const tasks = getLocalTable<Task>("tasks", SEED_TASKS);
      const userTasks = tasks.map(t => ({ ...t, user_id: userId }));
      if (leadId) {
        return userTasks.filter((t) => t.lead_id === leadId);
      }
      return userTasks;
    }
  },

  async createTask(userId: string, task: Omit<Task, "id" | "user_id" | "created_at">): Promise<Task | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...task,
          user_id: userId
        })
        .select()
        .single();
      if (error) {
        console.error("Error creating task in cloud:", error);
        return null;
      }
      return data;
    } else {
      const tasks = getLocalTable<Task>("tasks", SEED_TASKS);
      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString()
      };
      tasks.unshift(newTask);
      saveLocalTable("tasks", tasks);
      return newTask;
    }
  },

  async updateTask(userId: string, id: string, updates: Partial<Task>): Promise<Task | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("user_id", userId)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        console.error("Error updating task in cloud:", error);
        return null;
      }
      return data;
    } else {
      const tasks = getLocalTable<Task>("tasks", SEED_TASKS);
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return null;
      const updated = { ...tasks[index], ...updates };
      tasks[index] = updated;
      saveLocalTable("tasks", tasks);
      return updated;
    }
  },

  async deleteTask(userId: string, id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("user_id", userId)
        .eq("id", id);
      if (error) {
        console.error("Error deleting task from cloud:", error);
        return false;
      }
      return true;
    } else {
      const tasks = getLocalTable<Task>("tasks", SEED_TASKS);
      const filtered = tasks.filter((t) => t.id !== id);
      saveLocalTable("tasks", filtered);
      return true;
    }
  },

  // === LOST REASONS OPERATIONS ===
  async getLostReasons(userId: string): Promise<LostReason[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("lost_reasons")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        console.error("Error fetching lost reasons from cloud:", error);
        return [];
      }
      return data || [];
    } else {
      const reasons = getLocalTable<LostReason>("lost_reasons", SEED_LOST_REASONS);
      return reasons.map(r => ({ ...r, user_id: userId }));
    }
  },

  async saveLostReason(userId: string, leadId: string, reason: string, details?: string): Promise<LostReason | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("lost_reasons")
        .insert({
          lead_id: leadId,
          user_id: userId,
          reason,
          details: details || null
        })
        .select()
        .single();
      if (error) {
        console.error("Error saving lost reason in cloud:", error);
        return null;
      }
      return data;
    } else {
      const reasons = getLocalTable<LostReason>("lost_reasons", SEED_LOST_REASONS);
      const newReason: LostReason = {
        id: `lost-${Date.now()}`,
        lead_id: leadId,
        user_id: userId,
        reason,
        details: details || null,
        created_at: new Date().toISOString()
      };
      reasons.push(newReason);
      saveLocalTable("lost_reasons", reasons);
      return newReason;
    }
  },

  // === AI INSIGHTS OPERATIONS ===
  async getAiInsights(userId: string, leadId?: string): Promise<AiInsight[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from("ai_insights").select("*").eq("user_id", userId);
      if (leadId) {
        query = query.eq("lead_id", leadId);
      }
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching AI insights from cloud:", error);
        return [];
      }
      return data || [];
    } else {
      const insights = getLocalTable<AiInsight>("ai_insights", SEED_AI_INSIGHTS);
      const userInsights = insights.map(i => ({ ...i, user_id: userId }));
      if (leadId) {
        return userInsights.filter((i) => i.lead_id === leadId);
      }
      return userInsights;
    }
  },

  async createAiInsight(userId: string, insight: Omit<AiInsight, "id" | "user_id" | "created_at">): Promise<AiInsight | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("ai_insights")
        .insert({
          ...insight,
          user_id: userId
        })
        .select()
        .single();
      if (error) {
        console.error("Error creating AI insight in cloud:", error);
        return null;
      }
      return data;
    } else {
      const insights = getLocalTable<AiInsight>("ai_insights", SEED_AI_INSIGHTS);
      const newInsight: AiInsight = {
        ...insight,
        id: `insight-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString()
      };
      insights.unshift(newInsight);
      saveLocalTable("ai_insights", insights);
      return newInsight;
    }
  },

  // === NOTIFICATIONS OPERATIONS ===
  async getNotifications(userId: string): Promise<Notification[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching notifications from cloud:", error);
        return [];
      }
      return data || [];
    } else {
      const notifications = getLocalTable<Notification>("notifications", SEED_NOTIFICATIONS);
      return notifications.map(n => ({ ...n, user_id: userId }));
    }
  },

  async createNotification(userId: string, notification: Omit<Notification, "id" | "user_id" | "created_at">): Promise<Notification | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("notifications")
        .insert({
          ...notification,
          user_id: userId
        })
        .select()
        .single();
      if (error) {
        console.error("Error creating notification in cloud:", error);
        return null;
      }
      return data;
    } else {
      const notifications = getLocalTable<Notification>("notifications", SEED_NOTIFICATIONS);
      const newNotif: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString()
      };
      notifications.unshift(newNotif);
      saveLocalTable("notifications", notifications);
      return newNotif;
    }
  },

  async markNotificationAsRead(userId: string, id: string): Promise<Notification | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        console.error("Error marking notification as read in cloud:", error);
        return null;
      }
      return data;
    } else {
      const notifications = getLocalTable<Notification>("notifications", SEED_NOTIFICATIONS);
      const index = notifications.findIndex((n) => n.id === id);
      if (index === -1) return null;
      const updated = { ...notifications[index], is_read: true };
      notifications[index] = updated;
      saveLocalTable("notifications", notifications);
      return updated;
    }
  },

  // === IMPORT JOBS OPERATIONS ===
  async getImportJobs(userId: string): Promise<ImportJob[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("import_jobs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching import jobs from cloud:", error);
        return [];
      }
      return data || [];
    } else {
      const jobs = getLocalTable<ImportJob>("import_jobs", SEED_IMPORT_JOBS);
      return jobs.map(j => ({ ...j, user_id: userId }));
    }
  },

  async createImportJob(userId: string, job: Omit<ImportJob, "id" | "user_id" | "created_at">): Promise<ImportJob | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("import_jobs")
        .insert({
          ...job,
          user_id: userId
        })
        .select()
        .single();
      if (error) {
        console.error("Error creating import job in cloud:", error);
        return null;
      }
      return data;
    } else {
      const jobs = getLocalTable<ImportJob>("import_jobs", SEED_IMPORT_JOBS);
      const newJob: ImportJob = {
        ...job,
        id: `job-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString()
      };
      jobs.unshift(newJob);
      saveLocalTable("import_jobs", jobs);
      return newJob;
    }
  },

  async updateImportJob(userId: string, id: string, updates: Partial<ImportJob>): Promise<ImportJob | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("import_jobs")
        .update(updates)
        .eq("user_id", userId)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        console.error("Error updating import job in cloud:", error);
        return null;
      }
      return data;
    } else {
      const jobs = getLocalTable<ImportJob>("import_jobs", SEED_IMPORT_JOBS);
      const index = jobs.findIndex((j) => j.id === id);
      if (index === -1) return null;
      const updated = { ...jobs[index], ...updates };
      jobs[index] = updated;
      saveLocalTable("import_jobs", jobs);
      return updated;
    }
  }
};
