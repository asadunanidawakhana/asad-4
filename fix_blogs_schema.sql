-- 1. Add missing columns to existing 'blogs' table
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS excerpt text;

-- 2. Fix author_id FK to point to profiles instead of auth.users
ALTER TABLE blogs 
DROP CONSTRAINT IF EXISTS blogs_author_id_fkey;

ALTER TABLE blogs 
ADD CONSTRAINT blogs_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id);

-- 3. Re-enable RLS (Safe to run again)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- 4. Re-apply Policies (Drop first to avoid errors if they exist)

-- Public Read
DROP POLICY IF EXISTS "Public Read Blogs" ON blogs;
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (is_published = true);

-- Admin Read
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

-- 5. Storage Policies (Ensure 'images' bucket)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
