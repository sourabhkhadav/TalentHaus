-- ─────────────────────────────────────────────────────────────────────────────
-- TALENTHAUS — RUN THIS IN SUPABASE SQL EDITOR TO FIX DB SYNC
-- Project ID: khlbuvsrheafalmgsovs
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Table: contact_submissions (Brand Campaign Briefs)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    budget TEXT NOT NULL DEFAULT 'Flexible',
    timeline TEXT NOT NULL DEFAULT 'Immediate / Flexible',
    services TEXT[] DEFAULT '{}',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions (status);

-- 2. Table: creator_applications (Creator Roster Join Applications)
CREATE TABLE IF NOT EXISTS public.creator_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    primary_platform TEXT NOT NULL DEFAULT 'Instagram',
    handle TEXT NOT NULL,
    audience_size TEXT NOT NULL DEFAULT '50K - 100K',
    niche TEXT[] DEFAULT '{}',
    bio TEXT NOT NULL,
    portfolio_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creator_applications_created_at ON public.creator_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creator_applications_status ON public.creator_applications (status);

-- 3. Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;

-- 4. Policies for contact_submissions
DROP POLICY IF EXISTS "Public can submit contact brief" ON public.contact_submissions;
CREATE POLICY "Public can submit contact brief"
ON public.contact_submissions FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone authorized can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Anyone authorized can view contact submissions"
ON public.contact_submissions FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Anyone authorized can update contact submissions" ON public.contact_submissions;
CREATE POLICY "Anyone authorized can update contact submissions"
ON public.contact_submissions FOR UPDATE
USING (true);

-- 5. Policies for creator_applications
DROP POLICY IF EXISTS "Public can submit creator application" ON public.creator_applications;
CREATE POLICY "Public can submit creator application"
ON public.creator_applications FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone authorized can view creator applications" ON public.creator_applications;
CREATE POLICY "Anyone authorized can view creator applications"
ON public.creator_applications FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Anyone authorized can update creator applications" ON public.creator_applications;
CREATE POLICY "Anyone authorized can update creator applications"
ON public.creator_applications FOR UPDATE
USING (true);

-- 6. Grant Permissions to anon & authenticated roles
GRANT ALL ON public.contact_submissions TO anon, authenticated, service_role;
GRANT ALL ON public.creator_applications TO anon, authenticated, service_role;
