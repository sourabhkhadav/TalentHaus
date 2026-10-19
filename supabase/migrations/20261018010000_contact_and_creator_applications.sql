-- TALENTHAUS — CONTACT & CREATOR APPLICATIONS MIGRATION
-- Project: khlbuvsrheafalmgsovs

-- 1. Create table contact_submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    budget TEXT,
    timeline TEXT,
    services TEXT[] DEFAULT '{}',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'reviewing', 'approved', 'closed', 'archived')),
    notes TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for searching and founder dashboard sorting
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions (status);

-- 2. Create table creator_applications
CREATE TABLE IF NOT EXISTS public.creator_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    primary_platform TEXT NOT NULL,
    handle TEXT NOT NULL,
    audience_size TEXT NOT NULL,
    niche TEXT[] DEFAULT '{}',
    bio TEXT NOT NULL,
    portfolio_url TEXT,
    media_kit_name TEXT,
    file_path TEXT,
    file_size BIGINT,
    file_type TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
    notes TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for searching and founder dashboard sorting
CREATE INDEX IF NOT EXISTS idx_creator_applications_created_at ON public.creator_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creator_applications_status ON public.creator_applications (status);

-- 3. Set up Storage Bucket: creator-applications (Strictly Private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'creator-applications',
    'creator-applications',
    false, -- Strictly private
    10485760, -- 10 MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for contact_submissions
-- Public visitors can submit brand campaign briefs (INSERT only)
DROP POLICY IF EXISTS "Public can submit contact brief" ON public.contact_submissions;
CREATE POLICY "Public can submit contact brief"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Authenticated founders/members can view all contact submissions
DROP POLICY IF EXISTS "Founders can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Founders can view contact submissions"
ON public.contact_submissions
FOR SELECT
USING (auth.role() = 'authenticated');

-- Authenticated founders can update contact submission status/notes
DROP POLICY IF EXISTS "Founders can update contact submissions" ON public.contact_submissions;
CREATE POLICY "Founders can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (auth.role() = 'authenticated');

-- 6. RLS Policies for creator_applications
-- Public visitors can submit creator applications (INSERT only)
DROP POLICY IF EXISTS "Public can submit creator application" ON public.creator_applications;
CREATE POLICY "Public can submit creator application"
ON public.creator_applications
FOR INSERT
WITH CHECK (true);

-- Authenticated founders/members can view creator applications
DROP POLICY IF EXISTS "Founders can view creator applications" ON public.creator_applications;
CREATE POLICY "Founders can view creator applications"
ON public.creator_applications
FOR SELECT
USING (auth.role() = 'authenticated');

-- Authenticated founders can update creator application status/notes
DROP POLICY IF EXISTS "Founders can update creator applications" ON public.creator_applications;
CREATE POLICY "Founders can update creator applications"
ON public.creator_applications
FOR UPDATE
USING (auth.role() = 'authenticated');

-- 7. Storage Policies for creator-applications bucket
-- Anyone can upload application attachments to creator-applications
DROP POLICY IF EXISTS "Anyone can upload application files" ON storage.objects;
CREATE POLICY "Anyone can upload application files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'creator-applications');

-- Only authenticated users (Founders) can read/download application attachments
DROP POLICY IF EXISTS "Founders can view application files" ON storage.objects;
CREATE POLICY "Founders can view application files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'creator-applications' AND auth.role() = 'authenticated');
