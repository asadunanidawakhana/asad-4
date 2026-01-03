-- 1. Ensure Blogs Table exists and has correct columns
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  author_id uuid REFERENCES public.profiles(id) NOT NULL,
  image text,
  is_published boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Public Read (only published)
DROP POLICY IF EXISTS "Public Read Blogs" ON blogs;
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (is_published = true);

-- Admin Read (all)
DROP POLICY IF EXISTS "Admins Read All Blogs" ON blogs;
CREATE POLICY "Admins Read All Blogs" ON blogs FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin Create
DROP POLICY IF EXISTS "Admins Create Blogs" ON blogs;
CREATE POLICY "Admins Create Blogs" ON blogs FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin Update
DROP POLICY IF EXISTS "Admins Update Blogs" ON blogs;
CREATE POLICY "Admins Update Blogs" ON blogs FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin Delete
DROP POLICY IF EXISTS "Admins Delete Blogs" ON blogs;
CREATE POLICY "Admins Delete Blogs" ON blogs FOR DELETE
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Storage for Blog Images (using 'images' bucket, folder 'blogs/')
-- Ensure 'images' bucket exists (it should from previous steps)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow Admins to upload to 'images' bucket
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Allow Admins to update/delete images
CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
