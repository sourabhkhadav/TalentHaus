-- TALENTHAUS — SAFE MIGRATION: REMOVE CREATOR APPLICATION FILE ATTACHMENT COLUMNS
-- Project: khlbuvsrheafalmgsovs
--
-- This migration removes unused file attachment columns from creator_applications
-- to minimize Supabase Storage usage and eliminate multipart file dependencies.
--
-- IMPORTANT:
-- - Existing application records are preserved (NO DATA LOSS).
-- - Storage bucket and existing objects are NOT automatically deleted to prevent accidental loss.
-- - Upload policies for public attachments are removed to prevent unauthorized storage usage.

-- 1. Safely drop attachment-specific columns from public.creator_applications
ALTER TABLE IF EXISTS public.creator_applications
    DROP COLUMN IF EXISTS media_kit_name,
    DROP COLUMN IF EXISTS file_path,
    DROP COLUMN IF EXISTS file_size,
    DROP COLUMN IF EXISTS file_type;

-- 2. Drop the attachment upload and read storage policies on storage.objects
DROP POLICY IF EXISTS "Anyone can upload application files" ON storage.objects;
DROP POLICY IF EXISTS "Founders can view application files" ON storage.objects;
