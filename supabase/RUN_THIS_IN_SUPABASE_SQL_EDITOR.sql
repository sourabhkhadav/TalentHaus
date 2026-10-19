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

-- 3. Table: influencers (Creators / Talent Roster)
CREATE TABLE IF NOT EXISTS public.influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    niche TEXT[] DEFAULT '{}',
    platforms TEXT[] DEFAULT '{}',
    location TEXT DEFAULT 'Indore, India',
    bio TEXT NOT NULL DEFAULT '',
    short_bio TEXT DEFAULT '',
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
    cloudinary_public_id TEXT,
    cover_cloudinary_public_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all required columns exist on public.influencers (handles pre-existing tables)
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS agency_id UUID;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS niche TEXT[] DEFAULT '{}';
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS platforms TEXT[] DEFAULT '{}';
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Indore, India';
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS short_bio TEXT DEFAULT '';
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS audience_size TEXT DEFAULT '100K';
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS engagement_rate TEXT DEFAULT '5.0%';
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS instagram_handle TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS instagram_followers TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS youtube_handle TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS youtube_subscribers TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS tiktok_handle TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS cover_cloudinary_public_id TEXT;
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.influencers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS idx_influencers_slug ON public.influencers (slug);
CREATE INDEX IF NOT EXISTS idx_influencers_status ON public.influencers (status);
CREATE INDEX IF NOT EXISTS idx_influencers_featured ON public.influencers (featured);
CREATE INDEX IF NOT EXISTS idx_influencers_created_at ON public.influencers (created_at DESC);

-- 4. Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;

-- 5. Policies for contact_submissions
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

-- 6. Policies for creator_applications
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

-- 7. Policies for influencers
DROP POLICY IF EXISTS "Public read published influencers" ON public.influencers;
CREATE POLICY "Public read published influencers"
ON public.influencers FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Anyone authorized can insert influencers" ON public.influencers;
CREATE POLICY "Anyone authorized can insert influencers"
ON public.influencers FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone authorized can update influencers" ON public.influencers;
CREATE POLICY "Anyone authorized can update influencers"
ON public.influencers FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Anyone authorized can delete influencers" ON public.influencers;
CREATE POLICY "Anyone authorized can delete influencers"
ON public.influencers FOR DELETE
USING (true);

-- 8. Grant Permissions to anon & authenticated roles
GRANT ALL ON public.contact_submissions TO anon, authenticated, service_role;
GRANT ALL ON public.creator_applications TO anon, authenticated, service_role;
GRANT ALL ON public.influencers TO anon, authenticated, service_role;

-- 9. Seed Existing Roster Creators (Ensures immediate database population)
INSERT INTO public.influencers (
    slug, name, location, audience_size, engagement_rate, bio, short_bio,
    niche, platforms, image_url, cover_image_url, featured, status,
    instagram_handle, instagram_followers, cloudinary_public_id
)
VALUES
(
    'najim-pathan',
    'Najim Pathan',
    'Indore, India',
    '1M',
    'High Engagement',
    'Newly represented creator with exceptional audience engagement.',
    'Najim Pathan across platforms.',
    ARRAY['Entertainment', 'Fashion'],
    ARRAY['Instagram', 'YouTube'],
    'https://res.cloudinary.com/nssbycq1/image/upload/v1792376694/talenthaus/creators/nsg1jedw2ukkofiwfvvg.jpg',
    '/images/roster/placeholder-cover.jpg',
    TRUE,
    'published',
    'najo10no_',
    '1M',
    'talenthaus/creators/nsg1jedw2ukkofiwfvvg'
),
(
    'rishi-agrawal',
    'Rishi Agrawal',
    'India',
    'Verified Roster',
    'High Engagement',
    'Rishi Agrawal is exclusively represented by TalentHaus for talent management, brand sponsorships, and commercial partnerships. Known for high-engagement digital storytelling and authentic community resonance.',
    'TalentHaus represented creator · Lifestyle & Entertainment.',
    ARRAY['Entertainment', 'Fashion', 'Lifestyle'],
    ARRAY['Instagram'],
    'https://res.cloudinary.com/nssbycq1/image/upload/v1792335379/talenthaus/creators/rp1kdc7fqpow1wurnyzb.jpg',
    'https://res.cloudinary.com/nssbycq1/image/upload/v1792335851/talenthaus/creators/sbuk4t2xswwgougralor.jpg',
    TRUE,
    'published',
    'rishiagrawalofficial',
    '850K',
    'talenthaus/creators/rp1kdc7fqpow1wurnyzb'
),
(
    'ayuxiety',
    'Ayuxiety',
    'Indore, India',
    '250K',
    '7.2%',
    'Leading digital artist and lifestyle storyteller shaping Gen-Z aesthetic culture.',
    'Gen-Z aesthetic curation, digital culture & brand visual narrative.',
    ARRAY['Digital Culture', 'Lifestyle'],
    ARRAY['Instagram', 'YouTube'],
    'https://res.cloudinary.com/nssbycq1/image/upload/v1792335379/talenthaus/creators/rp1kdc7fqpow1wurnyzb.jpg',
    '/images/roster/placeholder-cover.jpg',
    TRUE,
    'published',
    'ayuxiety',
    '250K',
    ''
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    location = EXCLUDED.location,
    audience_size = EXCLUDED.audience_size,
    engagement_rate = EXCLUDED.engagement_rate,
    bio = EXCLUDED.bio,
    short_bio = EXCLUDED.short_bio,
    niche = EXCLUDED.niche,
    platforms = EXCLUDED.platforms,
    image_url = EXCLUDED.image_url,
    cover_image_url = EXCLUDED.cover_image_url,
    featured = EXCLUDED.featured,
    status = EXCLUDED.status,
    instagram_handle = EXCLUDED.instagram_handle,
    instagram_followers = EXCLUDED.instagram_followers,
    cloudinary_public_id = EXCLUDED.cloudinary_public_id,
    updated_at = NOW();
