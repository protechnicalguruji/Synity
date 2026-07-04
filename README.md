# Synity — Production-Grade AI Sales Operating System

Synity is a premium, modern **AI Sales Operating System** designed to actively help salespeople, web developers, marketing agencies, and freelancers close more deals. Unlike traditional CRMs that serve merely as static data storehouses, Synity proactively guides client touch-points, schedules high-propensity tasks, tracks pipeline valuations, and prevents missed follow-ups.

---

## 💎 Project Vision & Philosophy

> *"Don't just store leads. Help users close them."*

Every single component, visual container, and workflow inside Synity is calibrated around three functional answers:
1. **Does it save time?** (e.g., rapid creation popups and contextual action items).
2. **Does it reduce manual work?** (e.g., automated follow-up scheduling and smart status badge mappings).
3. **Does it increase sales/prevent forgotten leads?** (e.g., close-propensity metric scores and dedicated follow-up visual indices).

---

## 🎨 Visual Identity & Styling System

The user interface draws inspiration from premium SaaS products such as **Linear**, **Notion**, and **Stripe**, prioritizing spacious, quiet, and highly polished layouts.

### Color Palette Configured
*   **Primary Dark:** `#4E4E49` (Slate/Khaki hybrid accenting primary UI buttons)
*   **Secondary Dark:** `#60605B` (Support typography and muted structures)
*   **Primary Accent:** `#8CB9D7` (High propensity highlight, indicators, and charts)
*   **Background Canvas:** `#E5E3E7` (Soft, warm off-white layout)
*   **Surface Containers:** `#FFFFFF` (Card panels and tables)
*   **Typography Text:** `#2F2F2F` (Deep readable charcoal gray)
*   **Muted Elements:** `#666666` (Subtle captions and guidelines)
*   **Borders:** `#D8D8D8` (Thin borders separating grid blocks)

### Typography Pairing
*   **Primary Copy:** `Inter` (Excellent legibility, balanced weights, clean vertical rhythm)
*   **Display Headings:** `Space Grotesk` (Tech-forward geometric display lettering)
*   **Indicators/Metadata:** `JetBrains Mono` (System numbers, currency amounts, timestamps)

---

## 📁 System Architecture & Directory Tree

We have implemented a highly modular, clean, and scalable architecture:

```text
/
├── .env.example            # Environment variables placeholder
├── index.html              # Core application index entry
├── metadata.json           # Application name, description, and permissions
├── package.json            # Managed scripts, dependencies, and metadata
├── tsconfig.json           # TypeScript compilation settings
├── vite.config.ts          # Vite build parameters
└── src/
    ├── App.tsx             # Global coordinator (State manager, tab-router, modals)
    ├── index.css           # Global typography loading, scrollbar & Tailwind configurations
    ├── main.tsx            # React application renderer
    ├── vite-env.d.ts       # TypeScript environment overrides for Vite client envs
    ├── types/
    │   └── index.ts        # Contract types (Leads, Pipelines, Tasks, Activities, etc.)
    ├── constants/
    │   └── index.ts        # Sidebar metadata, sources list, and rich high-fidelity mockups
    ├── utils/
    │   └── index.ts        # safe clsx/tailwind-merge cn(), date/currency formatters, badge styles
    ├── hooks/
    │   └── useAuth.ts      # Custom unified hook to access current user & auth functions
    ├── providers/
    │   └── AuthProvider.tsx # Global authentication context with real-time listeners and demo fallback
    ├── lib/
    │   └── supabase/
    │       ├── client.ts    # Resilient browser client initialization
    │       ├── server.ts    # Secure server client template for backend proxy services
    │       └── middleware.ts # Public vs. Protected routing authorization configurations
    └── components/
        ├── auth/           # Fully integrated SaaS security views
        │   ├── LoginView.tsx # Welcome Back view with Google SSO, Remember Me, and validation
        │   ├── SignupView.tsx # Access request view with validation & confirm matching
        │   ├── ForgotPasswordView.tsx # Email recovery dispatcher with high fidelity success card
        │   └── ResetPasswordView.tsx # New credentials configuration form
        ├── ui/             # Highly reusable core visual system elements
        │   ├── Button.tsx  # Framer Motion powered responsive button variants
        │   ├── Card.tsx    # Crisp borders, elegant shadows container
        │   ├── Badge.tsx   # Visual status labels
        │   ├── Input.tsx   # Custom label inputs, textareas, and selectors
        │   ├── Modal.tsx   # Overlay with premium enter/exit spring animations
        │   ├── Toast.tsx   # Slide-and-fade notification notifier cards (success/error/info)
        │   ├── EmptyState.tsx # High-fidelity illustrations and action tips
        │   ├── Loading.tsx # Shimmer loaders and custom skeleton grids
        │   └── ErrorBoundary.tsx # Resilient fallback crash container
        └── shared/         # Universal layout assemblies
            ├── Sidebar.tsx # Left collapsible navigation, synced with live active user profile & logout
            └── TopNav.tsx  # Top bar with quick creation triggers and notification center
```

---

## 🔒 Supabase Authentication Engine

The authentication layer features production-grade security, error-handling, and elegant visual states.

### Running Live Production Mode
To connect your own live Supabase Cloud database:
1. Copy `.env.example` to `.env`.
2. Populate the following client-side environment keys in your settings tab:
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-public-key"
   ```
3. Restart the server or refresh your browser. The application will automatically detect the credentials, bind real-time auth listeners, and synchronize user sessions.

### Resilient Demo Sandbox Fallback
If the Supabase keys are not configured yet, the Sales OS will **automatically fall back to a high-fidelity local Sandbox Mode** instead of crashing or locking up:
* **Immediate Evaluation**: Use any sample credentials (or `alex.rivers@synity.io` with password `123456`) to access the full crm capabilities instantly.
* **Local Persistence**: Signed-up users and updated passwords are saved to client-side local storage and persist across tab refreshes.

---

## 🗄️ Supabase PostgreSQL Database Architecture

Synity Sales OS is powered by a high-performance, enterprise-grade PostgreSQL schema hosted on Supabase. It is fully optimized for AI workflows, Row-Level Security (RLS) data isolation, and massive scale.

### 📐 Schema Entity-Relationship Model

The database establishes a highly index-optimized relational web:
* **One User Profile** (`auth.users`) $\rightarrow$ **Many Leads**
* **One Lead** $\rightarrow$ **Many Activities**, **Many Follow-Ups**, **Many Meetings**, **Many Tasks**, **Many AI Insights**, and **One Lost Reason**

### 📊 Core Tables & Fields

1. **`profiles`**: User metadata & productivity settings.
   * `id` (UUID, references `auth.users` on delete cascade, Primary Key)
   * `full_name` (Text), `company_name` (Text), `phone` (Text), `country` (Text), `timezone` (Text), `daily_lead_target` (Integer, default 5), `avatar_url` (Text)
   * `created_at` (Timestamp), `updated_at` (Timestamp)
2. **`leads`**: Master pipeline prospects.
   * `id` (UUID, Primary Key), `user_id` (UUID, references `auth.users`), `business_name` (Text), `owner_name` (Text), `phone` (Text), `whatsapp` (Text), `email` (Text), `website` (Text), `industry` (Text), `country` (Text)
   * `status` (`lead_status` ENUM), `priority` (`priority_level` ENUM), `estimated_value` (Numeric), `source` (Text), `notes` (Text), `last_contacted_at` (Timestamp), `next_follow_up_at` (Timestamp)
   * `created_at`, `updated_at` (Timestamp)
3. **`activities`**: Automated & manual sales touchpoints log.
   * `id`, `lead_id` (UUID, references `leads`), `user_id`, `activity_type` (Text), `description` (Text), `metadata` (JSONB), `created_at`
4. **`follow_ups`**: Time-sensitive pipeline follow-ups.
   * `id`, `lead_id`, `user_id`, `scheduled_at` (Timestamp), `completed` (Boolean), `completed_at` (Timestamp), `followup_type` (Text), `notes`, `created_at`
5. **`meetings`**: High-fidelity events scheduler.
   * `id`, `lead_id`, `user_id`, `title` (Text), `meeting_time` (Timestamp), `duration` (Integer, minutes), `location` (Text), `meeting_type` (Text), `notes` (Text), `status` (Text), `created_at`
6. **`tasks`**: Actionable standard operating items.
   * `id`, `user_id`, `lead_id` (Nullable), `title` (Text), `description` (Text), `priority` (`priority_level` ENUM), `status` (`task_status` ENUM), `due_date` (Timestamp), `completed_at`, `created_at`
7. **`lost_reasons`**: Lost deal analytics capture.
   * `id`, `lead_id`, `user_id`, `reason` (Text), `details` (Text), `created_at`
8. **`ai_insights`**: Predictive scoring and action prompts.
   * `id`, `user_id`, `lead_id`, `insight_type` (Text), `title` (Text), `description` (Text), `confidence_score` (Numeric), `created_at`
9. **`notifications`**: Real-time app alerts.
   * `id`, `user_id`, `title` (Text), `message` (Text), `type` (`notification_type` ENUM), `is_read` (Boolean), `created_at`
10. **`import_jobs`**: Smart CSV/XLSX lead import historical queue.
    * `id`, `user_id`, `file_name` (Text), `file_type` (Text), `total_records` (Integer), `successful_records`, `failed_records`, `status` (Text), `created_at`

### 🔒 Row-Level Security (RLS) & Multi-Tenant Isolation

Data privacy is strictly enforced directly inside the database engine.
* **RLS Enabled**: RLS is explicitly configured on all 10 custom tables.
* **Complete User Isolation**: Users can *only* select, insert, update, or delete records where the record's `user_id` matches their own verified Supabase JWT `auth.uid()`.
* **Profile Protection**: User profile cards are bound via `auth.uid() = id`, allowing only the registered account owner read/write capability.

### ⚡ Database Performance Tuning (Indexes & Triggers)

* **Lightning-Fast Query Indexes**: Highly-performant B-Tree indexes are created for all searchable and filterable fields including:
  * `user_id`, `status`, `phone`, `email`, `business_name`, `next_follow_up_at`, `meeting_time`, `due_date`, `created_at`
* **Automated `updated_at` Updates**: Registered PL/pgSQL database triggers automatically manage temporal syncing of `updated_at` timestamps on mutates.
* **Auto-Provision Profiles on Signup**: A PostgreSQL trigger on `auth.users` automatically replicates and registers a custom profile card in `public.profiles` the instant a user completes register validation!

---

## ⚡ Setup & Migration Instructions

### 1. Cloud Database Migration (Supabase CLI / SQL Editor)
To apply the complete database architecture to your live Supabase instance:
1. Open your **Supabase Dashboard** and go to the **SQL Editor** tab.
2. Open the migration file: `/supabase/migrations/20260703120000_create_sales_os_schema.sql` and copy its entire contents.
3. Paste the code into the Supabase SQL Editor and click **Run**.
4. The tables, custom Postgres ENUM types, triggers, indexes, and a set of 20 realistic sandbox seed records will be instantly created on your Cloud Postgres database!

### 2. High-Fidelity Local DB Sandbox Fallback
If environment keys are not configured, the application **automatically uses the unified database manager fallback (`src/lib/supabase/db.ts`)** which loads identical seed records, matches the PostgreSQL types, and maintains full local stateful reactivity (synced to browser storage). Add your keys in settings anytime to switch seamlessly to live Cloud syncing!

---

## ⚡ Flagship Feature: Smart Import Hub

Synity's Smart Import Hub is an enterprise-grade lead ingestion system engineered to process, validate, deduplicate, and merge lead lists from multiple unstructured formats before integrating them into the CRM.

### 📊 Supported File Formats
*   **Structured Formats**: CSV, Excel (`.xlsx`), Excel (`.xls`), JSON.
*   **Unstructured Formats**: PDF (Messy columns, tables), Plain Text (`.txt`).
*   **SaaS Integrations**: Pre-equipped for Google Sheets and CRM export file schemes.

### 🏗️ The 10-Step Smart Import Pipeline
1.  **Upload File**: Drag-and-drop file uploader zone displaying sizes, limits, and progress animations.
2.  **Preview Layout**: Interactive scrollable data preview table highlighting empty values and data quality issues.
3.  **Detect Columns**: Heuristic column auto-detection using semantic mapping and regex scores.
4.  **Map Fields**: Manual mapping controls allowing custom column target overrides and required field validations.
5.  **Detect Duplicates**: Cross-referencing against existing CRM databases by Email, Phone, Website, and Brand Name.
6.  **Validate Records**: Data cleanliness report classifying cell anomalies as blocking Errors or Warning alerts.
7.  **AI Suggestions (Future-Ready Placeholder)**: Built-in interface toggling upcoming PDF text scanners and sector estimators.
8.  **Confirm Import**: Configure daily workload assignments (5, 10, 15, 20, or custom leads/day) to the AI Daily Planner.
9.  **Import Progress**: Animated batch loader with live background worker logs.
10. **Import Summary**: Post-import efficiency analytics and operation speed reports.

### 🧠 Core Algorithmic Engines
*   **Semantic Header Detection**: Automatically detects standard CRM keys (e.g. `company`, `name`, `email`) using weighted score heuristics on raw column names.
*   **Multi-Field Duplicate Validation**: Identifies pre-existing CRM accounts by weighing exact email matches (99% confidence), phone overlaps (90%), identical domains (80%), or nested company strings (70%-85%).
*   **Smart Overwrite Prevention (Merges)**: Enables salespeople to merge incoming columns into pre-existing CRM leads. Locked fields are untouched, empty gaps are auto-populated, and text logs are safely combined side-by-side.

---

## ⚡ Flagship Feature: Universal Communication Hub

Synity's Universal Communication Hub is a comprehensive unified cockpit coordinating all outbound channels into a single, cohesive timeline, avoiding the friction of switching applications.

### 📐 Three-Panel Architectural Layout
1.  **Left Panel: Conversation List**: 
    *   **Pins & VIP Segment**: Easily pin crucial client threads to separate them from general feeds.
    *   **Channel Filtration**: Seamlessly isolate conversations by Email, WhatsApp, or Phone Logs.
    *   **Interactive Search**: Instantly query chats matching names, emails, company variables, or snippets.
2.  **Center Panel: Chronological Active Thread**:
    *   **Rich Message Bubble Handling**: Elegant components displaying PDF attachments, shared locations, and playable voice wave bars.
    *   **Event Sync Logs**: Automatically displays scheduled calendar meetings, sent proposals, and pipeline status swaps chronologically alongside messages.
    *   **Smart Message Composer**: Complete rich composer providing inline emoji pickers, standard calendar-based schedule-send delays, template drawers, and custom AI Reply suggestions.
3.  **Right Panel: Lead Profile & Metadata Directory**:
    *   **Contact Summary**: Displays estimated deal sizes, CRM stages, and real-time SLA health trackers.
    *   **Unified Quick Outbound Actions**: Quick actions trigger direct dial simulations, WhatsApp template delivery, email routing, task additions, and follow-up schedules.
    *   **Co-Pilot AI Insights**: Evaluates sentiment index, captures user intent maps, suggests next-best-action blueprints, and flags thread risk ratios.

### 🔄 Multi-Channel Unified Timeline Sync
Every sent WhatsApp, dial log, and scheduled sync event created inside the Communication Hub automatically synchronizes with the core CRM pipeline, creating standard logs inside the main Activity Timeline and generating priority follow-up tasks inside the AI Daily Planner.

---

## ⚡ Flagship Feature: Smart Notification & Reminder Engine

Synity's Smart Notification & Reminder Engine is an intelligent, high-fidelity alerting ecosystem that ensures sales teams never miss critical action-points or breach client SLA response guidelines.

### 📐 Structural Sub-Systems
1.  **Notification & Reminder Provider**:
    *   **Central State Engine**: Directs active, snoozed, completed, pinned, archived, and dismissed statuses.
    *   **Smart Priority & Escalation Heuristic**: Automatically upgrades alert urgency based on overdue times and critical SLA contact milestones.
    *   **Dynamic Snooze Engine**: Postpones active reminders using customizable preset intervals (10m, 30m, 1hr, or Custom durations).
2.  **Interactive Notification Center Dashboard**:
    *   **Active Chronological Feed**: Grouped dynamically by Today, Yesterday, and Earlier. Supports instant keyword searches, pinning, and marking-read toggles.
    *   **Chronological SLA Timeline**: Color-coded segments organizing follow-ups as Overdue Breaches, Due Today, Due Tomorrow, and Upcoming.
    *   **In-App Floating Toast Portal**: Renders premium real-time notifications with specialized visuals for Success, Warnings, Critical Errors, and AI Insights.
3.  **Cognitive Executive AI Digests**:
    *   Generates on-demand synthesized briefings (Morning, Evening, Weekly) summarizing sales pipelines.
    *   Identifies urgent action-points, reviews overall workflow velocities, and isolates high-priority leads to re-engage.
4.  **Quiet Hours Focus Buffer**:
    *   Silences incoming low/medium priority alerts during custom hours while letting Critical Escalations pass unimpeded.

---

## 📊 Feature: Business Intelligence & Analytics Module

Synity's Business Intelligence & Analytics module is a premium, high-fidelity corporate reporting and statistical forecasting workspace designed to evaluate sales pipelines, vertical market yields, geographic opportunity distribution, and team velocity metrics.

### 📐 Analytical Modules & Reusable Chart Components
1.  **Sales Funnel Velocity Index**:
    *   Vertical stage-by-stage waterfall visualizer capturing deal volume, progression percentages, and transition drop-off ratios.
2.  **Pipeline Revenue Liquidity**:
    *   Compares gross active contract value, realized bookings, lost opportunities, and expected revenue weighted by stage probabilities.
3.  **B2B Industry & Geographic Distribution**:
    *   Horizontal bar arrays segmenting B2B verticals (e.g., Biotech, Real Estate) and concentric donut charts indicating global customer acquisition yields.
4.  **Activity & Productivity Streaks Console**:
    *   Composed actual-vs-target metrics trackers paired with dynamic flame gauges representing daily outbound work streaks.
5.  **AI Sales Revenue Forecaster**:
    *   Predictive modeling displaying Expected, Likely, Optimistic, and Pessimistic ranges computed via continuous pipeline probabilities.
6.  **Milestone & Goal Progress Tracker**:
    *   Visual progress indicators aligning realized bookings, outreach calls, and discovery meetings against monthly targets.
7.  **Loss Analysis & Recovery Engine**:
    *   Evaluates primary revenue leak sources (such as budget freezes, competitor matches) and lists specific deal chokes.
8.  **Automatic Dispatch Scheduler & Exports**:
    *   Triggers real-time client-side CSV compiling and print-ready PDF formats, with customizable daily, weekly, and monthly email dispatch presets.

---

## 🔋 Next Steps

1. **Gemini AI Integration**:
   * Implement server-side proxies (`/api/ai/score`, `/api/ai/follow-up`) using the `@google/genai` TypeScript SDK.
   * Leverage client-authored sales notes to dynamically update a lead's `confidenceScore` and draft tailored outreach content.


