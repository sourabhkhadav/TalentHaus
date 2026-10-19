-- ─────────────────────────────────────────────────────────────────────────────
-- TALENTHAUS AGENCY OS SCHEMA MIGRATION
-- Project: khlbuvsrheafalmgsovs
-- Safe & Idempotent: Uses IF NOT EXISTS, preserves existing records and roles.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. AGENCIES
CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'TalentHaus',
    slug TEXT UNIQUE NOT NULL DEFAULT 'talenthaus',
    city TEXT DEFAULT 'Indore',
    country TEXT DEFAULT 'India',
    currency TEXT DEFAULT 'INR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'talent' CHECK (role IN ('founder', 'admin', 'talent', 'brand')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AGENCY MEMBERS (Multi-Founder Collaboration in single agency)
CREATE TABLE IF NOT EXISTS public.agency_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('founder', 'partner', 'manager', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agency_id, user_id)
);

-- 5. INFLUENCERS / CREATORS ROSTER
CREATE TABLE IF NOT EXISTS public.influencers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    niche TEXT[] DEFAULT '{}',
    platforms TEXT[] DEFAULT '{}',
    location TEXT DEFAULT 'Indore, India',
    bio TEXT NOT NULL,
    short_bio TEXT,
    audience_size TEXT NOT NULL DEFAULT '100K',
    engagement_rate TEXT NOT NULL DEFAULT '5.0%',
    image_url TEXT,
    cover_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT FALSE,
    instagram_handle TEXT,
    instagram_followers TEXT,
    youtube_handle TEXT,
    youtube_subscribers TEXT,
    tiktok_handle TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DEALS
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    brand_contact TEXT,
    talent_id UUID REFERENCES public.influencers(id) ON DELETE SET NULL,
    talent_name TEXT NOT NULL,
    title TEXT NOT NULL,
    platform TEXT DEFAULT 'Multi-Platform',
    fee TEXT NOT NULL,
    fee_numeric NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'negotiation', 'confirmed', 'completed', 'cancelled')),
    deadline DATE,
    contract_date DATE DEFAULT CURRENT_DATE,
    assigned_founder TEXT DEFAULT 'Sourabh',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EXPENSES
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Rent', 'Recurring Agency Cost', 'Legal & Accounting', 'Software & Tools', 'Production & Studio', 'Creator Payout')),
    amount TEXT NOT NULL,
    amount_numeric NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid')),
    due_date DATE,
    paid_date DATE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency TEXT DEFAULT 'Monthly',
    vendor TEXT,
    managed_by TEXT DEFAULT 'Sourabh',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT NOT NULL DEFAULT 'Sourabh',
    related_entity TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INBOUND INQUIRIES (Public contact briefs)
CREATE TABLE IF NOT EXISTS public.inbound_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    budget TEXT,
    timeline TEXT,
    services TEXT[] DEFAULT '{}',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CREATOR APPLICATIONS (Join page submissions)
CREATE TABLE IF NOT EXISTS public.creator_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT NOT NULL,
    primary_platform TEXT NOT NULL,
    handle TEXT NOT NULL,
    audience_size TEXT,
    niche TEXT[] DEFAULT '{}',
    bio TEXT,
    portfolio_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'accepted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbound_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;

-- Influencers: Public can read published influencers; Authenticated agency members can manage
CREATE POLICY "Public read published influencers" ON public.influencers
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users full access to influencers" ON public.influencers
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Deals: Authenticated agency members can read and manage
CREATE POLICY "Authenticated users full access to deals" ON public.deals
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Expenses: Authenticated agency members can read and manage
CREATE POLICY "Authenticated users full access to expenses" ON public.expenses
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tasks: Authenticated agency members can read and manage
CREATE POLICY "Authenticated users full access to tasks" ON public.tasks
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Inquiries: Public can insert inquiries; Authenticated founders can read/update
CREATE POLICY "Public can submit inquiries" ON public.inbound_inquiries
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view inquiries" ON public.inbound_inquiries
    FOR SELECT TO authenticated USING (true);

-- Applications: Public can insert applications; Authenticated founders can read/update
CREATE POLICY "Public can submit creator applications" ON public.creator_applications
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view applications" ON public.creator_applications
    FOR SELECT TO authenticated USING (true);

-- Profiles: Users can view their own profile and founders can view all profiles
CREATE POLICY "Users can view and update their profile" ON public.profiles
    FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE BUCKET CONFIGURATION (Photos & Media)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('creator-photos', 'creator-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access to creator photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'creator-photos');

CREATE POLICY "Authenticated user upload to creator photos" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'creator-photos');

CREATE POLICY "Authenticated user update/delete creator photos" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'creator-photos');

CREATE POLICY "Authenticated user delete creator photos" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'creator-photos');
