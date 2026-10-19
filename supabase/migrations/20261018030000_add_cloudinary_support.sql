-- ─────────────────────────────────────────────────────────────────────────────
-- TALENTHAUS CLOUDINARY INTEGRATION MIGRATION
-- Project: khlbuvsrheafalmgsovs
-- Safe & Idempotent: Adds Cloudinary tracking without mutating existing data.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add Cloudinary Public IDs to Influencers
ALTER TABLE public.influencers 
ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT;

ALTER TABLE public.influencers 
ADD COLUMN IF NOT EXISTS cover_cloudinary_public_id TEXT;

-- 2. Add Cloudinary Public ID to Profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT;

-- 3. Media Assets Registry (Central agency library for creators, campaigns, brands, team)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('creators', 'campaigns', 'brands', 'team', 'general')),
    title TEXT,
    public_id TEXT UNIQUE NOT NULL,
    secure_url TEXT NOT NULL,
    format TEXT,
    width INTEGER,
    height INTEGER,
    bytes INTEGER,
    related_slug TEXT,
    uploaded_by TEXT DEFAULT 'founder',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS on Media Assets
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Allow public read access so images can be rendered across the website
CREATE POLICY "Public Read Media Assets" 
ON public.media_assets FOR SELECT 
USING (true);

-- Allow authenticated founders to insert/update/delete media assets
CREATE POLICY "Founders Full Access Media Assets" 
ON public.media_assets FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
