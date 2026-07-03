-- =====================================================================
-- SYNITY SALES OS — PRODUCTION-GRADE POSTGRESQL DATABASE MIGRATION
-- =====================================================================
-- Optimized for AI Sales workflows, Row-Level Security, and million-row scaling.
-- Path: /supabase/migrations/20260703120000_create_sales_os_schema.sql
-- =====================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. ENUMERATED TYPES (CUSTOM POSTGRES ENUMS)
-- ---------------------------------------------------------------------

-- Lead status indicating pipeline lifecycle progression
CREATE TYPE public.lead_status AS ENUM (
  'NEW',
  'CALLED',
  'NO_ANSWER',
  'INTERESTED',
  'WHATSAPP_SENT',
  'FOLLOW_UP',
  'MEETING',
  'PROPOSAL',
  'NEGOTIATION',
  'CLOSED',
  'LOST'
);

-- Priority levels for leads, tasks, and follow-up activities
CREATE TYPE public.priority_level AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT'
);

-- Task completion statuses
CREATE TYPE public.task_status AS ENUM (
  'TODO',
  'IN_PROGRESS',
  'DONE'
);

-- Push/System alert types for user notifications
CREATE TYPE public.notification_type AS ENUM (
  'INFO',
  'SUCCESS',
  'WARNING',
  'ERROR'
);

-- ---------------------------------------------------------------------
-- 2. AUTOMATIC TIMESTAMP TRIGGER SUPPORT
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- 3. CORE SCHEMAS & TABLES
-- ---------------------------------------------------------------------

-- === TABLE 1: PROFILES ===
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  country TEXT,
  timezone TEXT DEFAULT 'UTC',
  daily_lead_target INTEGER DEFAULT 5 NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- === TABLE 2: LEADS ===
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  industry TEXT,
  country TEXT,
  status public.lead_status DEFAULT 'NEW'::public.lead_status NOT NULL,
  priority public.priority_level DEFAULT 'MEDIUM'::public.priority_level NOT NULL,
  estimated_value NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
  source TEXT,
  notes TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  next_follow_up_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- === TABLE 3: ACTIVITIES ===
CREATE TABLE public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- e.g. Lead Created, Called, WhatsApp Sent, Email Sent, Meeting, Proposal, Status Changed, Lost, Closed
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- === TABLE 4: FOLLOW_UPS ===
CREATE TABLE public.follow_ups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  followup_type TEXT NOT NULL, -- e.g. CALL, EMAIL, WHATSAPP, MEETING
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- === TABLE 5: MEETINGS ===
CREATE TABLE public.meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  meeting_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  location TEXT,
  meeting_type TEXT NOT NULL, -- e.g. ONLINE, IN_PERSON
  notes TEXT,
  status TEXT DEFAULT 'SCHEDULED'::text NOT NULL, -- e.g. SCHEDULED, COMPLETED, CANCELLED
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- === TABLE 6: TASKS ===
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority public.priority_level DEFAULT 'MEDIUM'::public.priority_level NOT NULL,
  status public.task_status DEFAULT 'TODO'::public.task_status NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- === TABLE 7: LOST_REASONS ===
CREATE TABLE public.lost_reasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL, -- e.g. Price, Competitor, Feature Missing, unresponsive
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- === TABLE 8: AI_INSIGHTS ===
CREATE TABLE public.ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads ON DELETE CASCADE NOT NULL,
  insight_type TEXT NOT NULL, -- e.g. CONVERSION_PROPENSITY, NEXT_ACTION, RISK_ALERT
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL, -- 0.00 to 100.00
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- === TABLE 9: NOTIFICATIONS ===
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type public.notification_type DEFAULT 'INFO'::public.notification_type NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- === TABLE 10: IMPORT_JOBS ===
CREATE TABLE public.import_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  total_records INTEGER DEFAULT 0 NOT NULL,
  successful_records INTEGER DEFAULT 0 NOT NULL,
  failed_records INTEGER DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'PROCESSING'::text NOT NULL, -- e.g. PROCESSING, COMPLETED, FAILED
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------------------
-- 4. HIGH-PERFORMANCE INDEXES
-- ---------------------------------------------------------------------

-- Leads index triggers
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_phone ON public.leads(phone);
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_business_name ON public.leads(business_name);
CREATE INDEX idx_leads_next_follow_up ON public.leads(next_follow_up_at);

-- Activities indexing
CREATE INDEX idx_activities_lead_id ON public.activities(lead_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at);

-- Follow-ups indexing
CREATE INDEX idx_follow_ups_user_id_scheduled ON public.follow_ups(user_id, scheduled_at);
CREATE INDEX idx_follow_ups_lead_id ON public.follow_ups(lead_id);

-- Meetings indexing
CREATE INDEX idx_meetings_time ON public.meetings(meeting_time);
CREATE INDEX idx_meetings_lead_id ON public.meetings(lead_id);

-- Tasks indexing
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);

-- AI Insights index triggers
CREATE INDEX idx_ai_insights_lead ON public.ai_insights(lead_id);

-- Notifications indexing
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- ---------------------------------------------------------------------
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------

-- Enable RLS on all public user-scoped tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile card
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Leads: Completely isolated permissions
CREATE POLICY "Users can manage their own leads" 
  ON public.leads FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Activities: Completely isolated permissions
CREATE POLICY "Users can manage their own activities" 
  ON public.activities FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Follow_ups: Completely isolated permissions
CREATE POLICY "Users can manage their own follow_ups" 
  ON public.follow_ups FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Meetings: Completely isolated permissions
CREATE POLICY "Users can manage their own meetings" 
  ON public.meetings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Tasks: Completely isolated permissions
CREATE POLICY "Users can manage their own tasks" 
  ON public.tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Lost Reasons: Completely isolated permissions
CREATE POLICY "Users can manage their own lost reasons" 
  ON public.lost_reasons FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- AI Insights: Completely isolated permissions
CREATE POLICY "Users can manage their own ai insights" 
  ON public.ai_insights FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notifications: Completely isolated permissions
CREATE POLICY "Users can manage their own notifications" 
  ON public.notifications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Import Jobs: Completely isolated permissions
CREATE POLICY "Users can manage their own import jobs" 
  ON public.import_jobs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- 6. SYSTEM AUTOMATION TRIGGERS
-- ---------------------------------------------------------------------

-- Create profile automatically when an auth.user completes signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, daily_lead_target)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'),
    5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------
-- 7. REALISTIC DEVELOPMENT SEED DATA
-- ---------------------------------------------------------------------

DO $$
DECLARE
  v_user_id UUID;
  v_lead_id_1 UUID := gen_random_uuid();
  v_lead_id_2 UUID := gen_random_uuid();
  v_lead_id_3 UUID := gen_random_uuid();
  v_lead_id_4 UUID := gen_random_uuid();
  v_lead_id_5 UUID := gen_random_uuid();
  v_lead_id_6 UUID := gen_random_uuid();
  v_lead_id_7 UUID := gen_random_uuid();
  v_lead_id_8 UUID := gen_random_uuid();
  v_lead_id_9 UUID := gen_random_uuid();
  v_lead_id_10 UUID := gen_random_uuid();
  v_lead_id_11 UUID := gen_random_uuid();
  v_lead_id_12 UUID := gen_random_uuid();
  v_lead_id_13 UUID := gen_random_uuid();
  v_lead_id_14 UUID := gen_random_uuid();
  v_lead_id_15 UUID := gen_random_uuid();
  v_lead_id_16 UUID := gen_random_uuid();
  v_lead_id_17 UUID := gen_random_uuid();
  v_lead_id_18 UUID := gen_random_uuid();
  v_lead_id_19 UUID := gen_random_uuid();
  v_lead_id_20 UUID := gen_random_uuid();
BEGIN
  -- Look for first user in system. If none, create the primary demo user
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NULL THEN
    v_user_id := '00000000-0000-0000-0000-000000000000'::UUID;
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    )
    VALUES (
      v_user_id,
      'alex.rivers@synity.io',
      -- Password '123456' encrypted
      '$2a$10$7Z2jOLePjT/W9R7MAn.OSe9p7yJq6C.Xy0z.FidVz3z6l1IWeq/eW',
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Alex Rivers","role":"Senior Sales Partner"}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    ) ON CONFLICT (id) DO NOTHING;

    -- Directly create corresponding profile in case trigger hasn't fired in manual migration
    INSERT INTO public.profiles (id, full_name, company_name, phone, country, timezone, daily_lead_target, avatar_url)
    VALUES (
      v_user_id,
      'Alex Rivers',
      'Synity Agency',
      '+1 (555) 019-2834',
      'United States',
      'America/New_York',
      5,
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
    ) ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Seed 20 Leads representing various stages of the AI Sales Operating System
  INSERT INTO public.leads (id, user_id, business_name, owner_name, phone, whatsapp, email, website, industry, country, status, priority, estimated_value, source, notes, next_follow_up_at)
  VALUES
    (v_lead_id_1, v_user_id, 'Acme Ventures', 'Sarah Jenkins', '+1 (555) 123-4567', '+1 (555) 123-4567', 'sjenkins@acmeventures.com', 'https://acmeventures.com', 'Venture Capital', 'United States', 'NEW', 'HIGH', 45000.00, 'LinkedIn Outreach', 'High profile VC contact seeking custom automation suite.', now() + interval '1 day'),
    (v_lead_id_2, v_user_id, 'Nebula Retail', 'John Carter', '+44 20 7946 0192', '+44 20 7946 0192', 'jcarter@nebularouter.io', 'https://nebularouter.io', 'E-commerce', 'United Kingdom', 'CALLED', 'MEDIUM', 18500.00, 'Cold Call', 'Discussed Shopify migration. Needs cost assessment.', now() + interval '2 days'),
    (v_lead_id_3, v_user_id, 'Apex Logistical', 'Miriam Vance', '+1 (555) 987-6543', NULL, 'miriam.v@apexlogistics.com', 'https://apexlogistics.com', 'Supply Chain', 'Canada', 'NO_ANSWER', 'LOW', 12000.00, 'Inbound Form', 'Called twice, no pickup. Left corporate voicemail.', now() + interval '3 days'),
    (v_lead_id_4, v_user_id, 'Quantum Health', 'Dr. Aris Vance', '+1 (555) 444-2222', '+1 (555) 444-2222', 'dr.vance@quantumhealth.com', 'https://quantumhealth.org', 'Biotech', 'United States', 'INTERESTED', 'HIGH', 62000.00, 'Google Search', 'Extremely keen on AI-driven client intake pipelines.', now() + interval '12 hours'),
    (v_lead_id_5, v_user_id, 'Horizon Real Estate', 'Marcus Brody', '+1 (555) 231-1002', '+1 (555) 231-1002', 'mbrody@horizonre.com', 'https://horizonre.com', 'Real Estate', 'United States', 'WHATSAPP_SENT', 'MEDIUM', 24000.00, 'Facebook Ads', 'Sent introductory brochure over WhatsApp Business.', now() + interval '4 days'),
    (v_lead_id_6, v_user_id, 'Vanguard Security', 'Ethan Hunt', '+1 (555) 999-8888', '+1 (555) 999-8888', 'ehunt@vanguardsec.com', 'https://vanguardsec.net', 'Cybersecurity', 'United States', 'FOLLOW_UP', 'URGENT', 85000.00, 'Referral', 'Immediate follow-up required. Interested in custom CRM SDK integrations.', now() + interval '1 hour'),
    (v_lead_id_7, v_user_id, 'Lumina Creative', 'Elena Rostova', '+7 495 123-45-67', NULL, 'erostova@lumina.ru', 'https://lumina.ru', 'Creative Agency', 'Russia', 'MEETING', 'MEDIUM', 15000.00, 'LinkedIn Outreach', 'Zoom meeting scheduled to demonstrate Synity workflows.', now() + interval '5 days'),
    (v_lead_id_8, v_user_id, 'Zeta Global', 'Tariq Al-Mansoor', '+971 4 123 4567', '+971 4 123 4567', 'talmansoor@zetaglobal.ae', 'https://zetaglobal.ae', 'Conglomerate', 'United Arab Emirates', 'PROPOSAL', 'HIGH', 135000.00, 'Partner Network', 'Enterprise proposal submitted. Awaiting legal review.', now() + interval '2 days'),
    (v_lead_id_9, v_user_id, 'Echo Energy', 'Chloe Devereaux', '+33 1 42 27 78 89', '+33 1 42 27 78 89', 'cdevereaux@echoenergy.fr', 'https://echoenergy.fr', 'Renewables', 'France', 'NEGOTIATION', 'HIGH', 95000.00, 'Conference', 'Negotiating contract terms and custom multi-user seat licensing pricing.', now() + interval '1 day'),
    (v_lead_id_10, v_user_id, 'Matrix Retailers', 'Neo Anderson', '+1 (555) 101-0101', '+1 (555) 101-0101', 'nanderson@matrixretail.com', 'https://matrixretail.com', 'Fashion Retail', 'United States', 'CLOSED', 'LOW', 22000.00, 'Google Search', 'Deal finalized. Onboarding completed successfully.', NULL),
    (v_lead_id_11, v_user_id, 'Sovereign Corp', 'Reginald Sterling', '+1 (555) 700-1200', NULL, 'rsterling@sovereigncorp.com', 'https://sovereigncorp.com', 'Real Estate', 'United States', 'LOST', 'LOW', 50000.00, 'Cold Call', 'Lost due to budget cuts. Check back in Q3 2027.', NULL),
    (v_lead_id_12, v_user_id, 'Titanium Heavy', 'Bruce Banner', '+1 (555) 300-4000', '+1 (555) 300-4000', 'bbanner@titaniumheavy.com', 'https://titaniumheavy.com', 'Manufacturing', 'United States', 'NEW', 'MEDIUM', 35000.00, 'Referral', 'New heavy manufacturing lead. Seeking inventory automation system.', now() + interval '6 days'),
    (v_lead_id_13, v_user_id, 'Starlight Hotels', 'Stella Maris', '+34 91 123 4567', '+34 91 123 4567', 'smaris@starlight.es', 'https://starlight.es', 'Hospitality', 'Spain', 'INTERESTED', 'MEDIUM', 28000.00, 'Inbound Form', 'Inquired about scheduling tools. Very responsive.', now() + interval '3 days'),
    (v_lead_id_14, v_user_id, 'Alpha Labs', 'Giles Corby', '+61 2 9876 5432', NULL, 'gcorby@alphalabs.com.au', 'https://alphalabs.com.au', 'Biotech', 'Australia', 'FOLLOW_UP', 'MEDIUM', 16000.00, 'LinkedIn Outreach', 'Keep in touch. Asked for technical integration document.', now() + interval '4 days'),
    (v_lead_id_15, v_user_id, 'Omega Finance', 'Arthur Dent', '+44 117 928 1111', NULL, 'adent@omegafinance.co.uk', 'https://omegafinance.co.uk', 'Fintech', 'United Kingdom', 'PROPOSAL', 'URGENT', 78000.00, 'LinkedIn Outreach', 'Custom data dashboard proposal submitted. Follow up on Monday.', now() + interval '3 days'),
    (v_lead_id_16, v_user_id, 'Hyperion Labs', 'Selina Kyle', '+1 (555) 808-9090', '+1 (555) 808-9090', 'skyle@hyperionlabs.com', 'https://hyperionlabs.io', 'Technology', 'United States', 'MEETING', 'HIGH', 40000.00, 'Google Search', 'Reviewing system parameters in Zoom next Friday.', now() + interval '7 days'),
    (v_lead_id_17, v_user_id, 'Blue Sky Aviation', 'Hal Jordan', '+1 (555) 555-0123', '+1 (555) 555-0123', 'hjordan@blueskyaviation.com', 'https://blueskyaviation.com', 'Logistics', 'United States', 'CALLED', 'MEDIUM', 49000.00, 'Cold Call', 'Spoke briefly. Requested customized pilot portal overview.', now() + interval '1 day'),
    (v_lead_id_18, v_user_id, 'Delta Construct', 'John Doe', '+1 (555) 222-3333', NULL, 'jdoe@deltaconstruct.com', 'https://deltaconstruct.com', 'Construction', 'United States', 'NEW', 'LOW', 11500.00, 'Cold Call', 'Initial call. Construction firm interested in field dispatching.', now() + interval '8 days'),
    (v_lead_id_19, v_user_id, 'Novus Tech', 'Claire Redfield', '+1 (555) 474-3929', '+1 (555) 474-3929', 'credfield@novustech.com', 'https://novustech.io', 'SaaS', 'United States', 'CLOSED', 'MEDIUM', 31000.00, 'Inbound Form', 'Onboarding completed. Satisfied with initial layout and latency.', NULL),
    (v_lead_id_20, v_user_id, 'Oasis Water', 'Immortan Joe', '+1 (555) 888-0000', '+1 (555) 888-0000', 'ijoe@oasiswater.org', 'https://oasiswater.org', 'Agriculture', 'United States', 'LOST', 'URGENT', 99000.00, 'Inbound Form', 'Lost due to competitor undercut.', NULL);

  -- Seed Lost Reasons for lost leads
  INSERT INTO public.lost_reasons (lead_id, user_id, reason, details)
  VALUES
    (v_lead_id_11, v_user_id, 'Budget Restrictions', 'Internal structural reorganization halted all spending until 2027.'),
    (v_lead_id_20, v_user_id, 'Competitor Selection', 'Competitor offered a 35% discount on licensing to match their current budget.');

  -- Seed Activities
  INSERT INTO public.activities (lead_id, user_id, activity_type, description, metadata)
  VALUES
    (v_lead_id_1, v_user_id, 'Lead Created', 'Lead manually entered via the Synity Quick Creator.', '{"origin": "user_ui"}'),
    (v_lead_id_2, v_user_id, 'Called', 'Spoke with John Carter. Discussed Shopify migration steps.', '{"duration_seconds": 312}'),
    (v_lead_id_4, v_user_id, 'Email Sent', 'Dispatched personalized platform brochure and custom calendar link.', '{"brochure_attached": true}'),
    (v_lead_id_5, v_user_id, 'WhatsApp Sent', 'Sent introductory PDF and pricing layout on WhatsApp Business.', '{"media_sent": "pdf"}'),
    (v_lead_id_8, v_user_id, 'Proposal', 'Drafted and emailed comprehensive enterprise automation proposal.', '{"version": "v1.2_final"}');

  -- Seed Tasks
  INSERT INTO public.tasks (user_id, lead_id, title, description, priority, status, due_date)
  VALUES
    (v_user_id, v_lead_id_1, 'Draft custom VC integration proposal', 'Acme requested detailed architecture diagrams for client data privacy pipelines.', 'HIGH', 'TODO', now() + interval '1 day'),
    (v_user_id, v_lead_id_2, 'Compile cost assessment for Shopify', 'Review current e-commerce transaction volumes to calculate cost savings.', 'MEDIUM', 'IN_PROGRESS', now() + interval '2 days'),
    (v_user_id, v_lead_id_6, 'CRITICAL Follow-up on Vanguard Security', 'Ethan requested immediate contact to resolve technical compliance concerns.', 'URGENT', 'TODO', now() + interval '1 hour'),
    (v_user_id, NULL, 'Prepare weekly pipeline evaluation review', 'Internal chore: Review closing stages and update confidence values.', 'LOW', 'TODO', now() + interval '3 days');

  -- Seed Follow-ups
  INSERT INTO public.follow_ups (lead_id, user_id, scheduled_at, followup_type, notes)
  VALUES
    (v_lead_id_1, v_user_id, now() + interval '1 day', 'EMAIL', 'Follow up on acme ventures proposal feedback.'),
    (v_lead_id_4, v_user_id, now() + interval '12 hours', 'CALL', 'Answer Dr. Vance technical questions regarding client storage integration.'),
    (v_lead_id_6, v_user_id, now() + interval '1 hour', 'WHATSAPP', 'High-priority check-in with Ethan Hunt.');

  -- Seed Meetings
  INSERT INTO public.meetings (lead_id, user_id, title, meeting_time, duration, location, meeting_type, notes)
  VALUES
    (v_lead_id_7, v_user_id, 'Synity Platform Demo', now() + interval '5 days', 45, 'https://meet.google.com/abc-defg-hij', 'ONLINE', 'Demoing multi-seat dashboard, notification channels, and active lead cards.'),
    (v_lead_id_16, v_user_id, 'Parameter Engineering Review', now() + interval '7 days', 60, 'https://zoom.us/j/123456789', 'ONLINE', 'Deep technical dive into AI-assisted lead scoring algorithms with Selina Kyle.');

  -- Seed AI Insights
  INSERT INTO public.ai_insights (user_id, lead_id, insight_type, title, description, confidence_score)
  VALUES
    (v_user_id, v_lead_id_1, 'CONVERSION_PROPENSITY', 'High Closure Likelihood', 'Acme Ventures matches the historical ICP with 92% similarity in both volume and urgency.', 92.50),
    (v_user_id, v_lead_id_6, 'RISK_ALERT', 'Potential Leakage Threat', 'Vanguard Security has an urgent timeline. Delaying contact past today may result in competitor acquisition.', 85.00);

  -- Seed Notifications
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES
    (v_user_id, 'Task Due: Vanguard Security Check', 'Your urgent task to check compliant guidelines with Vanguard Security is due in 1 hour.', 'WARNING'),
    (v_user_id, 'Acme Ventures Insight Generated', 'Deep Engine finished conversion propensity scan. Score calculated at 92.50%.', 'SUCCESS');

  -- Seed Import Jobs
  INSERT INTO public.import_jobs (user_id, file_name, file_type, total_records, successful_records, failed_records, status)
  VALUES
    (v_user_id, 'leads_july_outreach.csv', 'CSV', 150, 142, 8, 'COMPLETED');

END $$;

-- =====================================================================
-- End of Synity Database Migration SQL
-- =====================================================================
